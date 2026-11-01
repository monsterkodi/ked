var toExport = {}
var keep, lines

import leak from "../util/leak.js"

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9sZWFrLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7Ozs7OztRQU1DO1FBQ0EsT0FBTyxRQUFRO1FBQ2YsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxLQUFLLE9BQU0sU0FBUztZQUVRLEtBQUs7O1lBQWpDLGNBQWMsS0FBSzs7UUFDbkIsS0FBSyxRQUFRO1FBRWIsUUFBUSxNQUFNO2dCQUVkLE1BQU0sT0FBUzs7OztRQUlmO1FBQ0EsT0FBTyxRQUFRO1FBQ2YsUUFBUSxnQkFBTzs7bUJBQVksTUFBTSxLQUFLOztRQUV0QyxLQUFLLE9BQU0sZ0JBQWdCO1lBRUMsS0FBSzs7WUFBakMsY0FBYyxLQUFLOztRQUNuQixLQUFLLFFBQVE7UUFFYixRQUFRLE1BQU07Z0JBRWQsTUFBTSxPQUFTIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/leak.kode
