var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import kulur from "../../../kolor/kulur.js"

import squares from "../../util/img/squares.js"

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

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
            idx = pos[1] + this.state.s.view[1]
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
        var idx, oldDiss, segl, syntax, _94_45_

        if (_k_.empty(this.preview) || _k_.empty(this.gitChanges))
        {
            return
        }
        var list = _k_.list(this.preview)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            segl = kseg(((_94_45_=this.gitChanges[idx].old) != null ? _94_45_ : ''))
            syntax = this.editor.state.syntax
            oldDiss = syntax.diss[idx]
            syntax.diss[idx] = kulur.dissect([segl],syntax.ext)
            this.editor.drawLine(segl,idx)
            syntax.diss[idx] = oldDiss
        }
    }

    gutter.prototype["lineno"] = function (y)
    {
        var lineno

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
        var add, change, del, firstLine, mod, modi, mods, numLines, off, _129_29_, _130_29_, _131_29_, _138_36_

        this.clearChanges()
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mod = ((_129_29_=change.mod) != null ? _129_29_ : [])
            add = ((_130_29_=change.add) != null ? _130_29_ : [])
            del = ((_131_29_=change.del) != null ? _131_29_ : [])
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
        var bg, c, col, fg, hasCursor, highlighted, i, lineno, mainCursor, row, sc, selected, spansel, y, _214_96_

        mainCursor = this.state.mainCursor()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
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
        }
        this.drawPreviews()
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9ndXR0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVlhLFVBQUE7SUFBUTtJQUFLOztPQUNMLFlBQVI7O09BQ1EsY0FBQTs7T0FDQSxXQUFWO09BQWUsYUFBZjs7T0FDVSxZQUFYO09BQWlCLFlBQWpCOztPQUNXLFdBQWQ7OztBQUVFLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFJOztRQUFEOzs7Ozs7UUFFQyxLQUFDLFFBQVEsS0FBQyxPQUFPOytDQUVYLEtBQUMsT0FBTyxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRXRDLEtBQUMsU0FBUyxLQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLEtBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsY0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxhQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGFBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsYUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxjQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGVBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsWUFBb0IsTUFBTSxVQUFVO1FBQzlDLEtBQUMsU0FBUyxpQkFBb0IsTUFBTSxVQUFVO1FBQzlDLEtBQUMsU0FBUyxZQUFvQixNQUFNLFVBQVU7UUFFOUMsS0FBQztRQUVELEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLFlBQWEsS0FBQzs7O3NCQUUxQiwwQkFBYSxPQUFNOztZQUVWLFVBQVMsS0FBQzs7OztZQUNaLFNBQVE7O1lBQ1AsS0FBQyxTQUFTLGNBQWtCLE1BQU0sTUFBTSxPQUFPO21CQUMvQyxLQUFDLFNBQVMsZUFBa0IsTUFBTSxNQUFNLE9BQU87Ozs7c0JBRXZELHlCQUFZLE9BQU07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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/gutter.kode
