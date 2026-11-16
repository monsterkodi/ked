var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, fakeGet, fakeSet, nmv, opens, press, s, store, tab

import kxk from "../../kxk.js"
let post = kxk.post

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import belt from "../edit/tool/belt.js"

import novim from "../edit/mode/novim.js"

cells = {cols:55,rows:66}

fakeGet = function (key, def)
{
    var _8_40_

    return _k_.clone((((_8_40_=store[key]) != null ? _8_40_ : def)))
}

fakeSet = function (key, value)
{
    return store[key] = _k_.clone(value)
}
toExport["novim jumps"] = async function ()
{
    await section("G and gg make jump positions navigable", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_gg')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        tab = function ()
        {
            return mode.handleKey(s,'tab',{combo:'tab',char:'\t'})
        }
        s.loadLines(belt.linesForText("one\ntwo\nthree"))
        s.setMainCursor(0,0)
        press('G')
        compare(s.mainCursor(),[3,2])
        press('g')
        press('g')
        compare(s.mainCursor(),[0,0])
        press('ctrl+o')
        compare(s.mainCursor(),[3,2])
        tab()
        compare(s.mainCursor(),[0,0])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("a count walks several jumps", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_count')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("a\n\nb\n\nc"))
        s.setMainCursor(0,0)
        press('}')
        compare(s.mainCursor(),[0,1])
        press('}')
        compare(s.mainCursor(),[0,3])
        press('2')
        press('ctrl+o')
        compare(s.mainCursor(),[0,0])
        press('2')
        press('ctrl+i')
        compare(s.mainCursor(),[0,3])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("a committed search is a jump", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_search')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("foo\nbar\nfoo"))
        s.setMainCursor(0,1)
        nmv = mode.get(s,'novim')
        nmv.startSearch()
        nmv.searchChanged('foo')
        nmv.commitSearch()
        compare(s.mainCursor(),[0,2])
        press('ctrl+o')
        compare(s.mainCursor(),[0,1])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("percent is a jump", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_percent')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("call(\n  x\n)"))
        s.setMainCursor(4,0)
        press('%')
        compare(s.mainCursor(),[0,2])
        press('ctrl+o')
        compare(s.mainCursor(),[4,0])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("a jump to another file opens it", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump-a'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_files')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        opens = []
        post.on('file.open',function (file, row, col)
        {
            return opens.push([file,row,col])
        })
        s.loadLines(belt.linesForText("one\ntwo\nthree"))
        s.setMainCursor(2,0)
        press('G')
        store['editor▸file'] = '/tmp/novimjump-b'
        s.setMainCursor(0,0)
        press('ctrl+o')
        compare(opens.slice(-1)[0],['/tmp/novimjump-a',2,0])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("a global command does not add jumps", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_global')
        mode.modes.novim = novim
        mode.start(s,'novim')
        s.loadLines(belt.linesForText("a\nb\nc"))
        nmv = mode.get(s,'novim')
        nmv.runEx('g/./normal G')
        compare(s.jumps.entries.length,0)
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("substitute and edit add jumps", async function ()
    {
        store = {'editor▸file':'/tmp/novimjump'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimjump_ex')
        mode.modes.novim = novim
        mode.start(s,'novim')
        s.loadLines(belt.linesForText("one\ntwo"))
        s.setMainCursor(0,1)
        nmv = mode.get(s,'novim')
        nmv.runEx('e')
        compare(s.jumps.entries.length,1)
        compare(s.jumps.entries[0].y,1)
        s.setMainCursor(0,0)
        nmv.runEx('s/one/x/')
        compare(s.jumps.entries.length,2)
        compare(s.jumps.entries[1].y,0)
        mode.stop(s,'novim')
        delete global.ked_session
    })
}
toExport["novim jumps"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW1qdW1wLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L25vdmltanVtcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFVLFVBQUE7SUFBUzs7T0FDQSxZQUFaO09BQWtCLFdBQWxCOztPQUNZLFdBQVA7O09BQ08sWUFBTjs7QUFFYixTQUFRLEtBQUssR0FBRyxLQUFLOztBQUVyQixvQkFBVyxLQUFJOzs7OytCQUFjLE1BQU0seUJBQU87OztBQUMxQyxvQkFBVyxLQUFJOztXQUFVLE1BQU0saUJBQWE7Ozs7OztRQU1wQyxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEtBQUssTUFBTSxRQUFRO1FBQ25CLEtBQUssTUFBTSxFQUFFO1FBRWIsa0JBQVM7O21CQUFNLEtBQUssVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBQ2pEOzttQkFBVyxLQUFLLFVBQVUsRUFBRSxPQUFPLE1BQU0sTUFBTyxLQUFLOztRQUVyRCxFQUFFLFVBQVUsS0FBSyxhQUFhO1FBQzlCLEVBQUUsY0FBYyxFQUFFO1FBRWxCLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLE1BQU07UUFDTixNQUFNO2dCQUNOLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixNQUFNO2dCQUNOLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQjtnQkFDQSxFQUFFLGNBQWdCLEVBQUU7UUFFcEIsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPOzs7O1FBSWQsU0FBUyxjQUFjO1FBQ3ZCLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixLQUFLLE1BQU0sUUFBUTtRQUNuQixLQUFLLE1BQU0sRUFBRTtRQUViLGtCQUFTOzttQkFBTSxLQUFLLFVBQVUsRUFBRSxHQUFHLE1BQU0sRUFBRyxLQUFLOztRQUVqRCxFQUFFLFVBQVUsS0FBSyxhQUFhO1FBQzlCLEVBQUUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimjump.kode
