var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isArr: function (o) {return Array.isArray(o)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var complete

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil
let post = kxk.post

import theme from "../theme/theme.js"

import belt from "./tool/belt.js"

import specs from "./specs.js"


complete = (function ()
{
    function complete (editor)
    {
        this.editor = editor
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onEditorLayout"] = this["onEditorLayout"].bind(this)
        this["posForCursor"] = this["posForCursor"].bind(this)
        this["hasScaledTextAfterCursor"] = this["hasScaledTextAfterCursor"].bind(this)
        this.name = this.editor.name + '_complete'
        this.choices = new choices_class(this.editor.cells.screen,`${this.name}_choices`,['scrllr'])
        this.choices.focusable = false
        this.color = {bg:theme.complete.bg,complete:theme.selection.span,scroll:theme.complete.scroll}
        this.choices.setColor('hover',{bg:theme.hover.bg,blur:theme.hover.bg})
        this.choices.setColor('bg',this.color.bg)
        this.choices.scroll.setColor('bg',this.color.bg)
        this.choices.scroll.setColor('knob',this.color.scroll)
        this.choices.scroll.setColor('dot',this.color.scroll)
        this.choices.on('action',this.onChoicesAction)
        this.visible = false
    }

    complete.prototype["hasScaledTextAfterCursor"] = function ()
    {
        var run, x, y

        ;[x,y] = this.editor.state.mainCursor()
        var list = _k_.list(this.editor.runsForLine(y))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            run = list[_a_]
            if (run[1] > x)
            {
                return true
            }
        }
        return false
    }

    complete.prototype["complete"] = function ()
    {
        var after, before, hcw, tct, tcw, turd

        if (this.hasScaledTextAfterCursor())
        {
            return this.hide()
        }
        before = this.editor.state.chunkBeforeCursor()
        after = this.editor.state.chunkAfterCursor()
        hcw = kseg.headCountWord(after)
        tcw = kseg.tailCountWord(before)
        if (tcw > 1 && hcw)
        {
            return
        }
        tct = kseg.tailCountTurd(before)
        turd = before
        if (tct)
        {
            turd = before.slice(before.length - 1)
        }
        else if (tcw && tcw < before.length)
        {
            turd = before.slice(before.length - tcw)
        }
        return this.word(turd)
    }

    complete.prototype["posForCursor"] = function (cursor)
    {
        var cells, lastIndex, scale, state

        state = this.editor.state
        scale = state.lineHeight(cursor[1])
        cells = this.editor.cellsForLine(cursor[1])
        lastIndex = cells.length - 1
        return [cells[_k_.min(cursor[0],lastIndex)] * scale - state.s.view[0],state.rowOfLine(cursor[1])]
    }

    complete.prototype["word"] = function (turd)
    {
        this.turd = turd
    
        var before, cx, cy, h, head, inserts, mc, mlw, scale, x, y

        if (_k_.empty(this.turd))
        {
            this.hide()
            return
        }
        before = this.editor.state.chunkBeforeCursor()
        this.words = this.chunksForLines(this.editor.state.s.lines)
        this.words = belt.prepareWordsForCompletion(before,this.turd,this.words)
        if (this.turd.length === 1)
        {
            if (inserts = specs.trigger[this.turd])
            {
                this.words = inserts.concat(this.words)
            }
        }
        this.visible = !_k_.empty(this.words)
        if (_k_.empty(this.words))
        {
            return
        }
        mc = this.editor.state.mainCursor()
        head = this.words[0]
        ;[cx,cy] = this.posForCursor(mc)
        scale = this.editor.state.lineHeight(mc[1])
        if (this.words.length <= 1)
        {
            return this.choices.clear()
        }
        else
        {
            mlw = _k_.max(1,belt.widthOfLinesIncludingColorBubbles(this.words))
            h = _k_.min(8,this.words.length)
            x = this.editor.cells.x + cx - this.turd.length
            y = this.editor.cells.y + cy + scale + 1
            this.choices.layout(x,y,mlw + 3,h)
            this.choices.set(this.words.map(function (w)
            {
                return ' ' + w
            }))
            return this.choices.selectFirst()
        }
    }

    complete.prototype["chunksForLines"] = function (lines)
    {
        var chunk, chunks, line, lineChunks, _117_20_

        this.lineChunks = ((_117_20_=this.lineChunks) != null ? _117_20_ : new WeakMap())
        chunks = []
        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            lineChunks = null
            if (_k_.isArr(line))
            {
                lineChunks = this.lineChunks.get(line)
            }
            if (!(lineChunks != null))
            {
                lineChunks = kseg.chunks(line).map(function (chunk)
                {
                    return chunk.chunk
                })
                if (_k_.isArr(line))
                {
                    this.lineChunks.set(line,lineChunks)
                }
            }
            var list1 = _k_.list(lineChunks)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                chunk = list1[_b_]
                chunks.push(chunk)
            }
        }
        return chunks
    }

    complete.prototype["hide"] = function ()
    {
        if (!this.visible)
        {
            return
        }
        this.editor.state.syntax.setSegls(this.editor.state.s.lines)
        return this.visible = false
    }

    complete.prototype["hidden"] = function ()
    {
        return !this.visible
    }

    complete.prototype["onEditorLayout"] = function ()
    {
        if (this.hidden())
        {
            return
        }
    }

    complete.prototype["handleKey"] = function (key, event)
    {
        if (this.hidden() || _k_.empty(this.words))
        {
            return 'unhandled'
        }
        switch (key)
        {
            case 'tab':
            case 'return':
                return this.apply()

            case 'esc':
                return this.hide()

            case 'up':
            case 'down':
                if (this.words.length > 1)
                {
                    return this.moveSelection(key)
                }
                break
        }

        return 'unhandled'
    }

    complete.prototype["onMouse"] = function (event)
    {
        var cret

        if (this.hidden())
        {
            return
        }
        cret = this.choices.onMouse(event)
        if (!cret && _k_.in(event.type,['press','drag','release']))
        {
            this.hide()
            return
        }
        return cret
    }

    complete.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return this.choices.onWheel(event)
    }

    complete.prototype["moveSelection"] = function (dir)
    {
        return this.choices.moveSelection(dir)
    }

    complete.prototype["apply"] = function ()
    {
        var word

        word = this.currentWord()
        if (specs.inserts[word])
        {
            this.editor.state.delete('back')
            this.editor.state.insert(word)
        }
        else
        {
            this.editor.state.insert(word.slice(this.turd.length))
        }
        post.emit('focus','editor')
        return this.complete()
    }

    complete.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.apply()

        }

    }

    complete.prototype["currentWord"] = function ()
    {
        var word

        word = this.choices.current({trim:'front'})
        if (_k_.empty(word))
        {
            word = this.words[0]
        }
        return word
    }

    complete.prototype["preDrawLines"] = function (lines)
    {
        var pos, word

        if (this.hidden() || _k_.empty(this.words))
        {
            return lines
        }
        word = this.currentWord()
        lines = lines.asMutable()
        var list = _k_.list(this.editor.state.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            kutil.replace(lines[pos[1]],pos[0],0,kseg(word.slice(this.turd.length)))
        }
        this.editor.state.syntax.setSegls(kseg.segls(lines))
        return lines
    }

    complete.prototype["drawCompletion"] = function ()
    {
        var ci, cx, cy, i, pos, r, scale, word

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        word = this.currentWord()
        var list = _k_.list(this.editor.state.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            ;[cx,cy] = this.posForCursor(pos)
            scale = this.editor.state.lineHeight(pos[1])
            if (cy < 0)
            {
                continue
            }
            if (cy + scale > this.editor.cells.rows)
            {
                continue
            }
            for (ci = 0; ci < word.length - this.turd.length; ci++)
            {
                for (r = cy; r < cy + scale; r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.editor.cells.set_bg(cx + ci * scale + i,r,this.color.complete)
                    }
                }
            }
        }
    }

    complete.prototype["drawPopup"] = function ()
    {
        var cx, cy, fx, fy, h, maxx, mc, scale, w, x, y

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        if (this.words.length <= 1)
        {
            return
        }
        mc = this.editor.state.mainCursor()
        ;[cx,cy] = this.posForCursor(mc)
        scale = this.editor.state.lineHeight(mc[1])
        w = this.choices.cells.cols + 1
        h = this.choices.cells.rows
        fx = cx - this.turd.length - 2
        fx = _k_.max(0,fx)
        maxx = this.editor.cells.cols - w - 2
        if (maxx > 0)
        {
            fx = _k_.min(fx,maxx)
        }
        x = fx + 1 + this.editor.cells.x
        y = cy + this.editor.cells.y + scale + 1
        fy = cy + scale
        this.editor.cells.erase_scaled(fx,fy,fx + w + 1,fy + h + 1)
        this.editor.cells.draw_rounded_border(fx,fy,fx + w + 1,fy + h + 1,{fg:this.color.bg})
        this.choices.layout(x,y,w,h)
        return this.choices.draw()
    }

    return complete
})()

