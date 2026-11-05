var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        if (event.char)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyY2hvaWNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmlsdGVyY2hvaWNlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxZQUFmOztPQUNlLFlBQWY7O09BQ2UsY0FBZjs7O0FBQ04sZ0JBQUQ7OzZCQUFjO2FBTVYsY0FBRyxRQUFPLE1BQUs7Ozs7Ozs7Ozs7Ozs7cURBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsWUFBa0IsTUFBTSxLQUFDLFVBQVUsS0FBQztRQUNyQyxLQUFDLGtCQUFrQixNQUFNLEtBQUM7UUFFMUIsS0FBQyxNQUFNOzs7NEJBRVgsdUJBQVUsS0FBSTs7a0RBRUosSUFBSTs7WUFFUCxRQUFPLFFBQVMsS0FBQzs7bUJBQ2hCLEtBQUMsTUFBTSxTQUFTLFVBQVUsS0FBQyxNQUFNOzs7OzRCQUV6Qzs7ZUFBa0IsS0FBQyxNQUFNOzs7NEJBRXpCOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDLE1BQU07ZUFDUCxLQUFDLE1BQU07Ozs0QkFFWDs7YUFFYyxLQUFDOzs7O1FBRVgsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07ZUFDUCxLQUFDOzs7NEJBRUw7O1lBRU8sS0FBQzs7bUJBQWtCLEtBQUM7Ozs7bUJBQ0EsS0FBQzs7Ozs0QkFFNUI7OzhEQUF5QixLQUFDLFNBQVUsS0FBQyxNQUFNOzs7NEJBRTNDLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1lBRVAsS0FBQzs7WUFFQSxhQUFTLEVBQUU7WUFFWCxLQUFDLFlBQVksT0FBTyxFQUFFLEVBQUUsRUFBRTtZQUMxQixLQUFDLE1BQU0sT0FBYSxJQUFFLEVBQUUsSUFBRSxFQUFFLElBQUUsRUFBRTsyREFFMUIsRUFBRSxJQUFFLEdBQUcsRUFBRSxJQUFFOzs7OzJEQUlYLEVBQUUsRUFBRSxFQUFFOzs7OzRCQUVwQjs7WUFFVSxLQUFDOzs7OztZQUlVLEtBQUM7O21CQUFsQixLQUFDOzs7OzRCQUVMOzs7O1FBRUksUUFBUSxLQUFDO1lBRUgsTUFBTSxPQUFPLEtBQUssTUFBTSxPQUFPOzs7O1FBRXJDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFMUMsU0FBUSxLQUFDLE1BQU0sYUFBYSxNQUFNLFNBQVMsS0FBQyxNQUFNLE1BQU0sS0FBQyxNQUFNO1FBQy9ELFNBQVEsS0FBQyxNQUFNLGFBQWEsS0FBQyxNQUFNLE1BQU0sV0FBVyxLQUFDLE1BQU0sTUFBTTtRQUVqRSxNQUFNLG9CQUFvQixFQUFFLEVBQUUsR0FBRyxHQUFFLEdBQUc7UUFFdEMsTUFBTSxzQkFBc0IsRUFBRSxFQUFFLE1BQU07UUFDdEMsTUFBTSxzQkFBc0IsTUFBTSxPQUFLLEVBQUUsRUFBRSxNQUFNO2VBRWpELEtBQUMsTUFBTTs7OzRCQUVYLG9CQUFPLEtBQUk7O1lBRUosS0FBQzs7Z0JBRUcsTUFBTSxVQUFTOztnQkFDZCxLQUFDO3VCQUNDOztpQkFFb0IsS0FBQyxNQUFNOztnQkFBakMsS0FBQyxNQUFNOztnQkFFSixLQUFDLE1BQU0sTUFBTSxJQUFJOzt1QkFDZDs7MERBRUUsSUFBSTs7WUFFYixNQUFNOztZQUVMLEtBQUM7WUFDRCxLQUFDLE1BQU0sTUFBTSxJQUFJO21CQUNmOztzREFFQSxJQUFJOzs7NEJBRWQsc0JBQVM7Ozs7WUFFRixLQUFDLG1CQUFvQixLQUFDLFlBQVksY0FBYzs7Z0JBRXpCLE1BQU0sU0FBUTs7Z0JBQXBDLEtBQUMsTUFBTTs7WUFFUCxNQUFNLEtBQUMsTUFBTSxRQUFRO2dCQUNaOzt1QkFBUDs7b0JBRUEsT0FBTzs7d0RBRVA7OztXQXpIYjs7O2VBMkhNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/filterchoice.kode
