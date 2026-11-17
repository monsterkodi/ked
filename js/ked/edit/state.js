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
        this["scaleRunsForLine"] = this["scaleRunsForLine"].bind(this)
        this["clearScales"] = this["clearScales"].bind(this)
        this["stepScales"] = this["stepScales"].bind(this)
        this["areasWithSteppedRuns"] = this["areasWithSteppedRuns"].bind(this)
        this["areasWithoutRun"] = this["areasWithoutRun"].bind(this)
        this["areasWithRunScale"] = this["areasWithRunScale"].bind(this)
        this["areasWithRun"] = this["areasWithRun"].bind(this)
        this["isFullLinePiece"] = this["isFullLinePiece"].bind(this)
        this["selectionPieces"] = this["selectionPieces"].bind(this)
        this["applySueAreas"] = this["applySueAreas"].bind(this)
        this["areasWithoutLineScales"] = this["areasWithoutLineScales"].bind(this)
        this["areasWithSteppedLineScales"] = this["areasWithSteppedLineScales"].bind(this)
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
        var pos, ranges, rng

        if (!_k_.empty(this.s.selections))
        {
            return this.s.selections
        }
        ranges = []
        var list = _k_.list(this.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (rng = belt.rangeOfClosestWordToPos(this.s.lines,pos))
            {
                ranges.push(rng)
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
            this.setSue(rng[0],rng[1],[code,w,h].concat(values))
        }
    }

    state.prototype["toggleSueFlag"] = function (flag)
    {
        var next, ranges, _222_56_

        ranges = this.decorationRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        next = sue.rangesWithToggledFlag(ranges,(((_222_56_=this.s.sue) != null ? _222_56_ : [])),this.s.lines,flag)
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
        var area, areas, _236_28_

        areas = []
        var list = _k_.list((((_236_28_=this.s.sue) != null ? _236_28_ : [])))
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
            areas.push({x:0,y:y,value:[sue.LINE_SCALE,-1,1,scale]})
        }
        this.s = this.s.set('sue',areas)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["stepLineScales"] = function (indices, delta)
    {
        var _252_58_

        if (_k_.empty(indices))
        {
            return
        }
        return this.applySueAreas(this.areasWithSteppedLineScales(((_252_58_=this.s.sue) != null ? _252_58_ : []),indices,delta))
    }

    state.prototype["clearLineScales"] = function (indices)
    {
        var _258_54_

        if (_k_.empty(indices))
        {
            return
        }
        return this.applySueAreas(this.areasWithoutLineScales(((_258_54_=this.s.sue) != null ? _258_54_ : []),indices))
    }

    state.prototype["areasWithSteppedLineScales"] = function (areas, indices, delta)
    {
        var i, keep, scales, y

        if (_k_.empty(indices))
        {
            return areas
        }
        scales = []
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_]
            scales.push(_k_.clamp(1,7,(this.lineHeight(y) + delta)))
        }
        keep = this.areasWithoutLineScales(areas,indices)
        var list1 = _k_.list(indices)
        for (i = 0; i < list1.length; i++)
        {
            y = list1[i]
            if (scales[i] > 1)
            {
                keep.push({x:0,y:y,value:[sue.LINE_SCALE,-1,1,scales[i]]})
            }
        }
        return keep
    }

    state.prototype["areasWithoutLineScales"] = function (areas, indices)
    {
        var area, keep

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
        return keep
    }

    state.prototype["applySueAreas"] = function (next)
    {
        var areas, _288_23_

        areas = ((_288_23_=this.s.sue) != null ? _288_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        this.s = this.s.set('sue',next)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    }

    state.prototype["selectionPieces"] = function ()
    {
        var pieces, rng, rngs

        pieces = []
        var list = _k_.list(this.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            rngs = [rng]
            pieces = pieces.concat(belt.splitLineRanges(this.s.lines,rngs,false))
        }
        return pieces
    }

    state.prototype["isFullLinePiece"] = function (piece)
    {
        var x1, x2, y, _315_44_, _315_72_

        var _a_ = piece; x1 = _a_[0]; y = _a_[1]; x2 = _a_[2]

        return x1 === 0 && (kseg.width(((_315_44_=this.s.lines[y]) != null ? _315_44_ : [])) <= x2 || (((_315_72_=this.s.lines[y]) != null ? _315_72_ : [])).length <= x2)
    }

    state.prototype["areasWithRun"] = function (areas, y, x1, x2, scale)
    {
        var close, open

        open = {x:x1,y:y,value:[sue.SCALE,-1,1,scale]}
        close = {x:x2,y:y,value:[sue.CLOSE,-1,1,sue.SCALE]}
        return areas.concat([open,close])
    }

    state.prototype["areasWithRunScale"] = function (areas, y, x1, scale)
    {
        var area, out

        out = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.x === x1 && area.value[0] === sue.SCALE)
            {
                out.push({x:area.x,y:area.y,value:[sue.SCALE,-1,1,scale]})
            }
            else
            {
                out.push(area)
            }
        }
        return out
    }

    state.prototype["areasWithoutRun"] = function (areas, y, x1, x2)
    {
        var area, data, out

        out = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === y && area.x === x1 && area.value[0] === sue.SCALE)
            {
                continue
            }
            if (area.y === y && area.x === x2 && area.value[0] === sue.CLOSE)
            {
                data = sue.dataOf(area.value)
                if (_k_.empty(data) || data[0] === sue.SCALE)
                {
                    continue
                }
            }
            out.push(area)
        }
        return out
    }

    state.prototype["areasWithSteppedRuns"] = function (areas, pieces, delta)
    {
        var piece, r, run, scale, x1, x2, y

        var list = _k_.list(pieces)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            piece = list[_a_]
            var _b_ = piece; x1 = _b_[0]; y = _b_[1]; x2 = _b_[2]

            if (x1 >= x2)
            {
                continue
            }
            run = null
            var list1 = _k_.list(sue.runsForLine(areas,this.s.lines,y))
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                r = list1[_c_]
                if (r[0] <= x1 && x2 <= r[1])
                {
                    run = r
                    break
                }
            }
            if ((run != null))
            {
                scale = _k_.clamp(1,7,(run[2] + delta))
                if (scale <= 1)
                {
                    areas = this.areasWithoutRun(areas,y,run[0],run[1])
                }
                else
                {
                    areas = this.areasWithRunScale(areas,y,run[0],scale)
                }
            }
            else if (delta > 0)
            {
                scale = _k_.clamp(1,7,(1 + delta))
                if (scale > 1)
                {
                    areas = this.areasWithRun(areas,y,x1,x2,scale)
                }
            }
        }
        return areas
    }

    state.prototype["stepScales"] = function (delta)
    {
        var areas, indices, lines, next, piece, runs, _382_23_

        areas = ((_382_23_=this.s.sue) != null ? _382_23_ : [])
        next = areas
        if (_k_.empty(this.s.selections))
        {
            indices = belt.lineIndicesForPositions(this.s.cursors)
            next = this.areasWithSteppedLineScales(areas,indices,delta)
        }
        else
        {
            lines = []
            runs = []
            var list = _k_.list(this.selectionPieces())
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                piece = list[_a_]
                if (this.isFullLinePiece(piece))
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
            next = this.areasWithSteppedLineScales(next,lines,delta)
            next = this.areasWithSteppedRuns(next,runs,delta)
        }
        return this.applySueAreas(next)
    }

    state.prototype["clearScales"] = function ()
    {
        var areas, indices, next, piece, run, _405_23_

        areas = ((_405_23_=this.s.sue) != null ? _405_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = this.areasWithoutLineScales(areas,indices)
        var list = _k_.list(this.selectionPieces())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            piece = list[_a_]
            if (this.isFullLinePiece(piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                run = list1[_b_]
                if (run[0] <= piece[0] && piece[2] <= run[1])
                {
                    next = this.areasWithoutRun(next,piece[1],run[0],run[1])
                    break
                }
            }
        }
        return this.applySueAreas(next)
    }

    state.prototype["scaleRunsForLine"] = function (y)
    {
        var areas, _421_23_

        areas = ((_421_23_=this.s.sue) != null ? _421_23_ : [])
        if (_k_.empty(areas))
        {
            return []
        }
        return sue.runsForLine(areas,this.s.lines,y)
    }

    state.prototype["clearLineScale"] = function (y)
    {
        var area, areas, keep, _428_23_

        areas = ((_428_23_=this.s.sue) != null ? _428_23_ : [])
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
        var area, areas, i, x, y, _457_23_

        areas = ((_457_23_=this.s.sue) != null ? _457_23_ : [])
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
        var bgSpans, changed, fgSpans, next, _475_32_, _476_32_, _482_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_475_32_=colors.fg) != null ? _475_32_ : [])
            bgSpans = ((_476_32_=colors.bg) != null ? _476_32_ : [])
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
        var cur, idx, main, mainCursor, _494_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_494_15_=opt.mc) != null ? _494_15_ : this.mainCursor())
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
        var segl, _617_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_617_15_=this.segls) != null ? _617_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _626_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_626_15_=this.segls) != null ? _626_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _648_55_, _649_55_

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
                fgSpans = colorspans.adjust((((_648_55_=colors.fg) != null ? _648_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_649_55_=colors.bg) != null ? _649_55_ : [])),oldLines,this.s.lines)
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
        var area, _675_28_, _677_46_

        var list = _k_.list((((_675_28_=this.s.sue) != null ? _675_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_677_46_=area.value[3]) != null ? _677_46_ : 1)))
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
        var conf, _775_26_

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
        var line, y1, y2, _823_49_

        line = this.windowLine(spec.kind,(((_823_49_=spec.count) != null ? _823_49_ : 1)))
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
        var _950_22_

        this.beginIndices = ((_950_22_=this.beginIndices) != null ? _950_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _956_24_

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
        var _976_54_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjtPQUF1QixjQUF2Qjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEOztPQUNBLGVBQUE7O09BQ1UsV0FBQTtPQUFLLFdBQUE7OztBQUVwQixTQUFEOztzQkFBTzthQU9ILE9BQUksT0FBTTs7UUFBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQyxnQkFBcUI7UUFDdEIsS0FBQyxnQkFBaUI7UUFDbEIsS0FBQztRQUVELEtBQUMsY0FBYztRQUVmLEtBQUMsaUJBQW9CO1FBQ3JCLEtBQUMsaUJBQW9CO1FBQ3JCLEtBQUMsZUFBb0I7UUFDckIsS0FBQyxvQkFBb0I7b0JBRVQsSUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssTUFBTSxNQUFNOzs7WUFBeEU7aUJBQ0ksS0FBTzs7Z0JBQUwsSUFBSztnQkFDUCxLQUFFLEtBQUssRUFBRSxLQUFLOzs7UUFFdEIsS0FBQyxhQUFhLEtBQUssS0FBSztRQUN4QixLQUFDLFlBQWEsS0FBQztRQUVmLEtBQUMsYUFBZSxPQUFPLEtBQUMs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
