var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this["setValue"] = this["setValue"].bind(this)
        colorslider.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.setColor('focus',theme.hover.bg)
        this.setColor('focus_fg','#fff')
        this.min = 0
        this.max = 100
        this.value = 0
        this.suffix = 4
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
        var bg, ch, fg, i, mbg, mfg, mx, span, text, tx, v, w, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        w = this.cells.cols - this.suffix
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
        fg = (this.focused ? this.color.focus_fg : this.color.fg)
        bg = (this.focused ? this.color.focus : this.color.bg)
        this.cells.fill_rect(w,0,-1,0,' ',null,bg)
        text = `${this.value}`
        tx = this.cells.cols - text.length
        var list = _k_.list(text)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            this.cells.set(tx + i,0,ch,fg,bg)
        }
        mx = Math.round((this.value - this.min) / (this.max - this.min) * span)
        mbg = this.cells.get_bg(mx,0)
        mfg = color.adjustForBackground([255,255,255],mbg)
        this.cells.set_ch_fg(mx,0,'│',mfg)
        return colorslider.__super__.draw.call(this)
    }

    return colorslider
})()

export default colorslider;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JzbGlkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9jb2xvcnNsaWRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BT2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQUE7OztBQUVWLGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7b0RBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFXLE1BQU0sWUFBWTtRQUN2QyxLQUFDLFNBQVMsS0FBVyxNQUFNLFlBQVk7UUFDdkMsS0FBQyxTQUFTLFFBQVcsTUFBTSxNQUFNO1FBQ2pDLEtBQUMsU0FBUyxXQUFXO1FBRXJCLEtBQUMsTUFBVztRQUNaLEtBQUMsTUFBVztRQUNaLEtBQUMsUUFBVztRQUNaLEtBQUMsU0FBVztRQUNaLEtBQUMsVUFBVztRQUNaLEtBQUMscUJBQVk7O29CQUFPLEVBQUUsRUFBRTs7OzsyQkFFNUIsdUJBQVU7O2VBQUssS0FBQyxrQkFBYyxLQUFDLElBQUksS0FBQyxhQUFROzs7MkJBRTVDOztlQUFhLEtBQUM7OzsyQkFFZDs7OztZQUVVLEtBQUMsWUFBWSxLQUFDOzs7O1FBRXBCLElBQUksS0FBQyxNQUFNLE9BQU8sS0FBQztZQUNiLElBQUk7Ozs7UUFFVixlQUFXLEVBQUUsSUFBRTt1QkFFWCxJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxJQUFJLEtBQUMsT0FBTyxJQUFFLFNBQU8sS0FBQyxNQUFJLEtBQUM7WUFDM0IsS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEtBQUMsU0FBUzs7UUFFaEMsTUFBSyxLQUFDLFVBQVUsS0FBQyxNQUFNLFdBQVcsS0FBQyxNQUFNO1FBQ3pDLE1BQUssS0FBQyxVQUFVLEtBQUMsTUFBTSxRQUFXLEtBQUMsTUFBTTtRQUV6QyxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSztRQUVuQyxVQUFVLEtBQUM7UUFDWCxLQUFPLEtBQUMsTUFBTSxPQUFPLEtBQUs7NEJBRWQ7YUFBTDs7WUFBSDtZQUNBLEtBQUMsTUFBTSxJQUFJLEtBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRzs7UUFFNUIsaUJBQWEsS0FBQyxRQUFNLEtBQUMsUUFBTSxLQUFDLE1BQUksS0FBQyxPQUFLO1FBQ3RDLE1BQU0sS0FBQyxNQUFNLE9BQU8sR0FBRztRQUN2QixNQUFNLE1BQU0scUJBQXFCLElBQUksSUFBSSxLQUFLO1FBRTlDLEtBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxJQUFJOzs7O1dBbER6Qjs7O2VBc0RGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/colorslider.kode
