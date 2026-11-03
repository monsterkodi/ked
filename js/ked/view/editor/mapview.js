var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapview

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import glyphs from "../../util/img/glyphs.js"

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
        this.textScale = 2
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
        var _88_26_

        return ((_88_26_=this.colors) != null ? _88_26_ : this.state.s.colors)
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
        var data, h, id, line, lines, maxY, t, w, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        this.csz = t.cellsz
        this.clearImages()
        w = this.cells.cols * this.csz[0]
        if (w <= 0)
        {
            return
        }
        lines = this.getSegls()
        maxY = this.maxLinesToLoad()
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            h = this.imageHeight(y)
            data = Buffer.alloc(w * h * 3)
            this.imageForLine(data,line,y,h)
            id = this.imgId + y
            this.images.push(id)
            t.sendImageData(data,id,w,h)
            if (y > maxY)
            {
                break
            }
        }
    }

    mapview.prototype["lineData"] = function (y)
    {
        var bytes, csz, w

        csz = this.cells.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        w = this.cells.cols * csz[0]
        bytes = w * this.imageHeight(y) * 3
        if (bytes <= 0)
        {
            return
        }
        return Buffer.alloc(bytes)
    }

    mapview.prototype["lineRows"] = function (y)
    {
        return 1
    }

    mapview.prototype["textLine"] = function (y)
    {
        return this.lineRows(y) >= this.textScale && glyphs.hasScale(this.lineRows(y))
    }

    mapview.prototype["imageHeight"] = function (y)
    {
        return (this.textLine(y) ? this.lineRows(y) * this.pixelsPerRow : 1)
    }

    mapview.prototype["lineOffsetPixels"] = function (y)
    {
        return y * this.pixelsPerRow
    }

    mapview.prototype["updateLine"] = function (y, data)
    {
        var csz, h, id, py, rh, t, w

        data = (data != null ? data : this.lineData(y))
        if (_k_.empty(data))
        {
            return
        }
        csz = this.cells.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        this.csz = csz
        id = this.imgId + y
        h = this.imageHeight(y)
        this.imageForLine(data,this.getSegls()[y],y,h)
        w = parseInt(data.length / (3 * h))
        t = this.cells.screen.t
        t.deleteImage(id)
        t.sendImageData(data,id,w,h)
        py = this.lineOffsetPixels(y)
        rh = this.lineRows(y) * this.pixelsPerRow
        if (py >= 0 && py + rh <= this.cells.rows * csz[1])
        {
            if (this.textLine(y))
            {
                return t.placeImageSlice(id,this.cells.x,this.cells.y + this.rowOffset,py,0,rh,w)
            }
            else
            {
                return t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,py,rh)
            }
        }
    }

    mapview.prototype["updateFromLine"] = function (y)
    {
        var li

        for (var _a_ = li = y, _b_ = this.state.s.lines.length; (_a_ <= _b_ ? li < this.state.s.lines.length : li > this.state.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            this.updateLine(li)
        }
        while (this.images.length > this.state.s.lines.length)
        {
            this.cells.screen.t.deleteImage(this.images.pop())
        }
    }

    mapview.prototype["imageForLine"] = function (data, line, y, h)
    {
        var a, base, bg, bgSpans, ch, classes, clss, colors, cov, customColor, f, fg, fgSpans, hgt, i, mask, masks, maxX, px, py, scale, stride, syntax, w, x, _218_57_, _219_57_

        scale = this.lineRows(y)
        stride = this.pixelsPerCol * scale
        hgt = (h != null ? h : this.imageHeight(y))
        w = parseInt(data.length / (3 * hgt))
        maxX = parseInt(w / stride)
        syntax = this.getSyntax()
        classes = syntax.getClasses(y)
        fgSpans = []
        bgSpans = []
        colors = this.getColors()
        if ((colors != null))
        {
            fgSpans = colorspans.spansForLine((((_218_57_=colors.fg) != null ? _218_57_ : [])),y)
            bgSpans = colorspans.spansForLine((((_219_57_=colors.bg) != null ? _219_57_ : [])),y)
        }
        customColor = function (spans, x, fallback)
        {
            var span

            var list = _k_.list(spans)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                if ((span[0] <= x && x < span[1]))
                {
                    return color.values(span[2])
                }
            }
            return fallback
        }
        base = this.color.bg
        for (var _b_ = i = 0, _c_ = (w * hgt); (_b_ <= _c_ ? i < (w * hgt) : i > (w * hgt)); (_b_ <= _c_ ? ++i : --i))
        {
            data[i * 3 + 0] = base[0]
            data[i * 3 + 1] = base[1]
            data[i * 3 + 2] = base[2]
        }
        masks = (this.textLine(y) ? glyphs.forScale(scale) : null)
        for (var _d_ = x = 0, _e_ = maxX; (_d_ <= _e_ ? x < maxX : x > maxX); (_d_ <= _e_ ? ++x : --x))
        {
            ch = line[x]
            bg = customColor(bgSpans,x,base)
            for (var _f_ = py = 0, _10_ = hgt; (_f_ <= _10_ ? py < hgt : py > hgt); (_f_ <= _10_ ? ++py : --py))
            {
                for (var _11_ = px = 0, _12_ = stride; (_11_ <= _12_ ? px < stride : px > stride); (_11_ <= _12_ ? ++px : --px))
                {
                    i = ((py * w) + (x * stride + px)) * 3
                    data[i + 0] = bg[0]
                    data[i + 1] = bg[1]
                    data[i + 2] = bg[2]
                }
            }
            if (!!_k_.empty(ch) || ch === ' ')
            {
                continue
            }
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
            fg = syntax.getColor(x,y,clss)
            fg = fg.map(function (v)
            {
                return _k_.clamp(0,255,parseInt(f * v))
            })
            fg = customColor(fgSpans,x,fg)
            mask = (masks != null ? masks[ch] : undefined)
            if ((mask != null))
            {
                for (var _13_ = py = 0, _14_ = hgt; (_13_ <= _14_ ? py < hgt : py > hgt); (_13_ <= _14_ ? ++py : --py))
                {
                    for (var _15_ = px = 0, _16_ = stride; (_15_ <= _16_ ? px < stride : px > stride); (_15_ <= _16_ ? ++px : --px))
                    {
                        cov = mask[py * stride + px]
                        if (cov === 0)
                        {
                            continue
                        }
                        i = ((py * w) + (x * stride + px)) * 3
                        if (cov === 255)
                        {
                            data[i + 0] = fg[0]
                            data[i + 1] = fg[1]
                            data[i + 2] = fg[2]
                        }
                        else
                        {
                            a = cov / 255
                            data[i + 0] = parseInt(fg[0] * a + bg[0] * (1 - a))
                            data[i + 1] = parseInt(fg[1] * a + bg[1] * (1 - a))
                            data[i + 2] = parseInt(fg[2] * a + bg[2] * (1 - a))
                        }
                    }
                }
            }
            else
            {
                for (var _17_ = py = 0, _18_ = hgt; (_17_ <= _18_ ? py < hgt : py > hgt); (_17_ <= _18_ ? ++py : --py))
                {
                    for (var _19_ = px = 0, _1a_ = stride; (_19_ <= _1a_ ? px < stride : px > stride); (_19_ <= _1a_ ? ++px : --px))
                    {
                        i = ((py * w) + (x * stride + px)) * 3
                        data[i + 0] = fg[0]
                        data[i + 1] = fg[1]
                        data[i + 2] = fg[2]
                    }
                }
            }
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
            t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,(this.lineOffsetPixels(y)),(this.lineRows(y) * this.pixelsPerRow))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsV0FBUjtPQUFhLGFBQWI7O09BQ1UsYUFBQTs7T0FDRixZQUFUO09BQWUsWUFBZjs7T0FDWSxpQkFBUDs7T0FDSSxXQUFaOzs7QUFFRSxXQUFUOzt3QkFBeUI7YUFFckIsU0FBRyxRQUFROztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUVBLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFOUIsS0FBQyxTQUFTLEtBQUssTUFBTSxPQUFPO1FBRTVCLEtBQUMsUUFBUyxLQUFLLEtBQUssS0FBQyxNQUFNLFFBQVE7UUFBQztRQUNwQyxLQUFDLFlBQWE7UUFDZCxLQUFDO1FBQ0QsS0FBQyxNQUFNLE9BQU87UUFDZCxLQUFDLFNBQWE7UUFFZCxLQUFDO1FBQ0QsS0FBQyxlQUFlO1FBQ2hCLEtBQUMsZUFBZTtRQUNoQixLQUFDLFlBQWU7Ozt1QkFRcEI7O1FBRUksS0FBQztlQUNELEtBQUM7Ozt1QkFFTDs7Ozs7dUJBSUE7O1lBRVUsS0FBQzs7OztRQUVQLEtBQUMsTUFBTSxPQUFPLEVBQUUsa0JBQWtCLEtBQUMsT0FBTyxHQUFHLEtBQUM7Ozs7dUJBSWxEOzs7O3NCQUVnQixLQUFDOzs7O1lBRVYsUUFBUSxJQUFJLFNBQVE7O1lBQ25CLEtBQUMsTUFBTSxPQUFPLEVBQUUsb0JBQW9CLEtBQUMsT0FBTyxHQUFHLEtBQUM7Ozs7Z0NBRXRDLEtBQUM7OztnQkFBUDtnQkFDQSxLQUFDLE1BQU0sT0FBTyxFQUFFLFlBQVk7OztlQUVwQyxLQUFDOzs7dUJBRUwscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixVQUFVLE1BQUssS0FBQyxNQUFNLEtBQUssTUFBSyxLQUFDLE1BQU0sS0FBSyxNQUFLLEtBQUMsTUFBTSxRQUFRLE1BQUssS0FBQyxNQUFNOzJDQUN0RSxFQUFFLEVBQUUsRUFBRTtZQUVOLEtBQUM7Ozs7WUFFSixLQUFDLFVBQVU7O2dCQUNTLEtBQUM7O2dCQUFwQixLQUFDOzttQkFDTSxLQUFDO21CQUNSLEtBQUM7Ozs7dUJBRVQ7O2VBQWMsS0FBQzs7O3VCQUNmOztlQUFjLEtBQUM7Ozt1QkFDZjs7Ozt5QkFBYyxLQUFDLDRCQUFTLEtBQUMsTUFBTSxFQUFFOzs7dUJBRWpDLHdCQUFXOztRQUVQLEtBQUMsU0FBUztlQUNWLEtBQUMsU0FBUzs7O3VCQUVkLDZCQUFnQixLQUFLOztRQUFEOztRQUVoQixLQUFDLGFBQWE7UUFDZCxLQUFDLE9BQU8sT0FBTztRQUNmLEtBQUMsT0FBTyxTQUFTLEtBQUM7ZUFFbEIsS0FBQyxTQUFTOzs7dUJBUWQ7O2dCQUFvQixLQUFDLE1BQU0sT0FBSyxLQUFDLGFBQWEsS0FBQyxJQUFJLEtBQUssS0FBQzs7O3VCQUV6RDs7OztRQUVJLElBQUksS0FBQyxNQUFNLE9BQU87c0JBQ04sRUFBRTs7OztRQUVkLEtBQUMsTUFBTSxFQUFFO1FBRVQsS0FBQztRQUlELElBQUksS0FBQyxNQUFNLE9BQU8sS0FBQyxJQUFJO1lBRWpCLEtBQUs7Ozs7UUFFWCxRQUFRLEtBQUM7UUFDVCxPQUFRLEtBQUM7NEJBRUs7YUFBTDs7WUFBTDtZQUVBLElBQU8sS0FBQyxZQUFZO1lBQ3BCLE9BQU8sT0FBTyxNQUFNLElBQUUsSUFBRTtZQUV4QixLQUFDLGFBQWEsS0FBSyxLQUFLLEVBQUU7WUFDMUIsS0FBSyxLQUFDLFFBQU07WUFDWixLQUFDLE9BQU8sS0FBSztZQUNiLEVBQUUsY0FBYyxLQUFLLEdBQUcsRUFBRTtnQkFDakIsSUFBSTs7Z0JBQWI7Ozs7O3VCQVVSLHVCQUFVOzs7O1FBRU4sTUFBTSxLQUFDLE1BQU0sT0FBTyxFQUFFO3NCQUVWOzs7O1FBRVosSUFBSSxLQUFDLE1BQU0sT0FBTyxJQUFJO1FBQ3RCLFFBQVEsSUFBRSxLQUFDLFlBQVksS0FBRztZQUVwQixTQUFTOzs7O2VBRWYsT0FBTyxNQUFNOzs7dUJBRWpCLHVCQUFVOztlQUFLOzs7dUJBRWYsdUJBQVU7O2VBQUssS0FBQyxTQUFTLE1BQU0sS0FBQyxhQUFjLE9BQU8sU0FBUyxLQUFDLFNBQVM7Ozt1QkFFeEUsMEJBQWE7O2dCQUFLLEtBQUMsU0FBUyxLQUFLLEtBQUMsU0FBUyxLQUFHLEtBQUMsZUFBZTs7O3VCQUU5RCwrQkFBa0I7O2VBQUssSUFBRSxLQUFDOzs7dUJBRTFCLHlCQUFZLEdBQUU7Ozs7UUFFVixRQUFBLGVBQUEsT0FBUSxLQUFDLFNBQVM7c0JBQ047Ozs7UUFFWixNQUFNLEtBQUMsTUFBTSxPQUFPLEVBQUU7c0JBQ1Y7Ozs7UUFDWixLQUFDLE1BQU07UUFFUCxLQUFLLEtBQUMsUUFBTTtRQUNaLElBQUssS0FBQyxZQUFZO1FBQ2xCLEtBQUMsYUFBYSxLQUFLLEtBQUMsV0FBVyxHQUFHLEVBQUU7UUFDcEMsYUFBUyxLQUFLLFVBQVEsSUFBRTtRQUN4QixJQUFLLEtBQUMsTUFBTSxPQUFPO1FBQ25CLEVBQUUsWUFBWTtRQUNkLEVBQUUsY0FBYyxLQUFLLEdBQUcsRUFBRTtRQUUxQixLQUFLLEtBQUMsaUJBQWlCO1FBQ3ZCLEtBQUssS0FBQyxTQUFTLEtBQUssS0FBQztZQUVsQixNQUFNLEtBQU0sS0FBRyxNQUFNLEtBQUMsTUFBTSxPQUFLLElBQUk7O2dCQUNqQyxLQUFDLFNBQVM7O3VCQUNULEVBQUUsZ0JBQWdCLEdBQUcsS0FBQyxNQUFNLEVBQUUsS0FBQyxNQUFNLElBQUUsS0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHOzs7O3VCQUUxRCxFQUFFLGVBQWUsR0FBRyxLQUFDLE1BQU0sRUFBRSxLQUFDLE1BQU0sSUFBRSxLQUFDLFVBQVUsR0FBRzs7Ozs7dUJBRWhFLDZCQUFnQjs7Ozt1QkFFUixLQUFNLFNBQUksS0FBQyxNQUFNLEVBQUUsTUFBTSwyQkFBZixLQUFDLE1BQU0sRUFBRSxNQUFNLGNBQWYsS0FBQyxNQUFNLEVBQUUsTUFBTTs7WUFDekIsS0FBQyxXQUFXOztlQUVWLEtBQUMsT0FBTyxTQUFTLEtBQUMsTUFBTSxFQUFFLE1BQU07O1lBQ2xDLEtBQUMsTUFBTSxPQUFPLEVBQUUsWUFBWSxLQUFDLE9BQU87Ozs7dUJBRTVDLDJCQUFjLE1BQUssTUFBSyxHQUFFOzs7O1FBRXRCLFFBQVMsS0FBQyxTQUFTO1FBQ25CLFNBQVMsS0FBQyxlQUFlO1FBQ3pCLE9BQVMsWUFBQSxJQUFJLEtBQUMsWUFBWTtRQUMxQixhQUFhLEtBQUssVUFBUSxJQUFFO1FBQzVCLGdCQUFhLElBQUU7UUFDZixTQUFTLEtBQUM7UUFDVixVQUFVLE9BQU8sV0FBVztRQUU1QjtRQUNBO1FBQ0EsU0FBVSxLQUFDO2FBRVI7O1lBQ0MsVUFBVSxXQUFXLHlCQUFjLE9BQU8sOEJBQVM7WUFDbkQsVUFBVSxXQUFXLHlCQUFjLE9BQU8sOEJBQVM7O1FBRXZELHdCQUFlLE9BQU0sR0FBRTs7OztnQ0FDUDs7O2dCQUFSO3FCQUNHLEtBQUssTUFBTSxLQUFBLElBQUksS0FBSzs7MkJBQ2hCLE1BQU0sT0FBTyxLQUFLOzs7bUJBQzdCOztRQUVKLE9BQU8sS0FBQyxNQUFNO3VCQUVWLElBQUssVUFBSyxJQUFFLHlCQUFGLElBQUUsWUFBRixJQUFFOztZQUNaLEtBQUssSUFBRSxJQUFFLEtBQUssS0FBSztZQUNuQixLQUFLLElBQUUsSUFBRSxLQUFLLEtBQUs7WUFDbkIsS0FBSyxJQUFFLElBQUUsS0FBSyxLQUFLOztRQUV2QixTQUFRLEtBQUMsU0FBUyxLQUFLLE9BQU8sU0FBUyxTQUFTO3VCQUU1QyxJQUFLLFNBQUksd0JBQUEsV0FBQTs7WUFFVCxLQUFLLEtBQUs7WUFDVixLQUFLLFlBQVksUUFBUSxFQUFFOzJCQUV2QixLQUFNLFVBQUkseUJBQUEsV0FBQTs7Z0NBQ04sS0FBTSxVQUFJLDZCQUFBLGNBQUE7O29CQUNWLE1BQU0sS0FBRyxNQUFJLElBQUUsU0FBTyxPQUFLO29CQUMzQixLQUFLLElBQUUsS0FBSyxHQUFHO29CQUNmLEtBQUssSUFBRSxLQUFLLEdBQUc7b0JBQ2YsS0FBSyxJQUFFLEtBQUssR0FBRzs7OzRCQUVELE9BQU0sT0FBTTs7Z0JBQWxDOztZQUVBLElBQUk7WUFDSixPQUFPLFFBQVE7WUFDZixRQUFBLGVBQUEsT0FBUTt1QkFDTCxHQUFNOzsyQkFDRixTQUFZOztvQkFDWCxJQUFJOzs7WUFDWixLQUFLLE9BQU8sU0FBUyxFQUFFLEVBQUU7WUFDekIsS0FBSyxHQUFHLGNBQUs7O2lDQUFZLEVBQUUsYUFBUSxJQUFFOztZQUNyQyxLQUFLLFlBQVksUUFBUSxFQUFFO1lBRTNCLFFBQU8sZ0JBQUEsTUFBTztpQkFFWDs7Z0NBQ0ssS0FBTSxVQUFJLDBCQUFBLFdBQUE7O29DQUNOLEtBQU0sVUFBSSw2QkFBQSxjQUFBOzt3QkFDVixNQUFNLEtBQUssS0FBRyxTQUFPOzRCQUNULFFBQU87OzRCQUFuQjs7d0JBQ0EsTUFBTSxLQUFHLE1BQUksSUFBRSxTQUFPLE9BQUs7NEJBQ3hCLFFBQU87OzRCQUNOLEtBQUssSUFBRSxLQUFLLEdBQUc7NEJBQ2YsS0FBSyxJQUFFLEtBQUssR0FBRzs0QkFDZixLQUFLLElBQUUsS0FBSyxHQUFHOzs7OzRCQUVmLElBQUksTUFBSTs0QkFDUixLQUFLLElBQUUsY0FBUyxHQUFHLEtBQUcsSUFBSSxHQUFHLE1BQUksSUFBRTs0QkFDbkMsS0FBSyxJQUFFLGNBQVMsR0FBRyxLQUFHLElBQUksR0FBRyxNQUFJLElBQUU7NEJBQ25DLEtBQUssSUFBRSxjQUFTLEdBQUcsS0FBRyxJQUFJLEdBQUcsTUFBSSxJQUFFOzs7Ozs7O2dDQUUzQyxLQUFNLFVBQUksMEJBQUEsV0FBQTs7b0NBQ04sS0FBTSxVQUFJLDZCQUFBLGNBQUE7O3dCQUNWLE1BQU0sS0FBRyxNQUFJLElBQUUsU0FBTyxPQUFLO3dCQUMzQixLQUFLLElBQUUsS0FBSyxHQUFHO3dCQUNmLEtBQUssSUFBRSxLQUFLLEdBQUc7d0JBQ2YsS0FBSyxJQUFFLEtBQUssR0FBRzs7Ozs7Ozt1QkFRbkM7Ozs7UUFFSSxJQUFJLEtBQUMsTUFBTSxPQUFPO3NCQUVOLEVBQUUsV0FBVSxLQUFDLFlBQVksS0FBQzs7Ozs0QkFJMUIsS0FBQzthQUFOOztZQUFIO1lBQ0EsRUFBRSxlQUFlLEdBQUcsS0FBQyxNQUFNLEVBQUUsS0FBQyxNQUFNLElBQUUsS0FBQyxXQUFXLEtBQUMsaUJBQWlCLEtBQUssS0FBQyxTQUFTLEtBQUcsS0FBQzs7ZUFDM0Y7Ozt1QkFFSjs7WUFFVSxLQUFDLFlBQVksS0FBQzs7OztRQUlwQixLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsS0FBQyxNQUFNLE9BQUssRUFBRSxLQUFDLE1BQU0sT0FBSyxFQUFFLElBQUksS0FBSyxLQUFDLE1BQU07ZUFFakUsS0FBQzs7O1dBblNBOzs7ZUFxU0YifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapview.kode
