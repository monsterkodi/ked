var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var input

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import editor from "../../edit/editor.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name, opt = {})
    {
        this.screen = screen
        this.name = name
        this.opt = opt
    
        var _19_32_

        this["onWheel"] = this["onWheel"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        this["changeValue"] = this["changeValue"].bind(this)
        this["current"] = this["current"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        input.__super__.constructor.call(this,this.screen,this.name,['brckts','replex','unype'])
        if (this.opt.number)
        {
            this.value = ((_19_32_=this.opt.value) != null ? _19_32_ : 0)
        }
        this.drawUnfocusedCursors = true
        this.setColor('selection_line',this.color.selection)
        this.setColor('bg',theme.quicky.bg)
        this.setColor('bg_blur',theme.quicky.bg)
        this.setColor('bg_focus',theme.editor.bg)
    }

    input.prototype["drawCursors"] = function ()
    {
        if (this.drawUnfocusedCursors || this.hasFocus())
        {
            return input.__super__.drawCursors.call(this)
        }
    }

    input.prototype["onMouseLeave"] = function (event)
    {
        this.emit('action','cancel')
        return input.__super__.onMouseLeave.call(this,event)
    }

    input.prototype["current"] = function ()
    {
        return kseg.str(this.state.s.lines[0])
    }

    input.prototype["set"] = function (text)
    {
        return this.state.loadLines([text])
    }

    input.prototype["selectAll"] = function ()
    {
        this.state.selectLine(0)
        return this.state.moveCursors('eol')
    }

    input.prototype["changeValue"] = function (v)
    {
        if (!this.opt.number)
        {
            return
        }
        v = _k_.clamp(0,255,parseInt(v))
        if (v !== this.value)
        {
            this.setValue(v)
            return this.emit('valueChange',this.value)
        }
    }

    input.prototype["getValue"] = function ()
    {
        return this.value
    }

    input.prototype["setValue"] = function (v)
    {
        if (!this.opt.number)
        {
            return
        }
        this.value = _k_.clamp(0,255,parseInt(v))
        if (`${this.value}` !== this.current())
        {
            this.set(`${this.value}`)
            return this.state.moveCursors('eol')
        }
    }

    input.prototype["onWheel"] = function (event)
    {
        var dir, step

        if (!this.opt.number)
        {
            return
        }
        if (this.hidden() || this.collapsed())
        {
            return
        }
        if (!this.cells.isInsideEvent(event))
        {
            return
        }
        dir = ((function ()
        {
            switch (event.dir)
            {
                case 'up':
                    return 1

                case 'right':
                    return 1

                case 'down':
                    return -1

                case 'left':
                    return -1

                default:
                    return
            }

        }).bind(this))()
        step = 1
        if (event.shift)
        {
            step = 10
        }
        this.changeValue(this.value + dir * step)
        this.state.moveCursors(((dir > 0 ? 'eol' : 'bol')))
        return {redraw:true}
    }

    input.prototype["onKey"] = function (key, event)
    {
        var before, sr

        if (!this.hasFocus())
        {
            return false
        }
        switch (event.combo)
        {
            case 'return':
                this.emit('action','submit',this.current())
                return true

            case 'up':
            case 'down':
                this.emit('action',event.combo)
                return false

            case 'right':
                if (this.state.mainCursor()[0] >= this.current().length)
                {
                    this.emit('action','right')
                    return true
                }
                break
            case 'esc':
                this.emit('action','cancel')
                return true

        }

        before = this.current()
        sr = input.__super__.onKey.call(this,key,event)
        if (before !== this.current())
        {
            this.emit('action','change',this.current())
            return true
        }
        return sr
    }

    input.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.setColor('bg',(this.hasFocus() ? this.color.bg_focus : this.color.bg_blur))
        this.setColor('empty',this.color.bg)
        return input.__super__.draw.call(this)
    }

    return input
})()

