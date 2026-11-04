var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import kulur from "../../../kolor/kulur.js"

import squares from "../../util/img/squares.js"

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import mode from "../../edit/mode.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"


gutter = (function ()
{
    _k_.extend(gutter, view)
    function gutter (editor)
    {
        this.editor = editor
    
        this["clearChanges"] = this["clearChanges"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onModeStop"] = this["onModeStop"].bind(this)
        this["onModeStart"] = this["onModeStart"].bind(this)
        this.state = this.editor.state
        gutter.__super__.constructor.call(this,this.editor.screen,this.state.owner() + '.gutter')
        this.setColor('fg',theme.gutter.fg)
        this.setColor('bg',theme.gutter.bg)
        this.setColor('bg_selected',theme.gutter.bg_selected)
        this.setColor('bg_fully_selected',theme.gutter.bg_fully_selected)
        this.setColor('bg_git_mod',theme.gutter.bg_git_mod)
        this.setColor('bg_git_add',theme.gutter.bg_git_add)
        this.setColor('bg_git_del',theme.gutter.bg_git_del)
        this.setColor('cursor_main',theme.cursor.main)
        this.setColor('cursor_multi',theme.cursor.multi)
        this.setColor('selection',theme.selection.span)
        this.setColor('selection_line',theme.selection.line)
        this.setColor('highlight',theme.highlight.bg)
        this.gitChanges = {}
        post.on('mode.start',this.onModeStart)
        post.on('mode.stop',this.onModeStop)
    }

    gutter.prototype["onModeStart"] = function (state, name)
    {
        if (state !== this.state)
        {
            return
        }
        if (name === 'novim')
        {
            this.setColor('cursor_main',theme.novim.cursor.main)
            return this.setColor('cursor_multi',theme.novim.cursor.multi)
        }
    }

    gutter.prototype["onModeStop"] = function (state, name)
    {
        if (state !== this.state)
        {
            return
        }
        if (name === 'novim')
        {
            this.setColor('cursor_main',theme.cursor.main)
            return this.setColor('cursor_multi',theme.cursor.multi)
        }
    }

    gutter.prototype["onMouse"] = function (event)
    {
        var idx, pos

        if (this.cells.isOutsideEvent(event))
        {
            if (!_k_.empty(this.preview))
            {
                this.preview = []
                post.emit('redraw')
            }
            return
        }
        if (!_k_.empty(this.gitChanges) && (event.cmd || event.ctrl || event.alt))
        {
            pos = this.eventPos(event)
            idx = this.state.lineAtRow(pos[1])
            if (this.gitChanges[idx])
            {
                if (event.type === 'press')
                {
                    console.log('todo: press on git change!',idx,this.gitChanges)
                }
                else if (event.type === 'move')
                {
                    if (this.gitChanges[idx].old)
                    {
                        this.preview = [idx]
                        return {redraw:true}
                    }
                }
            }
        }
        if (!_k_.empty(this.preview))
        {
            this.preview = []
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawPreviews"] = function ()
    {
        var idx, oldDiss, segl, syntax, _83_45_

        if (_k_.empty(this.preview) || _k_.empty(this.gitChanges))
        {
            return
        }
        var list = _k_.list(this.preview)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            segl = kseg(((_83_45_=this.gitChanges[idx].old) != null ? _83_45_ : ''))
            syntax = this.editor.state.syntax
            oldDiss = syntax.diss[idx]
            syntax.diss[idx] = kulur.dissect([segl],syntax.ext)
            this.editor.drawLine(segl,idx)
            syntax.diss[idx] = oldDiss
        }
    }

    gutter.prototype["lineno"] = function (y)
    {
        var lineno, mcy

        mcy = this.state.mainCursor()[1]
        if (mode.isActive(this.state,'novim') && y !== mcy)
        {
            y -= mcy + 1
        }
        lineno = _k_.lpad(this.cells.cols - 1,y + 1)
        lineno += ' '
        return lineno
    }

    gutter.prototype["fgcolor"] = function (x, y)
    {}

    gutter.prototype["clearChanges"] = function ()
    {
        this.gitChanges = {}
        return this.gitBlocks = []
    }

    gutter.prototype["onGitDiff"] = function (diff)
    {
        var add, change, del, firstLine, mod, modi, mods, numLines, off, _115_29_, _116_29_, _117_29_, _124_36_

        this.clearChanges()
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mod = ((_115_29_=change.mod) != null ? _115_29_ : [])
            add = ((_116_29_=change.add) != null ? _116_29_ : [])
            del = ((_117_29_=change.del) != null ? _117_29_ : [])
            mods = mod.concat(add)
            numLines = mods.length
            mods = mods.concat(del)
            for (var _b_ = modi = 0, _c_ = numLines; (_b_ <= _c_ ? modi < numLines : modi > numLines); (_b_ <= _c_ ? ++modi : --modi))
            {
                off = ((mods[modi].new != null) ? -1 : 0)
                this.gitChanges[firstLine + modi + off] = mods[modi]
            }
            this.gitBlocks.push([change.line - 1,numLines,mod.length])
        }
        if (!_k_.empty(this.gitChanges))
        {
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawGitScroll"] = function ()
    {
        var ah, csz, fg, gb, mh, oy, pixelsPerRow, sh, sw, sx, sy

        if (_k_.empty(this.gitBlocks))
        {
            return
        }
        csz = this.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        sw = parseInt(csz[0] / 2)
        sx = (this.cells.x - 1) * csz[0]
        oy = this.cells.y * csz[1]
        pixelsPerRow = _k_.clamp(0,csz[1],csz[1] * this.cells.rows / this.state.s.lines.length)
        var list = _k_.list(this.gitBlocks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            gb = list[_a_]
            sy = parseInt(gb[0] * pixelsPerRow + oy)
            if (gb[1] <= 0)
            {
                fg = this.color.bg_git_del
                sh = parseInt(pixelsPerRow)
            }
            else
            {
                fg = (gb[2] ? this.color.bg_git_mod : this.color.bg_git_add)
                sh = parseInt(gb[1] * pixelsPerRow)
            }
            if (gb[2] && gb[2] < gb[1])
            {
                mh = parseInt(gb[2] * pixelsPerRow)
                squares.place(sx,sy,sw,mh,this.color.bg_git_mod)
                sy += mh
                ah = sh - mh
                squares.place(sx,sy,sw,ah,this.color.bg_git_add)
            }
            else
            {
                squares.place(sx,sy,sw,sh,fg)
            }
        }
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, li, lineno, mainCursor, row, s, sc, scale, selected, spansel, y, _199_96_

        mainCursor = this.state.mainCursor()
        li = this.state.s.view[1]
        row = -this.state.s.scrollOffset
        while (row < this.cells.rows && li < this.state.s.lines.length)
        {
            scale = this.state.lineHeight(li)
            if (row < 0)
            {
                row += scale
                li += 1
                continue
            }
            if (row + scale > this.cells.rows)
            {
                break
            }
            y = li
            lineno = this.lineno(y)
            hasCursor = this.state.isAnyCursorInLine(y)
            selected = this.state.isSelectedLine(y)
            highlighted = this.state.isHighlightedLine(y)
            spansel = this.state.isSpanSelectedLine(y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.rows)
                {
                    if (sc = this.fgcolor(i,y,c))
                    {
                        fg = sc
                    }
                    else
                    {
                        fg = y === mainCursor[1] ? color.darken(this.color.cursor_main,(this.state.hasFocus != null),{1:0.5}) : hasCursor ? this.color.cursor_multi : spansel ? this.color.selection : selected ? this.color.selection_line : highlighted ? this.color.highlight : this.color.fg
                        if ((selected || hasCursor || highlighted) && !this.cells.screen.t.hasFocus)
                        {
                            fg = color.darken(fg)
                        }
                    }
                    bg = (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) && this.gitChanges[y].new ? this.color.bg_git_mod : (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) ? this.color.bg_git_del : (this.gitChanges[y] != null) ? this.color.bg_git_add : spansel ? this.color.bg_selected : selected ? this.color.bg_fully_selected : this.color.bg
                    if (selected && !this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
            for (var _b_ = s = 1, _c_ = scale; (_b_ <= _c_ ? s < scale : s > scale); (_b_ <= _c_ ? ++s : --s))
            {
                row += 1
                var list1 = _k_.list(lineno)
                for (i = 0; i < list1.length; i++)
                {
                    c = list1[i]
                    this.cells.set(i,row,' ',fg,bg)
                }
            }
            row += 1
            li += 1
        }
        this.drawPreviews()
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9ndXR0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUTtJQUFLOztPQUNMLFlBQVI7O09BQ1EsY0FBQTs7T0FDQSxXQUFWO09BQWUsYUFBZjs7T0FDVSxXQUFYOztPQUNXLFlBQVg7T0FBaUIsWUFBakI7O09BQ1csV0FBZDs7O0FBRU4sVUFBRDs7dUJBQWdCO2FBT1osUUFBSTs7UUFBRDs7Ozs7O1FBRUMsS0FBQyxRQUFRLEtBQUMsT0FBTzsrQ0FFWCxLQUFDLE9BQU8sT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUV0QyxLQUFDLFNBQVMsS0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxLQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGNBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsb0JBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsYUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxhQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGFBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsY0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxlQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLFlBQW9CLE1BQU0sVUFBVTtRQUM5QyxLQUFDLFNBQVMsaUJBQW9CLE1BQU0sVUFBVTtRQUM5QyxLQUFDLFNBQVMsWUFBb0IsTUFBTSxVQUFVO1FBRTlDLEtBQUM7UUFFRCxLQUFLLEdBQUcsYUFBYSxLQUFDO1FBQ3RCLEtBQUssR0FBRyxZQUFhLEtBQUM7OztzQkFFMUIsMEJBQWEsT0FBTTs7WUFFVixVQUFTLEtBQUM7Ozs7WUFDWixTQUFROztZQUNQLEtBQUMsU0FBUyxjQUFrQixNQUFNLE1BQU0sT0FBTzttQkFDL0MsS0FBQyxTQUFTLGVBQWtCLE1BQU0sTUFBTSxPQUFPOzs7O3NCQUV2RCx5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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/gutter.kode
