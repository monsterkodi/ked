var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var filterchoice

import kxk from "../../../kxk.js"
let krzl = kxk.krzl

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
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["selectMatch"] = this["selectMatch"].bind(this)
        this["selectFirstMatch"] = this["selectFirstMatch"].bind(this)
        this["selectIndex"] = this["selectIndex"].bind(this)
        this["matchIndices"] = this["matchIndices"].bind(this)
        this["hideFilter"] = this["hideFilter"].bind(this)
        this["showFilter"] = this["showFilter"].bind(this)
        this["filterVisible"] = this["filterVisible"].bind(this)
        this["setColor"] = this["setColor"].bind(this)
        filterchoice.__super__.constructor.call(this,screen,name,features)
        this.input = new input(this.screen,`${this.name}_input`)
        this.filterCells = new cells(this.screen)
        this.input.on('action',this.onInputAction)
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

    filterchoice.prototype["matchIndices"] = function (text)
    {
        var fuzz, idx, indices, item, matches

        indices = []
        if (_k_.empty(this.items))
        {
            return indices
        }
        if (_k_.empty(text))
        {
            var list = _k_.list(this.items)
            for (idx = 0; idx < list.length; idx++)
            {
                item = list[idx]
                indices.push(idx)
            }
            return indices
        }
        fuzz = new krzl({values:this.items,extract:this.extract})
        matches = fuzz.filter(text)
        var list1 = _k_.list(matches)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            item = list1[_b_]
            indices.push(this.items.indexOf(item))
        }
        indices.sort(function (a, b)
        {
            return a - b
        })
        return indices
    }

    filterchoice.prototype["selectIndex"] = function (index)
    {
        if (!((0 <= index && index < this.state.s.lines.length)))
        {
            return
        }
        this.state.selectLine(index)
        return this.state.setMainCursor(0,index)
    }

    filterchoice.prototype["selectFirstMatch"] = function (text)
    {
        var indices

        indices = this.matchIndices(text)
        if (_k_.empty(indices))
        {
            return
        }
        return this.selectIndex(indices[0])
    }

    filterchoice.prototype["selectMatch"] = function (direction)
    {
        var current, index, indices

        indices = this.matchIndices(this.input.current())
        if (_k_.empty(indices))
        {
            return
        }
        current = this.currentIndex()
        if (direction < 0)
        {
            var list = _k_.list(indices.reverse())
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                index = list[_a_]
                if (index < current)
                {
                    this.selectIndex(index)
                    return
                }
            }
        }
        else
        {
            var list1 = _k_.list(indices)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                index = list1[_b_]
                if (index > current)
                {
                    this.selectIndex(index)
                    return
                }
            }
        }
    }

    filterchoice.prototype["onInputAction"] = function (action, text)
    {
        if (action === 'change')
        {
            return this.selectFirstMatch(text)
        }
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
            if (event.combo === 'tab')
            {
                if (this.input.hasFocus())
                {
                    this.grabFocus()
                }
                else
                {
                    this.input.grabFocus()
                }
                return true
            }
            if (this.input.hasFocus())
            {
                if (event.combo === 'up')
                {
                    this.selectMatch(-1)
                    return true
                }
                if (event.combo === 'down')
                {
                    this.selectMatch(1)
                    return true
                }
                if (this.input.onKey(key,event))
                {
                    return true
                }
                return filterchoice.__super__.onKey.call(this,key,event)
            }
            if (event.char)
            {
                this.input.grabFocus()
                if (this.input.onKey(key,event))
                {
                    return true
                }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyY2hvaWNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmlsdGVyY2hvaWNlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxZQUFmOztPQUNlLFlBQWY7O09BQ2UsY0FBZjs7O0FBQ04sZ0JBQUQ7OzZCQUFjO2FBTVYsY0FBRyxRQUFPLE1BQUs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxREFFTCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxZQUFrQixNQUFNLEtBQUMsVUFBVSxLQUFDO1FBQ3JDLEtBQUMsa0JBQWtCLE1BQU0sS0FBQztRQUUxQixLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxNQUFNOzs7NEJBRVgsdUJBQVUsS0FBSTs7a0RBRUosSUFBSTs7WUFFUCxRQUFPLFFBQVMsS0FBQzs7bUJBQ2hCLEtBQUMsTUFBTSxTQUFTLFVBQVUsS0FBQyxNQUFNOzs7OzRCQUV6Qzs7ZUFBa0IsS0FBQyxNQUFNOzs7NEJBRXpCOztZQUVVLEtBQUM7Ozs7UUFFUCxLQUFDLE1BQU07ZUFDUCxLQUFDLE1BQU07Ozs0QkFFWDs7YUFFYyxLQUFDOzs7O1FBRVgsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07ZUFDUCxLQUFDOzs7NEJBRUwsMkJBQWM7Ozs7UUFFVjtzQkFFbUIsS0FBQzs7bUJBQWxCOztzQkFFTzs7Z0NBQ1csS0FBQztpQkFBUjs7Z0JBQUw7Z0JBQ0EsUUFBUSxLQUFLOzttQkFDZjs7UUFFTixXQUFjLE1BQUssT0FBTyxLQUFDLE1BQU0sUUFBUSxLQUFDO1FBQzFDLFVBQVUsS0FBSyxPQUFPOzZCQUVWOzs7WUFBUjtZQUNBLFFBQVEsS0FBSyxLQUFDLE1BQU0sUUFBUTs7UUFFaEMsUUFBUSxlQUFNLEdBQUU7O21CQUFNLElBQUk7O2VBQzFCOzs7NEJBRUosMEJBQWE7O2VBRUUsS0FBSyxTQUFBLFFBQVEsS0FBQyxNQUFNLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/filterchoice.kode
