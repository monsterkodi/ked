var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var bg, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, ink, j, lines, m, out, rect, s, saved, sc, scale, second, small, tstt, w, x, xx, y, yy

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import theme from "../theme/theme.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import choices from "../view/menu/choices.js"
import context from "../view/menu/context.js"

import mapscr from "../view/editor/mapscr.js"

import scroll from "../view/base/scroll.js"

cells = {cols:40,rows:20}

tstt = function (ext = 'md')
{
    var s

    s = new state(cells,'test_scale')
    s.syntax.setExt(ext)
    s.applyScales({enabled:true,md:{h1:3,h2:2}})
    return s
}

hed = function (cols, rows, ext = 'md', feats = [])
{
    var e, h

    h = new harness
    e = new editor(h.screen,'test_scale',feats)
    e.layout(0,0,cols,rows)
    e.state.syntax.setExt(ext)
    e.state.applyScales({enabled:true,md:{h1:3,h2:2}})
    return [h,e]
}
toExport["scale"] = async function ()
{
    await section("markdown headings scale by level", async function ()
    {
        s = tstt()
        s.loadLines(['# One','## Two','### Three','#### Four','text'])
        compare(s.scaleOfLine(0),3)
        compare(s.scaleOfLine(1),2)
        compare(s.scaleOfLine(2),1)
        compare(s.scaleOfLine(3),1)
        compare(s.scaleOfLine(4),1)
    })
    await section("headings in other files keep their size", async function ()
    {
        s = tstt('kode')
        s.loadLines(['# One','## Two'])
        compare(s.scaleOfLine(0),1)
        compare(s.scaleOfLine(1),1)
    })
    await section("the configured scales change or disable the scaling", async function ()
    {
        s = tstt()
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
        compare(s.scaleOfLine(0),1)
        compare(s.scaleOfLine(1),1)
        s.applyScales({enabled:true,md:{h1:9}})
        compare(s.scaleOfLine(0),7)
    })
    await section("the row map counts the scaled row of every line", async function ()
    {
        s = tstt()
        s.loadLines(['# One','a','## Two','b'])
        compare(s.rowOfLine(0),0)
        compare(s.rowOfLine(1),3)
        compare(s.rowOfLine(2),4)
        compare(s.rowOfLine(3),6)
    })
    await section("the row map finds the line at a row", async function ()
    {
        s = tstt()
        s.loadLines(['# One','a','## Two','b'])
        compare(s.lineAtRow(0),0)
        compare(s.lineAtRow(2),0)
        compare(s.lineAtRow(3),1)
        compare(s.lineAtRow(4),2)
        compare(s.lineAtRow(5),2)
        compare(s.lineAtRow(6),3)
        compare(s.lineAtRow(7),3)
    })
    await section("lines above the view have negative rows", async function ()
    {
        s = tstt()
        s.loadLines(['a','b','c','d','e','f'])
        s.setView([0,4])
        compare(s.rowOfLine(4),0)
        compare(s.rowOfLine(3),-1)
        compare(s.rowOfLine(1),-3)
    })
    await section("highlights and cursors above the view are not drawn", async function ()
    {
        var _a_ = hed(40,10); h = _a_[0]; e = _a_[1]

        e.state.loadLines((function () { var r_b_ = []; for (i = 0; i < 20; i++)  { r_b_.push((`line ${i}`))  } return r_b_ }).bind(this)())
        e.state.setView([0,8])
        e.state.setHighlights([[0,4,4,4],[0,10,4,10]])
        h.screen.init()
        e.draw()
        compare(h.screen.get_bg(0,2),theme.highlight.bg)
        compare(h.screen.get_bg(0,4),theme.editor.bg)
        e.state.setCursors([[0,10],[0,4]])
        e.state.setView([0,8])
        compare(e.isCursorVisible([0,4]),false)
        compare(e.isCursorVisible([0,10]),true)
        h.screen.init()
        e.draw()
        compare((!_k_.empty(h.screen.c[4][0].mark)),false)
        compare(h.screen.c[2][0].mark,'multi')
    })
    await section("a cell position maps to a logical position", async function ()
    {
        s = tstt()
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
        var _c_ = hed(40,10); h = _c_[0]; e = _c_[1]

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
    await section("a scaled character that ends exactly at the right edge is drawn", async function ()
    {
        var _d_ = hed(15,6); h = _d_[0]; e = _d_[1]

        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),'c')
        var _e_ = hed(14,6); h = _e_[0]; e = _e_[1]

        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),' ')
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
        var _f_ = hed(40,10); h = _f_[0]; e = _f_[1]

        e.state.loadLines(['# One','## Two','text'])
        e.state.setMainCursor(0,1)
        e.draw()
        compare(h.screen.c[3][0].mark,'main')
    })
    await section("horizontal scrolling moves scaled and normal lines together", async function ()
    {
        var _10_ = hed(20,8); h = _10_[0]; e = _10_[1]

        e.state.loadLines(['# abc','abc'])
        e.state.setView([0,0])
        e.draw()
        compare(h.screen.get_char(6,0),'a')
        compare(h.screen.get_char(1,3),'b')
        h.screen.init()
        e.state.setView([1,0])
        e.draw()
        compare(h.screen.get_char(5,0),'a')
        compare(h.screen.get_char(0,3),'b')
    })
    await section("horizontal positions use display columns", async function ()
    {
        var _11_ = hed(20,8); h = _11_[0]; e = _11_[1]

        e.state.loadLines(['# abc','abc'])
        e.state.setView([1,0])
        compare(e.state.posForCell(0,0),[0,0])
        compare(e.state.posForCell(5,0),[2,0])
        e.state.setCursors([[2,0]],{main:0,adjust:false})
        e.state.setView([1,0])
        h.screen.init()
        e.draw()
        compare(h.screen.c[0][5].mark,'main')
        compare(e.isCursorVisible([2,0]),true)
        e.state.setView([0,0])
        e.state.setMainCursor(10,0)
        e.state.adjustViewForMainCursor()
        compare(e.state.s.view[0],14)
    })
    await section("the block rectangle of the previous frame is erased", async function ()
    {
        var _12_ = hed(20,8); h = _12_[0]; e = _12_[1]

        h.t.textSizing = true
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
        var _13_ = hed(40,12,'kode',['complete']); h = _13_[0]; e = _13_[1]

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
        var _14_ = hed(30,12,'kode',['complete']); h = _14_[0]; e = _14_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('╭'),true)
        compare(h.row(6).startsWith('╰'),true)
        var _15_ = hed(20,12,'kode',['complete']); h = _15_[0]; e = _15_[1]

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
        var _16_ = hed(40,14,'md',['complete']); h = _16_[0]; e = _16_[1]

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
        var _17_ = hed(40,12,'md',['complete']); h = _17_[0]; e = _17_[1]

        h.t.textSizing = true
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
        var _18_ = hed(40,12); h = _18_[0]; e = _18_[1]

        c = new context(h.screen)
        c.show([5,2],(function ()
        {}),['one','two'])
        h.screen.init()
        c.draw()
        compare(h.screen.renderString().startsWith("\x1b[2;6H\x1b[7X"),true)
    })
    await section("the cleared rectangle never leaves a block half drawn", async function ()
    {
        var _19_ = hed(40,12,'md',['complete']); h = _19_[0]; e = _19_[1]

        h.t.textSizing = true
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _1a_ = 0; _1a_ < list.length; _1a_++)
        {
            cx = list[_1a_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _1b_ = 0; _1b_ < list1.length; _1b_++)
            {
                bx = list1[_1b_][0]
                by = list1[_1b_][1]
                scale = list1[_1b_][2]
                w = list1[_1b_][3]
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
                for (var _1c_ = xx = bx, _1d_ = bx + scale * w - 1; (_1c_ <= _1d_ ? xx <= bx + scale * w - 1 : xx >= bx + scale * w - 1); (_1c_ <= _1d_ ? ++xx : --xx))
                {
                    for (var _1e_ = yy = by, _1f_ = by + scale - 1; (_1e_ <= _1f_ ? yy <= by + scale - 1 : yy >= by + scale - 1); (_1e_ <= _1f_ ? ++yy : --yy))
                    {
                        compare((!_k_.empty(h.screen.get_char(xx,yy))),true)
                    }
                }
            }
        }
    })
    await section("the view scrolls so a tall line fits above the bottom", async function ()
    {
        var _20_ = hed(20,6); h = _20_[0]; e = _20_[1]

        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line needs a larger horizontal offset", async function ()
    {
        var _21_ = hed(20,8); h = _21_[0]; e = _21_[1]

        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],44)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        var _22_ = hed(20,6); h = _22_[0]; e = _22_[1]

        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down',3)
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        var _23_ = hed(20,6); h = _23_[0]; e = _23_[1]

        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        var _24_ = hed(30,10,'md',['gutter']); h = _24_[0]; e = _24_[1]

        e.state.loadLines(['# One','a','b'])
        e.draw()
        compare(h.row(0).startsWith('  1 '),true)
        compare(h.row(1),'')
        compare(h.row(2),'')
        compare(h.row(3).startsWith('  2 '),true)
        compare(h.row(4).startsWith('  3 '),true)
    })
    await section("the buffer height is measured in display rows", async function ()
    {
        s = tstt()
        s.loadLines(['# a','b','## c','d'])
        compare(s.totalRows(),7)
        compare(s.rowsBeforeLine(0),0)
        compare(s.rowsBeforeLine(1),3)
        compare(s.rowsBeforeLine(2),4)
        compare(s.rowsBeforeLine(3),6)
        compare(s.rowsBeforeLine(4),7)
        compare(s.lineAtAbsoluteRow(0),0)
        compare(s.lineAtAbsoluteRow(2),0)
        compare(s.lineAtAbsoluteRow(3),1)
        compare(s.lineAtAbsoluteRow(4),2)
        compare(s.lineAtAbsoluteRow(5),2)
        compare(s.lineAtAbsoluteRow(6),3)
        compare(s.lineAtAbsoluteRow(99),3)
        s.setView([0,2])
        compare(s.viewTopRow(),4)
        compare(s.rowOfLine(3),2)
        compare(s.rowOfLine(0),-4)
        s.syntax.setExt('txt')
        compare(s.totalRows(),4)
        s.syntax.setExt('md')
        compare(s.totalRows(),7)
    })
    await section("the map shows scaled lines with their real height", async function ()
    {
        var _25_ = hed({cols:40,rows:10}); h = _25_[0]; e = _25_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g','h','i','j'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        e.state.setView([0,0])
        m.calcView()
        compare(m.topLine,0)
        compare(m.botLine,10)
        compare(m.lineOffset(5),20)
        compare(m.lineOffset(6),32)
        compare((m.lineOffset(6) - m.lineOffset(5)),12)
    })
    await section("a scaled line gets a taller stripe in the map", async function ()
    {
        var _26_ = hed(40,10); h = _26_[0]; e = _26_[1]

        e.state.loadLines(['a','b','# h1','c','d'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = [100,101,102,103,104]
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        e.state.setView([0,0])
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=100,').length - 1),4)
    })
    await section("a scaled line is also wider in the map", async function ()
    {
        var _27_ = hed({cols:40,rows:10}); h = _27_[0]; e = _27_[1]

        e.state.loadLines(['#'])
        e.state.applyScales({enabled:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (var _28_ = y = 0, _29_ = m.imageHeight(0); (_28_ <= _29_ ? y < m.imageHeight(0) : y > m.imageHeight(0)); (_28_ <= _29_ ? ++y : --y))
        {
            for (x = 0; x < 14; x++)
            {
                i = (y * m.cells.cols * m.csz[0] + x) * 3
                if (data[i] !== bg[0] || data[i + 1] !== bg[1] || data[i + 2] !== bg[2])
                {
                    ink = true
                }
            }
        }
        compare(ink,true)
        m.calcView()
        compare((m.pixelPos([1,0])[0] - m.mapX),14)
        compare(m.pixelPos([1,0])[1],m.mapY)
        e.state.syntax.setExt('txt')
        data = Buffer.alloc((m.cells.cols * m.csz[0] * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        compare(data[18],bg[0])
        compare(data[19],bg[1])
        compare(data[20],bg[2])
    })
    await section("clicking a cut line in the map keeps the row offset", async function ()
    {
        var _2a_ = hed(40,10); h = _2a_[0]; e = _2a_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
            for (j = 0; j < 9; j++)
            {
                lines.push('text')
            }
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,8,10)
        m.csz = [10,20]
        e.state.setView([0,0])
        m.calcView()
        m.scrollToPixel([0,(m.mapY + m.lineOffset(0) + 12)])
        compare(e.state.s.view[1],0)
        compare(e.state.s.scrollOffset,3)
        h.screen.init()
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,3),' ')
        compare(h.screen.get_char(0,4),'t')
    })
    await section("the map cuts a line at its top edge", async function ()
    {
        var _2b_ = hed(40,10); h = _2b_[0]; e = _2b_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = []
        for (i = 0; i < 20; i++)
        {
            m.images.push(100 + i)
        }
        e.state.setView([0,10])
        m.calcView()
        compare(m.topRow,48)
        compare(m.topLine,6)
        compare(m.lineOffset(6),-24)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=106,').length - 1),1)
        compare(out.includes('y=24,w=120,h=4'),true)
    })
    await section("the map cuts a line at its bottom edge", async function ()
    {
        var _2c_ = hed(40,10); h = _2c_[0]; e = _2c_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = []
        for (i = 0; i < 20; i++)
        {
            m.images.push(100 + i)
        }
        e.state.setView([0,0])
        m.calcView()
        compare(m.lineOffset(7),196)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=107,').length - 1),1)
        compare(out.includes('y=0,w=120,h=4'),true)
    })
    await section("the map follows the display rows near the end of a long file", async function ()
    {
        var _2d_ = hed(40,10); h = _2d_[0]; e = _2d_[1]

        lines = []
        for (i = 0; i < 200; i++)
        {
            lines.push(((i % 10 === 0) ? '# h1' : 'text'))
        }
        e.state.loadLines(lines)
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        e.state.setView([0,100])
        m.calcView()
        compare(m.topLine,81)
        compare(m.lineOffset(100),84)
        compare((m.lineOffset(100) < m.cells.rows * 20),true)
    })
    await section("the scrollbar reflects the display rows", async function ()
    {
        var _2e_ = hed(40,10); h = _2e_[0]; e = _2e_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('text')
        }
        lines[5] = '# h1'
        e.state.loadLines(lines)
        sc = new scroll(h.screen,e.state,'left')
        sc.layout(0,0,1,10)
        csz = [10,20]
        compare(sc.isActive(),true)
        compare(sc.knobHeight(csz),90)
        compare(sc.knobOffset(csz),0)
        e.state.setView([0,e.state.maxViewLine()])
        compare(sc.knobOffset(csz),110)
        compare((sc.knobOffset(csz) + sc.knobHeight(csz)),200)
        e.state.loadLines(['a','b','c'])
        compare(sc.isActive(),false)
        compare(sc.knobHeight(csz),0)
        compare(sc.knobOffset(csz),0)
    })
    await section("clicking the scrollbar reaches the last display rows", async function ()
    {
        var _2f_ = hed(40,10); h = _2f_[0]; e = _2f_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('text')
        }
        lines.push('# h1')
        e.state.loadLines(lines)
        sc = new scroll(h.screen,e.state,'left')
        sc.layout(0,0,1,10)
        h.screen.t.cellsz = [10,20]
        e.state.setView([0,0])
        sc.scrollToPixel([0,180])
        compare(e.state.s.view[1],e.state.maxViewLine())
        compare(e.state.s.view[1],13)
    })
    await section("the scroll offset moves the top of the view inside a line", async function ()
    {
        small = {cols:20,rows:3}
        s = new state(small,'test_scale_scroll_offset')
        s.syntax.setExt('md')
        s.applyScales({enabled:true,md:{h1:3,h2:2}})
        s.loadLines(['# a','b','## c','d'])
        s.setScrollTop(2)
        compare(s.viewTopRow(),2)
        compare(s.rowOfLine(0),-2)
        compare(s.rowOfLine(1),1)
        compare(s.rowOfLine(2),2)
        s.setScrollTop(4)
        compare(s.s.view[1],2)
        compare(s.s.scrollOffset,0)
    })
    await section("the wheel scrolls a scaled line one row at a time", async function ()
    {
        small = {cols:20,rows:3}
        s = new state(small,'test_scale_wheel_rows')
        s.syntax.setExt('md')
        s.applyScales({enabled:true,md:{h1:3,h2:2}})
        s.loadLines(['# abc','a','b','c'])
        s.scrollView('down')
        compare(s.viewTopRow(),1)
        compare(s.s.view[1],0)
        compare(s.rowOfLine(1),2)
        s.scrollView('down')
        compare(s.viewTopRow(),2)
        compare(s.rowOfLine(1),1)
        s.scrollView('down')
        compare(s.viewTopRow(),3)
        compare(s.s.view[1],1)
        compare(s.rowOfLine(1),0)
    })
    await section("a cut top line is blanked while the rest moves row by row", async function ()
    {
        var _30_ = hed(20,8); h = _30_[0]; e = _30_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.draw()
        compare(h.screen.get_char(0,0),'#')
        compare(h.screen.get_char(0,3),'a')
        h.screen.init()
        e.state.setScrollTop(1)
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),' ')
        compare(h.screen.get_char(0,2),'a')
        compare(h.screen.get_char(0,3),'b')
        h.screen.init()
        e.state.setScrollTop(2)
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),'a')
        compare(h.screen.get_char(0,2),'b')
        h.screen.init()
        e.state.setScrollTop(3)
        e.draw()
        compare(h.screen.get_char(0,0),'a')
        compare(h.screen.get_char(0,1),'b')
    })
    await section("layout keeps the row offset", async function ()
    {
        var _31_ = hed(20,8); h = _31_[0]; e = _31_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        var _32_ = hed(20,8); h = _32_[0]; e = _32_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.state.setMainCursor(0,0)
        compare(e.state.viewTopRow(),0)
        compare(e.isCursorVisible([0,0]),true)
    })
    await section("cursor margins take rows or screen percentages", async function ()
    {
        s = tstt()
        compare(s.marginValue(7,3),7)
        compare(s.marginValue(0,3),0)
        compare(s.marginValue('25%',3),5)
        compare(s.marginValue('50%',3),10)
        compare(s.marginValue(null,3),3)
        saved = config.data
        config.data = {cursor:{topOffset:3,bottomOffset:'25%'}}
        compare(s.viewMargin('topOffset',7),3)
        compare(s.viewMargin('bottomOffset',7),5)
        config.data = saved
    })
    await section("entering a scaled line at the margin scrolls one row", async function ()
    {
        saved = config.data
        config.data = {cursor:{topOffset:2,bottomOffset:10}}
        var _33_ = hed(20,20); h = _33_[0]; e = _33_[1]

        lines = []
        for (i = 0; i < 9; i++)
        {
            lines.push('text')
        }
        lines.push('# h')
        for (i = 0; i < 10; i++)
        {
            lines.push('text')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
        e.state.setView([0,0])
        e.state.setCursors([[0,9]],{main:0,adjust:'topBotDeltaGrow',mc:[0,8]})
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.view[1],1)
        compare(e.state.s.scrollOffset,0)
        compare(e.state.rowOfLine(9),8)
        compare(e.isCursorVisible([0,9]),true)
        config.data = saved
    })
    await section("a cursor scroll uses the row offset instead of jumping a line", async function ()
    {
        saved = config.data
        config.data = {cursor:{topOffset:2,bottomOffset:2}}
        var _34_ = hed(20,10); h = _34_[0]; e = _34_[1]

        e.state.loadLines(['# h','a','b','c','d','e','f','g','h','i','j'])
        e.state.setView([0,0])
        e.state.setCursors([[0,7]],{main:0,adjust:'topBotDeltaGrow',mc:[0,6]})
        compare(e.state.s.view[1],0)
        compare(e.state.s.scrollOffset,1)
        compare(e.state.viewTopRow(),1)
        h.screen.init()
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),' ')
        compare(h.screen.get_char(0,2),'a')
        config.data = saved
    })
}
toExport["scale"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0EsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxZQUFkOztPQUNjLGNBQWQ7T0FBc0IsYUFBdEI7O09BQ2MsY0FBUjtPQUFnQixjQUFoQjs7T0FDUSxhQUFUOztPQUNTLGFBQVQ7O0FBRVosU0FBUSxLQUFLLEdBQUcsS0FBSzs7QUFDckIsaUJBQU8sTUFBSTs7OztJQUNQLFFBQVEsTUFBTSxNQUFNO0lBQ3BCLEVBQUUsT0FBTyxPQUFPO0lBQ2hCLEVBQUUsYUFBYSxRQUFRLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztXQUN4Qzs7O0FBRUosZ0JBQU0sTUFBSyxNQUFLLE1BQUksTUFBSzs7OztJQUNqQixRQUFRO0lBQ1IsUUFBUSxPQUFPLEVBQUUsT0FBTyxhQUFhO0lBQ3JDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sT0FBTyxPQUFPO0lBQ3RCLEVBQUUsTUFBTSxhQUFhLFFBQVEsS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1lBQzdDLEVBQUU7Ozs7OztRQU1ILElBQUk7UUFDSixFQUFFLFdBQVcsUUFBUSxTQUFTLFlBQVksWUFBWTtnQkFFdEQsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJO2dCQUNsQixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7Z0JBQ2xCLEVBQUUsWUFBWSxHQUFJOzs7O1FBSWxCLElBQUksS0FBSztRQUNULEVBQUUsV0FBVyxRQUFRO2dCQUVyQixFQUFFLFlBQVksR0FBSTtnQkFDbEIsRUFBRSxZQUFZLEdBQUk7Ozs7UUFJbEIsSUFBSTtRQUNKLEVBQUUsV0FBVyxRQUFRLFNBQVMsWUFBWSxZQUFZO1FBRXRELEVBQUUsYUFBYSxRQUFRLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
