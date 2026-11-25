var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var uniko

import clip from "../../../kxk/clip.js"
import kseg from "../../../kxk/kseg.js"
import post from "../../../kxk/post.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import specs from "../../edit/specs.js"

import view from "../base/view.js"
import input from "../base/input.js"
import matrix from "../base/matrix.js"
import bubbles from "../base/bubbles.js"

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

        this["drawInfo"] = this["drawInfo"].bind(this)
        this["infoBubbles"] = this["infoBubbles"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
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
        this.setColor('bg',theme.uniko.bg)
        this.setColor('hex',theme.uniko.hex)
        this.setColor('hex_fg',theme.uniko.hex_fg)
        this.setColor('name',theme.uniko.name)
        this.setColor('name_fg',theme.uniko.name_fg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.matrix = new matrix(this.screen,`${this.name}_matrix`)
        this.info = new bubbles(this.screen,`${this.name}_info`)
        this.info.pointRight = true
        this.matrix.setColor('bg',theme.uniko.bg)
        this.matrix.setColor('fg',theme.uniko.fg)
        this.matrix.setColor('selection',theme.uniko.selection)
        this.matrix.setColor('selection_blur',theme.uniko.selection_blur)
        this.matrix.setColor('scroll',theme.scroll.knob)
        this.matrix.setColor('scroll_dot',theme.scroll.dot)
        this.input.drawUnfocusedCursors = false
        this.input.on('action',this.onInputAction)
        this.matrix.on('submit',this.submit)
        this.allItems = []
        this.charItem = {}
        for (char in julia)
        {
            comment = julia[char]
            this.allItems.push({char:char,search:_k_.trim(comment)})
            this.charItem[char] = this.allItems.slice(-1)[0]
        }
        this.matrix.setItems(this.allItems)
        this.mouseItems = [this.input,this.matrix]
        this.focusRing = [this.input,this.matrix]
        this.wheelItems = [this.matrix]
        this.focusUpDown = false
        this.isVisible = false
    }

    uniko["MAXCHARS"] = 0x10000
    uniko["parse"] = function (text)
    {
        var a, add, b, chars, code, i, m, next, op, pos, rgx, t, toks, _104_59_

        toks = []
        rgx = /\s+|[+-]|0x[0-9a-f]+|[0-9a-f]+|[^\x00-\x7f]/iuy
        pos = 0
        while (pos < text.length)
        {
            rgx.lastIndex = pos
            m = rgx.exec(text)
            if (!m)
            {
                return null
            }
            pos += m[0].length
            t = m[0]
            if (/^\s/.test(t))
            {
                continue
            }
            else if (_k_.in(t,['+','-']))
            {
                toks.push({op:t})
            }
            else if (t.codePointAt(0) > 0x7f)
            {
                toks.push({cp:t.codePointAt(0)})
            }
            else
            {
                toks.push({num:t})
            }
        }
        if (_k_.empty(toks))
        {
            return null
        }
        code = function (t)
        {
            var _80_27_, _81_32_

            if (((t != null ? t.cp : undefined) != null))
            {
                return t.cp
            }
            if (!((t != null ? t.num : undefined) != null))
            {
                return null
            }
            if (/^0x[0-9a-f]+$/i.test(t.num))
            {
                return parseInt(t.num.slice(2),16)
            }
            if (t.num.length >= 4 && /[0-9]/.test(t.num))
            {
                return parseInt(t.num,16)
            }
            return null
        }
        chars = new Set
        add = function (a, b)
        {
            var c

            for (c = a; c <= b; c++)
            {
                if (chars.size >= uniko.MAXCHARS || c > 0x10ffff)
                {
                    break
                }
                if (c < 0x20 || (0x7f <= c && c <= 0x9f) || (0xd800 <= c && c <= 0xdfff))
                {
                    continue
                }
                chars.add(String.fromCodePoint(c))
            }
        }
        i = 0
        while (i < toks.length)
        {
            a = code(toks[i])
            if (!(a != null))
            {
                return null
            }
            op = (toks[i + 1] != null ? toks[i + 1].op : undefined)
            next = toks[i + 2]
            if (op && !(next != null))
            {
                add(a,a)
                break
            }
            switch (op)
            {
                case '+':
                    if (!/^[0-9]+$/.test(((_104_59_=next.num) != null ? _104_59_ : '')))
                    {
                        return null
                    }
                    add(a,a + parseInt(next.num))
                    i += 3
                    break
                case '-':
                    b = code(next)
                    if (!(b != null))
                    {
                        return null
                    }
                    add(_k_.min(a,b),_k_.max(a,b))
                    i += 3
                    break
                default:
                    add(a,a)
                    i += 1
            }

        }
        return Array.from(chars)
    }

    uniko.prototype["filter"] = function (text)
    {
        var chars, matches, words

        if (chars = uniko.parse(text))
        {
            return this.matrix.setItems(chars.map((function (c)
            {
                var _121_61_

                return ((_121_61_=this.charItem[c]) != null ? _121_61_ : {char:c,search:''})
            }).bind(this)))
        }
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
        this.input.grabFocus()
        return true
    }

    uniko.prototype["focusMatrix"] = function ()
    {
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
        var ret

        if (this.hidden())
        {
            return false
        }
        if (!this.hasFocus())
        {
            return false
        }
        if (ret = uniko.__super__.onKey.call(this,key,event))
        {
            return ret
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

        if (this.input.hasFocus())
        {
            switch (event.combo)
            {
                case 'down':
                    return this.focusMatrix()

                case 'tab':
                    return true

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
            case 'right':
            case 'down':
            case 'left':
                return this.matrix.moveSelection(event.combo)

        }

        if (!_k_.empty(event.char) && event.char.length === 1)
        {
            this.focusInput()
            if (event.char === '\t')
            {
                return true
            }
            return this.input.onKey(key,event)
        }
    }

    uniko.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'change':
                return this.filter(text)

        }

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
        this.drawInfo()
        this.matrix.draw()
        return uniko.__super__.draw.call(this)
    }

    uniko.prototype["infoBubbles"] = function (width)
    {
        var all, hex, item, names

        item = this.matrix.items[this.matrix.selectedIndex]
        if (_k_.empty((item != null ? item.char : undefined)))
        {
            return []
        }
        hex = Array.from(item.char).map(function (c)
        {
            return c.codePointAt(0).toString(16)
        }).join(' ')
        names = item.search.split(/\s+/).filter(function (n)
        {
            return !_k_.empty(n)
        }).map((function (name, i)
        {
            return {text:name,fg:this.color.name_fg,bg:color.darken(this.color.name,_k_.max(0.4,1 - 0.2 * i))}
        }).bind(this))
        all = names.concat([{text:hex,fg:this.color.hex_fg,bg:this.color.hex}])
        if (bubbles.width(all) <= width)
        {
            return all
        }
        while (names.length && bubbles.width(names) > width)
        {
            names.pop()
        }
        return names
    }

    uniko.prototype["drawInfo"] = function ()
    {
        var free, items, right, w

        right = this.cells.cols - 1
        free = right - 1 - kseg.width(this.input.current()) - 2
        items = this.infoBubbles(free)
        if (_k_.empty(items))
        {
            return
        }
        w = bubbles.width(items)
        this.info.layout(this.cells.x + right - w,this.cells.y + 1,w,1)
        this.info.setColor('empty',this.input.color.bg)
        this.info.set(items)
        return this.info.draw()
    }

    return uniko
})()

