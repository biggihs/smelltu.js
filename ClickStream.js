/*
	Author: Arnar Yngvason
	Company: Hvíta Húsið

	Requirements:
		jQuery

	Usage example:
		var click_stream = new ClickStream(
			'Test Banner 16.10.2012', // Good practice is to use publish date.
			'f2cb4ee2d05fc7762b17cc3beee294fffe544275'
		);
		
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
	var $iframe = $('<iframe/>');
	var $form = $('<form/>');

	$iframe.css({display: 'none'});
	
	$form.attr({
		method: 'post',
		action: url
	});

	for(key in data) {
		var $input = $('<input/>').attr({
			type: 'hidden',
			name: key,
			value: data[key]
		});
		$form.append($input);
	}
	
	$form.append('<input/>', {type: 'submit'});

	$("body").append($iframe);
	$iframe.contents().find('body').append($form);

	$form.submit();
}

var ClickStream = function(name, code) {
	if(!name || !code) {
		throw "ClickStream() takes 2 arguments: name, code";
	}
	
	this._name = encodeURIComponent(name);
	this._code = code;

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
		var url = window.location.href;
		
		if(url.indexOf('?') == -1) {
			url += '?name=' + this._name;
		} else {
			url += '&name=' + this._name;
		}

		data = {
			source: url,
			bytesTotal: 1, // Not used. Banners should not be automatically named.
			pr: 10,
			cs: 2,
			type: type,
			height: $(window).height(),
			width: $(window).width()
		};

		for(key in options) {
			data[key] = options[key];
		}

		// Only log per pr pageview:
		if(type == "pageview" && Math.floor((Math.random()*data.pr)) != 0) {
			return this;
		}

		_fire_and_forget("http://www.smelltu.is/track/" + this._code + "/", data);

		return self;
	};
}
