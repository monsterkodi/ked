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
    
        var _23_23_, _36_23_

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
        console.log(`${this.name}.autoHideInput: ${this.autoHideInput}`)
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
        var _98_23_

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
        var choice, _154_36_

        choice = ((_154_36_=this.choices.current()) != null ? _154_36_ : this.input.current())
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
                if (_k_.in(key,'down'))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9pbnB1dGNob2ljZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7O09BQ1ksY0FBWjs7O0FBRUUsZUFBVDs7NEJBQTZCO2FBRXpCLGFBQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7Ozs7Ozs7O29EQUVELEtBQUMsT0FBTyxLQUFDLEtBQUs7UUFFcEIsS0FBQywwQkFBRCxLQUFDLG1DQUFpQjtRQUVsQixlQUFPLEtBQUMsdUJBQXVCLEtBQUM7UUFFaEMsS0FBQyxZQUFZO1FBQ2IsS0FBQyxVQUFZO1FBRWIsS0FBQyxZQUFjLE1BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZUFBZTtRQUVsRCxLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPO1VBRS9CLEtBQUMsUUFBUSxpQkFBVCxLQUFDLFFBQVEsT0FBUTtZQUNkLEtBQUM7O1lBQ0EsS0FBQyxNQUFNOzs7O1lBRVAsS0FBQyxNQUFNOztRQUlYLEtBQUMsUUFBUTtRQUVULEtBQUMsTUFBTSxHQUFLLFNBQVUsS0FBQztRQUN2QixLQUFDLFFBQVEsR0FBRyxTQUFVLEtBQUM7OzsyQkFFM0IsdUJBQVUsS0FBSTs7aURBRUosSUFBSTs7WUFFUCxRQUFPOztZQUVOLEtBQUMsTUFBTSxTQUFhLFVBQVUsS0FBQyxNQUFNO21CQUNyQyxLQUFDLFFBQVEsU0FBVyxLQUFVLEtBQUMsTUFBTTs7OzsyQkFFN0M7O2VBQWtCLEtBQUMsTUFBTSxjQUFjLEtBQUMsTUFBTSxVQUFVOzs7MkJBUXhEOzs7O1FBRUksYUFBUSxLQUFDLE9BQU8sT0FBSztRQUNyQixhQUFRLEtBQUMsT0FBTyxPQUFLO1FBQ3JCLGFBQVEsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/inputchoice.kode
