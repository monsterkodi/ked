var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var c, chars, cols, dump, e, fakeGet, fakeSet, h, i, L, press, R, row, store, t

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"
import mode from "../edit/mode.js"

import novim from "../edit/mode/novim.js"

import belt from "../edit/tool/belt.js"

import harness from "../util/harness.js"

import title from "../view/title/title.js"

import crumbs from "../view/base/crumbs.js"

toExport["title"] = async function ()
{
    await section("the crumbs keep their colors                 # each segment darker and its text dimmer, the last one brighter", async function ()
    {
        dump = function (setup)
        {
            var c, chars, cols, h, x

            h = new harness({cols:40,rows:2})
            c = new crumbs(h.screen,'c')
            c.layout(0,0,24,1)
            setup(c)
            c.set('~/s/ked/kode')
            c.draw()
            chars = ''
            cols = []
            for (x = 0; x < c.rounded.length; x++)
            {
                chars += h.screen.get_char(x,0)
                cols.push(`[${h.screen.get_fg(x,0).join(' ')}] [${h.screen.get_bg(x,0).join(' ')}]`)
            }
            return [chars,cols.join(' ')]
        }
        L = ''
        R = ''
        ;[chars,cols] = dump(function (c)
        {})
        compare(chars,`${L}~ ${L}s ${L}ked ${L}kode${R}`)
        compare(cols,'[18 18 18] [0 0 0] [102 102 191] [18 18 18] [102 102 191] [18 18 18] [23 23 23] [18 18 18] [136 136 255] [23 23 23] [136 136 255] [23 23 23] [28 28 28] [23 23 23] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [34 34 34] [28 28 28] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [34 34 34] [0 0 0]')
        ;[chars,cols] = dump(function (c)
        {
            return c.hoverIndex = 1
        })
        compare(cols,'[18 18 18] [0 0 0] [102 102 191] [18 18 18] [102 102 191] [18 18 18] [68 68 170] [18 18 18] [212 212 255] [68 68 170] [212 212 255] [68 68 170] [28 28 28] [68 68 170] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [34 34 34] [28 28 28] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [34 34 34] [0 0 0]')
        ;[chars,cols] = dump(function (c)
        {
            return c.padLast = true
        })
        compare(chars,`${L}~ ${L}s ${L}ked ${L}kode       ${R}`)
        compare(cols,'[18 18 18] [0 0 0] [102 102 191] [18 18 18] [102 102 191] [18 18 18] [23 23 23] [18 18 18] [136 136 255] [23 23 23] [136 136 255] [23 23 23] [28 28 28] [23 23 23] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [136 136 255] [28 28 28] [34 34 34] [28 28 28] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [204 204 255] [34 34 34] [34 34 34] [0 0 0]')
    })
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
            var _325_48_

            return _k_.clone((((_325_48_=store[key]) != null ? _325_48_ : def)))
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0QsYUFBYjtPQUFvQixXQUFwQjs7T0FDYSxZQUFQOztPQUNPLFdBQVI7O09BQ1EsY0FBYjs7T0FDYSxZQUFSOztPQUNRLGFBQVI7Ozs7OztRQU1KLGlCQUFROzs7O1lBQ0osUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87WUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1lBQ2hCLE1BQU07WUFDTixFQUFFLElBQUk7WUFDTixFQUFFO1lBQ0YsUUFBUTtZQUNSO2lCQUNJLElBQUssT0FBSSxFQUFFLFFBQVE7O2dCQUNuQixTQUFTLEVBQUUsT0FBTyxTQUFTLEVBQUU7Z0JBQzdCLEtBQUssU0FBUyxFQUFFLE9BQU8sT0FBTyxFQUFFLEdBQUcsS0FBSyxVQUFVLEVBQUUsT0FBTyxPQUFPLEVBQUUsR0FBRyxLQUFLOztvQkFDL0UsTUFBTSxLQUFLLEtBQUs7O1FBRXJCLElBQUk7UUFDSixJQUFJO1VBRUgsTUFBTSxRQUFRLGVBQU07O1FBQ2YsUUFBTixTQUFXLE1BQU0sTUFBTSxRQUFRLFFBQVE7UUFDakMsUUFBTixLQUFRO1VBRVAsTUFBTSxRQUFRLGVBQU07O21CQUFNLEVBQUUsYUFBYTs7UUFDcEMsUUFBTixLQUFRO1VBRVAsTUFBTSxRQUFRLGVBQU07O21CQUFNLEVBQUUsVUFBVTs7UUFDakMsUUFBTixTQUFXLE1BQU0sTUFBTSxRQUFRLGVBQWU7UUFDeEMsUUFBTixLQUFROzs7O1FBSVIsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUV2QixFQUFFLFFBQVE7UUFDVixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7UUFDakIsRUFBRTtRQUVGLE1BQU0s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
//# sourceURL=../../../kode/ked/test/title.kode
