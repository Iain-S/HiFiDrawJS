/* Things to do once the unit_tests page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    'use strict';

    // check whether we can use chai.js functions
    let assert = chai.assert;
    assert.typeOf("a_string", "string");
    assert.equal(8.8, 8.8);

    // asserting false is fatal, use our try-catch test_template instead
    // assert.equal(1, 2)

    // THE BIG LIST OF TEST FUNCTIONS
    let test_functions = [
        test_scripts_squared,
        test_add_text_box,
        test_count_tbody_rows,
        test_make_connector_menu,
        test_make_destination_box,
        test_make_source_box,
        test_make_delete_button,
        //test_draw_diagram,
        test_delete_last_row_leaves_essentials,
        test_add_and_delete_row,
        test_add_row,
        test_generate_flowchart_input,
        test_new_row_has_right_num_of_cols,
        test_delete_last_row,
    ];

    let test_result_area = $("#test_results");

    test_functions.forEach(function (element) {
        //let test_result_area = $("#test_results");
        let append_string = "<p>" + "Running " + element.name + "...";
        try {
            element();
            append_string += "<span style=\"color:green\">" + element.name + " passed." + "</span></p>";
        } catch (err) {
            append_string += "<span style=\"color:red\">" + element.name + " failed. " + err + "</span></p>";
        }
        test_result_area.append(append_string);
    });

    test_result_area.append("<p><br><br></p>");

    // for (let i = 0; i < test_functions.length; i++) {
        // test_functions[i]();
    // }

    // you cannot "require" in here
    // var expect = require('chai').expect;
});


function test_scripts_squared() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    assert.equal(scripts_squared(4), 16);
    assert.equal(scripts_squared(1), 1);
    assert.equal(scripts_squared(-10), 100);
    assert.equal(scripts_squared(10000), 100000000);
}


function test_add_text_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let testing_div = $("#div_for_testing");
    let existing_text_box = testing_div.find('input[type="text"]');

    assert.equal(existing_text_box.length, 0, "existing_text_box wasn't undefined.");

    makeSourceBox().appendTo(testing_div[0]);

    let new_text_boxes = testing_div.find('input[type="text"]');
    assert.equal(new_text_boxes.length, 1, "Expected one text input box");
}


function test_count_tbody_rows() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    let tableRef = $("#table_for_testing");
    let tableBody = tableRef.children('tbody').first();
    let currentRows = countBodyRows(tableBody);
    assert.equal(currentRows, 4);

    let newTableBody = $("<tbody><tr></tr></tbody>");
    currentRows = countBodyRows(newTableBody);
    assert.equal(currentRows, 1);

    let emptyTableBody = $("<tbody></tbody>");
    currentRows = countBodyRows(emptyTableBody);
    assert.equal(currentRows, 0);
}


function test_delete_tbody_row() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;

    let tableRef = $("#table_for_testing");
    let tableBody = tableRef.children('tbody').first();
    let currentRows = countBodyRows(tableBody);
    assert.equal(currentRows, 4);
}


function test_make_connector_menu() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    // There should be one <select> element returned
    let connector_menu = makeConnectorMenu().filter('select');
    assert.equal(1, connector_menu.length);
}


function test_make_destination_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let destination_box = makeDestinationBox().filter('input');
    assert.equal(1, destination_box.length);
}


function test_make_source_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let source_box = makeSourceBox().filter('input');
    assert.equal(1, source_box.length);
}


function test_make_delete_button() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let delete_button = makeDeleteButton().filter('input').first();
    assert.equal(delete_button.attr('type'), 'button');
    assert.equal(delete_button.attr('value'), 'Delete');
}


function test_draw_diagram() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    assert.equal(1, 2);
}


function test_add_and_delete_row() {
    // Function-level strict mode syntax
    'use strict';

    // Unfortunately, add and delete are intertwined so we shall have to test them together

    let assert = chai.assert;
    let tableRef = $('#table_for_testing');
    let tableBody = tableRef.children('tbody').first();
    let table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('table_for_testing');
    } catch (ex) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(5, table_rows.length, "Expected more rows after calling addRowRedraw.");

    // Delete the last row
    try {
        deleteRowFromID('table_for_testing', table_rows.length - 1);
    } catch (ex) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Expected fewer rows after calling deleteRowFromID.");
}


function test_delete_last_row() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let tableRef = $('#table_for_testing');
    let tableBody = tableRef.children('tbody').first();
    let table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('table_for_testing');
    } catch (ex) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(5, table_rows.length, "Expected more rows after calling addRowRedraw.");

    // Delete the last row
    try {
        deleteLastDataRowFromID('table_for_testing');
    } catch (ex) {}

    tableBody = tableRef.children('tbody').first();
    table_rows = tableBody.children('tr');
    assert.equal(4, table_rows.length, "Expected fewer rows after calling deleteLastDataRowFromID.");
}


function test_delete_last_row_leaves_essentials() {
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
    } catch (ex) {}

    let tableRows = $('#9029384093284023').find('tr');
    assert.equal(2, tableRows.length);
}


function test_new_row_has_right_num_of_cols() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let tableRef = $('#table_for_testing');
    let tableBody = tableRef.children('tbody').first();
    let tableRows = tableBody.children('tr');
    assert.equal(4, tableRows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

    try {
        addRowRedraw('table_for_testing');
    } catch (ex) {}

    // Check that the row is properly formed
    tableBody = tableRef.children('tbody').first();
    tableRows = tableBody.children('tr');
    let new_row = tableRows.eq(4).children('td');
    assert.equal(new_row.length, 4, "New row has wrong number of columns.");

    try {
        deleteRowFromID('table_for_testing', 3);
    }
    catch (ex) {}
}


function test_generate_flowchart_input() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    let the_output = generateFlowchartInput($(''));
    assert.equal(the_output, '', "error, error");
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


function test_template() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    assert.equal(1, 2, "This is an error message.");
}
