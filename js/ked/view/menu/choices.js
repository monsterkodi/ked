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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvaWNlcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2Nob2ljZXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWlCYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07SUFBSzs7T0FDckIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLGFBQVo7OztBQUVELFdBQVQ7O3dCQUF5QjthQUVyQixTQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7Ozs7Z0RBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNO1FBRXhCLEtBQUMsY0FBYztRQUNmLEtBQUMsb0JBQW9CO1FBQ3JCLEtBQUMsbUJBQW1CO1FBQ3BCLEtBQUMsYUFBYTtRQUNkLEtBQUMsa0JBQWtCO1FBRW5CLEtBQUM7UUFDRCxLQUFDLFVBQVUsS0FBQztRQUNaLEtBQUMsYUFBYTs7O3VCQUVsQix1QkFBVSxLQUFJOzs2Q0FFSixJQUFJOzs7O1lBRVAsUUFBTzs7WUFDTixLQUFDLFNBQWlCLFFBQVEsS0FBQyxNQUFNO2NBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07b0JBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07Ozs7dUJBRXpDLHNCQUFTOztnQkFBUSxLQUFDLE9BQWdCLFVBQVIsUUFBYyxLQUFLLEtBQUMsT0FBTyxLQUFLLElBQUk7Ozt1QkFFOUQ7O2VBQVUsS0FBQzs7O3VCQUVYOztRQUVJLEtBQUM7UUFDRCxLQUFDLFVBQVUsS0FBQztlQUNaLEtBQUMsTUFBTTs7O3VCQVFYLGtCQUFNLE9BQU87O1FBQVI7UUFBTzs7OztRQUVSLEtBQUMsa0JBQUQsS0FBQztRQUNELEtBQUMsVUFBVSxLQUFDO1FBQ1osS0FBQyxhQUFhO1FBRWQsU0FBUSxLQUFDLE1BQU0sS0FBQyxNQUFNLElBQUksS0FBQyxXQUFXLEtBQUM7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/choices.kode
