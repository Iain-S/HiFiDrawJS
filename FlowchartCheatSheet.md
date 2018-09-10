## Meta-syntax
{} means that it is optional.  Everything else is literal

| Node Type     | Description                                     |
| ------------- | ----------------------------------------------- |
| start         | Oval start object                               |
| end           | Oval end object                                 |
| parallel      | The start of a parallel route (rectangular)     |
| condition     | A customisable condition block (diamond)        |
| operation     | A standard operation (rectangular)              |
| inputoutput   | An input/output block (parallelogram)           |

## Node syntax
node_name=>node_type: Label{:>optional_link}
e.g.
TheStart=>start: YouStartHere:>www.google.com
AParallel=>parallel: Some words

## Wiring Syntax
node_name->node_name{->node_name}
e.g. TheStart->MyOperation
e.g. MyOperation->TheStart

parallel_node_name(path_name, direction)->node_name{->node_name}
e.g. AParallel(path1, right)->TheStart


## Example 1
st=>start: Start1:>http://www.google.com[blank]
tt=>start: Start2:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->tt->para
para(path1, left)->io->e
para(path2, right)->op1->e

## Example 2
st=>start: RCA:>http://www.google.com[blank]
tt=>start: RCA<->RCA:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
op2=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: My Start

para(path1, left)->st->op1
para(path2, right)->tt->op1