export default complete;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFWOztPQUNVLFlBQUE7OztBQUVmLFlBQUQ7O2FBRUksVUFBSTs7UUFBRDs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sS0FBQyxPQUFPLE9BQU87UUFFdkIsS0FBQyxjQUFjLGNBQWMsS0FBQyxPQUFPLE1BQU0sVUFBVSxLQUFDLGdCQUFnQjtRQUN0RSxLQUFDLFFBQVEsWUFBWTtRQUVyQixLQUFDLFNBQ0csR0FBVSxNQUFNLFNBQVMsR0FDekIsU0FBVSxNQUFNLFVBQVUsS0FDMUIsT0FBVSxNQUFNLFNBQVM7UUFFN0IsS0FBQyxRQUFRLFNBQWdCLFNBQVEsR0FBRyxNQUFNLE1BQU0sR0FBRyxLQUFLLE1BQU0sTUFBTTtRQUNwRSxLQUFDLFFBQVEsU0FBZ0IsS0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLE9BQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsTUFBUSxLQUFDLE1BQU07UUFFeEMsS0FBQyxRQUFRLEdBQUcsU0FBUyxLQUFDO1FBRXRCLEtBQUMsVUFBVTs7O3dCQUVmOzs7O1VBRUssRUFBRSxLQUFLLEtBQUMsT0FBTyxNQUFNOzRCQUVYLEtBQUMsT0FBTyxZQUFZOzs7WUFBM0I7Z0JBQ1UsSUFBSSxLQUFLOzt1QkFBakI7OztlQUVOOzs7d0JBRUo7Ozs7WUFFaUIsS0FBQzs7bUJBQVosS0FBQzs7UUFFSCxTQUFTLEtBQUMsT0FBTyxNQUFNO1FBQ3ZCLFFBQVMsS0FBQyxPQUFPLE1BQU07UUFFdkIsTUFBTSxLQUFLLGNBQWM7UUFDekIsTUFBTSxLQUFLLGNBQWM7WUFJcEIsTUFBTSxLQUFNOzs7O1FBRWpCLE1BQU0s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
//# sourceURL=../../../kode/ked/edit/complete.kode
