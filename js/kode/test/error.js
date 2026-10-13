var toExport = {}
import utils from "./utils.js"
let kf = utils.kf

toExport["error"] = function ()
{
    compare(kf("✘"),true)
    compare(kf("r = some.call((some args)"),true)
    compare(kf("r = some.call(some args))"),true)
    compare(kf('log "▪▪#{id"'),true)
    compare(kf(`f = ->
    r = some.call(some args))
    log 'r' r
    r`),true)
}
toExport["error"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2Vycm9yLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztZQVlJLEdBQUksS0FBTTtZQUVWLEdBQUksNkJBQThCO1lBQ2xDLEdBQUksNkJBQThCO1lBQ2xDLEdBQUksZ0JBQWlCO1lBRXJCLEdBQUk7OztRQUtPIn0=
//# sourceURL=file://kode/kode/test/error.kode
