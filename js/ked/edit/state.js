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
import config from "../util/config.js"
import scaling from "../util/scaling.js"

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
        this["setScrollTop"] = this["setScrollTop"].bind(this)
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
        this["viewMargin"] = this["viewMargin"].bind(this)
        this["marginValue"] = this["marginValue"].bind(this)
        this["maxTopRow"] = this["maxTopRow"].bind(this)
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
        this.maxWidthCache = 0
        this.gutterWidthOverride = null
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

    state.prototype["setSelections"] = function (selections, keepEmpty)
    {
        return this.set('selections',belt.mergeLineRanges(this.s.lines,selections,keepEmpty))
    }

    state.prototype["setHighlights"] = function (highlights)
    {
        return this.set('highlights',belt.normalizeSpans(highlights))
    }

    state.prototype["setColorsForRanges"] = function (ranges, fg, bg, voided = [])
    {
        var bgSpans, colors, fgSpans, next, _80_28_, _81_28_, _97_22_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_80_28_=colors.fg) != null ? _80_28_ : [])
        bgSpans = ((_81_28_=colors.bg) != null ? _81_28_ : [])
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
        var bgSpans, colors, fgSpans, next, _109_46_, _110_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_109_46_=colors.fg) != null ? _109_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_110_46_=colors.bg) != null ? _110_46_ : [])),ranges)
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
        var colors, _138_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return null
        }
        return colorspans.colorAtPos((((_138_45_=colors[layer]) != null ? _138_45_ : [])),pos)
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, fgSpans, next, _146_32_, _147_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_146_32_=colors.fg) != null ? _146_32_ : [])
            bgSpans = ((_147_32_=colors.bg) != null ? _147_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        this.s = this.s.set('colors',next)
        this.clearHistory()
        return this.emit('colors.changed')
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _162_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_162_15_=opt.mc) != null ? _162_15_ : this.mainCursor())
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
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],scrollOffset:0,colors:{fg:[],bg:[]}})
        this.syntax.clear()
        this.rowCache = null
        this.h = []
        return this.r = []
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _278_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_278_15_=this.segls) != null ? _278_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _287_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_287_15_=this.segls) != null ? _287_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var bgSpans, colors, diff, fgSpans, next, oldLines, _307_55_, _308_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        this.rowCache = null
        if (oldLines !== this.s.lines)
        {
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_307_55_=colors.fg) != null ? _307_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_308_55_=colors.bg) != null ? _308_55_ : [])),oldLines,this.s.lines)
                next = {fg:fgSpans,bg:bgSpans}
                this.s = this.s.set('colors',next)
            }
            diff = belt.diffLines(oldLines,this.s.lines)
            return this.emit('lines.changed',diff)
        }
    }

    state.prototype["linesInView"] = function ()
    {
        return this.s.lines.slice(this.lineAtRow(0), this.lineAtRow(this.cells.rows - 1) + 1)
    }

    state.prototype["applyScales"] = function (conf)
    {
        this.scaling = (conf != null ? conf.enabled : undefined) !== false
        this.scales = (conf != null ? conf : {})
        return this.rowCache = null
    }

    state.prototype["lineHeight"] = function (li)
    {
        return scaling.scaleOfLine(this.syntax,this.scales,this.scaling,li)
    }

    state.prototype["rowPrefix"] = function ()
    {
        var li, maxWidth, rows

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        rows = scaling.rowPrefix(this.s.lines,this.lineHeight)
        maxWidth = 0
        for (var _a_ = li = 0, _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            maxWidth = _k_.max(maxWidth,(kseg.width(this.s.lines[li]) * this.lineHeight,li))
        }
        this.maxWidthCache = maxWidth
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
        return this.rowsBeforeLine(this.s.view[1]) + this.s.scrollOffset
    }

    state.prototype["rowOfLine"] = function (li)
    {
        return this.rowsBeforeLine(li) - this.viewTopRow()
    }

    state.prototype["lineAtRow"] = function (row)
    {
        return this.lineAtAbsoluteRow((this.viewTopRow() + row))
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

    state.prototype["maxTopRow"] = function ()
    {
        return this.rowsBeforeLine(this.maxViewLine())
    }

    state.prototype["marginValue"] = function (val, fallback)
    {
        var pct

        if (!!_k_.empty(val))
        {
            return fallback
        }
        if (_k_.isStr(val) && val.endsWith('%'))
        {
            pct = parseInt(val.slice(0, -1))
            return parseInt(this.cells.rows * pct / 100)
        }
        if (_k_.isNum(val))
        {
            return parseInt(val)
        }
        return fallback
    }

    state.prototype["viewMargin"] = function (name, fallback)
    {
        var conf, _423_26_

        conf = (config.data != null ? config.data.cursor : undefined)
        if (!!_k_.empty(conf))
        {
            return fallback
        }
        return this.marginValue((conf[name]),fallback)
    }

    state.prototype["posForCell"] = function (x, row)
    {
        var h, li

        li = this.lineAtRow(row)
        h = this.lineHeight(li)
        return [parseInt((x + this.s.view[0]) / h),li]
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
        this.segls = this.s.lines.slice()
        this.rowCache = null
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
        this.segls = this.s.lines.slice()
        this.rowCache = null
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
        var _483_54_

        if ((this.gutterWidthOverride != null))
        {
            return this.gutterWidthOverride
        }
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
        var cursor, cursorRight, cursorScale, maxOffsetX, scrollOffset, sx, sy, topRow, view

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
        topRow = _k_.clamp(0,this.maxTopRow(),(this.viewTopRow() + sy))
        view[1] = this.lineAtAbsoluteRow(topRow)
        scrollOffset = topRow - this.rowsBeforeLine(view[1])
        this.rowPrefix()
        cursor = this.mainCursor()
        cursorScale = this.lineHeight(cursor[1])
        cursorRight = cursor[0] * cursorScale + cursorScale
        maxOffsetX = _k_.max(0,this.maxWidthCache - this.cells.cols + 2)
        maxOffsetX = _k_.max(maxOffsetX,cursorRight - this.cells.cols + 2)
        view[0] = _k_.clamp(0,maxOffsetX,view[0])
        if (_k_.eql(view, this.s.view) && scrollOffset === this.s.scrollOffset)
        {
            return
        }
        return this.setView(view,scrollOffset)
    }

    state.prototype["adjustViewForMainCursor"] = function (opt)
    {
        var blockTop, botDelta, botFallback, botMargin, current, delta, dir, height, row, scrollOffset, topDelta, topFallback, topMargin, topRow, view, visibleTop, x, y

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
        topFallback = 7
        botFallback = _k_.max(topMargin,parseInt(this.cells.rows / 2))
        topMargin = this.viewMargin('topOffset',topFallback)
        botMargin = this.viewMargin('bottomOffset',botFallback)
        topMargin = _k_.clamp(0,this.cells.rows,topMargin)
        botMargin = _k_.clamp(0,this.cells.rows,botMargin)
        row = this.rowOfLine(y)
        height = this.lineHeight(y)
        topRow = this.viewTopRow()
        if (opt.adjust === 'topDelta')
        {
            topRow = this.rowsBeforeLine(y) - topMargin
        }
        else if (opt.adjust === 'topBotDeltaGrow' && opt.mc)
        {
            if (row < 0)
            {
                topRow = this.rowsBeforeLine(y) - topMargin
            }
            else if (row + height > this.cells.rows)
            {
                topRow = this.rowsBeforeLine(y) - (this.cells.rows - botMargin - height)
            }
            else
            {
                dir = y - opt.mc[1]
                if (row < topMargin && dir < 0)
                {
                    topRow = this.rowsBeforeLine(y) - topMargin
                }
                else if (row + height > this.cells.rows - botMargin && dir > 0)
                {
                    topRow = this.rowsBeforeLine(y) - (this.cells.rows - botMargin - height)
                }
            }
        }
        else
        {
            topDelta = 0
            botDelta = 0
            if (opt.adjust === 'topBotDelta')
            {
                topDelta = topMargin
                botDelta = botMargin
            }
            if (row + height > this.cells.rows - botDelta)
            {
                topRow = this.rowsBeforeLine(y) - (this.cells.rows - botDelta - height)
            }
            else if (row < topDelta)
            {
                topRow = this.rowsBeforeLine(y) - topDelta
            }
        }
        if (_k_.in(opt.adjust,['topBotDeltaGrow','topBotDelta']))
        {
            current = this.viewTopRow()
            delta = topRow - current
            if (delta > 1)
            {
                topRow = current + 1
            }
            else if (delta < -1)
            {
                topRow = current - 1
            }
        }
        topRow = _k_.clamp(0,this.maxTopRow(),topRow)
        blockTop = this.rowsBeforeLine(y)
        visibleTop = blockTop + height - this.cells.rows
        topRow = _k_.max(visibleTop,topRow)
        topRow = _k_.min(blockTop,topRow)
        topRow = _k_.clamp(0,this.maxTopRow(),topRow)
        view[1] = this.lineAtAbsoluteRow(topRow)
        scrollOffset = topRow - this.rowsBeforeLine(view[1])
        if (!this.skipAdjustViewForMainCursor)
        {
            view[0] = _k_.max(0,x * height + height + 1 - this.cells.cols)
        }
        if (_k_.eql(view, this.s.view) && scrollOffset === this.s.scrollOffset)
        {
            return
        }
        return this.setView(view,scrollOffset)
    }

    state.prototype["initView"] = function ()
    {
        var topRow, view

        view = this.s.view.asMutable()
        topRow = _k_.clamp(0,this.maxTopRow(),this.viewTopRow())
        view[1] = this.lineAtAbsoluteRow(topRow)
        view[0] = _k_.max(0,view[0])
        return this.setView(view,(topRow - this.rowsBeforeLine(view[1])))
    }

    state.prototype["setView"] = function (view, scrollOffset = 0)
    {
        scrollOffset = (scrollOffset != null ? scrollOffset : 0)
        if (_k_.eql(this.s.view, view) && this.s.scrollOffset === scrollOffset)
        {
            return
        }
        this.s = this.s.set('view',view)
        this.s = this.s.set('scrollOffset',scrollOffset)
        this.swapState()
        this.emit('view.changed',this.s.view)
        return this
    }

    state.prototype["setScrollTop"] = function (row)
    {
        var li, view

        row = _k_.clamp(0,this.maxTopRow(),row)
        li = this.lineAtAbsoluteRow(row)
        view = this.s.view.asMutable()
        view[1] = li
        return this.setView(view,(row - this.rowsBeforeLine(li)))
    }

    state.prototype["rangeForVisibleLines"] = function ()
    {
        return [this.s.view[0],this.lineAtRow(0),this.s.view[0] + this.cells.cols - 1,this.lineAtRow(this.cells.rows - 1)]
    }

    return state
})()

