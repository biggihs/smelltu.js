smelltu.js
==========

Javascript fyrir smelltu.is

####Requirements:

* jQuery

* `onscreenpageview` requires the banner to be hosted on the same page as the parent.

* `onscreenpageview` requires the click_stream variable to be global
  (don't use `var`).


####Usage:
```html
	<script type="text/javascript">
		$(document).ready(function() {
			click_stream = new ClickStream(
				'Test Banner 16.10.2012', // Good practice is to use publish date.
				'f2cb4ee2d05fc7762b17cc3beee294fffe544275'
			);

			options	= {p:10}
			click_stream.pageview(options);
			click_stream.onscreenpageview(options);
			
			$(document).click(function() {
				click_stream.clickthrough();
			});
		});
	</script>
```