export default uniko;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pa28uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3VuaWtvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjtPQUFXLFdBQVg7T0FBZ0IsV0FBaEI7O09BQ00sWUFBVDtPQUFlLFlBQWY7O09BQ1MsWUFBVDs7T0FDUyxXQUFaO09BQWlCLFlBQWpCO09BQXVCLGFBQXZCO09BQThCLGNBQTlCOztPQUVBLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUM3RCxTQUFEOztzQkFBTzthQUdILE9BQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4Q0FFVCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsU0FBUztRQUVWLEtBQUMsU0FBUyxLQUFVLE1BQU0sTUFBTTtRQUNoQyxLQUFDLFNBQVMsTUFBVSxNQUFNLE1BQU07UUFDaEMsS0FBQyxTQUFTLFNBQVUsTUFBTSxNQUFNO1FBQ2hDLEtBQUMsU0FBUyxPQUFVLE1BQU0sTUFBTTtRQUNoQyxLQUFDLFNBQVMsVUFBVSxNQUFNLE1BQU07UUFFaEMsS0FBQyxZQUFhLE1BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxhQUFhLE9BQVEsS0FBQyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxXQUFhLFFBQVEsS0FBQyxVQUFVLEtBQUM7UUFFbEMsS0FBQyxLQUFLLGFBQWE7UUFFbkIsS0FBQyxPQUFPLFNBQVMsS0FBaUIsTUFBTSxNQUFNO1FBQzlDLEtBQUMsT0FBTyxTQUFTLEtBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxZQUFpQixNQUFNLE1BQU07UUFDOUMsS0FBQyxPQUFPLFNBQVMsaUJBQWlCLE1BQU0sTUFBTTtRQUM5QyxLQUFDLE9BQU8sU0FBUyxTQUFpQixNQUFNLE9BQU87UUFDL0MsS0FBQyxPQUFPLFNBQVMsYUFBaUIsTUFBTSxPQUFPO1FBRS9DLEtBQUMsTUFBTSx1QkFB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
//# sourceURL=../../../../kode/ked/view/colmns/uniko.kode
