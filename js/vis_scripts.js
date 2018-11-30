/*global window, $, vis, document, event, console */
/*jslint es6 */


function countBodyRows(tableBody) {
    "use strict";

    const tableRows = tableBody.children("tr");

    return tableRows.length;
}


function makeTextInput(placeholder, datalistID, value, number){
    "use strict";

    // Create an input type dynamically.
    const element = document.createElement("input");

    // Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", placeholder);
    element.setAttribute("autocapitalize", "none");

    element.setAttribute("list", datalistID);

    if (value) {
        element.setAttribute("value", value);
    }

    if (number !== undefined) {
        element.setAttribute("id", "id_" + placeholder + "_" + number.toString());
    }

    return $(element);
}


function makeSourceBox(value, number) {
    "use strict";

    return makeTextInput("source", "components", value, number);
}


function makeDestinationBox(value, number) {
    "use strict";

    return makeTextInput("dest", "components", value, number);
}


function makeConnectorMenu(value, number) {
    "use strict";

    return makeTextInput("via", "connectors", value, number);
}


function rowIsValid(rowObj) {
    "use strict";

    const tableTextBoxes = rowObj.find("input[type=text]");
    let numberOfValidInputs = 0;

    // Check that we have three text boxes and at least the source and destination are filled in
    return tableTextBoxes.length === 3 &&
        tableTextBoxes.eq(0).val().length &&
        tableTextBoxes.eq(2).val().length ? true : false;
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
            // Get source
            const srcTD = tableRow.children("td").eq(0);

            // If source is not in nodes already, add it
            const srcID = addNodeFromCell(srcTD, nodes);

            // Get dest
            const dstTD = tableRow.children("td").eq(2);

            // If dest is not in nodes already, add it
            const dstID = addNodeFromCell(dstTD, nodes);

            // Find label from drop-down
            const connTD = tableRow.children("td").eq(1);

            const connLabel = connTD.children("input").first().val();

            // Add edge
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


// function getNodePositionsFromNetwork(graph, network) {
//     "use strict";
//     network.storePositions();
//     network.body.data.nodes.forEach(function (oldNode, ignore) {
//        graph.nodes.forEach(function (newNode, ignore) {
//            // copy the Xs and Ys of the existing graph
//            if (newNode.label === oldNode.label) {
//                newNode.x = oldNode.x;
//                newNode.y = oldNode.y;
//            }
//        });
//     });
//
// }


function getNodePositionsFromNetwork(graph, network) {
    "use strict";
    const nodePositions = network.getPositions();
    graph.nodes.forEach(function (node, ignore) {
        if (nodePositions.hasOwnProperty(node.id)){
            // copy the Xs and Ys of the existing graph
            node.x = nodePositions[node.id].x;
            node.y = nodePositions[node.id].y;
        }
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

    const visNetwork = new vis.Network(visContainer, {}, visOptions);

    // Perhaps add an image background to the canvas
    // const background = new Image();
    // background.src = "images/black_on_blue.svg";
    //
    // visNetwork.on("beforeDrawing",
    // function(canvasContext){
    //     console.log(canvasContext);
    //     canvasContext.drawImage(background, -600, -600);
    // });

    return visNetwork;
}


function setNetworkData(graph, network) {
    "use strict";

    const visNodes = new vis.DataSet(graph.nodes);
    const visEdges = new vis.DataSet(graph.edges);

    const visData = {nodes: visNodes,
                     edges: visEdges};

    network.setData(visData);
}


function addDownloadLink(downloadID, drawingArea) {
    "use strict";

    const downloadLink = document.getElementById(downloadID);

    // ToDo Shouldn't we be assuming that the first canvas is our canvas of interest?
    const networkCanvas = drawingArea.find("canvas").first()[0];

    // Make a new canvas for the download link
    const downloadCanvas = document.createElement("canvas");

    downloadCanvas.width = networkCanvas.width;
    downloadCanvas.height = networkCanvas.height;
    const downloadContext = downloadCanvas.getContext("2d");

    // Create a rectangle with the desired color
    downloadContext.fillStyle = "#FFFFFF";
    downloadContext.fillRect(0, 0, networkCanvas.width, networkCanvas.height);

    // Draw the original canvas onto the destination canvas
    downloadContext.drawImage(networkCanvas, 0, 0);

    // Add an attribution to hifidraw
    downloadContext.font = "20px Patrick Hand SC, arial";
    downloadContext.textAlign = "right";
    downloadContext.fillStyle = "#000000";
    downloadContext.fillText("Made with HiFiDraw", downloadCanvas.width-10, downloadCanvas.height-10);

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


function deleteEdgeIDs(graph) {
    "use strict";

    // Seems to be a common way to deep copy
    const newGraph = JSON.parse(JSON.stringify(graph));

    newGraph.edges.forEach(function (edge) {
        delete edge.id;
    });

    return newGraph;
}


function updateExportURL(graph, linkObject) {
    "use strict";

    // We should really deal with these edge IDs elsewhere
    const graphWithoutIDs = deleteEdgeIDs(graph);

    const linkURL = window.location.origin +  "?serialised=" + serialiseGraph(graphWithoutIDs);

    if (linkURL.length > 2082) {
        linkObject.text("The URL would have been over 2,083 characters.  " +
            "That is the upper limit of some browsers.  Consider shortening the names of some of your components.");
    } else {
        linkObject.text(linkURL);
    }
}


function makeRedrawFunc (setExportURL, setDownloadLink, visNetwork, tableObj) {
    "use strict";

    // When the user repositions a node, we need to update the export and download links
    visNetwork.on("release",
                  function(){
                      const graph = graphFromTable(tableObj);
                      getNodePositionsFromNetwork(graph, visNetwork);
                      setExportURL(graph);
                      setDownloadLink();
                  }
    );

    return function redraw() {
        // ToDo This function does too much, break it up
        const graph = graphFromTable(tableObj);
        let scale;
        let position;

        getNodePositionsFromNetwork(graph, visNetwork);

        scale = visNetwork.getScale();
        position = visNetwork.getViewPosition();

        setNetworkData(graph, visNetwork);

        visNetwork.redraw();

        setExportURL(graph);

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

        setDownloadLink();

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
               "<thead>\n" +
                 "<tr>\n" +
                   "<th>Source</th>\n" +
                   "<th>Connector</th>\n" +
                   "<th>Destination</th>\n" +
                   "<th>\n" +
                     "<input type='button' value='+'/>\n" +
                   "</th>\n" +
                 "</tr>\n" +
               "</thead>\n" +
               "<tbody>\n" +
               "</tbody>\n" +
             "</table>");

    return newTable;
}


function makeComponentsDatalist() {
    "use strict";
    const options = ["headphones",
                     "phone",
                     "pc",
                     "dac",
                     "amp",
                     "speakers"];

    let datalistString = '<datalist id="components">';

    options.sort().forEach(function(option){
        datalistString += '<option value="' + option + '">';
    });

    datalistString += "</datalist>";

    return $(datalistString);
}


function makeConnectorDatalist() {
    "use strict";
    const options = ["rca-rca",
                     "rca<>rca",
                     "rca<->rca",
                     "rca",
                     "speaker cable",
                     "optical"];

    let datalistString = '<datalist id="connectors">';

    options.sort().forEach(function(option){
        datalistString += '<option value="' + option + '">';
    });

    datalistString += "</datalist>";

    return $(datalistString);
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


function addSampleData(tableObj, redrawFunc, visNetwork) {
    "use strict";

    // You can create a sample graph on the home page and then use the permalink as sample data
    addDataFromURL('{"nodes":[{"id":"pc","label":"pc","shape":"box","x":-411,"y":-189},{"id":"dac","label":"dac","shape":"box","x":-304,"y":-187},{"id":"amplifier","label":"amplifier","shape":"box","x":-137,"y":-67},{"id":"tunrtable","label":"tunrtable","shape":"box","x":-387,"y":27},{"id":"high level inputs","label":"high level inputs","shape":"box","x":-8,"y":-174},{"id":"subwoofer","label":"subwoofer","shape":"box","x":143,"y":-174},{"id":"passive speakers","label":"passive speakers","shape":"box","x":273,"y":23}],"edges":[{"from":"pc","to":"dac","arrows":"to","label":"usb"},{"from":"dac","to":"amplifier","arrows":"to","label":"rca-rca"},{"from":"tunrtable","to":"amplifier","arrows":"to","label":"rca-rca"},{"from":"amplifier","to":"high level inputs","arrows":"to","label":"speaker cable"},{"from":"high level inputs","to":"subwoofer","arrows":"to","label":""},{"from":"subwoofer","to":"passive speakers","arrows":"to","label":"speaker cable"}]}',
        tableObj,
        redrawFunc,
        visNetwork);
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


function addDataFromURL(serialisedData, tableObj, redrawFunc, visNetwork) {
    "use strict";
    const unpackedData = deserialiseGraph(serialisedData);

    // ToDo Re-write this using array.some()
    // We will manually add the graph data to the table
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

    // We will also set the visNetwork data directly this one time.
    // This is necessary because we can't store the node x and y coordinates in the table
    // and hope for them to be displayed later
    setNetworkData(unpackedData, visNetwork);
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

    // Make a data lists for use by the table
    makeComponentsDatalist().appendTo($("body"));
    makeConnectorDatalist().appendTo($("body"));

    const inputDiv = $("#" + inputDivID);
    const drawingArea = $("#" + drawingDivID);

    const setExportURL = function (graph) {
        updateExportURL(graph, $("#" + exportURLID));
    };

    // Make a new canvas for the download link
    //const downloadCanvas = document.createElement("canvas");

    const setDownloadLink = function () {
        addDownloadLink(downloadID, drawingArea);
    };

    const visNetwork = makeEmptyNetwork(drawingArea);

    const inputTable = makeTable("inputTable");

    const redrawMe = makeRedrawFunc(setExportURL, setDownloadLink, visNetwork, inputTable);

    const button = inputTable.find("input").first();

    button.click(function(){
        addRow(inputTable, redrawMe);
    });

    inputDiv.append(inputTable);

    drawingArea.parent().append(makeRefreshButton(redrawMe));

    const queryParams = getQueryParams(document.location.search);

    if (queryParams.hasOwnProperty("serialised")) {
        addDataFromURL(queryParams.serialised, inputTable, redrawMe, visNetwork);
        redrawMe();
    } else {
        addSampleData(inputTable, redrawMe, visNetwork);
        redrawMe();
    }

    setKeydownListener(inputTable, redrawMe);

}


function getExampleDatasets(){
    "use strict";
    // return {"testing": {"nodes":[{"id":"PC","label":"PC","shape":"box","x":-264,"y":-222},{"id":"Focusrite 2i2","label":"Focusrite 2i2","shape":"box","x":-20,"y":-223},{"id":"LSR310","label":"LSR310","shape":"box","x":-14,"y":-3},{"id":"2 x LSR305","label":"2 x LSR305","shape":"box","x":-239,"y":-5}],"edges":[{"from":"PC","to":"Focusrite 2i2","arrows":"to","label":"usb"},{"from":"Focusrite 2i2","to":"LSR310","arrows":"to","label":"2 x trs - trs"},{"from":"LSR310","to":"2 x LSR305","arrows":"to","label":"2 x xlr (m) - xlr (f)"}]}};
    return {
        "testing1": {"nodes":[{"id":"PC","label":"PC","shape":"box","x":-264,"y":-222},{"id":"Focusrite 2i2","label":"Focusrite 2i2","shape":"box","x":-20,"y":-223},{"id":"LSR310","label":"LSR310","shape":"box","x":-257,"y":-25},{"id":"2 x LSR305","label":"2 x LSR305","shape":"box","x":-4,"y":-28}],"edges":[{"from":"PC","to":"Focusrite 2i2","arrows":"to","label":"usb"},{"from":"Focusrite 2i2","to":"LSR310","arrows":"to","label":"2 x trs - trs"},{"from":"LSR310","to":"2 x LSR305","arrows":"to","label":"2 x xlr (f) - xlr (m)"}]},
        "testing2.1": {"nodes":[{"id":"CHROMECAST AUDIO","label":"CHROMECAST AUDIO","shape":"box","x":-77,"y":-330},{"id":"MARANTZ PM6006","label":"MARANTZ PM6006","shape":"box","x":-73,"y":-219},{"id":"KEF Q150","label":"KEF Q150","shape":"box","x":6,"y":-48},{"id":" YAMAHA NS-SW300","label":" YAMAHA NS-SW300","shape":"box","x":-159,"y":8}],"edges":[{"from":"CHROMECAST AUDIO","to":"MARANTZ PM6006","arrows":"to","label":"mini-toslink <-> toslink"},{"from":"MARANTZ PM6006","to":"KEF Q150","arrows":"to","label":"speaker cable"},{"from":"MARANTZ PM6006","to":" YAMAHA NS-SW300","arrows":"to","label":"speaker cable"}]},
        "testing2.2": {"nodes":[{"id":"CHROMECAST AUDIO","label":"CHROMECAST AUDIO","shape":"box","x":-77,"y":-330},{"id":"MARANTZ PM6006","label":"MARANTZ PM6006","shape":"box","x":-73,"y":-219},{"id":" YAMAHA NS-SW300","label":" YAMAHA NS-SW300","shape":"box","x":-159,"y":8},{"id":"KEF Q150","label":"KEF Q150","shape":"box","x":24,"y":-98}],"edges":[{"from":"CHROMECAST AUDIO","to":"MARANTZ PM6006","arrows":"to","label":"mini-toslink <-> toslink"},{"from":" YAMAHA NS-SW300","to":"KEF Q150","arrows":"to","label":"speaker cable"},{"from":"MARANTZ PM6006","to":" YAMAHA NS-SW300","arrows":"to","label":"speaker cable"}]}
    }
}


function setUpExample(exampleName, drawingDivID, exportURLID, downloadID){
    "use strict";
    const exampleDataset = getExampleDatasets()[exampleName];
    const drawingArea = $("#" + drawingDivID);

    const visNetwork = makeEmptyNetwork(drawingArea);
    setNetworkData(exampleDataset, visNetwork);
    visNetwork.redraw();

    visNetwork.moveTo({
            scale: 1.2
        });

    const updateExportAndDownload = function() {
        getNodePositionsFromNetwork(exampleDataset, visNetwork);
        updateExportURL(exampleDataset, $("#" + exportURLID));
        addDownloadLink(downloadID, drawingArea);
    };

    updateExportAndDownload();

    visNetwork.on(
        "release",
        updateExportAndDownload
    );
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
