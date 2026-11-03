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
        this.maxWidthCache = 0
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
        var bgSpans, colors, fgSpans, next, _100_23_, _83_28_, _84_28_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_83_28_=colors.fg) != null ? _83_28_ : [])
        bgSpans = ((_84_28_=colors.bg) != null ? _84_28_ : [])
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
        var bgSpans, colors, fgSpans, next, _112_46_, _113_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_112_46_=colors.fg) != null ? _112_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_113_46_=colors.bg) != null ? _113_46_ : [])),ranges)
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
        var colors, _141_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return null
        }
        return colorspans.colorAtPos((((_141_45_=colors[layer]) != null ? _141_45_ : [])),pos)
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, fgSpans, next, _149_32_, _150_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_149_32_=colors.fg) != null ? _149_32_ : [])
            bgSpans = ((_150_32_=colors.bg) != null ? _150_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        this.s = this.s.set('colors',next)
        this.clearHistory()
        return this.emit('colors.changed')
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _169_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_169_15_=opt.mc) != null ? _169_15_ : this.mainCursor())
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
        var segl, _289_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_289_15_=this.segls) != null ? _289_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _298_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_298_15_=this.segls) != null ? _298_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var bgSpans, colors, diff, fgSpans, next, oldLines, _322_55_, _323_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        this.rowCache = null
        if (oldLines !== this.s.lines)
        {
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_322_55_=colors.fg) != null ? _322_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_323_55_=colors.bg) != null ? _323_55_ : [])),oldLines,this.s.lines)
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

    state.prototype["scaleOfLine"] = function (li)
    {
        var clss, s, scale

        if (!this.scaling)
        {
            return 1
        }
        if (!(_k_.in(this.syntax.ext,Object.keys(this.scales))))
        {
            return 1
        }
        for (clss in this.scales[this.syntax.ext])
        {
            scale = this.scales[this.syntax.ext][clss]
            s = _k_.clamp(1,7,scale)
            if (s > 1 && this.syntax.hasPureClass(li,clss))
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
        var h, li, maxWidth, rows

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        rows = [0]
        maxWidth = 0
        for (var _a_ = li = 0, _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            h = this.lineHeight(li)
            rows.push((rows[li] + h))
            maxWidth = _k_.max(maxWidth,(kseg.width(this.s.lines[li]) * h))
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
        var conf, _482_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPOztPQUMzQixXQUFOOztPQUNNLGFBQVQ7T0FBZ0IsYUFBaEI7O09BQ1MsVUFBVjtPQUFjLGFBQWQ7T0FBcUIsYUFBckI7T0FBNEIsV0FBNUI7T0FBaUMsYUFBakM7T0FBd0MsWUFBeEM7T0FBOEMsV0FBOUM7T0FBbUQsWUFBbkQ7O09BQ1UsV0FBVjtPQUFlLGlCQUFmOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQWU7YUFTWCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sT0FBTztRQUVmLEtBQUM7b0JBRVcsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSzs7O1lBQWpEO2lCQUNJLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsS0FBRSxLQUFLLEVBQUUsS0FBSzs7O1FBRXRCLEtBQUMsWUFBWSxLQUFLLEtBQUs7UUFFdkIsS0FBQyxhQUFlLE9BQU8sS0FBQyxPQUFPO1FBQy9CLEtBQUMsV0FBVztRQUdaLEtBQUMsVUFBYyxHQUFHLEVBQUUsR0FBRztRQUN2QixLQUFDLGNBQWMsS0FBSyxXQUFXO1FBQy9CLEtBQUMsVUFBYTtRQUVkLEtBQUMsWUFBaUI7UUFDbEIsS0FBQyxpQkFBaUI7UUFFbEIsS0FBQyxXQUFjO1FBQ2YsS0FBQyxjQUFjO1FBQ2YsS0FBQyxnQkFBZ0I7UUFFakIsS0FBQzs7OztxQkFFTCx5QkFBWTs7WUFBOEIsS0FBQyxhQUFhOzttQkFBcEMsS0FBSyxPQUFPLEtBQUU7Ozs7cUJBQ2xDLHdCQUFZOztZQUE4QixLQUFDLGFBQWE7O21CQUFwQyxLQUFLLE1BQU8sS0FBRTs7OztxQkFDbEMsdUJB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
