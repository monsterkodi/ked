var toExport = {}
var e, f, fakeGet, fakeSet, h, store

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import funcol from "../view/colmns/funcol.js"

toExport["funcol color picker"] = async function ()
{
    await section("a cursor on the hash picks the color", async function ()
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
            var _32_42_

            return ((_32_42_=store[key]) != null ? _32_42_ : def)
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
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("submitting without changes keeps the original color string", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _52_42_

            return ((_52_42_=store[key]) != null ? _52_42_ : def)
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
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("an explicit show does not replace anything", async function ()
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
        f.onColorPickerShow('#123456')
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("a selection color seeds the picker", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _99_42_

            return ((_99_42_=store[key]) != null ? _99_42_ : def)
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
        store = {}
        fakeGet = function (key, def)
        {
            var _149_42_

            return ((_149_42_=store[key]) != null ? _149_42_ : def)
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
        f.colorpicker.radio.changeActive(1)
        f.colorpicker.setHex('#0000ff')
        compare(f.colorpicker.backgroundChanged(),true)
        f.colorpicker.submit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[[0,0,5,'#ff0000']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
}
toExport["funcol color picker"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2Z1bmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDVSxVQUFBO0lBQVc7O09BQ0EsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGFBQVQ7Ozs7OztRQU1KO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsWUFBWSxNQUFRO2VBRWYsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE1BQU0sV0FBVztRQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFFeEIsRUFBRSxrQkFBa0I7Z0JBRXBCLEVBQUUsYUFBZTtlQUVWLE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7NkJBQVEsTUFBTSwwQkFBTzs7UUFDcEMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxPQUFPOztRQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funcol.kode
