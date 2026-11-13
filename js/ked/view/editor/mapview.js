var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapview

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"
import config from "../../util/config.js"
import scaling from "../../util/scaling.js"

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
        this.screen = screen
        this.state = state
    
        var _35_30_

        this["draw"] = this["draw"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["updateFromLine"] = this["updateFromLine"].bind(this)
        this["updateLine"] = this["updateLine"].bind(this)
        this["rowOfLine"] = this["rowOfLine"].bind(this)
        this["rowPrefix"] = this["rowPrefix"].bind(this)
        this["lineRows"] = this["lineRows"].bind(this)
        this["lineData"] = this["lineData"].bind(this)
        this["createImages"] = this["createImages"].bind(this)
        this["maxLinesToLoad"] = this["maxLinesToLoad"].bind(this)
        this["setScales"] = this["setScales"].bind(this)
        this["setSyntaxSegls"] = this["setSyntaxSegls"].bind(this)
        this["setColors"] = this["setColors"].bind(this)
        this["getColors"] = this["getColors"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["resume"] = this["resume"].bind(this)
        this["suspend"] = this["suspend"].bind(this)
        this["reload"] = this["reload"].bind(this)
        mapview.__super__.constructor.call(this,this.screen,this.state.owner() + '.mapview')
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
        this.textScale = 4
        this.rowCache = null
        this.rowCacheExt = null
        this.suspended = false
        this.setScales((config.data != null ? config.data.scale : undefined))
        post.on('config.loaded',(function (data)
        {
            return this.setScales((data != null ? data.scale : undefined))
        }).bind(this))
    }

    mapview.prototype["reload"] = function ()
    {
        if (this.suspended)
        {
            this.redraw = true
            return
        }
        this.createImages()
        return this.drawImages()
    }

    mapview.prototype["suspend"] = function ()
    {
        return this.suspended = true
    }

    mapview.prototype["resume"] = function ()
    {
        if (!this.suspended)
        {
            return
        }
        this.suspended = false
        return this.redraw = true
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
        if (_k_.empty(this.images))
        {
            return
        }
        this.cells.screen.t.deleteImagesInRange(this.images[0],this.images.slice(-1)[0])
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
        var _92_26_

        return ((_92_26_=this.colors) != null ? _92_26_ : this.state.s.colors)
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
        this.rowCache = null
        return this.redraw = true
    }

    mapview.prototype["setScales"] = function (conf)
    {
        this.scaling = (conf != null ? conf.enabled : undefined) !== false
        this.scales = (conf != null ? conf : {})
        this.rowCache = null
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
        return scaling.scaleOfLine(this.syntax,this.scales,this.scaling,y)
    }

    mapview.prototype["rowPrefix"] = function ()
    {
        var rows, _169_60_, _171_46_, _173_30_

        if (this.rowCache && this.rowCacheExt === (this.syntax != null ? this.syntax.ext : undefined))
        {
            return this.rowCache
        }
        rows = scaling.rowPrefix((((_171_46_=this.getSegls()) != null ? _171_46_ : [])),this.lineRows)
        this.rowCacheExt = (this.syntax != null ? this.syntax.ext : undefined)
        return this.rowCache = rows
    }

    mapview.prototype["rowOfLine"] = function (li)
    {
        var rows

        rows = this.rowPrefix()
        li = _k_.clamp(0,rows.length - 1,li)
        return rows[li]
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
        return this.rowOfLine(y) * this.pixelsPerRow
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
        this.images[y] = id
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
        var a, base, bg, bgSpans, ch, classes, clss, colors, cov, customColor, f, fg, fgSpans, hgt, i, mask, masks, maxX, px, py, scale, stride, syntax, w, x, _239_57_, _240_57_

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
            fgSpans = colorspans.spansForLine((((_239_57_=colors.fg) != null ? _239_57_ : [])),y)
            bgSpans = colorspans.spansForLine((((_240_57_=colors.bg) != null ? _240_57_ : [])),y)
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
            if (scale >= this.textScale)
            {
                f = 1
            }
            clss = classes[x]
            clss = (clss != null ? clss : 'text')
            if (_k_.in('bang',clss))
            {
                f = 2
            }
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
        var id, mapH, py, rh, t, w, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        if (_k_.empty(this.csz))
        {
            return
        }
        w = this.cells.cols * this.csz[0]
        mapH = this.cells.rows * this.csz[1]
        var list = _k_.list(this.images)
        for (y = 0; y < list.length; y++)
        {
            id = list[y]
            py = this.lineOffsetPixels(y)
            rh = this.lineRows(y) * this.pixelsPerRow
            if (py >= mapH || py + rh <= 0)
            {
                continue
            }
            if (this.textLine(y))
            {
                t.placeImageSlice(id,this.cells.x,this.cells.y + this.rowOffset,py,0,rh,w)
            }
            else
            {
                t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,py,rh)
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7O09BQ0wsV0FBWDtPQUFnQixhQUFoQjtPQUF1QixhQUF2QjtPQUE4QixjQUE5Qjs7T0FDVyxhQUFBOztPQUNBLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksaUJBQVA7O09BQ08sV0FBZjs7O0FBQ04sV0FBRDs7d0JBQVM7YUFNTCxTQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUVELEtBQUMsT0FBTyxLQUFDLE1BQU0sVUFBVTtRQUUvQixLQUFDLFNBQVMsS0FBSyxNQUFNLE9BQU87UUFFNUIsS0FBQyxRQUFTLEtBQUssS0FBSyxLQUFDLE1BQU0sUUFBUTtRQUFDO1FBQ3BDLEtBQUMsWUFBYTtRQUNkLEtBQUM7UUFDRCxLQUFDLE1BQU0sT0FBTztRQUNkLEtBQUMsU0FBYTtRQUVkLEtBQUM7UUFDRCxLQUFDLGVBQWU7UUFDaEIsS0FBQyxlQUFlO1FBQ2hCLEtBQUMsWUFBZTtRQUVoQixLQUFDLFdBQWU7UUFDaEIsS0FBQyxjQUFlO1FBQ2hCLEtBQUMsWUFBZTtRQUVoQixLQUFDLFdBQVUsT0FBTyxlQUFQLE9BQU8sS0FBTTtRQUV4QixLQUFLLEdBQUcsMkJBQWlCOzttQkFBUyxLQUFDLFdBQVUsZUFBQSxLQUFNOzs7O3VCQUd2RDs7WUFFTyxLQUFDOztZQUNBLEtBQUMsU0FBUzs7O1FBR2QsS0FBQztlQUNELEtBQUM7Ozt1QkFFTDs7ZUFBWSxLQUFDLFlBQVk7Ozt1QkFFekI7O2FBRWEsS0FBQzs7OztRQUVWLEtBQUMsWUFBWTtlQUNiLEtBQUMsU0FBWTs7O3VCQUVqQjs7Ozs7dUJBSUE7O1lBRVMsS0FBQzs7OztRQUVOLEtBQUMsTUFBTSxPQUFPLEVBQUUsa0JBQWtCLEtBQUMsT0FBTyxHQUFHLEtBQUM7Ozs7dUJBSWxEOztzQkFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapview.kode
