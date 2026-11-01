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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUWEsVUFBQTtJQUFNOztPQUNELFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULGVBQVQ7OzRCQUE2QjthQUV6QixhQUFJLFFBQVEsTUFBTSxLQUFLOztRQUFwQjtRQUFRO1FBQU07UUFBSzs7Ozs7Ozs7O29EQUVaLEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUVqQyxLQUFDLE1BQVc7UUFDWixLQUFDLFFBQVc7UUFFWixLQUFDLGNBQWM7UUFDZixLQUFDOzs7MkJBRUwsMEJBQWE7Ozs7UUFFVCxxQkFBaUIsS0FBQyxJQUFJLEtBQUMsYUFBUTtZQUM1QixhQUFZLEtBQUM7O1lBQ1osS0FBQyxTQUFTO1lBQ1YsS0FBQyxLQUFLLGNBQWMsS0FBQzs7ZUFDekI7OzsyQkFFSix1QkFBVTs7ZUFFTixLQUFDLGtCQUFjLEtBQUMsSUFBSSxLQUFDLGFBQVE7OzsyQkFFakM7O2VBQWEsS0FBQzs7OzJCQUVkLDJCQUFjOzs7O2tCQUVFLEtBQUMsU0FBUyxRQUFyQixjQUFJOztRQUVMLGdCQUFhLEdBQUcsS0FBQyxNQUFNLE9BQUssR0FBRztRQUMvQixlQUFXLEVBQUUsS0FBQyxNQUFNLE9BQUs7ZUFFekIsS0FBQyx1QkFBa0IsS0FBQyxPQUFPLE1BQUksU0FBTyxLQUFDLE1BQUksS0FBQzs7OzJCQUVoRCxzQkFBUzs7WUFFQSxLQUFDLFlBQVksS0FBQzs7OztnREFFYjtnQkFFQyxNQUFNOztpQkFFVDtvQkFFTyxLQUFDOztvQkFDQSxLQUFDO29CQUNELEtBQUMsU0FBUztvQkFDVixLQUFDLGFBQWE7b0JBQ2QsS0FBSyxLQUFLLFVBQVU7NEJBQ2xCLE9BQU87OztpQkFFakI7b0JBRU8sS0FBQzs7b0JBQ0EsS0FBQyxRQUFRO29CQUNULEtBQUMsYUFBYTtvQkFDZCxLQUFLLEtBQUssVUFBVTs0QkFDbEIsT0FBTzs7Z0JBRWIsS0FBQyxRQUFROztpQkFFYjtvQkFFTyxLQUFDOzt3QkFDb0MsS0FBQzs7d0JBQXJDLEtBQUssS0FBSyxVQUFVLEtBQUM7OzJCQUNkLEtBQUM7NEJBQ04sT0FBTzs7Ozs7ZUFFckIsS0FBQzs7OzJCQUVMLHNCQUFTOzs7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7YUFDVixLQUFDLE1BQU0sY0FBYzs7OztRQUU5Qjs7b0JBQWEsTUFBTTs7cUJBQ2Y7MkJBQVc7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVTs7cUJBQ1Y7MkJBQVU7OzsyQkFDQzs7OzthQUVOOzs7O1FBRVQsT0FBTztZQUNNLE1BQU07O1lBQW5CLE9BQU87O1FBRVAsS0FBQyxZQUFZLEtBQUMsUUFBUSxNQUFJO2dCQUMxQixPQUFPOzs7MkJBRVgsb0JBQU8sS0FBSTs7YUFFUSxLQUFDOzttQkFBZDs7WUFDUyxLQUFDLFlBQVksS0FBQzs7bUJBQXZCOztnQkFFSyxNQUFNOztpQkFDVDt1QkFBNkIsS0FBQyxZQUFZLEtBQUMsUUFBUTs7aUJBQ25EO3VCQUE2QixLQUFDLFlBQVksS0FBQyxRQUFROztpQkFDbkQ7dUJBQTZCLEtBQUMsWUFBWSxLQUFDLFFBQVE7O2lCQUNuRDt1QkFBNkIsS0FBQyxZQUFZLEtBQUMsUUFBUTs7aUJBQ25EO2lCQUFZO3VCQUFpQixLQUFDLFlBQVksS0FBQzs7aUJBQzNDO2lCQUFZO3VCQUFpQixLQUFDLFlBQVksS0FBQzs7OztlQUUvQzs7OzJCQUVKOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsSUFBSSxLQUFDLE1BQU07WUFDTixJQUFJOzs7O1FBRVQsZUFBVyxFQUFFLElBQUU7dUJBRVgsSUFBSyxTQUFJLHFCQUFBLFFBQUE7O1lBQ1QsSUFBSSxLQUFDLE9BQU8sSUFBRSxTQUFPLEtBQUMsTUFBSSxLQUFDO1lBQzNCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFNBQVM7O1FBRWhDLGlCQUFhLEtBQUMsUUFBTSxLQUFDLFFBQU0sS0FBQyxNQUFJLEtBQUMsT0FBSztRQUN0QyxNQUFNLEtBQUMsTUFBTSxPQUFPLEdBQUc7WUFFcEIsS0FBQzs7WUFDQSxLQUFLLE1BQU0scUJBQXFCLElBQUksSUFBSSxLQUFLO1lBQzdDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7O1lBRTFCLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUc7WUFDekMsS0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUk7Ozs7O1dBbEk3Qjs7O2VBc0lGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
