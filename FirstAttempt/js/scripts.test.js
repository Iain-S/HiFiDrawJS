/* Things to do once the unit_tests page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    'use strict';

    // check whether we can call our scripts.js functions
    var a = scripts_squared(4);
    if (a !== 16) {
        console.log("failed");
    } else {
        console.log("passed");
    }

    // check whether we can use chai.js functions
    var assert = chai.assert;
    assert.typeOf("a_string", "string");
    assert.equal(8.8, 8.8);

    // asserting false is fatal, use our try-catch test_template instead
    // assert.equal(1, 2)
    var test_functions = [
        test_scripts_squared,
        test_a,
        test_b,
        test_c
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

    var assert = chai.assert;
    try {
        assert.equal(scripts_squared(4), 16);
        assert.equal(scripts_squared(1), 1);
        assert.equal(scripts_squared(-10), 100);
        assert.equal(scripts_squared(10000), 100000000);
        console.log('test_scripts_squared has passed');
    } catch (err) {
        console.log('Error in test_scripts_squared: ' + err);
    }
}

function test_a() {
    // Function-level strict mode syntax
    'use strict';

    var assert = chai.assert;
    try {
        assert.equal(1, 2);
    } catch (err) {
        console.log('Error in TEST_NAME_HERE: ' + err);
    }
}

function test_b() {
    // Function-level strict mode syntax
    'use strict';

    var assert = chai.assert;
    try {
        assert.equal(1, 2);
    } catch (err) {
        console.log('Error in TEST_NAME_HERE: ' + err);
    }
}

function test_c() {
    // Function-level strict mode syntax
    'use strict';

    var assert = chai.assert;
    try {
        assert.equal(1, 2);
    } catch (err) {
        console.log('Error in TEST_NAME_HERE: ' + err);
    }
}

function test_template() {
    // Function-level strict mode syntax
    'use strict';

    var assert = chai.assert;
    try {
        assert.equal(1, 2);
    } catch (err) {
        console.log('Error in TEST_NAME_HERE: ' + err);
    }
}