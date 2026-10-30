var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorslider

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


colorslider = (function ()
{
    _k_.extend(colorslider, view)
    function colorslider (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
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
    }

    colorslider.prototype["setValue"] = function (v)
    {
        return this.value = _k_.clamp(this.min,this.max,parseInt(v))
    }

    colorslider.prototype["getValue"] = function ()
    {
        return this.value
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BT2tCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7b0RBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFFakMsS0FBQyxNQUFXO1FBQ1osS0FBQyxNQUFXO1FBQ1osS0FBQyxRQUFXO1FBQ1osS0FBQyxVQUFXO1FBQ1osS0FBQyxxQkFBWTs7b0JBQU8sRUFBRSxFQUFFOzs7OzJCQUU1Qix1QkFBVTs7ZUFBSyxLQUFDLGtCQUFjLEtBQUMsSUFBSSxLQUFDLGFBQVE7OzsyQkFFNUM7O2VBQWEsS0FBQzs7OzJCQUVkOzs7O1lBRVUsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFcEIsSUFBSSxLQUFDLE1BQU07WUFDTCxJQUFJOzs7O1FBRVYsZUFBVyxFQUFFLElBQUU7dUJBRVgsSUFBSyxTQUFJLHFCQUFBLFFBQUE7O1lBQ1QsSUFBSSxLQUFDLE9BQU8sSUFBRSxTQUFPLEtBQUMsTUFBSSxLQUFDO1lBQzNCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFNBQVM7O1FBRWhDLGlCQUFhLEtBQUMsUUFBTSxLQUFDLFFBQU0sS0FBQyxNQUFJLEtBQUMsT0FBSztRQUN0QyxNQUFNLEtBQUMsTUFBTSxPQUFPLEdBQUc7WUFFcEIsS0FBQzs7WUFDQSxLQUFLLE1BQU0scUJBQXFCLElBQUksSUFBSSxLQUFLO1lBQzdDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7O1lBRTFCLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUc7WUFDekMsS0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUk7Ozs7O1dBeEM3Qjs7O2VBNENGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
