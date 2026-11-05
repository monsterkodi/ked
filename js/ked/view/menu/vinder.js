var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var vinder

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"


vinder = (function ()
{
    _k_.extend(vinder, view)
    function vinder (screen, editor, name = 'vinder')
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        var _24_45_, _25_45_

        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this.state = this.editor.state
        vinder.__super__.constructor.call(this,this.screen,this.name)
        this.isVisible = false
        this.isPopup = true
        this.isInputPopup = true
        this.input = new input(this.screen,`${this.name}_input`)
        this.input.on('action',this.onInputAction)
        post.on('vinder.show',this.show)
        this.setColor('bg',((_24_45_=theme.vinder.bg) != null ? _24_45_ : theme.finder.bg))
        this.setColor('frame',((_25_45_=theme.vinder.frame) != null ? _25_45_ : theme.finder.frame))
    }

    vinder.prototype["arrange"] = function ()
    {
        var w, x, y

        x = this.editor.cells.x
        w = this.editor.cells.cols
        y = this.editor.cells.y
        this.input.layout(x + 2,y + 1,w - 4,1)
        return this.cells.layout(x,y,w,3)
    }

    vinder.prototype["show"] = function ()
    {
        var text

        text = this.state.textOfSelectionOrWordAtCursor()
        this.input.show()
        if (text !== this.input.current())
        {
            this.input.set(text)
            this.input.selectAll()
            this.input.state.moveCursors('eol')
        }
        post.emit('vinder.text',text)
        this.state.highlightText(text)
        vinder.__super__.show.call(this)
        return this.input.grabFocus()
    }

    vinder.prototype["hide"] = function ()
    {
        return vinder.__super__.hide.call(this)
    }

    vinder.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.cells.draw_rounded_border(0,0,-1,-1,{fg:this.color.frame})
        this.cells.draw_vertical_padding(1,1,this.color.frame,theme.vinder.bg)
        this.cells.draw_vertical_padding(this.cells.cols - 2,1,theme.vinder.bg,this.color.frame)
        return this.input.draw()
    }

    vinder.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                post.emit('focus','editor')
                this.hide()
                break
            case 'change':
                if (!_k_.empty(text))
                {
                    this.state.highlightText(text)
                }
                else
                {
                    this.state.setHighlights([])
                }
                post.emit('vinder.text',text)
                break
            case 'cancel':
            case 'escape':
            case 'esc':
                post.emit('focus','editor')
                this.state.setHighlights([])
                this.hide()
                break
        }

        return true
    }

    vinder.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (event.type === 'press' && !this.cells.isInsideEvent(event))
        {
            this.onInputAction('cancel')
            return {redraw:true}
        }
        return {redraw:true}
    }

    vinder.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        if (_k_.in(event.combo,['esc','escape']) || event.combo.startsWith('alt+') || event.combo.startsWith('ctrl+') || event.combo.startsWith('cmd+'))
        {
            if (_k_.in(event.combo,['esc','escape']))
            {
                this.onInputAction('cancel')
                return true
            }
            return 'unhandled'
        }
        if (result = this.input.onKey(key,event))
        {
            return result
        }
        return false
    }

    return vinder
})()

