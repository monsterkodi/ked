var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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

    syntax.prototype["getColor"] = function (x, y, clss)
    {
        var _143_27_

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
        return ((_143_27_=theme.syntax[clss]) != null ? _143_27_ : [255,0,0])
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

    return syntax
})()

export default syntax;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFnQlEsS0FBQyxNQUFPO1FBQ1IsS0FBQzs7Ozs7UUFJRCxLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUM7Ozs7Ozs7ZUFFVyxLQUFDLE9BQU87Ozs7O2VBRVAsS0FBQyxTQUFTLE9BQU8sT0FBTyxLQUFLOzs7OztlQUUzQixLQUFDLFNBQVMsS0FBSyxNQUFNOzs7Ozs7O2VBRWxCLEtBQUMsT0FBTzs7Ozs7Ozt1QkFVakIsS0FBQzs7WUFDTixLQUFDO2dDQUNXOzs7O2dCQUNSLE1BQU0sT0FBTyxPQUFPLEtBQUMsT0FBTyxLQUFLLElBQUksTUFBTTtxQ0FDakM7Ozs7a0NBQ0gsR0FBRzs7d0JBQ0YsR0FBRyxnQkFBWSxHQUFHLEtBQUssSUFBSSxLQUFLLE1BQU0sS0FBSzs7O2dCQUNuRCxLQUFDLEtBQUssS0FBSzs7Ozs7Z0JBR1QsS0FBQyxjQUFjOzs7O1lBRXJCLEtBQUM7WUFFRCxLQUFDLE9BQU8sTUFBTSxRQUFRLE1BQU0sS0FBQztpQ0FDYjs7OztnQkFDWixNQUFNLEtBQUssS0FBSztnQkFDaEIsS0FBQyxLQUFLLE9BQU8sS0FBQyxLQUFLO2dCQUNuQixLQUFDLEtBQUssT0FBTzs7Ozs7Ozs7O1lBVWYsS0FBQyxLQUFLLFdBQVUsTUFBTTs7OztzQkFDaEIsS0FBQzs7OztRQUViOzRCQUVnQjs7OztZQUVaLE1BQU0sS0FBSyxLQUFLO2dCQUNiLEtBQUMsS0FBSzs7Z0JBQ0wsUUFBUSxPQUFPLEtBQUMsS0FBSzs7OztnQkFFckIsUUFBUSxPQUFPLE1BQU0sU0FBUyxNQUFNLEtBQUMsS0FBSzs7Z0JBRTNDLEtBQUMsS0FBSyxTQUFROztnQkFDYixLQUFDLEtBQUssT0FBTyxJQUFJLEVBQUUsUUFBUTtnQkFDM0IsS0FBQyxLQUFLLE9BQU87OztlQUVyQixLQUFDLE9BQU87Ozs7O2VBSVIsS0FBQyxPQUFPLEtBQUMsS0FBSyxPQUFPLE1BQU0sU0FBUyxNQUFNOzs7Ozs7OzRCQUs5Qjs7OztZQUNSLEtBQUMsUUFBUSxLQUFLOzs7Ozs7Ozs0QkFVUCxLQUFDLEtBQUs7Ozs7aUJBQ1YsSUFBSSxTQUFTLEtBQUEsSUFBSSxJQUFJLFFBQU0sSUFBSTs7dUJBQzNCLElBQUk7OztlQUNmOzs7Ozs7O1FBUUE7NEJBQ1csS0FBQyxLQUFLOzs7OytCQUNKLElBQUksYUFBUSxJQUFJLFFBQU0sSUFBSSwwQkFBZCxJQUFJLFFBQU0sSUFBSSxhQUFkLElBQUksUUFBTSxJQUFJOztnQkFDL0IsUUFBUSxLQUFLLElBQUk7OztlQUN6Qjs7Ozs7OztZQVVHLEtBQUM7O21CQUFVLEtBQUMsYUFBYSxFQUFFOztjQUV2Qjs7MEJBQ0E7O2dCQUNDLE9BQU8sS0FBQyxTQUFTLEVBQUU7Ozs7Z0JBRW5CLE9BQU87OzswQkFLZixNQUFNLE9BQU8sNkJBQVMsSUFBSSxFQUFFOzs7Ozs7OzRCQVVqQixLQUFDLE9BQU87Ozs7Z0JBQ1osSUFBSSxLQUFLOztxQkFDTCxJQUFJOzt3QkFDQSxJQUFJLElBQUksSUFBSSxJQUFJOzsrQkFDWixJQUFJOzs7OzsyQkFFUixJQUFJOzs7O2dCQUVsQixJQUFJLEVBQUU7Ozs7O1FBVVAsUUFBQSxlQUFBLE9BQVEsS0FBQyxTQUFTLEVBQUU7bUJBQ1gsU0FBWTs7bUJBQW5COztlQUNGOzs7Ozs7ZUFFRCJ9
//# sourceURL=kode/ked/util/syntax.kode
