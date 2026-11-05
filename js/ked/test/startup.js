var toExport = {}
var loading, s

import mode from "../edit/mode.js"

import config from "../util/config.js"
import session from "../util/session.js"

import kxk from "../../kxk.js"
let watcher = kxk.watcher

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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9zdGFydHVwLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7O09BQ08sYUFBUDtPQUFjLGNBQWQ7O09BQ0csVUFBQTtJQUFNOzs7Ozs7aUJBTVAsS0FBSyxrQkFBa0IsU0FBVztjQUVqQyxLQUFLO2dCQUVQLEtBQUssUUFBUSxTQUFTLFNBQVc7Z0JBQ2pDLEtBQUssUUFBUSxPQUFTOzs7O1FBSXRCLFVBQVUsT0FBTztpQkFFaEIsT0FBTyxrQkFBa0IsU0FBVztjQUVuQztjQUNBLE9BQU87aUJBRVIsT0FBTyxTQUFRLE1BQVE7UUFFeEIsUUFBUTs7OztRQUlSLFFBQVEsU0FBUSxNQUFNO2lCQUVyQixFQUFFLGtCQUFrQixTQUFXO2NBRTlCLEVBQUUifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/startup.kode
