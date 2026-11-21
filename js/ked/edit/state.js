var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        this["areasWithSteppedRuns"] = this["areasWithSteppedRuns"].bind(this)
        this["areasWithoutRun"] = this["areasWithoutRun"].bind(this)
        this["areasWithRunScale"] = this["areasWithRunScale"].bind(this)
        this["areasWithRun"] = this["areasWithRun"].bind(this)
        this["isFullLinePiece"] = this["isFullLinePiece"].bind(this)
        this["selectionPieces"] = this["selectionPieces"].bind(this)
        this["areasWithoutLineScales"] = this["areasWithoutLineScales"].bind(this)
        this["areasWithSteppedLineScales"] = this["areasWithSteppedLineScales"].bind(this)
        this["toggleSueFlag"] = this["toggleSueFlag"].bind(this)
        this["decorationRanges"] = this["decorationRanges"].bind(this)
        this["clearSueForRanges"] = this["clearSueForRanges"].bind(this)
        this["applySueAreas"] = this["applySueAreas"].bind(this)
        this["loadSue"] = this["loadSue"].bind(this)
        this["changeSue"] = this["changeSue"].bind(this)
        this["sueAt"] = this["sueAt"].bind(this)
        this["setSue"] = this["setSue"].bind(this)
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

    state.prototype["colorAtPos"] = function (pos, layer)
    {
        var colors, _80_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        return colorspans.colorAtPos((((_80_45_=colors[layer]) != null ? _80_45_ : [])),pos)
    }

    state.prototype["setSue"] = function (x, y, value)
    {
        var areas, _86_23_

        areas = ((_86_23_=this.s.sue) != null ? _86_23_ : [])
        return this.changeSue(areas.concat([{x:x,y:y,value:value}]))
    }

    state.prototype["sueAt"] = function (pos)
    {
        var area, areas, i, x, y, _91_23_

        areas = ((_91_23_=this.s.sue) != null ? _91_23_ : [])
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
        var areas, _118_23_

        areas = ((_118_23_=this.s.sue) != null ? _118_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    }

    state.prototype["clearSueForRanges"] = function (ranges)
    {
        var areas, cut, _125_23_

        areas = ((_125_23_=this.s.sue) != null ? _125_23_ : [])
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

    state.prototype["toggleSueFlag"] = function (flag)
    {
        var next, ranges, _155_56_

        ranges = this.selectionsOrCursorWordRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        next = sue.rangesWithToggledFlag(ranges,(((_155_56_=this.s.sue) != null ? _155_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
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
        var x1, x2, y, _201_44_, _201_72_

        var _a_ = piece; x1 = _a_[0]; y = _a_[1]; x2 = _a_[2]

        return x1 === 0 && (kseg.width(((_201_44_=this.s.lines[y]) != null ? _201_44_ : [])) <= x2 || (((_201_72_=this.s.lines[y]) != null ? _201_72_ : [])).length <= x2)
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
        var areas, indices, lines, next, piece, runs, _268_23_

        areas = ((_268_23_=this.s.sue) != null ? _268_23_ : [])
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
        var areas, indices, next, piece, run, _291_23_

        areas = ((_291_23_=this.s.sue) != null ? _291_23_ : [])
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
        var areas, _307_23_

        areas = ((_307_23_=this.s.sue) != null ? _307_23_ : [])
        if (_k_.empty(areas))
        {
            return []
        }
        return sue.runsForLine(areas,this.s.lines,y)
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

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _322_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_322_15_=opt.mc) != null ? _322_15_ : this.mainCursor())
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
    
        this.visual = null
        this.visualAnchors = []
        this.lastVisual = null
        this.novimInsert = null
        if (this.novim.yankFlashTimer)
        {
            clearTimeout(this.novim.yankFlashTimer)
        }
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
        var segl, _447_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_447_15_=this.segls) != null ? _447_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _456_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_456_15_=this.segls) != null ? _456_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var areas, bgSpans, colors, diff, fgSpans, next, oldLines, _478_55_, _479_55_

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
                fgSpans = colorspans.adjust((((_478_55_=colors.fg) != null ? _478_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_479_55_=colors.bg) != null ? _479_55_ : [])),oldLines,this.s.lines)
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
        var area, _505_28_, _507_46_

        var list = _k_.list((((_505_28_=this.s.sue) != null ? _505_28_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            if (area.y === li && area.value[0] === sue.LINE_SCALE)
            {
                return _k_.clamp(1,7,parseInt(((_507_46_=area.value[3]) != null ? _507_46_ : 1)))
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
        var height, li, line, maxWidth, rows, width, _517_20_

        if (this.rowCache && this.rowCacheExt === this.syntax.ext)
        {
            return this.rowCache
        }
        this.lineWidths = ((_517_20_=this.lineWidths) != null ? _517_20_ : new WeakMap())
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
        var conf, _623_26_

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
        var line, y1, y2, _671_49_

        line = this.windowLine(spec.kind,(((_671_49_=spec.count) != null ? _671_49_ : 1)))
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
        if (this.keepJumps)
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
        var _800_22_

        this.beginIndices = ((_800_22_=this.beginIndices) != null ? _800_22_ : [])
        this.beginIndices.push(this.h.length)
        return this.beginIndex = this.beginIndices.slice(-1)[0]
    }

    state.prototype["end"] = function ()
    {
        var index, _806_24_

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
        var _826_54_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPO0lBQU87O09BQ2xDLFdBQU47O09BQ00sYUFBVDtPQUFnQixhQUFoQjs7T0FDUyxVQUFWO09BQWMsYUFBZDtPQUFxQixhQUFyQjtPQUE0QixXQUE1QjtPQUFpQyxhQUFqQztPQUF3QyxZQUF4QztPQUE4QyxXQUE5QztPQUFtRCxZQUFuRDtPQUF5RCxXQUF6RDtPQUE4RCxZQUE5RDtPQUFvRSxZQUFwRTtPQUEwRSxZQUExRTs7T0FDVSxXQUFWO09BQWUsaUJBQWY7T0FBMEIsZUFBMUI7T0FBbUMsaUJBQW5DO09BQThDLGFBQTlDO09BQXFELFVBQXJEO09BQXlELGVBQXpEOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFcEIsU0FBRDs7c0JBQU87YUFPSCxPQUFJLE9BQU07O1FBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxLQUFDLE9BQU8sT0FBTztRQUVmLEtBQUMsUUFBUSxNQUFNO1FBRWYsS0FBQztvQkFFVyxJQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLE1BQU07OztZQUF4RTtpQkFDSSxLQUFPOztnQkFBTCxJQUFLO2dCQUNQLEtBQUUsS0FBSyxFQUFFLEtBQUs7OztRQUV0QixLQUFDLGFBQWEsS0FBSyxLQUFLO1FBQ3hCLEtBQUMsWUFBYSxLQUFDO1FBRWYsS0FBQyxhQUFlLE9BQU8sS0FBQyxPQUFPO1FBQy9CLEtBQUMsV0FBVztRQUdaLEtBQUMsVUFBYyxHQUFHLEVBQUUsR0FBRztRQUN2QixLQUFDLGNBQWMsS0FBSyxXQUFXO1FBQy9CLEtBQUMsVUFBYTtRQUVkLEtBQUMsV0FBaUI7UUFDbEIsS0FBQyxj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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
