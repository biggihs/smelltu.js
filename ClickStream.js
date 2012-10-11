/*
	Author: Arnar Yngvason
	Company: Hvíta Húsið

	Requirements:
		jQuery
		murmurhash3_gc.js (https://github.com/garycourt/murmurhash-js/)

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

var ClickStream = function(code) {
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
		data = {
			source: window.location.href,
			bytesTotal: murmurhash3_32_gc(document.documentElement.innerHTML), // Not actual byteTotal but provides a unique document version hash.
			pr: 10,
			cs: 2,
			type: type
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
