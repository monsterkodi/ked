var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var mapview

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

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
        var bytes, w

        w = this.cells.cols * this.cells.screen.t.cellsz[0]
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
        var ch, charPixels, classes, clss, f, maxX, rgb, w, x

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
        for (var _c_ = x = 0, _d_ = line.length; (_c_ <= _d_ ? x < line.length : x > line.length); (_c_ <= _d_ ? ++x : --x))
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
                charPixels(x,rgb)
            }
            else
            {
                charPixels(x,this.color.bg)
            }
        }
        for (var _e_ = x = line.length, _f_ = maxX; (_e_ <= _f_ ? x < maxX : x > maxX); (_e_ <= _f_ ? ++x : --x))
        {
            charPixels(x,this.color.bg)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvbWFwdmlldy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQWlCeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFJWCxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRTlCLEtBQUMsU0FBUyxLQUFLLE1BQU0sT0FBTztRQUU1QixLQUFDLFFBQVMsS0FBSyxLQUFLLEtBQUMsTUFBTSxRQUFRO1FBQUM7UUFDcEMsS0FBQyxZQUFhO1FBQ2QsS0FBQztRQUNELEtBQUMsTUFBTSxPQUFPO1FBRWQsS0FBQztRQUNELEtBQUMsZUFBZTtRQUNoQixLQUFDLGVBQWU7Ozs7O1FBVWhCLEtBQUM7ZUFDRCxLQUFDOzs7Ozs7Ozs7O1lBUUssS0FBQzs7OztRQUVQLEtBQUMsTUFBTSxPQUFPLEVBQUUsa0JBQWtCLEtBQUMsT0FBTyxHQUFHLEtBQUM7Ozs7Ozs7O3NCQU1sQyxLQUFDOzs7O1lBRVYsUUFBUSxJQUFJLFNBQVE7O1lBQ25CLEtBQUMsTUFBTSxPQUFPLEVBQUUsb0JBQW9CLEtBQUMsT0FBTyxHQUFHLEtBQUM7Ozs7Z0NBRXRDLEtBQUM7Ozs7Z0JBQ1AsS0FBQyxNQUFNLE9BQU8sRUFBRSxZQUFZOzs7ZUFFcEMsS0FBQzs7Ozs7OztRQUlELFVBQVUsTUFBSyxLQUFDLE1BQU0sS0FBSyxNQUFLLEtBQUMsTUFBTSxLQUFLLE1BQUssS0FBQyxNQUFNLFFBQVEsTUFBSyxLQUFDLE1BQU07MkNBQ3RFLEVBQUUsRUFBRSxFQUFFO1lBRU4sS0FBQzs7OztZQUVKLEtBQUMsVUFBVTs7Z0JBQ1MsS0FBQzs7Z0JBQXBCLEtBQUM7O21CQUNNLEtBQUM7bUJBQ1IsS0FBQzs7Ozs7O2VBRUssS0FBQzs7Ozs7ZUFDRCxLQUFDOzs7Ozs7O1FBR1gsS0FBQyxhQUFhO1FBQ2QsS0FBQyxPQUFPLE9BQU87UUFDZixLQUFDLE9BQU8sU0FBUyxLQUFDO2VBRWxCLEtBQUMsU0FBUzs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/mapview.kode
