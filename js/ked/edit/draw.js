var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
        var lines, row, scale, view, y, _46_58_, _68_17_, _70_17_, _72_15_, _73_15_, _74_15_

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
        row = 0
        while (y < lines.length && row < this.cells.rows)
        {
            scale = this.state.scaleOfLine(y)
            if (row + scale > this.cells.rows)
            {
                break
            }
            this.drawLine(lines[y],y,row,scale)
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
        var bg, bgSpans, c, ch, checkColor, ci, clss, cols, cw, fg, fgSpans, firstIndex, firstSegi, headerClass, linel, si, span, sw, syntax, view, x, _103_26_, _104_68_, _106_68_

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
            var list = _k_.list(colorspans.spansForLine((((_104_68_=this.state.s.colors.fg) != null ? _104_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_106_68_=this.state.s.colors.bg) != null ? _106_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        linel = (kseg.width(line) - view[0]) * scale
        c = 0
        firstIndex = kseg.indexAtWidth(line,view[0])
        firstSegi = kseg.segiAtWidth(line,view[0])
        if (firstIndex !== firstSegi)
        {
            c = 1
        }
        cols = _k_.max(1,parseInt(this.cells.cols / scale))
        x = 0
        si = 0
        sw = 0
        while (x < cols)
        {
            ci = x + view[0]
            while (sw < ci && si < line.length)
            {
                sw += kseg.segWidth(line[si])
                si += 1
            }
            if (si >= line.length)
            {
                break
            }
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
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            x += cw
            if (x < cols)
            {
                this.cells.add_scaled(c * scale,row,ch,fg,bg,scale)
                c += cw
            }
            if (clss === 'invert_bg')
            {
                bg = this.color.bg
            }
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
            x1 = _k_.max(0,((span[0] - view[0]) * scale))
            x2 = _k_.min(this.cells.cols,((span[1] - view[0]) * scale))
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
        var bg, bgc, cols, cx, highlight, hlc, i, li, r, row, scale, ul, ulc, vx, vy, x, xe, xs

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
            cols = _k_.max(1,parseInt(this.cells.cols / scale))
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
            xs = _k_.max(highlight[0],vx)
            xe = _k_.min(highlight[2],vx + cols)
            for (var _c_ = x = xs, _d_ = xe; (_c_ <= _d_ ? x < xe : x > xe); (_c_ <= _d_ ? ++x : --x))
            {
                cx = (x - vx) * scale
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
        var bg, cols, cx, i, li, linebg, r, row, scale, selection, spanbg, start, x, xe, xs

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
                cols = _k_.max(1,parseInt(this.cells.cols / scale))
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
                xs = _k_.max(xs,this.state.s.view[0])
                xe = _k_.min(xe,this.state.s.view[0] + cols)
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    cx = (x - this.state.s.view[0]) * scale
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
        var bg, cols, cx, i, li, r, rng, row, scale, start, vx, vy, x, xe, xs

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
                cols = _k_.max(1,parseInt(this.cells.cols / scale))
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
                xs = _k_.max(xs,vx)
                xe = _k_.min(xe,vx + cols)
                for (var _e_ = x = xs, _f_ = xe; (_e_ <= _f_ ? x < xe : x > xe); (_e_ <= _f_ ? ++x : --x))
                {
                    cx = (x - vx) * scale
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
                cx = (cursor[0] - s.view[0]) * scale
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
            var _b_ = [(mainCursor[0] - s.view[0]) * scale,this.state.rowOfLine(mainCursor[1])]; x = _b_[0]; y = _b_[1]

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
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _436_26_, _437_66_, _438_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_437_66_=this.state.s.colors.fg) != null ? _437_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_438_66_=this.state.s.colors.bg) != null ? _438_66_ : [])),y)
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
                x = (ix0 - this.state.s.view[0]) * scale
                this.cells.set(x,row,'▎',theme.syntax[clss + ' highlight'],theme.syntax[clss])
            }
            if (chunk.segl.length <= 1)
            {
                continue
            }
            ix1 = chunk.index + chunk.segl.length - 1
            if (!custom(ix1))
            {
                x = (ix1 - this.state.s.view[0]) * scale
                this.cells.set(x,row,'▋',theme.syntax[clss],theme.syntax[clss + ' shadow'])
            }
        }
    }

    return draw
})()

