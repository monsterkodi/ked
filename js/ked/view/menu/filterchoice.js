var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var filterchoice

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import input from "../base/input.js"

import cells from "../screen/cells.js"

import choices from "../menu/choices.js"


filterchoice = (function ()
{
    _k_.extend(filterchoice, choices)
    function filterchoice (screen, name, features)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["drawFilter"] = this["drawFilter"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["isPlainAlphanumeric"] = this["isPlainAlphanumeric"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["toggleFilter"] = this["toggleFilter"].bind(this)
        this["hideFilter"] = this["hideFilter"].bind(this)
        this["showFilter"] = this["showFilter"].bind(this)
        this["filterVisible"] = this["filterVisible"].bind(this)
        this["setColor"] = this["setColor"].bind(this)
        filterchoice.__super__.constructor.call(this,screen,name,features)
        this.input = new input(this.screen,`${this.name}_input`)
        this.filterCells = new cells(this.screen)
        this.input.hide()
    }

    filterchoice.prototype["setColor"] = function (key, clr)
    {
        filterchoice.__super__.setColor.call(this,key,clr)
    
        if (key === 'bg' && this.input)
        {
            return this.input.setColor('bg_blur',this.color.bg)
        }
    }

    filterchoice.prototype["filterVisible"] = function ()
    {
        return this.input.visible()
    }

    filterchoice.prototype["showFilter"] = function ()
    {
        if (this.filterVisible())
        {
            return
        }
        this.input.show()
        return this.input.grabFocus()
    }

    filterchoice.prototype["hideFilter"] = function ()
    {
        if (!this.filterVisible())
        {
            return
        }
        this.input.set('')
        this.input.hide()
        return this.grabFocus()
    }

    filterchoice.prototype["toggleFilter"] = function ()
    {
        if (this.filterVisible())
        {
            return this.hideFilter()
        }
        else
        {
            return this.showFilter()
        }
    }

    filterchoice.prototype["hasFocus"] = function ()
    {
        return filterchoice.__super__.hasFocus.call(this) || (this.input && this.input.hasFocus())
    }

    filterchoice.prototype["isPlainAlphanumeric"] = function (event)
    {
        if (_k_.empty(event.char))
        {
            return false
        }
        return !_k_.empty(event.char.match(/^[a-zA-Z0-9]$/))
    }

    filterchoice.prototype["layout"] = function (x, y, w, h)
    {
        var fh

        if (this.filterVisible())
        {
            fh = _k_.min(3,h)
            this.filterCells.layout(x,y,w,fh)
            this.input.layout(x + 2,y + 1,w - 4,1)
            return filterchoice.__super__.layout.call(this,x,y + fh,w,h - fh)
        }
        else
        {
            return filterchoice.__super__.layout.call(this,x,y,w,h)
        }
    }

    filterchoice.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        filterchoice.__super__.draw.call(this)
        if (this.filterVisible())
        {
            return this.drawFilter()
        }
    }

    filterchoice.prototype["drawFilter"] = function ()
    {
        var cells, inner, outer

        cells = this.filterCells
        if (cells.rows < 1 || cells.cols < 1)
        {
            return
        }
        cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        outer = (this.input.hasFocus() ? color.brighten(this.color.bg) : this.color.bg)
        inner = (this.input.hasFocus() ? this.input.color.bg_focus : this.input.color.bg_blur)
        cells.draw_rounded_border(0,0,-1,2,{fg:outer})
        cells.draw_vertical_padding(1,1,outer,inner)
        cells.draw_vertical_padding(cells.cols - 2,1,inner,outer)
        return this.input.draw()
    }

    filterchoice.prototype["onKey"] = function (key, event)
    {
        if (this.filterVisible())
        {
            if (event.combo === 'esc')
            {
                this.hideFilter()
                return true
            }
            if (!this.input.hasFocus())
            {
                this.input.grabFocus()
            }
            if (this.input.onKey(key,event))
            {
                return true
            }
            return filterchoice.__super__.onKey.call(this,key,event)
        }
        if (this.isPlainAlphanumeric(event))
        {
            this.showFilter()
            this.input.onKey(key,event)
            return true
        }
        return filterchoice.__super__.onKey.call(this,key,event)
    }

    filterchoice.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.filterVisible() && this.filterCells.isInsideEvent(event))
        {
            if (event.type === 'press')
            {
                this.input.grabFocus()
            }
            ret = this.input.onMouse(event)
            if (ret)
            {
                return ret
            }
            return {redraw:true}
        }
        return filterchoice.__super__.onMouse.call(this,event)
    }

    return filterchoice
})()

