//var pressedKeys = {};
/*global window, $, vis, document, event, console */
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

    const tableRows = tableBody.children('tr');

    return tableRows.length;
}


function makeConnectorMenu(value, id) {
    // Function-level strict mode syntax
    'use strict';

    const arr = [
        {val: '', text: 'Simple'},
        {val: 'RCA<>RCA', text: 'RCA<>RCA'},
        {val: 'RCA<>TRS', text: 'RCA<>TRS'},
        {val: 'RCA<>XLR', text: 'RCA<>XLR'},
        {val: 'TRS<>TRS', text: 'TRS<>TRS'},
        {val: 'TRS<>RCA', text: 'TRS<>RCA'},
        {val: 'TRS<>XLR', text: 'TRS<>XLR'},
        {val: 'XLR<>XLR', text: 'XLR<>XLR'},
        {val: 'XLR<>RCA', text: 'XLR<>RCA'},
        {val: 'XLR<>TRS', text: 'XLR<>TRS'},
        {val: 'speaker cable', text: 'speaker cable'},
        {val: 'headphone cable', text: 'headphone cable'}
        //{val : 3, text: 'spare<>spare'},
        //{val : 3, text: 'Wireless'},
    ];

    const sel = $('<select>');

    $(arr).each(function () {
        sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    sel.val(value);

    if (id !== undefined) {
        sel.attr("id", "id_conn_" + id.toString());
    }

    return sel;
}


function makeSourceBox(value, id) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("name", "Test Name");
    element.setAttribute("size", "7");
    element.setAttribute("placeholder", "source");
    element.setAttribute("autocapitalize", 'none');
    element.setAttribute("style", "padding: 0.4rem 0.4rem");

    if (value) {
        element.setAttribute("value", value);
    }

    if (id !== undefined) {
        element.setAttribute("id", "id_dst_" + id.toString());
    }

    return $(element);
}


function makeDestinationBox(value, id) {
    // Function-level strict mode syntax
    'use strict';
    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("name", "Test Name");
    element.setAttribute("size", "7");
    element.setAttribute("placeholder", "destination");
    element.setAttribute("autocapitalize", 'none');
    element.setAttribute("style", "padding: 0.4rem 0.4rem");

    if (value) {
        element.setAttribute("value", value);
    }

    if (id !== undefined) {
        element.setAttribute("id", "id_dst_" + id.toString());
    }

    return $(element);
}


function makeDeleteButton() {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", "Delete");
    element.setAttribute("style", "padding: 8px 8px");

    let jqe = $(element);

    jqe.click(
        function () {
            const theTable = $(this).closest('table');
            const drawingArea = $('#drawing_div');

            $(this).closest('tr').remove();

            redraw(drawingArea, theTable);

            return false;
        }
    );

    return jqe;
}


function addRow(tableBody, source_val = null, dest_val = null, conn_val = null) {

    //let currentRows = countBodyRows(tableBody);

    // Insert a row at the end of the table
    let newRow = tableBody[0].insertRow(tableBody[0].rows.length);

    // Insert a cell in the row at index 0
    let srcCell = newRow.insertCell(0);
    let srcBox = makeSourceBox(source_val);
    srcBox.appendTo(srcCell);
    srcBox.focus();

    let conCell = newRow.insertCell(1);
    makeConnectorMenu(conn_val).appendTo(conCell);

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

    if (tableBody.find('tr').length > 1) {
        deleteRowFromID(tableID, tableBody.children('tr').length - 1);
    }
}


function rowIsValid(rowObj) {
    // Function-level strict mode syntax
    'use strict';

    const tableTextBoxes = rowObj.find('input[type=text]');
    let numberOfValidInputs = 0;

    // ToDo Check for valid selection option as well

    $.each(tableTextBoxes, function (ignore, value) {
        if ($(value).val().length) {
            numberOfValidInputs += 1;
        }
    });

    return numberOfValidInputs === 2;
}


function countValidRows(tableObj) {
    /* Count the number of valid table rows (rows with a source and destination)*/

    // Function-level strict mode syntax
    'use strict';

    const tableBody = tableObj.children('tbody').first();
    const tableRows = tableBody.children('tr');
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
    const input = tdObject.children('input').first();

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

    const tableBody = tableObj.children('tbody').first();
    const tableRows = tableBody.children('tr');

    let nodes = [];
    let edges = [];

    $.each(tableRows, function (ignore, value) {
        const tableRow = $(value);
        if (rowIsValid(tableRow)) {
            // get source
            const src_td = tableRow.children('td').eq(0);

            // if source is not in nodes already, add it
            const src_id = addNodeFromCell(src_td, nodes);

            // get dest
            const dst_td = tableRow.children('td').eq(2);

            // if dest is not in nodes already, add it
            const dst_id = addNodeFromCell(dst_td, nodes);

            // find label from drop-down
            const conn_td = tableRow.children('td').eq(1);
            const conn_label = conn_td.children('select').first().val();

            // add edge
            edges.push({from: src_id,
                        to: dst_id,
                        arrows: 'to',
                        label: conn_label});
        }
    });

    return {
        nodes: nodes,
        edges: edges
    };
}


function redraw(drawingArea, tableObj) {
    // Function-level strict mode syntax
    'use strict';
    // ToDo This function does too much, break it up
    const graph = graphFromTable(tableObj);

    const link_url = window.location.origin + window.location.pathname + "?serialised=" + serialiseGraph(graph);
    $('#id_export_link').text(link_url);

    const vis_nodes = new vis.DataSet(graph.nodes);
    const vis_edges = new vis.DataSet(graph.edges);
    const vis_container = drawingArea[0];
    const vis_options = {physics: false, // if false then a -> b & b -> a overlaps and labels get messy
                                       // we could give the user some warning to set one connector to simple
                       width: '100%',
                       height: '500px',
                       nodes: {
                           font: {size: 12,
                                  face: 'Patrick Hand SC, arial'}
                           //https://fonts.googleapis.com/css?family=Neucha|Patrick+Hand+SC
                       },
                       edges: {length: 100,
                               font: {size: 12,
                                      face: 'Patrick Hand SC, arial'},
                               arrowStrikethrough: false // note we may want to make the node borders a little thicker
                       },
                       layout: {
                           hierarchical: false,
                               // {direction: 'LR',
                               //  levelSeparation: 300}
                           randomSeed: 10161
                       }
                      };

    const vis_data = {nodes: vis_nodes,
                      edges: vis_edges};

    // draw the thing
    const network = new vis.Network(vis_container, vis_data, vis_options);

    network.on("afterDrawing", function (ignore) {

        const download_link = document.getElementById('id_download');
        const network_canvas = document.getElementsByTagName('canvas')[0];

        // make a new canvas so that we can add an opaque background
        const download_canvas = document.createElement("canvas");

        download_canvas.width = network_canvas.width;
        download_canvas.height = network_canvas.height;
        const download_context = download_canvas.getContext('2d');

        //create a rectangle with the desired color
        download_context.fillStyle = "#FFFFFF";
        download_context.fillRect(0, 0, network_canvas.width, network_canvas.height);

        //draw the original canvas onto the destination canvas
        download_context.drawImage(network_canvas, 0, 0);

        download_link.setAttribute('download', 'HiFiDraw.png');
        download_link.setAttribute('href', download_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));

        // In case you want to choose a different random seed
        // console.log("random seed: " + network.getSeed());
    });

    // get scale and position.  we won't reposition and will only rescale if scale is 1.0
    const current_position = network.getViewPosition();
    const current_scale = network.getScale();

    // x1 sees to be too conservative, at least in Firefox on Linux
    if (current_scale === 1) {
        network.moveTo({
            position: current_position,
            scale: 1.2
        });
    }
}


