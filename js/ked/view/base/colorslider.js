var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorslider

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


colorslider = (function ()
{
    _k_.extend(colorslider, view)
    function colorslider (screen, name, max, gradient)
    {
        this.screen = screen
        this.name = name
        this.max = max
        this.gradient = gradient
    
        this["draw"] = this["draw"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["setFromEvent"] = this["setFromEvent"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        this["changeValue"] = this["changeValue"].bind(this)
        colorslider.__super__.constructor.call(this,this.screen,this.name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.min = 0
        this.value = 0
        this.pointerType = 'pointer'
        this.setFocusable()
    }

    colorslider.prototype["changeValue"] = function (v)
    {
        var newValue

        newValue = _k_.clamp(this.min,this.max,parseInt(v))
        if (newValue !== this.value)
        {
            this.setValue(newValue)
            this.emit('valueChange',this.value)
        }
        return true
    }

    colorslider.prototype["setValue"] = function (v)
    {
        return this.value = _k_.clamp(this.min,this.max,parseInt(v))
    }

    colorslider.prototype["getValue"] = function ()
    {
        return this.value
    }

    colorslider.prototype["setFromEvent"] = function (event)
    {
        var col, row, span

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        col = _k_.clamp(0,(this.cells.cols - 1),col)
        span = _k_.max(1,this.cells.cols - 1)
        return this.changeValue(Math.round(this.min + (col / span) * (this.max - this.min)))
    }

    colorslider.prototype["onMouse"] = function (event)
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        colorslider.__super__.onMouse.call(this,event)
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.grabFocus()
                    this.doDrag = true
                    this.setFromEvent(event)
                    post.emit('pointer','grabbing')
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    this.setFromEvent(event)
                    post.emit('pointer','grabbing')
                    return {redraw:true}
                }
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    if (this.hover)
                    {
                        post.emit('pointer',this.pointerType)
                    }
                    delete this.doDrag
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    colorslider.prototype["onWheel"] = function (event)
    {
        var dir, step

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
                    return 0
            }

        }).bind(this))()
        if (!dir)
        {
            return
        }
        step = 1
        if (event.shift)
        {
            step = 10
        }
        this.changeValue(this.value + dir * step)
        return {redraw:true}
    }

    colorslider.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return false
        }
        if (this.hidden() || this.collapsed())
        {
            return false
        }
        switch (event.combo)
        {
            case 'left':
                return this.changeValue(this.value - 1)

            case 'right':
                return this.changeValue(this.value + 1)

            case 'shift+left':
                return this.changeValue(this.value - 10)

            case 'shift+right':
                return this.changeValue(this.value + 10)

            case 'cmd+left':
            case 'ctrl+left':
                return this.changeValue(this.min)

            case 'cmd+right':
            case 'ctrl+right':
                return this.changeValue(this.max)

        }

        return false
    }

    colorslider.prototype["draw"] = function ()
    {
        var fg, mbg, mx, span, v, w, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        w = this.cells.cols
        if (w < 1)
        {
            return
        }
        span = _k_.max(1,w - 1)
        for (var _a_ = x = 0, _b_ = w; (_a_ <= _b_ ? x < w : x > w); (_a_ <= _b_ ? ++x : --x))
        {
            v = this.min + (x / span) * (this.max - this.min)
            this.cells.set_bg(x,0,this.gradient(v))
        }
        mx = Math.round((this.value - this.min) / (this.max - this.min) * span)
        mbg = this.cells.get_bg(mx,0)
        if (this.focused)
        {
            fg = color.adjustForBackground([255,255,255],mbg)
            this.cells.set_ch_fg(mx,0,'●',fg)
        }
        else
        {
            fg = color.adjustForBackground(this.color.fg,mbg)
            this.cells.set_ch_fg(mx,0,'▪',fg)
        }
        return colorslider.__super__.draw.call(this)
    }

    return colorslider
})()

