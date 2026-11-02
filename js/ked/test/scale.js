var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var bx, by, c, cells, cx, e, first, h, rect, s, scale, second, w, xx, yy

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import theme from "../theme/theme.js"

import harness from "../util/harness.js"

import choices from "../view/menu/choices.js"
import context from "../view/menu/context.js"

cells = {cols:40,rows:20}
toExport["scale"] = async function ()
{
    await section("markdown headings scale by level", async function ()
    {
        s = new state(cells,'test_scale')
        s.syntax.setExt('md')
        s.loadLines(['# One','## Two','### Three','#### Four','text'])
        compare(s.scaleOfLine(0),3)
        compare(s.scaleOfLine(1),2)
        compare(s.scaleOfLine(2),1)
        compare(s.scaleOfLine(3),1)
        compare(s.scaleOfLine(4),1)
    })
    await section("headings in other files keep their size", async function ()
    {
        s = new state(cells,'test_scale')
        s.syntax.setExt('kode')
        s.loadLines(['# One','## Two'])
        compare(s.scaleOfLine(0),1)
        compare(s.scaleOfLine(1),1)
    })
    await section("the configured scales change or disable the scaling", async function ()
    {
        s = new state(cells,'test_scale_config')
        s.syntax.setExt('md')
        s.loadLines(['# one','## two','### three','#### four','##### five'])
        s.applyScales({enabled:true,md:{h1:6,h2:5,h3:4,h4:3,h5:2}})
        compare(s.scaleOfLine(0),6)
        compare(s.scaleOfLine(1),5)
        compare(s.scaleOfLine(2),4)
        compare(s.scaleOfLine(3),3)
        compare(s.scaleOfLine(4),2)
        s.applyScales({enabled:false})
        compare(s.scaleOfLine(0),1)
        compare(s.scaleOfLine(1),1)
        s.applyScales({})
        compare(s.scaleOfLine(0),3)
        compare(s.scaleOfLine(1),2)
        s.applyScales({enabled:true,md:{h1:9}})
        compare(s.scaleOfLine(0),7)
    })
    await section("the row map counts the scaled row of every line", async function ()
    {
        s = new state(cells,'test_scale')
        s.syntax.setExt('md')
        s.loadLines(['# One','a','## Two','b'])
        compare(s.rowOfLine(0),0)
        compare(s.rowOfLine(1),3)
        compare(s.rowOfLine(2),4)
        compare(s.rowOfLine(3),6)
    })
    await section("the row map finds the line at a row", async function ()
    {
        s = new state(cells,'test_scale')
        s.syntax.setExt('md')
        s.loadLines(['# One','a','## Two','b'])
        compare(s.lineAtRow(0),0)
        compare(s.lineAtRow(2),0)
        compare(s.lineAtRow(3),1)
        compare(s.lineAtRow(4),2)
        compare(s.lineAtRow(5),2)
        compare(s.lineAtRow(6),3)
        compare(s.lineAtRow(7),3)
    })
    await section("a cell position maps to a logical position", async function ()
    {
        s = new state(cells,'test_scale')
        s.syntax.setExt('md')
        s.loadLines(['# One','a','## Two'])
        compare(s.posForCell(0,0),[0,0])
        compare(s.posForCell(2,0),[0,0])
        compare(s.posForCell(3,0),[1,0])
        compare(s.posForCell(5,0),[1,0])
        compare(s.posForCell(6,0),[2,0])
        compare(s.posForCell(0,3),[0,1])
        compare(s.posForCell(3,3),[3,1])
        compare(s.posForCell(0,4),[0,2])
        compare(s.posForCell(1,4),[0,2])
        compare(s.posForCell(3,4),[1,2])
        compare(s.posForCell(6,4),[3,2])
    })
    await section("a heading is drawn in a block of cells", async function ()
    {
        h = new harness({cols:40,rows:10})
        e = new editor(h.screen,'test_scale_draw',[])
        e.layout(0,0,40,10)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# One','a','## Two','b'])
        e.draw()
        compare(h.screen.get_char(0,0),'#')
        compare(h.screen.get_char(3,0),' ')
        compare(h.screen.get_char(6,0),'O')
        compare(h.screen.get_char(12,0),'e')
        compare(h.screen.get_char(0,3),'a')
        compare(h.screen.get_char(0,4),'#')
        compare(h.screen.get_char(2,4),'#')
        compare(h.screen.get_char(6,4),'T')
        compare(h.screen.get_char(0,6),'b')
    })
    await section("a scaled character carries the text sizing escape", async function ()
    {
        h = new harness({cols:10,rows:5})
        compare(h.screen.scaled_char('x',2,1),'\x1b]66;s=2:w=1;x\x07')
        compare(h.screen.scaled_char('🌈',3,2),'\x1b]66;s=3:w=2;🌈\x07')
    })
    await section("a scaled block fills its cells with placeholders", async function ()
    {
        h = new harness({cols:20,rows:5})
        h.t.textSizing = true
        compare(h.screen.add_scaled(0,0,'x',null,null,2),2)
        compare(h.screen.get_char(0,0),'\x1b]66;s=2:w=1;x\x07')
        compare(h.screen.get_char(1,0),null)
        compare(h.screen.get_char(0,1),'\x1b[2C')
        compare(h.screen.get_char(1,1),null)
        compare(h.screen.add_scaled(5,0,'🌈',null,null,2),4)
        compare(h.screen.get_char(5,0),'\x1b]66;s=2:w=2;🌈\x07')
        compare(h.screen.get_char(6,0),null)
        compare(h.screen.get_char(5,1),'\x1b[4C')
        compare(h.screen.get_char(8,1),null)
    })
    await section("the cursor sits on the scaled line", async function ()
    {
        h = new harness({cols:40,rows:10})
        e = new editor(h.screen,'test_scale_cursor',[])
        e.layout(0,0,40,10)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# One','## Two','text'])
        e.state.setMainCursor(0,1)
        e.draw()
        compare(h.screen.c[3][0].mark,'main')
    })
    await section("the block rectangle of the previous frame is erased", async function ()
    {
        h = new harness({cols:20,rows:8})
        h.t.textSizing = true
        e = new editor(h.screen,'test_scale_erase',[])
        e.layout(0,0,20,8)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# big','a','b','c','d','e','f','g','h'])
        h.screen.init()
        e.draw()
        first = h.screen.renderString()
        compare(first.startsWith('\x1b[H'),true)
        e.state.scrollView('down')
        h.screen.init()
        e.draw()
        second = h.screen.renderString()
        compare(second.startsWith("\x1b[1;1H\x1b[15X\x1b[2;1H\x1b[15X\x1b[3;1H\x1b[15X\x1b[H"),true)
    })
    await section("completion is placed and highlighted on normal lines", async function ()
    {
        h = new harness({cols:40,rows:12})
        e = new editor(h.screen,'test_scale_complete',['complete'])
        e.layout(0,0,40,12)
        e.state.syntax.setExt('kode')
        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        compare(e.complete.posForCursor([3,2]),[3,2])
        e.state.setMainCursor(3,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(2),'funky1')
        compare(h.row(4).includes('funky1'),true)
        compare(h.row(5).includes('funky2'),true)
        compare(h.screen.get_bg(4,2),theme.selection.span)
        compare(h.screen.get_bg(5,2),theme.selection.span)
    })
    await section("the completion frame fits at the edges of the editor", async function ()
    {
        h = new harness({cols:30,rows:12})
        e = new editor(h.screen,'test_complete_left',['complete'])
        e.layout(0,0,30,12)
        e.state.syntax.setExt('kode')
        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('╭'),true)
        compare(h.row(6).startsWith('╰'),true)
        h = new harness({cols:20,rows:12})
        e = new editor(h.screen,'test_complete_right',['complete'])
        e.layout(0,0,20,12)
        e.state.syntax.setExt('kode')
        e.state.loadLines(['funky1 = 1','funky2 = 2','...........funky'])
        e.state.setMainCursor(16,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('         ╭'),true)
        compare(h.row(3).endsWith('╮'),true)
        compare(h.row(3).length,20)
    })
    await section("the completion frame moves below a scaled line", async function ()
    {
        h = new harness({cols:40,rows:14})
        e = new editor(h.screen,'test_complete_scale',['complete'])
        e.layout(0,0,40,14)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# fu','','funky1 = 1','funky2 = 2'])
        e.state.setMainCursor(4,0)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(e.state.scaleOfLine(0),3)
        compare(h.row(1),'')
        compare(h.row(2),'')
        compare(h.row(3).startsWith('        ╭'),true)
        compare(h.row(6).startsWith('        ╰'),true)
    })
    await section("an erased area is cleared in the cells and on the screen", async function ()
    {
        h = new harness({cols:20,rows:8})
        h.screen.set(2,3,'X',null,null)
        h.screen.set_bg(2,3,[7,8,9])
        h.screen.erase_scaled(2,3,5,3)
        compare(h.screen.get_char(2,3),' ')
        compare(h.screen.get_bg(2,3),[7,8,9])
        compare(h.screen.renderString().startsWith("\x1b[4;3H\x1b[4X"),true)
    })
    await section("a popup over a scaled line erases the block under it", async function ()
    {
        h = new harness({cols:40,rows:12})
        h.t.textSizing = true
        e = new editor(h.screen,'test_erase_popup',['complete'])
        e.layout(0,0,40,12)
        e.state.syntax.setExt('md')
        e.state.loadLines(['fu','# funky1','# funky2'])
        e.state.setMainCursor(2,0)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.screen.renderString().startsWith("\x1b[2;1H\x1b[11X"),true)
        compare(h.screen.get_char(11,1),' ')
    })
    await section("a context menu erases the block under it", async function ()
    {
        h = new harness({cols:40,rows:12})
        c = new context(h.screen)
        c.show([5,2],(function ()
        {}),['one','two'])
        h.screen.init()
        c.draw()
        compare(h.screen.renderString().startsWith("\x1b[2;6H\x1b[7X"),true)
    })
    await section("the cleared rectangle never leaves a block half drawn", async function ()
    {
        h = new harness({cols:40,rows:12})
        h.t.textSizing = true
        e = new editor(h.screen,'test_erase_loop',['complete'])
        e.layout(0,0,40,12)
        e.state.syntax.setExt('md')
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cx = list[_a_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                bx = list1[_b_][0]
                by = list1[_b_][1]
                scale = list1[_b_][2]
                w = list1[_b_][3]
                if (bx > rect[2])
                {
                    continue
                }
                if (bx + scale * w - 1 < rect[0])
                {
                    continue
                }
                if (by > rect[3])
                {
                    continue
                }
                if (by + scale - 1 < rect[1])
                {
                    continue
                }
                for (var _c_ = xx = bx, _d_ = bx + scale * w - 1; (_c_ <= _d_ ? xx <= bx + scale * w - 1 : xx >= bx + scale * w - 1); (_c_ <= _d_ ? ++xx : --xx))
                {
                    for (var _e_ = yy = by, _f_ = by + scale - 1; (_e_ <= _f_ ? yy <= by + scale - 1 : yy >= by + scale - 1); (_e_ <= _f_ ? ++yy : --yy))
                    {
                        compare((!_k_.empty(h.screen.get_char(xx,yy))),true)
                    }
                }
            }
        }
    })
    await section("the view scrolls so a tall line fits above the bottom", async function ()
    {
        h = new harness({cols:20,rows:6})
        e = new editor(h.screen,'test_scale_scroll',[])
        e.layout(0,0,20,6)
        e.state.syntax.setExt('md')
        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line has fewer visible columns", async function ()
    {
        h = new harness({cols:20,rows:8})
        e = new editor(h.screen,'test_scale_cols',[])
        e.layout(0,0,20,8)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],16)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        h = new harness({cols:20,rows:6})
        e = new editor(h.screen,'test_scale_short',[])
        e.layout(0,0,20,6)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down')
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        h = new harness({cols:20,rows:6})
        e = new editor(h.screen,'test_scale_end',[])
        e.layout(0,0,20,6)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        h = new harness({cols:30,rows:10})
        e = new editor(h.screen,'test_scale_gutter',['gutter'])
        e.layout(0,0,30,10)
        e.state.syntax.setExt('md')
        e.state.loadLines(['# One','a','b'])
        e.draw()
        compare(h.row(0).startsWith('  1 '),true)
        compare(h.row(1),'')
        compare(h.row(2),'')
        compare(h.row(3).startsWith('  2 '),true)
        compare(h.row(4).startsWith('  3 '),true)
    })
}
toExport["scale"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQU07O09BQ0EsWUFBVDtPQUFlLGFBQWY7O09BQ1MsWUFBVDs7T0FDUyxjQUFUOztPQUNZLGNBQU47T0FBYyxjQUFkOztBQUViLFNBQVEsS0FBSyxHQUFHLEtBQUs7Ozs7O1FBWWIsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxPQUFPLE9BQU87UUFDaEIsRUFBRSxXQUFXLFFBQVEsU0FBUyxZQUFZLFlBQVk7Z0JBRXRELEVBQUUsWUFBWSxHQUFJO2dCQUNsQixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJO2dCQUNsQixFQUFFLFlBQVksR0FBSTs7OztRQUlsQixRQUFRLE1BQU0sTUFBTTtRQUNwQixFQUFFLE9BQU8sT0FBTztRQUNoQixFQUFFLFdBQVcsUUFBUTtnQkFFckIsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJOzs7O1FBSWxCLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEVBQUUsT0FBTyxPQUFPO1FBQ2hCLEVBQUUsV0FBVyxRQUFRLFNBQVMsWUFBWSxZQUFZO1FBRXRELEVBQUUsYUFBYSxRQUFRLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztnQkFFdkQsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJO2dCQUNsQixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJO1FBRWxCLEVBQUUsYUFBYSxRQUFRO2dCQUV2QixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7UUFFbEIsRUFBRTtnQkFFRixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7UUFFbEIsRUFBRSxh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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
