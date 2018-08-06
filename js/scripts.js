/* Things to do once the page has loaded */
// $(document).ready(function () {
//     // Function-level strict mode syntax
//     'use strict';
//     //$('#'+'jquery_test').html('testing')
//     console.log("does this override the other doc.ready?");
//     // Add a first row to the table
//     //addRow($('#inputTable'))
//     addRow('inputTable');
// });


function scripts_squared(a_number) {
    // Function-level strict mode syntax
    'use strict';
    return a_number * a_number;
}


/* Add a text box to the element passed in as addTextBoxTo */
function addTextBox(addTextBoxTo) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    let element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "Test Name");
    //element.setAttribute("style", "width:200px");
    element.setAttribute("id", "id_src_1");
    element.setAttribute("placeholder", "source name");

    addTextBoxTo.appendChild(element);
}


/* Add a normal dropdown menu to the element passed in using jquery */
function addConnectorMenu3(addDropdownTo) {
    // Function-level strict mode syntax
    'use strict';

    let arr = [
        {val: 1, text: 'Generic'},
        {val: 2, text: 'RCA<>RCA'},
        {val: 3, text: 'RCA<>TRS'},
        {val: 4, text: 'RCA<>XLR'},
        {val: 5, text: 'TRS<>TRS'},
        {val: 6, text: 'TRS<>RCA'},
        {val: 7, text: 'TRS<>XLR'},
        {val: 8, text: 'XLR<>XLR'},
        {val: 9, text: 'XLR<>RCA'},
        {val: 10, text: 'XLR<>TRS'}
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'Wireless'},
    ];

    let sel = $('<select>');

    $(arr).each(function () {
        sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    sel.appendTo(addDropdownTo);
}


/* Add a text box to the element passed in */
function addDestinationBox(addTextBoxTo) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    let element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "Test Name");
    //element.setAttribute("style", "width:200px");
    element.setAttribute("id", "id_dst_1");
    element.setAttribute("placeholder", "destination name");

    addTextBoxTo.appendChild(element);
}


function drawDiagram(tableRef) {
    'use strict';

    let tableRows = tableRef.children('tr');
    let tableTextBoxes = tableRows.find('input[type=text]');

    let svg_html = "<svg width=\"400\" height=\"110\">\n";

    // Add a rect for each valid row (one with a source and destination)
    $.each(tableTextBoxes, function (index, value) {
        if ($(value).val().length) {
            console.log(index + ": " + $(value).val());
            svg_html += "  <rect width=\"300\" height=\"100\" style=\"fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)\" />\n";
        }
    });

    // Add one path for now (regardless of how many rectangles we have)
    if (tableTextBoxes.length > 2) {
        svg_html += "<path></path>";
    }

    svg_html += "</svg>";

    return $(svg_html);
}


/* Add a source-connector-destination row at the end of the table*/
function addRow(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    let tableRef = $("#" + sourceTableID).children('tbody').first();
    //let tableRef = $("#"+sourceTableID + " > tbody");

    // Insert a row at the end of the table
    let newRow = tableRef[0].insertRow(tableRef[0].rows.length);

    // Insert a row at the beginning of the table
    //let newRow = tableRef.insertRow(0);

    // Insert a cell in the row at index 0
    let srcCell = newRow.insertCell(0);
    addTextBox(srcCell);

    let conCell = newRow.insertCell(1);
    addConnectorMenu3(conCell);

    let dstCell = newRow.insertCell(2);
    addDestinationBox(dstCell);

    // Redraw the diagram each call
    let connectionDiagram = drawDiagram(tableRef);

    // let drawingArea = document.getElementById('drawing_span');
    let drawingArea = $('#drawing_span');

    drawingArea.empty();

    connectionDiagram.appendTo(drawingArea);
    //drawingArea.appendChild(connectionDiagram)
}


/* Get query parameters from the URL
   e.g. www.mysite.com?something=a_thing&what=why
        will return a dict with something and what as keys */
function getQueryParams(qs) {
    // Function-level strict mode syntax
    'use strict';

    qs = qs.split('+').join(' ');

    let params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    do {
        tokens = re.exec(qs);
        if (tokens) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        } else {
            break;
        }
    } while (true);

    return params;
}