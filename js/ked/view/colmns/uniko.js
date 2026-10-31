var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var uniko

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import clip from "../../../kxk/clip.js"

import theme from "../../theme/theme.js"

import specs from "../../edit/specs.js"

import view from "../base/view.js"
import input from "../base/input.js"
import matrix from "../base/matrix.js"

import julia from '../../util/julia.json' with { type : "json" }

uniko = (function ()
{
    _k_.extend(uniko, view)
    function uniko (screen, editor, name)
    {
        this.screen = screen
        this.editor = editor
    
        var char, comment

        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["incScale"] = this["incScale"].bind(this)
        this["focusMatrix"] = this["focusMatrix"].bind(this)
        this["focusInput"] = this["focusInput"].bind(this)
        this["filter"] = this["filter"].bind(this)
        uniko.__super__.constructor.call(this,this.screen,name)
        this.height = 28
        this.focus = 'matrix'
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.matrix = new matrix(this.screen,`${this.name}_matrix`)
        this.matrix.setColor('bg',theme.uniko.bg)
        this.matrix.setColor('fg',theme.uniko.fg)
        this.matrix.setColor('selection',theme.uniko.selection)
        this.matrix.setColor('selection_blur',theme.uniko.selection_blur)
        this.matrix.setColor('scroll',theme.scroll.knob)
        this.matrix.setColor('scroll_dot',theme.scroll.dot)
        this.input.on('action',this.onInputAction)
        this.matrix.on('submit',this.submit)
        this.allItems = []
        for (char in julia)
        {
            comment = julia[char]
            this.allItems.push({char:char,search:_k_.trim(comment)})
        }
        this.matrix.setItems(this.allItems)
        this.isVisible = false
    }

    uniko.prototype["filter"] = function (text)
    {
        var matches, words

        text = _k_.trim(text).toLowerCase()
        if (_k_.empty(text))
        {
            return this.matrix.setItems(this.allItems)
        }
        words = text.split(' ')
        matches = this.allItems.filter(function (item)
        {
            var word

            var list = _k_.list(words)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                word = list[_a_]
                if (!item.search.includes(word))
                {
                    return false
                }
            }
            return true
        })
        return this.matrix.setItems(matches)
    }

    uniko.prototype["focusInput"] = function ()
    {
        this.focus = 'input'
        this.input.grabFocus()
        return true
    }

    uniko.prototype["focusMatrix"] = function ()
    {
        this.focus = 'matrix'
        this.matrix.selectFirst()
        this.matrix.grabFocus()
        return true
    }

    uniko.prototype["incScale"] = function (delta)
    {
        this.matrix.incScale(delta)
        post.emit('redraw')
        return true
    }

    uniko.prototype["show"] = function ()
    {
        this.input.set('')
        this.filter('')
        this.focus = 'matrix'
        uniko.__super__.show.call(this)
        this.matrix.selectFirst()
        this.matrix.grabFocus()
        return post.emit('redraw')
    }

    uniko.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        uniko.__super__.hide.call(this)
        this.focus = 'matrix'
        this.input.state.deselect()
        post.emit('focus',this.editor.name)
        return post.emit('redraw')
    }

    uniko.prototype["submit"] = function ()
    {
        var char

        char = this.matrix.selectedText()
        if (_k_.empty(char))
        {
            return false
        }
        this.editor.state.insert(char)
        post.emit('redraw')
        return true
    }

    uniko.prototype["copy"] = function ()
    {
        var char

        char = this.matrix.selectedText()
        if (_k_.empty(char))
        {
            return false
        }
        clip.copy(char)
        return true
    }

    uniko.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return false
        }
        switch (event.combo)
        {
            case 'esc':
                return this.hide()

            case 'cmd+up':
                return this.incScale(1)

            case 'cmd+down':
                return this.incScale(-1)

        }

        if (this.focus === 'input')
        {
            switch (event.combo)
            {
                case 'down':
                    return this.focusMatrix()

            }

            return this.input.onKey(key,event)
        }
        switch (event.combo)
        {
            case 'space':
                return this.submit()

            case 'return':
                return this.submit()

            case 'cmd+c':
                return this.copy()

            case 'ctrl+c':
                return this.copy()

            case 'up':
            case 'left':
            case 'right':
            case 'down':
                this.matrix.moveSelection(event.combo)
                break
        }

        if (!_k_.empty(event.char) && event.char.length === 1)
        {
            this.focusInput()
            return this.input.onKey(key,event)
        }
        return false
    }

    uniko.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'change':
                return this.filter(text)

        }

    }

    uniko.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.matrix.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return uniko.__super__.onMouse.call(this,event)
    }

    uniko.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return false
        }
        if (this.matrix.cells.isInsideEvent(event))
        {
            switch (event.dir)
            {
                case 'up':
                    this.matrix.moveSelection('up')
                    break
                case 'down':
                    this.matrix.moveSelection('down')
                    break
            }

            return {redraw:true}
        }
        return false
    }

    uniko.prototype["layout"] = function (x, y, w, h)
    {
        uniko.__super__.layout.call(this,x,y,w,h)
    
        var mh

        this.input.layout(x + 1,y + 1,w - 2,1)
        mh = _k_.max(0,(h - 4))
        return this.matrix.layout(x + 1,y + 3,w - 2,mh)
    }

    uniko.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.input.draw()
        this.matrix.draw()
        return uniko.__super__.draw.call(this)
    }

    return uniko
})()

export default uniko;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFOOztPQUNNLFlBQVQ7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxRQUFRLFFBQU87O1FBQWhCO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4Q0FFRCxLQUFDLE9BQU87UUFFZCxLQUFDLFNBQVM7UUFDVixLQUFDLFFBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxZQUFhLE1BQU8sS0FBQyxVQUFVLEtBQUM7UUFDakMsS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFakMsS0FBQyxPQUFPLFNBQVMsS0FBaUIsTUFBTSxNQUFNO1FBQzlDLEtBQUMsT0FBTyxTQUFTLEtBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxZQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsaUJBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxTQUFpQixNQUFNLE9BQU87UUFDL0MsS0FBQyxPQUFPLFNBQVMsYUFBaUIsTUFBTSxPQUFPO1FBRS9DLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUNwQixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7UUFFckIsS0FBQzthQUNHLFFBQWdCOztZQUFYLFVBQVc7WUFDaEIsS0FBQyxTQUFTLE1BQUssS0FBSyxLQUFLLGdCQUFZOztRQUN6QyxLQUFDLE9BQU8sU0FBUyxLQUFDO1FBRWxCLEtBQUMsWUFBWTs7O3FCQUVqQixxQkFBUTs7OztRQUVKLGdCQUFZLE1BQU07c0JBRVQ7O21C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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/uniko.kode
