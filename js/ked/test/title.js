var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var c, e, fakeGet, fakeSet, h, i, press, row, store, t

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"
import mode from "../edit/mode.js"

import novim from "../edit/mode/novim.js"

import belt from "../edit/tool/belt.js"

import harness from "../util/harness.js"

import title from "../view/title/title.js"

toExport["title"] = async function ()
{
    await section("the crumbs show the folder of a file", async function ()
    {
        h = new harness({cols:100,rows:5})
        e = new editor(h.screen,'test_editor',[])
        t = new title(h.screen,e)
        t.setFile('~/s/ked/kode/doesntexist')
        t.layout(0,0,100,1)
        t.draw()
        row = h.row(0)
        compare(row.includes('~'),true)
        compare(row.includes('kode'),true)
        compare(row.includes('doesntexist'),true)
    })
    await section("the novim command line is a text input", async function ()
    {
        await mode.loaded
        h = new harness({cols:80,rows:5})
        e = new editor(h.screen,'title_novim_editor',[])
        t = new title(h.screen,e)
        t.layout(0,0,80,1)
        mode.modes.novim = novim
        mode.start(e.state,'novim')
        press = function (c)
        {
            if (t.onKey(c,{combo:c,char:c}))
            {
                return true
            }
            return e.onKey(c,{combo:c,char:c})
        }
        e.state.loadLines(belt.linesForText('one two'))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press(':')
        compare(t.titlenovim.input.visible(),true)
        compare(t.titlenovim.input.hasFocus(),true)
        var list = _k_.list('s/one')
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            press(c)
        }
        compare(e.state.s.highlights,[[0,0,3]])
        press('/')
        compare(e.state.s.highlights,[[0,0,3]])
        var list1 = _k_.list('1/')
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            press(c)
        }
        press('return')
        compare(kseg.str(e.state.s.lines),'1 two')
        compare(t.titlenovim.input.visible(),false)
        compare(e.state.hasFocus,true)
        compare(e.state.s.highlights,[])
        press(':')
        press('s')
        press('x')
        press('delete')
        compare(t.titlenovim.input.current(),'s')
        press('esc')
        compare(t.titlenovim.input.visible(),false)
        compare(kseg.str(e.state.s.lines),'1 two')
        e.state.loadLines(belt.linesForText("a\nb\nc"))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('V')
        press('j')
        press(':')
        compare(t.titlenovim.input.current(),"'<,'>")
        press('esc')
        compare(t.titlenovim.input.visible(),false)
        compare(e.state.novim.visual,'line')
        e.state.stopVisual()
        e.state.loadLines(belt.linesForText('aa aa'))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press(':')
        var list2 = _k_.list('%s/aa/b/gc')
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            c = list2[_c_]
            press(c)
        }
        press('return')
        compare(e.state.s.highlights,[[0,0,2],[3,0,5]])
        compare(e.state.s.selections,[[0,0,2,0]])
        press('n')
        compare(e.state.s.selections,[[3,0,5,0]])
        press('y')
        compare(kseg.str(e.state.s.lines),'aa b')
        compare(e.state.s.highlights,[])
        e.state.loadLines(belt.linesForText("foo bar foo"))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('/')
        compare(t.titlenovim.vinder.visible(),true)
        compare(t.titlenovim.vinder.hasFocus(),true)
        compare(t.titlenovim.vinder.current(),'foo')
        compare(e.state.s.highlights,[[0,0,3],[8,0,11]])
        for (i = 0; i < 4; i++)
        {
            press('delete')
        }
        compare(t.titlenovim.vinder.current(),'')
        compare(e.state.s.highlights,[])
        press('b')
        compare(t.titlenovim.vinder.current(),'b')
        compare(e.state.s.highlights,[[4,0,5]])
        press('esc')
        compare(t.titlenovim.vinder.visible(),false)
        compare(e.state.s.highlights,[])
        compare(e.state.hasFocus,true)
        e.state.loadLines(belt.linesForText("foo\nfoo"))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('/')
        press('return')
        compare(t.titlenovim.vinder.visible(),false)
        compare(e.state.s.highlights,[[0,0,3],[0,1,3]])
        compare(e.state.hasFocus,true)
        e.state.loadLines(belt.linesForText("foo bar foo"))
        e.state.setMainCursor(2,0)
        e.grabFocus()
        press('/')
        compare(e.state.mainCursor(),[0,0])
        press('return')
        compare(e.state.mainCursor(),[0,0])
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('/')
        press('return')
        compare(e.state.mainCursor(),[0,0])
        e.state.loadLines(belt.linesForText("alpha beta alpha"))
        e.state.setMainCursor(7,0)
        e.grabFocus()
        press('/')
        compare(e.state.mainCursor(),[6,0])
        var list3 = _k_.list('alpha')
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            c = list3[_d_]
            press(c)
        }
        press('return')
        compare(e.state.mainCursor(),[11,0])
        e.state.loadLines(belt.linesForText("foo bar foo"))
        e.state.setMainCursor(8,0)
        e.grabFocus()
        press('/')
        var list4 = _k_.list('bar')
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            c = list4[_e_]
            press(c)
        }
        press('return')
        compare(e.state.mainCursor(),[4,0])
        mode.stop(e.state,'novim')
    })
    await section("reverse search and the match position", async function ()
    {
        await mode.loaded
        h = new harness({cols:80,rows:5})
        e = new editor(h.screen,'title_reverse_editor',[])
        t = new title(h.screen,e)
        t.layout(0,0,80,1)
        mode.modes.novim = novim
        mode.start(e.state,'novim')
        press = function (c)
        {
            if (t.onKey(c,{combo:c,char:c}))
            {
                return true
            }
            return e.onKey(c,{combo:c,char:c})
        }
        e.state.loadLines(belt.linesForText("foo\nbar\nfoo\nbar\nfoo"))
        e.state.setMainCursor(0,4)
        e.grabFocus()
        press('?')
        compare(t.titlenovim.vinder.visible(),true)
        compare(t.titlenovim.vinder.current(),'foo')
        compare(e.state.s.highlights,[[0,0,3],[0,2,3],[0,4,3]])
        press('return')
        compare(t.titlenovim.vinder.visible(),false)
        compare(e.state.mainCursor(),[0,4])
        compare(t.titlenovim.novimText,'3/3')
        press('n')
        compare(e.state.mainCursor(),[0,2])
        compare(t.titlenovim.novimText,'2/3')
        press('N')
        compare(e.state.mainCursor(),[0,4])
        compare(t.titlenovim.novimText,'3/3')
        press('n')
        press('n')
        compare(e.state.mainCursor(),[0,0])
        compare(t.titlenovim.novimText,'1/3')
        mode.stop(e.state,'novim')
    })
    await section("macro recording indicator", async function ()
    {
        await mode.loaded
        h = new harness({cols:80,rows:5})
        e = new editor(h.screen,'title_macro_editor',[])
        t = new title(h.screen,e)
        t.layout(0,0,80,1)
        mode.modes.novim = novim
        mode.start(e.state,'novim')
        press = function (c)
        {
            if (t.onKey(c,{combo:c,char:c}))
            {
                return true
            }
            return e.onKey(c,{combo:c,char:c})
        }
        e.state.loadLines(belt.linesForText("one\ntwo"))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('q')
        press('a')
        compare(t.titlenovim.novimText,'recording @a')
        press('q')
        compare(t.titlenovim.novimText,'')
        mode.stop(e.state,'novim')
    })
    await section("novim history is navigated with up and down", async function ()
    {
        await mode.loaded
        store = {}
        fakeGet = function (key, def)
        {
            var _294_48_

            return _k_.clone((((_294_48_=store[key]) != null ? _294_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new harness({cols:80,rows:5})
        e = new editor(h.screen,'title_history_editor',[])
        t = new title(h.screen,e)
        t.layout(0,0,80,1)
        mode.modes.novim = novim
        mode.start(e.state,'novim')
        press = function (c)
        {
            if (t.onKey(c,{combo:c,char:c}))
            {
                return true
            }
            return e.onKey(c,{combo:c,char:c})
        }
        e.state.loadLines(belt.linesForText('alpha beta alpha'))
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('/')
        var list5 = _k_.list('beta')
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            c = list5[_f_]
            press(c)
        }
        press('return')
        e.state.setMainCursor(0,0)
        e.grabFocus()
        press('/')
        compare(t.titlenovim.vinder.current(),'alpha')
        press('up')
        compare(t.titlenovim.vinder.current(),'beta')
        press('down')
        compare(t.titlenovim.vinder.current(),'alpha')
        press('esc')
        press(':')
        var list6 = _k_.list('foo')
        for (var _10_ = 0; _10_ < list6.length; _10_++)
        {
            c = list6[_10_]
            press(c)
        }
        press('return')
        press(':')
        compare(t.titlenovim.input.current(),'')
        press('up')
        compare(t.titlenovim.input.current(),'foo')
        press('down')
        compare(t.titlenovim.input.current(),'')
        press('esc')
        delete global.ked_session
        mode.stop(e.state,'novim')
    })
}
toExport["title"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0QsYUFBYjtPQUFvQixXQUFwQjs7T0FDYSxZQUFQOztPQUNPLFdBQVI7O09BQ1EsY0FBYjs7T0FDYSxZQUFSOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBRXZCLEVBQUUsUUFBUTtRQUNWLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUNqQixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUk7Z0JBRVosSUFBSSxTQUFTLEtBQWdCO2dCQUM3QixJQUFJLFNBQVMsUUFBZ0I7Z0JBQzdCLElBQUksU0FBUyxlQUFnQjs7OztjQUkzQixLQUFLO1FBRVAsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUV2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsS0FBSyxNQUFNLFFBQVE7UUFDbkIsS0FBSyxNQUFNLEVBQUUsTUFBTTtRQUVuQixrQkFBUzs7Z0JBQ0ssRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFHLEtBQUs7O3VCQUFqQzs7bUJBQ0YsRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBRTdCLEVBQUUsTUFBTSxVQUFVLEtBQUssYUFBYTtRQUNwQyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUU7UUFFRixNQUFNO2dCQUVOLEVBQUUsV0FBVyxNQUFNLFVBQWE7Z0JBQ2hDLEVBQUUsV0FBVyxNQUFNLFdBQWE7NEJBRXZCOzs7WUFBTDtZQUNBLE1BQU07O2dCQUVWLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFO1FBRTdCLE1BQU07Z0JBRU4sRUFBRSxNQUFNLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/title.kode
