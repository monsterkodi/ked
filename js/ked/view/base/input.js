var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        this["changeValue"] = this["changeValue"].bind(this)
        this["clampValue"] = this["clampValue"].bind(this)
        this["current"] = this["current"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        input.__super__.constructor.call(this,this.screen,this.name,['brckts','replex','unype'])
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
        var n, p, s, value, _54_22_

        if (this.opt.scaled && _k_.isStr(v) && v.includes('x'))
        {
            ;[n,s] = v.split('x')
            if (!_k_.empty(n))
            {
                n = this.clampValue(n)
            }
            if (!_k_.empty(s))
            {
                s = `${_k_.clamp(1,7,parseInt(s))}`
            }
            return `${n}x${s}`
        }
        if (_k_.empty(v))
        {
            return `${((_54_22_=this.opt.min) != null ? _54_22_ : 0)}`
        }
        p = this.opt.percent && _k_.isStr(v) && v.endsWith('%')
        value = parseInt(v)
        if (p)
        {
            value = _k_.clamp(0,100,value)
        }
        else
        {
            if (!_k_.empty(this.opt.min))
            {
                value = _k_.max(this.opt.min,value)
            }
            if (!_k_.empty(this.opt.max))
            {
                value = _k_.min(this.opt.max,value)
            }
        }
        return `${value}` + ((p ? '%' : ''))
    }

    input.prototype["changeValue"] = function (v)
    {
        var n, s

        if (!this.opt.number)
        {
            return
        }
        if (typeof(v) === 'number' && this.opt.scaled && this.current().includes('x'))
        {
            ;[n,s] = this.current().split('x')
            v = `${v}${(n.endsWith('%') ? '%' : '')}x${s}`
        }
        else if (typeof(v) === 'number' && this.opt.percent && this.current().endsWith('%'))
        {
            v = `${v}%`
        }
        v = this.clampValue(v)
        if (v !== this.getValue())
        {
            this.setValue(v)
        }
        return this.emit('valueChange',this.current(),this.name)
    }

    input.prototype["getValue"] = function ()
    {
        return this.current()
    }

    input.prototype["int"] = function ()
    {
        var n

        if (this.opt.scaled && this.current().includes('x'))
        {
            n = this.current().split('x')[0]
            return (!_k_.empty((n)) ? parseInt(n) : 1)
        }
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
            if (this.int() === 0)
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
                this.changeValue(this.current())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs4Q0FFUCxLQUFDLE9BQU8sS0FBQyxNQUFNLFNBQVMsU0FBUztRQUV2QyxLQUFDLHVCQUF1QjtRQUV4QixLQUFDLFNBQVMsaUJBQWtCLEtBQUMsTUFBTTtRQUNuQyxLQUFDLFNBQVMsS0FBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxVQUFrQixNQUFNLE9BQU87UUFDekMsS0FBQyxTQUFTLFdBQWtCLE1BQU0sT0FBTzs7O3FCQUU3Qzs7WUFFTyxLQUFDLHdCQUF3QixLQUFDOzs7Ozs7cUJBR2pDLDJCQUFjOztRQUVWLEtBQUMsS0FBSyxTQUFTO3NEQUNUOzs7cUJBRVY7O2VBQWEsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07OztxQkFFckMsa0JBQUs7O2VBRUQsS0FBQyxNQUFNLFdBQVc7OztxQkFFdEI7O1FBRUksS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLFlBQVk7OztxQkFFdkIseUJBQVk7Ozs7WUFFTCxLQUFDLElBQUksVUFBZ0IsVUFBTCxNQUFhLEVBQUUsU0FBUzs7Y0FDdEMsRUFBRSxLQUFLLEVBQUUsTUFBTTsyQkFDVzs7Z0JBQTNCLElBQUksS0FBQyxXQUFXOzsyQkFDbUI7O2dCQUFuQyxpQkFBYSxFQUFFLFdBQU07O3NCQUNoQixLQUFLOztzQkFFZTs7Z0NBQXhCLEtBQUMsSUFBSSx5QkFBTTs7UUFFaEIsSUFBSSxLQUFDLElBQUksV0FBaUIsVUFBTCxNQUFhLEVBQUUsU0FBUztRQUM3QyxpQkFBWTtZQUVUOztZQUNDLGtCQUFjLEVBQUUsSUFBSTs7OzsyQkFFWCxLQUFDLElBQUk7O2dCQUFNLGdCQUFZLEtBQUMsSUFBSSxJQUFJOzsyQkFDaEMsS0FBQyxJQUFJOztnQkFBTSxnQkFBWSxLQUFDLElBQUksSUFBSTs7O2tCQUUxQyxZQUFXLElBQUksTUFBTTs7O3FCQUU1QiwwQkFBYTs7OzthQUVBLEtBQUMsSUFBSTs7OztZQUVYLE9BQU8sT0FBSyxZQUFhLEtBQUMsSUFBSSxVQUFXLEtBQUMsVUFBVSxTQUFTOztjQUMzRCxFQUFFLEtBQUssS0FBQyxVQUFVLE1BQU07WUFDekIsT0FBTyxLQUFJLEVBQUUsU0FBUyxPQUFPLE1BQU0sT0FBTTs7aUJBQ3JDLE9BQU8sT0FBSyxZQUFhLEtBQUMsSUFBSSxXQUFZLEtBQUMsVUFBVSxTQUFTOztZQUNsRSxPQUFPOztRQUVYLElBQUksS0FBQyxXQUFXO1lBRUQsTUFBSyxLQUFDOztZQUFyQixLQUFDLFNBQVM7O2VBQ1YsS0FBQyxLQUFLLGNBQWMsS0FBQyxVQUFVLEtBQUM7OztxQkFFcEM7O2VBQWEsS0FBQzs7O3FCQUVkOzs7O1lBRU8sS0FBQyxJQUFJLFVBQVcsS0FBQyxVQUFVLFNBQVM7O1lBQ25DLElBQUksS0FBQyxVQUFVLE1BQU0sS0FBSztnQ0FDbEIsZUFBUyxLQUFLOzt3QkFFdEIsS0FBQzs7O3FCQUVULHVCQUFVOzs7O2FBRUcsS0FBQyxJQUFJOzs7O1FBQ2QsUUFBUSxLQUFDLFdBQVc7WUFDakIsVUFBUyxLQUFDOztZQUNULEtBQUMsSUFBSTtnQkFDRixLQUFDLFVBQVM7O3VCQUNULEtBQUM7Ozs7O3FCQUViLHNCQUFTOzs7O2FBRUksS0FBQyxJQUFJOzs7O1lBQ1QsS0FBQyxZQUFZLEtBQUM7Ozs7YUFDVixLQUFDLE1BQU0sY0FBYzs7OztRQUU5Qjs7b0JBQWEsTUFBTTs7cUJBQ2Y7MkJBQVc7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVTs7cUJBQ1Y7MkJBQVU7Ozs7Ozs7UUFHZCxPQUFPO1lBQ00sTUFBTTs7WUFBbkIsT0FBTzs7UUFFUCxLQUFDLFlBQVksS0FBQyxRQUFRLE1BQUk7UUFFMUIsS0FBQyxNQUFNLGNBQWEsTUFBTSxJQUFJLFFBQVE7Z0JBRXRDLE9BQU87OztxQkFFWCxvQkFBTyxLQUFJOzs7O2FBRVEsS0FBQzs7bUJBQWQ7O2dCQUVLLE1BQU07O2lCQUVUO2dCQUVJLEtBQUMsS0FBSyxTQUFTLFNBQVMsS0FBQzt1QkFDdkI7O2lCQUVOO2lCQUFLO2dCQUVELEtBQUMsS0FBSyxTQUFTLE1BQU07dUJBQ25COztpQkFFTjtvQkFFTyxLQUFDLE1BQU0sYUFBYSxNQUFNLEtBQUMsVUFBVTs7b0JBQ3BDLEtBQUMsS0FBSyxTQUFTOzJCQUNiOzs7aUJBRVY7Z0JBRUksS0FBQyxLQUFLLFNBQVM7dUJBQ2I7Ozs7UUFFVixTQUFTLEtBQUM7UUFFVixxQ0FBVyxJQUFJO1lBRVosV0FBVSxLQUFDOztnQkFDaUIsS0FBQyxJQUFJOztnQkFBaEMsS0FBQyxZQUFZLEtBQUM7O1lBQ2QsS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO21CQUN2Qjs7ZUFFTjs7O3FCQUVKOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsU0FBUyxNQUFLLEtBQUMsYUFBYSxLQUFDLE1BQU0sV0FBVyxLQUFDLE1BQU07UUFDdEQsS0FBQyxTQUFTLFFBQVEsS0FBQyxNQUFNOzs7O1dBaktoQzs7O2VBcUtNIn0=
//# sourceURL=../../../../kode/ked/view/base/input.kode
