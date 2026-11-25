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
        this["clear"] = this["clear"].bind(this)
        this.ext = 'txt'
        this.clear()
    }

    syntax.prototype["clear"] = function ()
    {
        this.diss = []
        return this.lineDiss = new Map()
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
        var dss

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
        var classes, dss, x

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
        return classes
    }

    syntax.prototype["hasPureClass"] = function (y, clss)
    {
        var dss, pclss, _123_28_

        pclss = [clss,"text " + clss,"punct " + clss,"comment " + clss]
        var list = ((_123_28_=this.diss[y]) != null ? _123_28_ : [])
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
        var dss, _129_28_, _130_30_

        var list = ((_129_28_=this.diss[y]) != null ? _129_28_ : [])
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
        var _143_32_

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
        return ((_143_32_=syntax.themeColor(clss)) != null ? _143_32_ : [255,0,0])
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
        var clr, _155_24_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLGFBQVI7T0FBZSxXQUFmO09BQW9CLFdBQXBCOztPQUNRLFlBQVI7O09BQ1EsWUFBWDs7QUFFUCxhQUFhLHlCQUF5QixPQUFPLEtBQUssTUFBTSxTQUFTLEtBQUs7O0FBRXRFLHNCQUFZLE1BQUs7Ozs7SUFFYjt3QkFDYTtTQUFMOztRQUFKO2FBQ0ksSUFBSyxPQUFJLEtBQUssU0FBUzs7WUFDdkIsSUFBSSxLQUFLOzs7UUFDUixJQUFJLFdBQVUsS0FBSzs7ZUFBMUI7O3lCQUVROzs7UUFBTjtRQUNBLE1BQU0sR0FBRyxRQUFRLEdBQUc7UUFDcEIsY0FBTSxJQUFJLEdBQUcsNEJBQVMsS0FBSztRQUMzQixlQUFPLElBQUksTUFBSSx3QkFBSyxLQUFLLFNBQU8sTUFBSztRQUNyQyxHQUFHLFFBQVM7UUFDWixHQUFHLFNBQVMsSUFBSTs7V0FDcEI7OztBQUVILFVBQUQ7O2FBQ0ksUUFBSTs7UUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE1BQU87UUFDUixLQUFDOzs7c0JBRUw7O1FBRUksS0FBQztlQUNELEtBQUMsZUFBZTs7O3NCQUVwQixxQkFBUzs7UUFBRDs7ZUFBUSxLQUFDLE9BQU87OztzQkFFeEIsc0JBQVM7O2VBQVEsS0FBQyxTQUFTLE9BQU8sT0FBTyxLQUFLOzs7c0JBRTlDLHVCQUFVOztlQUFTLEtBQUMsU0FBUyxLQUFLLE1BQU07OztzQkFFeEMsd0JBQVk7O1FBQUQ7O2VBQVcsS0FBQyxPQUFPOzs7c0JBRTlCLHVCQUFVOzs7O3VCQUVHLEtBQUM7O1lBQ04sS0FBQztZQUNELEtBQUM7Z0NBQ1c7OztnQkFBUjtnQkFDQSxNQUFNLE9BQU8sT0FBTyxLQUFDLE9BQU8sS0FBSyxJQUFJLE1BQU07cUNBQ2pDOzs7b0JBQU47d0JBQ2MsVUFBWCxHQUFHOzt3QkFDRixHQUFHLGdCQUFZLEdBQUcsS0FBSyxJQUFJLEtBQUssTUFBTSxLQUFLOzs7Z0JBQ25ELEtBQUMsS0FBSyxLQUFLOzs7OztnQkFFVixLQUFDLGNBQWM7Ozs7WUFFcEIsS0FBQztZQUVELEtBQUMsT0FBTyxNQUFNLFFBQVEsTUFBTSxLQUFDO2lDQUViO2lCQUFQOztnQkFBTDtnQkFDQSxVQUFVLEtBQU0sS0FBQyxLQUFLO2dCQUN0QixLQUFDLFNBQVMsSUFBSSxLQUFLLEtBQUMsS0FBSzs7Ozs7c0JBRXJDLDRCQUFlOzs7O1lBRU4sS0FBQyxTQUFTLFNBQVE7Ozs7UUFFdkI7NEJBRWdCO2FBQVA7O1lBQUw7WUFFQSxNQUFNLEtBQUMsU0FBUyxJQUFJO2tCQUViOztnQkFDSCxNQUFNLFVBQVUsS0FBTSxNQUFNLFNBQVMsTUFBTSxLQUFDLEtBQUs7Z0JBQ2pELEtBQUMsU0FBUyxJQUFJLEtBQUs7b0JBRUssS0FBQyxTQUFTLE9BQU8sSUFBRSxNQUFNLFNBQVM7O29CQUExRCxLQUFDLGNBQWM7OztZQUVuQixLQUFLLEtBQUs7O2VBRWQsS0FBQyxPQUFPOzs7c0JBRVosNEJBQWU7Ozs7UUFFWCxXQUFXOzRCQUVLO2FBQVA7O1lBQUw7WUFDQSxNQUFNLEtBQUMsU0FBUyxJQUFJO2lCQUNDOztnQkFBckIsS0FBSyxJQUFJLEtBQUs7OztlQUVsQixLQUFDLFdBQVc7OztzQkFFaEIsc0JBQVMsTUFBSzs7OztRQUVWLE1BQU0sVUFBVSxLQUFNLE1BQU0sU0FBUyxNQUFNLEtBQUs7UUFDaEQsS0FBQyxPQUFPLEtBQUMsS0FBSyxRQUFRO2VBQ3RCLEtBQUMsU0FBUyxJQUFJLEtBQUs7OztzQkFFdkIsMEJBQWEsT0FBTTs7Ozs0QkFFSDs7O1lBQVI7WUFDQSxLQUFDLFFBQVEsS0FBSzs7OztzQkFFdEIsdUJBQVUsR0FBRTs7Ozs0QkFFRyxLQUFDLEtBQUs7OztZQUFiO2lCQUNHLElBQUksU0FBUyxLQUFBLElBQUksSUFBSSxRQUFNLElBQUk7O3VCQUM1QixJQUFJOzs7ZUFDZDs7O3NCQUVKLHlCQUFZOzs7O1FBRVI7NEJBQ1csS0FBQyxLQUFLOzs7WUFBYjtpQkFDSSxJQUFLLElBQUksV0FBUSxJQUFJLFFBQU0sSUFBSTs7Z0JBQy9CLFFBQVEsS0FBSyxJQUFJOzs7ZUFDekI7OztzQkFFSiwyQkFBYyxHQUFFOzs7O1FBQ1osU0FBUyxLQUFLLFVBQVEsS0FBSyxXQUFTLEtBQUssYUFBVzs4QkFDekMsS0FBQyxLQUFLOzs7WUFBYjt1QkFDVSxJQUFJLEtBQVE7O3VCQUFwQjs7O2VBQ047OztzQkFFSix1QkFBVSxHQUFFOzs7OzhCQUVHLEtBQUMsS0FBSzs7O1lBQWI7aUJBQ1UsSUFBSSxlQUFKLElBQUksS0FBTSxNQUFNLEtBQUssU0FBUzs7dUJBQXRDOzs7ZUFDTjs7O3NCQUVKLHVCQUFVLEdBQUUsR0FBRTs7OztZQUVQLEtBQUM7O21CQUFTLEtBQUMsYUFBYSxFQUFFOztjQUV0Qjs7Z0JBQ0ssVUFBTDs7Z0JBQ0MsT0FBTyxLQUFDLFNBQVMsRUFBRTs7OztnQkFFbkIsT0FBTzs7OzBCQUVmLE9BQU8sV0FBVyw2QkFBUyxJQUFJLEVBQUU7OztJQUVyQyxRQUFDLHlCQUFZOzs7O1lBRWUsTUFBTSxPQUFPOzttQkFBbkMsTUFBTSxPQUFPOztZQUNaLElBQUksT0FBTyxLQUFLOzttQkFDYixNQUFNLE9BQU8saUJBQWlCLFdBQUssRUFBRSxHQUFHOzs7O3NCQUVsRCwyQkFBYyxHQUFFOzs7OzRCQUVELEtBQUMsT0FBTzs7O1lBQWY7Z0JBQ0csSUFBSSxLQUFLOztxQkFDTCxJQUFJOzt3QkFDQSxJQUFJLElBQUksSUFBSSxJQUFJOzsrQkFDYixJQUFJOzs7OzsyQkFFUixJQUFJOzs7O2dCQUVqQixJQUFJLEVBQUU7OztzQkFFWCxzQkFBUyxHQUFFLEdBQUUsTUFBSzs7UUFFZCxRQUFBLGVBQUEsT0FBUSxLQUFDLFNBQVMsRUFBRTttQkFDWCxTQUFZOzttQkFBbkI7O2VBQ0Y7OztzQkFFSiwwQkFBYSxRQUFPLFNBQVE7Ozs7YUFFYixxQkFBaUI7O21CQUExQjs7cUJBQ0ssS0FBQyxJQUFXLE9BQU8sS0FBSzs7bUJBQTdCOzthQUVFLFFBQWMsT0FBTyxLQUFDOztZQUFqQixRQUFTLE9BQU8sS0FBQztZQUN0QixjQUFVLEVBQUUsRUFBRTtnQkFDWCxJQUFJLEtBQU0sS0FBQyxhQUFhLEdBQUc7O3VCQUN4Qjs7O2VBQ1Y7OztXQTFKUDs7O2VBNEpNIn0=
//# sourceURL=../../../kode/ked/util/syntax.kode
