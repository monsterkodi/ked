var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var crumbs

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


crumbs = (function ()
{
    _k_.extend(crumbs, view)
    function crumbs (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
        this.pointerType = 'pointer'
        this.rounded = ''
        this.setColor('hover',theme.hover.bg)
        this.setColor('bg',theme.crumbs.bg)
        this.setColor('fg',theme.crumbs.fg)
        this.setColor('empty',theme.editor.bg)
    }

    crumbs.prototype["setColor"] = function (key, color)
    {
        switch (key)
        {
            case 'empty':
                this.setColor('empty_left',color)
                this.setColor('empty_right',color)
                break
        }

        return crumbs.__super__.setColor.call(this,key,color)
    }

    crumbs.prototype["layout"] = function (x, y, w, h)
    {
        crumbs.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    crumbs.prototype["draw"] = function ()
    {
        var bg, ch, colors, fg, i, si, x

        if (this.hidden())
        {
            return
        }
        if (_k_.empty(this.rounded))
        {
            return
        }
        colors = []
        for (var _a_ = i = 0, _b_ = this.split.length; (_a_ <= _b_ ? i < this.split.length : i > this.split.length); (_a_ <= _b_ ? ++i : --i))
        {
            if (i === this.hoverIndex)
            {
                colors.push(this.color.hover)
            }
            else
            {
                colors.push(color.darken(this.color.bg,0.4 + 0.6 * (i + 1) / this.split.length))
            }
        }
        for (var _c_ = x = 0, _d_ = this.rounded.length; (_c_ <= _d_ ? x < this.rounded.length : x > this.rounded.length); (_c_ <= _d_ ? ++x : --x))
        {
            si = this.splitIndexAtCol(x)
            bg = colors[si]
            ch = this.rounded[x]
            if (_k_.in(ch,''))
            {
                fg = bg
                bg = (si > 0 ? colors[si - 1] : this.color.empty_left)
                if (x === this.rounded.length - 1)
                {
                    bg = this.color.empty_right
                }
                this.cells.set(x,0,ch,fg,bg)
            }
            else
            {
                if (si === this.hoverIndex)
                {
                    fg = color.adjustForBackground(this.color.fg,bg)
                }
                else if (si < this.split.length - 1)
                {
                    fg = color.darken(this.color.fg,_k_.min(1,(si + 3) / this.split.length))
                }
                else
                {
                    fg = color.brighten(this.color.fg)
                }
                this.cells.set(x,0,ch,fg,bg)
            }
        }
    }

    crumbs.prototype["splitIndexAtCol"] = function (col)
    {
        var si, sl

        sl = 0
        for (var _a_ = si = 0, _b_ = this.split.length; (_a_ <= _b_ ? si < this.split.length : si > this.split.length); (_a_ <= _b_ ? ++si : --si))
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
        for (var _a_ = i = 0, _b_ = idx; (_a_ <= _b_ ? i <= idx : i >= idx); (_a_ <= _b_ ? ++i : --i))
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

        path = slash.path.apply(null,this.split.slice(0, typeof idx === 'number' ? idx+1 : Infinity))
        path = slash.path(this.root,path)
        if (!(_k_.in(path[0],'~/')))
        {
            path = '/' + path
        }
        return path
    }

    crumbs.prototype["adjustText"] = function ()
    {
        var padding, _127_14_

        if (this.hidden())
        {
            return
        }
        this.path = ((_127_14_=this.path) != null ? _127_14_ : '')
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
        padding = (this.padLast ? _k_.lpad(this.cells.cols - 2 - this.rounded.length) : '')
        return this.rounded = '' + this.rounded + padding + ''
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
        var col, index, path, row, si, _179_26_

        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1bWJzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvY3J1bWJzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBZVMsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBTzs7Ozs7K0NBRUEsT0FBTztRQUViLEtBQUMsY0FBYztRQUNmLEtBQUMsVUFBVTtRQUVYLEtBQUMsU0FBUyxRQUFjLE1BQU0sTUFBTTtRQUNwQyxLQUFDLFNBQVMsS0FBYyxNQUFNLE9BQU87UUFDckMsS0FBQyxTQUFTLEtBQWMsTUFBTSxPQUFPO1FBQ3JDLEtBQUMsU0FBUyxRQUFjLE1BQU0sT0FBTzs7O3NCQUV6Qyx1QkFBVSxLQUFJOztnQkFFSDs7aUJBQ0g7Z0JBQ0ksS0FBQyxTQUFTLGFBQWM7Z0JBQ3hCLEtBQUMsU0FBUyxjQUFjOzs7O21EQUUxQixJQUFJOzs7c0JBRWQscUJBQVEsR0FBRSxHQUFFLEdBQUU7OzBDQUVKLEVBQUUsRUFBRSxFQUFFOztlQUVaLEtBQUM7OztzQkFRTDs7OztZQUVVLEtBQUM7Ozs7c0JBQ0ssS0FBQzs7OztRQUViO3VCQUNJLElBQUssU0FBSSxLQUFDLE1BQU0sMEJBQVAsS0FBQyxNQUFNLGFBQVAsS0FBQyxNQUFNOztnQkFDYixNQUFLLEtBQUM7O2dCQUNMLE9BQU8sS0FBSyxLQUFDLE1BQU07Ozs7Z0JBRW5CLE9BQU8sS0FBSyxNQUFNLE9BQU8sS0FBQyxNQUFNLEdBQUcsTUFBSSxPQUFLLElBQUUsS0FBRyxLQUFDLE1BQU07Ozt1QkFFNUQsSUFBSyxTQUFJLEtBQUMsUUFBUSwwQkFBVCxLQUFDLFFBQVEsYUFBVCxLQUFDLFFBQVE7O1lBRWxCLEtBQUssS0FBQyxnQkFBZ0I7WUFDdEIsS0FBSyxPQUFPO1lBQ1osS0FBSyxLQUFDLFFBQVE7dUJBRVgsR0FBTTs7Z0JBQ0wsS0FBSztnQkFDTCxNQUFLLEtBQUssSUFBSSxPQUFPLEtBQUcsS0FBSyxLQUFDLE1BQU07b0JBQ1QsTUFBSyxLQUFDLFFBQVEsU0FBTzs7b0JBQWhELEtBQUssS0FBQyxNQUFNOztnQkFDWixLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHOzs7O29CQUVsQixPQUFNLEtBQUM7O29CQUNOLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUc7O3lCQUNyQyxLQUFLLEtBQUMsTUFBTSxTQUFPOztvQkFDdkIsS0FBSyxNQUFNLE9BQU8sS0FBQyxNQUFNLFdBQU8sR0FBRyxLQUFHLEtBQUcsS0FBQyxNQUFNOzs7O29CQUVoRCxLQUFLLE1BQU0sU0FBUyxLQUFDLE1BQU07O2dCQUUvQixLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHOzs7OztzQkFRakMsOEJBQWlCOzs7O1FBRWIsS0FBSzt1QkFDRCxLQUFNLFNBQUksS0FBQyxNQUFNLDJCQUFQLEtBQUMsTUFBTSxjQUFQLEtBQUMsTUFBTTs7WUFDakIsTUFBTSxLQUFDLE1BQU0sSUFBSSxTQUFTO2dCQUN2QixLQUFLOzt1QkFDRDs7O2VBQ1gsS0FBQyxNQUFNLFNBQU87OztzQkFFbEIsK0JBQWtCOzs7O1FBRWQsS0FBSyxLQUFLO3VCQUVOLElBQUssU0FBRyx3QkFBQSxXQUFBOztnQkFDTCxJQUFJOztnQkFDSCxNQUFNLEtBQUMsTUFBTSxHQUFHLFNBQVM7O1lBQzdCLE1BQU0sS0FBQyxNQUFNLEdBQUcsU0FBUzs7Z0JBRTVCLEdBQUc7OztzQkFFUiwrQkFBa0I7Ozs7UUFFZCxPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssS0FBQyxZQUFNLFVBQUcsbUJBQUE7UUFDdkMsT0FBTyxNQUFNLEtBQUssS0FBQyxLQUFLO3FCQUNDLEtBQUssR0FBTTs7WUFBcEMsT0FBTyxNQUFNOztlQUNiOzs7c0JBUUo7Ozs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQyxrQkFBRCxLQUFDLDJCQUFRO1lBRU4sS0FBQyxTQUFROztZQUNSLEtBQUMsVUFBVTs7O1FBR2YsS0FBQyxRQUFRLE1BQU0sTUFBTSxLQUFDO2FBRWYsS0FBQzs7eUJBQ2tCLEtBQUMsTUFBTSxHQUFVOztnQkFBdkMsS0FBQyxNQUFNLFFBQVE7OztRQUVuQixLQUFDO1FBRUQsS0FBQyxVQUFVLEtBQUMsTUFBTSxLQUFLO2VBRWpCLEtBQUMsTUFBTSxTQUFTLEtBQU0sS0FBQyxRQUFRLFNBQVMsS0FBQyxNQUFNLE9BQUs7O1lBQ3RELEtBQUMsS0FBSyxLQUFLLEtBQUMsTUFBTTtZQUNsQixLQUFDLFVBQVUsS0FBQyxNQUFNLEtBQUs7O1FBRTNCLEtBQUMsT0FBTyxLQUFDLEtBQUssS0FBSztRQUVuQixXQUFVLEtBQUMsbUJBQWUsS0FBQyxNQUFNLE9BQUssSUFBRSxLQUFDLFFBQVEsVUFBVTtlQUUzRCxLQUFDLFVBQVUsTUFBTSxLQUFDLFVBQVUsVUFBVTs7O3NCQUUxQyxrQkFBSzs7UUFFRCxLQUFDLE1BQU0sT0FBTztRQUNkLEtBQUMsZ0JBQVk7ZUFDYixLQUFDOzs7c0JBRUwsbUJBQU07O2VBQVEsS0FBQyxJQUFJLE1BQU0sTUFBTTs7O3NCQUMvQjs7ZUFBWSxLQUFDLE1BQU0sT0FBTzs7O3NCQVExQiwyQkFBYzs7OztRQUVWLFFBQVEsS0FBQztlQUNULEtBQUMsS0FBSyxTQUFTLFFBQVEsS0FBQyxpQkFBaUIsUUFBTyxNQUFNLE1BQU0sS0FBSyxLQUFDLGlCQUFpQjs7O3NCQUV2RixzQkFBUzs7OztrQkFFTyxLQUFDLFNBQVM7OzJDQUVoQjthQUVDLEtBQUM7O2lCQUNELEtBQUM7O3VCQUNPLEtBQUM7dUJBQ0w7Ozs7Z0JBR0osTUFBTTs7aUJBRVQ7Z0JBRUksS0FBSyxLQUFDLGdCQUFnQjtxQkFDbkIsS0FBSyxLQUFDLGNBQUQsS0FBQyxhQUFhLEtBQUMsTUFBTTs7b0JBQ3pCLE9BQU8sS0FBQyxpQkFBaUIsS0FBQztvQkFDMUIsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFLOzt3QkFDN0IsT0FBTzs7aUJBRWQ7Z0JBRUksUUFBUSxLQUFDLGdCQUFnQjtvQkFDdEIsS0FBQyxlQUFjOztvQkFDZCxLQUFDLGFBQWE7b0JBQ2QsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFDLGlCQUFpQixRQUFPLE1BQU0sTUFBTSxLQUFLLEtBQUMsaUJBQWlCOzRCQUNoRixPQUFPOzs7OztlQUV0QixLQUFDOzs7V0ExTEE7OztlQTRMRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/crumbs.kode
