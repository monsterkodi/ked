var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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
        this["focusMatrix"] = this["focusMatrix"].bind(this)
        this["focusInput"] = this["focusInput"].bind(this)
        this["filter"] = this["filter"].bind(this)
        this["splitValue"] = this["splitValue"].bind(this)
        uniko.__super__.constructor.call(this,this.screen,name)
        this.height = 14
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
        this.allItems = this.buildItems()
        this.matrix.setItems(this.allItems)
        this.isVisible = false
    }

    uniko.prototype["buildItems"] = function ()
    {
        var byChar, ch, char, comment, comments, items, key, val

        items = []
        byChar = {}
        var list = _k_.list(specs.trigger['~'])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            char = _k_.trim(ch)
            if (_k_.empty(char))
            {
                continue
            }
            this.addItem(items,byChar,char,ch,[],[])
        }
        for (key in julia)
        {
            val = julia[key]
            var _b_ = this.splitValue(val); char = _b_[0]; comment = _b_[1]

            if (_k_.empty(char))
            {
                continue
            }
            if (kseg.segWidth(char) >= 2)
            {
                continue
            }
            comments = []
            if (!_k_.empty(comment))
            {
                comments.push(comment)
            }
            this.addItem(items,byChar,char,char,[key],comments)
        }
        return items
    }

    uniko.prototype["splitValue"] = function (value)
    {
        var idx

        idx = value.indexOf('#')
        if (idx < 0)
        {
            return [_k_.trim(value),'']
        }
        return [_k_.trim(value.slice(0, typeof idx === 'number' ? idx : -1)),_k_.trim(value.slice(idx + 1))]
    }

    uniko.prototype["showFor"] = function (char)
    {
        if (kseg.segWidth(char) === 0)
        {
            return '◌' + char
        }
        return char
    }

    uniko.prototype["addItem"] = function (items, byChar, char, insert, keys, comments)
    {
        var comment, item, key

        item = byChar[char]
        if (!(item != null))
        {
            item = {char:insert,show:this.showFor(char),keys:[],comments:[],search:''}
            byChar[char] = item
            items.push(item)
        }
        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            key = list[_a_]
            if (!(_k_.in(key,item.keys)))
            {
                item.keys.push(key)
            }
        }
        var list1 = _k_.list(comments)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            comment = list1[_b_]
            if (!(_k_.in(comment,item.comments)))
            {
                item.comments.push(comment)
            }
        }
        return item.search = item.keys.concat(item.comments).join(' ').toLowerCase()
    }

    uniko.prototype["filter"] = function (text)
    {
        var matches, needle

        text = _k_.trim(text)
        if (_k_.empty(text))
        {
            this.matrix.setItems(this.allItems)
            return
        }
        needle = text.toLowerCase()
        matches = this.allItems.filter(function (item)
        {
            return item.search.includes(needle)
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

            case 'return':
                return this.submit()

            case 'cmd+c':
                return this.copy()

            case 'ctrl+c':
                return this.copy()

        }

        if (event.combo === 'space')
        {
            return this.submit()
        }
        if (this.focus === 'input')
        {
            if (event.combo === 'down')
            {
                this.focusMatrix()
                return true
            }
            return this.input.onKey(key,event)
        }
        if (!_k_.empty(event.char) && event.char.length === 1 && _k_.in(event.char,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'))
        {
            this.focusInput()
            return this.input.onKey(key,event)
        }
        switch (event.combo)
        {
            case 'up':
                if (this.matrix.moveSelection('up'))
                {
                    return true
                }
                this.focusInput()
                return true

            case 'left':
            case 'right':
            case 'down':
            case 'pageup':
            case 'pagedown':
                this.matrix.moveSelection(event.combo)
                return true

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
        var x, y

        if (this.hidden())
        {
            return false
        }
        if (this.input.cells.isInsideEvent(event))
        {
            this.focusInput()
            return this.input.onMouse(event)
        }
        if (this.matrix.cells.isInsideEvent(event))
        {
            if (event.type === 'press')
            {
                var _a_ = this.matrix.cells.posForEvent(event); x = _a_[0]; y = _a_[1]

                this.focus = 'matrix'
                this.matrix.selectAt(parseInt((x - 1) / 2),y)
                this.matrix.grabFocus()
                this.submit()
            }
            return {redraw:true}
        }
        return false
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
    
        this.input.layout(x + 1,y + 1,w - 2,1)
        return this.matrix.layout(x + 1,y + 3,w - 2,10)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FjYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFOOztPQUNNLFlBQVQ7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxRQUFRLFFBQU87O1FBQWhCO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OENBRUQsS0FBQyxPQUFPO1FBRWQsS0FBQyxTQUFTO1FBQ1YsS0FBQyxRQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsWUFBYSxNQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ2pDLEtBQUMsYUFBYSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRWpDLEtBQUMsT0FBTyxTQUFTLEtBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxLQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsWUFBaUIsTUFBTSxNQUFNO1FBQzlDLEtBQUMsT0FBTyxTQUFTLGlCQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsU0FBaUIsTUFBTSxPQUFPO1FBQy9DLEtBQUMsT0FBTyxTQUFTLGFBQWlCLE1BQU0sT0FBTztRQUUvQyxLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxXQUFXLEtBQUM7UUFDYixLQUFDLE9BQU8sU0FBUyxLQUFDO1FBRWxCLEtBQUMsWUFBWTs7O3FCQU1qQjs7OztRQUVJO1FBQ0E7NEJBRVUsTUFBTSxRQUFROzs7WUFBcEI7WUFDQSxnQkFBWTswQkFDTTs7Z0JBQWxCOztZQUNBLEtBQUMsUUFBUSxNQUFNLE9BQU8sS0FBSzs7YUFFM0IsT0FBVzs7WUFBUCxNQUFPO3NC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/uniko.kode
