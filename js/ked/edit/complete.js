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

        var _a_ = this.editor.state.mainCursor(); x = _a_[0]; y = _a_[1]

        var list = _k_.list(this.editor.runsForLine(y))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            run = list[_b_]
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
        var cells, last, scale, state

        state = this.editor.state
        scale = state.lineHeight(cursor[1])
        cells = this.editor.cellsForLine(cursor[1])
        last = cells.length - 1
        return [cells[_k_.min(cursor[0],last)] * scale - state.s.view[0],state.rowOfLine(cursor[1])]
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
        var _a_ = this.posForCursor(mc); cx = _a_[0]; cy = _a_[1]

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
        var chunk, chunks, line, lineChunks, _123_20_

        this.lineChunks = ((_123_20_=this.lineChunks) != null ? _123_20_ : new WeakMap())
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
            var _b_ = this.posForCursor(pos); cx = _b_[0]; cy = _b_[1]

            scale = this.editor.state.lineHeight(pos[1])
            if (cy < 0)
            {
                continue
            }
            if (cy + scale > this.editor.cells.rows)
            {
                continue
            }
            for (var _c_ = ci = 0, _d_ = word.length - this.turd.length; (_c_ <= _d_ ? ci < word.length - this.turd.length : ci > word.length - this.turd.length); (_c_ <= _d_ ? ++ci : --ci))
            {
                for (var _e_ = r = cy, _f_ = cy + scale; (_e_ <= _f_ ? r < cy + scale : r > cy + scale); (_e_ <= _f_ ? ++r : --r))
                {
                    for (var _10_ = i = 0, _11_ = scale; (_10_ <= _11_ ? i < scale : i > scale); (_10_ <= _11_ ? ++i : --i))
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
        var _a_ = this.posForCursor(mc); cx = _a_[0]; cy = _a_[1]

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFWOztPQUNVLFlBQUE7OztBQUVmLFlBQUQ7O2FBRUksVUFBSTs7UUFBRDs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sS0FBQyxPQUFPLE9BQU87UUFFdkIsS0FBQyxjQUFjLGNBQWMsS0FBQyxPQUFPLE1BQU0sVUFBVSxLQUFDLGdCQUFnQjtRQUN0RSxLQUFDLFFBQVEsWUFBWTtRQUVyQixLQUFDLFNBQ0csR0FBVSxNQUFNLFNBQVMsR0FDekIsU0FBVSxNQUFNLFVBQVUsS0FDMUIsT0FBVSxNQUFNLFNBQVM7UUFFN0IsS0FBQyxRQUFRLFNBQWdCLFNBQVEsR0FBRyxNQUFNLE1BQU0sR0FBRyxLQUFLLE1BQU0sTUFBTTtRQUNwRSxLQUFDLFFBQVEsU0FBZ0IsS0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLE9BQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsTUFBUSxLQUFDLE1BQU07UUFFeEMsS0FBQyxRQUFRLEdBQUcsU0FBUyxLQUFDO1FBRXRCLEtBQUMsVUFBVTs7O3dCQUtmOzs7O2tCQUVZLEtBQUMsT0FBTyxNQUFNLGNBQXJCLFlBQUU7OzRCQUVRLEtBQUMsT0FBTyxZQUFZOzs7WUFBM0I7Z0JBQ1UsSUFBSSxLQUFLOzt1QkFBakI7OztlQUVOOzs7d0JBRUo7Ozs7WUFFaUIsS0FBQzs7bUJBQVosS0FBQzs7UUFFSCxTQUFTLEtBQUMsT0FBTyxNQUFNO1FBQ3ZCLFFBQVMsS0FBQyxPQUFPLE1BQU07UUFFdkIsTUFBTSxLQUFLLGNBQWM7UUFDekIsTUFBTSxLQUFLLGNBQWM7WUFJcEIsTUFBTSxLQUFNOzs7O1FBRWpCLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/complete.kode
