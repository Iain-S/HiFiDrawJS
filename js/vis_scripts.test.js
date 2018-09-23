/*global $, chai, document */

/* Things to do once the unit_tests page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    // THE BIG LIST OF TEST FUNCTIONS
    let test_functions = [
        test_add_text_box,
        test_count_tbody_rows,
        test_make_connector_menu,
        test_make_connector_menu_with_id,
        test_make_connector_menu_with_selection,
        test_make_destination_box,
        test_make_destination_box_with_id,
        test_make_destination_box_with_value,
        test_make_source_box,
        test_make_source_box_with_id,
        test_make_source_box_with_value,
        test_make_delete_button,
        test_delete_last_row_leaves_essentials,
        test_add_and_delete_row,
        test_add_row,
        test_add_row_focus,
        test_new_row_has_right_num_of_cols,
        test_delete_last_row,
        test_delete_last_row_focus,
        test_count_valid_rows,
        test_graph_from_table,
        test_add_node_from_cell,
        test_row_is_valid,
        test_add_sample_data,
        test_serialise_graph,
        test_deserialise_graph,
        test_serialise_deserialise
    ];

    let test_result_area = $("#test_results");
    let number_of_tests = test_functions.length;
    let passed_tests = 0;

    test_functions.forEach(function (element) {
        //let test_result_area = $("#test_results");
        let append_string = "<p>" + "Running " + element.name + "...";

        // setUp
        addSampleData('inputTable');

        try {
            element();
            append_string += "<span style=\"color:green\">" + element.name + " passed." + "</span></p>";
            passed_tests += 1;
        } catch (err) {
            append_string += "<span style=\"color:red\">" + element.name + " failed. " + err + "</span></p>";
        }

        // tearDown
        removeSampleData('inputTable');

        test_result_area.append(append_string);
    });

    test_result_area.prepend("<strong>" + passed_tests.toString() + " of " +
        number_of_tests.toString() + " tests passed." + "</strong>");
    test_result_area.append("<p><br><br></p>");

    // not essential but nice to have some data when looking at the page
    addSampleData('inputTable');
});


function test_add_text_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let testing_div = $("#div_for_testing");
    let existing_text_box = testing_div.find('input[type="text"]');

    assert.equal(existing_text_box.length, 0, "existing_text_box wasn't undefined.");

    let source_box = makeSourceBox().appendTo(testing_div[0]);

    let new_text_boxes = testing_div.find('input[type="text"]');
    assert.equal(new_text_boxes.length, 1, "Expected one text input box");

    source_box.remove();
}


function test_count_tbody_rows() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    let tableRef = $("#inputTable");
    let tableBody = tableRef.children('tbody').first();
    let currentRows = countBodyRows(tableBody);
    assert.equal(currentRows, 3);

    let newTableBody = $("<tbody><tr></tr></tbody>");
    currentRows = countBodyRows(newTableBody);
    assert.equal(currentRows, 1);

    let emptyTableBody = $("<tbody></tbody>");
    currentRows = countBodyRows(emptyTableBody);
    assert.equal(currentRows, 0);
}


function test_make_connector_menu() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    // There should be one <select> element returned
    let connector_menu = makeConnectorMenu().filter('select');
    assert.equal(1, connector_menu.length);
}


function test_make_connector_menu_with_id() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let connector_menu = makeConnectorMenu(null, 0).filter('select');
    assert.equal('id_conn_0', connector_menu.attr("id"));

    connector_menu = makeConnectorMenu(null, 66778).filter('select');
    assert.equal('id_conn_66778', connector_menu.attr("id"));
}


function test_make_connector_menu_with_selection() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let connector_menu = makeConnectorMenu('').filter('select');
    // ToDo finish this off
    // assert.equal('something', connector_menu.attr("id"));
    //
    // connector_menu = makeConnectorMenu('').filter('select');
    // assert.equal('----', connector_menu.attr("id"));
}


function test_make_destination_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let destination_box = makeDestinationBox().filter('input');
    assert.equal(1, destination_box.length);
    assert.equal('none', destination_box.attr("autocapitalize"));
}


function test_make_destination_box_with_id() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let destination_box = makeDestinationBox(null, 0).filter('input');
    assert.equal('id_dst_0', destination_box.attr("id"));

    destination_box = makeDestinationBox(null, 8789).filter('input');
    assert.equal('id_dst_8789', destination_box.attr("id"));
}


function test_make_destination_box_with_value() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let source_box = makeDestinationBox("my value").filter('input');
    assert.equal(1, source_box.length);
    assert.equal("my value", source_box.val());
}


function test_make_source_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let source_box = makeSourceBox().filter('input');
    assert.equal(1, source_box.length);
    assert.equal('none', source_box.attr("autocapitalize"));
}


function test_make_source_box_with_id() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let source_box = makeSourceBox(null, 0).filter('input');
    assert.equal('id_dst_0', source_box.attr("id"));

    source_box = makeDestinationBox(null, 84456).filter('input');
    assert.equal('id_dst_84456', source_box.attr("id"));
}


function test_make_source_box_with_value() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let source_box = makeSourceBox("my value").filter('input');
    assert.equal(1, source_box.length);
    assert.equal("my value", source_box.val());
}


function test_make_delete_button() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let delete_button = makeDeleteButton().filter('input').first();
    assert.equal(delete_button.attr('type'), 'button');
    assert.equal(delete_button.attr('value'), 'Delete');
}


function test_add_and_delete_row() {
    // Function-level strict mode syntax
    'use strict';

    // Unfortunately, add and delete are intertwined so we shall have to test them together

    let assert = chai.assert;
    let tableRef = $('#inputTable');
    let tableBody = tableRef.children('tbody').first();
    let table_rows = tableBody.children('tr');
    assert.equal(3, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('inputTable');
    } catch (ignore) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Expected more rows after calling addRowRedraw.");

    // Delete the last row
    try {
        deleteRowFromID('inputTable', table_rows.length - 1);
    } catch (ignore) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(3, table_rows.length, "Expected fewer rows after calling deleteRowFromID.");
}


function test_delete_last_row() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let tableRef = $('#inputTable');
    let tableBody = tableRef.children('tbody').first();
    let table_rows = tableBody.children('tr');
    assert.equal(3, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('inputTable');
    } catch (ignore) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Expected more rows after calling addRowRedraw.");

    // Delete the last row
    try {
        deleteLastDataRowFromID('inputTable');
    } catch (ignore) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(3, table_rows.length, "Expected fewer rows after calling deleteLastDataRowFromID.");
}


function test_delete_last_row_focus() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    // focus on the last destination box
    let tableObj = $("#inputTable");
    let tableBody = tableObj.children("tbody").first();
    let childRows = tableBody.children('tr');

    let lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();
    let lastButOneDestinationInput = childRows.eq(childRows.length - 2).children("td").eq(2).children("input").first();

    assert.equal(lastDestinationInput[0], lastDestinationInput[0]);  // Check that this equal() function does as it should
    assert.notEqual(lastDestinationInput[0], lastButOneDestinationInput[0]);  // Check that there are at least two source inputs

    // Set focus on the last destination input
    lastDestinationInput.focus();

    deleteLastDataRowFromID("inputTable");

    // Assert that focus is on last source input
    tableObj = $("#inputTable");
    tableBody = tableObj.children("tbody").first();
    childRows = tableBody.children('tr');
    lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();
    assert.isTrue(lastButOneDestinationInput.is($(":focus")));
}


function test_delete_last_row_leaves_essentials() {
    // Check that we always leave at least one row in the table (because having none doesn't make sense)

    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    // Add a table with two rows
    $(document.body).append('<table class="table" id="9029384093284023">\n' +
        '      <thead>\n' +
        '        <tr>\n' +
        '\t        <th>Source</th>\n' +
        '\t        <th>Connector</th>\n' +
        '\t        <th>Destination</th>\n' +
        '        </tr>\n' +
        '      </thead>\n' +
        '      <tbody>\n' +
        '        <tr>\n' +
        '\t        <td id="sourceBox">\n' +
        '\t\t        <input type="button" id="btnAdd" value="Add" onclick="addRowRedraw(\'inputTable\');" />\n' +
        '          </td>\n' +
        '\t        <td></td>\n' +
        '\t        <td></td>\n' +
        '\t      </tr>\n' +
        '      </tbody>\n' +
        '\t  </table>');


    // Check that our function will always leave them there
    try {
        deleteLastDataRowFromID('9029384093284023');
    } catch (ignore) {}

    let tableRows = $('#9029384093284023').find('tr');
    assert.equal(2, tableRows.length);
}


function test_new_row_has_right_num_of_cols() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let tableRef = $('#inputTable');
    let tableBody = tableRef.children('tbody').first();
    let tableRows = tableBody.children('tr');
    assert.equal(3, tableRows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('inputTable');
    } catch (ignore) {}

    // Check that the row is properly formed
    tableBody = tableRef.children('tbody').first();
    tableRows = tableBody.children('tr');
    let new_row = tableRows.eq(3).children('td');
    assert.equal(new_row.length, 4, "New row has wrong number of columns.");

    try {
        deleteRowFromID('inputTable', 3);
    }
    catch (ignore) {}
}


function test_add_row() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let tableBody = $("<tbody></tbody>");

    addRow(tableBody);
    assert.equal(tableBody.children('tr').length, 1);

    addRow(tableBody);
    assert.equal(tableBody.children('tr').length, 2);
}


function test_add_row_focus() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    // focus on the first source box
    let tableObj = $("#inputTable");
    let tableBody = tableObj.children("tbody").first();
    let childRows = tableBody.children('tr');
    let firstSourceInput = childRows.first().children("td").first().children("input").first();

    let lastRow = childRows.eq(childRows.length -1);
    let lastSourceInput = lastRow.children("td").first().children("input").first();

    assert.equal(firstSourceInput[0], firstSourceInput[0]);  // Check that this equal() function does as it should
    assert.notEqual(firstSourceInput[0], lastSourceInput[0]);  // Check that there are at least two source inputs

    // Set focus on first source input
    firstSourceInput.focus();

    // Call addRow
    addRow(tableBody);

    // Assert that focus is on last source input
    tableObj = $("#inputTable");
    tableBody = tableObj.children("tbody").first();
    childRows = tableBody.children('tr');
    lastRow = childRows.eq(childRows.length -1);
    lastSourceInput = lastRow.children("td").first().children("input").first();
    // console.log(document.activeElement.getAttribute("id"));
    assert.equal(lastSourceInput[0], document.activeElement);
}


function test_count_valid_rows() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let test_data = $("");

    assert.equal(countValidRows(test_data), 0);

    // Create a table with one valid row
    test_data = $('<table class="table" id="9029384093284023">\n' +
              '      <thead>\n' +
              '        <tr>\n' +
              '\t        <th>Source</th>\n' +
              '\t        <th>Connector</th>\n' +
              '\t        <th>Destination</th>\n' +
              '        </tr>\n' +
              '      </thead>\n' +
              '      <tbody>\n' +
              '        <tr>\n' +
              '\t        <td id="sourceBox">\n' +
              '\t\t        <input type="button" id="btnAdd" value="Add" onclick="addRowRedraw(\'inputTable\');" />\n' +
              '          </td>\n' +
              '\t        <td></td>\n' +
              '\t        <td></td>\n' +
              '\t      </tr>\n' +
              '        <tr>\n' +
              '\t        <td><input value="comp1" type="text"></td>\n' +
              '\t        <td><select>' +
                              '<option value="conn1" selected="selected"></option>' +
                              '<option value="conn2"></option>' +
                             '</select></td>\n' +
              '\t        <td><input value="comp2" type="text"></td>\n' +
              '\t      </tr>\n' +
              '      </tbody>\n' +
              '\t  </table>');

    assert.equal(countValidRows(test_data), 1);
}


function test_graph_from_table() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    let test_data = $('<table class="table" id="9029384093284023">\n' +
                  '      <thead>\n' +
                  '        <tr>\n' +
                  '\t        <th>Source</th>\n' +
                  '\t        <th>Connector</th>\n' +
                  '\t        <th>Destination</th>\n' +
                  '        </tr>\n' +
                  '      </thead>\n' +
                  '      <tbody>\n' +
                  '        <tr>\n' +
                  '\t        <td id="sourceBox">\n' +
                  '\t\t        <input type="button" id="btnAdd" value="Add" onclick="addRowRedraw(\'inputTable\');" />\n' +
                  '          </td>\n' +
                  '\t        <td></td>\n' +
                  '\t        <td></td>\n' +
                  '\t      </tr>\n' +
                  '        <tr>\n' +
                  '\t        <td><input value="part1" type="text"></td>\n' +
                  '\t        <td><select>' +
                                  '<option value="conn1" selected="selected"></option>' +
                                  '<option value="conn2"></option>' +
                                 '</select></td>\n' +
                  '\t        <td><input value="part2" type="text"></td>\n' +
                  '\t      </tr>\n' +
                  '      </tbody>\n' +
                  '\t  </table>');


    let nodes = [
        {id: 1, label: 'part1', shape: "box"},
        {id: 2, label: 'part2', shape: "box"}
    ];

    // create an array with edges
    let edges = [
        {from: 1, to: 2, arrows: 'to', label: 'conn1'}
    ];

    let data = graphFromTable(test_data);

    assert.deepEqual(data.nodes, nodes, "nodes don't match " + data.nodes);
    assert.deepEqual(data.edges, edges, "edges don't match " + data.nodes);
}


function test_row_is_valid() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    let test_data = $('<tr>\n' +
                        '<td><input value="comp1" type="text"></td>\n' +
                        '<td><select>' +
                              '<option value="conn1" selected="selected"></option>' +
                              '<option value="conn2"></option>' +
                            '</select></td>\n' +
                        '<td><input value="comp2" type="text"></td>\n' +
                        '</tr>');

    assert.equal(rowIsValid(test_data), true);

    let rest_data = $('<tr>\n' +
                        '<td><input value="comp1" type="text"></td>\n' +
                        '<td><select>' +
                              '<option value="conn1" selected="selected"></option>' +
                              '<option value="conn2"></option>' +
                            '</select></td>\n' +
                        '<td><input type="text"></td>\n' +
                        '</tr>');

    assert.equal(rowIsValid(rest_data), false);
}


function test_add_node_from_cell() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    // Check that we can add a new node
    let cell = $("<td><input value=\"comp1\" type=\"text\"></td>");
    let node_array = [];

    let returned_id = addNodeFromCell(cell, node_array);

    assert.equal(1, returned_id);
    assert.deepEqual(node_array, [{id: 1, label: "comp1", shape: "box"}]);

    // Check that we return the id of an existing node
    cell = $("<td><input value=\"this_is_a_node_label\" type=\"text\"></td>");
    node_array = [{id: 8798, label: "this_is_a_node_label", shape: "box"}];

    returned_id = addNodeFromCell(cell, node_array);

    assert.equal(8798, returned_id);
    assert.deepEqual(node_array, [{id: 8798, label: "this_is_a_node_label", shape: "box"}]);
}


function test_add_sample_data() {
    // Function-level strict mode syntax
    'use strict';
    let assert = chai.assert;
    let tableRef = $('#inputTable');
    let tableBody = tableRef.children('tbody').first();
    let table_rows = tableBody.children('tr');

    assert.equal(3, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addSampleData('inputTable');
    } catch (ignore) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(6, table_rows.length, "Expected a different number of rows after calling addSampleData.");

    // Reset the table so it is back to where we started
    deleteLastDataRowFromID('inputTable');
    deleteLastDataRowFromID('inputTable');
    deleteLastDataRowFromID('inputTable');

    table_rows = tableBody.children('tr');
    assert.equal(3, table_rows.length, "Expected a different number of rows.");
}


function test_serialise_graph() {
    // Function-level strict mode syntax
    'use strict';
    let assert = chai.assert;
    let data = {nodes: {},
                edges: {}};

    let serialised_graph = serialiseGraph(data);

    assert.equal(typeof(serialised_graph), "string");
}


function test_deserialise_graph() {
    // Function-level strict mode syntax
    'use strict';
    let assert = chai.assert;
    let deserialised_graph = deserialiseGraph("{}");

    assert.equal(typeof(deserialised_graph), "object");
}


function generate_random_valid_graph() {
    // Function-level strict mode syntax
    'use strict';
    // ToDo Finish this
    return {"nodes":[{"id":1,"label":"phone","shape":"box"},
                     {"id":2,"label":"amp","shape":"box"},
                     {"id":3,"label":"speakers","shape":"box"}],
            "edges":[{"from":1,"to":2,"arrows":"to","label":"XLR<>XLR"},
                     {"from":2,"to":3,"arrows":"to","label":""}]};
}

function test_serialise_deserialise() {
    // Function-level strict mode syntax
    'use strict';
    let assert = chai.assert;
    let test_data_1 = {};

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_1)), test_data_1);

    let test_data_2 = {nodes: [],
                       edges: []};

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_2)), test_data_2);

    let test_data_3 = generate_random_valid_graph();

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_3)), test_data_3);
}


function test_template() {
    // Function-level strict mode syntax
    'use strict';
    let assert = chai.assert;

    assert.equal(1, 2, "This is an error message.");
}
