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
        var blankRows, lines, r, row, scale, view, y, _32_58_, _55_14_, _61_17_, _63_17_, _65_15_, _66_15_, _67_15_

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
            scale = this.state.lineHeight(y)
            if (row < 0)
            {
                blankRows = _k_.min(this.cells.rows,(row + scale))
                for (var _a_ = r = 0, _b_ = blankRows; (_a_ <= _b_ ? r < blankRows : r > blankRows); (_a_ <= _b_ ? ++r : --r))
                {
                    this.cells.bg_fill(0,r,-1,r,this.color.empty)
                }
            }
            if (row >= 0)
            {
                if (row + scale > this.cells.rows)
                {
                    break
                }
                this.drawLine(lines[y],y,row,scale)
            }
            row += scale
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
        if (this.state.lineHeight(y) !== 1)
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
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, gi, headerClass, linel, px, ri, rs, run, runs, selbg, si, span, stop, sw, syntax, top, view, x1, x2, _128_26_, _129_68_, _131_68_

        row = (row != null ? row : this.state.rowOfLine(y))
        scale = (scale != null ? scale : this.state.lineHeight(y))
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
        runs = []
        if (scale === 1 && this.cells.screen.t.textSizing)
        {
            runs = this.state.scaleRunsForLine(y)
        }
        linel = kseg.width(line) * scale - view[0]
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
        while (si < line.length)
        {
            if (ri < runs.length && si >= runs[ri][0])
            {
                var _d_ = runs[ri]; x1 = _d_[0]; x2 = _d_[1]; rs = _d_[2]

                ri += 1
                top = row - (rs - 1)
                stop = _k_.min(x2,line.length)
                for (var _e_ = gi = si, _f_ = stop; (_e_ <= _f_ ? gi < stop : gi > stop); (_e_ <= _f_ ? ++gi : --gi))
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
                        for (var _10_ = 0; _10_ < list3.length; _10_++)
                        {
                            span = list3[_10_]
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
            px = sw * scale - view[0]
            if (px >= this.cells.cols)
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
                for (var _11_ = 0; _11_ < list4.length; _11_++)
                {
                    span = list4[_11_]
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
                this.cells.add_scaled(px,row,ch,fg,bg,scale,y)
                if (clss === 'invert_bg')
                {
                    bg = this.color.bg
                }
            }
            sw += cw
            si += 1
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
        var cells, last, r, span, view, x1, x2

        view = this.state.s.view
        cells = this.cellsForLine(y)
        last = cells.length - 1
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            x1 = _k_.max(0,(cells[_k_.min(span[0],last)] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(cells[_k_.min(span[1],last)] * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            for (var _b_ = r = row, _c_ = row + scale; (_b_ <= _c_ ? r < row + scale : r > row + scale); (_b_ <= _c_ ? ++r : --r))
            {
                this.cells.bg_rect(x1,r,(x2 - 1),r,span[2])
            }
        }
    }

    draw.prototype["drawRowBackground"] = function (y, row, linel, scale = 1)
    {
        var r

        for (var _a_ = r = row, _b_ = _k_.min(this.cells.rows,row + scale); (_a_ <= _b_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_a_ <= _b_ ? ++r : --r))
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

        for (var _a_ = r = row, _b_ = this.cells.rows; (_a_ <= _b_ ? r < this.cells.rows : r > this.cells.rows); (_a_ <= _b_ ? ++r : --r))
        {
            this.cells.bg_fill(0,r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, bgc, cells, cx, highlight, hlc, i, last, li, r, row, scale, ul, ulc, vx, vy, x, xe, xs, _278_44_

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var _a_ = this.state.s.view; vx = _a_[0]; vy = _a_[1]

        var list = _k_.list(this.state.s.highlights)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            highlight = list[_b_]
            li = highlight[1]
            row = this.state.rowOfLine(li)
            scale = this.state.lineHeight(li)
            if (row >= this.cells.rows)
            {
                break
            }
            if (row < 0)
            {
                continue
            }
            if (row + scale > this.cells.rows)
            {
                continue
            }
            xs = _k_.max(highlight[0],parseInt(vx / scale))
            xe = _k_.min(highlight[2],(parseInt((vx + this.cells.cols - 1) / scale) + 1))
            xe = _k_.min(xe,(((_278_44_=this.state.s.lines[li]) != null ? _278_44_ : [])).length)
            if (xs >= xe)
            {
                continue
            }
            cells = this.cellsForLine(li)
            last = cells.length - 1
            for (var _c_ = x = xs, _d_ = xe; (_c_ <= _d_ ? x < xe : x > xe); (_c_ <= _d_ ? ++x : --x))
            {
                cx = cells[_k_.min(x,last)] * scale - vx
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                hlc = this.cells.get_char(cx,row)
                if (this.cells.isScaled(cx,row))
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

                for (var _e_ = r = row, _f_ = _k_.min(this.cells.rows,row + scale); (_e_ <= _f_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_e_ <= _f_ ? ++r : --r))
                {
                    for (var _10_ = i = 0, _11_ = scale; (_10_ <= _11_ ? i < scale : i > scale); (_10_ <= _11_ ? ++i : --i))
                    {
                        this.cells.set_bg(cx + i,r,bgc)
                    }
                }
                if (this.cells.screen.t.headless)
                {
                    this.cells.set_char(cx,row,hlc)
                }
                else
                {
                    this.cells.set_char(cx,row,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                }
                this.cells.set_mark(cx,row,'highlight')
                this.cells.adjustContrastForHighlight(cx,row,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, block, cells, cx, i, last, li, linebg, r, row, scale, selection, spanbg, start, vx, x, xe, xs, _353_45_

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
            start = _k_.max(selection[1],this.state.s.view[1])
            row = this.state.rowOfLine(start)
            if (start > selection[3])
            {
                continue
            }
            for (var _b_ = li = start, _c_ = selection[3]; (_b_ <= _c_ ? li <= selection[3] : li >= selection[3]); (_b_ <= _c_ ? ++li : --li))
            {
                scale = this.state.lineHeight(li)
                vx = this.state.s.view[0]
                if (row < 0)
                {
                    row += scale
                    continue
                }
                if (row >= this.cells.rows)
                {
                    break
                }
                if (row + scale > this.cells.rows)
                {
                    break
                }
                if (li === selection[1])
                {
                    xs = selection[0]
                }
                else
                {
                    xs = 0
                }
                if (li === selection[3])
                {
                    xe = selection[2]
                }
                else
                {
                    xe = (((_353_45_=this.state.s.lines[li]) != null ? _353_45_ : [])).length
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                cells = this.cellsForLine(li)
                last = cells.length - 1
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    cx = cells[_k_.min(x,last)] * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    block = this.cells.blockAt(cx,row)
                    if ((block != null))
                    {
                        if (block[4] !== li)
                        {
                            continue
                        }
                        this.cells.bg_block(block,bg)
                        this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                        this.cells.set_mark(block[0],block[1],'selection')
                        continue
                    }
                    for (var _f_ = r = row, _10_ = _k_.min(this.cells.rows,row + scale); (_f_ <= _10_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_f_ <= _10_ ? ++r : --r))
                    {
                        for (var _11_ = i = 0, _12_ = scale; (_11_ <= _12_ ? i < scale : i > scale); (_11_ <= _12_ ? ++i : --i))
                        {
                            this.cells.set_bg(cx + i,r,bg)
                            this.cells.adjustContrastForHighlight(cx + i,r,bg)
                        }
                    }
                    this.cells.set_mark(cx,row,'selection')
                }
                row += scale
            }
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var bg, block, cells, cx, i, last, li, r, rng, row, scale, start, vx, vy, x, xe, xs, _423_45_

        if (_k_.empty(this.state.yankFlash))
        {
            return
        }
        bg = this.color.yank
        var _a_ = this.state.s.view; vx = _a_[0]; vy = _a_[1]

        var list = _k_.list(this.state.yankFlash)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            rng = list[_b_]
            start = _k_.max(rng[1],vy)
            row = this.state.rowOfLine(start)
            if (start > rng[3])
            {
                continue
            }
            for (var _c_ = li = start, _d_ = rng[3]; (_c_ <= _d_ ? li <= rng[3] : li >= rng[3]); (_c_ <= _d_ ? ++li : --li))
            {
                scale = this.state.lineHeight(li)
                if (row < 0)
                {
                    row += scale
                    continue
                }
                if (row >= this.cells.rows)
                {
                    break
                }
                if (row + scale > this.cells.rows)
                {
                    break
                }
                if (li === rng[1])
                {
                    xs = rng[0]
                }
                else
                {
                    xs = 0
                }
                if (li === rng[3])
                {
                    xe = rng[2]
                }
                else
                {
                    xe = (((_423_45_=this.state.s.lines[li]) != null ? _423_45_ : [])).length
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                cells = this.cellsForLine(li)
                last = cells.length - 1
                for (var _e_ = x = xs, _f_ = xe; (_e_ <= _f_ ? x < xe : x > xe); (_e_ <= _f_ ? ++x : --x))
                {
                    cx = cells[_k_.min(x,last)] * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    block = this.cells.blockAt(cx,row)
                    if ((block != null))
                    {
                        if (block[4] !== li)
                        {
                            continue
                        }
                        this.cells.bg_block(block,bg)
                        this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                        continue
                    }
                    for (var _10_ = r = row, _11_ = _k_.min(this.cells.rows,row + scale); (_10_ <= _11_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_10_ <= _11_ ? ++r : --r))
                    {
                        for (var _12_ = i = 0, _13_ = scale; (_12_ <= _13_ ? i < scale : i > scale); (_12_ <= _13_ ? ++i : --i))
                        {
                            this.cells.set_bg(cx + i,r,bg)
                            this.cells.adjustContrastForHighlight(cx + i,r,bg)
                        }
                    }
                }
                row += scale
            }
        }
    }

    draw.prototype["cursorRunScale"] = function (pos)
    {
        var run, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        var list = _k_.list(this.runsForLine(y))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            run = list[_b_]
            if (run[0] <= x && x <= run[1])
            {
                return run[2]
            }
        }
        return 1
    }

    draw.prototype["cursorRowAndScale"] = function (pos)
    {
        var linescale, runscale

        linescale = this.state.lineHeight(pos[1])
        runscale = this.cursorRunScale(pos)
        if (runscale > 1 && linescale === 1)
        {
            return [this.state.rowOfLine(pos[1]) - (runscale - 1),runscale]
        }
        else
        {
            return [this.state.rowOfLine(pos[1]),linescale]
        }
    }

    draw.prototype["cursorCellX"] = function (x, y)
    {
        var cells, last, scale

        cells = this.cellsForLine(y)
        scale = this.state.lineHeight(y)
        last = cells.length - 1
        if (x <= last)
        {
            return (cells[x] * scale)
        }
        return (cells[last] + (x - last)) * scale
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
                var _b_ = this.cursorRowAndScale(cursor); row = _b_[0]; scale = _b_[1]

                cx = this.cursorCellX(cursor[0],cursor[1]) - s.view[0]
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
            var _c_ = this.cursorRowAndScale(mainCursor); y = _c_[0]; scale = _c_[1]

            x = this.cursorCellX(mainCursor[0],mainCursor[1]) - s.view[0]
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
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _584_26_, _585_66_, _586_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_585_66_=this.state.s.colors.fg) != null ? _585_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_586_66_=this.state.s.colors.bg) != null ? _586_66_ : [])),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCO09BQTZCLFVBQTdCOztPQUNhLFdBQUE7OztBQUNsQixRQUFEOztxQkFBTTthQUVGLE1BQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7NkNBRUQsS0FBQyxPQUFPLEtBQUMsS0FBSztRQUVwQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQUV0Qzs7OztZQUVTLEtBQUM7Ozs7UUFLTixPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFFaEMsSUFBTSxLQUFLO1FBQ1gsT0FBTyxLQUFDLE1BQU0sRUFBRTtlQUVWLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxRQUFRLEtBQUMsTUFBTSxXQUFXO2dCQUV2QixNQUFNOztnQkFDTCxvQkFBZ0IsS0FBQyxNQUFNLE1BQU0sTUFBSTsrQkFDN0IsSUFBSyxTQUFJLDZCQUFBLGdCQUFBOztvQkFDVCxLQUFDLE1BQU0sUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUMsTUFBTTs7O2dCQUVwQyxPQUFPOztvQkFDRyxNQUFNLFFBQVEsS0FBQyxNQUFNOztvQkFBOUI7O2dCQUNBLEtBQUMsU0FBUyxNQUFNLEdBQUcsRUFBRSxJQUFJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/draw.kode
