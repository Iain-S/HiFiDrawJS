/*global $, chai, performance, document */
/*jslint es6 */

const hifidrawTesting = (function() {
    // Put all of the test functions in this pseudo-namespace so that we can auto-discover them without discovering
    // all functions in the global namespace.
    "use strict";

    const assert = chai.assert;
    
    return {
        get_all_tests: function () {
            /* Get all of our test_ functions. */
            let myFunctions = [];
            const self = this;
            Object.keys(this).forEach(function (property) {
                if (self.hasOwnProperty(property) &&                                        // I think this rules out inherited properties
                    Object.prototype.toString.call(self[property]) === "[object Function]"  // Has to be a function
                    && (/^test_/i).test(property)                                           // Only names beginning with test_
                ) {
                    myFunctions.push(
                        Object.defineProperty(function() {
                            self[property]();
                            },
                            "name",
                            {value: property})
                    );
                }
            });
            return myFunctions;
        },

        test_add_text_box: function () {
            
            const testing_div = $("#div_for_testing");
            const existing_text_box = testing_div.find("input[type='text']");

            assert.equal(existing_text_box.length, 0, "existing_text_box wasn't undefined.");

            const source_box = makeSourceBox().appendTo(testing_div[0]);

            const new_text_boxes = testing_div.find("input[type='text']");
            assert.equal(new_text_boxes.length, 1, "Expected one text input box");

            source_box.remove();
        },


        test_count_tbody_rows: function () {

            const newTableBody = $("<tbody><tr></tr></tbody>");
            assert.equal(countBodyRows(newTableBody), 1);

            const emptyTableBody = $("<tbody></tbody>");
            assert.equal(countBodyRows(emptyTableBody), 0);
        },


        test_make_connector_menu: function () {

            const connector_menu = makeConnectorMenu().filter("input");
            assert.equal(1, connector_menu.length, connector_menu.html());
        },


        test_make_connector_menu_with_id: function () {

            let connector_menu = makeConnectorMenu(null, 0).filter("input");
            assert.equal("id_via_0", connector_menu.attr("id"));

            connector_menu = makeConnectorMenu(null, 66778).filter("input");
            assert.equal("id_via_66778", connector_menu.attr("id"));
        },
        

        // test_make_connector_menu_with_selection: function() {
        //
        //     const connector_menu = makeConnectorMenu("").filter("select");
        //     // ToDo finish this off
        //     // assert.equal("something", connector_menu.attr("id"));
        //     //
        //     // connector_menu = makeConnectorMenu('').filter("select");
        //     // assert.equal("----", connector_menu.attr("id"));
        // },
    
    
        test_make_destination_box: function() {

            const destination_box = makeDestinationBox().filter("input");
            assert.equal(1, destination_box.length);
            assert.equal("none", destination_box.attr("autocapitalize"));
        },
    
    
        test_make_destination_box_with_id: function() {

            let destination_box = makeDestinationBox(null, 0).filter("input");
            assert.equal("id_dest_0", destination_box.attr("id"));
    
            destination_box = makeDestinationBox(null, 8789).filter("input");
            assert.equal("id_dest_8789", destination_box.attr("id"));
        },
    
    
        test_make_destination_box_with_value: function() {
    
            const source_box = makeDestinationBox("my value").filter("input");
            assert.equal(1, source_box.length);
            assert.equal("my value", source_box.val());
        },
    
    
        test_make_source_box: function() {
    
            const source_box = makeSourceBox().filter("input");
            assert.equal(1, source_box.length);
            assert.equal("none", source_box.attr("autocapitalize"));
        },
    
    
        test_make_source_box_with_id: function() {
    
            let source_box = makeSourceBox(null, 0).filter("input");
            assert.equal("id_source_0", source_box.attr("id"));
    
            source_box = makeSourceBox(null, 84456).filter("input");
            assert.equal("id_source_84456", source_box.attr("id"));
        },
    
    
        test_make_source_box_with_value: function() {
    
            const source_box = makeSourceBox("my value").filter("input");
            assert.equal(1, source_box.length);
            assert.equal("my value", source_box.val());
        },
    
    
        test_make_delete_button: function() {
    
            const delete_button = makeDeleteButton("drawing_div").filter("input").first();
            assert.equal(delete_button.attr("type"), "button");
            assert.equal(delete_button.attr("value"), "-");
        },
    
    
        test_make_table: function() {
    
            const table = makeTable("this_is_a_test_id").filter("table").first();
            assert.equal(table.length, 1);
            assert.equal(table.attr("id"), "this_is_a_test_id");
    
            const fourth_column = table.children("thead").first().children("tr").first().children("th").eq(3);
            const add_button = fourth_column.children("input").first();
            assert.equal(add_button.attr("value"), "+");
        },
    
    
        test_make_refresh_button: function() {

            const button = makeRefreshButton($(), $()).filter("input");
            assert.isTrue(button.is(":button"));
        },
    
    
        test_add_and_delete_row: function() {
    
            // Add and delete are intertwined so we shall have to test them together
            const tableRef = $("#inputTable");
            let tableBody = tableRef.children("tbody").first();
            let table_rows = tableBody.children("tr");
            assert.equal(4, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

            try {
                addRow(tableRef, () => null);
            } catch (ignore) {
            }

            tableBody = tableRef.children("tbody").first();
            table_rows = tableBody.children("tr");
            assert.equal(5, table_rows.length, "Expected more rows after calling addRow.");

            // Delete the last row
            try {
                deleteRowFrom(tableRef, table_rows.length - 1);
            } catch (ignore) {
            }
    
            tableBody = tableRef.children("tbody").first();
            table_rows = tableBody.children("tr");
            assert.equal(4, table_rows.length, "Expected fewer rows after calling deleteRowFrom.");
        },


        test_delete_last_row: function() {
    
            const tableRef = $("#inputTable");
            let tableBody = tableRef.children("tbody").first();
            let table_rows = tableBody.children("tr");
            assert.equal(4, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");
    
            try {
                addRow(tableRef);
            } catch (ignore) {
            }
    
            tableBody = tableRef.children("tbody").first();
            table_rows = tableBody.children("tr");
            assert.equal(5, table_rows.length, "Expected more rows after calling addRow.");
    
            // Delete the last row
            try {
                deleteLastDataRowFrom(tableRef);
            } catch (ignore) {
            }
    
            tableBody = tableRef.children("tbody").first();
            table_rows = tableBody.children("tr");
            assert.equal(4, table_rows.length, "Expected fewer rows after calling deleteLastDataRowFrom.");
        },
    
    
        test_delete_last_row_focus: function() {
    
            // focus on the last destination input
            let tableObj = $("#inputTable");
            let tableBody = tableObj.children("tbody").first();
            let childRows = tableBody.children("tr");
    
            // eq(0) is the source box, eq(1) is the drop-down and eq(2) is the destination input
            let lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();
            let lastButOneDestinationInput = childRows.eq(childRows.length - 2).children("td").eq(2).children("input").first();
    
            assert.equal(lastDestinationInput[0], lastDestinationInput[0]);  // Check that this equal() function does as it should
            assert.notEqual(lastDestinationInput[0], lastButOneDestinationInput[0]);  // Check that there are at least two source inputs
    
            // Set focus on the last destination input
            lastDestinationInput.focus();
            deleteLastDataRowFrom(tableObj, ()=>null);
    
            // Assert that focus is on last destination input
            tableObj = $("#inputTable");
            tableBody = tableObj.children("tbody").first();
            childRows = tableBody.children("tr");
            lastDestinationInput = childRows.eq(childRows.length - 1).children("td").eq(2).children("input").first();
    
            assert.isTrue(lastButOneDestinationInput.is($(document.activeElement)));
        },
    
    
        test_delete_last_row_leaves_essentials: function() {
            // Check that we always leave at least one row in the table (because having none doesn't make sense)

            // Add a table with two rows
            $(document.body).append("<table class='table' id='9029384093284023'>\n" +
                "      <thead>\n" +
                "        <tr>\n" +
                "\t        <th>Source</th>\n" +
                "\t        <th>Connector</th>\n" +
                "\t        <th>Destination</th>\n" +
                "        </tr>\n" +
                "      </thead>\n" +
                "      <tbody>\n" +
                "        <tr>\n" +
                "\t        <td id='sourceBox'>\n" +
                "\t\t        <input type='button' id='btnAdd' value='Add' onclick='addRow(\"inputTable\");' />\n" +
                "          </td>\n" +
                "\t        <td></td>\n" +
                "\t        <td></td>\n" +
                "\t      </tr>\n" +
                "      </tbody>\n" +
                "\t  </table>");
    
    
            // Check that our function will always leave them there
            try {
                deleteLastDataRowFrom("9029384093284023");
            } catch (ignore) {
            }
    
            const tableRows = $("#9029384093284023").find("tr");
            assert.equal(2, tableRows.length);
        },
    
    
        test_new_row_has_right_num_of_cols: function() {

            const tableRef = $("#inputTable");
    
            try {
                addRow(tableRef);
            } catch (ignore) {
            }
    
            // Check that the row is properly formed
            const tableBody = tableRef.children("tbody").first();
            const tableRows = tableBody.children("tr");
            const new_row = tableRows.last().children("td");
            assert.equal(new_row.length, 4, "New row has wrong number of columns.");
        },
    
    
        test_add_row: function() {
    
            const tableObj = $("<table><tbody></tbody></table>");
    
            addRow(tableObj, $("#drawing_div"));
            assert.equal(tableObj.children("tbody").first().children("tr").length, 1);
    
            addRow(tableObj, $("#drawing_div"));
            assert.equal(tableObj.children("tbody").first().children("tr").length, 2);
        },
    
    
        test_add_row_focus: function() {
    
            // focus on the first source box
            let tableObj = $("#inputTable");
            let tableBody = tableObj.children("tbody").first();
            let childRows = tableBody.children("tr");
            let firstSourceInput = childRows.first().children("td").first().children("input").first();
    
            let lastRow = childRows.eq(childRows.length - 1);
            let lastSourceInput = lastRow.children("td").first().children("input").first();
    
            assert.equal(firstSourceInput[0], firstSourceInput[0]);  // Check that this equal() function does as it should
            assert.notEqual(firstSourceInput[0], lastSourceInput[0]);  // Check that there are at least two source inputs
    
            // Set focus on first source input
            firstSourceInput.focus();
    
            // Call addRow
            addRow(tableObj, $("#drawing_div"));
    
            // Assert that focus is not on last source input
            tableObj = $("#inputTable");
            tableBody = tableObj.children("tbody").first();
            childRows = tableBody.children("tr");
            lastRow = childRows.eq(childRows.length - 1);
            lastSourceInput = lastRow.children("td").first().children("input").first();
            // console.log(document.activeElement.getAttribute("id"));
            assert.notEqual(lastSourceInput[0], document.activeElement);
        },
    
    
        test_add_row_focus_two: function() {
    
            // focus on the last-but-one source box
            let tableObj = $("#inputTable");
            let tableBody = tableObj.children("tbody").first();
            let childRows = tableBody.children("tr");
            let lastSourceInput = childRows.eq(childRows.length - 1).children("td").eq(0).children("input").first();
    
            assert.equal(lastSourceInput[0], lastSourceInput[0]);  // Check that this equal() function does as it should
    
            // Set focus on first source input
            lastSourceInput.focus();
            assert.isTrue(lastSourceInput.is($(document.activeElement)));
    
            // Call addRow
            addRow(tableObj, $("#drawing_div"));
    
            // Assert that focus is on last source input
            tableObj = $("#inputTable");
            tableBody = tableObj.children("tbody").first();
            childRows = tableBody.children("tr");
            lastSourceInput = childRows.eq(childRows.length - 1).children("td").eq(0).children("input").first();
    
            assert.equal(lastSourceInput[0], document.activeElement);
        },
    
    
        test_count_valid_rows: function() {

            let test_data = $("");
    
            assert.equal(countValidRows(test_data), 0);
    
            // Create a table with one valid row
            test_data = $("<table class='table' id='9029384093284023'>\n" +
                "      <thead>\n" +
                "        <tr>\n" +
                "\t        <th>Source</th>\n" +
                "\t        <th>Connector</th>\n" +
                "\t        <th>Destination</th>\n" +
                "        </tr>\n" +
                "      </thead>\n" +
                "      <tbody>\n" +
                "        <tr>\n" +
                "\t        <td id='sourceBox'>\n" +
                "\t\t        <input type='button' id='btnAdd' value='Add'/>\n" +
                "          </td>\n" +
                "\t        <td></td>\n" +
                "\t        <td></td>\n" +
                "\t      </tr>\n" +
                "        <tr>\n" +
                "\t        <td><input value='comp1' type='text'></td>\n" +
                "\t        <td><input value='connector' type='text'></td>\n" +
                "\t        <td><input value='comp2' type='text'></td>\n" +
                "\t      </tr>\n" +
                "      </tbody>\n" +
                "\t  </table>");
    
            assert.equal(countValidRows(test_data), 1);
        },
    
    
        test_graph_from_table: function() {
    
            const test_data = makeTable("some_id");

            addRow(test_data, ()=>null, "part1", "part2", "XLR<>XLR");

            const nodes = [
                {id: "part1", label: "part1", shape: "box"},
                {id: "part2", label: "part2", shape: "box"}
            ];
    
            // create an array with edges
            const edges = [
                {from: "part1", to: "part2", arrows: "to", label: "XLR<>XLR"}
            ];
    
            const data = graphFromTable(test_data);
    
            assert.deepEqual(data.nodes, nodes, "nodes don't match " + data.nodes);
            assert.deepEqual(data.edges, edges, "edges don't match " + data.nodes);
        },


        test_graph_from_table_no_label: function() {

            const test_data = makeTable("some_id");

            addRow(test_data, ()=>null, "part1", "part2", "");

            const nodes = [
                {id: "part1", label: "part1", shape: "box"},
                {id: "part2", label: "part2", shape: "box"}
            ];

            // create an array with edges
            const edges = [
                {from: "part1", to: "part2", arrows: "to", label: ""}
            ];

            const data = graphFromTable(test_data);

            assert.deepEqual(data.nodes, nodes, "nodes don't match " + data.nodes);
            assert.deepEqual(data.edges, edges, "edges don't match " + data.nodes);
        },
    
    
        test_row_is_valid: function() {
    
            const test_data = $("<tr>" +
                                    "<td><input value='comp1' type='text'></td>" +
                                    "<td><input value='connector' type='text'></td>" +
                                    "<td><input value='comp2' type='text'></td>" +
                                "</tr>");
    
            assert.isOk(rowIsValid(test_data));
    
            const rest_data = $("<tr>\n" +
                                    "<td><input value='comp1' type='text'></td>\n" +
                                    "<td>" +
                                        "<select>" +
                                            "<option value='conn1' selected='selected'></option>" +
                                            "<option value='conn2'></option>" +
                                        "</select>" +
                                    "</td>\n" +
                                    "<td><input type='text'></td>\n" +
                                "</tr>");
    
            assert.isNotOk(rowIsValid(rest_data));
        },
    
    
        test_add_node_from_cell: function() {
    
            // Check that we can add a new node
            let cell = $("<td><input value=\"comp1\" type=\"text\"></td>");
            let node_array = [];
    
            let returned_id = addNodeFromCell(cell, node_array);
    
            assert.equal("comp1", returned_id);
            assert.deepEqual(node_array, [{id: "comp1", label: "comp1", shape: "box"}]);
    
            // Check that we return the id of an existing node
            cell = $("<td><input value=\"this_is_a_node_label\" type=\"text\"></td>");
            node_array = [{id: "this_is_a_node_label", label: "this_is_a_node_label", shape: "box"}];
    
            returned_id = addNodeFromCell(cell, node_array);
    
            assert.equal("this_is_a_node_label", returned_id);
            assert.deepEqual(node_array, [{id: "this_is_a_node_label", label: "this_is_a_node_label", shape: "box"}]);
        },
    
    
        test_add_sample_data: function() {
    
            const tableRef = $("#inputTable");
            let tableBody = tableRef.children("tbody").first();
            let table_rows = tableBody.children("tr");
    
            assert.equal(4, table_rows.length, "Wrong number of rows.  Have you changed the table in unit_tests.html?");

            const visNetwork = {setData: ()=>null};
            const redrawFunc = ()=>null;
            try {
                addSampleData(tableRef, redrawFunc, visNetwork);
            } catch (ignore) {
            }
    
            tableBody = tableRef.children("tbody").first();
            table_rows = tableBody.children("tr");
            assert.equal(8, table_rows.length, "Expected a different number of rows after calling addSampleData.");
        },
    
    
        test_serialise_graph: function() {

            const data = {
                nodes: {},
                edges: {}
            };
    
            const serialised_graph = serialiseGraph(data);
    
            assert.equal(typeof(serialised_graph), "string");
        },
    
    
        test_deserialise_graph: function() {
    
            const deserialised_graph = deserialiseGraph("{}");
    
            assert.equal(typeof(deserialised_graph), "object");
        },
    
    
        generate_a_valid_graph: function() {
            // ToDo Finish this

            return {
                "nodes": [{"id": "+=/?().!£$%^&*", "label": "+=/?().!£$%^&*", "shape": "box"},
                    {"id": "amp", "label": "amp", "shape": "box"},
                    {"id": "speakers", "label": "speakers", "shape": "box"}],
                "edges": [{"from": "+=/?().!£$%^&*", "to": "amp", "arrows": "to", "label": "XLR<>XLR"},
                    {"from": "amp", "to": "speakers", "arrows": "to", "label": ""}]
            };
        },


        test_serialise_deserialise: function() {
    
            const test_data_1 = {};

            assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_1)), test_data_1);
    
            const test_data_2 = {
                nodes: [],
                edges: []
            };
    
            assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_2)), test_data_2);
    
            const test_data_3 = this.generate_a_valid_graph();
    
            assert.deepEqual(deserialiseGraph(serialiseGraph(test_data_3)), test_data_3);
        },
    
    
        test_add_data_from_url: function() {
    
            // Create a test table
            const table = $("<table class='table' id='id_data_from_url'>\n" +
                "  <thead>\n" +
                "    <tr>\n" +
                "      <th>Source</th>\n" +
                "      <th>Connector</th>\n" +
                "      <th>Destination</th>\n" +
                "      <th>Other</th>\n" +
                "    </tr>\n" +
                "  </thead>\n" +
                "<tbody>\n" +
                "</tbody>\n" +
                "</table>");
    
            const graph = {
                "nodes": [{"id": 1, "label": "a", "shape": "box"},
                    {"id": 2, "label": "b", "shape": "box"},
                    {"id": 3, "label": "c", "shape": "box"},
                    {"id": 4, "label": "d", "shape": "box"},
                    {"id": 5, "label": "e", "shape": "box"}],
                "edges": [{"from": 1, "to": 1, "arrows": "to", "label": ""},
                    {"from": 1, "to": 2, "arrows": "to", "label": "tttt"},
                    {"from": 1, "to": 3, "arrows": "to", "label": "dddd"},
                    {"from": 1, "to": 4, "arrows": "to", "label": "ssss"},
                    {"from": 1, "to": 5, "arrows": "to", "label": ";;;;"}]
            };
    
            const serialised_data = serialiseGraph(graph);
    
            addDataFromURL(serialised_data,
                           table,
                           ()=>null,
                           {setData: function(visData) {
                               if (!visData.hasOwnProperty("nodes") || !visData.hasOwnProperty("edges")) {
                                   assert(false, "visNetwork should have data set");
                               }
                           }});
    
            const body_rows = table.children("tbody").first().children("tr").length;
    
            assert.equal(body_rows, 5);
        },
    
    
        test_update_export_url: function() {
            // Note that this test doesn't pass when the test page is run via PyCharm
            // so use a server instead (e.g. "python -m http.server 8009")
            const para = $("<p></p>");
            const pass_fail = [];
    
            updateExportURL(this.generate_a_valid_graph(), para);
    
            const export_url = para.text();

            $.ajax({
                type: "HEAD",
                async: false,
                url: export_url,
                success: function() {
                    pass_fail.push("success");
                },
                error: function() {
                    pass_fail.push("fail");
                }
            });
    
            assert.equal(pass_fail[0], "success");
        },


        test_to_url_from_url_special_chars: function() {
            // I had forgotten to URI-encode the graph so chars like + were getting lost

            const graph = this.generate_a_valid_graph();  // Should give us a graph with special chars in it
            let fake_export_url = {
                member_text: "",
                text: function(text){this.member_text=text;
                }
            };

            updateExportURL(graph, fake_export_url);

            // updateExportURL will set the member_text to a full URL: http://something:8111/index.html?serialised=...
            // but we only want the query parameters because that's what getQueryParams will see in action
            const query_string = fake_export_url.member_text.substring(fake_export_url.member_text.indexOf("?"));
            const query_params = getQueryParams(query_string);

            assert.deepEqual(deserialiseGraph(query_params.serialised), graph);
        },

    
        test_long_export_url_error_message: function() {

            const para = $("<p></p>");
            const thousand_chars = "nkrNE2fiFbcJPfNF8LhTpoSHwyz0jDb7PPk5cB4ZAag6j6PEGEmcDeani3rMwtSm48PozXSnKuhbXGDRfzj4Hrtz" +
                "c4IJ4vBKEgYxPECwkg2gyoqyQBVZfZpkfREzkh9vY2CvuiGlAXsGCRdhnsJQ6DMUPUDEy19d30xxlAXL9klsaVcWcVLBXX2WX9DGm2WxvN0" +
                "aIfbtaS935wzLmnpmL3BKgBhrno3Y6rUVmrjvtzoMb2LKVPENc0rV05ISxTrizCTW8H09uaH9vJtqHla2Bh3KQlbvMQ5nMck9wWH74YL2lV" +
                "hZjCi2NoDLbyuAx00Out7OACiVvVgATGe6l4n3A2tEy9tRLobPv5fKt25VPmDa6pKcx45ni6iKffuKPOAmMLYlGXaeZY9FgfkgW1wMYhQma" +
                "9uExUfygxXHOYdjV3W3AAhN38wMdowjy03RuThvnDJiRzRfp2VJULPKqZoOWvvPIpCCMjn1lb6YjjyZaQcs7yqSf4l7fr4m9TnGmNVYNXzC" +
                "AhuPYG0x2gA7ucg2yItu8ZUYcCcMpKc5skbyyR6CU45STGg2npM4CdemiKjwzJJd5ogahITfnrYzAe5fUcYc6dGmusHrkva7Xvt5OVPRsRf" +
                "fJW2VJUQNR1mpCkPEuaI3FIn89vMxfDjnFBpQVqAWEpuD4frs8b9JpnxVgdV4HgSS8exuWa6r9SCQSy22Ui8zmslHN5DzLM9ilKFqQBgZ6K" +
                "Ye2dkGRjW4M44LVCQumv69l1BDMP8NSjKGOqXDD0NeZJgiYVQ8CCgQu8ibKQPZnYUmNs6hZDemtthxKaqdwqiGGyhp8TVrTPii4sqFWMI0v" +
                "bTv6fjQOXSzZbhxdkIvJjEz4iMvQGckJqFuXyBD4ZwN90KSDZsoshZjML7XfHzKmPdJszUMAMAHK5mc3N7gP2SXk1cbZRuGIleifchAR7DD" +
                "LXFUo7jyeoWsYZaPSXmJZim8l9KEEkuA9zEBeXH12AjSGOkvFOrnyhpa";
    
            const graph_with_long_labels =
                {
                    "nodes": [{"id": 1, "label": "1" + thousand_chars, "shape": "box"},
                        {"id": 2, "label": "2" + thousand_chars, "shape": "box"}],
                    "edges": [{"from": 1, "to": 2, "arrows": "to", "label": "3" + thousand_chars}]
                };
    
            updateExportURL(graph_with_long_labels, para);
    
            assert.equal(para.text(), "The URL would have been over 2,083 characters.  " +
                "That is the upper limit of some browsers.  Consider shortening the names of some of your components.");
        },
    

        test_delete_edge_ids: function() {

            const graph1 = {nodes: [],
                            edges: [{id: 11, other_property: "some value"},
                                    {id: "xx-yy", "something": "something else"}]};

            // Copy graph1
            const graph2 = JSON.parse(JSON.stringify(graph1));

            const graph3 = {nodes: [],
                            edges: [{other_property: "some value"},
                                    {"something": "something else"}]};

            // Make sure that the IDs have been removed
            assert.deepEqual(deleteEdgeIDs(graph1), graph3, "Expected graphs to match.");

            // Make sure our delete function hasn't had any side effects on graph1
            assert.deepEqual(graph1, graph2);
        },


        test_make_components_data_list: function() {
            const data_list = makeComponentsDatalist().filter("datalist").filter("#components");
            assert.equal(data_list.length, 1, "Expected one datalist");
            assert.equal(data_list.children().length, 6);
        },


        test_make_connector_data_list: function() {
            const data_list = makeConnectorDatalist().filter("datalist").filter("#connectors");
            assert.equal(data_list.length, 1, "Expected one datalist");
            assert.equal(data_list.children().length, 6);
        },


        test_vis_callbacks_only_registered_once: function() {
            const drawingDiv = $("<div>this is for drawing</div>");
            $("body").append(drawingDiv);

            const visNetwork = makeEmptyNetwork(drawingDiv);

            let exportCallCount = 0;
            const setExportURL = function (){
                exportCallCount += 1;
            };

            let downloadCallCount = 0;
            const setDownloadLink = function (){
                downloadCallCount += 1;
            };

            const table = $("<table></table>");

            const redrawMe = makeRedrawFunc(setExportURL, setDownloadLink, visNetwork, table);

            redrawMe();

            assert.equal(1, exportCallCount, "Expected exportCallCount to be 1.");
            assert.equal(1, downloadCallCount, "Expected downloadCallCount to be 1.");

            // ToDo Add some kind of random for loop here

            redrawMe(table);
            redrawMe(table);

            assert.equal(3, exportCallCount, "Expected exportCallCount to be 3.");
            assert.equal(3, downloadCallCount, "Expected downloadCallCount to be 3.");
        },


        a_test_template: function() {

            assert.equal(1, 2, "This is an error message.");
        }
    };
}());


/* Things to do once the unit_tests page has loaded */
$(document).ready(function () {
    // Function-level strict mode syntax
    "use strict";

    const total_time_start = performance.now();

    // THE BIG LIST OF TEST FUNCTIONS
    const test_functions = hifidrawTesting.get_all_tests();

    const test_result_area = $("#test_results");
    const number_of_tests = test_functions.length;
    let passed_tests = 0;

    test_functions.forEach(function (test_function) {
        //let test_result_area = $("#test_results");
        let append_string = "<p>" + "Running " + test_function.name + "...  ";

        // setUp
        const visNetwork = {setData: ()=>null};
        const redrawFunc = ()=>null;
        addSampleData($("#inputTable"), redrawFunc, visNetwork);

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
        removeSampleData($("#inputTable"));

        test_result_area.append(append_string);
    });

    const total_ms_taken = performance.now() - total_time_start;

    test_result_area.prepend("<strong>" + passed_tests.toString() + " of " +
        number_of_tests.toString() + " tests passed in " + total_ms_taken + "ms." + "</strong>");
    test_result_area.append("<p><br><br></p>");

    // Go to the top.  It's nice to see how many tests are passing
    $("html,body").scrollTop(0);
});