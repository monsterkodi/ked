var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var c, e, h, i, press, row, t

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
        compare(e.state.visual,'line')
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
        mode.stop(e.state,'novim')
    })
}
toExport["title"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0QsYUFBYjtPQUFvQixXQUFwQjs7T0FDYSxZQUFQOztPQUNPLFdBQVI7O09BQ1EsY0FBYjs7T0FDYSxZQUFSOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBRXZCLEVBQUUsUUFBUTtRQUNWLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUNqQixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUk7Z0JBRVosSUFBSSxTQUFTLEtBQWdCO2dCQUM3QixJQUFJLFNBQVMsUUFBZ0I7Z0JBQzdCLElBQUksU0FBUyxlQUFnQjs7OztjQUkzQixLQUFLO1FBRVAsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUV2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsS0FBSyxNQUFNLFFBQVE7UUFDbkIsS0FBSyxNQUFNLEVBQUUsTUFBTTtRQUVuQixrQkFBUzs7Z0JBQ0ssRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFHLEtBQUs7O3VCQUFqQzs7bUJBQ0YsRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFHLEtBQUs7O1FBRTdCLEVBQUUsTUFBTSxVQUFVLEtBQUssYUFBYTtRQUNwQyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUU7UUFFRixNQUFNO2dCQUVOLEVBQUUsV0FBVyxNQUFNLFVBQWE7Z0JBQ2hDLEVBQUUsV0FBVyxNQUFNLFdBQWE7NEJBRXZCOzs7WUFBTDtZQUNBLE1BQU07O2dCQUVWLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFO1FBRTdCLE1BQU07Z0JBRU4sRUFBRSxNQUFNLEVBQUUsYUFBZSxFQUFFLEVBQUU7NkJBRXBCOzs7WUFBTDtZQUNBLE1BQU07O1FBRVYsTUFBTTtnQkFFTixLQUFLLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBYTtnQkFDaEMsRUFBRSxXQUFXLE1BQU0sVUFBYTtnQkFDaEMsRUFBRSxNQUFNLFNBQXdCO2dCQUNoQyxFQUFFLE1BQU0sRUFBRTtRQUVWLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07Z0JBRU4sRUFBRSxXQUFXLE1BQU0sVUFBYTtRQUVoQyxNQUFNO2dCQUVOLEVBQUUsV0FBVyxNQUFNLFVBQWE7Z0JBQ2hDLEtBQUssSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFhO1FBRWhDLEVBQUUsTUFBTSxVQUFVLEtBQUssYUFBYTtRQUNwQyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUU7UUFFRixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07Z0JBRU4sRUFBRSxXQUFXLE1BQU0sVUFBYTtRQUVoQyxNQUFNO2dCQUVOLEVBQUUsV0FBVyxNQUFNLFVBQWE7Z0JBQ2hDLEVBQUUsTUFBTSxPQUF3QjtRQUVoQyxFQUFFLE1BQU07UUFDUixFQUFFLE1BQU0sVUFBVSxLQUFLLGFBQWE7UUFDcEMsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFO1FBRUYsTUFBTTs2QkFDRzs7O1lBQUw7WUFDQSxNQUFNOztRQUNWLE1BQU07Z0JBRU4sRUFBRSxNQUFNLEVBQUUsYUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JDLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7UUFFL0IsTUFBTTtnQkFFTixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO1FBRS9CLE1BQU07Z0JBRU4sS0FBSyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQWE7Z0JBQ2hDLEVBQUUsTUFBTSxFQUFFO1FBRVYsRUFBRSxNQUFNLFVBQVUsS0FBSyxhQUFhO1FBQ3BDLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRTtRQUVGLE1BQU07Z0JBRU4sRUFBRSxXQUFXLE9BQU8sVUFBYTtnQkFDakMsRUFBRSxXQUFXLE9BQU8sV0FBYTtnQkFDakMsRUFBRSxXQUFXLE9BQU8sVUFBYTtnQkFDakMsRUFBRSxNQUFNLEVBQUUsYUFBd0IsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO2FBRTFDLElBQUssT0FBSTs7WUFDVCxNQUFNOztnQkFFVixFQUFFLFdBQVcsT0FBTyxVQUFZO2dCQUNoQyxFQUFFLE1BQU0sRUFBRTtRQUVWLE1BQU07Z0JBRU4sRUFBRSxXQUFXLE9BQU8sVUFBWTtnQkFDaEMsRUFBRSxNQUFNLEVBQUUsYUFBd0IsRUFBRSxFQUFFO1FBRXRDLE1BQU07Z0JBRU4sRUFBRSxXQUFXLE9BQU8sVUFBWTtnQkFDaEMsRUFBRSxNQUFNLEVBQUU7Z0JBQ1YsRUFBRSxNQUFNLFNBQXdCO1FBRWhDLEVBQUUsTUFBTSxVQUFVLEtBQUssYUFBYTtRQUNwQyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUU7UUFFRixNQUFNO1FBQ04sTUFBTTtnQkFFTixFQUFFLFdBQVcsT0FBTyxVQUFZO2dCQUNoQyxFQUFFLE1BQU0sRUFBRSxhQUF3QixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzlDLEVBQUUsTUFBTSxTQUF3QjtRQUVoQyxLQUFLLEtBQUssRUFBRSxNQUFNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/title.kode
