var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var uniko

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import clip from "../../../kxk/clip.js"

import theme from "../../theme/theme.js"

import specs from "../../edit/specs.js"

import view from "../base/view.js"
import input from "../base/input.js"
import matrix from "../base/matrix.js"

import julia from '../../util/julia.json' with { type : "json" }

uniko = (function ()
{
    _k_.extend(uniko, view)
    function uniko (screen, editor, name)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        var char, comment

        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["incScale"] = this["incScale"].bind(this)
        this["focusMatrix"] = this["focusMatrix"].bind(this)
        this["focusInput"] = this["focusInput"].bind(this)
        this["filter"] = this["filter"].bind(this)
        uniko.__super__.constructor.call(this,this.screen,this.name)
        this.height = 28
        this.focus = 'matrix'
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.matrix = new matrix(this.screen,`${this.name}_matrix`)
        this.matrix.setColor('bg',theme.uniko.bg)
        this.matrix.setColor('fg',theme.uniko.fg)
        this.matrix.setColor('selection',theme.uniko.selection)
        this.matrix.setColor('selection_blur',theme.uniko.selection_blur)
        this.matrix.setColor('scroll',theme.scroll.knob)
        this.matrix.setColor('scroll_dot',theme.scroll.dot)
        this.input.on('action',this.onInputAction)
        this.matrix.on('submit',this.submit)
        this.allItems = []
        for (char in julia)
        {
            comment = julia[char]
            this.allItems.push({char:char,search:_k_.trim(comment)})
        }
        this.matrix.setItems(this.allItems)
        this.isVisible = false
    }

    uniko.prototype["filter"] = function (text)
    {
        var matches, words

        text = _k_.trim(text).toLowerCase()
        if (_k_.empty(text))
        {
            return this.matrix.setItems(this.allItems)
        }
        words = text.split(' ')
        matches = this.allItems.filter(function (item)
        {
            var word

            var list = _k_.list(words)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                word = list[_a_]
                if (!item.search.includes(word))
                {
                    return false
                }
            }
            return true
        })
        return this.matrix.setItems(matches)
    }

    uniko.prototype["focusInput"] = function ()
    {
        this.focus = 'input'
        this.input.grabFocus()
        return true
    }

    uniko.prototype["focusMatrix"] = function ()
    {
        this.focus = 'matrix'
        this.matrix.selectFirst()
        this.matrix.grabFocus()
        return true
    }

    uniko.prototype["incScale"] = function (delta)
    {
        this.matrix.incScale(delta)
        post.emit('redraw')
        return true
    }

    uniko.prototype["show"] = function ()
    {
        this.input.set('')
        this.filter('')
        this.focus = 'matrix'
        uniko.__super__.show.call(this)
        this.matrix.selectFirst()
        this.matrix.grabFocus()
        return post.emit('redraw')
    }

    uniko.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        uniko.__super__.hide.call(this)
        this.focus = 'matrix'
        this.input.state.deselect()
        post.emit('focus',this.editor.name)
        return post.emit('redraw')
    }

    uniko.prototype["submit"] = function ()
    {
        var char

        char = this.matrix.selectedText()
        if (_k_.empty(char))
        {
            return false
        }
        this.editor.state.insert(char)
        post.emit('redraw')
        return true
    }

    uniko.prototype["copy"] = function ()
    {
        var char

        char = this.matrix.selectedText()
        if (_k_.empty(char))
        {
            return false
        }
        clip.copy(char)
        return true
    }

    uniko.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return false
        }
        switch (event.combo)
        {
            case 'esc':
                return this.hide()

            case 'cmd+up':
                return this.incScale(1)

            case 'cmd+down':
                return this.incScale(-1)

        }

        if (this.focus === 'input')
        {
            switch (event.combo)
            {
                case 'down':
                    return this.focusMatrix()

            }

            return this.input.onKey(key,event)
        }
        switch (event.combo)
        {
            case 'space':
                return this.submit()

            case 'return':
                return this.submit()

            case 'cmd+c':
                return this.copy()

            case 'ctrl+c':
                return this.copy()

            case 'up':
            case 'left':
            case 'right':
            case 'down':
                this.matrix.moveSelection(event.combo)
                break
        }

        if (!_k_.empty(event.char) && event.char.length === 1)
        {
            this.focusInput()
            return this.input.onKey(key,event)
        }
        return false
    }

    uniko.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'change':
                return this.filter(text)

        }

    }

    uniko.prototype["onMouse"] = function (event)
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
        ret = this.matrix.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return uniko.__super__.onMouse.call(this,event)
    }

    uniko.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return false
        }
        if (this.matrix.cells.isInsideEvent(event))
        {
            switch (event.dir)
            {
                case 'up':
                    this.matrix.moveSelection('up')
                    break
                case 'down':
                    this.matrix.moveSelection('down')
                    break
            }

            return {redraw:true}
        }
        return false
    }

    uniko.prototype["layout"] = function (x, y, w, h)
    {
        uniko.__super__.layout.call(this,x,y,w,h)
    
        var mh

        this.input.layout(x + 1,y + 1,w - 2,1)
        mh = _k_.max(0,(h - 4))
        return this.matrix.layout(x + 1,y + 3,w - 2,mh)
    }

    uniko.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.input.draw()
        this.matrix.draw()
        return uniko.__super__.draw.call(this)
    }

    return uniko
})()

