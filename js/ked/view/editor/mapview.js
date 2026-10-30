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
        this["setColors"] = this["setColors"].bind(this)
        this["getColors"] = this["getColors"].bind(this)
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
        this.colors = null
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

    mapview.prototype["getColors"] = function ()
    {
        var _86_26_

        return ((_86_26_=this.colors) != null ? _86_26_ : this.state.s.colors)
    }

    mapview.prototype["setColors"] = function (colors)
    {
        this.colors = colors
        return this.redraw = true
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
        var bg, bgSpans, ch, charPixels, classes, clss, colors, customColor, f, fgSpans, maxX, rgb, w, x, _200_57_, _201_57_

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
        colors = this.getColors()
        if ((colors != null))
        {
            fgSpans = colorspans.spansForLine((((_200_57_=colors.fg) != null ? _200_57_ : [])),y)
            bgSpans = colorspans.spansForLine((((_201_57_=colors.bg) != null ? _201_57_ : [])),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsV0FBUjtPQUFhLGFBQWI7O09BQ1EsWUFBVDtPQUFlLFlBQWY7O09BQ1ksaUJBQVA7O09BQ0ksV0FBWjs7O0FBRUUsV0FBVDs7d0JBQXlCO2FBRXJCLFNBQUcsUUFBUTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBRUEsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUU5QixLQUFDLFNBQVMsS0FBSyxNQUFNLE9BQU87UUFFNUIsS0FBQyxRQUFTLEtBQUssS0FBSyxLQUFDLE1BQU0sUUFBUTtRQUFDO1FBQ3BDLEtBQUMsWUFBYTtRQUNkLEtBQUM7UUFDRCxLQUFDLE1BQU0sT0FBTztRQUNkLEtBQUMsU0FBYTtRQUVkLEtBQUM7UUFDRCxLQUFDLGVBQWU7UUFDaEIsS0FBQyxlQUFlOzs7dUJBUXBCOztRQUVJLEtBQUM7ZUFDRCxLQUFDOzs7dUJBRUw7Ozs7O3VCQUlBOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDLE1BQU0sT0FBTyxFQUFFLGtCQUFrQixLQUFDLE9BQU8sR0FBRyxLQUFDOzs7O3VCQUlsRDs7OztzQkFFZ0IsS0FBQzs7OztZQUVWLFFBQVEsSUFBSSxTQUFROztZQUNuQixLQUFDLE1BQU0sT0FBTyxFQUFFLG9CQUFvQixLQUFDLE9BQU8sR0FBRyxLQUFDOzs7O2dDQUV0QyxLQUFDOzs7Z0JBQVA7Z0JBQ0EsS0FBQyxNQUFNLE9BQU8sRUFBRSxZQUFZOzs7ZUFFcEMsS0FBQzs7O3VCQUVMLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1FBRVYsVUFBVSxNQUFLLEtBQUMsTUFBTSxLQUFLLE1BQUssS0FBQyxNQUFNLEtBQUssTUFBSyxLQUFDLE1BQU0sUUFBUSxNQUFLLEtBQUMsTUFBTTsyQ0FDdEUsRUFBRSxFQUFFLEVBQUU7WUFFTixLQUFDOzs7O1lBRUosS0FBQyxVQUFVOztnQkFDUyxLQUFDOztnQkFBcEIsS0FBQzs7bUJBQ00sS0FBQzttQkFDUixLQUFDOzs7O3VCQUVUOztlQUFjLEtBQUM7Ozt1QkFDZjs7ZUFBYyxLQUFDOzs7dUJBQ2Y7Ozs7eUJBQWMsS0FBQyw0QkFBUyxLQUFDLE1BQU0sRUFBRTs7O3VCQUVqQyx3QkFBVzs7UUFFUCxLQUFDLFNBQVM7ZUFDVixLQUFDLFNBQVM7Ozt1QkFFZCw2QkFBZ0IsS0FBSzs7UUFBRDs7UUFFaEIsS0FBQyxhQUFhO1FBQ2QsS0FBQyxPQUFPLE9BQU87UUFDZixLQUFDLE9BQU8sU0FBUyxLQUFDO2VBRWxCLEtBQUMsU0FBUzs7O3VCQVFkOztnQkFBb0IsS0FBQyxNQUFNLE9BQUssS0FBQyxhQUFhLEtBQUMsSUFBSSxLQUFLLEtBQUM7Ozt1QkFFekQ7Ozs7UUFFSSxJQUFJLEtBQUMsTUFBTSxPQUFPO3NCQUNOLEVBQUU7Ozs7UUFFZCxLQUFDLE1BQU0sRUFBRTtRQUVULEtBQUM7UUFJRCxJQUFJLEtBQUMsTUFBTSxPQUFPLEtBQUMsSUFBSTtRQUN2QixRQUFRLElBQUU7WUFFSixTQUFTOzs7O1FBRWYsUUFBUSxLQUFDO1FBRVQsT0FBUSxPQUFPLE1BQU07UUFFckIsT0FBUSxLQUFDOzRCQUVLO2FBQUw7O1lBQUw7WUFFQSxLQUFDLGFBQWEsS0FBSyxLQUFLO1lBQ3hCLEtBQUssS0FBQyxRQUFNO1lBQ1osS0FBQyxPQUFPLEtBQUs7WUFDYixFQUFFLGNBQWMsS0FBSyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUk7O2dCQUFiOzs7Ozt1QkFVUjs7OztRQUVJLE1BQU0sS0FBQyxNQUFNLE9BQU8sRUFBRTtzQkFFVjs7OztRQUVaLElBQUksS0FBQyxNQUFNLE9BQU8sSUFBSTtRQUN0QixRQUFRLElBQUU7WUFFSixTQUFTOzs7O2VBRWYsT0FBTyxNQUFNOzs7dUJBRWpCLHlCQUFZLEdBQUU7Ozs7UUFFVixRQUFBLGVBQUEsT0FBUSxLQUFDO3NCQUNHOzs7O1FBQ1osS0FBSyxLQUFDLFFBQU07UUFDWixLQUFDLGFBQWEsS0FBSyxLQUFDLFdBQVcsR0FBRztRQUNsQyxJQUFJLEtBQUMsTUFBTSxPQUFPO1FBQ2xCLEVBQUUsWUFBWTtRQUNkLEVBQUUsY0FBYyxLQUFLLEdBQUcsS0FBSyxTQUFPLEVBQUU7ZUFDdEMsRUFBRSxlQUFlLEdBQUcsS0FBQyxNQUFNLEVBQUUsS0FBQyxNQUFNLElBQUUsS0FBQyxVQUFVLElBQUUsS0FBQyxhQUFhLEtBQUM7Ozt1QkFFdEUsNkJBQWdCOzs7O1lBRVQsT0FBTyxLQUFDOzsyQkFFSCxLQUFNLFNBQUksS0FBQyxNQUFNLEVBQUUsTUFBTSwyQkFBZixLQUFDLE1BQU0sRUFBRSxNQUFNLGNBQWYsS0FBQyxNQUFNLEVBQUUsTUFBTTs7Z0JBQ3pCLEtBQUMsV0FBVyxHQUFHOzs7ZUFFakIsS0FBQyxPQUFPLFNBQVMsS0FBQyxNQUFNLEVBQUUsTUFBTTs7WUFDbEMsS0FBQyxNQUFNLE9BQU8sRUFBRSxZQUFZLEtBQUMsT0FBTzs7Ozt1QkFFNUMsMkJBQWMsTUFBSyxNQUFLLEdBQUU7Ozs7UUFFdEIsd0JBQWEsR0FBRTs7OzsyQkFFUCxLQUFNLFNBQUcsS0FBQyxrQ0FBRCxLQUFDLHFCQUFELEtBQUM7O2dCQUNWLE1BQU0sSUFBRSxLQUFDLGVBQWEsTUFBSSxJQUFFLEtBQUssSUFBSTtnQkFDckMsTUFBTSxJQUFFLEtBQUMsZUFBYSxNQUFJLElBQUUsS0FBSyxJQUFJO2dCQUNyQyxNQUFNLElBQUUsS0FBQyxlQUFhLE1BQUksSUFBRSxLQUFLLElBQUk7OztRQUU3QyxJQUFTLEtBQUssU0FBUztRQUN2QixPQUFTLElBQUUsS0FBQztRQUNaLFNBQVMsS0FBQztRQUNWLFVBQVUsT0FBTyxXQUFXO1FBRTVCO1FBQ0E7UUFDQSxTQUFVLEtBQUM7YUFFUjs7WUFDQyxVQUFVLFdBQVcseUJBQWMsT0FBTyw4QkFBUztZQUNuRCxVQUFVLFdBQVcseUJBQWMsT0FBTyw4QkFBUzs7UUFFdkQsd0JBQWUsT0FBTSxHQUFFOzs7O2dDQUNQOzs7Z0JBQVI7cUJBQ0csS0FBSyxNQUFNLEtBQUEsSUFBSSxLQUFLOzsyQkFDaEIsTUFBTSxPQUFPLEtBQUs7OzttQkFDN0I7O3VCQUVBLElBQUssU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztnQkFFTCxJQUFJOztnQkFBYjs7WUFFQSxLQUFLLEtBQUs7MkJBRUQsT0FBTyxPQUFNOztnQkFFbEIsSUFBSTtnQkFDSixPQUFPLFFBQVE7Z0JBQ2YsUUFBQSxlQUFBLE9BQVE7MkJBQ0wsR0FBTTs7K0JBQ0YsU0FBWTs7d0JBQ1gsSUFBSTs7O2dCQUNaLE1BQU0sT0FBTyxTQUFTLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLGNBQUs7O3FDQUFZLEVBQUUsYUFBUSxJQUFFOztnQkFDdkMsTUFBTSxZQUFZLFFBQVEsRUFBRTtnQkFFNUIsV0FBVyxFQUFFOzs7O2dCQUViLEtBQUssWUFBWSxRQUFRLEVBQUUsS0FBQyxNQUFNO2dCQUNsQyxXQUFXLEVBQUU7Ozt1QkFFakIsSUFBSyxLQUFLLGVBQVMseUJBQUEsV0FBQTs7WUFDbkIsS0FBSyxZQUFZLFFBQVEsRUFBRSxLQUFDLE1BQU07WUFDbEMsV0FBVyxFQUFFOzs7O3VCQVFyQjs7OztRQUVJLElBQUksS0FBQyxNQUFNLE9BQU87c0JBRU4sRUFBRSxXQUFVLEtBQUMsWUFBWSxLQUFDOzs7OzRCQUkxQixLQUFDO2FBQU47O1lBQUg7WUFDQSxFQUFFLGVBQWUsR0FBRyxLQUFDLE1BQU0sRUFBRSxLQUFDLE1BQU0sSUFBRSxLQUFDLFVBQVUsSUFBRSxLQUFDLGFBQWEsS0FBQzs7ZUFDdEU7Ozt1QkFFSjs7WUFFVSxLQUFDLFlBQVksS0FBQzs7OztRQUlwQixLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsS0FBQyxNQUFNLE9BQUssRUFBRSxLQUFDLE1BQU0sT0FBSyxFQUFFLElBQUksS0FBSyxLQUFDLE1BQU07ZUFFakUsS0FBQzs7O1dBblBBOzs7ZUFxUEYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapview.kode
