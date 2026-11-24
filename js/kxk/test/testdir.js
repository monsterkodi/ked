var toExport = {}
var base, childRoot, dir, other, root

import fs from "fs"
import os from "os"
import child_process from "child_process"

import slash from "../slash.js"
import testdir from "../testdir.js"


childRoot = function ()
{
    var code, out

    code = "import testdir from './js/kxk/testdir.js'; console.log(testdir())"
    out = child_process.execFileSync('node',['--input-type=module','-e',code],{encoding:'utf8'})
    return out.trim()
}
toExport["testdir"] = async function ()
{
    await section("the root is a fresh directory in the system temp dir", async function ()
    {
        root = testdir()
        compare(fs.existsSync(root),true)
        compare(slash.dir(root),slash.path(os.tmpdir()))
        compare(slash.file(root).startsWith('ked-test-'),true)
    })
    await section("it is the same root for the whole process", async function ()
    {
        compare(testdir(),testdir())
    })
    await section("a name is a path below the root, and it is not created", async function ()
    {
        dir = testdir('some-name')
        compare(dir,slash.path(testdir(),'some-name'))
        compare(fs.existsSync(dir),false)
    })
    await section("the id is the name of the root, for things that must live elsewhere", async function ()
    {
        compare(testdir.id(),slash.file(testdir()))
    })
    await section("another base gets its own root below that base", async function ()
    {
        base = slash.path(testdir(),'base')
        dir = testdir('x',base)
        compare(slash.dir(slash.dir(dir)),base)
        compare(slash.file(slash.dir(dir)).startsWith('ked-test-'),true)
        compare(testdir('x',base),dir)
    })
    await section("another process gets another root, and removes it when it exits", async function ()
    {
        other = childRoot()
        compare(other !== testdir(),true)
        compare(slash.dir(other),slash.dir(testdir()))
        compare(fs.existsSync(other),false)
    })
}
toExport["testdir"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGRpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC90ZXN0ZGlyLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7T0FBRyxTQUFBO09BQUcsb0JBQUE7O09BQ0QsWUFBQTtPQUFNLGNBQUE7OztBQUVmOzs7O0lBRUksT0FBTztJQUNQLE1BQU0sY0FBYyxhQUFhLFFBQVEsc0JBQXNCLEtBQUssT0FBTSxTQUFTO1dBQ25GLElBQUk7Ozs7OztRQU1BLE9BQU87UUFFa0MsUUFBekMsR0FBRyxXQUFXLE1BQTZCO1FBQ0YsUUFBekMsTUFBTSxJQUFJLE1BQWlDLE1BQU0sS0FBSyxHQUFHO1FBQ2hCLFFBQXpDLE1BQU0sS0FBSyxNQUFNLFdBQVcsYUFBZTs7OztRQUlqQyxRQUFWLFVBQVk7Ozs7UUFJWixNQUFNLFFBQVE7UUFFSyxRQUFuQixJQUFxQixNQUFNLEtBQUssVUFBVTtRQUN2QixRQUFuQixHQUFHLFdBQVcsS0FBTzs7OztRQUlSLFFBQWIsUUFBUSxLQUFPLE1BQU0sS0FBSzs7OztRQUkxQixPQUFPLE1BQU0sS0FBSyxVQUFVO1FBQzVCLE1BQU8sUUFBUSxJQUFJO1FBRWUsUUFBbEMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFnQjtRQUNlLFFBQW5ELE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTSxXQUFXLGFBQWU7UUFDbEIsUUFBbkMsUUFBUSxJQUFJLE1BQXlCOzs7O1FBSXJDLFFBQVE7UUFFZSxRQUF2QixVQUFTLFVBQWdCO1FBQ0YsUUFBdkIsTUFBTSxJQUFJLE9BQWUsTUFBTSxJQUFJO1FBQ1osUUFBdkIsR0FBRyxXQUFXLE9BQVcifQ==
//# sourceURL=../../../kode/kxk/test/testdir.kode
