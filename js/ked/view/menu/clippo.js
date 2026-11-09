var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var clippo

import kxk from "../../../kxk.js"
let post = kxk.post
let clip = kxk.clip

import child_process from "child_process"
let spawn = child_process.spawn

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


clippo = (function ()
{
    _k_.extend(clippo, inputchoice)
    function clippo (screen, editor, name = 'clippo', opt)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        var _15_38_, _17_23_

        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["applyCurrent"] = this["applyCurrent"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["collectMatchEntries"] = this["collectMatchEntries"].bind(this)
        this["scrollToRow"] = this["scrollToRow"].bind(this)
        this["selectMatch"] = this["selectMatch"].bind(this)
        this["selectEntryDelta"] = this["selectEntryDelta"].bind(this)
        this["selectEntry"] = this["selectEntry"].bind(this)
        this["selectRow"] = this["selectRow"].bind(this)
        this["entryAtCurrent"] = this["entryAtCurrent"].bind(this)
        this["moveFocus"] = this["moveFocus"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["arrangeRect"] = this["arrangeRect"].bind(this)
        this["rebuild"] = this["rebuild"].bind(this)
        this["show"] = this["show"].bind(this)
        this["refreshHistory"] = this["refreshHistory"].bind(this)
        this["remember"] = this["remember"].bind(this)
        this["onWatchData"] = this["onWatchData"].bind(this)
        this["pollClipboard"] = this["pollClipboard"].bind(this)
        this["stopWatch"] = this["stopWatch"].bind(this)
        this["startWatch"] = this["startWatch"].bind(this)
        this.editor = editor
        this.history = []
        this.maxHistory = ((_15_38_=(opt != null ? opt.maxHistory : undefined)) != null ? _15_38_ : 50)
        this.readClipboard = (opt != null ? opt.readClipboard : undefined)
        this.readClipboard = ((_17_23_=this.readClipboard) != null ? _17_23_ : function ()
        {
            return clip.paste()
        })
        this.autoHideInput = false
        this.matchEntries = []
        this.lineEntry = []
        this.entryStart = []
        this.dividerRows = []
        this.watchProcess = null
        this.watchTimer = null
        this.watchBuffer = ''
        clippo.__super__.constructor.call(this,this.screen,this.name,['scroll'])
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.setColor('divider',theme.finder.frame)
        this.setColor('selected',theme.selection.span)
        this.setColor('marker',theme.cursor.main)
        this.choices.drawSelections = function ()
        {}
        this.choices.state.skipAdjustViewForMainCursor = true
        this.input.set('')
        if ((opt != null ? opt.watch : undefined) !== false)
        {
            this.startWatch()
        }
    }

    clippo.prototype["startWatch"] = function ()
    {
        var tool, _50_26_, _50_42_

        tool = clip.detect()
        if (tool === 'none')
        {
            return
        }
        if ((this.watchProcess != null) || (this.watchTimer != null))
        {
            return
        }
        if (tool === 'wl')
        {
            this.watchProcess = spawn('wl-paste',['--watch','sh','-c','base64 -w0; echo'])
            this.watchProcess.on('error',function (err)
            {
                console.error(`clippo watch -- ${err}`)
            })
            return this.watchProcess.stdout.on('data',this.onWatchData)
        }
        else
        {
            this.pollClipboard()
            return this.watchTimer = setInterval(((function ()
            {
                return this.pollClipboard()
            }).bind(this)),1000)
        }
    }

    clippo.prototype["stopWatch"] = function ()
    {
        var _65_24_, _69_22_

        if ((this.watchProcess != null))
        {
            this.watchProcess.kill()
            this.watchProcess = null
        }
        if ((this.watchTimer != null))
        {
            clearInterval(this.watchTimer)
            return this.watchTimer = null
        }
    }

    clippo.prototype["pollClipboard"] = function ()
    {
        return this.remember(this.readClipboard())
    }

    clippo.prototype["onWatchData"] = function (data)
    {
        var idx, line, text

        this.watchBuffer += data.toString('utf8')
        while (true)
        {
            idx = this.watchBuffer.indexOf('\n')
            if (idx < 0)
            {
                break
            }
            line = this.watchBuffer.slice(0, typeof idx === 'number' ? idx : -1)
            this.watchBuffer = this.watchBuffer.slice(idx + 1)
            if (_k_.empty(line))
            {
                continue
            }
            try
            {
                text = Buffer.from(line,'base64').toString('utf8')
                this.remember(text)
            }
            catch (err)
            {
                console.error(`clippo watch -- ${err}`)
            }
        }
    }

    clippo.prototype["remember"] = function (text)
    {
        var idx

        if (_k_.empty(text))
        {
            return
        }
        idx = this.history.indexOf(text)
        if (idx >= 0)
        {
            this.history.splice(idx,1)
        }
        this.history.unshift(text)
        if (this.history.length > this.maxHistory)
        {
            return this.history = this.history.slice(0, typeof this.maxHistory === 'number' ? this.maxHistory : -1)
        }
    }

    clippo.prototype["refreshHistory"] = function ()
    {
        return this.remember(this.readClipboard())
    }

    clippo.prototype["show"] = function ()
    {
        this.refreshHistory()
        this.rebuild()
        this.input.set('')
        this.input.show()
        this.matchEntries = []
        clippo.__super__.show.call(this)
        if (this.history.length)
        {
            this.selectEntry(0)
            this.choices.state.setView([0,0])
            this.choices.grabFocus()
        }
        else
        {
            this.input.grabFocus()
        }
        return post.emit('redraw')
    }

    clippo.prototype["rebuild"] = function ()
    {
        var idx, items, line, lines, text

        items = []
        this.lineEntry = []
        this.entryStart = []
        this.dividerRows = []
        this.choices.clearEmpty()
        var list = _k_.list(this.history)
        for (idx = 0; idx < list.length; idx++)
        {
            text = list[idx]
            this.entryStart.push(items.length)
            items.push({line:'',ext:'kode',entry:idx,type:'divider'})
            this.lineEntry.push(idx)
            this.dividerRows.push(items.length - 1)
            lines = text.split('\n')
            if (_k_.empty(lines))
            {
                lines = ['']
            }
            var list1 = _k_.list(lines)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                line = list1[_b_]
                items.push({line:line,ext:'kode',entry:idx,type:'text'})
                this.lineEntry.push(idx)
            }
        }
        if (items.length)
        {
            this.choices.append(items,'kode')
        }
        return this.choices.state.setHighlights([])
    }

    clippo.prototype["arrangeRect"] = function ()
    {
        var g, w, x, _173_26_, _173_39_

        g = ((_173_39_=(this.editor.gutter != null ? this.editor.gutter.cells.cols : undefined)) != null ? _173_39_ : 0)
        x = _k_.max(0,parseInt(this.editor.cells.x - g))
        w = _k_.min(parseInt(this.editor.cells.cols + g),this.screen.cols - x)
        return [x,parseInt(this.editor.cells.y),w,parseInt(this.editor.cells.rows - 3)]
    }

    clippo.prototype["arrange"] = function ()
    {
        var cs, h, w, x, y

        var _a_ = this.arrangeRect(); x = _a_[0]; y = _a_[1]; w = _a_[2]; h = _a_[3]

        cs = _k_.min(h - 1,this.choices.numFiltered())
        cs = _k_.max(0,cs)
        this.input.layout(x + 2,y + 1,w - 4,1)
        this.choices.layout(x + 1,y + 3,w - 2,cs)
        return this.cells.layout(x,y,w,cs + 4)
    }

    clippo.prototype["draw"] = function ()
    {
        var cols, current, lineColor, markerColor, row, rows, selected, view, y

        if (this.hidden())
        {
            return
        }
        clippo.__super__.draw.call(this)
        current = this.entryAtCurrent()
        view = this.choices.state.s.view
        rows = this.choices.cells.rows
        cols = this.choices.cells.cols
        var list = _k_.list(this.dividerRows)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            y = row - view[1]
            if (y < 0 || y >= rows)
            {
                continue
            }
            selected = this.lineEntry[row] === current
            lineColor = (selected ? this.color.selected : this.color.divider)
            markerColor = (selected ? this.color.marker : this.color.divider)
            this.choices.cells.set(0,y,'●',markerColor,this.choices.color.bg)
            this.choices.cells.fill_row(y,2,cols - 1,'─',lineColor,this.choices.color.bg)
        }
    }

    clippo.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            this.input.grabFocus()
            return this.input.selectAll()
        }
        else
        {
            this.choices.grabFocus()
            return this.autoHide()
        }
    }

    clippo.prototype["entryAtCurrent"] = function ()
    {
        var _232_51_

        return ((_232_51_=this.lineEntry[this.choices.state.mainCursor()[1]]) != null ? _232_51_ : -1)
    }

    clippo.prototype["selectRow"] = function (row)
    {
        this.choices.state.setSelections([])
        return this.choices.state.setMainCursor(0,row)
    }

    clippo.prototype["selectEntry"] = function (index)
    {
        var row

        if (_k_.empty(this.history))
        {
            return
        }
        index = _k_.clamp(0,this.history.length - 1,index)
        row = this.entryStart[index]
        if (!(_k_.isNum(row)))
        {
            return
        }
        this.selectRow(row)
        this.scrollToRow(row)
        return post.emit('redraw')
    }

    clippo.prototype["selectEntryDelta"] = function (delta)
    {
        var current

        current = this.entryAtCurrent()
        if (current < 0)
        {
            current = (delta > 0 ? -1 : this.history.length)
        }
        return this.selectEntry(current + delta)
    }

    clippo.prototype["selectMatch"] = function (delta)
    {
        var current, idx, next

        if (_k_.empty(this.matchEntries))
        {
            return this.selectEntryDelta(delta)
        }
        current = this.entryAtCurrent()
        idx = this.matchEntries.indexOf(current)
        if (idx < 0)
        {
            idx = (delta > 0 ? -1 : this.matchEntries.length)
        }
        next = _k_.clamp(0,this.matchEntries.length - 1,idx + delta)
        return this.selectEntry(this.matchEntries[next])
    }

    clippo.prototype["scrollToRow"] = function (row)
    {
        var rows, view

        rows = this.choices.cells.rows
        if (rows <= 0)
        {
            return
        }
        view = this.choices.state.s.view
        if (row < view[1])
        {
            return this.choices.state.setView([view[0],row])
        }
        else if (row >= view[1] + rows)
        {
            return this.choices.state.setView([view[0],row - rows + 1])
        }
    }

    clippo.prototype["collectMatchEntries"] = function ()
    {
        var entry, span, _295_40_

        this.matchEntries = []
        var list = _k_.list(this.choices.state.s.highlights)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            entry = ((_295_40_=this.lineEntry[span[1]]) != null ? _295_40_ : -1)
            if (entry < 0)
            {
                continue
            }
            if (this.matchEntries.length && this.matchEntries.slice(-1)[0] === entry)
            {
                continue
            }
            this.matchEntries.push(entry)
        }
    }

    clippo.prototype["onInputChange"] = function (text)
    {
        if (_k_.empty(text))
        {
            this.choices.state.setHighlights([])
            this.matchEntries = []
            this.selectEntry(0)
        }
        else
        {
            this.choices.state.highlightText(text)
            this.collectMatchEntries()
            if (!_k_.empty(this.matchEntries))
            {
                this.selectEntry(this.matchEntries[0])
            }
        }
        return post.emit('redraw')
    }

    clippo.prototype["applyCurrent"] = function (close = true)
    {
        var idx, text

        idx = this.entryAtCurrent()
        if (idx < 0 || idx >= this.history.length)
        {
            return false
        }
        text = this.history[idx]
        this.editor.state.insert(text)
        if (close)
        {
            post.emit('focus','editor')
            this.hide()
        }
        else
        {
            post.emit('redraw')
        }
        return true
    }

    clippo.prototype["applyChoice"] = function (choice)
    {
        return this.applyCurrent(true)
    }

    clippo.prototype["onKey"] = function (key, event)
    {
        var combo, delta, result

        if (this.hidden())
        {
            return
        }
        combo = event.combo
        switch (combo)
        {
            case 'esc':
            case 'escape':
                this.onEscape()
                return true

            case 'tab':
            case 'shift+tab':
                this.moveFocus()
                return true

        }

        if (_k_.in(combo,['return','enter']))
        {
            return this.applyCurrent(true)
        }
        if (_k_.in(combo,['up','down']))
        {
            delta = (combo === 'down' ? 1 : -1)
            if (!_k_.empty(this.input.current()) && !_k_.empty(this.matchEntries))
            {
                this.selectMatch(delta)
            }
            else
            {
                this.selectEntryDelta(delta)
            }
            return true
        }
        if (combo === 'alt+.')
        {
            this.selectEntryDelta(1)
            return true
        }
        if (combo === 'alt+,')
        {
            this.selectEntryDelta(-1)
            return true
        }
        if (this.input.hasFocus())
        {
            if (result = this.input.onKey(key,event))
            {
                return result
            }
            return true
        }
        if (_k_.in(combo,['space',' ']))
        {
            return this.applyCurrent(false)
        }
        if (!_k_.empty(event.char) && !(_k_.in(event.char,' \n\t')))
        {
            this.input.grabFocus()
            if (result = this.input.onKey(key,event))
            {
                return result
            }
        }
        this.choices.onKey(key,event)
        return true
    }

    clippo.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.applyCurrent()

            case 'change':
                return this.onInputChange(text)

        }

        return true
    }

    clippo.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'space':
                return this.applyCurrent(false)

            case 'return':
            case 'click':
                return this.applyCurrent(true)

        }

        return clippo.__super__.onChoicesAction.call(this,action,choice)
    }

    return clippo
})()

