var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
import scaling from "../util/scaling.js"

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

import register from "./register.js"

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
        this["sueAt"] = this["sueAt"].bind(this)
        this["loadSue"] = this["loadSue"].bind(this)
        this["clearSueAtCursorOrSelection"] = this["clearSueAtCursorOrSelection"].bind(this)
        this["clearLineScale"] = this["clearLineScale"].bind(this)
        this["clearLineScales"] = this["clearLineScales"].bind(this)
        this["stepLineScales"] = this["stepLineScales"].bind(this)
        this["setLineScale"] = this["setLineScale"].bind(this)
        this["toggleSueFlag"] = this["toggleSueFlag"].bind(this)
        this["addSueForRanges"] = this["addSueForRanges"].bind(this)
        this["decorationRanges"] = this["decorationRanges"].bind(this)
        this["clearSueForRanges"] = this["clearSueForRanges"].bind(this)
        this["setSueForRanges"] = this["setSueForRanges"].bind(this)
        this["setSue"] = this["setSue"].bind(this)
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
        this.registers = new register
        this.novimRegister = null
        this.allowedModes = {}
        this.colorMethod = 'sue'
        this.macroRecording = null
        this.macroReplaying = 0
        this.macroSkipKey = false
        this.macroLastRegister = null
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
        this.yankFlash = null
        this.yankFlashTimer = null
        this.rowCache = null
        this.rowCacheExt = null
        this.maxWidthCache = 0
        this.gutterWidthOverride = null
        this.jumps = new jumplist
        this.changes = new changelist
        this.keepJumps = 0
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
        var bgSpans, colors, fgSpans, next, _110_22_, _93_28_, _94_28_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_93_28_=colors.fg) != null ? _93_28_ : [])
        bgSpans = ((_94_28_=colors.bg) != null ? _94_28_ : [])
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
        var bgSpans, colors, fgSpans, next, _122_46_, _123_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_122_46_=colors.fg) != null ? _122_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_123_46_=colors.bg) != null ? _123_46_ : [])),ranges)
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
        var ranges

        ranges = this.decorationRanges()
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

    state.prototype["setSue"] = function (x, y, value)
    {
        var areas, _152_23_

        areas = ((_152_23_=this.s.sue) != null ? _152_23_ : [])
        this.s = this.s.set('sue',areas.concat([{x:x,y:y,value:value}]))
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["setSueForRanges"] = function (ranges, value)
    {
        var add, areas, rng, _164_23_

        if (_k_.empty(ranges))
        {
            return
        }
        areas = ((_164_23_=this.s.sue) != null ? _164_23_ : [])
        add = []
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            add.push({x:rng[0],y:rng[1],value:value})
        }
        this.s = this.s.set('sue',areas.concat(add))
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["clearSueForRanges"] = function (ranges)
    {
        var areas, cut, _178_23_

        areas = ((_178_23_=this.s.sue) != null ? _178_23_ : [])
        if (_k_.empty(areas) || _k_.empty(ranges))
        {
            return
        }
        cut = sue.rangesCutFromAreasInLines(ranges,areas,this.s.lines)
        if (_k_.eql(cut, areas))
        {
            return
        }
        this.s = this.s.set('sue',cut)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["decorationRanges"] = function ()
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
        return ranges
    }

    state.prototype["addSueForRanges"] = function (ranges, code, values)
    {
        var h, rng, w

        if (_k_.empty(ranges))
        {
            return
        }
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            w = _k_.max(1,(rng[2] - rng[0]))
            h = rng[3] - rng[1] + 1
            this.setSue(rng[0],rng[1],[code,values.concat([w,h])])
        }
    }

    state.prototype["toggleSueFlag"] = function (flag)
    {
        var next, ranges, _215_56_

        ranges = this.decorationRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        next = sue.rangesWithToggledFlag(ranges,(((_215_56_=this.s.sue) != null ? _215_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        this.s = this.s.set('sue',next)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["setLineScale"] = function (y, scale)
    {
        var area, areas, _229_28_

        areas = []
        var list = _k_.list((((_229_28_=this.s.sue) != null ? _229_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.value[0] === sue.LINE_SCALE)
            {
                continue
            }
            areas.push(area)
        }
        if (scale > 1)
        {
            areas.push({x:0,y:y,value:[sue.LINE_SCALE,[scale]]})
        }
        this.s = this.s.set('sue',areas)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["stepLineScales"] = function (indices, delta)
    {
        var area, areas, i, keep, scales, y, _245_24_

        if (_k_.empty(indices))
        {
            return
        }
        areas = ((_245_24_=this.s.sue) != null ? _245_24_ : [])
        scales = []
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_]
            scales.push(_k_.clamp(1,7,(this.lineHeight(y) + delta)))
        }
        keep = []
        var list1 = _k_.list(areas)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            area = list1[_b_]
            if (_k_.in(area.y,indices) && area.value[0] === sue.LINE_SCALE)
            {
                continue
            }
            keep.push(area)
        }
        var list2 = _k_.list(indices)
        for (i = 0; i < list2.length; i++)
        {
            y = list2[i]
            if (scales[i] > 1)
            {
                keep.push({x:0,y:y,value:[sue.LINE_SCALE,[scales[i]]]})
            }
        }
        if (_k_.eql(keep, areas))
        {
            return
        }
        this.s = this.s.set('sue',keep)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["clearLineScales"] = function (indices)
    {
        var area, areas, keep, _272_23_

        if (_k_.empty(indices))
        {
            return
        }
        areas = ((_272_23_=this.s.sue) != null ? _272_23_ : [])
        keep = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (_k_.in(area.y,indices) && area.value[0] === sue.LINE_SCALE)
            {
                continue
            }
            keep.push(area)
        }
        if (keep.length === areas.length)
        {
            return
        }
        this.s = this.s.set('sue',keep)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["clearLineScale"] = function (y)
    {
        var area, areas, keep, _289_23_

        areas = ((_289_23_=this.s.sue) != null ? _289_23_ : [])
        keep = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.value[0] === sue.LINE_SCALE)
            {
                continue
            }
            keep.push(area)
        }
        if (keep.length === areas.length)
        {
            return
        }
        this.s = this.s.set('sue',keep)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["clearSueAtCursorOrSelection"] = function ()
    {
        var ranges

        ranges = this.decorationRanges()
        if (!_k_.empty(ranges))
        {
            return this.clearSueForRanges(ranges)
        }
    }

    state.prototype["loadSue"] = function (areas)
    {
        this.s = this.s.set('sue',((areas != null ? areas : [])))
        this.rowCache = null
        this.clearHistory()
        return this.emit('sue.changed')
    }

    state.prototype["sueAt"] = function (pos)
    {
        var area, areas, i, x, y, _318_23_

        areas = ((_318_23_=this.s.sue) != null ? _318_23_ : [])
        if (_k_.empty(areas))
        {
            return null
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
        return null
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, changed, fgSpans, next, _336_32_, _337_32_, _343_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_336_32_=colors.fg) != null ? _336_32_ : [])
            bgSpans = ((_337_32_=colors.bg) != null ? _337_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        changed = !((this.s.colors != null) && _k_.eql(this.s.colors, next))
        this.s = this.s.set('colors',next)
        this.clearHistory()
        if (changed)
        {
            return this.emit('colors.changed')
        }
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _355_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_355_15_=opt.mc) != null ? _355_15_ : this.mainCursor())
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
        this.lastVisual = null
        this.novimInsert = null
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        this.yankFlash = null
        this.yankFlashTimer = null
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],scrollOffset:0,colors:{fg:[],bg:[]},sue:[]})
        this.syntax.clear()
        this.rowCache = null
        this.h = []
        this.r = []
        this.changes.reset()
        this.beginIndices = []
        return delete this.beginIndex
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _478_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_478_15_=this.segls) != null ? _478_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _487_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_487_15_=this.segls) != null ? _487_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _509_55_, _510_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        this.rowCache = null
        if (oldLines !== this.s.lines)
        {
            if (this.h.length)
            {
                this.changes.record(this.mainCursor())
            }
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_509_55_=colors.fg) != null ? _509_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_510_55_=colors.bg) != null ? _510_55_ : [])),oldLines,this.s.lines)
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
        var area, _536_28_, _538_49_

        var list = _k_.list((((_536_28_=this.s.sue) != null ? _536_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_538_49_=area.value[1][0]) != null ? _538_49_ : 1)))
            }
        }
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
        var conf, _636_26_

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
        var line, y1, y2, _684_49_

        line = this.windowLine(spec.kind,(((_684_49_=spec.count) != null ? _684_49_ : 1)))
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
            pos = this.changes.older()
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
            pos = this.changes.newer()
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
            return null
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
        if (this.keepJumps)
        {
            return false
        }
        this.jumps.record(this.jumpEntry(pos))
        return true
    }

    state.prototype["jumpOlder"] = function (count = 1)
    {
        var entry, i, moved, n

        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            entry = this.jumps.older(this.jumpEntry())
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
            entry = this.jumps.newer()
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
        var _811_22_

        this.beginIndices = ((_811_22_=this.beginIndices) != null ? _811_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _817_24_

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
        var _837_54_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjtPQUF1QixjQUF2Qjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEOztPQUNBLGVBQUE7O09BQ1UsV0FBQTtPQUFLLFdBQUE7OztBQUVwQixTQUFEOztzQkFBTzthQU9ILE9BQUksT0FBTTs7UUFBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQyxnQkFBcUI7UUFDdEIsS0FBQyxnQkFBaUI7UUFDbEIsS0FBQztRQUVELEtBQUMsY0FBYztRQUVmLEtBQUMsaUJBQW9CO1FBQ3JCLEtBQUMsaUJBQW9CO1FBQ3JCLEtBQUMsZUFBb0I7UUFDckIsS0FBQyxvQkFBb0I7b0JBRVQsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssTUFBTSxNQUFNOzs7WUFBeEU7aUJBQ0ksS0FBTzs7Z0JBQUwsSUFBSztnQkFDUCxLQUFFLEtBQUssRUFBRSxLQUFLOzs7UUFFdEIsS0FBQyxhQUFhLEtBQUssS0FBSztRQUN4QixLQUFDLFlBQWEsS0FBQztRQUVmLEtBQUMsYUFBZSxPQUFPLEtBQUMsT0FBTztRQUMvQixL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
