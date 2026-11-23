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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9hc3Qua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTs7Ozs7O1FBTUssUUFBWCxJQUFJLEtBQVM7UUFDRixRQUFYLElBQUksS0FBUztRQUNGLFFBQVgsSUFBSSxNQUFTO1FBQ0YsUUFBWCxJQUFJLE9BQVM7Ozs7UUFJQyxRQUFkLElBQUksV0FDQTs7Ozs7OztRQVVRLFFBQVosSUFBSSxTQUNBOzs7Ozs7O1FBVU0sUUFBVixJQUFJLE9BQ0E7Ozs7O1FBUVEsUUFBWixJQUFJLFNBQ0E7Ozs7O1FBUVksUUFBaEIsSUFBSSxhQUNBOzs7Ozs7Ozs7Ozs7O1FBZ0JZLFFBQWhCLElBQUksYUFDQTs7Ozs7Ozs7Ozs7OztRQWdCb0IsUUFBeEIsSUFBSSxxQkFDQSJ9
//# sourceURL=../../../kode/kode/test/ast.kode
