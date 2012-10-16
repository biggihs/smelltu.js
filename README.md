smelltu.js
==========

Javascript fyrir smelltu.is

####Requirements:

* jQuery

####Usage:

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