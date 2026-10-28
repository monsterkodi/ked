var toExport = {}
var loading

import mode from "../edit/mode.js"

import config from "../util/config.js"

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
}
toExport["startup"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9zdGFydHVwLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQVFjLFdBQVA7O09BQ08sYUFBUDs7Ozs7O2lCQU1FLEtBQUssa0JBQWtCLFNBQVc7Y0FFakMsS0FBSztnQkFFUCxLQUFLLFFBQVEsU0FBUyxTQUFXO2dCQUNqQyxLQUFLLFFBQVEsT0FBUzs7OztRQUl0QixVQUFVLE9BQU87aUJBRWhCLE9BQU8sa0JBQWtCLFNBQVc7Y0FFbkM7Y0FDQSxPQUFPO2lCQUVSLE9BQU8sU0FBUSxNQUFRIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/startup.kode
