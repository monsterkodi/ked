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
    
        var _30_42_, _31_45_

        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        vinder.__super__.constructor.call(this,this.screen,this.name)
        this.state = this.editor.state
        this.isPopup = true
        this.isInputPopup = true
        this.input = new input(this.screen,`${this.name}_input`)
        this.input.show()
        this.input.on('action',this.onInputAction)
        this.setColor('bg',((_30_42_=theme.vinder.bg) != null ? _30_42_ : theme.finder.bg))
        this.setColor('frame',((_31_45_=theme.vinder.frame) != null ? _31_45_ : theme.finder.frame))
        if (this.name === 'vinder')
        {
            post.on('vinder.show',this.show)
        }
    }

    vinder.prototype["arrange"] = function ()
    {
        var w, x, y

        x = this.editor.cells.x
        w = this.editor.cells.cols
        y = this.editor.cells.y + this.editor.cells.rows - 1
        this.input.layout(x + 1,y,w - 2,1)
        return this.cells.layout(x,y,w,1)
    }

    vinder.prototype["show"] = function (text)
    {
        console.log(`vinder.show ${this.name} ${text}`)
        if (_k_.empty(text))
        {
            text = this.state.textOfSelectionOrWordAtCursor()
        }
        text = (text != null ? text : '')
        if (text !== this.input.current())
        {
            this.input.set(text)
            this.input.selectAll()
            this.input.state.moveCursors('eol')
            this.input.grabFocus()
        }
        this.state.highlightText(text)
        return vinder.__super__.show.call(this)
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
                return
            }
            this.onInputAction('cancel')
            return true
        }
        return 'unhandled'
        if (result = this.input.onKey(key,event))
        {
            return result
        }
        return false
    }

    return vinder
})()

export default vinder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvdmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjs7T0FDVyxXQUFkO09BQW1CLFlBQW5COzs7QUFFRSxVQUFUOzt1QkFBd0I7YUFFcEIsUUFBSSxRQUFRLFFBQU8sT0FBSzs7UUFBckI7UUFBUTs7Ozs7Ozs7OzsrQ0FFRCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsUUFBZSxLQUFDLE9BQU87UUFDeEIsS0FBQyxVQUFlO1FBQ2hCLEtBQUMsZUFBZTtRQUVoQixLQUFDLFlBQWMsTUFBTSxLQUFDLFVBQVUsS0FBQztRQUNqQyxLQUFDLE1BQU07UUFFUCxLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxTQUFTLGVBQVEsTUFBTSxPQUFPLHdCQUFLLE1BQU0sT0FBTztRQUNqRCxLQUFDLFNBQVMsa0JBQVEsTUFBTSxPQUFPLDJCQUFRLE1BQU0sT0FBTztZQUVyQixLQUFDLFNBQVE7O1lBQXhDLEtBQUssR0FBRyxjQUFjLEtBQUM7Ozs7c0JBRTNCOzs7O1FBRUksSUFBSSxLQUFDLE9BQU8sTUFBTTtRQUNsQixJQUFJLEtBQUMsT0FBTyxNQUFNO1FBQ2xCLElBQUksS0FBQyxPQUFPLE1BQU0sSUFBSSxLQUFDLE9BQU8sTUFBTSxPQUFPO1FBQzNDLEtBQUMsTUFBTSxPQUFRLElBQUUsRUFBRyxFQUFHLElBQUUsRUFBRztlQUM1QixLQUFDLE1BQU0sT0FBUSxFQUFLLEVBQUcsRUFBSzs7O3NCQUVoQyxtQkFBTTs7UUFFRiwyQkFBbUIsS0FBQyxRQUFRO3NCQUVuQjs7WUFDTCxPQUFPLEtBQUMsTUFBTTs7UUFFbEIsUUFBQSxlQUFBLE9BQVE7WUFFTCxTQUFRLEtBQUMsTUFBTTs7WUFDZCxLQUFDLE1BQU0sSUFBSTtZQUNYLEtBQUMsTUFBTTtZQUNQLEtBQUMsTUFBTSxNQUFNLFlBQVk7WUFDekIsS0FBQyxNQUFNOztRQUVYLEtBQUMsTUFBTSxjQUFjOzs7O3NCQUl6Qjs7Ozs7c0JBRUE7O1lBRVUsS0FBQzs7OztRQUVQLEtBQUM7UUFFRCxLQUFDLE1BQU0sb0JBQW9CLEVBQUUsRUFBRSxHQUFHLElBQUcsR0FBRyxLQUFDLE1BQU07ZUFFL0MsS0FBQyxNQUFNOzs7c0JBRVgsNEJBQWUsUUFBTzs7Z0JBRVg7O2lCQUVIO2dCQUNJLEtBQUssS0FBSyxRQUFRO2dCQUNsQixLQUFDOztpQkFFTDsrQkFDYTs7b0JBQ0wsS0FBQyxNQUFNLGNBQWM7Ozs7b0JBRXJCLEtBQUMsTUFBTTs7O2lCQUVmO2lCQUNBO2lCQUNBO2dCQUNJLEtBQUssS0FBSyxRQUFRO2dCQUNsQixLQUFDLE1BQU07Z0JBQ1AsS0FBQzs7OztlQUVUOzs7c0JBRUosc0JBQVM7Ozs7WUFFQyxLQUFDOzs7O1FBRVAsTUFBTSxLQUFDLE1BQU0sUUFBUTthQUFpQixjQUFBLElBQUs7O21CQUFaOztZQUU1QixNQUFNLFNBQVEsWUFBZ0IsS0FBQyxNQUFNLGNBQWM7O1lBQ2xELEtBQUMsY0FBYztvQkFDWixPQUFPOztnQkFFZCxPQUFPOzs7c0JBRVgsb0JBQU8sS0FBSTs7OztZQUVELEtBQUM7Ozs7bUJBRUosTUFBTSxPQUFVLE1BQU0sY0FBYSxNQUFNLE1BQU0sV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFlBQVksTUFBTSxNQUFNLFdBQVc7O3VCQUV4SCxNQUFNLE9BQVUsTUFBTTs7OztZQUN4QixLQUFDLGNBQWM7bUJBQ1o7O2VBRUo7WUFFSixTQUFTLEtBQUMsTUFBTSxNQUFNLElBQUk7O21CQUN0Qjs7ZUFFUDs7O1dBN0dDOzs7ZUErR0YifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/vinder.kode
