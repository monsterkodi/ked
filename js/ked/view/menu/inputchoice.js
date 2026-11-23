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
    
        var _15_23_, _28_23_

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
        this.mouseItems = [this.input,this.choices]
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
        var _78_23_

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
        var choice, _122_36_

        choice = ((_122_36_=this.choices.current()) != null ? _122_36_ : this.input.current())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9pbnB1dGNob2ljZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7O09BQ1ksY0FBWjs7O0FBQ04sZUFBRDs7NEJBQWE7YUFLVCxhQUFJLFFBQVEsTUFBSzs7UUFBZDtRQUFROzs7Ozs7Ozs7Ozs7OztvREFFRCxLQUFDLE9BQU8sS0FBQyxLQUFLO1FBRXBCLEtBQUMsMEJBQUQsS0FBQyxtQ0FBaUI7UUFFbEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxVQUFZO1FBRWIsS0FBQyxZQUFjLE1BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZUFBZTtRQUVsRCxLQUFDLGNBQWMsS0FBQyxNQUFNLEtBQUM7UUFFdkIsS0FBQyxTQUFTLEtBQVEsTUFBTSxPQUFPO1FBQy9CLEtBQUMsU0FBUyxRQUFRLE1BQU0sT0FBTztVQUUvQixLQUFDLFFBQVEsaUJBQVQsS0FBQyxRQUFRLE9BQVE7WUFDZCxLQUFDOztZQUNBLEtBQUMsTUFBTTs7OztZQUVQLEtBQUMsTUFBTTs7UUFJWCxLQUFDLFFBQVE7UUFFVCxLQUFDLE1BQU0sR0FBSyxTQUFVLEtBQUM7UUFDdkIsS0FBQyxRQUFRLEdBQUcsU0FBVSxLQUFDOzs7MkJBRTNCLHVCQUFVLEtBQUk7O2lEQUVKLElBQUk7O1lBRVAsUUFBTzs7WUFFTixLQUFDLE1BQU0sU0FBYSxVQUFVLEtBQUMsTUFBTTttQkFDckMsS0FBQyxRQUFRLFNBQVcsS0FBVSxLQUFDLE1BQU07Ozs7MkJBRTdDOztlQUFrQixLQUFDLE1BQU0sY0FBYyxLQUFDLE1BQU0sVUFBVTs7OzJCQUV4RDs7OztRQUVJLGFBQVEsS0FBQyxPQUFPLE9BQUs7UUFDckIsYUFBUSxLQUFDLE9BQU8sT0FBSztRQUNyQixhQUFRLEtB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
//# sourceURL=../../../../kode/ked/view/menu/inputchoice.kode
