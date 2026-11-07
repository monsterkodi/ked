var toExport = {}
var h, p, pal

import harness from "../util/harness.js"

import palette from "../view/base/palette.js"


pal = function (cols, colors)
{
    var h, p

    h = new harness({cols:cols,rows:2})
    p = new palette(h.screen,'test_palette')
    p.layout(0,0,cols,1)
    p.setColors(colors)
    p.draw()
    return [h,p]
}
toExport["palette"] = async function ()
{
    await section("a cell shows its color", async function ()
    {
        var _a_ = pal(20,['#ff0000','#00ff00']); h = _a_[0]; p = _a_[1]

        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
    })
    await section("one narrow cell keeps all the cells from showing their hex value", async function ()
    {
        var _b_ = pal(20,['#ff0000','#00ff00','#0000ff']); h = _b_[0]; p = _b_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
        compare(h.row(0).includes('#0000ff'),false)
    })
    await section("a narrow cell shows no hex value", async function ()
    {
        var _c_ = pal(10,['#ff0000','#00ff00']); h = _c_[0]; p = _c_[1]

        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("the palette has rounded edges", async function ()
    {
        var _d_ = pal(20,['#ff0000']); h = _d_[0]; p = _d_[1]

        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
    })
    await section("an empty palette has no cells", async function ()
    {
        var _e_ = pal(20,[]); h = _e_[0]; p = _e_[1]

        compare(p.options.length,0)
        compare(h.screen.get_bg(0,0),[])
    })
}
toExport["palette"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wYWxldHRlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNtQixjQUFaOztPQUNZLGNBQVA7OztBQUVaLGdCQUFPLE1BQUs7Ozs7SUFFUixRQUFRLFNBQVEsS0FBSyxLQUFLLEtBQUs7SUFDL0IsUUFBUSxRQUFRLEVBQUUsT0FBTztJQUV6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUs7SUFDbEIsRUFBRSxVQUFVO0lBQ1osRUFBRTtZQUVELEVBQUU7Ozs7OztrQkFNUyxJQUFJLElBQUksVUFBVSxhQUF6QixZQUFFOztnQkFFSCxFQUFFLE9BQU8sT0FBTyxFQUFFLElBQU0sSUFBSSxFQUFFO2dCQUM5QixFQUFFLE9BQU8sT0FBTyxHQUFHLElBQU0sRUFBRSxJQUFJOzs7O2tCQUl2QixJQUFJLElBQUksVUFBVSxVQUFVLGFBQW5DLFlBQUU7O2dCQUVILEVBQUUsSUFBSSxHQUFHLFNBQVMsV0FBYTtnQkFDL0IsRUFBRSxJQUFJLEdBQUcsU0FBUyxXQUFhO2dCQUMvQixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Ozs7a0JBSXZCLElBQUksSUFBSSxVQUFVLGFBQXpCLFlBQUU7O2dCQUVILEVBQUUsSUFBSSxHQUFHLFNBQVMsV0FBYTtnQkFDL0IsRUFBRSxJQUFJLEdBQUcsU0FBUyxXQUFhOzs7O2tCQUl2QixJQUFJLElBQUksYUFBZixZQUFFOztnQkFFSCxFQUFFLE9BQU8sU0FBUyxFQUFFLEdBQUs7Z0JBQ3pCLEVBQUUsT0FBTyxTQUFTLEdBQUcsR0FBSzs7OztrQkFJbEIsSUFBSSxRQUFYLFlBQUU7O2dCQUVILEVBQUUsUUFBUSxPQUFTO2dCQUNuQixFQUFFLE9BQU8sT0FBTyxFQUFFIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/palette.kode
