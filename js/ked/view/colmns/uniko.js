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
        this.height = 16
        this.focus = 'input'
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.matrix = new matrix(this.screen,`${this.name}_matrix`)
        this.matrix.setColor('bg',theme.uniko.bg)
        this.matrix.setColor('fg',theme.uniko.fg)
        this.matrix.setColor('selection',theme.uniko.selection)
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
        this.focus = 'input'
        uniko.__super__.show.call(this)
        this.input.grabFocus()
        return post.emit('redraw')
    }

    uniko.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        uniko.__super__.hide.call(this)
        this.focus = 'input'
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
        this.hide()
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

        if (this.focus === 'input')
        {
            if (event.combo === 'down')
            {
                this.focusMatrix()
                return true
            }
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
            this.focusMatrix()
            if (event.type === 'press')
            {
                var _a_ = this.matrix.cells.posForEvent(event); x = _a_[0]; y = _a_[1]

                this.matrix.selectAt(parseInt((x - 1) / 2),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FjYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFOOztPQUNNLFlBQVQ7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxRQUFRLFFBQU87O1FBQWhCO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OENBRUQsS0FBQyxPQUFPO1FBRWQsS0FBQyxTQUFTO1FBQ1YsS0FBQyxRQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsWUFBYSxNQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ2pDLEtBQUMsYUFBYSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRWpDLEtBQUMsT0FBTyxTQUFTLEtBQVksTUFBTSxNQUFNO1FBQ3pDLEtBQUMsT0FBTyxTQUFTLEtBQVksTUFBTSxNQUFNO1FBQ3pDLEtBQUMsT0FBTyxTQUFTLFlBQVksTUFBTSxNQUFNO1FBRXpDLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUVwQixLQUFDLFdBQVcsS0FBQztRQUNiLEtBQUMsT0FBTyxTQUFTLEtBQUM7UUFFbEIsS0FBQyxZQUFZOzs7cUJBTWpCOzs7O1FBRUk7UUFDQTs0QkFFVSxNQUFNLFFBQVE7OztZQUFwQjtZQUNBLGdCQUFZOzBCQUNNOztnQkFBbEI7O1lBQ0EsS0FBQyxRQUFRLE1BQU0sT0FBTyxLQUFLOzthQUUzQixPQUFXOztZQUFQLE1BQU87c0JBQ00sS0FBQyxXQUFXLE1BQTVCLGVBQUs7OzBCQUNZOztnQkFBbEI7O2dCQUNZLEtBQUssU0FBUyxTQUFTOztnQkFBbkM7O1lBQ0E7MkJBQ21DOztnQkFBbkMsU0FBUyxLQUFLOztZQUNkLEtBQUMsUUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/uniko.kode
