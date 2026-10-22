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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1bWJzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvY3J1bWJzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FXYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFBOzs7QUFFVixVQUFUOzt1QkFBd0I7YUFFcEIsUUFBRyxRQUFPOzs7OzsrQ0FFQSxPQUFPO1FBRWIsS0FBQyxjQUFjO1FBQ2YsS0FBQyxVQUFVO1FBRVgsS0FBQyxTQUFTLFFBQWMsTUFBTSxNQUFNO1FBQ3BDLEtBQUMsU0FBUyxLQUFjLE1BQU0sT0FBTztRQUNyQyxLQUFDLFNBQVMsS0FBYyxNQUFNLE9BQU87UUFDckMsS0FBQyxTQUFTLFFBQWMsTUFBTSxPQUFPOzs7c0JBRXpDLHVCQUFVLEtBQUk7O2dCQUVIOztpQkFDSDtnQkFDSSxLQUFDLFNBQVMsYUFBYztnQkFDeEIsS0FBQyxTQUFTLGNBQWM7Ozs7bURBRTFCLElBQUk7OztzQkFFZCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7MENBRUosRUFBRSxFQUFFLEVBQUU7O2VBRVosS0FBQzs7O3NCQVFMOzs7O1lBRVUsS0FBQzs7OztzQkFDSyxLQUFDOzs7O1FBRWI7dUJBQ0ksSUFBSyxTQUFJLEtBQUMsTUFBTSwwQkFBUCxLQUFDLE1BQU0sYUFBUCxLQUFDLE1BQU07O2dCQUNiLE1BQUssS0FBQzs7Z0JBQ0wsT0FBTyxLQUFLLEtBQUMsTUFBTTs7OztnQkFFbkIsT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sR0FBRyxNQUFJLE9BQUssSUFBRSxLQUFHLEtBQUMsTUFBTTs7O3VCQUU1RCxJQUFLLFNBQUksS0FBQyxRQUFRLDBCQUFULEtBQUMsUUFBUSxhQUFULEtBQUMsUUFBUTs7WUFFbEIsS0FBSyxLQUFDLGdCQUFnQjtZQUN0QixLQUFLLE9BQU87WUFDWixLQUFLLEtBQUMsUUFBUTt1QkFFWCxHQUFNOztnQkFDTCxLQUFLO2dCQUNMLE1BQUssS0FBSyxJQUFJLE9BQU8sS0FBRyxLQUFLLEtBQUMsTUFBTTtvQkFDVCxNQUFLLEtBQUMsUUFBUSxTQUFPOztvQkFBaEQsS0FBSyxLQUFDLE1BQU07O2dCQUNaLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUc7Ozs7b0JBRWxCLE9BQU0sS0FBQzs7b0JBQ04sS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRzs7eUJBQ3JDLEtBQUssS0FBQyxNQUFNLFNBQU87O29CQUN2QixLQUFLLE1BQU0sT0FBTyxLQUFDLE1BQU0sV0FBTyxHQUFHLEtBQUcsS0FBRyxLQUFDLE1BQU07Ozs7b0JBRWhELEtBQUssTUFBTSxTQUFTLEtBQUMsTUFBTTs7Z0JBRS9CLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUc7Ozs7O3NCQVFqQyw4QkFBaUI7Ozs7UUFFYixLQUFLO3VCQUNELEtBQU0sU0FBSSxLQUFDLE1BQU0sMkJBQVAsS0FBQyxNQUFNLGNBQVAsS0FBQyxNQUFNOztZQUNqQixNQUFNLEtBQUMsTUFBTSxJQUFJLFNBQVM7Z0JBQ3ZCLEtBQUs7O3VCQUNEOzs7ZUFDWCxLQUFDLE1BQU0sU0FBTzs7O3NCQUVsQiwrQkFBa0I7Ozs7UUFFZCxLQUFLLEtBQUs7dUJBRU4sSUFBSyxTQUFHLHdCQUFBLFdBQUE7O2dCQUNMLElBQUk7O2dCQUNILE1BQU0sS0FBQyxNQUFNLEdBQUcsU0FBUzs7WUFDN0IsTUFBTSxLQUFDLE1BQU0sR0FBRyxTQUFTOztnQkFFNUIsR0FBRzs7O3NCQUVSLCtCQUFrQjs7OztRQUVkLE9BQU8sTUFBTSxLQUFLLE1BQU0sS0FBSyxLQUFDLFlBQU0sVUFBRyxtQkFBQTtRQUN2QyxPQUFPLE1BQU0sS0FBSyxLQUFDLEtBQUs7cUJBQ0MsS0FBSyxHQUFNOztZQUFwQyxPQUFPLE1BQU07O2VBQ2I7OztzQkFRSjs7OztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDLGtCQUFELEtBQUMsMkJBQVE7WUFFTixLQUFDLFNBQVE7O1lBQ1IsS0FBQyxVQUFVOzs7UUFHZixLQUFDLFFBQVEsTUFBTSxNQUFNLEtBQUM7YUFFZixLQUFDOzt5QkFDa0IsS0FBQyxNQUFNLEdBQVU7O2dCQUF2QyxLQUFDLE1BQU0sUUFBUTs7O1FBRW5CLEtBQUM7UUFFRCxLQUFDLFVBQVUsS0FBQyxNQUFNLEtBQUs7ZUFFakIsS0FBQyxNQUFNLFNBQVMsS0FBTSxLQUFDLFFBQVEsU0FBUyxLQUFDLE1BQU0sT0FBSzs7WUFDdEQsS0FBQyxLQUFLLEtBQUssS0FBQyxNQUFNO1lBQ2xCLEtBQUMsVUFBVSxLQUFDLE1BQU0sS0FBSzs7UUFFM0IsS0FBQyxPQUFPLEtBQUMsS0FBSyxLQUFLO1FBRW5CLFdBQVUsS0FBQyxtQkFBZSxLQUFDLE1BQU0sT0FBSyxJQUFFLEtBQUMsUUFBUSxVQUFVO2VBRTNELEtBQUMsVUFBVSxNQUFNLEtBQUMsVUFBVSxVQUFVOzs7c0JBRTFDLGtCQUFLOztRQUVELEtBQUMsTUFBTSxPQUFPO1FBQ2QsS0FBQyxnQkFBWTtlQUNiLEtBQUM7OztzQkFFTCxtQkFBTTs7ZUFBUSxLQUFDLElBQUksTUFBTSxNQUFNOzs7c0JBQy9COztlQUFZLEtBQUMsTUFBTSxPQUFPOzs7c0JBUTFCLDJCQUFjOzs7O1FBRVYsUUFBUSxLQUFDO2VBQ1QsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFDLGlCQUFpQixRQUFPLE1BQU0sTUFBTSxLQUFLLEtBQUMsaUJBQWlCOzs7c0JBRXZGLHNCQUFTOzs7O2tCQUVPLEtBQUMsU0FBUyxRQUFyQixjQUFJOzsyQ0FFQzthQUVDLEtBQUM7O2lCQUNELEtBQUM7O3VCQUNPLEtBQUM7dUJBQ0w7Ozs7Z0JBR0osTUFBTTs7aUJBRVQ7Z0JBRUksS0FBSyxLQUFDLGdCQUFnQjtxQkFDbkIsS0FBSyxLQUFDLGNBQUQsS0FBQyxhQUFhLEtBQUMsTUFBTTs7b0JBQ3pCLE9BQU8sS0FBQyxpQkFBaUIsS0FBQztvQkFDMUIsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFLOzt3QkFDN0IsT0FBTzs7aUJBRWQ7Z0JBRUksUUFBUSxLQUFDLGdCQUFnQjtvQkFDdEIsS0FBQyxlQUFjOztvQkFDZCxLQUFDLGFBQWE7b0JBQ2QsS0FBQyxLQUFLLFNBQVMsUUFBUSxLQUFDLGlCQUFpQixRQUFPLE1BQU0sTUFBTSxLQUFLLEtBQUMsaUJBQWlCOzRCQUNoRixPQUFPOzs7OztlQUV0QixLQUFDOzs7V0ExTEE7OztlQTRMRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/crumbs.kode
