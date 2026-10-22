var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var known, tool

import clip from "../clip.js"

toExport["clip"] = async function ()
{
    await section("has", async function ()
    {
        compare(clip.has(''),false)
        compare(clip.has('definitely-not-a-tool'),false)
        compare(clip.has('sh'),true)
    })
    await section("detect", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9jbGlwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BVVMsV0FBQTs7Ozs7O2dCQVFELEtBQUssSUFBSSxJQUEwQjtnQkFDbkMsS0FBSyxJQUFJLHlCQUEwQjtnQkFDbkMsS0FBSyxJQUFJLE1BQTBCOzs7O1FBSW5DLE9BQU8sS0FBSztRQUNaLGVBQVEsTUFBUyxLQUFLLE9BQU8sUUFBUTtnQkFDckMsTUFBUTtnQkFHUixLQUFLLFNBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/clip.kode
