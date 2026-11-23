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
            var _a_ = v.split('x'); n = _a_[0]; s = _a_[1]

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
            var _a_ = this.current().split('x'); n = _a_[0]; s = _a_[1]

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs4Q0FFUCxLQUFDLE9BQU8sS0FBQyxNQUFNLFNBQVMsU0FBUztRQUV2QyxLQUFDLHVCQUF1QjtRQUV4QixLQUFDLFNBQVMsaUJBQWtCLEtBQUMsTUFBTTtRQUNuQyxLQUFDLFNBQVMsS0FBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxVQUFrQixNQUFNLE9BQU87UUFDekMsS0FBQyxTQUFTLFdBQWtCLE1BQU0sT0FBTzs7O3FCQUU3Qzs7WUFFTyxLQUFDLHdCQUF3QixLQUFDOzs7Ozs7cUJBR2pDLDJCQUFjOztRQUVWLEtBQUMsS0FBSyxTQUFTO3NEQUNUOzs7cUJBRVY7O2VBQWEsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07OztxQkFFckMsa0JBQUs7O2VBRUQsS0FBQyxNQUFNLFdBQVc7OztxQkFFdEI7O1FBRUksS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLFlBQVk7OztxQkFFdkIseUJBQVk7Ozs7WUFFTCxLQUFDLElBQUksVUFBZ0IsVUFBTCxNQUFhLEVBQUUsU0FBUzs7c0JBQy9CLEVBQUUsTUFBTSxNQUFmLFlBQUU7OzJCQUN3Qjs7Z0JBQTNCLElBQUksS0FBQyxXQUFXOzsyQkFDbUI7O2dCQUFuQyxpQkFBYSxFQUFFLFdBQU07O3NCQUNoQixLQUFLOztzQkFFZTs7Z0NBQXhCLEtBQUMsSUFBSSx5QkFBTTs7UUFFaEIsSUFBSSxLQUFDLElBQUksV0FBaUIsVUFBTCxNQUFhLEVBQUUsU0FBUztRQUM3QyxpQkFBWTtZQUVUOztZQUNDLGtCQUFjLEVBQUUsSUFBSTs7OzsyQkFFWCxLQUFDLElBQUk7O2dCQUFNLGdCQUFZLEtBQUMsSUFBSSxJQUFJOzsyQkFDaEMsS0FBQyxJQUFJOztnQkFBTSxnQkFBWSxLQUFDLElBQUksSUFBSTs7O2tCQUUxQyxZQUFXLElBQUksTUFBTTs7O3FCQUU1QiwwQkFBYTs7OzthQUVBLEtBQUMsSUFBSTs7OztZQUVYLE9BQU8sT0FBSyxZQUFhLEtBQUMsSUFBSSxVQUFXLEtBQUMsVUFBVSxTQUFTOztzQkFDcEQsS0FBQyxVQUFVLE1BQU0sTUFBeEIsWUFBRTs7WUFDSCxPQUFPLEtBQUksRUFBRSxTQUFTLE9BQU8sTUFBTSxPQUFNOztpQkFDckMsT0FBTyxPQUFLLFlBQWEsS0FBQyxJQUFJLFdBQVksS0FBQyxVQUFVLFNBQVM7O1lBQ2xFLE9BQU87O1FBRVgsSUFBSSxLQUFDLFdBQVc7WUFFRCxNQUFLLEtBQUM7O1lBQXJCLEtBQUMsU0FBUzs7ZUFDVixLQUFDLEtBQUssY0FBYyxLQUFDLFVBQVUsS0FBQzs7O3FCQUVwQzs7ZUFBYSxLQUFDOzs7cUJBRWQ7Ozs7WUFFTyxLQUFDLElBQUksVUFBVyxLQUFDLFVBQVUsU0FBUzs7WUFDbkMsSUFBSSxLQUFDLFVBQVUsTUFBTSxLQUFLO2dDQUNsQixlQUFTLEtBQUs7O3dCQUV0QixLQUFDOzs7cUJBRVQsdUJBQVU7Ozs7YUFFRyxLQUFDLElBQUk7Ozs7UUFDZCxRQUFRLEtBQUMsV0FBVztZQUNqQixVQUFTLEtBQUM7O1lBQ1QsS0FBQyxJQUFJO2dCQUNGLEtBQUMsVUFBUzs7dUJBQ1QsS0FBQzs7Ozs7cUJBRWIsc0JBQVM7Ozs7YUFFSSxLQUFDLElBQUk7Ozs7WUFDVCxLQUFDLFlBQVksS0FBQzs7OzthQUNWLEtBQUMsTUFBTSxjQUFjOzs7O1FBRTlCOztvQkFBYSxNQUFNOztxQkFDZjsyQkFBVzs7cUJBQ1g7MkJBQVc7O3FCQUNYOzJCQUFVOztxQkFDVjsyQkFBVTs7Ozs7OztRQUdkLE9BQU87WUFDTSxNQUFNOztZQUFuQixPQUFPOztRQUVQLEtBQUMsWUFBWSxLQUFDLFFBQVEsTUFBSTtRQUUxQixLQUFDLE1BQU0sY0FBYSxNQUFNLElBQUksUUFBUTtnQkFFdEMsT0FBTzs7O3FCQUVYLG9CQUFPLEtBQUk7Ozs7YUFFUSxLQUFDOzttQkFBZDs7Z0JBRUssTUFBTTs7aUJBRVQ7Z0JBRUksS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO3VCQUN2Qjs7aUJBRU47aUJBQUs7Z0JBRUQsS0FBQyxLQUFLLFNBQVMsTUFBTTt1QkFDbkI7O2lCQUVOO29CQUVPLEtBQUMsTUFBTSxhQUFhLE1BQU0sS0FBQyxVQUFVOztvQkFDcEMsS0FBQyxLQUFLLFNBQVM7MkJBQ2I7OztpQkFFVjtnQkFFSSxLQUFDLEtBQUssU0FBUzt1QkFDYjs7OztRQUVWLFNBQVMsS0FBQztRQUVWLHFDQUFXLElBQUk7WUFFWixXQUFVLEtBQUM7O2dCQUNpQixLQUFDLElBQUk7O2dCQUFoQyxLQUFDLFlBQVksS0FBQzs7WUFDZCxLQUFDLEtBQUssU0FBUyxTQUFTLEtBQUM7bUJBQ3ZCOztlQUVOOzs7cUJBRUo7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxTQUFTLE1BQUssS0FBQyxhQUFhLEtBQUMsTUFBTSxXQUFXLEtBQUMsTUFBTTtRQUN0RCxLQUFDLFNBQVMsUUFBUSxLQUFDLE1BQU07Ozs7V0FqS2hDOzs7ZUFxS00ifQ==
//# sourceURL=../../../../kode/ked/view/base/input.kode
