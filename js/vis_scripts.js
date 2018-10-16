/*global window, $, vis, document, event, console */
/*jslint es6 */


// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
const curry = (fn) => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};


function countBodyRows(tableBody) {
    "use strict";

    const tableRows = tableBody.children("tr");

    return tableRows.length;
}


function makeConnectorMenu(value, id) {
    "use strict";

    const arr = [
        {val: "", text: "Simple"},
        {val: "RCA<>RCA", text: "RCA<>RCA"},
        {val: "RCA<>TRS", text: "RCA<>TRS"},
        {val: "RCA<>XLR", text: "RCA<>XLR"},
        {val: "TRS<>TRS", text: "TRS<>TRS"},
        {val: "TRS<>RCA", text: "TRS<>RCA"},
        {val: "TRS<>XLR", text: "TRS<>XLR"},
        {val: "XLR<>XLR", text: "XLR<>XLR"},
        {val: "XLR<>RCA", text: "XLR<>RCA"},
        {val: "XLR<>TRS", text: "XLR<>TRS"},
        {val: "speaker cable", text: "speaker cable"},
        {val: "headphone cable", text: "headphone cable"}
        //{val : 3, text: "spare<>spare"},
        //{val : 3, text: "Wireless"},
    ];

    const sel = $("<select>");

    $(arr).each(function () {
        sel.append($("<option>").attr("value",this.val).text(this.text));
    });

    sel.val(value);

    if (id !== undefined) {
        sel.attr("id", "id_conn_" + id.toString());
    }

    return sel;
}


function makeSourceBox(value, id) {
    "use strict";

    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "source");
    element.setAttribute("autocapitalize", "none");

    if (value) {
        element.setAttribute("value", value);
    }

    if (id !== undefined) {
        element.setAttribute("id", "id_src_" + id.toString());
    }

    return $(element);
}


function makeDestinationBox(value, id) {
    "use strict";

    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "dest");
    element.setAttribute("autocapitalize", "none");

    if (value) {
        element.setAttribute("value", value);
    }

    if (id !== undefined) {
        element.setAttribute("id", "id_dst_" + id.toString());
    }

    return $(element);
}


function rowIsValid(rowObj) {
    "use strict";

    const tableTextBoxes = rowObj.find("input[type=text]");
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
    "use strict";

    const tableBody = tableObj.children("tbody").first();
    const tableRows = tableBody.children("tr");
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
    "use strict";

    let id = null;
    const input = tdObject.children("input").first();

    // do we have a node for this already?
    nodeArray.some(function (element) {
        if (element.label === input.val()) {
            id = element.label;
            return true;
        }
    });

    if (!id) {
        id = input.val();
        nodeArray.push({id: id,
                        label: input.val(),
                        shape: "box"});
    }

    return id;
}


function graphFromTable(tableObj) {
    "use strict";

    const tableBody = tableObj.children("tbody").first();
    const tableRows = tableBody.children("tr");

    const nodes = [];
    const edges = [];

    $.each(tableRows, function (ignore, value) {
        const tableRow = $(value);
        if (rowIsValid(tableRow)) {
            // get source
            const src_td = tableRow.children("td").eq(0);

            // if source is not in nodes already, add it
            const src_id = addNodeFromCell(src_td, nodes);

            // get dest
            const dst_td = tableRow.children("td").eq(2);

            // if dest is not in nodes already, add it
            const dst_id = addNodeFromCell(dst_td, nodes);

            // find label from drop-down
            const conn_td = tableRow.children("td").eq(1);
            const conn_label = conn_td.children("select").first().val();

            // add edge
            edges.push({from: src_id,
                        to: dst_id,
                        arrows: "to",
                        label: conn_label});
        }
    });

    return {
        nodes: nodes,
        edges: edges
    };
}


function getNodePositionsFromNetwork(graph, network) {
    "use strict";
    network.storePositions();
    network.body.data.nodes.forEach(function (old_node, ignore) {
       graph.nodes.forEach(function (new_node, ignore) {
           // copy the Xs and Ys of the existing graph
           if (new_node.label === old_node.label) {
               new_node.x = old_node.x;
               new_node.y = old_node.y;
           }
       });
    });

}


