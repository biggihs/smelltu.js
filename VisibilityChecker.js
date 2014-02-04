function posY(elm) {
    var test = elm, top = 0;

    while(!!test && test.tagName.toLowerCase() !== "body") {
	top += test.offsetTop;
	test = test.offsetParent;
    }

    return top;
}

function viewPortHeight() {
    var de = parent.document.documentElement;

    if(!!parent.window.innerWidth)
    { return parent.window.innerHeight; }
    else if( de && !isNaN(de.clientHeight) )
    { return de.clientHeight; }

    return 0;
}

function scrollY() {
    if( parent.window.pageYOffset ) { return parent.window.pageYOffset; }
    return Math.max(parent.document.documentElement.scrollTop, parent.document.body.scrollTop);
}

function checkvisible( elm ) {
    var vpH = viewPortHeight(), // Viewport Height
	       st = scrollY(), // Scroll Top
        	y = posY(elm);

    return (y < (vpH + st));
}

function check_is_visible(){
    if(checkvisible(window.frameElement))
        return true;
    else
        return false;
}
