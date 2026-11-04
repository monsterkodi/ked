var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var inputchoice

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"

import choices from "../menu/choices.js"


inputchoice = (function ()
{
    _k_.extend(inputchoice, view)
    function inputchoice (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var _15_23_, _26_23_

        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["autoHide"] = this["autoHide"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        inputchoice.__super__.constructor.call(this,this.screen,this.name,features)
        this.autoHideInput = ((_15_23_=this.autoHideInput) != null ? _15_23_ : true)
        this.isVisible = false
        this.isPopup = true
        this.input = new input(this.screen,`${this.name}_input`)
        this.choices = new choices(this.screen,`${this.name}_choices`,features)
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        if (this.autoHideInput)
        {
            this.input.hide()
        }
        else
        {
            this.input.show()
        }
        this.choices.show()
        this.input.on('action',this.onInputAction)
        this.choices.on('action',this.onChoicesAction)
    }

    inputchoice.prototype["setColor"] = function (key, clr)
    {
        inputchoice.__super__.setColor.call(this,key,clr)
    
        if (key === 'bg')
        {
            this.input.setColor('bg_blur',this.color.bg)
            return this.choices.setColor('bg',this.color.bg)
        }
    }

    inputchoice.prototype["inputIsActive"] = function ()
    {
        return this.input.hasFocus() || this.input.current().length
    }

    inputchoice.prototype["arrange"] = function ()
    {
        var cs, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2 - 4)
        cs = _k_.min(h,this.choices.numFiltered())
        this.input.layout(x + 2,y + 1,w - 4,1)
        this.choices.layout(x + 2,y + 3,w - 3,cs)
        return this.cells.layout(x,y,w,cs + 4)
    }

    inputchoice.prototype["show"] = function ()
    {
        inputchoice.__super__.show.call(this)
    
        if (this.choices.numFiltered())
        {
            this.choices.grabFocus()
        }
        else if (this.input.visible())
        {
            this.input.grabFocus()
        }
        return {redraw:true}
    }

    inputchoice.prototype["hide"] = function ()
    {
        var _76_23_

        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        return inputchoice.__super__.hide.call(this)
    }

    inputchoice.prototype["onInputChange"] = function (text)
    {
        if (text === this.choices.filterText)
        {
            return
        }
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(0,0)
        this.choicesFiltered()
        return this.arrange()
    }

    inputchoice.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.applyChoice(this.choices.current())

            case 'change':
                return this.onInputChange(text)

            case 'up':
            case 'down':
                return this.choices.moveSelection(action)

        }

    }

    inputchoice.prototype["autoHide"] = function ()
    {
        if (this.autoHideInput && !this.inputIsActive())
        {
            return this.input.hide()
        }
    }

    inputchoice.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
            case 'right':
            case 'space':
            case 'return':
                return this.applyChoice(this.choices.current())

            case 'hover':
                return this.autoHide()

            case 'boundary':
            case 'left':
                if (this.input.visible())
                {
                    this.input.grabFocus()
                    return true
                }
                break
        }

    }

    inputchoice.prototype["choicesFiltered"] = function ()
    {}

    inputchoice.prototype["currentChoice"] = function ()
    {
        var choice, _120_36_

        choice = ((_120_36_=this.choices.current()) != null ? _120_36_ : this.input.current())
        if (_k_.isStr(choice))
        {
            return choice = _k_.trim(choice)
        }
    }

    inputchoice.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.erase()
        this.drawFrame()
        return this.drawChoices()
    }

    inputchoice.prototype["drawChoices"] = function ()
    {
        this.input.draw()
        return this.choices.draw()
    }

    inputchoice.prototype["drawFrame"] = function ()
    {
        var inner, outer, sy

        sy = 0
        if (this.input.visible())
        {
            outer = (this.input.hasFocus() ? color.brighten(this.color.bg) : this.color.bg)
            inner = (this.input.hasFocus() ? this.input.color.bg_focus : this.input.color.bg_blur)
            this.cells.draw_rounded_border(0,0,-1,2,{fg:outer})
            this.cells.draw_vertical_padding(1,1,outer,inner)
            this.cells.draw_vertical_padding(this.cells.cols - 2,1,inner,outer)
            sy = 2
        }
        return this.cells.draw_rounded_border(0,sy,-1,-1,{fg:this.color.bg,zLayer:1001})
    }

    inputchoice.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            this.input.grabFocus()
            return this.input.selectAll()
        }
        else
        {
            this.choices.grabFocus()
            return this.autoHide()
        }
    }

    inputchoice.prototype["onEscape"] = function ()
    {
        post.emit('focus','editor')
        return this.hide()
    }

    inputchoice.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
                return this.moveFocus()

            case 'esc':
                return this.onEscape()

        }

        if (this.input.hasFocus())
        {
            if (result = this.input.onKey(key,event))
            {
                this.autoHide()
                return result
            }
            if (_k_.in(event.combo,['up','down']))
            {
                if (event.combo === 'down')
                {
                    this.choices.grabFocus()
                }
                this.autoHide()
                return true
            }
        }
        if (result = this.choices.onKey(key,event))
        {
            if (event.char && !(_k_.in(event.char,' \n')))
            {
                this.input.grabFocus()
                if (result = this.input.onKey(key,event))
                {
                    this.autoHide()
                    return result
                }
            }
            else
            {
                if (key === 'down')
                {
                    this.choices.grabFocus()
                }
                this.autoHide()
                return result
            }
        }
        return true
    }

    inputchoice.prototype["onMouse"] = function (event)
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
        ret = this.choices.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = inputchoice.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (event.type === 'press' && !this.hover)
        {
            post.emit('focus','editor')
            this.hide()
            return
        }
        return this.hover
    }

    inputchoice.prototype["onWheel"] = function (event)
    {
        var inside, ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.choices.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        inside = this.cells.isInsideEvent(event)
        if (inside)
        {
            return {redraw:false}
        }
    }

    return inputchoice
})()

