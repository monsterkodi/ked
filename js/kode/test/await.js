var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["await"] = function ()
{
    compare(kc('await someFunctionCall()'),'await someFunctionCall()')
    compare(kc('await call(); await again()'),'await call()\nawait again()')
    compare(kc('await call 1; await again 2'),'await call(1)\nawait again(2)')
    compare(kc('d = { await:1 }'),'d = {await:1}')
    compare(kc("d = { '○':2 }"),"d = {'○':2}")
    compare(kc('d = await someFunc()'),'d = await someFunc()')
    compare(kc('○ async 1'),'await async(1)')
    compare(kc('    ○ async 2'),'await async(2)')
    compare(kc('    ○async 3'),'await async(3)')
    compare(kc('list = list.concat ○ fs.list(dir)'),`list = list.concat(await fs.list(dir))`)
    compare(kc("if ○ fs.remove 'blah' ➜ 2"),`if (await fs.remove('blah'))
{
    2
}`)
    compare(kc('d = ○ someFunc()'),'d = await someFunc()')
    compare(kc('d =○ someFunc()'),'d = await someFunc()')
    compare(kc('d = ○someFunc()'),'d = await someFunc()')
    compare(kc('if test ➜ ○ info()'),`if (test)
{
    await info()
}`)
    compare(kc('if test ➜ ○info()'),`if (test)
{
    await info()
}`)
    compare(kc('if test ➜○ info()'),`if (test)
{
    await info()
}`)
}
toExport["await"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdhaXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2F3YWl0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFZSSxHQUFHLDRCQUFrQztZQUNyQyxHQUFHLCtCQUFrQztZQUNyQyxHQUFHLCtCQUFrQztZQUVyQyxHQUFHLG1CQUFvQjtZQUN2QixHQUFHLGlCQUFrQjtZQUVyQixHQUFHLHdCQUF5QjtZQUU1QixHQUFHLGFBQWM7WUFDakIsR0FBRyxpQkFBa0I7WUFDckIsR0FBRyxnQkFBaUI7WUFNcEIsR0FBRyxxQ0FBc0M7WUFJekMsR0FBRyw2QkFBOEI7Ozs7WUFPakMsR0FBRyxvQkFBcUI7WUFDeEIsR0FBRyxtQkFBb0I7WUFDdkIsR0FBRyxtQkFBb0I7WUFFdkIsR0FBRyxzQkFBdUI7Ozs7WUFNMUIsR0FBRyxxQkFBc0I7Ozs7WUFNekIsR0FBRyxxQkFBc0IifQ==
//# sourceURL=kode/kode/test/await.kode
