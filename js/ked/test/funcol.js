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
            var _18_42_

            return ((_18_42_=store[key]) != null ? _18_42_ : def)
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
            var _40_42_

            return ((_40_42_=store[key]) != null ? _40_42_ : def)
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
            var _60_42_

            return ((_60_42_=store[key]) != null ? _60_42_ : def)
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
            var _81_42_

            return ((_81_42_=store[key]) != null ? _81_42_ : def)
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
            var _103_42_

            return ((_103_42_=store[key]) != null ? _103_42_ : def)
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
            var _127_42_

            return ((_127_42_=store[key]) != null ? _127_42_ : def)
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
            var _150_42_

            return ((_150_42_=store[key]) != null ? _150_42_ : def)
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
            var _174_42_

            return ((_174_42_=store[key]) != null ? _174_42_ : def)
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
        compare(f.colorDecorate,null)
        delete global.ked_session
    })
    await section("a color literal wins over a selection", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _201_42_

            return ((_201_42_=store[key]) != null ? _201_42_ : def)
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
            var _228_42_

            return ((_228_42_=store[key]) != null ? _228_42_ : def)
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
            var _250_42_

            return ((_250_42_=store[key]) != null ? _250_42_ : def)
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
            var _279_42_

            return ((_279_42_=store[key]) != null ? _279_42_ : def)
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
}
toExport["funcol color picker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2Z1bmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FPVSxVQUFBO0lBQVk7O09BQ0EsYUFBZjs7T0FDZSxjQUFmOztPQUNlLGFBQVY7Ozs7OztRQU1KO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsWUFBWSxNQUFRO2dCQUN0QixFQUFFLGFBQWEsS0FBTztnQkFDdEIsRUFBRSxhQUFhLE9BQVMsRUFBRSxFQUFFLEdBQUc7ZUFFeEIsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsWUFBWSxNQUFRO2VBRWYsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funcol.kode
