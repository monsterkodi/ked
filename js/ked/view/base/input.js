var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        var p, _51_20_

        if (_k_.empty(v))
        {
            return (((_51_20_=this.opt.min) != null ? _51_20_ : 0))
        }
        p = this.opt.percent && _k_.isStr(v) && v.endsWith('%')
        if (!_k_.empty(this.opt.min))
        {
            v = _k_.max(this.opt.min,parseInt(v))
        }
        if (!_k_.empty(this.opt.max))
        {
            v = _k_.min(this.opt.max,parseInt(v))
        }
        if (!_k_.empty(this.opt.percent) && this.opt.max > 100)
        {
            v = _k_.min(100,parseInt(v))
        }
        return `${v}` + ((p ? '%' : ''))
    }

    input.prototype["changeValue"] = function (v)
    {
        if (!this.opt.number)
        {
            return
        }
        v = this.clampValue(v)
        if (v !== this.getValue())
        {
            this.setValue(v)
            return this.emit('valueChange',this.current(),this.name)
        }
    }

    input.prototype["getValue"] = function ()
    {
        return this.current()
    }

    input.prototype["int"] = function ()
    {
        return parseInt(this.current())
    }

    input.prototype["setValue"] = function (v)
    {
        var value

        if (!this.opt.number)
        {
            return
        }
        value = this.clampValue(v)
        if (value !== this.getValue())
        {
            this.set(value)
            if (value === '0')
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
        this.changeValue(this.int() + dir * step)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs7OzhDQUVQLEtBQUMsT0FBTyxLQUFDLE1BQU0sU0FBUyxTQUFTO1lBRXBDLEtBQUMsSUFBSTs7WUFDSixLQUFDLGtCQUFRLEtBQUMsSUFBSSwyQkFBUTs7UUFFMUIsS0FBQyx1QkFBdUI7UUFFeEIsS0FBQyxTQUFTLGlCQUFrQixLQUFDLE1BQU07UUFDbkMsS0FBQyxTQUFTLEtBQWtCLE1BQU0sT0FBTztRQUN6QyxLQUFDLFNBQVMsVUFBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxXQUFrQixNQUFNLE9BQU87OztxQkFFN0M7O1lBRU8sS0FBQyx3QkFBd0IsS0FBQzs7Ozs7O3FCQUdqQywyQkFBYzs7UUFFVixLQUFDLEtBQUssU0FBUztzREFDVDs7O3FCQUVWOztlQUFhLEtBQUssSUFBSSxLQUFDLE1BQU0sRUFBRSxNQUFNOzs7cUJBRXJDLGtCQUFLOztlQUVELEtBQUMsTUFBTSxXQUFXOzs7cUJBRXRCOztRQUVJLEtBQUMsTUFBTSxXQUFXO2VBQ2xCLEtBQUMsTUFBTSxZQUFZOzs7cUJBRXZCLHlCQUFZOzs7O3NCQUVrQjs7OEJBQXZCLEtBQUMsSUFBSSx5QkFBTTs7UUFDZCxJQUFJLEtBQUMsSUFBSSxXQUFpQixVQUFMLE1BQWEsRUFBRSxTQUFTO3VCQUNwQyxLQUFDLElBQUk7O1lBQU0sWUFBUSxLQUFDLElBQUksYUFBUTs7dUJBQ2hDLEtBQUMsSUFBSTs7WUFBTSxZQUFRLEtBQUMsSUFBSSxhQUFROzt1QkFDaEMsS0FBQyxJQUFJLFlBQVksS0FBQyxJQUFJLE1BQU07O1lBQ2pDLFlBQVEsYUFBUTs7a0JBQ2pCLFFBQU8sSUFBSSxNQUFNOzs7cUJBRXhCLDBCQUFhOzthQUVBLEtBQUMsSUFBSTs7OztRQUVkLElBQUksS0FBQyxXQUFXO1lBQ2IsTUFBSyxLQUFDOztZQUNMLEtBQUMsU0FBUzttQkFDVixLQUFDLEtBQUssY0FBYyxLQUFDLFVBQVUsS0FBQzs7OztxQkFFeEM7O2VBQWEsS0FBQzs7O3FCQUNkOzt3QkFBWSxLQUFDOzs7cUJBRWIsdUJBQVU7Ozs7YUFFRyxLQUFDLElBQUk7Ozs7UUFDZCxRQUFRLEtBQUMsV0FBVztZQUNqQixVQUFTLEtBQUM7O1lBQ1QsS0FBQyxJQUFJO2dCQUNGLFVBQVM7O3VCQUNSLEtBQUM7Ozs7O3FCQUViLHNCQUFTOzs7O2FBRUksS0FBQyxJQUFJOzs7O1lBQ1QsS0FBQyxZQUFZLEtBQUM7Ozs7YUFDVixLQUFDLE1BQU0sY0FBYzs7OztRQUU5Qjs7b0JBQWEsTUFBTTs7cUJBQ2Y7MkJBQVc7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVTs7cUJBQ1Y7MkJBQVU7Ozs7Ozs7UUFHZCxPQUFPO1lBQ00sTUFBTTs7WUFBbkIsT0FBTzs7UUFFUCxLQUFDLFlBQVksS0FBQyxRQUFRLE1BQUk7UUFFMUIsS0FBQyxNQUFNLGNBQWEsTUFBTSxJQUFJLFFBQVE7Z0JBRXRDLE9BQU87OztxQkFFWCxvQkFBTyxLQUFJOzs7O2FBRVEsS0FBQzs7bUJBQWQ7O2dCQUVLLE1BQU07O2lCQUVUO2dCQUVJLEtBQUMsS0FBSyxTQUFTLFNBQVMsS0FBQzt1QkFDdkI7O2lCQUVOO2lCQUFLO2dCQUVELEtBQUMsS0FBSyxTQUFTLE1BQU07dUJBQ25COztpQkFFTjtvQkFFTyxLQUFDLE1BQU0sYUFBYSxNQUFNLEtBQUMsVUFBVTs7b0JBQ3BDLEtBQUMsS0FBSyxTQUFTOzJCQUNiOzs7aUJBRVY7Z0JBRUksS0FBQyxLQUFLLFNBQVM7dUJBQ2I7Ozs7UUFFVixTQUFTLEtBQUM7UUFFVixxQ0FBVyxJQUFJO1lBRVosV0FBVSxLQUFDOztnQkFDMkIsS0FBQyxJQUFJOztnQkFBMUMsS0FBQyxZQUFZLFNBQVMsS0FBQzs7WUFDdkIsS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO21CQUN2Qjs7ZUFFTjs7O3FCQUVKOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsU0FBUyxNQUFLLEtBQUMsYUFBYSxLQUFDLE1BQU0sV0FBVyxLQUFDLE1BQU07UUFDdEQsS0FBQyxTQUFTLFFBQVEsS0FBQyxNQUFNOzs7O1dBNUloQzs7O2VBZ0pNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/input.kode
