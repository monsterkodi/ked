var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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
        var dss, pclss, _107_28_

        pclss = [clss,"text " + clss,"punct " + clss,"comment " + clss]
        var list = ((_107_28_=this.diss[y]) != null ? _107_28_ : [])
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
        var dss, _113_28_, _114_30_

        var list = ((_113_28_=this.diss[y]) != null ? _113_28_ : [])
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
        var _127_27_

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
        return ((_127_27_=theme.syntax[clss]) != null ? _127_27_ : [255,0,0])
    }

    syntax.prototype["getAnsiColor"] = function (x, y)
    {
        var clr, _133_24_

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

    return syntax
})()

export default syntax;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLGFBQVI7T0FBZSxXQUFmO09BQW9CLFdBQXBCOztPQUNRLFlBQVI7O09BQ1EsWUFBWDs7O0FBQ04sVUFBRDs7YUFDSSxRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxNQUFPO1FBQ1IsS0FBQzs7O3NCQUVMOztRQUVJLEtBQUM7ZUFDRCxLQUFDLGVBQWU7OztzQkFFcEIscUJBQVM7O1FBQUQ7O2VBQVEsS0FBQyxPQUFPOzs7c0JBRXhCLHNCQUFTOztlQUFRLEtBQUMsU0FBUyxPQUFPLE9BQU8sS0FBSzs7O3NCQUU5Qyx1QkFBVTs7ZUFBUyxLQUFDLFNBQVMsS0FBSyxNQUFNOzs7c0JBRXhDLHdCQUFZOztRQUFEOztlQUFXLEtBQUMsT0FBTzs7O3NCQUU5Qix1QkFBVTs7Ozt1QkFFRyxLQUFDOztZQUNOLEtBQUM7WUFDRCxLQUFDO2dDQUNXOzs7Z0JBQVI7Z0JBQ0EsTUFBTSxPQUFPLE9BQU8sS0FBQyxPQUFPLEtBQUssSUFBSSxNQUFNO3FDQUNqQzs7O29CQUFOO3dCQUNjLFVBQVgsR0FBRzs7d0JBQ0YsR0FBRyxnQkFBWSxHQUFHLEtBQUssSUFBSSxLQUFLLE1BQU0sS0FBSzs7O2dCQUNuRCxLQUFDLEtBQUssS0FBSzs7Ozs7Z0JBRVYsS0FBQyxjQUFjOzs7O1lBRXBCLEtBQUM7WUFFRCxLQUFDLE9BQU8sTUFBTSxRQUFRLE1BQU0sS0FBQztpQ0FFYjtpQkFBUDs7Z0JBQUw7Z0JBQ0EsS0FBQyxTQUFTLElBQUksS0FBSyxLQUFDLEtBQUs7Ozs7O3NCQU1yQyw0QkFBZTs7OztZQUVOLEtBQUMsU0FBUyxTQUFROzs7O1FBRXZCOzRCQUVnQjthQUFQOztZQUFMO1lBRUEsTUFBTSxLQUFDLFNBQVMsSUFBSTtrQkFFYjs7Z0JBQ0gsTUFBTSxNQUFNLFNBQVMsTUFBTSxLQUFDLEtBQUs7Z0JBQ2pDLEtBQUMsU0FBUyxJQUFJLEtBQUs7b0JBRUssS0FBQyxTQUFTLE9BQU8sSUFBRSxNQUFNLFNBQVM7O29CQUExRCxLQUFDLGNBQWM7OztZQUVuQixLQUFLLEtBQUs7O2VBRWQsS0FBQyxPQUFPOzs7c0JBRVosNEJBQWU7Ozs7UUFFWCxXQUFXOzRCQUVLO2FBQVA7O1lBQUw7WUFDQSxNQUFNLEtBQUMsU0FBUyxJQUFJO2lCQUNDOztnQkFBckIsS0FBSyxJQUFJLEtBQUs7OztlQUVsQixLQUFDLFdBQVc7OztzQkFFaEIsc0JBQVMsTUFBSzs7OztRQUVWLE1BQU0sTUFBTSxTQUFTLE1BQU0sS0FBSztRQUNoQyxLQUFDLE9BQU8sS0FBQyxLQUFLLFFBQVE7ZUFDdEIsS0FBQyxTQUFTLElBQUksS0FBSzs7O3NCQUV2QiwwQkFBYSxPQUFNOzs7OzRCQUVIOzs7WUFBUjtZQUNBLEtBQUMsUUFBUSxLQUFLOzs7O3NCQUV0Qix1QkFBVSxHQUFFOzs7OzRCQUVHLEtBQUMsS0FBSzs7O1lBQWI7aUJBQ0csSUFBSSxTQUFTLEtBQUEsSUFBSSxJQUFJLFFBQU0sSUFBSTs7dUJBQzVCLElBQUk7OztlQUNkOzs7c0JBRUoseUJBQVk7Ozs7UUFFUjs0QkFDVyxLQUFDLEtBQUs7OztZQUFiOzJCQUNJLElBQUssSUFBSSxhQUFRLElBQUksUUFBTSxJQUFJLDBCQUFkLElBQUksUUFBTSxJQUFJLGFBQWQsSUFBSSxRQUFNLElBQUk7O2dCQUMvQixRQUFRLEtBQUssSUFBSTs7O2VBQ3pCOzs7c0JBRUosMkJBQWMsR0FBRTs7OztRQUNaLFNBQVMsS0FBSyxVQUFRLEtBQUssV0FBUyxLQUFLLGFBQVc7OEJBQ3pDLEtBQUMsS0FBSzs7O1lBQWI7dUJBQ1UsSUFBSSxLQUFROzt1QkFBcEI7OztlQUNOOzs7c0JBRUosdUJBQVUsR0FBRTs7Ozs4QkFFRyxLQUFDLEtBQUs7OztZQUFiO2lCQUNVLElBQUksZUFBSixJQUFJLEtBQU0sTUFBTSxLQUFLLFNBQVM7O3VCQUF0Qzs7O2VBQ047OztzQkFFSix1QkFBVSxHQUFFLEdBQUU7Ozs7WUFFUCxLQUFDOzttQkFBUyxLQUFDLGFBQWEsRUFBRTs7Y0FFdEI7O2dCQUNLLFVBQUw7O2dCQUNDLE9BQU8sS0FBQyxTQUFTLEVBQUU7Ozs7Z0JBRW5CLE9BQU87OzswQkFFZixNQUFNLE9BQU8sNkJBQVMsSUFBSSxFQUFFOzs7c0JBRWhDLDJCQUFjLEdBQUU7Ozs7NEJBRUQsS0FBQyxPQUFPOzs7WUFBZjtnQkFDRyxJQUFJLEtBQUs7O3FCQUNMLElBQUk7O3dCQUNBLElBQUksSUFBSSxJQUFJLElBQUk7OytCQUNiLElBQUk7Ozs7OzJCQUVSLElBQUk7Ozs7Z0JBRWpCLElBQUksRUFBRTs7O3NCQUVYLHNCQUFTLEdBQUUsR0FBRSxNQUFLOztRQUVkLFFBQUEsZUFBQSxPQUFRLEtBQUMsU0FBUyxFQUFFO21CQUNYLFNBQVk7O21CQUFuQjs7ZUFDRjs7O1dBNUlQOzs7ZUE4SU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/syntax.kode