export default state;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPOztPQUMzQixXQUFOOztPQUNNLGFBQVQ7T0FBZ0IsYUFBaEI7T0FBdUIsY0FBdkI7O09BQ1MsVUFBVjtPQUFjLGFBQWQ7T0FBcUIsYUFBckI7T0FBNEIsV0FBNUI7T0FBaUMsYUFBakM7T0FBd0MsWUFBeEM7T0FBOEMsV0FBOUM7T0FBbUQsWUFBbkQ7O09BQ1UsV0FBVjtPQUFlLGlCQUFmOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQU87YUFTSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQztvQkFFVyxJQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTSxLQUFLOzs7WUFBakQ7aUJBQ0ksS0FBTzs7Z0JBQUwsSUFBSztnQkFDUCxLQUFFLEtBQUssRUFBRSxLQUFLOzs7UUFFdEIsS0FBQyxZQUFZLEtBQUssS0FBSztRQUV2QixLQUFDLGFBQWUsT0FBTyxLQUFDLE9BQU87UUFDL0IsS0FBQyxXQUFXO1FBR1osS0FBQyxVQUFjLEdBQUcsRUFBRSxHQUFHO1FBQ3ZCLEtBQUMsY0FBYyxLQUFLLFdBQVc7UUFDL0IsS0FBQyxVQUFhO1FBRWQsS0FBQyxZQUFpQjtRQUNsQixLQUFDLGlCQUFpQjtRQUVsQixLQUFDLFdBQWM7UUFDZixLQUFDLGNBQWM7UUFDZixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLHNCQUFzQjtRQUV2QixLQUFDOzs7O3FCQUVMLHlCQUFZOztZQUE4QixLQUFDLGFBQWE7O21CQUFwQyxLQUFLLE9BQU8sS0FBRTs7OztxQkFDbEMsd0JBQVk7O1lBQThCLEtBQUMsYUFBYTs7bUJBQXBD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
