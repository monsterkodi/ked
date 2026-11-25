var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var crumbs

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import bubbles from "./bubbles.js"


crumbs = (function ()
{
    _k_.extend(crumbs, bubbles)
    function crumbs (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
        this.pointerType = 'pointer'
        this.rounded = ''
        this.padding = ''
        this.setColor('hover',theme.hover.bg)
        this.setColor('bg',theme.crumbs.bg)
        this.setColor('fg',theme.crumbs.fg)
    }

    crumbs.prototype["layout"] = function (x, y, w, h)
    {
        crumbs.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    crumbs.prototype["draw"] = function ()
    {
        var lsi

        if (this.hidden())
        {
            return
        }
        if (_k_.empty(this.rounded))
        {
            return
        }
        lsi = this.split.length - 1
        this.items = this.split.map((function (seg, si)
        {
            var bg, fg

            if (si === this.hoverIndex)
            {
                bg = this.color.hover
                fg = color.adjustForBackground(this.color.fg,bg)
            }
            else
            {
                bg = color.darken(this.color.bg,0.4 + 0.6 * (si + 1) / this.split.length)
                if (si < lsi)
                {
                    fg = color.darken(this.color.fg,_k_.min(1,(si + 3) / this.split.length))
                }
                else
                {
                    fg = color.brighten(this.color.fg)
                }
            }
            return {text:((si < lsi ? seg + ' ' : seg + this.padding)),fg:fg,bg:bg}
        }).bind(this))
        return crumbs.__super__.draw.call(this)
    }

    crumbs.prototype["splitIndexAtCol"] = function (col)
    {
        var si, sl

        sl = 0
        for (si = 0; si < this.split.length; si++)
        {
            sl += this.split[si].length + 2
            if (sl > col)
            {
                return si
            }
        }
        return this.split.length - 1
    }

    crumbs.prototype["colsAtSplitIndex"] = function (idx)
    {
        var ei, i, si

        si = ei = 0
        for (i = 0; i <= idx; i++)
        {
            if (i < idx)
            {
                si += this.split[i].length + 2
            }
            ei += this.split[i].length + 2
        }
        return [si,ei]
    }

    crumbs.prototype["pathAtSplitIndex"] = function (idx)
    {
        var path

        path = slash.path(...this.split.slice(0, typeof idx === 'number' ? idx+1 : Infinity))
        path = slash.path(this.root,path)
        if (!(_k_.in(path[0],'~/')))
        {
            path = '/' + path
        }
        return path
    }

    crumbs.prototype["adjustText"] = function ()
    {
        var _82_14_

        if (this.hidden())
        {
            return
        }
        this.path = ((_82_14_=this.path) != null ? _82_14_ : '')
        if (this.path === '')
        {
            this.rounded = ''
            return
        }
        this.split = slash.split(this.path)
        if (!this.dotlessRelative)
        {
            if (!(_k_.in(this.split[0],'~/.')))
            {
                this.split.unshift('/')
            }
        }
        this.root = []
        this.rounded = this.split.join(' ')
        while (this.split.length > 1 && this.rounded.length > this.cells.cols - 2)
        {
            this.root.push(this.split.shift())
            this.rounded = this.split.join(' ')
        }
        this.root = this.root.join('/')
        this.padding = (this.padLast ? _k_.lpad(this.cells.cols - 2 - this.rounded.length) : '')
        return this.rounded = '' + this.rounded + this.padding + ''
    }

    crumbs.prototype["set"] = function (path)
    {
        this.cells.rows = 1
        this.path = _k_.trim(path)
        return this.adjustText()
    }

    crumbs.prototype["show"] = function (path)
    {
        return this.set(slash.tilde(path))
    }

    crumbs.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    crumbs.prototype["onMouseLeave"] = function (event)
    {
        var index

        index = this.hoverIndex
        return this.emit('action','leave',this.pathAtSplitIndex(index),{index:index,cols:this.colsAtSplitIndex(index)})
    }

    crumbs.prototype["onMouse"] = function (event)
    {
        var col, index, path, row, si, _128_26_

        ;[col,row] = this.eventPos(event)
        crumbs.__super__.onMouse.call(this,event)
        if (!this.hover)
        {
            if ((this.hoverIndex != null))
            {
                delete this.hoverIndex
                return true
            }
            return
        }
        switch (event.type)
        {
            case 'press':
                si = this.splitIndexAtCol(col)
                if ((0 <= this.hoverIndex && this.hoverIndex < this.split.length))
                {
                    path = this.pathAtSplitIndex(this.hoverIndex)
                    this.emit('action','click',path,event)
                }
                return {redraw:true}

            case 'move':
                index = this.splitIndexAtCol(col)
                if (this.hoverIndex !== index)
                {
                    this.hoverIndex = index
                    this.emit('action','enter',this.pathAtSplitIndex(index),{index:index,cols:this.colsAtSplitIndex(index)})
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    return crumbs
})()

export default crumbs;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1bWJzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvY3J1bWJzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxjQUFBOzs7QUFDbEIsVUFBRDs7dUJBQVE7YUFLSixRQUFHLFFBQU87Ozs7OytDQUVBLE9BQU87UUFFYixLQUFDLGNBQWM7UUFDZixLQUFDLFVBQVU7UUFDWCxLQUFDLFVBQVU7UUFFWCxLQUFDLFNBQVMsUUFBYyxNQUFNLE1BQU07UUFDcEMsS0FBQyxTQUFTLEtBQWMsTUFBTSxPQUFPO1FBQ3JDLEtBQUMsU0FBUyxLQUFjLE1BQU0sT0FBTzs7O3NCQUV6QyxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7MENBRUosRUFBRSxFQUFFLEVBQUU7O2VBRVosS0FBQzs7O3NCQUVMOzs7O1lBRVMsS0FBQzs7OztzQkFDSyxLQUFDOzs7O1FBRVosTUFBTSxLQUFDLE1BQU0sU0FBTztRQUVwQixLQUFDLFFBQVEsS0FBQyxNQUFNLGVBQUssS0FBSTs7OztnQkFFbEIsT0FBTSxLQUFDOztnQkFDTixLQUFLLEtBQUMsTUFBTTtnQkFDWixLQUFLLE1BQU0sb0JBQW9CLEtBQUMsTUFBTSxHQUFHOzs7O2dCQUV6QyxLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sR0FBRyxNQUFJLE9BQUssS0FBRyxLQUFHLEtBQUMsTUFBTTtvQkFDL0MsS0FBSzs7b0JBQ0osS0FBSyxNQUFNLE9BQU8sS0FBQyxNQUFNLFdBQU8sR0FBRyxLQUFHLEtBQUcsS0FBQyxNQUFNOzs7O29CQUVoRCxLQUFLLE1BQU0sU0FBUyxLQUFDLE1BQU07OztvQkFFbkMsT0FBTSxLQUFLLE1BQU0sTUFBSSxNQUFNLE1BQUksS0FBQyxVQUFTLEdBQUcsR0FBRyxHQUFHOzs7OztzQkFJMUQsOEJBQWlCOzs7O1FBRWIsS0FBSzthQUNELEtBQU0sUUFBSSxLQUFDLE1BQU07O1lBQ2pCLE1BQU0sS0FBQyxNQUFNLElBQUksU0FBUztnQkFDdkIsS0FBSzs7dUJBQ0Y7OztlQUNWLEtBQUMsTUFBTSxTQUFPOzs7c0JBRWxCLCtCQUFrQjs7OztRQUVkLEtBQUssS0FBSzthQUVOLElBQUssUUFBRzs7Z0JBQ0wsSUFBSTs7Z0JBQ0gsTUFBTSxLQUFDLE1BQU0sR0FBRyxTQUFTOztZQUM3QixNQUFNLEtBQUMsTUFBTSxHQUFHLFNBQVM7O2dCQUU1QixHQUFHOzs7c0JBRVIsK0JBQWtCOzs7O1FBRWQsT0FBTyxNQUFNLFFBQUssS0FBQyxZQUFNLFVBQUcsbUJBQUE7UUFDNUIsT0FBTyxNQUFNLEtBQUssS0FBQyxLQUFLO3FCQUNDLEtBQUssR0FBTTs7WUFBcEMsT0FBTyxNQUFNOztlQUNiOzs7c0JBRUo7Ozs7WUFFUyxLQUFDOzs7O1FBRU4sS0FBQyxpQkFBRCxLQUFDLDBCQUFRO1lBRU4sS0FBQyxTQUFROztZQUNSLEtBQUMsVUFBVTs7O1FBR2YsS0FBQyxRQUFRLE1BQU0sTUFBTSxLQUFDO2FBRWYsS0FBQzs7eUJBQ2tCLEtBQUMsTUFBTSxHQUFVOztnQkFBdkMsS0FBQyxNQUFNLFFBQVE7OztRQUVuQixLQUFDO1FBRUQsS0FBQyxVQUFVLEtBQUMsTUFBTSxLQUFLO2VBRWpCLEtBQUMsTUFBTSxTQUFTLEtBQU0sS0FBQyxRQUFRLFNBQVMsS0FBQyxNQUFNLE9BQUs7O1lBQ3RELEtBQUMsS0FBSyxLQUFLLEtBQUMsTUFBTTtZQUNsQixLQUFDLFVBQVUsS0FBQyxNQUFNLEtBQUs7O1FBRTNCLEtBQUMsT0FBTyxLQUFDLEtBQUssS0FBSztRQUVuQixLQUFDLFdBQVUsS0FBQyxtQkFBZSxLQUFDLE1BQU0sT0FBSyxJQUFFLEtBQUMsUUFBUSxVQUFVO2VBRTVELEtBQUMsVUFBVSxNQUFNLEtBQUMsVUFBVSxLQUFDLFVBQVU7OztzQkFFM0Msa0JBQUs7O1FBRUQsS0FBQyxNQUFNLE9BQU87UUFDZCxLQUFDLGdCQUFZO2VBQ2IsS0FBQzs7O3NCQUVMLG1CQUFNOztlQUFRLEtBQUMsSUFBSSxNQUFNLE1BQU07OztzQkFDL0I7O2VBQVksS0FBQyxNQUFNLE9BQU87OztzQkFFMUIsMkJBQWM7Ozs7UUFFVixRQUFRLEtBQUM7ZUFDVCxLQUFDLEtBQUssU0FBUyxRQUFRLEtBQUMsaUJBQWlCLFFBQU8sTUFBTSxNQUFNLEtBQUssS0FBQyxpQkFBaUI7OztzQkFFdkYsc0JBQVM7Ozs7VUFFSixJQUFJLE9BQU8sS0FBQyxTQUFTOzJDQUVoQjthQUVDLEtBQUM7O2lCQUNELEtBQUM7O3VCQUNPLEtBQUM7dUJBQ047Ozs7Z0JBR0gsTUFBTTs7aUJBRVQ7Z0JBRUksS0FBSyxLQUFDLGdCQUFnQjtxQkFDbkIsS0FBSyxLQUFDLGNBQUQsS0FBQyxhQUFhLEtBQUMsTUFBTTs7b0JBQ3pCLE9BQU8sS0FBQyxpQkFBaUIsS0FBQztvQkFDMUIsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFLOzt3QkFDOUIsT0FBTzs7aUJBRWI7Z0JBRUksUUFBUSxLQUFDLGdCQUFnQjtvQkFDdEIsS0FBQyxlQUFjOztvQkFDZCxLQUFDLGFBQWE7b0JBQ2QsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFDLGlCQUFpQixRQUFPLE1BQU0sTUFBTSxLQUFLLEtBQUMsaUJBQWlCOzRCQUNqRixPQUFPOzs7OztlQUVyQixLQUFDOzs7V0FsSlI7OztlQW9KTSJ9
//# sourceURL=../../../../kode/ked/view/base/crumbs.kode
