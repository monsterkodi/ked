var toExport = {}
var e, f, fakeGet, fakeSet, h, store

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import funcol from "../view/colmns/funcol.js"

toExport["funcol color picker"] = async function ()
{
    await section("an empty show picks the color under the cursor", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _12_42_

            return ((_12_42_=store[key]) != null ? _12_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#ff8000')
        compare(f.colorReplace.text,'#ff8000')
        compare(f.colorReplace.range,[4,0,11,0])
        delete global.ked_session
    })
    await section("a cursor on the hash picks the color", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _34_42_

            return ((_34_42_=store[key]) != null ? _34_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
        store = {}
        fakeGet = function (key, def)
        {
            var _54_42_

            return ((_54_42_=store[key]) != null ? _54_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = hello;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#ff0000')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("submitting replaces the original color", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _75_42_

            return ((_75_42_=store[key]) != null ? _75_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.onColorPickerSubmit('#00ff00')
        compare(kseg.str(e.state.s.lines[0]),'x = #00ff00;')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("a short color is replaced with the full hex", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _97_42_

            return ((_97_42_=store[key]) != null ? _97_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['c = #abc;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorReplace.text,'#abc')
        f.onColorPickerSubmit('#ff0000')
        compare(kseg.str(e.state.s.lines[0]),'c = #ff0000;')
        delete global.ked_session
    })
    await section("submitting without changes keeps the original color string", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _121_42_

            return ((_121_42_=store[key]) != null ? _121_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['c = #abc;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.onColorPickerSubmit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("an explicit show does not replace anything", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _144_42_

            return ((_144_42_=store[key]) != null ? _144_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('#123456')
        compare(f.colorReplace,null)
        f.onColorPickerSubmit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("a selection without a color literal becomes a color selection", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _168_42_

            return ((_168_42_=store[key]) != null ? _168_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorReplace,null)
        compare(f.colorDecorate.ranges,[[0,0,5,0]])
        f.onColorPickerSubmit('#ff0000')
        compare(e.state.s.colors.fg,[[0,0,5,'#ff0000']])
        compare(e.state.s.colors.bg,[])
        compare(f.colorDecorate,null)
        delete global.ked_session
    })
    await section("a color literal wins over a selection", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _196_42_

            return ((_196_42_=store[key]) != null ? _196_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setSelections([[4,0,11,0]])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorDecorate,null)
        compare(f.colorReplace.text,'#ff8000')
        f.onColorPickerSubmit('#00ff00')
        compare(kseg.str(e.state.s.lines[0]),'x = #00ff00;')
        compare(e.state.s.colors.fg,[])
        delete global.ked_session
    })
    await section("a selection color seeds the picker", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _223_42_

            return ((_223_42_=store[key]) != null ? _223_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
        store = {}
        fakeGet = function (key, def)
        {
            var _245_42_

            return ((_245_42_=store[key]) != null ? _245_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
        compare(f.colorpicker.backgroundChanged(),false)
        f.onColorPickerSubmit('#00ff00')
        compare(e.state.s.colors.fg,[[0,0,5,'#00ff00']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
    await section("a changed background is applied on submit", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _274_42_

            return ((_274_42_=store[key]) != null ? _274_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.setActiveColor(1)
        f.colorpicker.setHex('#0000ff')
        compare(f.colorpicker.backgroundChanged(),true)
        f.onColorPickerSubmit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[[0,0,5,'#ff0000']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
    await section("a voided foreground is cleared on submit", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _303_42_

            return ((_303_42_=store[key]) != null ? _303_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.focusTo(0)
        h.key(f.colorpicker,'delete','')
        f.onColorPickerSubmit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[])
        compare(e.state.s.colors.bg,[])
        delete global.ked_session
    })
    await section("a voided background is cleared on submit", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _330_42_

            return ((_330_42_=store[key]) != null ? _330_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.setColorsForRanges([[0,0,5,0]],'#00ff00','#0000ff')
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.setActiveColor(1)
        f.colorpicker.focusTo(1)
        h.key(f.colorpicker,'delete','')
        f.onColorPickerSubmit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[[0,0,5,'#00ff00']])
        compare(e.state.s.colors.bg,[])
        delete global.ked_session
    })
}
toExport["funcol color picker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2Z1bmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDVSxVQUFBO0lBQVc7O09BQ0EsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGFBQVQ7Ozs7OztRQU1KO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsWUFBWSxNQUFRO2dCQUN0QixFQUFFLGFBQWEsS0FBTztnQkFDdEIsRUFBRSxhQUFhLE9BQVMsRUFBRSxFQUFFLEdBQUc7ZUFFeEIsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsWUFBWSxNQUFRO2VBRWYsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funcol.kode
