/*global $, chai, document */
/*jslint es6 */
/* Things to do once the unit_tests page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    'use strict';

    const total_time_start = performance.now();

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
        test_add_row_focus_two,
        test_new_row_has_right_num_of_cols,
        test_delete_last_row,
        test_delete_last_row_focus,
        test_count_valid_rows,
        test_graph_from_table,
        test_add_node_from_cell,
        test_row_is_valid,
        test_add_sample_data,
        test_add_data_from_url,
        test_serialise_graph,
        test_deserialise_graph,
        test_serialise_deserialise,
        test_update_export_url,
        test_long_export_url_error_message
    ];

    let test_result_area = $("#test_results");
    let number_of_tests = test_functions.length;
    let passed_tests = 0;

    test_functions.forEach(function (test_function) {
        //let test_result_area = $("#test_results");
        let append_string = "<p>" + "Running " + test_function.name + "...  ";

        // setUp
        addSampleData('inputTable');

        const time_started = performance.now();
        let ms_taken = undefined;

        try {

            test_function();
            ms_taken = performance.now() - time_started;

            append_string += "<span style=\"color:green\">" + test_function.name + " passed in " +
                ms_taken + " ms." + "</span></p>";

            passed_tests += 1;
        } catch (err) {
            ms_taken = performance.now() - time_started;

            append_string += "<span style=\"color:red\">" + test_function.name + " failed in " +
                ms_taken + "ms.  " + err + "</span></p>";

        }

        // tearDown
        removeSampleData('inputTable');

        test_result_area.append(append_string);
    });

    // not essential but nice to have some data when looking at the page
    addSampleData('inputTable');

    const total_ms_taken = performance.now() - total_time_start;

    test_result_area.prepend("<strong>" + passed_tests.toString() + " of " +
        number_of_tests.toString() + " tests passed in " + total_ms_taken + "ms." + "</strong>");
    test_result_area.append("<p><br><br></p>");

    // Go to the top so that we can see how many tests are passing
    $('html,body').scrollTop(0);
});


function test_add_text_box() {
    'use strict';

    const assert = chai.assert;
    let testing_div = $("#div_for_testing");
    let existing_text_box = testing_div.find('input[type="text"]');

    assert.equal(existing_text_box.length, 0, "existing_text_box wasn't undefined.");

    let source_box = makeSourceBox().appendTo(testing_div[0]);

    let new_text_boxes = testing_div.find('input[type="text"]');
    assert.equal(new_text_boxes.length, 1, "Expected one text input box");

    source_box.remove();
}


function test_count_tbody_rows() {
    'use strict';

    const assert = chai.assert;

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
    'use strict';

    const assert = chai.assert;
    // There should be one <select> element returned
    let connector_menu = makeConnectorMenu().filter('select');
    assert.equal(1, connector_menu.length);
}


function test_make_connector_menu_with_id() {
    'use strict';

    const assert = chai.assert;
    let connector_menu = makeConnectorMenu(null, 0).filter('select');
    assert.equal('id_conn_0', connector_menu.attr("id"));

    connector_menu = makeConnectorMenu(null, 66778).filter('select');
    assert.equal('id_conn_66778', connector_menu.attr("id"));
}


function test_make_connector_menu_with_selection() {
    'use strict';

    const assert = chai.assert;
    let connector_menu = makeConnectorMenu('').filter('select');
    // ToDo finish this off
    // assert.equal('something', connector_menu.attr("id"));
    //
    // connector_menu = makeConnectorMenu('').filter('select');
    // assert.equal('----', connector_menu.attr("id"));
}


function test_make_destination_box() {
    'use strict';

    const assert = chai.assert;
    let destination_box = makeDestinationBox().filter('input');
    assert.equal(1, destination_box.length);
    assert.equal('none', destination_box.attr("autocapitalize"));
}


function test_make_destination_box_with_id() {
    'use strict';

    const assert = chai.assert;
    let destination_box = makeDestinationBox(null, 0).filter('input');
    assert.equal('id_dst_0', destination_box.attr("id"));

    destination_box = makeDestinationBox(null, 8789).filter('input');
    assert.equal('id_dst_8789', destination_box.attr("id"));
}


function test_make_destination_box_with_value() {
    'use strict';

    const assert = chai.assert;
    let source_box = makeDestinationBox("my value").filter('input');
    assert.equal(1, source_box.length);
    assert.equal("my value", source_box.val());
}


function test_make_source_box() {
    'use strict';

    const assert = chai.assert;
    let source_box = makeSourceBox().filter('input');
    assert.equal(1, source_box.length);
    assert.equal('none', source_box.attr("autocapitalize"));
}


function test_make_source_box_with_id() {
    'use strict';

    const assert = chai.assert;
    let source_box = makeSourceBox(null, 0).filter('input');
    assert.equal('id_dst_0', source_box.attr("id"));

    source_box = makeDestinationBox(null, 84456).filter('input');
    assert.equal('id_dst_84456', source_box.attr("id"));
}


function test_make_source_box_with_value() {
    'use strict';

    const assert = chai.assert;
    let source_box = makeSourceBox("my value").filter('input');
    assert.equal(1, source_box.length);
    assert.equal("my value", source_box.val());
}


function test_make_delete_button() {
    'use strict';

    const assert = chai.assert;
    let delete_button = makeDeleteButton().filter('input').first();
    assert.equal(delete_button.attr('type'), 'button');
    assert.equal(delete_button.attr('value'), 'Delete');
}


function test_add_and_delete_row() {
    'use strict';

    // Unfortunately, add and delete are intertwined so we shall have to test them together

    const assert = chai.assert;
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
    'use strict';

    const assert = chai.assert;
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
    'use strict';

    const assert = chai.assert;

    // focus on the last destination input
    let tableObj = $("#inputTable");
    let tableBody = tableObj.children("tbody").first();
    let childRows = tableBody.children('tr');

    // eq(0) is the source box, eq(1) is the drop-down and eq(2) is the destination input
    let lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();
    let lastButOneDestinationInput = childRows.eq(childRows.length - 2).children("td").eq(2).children("input").first();

    assert.equal(lastDestinationInput[0], lastDestinationInput[0]);  // Check that this equal() function does as it should
    assert.notEqual(lastDestinationInput[0], lastButOneDestinationInput[0]);  // Check that there are at least two source inputs

    // Set focus on the last destination input
    lastDestinationInput.focus();
    deleteLastDataRowFromID("inputTable");

    // Assert that focus is on last destination input
    tableObj = $("#inputTable");
    tableBody = tableObj.children("tbody").first();
    childRows = tableBody.children('tr');
    lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();

    assert.isTrue(lastButOneDestinationInput.is($(document.activeElement)));
}


function test_delete_last_row_leaves_essentials() {
    // Check that we always leave at least one row in the table (because having none doesn't make sense)
    'use strict';

    const assert = chai.assert;

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
    'use strict';

    const assert = chai.assert;
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
    'use strict';

    const assert = chai.assert;
    let tableObj = $("<table><tbody></tbody></table>");

    addRow(tableObj);
    assert.equal(tableObj.children('tbody').first().children('tr').length, 1);

    addRow(tableObj);
    assert.equal(tableObj.children('tbody').first().children('tr').length, 2);
}


function test_add_row_focus() {
    'use strict';

    const assert = chai.assert;

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
    addRow(tableObj);

    // Assert that focus is not on last source input
    tableObj = $("#inputTable");
    tableBody = tableObj.children("tbody").first();
    childRows = tableBody.children('tr');
    lastRow = childRows.eq(childRows.length -1);
    lastSourceInput = lastRow.children("td").first().children("input").first();
    // console.log(document.activeElement.getAttribute("id"));
    assert.notEqual(lastSourceInput[0], document.activeElement);
}


function test_add_row_focus_two() {
    'use strict';

    const assert = chai.assert;

    // focus on the last-but-one source box
    let tableObj = $("#inputTable");
    let tableBody = tableObj.children("tbody").first();
    let childRows = tableBody.children('tr');
    let lastSourceInput = childRows.eq(childRows.length - 1).children("td").eq(0).children("input").first();

    assert.equal(lastSourceInput[0], lastSourceInput[0]);  // Check that this equal() function does as it should

    // Set focus on first source input
    lastSourceInput.focus();
    assert.isTrue(lastSourceInput.is($(document.activeElement)));

    // Call addRow
    addRow(tableObj);

    // Assert that focus is on last source input
    tableObj = $("#inputTable");
    tableBody = tableObj.children("tbody").first();
    childRows = tableBody.children('tr');
    lastSourceInput = childRows.eq(childRows.length - 1).children("td").eq(0).children("input").first();

    assert.equal(lastSourceInput[0], document.activeElement);
}


function test_count_valid_rows() {
    'use strict';

    const assert = chai.assert;
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
    'use strict';

    const assert = chai.assert;

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
    'use strict';

    const assert = chai.assert;

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
    'use strict';

    const assert = chai.assert;

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
    'use strict';
    const assert = chai.assert;
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
}


function test_serialise_graph() {
    'use strict';
    const assert = chai.assert;
    let data = {nodes: {},
                edges: {}};

    let serialised_graph = serialiseGraph(data);

    assert.equal(typeof(serialised_graph), "string");
}


function test_deserialise_graph() {
    'use strict';
    const assert = chai.assert;
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
    'use strict';
    const assert = chai.assert;
    const test_data_1 = {};

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_1)), test_data_1);

    const test_data_2 = {nodes: [],
                         edges: []};

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_2)), test_data_2);

    const test_data_3 = generate_random_valid_graph();

    assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_3)), test_data_3);
}


function test_add_data_from_url() {
    'use strict';
    const assert = chai.assert;

    // Create a test table and add it to our page
    $('<table class="table" id="id_data_from_url">\n' +
                    '      <thead>\n' +
                    '        <tr>\n' +
                    '          <th>Source</th>\n' +
                    '          <th>Connector</th>\n' +
                    '          <th>Destination</th>\n' +
                    '          <th>Other</th>\n' +
                    '        </tr>\n' +
                    '      </thead>\n' +
                    '      <tbody>\n' +
                    '      </tbody>\n' +
                    '    </table>').appendTo(document.body);

    const graph = {"nodes":[{"id":1, "label":"a", "shape":"box"},
                            {"id":2, "label":"b", "shape":"box"},
                            {"id":3, "label":"c", "shape":"box"},
                            {"id":4, "label":"d", "shape":"box"},
                            {"id":5, "label":"e", "shape":"box"}],
                   "edges":[{"from":1, "to":1,"arrows":"to", "label":""},
                            {"from":1, "to":2,"arrows":"to", "label":""},
                            {"from":1, "to":3,"arrows":"to", "label":""},
                            {"from":1, "to":4,"arrows":"to", "label":""},
                            {"from":1, "to":5,"arrows":"to", "label":""}]};

    const serialised_data = serialiseGraph(graph);

    addDataFromURL(serialised_data, 'id_data_from_url');

    const body_rows = $('#id_data_from_url').children('tbody').first().children('tr').length;

    assert.equal(body_rows, 5);
}


function test_update_export_url() {
    'use strict';
    const assert = chai.assert;
    const para = $("<p></p>");
    const pass_fail = [];

    updateExportURL(generate_random_valid_graph(), para);

    const export_url = para.text();

    $.ajax({
        type: 'HEAD',
        async: false,
        url: export_url,
        success: function() {pass_fail.push('success');},
        error: function() {pass_fail.push('fail');}
    });

    assert.equal(pass_fail[0], 'success');
}


function test_long_export_url_error_message() {
    'use strict';
    const assert = chai.assert;
    const para = $("<p></p>");
    const thousand_chars = 'nkrNE2fiFbcJPfNF8LhTpoSHwyz0jDb7PPk5cB4ZAag6j6PEGEmcDeani3rMwtSm48PozXSnKuhbXGDRfzj4Hrtz' +
        'c4IJ4vBKEgYxPECwkg2gyoqyQBVZfZpkfREzkh9vY2CvuiGlAXsGCRdhnsJQ6DMUPUDEy19d30xxlAXL9klsaVcWcVLBXX2WX9DGm2WxvN0' +
        'aIfbtaS935wzLmnpmL3BKgBhrno3Y6rUVmrjvtzoMb2LKVPENc0rV05ISxTrizCTW8H09uaH9vJtqHla2Bh3KQlbvMQ5nMck9wWH74YL2lV' +
        'hZjCi2NoDLbyuAx00Out7OACiVvVgATGe6l4n3A2tEy9tRLobPv5fKt25VPmDa6pKcx45ni6iKffuKPOAmMLYlGXaeZY9FgfkgW1wMYhQma' +
        '9uExUfygxXHOYdjV3W3AAhN38wMdowjy03RuThvnDJiRzRfp2VJULPKqZoOWvvPIpCCMjn1lb6YjjyZaQcs7yqSf4l7fr4m9TnGmNVYNXzC' +
        'AhuPYG0x2gA7ucg2yItu8ZUYcCcMpKc5skbyyR6CU45STGg2npM4CdemiKjwzJJd5ogahITfnrYzAe5fUcYc6dGmusHrkva7Xvt5OVPRsRf' +
        'fJW2VJUQNR1mpCkPEuaI3FIn89vMxfDjnFBpQVqAWEpuD4frs8b9JpnxVgdV4HgSS8exuWa6r9SCQSy22Ui8zmslHN5DzLM9ilKFqQBgZ6K' +
        'Ye2dkGRjW4M44LVCQumv69l1BDMP8NSjKGOqXDD0NeZJgiYVQ8CCgQu8ibKQPZnYUmNs6hZDemtthxKaqdwqiGGyhp8TVrTPii4sqFWMI0v' +
        'bTv6fjQOXSzZbhxdkIvJjEz4iMvQGckJqFuXyBD4ZwN90KSDZsoshZjML7XfHzKmPdJszUMAMAHK5mc3N7gP2SXk1cbZRuGIleifchAR7DD' +
        'LXFUo7jyeoWsYZaPSXmJZim8l9KEEkuA9zEBeXH12AjSGOkvFOrnyhpa';

    const graph_with_long_labels =
        {"nodes":[{"id":1,"label":"1" + thousand_chars,"shape":"box"},
                {"id":2,"label":"2" + thousand_chars,"shape":"box"}],
        "edges":[{"from":1,"to":2,"arrows":"to","label":"3" + thousand_chars}]};

    updateExportURL(graph_with_long_labels, para);

    assert.equal(para.text(), 'The URL would have been over 2,083 characters.  ' +
        'That is the upper limit of some browsers.  Consider shortening the names of some of your components.');
}


function test_template() {
    'use strict';
    const assert = chai.assert;

    assert.equal(1, 2, "This is an error message.");
}


function test_template() {
    'use strict';
    const assert = chai.assert;

    assert.equal(1, 2, "This is an error message.");
}
