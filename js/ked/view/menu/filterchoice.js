var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var filterchoice

import kxk from "../../../kxk.js"
let krzl = kxk.krzl

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import input from "../base/input.js"

import cells from "../screen/cells.js"

import choices from "../menu/choices.js"

import belt from "../../edit/tool/belt.js"


filterchoice = (function ()
{
    _k_.extend(filterchoice, choices)
    function filterchoice (screen, name, features)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["toggleFilter"] = this["toggleFilter"].bind(this)
        this["selectLineAndAdjust"] = this["selectLineAndAdjust"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hideFilter"] = this["hideFilter"].bind(this)
        this["showFilter"] = this["showFilter"].bind(this)
        filterchoice.__super__.constructor.call(this,screen,name,features)
        this.input = new input(this.screen,`${this.name}_input`)
        this.filterCells = new cells(this.screen)
        this.input.on('action',this.onInputAction)
        this.input.hide()
    }

    filterchoice.prototype["showFilter"] = function ()
    {
        if (this.input.visible())
        {
            return
        }
        this.input.show()
        return this.input.grabFocus()
    }

    filterchoice.prototype["hideFilter"] = function ()
    {
        this.state.clearHighlights()
        if (!this.input.visible())
        {
            return
        }
        this.input.set('')
        this.input.hide()
        return this.grabFocus()
    }

    filterchoice.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'change':
                if (_k_.empty(text))
                {
                    this.state.clearHighlights()
                    return this.state.setSelections([])
                }
                else
                {
                    this.state.highlightText(text)
                    if (this.state.s.highlights.length)
                    {
                        return this.selectLineAndAdjust(this.state.s.highlights[0][1])
                    }
                }
                break
            case 'submit':
                console.log("INPUT ACTION",action)
                this.hideFilter()
                return this.emitAction('return',this.current())

        }

    }

    filterchoice.prototype["selectLineAndAdjust"] = function (li)
    {
        this.state.setSelections([belt.rangeOfLine(this.state.s.lines,li)])
        return this.state.setCursors([[0,li]],{main:'ind',adjust:'topBotDelta'})
    }

    filterchoice.prototype["toggleFilter"] = function ()
    {
        if (this.input.visible())
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

        if (this.input.visible())
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
        var cells, inner, outer

        if (this.hidden())
        {
            return
        }
        filterchoice.__super__.draw.call(this)
        if (this.input.visible())
        {
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
    }

    filterchoice.prototype["onKey"] = function (key, event)
    {
        if (this.input.visible())
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
                    this.state.selectPrevHighlight()
                    this.selectLineAndAdjust(this.state.s.selections[0][1])
                    return true
                }
                if (event.combo === 'down')
                {
                    this.state.selectNextHighlight()
                    this.state.selectNextHighlight()
                    this.selectLineAndAdjust(this.state.s.selections[0][1])
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
            if (!(_k_.in(event.combo,['tab','return','space'])))
            {
                this.showFilter()
                this.input.onKey(key,event)
                return true
            }
        }
        return filterchoice.__super__.onKey.call(this,key,event)
    }

    filterchoice.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.input.visible() && this.filterCells.isInsideEvent(event))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyY2hvaWNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmlsdGVyY2hvaWNlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxZQUFmOztPQUNlLFlBQWY7O09BQ2UsY0FBZjs7T0FDZSxXQUFQOzs7QUFDZCxnQkFBRDs7NkJBQWM7YUFNVixjQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7O3FEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFlBQWtCLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFDckMsS0FBQyxrQkFBa0IsTUFBTSxLQUFDO1FBRTFCLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUVwQixLQUFDLE1BQU07Ozs0QkFTWDs7WUFFVSxLQUFDLE1BQU07Ozs7UUFFYixLQUFDLE1BQU07ZUFDUCxLQUFDLE1BQU07Ozs0QkFFWDs7UUFFSSxLQUFDLE1BQU07YUFFRSxLQUFDLE1BQU07Ozs7UUFDaEIsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07ZUFDUCxLQUFDOzs7NEJBRUwsNEJBQWUsUUFBTzs7Z0JBRVg7O2lCQUNIOzhCQUNhOztvQkFDTCxLQUFDLE1BQU07MkJBQ1AsS0FBQyxNQUFNOzs7O29CQUVQLEtBQUMsTUFBTSxjQUFjO3dCQUNsQixLQUFDLE1BQU0sRUFBRSxXQUFXOzsrQkFDbkIsS0FBQyxvQkFBb0IsS0FBQyxNQUFNLEVBQUUsV0FBVyxHQUFHOzs7O2lCQUN4RDtnQkFDSSxZQUFJLGVBQWU7Z0JBQ25CLEtBQUM7dUJBQ0QsS0FBQyxXQUFXLFNBQVMsS0FBQzs7Ozs7OzRCQUVsQyxrQ0FBcUI7O1FBRWpCLEtBQUMsTUFBTSxlQUFlLEtBQUssWUFBWSxLQUFDLE1BQU0sRUFBRSxNQUFNO2VBQ3RELEtBQUMsTUFBTSxhQUFhLEVBQUUsTUFBSyxLQUFLLE1BQU0sT0FBTzs7OzRCQUVqRDs7WUFFTyxLQUFDLE1BQU07O21CQUFZLEtBQUM7Ozs7bUJBQ0QsS0FBQzs7Ozs0QkFFM0I7OzhEQUF5QixLQUFDLFNBQVUsS0FBQyxNQUFNOzs7NEJBRTNDLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1lBRVAsS0FBQyxNQUFNOztZQUVOLGFBQVMsRUFBRTtZQUVYLEtBQUMsWUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFO1lBQzFCLEtBQUMsTUFBTSxPQUFhLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFOzJEQUUxQixFQUFFLElBQUUsR0FBRyxFQUFFLElBQUU7Ozs7MkRBSVgsRUFBRSxFQUFFLEVBQUU7Ozs7NEJBRXBCOzs7O1lBRVUsS0FBQzs7Ozs7WUFJSixLQUFDLE1BQU07O1lBRU4sUUFBUSxLQUFDO2dCQUVILE1BQU0sT0FBTyxLQUFLLE1BQU0sT0FBTzs7OztZQUVyQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO1lBRTFDLFNBQVEsS0FBQyxNQUFNLGFBQWEsTUFBTSxTQUFTLEtBQUMsTUFBTSxNQUFNLEtBQUMsTUFBTTtZQUMvRCxTQUFRLEtBQUMsTUFBTSxhQUFhLEtBQUMsTUFBTSxNQUFNLFdBQVcsS0FBQyxNQUFNLE1BQU07WUFFakUsTUFBTSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsR0FBRSxHQUFHO1lBRXRDLE1BQU0sc0JBQXNCLEVBQUUsRUFBRSxNQUFNO1lBQ3RDLE1BQU0sc0JBQXNCLE1BQU0sT0FBSyxFQUFFLEVBQUUsTUFBTTttQkFFakQsS0FBQyxNQUFNOzs7OzRCQUVmLG9CQUFPLEtBQUk7O1lBRUosS0FBQyxNQUFNOztnQkFFSCxNQUFNLFVBQVM7O2dCQUNkLEtBQUM7dUJBQ0M7O2dCQUVILE1BQU0sVUFBUzs7b0JBQ1gsS0FBQyxNQUFNOztvQkFDTixLQUFDOzs7O29CQUVELEtBQUMsTUFBTTs7dUJBQ1Q7O2dCQUVILEtBQUMsTUFBTTs7b0JBRUgsTUFBTSxVQUFTOztvQkFDZCxLQUFDLE1BQU07b0JBQ1AsS0FBQyxvQkFBb0IsS0FBQyxNQUFNLEVBQUUsV0FBVyxHQUFHOzJCQUMxQzs7b0JBRUgsTUFBTSxVQUFTOztvQkFDZCxLQUFDLE1BQU07b0JBQ1AsS0FBQyxNQUFNO29CQUNQLEtBQUMsb0JBQW9CLEtBQUMsTUFBTSxFQUFFLFdBQVcsR0FBRzsyQkFDMUM7O29CQUVILEtBQUMsTUFBTSxNQUFNLElBQUk7OzJCQUNkOzs4REFFRSxJQUFJOztnQkFFYixNQUFNOztnQkFDTCxLQUFDLE1BQU07b0JBQ0osS0FBQyxNQUFNLE1BQU0sSUFBSTs7MkJBQ2Q7OzswREFFRixJQUFJOztZQUViLE1BQU07O3lCQUVGLE1BQU0sT0FBYyxNQUFLLFNBQVE7O2dCQUNoQyxLQUFDO2dCQUVELEtBQUMsTUFBTSxNQUFNLElBQUk7dUJBQ2Y7OztzREFFSixJQUFJOzs7NEJBRWQsc0JBQVM7Ozs7WUFFRixLQUFDLE1BQU0sYUFBYyxLQUFDLFlBQVksY0FBYzs7Z0JBRXpCLE1BQU0sU0FBUTs7Z0JBQXBDLEtBQUMsTUFBTTs7WUFFUCxNQUFNLEtBQUMsTUFBTSxRQUFRO2dCQUNaOzt1QkFBUDs7b0JBRUEsT0FBTzs7d0RBRVA7OztXQXhLYjs7O2VBMEtNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/filterchoice.kode
