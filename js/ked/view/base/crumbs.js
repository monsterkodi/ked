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
        for (i = 0; i < this.split.length; i++)
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
        for (x = 0; x < this.rounded.length; x++)
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
        var padding, _101_14_

        if (this.hidden())
        {
            return
        }
        this.path = ((_101_14_=this.path) != null ? _101_14_ : '')
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
        var col, index, path, row, si, _147_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1bWJzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvY3J1bWJzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFBOzs7QUFDbEIsVUFBRDs7dUJBQVE7YUFLSixRQUFHLFFBQU87Ozs7OytDQUVBLE9BQU87UUFFYixLQUFDLGNBQWM7UUFDZixLQUFDLFVBQVU7UUFFWCxLQUFDLFNBQVMsUUFBYyxNQUFNLE1BQU07UUFDcEMsS0FBQyxTQUFTLEtBQWMsTUFBTSxPQUFPO1FBQ3JDLEtBQUMsU0FBUyxLQUFjLE1BQU0sT0FBTztRQUNyQyxLQUFDLFNBQVMsUUFBYyxNQUFNLE9BQU87OztzQkFFekMsdUJBQVUsS0FBSTs7Z0JBRUg7O2lCQUNIO2dCQUNJLEtBQUMsU0FBUyxhQUFjO2dCQUN4QixLQUFDLFNBQVMsY0FBYzs7OzttREFFMUIsSUFBSTs7O3NCQUVkLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzswQ0FFSixFQUFFLEVBQUUsRUFBRTs7ZUFFWixLQUFDOzs7c0JBRUw7Ozs7WUFFUyxLQUFDOzs7O3NCQUNLLEtBQUM7Ozs7UUFFWjthQUNJLElBQUssT0FBSSxLQUFDLE1BQU07O2dCQUNiLE1BQUssS0FBQzs7Z0JBQ0wsT0FBTyxLQUFLLEtBQUMsTUFBTTs7OztnQkFFbkIsT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sR0FBRyxNQUFJLE9BQUssSUFBRSxLQUFHLEtBQUMsTUFBTTs7O2FBRTVELElBQUssT0FBSSxLQUFDLFFBQVE7O1lBRWxCLEtBQUssS0FBQyxnQkFBZ0I7WUFDdEIsS0FBSyxPQUFPO1lBQ1osS0FBSyxLQUFDLFFBQVE7dUJBRVgsR0FBTTs7Z0JBQ0wsS0FBSztnQkFDTCxNQUFLLEtBQUssSUFBSSxPQUFPLEtBQUcsS0FBSyxLQUFDLE1BQU07b0JBQ1QsTUFBSyxLQUFDLFFBQVEsU0FBTzs7b0JBQWhELEtBQUssS0FB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
//# sourceURL=../../../../kode/ked/view/base/crumbs.kode
