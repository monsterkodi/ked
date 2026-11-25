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

import suact from './act/sue.js'

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
        var list = [del,insert,select,join,indent,multi,main,jump,novim,sort,count,range,macro,sheet,suact]
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
        this.wrap = {all:false,word:true}
        this.rowCache = null
        this.rowCacheExt = null
        this.maxWidthCache = 0
        this.gutterWidthOverride = null
        this.clearSingle()
        return state.__super__.constructor.apply(this, arguments)
    }

    state.prototype["toggleMode"] = function (name)
    {
        var _51_58_

        if ((this.sheetPage != null) && name === 'novim')
        {
            return this.sheetPage.novimFromNode('toggle')
        }
        if (this.allowedModes[name])
        {
            return mode.toggle(this,name)
        }
    }

    state.prototype["startMode"] = function (name)
    {
        var _55_57_

        if ((this.sheetPage != null) && name === 'novim')
        {
            return this.sheetPage.novimFromNode('start')
        }
        if (this.allowedModes[name])
        {
            return mode.start(this,name)
        }
    }

    state.prototype["stopMode"] = function (name)
    {
        var _59_56_

        if ((this.sheetPage != null) && name === 'novim')
        {
            return this.sheetPage.novimFromNode('stop')
        }
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
        var colors, _90_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        return colorspans.colorAtPos((((_90_45_=colors[layer]) != null ? _90_45_ : [])),pos)
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _133_38_, _97_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_97_15_=opt.mc) != null ? _97_15_ : this.mainCursor())
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
        cursors = this.clampToWrap(cursors)
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
        if ((this.rectree != null))
        {
            this.sheetCursorsSet()
        }
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
        var segl, _223_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_223_15_=this.segls) != null ? _223_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _232_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_232_15_=this.segls) != null ? _232_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _254_55_, _255_55_

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
                fgSpans = colorspans.adjust((((_254_55_=colors.fg) != null ? _254_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_255_55_=colors.bg) != null ? _255_55_ : [])),oldLines,this.s.lines)
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
        var area, _281_28_, _283_46_

        var list = _k_.list((((_281_28_=this.s.sue) != null ? _281_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_283_46_=area.value[3]) != null ? _283_46_ : 1)))
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

    state.prototype["rowPrefix"] = function ()
    {
        var height, li, line, maxWidth, rows, width, _299_20_

        if (this.rowCache && this.rowCacheExt === this.syntax.ext && this.rowCacheCols === this.cells.cols)
        {
            return this.rowCache
        }
        this.lineWidths = ((_299_20_=this.lineWidths) != null ? _299_20_ : new WeakMap())
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
        var conf, _414_26_

        conf = (config.data != null ? config.data.cursor : undefined)
        if (!!_k_.empty(conf))
        {
            return fallback
        }
        return this.marginValue(conf[name],fallback)
    }

    state.prototype["posForCell"] = function (x, row)
    {
        var k, li, scale, _421_19_

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
        k = parseInt((this.viewTopRow() + row - this.rowsBeforeLine(li)) / scale)
        k = _k_.clamp(0,this.wrapStarts(li).length - 1,k)
        return [this.posInRow(li,k,parseInt(x / scale)),li]
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
        var _474_22_

        this.beginIndices = ((_474_22_=this.beginIndices) != null ? _474_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _480_24_

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
        var _499_54_

        if ((this.gutterWidthOverride != null))
        {
            return this.gutterWidthOverride
        }
        return _k_.max(4,2 + Math.ceil(Math.log10(this.s.lines.length + 1)))
    }

    state.prototype["cut"] = function (opt)
    {
        var _508_54_

        opt = (opt != null ? opt : {})
        if ((this.rectree != null))
        {
            return this.inSheetNode(function (st)
            {
                return st.cut(opt)
            })
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
        var _520_55_

        opt = (opt != null ? opt : {})
        if ((this.rectree != null))
        {
            return this.inSheetNode(function (st)
            {
                return st.copy(opt)
            })
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTtPQUFnRixXQUFoRjtPQUFxRixZQUFyRjs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEO09BQXlELGVBQXpEOztPQUNVLFdBQUE7T0FBSyxXQUFBOztPQUVkLE1BQU0sS0FBSzs7QUFFakIsU0FBRDs7c0JBQU87YUFPSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQyxRQUFRLE1BQU07UUFFZixLQUFDO29CQUVXLElBQUksT0FBTyxPQUFPLEtBQUssT0FBTyxNQUFNLEtBQUssS0FBSyxNQUFNLEtBQUssTUFBTSxNQUFNLE1BQU0sTUFBTTs7O1lBQXpGO2lCQUNJLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsS0FBRSxLQUFLLEVBQUUsS0FBSzs7O1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsV0FBWTtRQUViLEtBQUMsYUFBZ0IsT0FBTyxLQUFDLE9BQU87UUFFaEMsS0FBQyxVQUFhO1FBQ2QsS0FBQyxVQUFhLEdBQUcsRUFBRSxHQUFHO1FBQ3RCLEtBQUMsY0FBYyxLQUFLLFdBQVc7UUFFL0IsS0FBQyxRQUFPLElBQUksTUFB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
//# sourceURL=../../../kode/ked/edit/state.kode
