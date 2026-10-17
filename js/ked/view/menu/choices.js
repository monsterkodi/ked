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
                if (this.hoverForSubmenu && event.type === 'move' && col > kseg.width(this.state.s.lines[row]))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvaWNlcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9tZW51L2Nob2ljZXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQXNCeUI7Ozs7Ozs7Ozs7Ozs7OztnREFJWCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxTQUFTLEtBQVEsTUFBTSxPQUFPO1FBQy9CLEtBQUMsU0FBUyxRQUFRLE1BQU07UUFFeEIsS0FBQyxjQUFjO1FBQ2YsS0FBQyxvQkFBb0I7UUFDckIsS0FBQyxtQkFBbUI7UUFDcEIsS0FBQyxhQUFhO1FBQ2QsS0FBQyxrQkFBa0I7UUFFbkIsS0FBQztRQUNELEtBQUMsVUFBVSxLQUFDO1FBQ1osS0FBQyxhQUFhOzs7Ozs2Q0FJUixJQUFJOzs7O1lBRVAsUUFBTzs7WUFDTixLQUFDLFNBQWlCLFFBQVEsS0FBQyxNQUFNO2NBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07b0JBQ2pDLEtBQUMsaUJBQUQsS0FBQyxPQUFRLFNBQVMsS0FBUSxLQUFDLE1BQU07Ozs7OztnQkFFeEIsS0FBQyxpQkFBUSxRQUFjLEtBQUssS0FBQyxPQUFPLEtBQUssSUFBSTs7Ozs7ZUFFcEQsS0FBQzs7Ozs7UUFJUCxLQUFDO1FBQ0QsS0FBQyxVQUFVLEtBQUM7ZUFDWixLQUFDLE1BQU07Ozs7Ozs7Ozs7UUFVUCxLQUFDLGtCQUFELEtBQUM7UUFDRCxLQUFDLFVBQVUsS0FBQztRQUNaLEtBQUMsYUFBYTtRQUVkLFNBQVEsS0FBQyxNQUFNLEtBQUMsTUFBTSxJQUFJLEtBQUMsV0FBVyxLQUFDO2VBRXZDLEtBQUMsTUFBTSxVQUFVOzs7OztRQUlqQixLQUFDLE1BQU0sS0FBSztlQUNaLEtBQUMsTUFBTSxRQUFRLEtBQUssS0FBSyxLQUFLOzs7OztRQUk5QixLQUFDLFFBQVEsS0FBQyxNQUFNLE9BQU87UUFDdkIsS0FBQyxVQUFVLEtBQUM7ZUFDWixLQUFDLE1BQU0sWUFBWSxNQUFNOztt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
//# sourceURL=file://kode/ked/view/menu/choices.kode