export default clippo;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcHBvLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvY2xpcHBvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FBYSxVQUFBO0lBQVM7SUFBSzs7T0FDdkIsb0JBQUE7SUFBa0I7O09BQ0EsWUFBWjs7T0FDWSxrQkFBQTs7O0FBQ3JCLFVBQUQ7O3VCQUFRO2FBTUosUUFBSSxRQUFRLFFBQVEsaUJBQWM7O1FBQS9CO1FBQVE7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFZixLQUFDLFNBQVM7UUFDVixLQUFDO1FBQ0QsS0FBQyx3QkFBYSxjQUFBLElBQUssNkNBQWE7UUFDaEMsS0FBQyxpQkFBZ0IsY0FBQSxJQUFLO1FBQ3RCLEtBQUMsMEJBQUQsS0FBQzs7bUJBQW9CLEtBQUs7O1FBRTFCLEtBQUMsZ0JBQWdCO1FBRWpCLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLGVBQWU7UUFDaEIsS0FBQyxhQUFlO1FBQ2hCLEtBQUMsY0FBZTsrQ0FFVixLQUFDLE9BQU8sS0FBQyxNQUFNO1FBRXJCLEtBQUMsU0FBUyxLQUFXLE1BQU0sT0FBTztRQUNsQyxLQUFDLFNBQVMsUUFBVyxNQUFNLE9BQU87UUFDbEMsS0FBQyxTQUFTLFVBQVcsTUFBTSxPQUFPO1FBQ2xDLEtBQUMsU0FBUyxXQUFXLE1BQU0sVUFBVTtRQUNyQyxLQUFDLFNBQVMsU0FBVyxNQUFNLE9BQU87UUFFbEMsS0FBQyxRQUFROztRQUNULEtBQUMsUUFBUSxNQUFNLDhCQUE4QjtRQUU3QyxLQUFDLE1BQU0sSUFBSTthQUVNLGNBQUEsSUFBSyx1QkFBUzs7WUFBL0IsS0FBQzs7OztzQkFFTDs7OztRQUVJLE9BQU8sS0FBSztZQUVQLFNBQVE7Ozs7YUFDUixLQUFDLDBCQUFpQixLQUFDOzs7O1lBRXJCLFNBQVE7O1lBRVAsS0FBQyxlQUFlLE1BQU0sWUFBWSxVQUFVLEtBQUssS0FBSztZQUN0RCxLQUFDLGFBQWEsR0FBRyxrQkFBUzs7Z0JBQVEsaUNBQXlCOzttQkFDM0QsS0FBQyxhQUFhLE9BQU8sR0FBRyxPQUFPLEtBQUM7Ozs7WUFJaEMsS0FBQzttQkFDRCxLQUFDLGFBQWE7O3VCQUFnQixLQUFDOzJCQUFpQjs7OztzQkFFeEQ7Ozs7YUFFTyxLQUFDOztZQUNBLEtBQUMsYUFBYTtZQUNkLEtBQUMsZUFBZTs7YUFFakIsS0FBQzs7WUFDQSxjQUFjLEtBQUM7bUJBQ2YsS0FBQyxhQUFhOzs7O3NCQUV0Qjs7ZUFFSSxLQUFDLFNBQVMsS0FBQzs7O3NCQUVmLDBCQUFhOzs7O1FBRVQsS0FBQyxlQUFlLEtBQUssU0FBUztlQUV4Qjs7WUFFRixNQUFNLEtBQUMsWUFBWSxRQUFRO2dCQUVsQixNQUFNOztnQkFBZjs7WUFFQSxPQUFPLEtBQUMsa0JBQVksVUFBSSxtQkFBQTtZQUN4QixLQUFDLGNBQWMsS0FBQyxrQkFBWSxNQUFJOzBCQUVkOztnQkFBbEI7Ozs7Z0JBR0ksT0FBTyxPQUFPLEtBQUssS0FBTSxVQUFVLFNBQVM7Z0JBQzVDLEtBQUMsU0FBUzs7bUJBQ1I7O2dCQUNGLGlDQUF5Qjs7Ozs7c0JBRXJDLHVCQUFVOzs7O3NCQUVLOzs7O1FBRVgsTUFBTSxLQUFDLFFBQVEsUUFBUTtZQUNFLE9BQU87O1lBQWhDLEtBQUMsUUFBUSxPQUFPLElBQUk7O1FBRXBCLEtBQUMsUUFBUSxRQUFRO1lBQ3VCLEtBQUMsUUFBUSxTQUFTLEtBQUM7O21CQUEzRCxLQUFDLFVBQVUsS0FBQyxjQUFRLFVBQUksS0FBQywwQkFBRCxLQUFDOzs7O3NCQUU3Qjs7ZUFFSSxLQUFDLFNBQVMsS0FBQzs7O3NCQUVmOztRQUVJLEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU07UUFFUCxLQUFDOztZQUlFLEtBQUMsUUFBUTs7WUFDUixLQUFDLFlBQVk7WUFDYixLQUFDLFFBQVEsTUFBTSxTQUFTLEVBQUU7WUFDMUIsS0FBQyxRQUFROzs7O1lBRVQsS0FBQyxNQUFNOztlQUVYLEtBQUssS0FBSzs7O3NCQUVkOzs7O1FBRUk7UUFFQSxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLFFBQVE7NEJBRVEsS0FBQzthQUFSOztZQUFOO1lBRUEsS0FBQyxXQUFXLEtBQUssTUFBTTtZQUV2QixNQUFNLE1BQ0YsS0FBTyxHQUNQLElBQU8sT0FDUCxNQUFPLElBQ1AsS0FBTztZQUNYLEtBQUMsVUFBVSxLQUFLO1lBQ2hCLEtBQUMsWUFBWSxLQUFLLE1BQU0sU0FBTztZQUUvQixRQUFRLEtBQUssTUFBTTswQkFDRzs7Z0JBQXRCLFNBQVM7O2lDQUVHOzs7Z0JBQVI7Z0JBQ0EsTUFBTSxNQUNGLEtBQU8sS0FDUCxJQUFPLE9BQ1AsTUFBTyxJQUNQLEtBQU87Z0JBQ1gsS0FBQyxVQUFVLEtBQUs7OztZQUVyQixNQUFNOztZQUNMLEtBQUMsUUFBUSxPQUFPLE1BQU07O2VBRTFCLEtBQUMsUUFBUSxNQUFNOzs7c0JBRW5COzs7O1FBRUksZ0JBQUksS0FBQyxPQUFPLGlCQUFSLEtBQUMsT0FBTyxPQUFRLE1BQU0sd0NBQU87UUFFakMsWUFBUSxXQUFNLEtBQUMsT0FBTyxNQUFNLElBQUU7UUFDOUIscUJBQVksS0FBQyxPQUFPLE1BQU0sT0FBSyxHQUFHLEtBQUMsT0FBTyxPQUFLO2dCQUczQyxXQUNJLEtBQUMsT0FBTyxNQUFNLEdBQ2xCLFdBQ0ksS0FBQyxPQUFPLE1BQU0sT0FBSzs7O3NCQUcvQjs7OztrQkFFZ0IsS0FBQyxlQUFaLFlBQUUsWUFBRSxZQUFFOztRQUVQLGFBQVMsSUFBRSxFQUFFLEtBQUMsUUFBUTtRQUN0QixhQUFTLEVBQUU7UUFFWCxLQUFDLE1BQU0sT0FBVSxJQUFFLEVBQUksSUFBRSxFQUFHLElBQUUsRUFBRztRQUNqQyxLQUFDLFFBQVEsT0FBUSxJQUFFLEVBQUksSUFBRSxFQUFHLElBQUUsRUFBRztlQUNqQyxLQUFDLE1BQU0sT0FBVSxFQUFNLEVBQUssRUFBSyxLQUFHOzs7c0JBRXhDOzs7O1lBRVMsS0FBQzs7Ozs7UUFJTixVQUFVLEtBQUM7UUFDWCxPQUFVLEtBQUMsUUFBUSxNQUFNLEVBQUU7UUFDM0IsT0FBVSxLQUFDLFFBQVEsTUFBTTtRQUN6QixPQUFVLEtBQUMsUUFBUSxNQUFNOzRCQUVkLEtBQUM7OztZQUFSO1lBRUEsSUFBSSxNQUFNLEtBQUs7Z0JBRUgsSUFBSSxLQUFLLEtBQUs7O2dCQUExQjs7WUFFQSxXQUFXLEtBQUMsVUFBVSxTQUFRO1lBRTlCLGFBQWMsV0FBVyxLQUFDLE1BQU0sV0FBVyxLQUFDLE1BQU07WUFDbEQsZUFBYyxXQUFXLEtBQUMsTUFBTSxTQUFXLEtBQUMsTUFBTTtZQUVsRCxLQUFDLFFBQVEsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLFlBQVksS0FBQyxRQUFRLE1BQU07WUFDdEQsS0FBQyxRQUFRLE1BQU0sU0FBUyxFQUFFLEVBQUUsT0FBSyxFQUFFLElBQUksVUFBVSxLQUFDLFFBQVEsTUFBTTs7OztzQkFFeEU7O1lBRU8sS0FBQyxRQUFROztZQUNSLEtBQUMsTUFBTTttQkFDUCxLQUFDLE1BQU07Ozs7WUFFUCxLQUFDLFFBQVE7bUJBQ1QsS0FBQzs7OztzQkFFVDs7OzswQkFFSSxLQUFDLFVBQVUsS0FBQyxRQUFRLE1BQU0sYUFBYSwwQkFBTTs7O3NCQUVqRCx3QkFBVzs7UUFFUCxLQUFDLFFBQVEsTUFBTTtlQUNmLEtBQUMsUUFBUSxNQUFNLGNBQWMsRUFBRTs7O3NCQUVuQywwQkFBYTs7OztzQkFFRSxLQUFDOzs7O1FBRVosa0JBQWMsRUFBRSxLQUFDLFFBQVEsU0FBTyxFQUFFO1FBQ2xDLE1BQVEsS0FBQyxXQUFXO2NBRUosVUFBUDs7OztRQUVULEtBQUMsVUFBVTtRQUNYLEtBQUMsWUFBWTtlQUViLEtBQUssS0FBSzs7O3NCQUVkLCtCQUFrQjs7OztRQUVkLFVBQVUsS0FBQztZQUVSLFVBQVU7O1lBQ1QsV0FBVSxRQUFRLElBQUksS0FBSyxLQUFDLFFBQVE7O2VBRXhDLEtBQUMsWUFBWSxVQUFROzs7c0JBRXpCLDBCQUFhOzs7O3NCQUUyQixLQUFDOzttQkFBbkMsS0FBQyxpQkFBaUI7O1FBRXBCLFVBQVUsS0FBQztRQUNYLE1BQVUsS0FBQyxhQUFhLFFBQVE7WUFFN0IsTUFBTTs7WUFDTCxPQUFNLFFBQVEsSUFBSSxLQUFLLEtBQUMsYUFBYTs7UUFFekMsaUJBQWEsRUFBRSxLQUFDLGFBQWEsU0FBTyxFQUFFLE1BQUk7ZUFFMUMsS0FBQyxZQUFZLEtBQUMsYUFBYTs7O3NCQUUvQiwwQkFBYTs7OztRQUVULE9BQU8sS0FBQyxRQUFRLE1BQU07WUFFakIsUUFBUTs7OztRQUViLE9BQU8sS0FBQyxRQUFRLE1BQU0sRUFBRTtZQUVyQixNQUFNLEtBQUs7O21CQUNWLEtBQUMsUUFBUSxNQUFNLFNBQVMsS0FBSyxHQUFHOztpQkFDNUIsT0FBTyxLQUFLLEtBQUc7O21CQUNuQixLQUFDLFFBQVEsTUFBTSxTQUFTLEtBQUssR0FBRyxNQUFJLE9BQUs7Ozs7c0JBRWpEOzs7O1FBRUksS0FBQzs0QkFFVyxLQUFDLFFBQVEsTUFBTSxFQUFFOzs7WUFBekI7WUFFQSxtQkFBUSxLQUFDLFVBQVUsS0FBSywwQkFBTTtnQkFFbEIsUUFBUTs7Z0JBQXBCOztnQkFDWSxLQUFDLGFBQWEsVUFBVyxLQUFDLDhCQUFvQjs7Z0JBQTFEOztZQUVBLEtBQUMsYUFBYSxLQUFLOzs7O3NCQUUzQiw0QkFBZTs7c0JBRUY7O1lBRUwsS0FBQyxRQUFRLE1BQU07WUFDZixLQUFDO1lBQ0QsS0FBQyxZQUFZOzs7O1lBSWIsS0FBQyxRQUFRLE1BQU0sY0FBYztZQUM3QixLQUFDOzJCQUMwQyxLQUFDOztnQkFBNUMsS0FBQyxZQUFZLEtBQUMsYUFBYTs7O2VBRS9CLEtBQUssS0FBSzs7O3NCQUVkLDJCQUFjLFFBQU07Ozs7UUFFaEIsTUFBTSxLQUFDO1lBRUksTUFBTSxLQUFLLE9BQU8sS0FBQyxRQUFROzttQkFBcEM7O1FBRUYsT0FBTyxLQUFDLFFBQVE7UUFFaEIsS0FBQyxPQUFPLE1BQU0sT0FBTztZQUVsQjs7WUFDQyxLQUFLLEtBQUssUUFBUTtZQUNsQixLQUFDOzs7O1lBRUQsS0FBSyxLQUFLOztlQUVkOzs7c0JBRUosMEJBQWE7O2VBQVUsS0FBQyxhQUFhOzs7c0JBRXJDLG9CQUFPLEtBQUk7Ozs7WUFFRixLQUFDOzs7O1FBRU4sUUFBUSxNQUFNO2dCQUVQOztpQkFDSDtpQkFBTTtnQkFBVyxLQUFDO3VCQUFlOztpQkFDakM7aUJBQU07Z0JBQWMsS0FBQzt1QkFBZ0I7Ozs7bUJBRXRDLE9BQVUsU0FBUzs7bUJBQ2hCLEtBQUMsYUFBYTs7bUJBRWpCLE9BQVUsS0FBSzs7WUFFZCxTQUFRLFVBQVMsU0FBUyxJQUFJOzJCQUVqQixLQUFDLE1BQU0seUJBQXdCLEtBQUM7O2dCQUN6QyxLQUFDLFlBQVk7Ozs7Z0JBRWIsS0FBQyxpQkFBaUI7O21CQUVwQjs7WUFFSCxVQUFTOztZQUNSLEtBQUMsaUJBQWlCO21CQUNoQjs7WUFFSCxVQUFTOztZQUNSLEtBQUMsaUJBQWlCO21CQUNoQjs7WUFFSCxLQUFDLE1BQU07O2dCQUVILFNBQVMsS0FBQyxNQUFNLE1BQU0sSUFBSTs7dUJBQ3ZCOzttQkFFSjs7bUJBRUgsT0FBVSxRQUFROzttQkFDZixLQUFDLGFBQWE7O3VCQUVYLE1BQU0sa0JBQVMsTUFBTSxLQUFZOztZQUV0QyxLQUFDLE1BQU07Z0JBRUosU0FBUyxLQUFDLE1BQU0sTUFBTSxJQUFJOzt1QkFDdkI7OztRQUVWLEtBQUMsUUFBUSxNQUFNLElBQUk7ZUFFbkI7OztzQkFFSiw0QkFBZSxRQUFPOztnQkFFWDs7aUJBQ0g7dUJBQWEsS0FBQzs7aUJBQ2Q7dUJBQWEsS0FBQyxjQUFjOzs7O2VBRWhDOzs7c0JBRUosOEJBQWlCLFFBQU87O2dCQUViOztpQkFDSDt1QkFBWSxLQUFDLGFBQWE7O2lCQUMxQjtpQkFBUzt1QkFBWSxLQUFDLGFBQWE7Ozs7MERBRWpDLE9BQU87OztXQWhacEI7OztlQWtaTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/clippo.kode
