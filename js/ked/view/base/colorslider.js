var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorslider

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


colorslider = (function ()
{
    _k_.extend(colorslider, view)
    function colorslider (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["setFromEvent"] = this["setFromEvent"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        colorslider.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.min = 0
        this.max = 100
        this.value = 0
        this.gradient = function (v)
        {
            return [0,0,0]
        }
        this.pointerType = 'ew-resize'
        this.onFocusRequest = null
        this.onInput = null
        this.setFocusable()
    }

    colorslider.prototype["setValue"] = function (v)
    {
        return this.value = _k_.clamp(this.min,this.max,parseInt(v))
    }

    colorslider.prototype["getValue"] = function ()
    {
        return this.value
    }

    colorslider.prototype["grabFocus"] = function ()
    {
        if (_k_.isFunc(this.onFocusRequest))
        {
            return this.onFocusRequest()
        }
    }

    colorslider.prototype["onMouseEnter"] = function (event)
    {
        var _41_23_

        if ((event.button != null))
        {
            if (this.pointerType)
            {
                post.emit('pointer',this.pointerType)
            }
            post.emit('redraw')
            return
        }
        return colorslider.__super__.onMouseEnter.call(this,event)
    }

    colorslider.prototype["setFromEvent"] = function (event)
    {
        var col, row, span

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        col = _k_.clamp(0,(this.cells.cols - 1),col)
        span = _k_.max(1,this.cells.cols - 1)
        return this.setValue(Math.round(this.min + (col / span) * (this.max - this.min)))
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
                    if (_k_.isFunc(this.onInput))
                    {
                        this.onInput()
                    }
                    post.emit('pointer','grabbing')
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    this.setFromEvent(event)
                    if (_k_.isFunc(this.onInput))
                    {
                        this.onInput()
                    }
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

    colorslider.prototype["onMouseLeave"] = function (event)
    {
        if (this.pointerType)
        {
            post.emit('pointer','default')
        }
        return colorslider.__super__.onMouseLeave.call(this,event)
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
        this.grabFocus()
        this.setValue(this.value + dir * step)
        if (_k_.isFunc(this.onInput))
        {
            this.onInput()
        }
        return {redraw:true}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUWEsVUFBQTtJQUFNOztPQUNELFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7Ozs7Ozs7b0RBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFFakMsS0FBQyxNQUFXO1FBQ1osS0FBQyxNQUFXO1FBQ1osS0FBQyxRQUFXO1FBQ1osS0FBQyxxQkFBWTs7b0JBQU8sRUFBRSxFQUFFOztRQUV4QixLQUFDLGNBQWlCO1FBQ2xCLEtBQUMsaUJBQWlCO1FBQ2xCLEtBQUMsVUFBaUI7UUFFbEIsS0FBQzs7OzJCQUVMLHVCQUFVOztlQUFLLEtBQUMsa0JBQWMsS0FBQyxJQUFJLEtBQUMsYUFBUTs7OzJCQUU1Qzs7ZUFBYSxLQUFDOzs7MkJBRWQ7O1lBQXNELFdBQW5CLEtBQUM7O21CQUF0QixLQUFDOzs7OzJCQUVmLDJCQUFjOzs7O2FBRVAsTUFBTTs7Z0JBQytCLEtBQUM7O2dCQUFyQyxLQUFLLEtBQUssVUFBVSxLQUFDOztZQUNyQixLQUFLLEtBQUs7Ozs0REFHUjs7OzJCQUVWLDJCQUFjOzs7O2tCQUVFLEtBQUMsU0FBUyxRQUFyQixjQUFJOztRQUVMLGdCQUFhLEdBQUcsS0FBQyxNQUFNLE9BQUssR0FBRztRQUMvQixlQUFXLEVBQUUsS0FBQyxNQUFNLE9BQUs7ZUFFekIsS0FBQyxvQkFBZSxLQUFDLE9BQU8sTUFBSSxTQUFPLEtBQUMsTUFBSSxLQUFDOzs7MkJBRTdDLHNCQUFTOztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O2dEQUViO2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUM7b0JBQ0QsS0FBQyxTQUFTO29CQUNWLEtBQUMsYUFBYTt3QkFDWSxXQUFaLEtBQUM7O3dCQUFmLEtBQUM7O29CQUNELEtBQUssS0FBSyxVQUFVOzRCQUNsQixPQUFPOzs7aUJBRWpCO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsUUFBUTtvQkFDVCxLQUFDLGFBQWE7d0JBQ1ksV0FBWixLQUFDOzt3QkFBZixLQUFDOztvQkFDRCxLQUFLLEtBQUssVUFBVTs0QkFDbEIsT0FBTzs7Z0JBRWIsS0FBQyxRQUFROztpQkFFYjtvQkFFTyxLQUFDOzt3QkFDb0MsS0FBQzs7d0JBQXJDLEtBQUssS0FBSyxVQUFVLEtBQUM7OzJCQUNkLEtBQUM7NEJBQ04sT0FBTzs7Ozs7ZUFFckIsS0FBQzs7OzJCQUVMLDJCQUFjOztZQUV1QixLQUFDOztZQUFsQyxLQUFLLEtBQUssVUFBVTs7NERBQ2Q7OzsyQkFFVixzQkFBUzs7OztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O2FBQ1YsS0FBQyxNQUFNLGNBQWM7Ozs7UUFFOUI7O29CQUFhLE1BQU07O3FCQUNmOzJCQUFXOztxQkFDWDsyQkFBVzs7cUJBQ1g7MkJBQVU7O3FCQUNWOzJCQUFVOzs7MkJBQ0M7Ozs7YUFFTjs7OztRQUVULE9BQU87WUFDTSxNQUFNOztZQUFuQixPQUFPOztRQUVQLEtBQUM7UUFDRCxLQUFDLFNBQVMsS0FBQyxRQUFRLE1BQUk7WUFDRyxXQUFaLEtBQUM7O1lBQWYsS0FBQzs7Z0JBRUQsT0FBTzs7OzJCQUVYOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsSUFBSSxLQUFDLE1BQU07WUFDTixJQUFJOzs7O1FBRVQsZUFBVyxFQUFFLElBQUU7dUJBRVgsSUFBSyxTQUFJLHFCQUFBLFFBQUE7O1lBQ1QsSUFBSSxLQUFDLE9BQU8sSUFBRSxTQUFPLEtBQUMsTUFBSSxLQUFDO1lBQzNCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFNBQVM7O1FBRWhDLGlCQUFhLEtBQUMsUUFBTSxLQUFDLFFBQU0sS0FBQyxNQUFJLEtBQUMsT0FBSztRQUN0QyxNQUFNLEtBQUMsTUFBTSxPQUFPLEdBQUc7WUFFcEIsS0FBQzs7WUFDQSxLQUFLLE1BQU0scUJBQXFCLElBQUksSUFBSSxLQUFLO1lBQzdDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7O1lBRTFCLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUc7WUFDekMsS0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUk7Ozs7O1dBbkk3Qjs7O2VBdUlGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
