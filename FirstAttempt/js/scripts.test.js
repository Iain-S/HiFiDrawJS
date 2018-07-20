/* Things to do once the page has loaded */
$(document).ready(function() {
    var a = scripts_squared(4);
	if (a != 16) {
	    console.log("failed");
	} else {
	    console.log("passed");
	}
});