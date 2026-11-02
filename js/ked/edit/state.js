var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var state

import kxk from "../../kxk.js"
let immutable = kxk.immutable
let kstr = kxk.kstr
let kseg = kxk.kseg
let events = kxk.events
let absMin = kxk.absMin

import clip from "../../kxk/clip.js"

import syntax from "../util/syntax.js"

import del from "./act/del.js"
import insert from "./act/insert.js"
import select from "./act/select.js"
import join from "./act/join.js"
import indent from "./act/indent.js"
import multi from "./act/multi.js"
import main from "./act/main.js"
import novim from "./act/novim.js"

import belt from "./tool/belt.js"
import colorspans from "./tool/colorspans.js"

import keys from "./keys.js"
import mode from "./mode.js"


state = (function ()
{
    _k_.extend(state, events)
    function state (cells, name)
    {
        this.cells = cells
    
        var act, k, v

        this["rangeForVisibleLines"] = this["rangeForVisibleLines"].bind(this)
        this["setView"] = this["setView"].bind(this)
        this["initView"] = this["initView"].bind(this)
        this["adjustViewForMainCursor"] = this["adjustViewForMainCursor"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["paste"] = this["paste"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["cut"] = this["cut"].bind(this)
        this["gutterWidth"] = this["gutterWidth"].bind(this)
        this["hasRedo"] = this["hasRedo"].bind(this)
        this["isDirty"] = this["isDirty"].bind(this)
        this["swapState"] = this["swapState"].bind(this)
        this["pushState"] = this["pushState"].bind(this)
        this["end"] = this["end"].bind(this)
        this["begin"] = this["begin"].bind(this)
        this["redo"] = this["redo"].bind(this)
        this["undo"] = this["undo"].bind(this)
        this["isInvalidLineIndex"] = this["isInvalidLineIndex"].bind(this)
        this["isValidLineIndex"] = this["isValidLineIndex"].bind(this)
        this["clearLines"] = this["clearLines"].bind(this)
        this["posForCell"] = this["posForCell"].bind(this)
        this["maxViewLine"] = this["maxViewLine"].bind(this)
        this["startForRow"] = this["startForRow"].bind(this)
        this["lineAtRow"] = this["lineAtRow"].bind(this)
        this["rowOfLine"] = this["rowOfLine"].bind(this)
        this["viewTopRow"] = this["viewTopRow"].bind(this)
        this["lineAtAbsoluteRow"] = this["lineAtAbsoluteRow"].bind(this)
        this["rowsBeforeLine"] = this["rowsBeforeLine"].bind(this)
        this["totalRows"] = this["totalRows"].bind(this)
        this["rowPrefix"] = this["rowPrefix"].bind(this)
        this["lineHeight"] = this["lineHeight"].bind(this)
        this["scaleOfLine"] = this["scaleOfLine"].bind(this)
        this["applyScales"] = this["applyScales"].bind(this)
        this["linesInView"] = this["linesInView"].bind(this)
        this["appendLines"] = this["appendLines"].bind(this)
        this["addLine"] = this["addLine"].bind(this)
        this["clearSegls"] = this["clearSegls"].bind(this)
        this["clearEmpty"] = this["clearEmpty"].bind(this)
        this["clearSingle"] = this["clearSingle"].bind(this)
        this["loadSegls"] = this["loadSegls"].bind(this)
        this["loadLines"] = this["loadLines"].bind(this)
        this["setSegls"] = this["setSegls"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["setText"] = this["setText"].bind(this)
        this["textOfSelectionOrWordAtCursor"] = this["textOfSelectionOrWordAtCursor"].bind(this)
        this["setCursors"] = this["setCursors"].bind(this)
        this["loadColors"] = this["loadColors"].bind(this)
        this["colorAtPos"] = this["colorAtPos"].bind(this)
        this["clearColorsAtCursorOrSelection"] = this["clearColorsAtCursorOrSelection"].bind(this)
        this["clearColorsForRanges"] = this["clearColorsForRanges"].bind(this)
        this["setColorsForRanges"] = this["setColorsForRanges"].bind(this)
        this["setHighlights"] = this["setHighlights"].bind(this)
        this["setSelections"] = this["setSelections"].bind(this)
        this["set"] = this["set"].bind(this)
        this["clearHistory"] = this["clearHistory"].bind(this)
        this["owner"] = this["owner"].bind(this)
        this["stopMode"] = this["stopMode"].bind(this)
        this["startMode"] = this["startMode"].bind(this)
        this["toggleMode"] = this["toggleMode"].bind(this)
        this.name = name + '.state'
        this.allowedModes = {}
        var list = [del,insert,select,join,indent,multi,main,novim]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            act = list[_a_]
            for (k in act)
            {
                v = act[k]
                this[k] = v.bind(this)
            }
        }
        this.handleKey = keys.bind(this)
        this.syntax = new syntax(this.name + '.syntax')
        this.hasFocus = false
        this.scales = {h1:3,h2:2}
        this.scaledExts = ['md','markdown','kode']
        this.scaling = true
        this.yankFlash = null
        this.yankFlashTimer = null
        this.rowCache = null
        this.rowCacheExt = null
        this.clearSingle()
        return state.__super__.constructor.apply(this, arguments)
    }

    state.prototype["toggleMode"] = function (name)
    {
        if (this.allowedModes[name])
        {
            return mode.toggle(this,name)
        }
    }

    state.prototype["startMode"] = function (name)
    {
        if (this.allowedModes[name])
        {
            return mode.start(this,name)
        }
    }

    state.prototype["stopMode"] = function (name)
    {
        if (this.allowedModes[name])
        {
            return mode.stop(this,name)
        }
    }

    state.prototype["owner"] = function ()
    {
        if (this.name.endsWith('.state'))
        {
            return this.name.slice(0, -6)
        }
        else
        {
            return this.name
        }
    }

    state.prototype["clearHistory"] = function ()
    {
        this.h = [this.s]
        return this.r = []
    }

    state.prototype["set"] = function (item, arg)
    {
        this.s = this.s.set(item,arg)
        this.swapState()
        return this
    }

    state.prototype["setSelections"] = function (selections)
    {
        return this.set('selections',belt.mergeLineRanges(this.s.lines,selections))
    }

    state.prototype["setHighlights"] = function (highlights)
    {
        return this.set('highlights',belt.normalizeSpans(highlights))
    }

    state.prototype["setColorsForRanges"] = function (ranges, fg, bg, voided = [])
    {
        var bgSpans, colors, fgSpans, next, _105_23_, _88_28_, _89_28_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_88_28_=colors.fg) != null ? _88_28_ : [])
        bgSpans = ((_89_28_=colors.bg) != null ? _89_28_ : [])
        if (_k_.in('fg',voided))
        {
            fgSpans = colorspans.clear(fgSpans,ranges)
        }
        else if (!_k_.empty(fg) && !_k_.empty(fg))
        {
            fgSpans = colorspans.overlay(fgSpans,ranges,fg,this.s.lines)
        }
        if (_k_.in('bg',voided))
        {
            bgSpans = colorspans.clear(bgSpans,ranges)
        }
        else if (!_k_.empty(bg) && !_k_.empty(bg))
        {
            bgSpans = colorspans.overlay(bgSpans,ranges,bg,this.s.lines)
        }
        next = {fg:fgSpans,bg:bgSpans}
        if ((this.s.colors != null) && _k_.eql(this.s.colors, next))
        {
            return
        }
        this.s = this.s.set('colors',next)
        this.r = []
        this.pushState()
        return this.emit('colors.changed')
    }

    state.prototype["clearColorsForRanges"] = function (ranges)
    {
        var bgSpans, colors, fgSpans, next, _117_46_, _118_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_117_46_=colors.fg) != null ? _117_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_118_46_=colors.bg) != null ? _118_46_ : [])),ranges)
        next = {fg:fgSpans,bg:bgSpans}
        if (_k_.eql(colors, next))
        {
            return
        }
        this.s = this.s.set('colors',next)
        this.r = []
        this.pushState()
        return this.emit('colors.changed')
    }

    state.prototype["clearColorsAtCursorOrSelection"] = function ()
    {
        var ranges, rng

        ranges = this.s.selections
        if (_k_.empty(ranges))
        {
            if (rng = belt.rangeOfClosestWordToPos(this.s.lines,this.mainCursor()))
            {
                ranges = [rng]
            }
        }
        if (!_k_.empty(ranges))
        {
            return this.clearColorsForRanges(ranges)
        }
    }

    state.prototype["colorAtPos"] = function (pos, layer)
    {
        var colors, _146_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return null
        }
        return colorspans.colorAtPos((((_146_45_=colors[layer]) != null ? _146_45_ : [])),pos)
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, fgSpans, next, _154_32_, _155_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_154_32_=colors.fg) != null ? _154_32_ : [])
            bgSpans = ((_155_32_=colors.bg) != null ? _155_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        this.s = this.s.set('colors',next)
        this.clearHistory()
        return this.emit('colors.changed')
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _174_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_174_15_=opt.mc) != null ? _174_15_ : this.mainCursor())
        main = opt.main
        if (!opt.keepAnchors)
        {
            delete this.anchors
        }
        if (_k_.isArr(main))
        {
            main = belt.indexOfPosInPositions(main,cursors)
        }
        if (_k_.isNum(main) && main < 0)
        {
            main = cursors.length + main
        }
        if ((main != null))
        {
            mainCursor = _k_.copy(cursors[_k_.clamp(0,cursors.length - 1,main)])
        }
        else
        {
            mainCursor = this.mainCursor()
        }
        cursors = belt.normalizePositions(cursors,this.s.lines.length - 1)
        this.s = this.s.set('cursors',cursors)
        main = -1
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cur = list[idx]
            if (_k_.eql(cur, mainCursor))
            {
                main = idx
                break
            }
        }
        if (main < 0)
        {
            main = this.s.main
        }
        main = _k_.clamp(0,this.s.cursors.length - 1,main)
        this.s = this.s.set('main',main)
        this.adjustViewForMainCursor(opt)
        this.swapState()
        mode.cursorsSet(this)
        this.emit('cursorsSet')
        return this
    }

    state.prototype["textOfSelectionOrWordAtCursor"] = function ()
    {
        if (this.s.selections.length)
        {
            return this.textOfSelection()
        }
        else
        {
            return this.wordAtCursor()
        }
    }

    state.prototype["setText"] = function (text)
    {
        return this.setLines(text.split(/\r?\n/))
    }

    state.prototype["setLines"] = function (lines)
    {
        if (_k_.empty(lines))
        {
            lines = ['']
        }
        return this.setSegls(kseg.segls(lines))
    }

    state.prototype["setSegls"] = function (segls)
    {
        this.segls = segls
    
        if (_k_.empty(this.segls))
        {
            this.segls = [[]]
        }
        this.syntax.setSegls(this.segls)
        this.changeLinesSegls()
        this.r = []
        this.maxLineWidth = belt.widthOfLines(this.s.lines)
        return this.pushState()
    }

    state.prototype["loadLines"] = function (lines)
    {
        if (!_k_.empty(lines) && !(_k_.isStr(lines[0])))
        {
            console.error(`${this.name}.loadLines - first line not a string?`,lines[0])
        }
        return this.loadSegls(kseg.segls(lines))
    }

    state.prototype["loadSegls"] = function (segls)
    {
        this.clearEmpty()
        return this.setSegls(segls)
    }

    state.prototype["clearSingle"] = function ()
    {
        return this.clearSegls([[]])
    }

    state.prototype["clearEmpty"] = function ()
    {
        return this.clearSegls([])
    }

    state.prototype["clearSegls"] = function (segls)
    {
        this.segls = segls
    
        this.visual = null
        this.visualAnchors = []
        this.novimInsert = null
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        this.yankFlash = null
        this.yankFlashTimer = null
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],colors:{fg:[],bg:[]}})
        this.syntax.clear()
        this.rowCache = null
        this.h = []
        return this.r = []
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _293_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_293_15_=this.segls) != null ? _293_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _302_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_302_15_=this.segls) != null ? _302_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var bgSpans, colors, diff, fgSpans, next, oldLines, _326_55_, _327_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        this.rowCache = null
        if (oldLines !== this.s.lines)
        {
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_326_55_=colors.fg) != null ? _326_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_327_55_=colors.bg) != null ? _327_55_ : [])),oldLines,this.s.lines)
                next = {fg:fgSpans,bg:bgSpans}
                this.s = this.s.set('colors',next)
            }
            diff = belt.diffLines(oldLines,this.s.lines)
            return this.emit('lines.changed',diff)
        }
    }

    state.prototype["linesInView"] = function ()
    {
        return this.s.lines.slice(this.s.view[1], this.lineAtRow(this.cells.rows - 1) + 1)
    }

    state.prototype["applyScales"] = function (conf)
    {
        this.scaling = (conf != null ? conf.enabled : undefined) !== false
        if (!_k_.empty((conf != null ? conf.md : undefined)))
        {
            this.scales = conf.md
        }
        else
        {
            this.scales = {h1:3,h2:2}
        }
        return this.rowCache = null
    }

    state.prototype["scaleOfLine"] = function (li)
    {
        var clss, s, scale

        if (!this.scaling)
        {
            return 1
        }
        if (!(_k_.in(this.syntax.ext,this.scaledExts)))
        {
            return 1
        }
        for (clss in this.scales)
        {
            scale = this.scales[clss]
            s = _k_.clamp(1,7,scale)
            if (s > 1 && this.syntax.hasClass(li,clss))
            {
                return s
            }
        }
        return 1
    }

    state.prototype["lineHeight"] = function (li)
    {
        return this.scaleOfLine(li)
    }

    state.prototype["rowPrefix"] = function ()
    {
        var li, rows

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        rows = [0]
        for (var _a_ = li = 0, _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            rows.push((rows[li] + this.lineHeight(li)))
        }
        this.rowCacheExt = this.syntax.ext
        return this.rowCache = rows
    }

    state.prototype["totalRows"] = function ()
    {
        return this.rowPrefix()[this.s.lines.length]
    }

    state.prototype["rowsBeforeLine"] = function (li)
    {
        var n

        n = this.s.lines.length
        li = _k_.clamp(0,n,li)
        return this.rowPrefix()[li]
    }

    state.prototype["lineAtAbsoluteRow"] = function (row)
    {
        var hi, lo, mid, n, rows

        n = this.s.lines.length
        if (n === 0)
        {
            return 0
        }
        rows = this.rowPrefix()
        row = _k_.clamp(0,rows[n] - 1,row)
        lo = 0
        hi = n - 1
        while (lo < hi)
        {
            mid = parseInt((lo + hi + 1) / 2)
            if (rows[mid] <= row)
            {
                lo = mid
            }
            else
            {
                hi = mid - 1
            }
        }
        return lo
    }

    state.prototype["viewTopRow"] = function ()
    {
        return this.rowsBeforeLine(this.s.view[1])
    }

    state.prototype["rowOfLine"] = function (li)
    {
        return this.rowsBeforeLine(li) - this.viewTopRow()
    }

    state.prototype["lineAtRow"] = function (row)
    {
        var h, li, r

        r = 0
        for (var _a_ = li = this.s.view[1], _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            h = this.lineHeight(li)
            if (row < r + h)
            {
                return li
            }
            r += h
        }
        return _k_.max(0,this.s.lines.length - 1)
    }

    state.prototype["startForRow"] = function (li, target)
    {
        var rows, start

        target = _k_.max(0,target)
        start = li
        rows = 0
        while (start > 0 && rows < target)
        {
            start -= 1
            rows += this.lineHeight(start)
        }
        return start
    }

    state.prototype["maxViewLine"] = function ()
    {
        var h, li

        h = 0
        li = this.s.lines.length - 1
        while (li >= 0 && h + this.lineHeight(li) <= this.cells.rows)
        {
            h += this.lineHeight(li)
            li -= 1
        }
        return li + 1
    }

    state.prototype["posForCell"] = function (x, row)
    {
        var li

        li = this.lineAtRow(row)
        return [parseInt(x / this.lineHeight(li)) + this.s.view[0],li]
    }

    state.prototype["clearLines"] = function ()
    {
        this.setSegls([[]])
        return this.setMainCursor(0,0)
    }

    state.prototype["isValidLineIndex"] = function (li)
    {
        return (0 <= li && li < this.s.lines.length)
    }

    state.prototype["isInvalidLineIndex"] = function (li)
    {
        return !this.isValidLineIndex(li)
    }

    state.prototype["undo"] = function ()
    {
        if (this.h.length <= 1)
        {
            return
        }
        this.r.push(this.h.pop())
        this.s = this.h.slice(-1)[0]
        this.syntax.setSegls(this.s.lines)
        return this.emit('colors.changed')
    }

    state.prototype["redo"] = function ()
    {
        if (_k_.empty(this.r))
        {
            return
        }
        this.h.push(this.r.pop())
        this.s = this.h.slice(-1)[0]
        this.syntax.setSegls(this.s.lines)
        return this.emit('colors.changed')
    }

    state.prototype["begin"] = function ()
    {
        return this.beginIndex = this.h.length
    }

    state.prototype["end"] = function ()
    {
        if (!_k_.empty(this.beginIndex))
        {
            this.h.splice(this.beginIndex,this.h.length - this.beginIndex - 1)
            delete this.beginIndex
        }
        return this
    }

    state.prototype["pushState"] = function ()
    {
        this.h.push(this.s)
        return this
    }

    state.prototype["swapState"] = function ()
    {
        this.h.pop()
        return this.pushState()
    }

    state.prototype["isDirty"] = function ()
    {
        return this.h.length > 1
    }

    state.prototype["hasRedo"] = function ()
    {
        return this.r.length > 0
    }

    state.prototype["gutterWidth"] = function ()
    {
        return _k_.max(4,2 + Math.ceil(Math.log10(this.s.lines.length + 1)))
    }

    state.prototype["cut"] = function (opt)
    {
        opt = (opt != null ? opt : {})
        this.copy({deselect:false})
        if (_k_.empty(this.s.selections))
        {
            this.selectCursorLines()
        }
        return this.deleteSelection()
    }

    state.prototype["copy"] = function (opt)
    {
        opt = (opt != null ? opt : {})
        clip.copy(this.textOfSelectionOrCursorLines())
        if (opt.deselect !== false)
        {
            return this.deselect()
        }
    }

    state.prototype["paste"] = function (opt)
    {
        return this.insert(clip.paste())
    }

    state.prototype["scrollView"] = function (dir, steps = 1)
    {
        var maxOffsetX, sx, sy, view

        sx = sy = 0
        switch (dir)
        {
            case 'left':
                sx = -1
                break
            case 'right':
                sx = 1
                break
            case 'up':
                sy = -steps
                break
            case 'down':
                sy = steps
                break
        }

        view = this.s.view.asMutable()
        view[0] += sx
        view[1] += sy
        view[1] = _k_.clamp(0,this.maxViewLine(),view[1])
        maxOffsetX = _k_.max(0,this.maxLineWidth - parseInt(this.cells.cols / this.lineHeight(this.mainCursor()[1])) + 2)
        maxOffsetX = _k_.max(maxOffsetX,this.mainCursor()[0] - parseInt(this.cells.cols / this.lineHeight(this.mainCursor()[1])) + 2)
        view[0] = _k_.clamp(0,maxOffsetX,view[0])
        if (_k_.eql(view, this.s.view))
        {
            return
        }
        return this.setView(view)
    }

    state.prototype["adjustViewForMainCursor"] = function (opt)
    {
        var botDelta, cols, dir, height, row, topBotDelta, topDelta, view, x, y

        opt = (opt != null ? opt : {})
        if (this.cells.cols <= 0 || this.cells.rows <= 0)
        {
            return
        }
        if (opt.adjust === false)
        {
            return
        }
        var _a_ = this.mainCursor(); x = _a_[0]; y = _a_[1]

        view = this.s.view.asMutable()
        topBotDelta = 7
        topDelta = 7
        botDelta = _k_.max(topDelta,parseInt(this.cells.rows / 2))
        row = this.rowOfLine(y)
        height = this.lineHeight(y)
        if (opt.adjust === 'topDelta')
        {
            view[1] = this.startForRow(y,topDelta)
        }
        else if (opt.adjust === 'topBotDeltaGrow' && opt.mc)
        {
            if (row < 0)
            {
                view[1] = this.startForRow(y,topDelta)
            }
            else if (row + height > this.cells.rows)
            {
                view[1] = this.startForRow(y,(this.cells.rows - botDelta - height))
            }
            else
            {
                dir = y - opt.mc[1]
                if (row < topDelta && dir < 0)
                {
                    view[1] = this.startForRow(y,topDelta)
                }
                else if (row + height > this.cells.rows - botDelta && dir > 0)
                {
                    view[1] = this.startForRow(y,(this.cells.rows - botDelta - height))
                }
            }
        }
        else
        {
            if (opt.adjust !== 'topBotDelta')
            {
                topBotDelta = 0
            }
            if (row + height > this.cells.rows - topBotDelta)
            {
                view[1] = this.startForRow(y,(this.cells.rows - topBotDelta - height))
            }
            else if (row < topBotDelta)
            {
                view[1] = this.startForRow(y,topBotDelta)
            }
        }
        view[1] = _k_.min(view[1],this.maxViewLine())
        if (!this.skipAdjustViewForMainCursor)
        {
            cols = _k_.max(1,parseInt(this.cells.cols / height))
            view[0] = _k_.max(0,x - cols + 2)
        }
        if (_k_.eql(view, this.s.view))
        {
            return
        }
        return this.setView(view)
    }

    state.prototype["initView"] = function ()
    {
        var view

        view = this.s.view.asMutable()
        view[1] = _k_.clamp(0,this.maxViewLine(),view[1])
        view[0] = _k_.max(0,view[0])
        return this.setView(view)
    }

    state.prototype["setView"] = function (view)
    {
        if (_k_.eql(this.s.view, view))
        {
            return
        }
        this.set('view',view)
        this.emit('view.changed',this.s.view)
        return this
    }

    state.prototype["rangeForVisibleLines"] = function ()
    {
        return [this.s.view[0],this.s.view[1],this.s.view[0] + this.cells.cols - 1,this.s.view[1] + this.cells.rows - 1]
    }

    return state
})()

