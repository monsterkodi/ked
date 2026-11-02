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
    
        var _23_23_, _34_23_

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
        this.autoHideInput = ((_23_23_=this.autoHideInput) != null ? _23_23_ : true)
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
        var _96_23_

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
        var choice, _152_36_

        choice = ((_152_36_=this.choices.current()) != null ? _152_36_ : this.input.current())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9pbnB1dGNob2ljZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7O09BQ1ksY0FBWjs7O0FBRUUsZUFBVDs7NEJBQTZCO2FBRXpCLGFBQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7Ozs7Ozs7O29EQUVELEtBQUMsT0FBTyxLQUFDLEtBQUs7UUFFcEIsS0FBQywwQkFBRCxLQUFDLG1DQUFpQjtRQUVsQixLQUFDLFlBQVk7UUFDYixLQUFDLFVBQVk7UUFFYixLQUFDLFlBQWMsTUFBUSxLQUFDLFVBQVUsS0FBQztRQUNuQyxLQUFDLGNBQWMsUUFBUSxLQUFDLFVBQVUsS0FBQyxlQUFlO1FBRWxELEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87VUFFL0IsS0FBQyxRQUFRLGlCQUFULEtBQUMsUUFBUSxPQUFRO1lBQ2QsS0FBQzs7WUFDQSxLQUFDLE1BQU07Ozs7WUFFUCxLQUFDLE1BQU07O1FBSVgsS0FBQyxRQUFRO1FBRVQsS0FBQyxNQUFNLEdBQUssU0FBVSxLQUFDO1FBQ3ZCLEtBQUMsUUFBUSxHQUFHLFNBQVUsS0FBQzs7OzJCQUUzQix1QkFBVSxLQUFJOztpREFFSixJQUFJOztZQUVQLFFBQU87O1lBRU4sS0FBQyxNQUFNLFNBQWEsVUFBVSxLQUFDLE1BQU07bUJBQ3JDLEtBQUMsUUFBUSxTQUFXLEtBQVUsS0FBQyxNQUFNOzs7OzJCQUU3Qzs7ZUFBa0IsS0FBQyxNQUFNLGNBQWMsS0FBQyxNQUFNLFVBQVU7OzsyQkFReEQ7Ozs7UUFFSSxhQUFRLEtBQUMsT0FBTyxPQUFLO1FBQ3JCLGFBQVEsS0FBQyxPQUFPLE9BQUs7UUFDckIsYUFBUSxLQUFDLE9BQU8sT0FBSztRQUNyQixhQUFRLEtBQUMs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/inputchoice.kode
