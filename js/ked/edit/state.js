var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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

import belt from "./tool/belt.js"
import colorspans from "./tool/colorspans.js"
import jumplist from "./tool/jumplist.js"
import changelist from "./tool/changelist.js"
import motion from "./tool/motion.js"
import sue from "./tool/sue.js"
import register from "./tool/register.js"

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
        this["clearSueAtCursorOrSelection"] = this["clearSueAtCursorOrSelection"].bind(this)
        this["scaleRunsForLine"] = this["scaleRunsForLine"].bind(this)
        this["clearScales"] = this["clearScales"].bind(this)
        this["stepScales"] = this["stepScales"].bind(this)
        this["toggleSueFlag"] = this["toggleSueFlag"].bind(this)
        this["clearSueForRanges"] = this["clearSueForRanges"].bind(this)
        this["applySueAreas"] = this["applySueAreas"].bind(this)
        this["loadSue"] = this["loadSue"].bind(this)
        this["changeSue"] = this["changeSue"].bind(this)
        this["setSue"] = this["setSue"].bind(this)
        this["sueAt"] = this["sueAt"].bind(this)
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
        var list = [del,insert,select,join,indent,multi,main,novim,sort,count,range,macro]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            act = list[_a_]
            for (k in act)
            {
                v = act[k]
                this[k] = v.bind(this)
            }
        }
        this.keyHandler = keys.bind(this)
        this.handleKey = this.handleKeyWithRecording
        this.syntax = new syntax(this.name + '.syntax')
        this.hasFocus = false
        this.scales = {h1:3,h2:2}
        this.scaledExts = ['md','markdown','kode']
        this.scaling = true
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

    state.prototype["sueAt"] = function (pos)
    {
        var area, areas, i, x, y, _84_23_

        areas = ((_84_23_=this.s.sue) != null ? _84_23_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        for (var _b_ = i = areas.length - 1, _c_ = 0; (_b_ <= _c_ ? i <= 0 : i >= 0); (_b_ <= _c_ ? ++i : --i))
        {
            area = areas[i]
            if (area.y === y && area.x <= x)
            {
                return area
            }
        }
    }

    state.prototype["setSue"] = function (x, y, value)
    {
        var areas, _96_23_

        areas = ((_96_23_=this.s.sue) != null ? _96_23_ : [])
        return this.changeSue(areas.concat([{x:x,y:y,value:value}]))
    }

    state.prototype["changeSue"] = function (areas)
    {
        this.s = this.s.set('sue',areas)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["loadSue"] = function (areas)
    {
        this.s = this.s.set('sue',((areas != null ? areas : [])))
        this.rowCache = null
        this.clearHistory()
        return this.emit('sue.changed')
    }

    state.prototype["applySueAreas"] = function (next)
    {
        var areas, _116_23_

        areas = ((_116_23_=this.s.sue) != null ? _116_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    }

    state.prototype["clearSueForRanges"] = function (ranges)
    {
        var areas, cut, _123_23_

        areas = ((_123_23_=this.s.sue) != null ? _123_23_ : [])
        if (_k_.empty(areas) || _k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        cut = sue.rangesCutFromAreasInLines(ranges,areas,this.s.lines)
        if (_k_.eql(cut, areas))
        {
            return
        }
        return this.changeSue(cut)
    }

    state.prototype["toggleSueFlag"] = function (flag)
    {
        var next, ranges, _141_56_

        ranges = this.selectionsOrCursorWordRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        next = sue.rangesWithToggledFlag(ranges,(((_141_56_=this.s.sue) != null ? _141_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    }

    state.prototype["stepScales"] = function (delta)
    {
        var areas, indices, lines, next, piece, runs, _149_23_

        areas = ((_149_23_=this.s.sue) != null ? _149_23_ : [])
        next = areas
        if (_k_.empty(this.s.selections))
        {
            indices = belt.lineIndicesForPositions(this.s.cursors)
            next = sue.areasWithSteppedLineScales(areas,indices,delta,this.lineHeight)
        }
        else
        {
            lines = []
            runs = []
            var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                piece = list[_a_]
                if (belt.isFullLineRange(this.s.lines,piece))
                {
                    if (!(_k_.in(piece[1],lines)))
                    {
                        lines.push(piece[1])
                    }
                }
                else
                {
                    runs.push(piece)
                }
            }
            next = sue.areasWithSteppedLineScales(next,lines,delta,this.lineHeight)
            next = sue.areasWithSteppedRunsInLines(next,runs,delta,this.s.lines)
        }
        return this.applySueAreas(next)
    }

    state.prototype["clearScales"] = function ()
    {
        var areas, indices, next, piece, run, _172_23_

        areas = ((_172_23_=this.s.sue) != null ? _172_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = sue.areasWithoutLineScales(areas,indices)
        var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            piece = list[_a_]
            if (belt.isFullLineRange(this.s.lines,piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                run = list1[_b_]
                if (run[0] <= piece[0] && piece[2] <= run[1])
                {
                    next = sue.areasWithoutRun(next,piece[1],run[0],run[1])
                    break
                }
            }
        }
        return this.applySueAreas(next)
    }

    state.prototype["scaleRunsForLine"] = function (y)
    {
        var areas, _188_23_

        areas = ((_188_23_=this.s.sue) != null ? _188_23_ : [])
        if (_k_.empty(areas))
        {
            return []
        }
        return sue.runsForLine(areas,this.s.lines,y)
    }

    state.prototype["clearSueAtCursorOrSelection"] = function ()
    {
        var ranges

        if (ranges = this.selectionsOrCursorWordRanges())
        {
            return this.clearSueForRanges(ranges)
        }
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _203_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_203_15_=opt.mc) != null ? _203_15_ : this.mainCursor())
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
        var segl, _327_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_327_15_=this.segls) != null ? _327_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _336_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_336_15_=this.segls) != null ? _336_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _358_55_, _359_55_

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
                fgSpans = colorspans.adjust((((_358_55_=colors.fg) != null ? _358_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_359_55_=colors.bg) != null ? _359_55_ : [])),oldLines,this.s.lines)
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
        var area, _385_28_, _387_46_

        var list = _k_.list((((_385_28_=this.s.sue) != null ? _385_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_387_46_=area.value[3]) != null ? _387_46_ : 1)))
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
        var height, li, line, maxWidth, rows, width, _397_20_

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        this.lineWidths = ((_397_20_=this.lineWidths) != null ? _397_20_ : new WeakMap())
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
        var conf, _503_26_

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

    state.prototype["windowLine"] = function (kind, count = 1)
    {
        var bottom, n, rows, top

        rows = _k_.max(1,this.cells.rows)
        top = this.lineAtRow(0)
        bottom = this.lineAtRow(rows - 1)
        n = _k_.max(1,((count != null ? count : 1)))
        switch (kind)
        {
            case 'windowTop':
                return _k_.clamp(top,bottom,(top + n - 1))

            case 'windowBottom':
                return _k_.clamp(top,bottom,(bottom - n + 1))

            default:
                return this.lineAtRow(parseInt((rows - 1) / 2))
        }

    }

    state.prototype["moveCursorsToWindowLine"] = function (kind, count = 1)
    {
        var c, cursors, line, x

        line = this.windowLine(kind,count)
        x = belt.lineIndentAtPos(this.s.lines,[0,line])
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c[0] = x
            c[1] = line
        }
        return this.setCursors(cursors,{main:this.s.main})
    }

    state.prototype["windowMotionRange"] = function (cursor, spec)
    {
        var line, y1, y2, _551_49_

        line = this.windowLine(spec.kind,(((_551_49_=spec.count) != null ? _551_49_ : 1)))
        y1 = _k_.min(cursor[1],line)
        y2 = _k_.max(cursor[1],line)
        return [0,y1,kseg.width(this.s.lines[y2]),y2]
    }

    state.prototype["rangeForMotion"] = function (cursor, spec)
    {
        if (_k_.in(spec.kind,['windowTop','windowMiddle','windowBottom']))
        {
            return this.windowMotionRange(cursor,spec)
        }
        return motion.range(this.s.lines,cursor,spec)
    }

    state.prototype["jumpChangeOlder"] = function (count = 1)
    {
        var i, moved, n, pos

        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            pos = this.novim.changes.older()
            if (!pos)
            {
                break
            }
            this.setMainCursor(pos[0],pos[1])
            moved = true
        }
        return moved
    }

    state.prototype["jumpChangeNewer"] = function (count = 1)
    {
        var i, moved, n, pos

        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            pos = this.novim.changes.newer()
            if (!pos)
            {
                break
            }
            this.setMainCursor(pos[0],pos[1])
            moved = true
        }
        return moved
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

    state.prototype["jumpEntry"] = function (pos)
    {
        pos = (pos != null ? pos : this.mainCursor())
        return {file:this.currentFile(),x:pos[0],y:pos[1]}
    }

    state.prototype["pushJump"] = function (pos)
    {
        if (this.novim.jumps.keep)
        {
            return false
        }
        this.novim.jumps.record(this.jumpEntry(pos))
        return true
    }

    state.prototype["jumpOlder"] = function (count = 1)
    {
        var entry, i, moved, n

        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            entry = this.novim.jumps.older(this.jumpEntry())
            if (!entry)
            {
                break
            }
            this.jumpToEntry(entry)
            moved = true
        }
        return moved
    }

    state.prototype["jumpNewer"] = function (count = 1)
    {
        var entry, i, moved, n

        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            entry = this.novim.jumps.newer()
            if (!entry)
            {
                break
            }
            this.jumpToEntry(entry)
            moved = true
        }
        return moved
    }

    state.prototype["jumpToEntry"] = function (entry)
    {
        var file

        file = this.currentFile()
        if (!_k_.empty(entry.file) && entry.file !== file)
        {
            post.emit('file.open',entry.file,entry.x,entry.y)
        }
        else
        {
            this.setMainCursor(entry.x,entry.y)
        }
        return true
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
        var _680_22_

        this.beginIndices = ((_680_22_=this.beginIndices) != null ? _680_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _686_24_

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
        var _705_54_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEO09BQXlELGVBQXpEOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQU87YUFPSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sT0FBTztRQUVmLEtBQUMsUUFBUSxNQUFNO1FBRWYsS0FBQztvQkFFVyxJQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQU07OztZQUF4RTtpQkFDSSxLQUFPOztnQkFBTCxJQUFLO2dCQUNQLEtBQUUsS0FBSyxFQUFFLEtBQUs7OztRQUV0QixLQUFDLGFBQWEsS0FBSyxLQUFLO1FBQ3hCLEtBQUMsWUFBYSxLQUFDO1FBRWYsS0FBQyxhQUFlLE9BQU8sS0FBQyxPQUFPO1FBQy9CLEtBQUMsV0FBVztRQUdaLEtBQUMsVUFBYyxHQUFHLEVBQUUsR0FBRztRQUN2QixLQUFDLGNBQWMsS0FBSyxXQUFXO1FBQy9CLEtBQUMsVUFBYTtRQUVkLEtBQUMsV0FBaUI7UUFDbEIsS0FBQyxjQUFpQjtRQUNs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
