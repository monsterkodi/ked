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
    
        var _41_19_, _42_19_

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
    
        var lines, _56_15_

        this.items = ((_56_15_=this.items) != null ? _56_15_ : [])
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
        var _122_26_

        return (this.nextRow() != null)
    }

    choices.prototype["hasPrev"] = function ()
    {
        var _123_26_

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
        var col, dx, dy, ret, row, _274_21_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvaWNlcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2Nob2ljZXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQUs7SUFBTTtJQUFLOztPQUNyQixZQUFaO09BQWtCLFlBQWxCOztPQUNZLFdBQVA7O09BQ08sYUFBWjs7O0FBQ1QsV0FBRDs7d0JBQVM7YUFZTCxTQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7Ozs7Z0RBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNO1FBRXhCLEtBQUMsY0FBYztRQUNmLEtBQUMsb0JBQW9CO1FBQ3JCLEtBQUMsbUJBQW1CO1FBQ3BCLEtBQUMsYUFBYTtRQUNkLEtBQUMsa0JBQWtCO1FBRW5CLEtBQUM7UUFDRCxLQUFDLFVBQVUsS0FBQztRQUNaLEtBQUMsYUFBYTs7O3VCQUVsQix1QkFBVSxLQUFJOzs2Q0FFSixJQUFJOzs7O1lBRVAsUUFBTzs7WUFDTixLQUFDLFNBQWlCLFFBQVEsS0FBQyxNQUFNO2NBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07b0JBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07Ozs7dUJBRXpDLHNCQUFTOztnQkFBUSxLQUFDLE9BQWdCLFVBQVIsUUFBYyxLQUFLLEtBQUMsT0FBTyxLQUFLLElBQUk7Ozt1QkFFOUQ7O2VBQVUsS0FBQzs7O3VCQUVYOztRQUVJLEtBQUM7UUFDRCxLQUFDLFVBQVUsS0FBQztlQUNaLEtBQUMsTUFBTTs7O3VCQUVYLGtCQUFNLE9BQU87O1FBQVI7UUFBTzs7OztRQUVSLEtBQUMsa0JBQUQsS0FBQztRQUNELEtBQUMsVUFBVSxLQUFDO1FBQ1osS0FBQyxhQUFhO1FBRWQsU0FBUSxLQUFDLE1BQU0sS0FBQyxNQUFNLElBQUksS0FBQyxXQUFXLEtBQUM7ZUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/choices.kode
