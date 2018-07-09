function addTextBox(field_id = 888) {
	//Create an input type dynamically.
	var element = document.createElement("input");
	
	//Assign different attributes to the element.
	element.setAttribute("type", "text");
	element.setAttribute("value", "");
	element.setAttribute("name", "Test Name");
	//element.setAttribute("style", "width:200px");
	element.setAttribute("id", "text" + field_id);
	
	//Create Labels
	var label = document.createElement("label");
	label.innerHTML = "New Label";     
	//label.setAttribute("style", "font-weight:normal");
	label.setAttribute("for", "text" + field_id);
	
	// 'foobar' is the div id, where new fields are to be added
	var foo = document.getElementById("input_text_div");

	//Append the element in page (in span).
	foo.appendChild(label);
	foo.appendChild(element);
}


function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}