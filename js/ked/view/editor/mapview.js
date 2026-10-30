var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapview

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import colorspans from "../../edit/tool/colorspans.js"

import view from "../base/view.js"


mapview = (function ()
{
    _k_.extend(mapview, view)
    function mapview (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["imageForLine"] = this["imageForLine"].bind(this)
        this["updateFromLine"] = this["updateFromLine"].bind(this)
        this["updateLine"] = this["updateLine"].bind(this)
        this["lineData"] = this["lineData"].bind(this)
        this["createImages"] = this["createImages"].bind(this)
        this["maxLinesToLoad"] = this["maxLinesToLoad"].bind(this)
        this["setSyntaxSegls"] = this["setSyntaxSegls"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["reload"] = this["reload"].bind(this)
        mapview.__super__.constructor.call(this,screen,this.state.owner() + '.mapview')
        this.setColor('bg',theme.quicky.bg)
        this.imgId = kstr.hash(this.state.name) & ~
        0xffff
        this.rowOffset = 0
        this.images = []
        this.cells.cols = 12
        this.csz = []
        this.pixelsPerRow = 4
        this.pixelsPerCol = 2
    }

    mapview.prototype["reload"] = function ()
    {
        this.createImages()
        return this.drawImages()
    }

    mapview.prototype["show"] = function ()
    {
        return mapview.__super__.show.call(this)
    }

    mapview.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.screen.t.hideImagesInRange(this.images[0],this.images.slice(-1)[0])
        return mapview.__super__.hide.call(this)
    }

    mapview.prototype["clearImages"] = function ()
    {
        var id

        if (_k_.empty(this.images))
        {
            return
        }
        if (process.env.TERM === 'xterm-kitty')
        {
            this.cells.screen.t.deleteImagesInRange(this.images[0],this.images.slice(-1)[0])
        }
        else
        {
            var list = _k_.list(this.images)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                id = list[_a_]
                this.cells.screen.t.deleteImage(id)
            }
        }
        return this.images = []
    }

    mapview.prototype["layout"] = function (x, y, w, h)
    {
        var resized

        resized = x !== this.cells.x || y !== this.cells.y || w !== this.cells.cols || h !== this.cells.rows
        mapview.__super__.layout.call(this,x,y,w,h)
        if (this.hidden())
        {
            return
        }
        if (this.redraw || resized)
        {
            if (this.redraw)
            {
                this.createImages()
            }
            delete this.redraw
            return this.drawImages()
        }
    }

    mapview.prototype["getSegls"] = function ()
    {
        return this.segls
    }

    mapview.prototype["getSyntax"] = function ()
    {
        return this.syntax
    }

    mapview.prototype["setSyntaxSegls"] = function (ext, segls)
    {
        this.segls = segls
    
        this.syntax = new syntax
        this.syntax.setExt(ext)
        this.syntax.setSegls(this.segls)
        return this.redraw = true
    }

    mapview.prototype["maxLinesToLoad"] = function ()
    {
        return (this.cells.rows - this.rowOffset) * this.csz[1] / this.pixelsPerRow
    }

    mapview.prototype["createImages"] = function ()
    {
        var bytes, data, id, line, lines, maxY, t, w, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        this.csz = t.cellsz
        this.clearImages()
        w = this.cells.cols * this.csz[0]
        bytes = w * 3
        if (bytes <= 0)
        {
            return
        }
        lines = this.getSegls()
        data = Buffer.alloc(bytes)
        maxY = this.maxLinesToLoad()
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            this.imageForLine(data,line,y)
            id = this.imgId + y
            this.images.push(id)
            t.sendImageData(data,id,w,1)
            if (y > maxY)
            {
                break
            }
        }
    }

    mapview.prototype["lineData"] = function ()
    {
        var bytes, csz, w

        csz = this.cells.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        w = this.cells.cols * csz[0]
        bytes = w * 3
        if (bytes <= 0)
        {
            return
        }
        return Buffer.alloc(bytes)
    }

    mapview.prototype["updateLine"] = function (y, data)
    {
        var id, t

        data = (data != null ? data : this.lineData())
        if (_k_.empty(data))
        {
            return
        }
        id = this.imgId + y
        this.imageForLine(data,this.getSegls()[y],y)
        t = this.cells.screen.t
        t.deleteImage(id)
        t.sendImageData(data,id,data.length / 3,1)
        return t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,y * this.pixelsPerRow,this.pixelsPerRow)
    }

    mapview.prototype["updateFromLine"] = function (y)
    {
        var data, li

        if (data = this.lineData())
        {
            for (var _a_ = li = y, _b_ = this.state.s.lines.length; (_a_ <= _b_ ? li < this.state.s.lines.length : li > this.state.s.lines.length); (_a_ <= _b_ ? ++li : --li))
            {
                this.updateLine(li,data)
            }
        }
        while (this.images.length > this.state.s.lines.length)
        {
            this.cells.screen.t.deleteImage(this.images.pop())
        }
    }

    mapview.prototype["imageForLine"] = function (data, line, y, syntax)
    {
        var bg, bgSpans, ch, charPixels, classes, clss, colors, customColor, f, fgSpans, maxX, rgb, w, x, _192_57_, _193_57_

        charPixels = (function (x, rgb)
        {
            var xr

            for (var _a_ = xr = 0, _b_ = this.pixelsPerCol; (_a_ <= _b_ ? xr <= this.pixelsPerCol : xr >= this.pixelsPerCol); (_a_ <= _b_ ? ++xr : --xr))
            {
                data[(x * this.pixelsPerCol + xr) * 3 + 0] = rgb[0]
                data[(x * this.pixelsPerCol + xr) * 3 + 1] = rgb[1]
                data[(x * this.pixelsPerCol + xr) * 3 + 2] = rgb[2]
            }
        }).bind(this)
        w = data.length / 3
        maxX = w / this.pixelsPerCol
        syntax = this.getSyntax()
        classes = syntax.getClasses(y)
        fgSpans = []
        bgSpans = []
        colors = this.state.s.colors
        if ((colors != null))
        {
            fgSpans = colorspans.spansForLine((((_192_57_=colors.fg) != null ? _192_57_ : [])),y)
            bgSpans = colorspans.spansForLine((((_193_57_=colors.bg) != null ? _193_57_ : [])),y)
        }
        customColor = function (spans, x, fallback)
        {
            var span

            var list = _k_.list(spans)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                span = list[_c_]
                if ((span[0] <= x && x < span[1]))
                {
                    return color.values(span[2])
                }
            }
            return fallback
        }
        for (var _d_ = x = 0, _e_ = line.length; (_d_ <= _e_ ? x < line.length : x > line.length); (_d_ <= _e_ ? ++x : --x))
        {
            if (x > maxX)
            {
                break
            }
            ch = line[x]
            if (!_k_.empty(ch) && ch !== ' ')
            {
                f = 0.7
                clss = classes[x]
                clss = (clss != null ? clss : 'text')
                if (_k_.in(ch,'0█'))
                {
                    if (_k_.in('header',clss))
                    {
                        f = 2.0
                    }
                }
                rgb = syntax.getColor(x,y,clss)
                rgb = rgb.map(function (v)
                {
                    return _k_.clamp(0,255,parseInt(f * v))
                })
                rgb = customColor(fgSpans,x,rgb)
                charPixels(x,rgb)
            }
            else
            {
                bg = customColor(bgSpans,x,this.color.bg)
                charPixels(x,bg)
            }
        }
        for (var _f_ = x = line.length, _10_ = maxX; (_f_ <= _10_ ? x < maxX : x > maxX); (_f_ <= _10_ ? ++x : --x))
        {
            bg = customColor(bgSpans,x,this.color.bg)
            charPixels(x,bg)
        }
    }

    mapview.prototype["drawImages"] = function ()
    {
        var id, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        var list = _k_.list(this.images)
        for (y = 0; y < list.length; y++)
        {
            id = list[y]
            t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,y * this.pixelsPerRow,this.pixelsPerRow)
        }
        return this
    }

    mapview.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,this.cells.cols - 1,this.cells.rows - 1,' ',null,this.color.bg)
        return this.drawImages()
    }

    return mapview
})()

