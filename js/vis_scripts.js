//var pressedKeys = {};
/*global window, $, vis */
window.pressedKeys = {};

$(document.body).keydown(function (evt) {
    // Function-level strict mode syntax
    'use strict';

    evt = evt || event; // to deal with IE

    window.pressedKeys[evt.keyCode] = evt.type === 'keydown';

    // Shift + Enter to delete last row or Enter for new row
    if (window.pressedKeys[13]) {
        if (window.pressedKeys[16]) {
            deleteLastDataRowFromID('inputTable');
        } else {
            addRowRedraw('inputTable');
        }
    }
});


$(document.body).keyup(function (evt) {
    // Function-level strict mode syntax
    'use strict';

    evt = evt || event; // to deal with IE

    window.pressedKeys[evt.keyCode] = evt.type === 'keydown';
});


function countBodyRows(tableBody) {
    // Function-level strict mode syntax
    'use strict';

    let tableRows = tableBody.children('tr');

    return tableRows.length;
}


function makeConnectorMenu() {
    // Function-level strict mode syntax
    'use strict';

    let arr = [
        {val: '', text: 'Simple'},
        {val: 'RCA<>RCA', text: 'RCA<>RCA'},
        {val: 'RCA<>TRS', text: 'RCA<>TRS'},
        {val: 'RCA<>XLR', text: 'RCA<>XLR'},
        {val: 'TRS<>TRS', text: 'TRS<>TRS'},
        {val: 'TRS<>RCA', text: 'TRS<>RCA'},
        {val: 'TRS<>XLR', text: 'TRS<>XLR'},
        {val: 'XLR<>XLR', text: 'XLR<>XLR'},
        {val: 'XLR<>RCA', text: 'XLR<>RCA'},
        {val: 'XLR<>TRS', text: 'XLR<>TRS'}
        //{val : 3, text: 'spare<>spare'},
        //{val : 3, text: 'Wireless'},
    ];

    let sel = $('<select>');

    $(arr).each(function () {
        sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    return sel;
}


function makeSourceBox(value) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    let element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("name", "Test Name");
    element.setAttribute("size", "7");
    element.setAttribute("id", "id_src_1");
    element.setAttribute("placeholder", "source");
    //element.setAttribute("style", "height: 10%");
    element.setAttribute("style", "padding: 0.4rem 0.4rem");

    if (value) {
        element.setAttribute("value", value);
    } else {
        element.setAttribute("value", "");
    }

    return $(element);
}


function makeDestinationBox(value) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    let element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("name", "Test Name");
    element.setAttribute("size", "7");
    element.setAttribute("id", "id_dst_1");
    element.setAttribute("placeholder", "destination");
    //element.setAttribute("style", "height: 10%");
    element.setAttribute("style", "padding: 0.4rem 0.4rem");

    if (value) {
        element.setAttribute("value", value);
    } else {
        element.setAttribute("value", "");
    }

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
    element.setAttribute("style", "padding: 8px 8px");


    let jqe = $(element);

    jqe.click(
        function () {
            $(this).closest('tr').remove();
            return false;
        }
    );

    return jqe;
}