function makeNetwork(graph, drawingArea) {
    "use strict";
    const vis_nodes = new vis.DataSet(graph.nodes);
    const vis_edges = new vis.DataSet(graph.edges);
    const vis_container = drawingArea[0];
    const vis_options = {physics: false, // if false then a -> b & b -> a overlaps and labels get messy
                                         // we could give the user some warning to set one connector to simple
                         width: "100%",
                         height: "500px",
                         nodes: {
                             font: {size: 20,
                                    face: "Patrick Hand SC, arial"
                                    //vadjust: -2,
                                    }
                             //https://fonts.googleapis.com/css?family=Neucha|Patrick+Hand+SC
                         },
                         edges: {length: 1000, // this doesn't seem to do anything.  Confirm and report a bug...
                                 font: {size: 15,
                                        face: "Patrick Hand SC, arial"},
                                 arrowStrikethrough: false // note we may want to make the node borders a little thicker
                         },
                         layout: {
                             hierarchical: false,
                             randomSeed: 10161
                         }};

    const vis_data = {nodes: vis_nodes,
                      edges: vis_edges};

    // draw the thing
    return new vis.Network(vis_container, vis_data, vis_options);
}


function addDownloadLink(downloadID, drawingID) {
    "use strict";

    const download_link = document.getElementById(downloadID);
    const network_canvas = $("#" + drawingID).find("canvas").first()[0];

    // make a new canvas so that we can add an opaque background
    const download_canvas = document.createElement("canvas");

    download_canvas.width = network_canvas.width;
    download_canvas.height = network_canvas.height;
    const download_context = download_canvas.getContext("2d");

    //create a rectangle with the desired color
    download_context.fillStyle = "#FFFFFF";
    download_context.fillRect(0, 0, network_canvas.width, network_canvas.height);

    //draw the original canvas onto the destination canvas
    download_context.drawImage(network_canvas, 0, 0);

    download_link.setAttribute("download", "HiFiDraw.png");
    download_link.setAttribute("href", download_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));

    // In case you want to choose a different random seed
    // console.log("random seed: " + network.getSeed());
}


function serialiseGraph(graphData) {
    "use strict";
    return JSON.stringify(graphData);
}


function deserialiseGraph(serialisedGraph) {
    "use strict";
    return JSON.parse(serialisedGraph);
}


function updateExportURL(graph, linkObject) {
    "use strict";
    const link_url = window.location.origin + window.location.pathname + "?serialised=" + serialiseGraph(graph);

    if (link_url.length > 2082) {
        linkObject.text("The URL would have been over 2,083 characters.  " +
            "That is the upper limit of some browsers.  Consider shortening the names of some of your components.");
    } else {
        linkObject.text(link_url);
    }
}


function redraw(tableObj, drawingArea) {
    "use strict";
    // ToDo This function does too much, break it up
    const graph = graphFromTable(tableObj);
    let scale = undefined;
    let position = undefined;

    // We store the network in the window global object
    // There is probably a nicer way to do this
    if (window.hifidrawNetwork) {
        getNodePositionsFromNetwork(graph, window.hifidrawNetwork);

        scale = window.hifidrawNetwork.getScale();
        position = window.hifidrawNetwork.getViewPosition();
    }

    updateExportURL(graph, $("#id_export_link"));

    const network = makeNetwork(graph, drawingArea);

    // remember it for next time
    window.hifidrawNetwork = network;

    // keep the old position if there is one else
    if (position === undefined) {
        position = network.getViewPosition();
    }

    if (scale === undefined) {
        scale = 1.2;
    }

    network.moveTo({
        position: position,
        scale: scale
    });

    network.on("afterDrawing",
           function () {
               addDownloadLink("id_download", drawingArea.attr("id"));
           });
}


