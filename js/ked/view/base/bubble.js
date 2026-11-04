var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var bubble

import kxk from "../../../kxk.js"
let slash = kxk.slash
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import syntax from "../../util/syntax.js"

import view from "../base/view.js"


bubble = (function ()
{
    _k_.extend(bubble, view)
    function bubble (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        bubble.__super__.constructor.call(this,screen,name)
        this.pointerType = 'pointer'
        this.syntax = new syntax
        this.syntax.setExt('noon')
        this.rounded = ''
        this.setColor('bg',theme.hover.blur)
        this.setColor('hover',theme.hover.bg)
        this.setColor('empty',theme.editor.bg)
    }

    bubble.prototype["draw"] = function ()
    {
        var bg, ch, fg, x

        if (this.hidden())
        {
            return
        }
        bubble.__super__.draw.call(this)
        bg = (this.hover ? this.color.hover : this.color.bg)
        var list = _k_.list(this.rounded)
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            if (_k_.in(ch,''))
            {
                this.cells.set(x,0,ch,bg,this.color.empty)
            }
            else
            {
                fg = this.syntax.getColor(x,0)
                this.cells.set(x,0,ch,fg,bg)
                if (this.hover)
                {
                    this.cells.adjustContrastForHighlight(x,0,bg)
                }
            }
        }
    }

    bubble.prototype["set"] = function (item)
    {
        this.item = item
    
        var _48_28_, _48_42_

        if (_k_.empty(this.item))
        {
            return this.rounded = ''
        }
        else
        {
            ;(typeof this.syntax.setSegls === "function" ? this.syntax.setSegls(((_48_42_=this.item.segls) != null ? _48_42_ : [kseg(item.tilde)])) : undefined)
            return this.rounded = '' + this.item.tilde + ''
        }
    }

    bubble.prototype["onMouseEnter"] = function (event)
    {
        this.emit('action','enter')
        return bubble.__super__.onMouseEnter.call(this,event)
    }

    bubble.prototype["onMouse"] = function (event)
    {
        bubble.__super__.onMouse.call(this,event)
    
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.emit('action','click',this.item)
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    return bubble
})()

export default bubble;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnViYmxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2Jhc2UvYnViYmxlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUOztPQUNTLGFBQVI7O09BQ1EsV0FBWjs7O0FBQ04sVUFBRDs7dUJBQVE7YUFPSixRQUFHLFFBQU87Ozs7K0NBRUEsT0FBTztRQUViLEtBQUMsY0FBYztRQUNmLEtBQUMsYUFBYTtRQUNkLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQyxVQUFVO1FBRVgsS0FBQyxTQUFTLEtBQVEsTUFBTSxNQUFNO1FBQzlCLEtBQUMsU0FBUyxRQUFRLE1BQU0sTUFBTTtRQUM5QixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87OztzQkFFbkM7Ozs7WUFFVSxLQUFDOzs7OztRQUlQLE1BQUssS0FBQyxRQUFRLEtBQUMsTUFBTSxRQUFRLEtBQUMsTUFBTTs0QkFFeEIsS0FBQzthQUFOOztZQUFIO3VCQUNHLEdBQU07O2dCQUNMLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUcsS0FBQyxNQUFNOzs7O2dCQUU1QixLQUFLLEtBQUMsT0FBTyxTQUFTLEVBQUU7Z0JBQ3hCLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUc7b0JBQ3VCLEtBQUM7O29CQUE3QyxLQUFDLE1BQU0sMkJBQTJCLEVBQUUsRUFBRTs7Ozs7O3NCQUVsRCxrQkFBTTs7UUFBRDs7OztzQkFFUSxLQUFDOzttQkFDTixLQUFDLFVBQVU7Ozs7cUJBRVgsS0FBQyxPQUFPLDBCQUFSLEtBQUMsT0FBTyxtQkFBVSxLQUFDLEtBQUssNEJBQVMsS0FBSyxLQUFLO21CQUMzQyxLQUFDLFVBQVUsTUFBTSxLQUFDLEtBQUssUUFBUTs7OztzQkFFdkMsMkJBQWM7O1FBRVYsS0FBQyxLQUFLLFNBQVM7dURBQ1Q7OztzQkFFVixzQkFBUzs7MkNBRUM7O2dCQUVDLE1BQU07O2lCQUVUO29CQUVPLEtBQUM7O29CQUNBLEtBQUMsS0FBSyxTQUFTLFFBQVEsS0FBQzs0QkFDckIsT0FBTzs7Ozs7ZUFFdEIsS0FBQzs7O1dBOURSOzs7ZUFnRU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/bubble.kode