export default draw;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCOztPQUNhLFdBQUE7OztBQUVWLFFBQVQ7O3FCQUFzQjthQUVsQixNQUFHLFFBQU8sTUFBSzs7OzZDQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQVF0Qzs7OztZQUVVLEtBQUM7Ozs7UUFLUCxPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFHaEMsSUFBTSxLQUFLO1FBQ1gsTUFBTTtlQUVBLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxRQUFRLEtBQUMsTUFBTSxZQUFZO2dCQUVsQixNQUFNLFFBQVEsS0FBQyxNQUFNOztnQkFBOUI7O1lBRUEsS0FBQyxTQUFTLE1BQU0sR0FBRyxFQUFFLElBQUk7WUFFekIsT0FBTztZQUNQLEtBQU87O1FBRVgsS0FBQyxpQkFBaUI7UUFDbEIsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1VBRUQsS0FBQyxtQkFBRCxLQUFDLFNBQVU7UUFDWCxLQUFDO1VBQ0QsS0FBQyxtQkFBRCxLQUFDLFNBQVU7VUFFWCxLQUFDLGlCQUFELEtBQUMsT0FBUTtVQUNULEtBQUMsaUJBQUQsS0FBQyxPQUFRO1VBQ1QsS0FBQyxpQkFBRCxLQUFDLE9BQVE7UUFJVCxLQUFLLFNBQVMsS0FBQzs7OztvQkFVbkIsdUJBQVUsTUFBSyxHQUFFLEtBQUksUUFBTSxHQUFHLFVBQVE7Ozs7UUFFbEMsT0FBQSxjQUFBLE1BQVMsS0FBQyxNQUFNLFVBQVU7UUFDMUIsU0FBQSxnQkFBQSxRQUFTLEtBQUMsTUFBTSxZQUFZO1FBQzVCLEtBQUssS0FBQyxNQUFNO1FBRVosYUFBYTtRQUNiLGNBQWM7UUFFZCxTQUFTLEtBQUMsTUFBTTtRQUNoQixPQUFTLEtBQUMsTUFBTSxFQUFFO1FBRWxCO1FBQ0E7YUFFRyxLQUFDLE1BQU0sRUFBRTs7Z0NBQ0ksV0FBVyx5QkFBYyxLQUFDLE1BQU0sRUFBRSxPQUFPLDhCQUFTOzs7Z0JBQTFEO2dCQUNBLFFBQVEsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sT0FBTyxLQUFLOztpQ0FDeEMsV0FBVyx5QkFBYyxLQUFDLE1BQU0sRUFBRSxPQUFPLDhCQUFTOzs7Z0JBQTFEO2dCQUNBLFFBQVEsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sT0FBTyxLQUFLOzs7UUFFeEQsV0FBQSxrQkFBQSxVQUFXLE9BQU8sV0FBVztRQUU3QixTQUFTLEtBQUssTUFBTSxRQUFRLEtBQUssTUFBTTtRQUV2QyxJQUFJO1FBQ0osYUFBYSxLQUFLLGFBQWEsS0FBSyxLQUFLO1FBQ3pDLFlBQWEsS0FBSyxZQUFZLEtBQUssS0FBSztZQUMvQixlQUFjOztZQUF2QixJQUFJOztRQUVKLGVBQVcsV0FBTSxLQUFDLE1BQU0sT0FBTztRQUMvQixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7ZUFDQyxJQUFJOztZQUVOLEtBQUssSUFBRSxLQUFLO21CQUlOLEtBQUssTUFBTyxLQUFLLEtBQUs7O2dCQUN4QixNQUFNLEtBQUssU0FBUyxLQUFLO2dCQUN6QixNQUFNOztnQkFJUCxNQUFNLEtBQUs7O2dCQUVWOztZQUVKLE9BQU8sUUFBUTtZQUNmLFFBQUEsZUFBQSxPQUFRO1lBRVIsS0FBSyxPQUFPLFNBQVMsR0FBRyxFQUFFO2lDQUVkOzs7Z0JBQVI7cUJBQ0csS0FBSyxNQUFNLE1BQUEsS0FBSyxLQUFLOztvQkFDcEIsS0FBSyxLQUFLO29CQUNWOzs7WUFFUixLQUFLLE9BQU8sUUFBUSxHQUFHLEVBQUUsS0FBSyxJQUFJO2dCQUMvQixPQUFNOztnQkFBTSxhQUFhOzs0QkFDcEIsR0FBTTs7b0JBQ1AsS0FBSyxTQUFTOztvQkFBWSxjQUFjOzs7WUFFL0MsS0FBSyxLQUFLLFNBQVMsS0FBSztZQUN4QixhQUFTLEVBQUU7WUFDWCxLQUFLO2dCQUVGLElBQUk7O2dCQUVILEtBQUMsTUFBTSxXQUFXLElBQUUsTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHO2dCQUN2QyxLQUFLOztnQkFFTixTQUFROztnQkFDUCxLQUFLLEtBQUMsTUFBTTs7O1FBRXBCLEtBQUMsa0JBQWtCLEVBQUUsSUFBSSxNQUFNO1lBRWdCOztZQUEvQyxLQUFDLGVBQWdCLEtBQUssSUFBSSxNQUFNOztZQUNpQjs7WUFBakQsS0FBQyxnQkFBZ0IsS0FBSyxJQUFJLFlBQVksRUFBRTs7ZUFDeEMsS0FBQyxxQkFBcUIsSUFBSSxRQUFROzs7b0JBRXRDLG1DQUFzQixLQUFJLE9BQU0sUUFBTTs7OztRQUVsQyxPQUFPLEtBQUMsTUFBTSxFQUFFOzRCQUVKOzs7WUFBUjtZQUVBLGFBQVMsSUFBSSxLQUFLLEtBQUcsS0FBSyxNQUFNO1lBQ2hDLGFBQVMsS0FBQyxNQUFNLE9BQU8sS0FBSyxLQUFHLEtBQUssTUFBTTtnQkFFOUIsTUFBTTs7Z0JBQWxCOzsyQkFFSSxJQUFLLFdBQU0sTUFBSSx5QkFBSixNQUFJLFlBQUosTUFBSTs7Z0JBQ2YsS0FBQyxNQUFNLFFBQVEsR0FBRyxHQUFHLEtBQUcsR0FBRyxFQUFFLEtBQUs7Ozs7O29CQVE5QyxnQ0FBbUIsR0FBRSxLQUFJLE9BQU0sUUFBTTs7Ozt1QkFFN0IsSUFBSyxtQkFBVSxLQUFDLE1BQU0sS0FBTSxNQUFJLGtDQUFqQixLQUFDLE1BQU0sS0FBTSxNQUFJLHFCQUFqQixLQUFDLE1BQU0sS0FBTSxNQUFJOztnQkFDN0IsUUFBUTs7Z0JBQ1AsS0FBQyxNQUFNLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFDLE1BQU07O1lBQ3RDLEtBQUMsTUFBTSxnQkFBWSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBQyxNQUFNOzs7O29CQVFsRCwrQkFBa0IsTUFBSTs7Ozt1QkFFZCxJQUFLLFdBQU0sS0FBQyxNQUFNLHdCQUFQLEtBQUMsTUFBTSxXQUFQLEtBQUMsTUFBTTs7WUFDbEIsS0FBQyxNQUFNLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFDLE1BQU07Ozs7b0JBUXZDOzs7O1FBRUksS0FBSyxLQUFDLE1BQU0sVUFBVTtRQUN0QixLQUFLLEtBQUMsTUFBTSxVQUFVO2FBQ00sS0FBQyxNQUFNLE9BQU8sRUFBRTs7WUFBNUMsS0FBSyxNQUFNLE9BQU87O2tCQUVSLEtBQUMsTUFBTSxFQUFFLE1BQWxCLGFBQUc7OzRCQUVhLEtBQUMsTUFBTSxFQUFFOzs7WUFBdEI7WUFFQSxLQUFRLFVBQVU7WUFDbEIsTUFBUSxLQUFDLE1BQU0sVUFBVTtZQUN6QixRQUFRLEtBQUMsTUFBTSxZQUFZO1lBQzNCLGVBQVksV0FBTSxLQUFDLE1BQU0sT0FBTztnQkFFdkIsT0FBTyxLQUFDLE1BQU07O2dCQUF2Qjs7Z0JBQ1ksTUFBTTs7Z0JBQWxCOztnQkFDWSxNQUFNLFFBQVEsS0FBQyxNQUFNOztnQkFBakM7O1lBSUEsYUFBUyxVQUFVLEdBQUk7WUFDdkIsYUFBUyxVQUFVLEdBQUksS0FBRzsyQkFFdEIsSUFBSyxVQUFLLHNCQUFBLFNBQUE7O2dCQUVWLE1BQU8sSUFBRSxNQUFJO2dCQUNiLE1BQU0sS0FBQyxNQUFNLFNBQVMsR0FBRzt3QkFFbEI7O3lCQUNIO3lCQUFJO3lCQUFJO3lCQUFJO3lCQUFJO3lCQUFJO3dCQUFNLE1BQU0sS0FBQyxNQUFNLFVBQVU7d0JBQWEsTUFBTSxLQUFDLE1BQU0sVUFBVTs7eUJBQ3JGO3lCQUFJO3dCQUFzQixNQUFNLEtBQUMsTUFBTSxVQUFVO3dCQUFhLE1BQU0sS0FBQyxNQUFNLFVBQVU7Ozt3QkFDM0QsTUFBTTt3QkFBSyxNQUFNOzs7K0JBRTNDLElBQUssbUJBQVUsS0FBQyxNQUFNLEtBQU0sTUFBSSxrQ0FBakIsS0FBQyxNQUFNLEtBQU0sTUFBSSxxQkFBakIsS0FBQyxNQUFNLEtBQU0sTUFBSTs7b0NBQzVCLElBQUssVUFBSSwyQkFBQSxZQUFBOzt3QkFDVCxLQUFDLE1BQU0sT0FBTyxLQUFHLEVBQUUsRUFBRTs7O2dCQUU3QixLQUFDLE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxPQUFPLE9BQUssY0FBWSxNQUFJO2dCQUN6RCxLQUFDLE1BQU0sMkJBQTJCLEdBQUcsSUFBSTs7Ozs7b0JBUXJEOzs7O1FBSUksU0FBUyxLQUFDLE1BQU0sVUFBVTtRQUMxQixTQUFTLEtBQUMsTUFBTSxVQUFVO2FBRW5CLEtBQUMsTUFBTSxPQUFPLEVBQUU7O1lBQ25CLFNBQVMsTUFBTSxPQUFPO1lBQ3RCLFNBQVMsTUFBTSxPQUFPOzs0QkFFVCxLQUFDLE1BQU0sRUFBRTs7O1lBQXRCO1lBRUEsTUFBSyxLQUFLLGdCQUFnQixLQUFDLE1BQU0sRUFBRSxNQUFNLGFBQWEsU0FBUztZQUUvRCxnQkFBWSxVQUFVLEdBQUksS0FBQyxNQUFNLEVBQUUsS0FBSztZQUN4QyxNQUFRLEtBQUMsTUFBTSxVQUFVO2dCQUViLFFBQVEsVUFBVTs7Z0JBQTlCOzsyQkFFSSxLQUFNLGFBQU8sVUFBVSx3QkFBVixVQUFVLFdBQVYsVUFBVTs7Z0JBRXZCLFFBQVEsS0FBQyxNQUFNLFlBQVk7Z0JBQzNCLGVBQVksV0FBTSxLQUFDLE1BQU0sT0FBTztvQkFFdkIsT0FBTyxLQUFDLE1BQU07O29CQUF2Qjs7b0JBQ1MsTUFBTSxRQUFRLEtBQUMsTUFBTTs7b0JBQTlCOztvQkFFRyxPQUFNLFVBQVU7O29CQUNmLEtBQUssVUFBVTs7OztvQkFFZixLQUFLOztvQkFFTixPQUFNLFVBQVU7O29CQUNmLEtBQUssVUFBVTs7OztvQkFFZixLQUFLLEtBQUssTUFBTSxLQUFDLE1BQU0sRUFBRSxNQUFNOztnQkFFbkMsYUFBUyxHQUFHLEtBQUMsTUFBTSxFQUFFLEtBQUs7Z0JBQzFCLGFBQVMsR0FBRyxLQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUc7K0JBRXpCLElBQUssVUFBSyxzQkFBQSxTQUFBOztvQkFDVixNQUFNLElBQUUsS0FBQyxNQUFNLEVBQUUsS0FBSyxNQUFJO21DQUN0QixJQUFLLG9CQUFVLEtBQUMsTUFBTSxLQUFNLE1BQUksbUNBQWpCLEtBQUMsTUFBTSxLQUFNLE1BQUkscUJBQWpCLEtBQUMsTUFBTSxLQUFNLE1BQUk7O3dDQUM1QixJQUFLLFVBQUksMkJBQUEsWUFBQTs7NEJBQ1QsS0FBQyxNQUFNLE9BQU8sS0FBRyxFQUFFLEVBQUU7NEJBQ3JCLEtBQUMsTUFBTSwyQkFBMkIsS0FBRyxFQUFFLEVBQUU7Ozs7Z0JBRXJELE9BQU87Ozs7O29CQUluQjs7OztzQkFFZ0IsS0FBQyxNQUFNOzs7O1FBRW5CLEtBQUssS0FBQyxNQUFNO2tCQUVGLEtBQUMsTUFBTSxFQUFFLE1BQWxCLGFBQUc7OzRCQUVPLEtBQUMsTUFBTTs7O1lBQWQ7WUFFQSxnQkFBWSxJQUFJLEdBQUk7WUFDcEIsTUFBUSxLQUFDLE1BQU0sVUFBVTtnQkFFYixRQUFRLElBQUk7O2dCQUF4Qjs7MkJBRUksS0FBTSxhQUFPLElBQUksd0JBQUosSUFBSSxXQUFKLElBQUk7O2dCQUVqQixRQUFRLEtBQUMsTUFBTSxZQUFZO2dCQUMzQixlQUFZLFdBQU0sS0FBQyxNQUFNLE9BQU87b0JBRXZCLE9BQU8sS0FBQyxNQUFNOztvQkFBdkI7O29CQUNTLE1BQU0sUUFBUSxLQUFDLE1BQU07O29CQUE5Qjs7b0JBRUcsT0FBTSxJQUFJOztvQkFDVCxLQUFLLElBQUk7Ozs7b0JBRVQsS0FBSzs7b0JBRU4sT0FBTSxJQUFJOztvQkFDVCxLQUFLLElBQUk7Ozs7b0JBRVQsS0FBSyxLQUFLLE1BQU0sS0FBQyxNQUFNLEVBQUUsTUFBTTs7Z0JBRW5DLGFBQVMsR0FBRztnQkFDWixhQUFTLEdBQUcsS0FBRzsrQkFFWCxJQUFLLFVBQUssc0JBQUEsU0FBQTs7b0JBQ1YsTUFBTSxJQUFFLE1BQUk7b0NBQ1IsSUFBSyxvQkFBVSxLQUFDLE1BQU0sS0FBTSxNQUFJLG9DQUFqQixLQUFDLE1BQU0sS0FBTSxNQUFJLHFCQUFqQixLQUFDLE1BQU0sS0FBTSxNQUFJOzt3Q0FDNUIsSUFBSyxVQUFJLDJCQUFBLFlBQUE7OzRCQUNULEtBQUMsTUFBTSxPQUFPLEtBQUcsRUFBRSxFQUFFOzRCQUNyQixLQUFDLE1BQU0sMkJBQTJCLEtBQUcsRUFBRSxFQUFFOzs7O2dCQUVyRCxPQUFPOzs7OztvQkFRbkI7Ozs7UUFFSSxJQUFJLEtBQUMsTUFBTTtRQUNYLGFBQWEsS0FBQyxNQUFNO1FBRXBCLEtBQUssS0FBQyxNQUFNLE9BQU87UUFFbkIsS0FBSyxLQUFLLFdBQVcsS0FBQyxNQUFNLGVBQWUsS0FBQyxNQUFNLE9BQU87YUFFNUIsS0FBQyxNQUFNLE9BQU8sRUFBRTs7WUFBN0MsS0FBSyxNQUFNLE9BQU87OzRCQUVKLEVBQUU7OztZQUFaO3dCQUVZLFFBQVc7O2dCQUF2Qjs7Z0JBRUcsS0FBQyxnQkFBZ0I7O2dCQUVoQixRQUFRLEtBQUMsTUFBTSxZQUFZLE9BQU87Z0JBQ2xDLE1BQU0sT0FBTyxLQUFHLEVBQUUsS0FBSyxNQUFJO2dCQUMzQixLQUFDLE1BQU0sMEJBQTBCLEdBQUcsS0FBQyxNQUFNLFVBQVUsT0FBTyxJQUFJLEdBQUc7OztZQUV4RSxLQUFDLGdCQUFnQjs7WUFFaEIsS0FBTSxLQUFDLE1BQU0sT0FBTztZQUVwQixLQUFLLEtBQUssV0FBVyxLQUFDLE1BQU0sY0FBYyxLQUFDLE1BQU0sT0FBTztpQkFFakQsS0FBQzs7Z0JBQWEsS0FBSyxNQUFNLE9BQU87O1lBRXZDLFFBQVEsS0FBQyxNQUFNLFlBQVksV0FBVzt3QkFDM0IsV0FBVyxLQUFHLEVBQUUsS0FBSyxNQUFJLE1BQU8sS0FBQyxNQUFNLFVBQVUsV0FBVyxNQUF0RSxZQUFFOztnQkFFQSxFQUFFLFFBQVEsVUFBVTs7b0JBQ2hCLEtBQUM7O29CQUNBLEtBQUssTUFBTSxPQUFPLEdBQUc7O3lCQUNqQixRQUFPLEtBQUMsTUFBTSxTQUFTLEVBQUU7O29CQUM3QixLQUFLLE1BQU0sT0FBTyxHQUFHOzs7aUJBRUQsS0FBQyxNQUFNLE9BQU8sRUFBRTs7Z0JBQTVDLEtBQUssTUFBTSxPQUFPOzttQkFFbEIsS0FBQyxNQUFNLG9CQUFvQixFQUFFLEVBQUUsR0FBRzs7OztvQkFRMUMsNkJBQWdCLE1BQUssS0FBSSxPQUFNLFFBQU07Ozs7WUFFOUIsT0FBTyxLQUFLLFlBQVksS0FBSyxJQUFJOztZQUNoQyxhQUFTLEVBQUUsU0FBTztnQ0FDSDtpQkFBUDs7Z0JBQUo7Z0JBQ0EsTUFBTTtvQkFDSCxRQUFPOztvQkFBZ0IsS0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxNQUFNLEtBQUMsTUFBTTtvQkFBTyxNQUFNO29CQUFHOztvQkFDOUUsUUFBTyxLQUFLLFNBQU87O29CQUFJOztnQkFDMUIsS0FBQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUcsSUFBSSxJQUFJLElBQUk7Z0JBQU8sTUFBTTtvQkFDL0MsUUFBTyxLQUFLLFNBQU87O29CQUFJLEtBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksTUFBTSxLQUFDLE1BQU07Ozs7OztvQkFFN0UsOEJBQWlCLE1BQUssS0FBSSxNQUFLLElBQUUsTUFBTSxRQUFNOzs7O1FBT3pDLEtBQUEsWUFBQSxJQUFLLE1BQU0sS0FBQyxNQUFNLEVBQUUsS0FBSztRQUV6QjtRQUNBO2FBRUcsS0FBQyxNQUFNLEVBQUU7O1lBQ1IsVUFBVSxXQUFXLHlCQUFjLEtBQUMsTUFBTSxFQUFFLE9BQU8sOEJBQVM7WUFDNUQsVUFBVSxXQUFXLHlCQUFjLEtBQUMsTUFBTSxFQUFFLE9BQU8sOEJBQVM7O1FBRWhFLG1CQUFVOzs7O2dDQUNNOzs7Z0JBQVI7cUJBQ1csS0FBSyxNQUFNLEtBQUEsSUFBSSxLQUFLOzsyQkFBNUI7OztpQ0FDSzs7O2dCQUFSO3FCQUNXLEtBQUssTUFBTSxLQUFBLElBQUksS0FBSzs7MkJBQTVCOzs7bUJBQ1A7O1FBRUosU0FBUyxLQUFLLE9BQU87NEJBQ1I7OztZQUFUO3lCQUVZLE1BQU0sS0FBSyxHQUFVOztnQkFBakM7O1lBRUEsTUFBTSxNQUFNO2lCQUVMLE9BQU87O2dCQUNWLEtBQUssTUFBSSxLQUFDLE1BQU0sRUFBRSxLQUFLLE1BQUk7Z0JBQzNCLEtBQUMsTUFBTSxJQUFJLEVBQUUsSUFBSSxJQUFJLE1BQU0sT0FBTyxPQUFLLGNBQWMsTUFBTSxPQUFPOztnQkFFMUQsTUFBTSxLQUFLLFVBQVU7O2dCQUFqQzs7WUFFQSxNQUFNLE1BQU0sUUFBUSxNQUFNLEtBQUssU0FBUztpQkFFakMsT0FBTzs7Z0JBQ1YsS0FBSyxNQUFJLEtBQUMsTUFBTSxFQUFFLEtBQUssTUFBSTtnQkFDM0IsS0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLElBQUksTUFBTSxPQUFPLE1BQU0sTUFBTSxPQUFPLE9BQUs7Ozs7O1dBL2JqRTs7O2VBaWNGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/draw.kode
