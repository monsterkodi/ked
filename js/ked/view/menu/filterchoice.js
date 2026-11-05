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
        this["selectLineAndAdjust"] = this["selectLineAndAdjust"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hideFilter"] = this["hideFilter"].bind(this)
        this["showFilter"] = this["showFilter"].bind(this)
        this["toggleFilter"] = this["toggleFilter"].bind(this)
        filterchoice.__super__.constructor.call(this,screen,name,features)
        this.input = new input(this.screen,`${this.name}_input`)
        this.filterCells = new cells(this.screen)
        this.input.on('action',this.onInputAction)
        this.setColor('frame_focus',theme.filter.frame.focus)
        this.setColor('frame_blur',theme.filter.frame.blur)
        this.input.hide()
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

    filterchoice.prototype["showFilter"] = function ()
    {
        if (this.input.visible())
        {
            return
        }
        this.input.show()
        this.input.grabFocus()
        return true
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
        this.grabFocus()
        return true
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
                this.hideFilter()
                return this.emitAction('return',this.current())

        }

    }

    filterchoice.prototype["selectLineAndAdjust"] = function (li)
    {
        this.state.setSelections([belt.rangeOfLine(this.state.s.lines,li)])
        this.state.setCursors([[0,li]],{adjust:'topBotDelta'})
        return true
    }

    filterchoice.prototype["hasFocus"] = function ()
    {
        return filterchoice.__super__.hasFocus.call(this) || this.input.hasFocus()
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
            outer = (this.input.hasFocus() ? this.color.frame_focus : this.color.frame_blur)
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
                return this.hideFilter()
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
                    return this.selectLineAndAdjust(this.state.s.selections[0][1])
                }
                if (event.combo === 'down')
                {
                    this.state.selectNextHighlight()
                    this.state.selectNextHighlight()
                    return this.selectLineAndAdjust(this.state.s.selections[0][1])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyY2hvaWNlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmlsdGVyY2hvaWNlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxZQUFmOztPQUNlLFlBQWY7O09BQ2UsY0FBZjs7T0FDZSxXQUFQOzs7QUFDZCxnQkFBRDs7NkJBQWM7YUFNVixjQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7O3FEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFlBQWtCLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFDckMsS0FBQyxrQkFBa0IsTUFBTSxLQUFDO1FBRTFCLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUVwQixLQUFDLFNBQVMsY0FBYyxNQUFNLE9BQU8sTUFBTTtRQUMzQyxLQUFDLFNBQVMsYUFBYyxNQUFNLE9BQU8sTUFBTTtRQUUzQyxLQUFDLE1BQU07Ozs0QkFTWDs7WUFFTyxLQUFDLE1BQU07O21CQUFZLEtBQUM7Ozs7bUJBQ0QsS0FBQzs7Ozs0QkFFM0I7O1lBRVMsS0FBQyxNQUFNOzs7O1FBQ1osS0FBQyxNQUFNO1FBQ1AsS0FBQyxNQUFNO2VBQ1A7Ozs0QkFFSjs7UUFFSSxLQUFDLE1BQU07YUFDRSxLQUFDLE1BQU07Ozs7UUFDaEIsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFDUCxLQUFDO2VBQ0Q7Ozs0QkFFSiw0QkFBZSxRQUFPOztnQkFFWDs7aUJBRUg7OEJBRWE7O29CQUNMLEtBQUMsTUFBTTsyQkFDUCxLQUFDLE1BQU07Ozs7b0JBRVAsS0FBQyxNQUFNLGNBQWM7d0JBQ2xCLEtBQUMsTUFBTSxFQUFFLFdBQVc7OytCQUNuQixLQUFDLG9CQUFvQixLQUFDLE1BQU0sRUFBRSxXQUFXLEdBQUc7Ozs7aUJBQ3hEO2dCQUVJLEtBQUM7dUJBQ0QsS0FBQyxXQUFXLFNBQVMsS0FBQzs7Ozs7OzRCQUVsQyxrQ0FBcUI7O1FBRWpCLEtBQUMsTUFBTSxlQUFlLEtBQUssWUFBWSxLQUFDLE1BQU0sRUFBRSxNQUFNO1FBQ3RELEtBQUMsTUFBTSxhQUFhLEVBQUUsTUFBSyxPQUFPO2VBQ2xDOzs7NEJBRUo7OzZEQUF3QixLQUFDLE1BQU07Ozs0QkFFL0IscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7WUFFUCxLQUFDLE1BQU07O1lBRU4sYUFBUyxFQUFFO1lBRVgsS0FBQyxZQUFZLE9BQU8sRUFBRSxFQUFFLEVBQUU7WUFDMUIsS0FBQyxNQUFNLE9BQWEsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7MkRBRTFCLEVBQUUsSUFBRSxHQUFHLEVBQUUsSUFBRTs7OzsyREFJWCxFQUFFLEVBQUUsRUFBRTs7Ozs0QkFFcEI7Ozs7WUFFUyxLQUFDOzs7OztZQUlILEtBQUMsTUFBTTs7WUFFTixRQUFRLEtBQUM7Z0JBRUosTUFBTSxPQUFPLEtBQUssTUFBTSxPQUFPOzs7O1lBRXBDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07WUFFMUMsU0FBUSxLQUFDLE1BQU0sYUFBYSxLQUFDLE1BQU0sY0FBaUIsS0FBQyxNQUFNO1lBQzNELFNBQVEsS0FBQyxNQUFNLGFBQWEsS0FBQyxNQUFNLE1BQU0sV0FBVyxLQUFDLE1BQU0sTUFBTTtZQUVqRSxNQUFNLG9CQUFvQixFQUFFLEVBQUUsR0FBRyxHQUFFLEdBQUc7WUFFdEMsTUFBTSxzQkFBc0IsRUFBRSxFQUFFLE1BQU07WUFDdEMsTUFBTSxzQkFBc0IsTUFBTSxPQUFLLEVBQUUsRUFBRSxNQUFNO21CQUVqRCxLQUFDLE1BQU07Ozs7NEJBRWYsb0JBQU8sS0FBSTs7WUFFSixLQUFDLE1BQU07O2dCQUVILE1BQU0sVUFBUzs7dUJBQ1osS0FBQzs7Z0JBRUosTUFBTSxVQUFTOztvQkFDWCxLQUFDLE1BQU07O29CQUNOLEtBQUM7Ozs7b0JBRUQsS0FBQyxNQUFNOzt1QkFDVDs7Z0JBRUgsS0FBQyxNQUFNOztvQkFFSCxNQUFNLFVBQVM7O29CQUNkLEtBQUMsTUFBTTsyQkFDTCxLQUFDLG9CQUFvQixLQUFDLE1BQU0sRUFBRSxXQUFXLEdBQUc7O29CQUUvQyxNQUFNLFVBQVM7O29CQUNkLEtBQUMsTUFBTTtvQkFDUCxLQUFDLE1BQU07MkJBQ0wsS0FBQyxvQkFBb0IsS0FBQyxNQUFNLEVBQUUsV0FBVyxHQUFHOztvQkFFL0MsS0FBQyxNQUFNLE1BQU0sSUFBSTs7MkJBQ2Q7OzhEQUVFLElBQUk7O2dCQUViLE1BQU07O2dCQUNMLEtBQUMsTUFBTTtvQkFDSixLQUFDLE1BQU0sTUFBTSxJQUFJOzsyQkFDZDs7OzBEQUVGLElBQUk7O1lBRWIsTUFBTTs7eUJBRUYsTUFBTSxPQUFjLE1BQUssU0FBUTs7Z0JBQ2hDLEtBQUM7Z0JBQ0QsS0FBQyxNQUFNLE1BQU0sSUFBSTt1QkFDZjs7O3NEQUVKLElBQUk7Ozs0QkFFZCxzQkFBUzs7OztZQUVGLEtBQUMsTUFBTSxhQUFjLEtBQUMsWUFBWSxjQUFjOztnQkFFekIsTUFBTSxTQUFROztnQkFBcEMsS0FBQyxNQUFNOztZQUVQLE1BQU0sS0FBQyxNQUFNLFFBQVE7Z0JBQ1o7O3VCQUFQOztvQkFFQSxPQUFPOzt3REFFUDs7O1dBMUtiOzs7ZUE0S00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/filterchoice.kode
