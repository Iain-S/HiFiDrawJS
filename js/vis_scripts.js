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
        return 'para1=>parallel: p1\n' +
               'para2=>parallel: p2\n' +
               'para1(path1,)->para2\n';
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

    // let drawingArea = $('#drawing_div');

    // redraw(drawingArea, tableBody);
}


function deleteRowFromID(tableID, idx) {
    // Function-level strict mode syntax
    'use strict';

    let theTable = $("#"+tableID);

    let tableBody = theTable.children('tbody').first();

    tableBody.children('tr').eq(idx).remove();

    // let drawingArea = $('#drawing_div');

    // redraw(drawingArea, tableBody);
}


function deleteLastDataRowFromID(tableID) {
    /* This is a safe delete function, it will always leave the
    *  headers and the add button. */

    // Function-level strict mode syntax
    'use strict';

    let theTable = $("#" + tableID);

    let tableBody = theTable.children('tbody').first();

    if (tableBody.find('tr').length > 2) {
        deleteRowFromID(tableID, tableBody.children('tr').length - 1);
    }

    return;
}


function countValidRows(tableObj) {
    /* Count the number of valid table rows (rows with a source and destination)*/

    // Function-level strict mode syntax
    'use strict';

    let tableBody = tableObj.children('tbody').first();
    let tableRows = tableBody.children('tr');
    let numberOfValidRows = 0;

    $.each(tableRows, function (index, value) {

        let tableTextBoxes = $(value).find('input[type=text]');
        let numberOfValidInputs = 0;

        $.each(tableTextBoxes, function (index, value) {
            if ($(value).val().length) {
                numberOfValidInputs ++;
            }
        });

        if (numberOfValidInputs === 2) {
            numberOfValidRows ++;
        }
    });

    return numberOfValidRows;
}


function graphFromTable(tableObj) {
    // Function-level strict mode syntax
    'use strict';

    return;
}
