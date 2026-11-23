var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapview

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"
import config from "../../util/config.js"

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
    
        var _37_30_

        this["draw"] = this["draw"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["rowOfLine"] = this["rowOfLine"].bind(this)
        this["rowPrefix"] = this["rowPrefix"].bind(this)
        this["lineRows"] = this["lineRows"].bind(this)
        this["lineData"] = this["lineData"].bind(this)
        this["hideUnplacedImages"] = this["hideUnplacedImages"].bind(this)
        this["ensureImage"] = this["ensureImage"].bind(this)
        this["createImages"] = this["createImages"].bind(this)
        this["nextImageId"] = this["nextImageId"].bind(this)
        this["imageWidth"] = this["imageWidth"].bind(this)
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
        this.imageCache = new Map()
        this.imgSeq = 0
        this.placedImages = []
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
        this.clearImages()
        this.redraw = true
        return post.emit('redraw')
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
        this.hideUnplacedImages([])
        return mapview.__super__.hide.call(this)
    }

    mapview.prototype["clearImages"] = function ()
    {
        var t, _78_18_, _78_26_

        if (!this.imgSeq)
        {
            return
        }
        t = ((_78_18_=this.cells) != null ? (_78_26_=_78_18_.screen) != null ? _78_26_.t : undefined : undefined)
        if (!t)
        {
            return
        }
        t.deleteImagesInRange(this.imgId,this.imgId + this.imgSeq)
        this.imageCache.clear()
        this.placedImages = []
        return this.imgSeq = 0
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
            if (this.redraw || resized)
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
        var _101_26_

        return ((_101_26_=this.colors) != null ? _101_26_ : this.state.s.colors)
    }

    mapview.prototype["setColors"] = function (colors)
    {
        this.colors = colors
        this.clearImages()
        return this.redraw = true
    }

    mapview.prototype["setSyntaxSegls"] = function (ext, segls)
    {
        this.segls = segls
    
        this.syntax = new syntax
        this.syntax.setExt(ext)
        this.syntax.setSegls(this.segls)
        this.rowCache = null
        this.clearImages()
        return this.redraw = true
    }

    mapview.prototype["setScales"] = function (conf)
    {
        this.scaling = (conf != null ? conf.enable : undefined) !== false
        this.scales = (conf != null ? conf : {})
        this.rowCache = null
        this.clearImages()
        return this.redraw = true
    }

    mapview.prototype["imageWidth"] = function ()
    {
        return this.cells.cols * this.csz[0]
    }

    mapview.prototype["imageKey"] = function (line, h)
    {
        return ((_k_.isStr(line)) ? `${h}:${line}` : line)
    }

    mapview.prototype["nextImageId"] = function ()
    {
        this.imgSeq += 1
        if (this.imgSeq > 60000)
        {
            this.clearImages()
            this.imgSeq = 1
        }
        return this.imgId + this.imgSeq
    }

    mapview.prototype["createImages"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        if (!_k_.empty(this.csz) && !(_k_.eql(this.csz, t.cellsz)))
        {
            this.clearImages()
        }
        this.rowCache = null
        return this.csz = t.cellsz
    }

    mapview.prototype["ensureImage"] = function (y)
    {
        var data, h, id, img, key, line, t, w

        t = this.cells.screen.t
        line = this.getSegls()[y]
        if (!(line != null))
        {
            return
        }
        h = this.imageHeight(y)
        w = this.imageWidth()
        key = this.imageKey(line,h)
        img = this.imageCache.get(key)
        if (img && img.h === h && img.w === w)
        {
            img.y = y
            return img.id
        }
        if (img)
        {
            this.imageCache.delete(key)
            t.deleteImage(img.id)
        }
        data = this.lineData(y)
        if (_k_.empty(data))
        {
            return
        }
        this.imageForLine(data,line,y,h)
        id = this.nextImageId()
        t.sendImageData(data,id,w,h)
        this.imageCache.set(key,{id:id,h:h,w:w,y:y})
        return id
    }

    mapview.prototype["hideUnplacedImages"] = function (placed)
    {
        var id, keep, _198_32_

        keep = {}
        var list = _k_.list(placed)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            id = list[_a_]
            keep[id] = true
        }
        var list1 = ((_198_32_=this.placedImages) != null ? _198_32_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            id = list1[_b_]
            if (!keep[id])
            {
                this.cells.screen.t.hideImage(id)
            }
        }
        return this.placedImages = placed
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
        return this.syntax.scaleOfLine(this.scales,this.scaling,y)
    }

    mapview.prototype["rowPrefix"] = function ()
    {
        var li, lines, rows, _222_60_, _224_28_, _231_30_

        if (this.rowCache && this.rowCacheExt === (this.syntax != null ? this.syntax.ext : undefined))
        {
            return this.rowCache
        }
        lines = ((_224_28_=this.getSegls()) != null ? _224_28_ : [])
        rows = [0]
        for (li = 0; li < lines.length; li++)
        {
            rows.push(rows[li] + this.lineRows(li))
        }
        rows
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

    mapview.prototype["imageForLine"] = function (data, line, y, h)
    {
        var a, base, bg, bgSpans, ch, classes, clss, colors, cov, customColor, f, fg, fgSpans, hgt, i, mask, masks, maxX, px, py, scale, stride, syntax, w, x, _262_57_, _263_57_

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
            fgSpans = colorspans.spansForLine((((_262_57_=colors.fg) != null ? _262_57_ : [])),y)
            bgSpans = colorspans.spansForLine((((_263_57_=colors.bg) != null ? _263_57_ : [])),y)
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
        for (i = 0; i < (w * hgt); i++)
        {
            data[i * 3 + 0] = base[0]
            data[i * 3 + 1] = base[1]
            data[i * 3 + 2] = base[2]
        }
        masks = (this.textLine(y) ? glyphs.forScale(scale) : null)
        for (x = 0; x < maxX; x++)
        {
            ch = line[x]
            bg = customColor(bgSpans,x,base)
            for (py = 0; py < hgt; py++)
            {
                for (px = 0; px < stride; px++)
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
                for (py = 0; py < hgt; py++)
                {
                    for (px = 0; px < stride; px++)
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
                for (py = 0; py < hgt; py++)
                {
                    for (px = 0; px < stride; px++)
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
        var id, mapH, placed, py, rh, t, w, y, y1, y2

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        if (_k_.empty(this.csz))
        {
            return
        }
        w = this.imageWidth()
        mapH = (this.cells.rows - this.rowOffset) * this.csz[1]
        placed = []
        for (y = 0; y < this.getSegls().length; y++)
        {
            py = this.lineOffsetPixels(y)
            if (py >= mapH)
            {
                break
            }
            rh = this.lineRows(y) * this.pixelsPerRow
            y1 = _k_.max(0,py)
            y2 = _k_.min(mapH,(py + rh))
            if (y2 <= y1)
            {
                continue
            }
            id = this.ensureImage(y)
            if (!id)
            {
                continue
            }
            if (this.textLine(y))
            {
                t.placeImageSlice(id,this.cells.x,this.cells.y + this.rowOffset,y1,(y1 - py),(y2 - y1),w)
            }
            else
            {
                t.placeLineImage(id,this.cells.x,this.cells.y + this.rowOffset,y1,(y2 - y1))
            }
            placed.push(id)
        }
        return this.hideUnplacedImages(placed)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7O09BQ0wsV0FBWDtPQUFnQixhQUFoQjtPQUF1QixhQUF2Qjs7T0FDVyxhQUFBOztPQUNBLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksaUJBQVA7O09BQ08sV0FBZjs7O0FBQ04sV0FBRDs7d0JBQVM7YUFNTCxTQUFJLFFBQVE7O1FBQVQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFFRCxLQUFDLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFL0IsS0FBQyxTQUFTLEtBQUssTUFBTSxPQUFPO1FBRTVCLEtBQUMsUUFBYSxLQUFLLEtBQUssS0FBQyxNQUFNLFFBQVE7UUFBQztRQUN4QyxLQUFDLFlBQWE7UUFDZCxLQUFDLGlCQUFpQjtRQUNsQixLQUFDLFNBQWE7UUFDZCxLQUFDO1FBQ0QsS0FBQyxNQUFNLE9BQU87UUFDZCxLQUFDLFNBQWE7UUFFZCxLQUFDO1FBQ0QsS0FBQyxlQUFlO1FBQ2hCLEtBQUMsZUFBZTtRQUNoQixLQUFDLFlBQWU7UUFFaEIsS0FBQyxXQUFlO1FBQ2hCLEtBQUMsY0FBZTtRQUNoQixLQUFDLFlBQWU7UUFFaEIsS0FBQyxXQUFVLE9BQU8sZUFBUCxPQUFPLEtBQU07UUFFeEIsS0FBSyxHQUFHLDJCQUFpQjs7bUJBQVMsS0FBQyxXQUFVLGVBQUEsS0FBTTs7Ozt1QkFHdkQ7O1lBRU8sS0FBQzs7WUFDQSxLQUFDLFNBQVM7OztRQUdkLEtBQUM7UUFDRCxLQUFDLFNBQVM7ZUFFVixLQUFLLEtBQUs7Ozt1QkFFZDs7ZUFBWSxLQUFDLFlBQVk7Ozt1QkFFekI7O2FBRWEsS0FBQzs7OztRQUVWLEtBQUMsWUFBWTtlQUNiLEtBQUMsU0FBWTs7O3VCQUVqQjs7Ozs7dUJBSUE7O1lBRVMsS0FBQzs7OztRQUVOLEtBQUM7Ozs7dUJBSUw7Ozs7YUFF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
//# sourceURL=../../../../kode/ked/view/editor/mapview.kode
