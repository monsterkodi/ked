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
            this.setSue(rng[0],rng[1],[code,values.concat([w,h])])
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
                keep.push({x:0,y:y,value:[sue.LINE_SCALE,[scales[i]]]})
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

        open = {x:x1,y:y,value:[sue.SCALE,[scale]]}
        close = {x:x2,y:y,value:[sue.CLOSE,[sue.SCALE]]}
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
                out.push({x:area.x,y:area.y,value:[sue.SCALE,[scale]]})
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
        var area, data, out, _346_37_

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
                data = ((_346_37_=area.value[1]) != null ? _346_37_ : [])
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
        var area, _675_28_, _677_49_

        var list = _k_.list((((_675_28_=this.s.sue) != null ? _675_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_677_49_=area.value[1][0]) != null ? _677_49_ : 1)))
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
