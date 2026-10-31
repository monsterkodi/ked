var toExport = {}
var s

import slash from "../../kxk/slash.js"

import session from "../util/session.js"

toExport["session"] = async function ()
{
    await section("a terminal session uses the terminal session directory", async function ()
    {
        s = new session({fresh:true})
        compare(s.headless,false)
        compare(s.dir,slash.absolute("~/.config/ked/sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
    })
    await section("a headless session uses its own directory", async function ()
    {
        s = new session({fresh:true,headless:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
    })
    await section("a colored headless session uses the headless directory", async function ()
    {
        s = new session({fresh:true,colors:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
    })
}
toExport["session"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9zZXNzaW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNnQixZQUFOOztPQUNNLGNBQVQ7Ozs7OztRQU1DLFFBQVEsU0FBUSxNQUFNO2dCQUV0QixFQUFFLFNBQVc7Z0JBQ2IsRUFBRSxJQUFNLE1BQU0sU0FBUztnQkFDdkIsRUFBRSxLQUFPLE1BQU0sS0FBSyxFQUFFLE9BQU8sRUFBRTs7OztRQUkvQixRQUFRLFNBQVEsTUFBTSxLQUFLLFNBQVM7Z0JBRXBDLEVBQUUsU0FBVztnQkFDYixFQUFFLElBQU0sTUFBTSxTQUFTO2dCQUN2QixFQUFFLEtBQU8sTUFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFOzs7O1FBSS9CLFFBQVEsU0FBUSxNQUFNLEtBQUssT0FBTztnQkFFbEMsRUFBRSxTQUFXO2dCQUNiLEVBQUUsSUFBTSxNQUFNLFNBQVMifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/session.kode