export default filterchoice;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyY2hvaWNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmlsdGVyY2hvaWNlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxZQUFmOztPQUNlLFlBQWY7O09BQ2UsY0FBZjs7O0FBQ04sZ0JBQUQ7OzZCQUFjO2FBTVYsY0FBRyxRQUFPLE1BQUs7Ozs7Ozs7Ozs7Ozs7O3FEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFlBQWtCLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFDckMsS0FBQyxrQkFBa0IsTUFBTSxLQUFDO1FBRTFCLEtBQUMsTUFBTTs7OzRCQUVYLHVCQUFVLEtBQUk7O2tEQUVKLElBQUk7O1lBRVAsUUFBTyxRQUFTLEtBQUM7O21CQUNoQixLQUFDLE1BQU0sU0FBUyxVQUFVLEtBQUMsTUFBTTs7Ozs0QkFFekM7O2VBQWtCLEtBQUMsTUFBTTs7OzRCQUV6Qjs7WUFFVSxLQUFDOzs7O1FBRVAsS0FBQyxNQUFNO2VBQ1AsS0FBQyxNQUFNOzs7NEJBRVg7O2FBRWMsS0FBQzs7OztRQUVYLEtBQUMsTUFBTSxJQUFJO1FBQ1gsS0FBQyxNQUFNO2VBQ1AsS0FBQzs7OzRCQUVMOztZQUVPLEtBQUM7O21CQUFrQixLQUFDOzs7O21CQUNBLEtBQUM7Ozs7NEJBRTVCOzs4REFBeUIsS0FBQyxTQUFVLEtBQUMsTUFBTTs7OzRCQUUzQyxrQ0FBcUI7O3NCQUVBLE1BQU07O21CQUFyQjs7MEJBQ1EsTUFBTSxLQUFLLE1BQU07Ozs0QkFFL0IscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7WUFFUCxLQUFDOztZQUVBLGFBQVMsRUFBRTtZQUVYLEtBQUMsWUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFO1lBQzFCLEtBQUMsTUFBTSxPQUFhLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFOzJEQUUxQixFQUFFLElBQUUsR0FBRyxFQUFFLElBQUU7Ozs7MkRBSVgsRUFBRSxFQUFFLEVBQUU7Ozs7NEJBRXBCOztZQUVVLEtBQUM7Ozs7O1lBSVUsS0FBQzs7bUJBQWxCLEtBQUM7Ozs7NEJBRUw7Ozs7UUFFSSxRQUFRLEtBQUM7WUFFSCxNQUFNLE9BQU8sS0FBSyxNQUFNLE9BQU87Ozs7UUFFckMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUMsTUFBTTtRQUUxQyxTQUFRLEtBQUMsTUFBTSxhQUFhLE1BQU0sU0FBUyxLQUFDLE1BQU0sTUFBTSxLQUFDLE1BQU07UUFDL0QsU0FBUSxLQUFDLE1BQU0sYUFBYSxLQUFDLE1BQU0sTUFBTSxXQUFXLEtBQUMsTUFBTSxNQUFNO1FBRWpFLE1BQU0sb0JBQW9CLEVBQUUsRUFBRSxHQUFHLEdBQUUsR0FBRztRQUV0QyxNQUFNLHNCQUFzQixFQUFFLEVBQUUsTUFBTTtRQUN0QyxNQUFNLHNCQUFzQixNQUFNLE9BQUssRUFBRSxFQUFFLE1BQU07ZUFFakQsS0FBQyxNQUFNOzs7NEJBRVgsb0JBQU8sS0FBSTs7WUFFSixLQUFDOztnQkFFRyxNQUFNLFVBQVM7O2dCQUNkLEtBQUM7dUJBQ0M7O2lCQUVvQixLQUFDLE1BQU07O2dCQUFqQyxLQUFDLE1BQU07O2dCQUVKLEtBQUMsTUFBTSxNQUFNLElBQUk7O3VCQUNkOzswREFFRSxJQUFJOztZQUViLEtBQUMsb0JBQW9COztZQUVwQixLQUFDO1lBQ0QsS0FBQyxNQUFNLE1BQU0sSUFBSTttQkFDZjs7c0RBRUEsSUFBSTs7OzRCQUVkLHNCQUFTOzs7O1lBRUYsS0FBQyxtQkFBb0IsS0FBQyxZQUFZLGNBQWM7O2dCQUV6QixNQUFNLFNBQVE7O2dCQUFwQyxLQUFDLE1BQU07O1lBRVAsTUFBTSxLQUFDLE1BQU0sUUFBUTtnQkFDWjs7dUJBQVA7O29CQUVBLE9BQU87O3dEQUVQOzs7V0E5SGI7OztlQWdJTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/filterchoice.kode
