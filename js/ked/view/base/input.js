var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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
        this["clampValue"] = this["clampValue"].bind(this)
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

    input.prototype["clampValue"] = function (v)
    {
        if (_k_.empty(v))
        {
            return 0
        }
        if (this.opt.max)
        {
            v = _k_.min(this.opt.max,parseInt(v))
        }
        if (this.opt.min)
        {
            v = _k_.max(this.opt.min,parseInt(v))
        }
        return parseInt(v)
    }

    input.prototype["changeValue"] = function (v)
    {
        if (!this.opt.number)
        {
            return
        }
        v = this.clampValue(v)
        if (v !== this.value)
        {
            this.setValue(v)
            return this.emit('valueChange',this)
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
        this.value = this.clampValue(v)
        if (`${this.value}` !== this.current())
        {
            this.set(`${this.value}`)
            if (this.value === 0)
            {
                return this.selectAll()
            }
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
            if (this.opt.number)
            {
                this.changeValue(parseInt(this.current()))
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs7OzhDQUVQLEtBQUMsT0FBTyxLQUFDLE1BQU0sU0FBUyxTQUFTO1lBRXBDLEtBQUMsSUFBSTs7WUFDSixLQUFDLGtCQUFRLEtBQUMsSUFBSSwyQkFBUTs7UUFFMUIsS0FBQyx1QkFBdUI7UUFFeEIsS0FBQyxTQUFTLGlCQUFrQixLQUFDLE1BQU07UUFDbkMsS0FBQyxTQUFTLEtBQWtCLE1BQU0sT0FBTztRQUN6QyxLQUFDLFNBQVMsVUFBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxXQUFrQixNQUFNLE9BQU87OztxQkFFN0M7O1lBRU8sS0FBQyx3QkFBd0IsS0FBQzs7Ozs7O3FCQUdqQywyQkFBYzs7UUFFVixLQUFDLEtBQUssU0FBUztzREFDVDs7O3FCQUVWOztlQUFhLEtBQUssSUFBSSxLQUFDLE1BQU0sRUFBRSxNQUFNOzs7cUJBRXJDLGtCQUFLOztlQUVELEtBQUMsTUFBTSxXQUFXOzs7cUJBRXRCOztRQUVJLEtBQUMsTUFBTSxXQUFXO2VBQ2xCLEtBQUMsTUFBTSxZQUFZOzs7cUJBRXZCLHlCQUFZOztzQkFFSzs7bUJBQVg7O1lBQ0MsS0FBQyxJQUFJOztZQUFNLFlBQVEsS0FBQyxJQUFJLGFBQVE7O1lBQ2hDLEtBQUMsSUFBSTs7WUFBTSxZQUFRLEtBQUMsSUFBSSxhQUFROzt3QkFDL0I7OztxQkFFUiwwQkFBYTs7YUFFQSxLQUFDLElBQUk7Ozs7UUFFZCxJQUFJLEtBQUMsV0FBVztZQUNiLE1BQUssS0FBQzs7WUFDTCxLQUFDLFNBQVM7bUJBQ1YsS0FBQyxLQUFLLGNBQWM7Ozs7cUJBRTVCOztlQUFhLEtBQUM7OztxQkFFZCx1QkFBVTs7YUFFRyxLQUFDLElBQUk7Ozs7UUFDZCxLQUFDLFFBQVEsS0FBQyxXQUFXO2VBQ2YsS0FBQyxZQUFXLEtBQUM7O1lBQ2YsS0FBQyxPQUFPLEtBQUM7Z0JBQ04sS0FBQyxVQUFTOzt1QkFDVCxLQUFDOzs7OztxQkFFYixzQkFBUzs7OzthQUVJLEtBQUMsSUFBSTs7OztZQUNULEtBQUMsWUFBWSxLQUFDOzs7O2FBQ1YsS0FBQyxNQUFNLGNBQWM7Ozs7UUFFOUI7O29CQUFhLE1BQU07O3FCQUNmOzJCQUFXOztxQkFDWDsyQkFBVzs7cUJBQ1g7MkJBQVU7O3FCQUNWOzJCQUFVOzs7Ozs7O1FBR2QsT0FBTztZQUNNLE1BQU07O1lBQW5CLE9BQU87O1FBRVAsS0FBQyxZQUFZLEtBQUMsUUFBUSxNQUFJO1FBRTFCLEtBQUMsTUFBTSxjQUFhLE1BQU0sSUFBSSxRQUFRO2dCQUV0QyxPQUFPOzs7cUJBRVgsb0JBQU8sS0FBSTs7OzthQUVRLEtBQUM7O21CQUFkOztnQkFFSyxNQUFNOztpQkFFVDtnQkFFSSxLQUFDLEtBQUssU0FBUyxTQUFTLEtBQUM7dUJBQ3ZCOztpQkFFTjtpQkFBSztnQkFFRCxLQUFDLEtBQUssU0FBUyxNQUFNO3VCQUNuQjs7aUJBRU47b0JBRU8sS0FBQyxNQUFNLGFBQWEsTUFBTSxLQUFDLFVBQVU7O29CQUNwQyxLQUFDLEtBQUssU0FBUzsyQkFDYjs7O2lCQUVWO2dCQUVJLEtBQUMsS0FBSyxTQUFTO3VCQUNiOzs7O1FBRVYsU0FBUyxLQUFDO1FBRVYscUNBQVcsSUFBSTtZQUVaLFdBQVUsS0FBQzs7Z0JBQzJCLEtBQUMsSUFBSTs7Z0JBQTFDLEtBQUMsWUFBWSxTQUFTLEtBQUM7O1lBQ3ZCLEtBQUMsS0FBSyxTQUFTLFNBQVMsS0FBQzttQkFDdkI7O2VBRU47OztxQkFFSjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVMsTUFBSyxLQUFDLGFBQWEsS0FBQyxNQUFNLFdBQVcsS0FBQyxNQUFNO1FBQ3RELEtBQUMsU0FBUyxRQUFRLEtBQUMsTUFBTTs7OztXQXhJaEM7OztlQTRJTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/input.kode
