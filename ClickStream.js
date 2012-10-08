/*
	Author: Arnar Yngvason
	Company: Hvíta Húsið

	Requirements:
		jQuery

	Usage example:
		var click_stream = new ClickStream("XXXXX");
		click_stream.pageview();
		$(document).click(functiom() {
			click_stream.clickthrough();
		});		
*/


var _log = function(msg) {
	try {
		console.log(msg);
	}
	catch(err) {}
}

var _fire_and_forget = function(url, data) {
	var $iframe = $('<iframe>');
	var $form = $('<form>');

	$iframe.css({display: 'none'});
	
	$form.attr({
		method: 'post',
		action: url
	});

	for(key in data) {
		var $input = $('<input>').attr({
			type: 'hidden',
			name: key,
			value: data[key]
		});
		$form.append($input);
	}
	
	$form.append('<input type="submit">');

	$("body").append($iframe);
	$iframe.contents().find('body').append($form);

	$form.submit();
}

var _get_contentlength = function(url, callback) {
	$.ajax({
		type: "HEAD",
		async: true,
		url: url,
		success: function(message, text, response) {
			callback(response.getResponseHeader('Content-Length'));
		}
	});
}

var document_size = document.documentElement.innerHTML.length;
$("img, video").each(function() {
	_get_contentlength($(this).attr('src'), function(ContentLength) {
		document_size += ContentLength;
	});
});
// TODO: ClickStream.pageview should not execute before this has finished.
// Using a trigger would be good solution.

var ClickStream = function(tag) {
	this.tag = tag;
	this.hasRun = false;
	this.clickHasRegistered = false;

	this.pageview = function(options) {
		if(!this.hasRun) {
			this.hasRun = true;
			return this.track("pageview", options);
		}
	};

	this.clickthrough = function(options) {
		if(!this.clickHasRegistered) {
			this.clickHasRegistered = true;
			return this.track("clickthrough", options);
		}
	};

	this.track = function(type, options) {
		// Only log per 100th pageview:
		if(type == "pageview" && Math.floor((Math.random()*100)+1) != 1) {
			return this;
		}

		data = {
			sb: null,
			v: navigator.appVersion,
			source: parent.window.location.href,
			//referrer: parent.window.location.href,
			//referrer_title: parent.document.title,
			bytesTotal: document_size,
			height: $(window).height(),
			width: $(window).width(),
			cs: "1",
			type: type,
			url: window.location.href
		};

		for(key in options) {
			data[key] = options[key];
		}

		_fire_and_forget("http://www.smelltu.is/track/" + this.tag + "/", data);

		return self;
	};
}
