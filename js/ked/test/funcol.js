var toExport = {}
var e, f, h, ked_sess

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import funcol from "../view/colmns/funcol.js"


ked_sess = function ()
{
    var fakeGet, fakeSet, store

    store = {}
    fakeGet = function (key, def)
    {
        var _9_38_

        return ((_9_38_=store[key]) != null ? _9_38_ : def)
    }
    fakeSet = function (key, value)
    {
        return store[key] = value
    }
    return global.ked_session = {get:fakeGet,set:fakeSet}
}
toExport["funcol color picker"] = async function ()
{
    await section("a cursor on the hash picks the color", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(4,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#ff8000')
        delete global.ked_session
    })
    await section("a word that is not a color keeps the default and no replace mode", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = hello;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("submitting without changes keeps the original color string", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['c = #abc;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("an explicit show does not replace anything", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('#123456')
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("a selection color seeds the picker", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.setColorsForRanges([[0,0,5,0]],'#00ff00',null)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#00ff00')
        delete global.ked_session
    })
    await section("a selection keeps its existing background when only the foreground changes", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.setColorsForRanges([[0,0,5,0]],'#00ff00','#0000ff')
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.foregroundHex(),'#00ff00')
        compare(f.colorpicker.backgroundHex(),'#0000ff')
        f.colorpicker.submit('#00ff00')
        compare(e.state.s.colors.fg,[[0,0,5,'#00ff00']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
    await section("a changed background is applied on submit", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.radio.changeActive(1)
        f.colorpicker.setHex('#0000ff')
        compare(f.colorpicker.backgroundChanged(),true)
        f.colorpicker.submit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[[0,0,5,'#ff0000']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
    await section("an explicit color picker gets a width in a narrow terminal", async function ()
    {
        ked_sess()
        h = new harness({cols:80,rows:24})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines([''])
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.visible(),true)
        compare(f.cells.cols,16)
        f.layout(64,1,16,23)
        compare(f.colorpicker.cells.cols,16)
        delete global.ked_session
    })
    await section("the color picker grows when the palette is not empty", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines([''])
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.layout(0,0,16,29)
        compare(f.colorpicker.cells.rows,9)
        f.colorpicker.setHex('#ff0000')
        f.colorpicker.addCurrentColor()
        f.layout(0,0,16,29)
        compare(f.colorpicker.cells.rows,11)
        delete global.ked_session
    })
}
toExport["funcol color picker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2Z1bmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDVSxVQUFBO0lBQVc7O09BQ0EsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGFBQVQ7OztBQUVaOzs7O0lBQ0k7SUFDQSxvQkFBVyxLQUFJOzs7O3dCQUFRLE1BQU0seUJBQU87O0lBQ3BDLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxPQUFPOztXQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7Ozs7OztRQU1qQztRQUVBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztRQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsTUFBTSxXQUFXO1FBQ25CLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFFeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUV4QixFQUFFLGtCQUFrQjtnQkFFcEIsRUFBRSxZQUFZLE1BQVE7ZUFFZixPQUFPOzs7O1FBSWQ7UUFFQSxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsYUFBZTtlQUVWLE9BQU87Ozs7UUFJZDtRQUVBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztRQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsTUFBTSxXQUFXO1FBQ25CLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFFeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUV4QixFQUFFLGtCQUFrQjtRQUVwQixFQUFFLFlBQVksT0FBTyxFQUFFLFlBQVk7Z0JBRW5DLEtBQUssSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLElBQU07Z0JBQy9CLEVBQUUsYUFBZTtlQUVWLE9BQU87Ozs7UUFJZDtRQUVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funcol.kode
