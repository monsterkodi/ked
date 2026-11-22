var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var state

import kxk from "../../kxk.js"
let immutable = kxk.immutable
let kstr = kxk.kstr
let kseg = kxk.kseg
let events = kxk.events
let absMin = kxk.absMin
let post = kxk.post

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
import sort from "./act/sort.js"
import count from "./act/count.js"
import range from "./act/range.js"
import macro from "./act/macro.js"
import jump from "./act/jump.js"
import sheet from "./act/sheet.js"

import belt from "./tool/belt.js"
import colorspans from "./tool/colorspans.js"
import jumplist from "./tool/jumplist.js"
import changelist from "./tool/changelist.js"
import motion from "./tool/motion.js"
import sue from "./tool/sue.js"
import register from "./tool/register.js"

import mode from "./mode.js"
import keys from "./keys.js"


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
        this["colorAtPos"] = this["colorAtPos"].bind(this)
        this["setHighlights"] = this["setHighlights"].bind(this)
        this["setSelections"] = this["setSelections"].bind(this)
        this["set"] = this["set"].bind(this)
        this["clearHistory"] = this["clearHistory"].bind(this)
        this["owner"] = this["owner"].bind(this)
        this["stopMode"] = this["stopMode"].bind(this)
        this["startMode"] = this["startMode"].bind(this)
        this["toggleMode"] = this["toggleMode"].bind(this)
        this.name = name + '.state'
        this.novim = novim.novimState()
        this.allowedModes = {}
        var list = [del,insert,select,join,indent,multi,main,jump,novim,sort,count,range,macro,sheet]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            act = list[_a_]
            for (k in act)
            {
                v = act[k]
                this[k] = v.bind(this)
            }
        }
        this.handleKey = keys
        this.hasFocus = false
        this.syntax = new syntax(this.name + '.syntax')
        this.scaling = true
        this.scales = {h1:3,h2:2}
        this.scaledExts = ['md','markdown','kode']
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

    state.prototype["colorAtPos"] = function (pos, layer)
    {
        var colors, _76_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        return colorspans.colorAtPos((((_76_45_=colors[layer]) != null ? _76_45_ : [])),pos)
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _83_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_83_15_=opt.mc) != null ? _83_15_ : this.mainCursor())
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
        if (!opt.silent)
        {
            mode.cursorsSet(this)
            this.emit('cursorsSet')
        }
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
        this.changeLinesSegls()
        this.syntax.setSegls(this.s.lines)
        this.r = []
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
    
        if (this.novim.yankFlashTimer)
        {
            clearTimeout(this.novim.yankFlashTimer)
        }
        this.novim.visualAnchors = []
        this.novim.visual = null
        this.novim.lastVisual = null
        this.novim.insert = null
        this.novim.yankFlash = null
        this.novim.yankFlashTimer = null
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],scrollOffset:0,colors:{fg:[],bg:[]},sue:[],rectree:null,rectreeCols:null,rectreeRows:null})
        this.syntax.clear()
        this.rowCache = null
        this.h = []
        this.r = []
        this.novim.changes.reset()
        this.beginIndices = []
        return delete this.beginIndex
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _207_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_207_15_=this.segls) != null ? _207_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _216_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_216_15_=this.segls) != null ? _216_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _238_55_, _239_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        this.rowCache = null
        if (oldLines !== this.s.lines)
        {
            if (this.h.length)
            {
                this.novim.changes.record(this.mainCursor())
            }
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_238_55_=colors.fg) != null ? _238_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_239_55_=colors.bg) != null ? _239_55_ : [])),oldLines,this.s.lines)
                next = {fg:fgSpans,bg:bgSpans}
                this.s = this.s.set('colors',next)
            }
            areas = this.s.sue
            if (!_k_.empty(areas))
            {
                this.s = this.s.set('sue',sue.adjust(areas,oldLines,this.s.lines))
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
        this.scaling = (conf != null ? conf.enable : undefined) !== false
        this.scales = (conf != null ? conf : {})
        return this.rowCache = null
    }

    state.prototype["lineHeight"] = function (li)
    {
        var area, _265_28_, _267_46_

        var list = _k_.list((((_265_28_=this.s.sue) != null ? _265_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_267_46_=area.value[3]) != null ? _267_46_ : 1)))
            }
        }
        if (_k_.isFunc(this.syntax.scaleOfLine))
        {
            return this.syntax.scaleOfLine(this.scales,this.scaling,li)
        }
        return 1
    }

    state.prototype["rowPrefix"] = function ()
    {
        var height, li, line, maxWidth, rows, width, _277_20_

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        this.lineWidths = ((_277_20_=this.lineWidths) != null ? _277_20_ : new WeakMap())
        rows = [0]
        maxWidth = 0
        for (var _a_ = li = 0, _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            line = this.s.lines[li]
            height = this.lineHeight(li)
            width = null
            if (_k_.isArr(line))
            {
                width = this.lineWidths.get(line)
            }
            if (!(width != null))
            {
                width = kseg.width(line)
                if (_k_.isArr(line))
                {
                    this.lineWidths.set(line,width)
                }
            }
            width = width * height
            if (width > maxWidth)
            {
                maxWidth = width
            }
            rows.push(rows[li] + height)
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
        var conf, _383_26_

        conf = (config.data != null ? config.data.cursor : undefined)
        if (!!_k_.empty(conf))
        {
            return fallback
        }
        return this.marginValue((conf[name]),fallback)
    }

    state.prototype["posForCell"] = function (x, row)
    {
        var h, li, _390_19_

        if ((this.rectree != null))
        {
            return this.sheetPosForCell([x + this.s.view[0],this.lineAtRow(row)])
        }
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

    state.prototype["currentFile"] = function ()
    {
        var session

        session = global.ked_session
        if (!(session != null ? session.get : undefined))
        {
            return
        }
        return session.get('editor▸file')
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
        this.restoreSheet()
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
        this.restoreSheet()
        return this.emit('colors.changed')
    }

    state.prototype["begin"] = function ()
    {
        var _438_22_

        this.beginIndices = ((_438_22_=this.beginIndices) != null ? _438_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _444_24_

        if ((this.beginIndices != null ? this.beginIndices.length : undefined))
        {
            index = this.beginIndices.pop()
            this.h.splice(index,this.h.length - index - 1)
            if (this.beginIndices.length)
            {
                this.beginIndex = this.beginIndices.slice(-1)[0]
            }
            else
            {
                delete this.beginIndex
            }
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
        var _463_54_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTtPQUFnRixXQUFoRjtPQUFxRixZQUFyRjs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEO09BQXlELGVBQXpEOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQU87YUFPSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxPQUFPLE9BQU87UUFFZixLQUFDLFFBQVEsTUFBTTtRQUVmLEtBQUM7b0JBRVcsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQU0sTUFBTTs7O1lBQW5GO2lCQUNJLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsS0FBRSxLQUFLLEVBQUUsS0FBSzs7O1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsV0FBWTtRQUViLEtBQUMsYUFBZ0IsT0FBTyxLQUFDLE9BQU87UUFFaEMsS0FBQyxVQUFhO1FBQ2QsS0FBQyxVQUFhLEdBQUcsRUFBRSxHQUFHO1FBQ3RCLEtBQUMsY0FBYyxLQUFLLFdBQVc7UUFFL0IsS0FBQyxXQUFpQjtRQUNsQixLQUFDLGNBQWlCO1FBQ2xCLEtBQUMs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
