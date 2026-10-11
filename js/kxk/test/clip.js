var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var known, tool

import clip from "../clip.js"

toExport["clip"] = function ()
{
    section("has", function ()
    {
        compare(clip.has(''),false)
        compare(clip.has('definitely-not-a-tool'),false)
        compare(clip.has('sh'),true)
    })
    section("detect", function ()
    {
        tool = clip.detect()
        known = _k_.in(tool,['wl','xsel','xclip','none'])
        compare(known,true)
        compare(clip.detect(),tool)
    })
}
toExport["clip"]._section_ = true
toExport._test_ = true
export default toExport
