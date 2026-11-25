var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this["setWrap"] = this["setWrap"].bind(this)
        this["viewX"] = this["viewX"].bind(this)
        this["lineCell"] = this["lineCell"].bind(this)
        this["wrapRow"] = this["wrapRow"].bind(this)
        this["wrapIndent"] = this["wrapIndent"].bind(this)
        this["wrapStarts"] = this["wrapStarts"].bind(this)
        this["wrapCols"] = this["wrapCols"].bind(this)
        this["isWrapped"] = this["isWrapped"].bind(this)
        this["lineHeight"] = this["lineHeight"].bind(this)
        this["lineScale"] = this["lineScale"].bind(this)
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
        this.wrap = {all:false,word:false}
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
        var colors, _78_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        return colorspans.colorAtPos((((_78_45_=colors[layer]) != null ? _78_45_ : [])),pos)
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _85_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_85_15_=opt.mc) != null ? _85_15_ : this.mainCursor())
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
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],scrollOffset:0,colors:{fg:[],bg:[]},sue:[],rectree:null})
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

    state.prototype["lineScale"] = function (li)
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

    state.prototype["lineHeight"] = function (li)
    {
        if (!this.isWrapped(li))
        {
            return this.lineScale(li)
        }
        return this.lineScale(li) * this.wrapStarts(li).length
    }

    state.prototype["isWrapped"] = function (li)
    {
        if (!this.isValidLineIndex(li))
        {
            return false
        }
        return this.wrap.all || sue.isWrapLine(this.s.sue,li)
    }

    state.prototype["wrapCols"] = function (li)
    {
        return _k_.max(1,parseInt(this.cells.cols / this.lineScale(li)))
    }

    state.prototype["wrapStarts"] = function (li)
    {
        var cached, cols, key, line, starts, _296_19_

        if (!this.isWrapped(li))
        {
            return [0]
        }
        line = this.s.lines[li]
        cols = this.wrapCols(li)
        key = `${cols} ${this.wrap.word}`
        this.wrapCache = ((_296_19_=this.wrapCache) != null ? _296_19_ : new WeakMap())
        if (_k_.isArr(line))
        {
            cached = this.wrapCache.get(line)
            if ((cached != null ? cached.key : undefined) === key)
            {
                return cached.starts
            }
        }
        starts = sue.wrapStarts(line,cols,this.wrap.word,sue.wrapIndent(line,cols))
        if (_k_.isArr(line))
        {
            this.wrapCache.set(line,{key:key,starts:starts})
        }
        return starts
    }

    state.prototype["wrapIndent"] = function (li, k)
    {
        if (k === 0 || !this.isWrapped(li))
        {
            return 0
        }
        return sue.wrapIndent(this.s.lines[li],this.wrapCols(li))
    }

    state.prototype["wrapRow"] = function (x, li)
    {
        var k, starts

        starts = this.wrapStarts(li)
        k = starts.length - 1
        while (k > 0 && starts[k] > x)
        {
            k -= 1
        }
        return k
    }

    state.prototype["lineCell"] = function (x, li, cells)
    {
        var cx, k, lastIndex, scale

        cells = (cells != null ? cells : sue.cellPositionsForLine(this.s.lines,li,[]))
        scale = this.lineScale(li)
        lastIndex = cells.length - 1
        cx = (x <= lastIndex ? cells[x] : cells[lastIndex] + x - lastIndex)
        if (!this.isWrapped(li))
        {
            return [cx * scale,0]
        }
        k = this.wrapRow(x,li)
        cx = cx - cells[this.wrapStarts(li)[k]] + this.wrapIndent(li,k)
        cx = _k_.min(cx,this.wrapCols(li) - 1)
        return [cx * scale,k * scale]
    }

    state.prototype["viewX"] = function (li)
    {
        return (this.isWrapped(li) ? 0 : this.s.view[0])
    }

    state.prototype["setWrap"] = function (wrap)
    {
        this.wrap = Object.assign({},this.wrap,wrap)
        this.rowCache = null
        return this.adjustViewForMainCursor()
    }

    state.prototype["rowPrefix"] = function ()
    {
        var height, li, line, maxWidth, rows, width, _352_20_

        if (this.rowCache && this.rowCacheExt === this.syntax.ext && this.rowCacheCols === this.cells.cols)
        {
            return this.rowCache
        }
        this.lineWidths = ((_352_20_=this.lineWidths) != null ? _352_20_ : new WeakMap())
        rows = [0]
        maxWidth = 0
        for (li = 0; li < this.s.lines.length; li++)
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
            if (!this.isWrapped(li))
            {
                width = width * this.lineScale(li)
                if (width > maxWidth)
                {
                    maxWidth = width
                }
            }
            rows.push(rows[li] + height)
        }
        this.maxWidthCache = maxWidth
        this.rowCacheExt = this.syntax.ext
        this.rowCacheCols = this.cells.cols
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
        var li

        li = this.maxViewLine()
        if (li > 0 && this.isWrapped(li - 1))
        {
            return _k_.max(0,this.totalRows() - this.cells.rows)
        }
        return this.rowsBeforeLine(li)
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
        var conf, _467_26_

        conf = (config.data != null ? config.data.cursor : undefined)
        if (!!_k_.empty(conf))
        {
            return fallback
        }
        return this.marginValue(conf[name],fallback)
    }

    state.prototype["posForCell"] = function (x, row)
    {
        var cells, col, gi, k, li, scale, starts, stop, _474_19_

        if ((this.rectree != null))
        {
            return this.sheetPosForCell([x + this.s.view[0],this.lineAtRow(row)])
        }
        li = this.lineAtRow(row)
        scale = this.lineScale(li)
        if (!this.isWrapped(li))
        {
            return [parseInt((x + this.s.view[0]) / scale),li]
        }
        starts = this.wrapStarts(li)
        k = parseInt((this.viewTopRow() + row - this.rowsBeforeLine(li)) / scale)
        k = _k_.clamp(0,starts.length - 1,k)
        cells = sue.cellPositionsForLine(this.s.lines,li,[])
        col = _k_.max(0,parseInt(x / scale) - this.wrapIndent(li,k)) + cells[starts[k]]
        stop = this.s.lines[li].length
        if (k + 1 < starts.length)
        {
            stop = starts[k + 1] - 1
        }
        gi = starts[k]
        while (gi < stop && cells[gi + 1] <= col)
        {
            gi += 1
        }
        if (gi === this.s.lines[li].length)
        {
            gi += col - cells[gi]
        }
        return [gi,li]
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
        var _538_22_

        this.beginIndices = ((_538_22_=this.beginIndices) != null ? _538_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _544_24_

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
        var _563_54_

        if ((this.gutterWidthOverride != null))
        {
            return this.gutterWidthOverride
        }
        return _k_.max(4,2 + Math.ceil(Math.log10(this.s.lines.length + 1)))
    }

    state.prototype["cut"] = function (opt)
    {
        var text, _572_19_

        opt = (opt != null ? opt : {})
        if ((this.rectree != null))
        {
            if (text = this.sheetSelectedText())
            {
                clip.copy(text)
                this.delete('back')
            }
            return
        }
        this.copy({deselect:false})
        if (_k_.empty(this.s.selections))
        {
            this.selectCursorLines()
        }
        return this.deleteSelection()
    }

    state.prototype["copy"] = function (opt)
    {
        var text, _588_19_

        opt = (opt != null ? opt : {})
        if ((this.rectree != null))
        {
            if (text = this.sheetSelectedText())
            {
                clip.copy(text)
            }
            return
        }
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
        cursorScale = this.lineScale(cursor[1])
        cursorRight = cursor[0] * cursorScale + cursorScale
        if (this.isWrapped(cursor[1]))
        {
            cursorRight = 0
        }
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
        var blockTop, botDelta, botFallback, botMargin, current, delta, dir, dr, height, row, scale, scrollOffset, topDelta, topFallback, topMargin, topRow, view, visibleTop, x, y

        opt = (opt != null ? opt : {})
        if (this.cells.cols <= 0 || this.cells.rows <= 0)
        {
            return
        }
        if (opt.adjust === false)
        {
            return
        }
        ;[x,y] = this.mainCursor()
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
        blockTop = this.rowsBeforeLine(y)
        if (this.isWrapped(y))
        {
            dr = this.lineCell(x,y)[1]
            row += dr
            blockTop += dr
            height = this.lineScale(y)
        }
        if (opt.adjust === 'topDelta')
        {
            topRow = blockTop - topMargin
        }
        else if (opt.adjust === 'topBotDeltaGrow' && opt.mc)
        {
            if (row < 0)
            {
                topRow = blockTop - topMargin
            }
            else if (row + height > this.cells.rows)
            {
                topRow = blockTop - (this.cells.rows - botMargin - height)
            }
            else
            {
                dir = y - opt.mc[1]
                if (row < topMargin && dir < 0)
                {
                    topRow = blockTop - topMargin
                }
                else if (row + height > this.cells.rows - botMargin && dir > 0)
                {
                    topRow = blockTop - (this.cells.rows - botMargin - height)
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
                topRow = blockTop - (this.cells.rows - botDelta - height)
            }
            else if (row < topDelta)
            {
                topRow = blockTop - topDelta
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
        visibleTop = blockTop + height - this.cells.rows
        topRow = _k_.max(visibleTop,topRow)
        topRow = _k_.min(blockTop,topRow)
        topRow = _k_.clamp(0,this.maxTopRow(),topRow)
        view[1] = this.lineAtAbsoluteRow(topRow)
        scrollOffset = topRow - this.rowsBeforeLine(view[1])
        if (!this.skipAdjustViewForMainCursor)
        {
            if (this.isWrapped(y))
            {
                view[0] = 0
            }
            else
            {
                scale = this.lineScale(y)
                view[0] = _k_.max(0,x * scale + scale + 1 - this.cells.cols)
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTtPQUFnRixXQUFoRjtPQUFxRixZQUFyRjs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEO09BQXlELGVBQXpEOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQU87YUFPSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxPQUFPLE9BQU87UUFFZixLQUFDLFFBQVEsTUFBTTtRQUVmLEtBQUM7b0JBRVcsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQU0sTUFBTTs7O1lBQW5GO2lCQUNJLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsS0FBRSxLQUFLLEVBQUUsS0FBSzs7O1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsV0FBWTtRQUViLEtBQUMsYUFBZ0IsT0FBTyxLQUFDLE9BQU87UUFFaEMsS0FBQyxVQUFhO1FBQ2QsS0FBQyxVQUFhLEdBQUcsRUFBRSxHQUFHO1FBQ3RCLEtBQUMsY0FBYyxLQUFLLFdBQVc7UUFFL0IsS0FBQyxRQUFPLElBQUksTUFBTSxLQUFLO1FBRXZC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
//# sourceURL=../../../kode/ked/edit/state.kode
