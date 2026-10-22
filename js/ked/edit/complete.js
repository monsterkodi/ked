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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvY29tcGxldGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsWUFBVDs7T0FDUyxXQUFWOztPQUNVLFlBQUE7OztBQUVQLFlBQVQ7O2FBRUksVUFBSTs7UUFBRDs7Ozs7O1FBRUMsS0FBQyxPQUFPLEtBQUMsT0FBTyxPQUFPO1FBRXZCLEtBQUMsY0FBYyxjQUFjLEtBQUMsT0FBTyxNQUFNLFVBQVUsS0FBQyxnQkFBZ0I7UUFDdEUsS0FBQyxRQUFRLFlBQVk7UUFFckIsS0FBQyxTQUNHLEdBQVUsTUFBTSxTQUFTLEdBQ3pCLFNBQVUsTUFBTSxVQUFVLEtBQzFCLE9BQVUsTUFBTSxTQUFTO1FBRTdCLEtBQUMsUUFBUSxTQUFnQixTQUFRLEdBQUcsTUFBTSxNQUFNLEdBQUcsS0FBSyxNQUFNLE1BQU07UUFDcEUsS0FBQyxRQUFRLFNBQWdCLEtBQVEsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBUSxLQUFDLE1BQU07UUFDeEMsS0FBQyxRQUFRLE9BQU8sU0FBUyxPQUFRLEtBQUMsTUFBTTtRQUN4QyxLQUFDLFFBQVEsT0FBTyxTQUFTLE1BQVEsS0FBQyxNQUFNO1FBRXhDLEtBQUMsUUFBUSxHQUFHLFNBQVMsS0FBQztRQUV0QixLQUFDLFVBQVU7Ozt3QkFRZjs7OztRQUVJLFNBQVMsS0FBQyxPQUFPLE1BQU07UUFDdkIsUUFBUyxLQUFDLE9BQU8sTUFBTTtRQUV2QixNQUFNLEtBQUssY0FBYztRQUN6QixNQUFNLEtBQUssY0FBYztZQUluQixNQUFNLEtBQU07Ozs7UUFFbEIsTUFBTSxLQUFLLGNBQWM7UUFFekIsT0FBTztZQUNKOztZQUNDLE9BQU8sYUFBTyxPQUFPLFNBQU87O2lCQUN4QixPQUFRLE1BQU0sT0FBTzs7WUFDekIsT0FBTyxhQUFPLE9BQU8sU0FBTzs7ZUFFaEMsS0FBQyxLQUFLOzs7d0JBUVYsbUJBQU87O1FBQUQ7Ozs7c0JBSU8sS0FBQzs7WUFDTixLQUFDOzs7UUFHTCxTQUFTLEtBQUMsT0FBTyxNQUFNO1FBRXZCLEtBQUMsUUFBUSxLQUFLLE9BQU8sS0FBQyxPQUFPLE1BQU0sRUFBRSxPQUFPLGNBQUs7O21CQUFVLE1BQU07O1FBQ2pFLEtBQUMsUUFBUSxLQUFLLDBCQUEwQixPQUFPLEtBQUMsS0FBSyxLQUFDO1lBRW5ELEtBQUMsS0FBSyxXQUFVOztnQkFDWixVQUFVLE1BQU0sUUFBUSxLQUFDOztnQkFFeEIsS0FBQyxRQUFRLFFBQVEsT0FBTyxLQUFDOzs7UUFFakMsS0FBQyxxQkFBZ0IsS0FBQztzQkFFTixLQUFDOzs7O1FBRWIsS0FBSyxLQUFDLE9BQU8sTUFBTTtRQUVuQixPQUFPLEtBQUMsTUFBTTtRQUVkLEtBQUssR0FBRyxLQUFLLEtBQUMsT0FBTyxNQUFNLEVBQUUsS0FBSztRQUNsQyxLQUFLLEdBQUcsS0FBSyxLQUFDLE9BQU8sTUFBTSxFQUFFLEtBQUs7WUFFL0IsS0FBQyxNQUFNLFVBQVU7O21CQUNoQixLQUFDLFFBQVE7Ozs7WUFFVCxjQUFVLEVBQUUsS0FBSyxrQ0FBa0MsS0FBQztZQUVwRCxZQUFRLEVBQUUsS0FBQyxNQUFNO1lBQ2pCLElBQUssS0FBQyxPQUFPLE1BQU0sSUFBRSxLQUFHLEtBQUMsS0FBSztZQUM5QixJQUFLLEtBQUMsT0FBTyxNQUFNLElBQUUsS0FBRztZQUV4QixLQUFDLFFBQVEsT0FBTyxFQUFFLEVBQUUsTUFBSSxFQUFFO1lBQzFCLEtBQUMsUUFBUSxJQUFJLEtBQUMsTUFBTSxjQUFLOzt1QkFBTSxNQUFJOzttQkFDbkMsS0FBQyxRQUFROzs7O3dCQVFqQjs7YUFDYyxLQUFDOzs7O1FBQ1gsS0FBQyxPQUFPLE1BQU0sT0FBTyxTQUFTLEtBQUMsT0FBTyxNQUFNLEVBQUU7ZUFDOUMsS0FBQyxVQUFVOzs7d0JBRWY7O2dCQUFlLEtBQUM7Ozt3QkFFaEI7O1lBRVUsS0FBQzs7Ozs7O3dCQVFYLHdCQUFXLEtBQUk7O1lBRU8sS0FBQyxzQkFBa0IsS0FBQzs7bUJBQW5DOztnQkFFSTs7aUJBQ0g7aUJBQ0E7dUJBQWMsS0FBQzs7aUJBQ2Y7dUJBQWMsS0FBQzs7aUJBQ2Y7aUJBQ0E7b0JBQ08sS0FBQyxNQUFNLFNBQVM7OzJCQUNaLEtBQUMsY0FBYzs7Ozs7ZUFFOUI7Ozt3QkFRSixzQkFBUzs7OztZQUVDLEtBQUM7Ozs7UUFFUCxPQUFPLEtBQUMsUUFBUSxRQUFRO2FBRWpCLGVBQVMsTUFBTSxNQUFTLFFBQVEsT0FBTzs7WUFDMUMsS0FBQzs7O2VBR0w7Ozt3QkFFSixzQkFBUzs7WUFFQyxLQUFDOzs7O2VBRVAsS0FBQyxRQUFRLFFBQVE7Ozt3QkFRckIsNEJBQWU7O2VBRVgsS0FBQyxRQUFRLGNBQWM7Ozt3QkFRM0I7Ozs7UUFFSSxPQUFPLEtBQUM7WUFFTCxNQUFNLFFBQVE7O1lBQ2IsS0FBQyxPQUFPLE1BQU0sT0FBTztZQUNyQixLQUFDLE9BQU8sTUFBTSxPQUFPOzs7O1lBRXJCLEtBQUMsT0FBTyxNQUFNLE9BQU8sV0FBSyxLQUFDLEtBQUs7O1FBRXBDLEtBQUssS0FBSyxRQUFRO2VBQ2xCLEtBQUM7Ozt3QkFRTCw4QkFBaUIsUUFBTzs7Z0JBRWI7O2lCQUNIO3VCQUFhLEtBQUM7Ozs7Ozt3QkFRdEI7Ozs7UUFFSSxPQUFPLEtBQUMsUUFBUSxTQUFRLEtBQUs7c0JBQ3BCOztZQUNMLE9BQU8sS0FBQyxNQUFNOztlQUNsQjs7O3dCQUVKLDJCQUFjOzs7O1lBRUUsS0FBQyxzQkFBa0IsS0FBQzs7bUJBQTdCOztRQUVILE9BQVEsS0FBQztRQUNULFFBQVEsTUFBTTs0QkFDSCxLQUFDLE9BQU8sTUFBTSxFQUFFOzs7WUFBdkI7WUFDQSxNQUFNLFFBQVEsTUFBTSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsS0FBSyxXQUFLLEtBQUMsS0FBSzs7UUFDekQsS0FBQyxPQUFPLE1BQU0sT0FBTyxTQUFTLEtBQUssTUFBTTtlQUN6Qzs7O3dCQVFKOzs7O1lBRVUsS0FBQyxzQkFBa0IsS0FBQzs7OztRQUUxQixPQUFPLEtBQUM7NEJBRUcsS0FBQyxPQUFPLE1BQU0sRUFBRTs7O1lBQXZCO1lBRUEsS0FBSyxJQUFJLEtBQUssS0FBQyxPQUFPLE1BQU0sRUFBRSxLQUFLO1lBQ25DLEtBQUssSUFBSSxLQUFLLEtBQUMsT0FBTyxNQUFNLEVBQUUsS0FBSzsyQkFFL0IsS0FBTSxTQUFJLEtBQUssU0FBTyxLQUFDLEtBQUssMkJBQWxCLEtBQUssU0FBTyxLQUFDLEtBQUssY0FBbEIsS0FBSyxTQUFPLEtBQUMsS0FBSzs7Z0JBQzVCLEtBQUMsT0FBTyxNQUFNLE9BQU8sS0FBRyxHQUFHLEdBQUcsS0FBQyxNQUFNOzs7Ozt3QkFRakQ7Ozs7WUFFVSxLQUFDLHNCQUFrQixLQUFDOzs7O1lBQ3BCLEtBQUMsTUFBTSxVQUFVOzs7O1FBRXZCLEtBQUssS0FBQyxPQUFPLE1BQU07UUFFbkIsS0FBSyxHQUFHLEtBQUssS0FBQyxPQUFPLE1BQU0sRUFBRSxLQUFLO1FBQ2xDLEtBQUssR0FBRyxLQUFLLEtBQUMsT0FBTyxNQUFNLEVBQUUsS0FBSztRQUVsQyxLQUFLLEtBQUcsS0FBQyxLQUFLLFNBQU87UUFDckIsSUFBSyxLQUFHLElBQUUsS0FBQyxPQUFPLE1BQU07UUFDeEIsSUFBSyxLQUFHLEtBQUMsT0FBTyxNQUFNLElBQUU7UUFDeEIsSUFBSyxLQUFDLFFBQVEsTUFBTSxPQUFLO1FBQ3pCLElBQUssS0FBQyxRQUFRLE1BQU07UUFFcEIsS0FBSyxLQUFHO1FBRVIsS0FBQyxPQUFPLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxLQUFHLElBQUUsRUFBRSxLQUFHLElBQUUsR0FBRSxHQUFHLEtBQUMsTUFBTTtRQUVoRSxLQUFDLFFBQVEsT0FBTyxFQUFFLEVBQUUsRUFBRTtlQUN0QixLQUFDLFFBQVE7OztXQWpSUjs7O2VBbVJGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/complete.kode