function makeDeleteButton(redrawFunc) {
    "use strict";

    //Create an input type dynamically.
    const element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", "-");

    let jqe = $(element);

    jqe.click(
        function () {
            const theTable = $(this).closest("table");

            $(this).closest("tr").remove();

            redrawFunc();

            return false;
        }
    );

    return jqe;
}


function addRow(tableObj, redraw_func, source_val, dest_val, conn_val) {
    "use strict";

    const tableBody = tableObj.children("tbody").first();

    // if the last row has focus, we will later set the focus to the last source input
    const childRows = tableBody.children("tr");
    const lastRowCells = childRows.eq(childRows.length - 1).children("td");
    let lastRowHasFocus = false;

    // const redraw_func = function () {
    //                         redraw(tableObj, drawingArea);
    //                     };

    // Note, focus is lost if the user clicks a delete button
    lastRowCells.each(function () {
        // assume each cell only has one child element
        if ($(this).children().first().is($(document.activeElement))) {
            lastRowHasFocus = true;
        }
    });

    // Insert a row at the end of the table
    const newRow = tableBody[0].insertRow(tableBody[0].rows.length);

    // Insert a cell in the row at index 0
    let srcCell = newRow.insertCell(0);
    let srcBox = makeSourceBox(source_val);

    srcBox.focusout(redraw_func);

    srcBox.appendTo(srcCell);

    if (lastRowHasFocus) {
        srcBox.focus();
    }

    const connCell = newRow.insertCell(1);
    const connMenu = makeConnectorMenu(conn_val);

    connMenu.focusout(redraw_func);

    connMenu.appendTo(connCell);

    const dstCell = newRow.insertCell(2);
    const dstBox = makeDestinationBox(dest_val);

    dstBox.focusout(redraw_func);

    dstBox.appendTo(dstCell);

    const deleteCell = newRow.insertCell(3);
    makeDeleteButton(redraw_func).appendTo(deleteCell);

    return tableBody;
}


/* Add a source-connector-destination row at the end of the table */
function addRowRedraw(sourceTableID, drawingArea) {
    "use strict";

    const tableObj = $("#" + sourceTableID);

    const redraw_func = function () {
                        redraw(tableObj, drawingArea);
                    };

    addRow(tableObj, redraw_func);

    redraw_func();
}


function makeTable(tableID, drawingArea) {
    "use strict";

    const newTable =
           $("<table id='" + tableID + "'>\n" +
        "       <thead>\n" +
        "         <tr>\n" +
        "           <th>Source</th>\n" +
        "           <th>Connector</th>\n" +
        "           <th>Destination</th>\n" +
        "           <th>\n" +
        "             <input type='button' value='+'/>\n" +
        "           </th>\n" +
        "         </tr>\n" +
        "       </thead>\n" +
        "       <tbody>\n" +
        "       </tbody>\n" +
        "     </table>");

    const button = newTable.find("input").first();

    button.click(function(){
        addRowRedraw(tableID, drawingArea);
    });

    return newTable;
}


function deleteRowFromID(tableID, idx, drawingArea) {
    "use strict";

    const theTable = $("#" + tableID);

    const tableBody = theTable.children("tbody").first();

    // if the last row has focus, set the focus to the last but one destination input
    const childRows = tableBody.children("tr");
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
        lastButOneRow.children("td").eq(2).children("input").first().focus();
    }

    tableBody.children("tr").eq(idx).remove();

    redraw(theTable, drawingArea);
}


function deleteLastDataRowFromID(tableID, drawingArea) {
    /* This is a safe delete function, it will always leave the
    *  headers and the add button. */
    "use strict";

    const theTable = $("#" + tableID);

    const tableBody = theTable.children("tbody").first();

    if (tableBody.find("tr").length > 1) {
        deleteRowFromID(tableID, tableBody.children("tr").length - 1, drawingArea);
    }
}


function addSampleData(tableObj, drawingArea) {
    "use strict";

    const redraw_func = function () {
                    redraw(tableObj, drawingArea);
                };

    addRow(tableObj, redraw_func, "phone", "amp", "XLR<>XLR");
    addRow(tableObj, redraw_func, "amp", "speakers");
    addRow(tableObj, redraw_func);
}


