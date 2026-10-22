var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var choices

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let krzl = kxk.krzl
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name, features = [])
    {
        this["onKey"] = this["onKey"].bind(this)
        this["emitAction"] = this["emitAction"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["doubleClickChoiceAtIndex"] = this["doubleClickChoiceAtIndex"].bind(this)
        this["clickChoiceAtIndex"] = this["clickChoiceAtIndex"].bind(this)
        this["dragChoiceAtIndex"] = this["dragChoiceAtIndex"].bind(this)
        this["unhover"] = this["unhover"].bind(this)
        this["hoverChoiceAtIndex"] = this["hoverChoiceAtIndex"].bind(this)
        this["filter"] = this["filter"].bind(this)
        this["weight"] = this["weight"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["extract"] = this["extract"].bind(this)
        choices.__super__.constructor.call(this,screen,name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('hover',theme.hover)
        this.pointerType = 'pointer'
        this.roundedSelections = true
        this.frontRoundOffset = 0
        this.hoverIndex = -1
        this.hoverForSubmenu = false
        this.items = []
        this.fuzzied = this.items
        this.filterText = ''
    }

    choices.prototype["setColor"] = function (key, color)
    {
        choices.__super__.setColor.call(this,key,color)
    
        var _48_19_, _49_19_

        if (key === 'bg')
        {
            this.setColor('empty',this.color.bg)
            ;(this.gutter != null ? this.gutter.setColor('bg',this.color.bg) : undefined)
            return (this.scroll != null ? this.scroll.setColor('bg',this.color.bg) : undefined)
        }
    }

    choices.prototype["extract"] = function (item)
    {
        return (this.key && _k_.isObj(item) ? item[this.key] : kseg.str(item))
    }

    choices.prototype["clear"] = function ()
    {
        return this.set([])
    }

    choices.prototype["clearEmpty"] = function ()
    {
        this.items = []
        this.fuzzied = this.items
        return this.state.clearEmpty()
    }

    choices.prototype["set"] = function (items, key)
    {
        this.items = items
        this.key = key
    
        var lines, _69_15_

        this.items = ((_69_15_=this.items) != null ? _69_15_ : [])
        this.fuzzied = this.items
        this.filterText = ''
        lines = (this.key ? this.items.map(this.extract) : this.items)
        return this.state.loadLines(lines)
    }

    choices.prototype["add"] = function (item)
    {
        this.items.push(item)
        return this.state.addLine(item.line,item.ext)
    }

    choices.prototype["append"] = function (items, ext, key = 'line')
    {
        this.items = this.items.concat(items)
        this.fuzzied = this.items
        return this.state.appendLines(items.map(function (i)
        {
            return i[key]
        }),ext)
    }

    choices.prototype["drawCursors"] = function ()
    {}

    choices.prototype["drawSelections"] = function ()
    {
        var fg, li, sel, x, xs, y

        if (_k_.empty(this.state.s.selections))
        {
            return
        }
        if (!this.roundedSelections)
        {
            return choices.__super__.drawSelections.call(this)
        }
        fg = (this.hasFocus() ? this.color.hover.bg : this.color.hover.blur)
        if (!this.cells.screen.t.hasFocus)
        {
            fg = color.darken(fg)
        }
        sel = this.state.s.selections[0]
        li = sel[1]
        y = li - this.state.s.view[1]
        if (y >= this.cells.rows)
        {
            return
        }
        xs = _k_.max(sel[0],kseg.headCount(this.state.s.lines[li],' '))
        if (xs === 0)
        {
            xs += this.frontRoundOffset
        }
        this.cells.set_ch_fg(xs - 1 - this.state.s.view[0],y,'',fg)
        for (var _a_ = x = xs, _b_ = sel[2]; (_a_ <= _b_ ? x < sel[2] : x > sel[2]); (_a_ <= _b_ ? ++x : --x))
        {
            this.cells.set_bg(x - this.state.s.view[0],y,fg)
            this.cells.adjustContrastForHighlight(x - this.state.s.view[0],y,fg)
        }
        return this.cells.set_ch_fg(x - this.state.s.view[0],y,'',fg)
    }

    choices.prototype["numChoices"] = function ()
    {
        return this.items.length
    }

    choices.prototype["numFiltered"] = function ()
    {
        return this.fuzzied.length
    }

    choices.prototype["currentIndex"] = function ()
    {
        return this.state.mainCursor()[1]
    }

    choices.prototype["current"] = function (opt)
    {
        var cc

        cc = this.fuzzied[this.currentIndex()]
        if (_k_.isStr(cc))
        {
            if ((opt != null ? opt.trim : undefined) === 'front')
            {
                cc = _k_.ltrim(cc)
            }
            else if ((opt != null ? opt.trim : undefined) !== false)
            {
                cc = _k_.trim(cc)
            }
        }
        return cc
    }

    choices.prototype["choiceAtRow"] = function (row)
    {
        return this.fuzzied[row]
    }

    choices.prototype["hasNext"] = function ()
    {
        var _147_26_

        return (this.nextRow() != null)
    }

    choices.prototype["hasPrev"] = function ()
    {
        var _148_26_

        return (this.prevRow() != null)
    }

    choices.prototype["nextRow"] = function ()
    {
        var y

        y = this.state.mainCursor()[1]
        while (y < this.state.s.lines.length - 1)
        {
            y += 1
            if (kseg.trim(this.state.s.lines[y]).length)
            {
                return y
            }
        }
    }

    choices.prototype["prevRow"] = function ()
    {
        var y

        y = this.state.mainCursor()[1]
        while (y > 0)
        {
            y -= 1
            if (kseg.trim(this.state.s.lines[y]).length)
            {
                return y
            }
        }
    }

    choices.prototype["pageUpRow"] = function ()
    {
        var y

        y = this.state.mainCursor()[1] - this.cells.rows + 1
        y = _k_.max(y,0)
        while (y > 0 && _k_.empty(kseg.trim(this.state.s.lines[y])))
        {
            y -= 1
        }
        if (_k_.empty(kseg.trim(this.state.s.lines[y])) && y < this.state.s.lines.length - 1)
        {
            y += 1
        }
        return y
    }

    choices.prototype["pageDownRow"] = function ()
    {
        var y

        y = this.state.mainCursor()[1] + this.cells.rows - 1
        y = _k_.min(y,this.state.s.lines.length - 1)
        while (y < this.state.s.lines.length - 1 && _k_.empty(kseg.trim(this.state.s.lines[y])))
        {
            y += 1
        }
        if (_k_.empty(kseg.trim(this.state.s.lines[y])) && y > 0)
        {
            y -= 1
        }
        return y
    }

    choices.prototype["select"] = function (row)
    {
        if (!(_k_.isNum(row)))
        {
            return
        }
        if (row < 0 || row >= this.state.s.lines.length)
        {
            return
        }
        this.state.setSelections([belt.rangeOfLine(this.state.s.lines,row)])
        this.state.setMainCursor(0,row)
        if (this.focusable)
        {
            this.grabFocus()
        }
        return this.emit('select',this.choiceAtRow(row))
    }

    choices.prototype["selectFirst"] = function ()
    {
        return this.select(0)
    }

    choices.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'pagedown':
                this.selectPageDown()
                break
            case 'pageup':
                this.selectPageUp()
                break
            case 'down':
                this.selectNext()
                break
            case 'up':
                this.selectPrev()
                break
        }

        return this
    }

    choices.prototype["selectPageUp"] = function ()
    {
        return this.select(this.pageUpRow())
    }

    choices.prototype["selectPageDown"] = function ()
    {
        return this.select(this.pageDownRow())
    }

    choices.prototype["selectNext"] = function ()
    {
        return this.select(this.nextRow())
    }

    choices.prototype["selectPrev"] = function ()
    {
        var row

        row = this.prevRow()
        if (_k_.empty(row))
        {
            return this.emitAction('boundary',this.current())
        }
        else
        {
            return this.select(row)
        }
    }

    choices.prototype["weight"] = function (item, text)
    {
        var itemText, matchOrLevenshtein, p, w

        itemText = this.extract(item)
        p = slash.parse(itemText)
        matchOrLevenshtein = function (t)
        {
            var idx

            idx = t.indexOf(text)
            if (idx < 0)
            {
                idx = t.length + kstr.levensthein(t,text)
            }
            return idx
        }
        w = this.items.indexOf(item)
        w += 10 * matchOrLevenshtein(p.name)
        w += 5 * matchOrLevenshtein(p.dir)
        w += (!_k_.empty(p.ext) ? (0.1 * matchOrLevenshtein(p.ext)) : 4)
        return w
    }

    choices.prototype["filter"] = function (text)
    {
        var fuzz, lines

        if (_k_.empty(this.items))
        {
            return
        }
        if (text === this.filterText)
        {
            return
        }
        if (_k_.empty(text))
        {
            return this.set(this.items,this.key)
        }
        this.filterText = text
        fuzz = new krzl({values:this.items,extract:this.extract})
        this.fuzzied = fuzz.filter(text)
        this.fuzzied.sort((function (a, b)
        {
            return this.weight(a,text) - this.weight(b,text)
        }).bind(this))
        lines = this.fuzzied.map(this.extract)
        if (_k_.empty(lines))
        {
            lines = ['']
        }
        return this.state.loadLines(lines)
    }

    choices.prototype["hoverChoiceAtIndex"] = function (index, event)
    {
        if (this.hoverIndex === index)
        {
            return true
        }
        this.hoverIndex = index
        this.state.setMainCursor(0,index)
        this.select(this.hoverIndex)
        post.emit('pointer','pointer')
        this.emitAction('hover',this.current(),event)
        return {redraw:true}
    }

    choices.prototype["unhover"] = function ()
    {
        this.hoverIndex = -1
        this.state.deselect()
        post.emit('pointer','default')
        return {redraw:true}
    }

    choices.prototype["dragChoiceAtIndex"] = function (index, event)
    {
        this.hoverChoiceAtIndex(index,event)
        this.emitAction('drag',this.fuzzied[index],event)
        return {redraw:true}
    }

    choices.prototype["clickChoiceAtIndex"] = function (index, event)
    {
        this.hoverIndex = -1
        this.emitAction('click',this.fuzzied[index],event)
        return {redraw:true}
    }

    choices.prototype["doubleClickChoiceAtIndex"] = function (index, event)
    {
        this.hoverIndex = -1
        this.emitAction('doubleclick',this.fuzzied[index],event)
        return {redraw:true}
    }

    choices.prototype["onMouse"] = function (event)
    {
        var col, dx, dy, ret, row, _329_21_

        ret = choices.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = (this.mapscr != null ? this.mapscr.onMouse(event) : undefined)
        if (ret)
        {
            return ret
        }
        if (this.hover)
        {
            var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

            if (this.state.isValidLineIndex(row))
            {
                if (!_k_.empty(event.delta) && this.hoverForSubmenu && event.type === 'move' && col > kseg.width(this.state.s.lines[row]))
                {
                    dx = Math.abs(event.delta[0])
                    dy = Math.abs(event.delta[1])
                    if (dx * 2 >= dy)
                    {
                        return
                    }
                }
                switch (event.type)
                {
                    case 'move':
                        return this.hoverChoiceAtIndex(row + this.state.s.view[1],event)

                    case 'press':
                        if (event.count === 2)
                        {
                            return this.doubleClickChoiceAtIndex(row + this.state.s.view[1],event)
                        }
                        else
                        {
                            this.dragStart = [col,row]
                            return this.clickChoiceAtIndex(row + this.state.s.view[1],event)
                        }
                        break
                    case 'drag':
                        if (this.dragStart)
                        {
                            return this.dragChoiceAtIndex(row + this.state.s.view[1],event)
                        }
                        break
                    case 'release':
                        delete this.dragStart
                        break
                }

            }
        }
        return this.hover
    }

    choices.prototype["emitAction"] = function (action, choice, event)
    {
        return this.emit('action',action,choice,event)
    }

    choices.prototype["onKey"] = function (key, event)
    {
        switch (event.combo)
        {
            case 'up':
            case 'down':
            case 'pageup':
            case 'pagedown':
                this.moveSelection(event.combo)
                return true

            case 'ctrl+alt+up':
                this.moveSelection('pageup')
                return true

            case 'ctrl+alt+down':
                this.moveSelection('pagedown')
                return true

        }

        if (!this.hasFocus())
        {
            return
        }
        this.emitAction(event.combo,this.current(),event)
        return true
    }

    return choices
})()

