var pressedKeys = {};

$(document.body).keydown(function (evt) {
    // Function-level strict mode syntax
    'use strict';

    evt = evt || event; // to deal with IE

    pressedKeys[evt.keyCode] = evt.type == 'keydown';

    // Shift + Enter to delete last row or Enter for new row
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
    // Function-level strict mode syntax
    'use strict';

    evt = evt || event; // to deal with IE

    pressedKeys[evt.keyCode] = evt.type == 'keydown';
});


function countBodyRows(tableBody) {
    // Function-level strict mode syntax
    'use strict';

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
        {val: 'Generic', text: 'Generic'},
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
    // Function-level strict mode syntax
    'use strict';

    let tableRows = tableObj.children('tr');
    let tableTextBoxes = tableRows.find('input[type=text]');
    let numberOfValidRows = 0;

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
    // Function-level strict mode syntax
    'use strict';

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

    $.each(tableTextBoxes, function (index, value) {
        if ($(value).val().length) {
            numberOfValidInputs ++;
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

    $.each(tableRows, function (index, value) {

        if (rowIsValid($(value))) {
            numberOfValidRows ++;
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
    nodeArray.some(function(element, index) {
        if (element.label == input.val()) {
            id = element.id;
            return true;
        }
    });

    if (!id) {
        let max_idx = 0;

        nodeArray.forEach(function(element, index) {
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

    $.each(tableRows, function (index, value) {
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
    let vis_options = {physics:false
                       // ,nodes: {shadow: true},
                       // edges: {shadow: true}
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

    let theTable = $("#"+tableID);

    let tableBody = theTable.children('tbody').first();

    tableBody.children('tr').eq(idx).remove();

    let drawingArea = $('#drawing_div');

    redraw(drawingArea, theTable);
}
