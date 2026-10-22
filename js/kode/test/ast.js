var toExport = {}
import utils from "./utils.js"
let ast = utils.ast

toExport["ast"] = async function ()
{
    await section("simple", async function ()
    {
        compare(ast('a'),'a')
        compare(ast('1'),'1')
        compare(ast('no'),'no')
        compare(ast('1;2'),'1\n2')
    })
    await section("operation", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9hc3Qua29kZSJdLCJtYXBwaW5ncyI6IjtPQU9NLFlBQUE7SUFBUTs7Ozs7O2dCQU1OLElBQUksS0FBUztnQkFDYixJQUFJLEtBQVM7Z0JBQ2IsSUFBSSxNQUFTO2dCQUNiLElBQUksT0FBUzs7OztnQkFJYixJQUFJLFdBQ0E7Ozs7Ozs7Z0JBVUosSUFBSSxTQUNBOzs7Ozs7O2dCQVVKLElBQUksT0FDQTs7Ozs7Z0JBUUosSUFBSSxTQUNBOzs7OztnQkFRSixJQUFJLGFBQ0E7Ozs7Ozs7Ozs7Ozs7Z0JBZ0JKLElBQUksYUFDQTs7Ozs7Ozs7Ozs7OztnQkFnQkosSUFBSSxxQkFDQSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/ast.kode
