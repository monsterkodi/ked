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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvdmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjs7T0FDWSxXQUFmO09BQW9CLFlBQXBCOzs7QUFDTixVQUFEOzt1QkFBZ0I7YUFHWixRQUFJLFFBQVEsUUFBUTs7UUFBakI7UUFBUTtRQUFROzs7Ozs7Ozs7O1FBRWYsS0FBQyxRQUFlLEtBQUMsT0FBTzsrQ0FFbEIsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQWU7UUFDaEIsS0FBQyxVQUFlO1FBQ2hCLEtBQUMsZUFBZTtRQUVoQixLQUFDLFlBQVksTUFBTSxLQUFDLFVBQVUsS0FBQztRQUUvQixLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBSyxHQUFHLGNBQWMsS0FBQztRQUV2QixLQUFDLFNBQVMsZUFBUSxNQUFNLE9BQU8sd0JBQVEsTUFBTSxPQUFPO1FBQ3BELEtBQUMsU0FBUyxrQkFBUSxNQUFNLE9BQU8sMkJBQVEsTUFBTSxPQUFPOzs7c0JBRXhEOzs7O1FBRUksSUFBSSxLQUFDLE9BQU8sTUFBTTtRQUNsQixJQUFJLEtBQUMsT0FBTyxNQUFNO1FBQ2xCLElBQUksS0FBQyxPQUFPLE1BQU07UUFDbEIsS0FBQyxNQUFNLE9BQVEsSUFBRSxFQUFHLElBQUUsRUFBRyxJQUFFLEVBQUc7ZUFDOUIsS0FBQyxNQUFNLE9BQVEsRUFBSyxFQUFLLEVBQUs7OztzQkFFbEM7Ozs7UUFFSSxPQUFPLEtBQUMsTUFBTTtRQUVkLEtBQUMsTUFBTTtZQUVKLFNBQVEsS0FBQyxNQUFNOztZQUNkLEtBQUMsTUFBTSxJQUFJO1lBQ1gsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNLE1BQU0sWUFBWTs7UUFFN0IsS0FBSyxLQUFLLGNBQWM7UUFDeEIsS0FBQyxNQUFNLGNBQWM7O2VBRXJCLEtBQUMsTUFBTTs7O3NCQUVYOzs7OztzQkFFQTs7WUFFUyxLQUFDOzs7O1FBRU4sS0FBQztRQUVELEtBQUMsTUFBTSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsSUFBRyxHQUFHLEtBQUMsTUFBTTtRQUUvQyxLQUFDLE1BQU0sc0JBQXNCLEVBQUUsRUFBRSxLQUFDLE1BQU0sTUFBTSxNQUFNLE9BQU87UUFDM0QsS0FBQyxNQUFNLHNCQUFzQixLQUFDLE1BQU0sT0FBSyxFQUFFLEVBQUUsTUFBTSxPQUFPLEdBQUcsS0FBQyxNQUFNO2VBRXBFLEtBQUMsTUFBTTs7O3NCQUVYLDRCQUFlLFFBQU87O2dCQUVYOztpQkFFSDtnQkFDSSxLQUFLLEtBQUssUUFBUTtnQkFDbEIsS0FBQzs7aUJBRUw7K0JBQ2E7O29CQUNMLEtBQUMsTUFBTSxjQUFjOzs7O29CQUVyQixLQUFDLE1BQU07O2dCQUNYLEtBQUssS0FBSyxjQUFjOztpQkFFNUI7aUJBQ0E7aUJBQ0E7Z0JBQ0ksS0FBSyxLQUFLLFFBQVE7Z0JBQ2xCLEtBQUMsTUFBTTtnQkFDUCxLQUFDOzs7O2VBQ1Q7OztzQkFFSixzQkFBUzs7OztZQUVDLEtBQUM7Ozs7UUFFUCxNQUFNLEtBQUMsTUFBTSxRQUFRO2FBQWlCLGNBQUEsSUFBSzs7bUJBQVo7O1lBRTVCLE1BQU0sU0FBUSxZQUFnQixLQUFDLE1BQU0sY0FBYzs7WUFDbEQsS0FBQyxjQUFjO29CQUNaLE9BQU87O2dCQUVkLE9BQU87OztzQkFFWCxvQkFBTyxLQUFJOzs7O1lBRUQsS0FBQzs7OzttQkFFSixNQUFNLE9BQVUsTUFBTSxjQUFhLE1BQU0sTUFBTSxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsWUFBWSxNQUFNLE1BQU0sV0FBVzs7dUJBRTNILE1BQU0sT0FBVSxNQUFNOztnQkFDckIsS0FBQyxjQUFjO3VCQUNaOzttQkFDSjs7WUFFSixTQUFTLEtBQUMsTUFBTSxNQUFNLElBQUk7O21CQUN0Qjs7ZUFFUDs7O1dBOUdQOzs7ZUFnSE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/vinder.kode
