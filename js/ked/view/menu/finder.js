var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        var pad, _49_43_

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
        var cursorLine, front, span, _121_87_

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
            this.choices.select(((_121_87_=kutil.findIndex(this.choices.items,function (l)
            {
                return l.row === cursorLine
            })) != null ? _121_87_ : 0))
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
        if (_k_.empty(text))
        {
            text = this.state.textOfSelectionOrWordAtCursor()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFld0I7Ozs7Ozs7OztRQUloQixLQUFDLFFBQVEsS0FBQyxPQUFPOytDQUVYLEtBQUMsT0FBTyxNQUFNLFNBQVM7UUFFN0IsS0FBQyxnQkFBZ0I7WUFFYyxLQUFDLFNBQVE7O1lBQXhDLEtBQUssR0FBRyxjQUFjLEtBQUM7O1FBRXZCLEtBQUMsU0FBUyxLQUFRLE1BQU0sT0FBTztRQUMvQixLQUFDLFNBQVMsUUFBUSxNQUFNLE9BQU87UUFFL0IsS0FBQyxRQUFRLE1BQU0sOEJBQThCO1FBQzdDLEtBQUMsUUFBUSxNQUFNLE9BQU8sT0FBTztRQUM3QixLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQUM7UUFFMUIsS0FBQyxRQUFRLE9BQU8sU0FBUyxZQUFvQixNQUFNLE9BQU87UUFDMUQsS0FBQyxRQUFRLE9BQU8sU0FBUyxvQkFBb0IsTUFBTSxPQUFPOzs7Ozs7O1FBVTFELE1BQU0sS0FBQyxRQUFRLE9BQU8sTUFBTSxPQUFLO2FBQzlCLEtBQUssS0FBQSxJQUFJLEtBQUMsUUFBUSxRQUFROztnQkFDdEIsS0FBQyxRQUFRLFFBQVEsR0FBRyxTQUFROztxQkFDeEIsS0FBQyxRQUFRLFFBQVEsR0FBRzs7b0NBQ1gsSUFBSSxLQUFDLFFBQVEsUUFBUSxHQUFHLFFBQVE7Ozs7b0NBRWhDLElBQUksT0FBTzs7OzBCQUN4QixLQUFDLFFBQVEsUUFBUSxHQUFHOztnQ0FDWCxJQUFJLEtBQUMsUUFBUSxRQUFRLEdBQUcsTUFBSSxLQUFLOzs7d0JBQzVDLE1BQUk7Ozs7O3lCQVdELEtBQUMsT0FBTyxNQUFNLElBQUUsS0FBQyxPQUFPLE9BQU8sTUFBTSxPQUFLLFlBQzFDLEtBQUMsT0FBTyxNQUFNLFlBQ2QsS0FBQyxPQUFPLE1BQU0sT0FBSyxLQUFDLE9BQU8sT0FBTyxNQUFNLE9BQUssWUFDN0MsS0FBQyxPQUFPLE1BQU0sT0FBSzs7Ozs7OztrQkFLZixLQUFDOztRQUViLGFBQVMsSUFBRSxFQUFFLEtBQUMsUUFBUTtRQUV0QixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFHLElBQUUsRUFBRztRQUNqQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxFQUFHLElBQUUsRUFBRztlQUNqQyxLQUFDLE1BQU0sT0FBVSxFQUFNLEVBQUssRUFBSyxLQUFHOzs7Ozs7O3NCQVkzQjs7WUFDTCxhQUFhLEtBQUMsTUFBTSxhQUFhOztRQUVyQyxPQUFPLEtBQUMsV0FBVztzQkFJVjs7WUFDTCxLQUFDLFFBQVE7WUFDVCxLQUFDLE1BQU07OztRQUdYLEtBQUMsTUFBTSxjQUFjO1FBRXJCLEtBQUMsUUFBUTtRQUVULFFBQVEsS0FBSyxlQUFlLEtBQUMsTUFBTSxFQUFFOzRCQUN6Qjs7OztnQkFDTCxLQUFDLFFBQVEsTUFBTSxTQUFPLEtBQU0sS0FBQyxRQUFRLG1CQUFVLFFBQU8sS0FBSyxLQUFHOztnQkFDN0QsS0FBQyxRQUFRLEtBQUksS0FBSzs7WUFDdEIsS0FBQyxRQUFRLEtBQ0wsSUFBTSxPQUNOLEtBQU0sTUFBTSxLQUFLLElBQUksS0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFLLEtBQ3pDLElBQU0sS0FBSyxHQUNYLElBQU0sS0FBSzs7UUFFbkIsS0FBQyxRQUFRLE1BQU0sY0FBYztZQUUxQjs7WUFDQyxLQUFDLFFBQVEsa0JBQU8sTUFBTSxVQUFVLEtBQUMsUUFBUTs7dUJBQWEsRUFBRSxRQUFPO3FDQUFjOzs7O1lBRTdFLEtBQUMsUUFBUTs7UUFHYixLQUFDLE1BQU07O2VBRVAsS0FBQyxNQUFNOzs7OztzQkFZRTs7WUFFTCxPQUFPLEtBQUMsTUFBTTs7UUFFbEIsUUFBQSxlQUFBLE9BQVE7WUFFTCxTQUFRLEtBQUMsTUFBTTs7WUFDZCxLQUFDLE1BQU0sSUFBSTtZQUNYLEtBQUMsTUFBTTtZQUNQLEtBQUMsTUFBTSxNQUFNLFlBQVk7O2VBRTdCOzs7Ozt1QkFVUzs7WUFFTCxLQUFLLEtBQUssWUFBWSxPQUFPLElBQUksT0FBTzs7UUFFNUMsS0FBSyxLQUFLLFFBQVE7UUFFbEIsS0FBQztnQkFDRCxPQUFPOzs7OztlQUVZLEtBQUMsTUFBTTs7Ozs7Z0JBWW5COztpQkFDSDtnQkFDSSxLQUFDLE1BQU0sTUFBTSxPQUFPO2dCQUNwQixLQUFDLE1BQU07OztpQkFFWDtnQkFDSSxLQUFDLE1BQU07dUJBQ0o7Ozs7MERBRUwsT0FBTzs7Ozs7Z0JBVU47O2lCQUVIO3VCQUFjLEtBQUMsTUFBTSxLQUFDLFFBQVE7O2lCQUM5QjsrQkFDYTs7MkJBQ0YsS0FBQyxLQUFLOzs7OzJCQUVOLEtBQUMsUUFBUTs7Ozs7d0RBRWxCLE9BQU87Ozs7OztlQUVkIn0=
//# sourceURL=kode/ked/view/menu/finder.kode
