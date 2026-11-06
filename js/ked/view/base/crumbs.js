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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1bWJzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvY3J1bWJzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFBOzs7QUFDbEIsVUFBRDs7dUJBQVE7YUFLSixRQUFHLFFBQU87Ozs7OytDQUVBLE9BQU87UUFFYixLQUFDLGNBQWM7UUFDZixLQUFDLFVBQVU7UUFFWCxLQUFDLFNBQVMsUUFBYyxNQUFNLE1BQU07UUFDcEMsS0FBQyxTQUFTLEtBQWMsTUFBTSxPQUFPO1FBQ3JDLEtBQUMsU0FBUyxLQUFjLE1BQU0sT0FBTztRQUNyQyxLQUFDLFNBQVMsUUFBYyxNQUFNLE9BQU87OztzQkFFekMsdUJBQVUsS0FBSTs7Z0JBRUg7O2lCQUNIO2dCQUNJLEtBQUMsU0FBUyxhQUFjO2dCQUN4QixLQUFDLFNBQVMsY0FBYzs7OzttREFFMUIsSUFBSTs7O3NCQUVkLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzswQ0FFSixFQUFFLEVBQUUsRUFBRTs7ZUFFWixLQUFDOzs7c0JBRUw7Ozs7WUFFUyxLQUFDOzs7O3NCQUNLLEtBQUM7Ozs7UUFFWjt1QkFDSSxJQUFLLFNBQUksS0FBQyxNQUFNLDBCQUFQLEtBQUMsTUFBTSxhQUFQLEtBQUMsTUFBTTs7Z0JBQ2IsTUFBSyxLQUFDOztnQkFDTCxPQUFPLEtBQUssS0FBQyxNQUFNOzs7O2dCQUVuQixPQUFPLEtBQUssTUFBTSxPQUFPLEtBQUMsTUFBTSxHQUFHLE1BQUksT0FBSyxJQUFFLEtBQUcsS0FBQyxNQUFNOzs7dUJBRTVELElBQUssU0FBSSxLQUFDLFFBQVEsMEJBQVQsS0FBQyxRQUFRLGFBQVQsS0FBQyxRQUFROztZQUVsQixLQUFLLEtBQUMsZ0JBQWdCO1lBQ3RCLEtBQUssT0FBTztZQUNaLEtBQUssS0FBQyxRQUFRO3VCQUVYLEdBQU07O2dCQUNMLEtBQUs7Z0JBQ0wsTUFBSyxLQUFLLElBQUksT0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/crumbs.kode