export default inputchoice;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9pbnB1dGNob2ljZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7O09BQ1ksY0FBWjs7O0FBQ04sZUFBRDs7NEJBQWE7YUFLVCxhQUFJLFFBQVEsTUFBSzs7UUFBZDtRQUFROzs7Ozs7Ozs7Ozs7OztvREFFRCxLQUFDLE9BQU8sS0FBQyxLQUFLO1FBRXBCLEtBQUMsMEJBQUQsS0FBQyxtQ0FBaUI7UUFFbEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxVQUFZO1FBRWIsS0FBQyxZQUFjLE1BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZUFBZTtRQUVsRCxLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPO1VBRS9CLEtBQUMsUUFBUSxpQkFBVCxLQUFDLFFBQVEsT0FBUTtZQUNkLEtBQUM7O1lBQ0EsS0FBQyxNQUFNOzs7O1lBRVAsS0FBQyxNQUFNOztRQUlYLEtBQUMsUUFBUTtRQUVULEtBQUMsTUFBTSxHQUFLLFNBQVUsS0FBQztRQUN2QixLQUFDLFFBQVEsR0FBRyxTQUFVLEtBQUM7OzsyQkFFM0IsdUJBQVUsS0FBSTs7aURBRUosSUFBSTs7WUFFUCxRQUFPOztZQUVOLEtBQUMsTUFBTSxTQUFhLFVBQVUsS0FBQyxNQUFNO21CQUNyQyxLQUFDLFFBQVEsU0FBVyxLQUFVLEtBQUMsTUFBTTs7OzsyQkFFN0M7O2VBQWtCLEtBQUMsTUFBTSxjQUFjLEtBQUMsTUFBTSxVQUFVOzs7MkJBRXhEOzs7O1FBRUksYUFBUSxLQUFDLE9BQU8sT0FBSztRQUNyQixhQUFRLEtBQUMsT0FBTyxPQUFLO1FBQ3JCLGFBQVEsS0FBQyxPQUFPLE9BQUs7UUFDckIsYUFBUSxLQUFDLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/inputchoice.kode
