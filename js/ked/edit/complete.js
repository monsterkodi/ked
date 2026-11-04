var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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

    complete.prototype["complete"] = function ()
    {
        var after, before, hcw, tct, tcw, turd

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
        var scale, state

        state = this.editor.state
        scale = state.lineHeight(cursor[1])
        return [cursor[0] * scale - state.s.view[0],state.rowOfLine(cursor[1])]
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
        this.words = kseg.chunks(this.editor.state.s.lines).map(function (chunk)
        {
            return chunk.chunk
        })
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFWOztPQUNVLFlBQUE7OztBQUVmLFlBQUQ7O2FBRUksVUFBSTs7UUFBRDs7Ozs7OztRQUVDLEtBQUMsT0FBTyxLQUFDLE9BQU8sT0FBTztRQUV2QixLQUFDLGNBQWMsY0FBYyxLQUFDLE9BQU8sTUFBTSxVQUFVLEtBQUMsZ0JBQWdCO1FBQ3RFLEtBQUMsUUFBUSxZQUFZO1FBRXJCLEtBQUMsU0FDRyxHQUFVLE1BQU0sU0FBUyxHQUN6QixTQUFVLE1BQU0sVUFBVSxLQUMxQixPQUFVLE1BQU0sU0FBUztRQUU3QixLQUFDLFFBQVEsU0FBZ0IsU0FBUSxHQUFHLE1BQU0sTUFBTSxHQUFHLEtBQUssTUFBTSxNQUFNO1FBQ3BFLEtBQUMsUUFBUSxTQUFnQixLQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsT0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxNQUFRLEtBQUMsTUFBTTtRQUV4QyxLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFFdEIsS0FBQyxVQUFVOzs7d0JBRWY7Ozs7UUFFSSxTQUFTLEtBQUMsT0FBTyxNQUFNO1FBQ3ZCLFFBQVMsS0FBQyxPQUFPLE1BQU07UUFFdkIsTUFBTSxLQUFLLGNBQWM7UUFDekIsTUFBTSxLQUFLLGNBQWM7WUFJbkIsTUFBTSxLQUFNOzs7O1FBRWxCLE1BQU0sS0FBSyxjQUFjO1FBRXpCLE9BQU87WUFDSjs7WUFDQyxPQUFPLGFBQU8sT0FBTyxTQUFPOztpQkFDeEIsT0FBUSxNQUFNLE9BQU87O1lBQ3pCLE9BQU8sYUFBTyxPQUFPLFNBQU87O2VBRWhDLEtBQUMsS0FBSzs7O3dCQUVW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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/complete.kode
