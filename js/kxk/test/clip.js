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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9jbGlwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O2dCQWtCUSxLQUFLLElBQUksSUFBMEI7Z0JBQ25DLEtBQUssSUFBSSx5QkFBMEI7Z0JBQ25DLEtBQUssSUFBSSxNQUEwQjs7OztRQUluQyxPQUFPLEtBQUs7UUFDWixlQUFRLE1BQVMsS0FBSyxPQUFPLFFBQVE7Z0JBQ3JDLE1BQVE7Z0JBR1IsS0FBSyxTQUFXIn0=
//# sourceURL=kode/kxk/test/clip.kode