export default uniko;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFOOztPQUNNLFlBQVQ7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhDQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTO1FBQ1YsS0FBQyxRQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsWUFBYSxNQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ2pDLEtBQUMsYUFBYSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRWpDLEtBQUMsT0FBTyxTQUFTLEtBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxLQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsWUFBaUIsTUFBTSxNQUFNO1FBQzlDLEtBQUMsT0FBTyxTQUFTLGlCQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsU0FBaUIsTUFBTSxPQUFPO1FBQy9DLEtBQUMsT0FBTyxTQUFTLGFBQWlCLE1BQU0sT0FBTztRQUUvQyxLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFDcEIsS0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFDO1FBRXJCLEtBQUM7YUFDRyxRQUFnQjs7WUFBWCxVQUFXO1lBQ2hCLEtBQUMsU0FBUyxNQUFLLEtBQUssS0FBSyxnQkFBWTs7UUFDekMsS0FBQyxPQUFPLFNBQVMsS0FBQztRQUVsQixLQUFDLFlBQVk7OztxQkFFakIscUJBQVE7Ozs7UUFFSixnQkFBWSxNQUFNO3NCQUVUOzttQkFBUyxLQUFDLE9BQU8sU0FBUyxLQUFDOztRQUVwQyxRQUFRLEtBQUssTUFBTTtRQUVuQixVQUFVLEtBQUMsU0FBUyxpQkFBUTs7OztnQ0FDWjs7O2dCQUFSO3FCQUNlLEtBQUssT0FBTyxTQUFTOzsyQkFBbEM7OzttQkFDTjs7ZUFFSixLQUFDLE9BQU8sU0FBUzs7O3FCQVFyQjs7UUFFSSxLQUFDLFFBQVE7UUFDVCxLQUFDLE1BQU07ZUFDUDs7O3FCQUVKOztRQUVJLEtBQUMsUUFBUTtRQUNULEtBQUMsT0FBTztRQUNSLEtBQUMsT0FBTztlQUNSOzs7cUJBRUosdUJBQVU7O1FBRU4sS0FBQyxPQUFPLFNBQVM7UUFDakIsS0FBSyxLQUFLO2VBQ1Y7OztxQkFFSjs7UUFFSSxLQUFDLE1BQU0sSUFBSTtRQUNYLEtBQUMsT0FBTztRQUNSLEtBQUMsUUFBUTs7UUFJVCxLQUFDLE9BQU87UUFDUixLQUFDLE9BQU87ZUFFUixLQUFLLEtBQUs7OztxQkFFZDs7WUFFUyxLQUFDOzs7OztRQUlOLEtBQUMsUUFBUTtRQUNULEtBQUMsTUFBTSxNQUFNO1FBRWIsS0FBSyxLQUFLLFFBQVEsS0FBQyxPQUFPO2VBQzFCLEtBQUssS0FBSzs7O3FCQUVkOzs7O1FBRUksT0FBTyxLQUFDLE9BQU87c0JBRUU7O21CQUFmOztRQUVGLEtBQUMsT0FBTyxNQUFNLE9BQU87UUFFckIsS0FBSyxLQUFLO2VBRVY7OztxQkFFSjs7OztRQUVJLE9BQU8sS0FBQyxPQUFPO3NCQUVFOzttQkFBZjs7UUFFRixLQUFLLEtBQUs7ZUFFVjs7O3FCQVFKLG9CQUFPLEtBQUk7O1lBRUksS0FBQzs7bUJBQVY7O2dCQUVLLE1BQU07O2lCQUNUO3VCQUFnQixLQUFDOztpQkFDakI7dUJBQWdCLEtBQUMsU0FBVTs7aUJBQzNCO3VCQUFnQixLQUFDLFNBQVM7Ozs7WUFFM0IsS0FBQyxVQUFTOztvQkFFRixNQUFNOztxQkFDVDsyQkFBWSxLQUFDOzs7O21CQUVmLEtBQUMsTUFBTSxNQUFNLElBQUk7O2dCQUVoQixNQUFNOztpQkFDVDt1QkFBZ0IsS0FBQzs7aUJBQ2pCO3VCQUFnQixLQUFDOztpQkFDakI7dUJBQWdCLEtBQUM7O2lCQUNqQjt1QkFBZ0IsS0FBQzs7aUJBQ2pCO2lCQUFJO2lCQUFNO2lCQUFPO2dCQUNiLEtBQUMsT0FBTyxjQUFjLE1BQU07Ozs7dUJBRTNCLE1BQU0sU0FBUyxNQUFNLEtBQUssV0FBVTs7WUFDekMsS0FBQzttQkFDQyxLQUFDLE1BQU0sTUFBTSxJQUFJOztlQUV2Qjs7O3FCQUVKLDRCQUFlLFFBQU87O2dCQUVYOztpQkFDSDt1QkFBVyxLQUFDLE9BQU87Ozs7OztxQkFFM0Isc0JBQVM7Ozs7WUFFQSxLQUFDOzs7O1FBQ04sTUFBTSxLQUFDLE1BQU0sUUFBUTthQUFtQixjQUFBLElBQUs7O21CQUFaOztRQUNqQyxNQUFNLEtBQUMsT0FBTyxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7O2lEQUMzQjs7O3FCQUVWLHNCQUFTOztZQUVNLEtBQUM7O21CQUFWOztZQUVDLEtBQUMsT0FBTyxNQUFNLGNBQWM7O29CQUNwQixNQUFNOztxQkFDVDtvQkFBUyxLQUFDLE9BQU8sY0FBYzs7cUJBQy9CO29CQUFTLEtBQUMsT0FBTyxjQUFjOzs7O29CQUNqQyxPQUFPOztlQUViOzs7cUJBUUoscUJBQVEsR0FBRSxHQUFFLEdBQUU7O3lDQUVKLEVBQUUsRUFBRSxFQUFFOzs7O1FBRVosS0FBQyxNQUFNLE9BQU8sSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7UUFFMUIsYUFBUyxHQUFHLElBQUU7ZUFFZCxLQUFDLE9BQU8sT0FBTyxJQUFFLEVBQUUsSUFBRSxFQUFFLElBQUUsRUFBRTs7O3FCQUUvQjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFM0MsS0FBQyxNQUFNO1FBQ1AsS0FBQyxPQUFPOzs7O1dBek1QOzs7ZUE2TUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/uniko.kode
