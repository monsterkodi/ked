var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var p, value, _48_22_

        if (_k_.empty(v))
        {
            return `${((_48_22_=this.opt.min) != null ? _48_22_ : 0)}`
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
        if (!this.opt.number)
        {
            return
        }
        if (typeof(v) === 'number' && this.opt.percent && this.current().endsWith('%'))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9pbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsYUFBVDs7O0FBQ1QsU0FBRDs7c0JBQU87YUFTSCxPQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs4Q0FFUCxLQUFDLE9BQU8sS0FBQyxNQUFNLFNBQVMsU0FBUztRQUV2QyxLQUFDLHVCQUF1QjtRQUV4QixLQUFDLFNBQVMsaUJBQWtCLEtBQUMsTUFBTTtRQUNuQyxLQUFDLFNBQVMsS0FBa0IsTUFBTSxPQUFPO1FBQ3pDLEtBQUMsU0FBUyxVQUFrQixNQUFNLE9BQU87UUFDekMsS0FBQyxTQUFTLFdBQWtCLE1BQU0sT0FBTzs7O3FCQUU3Qzs7WUFFTyxLQUFDLHdCQUF3QixLQUFDOzs7Ozs7cUJBR2pDLDJCQUFjOztRQUVWLEtBQUMsS0FBSyxTQUFTO3NEQUNUOzs7cUJBRVY7O2VBQWEsS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU07OztxQkFFckMsa0JBQUs7O2VBRUQsS0FBQyxNQUFNLFdBQVc7OztxQkFFdEI7O1FBRUksS0FBQyxNQUFNLFdBQVc7ZUFDbEIsS0FBQyxNQUFNLFlBQVk7OztxQkFFdkIseUJBQVk7Ozs7c0JBRXFCOztnQ0FBeEIsS0FBQyxJQUFJLHlCQUFNOztRQUVoQixJQUFJLEtBQUMsSUFBSSxXQUFpQixVQUFMLE1BQWEsRUFBRSxTQUFTO1FBQzdDLGlCQUFZO1lBRVQ7O1lBQ0Msa0JBQWMsRUFBRSxJQUFJOzs7OzJCQUVYLEtBQUMsSUFBSTs7Z0JBQU0sZ0JBQVksS0FBQyxJQUFJLElBQUk7OzJCQUNoQyxLQUFDLElBQUk7O2dCQUFNLGdCQUFZLEtBQUMsSUFBSSxJQUFJOzs7a0JBRTFDLFlBQVcsSUFBSSxNQUFNOzs7cUJBRTVCLDBCQUFhOzthQUVBLEtBQUMsSUFBSTs7OztZQUVYLE9BQU8sT0FBSyxZQUFhLEtBQUMsSUFBSSxXQUFZLEtBQUMsVUFBVSxTQUFTOztZQUM3RCxPQUFPOztRQUVYLElBQUksS0FBQyxXQUFXO1lBRUQsTUFBSyxLQUFDOztZQUFyQixLQUFDLFNBQVM7O2VBQ1YsS0FBQyxLQUFLLGNBQWMsS0FBQyxVQUFVLEtBQUM7OztxQkFFcEM7O2VBQWEsS0FBQzs7O3FCQUNkOzt3QkFBWSxLQUFDOzs7cUJBRWIsdUJBQVU7Ozs7YUFFRyxLQUFDLElBQUk7Ozs7UUFDZCxRQUFRLEtBQUMsV0FBVztZQUNqQixVQUFTLEtBQUM7O1lBQ1QsS0FBQyxJQUFJO2dCQUNGLEtBQUMsVUFBUzs7dUJBQ1QsS0FBQzs7Ozs7cUJBRWIsc0JBQVM7Ozs7YUFFSSxLQUFDLElBQUk7Ozs7WUFDVCxLQUFDLFlBQVksS0FBQzs7OzthQUNWLEtBQUMsTUFBTSxjQUFjOzs7O1FBRTlCOztvQkFBYSxNQUFNOztxQkFDZjsyQkFBVzs7cUJBQ1g7MkJBQVc7O3FCQUNYOzJCQUFVOztxQkFDVjsyQkFBVTs7Ozs7OztRQUdkLE9BQU87WUFDTSxNQUFNOztZQUFuQixPQUFPOztRQUVQLEtBQUMsWUFBWSxLQUFDLFFBQVEsTUFBSTtRQUUxQixLQUFDLE1BQU0sY0FBYSxNQUFNLElBQUksUUFBUTtnQkFFdEMsT0FBTzs7O3FCQUVYLG9CQUFPLEtBQUk7Ozs7YUFFUSxLQUFDOzttQkFBZDs7Z0JBRUssTUFBTTs7aUJBRVQ7Z0JBRUksS0FBQyxLQUFLLFNBQVMsU0FBUyxLQUFDO3VCQUN2Qjs7aUJBRU47aUJBQUs7Z0JBRUQsS0FBQyxLQUFLLFNBQVMsTUFBTTt1QkFDbkI7O2lCQUVOO29CQUVPLEtBQUMsTUFBTSxhQUFhLE1BQU0sS0FBQyxVQUFVOztvQkFDcEMsS0FBQyxLQUFLLFNBQVM7MkJBQ2I7OztpQkFFVjtnQkFFSSxLQUFDLEtBQUssU0FBUzt1QkFDYjs7OztRQUVWLFNBQVMsS0FBQztRQUVWLHFDQUFXLElBQUk7WUFFWixXQUFVLEtBQUM7O2dCQUNpQixLQUFDLElBQUk7O2dCQUFoQyxLQUFDLFlBQVksS0FBQzs7WUFDZCxLQUFDLEtBQUssU0FBUyxTQUFTLEtBQUM7bUJBQ3ZCOztlQUVOOzs7cUJBRUo7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxTQUFTLE1BQUssS0FBQyxhQUFhLEtBQUMsTUFBTSxXQUFXLEtBQUMsTUFBTTtRQUN0RCxLQUFDLFNBQVMsUUFBUSxLQUFDLE1BQU07Ozs7V0FqSmhDOzs7ZUFxSk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/input.kode
