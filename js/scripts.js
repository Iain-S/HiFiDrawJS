/* Things to do once the page has loaded */
// $(document).ready(function () {
//     // Function-level strict mode syntax
//     'use strict';
//     //$('#'+'jquery_test').html('testing')
//     console.log("does this override the other doc.ready?");
//     // Add a first row to the table
//     //addRowRedraw($('#inputTable'))
//     addRowRedraw('inputTable');
// });
// $(document).keypress( function(event) {
//   if (event.which === 13) {
//     // console.log("ENTER key pressed!!");
//     addRowRedraw('inputTable');
//   }
// });


function scripts_squared(a_number) {
    // Function-level strict mode syntax
    'use strict';
    return a_number * a_number;
}


var pressedKeys = {};

$(document.body).keydown(function (evt) {
    evt = evt || event; // to deal with IE

    pressedKeys[evt.keyCode] = evt.type == 'keydown';

    if (pressedKeys[13]) {
        if(pressedKeys[16]) {
            deleteLastDataRowFromID('inputTable');
        }
        else {
            addRowRedraw('inputTable');
        }
    }
});


$(document.body).keyup(function (evt) {
    evt = evt || event; // to deal with IE

    pressedKeys[evt.keyCode] = evt.type == 'keydown';
});


function countBodyRows(tableBody) {
    let tableRows = tableBody.children('tr');

    return tableRows.length;
}


function makeSourceBox() {
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

    return $(element);
}


function makeConnectorMenu() {
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
        //{val : 3, text: 'spare<>spare'},
        //{val : 3, text: 'Wireless'},
    ];

    let sel = $('<select>');

    $(arr).each(function () {
        sel.append($("<option>").attr('value',this.val).text(this.text));
    });
    return sel;
}


function makeDestinationBox() {
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

    return $(element);
}


function makeDeleteButton() {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    let element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", "Delete");

    let jqe = $(element);

    jqe.click(
        function() {
            $(this).closest('tr').remove ();
            return false;
        }
    );

    return jqe;
}


/* Given a table of connections, return an SVG representation */
function drawDiagram(tableRef) {
    'use strict';

    let tableRows = tableRef.children('tr');
    let tableTextBoxes = tableRows.find('input[type=text]');

    let svg_html = "<svg width=\"400\" height=\"110\">\n";

    // Add a rect for each valid row (one with a source and destination)
    $.each(tableTextBoxes, function (index, value) {
        if ($(value).val().length) {
            console.log(index + ": " + $(value).val());
            svg_html += "  <rect width=\"300\" height=\"100\" style=\"fill:rgb(0,0,255);stroke-width:3px;stroke:rgb(0,0,0)\" />\n";
        }
    });

    // Add one path for now (regardless of how many rectangles we have)
    if (tableTextBoxes.length > 2) {
        svg_html += "<path d=''></path>";
    }

    svg_html += "</svg>";

    return $(svg_html);
}


/* Generate a string which flowchart js can parse. */
function generateFlowchartInput(tableObj) {
    let tableRows = tableObj.children('tr');
    let tableTextBoxes = tableRows.find('input[type=text]');
    let numberOfValidRows = 0

    // Add a rect for each valid row (one with a source and destination)
    $.each(tableTextBoxes, function (index, value) {
        if ($(value).val().length) {
            numberOfValidRows ++;
        }
    });

    if (numberOfValidRows === 0) {
        // This causes a "TypeError: s is null" but doesn't ruin anything
        return '';
    } else {
        return 'op1=>operation: My Operation\n' +
               'op2=>operation: My Operation\n' +
               'op1->op2';
    }
}


function addRow(tableBody){

    //let currentRows = countBodyRows(tableBody);

    // Insert a row at the end of the table
    let newRow = tableBody[0].insertRow(tableBody[0].rows.length);

    // Insert a cell in the row at index 0
    let srcCell = newRow.insertCell(0);
    makeSourceBox().appendTo(srcCell);

    let conCell = newRow.insertCell(1);
    makeConnectorMenu().appendTo(conCell);

    let dstCell = newRow.insertCell(2);
    makeDestinationBox().appendTo(dstCell);

    let deleteCell = newRow.insertCell(3);
    makeDeleteButton().appendTo(deleteCell);

    return tableBody;
}


function redraw(drawingArea, tableBody) {
    // Function-level strict mode syntax
    'use strict';

    drawingArea.empty();

    let diagramVar = flowchart.parse(generateFlowchartInput(tableBody));

    try {
        diagramVar.drawSVG('drawing_div');
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw e;
        }
    }
}


/* Add a source-connector-destination row at the end of the table */
function addRowRedraw(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    let tableObj = $("#" + sourceTableID);

    let tableBody = tableObj.children('tbody').first();

    addRow(tableBody);

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, tableBody);
}


function deleteRowFromID(tableID, idx) {
    let theTable = $("#"+tableID);

    let tableBody = theTable.children('tbody').first();

    tableBody.children('tr').eq(idx).remove();

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, tableBody);
}


function deleteLastDataRowFromID(tableID, idx) {
    /* This is a safe delete function, it will always leave the
    *  headers and the add button. */
    let theTable = $("#" + tableID);

    let tableBody = theTable.children('tbody').first();

    if (tableBody.find('tr').length > 2) {
        deleteRowFromID(tableID, tableBody.children('tr').length - 1);
    }

    return;
}


/* Get query parameters from the URL
   e.g. www.my-site.com?something=a_thing&what=why
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
