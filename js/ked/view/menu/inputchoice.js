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
                post.emit('focus','editor')
                return this.hide()

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9pbnB1dGNob2ljZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBZ0I2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O29EQUlmLEtBQUMsT0FBTyxLQUFDLEtBQUs7UUFFcEIsS0FBQywwQkFBRCxLQUFDLG1DQUFpQjtRQUVsQixlQUFPLEtBQUMsdUJBQXVCLEtBQUM7UUFFaEMsS0FBQyxZQUFZO1FBQ2IsS0FBQyxVQUFZO1FBRWIsS0FBQyxZQUFjLE1BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZUFBZTtRQUVsRCxLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPO1VBRS9CLEtBQUMsUUFBUSxpQkFBVCxLQUFDLFFBQVEsT0FBUTtZQUNkLEtBQUM7O1lBQ0EsS0FBQyxNQUFNOzs7O1lBRVAsS0FBQyxNQUFNOztRQUlYLEtBQUMsUUFBUTtRQUVULEtBQUMsTUFBTSxHQUFLLFNBQVUsS0FBQztRQUN2QixLQUFDLFFBQVEsR0FBRyxTQUFVLEtBQUM7Ozs7O2lEQUlqQixJQUFJOztZQUVQLFFBQU87O1lBRU4sS0FBQyxNQUFNLFNBQWEsVUFBVSxLQUFDLE1BQU07bUJBQ3JDLEtBQUMsUUFBUSxTQUFXLEtBQVUsS0FBQyxNQUFNOzs7Ozs7ZUFFM0IsS0FBQyxNQUFNLGNBQWMsS0FBQyxNQUFNLFVBQVU7Ozs7Ozs7UUFVcEQsYUFBUSxLQUFDLE9BQU8sT0FBSztRQUNyQixhQUFRLEtBQUMsT0FBTyxPQUFLO1FBQ3JCLGFBQVEsS0FBQyxPQUFPLE9BQUs7UUFDckIsYUFBUSxLQUFDLE9BQU8sT0FBSyxJQUFFO1FBRXZCLGFBQVMsRUFBRSxLQUFDLFFBQVE7UUFFcEIsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFJLElBQUUsRUFBRyxJQUFFLEVBQUc7UUFDakMsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFJLElBQUUsRUFBRyxJQUFFLEVBQUc7ZUFDakMsS0FBQyxNQUFNLE9BQVUsRUFBTSxFQUFLLEVBQUssS0FBRzs7Ozs7OztZQVlqQyxLQUFDLFFBQVE7O1lBQ1IsS0FBQyxRQUFROztpQkFDTCxLQUFDLE1BQU07O1lBQ1gsS0FBQyxNQUFNOztnQkFFWCxPQUFPOzs7Ozs7O1VBSVAsS0FBQyxRQUFRLGlCQUFULEtBQUMsUUFBUSxPQUFROzs7Ozs7WUFXWCxTQUFRLEtBQUMsUUFBUTs7OztRQUV2QixLQUFDLFFBQVEsT0FBTztRQUNoQixLQUFDLFFBQVEsTUFBTSxXQUFXO1FBRTFCLEtBQUMsUUFBUSxNQUFNLGNBQWMsRUFBRTtRQUMvQixLQUFDO2VBQ0QsS0FBQzs7Ozs7Z0JBSU07O2lCQUNIO3VCQUFjLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUNwQzt1QkFBYyxLQUFDLGNBQWM7O2lCQUM3QjtpQkFDQTt1QkFBYyxLQUFDLFFBQVEsY0FBYzs7Ozs7Ozs7WUFFZixLQUFDLGtCQUFzQixLQUFDOzttQkFBekMsS0FBQyxNQUFNOzs7Ozs7Z0JBVVQ7O2lCQUNIO2lCQUNBO2lCQUNBO2lCQUNBO3VCQUFjLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUVwQzt1QkFBVyxLQUFDOztpQkFFWjtpQkFDQTtvQkFDTyxLQUFDLE1BQU07O29CQUNOLEtBQUMsTUFBTTsyQkFDSjs7Ozs7Ozs7Ozs7Ozs7UUFNZixvQkFBUyxLQUFDLFFBQVEsZ0NBQVksS0FBQyxNQUFNO3NCQUNiOzttQkFBeEIsa0JBQWM7Ozs7OztZQVVSLEtBQUM7Ozs7UUFFUCxLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUM7Ozs7O1FBSUQsS0FBQyxNQUFNO2VBQ1AsS0FBQyxRQUFROzs7Ozs7O1FBSVQsS0FBSztZQUVGLEtBQUMsTUFBTTs7WUFFTixTQUFRLEtBQUMsTUFBTSxhQUFhLE1BQU0sU0FBUyxLQUFDLE1BQU0sTUFBTSxLQUFDLE1BQU07WUFDL0QsU0FBUSxLQUFDLE1BQU0sYUFBYSxLQUFDLE1BQU0sTUFBTSxXQUFXLEtBQUMsTUFBTSxNQUFNO1lBRWpFLEtBQUMsTUFBTSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsR0FBRSxHQUFHO1lBR3ZDLEtBQUMsTUFBTSxzQkFBc0IsRUFBRSxFQUFFLE1BQU07WUFDdkMsS0FBQyxNQUFNLHNCQUFzQixLQUFDLE1BQU0sT0FBSyxFQUFFLEVBQUUsTUFBTTtZQUVuRCxLQUFLOztlQUVULEtBQUMsTUFBTSxvQkFBb0IsRUFBRSxHQUFHLEdBQUcsSUFBRyxHQUFHLEtBQUMsTUFBTSxHQUFHLE9BQVE7Ozs7O1lBSXhELEtBQUMsUUFBUTs7WUFDUixLQUFDLE1BQU07bUJBQ1AsS0FBQyxNQUFNOzs7O1lBRVAsS0FBQyxRQUFRO21CQUNULEtBQUM7Ozs7Ozs7O1lBVUMsS0FBQzs7OztnQkFFQSxNQUFNOztpQkFFVDt1QkFFTyxLQUFDOztpQkFFUjtnQkFFSSxLQUFLLEtBQUssUUFBUTt1QkFDZixLQUFDOzs7O1lBRVQsS0FBQyxNQUFNOztnQkFDSCxTQUFTLEtBQUMsTUFBTSxNQUFNLElBQUk7O2dCQUN6QixLQUFDO3VCQUNFOzs7WUFHUixTQUFTLEtBQUMsUUFBUSxNQUFNLElBQUk7O2dCQUV4QixNQUFNLGlCQUFTLE1BQU0sS0FBWTs7Z0JBQ2hDLEtBQUMsTUFBTTtvQkFDSixTQUFTLEtBQUMsTUFBTSxNQUFNLElBQUk7O29CQUN6QixLQUFDOzJCQUNFOzs7OzsyQkFFaUIsSUFBTzs7b0JBQS9CLEtBQUMsUUFBUTs7Z0JBQ1QsS0FBQzt1QkFDRTs7O2VBQ1g7Ozs7Ozs7WUFVTSxLQUFDOzs7O1FBRVAsTUFBTSxLQUFDLE1BQU0sUUFBVTthQUFrQixjQUFBLElBQUs7O21CQUFaOztRQUNsQyxNQUFNLEtBQUMsUUFBUSxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2xDLDhDQUFZO2FBQTZCLGNBQUEsSUFBSzs7bUJBQVo7O1lBRS9CLE1BQU0sU0FBUSxZQUFnQixLQUFDOztZQUM5QixLQUFLLEtBQUssUUFBUTtZQUNsQixLQUFDOzs7ZUFHTCxLQUFDOzs7Ozs7O1lBVUssS0FBQzs7OztRQUVQLE1BQU0sS0FBQyxNQUFNLFFBQVU7YUFBa0IsY0FBQSxJQUFLOzttQkFBWjs7UUFDbEMsTUFBTSxLQUFDLFFBQVEsUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOztRQUVsQyxTQUFTLEtBQUMsTUFBTSxjQUFjO1lBQzNCOztvQkFBWSxPQUFPOzs7Ozs7O2VBRXZCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/inputchoice.kode
