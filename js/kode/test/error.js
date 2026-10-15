var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var errmsg, m, out, threw

import utils from "./utils.js"
let kf = utils.kf
let kc = utils.kc


errmsg = function (c)
{
    try
    {
        kc(c,'err.kode')
        return ''
    }
    catch (err)
    {
        return String(err)
    }
}

threw = function (c)
{
    try
    {
        kc(c,'err.kode')
        return false
    }
    catch (err)
    {
        return true
    }
}
toExport["error"] = function ()
{
    section("fail", function ()
    {
        compare(kf("✘"),true)
        compare(kf("r = some.call((some args)"),true)
        compare(kf("r = some.call(some args))"),true)
        compare(kf('log "▪▪#{id"'),true)
        compare(kf(`f = ->
    r = some.call(some args))
    log 'r' r
    r`),true)
    })
    section("valid code compiles", function ()
    {
        compare(threw('a = 1\nb = a + 2\n'),false)
    })
    section("valid code emits js", function ()
    {
        out = kc('a = 1\nb = a + 2\n','err.kode')
        compare(_k_.in('a = 1',out),true)
    })
    section("missing close paren", function ()
    {
        m = errmsg('x = (1 + 2\n')
        compare(_k_.in('missing closing )',m),true)
    })
    section("missing close bracket", function ()
    {
        m = errmsg('x = [1, 2\n')
        compare(_k_.in('missing closing ]',m),true)
    })
    section("names the file", function ()
    {
        m = errmsg('x = (1\n')
        compare(_k_.in('err.kode',m),true)
    })
}
toExport["error"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2Vycm9yLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTs7OztRQUdRLEdBQUcsRUFBRTtlQUNMOztXQUNFOztlQUNGLE9BQU87Ozs7QUFFZjs7OztRQUdRLEdBQUcsRUFBRztlQUNOOztXQUNFOztlQUNGOzs7Ozs7O2dCQU1BLEdBQUksS0FBTTtnQkFFVixHQUFJLDZCQUE4QjtnQkFDbEMsR0FBSSw2QkFBOEI7Z0JBQ2xDLEdBQUksZ0JBQWlCO2dCQUVyQixHQUFJOzs7UUFLTzs7OztnQkFJVixNQUFNLHNCQUF3Qjs7OztRQUk5QixNQUFNLEdBQUcscUJBQXFCO3VCQUM5QixRQUFXLEtBQU87Ozs7UUFJbkIsSUFBSSxPQUFPO3VCQUNYLG9CQUF1QixHQUFLOzs7O1FBSTVCLElBQUksT0FBTzt1QkFDWCxvQkFBdUIsR0FBSzs7OztRQUk1QixJQUFJLE9BQU87dUJBQ1gsV0FBYyxHQUFLIn0=
//# sourceURL=file://kode/kode/test/error.kode
