var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var bubbles

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import view from "./view.js"


bubbles = (function ()
{
    _k_.extend(bubbles, view)
    bubbles["LEFT"] = ''
    bubbles["RIGHT"] = ''
    function bubbles (screen, name)
    {
        this["set"] = this["set"].bind(this)
        bubbles.__super__.constructor.call(this,screen,name)
        this.items = []
        this.pointRight = false
        this.padLast = false
        this.setColor('empty',theme.editor.bg)
    }

    bubbles.prototype["setColor"] = function (key, color)
    {
        switch (key)
        {
            case 'empty':
                this.setColor('empty_left',color)
                this.setColor('empty_right',color)
                break
        }

        return bubbles.__super__.setColor.call(this,key,color)
    }

    bubbles.prototype["set"] = function (items)
    {
        return this.items = (items != null ? items : [])
    }

    bubbles["width"] = function (items)
    {
        var item, w

        if (_k_.empty(items))
        {
            return 0
        }
        w = items.length
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            w += 1 + kseg.width(item.text)
        }
        return w
    }

    bubbles.prototype["width"] = function ()
    {
        return bubbles.width(this.items)
    }

    bubbles.prototype["draw"] = function ()
    {
        var i, item, lii, pad, seg, x

        if (this.hidden() || this.collapsed() || _k_.empty(this.items))
        {
            return
        }
        lii = this.items.length - 1
        pad = (this.padLast ? _k_.lpad(_k_.max(0,this.cells.cols - this.width())) : '')
        x = 0
        var list = _k_.list(this.items)
        for (i = 0; i < list.length; i++)
        {
            item = list[i]
            if (i === 0)
            {
                this.cells.set(x,0,bubbles.LEFT,item.bg,this.color.empty_left)
            }
            else if (this.pointRight)
            {
                this.cells.set(x,0,bubbles.RIGHT,this.items[i - 1].bg,item.bg)
            }
            else
            {
                this.cells.set(x,0,bubbles.LEFT,item.bg,this.items[i - 1].bg)
            }
            x += 1
            var list1 = _k_.list(kseg(item.text + ((i < lii ? ' ' : pad))))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                seg = list1[_b_]
                this.cells.set(x,0,kseg.str(seg),item.fg,item.bg)
                x += kseg.segWidth(seg)
            }
        }
        return this.cells.set(x,0,bubbles.RIGHT,this.items[this.items.length - 1].bg,this.color.empty_right)
    }

    return bubbles
})()

export default bubbles;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnViYmxlcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL2J1YmJsZXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTs7T0FDQSxZQUFUOztPQUNTLFdBQUE7OztBQUNsQixXQUFEOzt3QkFBUztJQVdMLFNBQUMsU0FBTztJQUNSLFNBQUMsVUFBTzthQUVSLFNBQUcsUUFBTzs7O2dEQUVBLE9BQU87UUFFYixLQUFDO1FBQ0QsS0FBQyxhQUFhO1FBQ2QsS0FBQyxVQUFhO1FBRWQsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPOzs7dUJBRW5DLHVCQUFVLEtBQUk7O2dCQUVIOztpQkFDSDtnQkFDSSxLQUFDLFNBQVMsYUFBYztnQkFDeEIsS0FBQyxTQUFTLGNBQWM7Ozs7b0RBRTFCLElBQUk7Ozt1QkFFZCxrQkFBSzs7ZUFBUyxLQUFDLFNBQVEsZ0JBQUE7OztJQUV2QixTQUFDLG9CQUFPOzs7O3NCQUVTOzttQkFBWDs7UUFDRixJQUFJLE1BQU07NEJBQ0U7OztZQUFSO1lBQ0EsS0FBSyxJQUFJLEtBQUssTUFBTSxLQUFLOztlQUM3Qjs7O3VCQUVKOztlQUFVLFFBQVEsTUFBTSxLQUFDOzs7dUJBRXpCOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUMseUJBQXFCLEtBQUM7Ozs7UUFFekMsTUFBTSxLQUFDLE1BQU0sU0FBTztRQUNwQixPQUFNLEtBQUMsMkJBQW1CLEVBQUUsS0FBQyxNQUFNLE9BQUssS0FBQyxZQUFZO1FBRXJELElBQUk7NEJBQ1UsS0FBQzthQUFOOztZQUFMO2dCQUNHLE1BQUs7O2dCQUNKLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxRQUFRLEtBQUssS0FBSyxHQUFHLEtBQUMsTUFBTTs7cUJBQ3ZDLEtBQUM7O2dCQUNMLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxRQUFRLE1BQU0sS0FBQyxNQUFNLElBQUUsR0FBRyxHQUFHLEtBQUs7Ozs7Z0JBRWpELEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxRQUFRLEtBQUssS0FBSyxHQUFHLEtBQUMsTUFBTSxJQUFFLEdBQUc7O1lBQ3BELEtBQUs7aUNBQ00sS0FBSyxLQUFLLFNBQVEsSUFBSSxNQUFNLE1BQU07OztnQkFBekM7Z0JBQ0EsS0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLEtBQUssSUFBSSxLQUFLLEtBQUssR0FBRyxLQUFLO2dCQUMxQyxLQUFLLEtBQUssU0FBUzs7O2VBRTNCLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxRQUFRLE1BQU0sS0FBQyxNQUFNLEtBQUMsTUFBTSxTQUFPLEdBQUcsR0FBRyxLQUFDLE1BQU07OztXQWpFdEU7OztlQW1FTSJ9
//# sourceURL=../../../../kode/ked/view/base/bubbles.kode
