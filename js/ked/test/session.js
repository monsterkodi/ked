var toExport = {}
var dir, loading, s, s2

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"
import watcher from "../../kxk/watcher.js"

import mode from "../edit/mode.js"

import config from "../util/config.js"
import session from "../util/session.js"

toExport["startup"] = async function ()
{
    await section("the modes announce when they are loaded", async function ()
    {
        compare((mode.loaded instanceof Promise),true)
        await mode.loaded
        compare(mode.names().includes('novim'),true)
        compare(mode.pending.length,0)
    })
    await section("the config announces when it is loaded", async function ()
    {
        loading = config.load()
        compare((config.loaded instanceof Promise),true)
        await loading
        await config.loaded
        compare((config.data !== null),true)
        watcher.close()
    })
    await section("the session announces when it is loaded", async function ()
    {
        s = new session({fresh:true})
        compare((s.loaded instanceof Promise),true)
        await s.loaded
    })
}
toExport["startup"]._section_ = true
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
        s = new session({fresh:true,headless_colors:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
    })
    await section("novim command line history is loaded again", async function ()
    {
        dir = '/tmp/opencode/ked-session-history-test'
        await nfs.remove(dir)
        s = new session({fresh:true})
        s.dir = dir
        s.file = slash.path(dir,'history.noon')
        s.set('novim▸history▸ex',['w','foo'])
        s.set('novim▸history▸search',['bar'])
        await s.save()
        s2 = new session({fresh:true})
        s2.dir = dir
        s2.file = slash.path(dir,'other.noon')
        await s2.loadAndMerge()
        compare(s2.get('novim▸history▸ex'),['w','foo'])
        compare(s2.get('novim▸history▸search'),['bar'])
        s2.clear()
        await nfs.remove(dir)
    })
}
toExport["session"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9zZXNzaW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNnQixVQUFOO09BQVUsWUFBVjtPQUFnQixjQUFoQjs7T0FDTSxXQUFUOztPQUNTLGFBQVQ7T0FBZ0IsY0FBaEI7Ozs7OztpQkFNRSxLQUFLLGtCQUFrQixTQUFXO2NBRWpDLEtBQUs7Z0JBRVAsS0FBSyxRQUFRLFNBQVMsU0FBVztnQkFDakMsS0FBSyxRQUFRLE9BQVM7Ozs7UUFJdEIsVUFBVSxPQUFPO2lCQUVoQixPQUFPLGtCQUFrQixTQUFXO2NBRW5DO2NBQ0EsT0FBTztpQkFFUixPQUFPLFNBQVEsTUFBUTtRQUV4QixRQUFROzs7O1FBSVIsUUFBUSxTQUFRLE1BQU07aUJBRXJCLEVBQUUsa0JBQWtCLFNBQVc7Y0FFOUIsRUFBRTs7Ozs7Ozs7UUFNSixRQUFRLFNBQVEsTUFBTTtnQkFFdEIsRUFBRSxTQUFXO2dCQUNiLEVBQUUsSUFBTSxNQUFNLFNBQVM7Z0JBQ3ZCLEVBQUUsS0FBTyxNQUFNLEtBQUssRUFBRSxPQUFPLEVBQUU7Ozs7UUFJL0IsUUFBUSxTQUFRLE1BQU0sS0FBSyxTQUFTO2dCQUVwQyxFQUFFLFNBQVc7Z0JBQ2IsRUFBRSxJQUFNLE1BQU0sU0FBUztnQkFDdkIsRUFBRSxLQUFPLE1BQU0sS0FBSyxFQUFFLE9BQU8sRUFBRTs7OztRQUkvQixRQUFRLFNBQVEsTUFBTSxLQUFLLGdCQUFnQjtnQkFFM0MsRUFBRSxTQUFXO2dCQUNiLEVBQUUsSUFBTSxNQUFNLFNBQVM7Ozs7UUFJdkIsTUFBTTtjQUVKLElBQUksT0FBTztRQUViLFFBQVEsU0FBUSxNQUFNO1FBRXRCLEVBQUUsTUFBTztRQUNULEVBQUUsT0FBTyxNQUFNLEtBQUssSUFBSTtRQUV4QixFQUFFLElBQUksb0JBQXFCLElBQUk7UUFDL0IsRUFBRSxJQUFJLHdCQUF5QjtjQUU3QixFQUFFO1FBRUosU0FBUyxTQUFRLE1BQU07UUFFdkIsR0FBRyxNQUFPO1FBQ1YsR0FBRyxPQUFPLE1BQU0sS0FBSyxJQUFJO2NBRXZCLEdBQUc7Z0JBRUwsR0FBRyxJQUFJLHFCQUEyQixJQUFJO2dCQUN0QyxHQUFHLElBQUkseUJBQTJCO1FBRWxDLEdBQUc7Y0FFRCxJQUFJLE9BQU8ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/session.kode
