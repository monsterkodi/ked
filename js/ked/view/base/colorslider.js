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
        this.focused = false
        this.gradient = function (v)
        {
            return [0,0,0]
        }
        this.focusable = true
        this.pointerType = 'ew-resize'
        this.onFocusRequest = null
        this.onInput = null
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
        var _40_23_

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
            this.cells.set_ch_fg(mx,0,'┃',fg)
        }
        return colorslider.__super__.draw.call(this)
    }

    return colorslider
})()

export default colorslider;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BT2EsVUFBQTtJQUFNOztPQUNELFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7Ozs7Ozs7b0RBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFFakMsS0FBQyxNQUFXO1FBQ1osS0FBQyxNQUFXO1FBQ1osS0FBQyxRQUFXO1FBQ1osS0FBQyxVQUFXO1FBQ1osS0FBQyxxQkFBWTs7b0JBQU8sRUFBRSxFQUFFOztRQUV4QixLQUFDLFlBQWlCO1FBQ2xCLEtBQUMsY0FBaUI7UUFDbEIsS0FBQyxpQkFBaUI7UUFDbEIsS0FBQyxVQUFpQjs7OzJCQUV0Qix1QkFBVTs7ZUFBSyxLQUFDLGtCQUFjLEtBQUMsSUFBSSxLQUFDLGFBQVE7OzsyQkFFNUM7O2VBQWEsS0FBQzs7OzJCQUVkOztZQUFzRCxXQUFuQixLQUFDOzttQkFBdEIsS0FBQzs7OzsyQkFFZiwyQkFBYzs7OzthQUVQLE1BQU07O2dCQUMrQixLQUFDOztnQkFBckMsS0FBSyxLQUFLLFVBQVUsS0FBQzs7WUFDckIsS0FBSyxLQUFLOzs7NERBR1I7OzsyQkFFViwyQkFBYzs7OztrQkFFRSxLQUFDLFNBQVMsUUFBckIsY0FBSTs7UUFFTCxnQkFBYSxHQUFHLEtBQUMsTUFBTSxPQUFLLEdBQUc7UUFDL0IsZUFBVyxFQUFFLEtBQUMsTUFBTSxPQUFLO2VBRXpCLEtBQUMsb0JBQWUsS0FBQyxPQUFPLE1BQUksU0FBTyxLQUFDLE1BQUksS0FBQzs7OzJCQUU3QyxzQkFBUzs7WUFFQyxLQUFDLFlBQVksS0FBQzs7OztnREFFZDtnQkFFQyxNQUFNOztpQkFFVDtvQkFFTyxLQUFDOztvQkFDQSxLQUFDO29CQUNELEtBQUMsU0FBUztvQkFDVixLQUFDLGFBQWE7d0JBQ1ksV0FBWixLQUFDOzt3QkFBZixLQUFDOztvQkFDRCxLQUFLLEtBQUssVUFBVTs0QkFDakIsT0FBTzs7O2lCQUVsQjtvQkFFTyxLQUFDOztvQkFDQSxLQUFDLFFBQVE7b0JBQ1QsS0FBQyxhQUFhO3dCQUNZLFdBQVosS0FBQzs7d0JBQWYsS0FBQzs7b0JBQ0QsS0FBSyxLQUFLLFVBQVU7NEJBQ2pCLE9BQU87O2dCQUVkLEtBQUMsUUFBUTs7aUJBRWI7b0JBRU8sS0FBQzs7d0JBQ29DLEtBQUM7O3dCQUFyQyxLQUFLLEtBQUssVUFBVSxLQUFDOzsyQkFDZCxLQUFDOzRCQUNMLE9BQU87Ozs7O2VBRXRCLEtBQUM7OzsyQkFFTCwyQkFBYzs7WUFFdUIsS0FBQzs7WUFBbEMsS0FBSyxLQUFLLFVBQVU7OzREQUNkOzs7MkJBRVYsc0JBQVM7Ozs7WUFFQyxLQUFDLFlBQVksS0FBQzs7OzthQUNWLEtBQUMsTUFBTSxjQUFjOzs7O1FBRS9COztvQkFBYSxNQUFNOztxQkFDZjsyQkFBVzs7cUJBQ1g7MkJBQVc7O3FCQUNYOzJCQUFVOztxQkFDVjsyQkFBVTs7OzJCQUNDOzs7O2FBRUw7Ozs7UUFFVixPQUFPO1lBQ00sTUFBTTs7WUFBbkIsT0FBTzs7UUFFUCxLQUFDO1FBQ0QsS0FBQyxTQUFTLEtBQUMsUUFBUSxNQUFJO1lBQ0csV0FBWixLQUFDOztZQUFmLEtBQUM7O2dCQUVELE9BQU87OzsyQkFFWDs7OztZQUVVLEtBQUMsWUFBWSxLQUFDOzs7O1FBRXBCLElBQUksS0FBQyxNQUFNO1lBQ0wsSUFBSTs7OztRQUVWLGVBQVcsRUFBRSxJQUFFO3VCQUVYLElBQUssU0FBSSxxQkFBQSxRQUFBOztZQUNULElBQUksS0FBQyxPQUFPLElBQUUsU0FBTyxLQUFDLE1BQUksS0FBQztZQUMzQixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUUsS0FBQyxTQUFTOztRQUVoQyxpQkFBYSxLQUFDLFFBQU0sS0FBQyxRQUFNLEtBQUMsTUFBSSxLQUFDLE9BQUs7UUFDdEMsTUFBTSxLQUFDLE1BQU0sT0FBTyxHQUFHO1lBRXBCLEtBQUM7O1lBQ0EsS0FBSyxNQUFNLHFCQUFxQixJQUFJLElBQUksS0FBSztZQUM3QyxLQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsSUFBSTs7OztZQUUxQixLQUFLLE1BQU0sb0JBQW9CLEtBQUMsTUFBTSxHQUFHO1lBQ3pDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7OztXQW5JN0I7OztlQXVJRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