export default colorslider;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNELFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUNqQixlQUFEOzs0QkFBcUI7YUFDakIsYUFBSSxRQUFRLE1BQU0sS0FBSzs7UUFBcEI7UUFBUTtRQUFNO1FBQUs7Ozs7Ozs7OztvREFFWixLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFFakMsS0FBQyxNQUFXO1FBQ1osS0FBQyxRQUFXO1FBRVosS0FBQyxjQUFjO1FBQ2YsS0FBQzs7OzJCQUVMLDBCQUFhOzs7O1FBRVQscUJBQWlCLEtBQUMsSUFBSSxLQUFDLGFBQVE7WUFDNUIsYUFBWSxLQUFDOztZQUNaLEtBQUMsU0FBUztZQUNWLEtBQUMsS0FBSyxjQUFjLEtBQUM7O2VBQ3pCOzs7MkJBRUosdUJBQVU7O2VBRU4sS0FBQyxrQkFBYyxLQUFDLElBQUksS0FBQyxhQUFROzs7MkJBRWpDOztlQUFhLEtBQUM7OzsyQkFFZCwyQkFBYzs7OztrQkFFRSxLQUFDLFNBQVMsUUFBckIsY0FBSTs7UUFFTCxnQkFBYSxHQUFHLEtBQUMsTUFBTSxPQUFLLEdBQUc7UUFDL0IsZUFBVyxFQUFFLEtBQUMsTUFBTSxPQUFLO2VBRXpCLEtBQUMsdUJBQWtCLEtBQUMsT0FBTyxNQUFJLFNBQU8sS0FBQyxNQUFJLEtBQUM7OzsyQkFFaEQsc0JBQVM7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7Z0RBRWI7Z0JBRUMsTUFBTTs7aUJBRVQ7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQztvQkFDRCxLQUFDLFNBQVM7b0JBQ1YsS0FBQyxhQUFhO29CQUNkLEtBQUssS0FBSyxVQUFVOzRCQUNsQixPQUFPOzs7aUJBRWpCO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsUUFBUTtvQkFDVCxLQUFDLGFBQWE7b0JBQ2QsS0FBSyxLQUFLLFVBQVU7NEJBQ2xCLE9BQU87O2dCQUViLEtBQUMsUUFBUTs7aUJBRWI7b0JBRU8sS0FBQzs7d0JBQ29DLEtBQUM7O3dCQUFyQyxLQUFLLEtBQUssVUFBVSxLQUFDOzsyQkFDZCxLQUFDOzRCQUNOLE9BQU87Ozs7O2VBRXJCLEtBQUM7OzsyQkFFTCxzQkFBUzs7OztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O2FBQ1YsS0FBQyxNQUFNLGNBQWM7Ozs7UUFFOUI7O29CQUFhLE1BQU07O3FCQUNmOzJCQUFXOztxQkFDWDsyQkFBVzs7cUJBQ1g7MkJBQVU7O3FCQUNWOzJCQUFVOzs7MkJBQ0M7Ozs7YUFFTjs7OztRQUVULE9BQU87WUFDTSxNQUFNOztZQUFuQixPQUFPOztRQUVQLEtBQUMsWUFBWSxLQUFDLFFBQVEsTUFBSTtnQkFDMUIsT0FBTzs7OzJCQUVYLG9CQUFPLEtBQUk7O2FBRVEsS0FBQzs7bUJBQWQ7O1lBQ1MsS0FBQyxZQUFZLEtBQUM7O21CQUF2Qjs7Z0JBRUssTUFBTTs7aUJBQ1Q7dUJBQTZCLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUNuRDt1QkFBNkIsS0FBQyxZQUFZLEtBQUMsUUFBUTs7aUJBQ25EO3VCQUE2QixLQUFDLFlBQVksS0FBQyxRQUFROztpQkFDbkQ7dUJBQTZCLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUNuRDtpQkFBWTt1QkFBaUIsS0FBQyxZQUFZLEtBQUM7O2lCQUMzQztpQkFBWTt1QkFBaUIsS0FBQyxZQUFZLEtBQUM7Ozs7ZUFFL0M7OzsyQkFFSjs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLElBQUksS0FBQyxNQUFNO1lBQ04sSUFBSTs7OztRQUVULGVBQVcsRUFBRSxJQUFFO3VCQUVYLElBQUssU0FBSSxxQkFBQSxRQUFBOztZQUNULElBQUksS0FBQyxPQUFPLElBQUUsU0FBTyxLQUFDLE1BQUksS0FBQztZQUMzQixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUUsS0FBQyxTQUFTOztRQUVoQyxpQkFBYSxLQUFDLFFBQU0sS0FBQyxRQUFNLEtBQUMsTUFBSSxLQUFDLE9BQUs7UUFDdEMsTUFBTSxLQUFDLE1BQU0sT0FBTyxHQUFHO1lBRXBCLEtBQUM7O1lBQ0EsS0FBSyxNQUFNLHFCQUFxQixJQUFJLElBQUksS0FBSztZQUM3QyxLQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsSUFBSTs7OztZQUUxQixLQUFLLE1BQU0sb0JBQW9CLEtBQUMsTUFBTSxHQUFHO1lBQ3pDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7OztXQWpJckM7OztlQXFJTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
