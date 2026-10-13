var toExport = {}
import utils from "./utils.js"
let ast = utils.ast

toExport["ast"] = function ()
{
    section("simple", function ()
    {
        compare(ast('a'),'a')
        compare(ast('1'),'1')
        compare(ast('no'),'no')
        compare(ast('1;2'),'1\n2')
    })
    section("operation", function ()
    {
        compare(ast('a and b'),`operation
    lhs
        a
    operator
        and
    rhs
        b`)
        compare(ast('1 + 2'),`operation
    lhs
        1
    operator
        +
    rhs
        2`)
        compare(ast('++a'),`operation
    operator
        ++
    rhs
        a`)
        compare(ast('not a'),`operation
    operator
        not
    rhs
        a`)
        compare(ast('a = b + 1'),`operation
    lhs
        a
    operator
        =
    rhs
        operation
            lhs
                b
            operator
                +
            rhs
                1`)
        compare(ast('a = b = c'),`operation
    lhs
        a
    operator
        =
    rhs
        operation
            lhs
                b
            operator
                =
            rhs
                c`)
        compare(ast('for a in l then a'),`for
    vals
        a
    inof
        in
    list
        l
    then
        a`)
    })
}
toExport["ast"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9hc3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBYVEsSUFBSSxLQUFTO2dCQUNiLElBQUksS0FBUztnQkFDYixJQUFJLE1BQVM7Z0JBQ2IsSUFBSSxPQUFTOzs7O2dCQUliLElBQUksV0FDQTs7Ozs7OztnQkFVSixJQUFJLFNBQ0E7Ozs7Ozs7Z0JBVUosSUFBSSxPQUNBOzs7OztnQkFRSixJQUFJLFNBQ0E7Ozs7O2dCQVFKLElBQUksYUFDQTs7Ozs7Ozs7Ozs7OztnQkFnQkosSUFBSSxhQUNBOzs7Ozs7Ozs7Ozs7O2dCQWdCSixJQUFJLHFCQUNBIn0=
//# sourceURL=file://kode/kode/test/ast.kode
