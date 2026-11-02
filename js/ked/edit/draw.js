var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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

import mode from "./mode.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,screen,name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('empty',theme.editor.empty)
        this.setColor('cursor',theme.cursor)
        this.setColor('selection',theme.selection)
        this.setColor('highlight',theme.highlight)
        this.setColor('yank',theme.novim.yank)
    }

    draw.prototype["draw"] = function ()
    {
        var blankRows, lines, r, row, scale, view, y, _46_58_, _75_17_, _77_17_, _79_15_, _80_15_, _81_15_

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
            scale = this.state.scaleOfLine(y)
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

    draw.prototype["drawLine"] = function (line, y, row, scale = 1, classes = null)
    {
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, headerClass, linel, px, si, span, sw, syntax, view, _110_26_, _111_68_, _113_68_

        row = (row != null ? row : this.state.rowOfLine(y))
        scale = (scale != null ? scale : this.state.scaleOfLine(y))
        bg = this.color.bg
        checkColor = false
        headerClass = null
        syntax = this.state.syntax
        view = this.state.s.view
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            var list = _k_.list(colorspans.spansForLine((((_111_68_=this.state.s.colors.fg) != null ? _111_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_113_68_=this.state.s.colors.bg) != null ? _113_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        linel = kseg.width(line) * scale - view[0]
        si = 0
        sw = 0
        while (si < line.length)
        {
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            px = sw * scale - view[0]
            if (px >= this.cells.cols)
            {
                break
            }
            if (px >= 0 && px + cw * scale <= this.cells.cols)
            {
                ci = sw
                clss = classes[ci]
                clss = (clss != null ? clss : 'text')
                fg = syntax.getColor(ci,y,clss)
                var list2 = _k_.list(fgSpans)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    span = list2[_c_]
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
                this.cells.add_scaled(px,row,ch,fg,bg,scale)
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
        return this.drawColorBackgrounds(row,bgSpans,scale)
    }

    draw.prototype["drawColorBackgrounds"] = function (row, spans, scale = 1)
    {
        var r, span, view, x1, x2

        view = this.state.s.view
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            x1 = _k_.max(0,(span[0] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(span[1] * scale - view[0]))
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
        var bg, bgc, cx, highlight, hlc, i, li, r, row, scale, ul, ulc, vx, vy, x, xe, xs

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
            scale = this.state.scaleOfLine(li)
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
            if (xs >= xe)
            {
                continue
            }
            for (var _c_ = x = xs, _d_ = xe; (_c_ <= _d_ ? x < xe : x > xe); (_c_ <= _d_ ? ++x : --x))
            {
                cx = x * scale - vx
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                hlc = this.cells.get_char(cx,row)
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
                this.cells.set_char(cx,row,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.adjustContrastForHighlight(cx,row,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, cx, i, li, linebg, r, row, scale, selection, spanbg, start, vx, x, xe, xs

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
                scale = this.state.scaleOfLine(li)
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
                    xe = kseg.width(this.state.s.lines[li])
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    continue
                }
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    cx = x * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
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
                }
                row += scale
            }
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var bg, cx, i, li, r, rng, row, scale, start, vx, vy, x, xe, xs

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
                scale = this.state.scaleOfLine(li)
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
                    xe = kseg.width(this.state.s.lines[li])
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    continue
                }
                for (var _e_ = x = xs, _f_ = xe; (_e_ <= _f_ ? x < xe : x > xe); (_e_ <= _f_ ? ++x : --x))
                {
                    cx = x * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
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

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, cx, fg, mainCursor, s, scale, x, y

        s = this.state.s
        mainCursor = this.state.mainCursor()
        fg = this.color.cursor.fg
        bg = mode.themeColor(this.state,'cursor.multi',this.color.cursor.multi)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                scale = this.state.scaleOfLine(cursor[1])
                cx = cursor[0] * scale - s.view[0]
                this.cells.draw_rounded_multi_cursor(cx,this.state.rowOfLine(cursor[1]),bg,scale)
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
            scale = this.state.scaleOfLine(mainCursor[1])
            var _b_ = [mainCursor[0] * scale - s.view[0],this.state.rowOfLine(mainCursor[1])]; x = _b_[0]; y = _b_[1]

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
            return this.cells.draw_rounded_cursor(x,y,bg,scale)
        }
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
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _449_26_, _450_66_, _451_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_450_66_=this.state.s.colors.fg) != null ? _450_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_451_66_=this.state.s.colors.bg) != null ? _451_66_ : [])),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCOztPQUNhLFdBQUE7OztBQUVWLFFBQVQ7O3FCQUFzQjthQUVsQixNQUFHLFFBQU8sTUFBSzs7OzZDQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQVF0Qzs7OztZQUVVLEtBQUM7Ozs7UUFLUCxPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFHaEMsSUFBTSxLQUFLO1FBQ1gsT0FBTyxLQUFDLE1BQU0sRUFBRTtlQUVWLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxRQUFRLEtBQUMsTUFBTSxZQUFZO2dCQUV4QixNQUFNOztnQkFHTCxvQkFBZ0IsS0FBQyxNQUFNLE1BQU0sTUFBSTsrQkFDN0IsSUFBSyxTQUFJLDZCQUFBLGdCQUFBOztvQkFDVCxLQUFDLE1BQU0sUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUMsTUFBTTs7O2dCQUVwQyxPQUFPOztvQkFDRyxNQUFNLFFBQVEsS0FBQyxNQUFNOztvQkFBOUI7O2dCQUNBLEtBQUMsU0FBUyxNQUFNLEdBQUcsRUFBRSxJQUFJOztZQUU3QixPQUFPO1lBQ1AsS0FBTzs7UUFFWCxLQUFDLGlC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/draw.kode
