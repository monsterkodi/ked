var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, fakeGet, fakeSet, nmv, press, s, store

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import belt from "../edit/tool/belt.js"

import novim from "../edit/mode/novim.js"

cells = {cols:55,rows:66}

fakeGet = function (key, def)
{
    var _7_40_

    return _k_.clone((((_7_40_=store[key]) != null ? _7_40_ : def)))
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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW1jaGFuZ2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW1jaGFuZ2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBbUIsWUFBWjtPQUFrQixXQUFsQjs7T0FDWSxXQUFQOztPQUNPLFlBQU47O0FBRWIsU0FBUSxLQUFLLEdBQUcsS0FBSzs7QUFFckIsb0JBQVcsS0FBSTs7OzsrQkFBYyxNQUFNLHlCQUFPOzs7QUFDMUMsb0JBQVcsS0FBSTs7V0FBVSxNQUFNLGlCQUFhOzs7Ozs7UUFNcEMsU0FBUyxjQUFjO1FBQ3ZCLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixLQUFLLE1BQU0sUUFBUTtRQUNuQixLQUFLLE1BQU0sRUFBRTtRQUViLGtCQUFTOzttQkFBTSxLQUFLLFVBQVUsRUFBRSxHQUFHLE1BQU0sRUFBRyxLQUFLOztRQUVqRCxFQUFFLFVBQVUsS0FBSyxhQUFhO1FBQzlCLEVBQUUsY0FBYyxFQUFFO1FBRWxCLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLE1BQU07UUFDTixNQUFNO2dCQUNOLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixNQUFNO1FBQ04sTUFBTTtnQkFDTixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsTUFBTTtRQUNOLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLE1BQU07UUFDTixNQUFNO2dCQUNOLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixLQUFLLEtBQUssRUFBRTtlQUNMLE9BQU87Ozs7UUFJZCxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEtBQUssTUFBTSxRQUFRO1FBQ25CLEtBQUssTUFBTSxFQUFFO1FBRWIsa0JBQVM7O21CQUFNLEtBQUssVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBRWpELEVBQUUsVUFBVSxLQUFLLGFBQWE7UUFDOUIsRUFBRSxjQUFjLEVBQUU7UUFFbEIsTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFFTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07Z0JBQ04sRUFBRSxjQUFnQixFQUFFO1FBRXBCLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtnQkFDTixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPOzs7O1FBSWQsU0FBUyxjQUFjO1FBQ3ZCLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUVwQixFQUFFLFdBQVc7UUFDYixFQUFFLGNBQWMsRUFBRTtRQUVsQixFQUFFLE9BQU87UUFDVCxFQUFFLE9BQU87Z0JBRVQsRUFBRSxRQUFRLFFBQVEsT0FBUztnQkFDM0IsRUFBRSxRQUFRLFFBQVEsSUFBVSxFQUFFO2VBRXZCLE9BQU87Ozs7UUFJZCxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEtBQUssTUFBTSxRQUFRO1FBQ25CLEtBQUssTUFBTSxFQUFFO1FBRWIsa0JBQVM7O21CQUFNLEtBQUssVUFBVSxFQUFFLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBRWpELEVBQUUsVUFBVSxLQUFLLGFBQWE7UUFDOUIsRUFBRSxjQUFjLEVBQUU7UUFFbEIsTUFBTTtRQUNOLE1BQU07Z0JBRU4sRUFBRSxRQUFRLFFBQVEsT0FBUztRQUUzQixLQUFLLEtBQUssRUFBRTtlQUNMLE9BQU87Ozs7UUFJZCxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBRXBCLEVBQUUsV0FBVztRQUNiLEVBQUUsY0FBYyxFQUFFO1FBRWxCLEVBQUUsT0FBTztnQkFFVCxFQUFFLFFBQVEsUUFBUSxPQUFTO1FBRTNCLEVBQUU7Z0JBRUYsRUFBRSxRQUFRLFFBQVEsT0FBUztnQkFDM0IsRUFBRSxRQUFRLFNBQWtCLEVBQUU7ZUFFdkIsT0FBTzs7OztRQUlkLFNBQVMsY0FBYztRQUN2QixPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsS0FBSyxNQUFNLFFBQVE7UUFDbkIsS0FBSyxNQUFNLEVBQUU7UUFFYixFQUFFLFVBQVUsS0FBSyxhQUFhO1FBQzlCLEVBQUUsY0FBYyxFQUFFO1FBRWxCLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDakIsSUFBSSxNQUFNO2dCQUVWLEVBQUUsUUFBUSxRQUFRLE9BQVM7Z0JBQzNCLEVBQUUsUUFBUSxRQUFRLElBQVUsRUFBRTtRQUU5QixLQUFLLEtBQUssRUFBRTtlQUNMLE9BQU87Ozs7UUFJZCxTQUFTLGNBQWM7UUFDdkIsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBRXBCLEVBQUUsV0FBVztRQUNiLEVBQUUsY0FBYyxFQUFFO1FBRWxCLEVBQUUsT0FBTztnQkFFVCxFQUFFLFFBQVEsUUFBUSxPQUFTO1FBRTNCLEVBQUUsV0FBVztnQkFFYixFQUFFLFFBQVEsUUFBUSxPQUFTO2VBRXBCLE9BQU8ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimchange.kode