/* Add a source-connector-destination row at the end of the table */
function addRowRedraw(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    const tableObj = $("#" + sourceTableID);

    const tableBody = tableObj.children('tbody').first();

    addRow(tableBody);

    const drawingArea = $('#drawing_div');

    redraw(drawingArea, tableObj);
}


function deleteRowFromID(tableID, idx) {
    // Function-level strict mode syntax
    'use strict';

    const theTable = $("#" + tableID);

    const tableBody = theTable.children('tbody').first();

    // if the last row has focus, set the focus to the last but one destination input
    const childRows = tableBody.children('tr');
    const lastRowCells = childRows.eq(childRows.length - 1).children("td");
    const lastButOneRow = childRows.eq(childRows.length - 2);
    let lastRowHasFocus = false;

    // Note, focus is lost if the user clicks a delete button
    lastRowCells.each(function () {
        // assume each cell only has one child element
        if ($(this).children().first().is($(document.activeElement))) {
            lastRowHasFocus = true;
        }
    });

    if (lastRowHasFocus) {
        lastButOneRow.children('td').eq(2).children('input').first().focus();
    }

    tableBody.children('tr').eq(idx).remove();

    const drawingArea = $('#drawing_div');

    redraw(drawingArea, theTable);
}


function addSampleData(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    const tableObj = $("#" + sourceTableID);
    const tableBody = tableObj.children('tbody').first();

    addRow(tableBody, 'phone', 'amp', 'XLR<>XLR');
    addRow(tableBody, 'amp', 'speakers');
    addRow(tableBody);

    const drawingArea = $('#drawing_div');

    redraw(drawingArea, tableObj);
}


function removeSampleData(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';

    const tableObj = $("#" + sourceTableID);

    const tableBody = tableObj.children('tbody').first();
    tableBody.empty();

    const drawingArea = $('#drawing_div');
    redraw(drawingArea, tableObj);
}


function serialiseGraph(graphData) {
    // Function-level strict mode syntax
    'use strict';
    return JSON.stringify(graphData);
}


function deserialiseGraph(serialisedGraph) {
    // Function-level strict mode syntax
    'use strict';
    return JSON.parse(serialisedGraph);
}


/* Get query parameters from the URL
   e.g. www.my-site.com?something=a_thing&what=why
        will return a dict with something and what as keys
   You can call it like this getQueryParams(document.location.search)*/
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


function addDataFromURL(serialisedData, targetTableID) {
    // Function-level strict mode syntax
    'use strict';
    const tableBody = $("#" + targetTableID).children('tbody').first();

    const unpackedData = deserialiseGraph(serialisedData);

    // ToDo Re-write this using array.some()
    unpackedData.edges.forEach(function(edge) {
        let from_label = null;
        let to_label = null;

        // get the labels for the nodes connected by this edge
        unpackedData.nodes.forEach(function(node) {
            if (node.id === edge.from) {
                from_label = node.label;
            }

            if (node.id === edge.to) {
                to_label = node.label;
            }
        });

        if (from_label && to_label) {
            addRow(tableBody, from_label, to_label, edge.label);
        }
    });

    const drawingArea = $('#drawing_div');

    redraw(drawingArea, $("#" + targetTableID));
}


function setUpPage(sourceTableID) {
    // Function-level strict mode syntax
    'use strict';
    const query_params = getQueryParams(document.location.search);

    if (query_params.hasOwnProperty('serialised')) {
        addDataFromURL(query_params.serialised, sourceTableID);
    } else {
        // Add a first row to save the user a click
        addSampleData(sourceTableID);
    }
}


function copyToClipboard () {
    // Function-level strict mode syntax
    'use strict';
    const str = $('#id_export_link').text();
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0      // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
}
