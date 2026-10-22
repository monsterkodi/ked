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
        cx = mc[0] - this.editor.state.s.view[0]
        cy = mc[1] - this.editor.state.s.view[1]
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
        var ci, cx, cy, pos, word

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        word = this.currentWord()
        var list = _k_.list(this.editor.state.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            cx = pos[0] - this.editor.state.s.view[0]
            cy = pos[1] - this.editor.state.s.view[1]
            for (var _b_ = ci = 0, _c_ = word.length - this.turd.length; (_b_ <= _c_ ? ci < word.length - this.turd.length : ci > word.length - this.turd.length); (_b_ <= _c_ ? ++ci : --ci))
            {
                this.editor.cells.set_bg(cx + ci,cy,this.color.complete)
            }
        }
    }

    complete.prototype["drawPopup"] = function ()
    {
        var cx, cy, fx, fy, h, mc, w, x, y

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        if (this.words.length <= 1)
        {
            return
        }
        mc = this.editor.state.mainCursor()
        cx = mc[0] - this.editor.state.s.view[0]
        cy = mc[1] - this.editor.state.s.view[1]
        fx = cx - this.turd.length - 2
        x = fx + 1 + this.editor.cells.x
        y = cy + this.editor.cells.y + 2
        w = this.choices.cells.cols + 1
        h = this.choices.cells.rows
        fy = cy + 1
        this.editor.cells.draw_rounded_border(fx,fy,fx + w + 1,fy + h + 1,{fg:this.color.bg})
        this.choices.layout(x,y,w,h)
        return this.choices.draw()
    }

    return complete
})()

export default complete;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQWFTLFlBQVQ7O2FBRUksVUFBRzs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sS0FBQyxPQUFPLE9BQU87UUFFdkIsS0FBQyxjQUFjLGNBQWMsS0FBQyxPQUFPLE1BQU0sVUFBVSxLQUFDLGdCQUFnQjtRQUN0RSxLQUFDLFFBQVEsWUFBWTtRQUVyQixLQUFDLFNBQ0csR0FBVSxNQUFNLFNBQVMsR0FDekIsU0FBVSxNQUFNLFVBQVUsS0FDMUIsT0FBVSxNQUFNLFNBQVM7UUFFN0IsS0FBQyxRQUFRLFNBQWdCLFNBQVEsR0FBRyxNQUFNLE1BQU0sR0FBRyxLQUFLLE1BQU0sTUFBTTtRQUNwRSxLQUFDLFFBQVEsU0FBZ0IsS0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLE9BQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsTUFBUSxLQUFDLE1BQU07UUFFeEMsS0FBQyxRQUFRLEdBQUcsU0FBUyxLQUFDO1FBRXRCLEtBQUMsVUFBVTs7O3dCQVFmOzs7O1FBRUksU0FBUyxLQUFDLE9BQU8sTUFBTTtRQUN2QixRQUFTLEtBQUMsT0FBTyxNQUFNO1FBRXZCLE1BQU0sS0FBSyxjQUFjO1FBQ3pCLE1BQU0sS0FBSyxjQUFjO1lBSW5CLE1BQU0sS0FBTTs7OztRQUVsQixNQUFNLEtBQUssY0FBYztRQUV6QixPQUFPO1lBQ0o7O1lBQ0MsT0FBTyxhQUFPLE9BQU8sU0FBTzs7aUJBQ3hCLE9BQVEsTUFBTSxPQUFPOztZQUN6QixPQUFPLGFBQU8sT0FBTyxTQUFPOztlQUVoQyxLQUFDLEtBQUs7Ozt3QkFRVixtQkFBTTs7Ozs7O3NCQUlPLEtBQUM7O1lBQ04sS0FBQzs7O1FBR0wsU0FBUyxLQUFDLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/complete.kode
