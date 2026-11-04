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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNELFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUNqQixlQUFEOzs0QkFBYTthQUNULGFBQUksUUFBUSxNQUFNLEtBQUs7O1FBQXBCO1FBQVE7UUFBTTtRQUFLOzs7Ozs7Ozs7b0RBRVosS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFDakMsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBRWpDLEtBQUMsTUFBVztRQUNaLEtBQUMsUUFBVztRQUVaLEtBQUMsY0FBYztRQUNmLEtBQUM7OzsyQkFFTCwwQkFBYTs7OztRQUVULHFCQUFpQixLQUFDLElBQUksS0FBQyxhQUFRO1lBQzVCLGFBQVksS0FBQzs7WUFDWixLQUFDLFNBQVM7WUFDVixLQUFDLEtBQUssY0FBYyxLQUFDOztlQUN6Qjs7OzJCQUVKLHVCQUFVOztlQUVOLEtBQUMsa0JBQWMsS0FBQyxJQUFJLEtBQUMsYUFBUTs7OzJCQUVqQzs7ZUFBYSxLQUFDOzs7MkJBRWQsMkJBQWM7Ozs7a0JBRUUsS0FBQyxTQUFTLFFBQXJCLGNBQUk7O1FBRUwsZ0JBQWEsR0FBRyxLQUFDLE1BQU0sT0FBSyxHQUFHO1FBQy9CLGVBQVcsRUFBRSxLQUFDLE1BQU0sT0FBSztlQUV6QixLQUFDLHVCQUFrQixLQUFDLE9BQU8sTUFBSSxTQUFPLEtBQUMsTUFBSSxLQUFDOzs7MkJBRWhELHNCQUFTOztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O2dEQUViO2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUM7b0JBQ0QsS0FBQyxTQUFTO29CQUNWLEtBQUMsYUFBYTtvQkFDZCxLQUFLLEtBQUssVUFBVTs0QkFDbEIsT0FBTzs7O2lCQUVqQjtvQkFFTyxLQUFDOztvQkFDQSxLQUFDLFFBQVE7b0JBQ1QsS0FBQyxhQUFhO29CQUNkLEtBQUssS0FBSyxVQUFVOzRCQUNsQixPQUFPOztnQkFFYixLQUFDLFFBQVE7O2lCQUViO29CQUVPLEtBQUM7O3dCQUNvQyxLQUFDOzt3QkFBckMsS0FBSyxLQUFLLFVBQVUsS0FBQzs7MkJBQ2QsS0FBQzs0QkFDTixPQUFPOzs7OztlQUVyQixLQUFDOzs7MkJBRUwsc0JBQVM7Ozs7WUFFQSxLQUFDLFlBQVksS0FBQzs7OzthQUNWLEtBQUMsTUFBTSxjQUFjOzs7O1FBRTlCOztvQkFBYSxNQUFNOztxQkFDZjsyQkFBVzs7cUJBQ1g7MkJBQVc7O3FCQUNYOzJCQUFVOztxQkFDVjsyQkFBVTs7OzJCQUNDOzs7O2FBRU47Ozs7UUFFVCxPQUFPO1lBQ00sTUFBTTs7WUFBbkIsT0FBTzs7UUFFUCxLQUFDLFlBQVksS0FBQyxRQUFRLE1BQUk7Z0JBQzFCLE9BQU87OzsyQkFFWCxvQkFBTyxLQUFJOzthQUVRLEtBQUM7O21CQUFkOztZQUNTLEtBQUMsWUFBWSxLQUFDOzttQkFBdkI7O2dCQUVLLE1BQU07O2lCQUNUO3VCQUE2QixLQUFDLFlBQVksS0FBQyxRQUFROztpQkFDbkQ7dUJBQTZCLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUNuRDt1QkFBNkIsS0FBQyxZQUFZLEtBQUMsUUFBUTs7aUJBQ25EO3VCQUE2QixLQUFDLFlBQVksS0FBQyxRQUFROztpQkFDbkQ7aUJBQVk7dUJBQWlCLEtBQUMsWUFBWSxLQUFDOztpQkFDM0M7aUJBQVk7dUJBQWlCLEtBQUMsWUFBWSxLQUFDOzs7O2VBRS9DOzs7MkJBRUo7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixJQUFJLEtBQUMsTUFBTTtZQUNOLElBQUk7Ozs7UUFFVCxlQUFXLEVBQUUsSUFBRTt1QkFFWCxJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxJQUFJLEtBQUMsT0FBTyxJQUFFLFNBQU8sS0FBQyxNQUFJLEtBQUM7WUFDM0IsS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEtBQUMsU0FBUzs7UUFFaEMsaUJBQWEsS0FBQyxRQUFNLEtBQUMsUUFBTSxLQUFDLE1BQUksS0FBQyxPQUFLO1FBQ3RDLE1BQU0sS0FBQyxNQUFNLE9BQU8sR0FBRztZQUVwQixLQUFDOztZQUNBLEtBQUssTUFBTSxxQkFBcUIsSUFBSSxJQUFJLEtBQUs7WUFDN0MsS0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUk7Ozs7WUFFMUIsS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRztZQUN6QyxLQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsSUFBSTs7Ozs7V0FqSXJDOzs7ZUFxSU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
