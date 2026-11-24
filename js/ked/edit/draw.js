var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var draw

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kstr = kxk.kstr

import prof from "../util/prof.js"

import rounded from "../util/img/rounded.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import view from "../view/base/view.js"

import belt from "./tool/belt.js"
import colorspans from "./tool/colorspans.js"
import sue from "./tool/sue.js"

import mode from "./mode.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        this["isCursorInAnyRect"] = this["isCursorInAnyRect"].bind(this)
        this["showCursorsOutsideRects"] = this["showCursorsOutsideRects"].bind(this)
        this["cellsForLine"] = this["cellsForLine"].bind(this)
        this["runsForLine"] = this["runsForLine"].bind(this)
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,this.screen,this.name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('empty',theme.editor.empty)
        this.setColor('cursor',theme.cursor)
        this.setColor('selection',theme.selection)
        this.setColor('highlight',theme.highlight)
        this.setColor('yank',theme.novim.yank)
    }

    draw.prototype["draw"] = function ()
    {
        var blankRows, height, lines, r, row, view, y, _32_58_, _55_14_, _61_17_, _63_17_, _65_15_, _66_15_, _67_15_

        if (this.hidden())
        {
            return
        }
        view = this.state.s.view
        lines = this.state.s.lines
        if ((this.complete != null))
        {
            lines = this.complete.preDrawLines(lines)
        }
        y = view[1]
        row = -this.state.s.scrollOffset
        while (y < lines.length && row < this.cells.rows)
        {
            height = this.state.lineHeight(y)
            if (row < 0)
            {
                blankRows = _k_.min(this.cells.rows,(row + height))
                for (r = 0; r < blankRows; r++)
                {
                    this.cells.bg_fill(0,r,-1,r,this.color.empty)
                }
            }
            if (row >= 0)
            {
                if (row + height > this.cells.rows)
                {
                    break
                }
                this.drawLine(lines[y],y,row,this.state.lineScale(y))
            }
            row += height
            y += 1
        }
        this.drawTrailingRows(row)
        ;(this.susan != null ? this.susan.draw() : undefined)
        this.drawHighlights()
        this.drawSelections()
        this.drawYank()
        ;(this.complete != null ? this.complete.drawCompletion() : undefined)
        this.drawCursors()
        ;(this.complete != null ? this.complete.drawPopup() : undefined)
        ;(this.gutter != null ? this.gutter.draw() : undefined)
        ;(this.mapscr != null ? this.mapscr.draw() : undefined)
        ;(this.scroll != null ? this.scroll.draw() : undefined)
        mode.postDraw(this.state)
        return draw.__super__.draw.call(this)
    }

    draw.prototype["runsForLine"] = function (y)
    {
        if (!this.cells.screen.t.textSizing)
        {
            return []
        }
        if (this.state.lineScale(y) !== 1 || this.state.isWrapped(y))
        {
            return []
        }
        return this.state.scaleRunsForLine(y)
    }

    draw.prototype["selectionBackgroundFor"] = function (x, y)
    {
        var bg, rng

        if (_k_.empty(this.state.s.selections))
        {
            return
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (y < rng[1] || y > rng[3])
            {
                continue
            }
            if (y === rng[1] && x < rng[0])
            {
                continue
            }
            if (y === rng[3] && x >= rng[2])
            {
                continue
            }
            bg = this.color.selection.line
            if (belt.isSpanLineRange(this.state.s.lines,rng))
            {
                bg = this.color.selection.span
            }
            if (!this.cells.screen.t.hasFocus)
            {
                bg = color.darken(bg)
            }
            return color.values(bg)
        }
    }

    draw.prototype["cellsForLine"] = function (y)
    {
        var lines, runs

        lines = this.state.s.lines
        runs = this.runsForLine(y)
        return sue.cellPositionsForLine(lines,y,runs)
    }

    draw.prototype["drawLine"] = function (line, y, row, scale = 1, classes = null)
    {
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, gi, headerClass, k, linel, pr, px, ri, rs, run, runs, selbg, si, span, starts, stop, sw, syntax, top, view, vx, width, widths, wk, wrapped, ws, x1, x2, _128_26_, _129_68_, _131_68_

        row = (row != null ? row : this.state.rowOfLine(y))
        scale = (scale != null ? scale : this.state.lineScale(y))
        bg = this.color.bg
        checkColor = false
        headerClass = null
        syntax = this.state.syntax
        view = this.state.s.view
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            var list = _k_.list(colorspans.spansForLine((((_129_68_=this.state.s.colors.fg) != null ? _129_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_131_68_=this.state.s.colors.bg) != null ? _131_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        wrapped = this.state.isWrapped(y)
        starts = this.state.wrapStarts(y)
        vx = this.state.viewX(y)
        runs = []
        if (scale === 1 && !wrapped && this.cells.screen.t.textSizing)
        {
            runs = this.state.scaleRunsForLine(y)
        }
        linel = kseg.width(line) * scale - vx
        var list2 = _k_.list(runs)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            run = list2[_c_]
            x2 = _k_.min(run[1],line.length)
            linel += kseg.width(line.slice(run[0], typeof x2 === 'number' ? x2 : -1)) * (run[2] - 1)
        }
        si = 0
        sw = 0
        ri = 0
        wk = 0
        ws = 0
        widths = []
        while (si < line.length)
        {
            if (wk + 1 < starts.length && si === starts[wk + 1])
            {
                widths.push(sw - ws)
                wk += 1
                ws = sw
            }
            if (ri < runs.length && si >= runs[ri][0])
            {
                ;[x1,x2,rs] = runs[ri]
                ri += 1
                top = row - (rs - 1)
                stop = _k_.min(x2,line.length)
                for (gi = si; gi < stop; gi++)
                {
                    cw = kseg.segWidth(line[gi])
                    cw = _k_.max(1,cw)
                    px = sw - view[0]
                    if (top >= 0 && px >= 0 && px < this.cells.cols)
                    {
                        clss = classes[gi]
                        clss = (clss != null ? clss : 'text')
                        fg = syntax.getColor(gi,y,clss)
                        var list3 = _k_.list(fgSpans)
                        for (var _d_ = 0; _d_ < list3.length; _d_++)
                        {
                            span = list3[_d_]
                            if ((span[0] <= gi && gi < span[1]))
                            {
                                fg = span[2]
                                break
                            }
                        }
                        ch = syntax.getChar(gi,y,line[gi],clss)
                        selbg = this.selectionBackgroundFor(gi,y)
                        this.cells.add_scaled(px,top,ch,fg,((selbg != null ? selbg : bg)),rs,y)
                    }
                    sw += cw * rs
                }
                si = stop
                continue
            }
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            px = (sw - ws) * scale - vx
            pr = row + wk * scale
            if (px >= this.cells.cols && !wrapped)
            {
                break
            }
            if (px >= 0 && px + cw * scale <= this.cells.cols)
            {
                ci = si
                clss = classes[ci]
                clss = (clss != null ? clss : 'text')
                fg = syntax.getColor(ci,y,clss)
                var list4 = _k_.list(fgSpans)
                for (var _e_ = 0; _e_ < list4.length; _e_++)
                {
                    span = list4[_e_]
                    if ((span[0] <= ci && ci < span[1]))
                    {
                        fg = span[2]
                        break
                    }
                }
                ch = syntax.getChar(ci,y,line[si],clss)
                if (ch === "#")
                {
                    checkColor = true
                }
                else if (_k_.in(ch,'0█'))
                {
                    if (clss.endsWith('header'))
                    {
                        headerClass = clss
                    }
                }
                this.cells.add_scaled(px,pr,ch,fg,bg,scale,y)
                if (clss === 'invert_bg')
                {
                    bg = this.color.bg
                }
            }
            sw += cw
            si += 1
        }
        if (wrapped)
        {
            widths.push(sw - ws)
            var list5 = _k_.list(widths)
            for (k = 0; k < list5.length; k++)
            {
                width = list5[k]
                this.drawRowBackground(y,row + k * scale,width * scale,scale)
            }
            this.drawColorBackgrounds(y,row,bgSpans,scale)
            return
        }
        this.drawRowBackground(y,row,linel,scale)
        if (checkColor)
        {
            this.drawColorPills(line,row,linel,scale)
        }
        if (headerClass)
        {
            this.drawAsciiHeader(line,row,headerClass,y,scale)
        }
        return this.drawColorBackgrounds(y,row,bgSpans,scale)
    }

    draw.prototype["drawColorBackgrounds"] = function (y, row, spans, scale = 1)
    {
        var cells, cr, cx, lastIndex, r, span, view, x, x1, x2

        view = this.state.s.view
        cells = this.cellsForLine(y)
        lastIndex = cells.length - 1
        if (this.state.isWrapped(y))
        {
            var list = _k_.list(spans)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                for (x = span[0]; x < _k_.min(span[1],lastIndex); x++)
                {
                    ;[cx,cr] = this.posCell(x,y,cells)
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    for (r = cr; r < _k_.min(this.cells.rows,cr + scale); r++)
                    {
                        this.cells.bg_rect(cx,r,cx + scale - 1,r,span[2])
                    }
                }
            }
            return
        }
        var list1 = _k_.list(spans)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            x1 = _k_.max(0,(cells[_k_.min(span[0],lastIndex)] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(cells[_k_.min(span[1],lastIndex)] * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            for (r = row; r < row + scale; r++)
            {
                this.cells.bg_rect(x1,r,(x2 - 1),r,span[2])
            }
        }
    }

    draw.prototype["drawRowBackground"] = function (y, row, linel, scale = 1)
    {
        var r

        for (r = row; r < _k_.min(this.cells.rows,row + scale); r++)
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,r,linel,r,this.color.bg)
            }
            this.cells.bg_fill(_k_.max(0,linel),r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawTrailingRows"] = function (row = 0)
    {
        var r

        for (r = row; r < this.cells.rows; r++)
        {
            this.cells.bg_fill(0,r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, bgc, cells, cr, cx, highlight, hlc, i, lastIndex, li, r, row, scale, ul, ulc, x, xe, xs, _302_87_

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(this.state.s.highlights)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            highlight = list[_a_]
            li = highlight[1]
            row = this.state.rowOfLine(li)
            scale = this.state.lineScale(li)
            if (row >= this.cells.rows)
            {
                break
            }
            if (row < 0)
            {
                continue
            }
            if (row + this.state.lineHeight(li) > this.cells.rows)
            {
                continue
            }
            ;[xs,xe] = this.clipToView(li,highlight[0],_k_.min(highlight[2],(((_302_87_=this.state.s.lines[li]) != null ? _302_87_ : [])).length))
            if (xs >= xe)
            {
                continue
            }
            cells = this.cellsForLine(li)
            lastIndex = cells.length - 1
            for (x = xs; x < xe; x++)
            {
                ;[cx,cr] = this.posCell(_k_.min(x,lastIndex),li,cells)
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                hlc = this.cells.get_char(cx,cr)
                if (this.cells.isScaled(cx,cr))
                {
                    continue
                }
                switch (hlc)
                {
                    case '{':
                    case '[':
                    case '(':
                    case ')':
                    case ']':
                    case '}':
                        ulc = this.color.highlight.bracket_ul
                        bgc = this.color.highlight.bracket
                        break
                    case "'":
                    case '"':
                        ulc = this.color.highlight.string_ul
                        bgc = this.color.highlight.string
                        break
                    default:
                        ulc = ul
                        bgc = bg
                }

                for (r = cr; r < _k_.min(this.cells.rows,cr + scale); r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.cells.set_bg(cx + i,r,bgc)
                    }
                }
                this.cells.set_char(cx,cr,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.set_mark(cx,cr,'highlight')
                this.cells.adjustContrastForHighlight(cx,cr,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, linebg, selection, spanbg

        spanbg = this.color.selection.span
        linebg = this.color.selection.line
        if (!this.cells.screen.t.hasFocus)
        {
            spanbg = color.darken(spanbg)
            linebg = color.darken(linebg)
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            selection = list[_a_]
            bg = (belt.isSpanLineRange(this.state.s.lines,selection) ? spanbg : linebg)
            this.drawRange(selection,bg,'selection')
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var rng

        if (_k_.empty(this.state.novim.yankFlash))
        {
            return
        }
        var list = _k_.list(this.state.novim.yankFlash)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            this.drawRange(rng,this.color.yank)
        }
    }

    draw.prototype["drawRange"] = function (rng, bg, mark)
    {
        var block, cells, cr, cx, i, lastIndex, li, r, row, scale, start, x, xe, xs, _378_37_

        start = _k_.max(rng[1],this.state.s.view[1])
        if (start > rng[3])
        {
            return
        }
        for (li = start; li <= rng[3]; li++)
        {
            row = this.state.rowOfLine(li)
            if (row < 0)
            {
                continue
            }
            if (row + this.state.lineHeight(li) > this.cells.rows)
            {
                break
            }
            xs = 0
            if (li === rng[1])
            {
                xs = rng[0]
            }
            xe = (((_378_37_=this.state.s.lines[li]) != null ? _378_37_ : [])).length
            if (li === rng[3])
            {
                xe = rng[2]
            }
            ;[xs,xe] = this.clipToView(li,xs,xe)
            if (xs >= xe)
            {
                continue
            }
            scale = this.state.lineScale(li)
            cells = this.cellsForLine(li)
            lastIndex = cells.length - 1
            for (x = xs; x < xe; x++)
            {
                ;[cx,cr] = this.posCell(_k_.min(x,lastIndex),li,cells)
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                block = this.cells.blockAt(cx,cr)
                if ((block != null))
                {
                    if (block[4] !== li)
                    {
                        continue
                    }
                    this.cells.bg_block(block,bg)
                    this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                    if (mark)
                    {
                        this.cells.set_mark(block[0],block[1],mark)
                    }
                    continue
                }
                for (r = cr; r < _k_.min(this.cells.rows,cr + scale); r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.cells.set_bg(cx + i,r,bg)
                        this.cells.adjustContrastForHighlight(cx + i,r,bg)
                    }
                }
                if (mark)
                {
                    this.cells.set_mark(cx,cr,mark)
                }
            }
        }
    }

    draw.prototype["clipToView"] = function (y, xs, xe)
    {
        var scale, vx

        if (this.state.isWrapped(y))
        {
            return [xs,xe]
        }
        vx = this.state.s.view[0]
        scale = this.state.lineScale(y)
        return [_k_.max(xs,parseInt(vx / scale)),_k_.min(xe,parseInt((vx + this.cells.cols - 1) / scale) + 1)]
    }

    draw.prototype["cursorRunScale"] = function (pos)
    {
        var run, x, y

        ;[x,y] = pos
        var list = _k_.list(this.runsForLine(y))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            run = list[_a_]
            if (run[0] <= x && x <= run[1])
            {
                return run[2]
            }
        }
        return 1
    }

    draw.prototype["cursorRowAndScale"] = function (pos)
    {
        var linescale, row, runscale

        linescale = this.state.lineScale(pos[1])
        runscale = this.cursorRunScale(pos)
        row = this.posCell(pos[0],pos[1])[1]
        if (runscale > 1 && linescale === 1)
        {
            return [row - (runscale - 1),runscale]
        }
        else
        {
            return [row,linescale]
        }
    }

    draw.prototype["posCell"] = function (x, y, cells)
    {
        var cx, dr

        cells = (cells != null ? cells : this.cellsForLine(y))
        ;[cx,dr] = this.state.lineCell(x,y,cells)
        return [cx - this.state.viewX(y),this.state.rowOfLine(y) + dr]
    }

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, cx, fg, idx, mainCursor, row, s, scale, x, y

        s = this.state.s
        mainCursor = this.state.mainCursor()
        this.cells.screen.t.hideStaleImgs(666)
        fg = this.color.cursor.fg
        bg = mode.themeColor(this.state,'cursor.multi',this.color.cursor.multi)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        this.cursorIds = {}
        var list = _k_.list(s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                ;[row,scale] = this.cursorRowAndScale(cursor)
                cx = this.posCell(cursor[0],cursor[1])[0]
                this.cursorIds[idx] = this.cells.draw_rounded_multi_cursor(cx,row,bg,scale)
            }
        }
        if (this.isCursorVisible(mainCursor))
        {
            fg = this.color.cursor.fg
            bg = mode.themeColor(this.state,'cursor.main',this.color.cursor.main)
            if (!this.hasFocus())
            {
                bg = color.darken(bg)
            }
            ;[y,scale] = this.cursorRowAndScale(mainCursor)
            x = this.posCell(mainCursor[0],mainCursor[1])[0]
            if (s.cursors.length <= 1)
            {
                if (this.isCursorInEmpty())
                {
                    bg = color.darken(bg,0.5)
                }
                else if (' ' === this.cells.get_char(x,y))
                {
                    bg = color.darken(bg,0.8)
                }
            }
            if (!this.cells.screen.t.hasFocus)
            {
                bg = color.darken(bg)
            }
            return this.cursorIds[s.main] = this.cells.draw_rounded_cursor(x,y,bg,scale)
        }
    }

    draw.prototype["showCursorsOutsideRects"] = function (rects)
    {
        var cursor, idx, imgId

        rects = rects.map((function (rect)
        {
            return this.cells.rectForScreen(rect)
        }).bind(this))
        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            if (imgId = this.cursorIds[idx])
            {
                if (this.isCursorVisible(cursor) && !this.isCursorInAnyRect(cursor,rects))
                {
                    global.ked_ttio.showImg(imgId[0],imgId[1])
                }
            }
        }
    }

    draw.prototype["isCursorInAnyRect"] = function (cursor, rects)
    {
        var rect

        var list = _k_.list(rects)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rect = list[_a_]
            if (this.isCursorInRect(cursor,rect))
            {
                return true
            }
        }
        return false
    }

    draw.prototype["drawColorPills"] = function (line, row, linel, scale = 1)
    {
        var cx, dta, idx, rng, rngs

        if (rngs = kstr.colorRanges(kseg.str(line)))
        {
            cx = _k_.max(0,linel) + 1
            var list = _k_.list(rngs)
            for (idx = 0; idx < list.length; idx++)
            {
                rng = list[idx]
                dta = 4
                if (idx === 0)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
                    cx += 1
                    dta--
                }
                if (idx === rngs.length - 1)
                {
                    dta--
                }
                this.cells.bg_rect(cx,row,cx + dta,row,rng.color)
                cx += dta
                if (idx === rngs.length - 1)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
                }
            }
        }
    }

    draw.prototype["drawAsciiHeader"] = function (line, row, clss, y = null, scale = 1)
    {
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _550_26_, _551_66_, _552_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_551_66_=this.state.s.colors.fg) != null ? _551_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_552_66_=this.state.s.colors.bg) != null ? _552_66_ : [])),y)
        }
        custom = function (x)
        {
            var span

            var list = _k_.list(fgSpans)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                if ((span[0] <= x && x < span[1]))
                {
                    return true
                }
            }
            var list1 = _k_.list(bgSpans)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if ((span[0] <= x && x < span[1]))
                {
                    return true
                }
            }
            return false
        }
        chunks = kseg.chunks(line)
        var list = _k_.list(chunks)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            chunk = list[_c_]
            if (!(_k_.in(chunk.segl[0],'0█')))
            {
                continue
            }
            ix0 = chunk.index
            if (!custom(ix0))
            {
                x = ix0 * scale - this.state.s.view[0]
                this.cells.set(x,row,'▎',theme.syntax[clss + ' highlight'],theme.syntax[clss])
            }
            if (chunk.segl.length <= 1)
            {
                continue
            }
            ix1 = chunk.index + chunk.segl.length - 1
            if (!custom(ix1))
            {
                x = ix1 * scale - this.state.s.view[0]
                this.cells.set(x,row,'▋',theme.syntax[clss],theme.syntax[clss + ' shadow'])
            }
        }
    }

    return draw
})()

export default draw;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCO09BQTZCLFVBQTdCOztPQUNhLFdBQUE7OztBQUNsQixRQUFEOztxQkFBTTthQUVGLE1BQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7NkNBRUQsS0FBQyxPQUFPLEtBQUMsS0FBSztRQUVwQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQUV0Qzs7OztZQUVTLEtBQUM7Ozs7UUFLTixPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFFaEMsSUFBTSxLQUFLO1FBQ1gsT0FBTyxLQUFDLE1BQU0sRUFBRTtlQUVWLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxTQUFTLEtBQUMsTUFBTSxXQUFXO2dCQUV4QixNQUFNOztnQkFDTCxvQkFBZ0IsS0FBQyxNQUFNLE1BQU0sTUFBSTtxQkFDN0IsSUFBSyxPQUFJOztvQkFDVCxLQUFDLE1BQU0sUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUMsTUFBTTs7O2dCQUVwQyxPQUFPOztvQkFDRyxNQUFNLFNBQVMsS0FBQyxNQUFNOztvQkFBL0I7O2dCQUNBLEtBQUMsU0FBUyxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUMsTUFBTSxV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
//# sourceURL=../../../kode/ked/edit/draw.kode
