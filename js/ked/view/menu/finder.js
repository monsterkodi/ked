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
        var pad, _48_43_

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
        var cursorLine, front, span, _120_87_

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
            this.choices.select(((_120_87_=kutil.findIndex(this.choices.items,function (l)
            {
                return l.row === cursorLine
            })) != null ? _120_87_ : 0))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQVM7SUFBSztJQUFLOztPQUNWLFlBQVo7O09BQ1ksV0FBUDs7T0FDTyxrQkFBQTs7O0FBRWIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUksUUFBUSxRQUFPLE9BQUs7O1FBQXJCO1FBQVE7Ozs7O1FBRVAsS0FBQyxRQUFRLEtBQUMsT0FBTzsrQ0FFWCxLQUFDLE9BQU8sTUFBTSxTQUFTO1FBRTdCLEtBQUMsZ0JBQWdCO1lBQ2MsS0FBQyxTQUFROztZQUF4QyxLQUFLLEdBQUcsY0FBYyxLQUFDOztRQUV2QixLQUFDLFNBQVMsS0FBUSxNQUFNLE9BQU87UUFDL0IsS0FBQyxTQUFTLFFBQVEsTUFBTSxPQUFPO1FBRS9CLEtBQUMsUUFBUSxNQUFNLDhCQUE4QjtRQUM3QyxLQUFDLFFBQVEsTUFBTSxPQUFPLE9BQU87UUFDN0IsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFDO1FBRTFCLEtBQUMsUUFBUSxPQUFPLFNBQVMsWUFBb0IsTUFBTSxPQUFPO1FBQzFELEtBQUMsUUFBUSxPQUFPLFNBQVMsb0JBQW9CLE1BQU0sT0FBTzs7O3NCQVE5RCxxQkFBUTs7OztRQUVKLE1BQU0sS0FBQyxRQUFRLE9BQU8sTUFBTSxPQUFLO2FBQzlCLEtBQUssS0FBQSxJQUFJLEtBQUMsUUFBUSxRQUFROztnQkFDdEIsS0FBQyxRQUFRLFFBQVEsR0FBRyxTQUFROztxQkFDeEIsS0FBQyxRQUFRLFFBQVEsR0FBRzs7b0NBQ1gsSUFBSSxLQUFDLFFBQVEsUUFBUSxHQUFHLFFBQVE7Ozs7b0NBRWhDLElBQUksT0FBTzs7O2dCQUNHLFVBQTNCLEtBQUMsUUFBUSxRQUFRLEdBQUc7O2dDQUNYLElBQUksS0FBQyxRQUFRLFFBQVEsR0FBRyxNQUFJLEtBQUs7Ozt3QkFDNUMsTUFBSTs7O3NCQVFiOzt5QkFHWSxLQUFDLE9BQU8sTUFBTSxJQUFFLEtBQUMsT0FBTyxPQUFPLE1BQU0sT0FBSyxZQUMxQyxLQUFDLE9BQU8sTUFBTSxZQUNkLEtBQUMsT0FBTyxNQUFNLE9BQUssS0FBQyxPQUFPLE9BQU8sTUFBTSxPQUFLLFlBQzdDLEtBQUMsT0FBTyxNQUFNLE9BQUs7OztzQkFHL0I7Ozs7a0JBRWdCLEtBQUMsZUFBWixZQUFFLFlBQUUsWUFBRTs7UUFFUCxhQUFTLElBQUUsRUFBRSxLQUFDLFFBQVE7UUFFdEIsS0FBQyxNQUFNLE9BQVUsSUFBRSxFQUFJLElBQUUsRUFBRyxJQUFFLEVBQUc7UUFDakMsS0FBQyxRQUFRLE9BQVEsSUFBRSxFQUFJLElBQUUsRUFBRyxJQUFFLEVBQUc7ZUFDakMsS0FBQyxNQUFNLE9BQVUsRUFBTSxFQUFLLEVBQUssS0FBRzs7O3NCQVF4QyxtQkFBTTs7OztzQkFJTzs7WUFDTCxhQUFhLEtBQUMsTUFBTSxhQUFhOztRQUVyQyxPQUFPLEtBQUMsV0FBVztzQkFJVjs7WUFDTCxLQUFDLFFBQVE7WUFDVCxLQUFDLE1BQU07OztRQUdYLEtBQUMsTUFBTSxjQUFjO1FBRXJCLEtBQUMsUUFBUTtRQUVULFFBQVEsS0FBSyxlQUFlLEtBQUMsTUFBTSxFQUFFOzRCQUN6Qjs7O1lBQVI7Z0JBQ0csS0FBQyxRQUFRLE1BQU0sU0FBTyxLQUFNLEtBQUMsUUFBUSxtQkFBVSxRQUFPLEtBQUssS0FBRzs7Z0JBQzdELEtBQUMsUUFBUSxLQUFJLEtBQUs7O1lBQ3RCLEtBQUMsUUFBUSxLQUNMLElBQU0sT0FDTixLQUFNLE1BQU0sS0FBSyxJQUFJLEtBQUMsTUFBTSxFQUFFLE1BQU0sS0FBSyxLQUN6QyxJQUFNLEtBQUssR0FDWCxJQUFNLEtBQUs7O1FBRW5CLEtBQUMsUUFBUSxNQUFNLGNBQWM7WUFFMUI7O1lBQ0MsS0FBQyxRQUFRLGtCQUFPLE1BQU0sVUFBVSxLQUFDLFFBQVEsZ0JBQU87O3VCQUFNLEVBQUUsUUFBTztxQ0FBYzs7OztZQUU3RSxLQUFDLFFBQVE7O1FBR2IsS0FBQyxNQUFNOztlQUVQLEtBQUMsTUFBTTs7O3NCQVFYLHlCQUFZOztzQkFJQzs7WUFFTCxPQUFPLEtBQUMsTUFBTTs7UUFFbEIsUUFBQSxlQUFBLE9BQVE7WUFFTCxTQUFRLEtBQUMsTUFBTTs7WUFDZCxLQUFDLE1BQU0sSUFBSTtZQUNYLEtBQUMsTUFBTTtZQUNQLEtBQUMsTUFBTSxNQUFNLFlBQVk7O2VBRTdCOzs7c0JBUUosb0JBQU87O3VCQUVNOztZQUVMLEtBQUssS0FBSyxZQUFZLE9BQU8sSUFBSSxPQUFPOztRQUU1QyxLQUFLLEtBQUssUUFBUTtRQUVsQixLQUFDO2dCQUNELE9BQU87OztzQkFFWCwwQkFBYTs7ZUFBVSxLQUFDLE1BQU07OztzQkFROUIsOEJBQWlCLFFBQU87O2dCQUliOztpQkFDSDtnQkFDSSxLQUFDLE1BQU0sTUFBTSxPQUFPO2dCQUNwQixLQUFDLE1BQU07OztpQkFFWDtnQkFDSSxLQUFDLE1BQU07dUJBQ0o7Ozs7MERBRUwsT0FBTzs7O3NCQVFqQiw0QkFBZSxRQUFPOztnQkFFWDs7aUJBRUg7dUJBQWMsS0FBQyxNQUFNLEtBQUMsUUFBUTs7aUJBQzlCOytCQUNhOzsyQkFDRixLQUFDLEtBQUs7Ozs7MkJBRU4sS0FBQyxRQUFROzs7Ozt3REFFbEIsT0FBTzs7O1dBak1aOzs7ZUFtTUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/finder.kode
