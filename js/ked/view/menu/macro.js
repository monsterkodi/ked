var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var macro

import kxk from "../../../kxk.js"
let post = kxk.post

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


macro = (function ()
{
    _k_.extend(macro, inputchoice)
    function macro (screen, editor)
    {
        this.screen = screen
        this.editor = editor
    
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        macro.__super__.constructor.call(this,this.screen,'macro')
    }

    macro.prototype["arrange"] = function ()
    {
        var c, h, ih, iz, scx, scy, w, x, y

        w = _k_.max(20,this.width + 2 + 1)
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scy = parseInt(this.screen.rows / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        scx = parseInt(this.screen.cols / 2)
        x = parseInt(scx - w / 2)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    macro.prototype["show"] = function ()
    {
        var ccol, indices, items, s

        items = belt.linesForText(`status
diff
history
mapscr
scale
zen`)
        s = this.editor.state.s
        indices = belt.lineIndicesForRangesOrPositions(s.selections,s.cursors)
        if (indices.length > 1)
        {
            items.push('count')
            items.push('sort')
        }
        items = items.map(function (i)
        {
            return ' ' + i
        })
        ccol = parseInt(this.screen.cols / 2) - 5
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.input.hide()
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        return macro.__super__.show.call(this)
    }

    macro.prototype["hide"] = function ()
    {
        post.emit('focus','editor')
        return macro.__super__.hide.call(this)
    }

    macro.prototype["applyChoice"] = function (choice)
    {
        var input, lf, num, sf, sp, start, step

        if (_k_.empty(choice))
        {
            input = this.input.current()
            if (input === 'bof')
            {
                post.emit('goto.bof')
            }
            else if (input === 'eof')
            {
                post.emit('goto.eof')
            }
            else if (num = parseInt(input))
            {
                post.emit('goto.line',num - 1,'ind')
            }
            else if (input.startsWith('vibrant '))
            {
                sp = input.split(/\s+/)
                sf = parseFloat(sp[1])
                lf = ((sp.length > 2) ? parseFloat(sp[2]) : 1)
                post.emit('theme.vibrant',sf,lf)
            }
            else if (input.startsWith('class '))
            {
                sp = input.split(/\s+/)
                if (!_k_.empty(sp[1]))
                {
                    post.emit('file.class',sp[1])
                }
            }
            else if (input.startsWith('count'))
            {
                var _a_ = _k_.trim(input.slice(5)).split(' ').map(function (s)
                {
                    return parseInt(s)
                }); start = _a_[0]; step = _a_[1]

                this.editor.state.countSelectionsOrCursorLines(start,step)
            }
        }
        else
        {
            switch (choice)
            {
                case 'zen':
                    post.emit('config.toggle','zen.enable')
                    break
                case 'scale':
                    post.emit('config.toggle','scale.enable')
                    break
                case 'mapscr':
                    post.emit('config.toggle','mapScroll.enable')
                    break
                case 'diff':
                    post.emit('differ.file')
                    break
                case 'status':
                    post.emit('differ.status')
                    break
                case 'history':
                    post.emit('differ.history')
                    break
                case 'sort':
                    this.editor.state.sortSelectionsOrCursorLines()
                    break
                case 'count':
                    this.editor.state.countSelectionsOrCursorLines()
                    break
            }

        }
        this.hide()
        return true
    }

    return macro
})()

export default macro;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9tYWNyby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTOztPQUNBLFdBQVA7O09BQ08sWUFBWjs7T0FDWSxrQkFBQTs7O0FBQ3JCLFNBQUQ7O3NCQUFPO2FBR0gsT0FBSSxRQUFROztRQUFUO1FBQVE7Ozs7OzhDQUVELEtBQUMsT0FBTzs7O3FCQUVsQjs7OztRQUVJLFlBQVEsR0FBRyxLQUFDLFFBQU0sSUFBRTtRQUNwQixJQUFJLEtBQUMsUUFBUTtRQUViLE1BQUssS0FBQyxrQkFBa0IsSUFBSTtRQUM1QixhQUFTLEVBQUUsS0FBSztRQUVoQixJQUFJLElBQUksSUFBSTtRQUNaLGVBQVUsS0FBQyxPQUFPLE9BQUs7UUFDdkIsYUFBUyxPQUFLLElBQUUsS0FBRztRQUNuQixLQUFLO1FBRUwsZUFBVSxLQUFDLE9BQU8sT0FBSztRQUN2QixhQUFTLE1BQU0sSUFBRTtRQUVqQixLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFPLElBQUUsRUFBRztRQUNyQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxJQUFFLEdBQUssSUFBRSxFQUFHO2VBQ3JDLEtBQUMsTUFBTSxPQUFVLEVBQU0sRUFBUyxFQUFLOzs7cUJBRXpDOzs7O1FBRUksUUFBUSxLQUFLLGFBQ1Q7Ozs7OztRQVNKLElBQUksS0FBQyxPQUFPLE1BQU07UUFDbEIsVUFBVSxLQUFLLGdDQUFnQyxFQUFFLFdBQVcsRUFBRTtZQUUzRCxRQUFRLFNBQVM7O1lBQ2hCLE1BQU0sS0FBSztZQUNYLE1BQU0sS0FBSzs7UUFFZixRQUFRLE1BQU0sY0FBSzs7bUJBQU0sTUFBTTs7UUFFL0IsZ0JBQVcsS0FBQyxPQUFPLE9BQUssS0FBSztRQUU3QixLQUFDLFFBQVEsS0FBSyxhQUFhO1FBRTNCLEtBQUMsTUFBTSxJQUFJO1FBQ1gsS0FBQyxNQUFNO1FBQ1AsS0FBQyxRQUFRLElBQUk7UUFDYixLQUFDLFFBQVEsT0FBTztRQUNoQixLQUFDLFFBQVEsTUFBTSxTQUFTLEVBQUU7Ozs7cUJBSTlCOztRQUVJLEtBQUssS0FBSyxRQUFROzs7O3FCQUd0QiwwQkFBYTs7OztzQkFFQTs7WUFDTCxRQUFRLEtBQUMsTUFBTTtnQkFHWCxVQUFTOztnQkFBUyxLQUFLLEtBQUs7O3FCQUM1QixVQUFTOztnQkFBUyxLQUFLLEtBQUs7O3FCQUM1QixlQUFVOztnQkFBUSxLQUFLLEtBQUssWUFBWSxNQUFJLEVBQUU7O3FCQUU5QyxNQUFNLFdBQVc7O2dCQUViLEtBQUssTUFBTSxNQUFNO2dCQUNqQixLQUFLLFdBQVcsR0FBRztnQkFDbkIsT0FBTSxHQUFHLFNBQVMsS0FBSyxXQUFXLEdBQUcsTUFBTTtnQkFDM0MsS0FBSyxLQUFLLGdCQUFnQixHQUFHOztxQkFFakMsTUFBTSxXQUFXOztnQkFFYixLQUFLLE1BQU0sTUFBTTsrQkFDUixHQUFHOztvQkFDUixLQUFLLEtBQUssYUFBYSxHQUFHOzs7cUJBRWxDLE1BQU0sV0FBVzs7bUNBRU8sWUFBTSxJQUFRLE1BQU0sS0FBSyxjQUFLOzsyQkFBTSxTQUFTO29CQUFoRSxnQkFBTTs7Z0JBQ1AsS0FBQyxPQUFPLE1BQU0sNkJBQTZCLE1BQU07Ozs7O29CQUdsRDs7cUJBQ0g7b0JBQVksS0FBSyxLQUFLLGdCQUFnQjs7cUJBQ3RDO29CQUFZLEtBQUssS0FBSyxnQkFBZ0I7O3FCQUN0QztvQkFBWSxLQUFLLEtBQUssZ0JBQWdCOztxQkFDdEM7b0JBQVksS0FBSyxLQUFLOztxQkFDdEI7b0JBQVksS0FBSyxLQUFLOztxQkFDdEI7b0JBQVksS0FBSyxLQUFLOztxQkFDdEI7b0JBQVksS0FBQyxPQUFPLE1BQU07O3FCQUMxQjtvQkFBWSxLQUFDLE9BQU8sTUFBTTs7Ozs7UUFFbEMsS0FBQztlQUNEOzs7V0F6R1A7OztlQTJHTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/macro.kode
