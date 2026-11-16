var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var bottom, cells, i, lines, mid, press, reset, s, setup, top

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import belt from "../edit/tool/belt.js"

import novim from "../edit/mode/novim.js"

cells = {cols:40,rows:20}
lines = []
for (i = 0; i < 30; i++)
{
    lines.push(`  ${i}`)
}

setup = function (name)
{
    var fakeGet, fakeSet, s, store

    store = {'editor▸file':'/tmp/novimwindow'}
    fakeGet = function (key, def)
    {
        var _14_44_

        return _k_.clone((((_14_44_=store[key]) != null ? _14_44_ : def)))
    }
    fakeSet = function (key, value)
    {
        return store[key] = _k_.clone(value)
    }
    global.ked_session = {get:fakeGet,set:fakeSet}
    s = new state(cells,name)
    mode.modes.novim = novim
    mode.start(s,'novim')
    s.loadLines(lines)
    s.setView([0,0])
    s.setMainCursor(0,8)
    return s
}

press = function (s, c)
{
    return mode.handleKey(s,c,{combo:c,char:c})
}

reset = function (s)
{
    s.setView([0,0])
    return s.setMainCursor(0,8)
}
toExport["novim window motions"] = async function ()
{
    await section("H goes to the first non blank of the top line", async function ()
    {
        s = setup('novimwindow_h')
        top = s.lineAtRow(0)
        press(s,'H')
        compare(s.mainCursor(),[2,top])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("M goes to the first non blank of the middle line", async function ()
    {
        s = setup('novimwindow_m')
        mid = s.lineAtRow(parseInt((s.cells.rows - 1) / 2))
        press(s,'M')
        compare(s.mainCursor(),[2,mid])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("L goes to the first non blank of the bottom line", async function ()
    {
        s = setup('novimwindow_l')
        bottom = s.lineAtRow(s.cells.rows - 1)
        press(s,'L')
        compare(s.mainCursor(),[2,bottom])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("counts make H and L count lines from the window edge", async function ()
    {
        s = setup('novimwindow_count')
        top = s.lineAtRow(0)
        bottom = s.lineAtRow(s.cells.rows - 1)
        press(s,'3')
        press(s,'H')
        compare(s.mainCursor(),[2,top + 2])
        reset(s)
        press(s,'3')
        press(s,'L')
        compare(s.mainCursor(),[2,bottom - 2])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("M ignores a count", async function ()
    {
        s = setup('novimwindow_mcount')
        mid = s.lineAtRow(parseInt((s.cells.rows - 1) / 2))
        press(s,'2')
        press(s,'M')
        compare(s.mainCursor(),[2,mid])
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("dH deletes up to the top of the window", async function ()
    {
        s = setup('novimwindow_dh')
        press(s,'d')
        press(s,'H')
        compare(s.s.lines.length,21)
        compare(kseg.str(s.s.lines[0]),'  9')
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("dL deletes down to the bottom of the window", async function ()
    {
        s = setup('novimwindow_dl')
        press(s,'d')
        press(s,'L')
        compare(s.s.lines.length,18)
        compare(kseg.str(s.s.lines[8]),'  20')
        mode.stop(s,'novim')
        delete global.ked_session
    })
    await section("H M and L are jumps", async function ()
    {
        s = setup('novimwindow_jump')
        press(s,'L')
        press(s,'ctrl+o')
        compare(s.mainCursor(),[0,8])
        mode.stop(s,'novim')
        delete global.ked_session
    })
}
toExport["novim window motions"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW13aW5kb3cuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW13aW5kb3cua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixXQUFsQjs7T0FDWSxXQUFQOztPQUNPLFlBQU47O0FBRWIsU0FBUSxLQUFLLEdBQUcsS0FBSztBQUVyQjtLQUNJLElBQUssT0FBSTs7SUFDVCxNQUFNLFVBQVU7OztBQUVwQixrQkFBUzs7OztJQUNMLFNBQVMsY0FBYztJQUN2QixvQkFBVyxLQUFJOzs7O29DQUFjLE1BQU0sMEJBQU87O0lBQzFDLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxpQkFBYTs7SUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO0lBQ3JDLFFBQVEsTUFBTSxNQUFNO0lBQ3BCLEtBQUssTUFBTSxRQUFRO0lBQ25CLEtBQUssTUFBTSxFQUFFO0lBQ2IsRUFBRSxVQUFVO0lBQ1osRUFBRSxTQUFTLEVBQUU7SUFDYixFQUFFLGNBQWMsRUFBRTtXQUNsQjs7O0FBRUosa0JBQVMsR0FBRTs7V0FBTSxLQUFLLFVBQVUsRUFBRSxHQUFHLE1BQU0sRUFBRyxLQUFLOzs7QUFFbkQsa0JBQVM7O0lBQ0wsRUFBRSxTQUFTLEVBQUU7V0FDYixFQUFFLGNBQWMsRUFBRTs7Ozs7O1FBTWQsSUFBSSxNQUFNO1FBRVYsTUFBTSxFQUFFLFVBQVU7UUFFbEIsTUFBTSxFQUFFO2dCQUVSLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixLQUFLLEtBQUssRUFBRTtlQUNMLE9BQU87Ozs7UUFJZCxJQUFJLE1BQU07UUFFVixNQUFNLEVBQUUsb0JBQWUsRUFBRSxNQUFNLE9BQUssS0FBRztRQUV2QyxNQUFNLEVBQUU7Z0JBRVIsRUFBRSxjQUFnQixFQUFFO1FBRXBCLEtBQUssS0FBSyxFQUFFO2VBQ0wsT0FBTzs7OztRQUlkLElBQUksTUFBTTtRQUVWLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxPQUFLO1FBRWxDLE1BQU0sRUFBRTtnQkFFUixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPOzs7O1FBSWQsSUFBSSxNQUFNO1FBRVYsTUFBUyxFQUFFLFVBQVU7UUFDckIsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLE9BQUs7UUFFbEMsTUFBTSxFQUFFO1FBQ1IsTUFBTSxFQUFFO2dCQUVSLEVBQUUsY0FBZ0IsRUFBRSxNQUFJO1FBRXhCLE1BQU07UUFFTixNQUFNLEVBQUU7UUFDUixNQUFNLEVBQUU7Z0JBRVIsRUFBRSxjQUFnQixFQUFFLFNBQU87UUFFM0IsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPOzs7O1FBSWQsSUFBSSxNQUFNO1FBRVYsTUFBTSxFQUFFLG9CQUFlLEVBQUUsTUFBTSxPQUFLLEtBQUc7UUFFdkMsTUFBTSxFQUFFO1FBQ1IsTUFBTSxFQUFFO2dCQUVSLEVBQUUsY0FBZ0IsRUFBRTtRQUVwQixLQUFLLEtBQUssRUFBRTtlQUNMLE9BQU87Ozs7UUFJZCxJQUFJLE1BQU07UUFFVixNQUFNLEVBQUU7UUFDUixNQUFNLEVBQUU7Z0JBRVIsRUFBRSxFQUFFLE1BQU0sT0FBUztnQkFDbkIsS0FBSyxJQUFJLEVBQUUsRUFBRSxNQUFNLElBQU07UUFFekIsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPOzs7O1FBSWQsSUFBSSxNQUFNO1FBRVYsTUFBTSxFQUFFO1FBQ1IsTUFBTSxFQUFFO2dCQUVSLEVBQUUsRUFBRSxNQUFNLE9BQVM7Z0JBQ25CLEtBQUssSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFNO1FBRXpCLEtBQUssS0FBSyxFQUFFO2VBQ0wsT0FBTzs7OztRQUlkLElBQUksTUFBTTtRQUVWLE1BQU0sRUFBRTtRQUNSLE1BQU0sRUFBRTtnQkFFUixFQUFFLGNBQWdCLEVBQUU7UUFFcEIsS0FBSyxLQUFLLEVBQUU7ZUFDTCxPQUFPIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimwindow.kode