global.choices_class = choices
export default choices;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvaWNlcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2Nob2ljZXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCUyxXQUFUOzt3QkFBeUI7YUFFckIsU0FBRyxRQUFPLE1BQUs7Ozs7Ozs7Ozs7Ozs7O2dEQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLFFBQVEsTUFBTTtRQUV4QixLQUFDLGNBQWM7UUFDZixLQUFDLG9CQUFvQjtRQUNyQixLQUFDLG1CQUFtQjtRQUNwQixLQUFDLGFBQWE7UUFDZCxLQUFDLGtCQUFrQjtRQUVuQixLQUFDO1FBQ0QsS0FBQyxVQUFVLEtBQUM7UUFDWixLQUFDLGFBQWE7Ozt1QkFFbEIsdUJBQVUsS0FBSTs7NkNBRUosSUFBSTs7OztZQUVQLFFBQU87O1lBQ04sS0FBQyxTQUFpQixRQUFRLEtBQUMsTUFBTTtjQUNqQyxLQUFDLGlCQUFELEtBQUMsT0FBUSxTQUFTLEtBQVEsS0FBQyxNQUFNO29CQUNqQyxLQUFDLGlCQUFELEtBQUMsT0FBUSxTQUFTLEtBQVEsS0FBQyxNQUFNOzs7O3VCQUV6QyxzQkFBUzs7Z0JBQVEsS0FBQyxpQkFBUSxRQUFjLEtBQUssS0FBQyxPQUFPLEtBQUssSUFBSTs7O3VCQUU5RDs7ZUFBVSxLQUFDOzs7dUJBRVg7O1FBRUksS0FBQztRQUNELEtBQUMsVUFBVSxLQUFDO2VBQ1osS0FBQyxNQUFNOzs7dUJBUVgsa0JBQUssT0FBTzs7Ozs7OztRQUVSLEtBQUMsa0JBQUQsS0FBQztRQUNELEtBQUMsVUFBVSxLQUFDO1FBQ1osS0FBQyxhQUFhO1FBRWQsU0FBUSxLQUFDLE1BQU0sS0FBQyxNQUFNLElBQUksS0FBQyxXQUFXLEtBQUM7ZUFFdkMsS0FBQyxNQUFNLFVBQVU7Ozt1QkFFckIsa0JBQUs7O1FBRUQsS0FBQyxNQUFNLEtBQUs7ZUFDWixLQUFDLE1BQU0sUUFBUSxLQUFL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/choices.kode