export default state;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPOztPQUMzQixXQUFOOztPQUNNLGFBQVQ7O09BQ1MsVUFBVjtPQUFjLGFBQWQ7T0FBcUIsYUFBckI7T0FBNEIsV0FBNUI7T0FBaUMsYUFBakM7T0FBd0MsWUFBeEM7T0FBOEMsV0FBOUM7T0FBbUQsWUFBbkQ7O09BQ1UsV0FBVjtPQUFlLGlCQUFmOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFWixTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxPQUFNOztRQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sT0FBTztRQUVmLEtBQUM7b0JBRVcsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSzs7O1lBQWpEO2lCQUNJLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsS0FBRSxLQUFLLEVBQUUsS0FBSzs7O1FBRXRCLEtBQUMsWUFBWSxLQUFLLEtBQUs7UUFFdkIsS0FBQyxhQUFlLE9BQU8sS0FBQyxPQUFPO1FBQy9CLEtBQUMsV0FBVztRQUdaLEtBQUMsVUFBYyxHQUFHLEVBQUUsR0FBRztRQUN2QixLQUFDLGNBQWMsS0FBSyxXQUFXO1FBQy9CLEtBQUMsVUFBYTtRQUVkLEtBQUMsWUFBaUI7UUFDbEIsS0FBQyxpQkFBaUI7UUFFbEIsS0FBQyxXQUFjO1FBQ2YsS0FBQyxjQUFjO1FBRWYsS0FBQzs7OztxQkFFTCx5QkFBWTs7WUFBOEIsS0FBQyxhQUFhOzttQkFBcEMsS0FBSyxPQUFPLEtBQUU7Ozs7cUJBQ2xDLHdCQUFZOztZQUE4QixLQUFDLGFBQWE7O21CQUFwQyxLQUFLLE1BQU8sS0FBRTs7OztxQkFDbEMsdUJBQVk7O1lBQThCLEtBQUMsYUFBYTs7bUJBQXBDLEtBQUss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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
