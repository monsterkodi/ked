var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var clippo

import kxk from "../../../kxk.js"
let post = kxk.post
let clip = kxk.clip

import child_process from "child_process"
let spawn = child_process.spawn

import theme from "../../theme/theme.js"

import fileutil from "../../util/fileutil.js"

import inputchoice from "./inputchoice.js"


clippo = (function ()
{
    _k_.extend(clippo, inputchoice)
    function clippo (screen, editor, name = 'clippo', opt)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        var _16_38_, _18_23_

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
        this.maxHistory = ((_16_38_=(opt != null ? opt.maxHistory : undefined)) != null ? _16_38_ : 50)
        this.readClipboard = (opt != null ? opt.readClipboard : undefined)
        this.readClipboard = ((_18_23_=this.readClipboard) != null ? _18_23_ : function ()
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
        var tool, _51_26_, _51_42_

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
        var _66_24_, _70_22_

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
        if (idx === 0)
        {
            return
        }
        if (idx > 0)
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
        var ext, idx, items, line, lines, text

        this.lineEntry = []
        this.entryStart = []
        this.dividerRows = []
        this.choices.clearEmpty()
        var list = _k_.list(this.history)
        for (idx = 0; idx < list.length; idx++)
        {
            text = list[idx]
            ext = fileutil.detectExt(text)
            items = []
            items.push({line:''})
            lines = text.split('\n')
            if (_k_.empty(lines))
            {
                lines = ['']
            }
            var list1 = _k_.list(lines)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                line = list1[_b_]
                items.push({line:line})
            }
            this.entryStart.push(this.choices.items.length)
            this.dividerRows.push(this.choices.items.length)
            this.lineEntry.push(idx)
            var list2 = _k_.list(lines)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                line = list2[_c_]
                this.lineEntry.push(idx)
            }
            this.choices.append(items,ext)
        }
        return this.choices.state.setHighlights([])
    }

    clippo.prototype["arrangeRect"] = function ()
    {
        var g, w, x, _171_26_, _171_39_

        g = ((_171_39_=(this.editor.gutter != null ? this.editor.gutter.cells.cols : undefined)) != null ? _171_39_ : 0)
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
        var _230_51_

        return ((_230_51_=this.lineEntry[this.choices.state.mainCursor()[1]]) != null ? _230_51_ : -1)
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
        var entry, span, _293_40_

        this.matchEntries = []
        var list = _k_.list(this.choices.state.s.highlights)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            entry = ((_293_40_=this.lineEntry[span[1]]) != null ? _293_40_ : -1)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcHBvLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvY2xpcHBvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FBYSxVQUFBO0lBQU87SUFBSzs7T0FDckIsb0JBQUE7SUFBZ0I7O09BQ0EsWUFBVjs7T0FDVSxlQUFUOztPQUNTLGtCQUFBOzs7QUFDbkIsVUFBRDs7dUJBQVE7YUFNSixRQUFJLFFBQVEsUUFBUSxpQkFBYzs7UUFBL0I7UUFBUTtRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVmLEtBQUMsU0FBUztRQUNWLEtBQUM7UUFDRCxLQUFDLHdCQUFhLGNBQUEsSUFBSyw2Q0FBYTtRQUNoQyxLQUFDLGlCQUFnQixjQUFBLElBQUs7UUFDdEIsS0FBQywwQkFBRCxLQUFDOzttQkFBb0IsS0FBSzs7UUFFMUIsS0FBQyxnQkFBZ0I7UUFFakIsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUVELEtBQUMsZUFBZTtRQUNoQixLQUFDLGFBQWU7UUFDaEIsS0FBQyxjQUFlOytDQUVWLEtBQUMsT0FBTyxLQUFDLE1BQU07UUFFckIsS0FBQyxTQUFTLEtBQVcsTUFBTSxPQUFPO1FBQ2xDLEtBQUMsU0FBUyxRQUFXLE1BQU0sT0FBTztRQUNsQyxLQUFDLFNBQVMsVUFBVyxNQUFNLE9BQU87UUFDbEMsS0FBQyxTQUFTLFdBQVcsTUFBTSxVQUFVO1FBQ3JDLEtBQUMsU0FBUyxTQUFXLE1BQU0sT0FBTztRQUVsQyxLQUFDLFFBQVE7O1FBQ1QsS0FBQyxRQUFRLE1BQU0sOEJBQThCO1FBRTdDLEtBQUMsTUFBTSxJQUFJO2FBRU0sY0FBQSxJQUFLLHVCQUFTOztZQUEvQixLQUFDOzs7O3NCQUVMOzs7O1FBRUksT0FBTyxLQUFLO1lBRVAsU0FBUTs7OzthQUNSLEtBQUMsMEJBQWlCLEtBQUM7Ozs7WUFFckIsU0FBUTs7WUFFUCxLQUFDLGVBQWUsTUFBTSxZQUFZLFVBQVUsS0FBSyxLQUFLO1lBQ3RELEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/clippo.kode
