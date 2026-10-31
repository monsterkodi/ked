var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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
        this.height = 16
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
        var matches

        text = _k_.trim(text).toLowerCase()
        if (_k_.empty(text))
        {
            return this.matrix.setItems(this.allItems)
        }
        matches = this.allItems.filter(function (item)
        {
            return item.search.includes(text)
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

            case 'return':
                return this.submit()

            case 'cmd+c':
                return this.copy()

            case 'ctrl+c':
                return this.copy()

            case 'cmd+up':
                return this.incScale(1)

            case 'cmd+down':
                return this.incScale(-1)

        }

        if (event.combo === 'space')
        {
            return this.submit()
        }
        if (this.focus === 'input')
        {
            if (event.combo === 'down')
            {
                this.focusMatrix()
                return true
            }
            return this.input.onKey(key,event)
        }
        if (!_k_.empty(event.char) && event.char.length === 1 && _k_.in(event.char,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'))
        {
            this.focusInput()
            return this.input.onKey(key,event)
        }
        if (_k_.in(event.combo,['up','left','right','down']))
        {
            this.matrix.moveSelection(event.combo)
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
        var col, row, x, y

        if (this.hidden())
        {
            return false
        }
        if (this.input.cells.isInsideEvent(event))
        {
            this.focusInput()
            return this.input.onMouse(event)
        }
        if (this.matrix.cells.isInsideEvent(event))
        {
            if (event.type === 'press')
            {
                var _a_ = this.matrix.cells.posForEvent(event); x = _a_[0]; y = _a_[1]

                var _b_ = this.matrix.cellAtPos(x,y); col = _b_[0]; row = _b_[1]

                this.focus = 'matrix'
                this.matrix.selectAt(col,row)
                this.matrix.grabFocus()
                this.submit()
            }
            return {redraw:true}
        }
        return false
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FXYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFOOztPQUNNLFlBQVQ7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxRQUFRLFFBQU87O1FBQWhCO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4Q0FFRCxLQUFDLE9BQU87UUFFZCxLQUFDLFNBQVM7UUFDVixLQUFDLFFBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxZQUFhLE1BQU8sS0FBQyxVQUFVLEtBQUM7UUFDakMsS0FBQyxhQUFhLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFakMsS0FBQyxPQUFPLFNBQVMsS0FBaUIsTUFBTSxNQUFNO1FBQzlDLEtBQUMsT0FBTyxTQUFTLEtBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxZQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsaUJBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxTQUFpQixNQUFNLE9BQU87UUFDL0MsS0FBQyxPQUFPLFNBQVMsYUFBaUIsTUFBTSxPQUFPO1FBRS9DLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUVwQixLQUFDO2FBQ0csUUFBZ0I7O1lBQVgsVUFBVztZQUNoQixLQUFDLFNBQVMsTUFBSyxLQUFLLEtBQUssZ0JBQVk7O1FBQ3pDLEtBQUMsT0FBTyxTQUFTLEtBQUM7UUFFbEIsS0FBQyxZQUFZOzs7cUJBRWpCLHFCQUFROzs7O1FBRUosZ0JBQVksTUFBTTtzQkFFVDs7bUJBQVMsS0FBQyxPQUFPLFNBQVMsS0FBQzs7UUFFcEMs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/uniko.kode
