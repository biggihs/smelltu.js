/*
    Author: Arnar Yngvason
    Company: Hvíta Húsið

    Requirements:
        jQuery

    Usage example:
        <script type="text/javascript">
            $(document).ready(function() {
                var click_stream = new ClickStream(
                    'Test Banner 16.10.2012', // Good practice is to use publish date.
                    'f2cb4ee2d05fc7762b17cc3beee294fffe544275'
                );
                
                click_stream.pageview();
                
                $(document).click(function() {
                    click_stream.clickthrough();
                });
            });
        </script>
*/

(function($, undefined) {
    function ClickStream(name, code) {
        if(typeof name === undefined || typeof code === undefined) {
            throw "ClickStream() takes 2 arguments: name, code";
        }
        
        this._name = encodeURIComponent(name);
        this._code = code;

        this.hasRun = false;
        this.clickHasRegistered = false;
        this.bannerOnScreenDetected = false;

        return this;
    }

    ClickStream.fire_and_forget = function(url, data) {
        var $iframe = $('<iframe/>');
        var $form = $('<form/>');

        $iframe.css({display: 'none'});
        
        $form.attr({
            method: 'post',
            action: url
        });

        for(var key in data) {
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

        return this;
    };

    ClickStream.prototype.onscreenpageview = function(options){
      if(!this.bannerOnScreenDetected){
        if(check_is_visible()){
          this.bannerOnScreenDetected = true;
          this.track("onscreenpageview",options);
        }
        else{
          setTimeout("click_stream.onscreenpageview("+options.toSource()+");",5000);
        }
      }
      return this;
    };

    ClickStream.prototype.pageview = function(options) {
        if(!this.hasRun) {
            this.hasRun = true;
            return this.track("pageview", options);
        }
        return this;
    };

    ClickStream.prototype.clickthrough = function(options) {
        if(!this.clickHasRegistered) {
            this.clickHasRegistered = true;
            return this.track("clickthrough", options);
        }
        return this;
    };

    ClickStream.prototype.track = function(type, options) {
        var data = {
            name: this._name,
            host: window.location.host,
            pr: 10,
            cs: 2,
            type: type
        };

        for(var key in options) {
            data[key] = options[key];
        }

        // Only log per pr pageview:
        if(type === "pageview" && Math.floor((Math.random() * data.pr)) !== 0) {
            return this;
        }

        if(type === "onscreenpageview" && Math.floor((Math.random() * data.pr)) !== 0) 
            return this;

        ClickStream.fire_and_forget("http://www.smelltu.is/track/" + this._code + "/", data);

        return this;
    };

    window.ClickStream = ClickStream;
})(jQuery);