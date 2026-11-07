var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var palette

import color from "../../theme/color.js"

import radio from "./radio.js"


palette = (function ()
{
    _k_.extend(palette, radio)
    function palette (screen, name)
    {
        this["drawCell"] = this["drawCell"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["setColors"] = this["setColors"].bind(this)
        palette.__super__.constructor.call(this,screen,name)
        this.setFocusable()
    }

    palette.prototype["setColors"] = function (hexes)
    {
        var hex, opts, rgb

        opts = []
        var list = _k_.list(hexes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            hex = list[_a_]
            rgb = color.values(hex)
            if ((rgb != null))
            {
                opts.push({color:rgb,label:hex})
            }
        }
        if (_k_.empty(opts))
        {
            this.options = []
            this.active = 0
            return
        }
        return this.setOptions(opts)
    }

    palette.prototype["draw"] = function ()
    {
        var ends, idx, n, starts, used, w, x

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
        used = []
        for (var _e_ = idx = 0, _f_ = n; (_e_ <= _f_ ? idx < n : idx > n); (_e_ <= _f_ ? ++idx : --idx))
        {
            this.drawCell(idx,starts[idx],ends[idx] - starts[idx],used)
        }
        if (w > 1)
        {
            if (!used[0])
            {
                this.cells.set(0,0,'◖',this.options[0].color,this.color.bg)
            }
            if (!used[w - 1])
            {
                return this.cells.set(w - 1,0,'◗',this.options.slice(-1)[0].color,this.color.bg)
            }
        }
    }

    palette.prototype["drawCell"] = function (idx, start, segw, used)
    {
        var candidate, ch, fg, focused, hex, i, label, pad, x, _65_34_

        hex = ((_65_34_=this.options[idx].label) != null ? _65_34_ : '')
        focused = this.focused && idx === this.active
        fg = color.adjustForBackground(this.color.fg,this.options[idx].color)
        if (focused)
        {
            fg = color.adjustForBackground([255,255,255],this.options[idx].color)
        }
        label = ''
        if (focused)
        {
            var list = ['● ' + hex + ' ●','●' + hex + '●','●' + hex]
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                candidate = list[_a_]
                if (candidate.length <= segw)
                {
                    label = candidate
                    break
                }
            }
        }
        if (_k_.empty(label) && hex.length <= segw)
        {
            label = hex
        }
        if (_k_.empty(label) && focused && segw > 0)
        {
            label = '●'
        }
        if (_k_.empty(label))
        {
            return
        }
        pad = _k_.max(0,parseInt((segw - label.length) / 2))
        x = start + pad
        var list1 = _k_.list(label)
        for (i = 0; i < list1.length; i++)
        {
            ch = list1[i]
            this.cells.set(x + i,0,ch,fg,this.options[idx].color)
            used[x + i] = true
        }
    }

    return palette
})()

export default palette;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3BhbGV0dGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNrQixZQUFSOztPQUNRLFlBQUE7OztBQUNqQixXQUFEOzt3QkFBUzthQVFMLFNBQUcsUUFBTzs7Ozs7Z0RBRUEsT0FBTztRQUViLEtBQUM7Ozt1QkFFTCx3QkFBVzs7OztRQUVQOzRCQUVXOzs7WUFBUDtZQUNBLE1BQU0sTUFBTSxPQUFPO2lCQUNrQjs7Z0JBQXJDLEtBQUssTUFBTSxNQUFPLElBQUksTUFBTzs7O3NCQUV4Qjs7WUFDTCxLQUFDO1lBQ0QsS0FBQyxTQUFVOzs7ZUFHZixLQUFDLFdBQVc7Ozt1QkFFaEI7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixJQUFJLEtBQUMsTUFBTTtZQUNOLElBQUk7Ozs7UUFFVCxJQUFJLEtBQUMsUUFBUTtZQUNSLElBQUk7Ozs7UUFFVCxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFM0M7UUFDQTt1QkFFSSxNQUFPLFNBQUksdUJBQUEsVUFBQTs7WUFDWCxPQUFPLGNBQVMsTUFBSSxJQUFFO1lBQ3RCLEtBQUssZUFBWSxNQUFJLEtBQUcsSUFBRTsyQkFDdEIsSUFBSyxPQUFPLFlBQU8sS0FBSyx3QkFBTCxLQUFLLFdBQUwsS0FBSzs7Z0JBQ3hCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFFBQVEsS0FBSzs7O1FBRXhDO3VCQUVJLE1BQU8sU0FBSSx1QkFBQSxVQUFBOztZQUNYLEtBQUMsU0FBUyxJQUFJLE9BQU8sS0FBSyxLQUFLLE9BQUssT0FBTyxLQUFLOztZQUVqRCxJQUFJOztpQkFDdUQsS0FBSzs7Z0JBQS9ELEtBQUMsTUFBTSxJQUFJLEVBQUssRUFBRSxJQUFJLEtBQUMsUUFBUSxHQUFHLE1BQU8sS0FBQyxNQUFNOztpQkFDUyxLQUFLLElBQUU7O3VCQUFoRSxLQUFDLE1BQU0sSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUMscUJBQVksTUFBTSxLQUFDLE1BQU07Ozs7O3VCQUV2RCx1QkFBVSxLQUFJLE9BQU0sTUFBSzs7OztRQUVyQixnQkFBTSxLQUFDLFFBQVEsS0FBSywyQkFBUTtRQUM1QixVQUFVLEtBQUMsV0FBWSxRQUFPLEtBQUM7UUFFL0IsS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRyxLQUFDLFFBQVEsS0FBSztZQUNhOztZQUFwRSxLQUFLLE1BQU0scUJBQXFCLElBQUksSUFBSSxLQUFLLEtBQUMsUUFBUSxLQUFLOztRQUUzRCxRQUFRO1lBRUw7O3dCQUNtQixPQUFLLE1BQUksS0FBSyxNQUFJLE1BQUksSUFBSSxNQUFJOzs7Z0JBQTVDO29CQUNHLFVBQVUsVUFBVTs7b0JBQ25CLFFBQVE7b0JBQ1I7Ozs7c0JBRUgsVUFBVSxJQUFJLFVBQVU7O1lBQzdCLFFBQVE7O3NCQUVILFVBQVUsV0FBWSxPQUFPOztZQUNsQyxRQUFROztzQkFFRDs7OztRQUVYLGNBQVUsWUFBTyxPQUFPLE1BQU0sVUFBUTtRQUN0QyxJQUFJLFFBQVE7NkJBRUM7YUFBTDs7WUFBSjtZQUNBLEtBQUMsTUFBTSxJQUFJLElBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxLQUFDLFFBQVEsS0FBSztZQUNyQyxLQUFLLElBQUUsS0FBSzs7OztXQXhGdkI7OztlQTBGTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/palette.kode