function removeSampleData(sourceTableID, drawingDivID) {
    "use strict";

    const tableObj = $("#" + sourceTableID);

    const tableBody = tableObj.children("tbody").first();
    tableBody.empty();

    const drawingArea = $("#" + drawingDivID);
    redraw(tableObj, drawingArea);
}


/* Get query parameters from the URL
   e.g. www.my-site.com?something=a_thing&what=why
        will return a dict with something and what as keys
   You can call it like this getQueryParams(document.location.search)*/
function getQueryParams(queryString) {
    "use strict";

    queryString = queryString.split("+").join(" ");

    let params = {};
    let tokens;
    const re = /[?&]?([^=]+)=([^&]*)/g;

    do {
        tokens = re.exec(queryString);
        if (tokens) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        } else {
            break;
        }
    } while (true);

    return params;
}


function addDataFromURL(serialisedData, tableObj, drawingDivID) {
    "use strict";

    const unpackedData = deserialiseGraph(serialisedData);

    // ToDo Re-write this using array.some()
    unpackedData.edges.forEach(function (edge) {
        let from_label = null;
        let to_label = null;

        // get the labels for the nodes connected by this edge
        unpackedData.nodes.forEach(function (node) {
            if (node.id === edge.from) {
                from_label = node.label;
            }

            if (node.id === edge.to) {
                to_label = node.label;
            }
        });

        const redraw_func = function () {
                redraw(tableObj, $("#" + drawingDivID));
            };

        if (from_label && to_label) {
            addRow(tableObj, redraw_func, from_label, to_label, edge.label);
        }
    });
}


function refresh(sourceTable, drawingArea) {
    "use strict";

    redraw(sourceTable, drawingArea);
}


function makeRefreshButton(inputTable, drawingArea) {
    "use strict";
    const button = $("<input type=\"button\" class=\"btn-small\" value=\"Refresh\"/>");

    button.click(function() {
                   refresh(inputTable, drawingArea);
                 });

    return button;
}


function setKeydownListener(inputTableID, drawingArea) {
    "use strict";

    if (! window.hasOwnProperty("pressedKeys")) {
        window.pressedKeys = {};
    }

    $(document.body).keyup(function (evt) {

        evt = evt || event; // to deal with IE

        window.pressedKeys[evt.keyCode] = evt.type === "keydown";
    });

    $(document.body).keydown(function (evt) {

        evt = evt || event; // to deal with IE

        window.pressedKeys[evt.keyCode] = evt.type === "keydown";

        // Shift + Enter to delete last row or Enter for new row
        if (window.pressedKeys[13]) {
            if (window.pressedKeys[16]) {
                deleteLastDataRowFromID(inputTableID, drawingArea);
            } else {
                addRowRedraw(inputTableID, drawingArea);
            }
        }
    });
}


function setUpSingleDrawingPage(inputDivID, drawingDivID) {
    "use strict";

    const inputDiv = $("#" + inputDivID);

    const drawingArea = $("#" + drawingDivID);

    const inputTable = makeTable("inputTable", drawingArea);

    inputDiv.append(inputTable);

    drawingArea.parent().append(makeRefreshButton(inputTable, drawingArea));

    const query_params = getQueryParams(document.location.search);

    if (query_params.hasOwnProperty("serialised")) {
        addDataFromURL(query_params.serialised, inputTable, drawingDivID);
    } else {
        addSampleData(inputTable, drawingArea);
    }

    setKeydownListener(inputTable.attr("id"), drawingArea);

    redraw(inputTable, drawingArea);
}


function copyToClipboard(idExportLink) {
    "use strict";
    const textArea = document.createElement("textarea");  // Create a <textarea> element
    textArea.value = $("#" + idExportLink).text();        // Set its value to the string that you want copied
    textArea.setAttribute("readonly", "");                // Make it readonly to be tamper-proof
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";                      // Move outside the screen to make it invisible
    document.body.appendChild(textArea);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0      // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    textArea.select();                              // Select the <textarea> content
    document.execCommand("copy");                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(textArea);            // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
}
