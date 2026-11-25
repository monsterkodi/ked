var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var syntax, toIndices, UNIKEY

import matchr from "../../kxk/matchr.js"
import kstr from "../../kxk/kstr.js"
import kseg from "../../kxk/kseg.js"

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"

UNIKEY = new RegExp(`^text unicode (${Object.keys(kulur.UNICODE).join('|')})\\b`)

toIndices = function (segl, dss)
{
    var c, ds, e, end, i, idx, s, seg, _18_28_, _19_26_

    idx = []
    var list = _k_.list(segl)
    for (i = 0; i < list.length; i++)
    {
        seg = list[i]
        for (c = 0; c < kseg.segWidth(seg); c++)
        {
            idx.push(i)
        }
    }
    if (idx.length === segl.length)
    {
        return dss
    }
    var list1 = _k_.list(dss)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        ds = list1[_b_]
        end = ds.start + ds.length
        s = ((_18_28_=idx[ds.start]) != null ? _18_28_ : segl.length)
        e = (((_19_26_=idx[end - 1]) != null ? _19_26_ : segl.length - 1)) + 1
        ds.start = s
        ds.length = e - s
    }
    return dss
}

syntax = (function ()
{
    function syntax (name)
    {
        this.name = name
    
        this["scaleOfLine"] = this["scaleOfLine"].bind(this)
        this["getChar"] = this["getChar"].bind(this)
        this["getAnsiColor"] = this["getAnsiColor"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["hasClass"] = this["hasClass"].bind(this)
        this["hasPureClass"] = this["hasPureClass"].bind(this)
        this["getClasses"] = this["getClasses"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["appendSegls"] = this["appendSegls"].bind(this)
        this["addSegl"] = this["addSegl"].bind(this)
        this["pruneLineDiss"] = this["pruneLineDiss"].bind(this)
        this["partialUpdate"] = this["partialUpdate"].bind(this)
        this["setSegls"] = this["setSegls"].bind(this)
        this["setColors"] = this["setColors"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["setRgxs"] = this["setRgxs"].bind(this)
        this["setExt"] = this["setExt"].bind(this)
        this["setOverlay"] = this["setOverlay"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this.ext = 'txt'
        this.clear()
    }

    syntax.prototype["clear"] = function ()
    {
        this.diss = []
        this.lineDiss = new Map()
        return delete this.overlay
    }

    syntax.prototype["setOverlay"] = function (overlay)
    {
        this.overlay = overlay
    }

    syntax.prototype["setExt"] = function (ext)
    {
        this.ext = ext
    
        return this.ansi = false
    }

    syntax.prototype["setRgxs"] = function (rgxs)
    {
        return this.config = matchr.config(rgxs,'u')
    }

    syntax.prototype["setLines"] = function (lines)
    {
        return this.setSegls(kseg.segls(lines))
    }

    syntax.prototype["setColors"] = function (colors)
    {
        this.colors = colors
    
        return this.ansi = true
    }

    syntax.prototype["setSegls"] = function (segls)
    {
        var ds, dss, idx, segl, segs

        if (!_k_.empty(this.config))
        {
            this.clear()
            this.diss = []
            var list = _k_.list(segls)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                segs = list[_a_]
                dss = matchr.ranges(this.config,kseg.str(segs),'u')
                var list1 = _k_.list(dss)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    ds = list1[_b_]
                    if (_k_.isArr(ds.clss))
                    {
                        ds.clss = _k_.trim(ds.clss.map(kstr.trim).join(' '))
                    }
                }
                this.diss.push(dss)
            }
        }
        else
        {
            if (this.partialUpdate(segls))
            {
                return
            }
            this.clear()
            this.diss = kulur.dissect(segls,this.ext)
            var list2 = _k_.list(segls)
            for (idx = 0; idx < list2.length; idx++)
            {
                segl = list2[idx]
                toIndices(segl,this.diss[idx])
                this.lineDiss.set(segl,this.diss[idx])
            }
        }
    }

    syntax.prototype["partialUpdate"] = function (segls)
    {
        var diss, dss, idx, segl

        if (this.lineDiss.size === 0)
        {
            return
        }
        diss = []
        var list = _k_.list(segls)
        for (idx = 0; idx < list.length; idx++)
        {
            segl = list[idx]
            dss = this.lineDiss.get(segl)
            if (!(dss != null))
            {
                dss = toIndices(segl,kulur.dissect([segl],this.ext)[0])
                this.lineDiss.set(segl,dss)
                if (this.lineDiss.size > 2 * segls.length + 100)
                {
                    this.pruneLineDiss(segls)
                }
            }
            diss.push(dss)
        }
        return this.diss = diss
    }

    syntax.prototype["pruneLineDiss"] = function (segls)
    {
        var dss, idx, keep, line

        keep = new Map()
        var list = _k_.list(segls)
        for (idx = 0; idx < list.length; idx++)
        {
            line = list[idx]
            dss = this.lineDiss.get(line)
            if ((dss != null))
            {
                keep.set(line,dss)
            }
        }
        return this.lineDiss = keep
    }

    syntax.prototype["addSegl"] = function (segl, ext)
    {
        var dss

        dss = toIndices(segl,kulur.dissect([segl],ext)[0])
        this.diss = this.diss.concat([dss])
        return this.lineDiss.set(segl,dss)
    }

    syntax.prototype["appendSegls"] = function (segls, ext)
    {
        var segl

        var list = _k_.list(segls)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            segl = list[_a_]
            this.addSegl(segl,ext)
        }
    }

    syntax.prototype["getClass"] = function (x, y)
    {
        var dss, _114_36_

        if ((((_114_36_=this.overlay) != null ? _114_36_[y] != null ? _114_36_[y][x] : undefined : undefined) != null))
        {
            return this.overlay[y][x]
        }
        var list = _k_.list(this.diss[y])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            if ((dss.start <= x && x < dss.start + dss.length))
            {
                return dss.clss
            }
        }
        return 'text'
    }

    syntax.prototype["getClasses"] = function (y)
    {
        var classes, clss, dss, row, x, _127_25_

        classes = []
        var list = _k_.list(this.diss[y])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            for (x = dss.start; x < dss.start + dss.length; x++)
            {
                classes[x] = dss.clss
            }
        }
        if (row = (this.overlay != null ? this.overlay[y] : undefined))
        {
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                clss = list1[x]
                if ((clss != null))
                {
                    classes[x] = clss
                }
            }
        }
        return classes
    }

    syntax.prototype["hasPureClass"] = function (y, clss)
    {
        var dss, pclss, _134_28_

        pclss = [clss,"text " + clss,"punct " + clss,"comment " + clss]
        var list = ((_134_28_=this.diss[y]) != null ? _134_28_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            if (_k_.in(dss.clss,pclss))
            {
                return true
            }
        }
        return false
    }

    syntax.prototype["hasClass"] = function (y, clss)
    {
        var dss, _140_28_, _141_30_

        var list = ((_140_28_=this.diss[y]) != null ? _140_28_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            if ((dss.clss != null ? dss.clss.split(' ').includes(clss) : undefined))
            {
                return true
            }
        }
        return false
    }

    syntax.prototype["getColor"] = function (x, y, clss)
    {
        var _154_32_

        if (this.ansi)
        {
            return this.getAnsiColor(x,y)
        }
        if (!(clss != null))
        {
            if (_k_.isNum(x))
            {
                clss = this.getClass(x,y)
            }
            else
            {
                clss = x
            }
        }
        return ((_154_32_=syntax.themeColor(clss)) != null ? _154_32_ : [255,0,0])
    }

    syntax["themeColor"] = function (clss)
    {
        var m

        if (theme.syntax[clss])
        {
            return theme.syntax[clss]
        }
        if (m = UNIKEY.exec(clss))
        {
            return theme.syntax['text unicode' + clss.slice(m[0].length)]
        }
    }

    syntax.prototype["getAnsiColor"] = function (x, y)
    {
        var clr, _166_24_

        var list = _k_.list(this.colors[y])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clr = list[_a_]
            if (clr.x <= x)
            {
                if ((clr.w != null))
                {
                    if (x < clr.x + clr.w)
                    {
                        return clr.fg
                    }
                }
                else
                {
                    return clr.fg
                }
            }
        }
        return [256,0,256]
    }

    syntax.prototype["getChar"] = function (x, y, char, clss)
    {
        clss = (clss != null ? clss : this.getClass(x,y))
        if (_k_.in('header',clss))
        {
            return '█'
        }
        return char
    }

    syntax.prototype["scaleOfLine"] = function (scales, scaling, li)
    {
        var clss, s, scale

        if (!scaling || _k_.empty(scales))
        {
            return 1
        }
        if (!(_k_.in(this.ext,Object.keys(scales))))
        {
            return 1
        }
        for (clss in scales[this.ext])
        {
            scale = scales[this.ext][clss]
            s = _k_.clamp(1,7,scale)
            if (s > 1 && this.hasPureClass(li,clss))
            {
                return s
            }
        }
        return 1
    }

    return syntax
})()

