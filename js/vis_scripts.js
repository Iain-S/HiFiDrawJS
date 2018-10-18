/*global window, $, vis, document, event, console */
/*jslint es6 */


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
            const srcTD = tableRow.children("td").eq(0);

            // if source is not in nodes already, add it
            const srcID = addNodeFromCell(srcTD, nodes);

            // get dest
            const dstTD = tableRow.children("td").eq(2);

            // if dest is not in nodes already, add it
            const dstID = addNodeFromCell(dstTD, nodes);

            // find label from drop-down
            const connTD = tableRow.children("td").eq(1);
            const connLabel = connTD.children("select").first().val();

            // add edge
            edges.push({from: srcID,
                        to: dstID,
                        arrows: "to",
                        label: connLabel});
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
    network.body.data.nodes.forEach(function (oldNode, ignore) {
       graph.nodes.forEach(function (newNode, ignore) {
           // copy the Xs and Ys of the existing graph
           if (newNode.label === oldNode.label) {
               newNode.x = oldNode.x;
               newNode.y = oldNode.y;
           }
       });
    });

}


function makeEmptyNetwork(drawingArea) {
    "use strict";
    const visContainer = drawingArea[0];
    const visOptions = {physics: false, // if false then a -> b & b -> a overlaps and labels get messy
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

    return new vis.Network(visContainer, {}, visOptions);
}


function setNetworkData(graph, network) {
    "use strict";

    const visNodes = new vis.DataSet(graph.nodes);
    const visEdges = new vis.DataSet(graph.edges);

    const visData = {nodes: visNodes,
                     edges: visEdges};

    network.setData(visData);

    // draw the thing
    //return network;
}


function addDownloadLink(downloadID, drawingID) {
    "use strict";

    const downloadLink = document.getElementById(downloadID);
    const networkCanvas = $("#" + drawingID).find("canvas").first()[0];

    // make a new canvas so that we can add an opaque background
    const downloadCanvas = document.createElement("canvas");

    downloadCanvas.width = networkCanvas.width;
    downloadCanvas.height = networkCanvas.height;
    const downloadContext = downloadCanvas.getContext("2d");

    //create a rectangle with the desired color
    downloadContext.fillStyle = "#FFFFFF";
    downloadContext.fillRect(0, 0, networkCanvas.width, networkCanvas.height);

    //draw the original canvas onto the destination canvas
    downloadContext.drawImage(networkCanvas, 0, 0);

    //add an attribution to hifidraw
    downloadContext.font = "30px Patrick Hand SC";
    downloadContext.textAlign = "right";
    downloadContext.fillStyle = "#000000";
    downloadContext.fillText("Made by HiFiDraw", downloadCanvas.width-10, downloadCanvas.height-10);

    downloadLink.setAttribute("download", "HiFiDraw.png");
    downloadLink.setAttribute("href", downloadCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));

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
    const linkURL = window.location.origin + window.location.pathname + "?serialised=" + serialiseGraph(graph);

    if (linkURL.length > 2082) {
        linkObject.text("The URL would have been over 2,083 characters.  " +
            "That is the upper limit of some browsers.  Consider shortening the names of some of your components.");
    } else {
        linkObject.text(linkURL);
    }
}

function makeRedrawFunc (setExportURL, setDownloadLink) {
    "use strict";
    let visNetwork;

    return function redraw(tableObj, drawingArea) {
        // ToDo This function does too much, break it up
        const graph = graphFromTable(tableObj);
        let scale;
        let position;

        if (visNetwork) {
            getNodePositionsFromNetwork(graph, visNetwork);

            scale = visNetwork.getScale();
            position = visNetwork.getViewPosition();
        }

        setExportURL(graph);

        visNetwork = makeEmptyNetwork(drawingArea);

        setNetworkData(graph, visNetwork);

        // Keep the old position, if there are any
        if (position === undefined) {
            position = visNetwork.getViewPosition();
        }

        if (scale === undefined) {
            scale = 1.2;
        }

        visNetwork.moveTo({
            position: position,
            scale: scale
        });

        visNetwork.on("afterDrawing",
                      setDownloadLink
        );
    };
}


function makeDeleteButton(redrawFunc) {
    "use strict";

    // Create an input type dynamically.
    const element = document.createElement("input");

    // Assign attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", "-");

    let jqe = $(element);

    jqe.click(
        function () {
            $(this).closest("tr").remove();

            redrawFunc();

            return false;
        }
    );

    return jqe;
}


