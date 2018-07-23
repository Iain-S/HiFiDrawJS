/* Things to do once the page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    'use strict';
    //$('#'+'jquery_test').html('testing')
    console.log("does this override the other doc.ready?");
    // Add a first row to the table
    //addRow($('#inputTable'))
    //addRow('inputTable')
});

function scripts_squared(a_number) {
    // Function-level strict mode syntax
    'use strict';
    return a_number * a_number;
}

/* Add a text box to the element passed in as addTextBoxTo */
function addTextBox(addTextBoxTo) {
    // Function-level strict mode syntax
    'use strict';

    var fieldId = 888;

    //Create an input type dynamically.
    var element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "Test Name");
    //element.setAttribute("style", "width:200px");
    element.setAttribute("id", "text" + fieldId);
    element.setAttribute("placeholder", "source name");

    //Create Labels
    //var label = document.createElement("label");
    //label.innerHTML = "New Label ";
    //label.setAttribute("style", "font-weight:normal");
    //label.setAttribute("for", "text" + fieldId);

    // 'foobar' is the div id, where new fields are to be added
    //var foo = document.getElementById(sourceBox);

    //Append the element in page (in span).
    //foo.appendChild(label);
    //foo.appendChild(element);
    //addTextBoxTo.appendChild(label);
    addTextBoxTo.appendChild(element);
}


/* Add a bootstrap dropdown menu to the element passed in */
function addConnectorMenu(addDropdownTo) {
    // Function-level strict mode syntax
    'use strict';

    addDropdownTo.innerHTML = '<div class="dropdown-menu">      <a class="dropdown-item" href="#">Action</a>      <a class="dropdown-item" href="#">Another action</a>      <a class="dropdown-item" href="#">Something else here</a>      <div role="separator" class="dropdown-divider"></div>      <a class="dropdown-item" href="#">Separated link</a>    </div>';
}


/* Add a normal dropdown menu to the element passed in */
function addConnectorMenu2(addDropdownTo) {
    // Function-level strict mode syntax
    'use strict';

    addDropdownTo.innerHTML = '<select>      <option value="volvo">Volvo</option>      <option value="saab">Saab</option>      <option value="opel">Opel</option>      <option value="audi">Audi</option>    </select>';
}


/* Add a normal dropdown menu to the element passed in using jquery */
function addConnectorMenu3(addDropdownTo) {
    // Function-level strict mode syntax
    'use strict';

    var arr = [
        {val: 1, text: 'Generic'},
        {val: 2, text: 'RCA<>RCA'},
        {val: 3, text: 'RCA<>TRS'},
        {val: 4, text: 'RCA<>XLR'},
        {val: 5, text: 'TRS<>TRS'},
        {val: 6, text: 'TRS<>RCA'},
        {val: 7, text: 'TRS<>XLR'},
        {val: 8, text: 'XLR<>XLR'},
        {val: 9, text: 'XLR<>RCA'},
        {val:10, text: 'XLR<>TRS'}
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'XLR<>XLR'},
        //{val : 3, text: 'Wireless'},
    ];

    var sel = $('<select>');

    $(arr).each(function() {
        sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    //console.log(sel);
    //addDropdownTo.innerHTML = (sel.html());
    //addDropdownTo.append(sel.html());
    //sel.appendTo('#jquery_test');
    sel.appendTo(addDropdownTo);
}


/* Add a text box to the element passed in */
function addDestinationBox(addTextBoxTo) {
    // Function-level strict mode syntax
    'use strict';

    //Create an input type dynamically.
    var element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "Test Name");
    //element.setAttribute("style", "width:200px");
    //element.setAttribute("id", "text" + fieldId);
    element.setAttribute("placeholder", "destination name");

    addTextBoxTo.appendChild(element);
}


/* Add a source-connector-destination row at the end of the table*/
function addRow(sourceTable) {
    // Function-level strict mode syntax
    'use strict';

    var tableRef = document.getElementById(sourceTable).getElementsByTagName('tbody')[0];

    // Insert a row at the end of the table
    var newRow = tableRef.insertRow(tableRef.rows.length);

    // Insert a row at the beginning of the table
    //var newRow = tableRef.insertRow(0);

    // Insert a cell in the row at index 0
    var srcCell = newRow.insertCell(0);
    addTextBox(srcCell);

    var conCell = newRow.insertCell(1);
    addConnectorMenu3(conCell);

    var dstCell = newRow.insertCell(2);
    addDestinationBox(dstCell);
}


/* Get query parameters from the URL
   e.g. www.mysite.com?something=a_thing&what=why
        will return a dict with something and what as keys */
function getQueryParams(qs) {
    // Function-level strict mode syntax
    'use strict';

    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}