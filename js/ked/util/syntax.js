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
        this.hash = {}
        return this.liha = {}
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
        var ds, dss, hsh, idx, segl, segs

        if (!_k_.empty(this.config))
        {
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
                hsh = kseg.hash(segl)
                this.hash[hsh] = this.diss[idx]
                this.liha[idx] = hsh
            }
        }
    }

    syntax.prototype["partialUpdate"] = function (segls)
    {
        var hsh, idx, newHash, segl

        if (this.diss.length !== segls.length)
        {
            return
        }
        if (_k_.empty(this.hash))
        {
            return
        }
        newHash = {}
        var list = _k_.list(segls)
        for (idx = 0; idx < list.length; idx++)
        {
            segl = list[idx]
            hsh = kseg.hash(segl)
            if (this.hash[hsh])
            {
                newHash[hsh] = this.hash[hsh]
            }
            else
            {
                newHash[hsh] = kulur.dissect([segl],this.ext)[0]
            }
            if (this.liha[idx] !== hsh)
            {
                this.diss.splice(idx,1,newHash[hsh])
                this.liha[idx] = hsh
            }
        }
        return this.hash = newHash
    }

    syntax.prototype["addSegl"] = function (segl, ext)
    {
        return this.diss = this.diss.concat(kulur.dissect([segl],ext))
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
        var dss, pclss, _120_28_

        pclss = [clss,"text " + clss,"punct " + clss]
        var list = ((_120_28_=this.diss[y]) != null ? _120_28_ : [])
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
        var dss, _126_28_, _127_30_

        var list = ((_126_28_=this.diss[y]) != null ? _126_28_ : [])
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
        var _146_27_

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
        return ((_146_27_=theme.syntax[clss]) != null ? _146_27_ : [255,0,0])
    }

    syntax.prototype["getAnsiColor"] = function (x, y)
    {
        var clr, _158_24_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUWtCLGFBQVI7T0FBZSxXQUFmO09BQW9CLFdBQXBCOztPQUNRLFlBQVI7O09BQ1EsWUFBWDs7O0FBRUUsVUFBVDs7YUFFSSxRQUFJOztRQUFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE1BQU87UUFDUixLQUFDOzs7c0JBRUw7O1FBRUksS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7c0JBRUwscUJBQVM7O1FBQUQ7O2VBQVEsS0FBQyxPQUFPOzs7c0JBRXhCLHNCQUFTOztlQUFRLEtBQUMsU0FBUyxPQUFPLE9BQU8sS0FBSzs7O3NCQUU5Qyx1QkFBVTs7ZUFBUyxLQUFDLFNBQVMsS0FBSyxNQUFNOzs7c0JBRXhDLHdCQUFZOztRQUFEOztlQUFXLEtBQUMsT0FBTzs7O3NCQVE5Qix1QkFBVTs7Ozt1QkFFRyxLQUFDOztZQUNOLEtBQUM7Z0NBQ1c7OztnQkFBUjtnQkFDQSxNQUFNLE9BQU8sT0FBTyxLQUFDLE9BQU8sS0FBSyxJQUFJLE1BQU07cUNBQ2pDOzs7b0JBQU47d0JBQ2MsVUFBWCxHQUFHOzt3QkFDRixHQUFHLGdCQUFZLEdBQUcsS0FBSyxJQUFJLEtBQUssTUFBTSxLQUFLOzs7Z0JBQ25ELEtBQUMsS0FBSyxLQUFLOzs7OztnQkFFVixLQUFDLGNBQWM7Ozs7WUFFcEIsS0FBQztZQUVELEtBQUMsT0FBTyxNQUFNLFFBQVEsTUFBTSxLQUFDO2lDQUNiO2lCQUFQOztnQkFBTDtnQkFDQSxNQUFNLEtBQUssS0FBSztnQkFDaEIsS0FBQyxLQUFLLE9BQU8sS0FBQyxLQUFLO2dCQUNuQixLQUFDLEtBQUssT0FBTzs7Ozs7c0JBUXpCLDRCQUFlOzs7O1lBRU4sS0FBQyxLQUFLLFdBQVUsTUFBTTs7OztzQkFDaEIsS0FBQzs7OztRQUVaOzRCQUVnQjthQUFQOztZQUFMO1lBRUEsTUFBTSxLQUFLLEtBQUs7Z0JBQ2IsS0FBQyxLQUFLOztnQkFDTCxRQUFRLE9BQU8sS0FBQyxLQUFLOzs7O2dCQUVyQixRQUFRLE9BQU8sTUFBTSxTQUFTLE1BQU0sS0FBQyxLQUFLOztnQkFFM0MsS0FBQyxLQUFLLFNBQVE7O2dCQUNiLEtBQUMsS0FBSyxPQUFPLElBQUksRUFBRSxRQUFRO2dCQUMzQixLQUFDLEtBQUssT0FBTzs7O2VBRXJCLEtBQUMsT0FBTzs7O3NCQUVaLHNCQUFTLE1BQUs7O2VBRVYsS0FBQyxPQUFPLEtBQUMsS0FBSyxPQUFPLE1BQU0sU0FBUyxNQUFNOzs7c0JBRTlDLDBCQUFhLE9BQU07Ozs7NEJBRUg7OztZQUFSO1lBQ0EsS0FBQyxRQUFRLEtBQUs7Ozs7c0JBUXRCLHVCQUFVLEdBQUU7Ozs7NEJBRUcsS0FBQyxLQUFLOzs7WUFBYjtpQkFDRyxJQUFJLFNBQVMsS0FBQSxJQUFJLElBQUksUUFBTSxJQUFJOzt1QkFDNUIsSUFBSTs7O2VBQ2Q7OztzQkFFSix5QkFBWTs7OztRQUVSOzRCQUNXLEtBQUMsS0FBSzs7O1lBQWI7MkJBQ0ksSUFBSyxJQUFJLGFBQVEsSUFBSSxRQUFNLElBQUksMEJBQWQsSUFBSSxRQUFNLElBQUksYUFBZCxJQUFJLFFBQU0sSUFBSTs7Z0JBQy9CLFFBQVEsS0FBSyxJQUFJOzs7ZUFDekI7OztzQkFFSiwyQkFBYyxHQUFFOzs7O1FBQ1osU0FBUyxLQUFLLFVBQVEsS0FBSyxXQUFTOzhCQUN6QixLQUFDLEtBQUs7OztZQUFiO3VCQUNVLElBQUksS0FBUTs7dUJBQXBCOzs7ZUFDTjs7O3NCQUVKLHVCQUFVLEdBQUU7Ozs7OEJBRUcsS0FBQyxLQUFLOzs7WUFBYjtpQkFDVSxJQUFJLGVBQUosSUFBSSxLQUFNLE1BQU0sS0FBSyxTQUFTOzt1QkFBdEM7OztlQUNOOzs7c0JBUUosdUJBQVUsR0FBRSxHQUFFOzs7O1lBRVAsS0FBQzs7bUJBQVMsS0FBQyxhQUFhLEVBQUU7O2NBRXRCOztnQkFDSyxVQUFMOztnQkFDQyxPQUFPLEtBQUMsU0FBUyxFQUFFOzs7O2dCQUVuQixPQUFPOzs7MEJBRWYsTUFBTSxPQUFPLDZCQUFTLElBQUksRUFBRTs7O3NCQVFoQywyQkFBYyxHQUFFOzs7OzRCQUVELEtBQUMsT0FBTzs7O1lBQWY7Z0JBQ0csSUFBSSxLQUFLOztxQkFDTCxJQUFJOzt3QkFDQSxJQUFJLElBQUksSUFBSSxJQUFJOzsrQkFDYixJQUFJOzs7OzsyQkFFUixJQUFJOzs7O2dCQUVqQixJQUFJLEVBQUU7OztzQkFRWCxzQkFBUyxHQUFFLEdBQUUsTUFBSzs7UUFFZCxRQUFBLGVBQUEsT0FBUSxLQUFDLFNBQVMsRUFBRTttQkFDWCxTQUFZOzttQkFBbkI7O2VBQ0Y7OztXQW5LQzs7O2VBcUtGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/syntax.kode
