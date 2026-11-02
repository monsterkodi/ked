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
        this["maxViewLine"] = this["maxViewLine"].bind(this)
        this["startForRow"] = this["startForRow"].bind(this)
        this["lineAtRow"] = this["lineAtRow"].bind(this)
        this["rowOfLine"] = this["rowOfLine"].bind(this)
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
        this.scaledExts = ['md','markdown']
        this.scaling = true
        this.yankFlash = null
        this.yankFlashTimer = null
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

    state.prototype["setSelections"] = function (selections)
    {
        return this.set('selections',belt.mergeLineRanges(this.s.lines,selections))
    }

    state.prototype["setHighlights"] = function (highlights)
    {
        return this.set('highlights',belt.normalizeSpans(highlights))
    }

    state.prototype["setColorsForRanges"] = function (ranges, fg, bg, voided = [])
    {
        var bgSpans, colors, fgSpans, next, _102_23_, _85_28_, _86_28_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_85_28_=colors.fg) != null ? _85_28_ : [])
        bgSpans = ((_86_28_=colors.bg) != null ? _86_28_ : [])
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
        var bgSpans, colors, fgSpans, next, _114_46_, _115_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_114_46_=colors.fg) != null ? _114_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_115_46_=colors.bg) != null ? _115_46_ : [])),ranges)
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
        var colors, _143_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return null
        }
        return colorspans.colorAtPos((((_143_45_=colors[layer]) != null ? _143_45_ : [])),pos)
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, fgSpans, next, _151_32_, _152_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_151_32_=colors.fg) != null ? _151_32_ : [])
            bgSpans = ((_152_32_=colors.bg) != null ? _152_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        this.s = this.s.set('colors',next)
        this.clearHistory()
        return this.emit('colors.changed')
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _171_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_171_15_=opt.mc) != null ? _171_15_ : this.mainCursor())
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
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0],colors:{fg:[],bg:[]}})
        this.syntax.clear()
        this.h = []
        return this.r = []
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _288_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_288_15_=this.segls) != null ? _288_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _297_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_297_15_=this.segls) != null ? _297_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var bgSpans, colors, diff, fgSpans, next, oldLines, _320_55_, _321_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        if (oldLines !== this.s.lines)
        {
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_320_55_=colors.fg) != null ? _320_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_321_55_=colors.bg) != null ? _321_55_ : [])),oldLines,this.s.lines)
                next = {fg:fgSpans,bg:bgSpans}
                this.s = this.s.set('colors',next)
            }
            diff = belt.diffLines(oldLines,this.s.lines)
            return this.emit('lines.changed',diff)
        }
    }

    state.prototype["linesInView"] = function ()
    {
        return this.s.lines.slice(this.s.view[1], this.lineAtRow(this.cells.rows - 1) + 1)
    }

    state.prototype["applyScales"] = function (conf)
    {
        this.scaling = (conf != null ? conf.enabled : undefined) !== false
        if (!_k_.empty((conf != null ? conf.headings : undefined)))
        {
            return this.scales = conf.headings
        }
        else
        {
            return this.scales = {h1:3,h2:2}
        }
    }

    state.prototype["scaleOfLine"] = function (li)
    {
        var clss, s, scale

        if (!this.scaling)
        {
            return 1
        }
        if (!(_k_.in(this.syntax.ext,this.scaledExts)))
        {
            return 1
        }
        for (clss in this.scales)
        {
            scale = this.scales[clss]
            s = _k_.clamp(1,7,scale)
            if (s > 1 && this.syntax.hasClass(li,clss))
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

    state.prototype["rowOfLine"] = function (li)
    {
        var row, y

        row = 0
        for (var _a_ = y = this.s.view[1], _b_ = li; (_a_ <= _b_ ? y < li : y > li); (_a_ <= _b_ ? ++y : --y))
        {
            row += this.lineHeight(y)
        }
        return row
    }

    state.prototype["lineAtRow"] = function (row)
    {
        var h, li, r

        r = 0
        for (var _a_ = li = this.s.view[1], _b_ = this.s.lines.length; (_a_ <= _b_ ? li < this.s.lines.length : li > this.s.lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            h = this.lineHeight(li)
            if (row < r + h)
            {
                return li
            }
            r += h
        }
        return _k_.max(0,this.s.lines.length - 1)
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

    state.prototype["posForCell"] = function (x, row)
    {
        var li

        li = this.lineAtRow(row)
        return [parseInt(x / this.lineHeight(li)) + this.s.view[0],li]
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
        var maxOffsetX, sx, sy, view

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
        view[1] += sy
        view[1] = _k_.clamp(0,this.maxViewLine(),view[1])
        maxOffsetX = _k_.max(0,this.maxLineWidth - parseInt(this.cells.cols / this.lineHeight(this.mainCursor()[1])) + 2)
        maxOffsetX = _k_.max(maxOffsetX,this.mainCursor()[0] - parseInt(this.cells.cols / this.lineHeight(this.mainCursor()[1])) + 2)
        view[0] = _k_.clamp(0,maxOffsetX,view[0])
        if (_k_.eql(view, this.s.view))
        {
            return
        }
        return this.setView(view)
    }

    state.prototype["adjustViewForMainCursor"] = function (opt)
    {
        var botDelta, cols, dir, height, row, topBotDelta, topDelta, view, x, y

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
        topBotDelta = 7
        topDelta = 7
        botDelta = _k_.max(topDelta,parseInt(this.cells.rows / 2))
        row = this.rowOfLine(y)
        height = this.lineHeight(y)
        if (opt.adjust === 'topDelta')
        {
            view[1] = this.startForRow(y,topDelta)
        }
        else if (opt.adjust === 'topBotDeltaGrow' && opt.mc)
        {
            if (row < 0)
            {
                view[1] = this.startForRow(y,topDelta)
            }
            else if (row + height > this.cells.rows)
            {
                view[1] = this.startForRow(y,(this.cells.rows - botDelta - height))
            }
            else
            {
                dir = y - opt.mc[1]
                if (row < topDelta && dir < 0)
                {
                    view[1] = this.startForRow(y,topDelta)
                }
                else if (row + height > this.cells.rows - botDelta && dir > 0)
                {
                    view[1] = this.startForRow(y,(this.cells.rows - botDelta - height))
                }
            }
        }
        else
        {
            if (opt.adjust !== 'topBotDelta')
            {
                topBotDelta = 0
            }
            if (row + height > this.cells.rows - topBotDelta)
            {
                view[1] = this.startForRow(y,(this.cells.rows - topBotDelta - height))
            }
            else if (row < topBotDelta)
            {
                view[1] = this.startForRow(y,topBotDelta)
            }
        }
        view[1] = _k_.min(view[1],this.maxViewLine())
        if (!this.skipAdjustViewForMainCursor)
        {
            cols = _k_.max(1,parseInt(this.cells.cols / height))
            view[0] = _k_.max(0,x - cols + 2)
        }
        if (_k_.eql(view, this.s.view))
        {
            return
        }
        return this.setView(view)
    }

    state.prototype["initView"] = function ()
    {
        var view

        view = this.s.view.asMutable()
        view[1] = _k_.clamp(0,this.maxViewLine(),view[1])
        view[0] = _k_.max(0,view[0])
        return this.setView(view)
    }

    state.prototype["setView"] = function (view)
    {
        if (_k_.eql(this.s.view, view))
        {
            return
        }
        this.set('view',view)
        this.emit('view.changed',this.s.view)
        return this
    }

    state.prototype["rangeForVisibleLines"] = function ()
    {
        return [this.s.view[0],this.s.view[1],this.s.view[0] + this.cells.cols - 1,this.s.view[1] + this.cells.rows - 1]
    }

    return state
})()

export default state;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPOztPQUMzQixXQUFOOztPQUNNLGFBQVQ7O09BQ1MsVUFBVjtPQUFjLGFBQWQ7T0FBcUIsYUFBckI7T0FBNEIsV0FBNUI7T0FBaUMsYUFBakM7T0FBd0MsWUFBeEM7T0FBOEMsV0FBOUM7T0FBbUQsWUFBbkQ7O09BQ1UsV0FBVjtPQUFlLGlCQUFmOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFWixTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxPQUFNOztRQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxPQUFPLE9BQU87UUFFZixLQUFDO29CQUVXLElBQUksT0FBTyxPQUFPLEtBQUssT0FBTyxNQUFNLEtBQUs7OztZQUFqRDtpQkFDSSxLQUFPOztnQkFBTCxJQUFLO2dCQUNQLEtBQUUsS0FBSyxFQUFFLEtBQUs7OztRQUV0QixLQUFDLFlBQVksS0FBSyxLQUFLO1FBRXZCLEtBQUMsYUFBZSxPQUFPLEtBQUMsT0FBTztRQUMvQixLQUFDLFdBQVc7UUFHWixLQUFDLFVBQWMsR0FBRyxFQUFFLEdBQUc7UUFDdkIsS0FBQyxjQUFjLEtBQUs7UUFDcEIsS0FBQyxVQUFhO1FBRWQsS0FBQyxZQUFpQjtRQUNsQixLQUFDLGlCQUFpQjtRQUVsQixLQUFDOzs7O3FCQUVMLHlCQUFZOztZQUE4QixLQUFDLGFBQWE7O21CQUFwQyxLQUFLLE9BQU8sS0FBRTs7OztxQkFDbEMsd0JBQVk7O1lBQThCLEtBQUMsYUFBYTs7bUJBQXBDLEtBQUssTUFBTyxLQUFFOzs7O3FCQUNsQyx1QkFBWTs7WUFBOEIsS0FBQyxhQUFhOzttQkFBcEMsS0FBSyxLQUFPLEtBQUU7Ozs7cUJBRWxDOztZQUVPLEtBQUMsS0FBSyxTQUFTOzttQkFDZCxLQUFDLFdBQUs7Ozs7bUJBRU4sS0FBQzs7OztxQkFFVDs7UUFFSSxLQUFDLEtBQUssS0FBQztlQUNQLEtBQUM7OztxQkFRTCxrQkFBSyxNQUFLOztRQUVOLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxLQUFLO1FBQ2pCLEtBQUM7ZUFDRDs7O3FCQUVKLDRCQUFlOztlQUFjLEtBQUMsSUFBSSxhQUFhLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNOzs7cUJBQzdFLDRCQUFlOztlQUFjLEtBQUMsSUFBSSxhQUFhLEtBQUssZUFBZTs7O3FCQUVuRSxpQ0FBcUIsUUFBTyxJQUFHLElBQUc7Ozs7UUFFOUIsU0FBUyxLQUFDLEVBQUU7UUFDWixVQUFBLGlCQUFBLFVBQVcsTUFBUTtRQUVuQixvQkFBVSxPQUFPO1FBQ2pCLG9CQUFVLE9BQU87bUJBRWQsS0FBUTs7WUFDUCxVQUFVLFdBQVcsTUFBTSxRQUFROzs0QkFDekIsa0JBQWlCOztZQUMzQixVQUFVLFdBQVcsUUFBUSxRQUFRLE9BQU8sR0FBRyxLQUFDLEVBQUU7O21CQUVuRCxLQUFROztZQUNQLFVBQVUsV0FBVyxNQUFNLFFBQVE7OzRCQUN6QixrQkFBaUI7O1lBQzNCLFVBQVUsV0FBVyxRQUFRLFFBQVEsT0FBTyxHQUFHLEtBQUMsRUFBRTs7UUFFdEQsUUFDSSxHQUFJLFFBQ0osR0FBSTthQUVGLEtBQUMsRUFBRSwyQkFBWSxLQUFDLEVBQUUsUUFBVzs7OztRQUVuQyxLQUFDLElBQUksS0FBQyxFQUFFLElBQUksU0FBUztRQUNyQixLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUMsS0FBSzs7O3FCQUVWLG1DQUFzQjs7OztRQUVsQixTQUFTLEtBQUMsRUFBRTtjQUNGOzs7O1FBRVYsVUFBVSxXQUFXLGtCQUFPLE9BQU8sOEJBQVM7UUFDNUMsVUFBVSxXQUFXLGtCQUFPLE9BQU8sOEJBQVM7UUFFNUMsUUFDSSxHQUFJLFFBQ0osR0FBSTtvQkFFRixRQUFXOzs7O1FBRWpCLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxTQUFTO1FBQ3JCLEtBQUM7UUFDRCxLQUFDO2VBQ0QsS0FBQyxLQUFLOzs7cUJBRVY7Ozs7UUFFSSxTQUFTLEtBQUMsRUFBRTtzQkFFSDs7Z0JBQ0YsTUFBTSxLQUFLLHdCQUF3QixLQUFDLEVBQUUsTUFBTSxLQUFDOztnQkFDNUMsVUFBVTs7O3VCQUV3Qjs7bUJBQTFDLEtBQUMscUJBQXFCOzs7O3FCQUUxQix5QkFBYSxLQUFJOzs7O1FBRWIsU0FBUyxLQUFDLEVBQUU7Y0FDRzs7bUJBQVo7O2VBRUgsV0FBVyx1QkFBWSxPQUFPLGtDQUFhOzs7cUJBRS9DLHlCQUFZOzs7O1FBRVI7UUFDQTthQUVHOztZQUNDLHFCQUFVLE9BQU87WUFDakIscUJBQVUsT0FBTzs7UUFFckIsUUFDSSxHQUFJLFFBQ0osR0FBSTtRQUVSLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxTQUFTO1FBQ3JCLEtBQUM7ZUFDRCxLQUFDLEtBQUs7OztxQkFRVix5QkFBWSxTQUFROzs7O1FBRWhCLE9BQUEsY0FBQTtRQUNBLElBQUksZ0JBQUosSUFBSSx5QkFBTSxLQUFDO1FBRVgsT0FBTyxJQUFJO2FBRUosSUFBSTs7bUJBQ0EsS0FBQzs7WUFFRCxVQUFSOztZQUFjLE9BQU8sS0FBSyxzQkFBc0IsS0FBSzs7WUFDN0MsVUFBUixTQUFnQixPQUFPOztZQUFJLE9BQU8sUUFBUSxTQUFPOzthQUVqRDs7WUFDQyxzQkFBa0Isa0JBQWMsRUFBRSxRQUFRLFNBQU8sRUFBRTs7OztZQUVuRCxhQUFhLEtBQUM7O1FBRWxCLFVBQVUsS0FBSyxtQkFBbUIsUUFBUSxLQUFDLEVBQUUsTUFBTSxTQUFPO1FBRTFELEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxVQUFVO1FBRXRCLE9BQU87NEJBQ1E7YUFBUDs7WUFBSjt3QkFDRyxLQUFROztnQkFDUCxPQUFPO2dCQUNQOzs7WUFFVSxPQUFPOztZQUF6QixPQUFPLEtBQUMsRUFBRTs7UUFDVixpQkFBYSxFQUFFLEtBQUMsRUFBRSxRQUFRLFNBQU8sRUFBRTtRQUVuQyxLQUFDLElBQUksS0FBQyxFQUFFLElBQUksT0FBTztRQUVuQixLQUFDLHdCQUF3QjtRQUV6QixLQUFDO1FBRUQsS0FBSyxXQUFXO1FBQ2hCLEtBQUMsS0FBSztlQUNOOzs7cUJBRUo7O1lBRU8sS0FBQyxFQUFFLFdBQVc7O21CQUNWLEtBQUM7Ozs7bUJBRUQsS0FBQzs7OztxQkFRWixzQkFBUzs7ZUFFTCxLQUFDLFNBQVMsS0FBSyxNQUFNOzs7cUJBRXpCLHVCQUFVOztzQkFFRzs7WUFBUSxTQUFTOztlQUUxQixLQUFDLFNBQVMsS0FBSyxNQUFNOzs7cUJBRXpCLHVCQUFXOztRQUFEOztzQkFFRyxLQUFDOztZQUFRLEtBQUM7O1FBRW5CLEtBQUMsT0FBTyxTQUFTLEtBQUM7UUFFbEIsS0FBQztRQUVELEtBQUM7UUFFRCxLQUFDLGVBQWUsS0FBSyxhQUFhLEtBQUMsRUFBRTtlQUVyQyxLQUFDOzs7cUJBRUwsd0JBQVc7O3VCQUVFLFlBQTBCLFVBQVosTUFBTTs7WUFBWSxpQkFBUyxLQUFDLDRDQUE0QyxNQUFNOztlQUVyRyxLQUFDLFVBQVUsS0FBSyxNQUFNOzs7cUJBRTFCLHdCQUFXOztRQUVQLEtBQUM7ZUFDRCxLQUFDLFNBQVM7OztxQkFFZDs7ZUFBZ0IsS0FBQzs7O3FCQUNqQjs7ZUFBZ0IsS0FBQzs7O3FCQUNqQix5QkFBYTs7UUFBRDs7UUFFUixLQUFDLFNBQWdCO1FBQ2pCLEtBQUM7UUFDRCxLQUFDLGNBQWdCO1lBRWUsS0FBQzs7WUFBakMsYUFBYSxLQUFDOztRQUVkLEtBQUMsWUFBaUI7UUFDbEIsS0FBQyxpQkFBaUI7UUFFbEIsS0FBQyxJQUFJLFdBQ0QsTUFBYSxLQUFDLE1BQ2QsY0FDQSxjQUNBLFVBQWUsRUFBRSxJQUNqQixLQUFhLEVBQ2IsTUFBYyxFQUFFLEdBQ2hCLFFBQWMsTUFBUTtRQUUxQixLQUFDLE9BQU87UUFFUixLQUFDO2VBQ0QsS0FBQzs7O3FCQUVMLHNCQUFTLE1BQUs7Ozs7UUFFVixPQUFPLEtBQUs7UUFDWixLQUFDLE9BQU8sUUFBUSxLQUFLO1FBQ3JCLEtBQUMsbUJBQUQsS0FBQztRQUNELEtBQUMsTUFBTSxLQUFLO2VBRVosS0FBQzs7O3FCQUVMLDBCQUFhLE9BQU07Ozs7UUFFZixRQUFRLEtBQUssTUFBTTtRQUNuQixLQUFDLE9BQU8sWUFBWSxNQUFNO1FBQzFCLEtBQUMsbUJBQUQsS0FBQztRQUNELEtBQUMsUUFBUSxLQUFDLE1BQU0sT0FBTztlQUV2QixLQUFDOzs7cUJBUUw7Ozs7UUFFSSxXQUFXLEtBQUMsRUFBRTtRQUVkLEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxRQUFRLEtBQUM7WUFFbEIsYUFBWSxLQUFDLEVBQUU7O1lBRWQsU0FBUyxLQUFDLEVBQUU7aUJBRVQsK0JBQXVCLE9BQU8sa0JBQWdCLE9BQU87O2dCQUVwRCxVQUFVLFdBQVcsbUJBQVEsT0FBTyw4QkFBUyxTQUFTLEtBQUMsRUFBRTtnQkFDekQsVUFBVSxXQUFXLG1CQUFRLE9BQU8sOEJBQVMsU0FBUyxLQUFDLEVBQUU7Z0JBRXpELFFBQ0ksR0FBSSxRQUNKLEdBQUk7Z0JBRVIsS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLFNBQVM7O1lBRXpCLE9BQU8sS0FBSyxVQUFVLFNBQVMsS0FBQyxFQUFFO21CQUNsQyxLQUFDLEtBQUssZ0JBQWdCOzs7O3FCQUU5Qjs7ZUFBZ0IsS0FBQyxFQUFFLFlBQU0sS0FBQyxFQUFFLEtBQUssSUFBSyxLQUFDLFVBQVUsS0FBQyxNQUFNLE9BQUssS0FBRzs7O3FCQWNoRSwwQkFBYTs7UUFFVCxLQUFDLFdBQVUsZUFBQSxLQUFNLHlCQUFXO3dCQUVuQixlQUFBLEtBQU07O21CQUNYLEtBQUMsU0FBUyxLQUFLOzs7O21CQUVmLEtBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRzs7OztxQkFFM0IsMEJBQWE7Ozs7YUFFRSxLQUFDOzttQkFBVjs7cUJBQ0ssS0FBQyxPQUFPLElBQVcsS0FBQzs7bUJBQXpCOzthQUVFLFFBQWMsS0FBQzs7WUFBVixRQUFTLEtBQUM7WUFDZixjQUFVLEVBQUUsRUFBRTtnQkFDUCxJQUFJLEtBQU0sS0FBQyxPQUFPLFNBQVMsR0FBRzs7dUJBQW5DOzs7ZUFFTjs7O3FCQUVKLHlCQUFZOztlQUFNLEtBQUMsWUFBWTs7O3FCQUkvQix3QkFBVzs7OztRQUVQLE1BQU07dUJBQ0YsSUFBSyxLQUFDLEVBQUUsS0FBSyxVQUFLLHNCQUFBLFNBQUE7O1lBQ2xCLE9BQU8sS0FBQyxXQUFXOztlQUN2Qjs7O3FCQUlKLHdCQUFXOzs7O1FBRVAsSUFBSTt1QkFDQSxLQUFNLEtBQUMsRUFBRSxLQUFLLFVBQUssS0FBQyxFQUFFLE1BQU0sMkJBQVQsS0FBQyxFQUFFLE1BQU0sY0FBVCxLQUFDLEVBQUUsTUFBTTs7WUFDNUIsSUFBSSxLQUFDLFdBQVc7Z0JBQ1IsTUFBTSxJQUFFOzt1QkFBZDs7WUFDRixLQUFLOzt1QkFFTCxFQUFFLEtBQUMsRUFBRSxNQUFNLFNBQU87OztxQkFJMUIsMEJBQWEsSUFBRzs7OztRQUVaLGlCQUFhLEVBQUU7UUFFZixRQUFRO1FBQ1IsT0FBUTtlQUVGLFFBQVEsS0FBTSxPQUFPOztZQUN2QixTQUFTO1lBQ1QsUUFBUSxLQUFDLFdBQVc7O2VBRXhCOzs7cUJBSUo7Ozs7UUFFSSxJQUFLO1FBQ0wsS0FBSyxLQUFDLEVBQUUsTUFBTSxTQUFPO2VBRWYsTUFBTSxLQUFNLElBQUksS0FBQyxXQUFXLE9BQU8sS0FBQyxNQUFNOztZQUM1QyxLQUFLLEtBQUMsV0FBVztZQUNqQixNQUFNOztlQUVWLEtBQUc7OztxQkFJUCx5QkFBWSxHQUFFOzs7O1FBRVYsS0FBSyxLQUFDLFVBQVU7eUJBRVgsSUFBSSxLQUFDLFdBQVcsT0FBTyxLQUFDLEVBQUUsS0FBSyxHQUFHOzs7cUJBRTNDOztRQUVJLEtBQUM7ZUFDRCxLQUFDLGNBQWMsRUFBRTs7O3FCQUVyQiwrQkFBb0I7O2dCQUFNLEtBQUssTUFBQSxLQUFLLEtBQUMsRUFBRSxNQUFNOzs7cUJBQzdDLGlDQUFvQjs7Z0JBQVUsS0FBQyxpQkFBaUI7OztxQkFRaEQ7O1lBRVUsS0FBQyxFQUFFLFVBQVU7Ozs7UUFDbkIsS0FBQyxFQUFFLEtBQUssS0FBQyxFQUFFO1FBQ1gsS0FBQyxJQUFJLEtBQUM7UUFDTixLQUFDLE9BQU8sU0FBUyxLQUFDLEVBQUU7ZUFDcEIsS0FBQyxLQUFLOzs7cUJBRVY7O3NCQUVnQixLQUFDOzs7O1FBQ2IsS0FBQyxFQUFFLEtBQUssS0FBQyxFQUFFO1FBQ1gsS0FBQyxJQUFJLEtBQUM7UUFDTixLQUFDLE9BQU8sU0FBUyxLQUFDLEVBQUU7ZUFDcEIsS0FBQyxLQUFLOzs7cUJBRVY7O2VBQVUsS0FBQyxhQUFhLEtBQUMsRUFBRTs7O3FCQUUzQjs7dUJBRWEsS0FBQzs7WUFFTixLQUFDLEVBQUUsT0FBTyxLQUFDLFdBQVcsS0FBQyxFQUFFLFNBQU8sS0FBQyxhQUFXO21CQUVyQyxLQUFDOztlQUNaOzs7cUJBRUo7O1FBQWMsS0FBQyxFQUFFLEtBQUssS0FBQztlQUFJOzs7cUJBQzNCOztRQUFjLEtBQUMsRUFBRTtlQUFRLEtBQUM7OztxQkFFMUI7O2VBQVksS0FBQyxFQUFFLFNBQVM7OztxQkFDeEI7O2VBQVksS0FBQyxFQUFFLFNBQVM7OztxQkFFeEI7O3VCQUFvQixFQUFFLGNBQVMsS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLFNBQU87OztxQkFRMUQsa0JBQUs7O1FBRUQsT0FBQSxjQUFBO1FBRUEsS0FBQyxNQUFLLFNBQVM7c0JBRU4sS0FBQyxFQUFFOztZQUNSLEtBQUM7O2VBQ0wsS0FBQzs7O3FCQVFMLG1CQUFNOztRQUVGLE9BQUEsY0FBQTtRQUVBLEtBQUssS0FBSyxLQUFDO1lBRUksSUFBSSxhQUFZOzttQkFBL0IsS0FBQzs7OztxQkFRTCxvQkFBTzs7ZUFFSCxLQUFDLE9BQU8sS0FBSzs7O3FCQVFqQix5QkFBWSxLQUFJLFFBQU07Ozs7UUFFbEIsS0FBSyxLQUFLO2dCQUVIOztpQkFDSDtnQkFBVSxLQUFLOztpQkFDZjtnQkFBVSxLQUFNOztpQkFDaEI7Z0JBQVUsTUFBTTs7aUJBQ2hCO2dCQUFVLEtBQU07Ozs7UUFFcEIsT0FBTyxLQUFDLEVBQUUsS0FBSztRQUVmLEtBQUssTUFBTTtRQUNYLEtBQUssTUFBTTtRQUVYLEtBQUssZUFBVyxFQUFFLEtBQUMsY0FBYyxLQUFLO1FBRXRDLHFCQUFpQixFQUFFLEtBQUMsd0JBQWlCLEtBQUMsTUFBTSxPQUFLLEtBQUMsV0FBVyxLQUFDLGFBQWEsT0FBSztRQUNoRixxQkFBaUIsV0FBVyxLQUFDLGFBQWEsY0FBTyxLQUFDLE1BQU0sT0FBSyxLQUFDLFdBQVcsS0FBQyxhQUFhLE9BQUs7UUFDNUYsS0FBSyxlQUFXLEVBQUUsV0FBVyxLQUFLO29CQUU1QixNQUFTLEtBQUMsRUFBRTs7OztlQUVsQixLQUFDLFFBQVE7OztxQkFRYixzQ0FBeUI7Ozs7UUFFckIsT0FBQSxjQUFBO1lBRU0sS0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFDLE1BQU0sUUFBUTs7OztZQUVuQyxJQUFJLFdBQVU7Ozs7a0JBRVosS0FBQyxjQUFSLFlBQUU7O1FBRUgsT0FBTyxLQUFDLEVBQUUsS0FBSztRQUVmLGNBQWM7UUFDZCxXQUFXO1FBQ1gsbUJBQWUsa0JBQWEsS0FBQyxNQUFNLE9BQUs7UUFFeEMsTUFBUyxLQUFDLFVBQVU7UUFDcEIsU0FBUyxLQUFDLFdBQVc7WUFFbEIsSUFBSSxXQUFVOztZQUViLEtBQUssS0FBSyxLQUFDLFlBQVksRUFBRTs7aUJBRXJCLElBQUksV0FBVSxxQkFBc0IsSUFBSTs7Z0JBRXpDLE1BQU07O2dCQUNMLEtBQUssS0FBSyxLQUFDLFlBQVksRUFBRTs7cUJBQ3JCLE1BQU0sU0FBUyxLQUFDLE1BQU07O2dCQUMxQixLQUFLLEtBQUssS0FBQyxZQUFZLEdBQUcsS0FBQyxNQUFNLE9BQU8sV0FBVzs7OztnQkFFbkQsTUFBTSxJQUFJLElBQUksR0FBRztvQkFDZCxNQUFNLFlBQWEsTUFBTTs7b0JBQ3hCLEtBQUssS0FBSyxLQUFDLFlBQVksRUFBRTs7eUJBQ3JCLE1BQU0sU0FBUyxLQUFDLE1BQU0sT0FBTyxZQUFhLE1BQU07O29CQUNwRCxLQUFLLEtBQUssS0FBQyxZQUFZLEdBQUcsS0FBQyxNQUFNLE9BQU8sV0FBVzs7Ozs7O2dCQUd4RCxJQUFJLFdBQVU7O2dCQUNiLGNBQWM7O2dCQUVmLE1BQU0sU0FBUyxLQUFDLE1BQU0sT0FBTzs7Z0JBQzVCLEtBQUssS0FBSyxLQUFDLFlBQVksR0FBRyxLQUFDLE1BQU0sT0FBTyxjQUFjOztxQkFDbEQsTUFBTTs7Z0JBQ1YsS0FBSyxLQUFLLEtBQUMsWUFBWSxFQUFFOzs7UUFFakMsS0FBSyxhQUFTLEtBQUssR0FBRyxLQUFDO2FBRWhCLEtBQUM7O1lBQ0osZUFBVyxXQUFNLEtBQUMsTUFBTSxPQUFPO1lBQy9CLEtBQUssYUFBUyxFQUFFLElBQUksT0FBTzs7b0JBRXpCLE1BQVMsS0FBQyxFQUFFOzs7O2VBRWxCLEtBQUMsUUFBUTs7O3FCQUViOzs7O1FBRUksT0FBTyxLQUFDLEVBQUUsS0FBSztRQUVmLEtBQUssZUFBVyxFQUFFLEtBQUMsY0FBYyxLQUFLO1FBQ3RDLEtBQUssYUFBUyxFQUFFLEtBQUs7ZUFFckIsS0FBQyxRQUFROzs7cUJBRWIsc0JBQVM7O29CQUVDLEtBQUMsRUFBRSxNQUFTOzs7O1FBQ2xCLEtBQUMsSUFBSSxPQUFPO1FBQ1osS0FBQyxLQUFLLGVBQWUsS0FBQyxFQUFFO2VBQ3hCOzs7cUJBRUo7O2dCQUVLLEtBQUMsRUFBRSxLQUFLLEdBQUcsS0FBQyxFQUFFLEtBQUssR0FBRyxLQUFDLEVBQUUsS0FBSyxLQUFHLEtBQUMsTUFBTSxPQUFLLEVBQUUsS0FBQyxFQUFFLEtBQUssS0FBRyxLQUFDLE1BQU0sT0FBSzs7O1dBMWxCdEU7OztlQTRsQkYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
