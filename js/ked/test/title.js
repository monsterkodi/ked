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
        compare(t.titlenovim.novimText,'recorded @a')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0QsYUFBYjtPQUFvQixXQUFwQjs7T0FDYSxZQUFQOztPQUNPLFdBQVI7O09BQ1EsY0FBYjs7T0FDYSxZQUFSOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBRXZCLEVBQUUsUUFBUTtRQUNWLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUNqQixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUk7UUFFZSxRQUEzQixJQUFJLFNBQVMsS0FBZ0I7UUFDRixRQUEzQixJQUFJLFNBQVMsUUFBZ0I7UUFDRixRQUEzQixJQUFJLFNBQVMsZUFBZ0I7Ozs7Y0FJM0IsS0FBSztRQUVQLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU87UUFFdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWhCLEtBQUssTUFBTSxRQUFRO1FBQ25CLEtBQUssTUFBTSxFQUFFLE1BQU07UUFFbkIsa0JBQVM7O2dCQUNLLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRyxLQUFLOzt1QkFBakM7O21CQUNGLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRyxLQUFLOztRQUU3QixFQUFFLE1BQU0sVUFBVSxLQUFLLGFBQWE7UUFDcEMsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFO1FBRUYsTUFBTTtRQUV3QixRQUE5QixFQUFFLFdBQVcsTUFBTSxVQUFhO1FBQ0YsUUFBOUIsRUFBRSxXQUFXLE1BQU0sV0FBYTs0QkFFdkI7OztZQUFMO1lBQ0EsTUFBTTs7UUFFVyxRQUFyQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRTtR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
//# sourceURL=../../../kode/ked/test/title.kode