export default vinder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvdmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjs7T0FDWSxXQUFmO09BQW9CLFlBQXBCOzs7QUFDTixVQUFEOzt1QkFBUTthQUdKLFFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7UUFFZixLQUFDLFFBQWUsS0FBQyxPQUFPOytDQUVsQixLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsWUFBZTtRQUNoQixLQUFDLFVBQWU7UUFDaEIsS0FBQyxlQUFlO1FBRWhCLEtBQUMsWUFBWSxNQUFNLEtBQUMsVUFBVSxLQUFDO1FBRS9CLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUVwQixLQUFLLEdBQUcsY0FBYyxLQUFDO1FBRXZCLEtBQUMsU0FBUyxlQUFRLE1BQU0sT0FBTyx3QkFBUSxNQUFNLE9BQU87UUFDcEQsS0FBQyxTQUFTLGtCQUFRLE1BQU0sT0FBTywyQkFBUSxNQUFNLE9BQU87OztzQkFFeEQ7Ozs7UUFFSSxJQUFJLEtBQUMsT0FBTyxNQUFNO1FBQ2xCLElBQUksS0FBQyxPQUFPLE1BQU07UUFDbEIsSUFBSSxLQUFDLE9BQU8sTUFBTTtRQUNsQixLQUFDLE1BQU0sT0FBUSxJQUFFLEVBQUcsSUFBRSxFQUFHLElBQUUsRUFBRztlQUM5QixLQUFDLE1BQU0sT0FBUSxFQUFLLEVBQUssRUFBSzs7O3NCQUVsQzs7OztRQUVJLE9BQU8sS0FBQyxNQUFNO1FBRWQsS0FBQyxNQUFNO1lBRUosU0FBUSxLQUFDLE1BQU07O1lBQ2QsS0FBQyxNQUFNLElBQUk7WUFDWCxLQUFDLE1BQU07WUFDUCxLQUFDLE1BQU0sTUFBTSxZQUFZOztRQUU3QixLQUFLLEtBQUssY0FBYztRQUN4QixLQUFDLE1BQU0sY0FBYzs7ZUFFckIsS0FBQyxNQUFNOzs7c0JBRVg7Ozs7O3NCQUVBOztZQUVTLEtBQUM7Ozs7UUFFTixLQUFDO1FBRUQsS0FBQyxNQUFNLG9CQUFvQixFQUFFLEVBQUUsR0FBRyxJQUFHLEdBQUcsS0FBQyxNQUFNO1FBRS9DLEtBQUMsTUFBTSxzQkFBc0IsRUFBRSxFQUFFLEtBQUMsTUFBTSxNQUFNLE1BQU0sT0FBTztRQUMzRCxLQUFDLE1BQU0sc0JBQXNCLEtBQUMsTUFBTSxPQUFLLEVBQUUsRUFBRSxNQUFNLE9BQU8sR0FBRyxLQUFDLE1BQU07ZUFFcEUsS0FBQyxNQUFNOzs7c0JBRVgsNEJBQWUsUUFBTzs7Z0JBRVg7O2lCQUVIO2dCQUNJLEtBQUssS0FBSyxRQUFRO2dCQUNsQixLQUFDOztpQkFFTDsrQkFDYTs7b0JBQ0wsS0FBQyxNQUFNLGNBQWM7Ozs7b0JBRXJCLEtBQUMsTUFBTTs7Z0JBQ1gsS0FBSyxLQUFLLGNBQWM7O2lCQUU1QjtpQkFDQTtpQkFDQTtnQkFDSSxLQUFLLEtBQUssUUFBUTtnQkFDbEIsS0FBQyxNQUFNO2dCQUNQLEtBQUM7Ozs7ZUFDVDs7O3NCQUVKLHNCQUFTOzs7O1lBRUEsS0FBQzs7OztRQUVOLE1BQU0sS0FBQyxNQUFNLFFBQVE7YUFBaUIsY0FBQSxJQUFLOzttQkFBWjs7WUFFNUIsTUFBTSxTQUFRLFlBQWdCLEtBQUMsTUFBTSxjQUFjOztZQUNsRCxLQUFDLGNBQWM7b0JBQ2IsT0FBTzs7Z0JBRWIsT0FBTzs7O3NCQUVYLG9CQUFPLEtBQUk7Ozs7WUFFRixLQUFDOzs7O21CQUVILE1BQU0sT0FBVSxNQUFNLGNBQWEsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxZQUFZLE1BQU0sTUFBTSxXQUFXOzt1QkFFM0gsTUFBTSxPQUFVLE1BQU07O2dCQUNyQixLQUFDLGNBQWM7dUJBQ2I7O21CQUNKOztZQUVILFNBQVMsS0FBQyxNQUFNLE1BQU0sSUFBSTs7bUJBQ3ZCOztlQUVOOzs7V0E5R1A7OztlQWdITSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/vinder.kode
