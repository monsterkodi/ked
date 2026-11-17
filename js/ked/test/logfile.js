var toExport = {}
var before, closed, keep, lines, log

import leak from "../util/leak.js"
import logfile from "../util/logfile.js"

toExport["logfile"] = async function ()
{
    await section("a headless logfile leaves the console alone", async function ()
    {
        before = [console.log,console.warn,console.error]
        log = new logfile('test',true)
        compare(log.stream,undefined)
        compare((console.log === before[0]),true)
        compare((console.warn === before[1]),true)
        compare((console.error === before[2]),true)
    })
    await section("a headless logfile writes nowhere", async function ()
    {
        log = new logfile('test',true)
        log.write('nothing happens')
    })
    await section("a headless logfile still closes", async function ()
    {
        log = new logfile('test',true)
        closed = false
        log.close(function ()
        {
            return closed = true
        })
        compare(closed,true)
    })
}
toExport["logfile"]._section_ = true
toExport["leak"] = async function ()
{
    await section("a headless run samples nothing", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({headless:true})
        if (leak.timer)
        {
            clearInterval(leak.timer)
        }
        leak.timer = null
        console.log = keep
        compare(lines.length,0)
    })
    await section("a colored headless run samples nothing", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({headless_colors:true})
        if (leak.timer)
        {
            clearInterval(leak.timer)
        }
        leak.timer = null
        console.log = keep
        compare(lines.length,0)
    })
}
toExport["leak"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZmlsZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9sb2dmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7T0FBWSxjQUFaOzs7Ozs7UUFNQyxVQUFVLFFBQVEsSUFBSSxRQUFRLEtBQUssUUFBUTtRQUMzQyxVQUFVLFFBQVEsT0FBTztnQkFFekIsSUFBSSxPQUFTO2lCQUNaLFFBQVEsUUFBTyxPQUFPLElBQU07aUJBQzVCLFFBQVEsU0FBUSxPQUFPLElBQU07aUJBQzdCLFFBQVEsVUFBUyxPQUFPLElBQU07Ozs7UUFJL0IsVUFBVSxRQUFRLE9BQU87UUFFekIsSUFBSSxNQUFNOzs7O1FBSVYsVUFBVSxRQUFRLE9BQU87UUFDekIsU0FBUztRQUVULElBQUk7O21CQUFTLFNBQVM7O2dCQUV0QixPQUFTOzs7Ozs7OztRQU1UO1FBQ0EsT0FBTyxRQUFRO1FBQ2YsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxLQUFLLE9BQU0sU0FBUztZQUVRLEtBQUs7O1lBQWpDLGNBQWMsS0FBSzs7UUFDbkIsS0FBSyxRQUFRO1FBRWIsUUFBUSxNQUFNO2dCQUVkLE1BQU0sT0FBUzs7OztRQUlmO1FBQ0EsT0FBTyxRQUFRO1FBQ2YsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxLQUFLLE9BQU0sZ0JBQWdCO1lBRUMsS0FBSzs7WUFBakMsY0FBYyxLQUFLOztRQUNuQixLQUFLLFFBQVE7UUFFYixRQUFRLE1BQU07Z0JBRWQsTUFBTSxPQUFTIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/logfile.kode
