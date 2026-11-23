var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["spread"] = async function ()
{
    await section("call", async function ()
    {
        compare(kc('f a…'),'f(...a)')
        compare(kc('f a… b'),'f(...a,b)')
        compare(kc('f a … b'),'f(...a,b)')
        compare(kc('f(a, b…)'),'f(a,...b)')
        compare(kc('f(a b…)'),'f(a,...b)')
        compare(kc('new A b…'),'new A(...b)')
        compare(kc('f (a+b)…'),'f(...(a + b))')
        compare(kc('f a.b(c)[0]…'),'f(...a.b(c)[0])')
        compare(kc('f @a…'),'f(...this.a)')
        compare(kc('Math.max xs…'),'Math.max(...xs)')
        compare(ke('Math.max [3 9 4]…'),9)
        compare(ke('a = [1]\na.push [2 3]…\na'),[1,2,3])
        compare(ke('a = [1 4]\na.splice 1 0 [2 3]…\na'),[1,2,3,4])
    })
    await section("array", async function ()
    {
        compare(kc('x = [a b…]'),'x = [a,...b]')
        compare(kc('x = [a… b]'),'x = [...a,b]')
        compare(kc('x = [a … b … c]'),'x = [...a,...b,c]')
        compare(kc('x = a:[b…]'),'x = {a:[...b]}')
        compare(kc('x = [@a… [y… z…]]'),'x = [...this.a,[...y,...z]]')
        compare(ke('a = [1 2]\n[0 a… 3]'),[0,1,2,3])
        compare(ke('a = [1 2]\n[a… a…]'),[1,2,1,2])
    })
    await section("rest", async function ()
    {
        compare(kc('m: (a b…) -> 1'),'{m:function (a, ...b)\n{\n    return 1\n}}')
        compare(kc('m: (a b...) -> 1'),'{m:function (a, ...b)\n{\n    return 1\n}}')
        compare(kc('m: args… -> 1'),'{m:function (...args)\n{\n    return 1\n}}')
        compare(ke('f = (a b…) -> [a b]\nf 1 2 3'),[1,[2,3]])
        compare(ke('f = args… -> Math.max args…\nf 1 5 2'),5)
        compare(ke('f = args... -> [0 args…]\nf 1 2'),[0,1,2])
    })
}
toExport["spread"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByZWFkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zcHJlYWQua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTtJQUFHOzs7Ozs7UUFNbUIsUUFBNUIsR0FBRyxRQUEyQjtRQUNGLFFBQTVCLEdBQUcsVUFBMkI7UUFDRixRQUE1QixHQUFHLFdBQTJCO1FBQ0YsUUFBNUIsR0FBRyxZQUEyQjtRQUNGLFFBQTVCLEdBQUcsV0FBMkI7UUFDRixRQUE1QixHQUFHLFlBQTJCO1FBQ0YsUUFBNUIsR0FBRyxZQUEyQjtRQUNGLFFBQTVCLEdBQUcsZ0JBQTJCO1FBQ0YsUUFBNUIsR0FBRyxTQUEyQjtRQUNGLFFBQTVCLEdBQUcsZ0JBQTJCO1FBRWtCLFFBQWhELEdBQUcscUJBQStDO1FBQ0YsUUFBaEQsR0FBRyw4QkFBZ0QsRUFBRSxFQUFFO1FBQ1AsUUFBaEQsR0FBRyxzQ0FBZ0QsRUFBRSxFQUFFLEVBQUU7Ozs7UUFJN0IsUUFBNUIsR0FBRyxjQUEyQjtRQUNGLFFBQTVCLEdBQUcsY0FBMkI7UUFDRixRQUE1QixHQUFHLG1CQUEyQjtRQUNGLFFBQTVCLEdBQUcsY0FBMkI7UUFDRixRQUE1QixHQUFHLHFCQUEyQjtRQUVrQixRQUFoRCxHQUFHLHdCQUFnRCxFQUFFLEVBQUUsRUFBRTtRQUNULFFBQWhELEdBQUcsdUJBQWdELEVBQUUsRUFBRSxFQUFFOzs7O1FBSTdCLFFBQTVCLEdBQUcsa0JBQTJCO1FBQ0YsUUFBNUIsR0FBRyxvQkFBMkI7UUFDRixRQUE1QixHQUFHLGlCQUEyQjtRQUVrQixRQUFoRCxHQUFHLGlDQUFnRCxHQUFHLEVBQUU7UUFDUixRQUFoRCxHQUFHLHdDQUErQztRQUNGLFFBQWhELEdBQUcsb0NBQWdELEVBQUUsRUFBRSJ9
//# sourceURL=../../../kode/kode/test/spread.kode