function addRow(tableBody, source_val=null, dest_val=null) {

    //let currentRows = countBodyRows(tableBody);

    // Insert a row at the end of the table
    let newRow = tableBody[0].insertRow(tableBody[0].rows.length);

    // Insert a cell in the row at index 0
    let srcCell = newRow.insertCell(0);
    makeSourceBox(source_val).appendTo(srcCell);

    let conCell = newRow.insertCell(1);
    makeConnectorMenu().appendTo(conCell);

    let dstCell = newRow.insertCell(2);
    makeDestinationBox(dest_val).appendTo(dstCell);

    let deleteCell = newRow.insertCell(3);
    makeDeleteButton().appendTo(deleteCell);

    return tableBody;
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


function rowIsValid(rowObj) {
    // Function-level strict mode syntax
    'use strict';

    let tableTextBoxes = rowObj.find('input[type=text]');
    let numberOfValidInputs = 0;

    // ToDo Check for valid selection option as well

    $.each(tableTextBoxes, function (ignore, value) {
        if ($(value).val().length) {
            numberOfValidInputs += 1;
        }
    });

    if (numberOfValidInputs === 2) {
        return true;
    } else {
        return false;
    }
}


function countValidRows(tableObj) {
    /* Count the number of valid table rows (rows with a source and destination)*/

    // Function-level strict mode syntax
    'use strict';

    let tableBody = tableObj.children('tbody').first();
    let tableRows = tableBody.children('tr');
    let numberOfValidRows = 0;

    $.each(tableRows, function (ignore, value) {

        if (rowIsValid($(value))) {
            numberOfValidRows += 1;
        }
    });

    return numberOfValidRows;
}


function addNodeFromCell(tdObject, nodeArray) {
    // This is messy but testable.
    // Pass in a <td></td> and an array of nodes,
    // get back the id of any nodes added or the id
    // of the matching node if it was already in nodeArray

    // Function-level strict mode syntax
    'use strict';

    let id = null;
    let input = tdObject.children('input').first();

    // do we have a node for this already?
    nodeArray.some(function (element) {
        if (element.label === input.val()) {
            id = element.id;
            return true;
        }
    });

    if (!id) {
        let max_idx = 0;

        nodeArray.forEach(function (element) {
            if (element.id > max_idx) {
                max_idx = element.id;
            }
        });

        id = max_idx + 1;
        nodeArray.push({id: id,
                        label: input.val(),
                        shape: "box"});
    }

    return id;
}


function graphFromTable(tableObj) {
    // Function-level strict mode syntax
    'use strict';

    let tableBody = tableObj.children('tbody').first();
    let tableRows = tableBody.children('tr');

    let nodes = [];
    let edges = [];

    $.each(tableRows, function (ignore, value) {
        let tableRow = $(value);
        if (rowIsValid(tableRow)) {
            // get source label
            let src_td = tableRow.children('td').eq(0);

            // if source label is not in nodes, add it
            let src_id = addNodeFromCell(src_td, nodes);

            // get dest label
            let dst_td = tableRow.children('td').eq(2);

            // if dest label is not in nodes, add it
            let dst_id = addNodeFromCell(dst_td, nodes);

            // find label from drop-down
            let conn_td = tableRow.children('td').eq(1);
            let conn_label = conn_td.children('select').first().val();
            console.log(conn_label);
            // add edge
            edges.push({from: src_id,
                        to: dst_id,
                        arrows: 'to',
                        label: conn_label});
        }
    });

    let data = {
        nodes: nodes,
        edges: edges
    };

    return data;
}


function redraw(drawingArea, tableObj) {
    // Function-level strict mode syntax
    'use strict';

    let graph = graphFromTable(tableObj);

    let vis_nodes = new vis.DataSet(graph.nodes);
    let vis_edges = new vis.DataSet(graph.edges);
    let vis_container = drawingArea[0];
    let vis_options = {physics: false,
                       width: '100%',
                       height: '500px',
                       nodes: {
                           font: {size: 50,
                                  face: 'Patrick Hand SC, arial'}
                           //https://fonts.googleapis.com/css?family=Neucha|Patrick+Hand+SC
                           },
                       edges: {
                           length: 100
                           },
                       // ,nodes: {shadow: true},
                       // edges: {shadow: true}
                       layout: {
                           hierarchical: true
                           }
                       };

    let vis_data = {nodes: vis_nodes,
                    edges: vis_edges};

    // draw the thing
    new vis.Network(vis_container, vis_data, vis_options);
}


/* Add a source-connector-destination row at the end of the table */
function addRowRedraw(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    let tableObj = $("#" + sourceTableID);

    let tableBody = tableObj.children('tbody').first();

    addRow(tableBody);

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, tableObj);
}


function deleteRowFromID(tableID, idx) {
    // Function-level strict mode syntax
    'use strict';

    let theTable = $("#" + tableID);

    let tableBody = theTable.children('tbody').first();

    tableBody.children('tr').eq(idx).remove();

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, theTable);
}

function addSampleData(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    let tableObj = $("#" + sourceTableID);

    let tableBody = tableObj.children('tbody').first();

    addRow(tableBody, 'phone', 'amp');
    addRow(tableBody, 'amp', 'speakers');

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, tableObj);
}
