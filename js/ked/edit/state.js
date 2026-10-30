var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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
        var bgSpans, colors, fgSpans, next, _80_28_, _81_28_, _97_23_

        colors = this.s.colors
        colors = (colors != null ? colors : {fg:[],bg:[]})
        fgSpans = ((_80_28_=colors.fg) != null ? _80_28_ : [])
        bgSpans = ((_81_28_=colors.bg) != null ? _81_28_ : [])
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
        var bgSpans, colors, fgSpans, next, _109_46_, _110_46_

        colors = this.s.colors
        if (!(colors != null))
        {
            return
        }
        fgSpans = colorspans.clear((((_109_46_=colors.fg) != null ? _109_46_ : [])),ranges)
        bgSpans = colorspans.clear((((_110_46_=colors.bg) != null ? _110_46_ : [])),ranges)
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
        var colors, _138_45_

        colors = this.s.colors
        if (!(colors != null))
        {
            return null
        }
        return colorspans.colorAtPos((((_138_45_=colors[layer]) != null ? _138_45_ : [])),pos)
    }

    state.prototype["loadColors"] = function (colors)
    {
        var bgSpans, fgSpans, next, _146_32_, _147_32_

        fgSpans = []
        bgSpans = []
        if ((colors != null))
        {
            fgSpans = ((_146_32_=colors.fg) != null ? _146_32_ : [])
            bgSpans = ((_147_32_=colors.bg) != null ? _147_32_ : [])
        }
        next = {fg:fgSpans,bg:bgSpans}
        this.s = this.s.set('colors',next)
        this.clearHistory()
        return this.emit('colors.changed')
    }

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _166_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_166_15_=opt.mc) != null ? _166_15_ : this.mainCursor())
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
        var segl, _283_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_283_15_=this.segls) != null ? _283_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _292_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_292_15_=this.segls) != null ? _292_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var bgSpans, colors, diff, fgSpans, next, oldLines, _315_55_, _316_55_

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        if (oldLines !== this.s.lines)
        {
            colors = this.s.colors
            if ((colors != null) && (!_k_.empty(colors.fg) || !_k_.empty(colors.bg)))
            {
                fgSpans = colorspans.adjust((((_315_55_=colors.fg) != null ? _315_55_ : [])),oldLines,this.s.lines)
                bgSpans = colorspans.adjust((((_316_55_=colors.bg) != null ? _316_55_ : [])),oldLines,this.s.lines)
                next = {fg:fgSpans,bg:bgSpans}
                this.s = this.s.set('colors',next)
            }
            diff = belt.diffLines(oldLines,this.s.lines)
            return this.emit('lines.changed',diff)
        }
    }

    state.prototype["linesInView"] = function ()
    {
        return this.s.lines.slice(this.s.view[1], this.s.view[1] + this.cells.rows)
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
        view[1] = _k_.clamp(0,_k_.max(0,this.s.lines.length - this.cells.rows),view[1])
        maxOffsetX = _k_.max(0,this.maxLineWidth - this.cells.cols + 2)
        maxOffsetX = _k_.max(maxOffsetX,this.mainCursor()[0] - this.cells.cols + 2)
        view[0] = _k_.clamp(0,maxOffsetX,view[0])
        if (_k_.eql(view, this.s.view))
        {
            return
        }
        return this.setView(view)
    }

    state.prototype["adjustViewForMainCursor"] = function (opt)
    {
        var botDelta, dir, dtb, dtt, topBotDelta, topDelta, view, x, y

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
        if (opt.adjust === 'topDelta')
        {
            view[1] = y - topDelta
        }
        else if (opt.adjust === 'topBotDeltaGrow' && opt.mc)
        {
            dtt = y - view[1]
            dtb = y - (view[1] + this.cells.rows)
            if (dtt < 0)
            {
                view[1] = y - topDelta
            }
            else if (dtb > 0)
            {
                view[1] = y - (this.cells.rows - botDelta)
            }
            else
            {
                dir = y - opt.mc[1]
                if (dtt < topDelta && dir < 0 || -dtb < botDelta && dir > 0)
                {
                    view[1] += dir
                }
            }
        }
        else
        {
            if (opt.adjust !== 'topBotDelta')
            {
                topBotDelta = 0
            }
            if (y >= view[1] + this.cells.rows - 1 - topBotDelta)
            {
                view[1] = y - this.cells.rows + 1 + topBotDelta
            }
            else if (y < view[1] + topBotDelta)
            {
                view[1] = y - topBotDelta
            }
        }
        if (view[1] > 0 && this.s.lines.length <= this.cells.rows)
        {
            view[1] = 0
        }
        if (!this.skipAdjustViewForMainCursor)
        {
            view[0] = _k_.max(0,x - this.cells.cols + 2)
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
        view[1] = _k_.clamp(0,_k_.max(0,this.s.lines.length - this.cells.rows),view[1])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWNVLFVBQUE7SUFBTTtJQUFVO0lBQUs7SUFBSztJQUFPOztPQUMzQixXQUFOOztPQUNNLGFBQVQ7O09BQ1MsVUFBVjtPQUFjLGFBQWQ7T0FBcUIsYUFBckI7T0FBNEIsV0FBNUI7T0FBaUMsYUFBakM7T0FBd0MsWUFBeEM7T0FBOEMsV0FBOUM7T0FBbUQsWUFBbkQ7O09BQ1UsV0FBVjtPQUFlLGlCQUFmOztPQUNVLFdBQUE7T0FBSyxXQUFBOzs7QUFFWixTQUFUOztzQkFBdUI7YUFFbkIsT0FBSSxPQUFNOztRQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQztvQkFFVyxJQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTSxLQUFLOzs7WUFBakQ7aUJBQ0ksS0FBTzs7Z0JBQUwsSUFBSztnQkFDUCxLQUFFLEtBQUssRUFBRSxLQUFLOzs7UUFFdEIsS0FBQyxZQUFZLEtBQUssS0FBSztRQUV2QixLQUFDLGFBQWUsT0FBTyxLQUFDLE9BQU87UUFDL0IsS0FBQyxXQUFXO1FBRVosS0FBQyxZQUFpQjtRQUNsQixLQUFDLGlCQUFpQjtRQUVsQixLQUFDOzs7O3FCQUVMLHlCQUFZOztZQUE4QixLQUFDLGFBQWE7O21CQUFwQyxLQUFLLE9BQU8sS0FBRTs7OztxQkFDbEMsd0JBQVk7O1lBQThCLEtBQUMsYUFBYTs7bUJBQXBDLEtBQUssTUFBTyxLQUFFOzs7O3FCQUNsQyx1QkFBWTs7WUFBOEIsS0FBQyxhQUFhOzttQkFBcEMsS0FBSyxLQUFPLEtBQUU7Ozs7cUJBRWxDOztZQUVPLEtBQUMsS0FBSyxTQUFTOzttQkFDZCxLQUFDLFdBQUs7Ozs7bUJBRU4sS0FBQzs7OztxQkFFVDs7UUFFSSxLQUFDLEtBQUssS0FBQztlQUNQLEtBQUM7Oztx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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/state.kode