export default mapview;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsV0FBUjtPQUFhLGFBQWI7O09BQ1EsWUFBVDtPQUFlLFlBQWY7O09BQ1ksaUJBQVA7O09BQ0ksV0FBWjs7O0FBRUUsV0FBVDs7d0JBQXlCO2FBRXJCLFNBQUcsUUFBUTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUVBLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFOUIsS0FBQyxTQUFTLEtBQUssTUFBTSxPQUFPO1FBRTVCLEtBQUMsUUFBUyxLQUFLLEtBQUssS0FBQyxNQUFNLFFBQVE7UUFBQztRQUNwQyxLQUFDLFlBQWE7UUFDZCxLQUFDO1FBQ0QsS0FBQyxNQUFNLE9BQU87UUFFZCxLQUFDO1FBQ0QsS0FBQyxlQUFlO1FBQ2hCLEtBQUMsZUFBZTs7O3VCQVFwQjs7UUFFSSxLQUFDO2VBQ0QsS0FBQzs7O3VCQUVMOzs7Ozt1QkFJQTs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQyxNQUFNLE9BQU8sRUFBRSxrQkFBa0IsS0FBQyxPQUFPLEdBQUcsS0FBQzs7Ozt1QkFJbEQ7Ozs7c0JBRWdCLEtBQUM7Ozs7WUFFVixRQUFRLElBQUksU0FBUTs7WUFDbkIsS0FBQyxNQUFNLE9BQU8sRUFBRSxvQkFBb0IsS0FBQyxPQUFPLEdBQUcsS0FBQzs7OztnQ0FFdEMsS0FBQzs7O2dCQUFQO2dCQUNBLEtBQUMsTUFBTSxPQUFPLEVBQUUsWUFBWTs7O2VBRXBDLEtBQUM7Ozt1QkFFTCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7OztRQUVWLFVBQVUsTUFBSyxLQUFDLE1BQU0sS0FBSyxNQUFLLEtBQUMsTUFBTSxLQUFLLE1BQUssS0FBQyxNQUFNLFFBQVEsTUFBSyxLQUFDLE1BQU07MkNBQ3RFLEVBQUUsRUFBRSxFQUFFO1lBRU4sS0FBQzs7OztZQUVKLEtBQUMsVUFBVTs7Z0JBQ1Ms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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapview.kode
