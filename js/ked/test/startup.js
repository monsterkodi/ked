var toExport = {}
var loading, s

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9zdGFydHVwLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7O09BQ08sYUFBUDtPQUFjLGNBQWQ7Ozs7OztpQkFNRSxLQUFLLGtCQUFrQixTQUFXO2NBRWpDLEtBQUs7Z0JBRVAsS0FBSyxRQUFRLFNBQVMsU0FBVztnQkFDakMsS0FBSyxRQUFRLE9BQVM7Ozs7UUFJdEIsVUFBVSxPQUFPO2lCQUVoQixPQUFPLGtCQUFrQixTQUFXO2NBRW5DO2NBQ0EsT0FBTztpQkFFUixPQUFPLFNBQVEsTUFBUTs7OztRQUl4QixRQUFRLFNBQVEsTUFBTTtpQkFFckIsRUFBRSxrQkFBa0IsU0FBVztjQUU5QixFQUFFIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/startup.kode
