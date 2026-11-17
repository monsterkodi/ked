var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var c, cells, fakeGet, fakeSet, j, nmv, opens, press, s, store, tab, y

import kxk from "../../kxk.js"
let post = kxk.post

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import belt from "../edit/tool/belt.js"
import changelist from "../edit/tool/changelist.js"
import jumplist from "../edit/tool/jumplist.js"

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
toExport["novim changes"] = async function ()
{
    await section("g; and g, walk change positions", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_walk')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("one\ntwo\nthree"))
        s.setMainCursor(0,0)
        press('x')
        compare(s.mainCursor(),[0,0])
        press('j')
        press('x')
        compare(s.mainCursor(),[0,1])
        press('g')
        press(';')
        compare(s.mainCursor(),[0,1])
        press('g')
        press(';')
        compare(s.mainCursor(),[0,0])
        press('g')
        press(',')
        compare(s.mainCursor(),[0,1])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("a count walks several changes", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_count')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("1\n2\n3\n4\n5"))
        s.setMainCursor(0,0)
        press('x')
        press('j')
        press('x')
        press('j')
        press('x')
        press('2')
        press('g')
        press(';')
        compare(s.mainCursor(),[0,1])
        press('2')
        press('g')
        press(',')
        compare(s.mainCursor(),[0,2])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("typing on one line is one change", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_typing')
        s.loadLines(['abc'])
        s.setMainCursor(0,0)
        s.insert('x')
        s.insert('y')
        compare(s.changes.entries.length,1)
        compare(s.changes.entries[0],[1,0])
        delete global.ked_session
    })
    await section("motion does not add a change", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_motion')
        mode.modes.novim = novim
        mode.start(s,'novim')
        press = function (c)
        {
            return mode.handleKey(s,c,{combo:c,char:c})
        }
        s.loadLines(belt.linesForText("one two"))
        s.setMainCursor(0,0)
        press('w')
        press('l')
        compare(s.changes.entries.length,0)
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("undo keeps the change position", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_undo')
        s.loadLines(['abc'])
        s.setMainCursor(0,0)
        s.insert('x')
        compare(s.changes.entries.length,1)
        s.undo()
        compare(s.changes.entries.length,1)
        compare(s.changes.older(),[0,0])
        delete global.ked_session
    })
    await section("substitute adds a change", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_substitute')
        mode.modes.novim = novim
        mode.start(s,'novim')
        s.loadLines(belt.linesForText("one\ntwo"))
        s.setMainCursor(0,0)
        nmv = mode.get(s,'novim')
        nmv.runEx('s/one/x/')
        compare(s.changes.entries.length,1)
        compare(s.changes.entries[0],[0,0])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("loading a file forgets the changes", async function ()
    {
        store = {'editor▸file':'/tmp/novimchange'}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimchange_load')
        s.loadLines(['abc'])
        s.setMainCursor(0,0)
        s.insert('x')
        compare(s.changes.entries.length,1)
        s.loadLines(['new'])
        compare(s.changes.entries.length,0)
        delete global.ked_session
    })
}
toExport["novim changes"]._section_ = true
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
toExport["changelist"] = async function ()
{
    await section("an empty change list has no older or newer position", async function ()
    {
        c = new changelist
        compare(c.older(),null)
        compare(c.newer(),null)
    })
    await section("g; starts at the newest change", async function ()
    {
        c = new changelist
        c.record([0,0])
        compare(c.older(),[0,0])
        compare(c.older(),null)
    })
    await section("changes are walked backwards and forwards", async function ()
    {
        c = new changelist
        c.record([0,0])
        c.record([0,1])
        c.record([0,2])
        compare(c.older(),[0,2])
        compare(c.older(),[0,1])
        compare(c.older(),[0,0])
        compare(c.older(),null)
        compare(c.newer(),[0,1])
        compare(c.newer(),[0,2])
        compare(c.newer(),null)
    })
    await section("close changes on the same line keep only the last position", async function ()
    {
        c = new changelist
        c.record([10,0])
        c.record([20,0])
        compare(c.entries.length,1)
        compare(c.entries[0],[20,0])
    })
    await section("changes far apart on the same line are kept", async function ()
    {
        c = new changelist
        c.record([10,0])
        c.record([95,0])
        compare(c.entries.length,2)
    })
    await section("only the newest 100 changes are kept", async function ()
    {
        c = new changelist
        for (y = 1; y <= 105; y++)
        {
            c.record([0,y])
        }
        compare(c.entries.length,100)
        compare(c.entries[0][1],6)
        compare(c.entries.slice(-1)[0][1],105)
    })
    await section("reset forgets the changes", async function ()
    {
        c = new changelist
        c.record([0,0])
        c.reset()
        compare(c.entries.length,0)
        compare(c.older(),null)
    })
}
toExport["changelist"]._section_ = true
toExport["jumplist"] = async function ()
{
    await section("an empty jump list has no older or newer position", async function ()
    {
        j = new jumplist
        compare(j.older({file:'a',x:0,y:0}),null)
        compare(j.newer(),null)
    })
    await section("ctrl o goes to the position before the last jump", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:1,y:1})
        compare(j.older({file:'a',x:2,y:2}),{file:'a',x:1,y:1})
        compare(j.newer(),{file:'a',x:2,y:2})
    })
    await section("jumps are walked backwards and forwards", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:4}),{file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:3}),{file:'a',x:0,y:2})
        compare(j.older({file:'a',x:0,y:2}),{file:'a',x:0,y:1})
        compare(j.older({file:'a',x:0,y:1}),null)
        compare(j.newer(),{file:'a',x:0,y:2})
        compare(j.newer(),{file:'a',x:0,y:3})
        compare(j.newer(),{file:'a',x:0,y:4})
        compare(j.newer(),null)
    })
    await section("a jump from a newer position drops the positions after it", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:4}),{file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:3}),{file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:2})
        compare(j.older({file:'a',x:0,y:5}),{file:'a',x:0,y:2})
        compare(j.newer(),{file:'a',x:0,y:5})
        compare(j.newer(),null)
    })
    await section("positions on the same line are not repeated", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:3,y:1})
        compare(j.entries.length,1)
        compare(j.entries[0].x,3)
    })
    await section("different files on the same line are kept", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'b',x:0,y:1})
        compare(j.entries.length,2)
    })
    await section("only the newest 100 positions are kept", async function ()
    {
        j = new jumplist
        for (y = 1; y <= 105; y++)
        {
            j.record({file:'a',x:0,y:y})
        }
        compare(j.entries.length,100)
        compare(j.entries[0].y,6)
        compare(j.entries.slice(-1)[0].y,105)
    })
}
toExport["jumplist"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW1jaGFuZ2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW1jaGFuZ2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixXQUFsQjs7T0FDWSxXQUFQO09BQVksaUJBQVo7T0FBdUIsZUFBdkI7O09BQ08sWUFBTjs7QUFFYixTQUFRLEtBQUssR0FBRyxLQUFLOztBQUVyQixvQkFBVyxLQUFJOzs7OytCQUFjLE1BQU0seUJBQU87OztBQUMxQyxvQkFBVyxLQUFJOztXQUFVLE1BQU0saUJBQWE7Ozs7OztRQU1wQyxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEtBQUssTUFBTSxRQUFRO1FBQ25CLEtBQUssTUFBTSxFQUFFO1FBRWIsa0JBQVM7O21CQUFNLEtBQUssVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBRWpELEVBQUUsVUFBVSxLQUFLLGFBQWE7UUFDOUIsRUFBRSxjQUFjLEVBQUU7UUFFbEIsTUFBTTtnQkFDTixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsTUFBTTtRQUNOLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLE1BQU07UUFDTixNQUFNO2dCQUNOLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixNQUFNO1FBQ04sTUFBTTtnQkFDTixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsTUFBTTtRQUNOLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLEtBQUssS0FBSyxFQUFFO2VBQ0wsT0FBTzs7OztRQUlkLFNBQVMsY0FBYztRQUN2QixPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsS0FBSyxNQUFNLFFBQVE7UUFDbkIsS0FBSyxNQUFNLEVBQUU7UUFFYixrQkFBUzs7bUJBQU0sS0FBSyxVQUFVLEVBQUUsR0FBRyxNQUFNLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimchange.kode