export default syntax;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLGFBQVI7T0FBZSxXQUFmO09BQW9CLFdBQXBCOztPQUNRLFlBQVI7O09BQ1EsWUFBWDs7QUFFUCxhQUFhLHlCQUF5QixPQUFPLEtBQUssTUFBTSxTQUFTLEtBQUs7O0FBRXRFLHNCQUFZLE1BQUs7Ozs7SUFFYjt3QkFDYTtTQUFMOztRQUFKO2FBQ0ksSUFBSyxPQUFJLEtBQUssU0FBUzs7WUFDdkIsSUFBSSxLQUFLOzs7UUFDUixJQUFJLFdBQVUsS0FBSzs7ZUFBMUI7O3lCQUVROzs7UUFBTjtRQUNBLE1BQU0sR0FBRyxRQUFRLEdBQUc7UUFDcEIsY0FBTSxJQUFJLEdBQUcsNEJBQVMsS0FBSztRQUMzQixlQUFPLElBQUksTUFBSSx3QkFBSyxLQUFLLFNBQU8sTUFBSztRQUNyQyxHQUFHLFFBQVM7UUFDWixHQUFHLFNBQVMsSUFBSTs7V0FDcEI7OztBQUVILFVBQUQ7O2FBQ0ksUUFBSTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxNQUFPO1FBQ1IsS0FBQzs7O3NCQUVMOztRQUVJLEtBQUM7UUFDRCxLQUFDLGVBQWU7c0JBQ1QsS0FBQzs7O3NCQUtaLHlCQUFhOztRQUFEOzs7c0JBRVoscUJBQVM7O1FBQUQ7O2VBQVEsS0FBQyxPQUFPOzs7c0JBRXhCLHNCQUFTOztlQUFRLEtBQUMsU0FBUyxPQUFPLE9BQU8sS0FBSzs7O3NCQUU5Qyx1QkFBVTs7ZUFBUyxLQUFDLFNBQVMsS0FBSyxNQUFNOzs7c0JBRXhDLHdCQUFZOztRQUFEOztlQUFXLEtBQUMsT0FBTzs7O3NCQUU5Qix1QkFBVTs7Ozt1QkFFRyxLQUFDOztZQUNOLEtBQUM7WUFDRCxLQUFDO2dDQUNXOzs7Z0JBQVI7Z0JBQ0EsTUFBTSxPQUFPLE9BQU8sS0FBQyxPQUFPLEtBQUssSUFBSSxNQUFNO3FDQUNqQzs7O29CQUFOO3dCQUNjLFVBQVgs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
//# sourceURL=../../../kode/ked/util/syntax.kode
