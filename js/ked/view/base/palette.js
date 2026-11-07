var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var palette

import color from "../../theme/color.js"

import radio from "./radio.js"


palette = (function ()
{
    _k_.extend(palette, radio)
    function palette (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["drawCell"] = this["drawCell"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["setColors"] = this["setColors"].bind(this)
        palette.__super__.constructor.call(this,this.screen,this.name)
        this.setFocusable()
    }

    palette.prototype["setColors"] = function (hexes)
    {
        var hex, rgb

        this.options = []
        var list = _k_.list(hexes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hex = list[_a_]
            rgb = color.values(hex)
            if ((rgb != null))
            {
                this.options.push({color:rgb,label:hex})
            }
        }
        if (_k_.empty(this.options))
        {
            this.active = 0
            return
        }
    }

    palette.prototype["draw"] = function ()
    {
        var ends, idx, n, starts, w, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        w = this.cells.cols
        if (w < 1)
        {
            return
        }
        n = this.options.length
        if (n < 1)
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        starts = []
        ends = []
        for (var _a_ = idx = 0, _b_ = n; (_a_ <= _b_ ? idx < n : idx > n); (_a_ <= _b_ ? ++idx : --idx))
        {
            starts.push(parseInt(idx * w / n))
            ends.push(parseInt((idx + 1) * w / n))
            for (var _c_ = x = starts[idx], _d_ = ends[idx]; (_c_ <= _d_ ? x < ends[idx] : x > ends[idx]); (_c_ <= _d_ ? ++x : --x))
            {
                this.cells.set_bg(x,0,this.options[idx].color)
            }
        }
        this.cells.set(0,0,'◖',this.options[0].color,this.color.bg)
        for (var _e_ = idx = 0, _f_ = n; (_e_ <= _f_ ? idx < n : idx > n); (_e_ <= _f_ ? ++idx : --idx))
        {
            this.drawCell(idx,starts[idx],ends[idx] - starts[idx])
        }
        return this.cells.set(w - 1,0,'◗',this.options.slice(-1)[0].color,this.color.bg)
    }

    palette.prototype["drawCell"] = function (idx, start, segw)
    {
        var fg, x

        if (this.focused && idx === this.active)
        {
            fg = color.subtle(this.options[idx].color,35)
            x = start + _k_.max(0,parseInt((segw - 1) / 2))
            return this.cells.set(x,0,'●',fg,this.options[idx].color)
        }
    }

    return palette
})()

export default palette;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3BhbGV0dGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNrQixZQUFSOztPQUNRLFlBQUE7OztBQUNqQixXQUFEOzt3QkFBUzthQUdMLFNBQUksUUFBUTs7UUFBVDtRQUFROzs7OztnREFFRCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUM7Ozt1QkFFTCx3QkFBVzs7OztRQUVQLEtBQUM7NEJBRVU7OztZQUFQO1lBQ0EsTUFBTSxNQUFNLE9BQU87aUJBQ3NCOztnQkFBekMsS0FBQyxRQUFRLE1BQU0sTUFBTyxJQUFJLE1BQU87OztzQkFFNUIsS0FBQzs7WUFDTixLQUFDLFNBQVU7Ozs7O3VCQUduQjs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLElBQUksS0FBQyxNQUFNO1lBQ04sSUFBSTs7OztRQUVULElBQUksS0FBQyxRQUFRO1lBQ1IsSUFBSTs7OztRQUVULEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUMsTUFBTTtRQUUzQztRQUNBO3VCQUVJLE1BQU8sU0FBSSx1QkFBQSxVQUFBOztZQUNYLE9BQU8sY0FBUyxNQUFJLElBQUU7WUFDdEIsS0FBSyxlQUFZLE1BQUksS0FBRyxJQUFFOzJCQUN0QixJQUFLLE9BQU8sWUFBTyxLQUFLLHdCQUFMLEtBQUssV0FBTCxLQUFLOztnQkFDeEIsS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEtBQUMsUUFBUSxLQUFLOzs7UUFFeEMsS0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLElBQUksS0FBQyxRQUFRLEdBQUcsTUFBTyxLQUFDLE1BQU07dUJBRXpDLE1BQU8sU0FBSSx1QkFBQSxVQUFBOztZQUNYLEtBQUMsU0FBUyxJQUFJLE9BQU8sS0FBSyxLQUFLLE9BQUssT0FBTzs7ZUFFL0MsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFDLHFCQUFZLE1BQU0sS0FBQyxNQUFNOzs7dUJBRW5ELHVCQUFVLEtBQUksT0FBTTs7OztZQUViLEtBQUMsV0FBWSxRQUFPLEtBQUM7O1lBQ3BCLEtBQUssTUFBTSxPQUFPLEtBQUMsUUFBUSxLQUFLLE1BQU07WUFDdEMsSUFBSSxnQkFBWSxZQUFPLE9BQU8sS0FBRzttQkFDakMsS0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLElBQUksR0FBRyxLQUFDLFFBQVEsS0FBSzs7OztXQXREL0M7OztlQXdETSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/palette.kode
