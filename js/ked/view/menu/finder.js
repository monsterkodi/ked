var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var finder

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil

import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import inputchoice from "./inputchoice.js"


finder = (function ()
{
    _k_.extend(finder, inputchoice)
    function finder (screen, editor, name = 'finder')
    {
        this.screen = screen
        this.editor = editor
    
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["lineno"] = this["lineno"].bind(this)
        this.state = this.editor.state
        finder.__super__.constructor.call(this,this.screen,name,['gutter','scroll'])
        this.autoHideInput = false
        if (this.name === 'finder')
        {
            post.on('finder.show',this.show)
        }
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.choices.state.skipAdjustViewForMainCursor = true
        this.choices.state.syntax.setExt('kode')
        this.choices.gutter.lineno = this.lineno
        this.choices.gutter.setColor('highlight',theme.gutter.fg)
        this.choices.gutter.setColor('bg_fully_selected',theme.finder.bg)
    }

    finder.prototype["lineno"] = function (y)
    {
        var pad, _32_43_

        pad = this.choices.gutter.cells.cols - 1
        if ((0 <= y && y < this.choices.fuzzied.length))
        {
            if (this.choices.fuzzied[y].type === 'file')
            {
                if ((this.choices.fuzzied[y].line != null))
                {
                    return _k_.lpad(pad,this.choices.fuzzied[y].line) + ' '
                }
                else
                {
                    return _k_.lpad(pad,'●') + ' '
                }
            }
            if (_k_.isNum(this.choices.fuzzied[y].row))
            {
                return _k_.lpad(pad,this.choices.fuzzied[y].row + 1) + ' '
            }
        }
        return _k_.lpad(pad + 1)
    }

    finder.prototype["arrangeRect"] = function ()
    {
        return [parseInt(this.editor.cells.x - this.editor.gutter.cells.cols - 1),parseInt(this.editor.cells.y),parseInt(this.editor.cells.cols + this.editor.gutter.cells.cols + 1),parseInt(this.editor.cells.rows - 3)]
    }

    finder.prototype["arrange"] = function ()
    {
        var cs, h, w, x, y

        var _a_ = this.arrangeRect(); x = _a_[0]; y = _a_[1]; w = _a_[2]; h = _a_[3]

        cs = _k_.min(h - 1,this.choices.numFiltered())
        this.input.layout(x + 2,y + 1,w - 4,1)
        this.choices.layout(x + 1,y + 3,w - 2,cs)
        return this.cells.layout(x,y,w,cs + 4)
    }

    finder.prototype["show"] = function (text)
    {
        var cursorLine, front, span, _92_87_

        if (_k_.empty(text))
        {
            cursorLine = this.state.mainCursor()[1]
        }
        text = this.searchText(text)
        if (_k_.empty(text))
        {
            this.choices.clear()
            this.input.show()
            return finder.__super__.show.call(this)
        }
        this.state.highlightText(text)
        this.choices.clearEmpty()
        front = belt.frontmostSpans(this.state.s.highlights)
        var list = _k_.list(front)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (this.choices.items.length > 1 && this.choices.items.slice(-1)[0].row !== span[1] - 1)
            {
                this.choices.add({line:''})
            }
            this.choices.add({ext:'kode',line:' ' + kseg.str(this.state.s.lines[span[1]]),row:span[1],col:span[2]})
        }
        this.choices.state.highlightText(text)
        if (cursorLine)
        {
            this.choices.select(((_92_87_=kutil.findIndex(this.choices.items,function (l)
            {
                return l.row === cursorLine
            })) != null ? _92_87_ : 0))
        }
        else
        {
            this.choices.selectFirst()
        }
        this.input.show()
        finder.__super__.show.call(this)
        return this.input.grabFocus()
    }

    finder.prototype["searchText"] = function (text)
    {
        var i, lines

        if (_k_.empty(text))
        {
            text = this.state.textOfSelectionOrWordAtCursor()
            if (_k_.in('\n',text))
            {
                lines = belt.linesForText(text)
                text = lines[0]
                for (var _a_ = i = 1, _b_ = lines.length; (_a_ <= _b_ ? i < lines.length : i > lines.length); (_a_ <= _b_ ? ++i : --i))
                {
                    if (text !== lines[i])
                    {
                        text = this.state.wordAtCursor()
                        break
                    }
                }
            }
        }
        text = (text != null ? text : '')
        if (text !== this.input.current())
        {
            this.input.set(text)
            this.input.selectAll()
            this.input.state.moveCursors('eol')
        }
        return text
    }

    finder.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            post.emit('goto.line',choice.row,choice.col)
        }
        post.emit('focus','editor')
        this.hide()
        return {redraw:true}
    }

    finder.prototype["applyChoice"] = function (choice)
    {
        return this.apply(choice)
    }

    finder.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'delete':
                this.input.state.delete('back')
                this.input.grabFocus()
                return

            case 'left':
                this.input.grabFocus()
                return true

        }

        return finder.__super__.onChoicesAction.call(this,action,choice)
    }

    finder.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.apply(this.choices.current())

            case 'change':
                if (!_k_.empty(text))
                {
                    return this.show(text)
                }
                else
                {
                    return this.choices.clear()
                }
                break
        }

        return finder.__super__.onInputAction.call(this,action,text)
    }

    return finder
})()

export default finder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLOztPQUNWLFlBQVo7O09BQ1ksV0FBUDs7T0FDTyxrQkFBQTs7O0FBQ3JCLFVBQUQ7O3VCQUFRO2FBRUosUUFBSSxRQUFRLFFBQU8sT0FBSzs7UUFBckI7UUFBUTs7Ozs7UUFFUCxLQUFDLFFBQVEsS0FBQyxPQUFPOytDQUVYLEtBQUMsT0FBTyxNQUFNLFNBQVM7UUFFN0IsS0FBQyxnQkFBZ0I7WUFDYyxLQUFDLFNBQVE7O1lBQXhDLEtBQUssR0FBRyxjQUFjLEtBQUM7O1FBRXZCLEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87UUFFL0IsS0FBQyxRQUFRLE1BQU0sOEJBQThCO1FBQzdDLEtBQUMsUUFBUSxNQUFNLE9BQU8sT0FBTztRQUM3QixLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQUM7UUFFMUIsS0FBQyxRQUFRLE9BQU8sU0FBUyxZQUFvQixNQUFNLE9BQU87UUFDMUQsS0FBQyxRQUFRLE9BQU8sU0FBUyxvQkFBb0IsTUFBTSxPQUFPOzs7c0JBRTlELHFCQUFROzs7O1FBRUosTUFBTSxLQUFDLFFBQVEsT0FBTyxNQUFNLE9BQUs7YUFDOUIsS0FBSyxLQUFBLElBQUksS0FBQyxRQUFRLFFBQVE7O2dCQUN0QixLQUFDLFFBQVEsUUFBUSxHQUFHLFNBQVE7O3FCQUN4QixLQUFDLFFBQVEsUUFBUSxHQUFHOztvQ0FDWCxJQUFJLEtBQUMsUUFBUSxRQUFRLEdBQUcsUUFBUTs7OztvQ0FFaEMsSUFBSSxPQUFPOzs7Z0JBQ0csVUFBM0IsS0FBQyxRQUFRLFFBQVEsR0FBRzs7Z0NBQ1gsSUFBSSxLQUFDLFFBQVEsUUFBUSxHQUFHLE1BQUksS0FBSzs7O3dCQUM1QyxNQUFJOzs7c0JBRWI7O3lCQUdZLEtBQUMsT0FBTyxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/finder.kode
