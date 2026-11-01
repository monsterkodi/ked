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
        scale = state.scaleOfLine(cursor[1])
        return [(cursor[0] - state.s.view[0]) * scale,state.rowOfLine(cursor[1])]
    }

    complete.prototype["word"] = function (turd)
    {
        this.turd = turd
    
        var before, cx, cy, h, head, inserts, mc, mlw, x, y

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

        if (this.words.length <= 1)
        {
            return this.choices.clear()
        }
        else
        {
            mlw = _k_.max(1,belt.widthOfLinesIncludingColorBubbles(this.words))
            h = _k_.min(8,this.words.length)
            x = this.editor.cells.x + cx - this.turd.length
            y = this.editor.cells.y + cy + 1
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

            scale = this.editor.state.scaleOfLine(pos[1])
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
        var cx, cy, fx, fy, h, maxx, mc, w, x, y

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
        y = cy + this.editor.cells.y + 2
        fy = cy + 1
        this.editor.cells.draw_rounded_border(fx,fy,fx + w + 1,fy + h + 1,{fg:this.color.bg})
        this.choices.layout(x,y,w,h)
        return this.choices.draw()
    }

    return complete
})()

export default complete;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFWOztPQUNVLFlBQUE7OztBQUVQLFlBQVQ7O2FBRUksVUFBSTs7UUFBRDs7Ozs7OztRQUVDLEtBQUMsT0FBTyxLQUFDLE9BQU8sT0FBTztRQUV2QixLQUFDLGNBQWMsY0FBYyxLQUFDLE9BQU8sTUFBTSxVQUFVLEtBQUMsZ0JBQWdCO1FBQ3RFLEtBQUMsUUFBUSxZQUFZO1FBRXJCLEtBQUMsU0FDRyxHQUFVLE1BQU0sU0FBUyxHQUN6QixTQUFVLE1BQU0sVUFBVSxLQUMxQixPQUFVLE1BQU0sU0FBUztRQUU3QixLQUFDLFFBQVEsU0FBZ0IsU0FBUSxHQUFHLE1BQU0sTUFBTSxHQUFHLEtBQUssTUFBTSxNQUFNO1FBQ3BFLEtBQUMsUUFBUSxTQUFnQixLQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsT0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxNQUFRLEtBQUMsTUFBTTtRQUV4QyxLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFFdEIsS0FBQyxVQUFVOzs7d0JBUWY7Ozs7UUFFSSxTQUFTLEtBQUMsT0FBTyxNQUFNO1FBQ3ZCLFFBQVMsS0FBQyxPQUFPLE1BQU07UUFFdkIsTUFBTSxLQUFLLGNBQWM7UUFDekIsTUFBTSxLQUFLLGNBQWM7WUFJbkIsTUFBTSxLQUFNOzs7O1FBRWxCLE1BQU0sS0FBSyxjQUFjO1FBRXpCLE9BQU87WUFDSjs7WUFDQyxPQUFPLGFBQU8sT0FBTyxTQUFPOztpQkFDeEIsT0FBUSxNQUFNLE9BQU87O1lBQ3pCLE9BQU8sYUFBTyxPQUFPLFNBQU87O2VBRWhDLEtBQUMsS0FBSzs7O3dCQVVW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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/complete.kode
