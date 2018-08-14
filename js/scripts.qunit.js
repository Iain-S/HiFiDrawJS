QUnit.test("first test", function (assert) {
    assert.equal(1, 2, "Maths works!");
});

QUnit.test("test table count function", function (assert) {
    let tableRef = $("#inputTable");
    let tableBody = tableRef.children('tbody').first();
    let currentRows = countBodyRows(tableBody);
    assert.equal(currentRows, 4);
    addRowRedraw('inputTable');
    currentRows = countBodyRows(tableBody);
    assert.equal(currentRows, 5);
});