export default input;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs7OENBRVAsS0FBQyxPQUFPLEtBQUMsTUFBTSxTQUFTLFNBQVM7WUFFcEMsS0FBQyxJQUFJOztZQUNKLEtBQUMsa0JBQVEsS0FBQyxJQUFJLDJCQUFROztRQUUxQixLQUFDLHVCQUF1QjtRQUV4QixLQUFDLFNBQVMsaUJBQWtCLEtBQUMsTUFBTTtRQUNuQyxLQUFDLFNBQVMsS0FBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxVQUFrQixNQUFNLE9BQU87UUFDekMsS0FBQyxTQUFTLFdBQWtCLE1BQU0sT0FBTzs7O3FCQUU3Qzs7WUFFTyxLQUFDLHdCQUF3QixLQUFDOzs7Ozs7cUJBR2pDLDJCQUFjOztRQUVWLEtBQUMsS0FBSyxTQUFTO3NEQUNUOzs7cUJBRVY7O2VBQWEsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07OztxQkFFckMsa0JBQUs7O2VBRUQsS0FBQyxNQUFNLFdBQVc7OztxQkFFdEI7O1FBRUksS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLFlBQVk7OztxQkFFdkIsMEJBQWE7O2FBRUEsS0FBQyxJQUFJOzs7O1FBRWQsY0FBVSxFQUFFLGFBQVE7WUFDakIsTUFBSyxLQUFDOztZQUNMLEtBQUMsU0FBUzttQkFDVixLQUFDLEtBQUssY0FBYyxLQUFDOzs7O3FCQUU3Qjs7ZUFBYSxLQUFDOzs7cUJBRWQsdUJBQVU7O2FBRUcsS0FBQyxJQUFJOzs7O1FBRWQsS0FBQyxrQkFBYyxFQUFFLGFBQVE7ZUFDbkIsS0FBQyxZQUFXLEtBQUM7O1lBQ2YsS0FBQyxPQUFPLEtBQUM7bUJBQ1QsS0FBQyxNQUFNLFlBQVk7Ozs7cUJBRTNCLHNCQUFTOzs7O2FBRUksS0FBQyxJQUFJOzs7O1lBQ1QsS0FBQyxZQUFZLEtBQUM7Ozs7YUFDVixLQUFDLE1BQU0sY0FBYzs7OztRQUU5Qjs7b0JBQWEsTUFBTTs7cUJBQ2Y7MkJBQVc7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVTs7cUJBQ1Y7MkJBQVU7Ozs7Ozs7UUFHZCxPQUFPO1lBQ00sTUFBTTs7WUFBbkIsT0FBTzs7UUFFUCxLQUFDLFlBQVksS0FBQyxRQUFRLE1BQUk7UUFFMUIsS0FBQyxNQUFNLGNBQWEsTUFBTSxJQUFJLFFBQVE7Z0JBRXRDLE9BQU87OztxQkFFWCxvQkFBTyxLQUFJOzs7O2FBRVEsS0FBQzs7bUJBQWQ7O2dCQUVLLE1BQU07O2lCQUVUO2dCQUVJLEtBQUMsS0FBSyxTQUFTLFNBQVMsS0FBQzt1QkFDdkI7O2lCQUVOO2lCQUFLO2dCQUVELEtBQUMsS0FBSyxTQUFTLE1BQU07dUJBQ25COztpQkFFTjtvQkFFTyxLQUFDLE1BQU0sYUFBYSxNQUFNLEtBQUMsVUFBVTs7b0JBQ3BDLEtBQUMsS0FBSyxTQUFTOzJCQUNiOzs7aUJBRVY7Z0JBRUksS0FBQyxLQUFLLFNBQVM7dUJBQ2I7Ozs7UUFFVixTQUFTLEtBQUM7UUFFVixxQ0FBVyxJQUFJO1lBRVosV0FBVSxLQUFDOztZQUNWLEtBQUMsS0FBSyxTQUFTLFNBQVMsS0FBQzttQkFDdkI7O2VBRU47OztxQkFFSjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVMsTUFBSyxLQUFDLGFBQWEsS0FBQyxNQUFNLFdBQVcsS0FBQyxNQUFNO1FBQ3RELEtBQUMsU0FBUyxRQUFRLEtBQUMsTUFBTTs7OztXQWhJaEM7OztlQW9JTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/input.kode
