var toExport = {}
var delayed

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

import kxk from "../../kxk.js"
let sleep = kxk.sleep


delayed = async function (value)
{
    await sleep(1)
    return value
}
toExport["await"] = async function ()
{
    compare(kc('await someFunctionCall()'),'await someFunctionCall()')
    compare(kc('await call(); await again()'),'await call()\nawait again()')
    compare(kc('await call 1; await again 2'),'await call(1)\nawait again(2)')
    compare(kc('d = { await:1 }'),'d = {await:1}')
    compare(kc("d = { '◯':2 }"),"d = {'◯':2}")
    compare(kc('d = await someFunc()'),'d = await someFunc()')
    compare(kc('◯ async 1'),'await async(1)')
    compare(kc('    ◯ async 2'),'await async(2)')
    compare(kc('    ◯async 3'),'await async(3)')
    compare(kc('list = list.concat ◯ fs.list(dir)'),`list = list.concat(await fs.list(dir))`)
    compare(kc("if ◯ fs.remove 'blah' ➜ 2"),`if (await fs.remove('blah'))
{
    2
}`)
    compare(kc('d = ◯ someFunc()'),'d = await someFunc()')
    compare(kc('d =◯ someFunc()'),'d = await someFunc()')
    compare(kc('d = ◯someFunc()'),'d = await someFunc()')
    compare(kc('if test ➜ ◯ info()'),`if (test)
{
    await info()
}`)
    compare(kc('if test ➜ ◯info()'),`if (test)
{
    await info()
}`)
    compare(kc('if test ➜◯ info()'),`if (test)
{
    await info()
}`)
    await section("the async comparison", async function ()
    {
        compare(kc('x ◯▸ y'),'compare(await (x),await (y))')
        compare(kc('x ▸ y'),'compare(x,y)')
    })
    await section("an async comparison waits for both sides", async function ()
    {
        compare(await (delayed(42)),await (42))
    })
}
toExport["await"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdhaXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2F3YWl0LmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNNLFlBQUE7SUFBUTtJQUFHOztPQUNQLFVBQUE7SUFBTTs7O0FBRWhCLDBCQUFVOztVQUNKLE1BQU07V0FDUjs7OztJQUltQyxRQUFuQyxHQUFHLDRCQUFrQztJQUNGLFFBQW5DLEdBQUcsK0JBQWtDO0lBQ0YsUUFBbkMsR0FBRywrQkFBa0M7SUFFaEIsUUFBckIsR0FBRyxtQkFBb0I7SUFDSixRQUFuQixHQUFHLGlCQUFrQjtJQUVLLFFBQTFCLEdBQUcsd0JBQXlCO0lBRWIsUUFBZixHQUFHLGFBQWM7SUFDRSxRQUFuQixHQUFHLGlCQUFrQjtJQUNILFFBQWxCLEdBQUcsZ0JBQWlCO0lBTW1CLFFBQXZDLEdBQUcscUNBQXNDO0lBSVYsUUFBL0IsR0FBRyw2QkFBOEI7Ozs7SUFPWCxRQUF0QixHQUFHLG9CQUFxQjtJQUNILFFBQXJCLEdBQUcsbUJBQW9CO0lBQ0YsUUFBckIsR0FBRyxtQkFBb0I7SUFFQyxRQUF4QixHQUFHLHNCQUF1Qjs7OztJQU1ILFFBQXZCLEdBQUcscUJBQXNCOzs7O0lBTUYsUUFBdkIsR0FBRyxxQkFBc0I7Ozs7OztRQVNULFFBQVosR0FBRyxVQUFXO1FBQ0QsUUFBYixHQUFHLFNBQVk7Ozs7UUFJSixlQUFYLFFBQVEsWUFBTSJ9
//# sourceURL=../../../kode/kode/test/await.kode
