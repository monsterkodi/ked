var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import squares from "../../util/img/squares.js"

import git from "../../util/git.js"
import gitblock from "../../util/gitblock.js"

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
    
        this["refreshDiff"] = this["refreshDiff"].bind(this)
        this["shiftAfter"] = this["shiftAfter"].bind(this)
        this["applyEdits"] = this["applyEdits"].bind(this)
        this["focusBlock"] = this["focusBlock"].bind(this)
        this["restoreEntry"] = this["restoreEntry"].bind(this)
        this["revertBlock"] = this["revertBlock"].bind(this)
        this["toggleAtLine"] = this["toggleAtLine"].bind(this)
        this["toggle"] = this["toggle"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["textLines"] = this["textLines"].bind(this)
        this["onColorsChanged"] = this["onColorsChanged"].bind(this)
        this["onLinesChanged"] = this["onLinesChanged"].bind(this)
        this["rebuildMarks"] = this["rebuildMarks"].bind(this)
        this["reattach"] = this["reattach"].bind(this)
        this["onGitDiff"] = this["onGitDiff"].bind(this)
        this["clearChanges"] = this["clearChanges"].bind(this)
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
        this.setColor('bg_git_revert_mod',theme.gutter.bg_git_revert_mod)
        this.setColor('bg_git_revert_add',theme.gutter.bg_git_revert_add)
        this.setColor('bg_git_revert_del',theme.gutter.bg_git_revert_del)
        this.setColor('bg_git_hover',theme.gutter.bg_git_hover)
        this.setColor('cursor_main',theme.cursor.main)
        this.setColor('cursor_multi',theme.cursor.multi)
        this.setColor('selection',theme.selection.span)
        this.setColor('selection_line',theme.selection.line)
        this.setColor('highlight',theme.highlight.bg)
        this.blocks = []
        this.entries = []
        this.lineMarks = {}
        this.gitBlocks = []
        this.hoverBlock = null
        this.gitFile = null
        this.canRevert = true
        this.busy = false
        this.state.on('lines.changed',this.onLinesChanged)
        this.state.on('colors.changed',this.onColorsChanged)
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

    gutter.prototype["clearChanges"] = function ()
    {
        this.blocks = []
        this.entries = []
        this.lineMarks = {}
        this.gitBlocks = []
        this.hoverBlock = null
        this.gitFile = null
        return this.canRevert = true
    }

    gutter.prototype["onGitDiff"] = function (diff)
    {
        var block, lines

        this.gitFile = diff.file
        this.canRevert = !diff.newFile
        this.hoverBlock = null
        this.blocks = []
        this.reattach()
        lines = this.textLines()
        var list = _k_.list(gitblock.fromDiff(diff))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            block = list[_a_]
            if (this.isShadowed(block))
            {
                continue
            }
            block.before = lines[block.start - 1]
            block.after = lines[block.end]
            this.blocks.push(block)
        }
        this.rebuildMarks()
        return post.emit('redraw')
    }

    gutter.prototype["isShadowed"] = function (block)
    {
        var entry, other

        var list = _k_.list(this.entries)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            entry = list[_a_]
            if (gitblock.overlaps(block,entry))
            {
                return true
            }
        }
        var list1 = _k_.list(this.blocks)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            other = list1[_b_]
            if (gitblock.intervalOverlap(block.start,block.end,other.start,other.end))
            {
                return true
            }
        }
        return false
    }

    gutter.prototype["reattach"] = function (scanBlocks = false)
    {
        var block, blocks, entries, entry, kept, lines, moved

        lines = this.textLines()
        blocks = this.blocks.slice()
        entries = []
        var list = _k_.list(this.entries)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            entry = list[_a_]
            moved = gitblock.reanchorEntry(entry,lines)
            if (moved)
            {
                entries.push(moved)
            }
            else
            {
                block = gitblock.undoneBlock(entry,lines)
                if (block)
                {
                    blocks.push(block)
                }
            }
        }
        if (scanBlocks)
        {
            kept = []
            var list1 = _k_.list(blocks)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                block = list1[_b_]
                if (gitblock.matchesNew(block,lines))
                {
                    kept.push(block)
                }
                else
                {
                    entry = gitblock.stashedBlock(block,lines)
                    if (entry)
                    {
                        entries.push(entry)
                    }
                    else
                    {
                        kept.push(block)
                    }
                }
            }
            blocks = kept
        }
        this.blocks = blocks.sort(function (a, b)
        {
            return a.start - b.start
        })
        return this.entries = entries
    }

    gutter.prototype["rebuildMarks"] = function ()
    {
        var block, entry, kind, line

        this.lineMarks = {}
        this.gitBlocks = []
        var list = _k_.list(this.blocks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            block = list[_a_]
            for (line in block.marks)
            {
                kind = block.marks[line]
                this.lineMarks[parseInt(line)] = {kind:kind,block:block,reverted:false}
            }
            this.gitBlocks.push([block.start,block.end - block.start,block.mods,false])
        }
        var list1 = _k_.list(this.entries)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            entry = list1[_b_]
            for (line in entry.marks)
            {
                kind = entry.marks[line]
                this.lineMarks[parseInt(line)] = {kind:kind,entry:entry,reverted:true}
            }
            this.gitBlocks.push([entry.start,entry.end - entry.start,entry.block.mods,true])
        }
    }

    gutter.prototype["onLinesChanged"] = function ()
    {
        if (this.busy)
        {
            return
        }
        if (_k_.empty(this.entries))
        {
            return
        }
        this.reattach(false)
        this.rebuildMarks()
        return post.emit('redraw')
    }

    gutter.prototype["onColorsChanged"] = function ()
    {
        if (this.busy)
        {
            return
        }
        if (_k_.empty(this.entries) && _k_.empty(this.blocks))
        {
            return
        }
        this.reattach(true)
        this.rebuildMarks()
        return post.emit('redraw')
    }

    gutter.prototype["textLines"] = function ()
    {
        return this.state.s.lines.map(function (l)
        {
            return kseg.str(l)
        })
    }

    gutter.prototype["changeColor"] = function (kind)
    {
        switch (kind)
        {
            case 'mod':
                return this.color.bg_git_mod

            case 'add':
                return this.color.bg_git_add

            case 'del':
                return this.color.bg_git_del

            default:
                return this.color.bg_git_add
        }

    }

    gutter.prototype["revertColor"] = function (kind)
    {
        switch (kind)
        {
            case 'mod':
                return this.color.bg_git_revert_mod

            case 'add':
                return this.color.bg_git_revert_add

            case 'del':
                return this.color.bg_git_revert_del

            default:
                return this.color.bg_git_revert_add
        }

    }

    gutter.prototype["onMouse"] = function (event)
    {
        var block, button, idx, mark, pos, _221_34_

        if (this.cells.isOutsideEvent(event))
        {
            if (!_k_.empty(this.hoverBlock))
            {
                this.hoverBlock = null
                post.emit('redraw')
            }
            return
        }
        if (!(event.cmd || event.ctrl || event.alt))
        {
            if (!_k_.empty(this.hoverBlock))
            {
                this.hoverBlock = null
                return {redraw:true}
            }
            return
        }
        pos = this.eventPos(event)
        idx = this.state.lineAtRow(pos[1])
        mark = this.lineMarks[idx]
        if (event.type === 'press')
        {
            button = ((_221_34_=event.button) != null ? _221_34_ : 'left')
            if (button !== 'left')
            {
                return
            }
            if (mark && this.toggle(mark))
            {
                this.editor.grabFocus()
            }
            return {redraw:true}
        }
        if (event.type === 'move')
        {
            block = (mark != null) ? (mark.reverted ? mark.entry : mark.block) : undefined
            if (block !== this.hoverBlock)
            {
                this.hoverBlock = block
                return {redraw:true}
            }
        }
    }

    gutter.prototype["toggle"] = function (mark)
    {
        if (mark.reverted)
        {
            return this.restoreEntry(mark.entry)
        }
        else
        {
            return this.revertBlock(mark.block)
        }
    }

    gutter.prototype["toggleAtLine"] = function (line)
    {
        var mark

        mark = this.lineMarks[line]
        if (!mark)
        {
            return false
        }
        return this.toggle(mark)
    }

    gutter.prototype["revertBlock"] = function (block)
    {
        var entry

        if (!this.canRevert)
        {
            console.log('gutter: no committed version to revert to',this.gitFile)
            return false
        }
        entry = gitblock.revert(block,this.textLines())
        if (!!_k_.empty(entry))
        {
            console.log('gutter: stale diff, refreshing',this.gitFile)
            this.refreshDiff()
            return false
        }
        this.applyEdits(gitblock.revertEdits(entry))
        this.blocks = this.blocks.filter(function (b)
        {
            return b !== block
        })
        this.shiftAfter(block.end,entry.end - block.end)
        this.entries.push(entry)
        this.hoverBlock = null
        this.rebuildMarks()
        this.focusBlock(entry)
        return true
    }

    gutter.prototype["restoreEntry"] = function (entry)
    {
        var block

        block = gitblock.restore(entry,this.textLines())
        if (!!_k_.empty(block))
        {
            console.log('gutter: reverted lines were changed, dropping the block')
            this.entries = this.entries.filter(function (e)
            {
                return e !== entry
            })
            this.hoverBlock = null
            this.rebuildMarks()
            return false
        }
        this.applyEdits(gitblock.restoreEdits(entry))
        this.entries = this.entries.filter(function (e)
        {
            return e !== entry
        })
        this.shiftAfter(entry.end,block.end - entry.end)
        this.blocks.push(block)
        this.blocks.sort(function (a, b)
        {
            return a.start - b.start
        })
        this.hoverBlock = null
        this.rebuildMarks()
        this.focusBlock(block)
        return true
    }

    gutter.prototype["focusBlock"] = function (block)
    {
        var line

        line = _k_.clamp(0,this.state.s.lines.length - 1,(gitblock.firstLine(block)))
        return this.state.setCursors([[0,line]])
    }

    gutter.prototype["applyEdits"] = function (edits)
    {
        var segls

        segls = edits.map(function (edit)
        {
            return [edit[0],edit[1],edit[2].map(function (line)
            {
                kseg
                return line
            })]
        })
        this.busy = true
        this.state.replaceLineRanges(segls)
        return this.busy = false
    }

    gutter.prototype["shiftAfter"] = function (from, delta)
    {
        if (delta === 0)
        {
            return
        }
        this.blocks = this.blocks.map(function (b)
        {
            return ((b.start >= from ? gitblock.shiftBlock(b,delta) : b))
        })
        return this.entries = this.entries.map(function (e)
        {
            return ((e.start >= from ? gitblock.shiftEntry(e,delta) : e))
        })
    }

    gutter.prototype["refreshDiff"] = function ()
    {
        if (!!_k_.empty(this.gitFile))
        {
            return
        }
        return git.diff(this.gitFile)
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

    gutter.prototype["drawGitScroll"] = function ()
    {
        var addColor, ah, csz, delColor, fg, gb, mh, modColor, oy, pixelsPerRow, reverted, sh, sw, sx, sy

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
            reverted = gb[3]
            modColor = (reverted ? this.color.bg_git_revert_mod : this.color.bg_git_mod)
            addColor = (reverted ? this.color.bg_git_revert_add : this.color.bg_git_add)
            delColor = (reverted ? this.color.bg_git_revert_del : this.color.bg_git_del)
            if (gb[1] <= 0)
            {
                fg = delColor
                sh = parseInt(pixelsPerRow)
            }
            else
            {
                fg = (gb[2] ? modColor : addColor)
                sh = parseInt(gb[1] * pixelsPerRow)
            }
            if (gb[2] && gb[2] < gb[1])
            {
                mh = parseInt(gb[2] * pixelsPerRow)
                squares.place(sx,sy,sw,mh,modColor)
                sy += mh
                ah = sh - mh
                squares.place(sx,sy,sw,ah,addColor)
            }
            else
            {
                squares.place(sx,sy,sw,sh,fg)
            }
        }
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, li, lineno, mainCursor, mark, row, s, sc, scale, selected, spansel, y, _409_96_, _419_45_

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
            mark = this.lineMarks[y]
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.cols)
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
                    bg = (mark != null) && (this.hoverBlock != null) && ((mark.reverted ? mark.entry : mark.block)) === this.hoverBlock ? this.color.bg_git_hover : (mark != null ? mark.reverted : undefined) ? this.revertColor(mark.kind) : (mark != null) ? this.changeColor(mark.kind) : spansel ? this.color.bg_selected : selected ? this.color.bg_fully_selected : this.color.bg
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
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9ndXR0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFLOztPQUNILGNBQUE7O09BQ0EsVUFBVjtPQUFjLGVBQWQ7O09BQ1UsV0FBWDs7T0FDVyxZQUFYO09BQWlCLFlBQWpCOztPQUNXLFdBQWQ7OztBQUVOLFVBQUQ7O3VCQUFRO2FBV0osUUFBSTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLFFBQVEsS0FBQyxPQUFPOytDQUVYLEtBQUMsT0FBTyxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRXRDLEtBQUMsU0FBUyxLQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLEtBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsY0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxhQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGFBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsYUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxlQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGNBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsZUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxZQUFvQixNQUFNLFVBQVU7UUFDOUMsS0FBQyxTQUFTLGlCQUFvQixNQUFNLFVBQVU7UUFDOUMsS0FBQyxTQUFTLFlBQW9CLE1BQU0sVUFBVTtRQUU5QyxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxhQUFhO1FBQ2QsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/gutter.kode
