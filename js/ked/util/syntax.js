var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var syntax

import matchr from "../../kxk/matchr.js"
import kstr from "../../kxk/kstr.js"
import kseg from "../../kxk/kseg.js"

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"


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
                dss = kulur.dissect([segl],this.ext)[0]
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

        dss = kulur.dissect([segl],ext)[0]
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
            for (var _b_ = x = dss.start, _c_ = dss.start + dss.length; (_b_ <= _c_ ? x < dss.start + dss.length : x > dss.start + dss.length); (_b_ <= _c_ ? ++x : --x))
            {
                classes[x] = dss.clss
            }
        }
        return classes
    }

    syntax.prototype["hasPureClass"] = function (y, clss)
    {
        var dss, pclss, _103_28_

        pclss = [clss,"text " + clss,"punct " + clss,"comment " + clss]
        var list = ((_103_28_=this.diss[y]) != null ? _103_28_ : [])
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
        var dss, _109_28_, _110_30_

        var list = ((_109_28_=this.diss[y]) != null ? _109_28_ : [])
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
        var _123_27_

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
        return ((_123_27_=theme.syntax[clss]) != null ? _123_27_ : [255,0,0])
    }

    syntax.prototype["getAnsiColor"] = function (x, y)
    {
        var clr, _129_24_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLGFBQVI7T0FBZSxXQUFmO09BQW9CLFdBQXBCOztPQUNRLFlBQVI7O09BQ1EsWUFBWDs7O0FBQ04sVUFBRDs7YUFDSSxRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsTUFBTztRQUNSLEtBQUM7OztzQkFFTDs7UUFFSSxLQUFDO2VBQ0QsS0FBQyxlQUFlOzs7c0JBRXBCLHFCQUFTOztRQUFEOztlQUFRLEtBQUMsT0FBTzs7O3NCQUV4QixzQkFBUzs7ZUFBUSxLQUFDLFNBQVMsT0FBTyxPQUFPLEtBQUs7OztzQkFFOUMsdUJBQVU7O2VBQVMsS0FBQyxTQUFTLEtBQUssTUFBTTs7O3NCQUV4Qyx3QkFBWTs7UUFBRDs7ZUFBVyxLQUFDLE9BQU87OztzQkFFOUIsdUJBQVU7Ozs7dUJBRUcsS0FBQzs7WUFDTixLQUFDO1lBQ0QsS0FBQztnQ0FDVzs7O2dCQUFSO2dCQUNBLE1BQU0sT0FBTyxPQUFPLEtBQUMsT0FBTyxLQUFLLElBQUksTUFBTTtxQ0FDakM7OztvQkFBTjt3QkFDYyxVQUFYLEdBQUc7O3dCQUNGLEdBQUcsZ0JBQVksR0FBRyxLQUFLLElBQUksS0FBSyxNQUFNLEtBQUs7OztnQkFDbkQsS0FBQyxLQUFLLEtBQUs7Ozs7O2dCQUVWLEtBQUMsY0FBYzs7OztZQUVwQixLQUFDO1lBRUQsS0FBQyxPQUFPLE1BQU0sUUFBUSxNQUFNLEtBQUM7aUNBRWI7aUJBQVA7O2dCQUFMO2dCQUNBLEtBQUMsU0FBUyxJQUFJLEtBQUssS0FBQyxLQUFLOzs7OztzQkFFckMsNEJBQWU7Ozs7WUFFTixLQUFDLFNBQVMsU0FBUTs7OztRQUV2Qjs0QkFFZ0I7YUFBUDs7WUFBTDtZQUVBLE1BQU0sS0FBQyxTQUFTLElBQUk7a0JBRWI7O2dCQUNILE1BQU0sTUFBTSxTQUFTLE1BQU0sS0FBQyxLQUFLO2dCQUNqQyxLQUFDLFNBQVMsSUFBSSxLQUFLO29CQUVLLEtBQUMsU0FBUyxPQUFPLElBQUUsTUFBTSxTQUFTOztvQkFBMUQsS0FBQyxjQUFjOzs7WUFFbkIsS0FBSyxLQUFLOztlQUVkLEtBQUMsT0FBTzs7O3NCQUVaLDRCQUFlOzs7O1FBRVgsV0FBVzs0QkFFSzthQUFQOztZQUFMO1lBQ0EsTUFBTSxLQUFDLFNBQVMsSUFBSTtpQkFDQzs7Z0JBQXJCLEtBQUssSUFBSSxLQUFLOzs7ZUFFbEIsS0FBQyxXQUFXOzs7c0JBRWhCLHNCQUFTLE1BQUs7Ozs7UUFFVixNQUFNLE1BQU0sU0FBUyxNQUFNLEtBQUs7UUFDaEMsS0FBQyxPQUFPLEtBQUMsS0FBSyxRQUFRO2VBQ3RCLEtBQUMsU0FBUyxJQUFJLEtBQUs7OztzQkFFdkIsMEJBQWEsT0FBTTs7Ozs0QkFFSDs7O1lBQVI7WUFDQSxLQUFDLFFBQVEsS0FBSzs7OztzQkFFdEIsdUJBQVUsR0FBRTs7Ozs0QkFFRyxLQUFDLEtBQUs7OztZQUFiO2lCQUNHLElBQUksU0FBUyxLQUFBLElBQUksSUFBSSxRQUFNLElBQUk7O3VCQUM1QixJQUFJOzs7ZUFDZDs7O3NCQUVKLHlCQUFZOzs7O1FBRVI7NEJBQ1csS0FBQyxLQUFLOzs7WUFBYjsyQkFDSSxJQUFLLElBQUksYUFBUSxJQUFJLFFBQU0sSUFBSSwwQkFBZCxJQUFJLFFBQU0sSUFBSSxhQUFkLElBQUksUUFBTSxJQUFJOztnQkFDL0IsUUFBUSxLQUFLLElBQUk7OztlQUN6Qjs7O3NCQUVKLDJCQUFjLEdBQUU7Ozs7UUFDWixTQUFTLEtBQUssVUFBUSxLQUFLLFdBQVMsS0FBSyxhQUFXOzhCQUN6QyxLQUFDLEtBQUs7OztZQUFiO3VCQUNVLElBQUksS0FBUTs7dUJBQXBCOzs7ZUFDTjs7O3NCQUVKLHVCQUFVLEdBQUU7Ozs7OEJBRUcsS0FBQyxLQUFLOzs7WUFBYjtpQkFDVSxJQUFJLGVBQUosSUFBSSxLQUFNLE1BQU0sS0FBSyxTQUFTOzt1QkFBdEM7OztlQUNOOzs7c0JBRUosdUJBQVUsR0FBRSxHQUFFOzs7O1lBRVAsS0FBQzs7bUJBQVMsS0FBQyxhQUFhLEVBQUU7O2NBRXRCOztnQkFDSyxVQUFMOztnQkFDQyxPQUFPLEtBQUMsU0FBUyxFQUFFOzs7O2dCQUVuQixPQUFPOzs7MEJBRWYsTUFBTSxPQUFPLDZCQUFTLElBQUksRUFBRTs7O3NCQUVoQywyQkFBYyxHQUFFOzs7OzRCQUVELEtBQUMsT0FBTzs7O1lBQWY7Z0JBQ0csSUFBSSxLQUFLOztxQkFDTCxJQUFJOzt3QkFDQSxJQUFJLElBQUksSUFBSSxJQUFJOzsrQkFDYixJQUFJOzs7OzsyQkFFUixJQUFJOzs7O2dCQUVqQixJQUFJLEVBQUU7OztzQkFFWCxzQkFBUyxHQUFFLEdBQUUsTUFBSzs7UUFFZCxRQUFBLGVBQUEsT0FBUSxLQUFDLFNBQVMsRUFBRTttQkFDWCxTQUFZOzttQkFBbkI7O2VBQ0Y7OztzQkFFSiwwQkFBYSxRQUFPLFNBQVE7Ozs7YUFFYixxQkFBaUI7O21CQUExQjs7cUJBQ0ssS0FBQyxJQUFXLE9BQU8sS0FBSzs7bUJBQTdCOzthQUVFLFFBQWMsT0FBTyxLQUFDOztZQUFqQixRQUFTLE9BQU8sS0FBQztZQUN0QixjQUFVLEVBQUUsRUFBRTtnQkFDWCxJQUFJLEtBQU0sS0FBQyxhQUFhLEdBQUc7O3VCQUN4Qjs7O2VBQ1Y7OztXQW5KUDs7O2VBcUpNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/syntax.kode
