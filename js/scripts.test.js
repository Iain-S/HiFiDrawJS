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
        test_make_connector_menu,
        test_add_destination_box,
        test_add_source_box,
        // test_draw_diagram,
        test_add_row_to_id,
        // test_generate_flowchart_input,
    ];

    test_functions.forEach(function (element) {
        element();
    });

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
    try {
        assert.equal(scripts_squared(4), 16);
        assert.equal(scripts_squared(1), 1);
        assert.equal(scripts_squared(-10), 100);
        assert.equal(scripts_squared(10000), 100000000);
        console.log(test_scripts_squared.name + ' has passed');
    } catch (err) {
        console.log('Error in ' + test_scripts_squared.name + ': ' + err);
    }
}


function test_add_text_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        let testing_div = $("#div_for_testing");
        let existing_text_box = testing_div.find('input[type="text"]');
        
        assert.equal(existing_text_box.length, 0, "existing_text_box wasn't undefined.");

        makeSourceBox().appendTo(testing_div[0]);

        let new_text_boxes = testing_div.find('input[type="text"]');
        assert.equal(new_text_boxes.length, 1, "Expected one text input box");

        console.log(test_add_text_box.name + ' has passed');
    } catch (err) {
        console.log('Error in test_add_text_box_to: ' + err);
    }
}


function test_make_connector_menu() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        // There should be one <select> element returned
        let connector_menu = makeConnectorMenu().filter('select');
        assert.equal(1, connector_menu.length);
        console.log(test_make_connector_menu.name + ' has passed.');
    } catch (err) {
        console.log('Error in test_make_connector_menu: ' + err);
    }
}


function test_add_destination_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        let destination_box = makeDestinationBox().filter('input');
        assert.equal(1, destination_box.length);
        console.log(test_add_destination_box.name + ' has passed.');
    } catch (err) {
        console.log('Error in test_add_destination_box: ' + err);
    }
}

function test_add_source_box() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        let source_box = makeSourceBox().filter('input');
        assert.equal(1, source_box.length);
        console.log(test_add_source_box.name + ' has passed.');
    } catch (err) {
        console.log('Error in ' + test_add_source_box.name + ': ' + err);
    }
}


function test_draw_diagram() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        assert.equal(1, 2);
        console.log(test_template.name + ' has passed.');
    } catch (err) {
        console.log('Error in ' + test_draw_diagram.name + ': ' + err);
    }
}


function test_add_row_to_id() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        let tableRef = $('#table_for_testing');
        let tableBody = tableRef.children('tbody').first();
        let table_rows = tableBody.children('tr');
        assert.equal(1, table_rows.length);

        // Add some data
        $('#testing_input_1').val("dd");
        $('#testing_input_2').val("ee");

        addRowToID('table_for_testing');

        tableBody = tableRef.children('tbody').first();
        table_rows = tableBody.children('tr');
        assert.equal(2, table_rows.length, "Expected two rows after calling addRowToID.");

        // Check that the row is properly formed
        let new_row = table_rows.eq(1).children('td');
        assert.equal(new_row.length, 4, "New row is null");

        console.log(test_add_row_to_id.name + ' has passed.');
    } catch (err) {
        console.log('Error in ' + test_add_row_to_id.name + ': ' + err);
    }
}


function test_generate_flowchart_input() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        assert.equal(1, 2, "error, error");
        console.log(test_template.name + ' has passed.');
    } catch (err) {
        console.log('Error in TEST_NAME_HERE: ' + err);
    }
}


function test_template() {
    // Function-level strict mode syntax
    'use strict';

    let assert = chai.assert;
    try {
        assert.equal(1, 2, "This is an error message.");
        console.log(test_template.name + ' has passed.');
    } catch (err) {
        console.log('Error in ' + test_template.name + ': ' + err);
    }
}