function addRow(tableObj, redrawFunc, sourceVal, destVal, connVal) {

    "use strict";

    const tableBody = tableObj.children("tbody").first();

    // if the last row has focus, we will later set the focus to the last source input
    const childRows = tableBody.children("tr");
    const lastRowCells = childRows.eq(childRows.length - 1).children("td");
    let lastRowHasFocus = false;

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
    let srcBox = makeSourceBox(sourceVal);

    srcBox.focusout(redrawFunc);

    srcBox.appendTo(srcCell);

    if (lastRowHasFocus) {
        srcBox.focus();
    }

    const connCell = newRow.insertCell(1);
    const connMenu = makeConnectorMenu(connVal);

    connMenu.focusout(redrawFunc);

    connMenu.appendTo(connCell);

    const dstCell = newRow.insertCell(2);
    const dstBox = makeDestinationBox(destVal);

    dstBox.focusout(redrawFunc);

    dstBox.appendTo(dstCell);

    const deleteCell = newRow.insertCell(3);
    makeDeleteButton(redrawFunc).appendTo(deleteCell);

    return tableBody;
}


function makeTable(tableID, redrawWithTable) {
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

    const redrawFunc = function () {
        redrawWithTable(newTable);
    };

    button.click(function(){
        addRow(newTable, redrawFunc);
    });

    return newTable;
}


function deleteRowFrom(tableObj, idx, redrawFunc) {
    "use strict";

    const tableBody = tableObj.children("tbody").first();

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

    redrawFunc();
}


function deleteLastDataRowFrom(tableObj, redrawFunc) {
    // This is a safe delete function, it will always leave the
    //  headers and the add button.
    "use strict";

    const tableBody = tableObj.children("tbody").first();

    if (tableBody.find("tr").length > 1) {
        deleteRowFrom(tableObj, tableBody.children("tr").length - 1, redrawFunc);
    }
}


function addSampleData(tableObj, redrawFunc) {
    "use strict";

    addRow(tableObj, redrawFunc, "turntable", "stereo amp", "RCA<>RCA");
    addRow(tableObj, redrawFunc, "phone", "stereo amp", "TRS<>RCA");
    addRow(tableObj, redrawFunc, "stereo amp", "speakers", "speaker cable");
    addRow(tableObj, redrawFunc);

}


function removeSampleData(tableObj) {
    "use strict";

    const tableBody = tableObj.children("tbody").first();
    tableBody.empty();
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


function addDataFromURL(serialisedData, tableObj, redrawFunc) {
    "use strict";

    const unpackedData = deserialiseGraph(serialisedData);

    // ToDo Re-write this using array.some()
    unpackedData.edges.forEach(function (edge) {
        let fromLabel = null;
        let toLabel = null;

        // get the labels for the nodes connected by this edge
        unpackedData.nodes.forEach(function (node) {
            if (node.id === edge.from) {
                fromLabel = node.label;
            }

            if (node.id === edge.to) {
                toLabel = node.label;
            }
        });

        if (fromLabel && toLabel) {
            addRow(tableObj, redrawFunc, fromLabel, toLabel, edge.label);
        }
    });
}


function makeRefreshButton(refreshFunc) {
    "use strict";
    const button = $("<input type=\"button\" class=\"btn-small\" value=\"Refresh\"/>");

    button.click(refreshFunc);

    return button;
}


function setKeydownListener(tableObj, redrawFunc) {
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
                deleteLastDataRowFrom(tableObj, redrawFunc);
            } else {
                addRow(tableObj, redrawFunc);
                redrawFunc();
            }
        }
    });
}


function setUpSingleDrawingPage(inputDivID, drawingDivID, exportURLID, downloadID) {
    "use strict";

    const inputDiv = $("#" + inputDivID);
    const drawingArea = $("#" + drawingDivID);

    const setExportURL = function (graph) {
        updateExportURL(graph, $("#" + exportURLID));
    };

    const setDownloadLink = function () {
                addDownloadLink(downloadID, drawingDivID);
    };

    const redrawMe = makeRedrawFunc(setExportURL, setDownloadLink);

    const redrawWithTable = function (tableObj) {
        redrawMe(tableObj, drawingArea);
    };

    const inputTable = makeTable("inputTable", redrawWithTable);

    inputDiv.append(inputTable);

    const redrawFunc = function () {
        redrawMe(inputTable, drawingArea);
    };

    drawingArea.parent().append(makeRefreshButton(redrawFunc));

    const queryParams = getQueryParams(document.location.search);

    if (queryParams.hasOwnProperty("serialised")) {
        addDataFromURL(queryParams.serialised, inputTable, redrawFunc);
    } else {
        addSampleData(inputTable, redrawFunc);
    }

    setKeydownListener(inputTable, redrawFunc);

    redrawFunc();
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
