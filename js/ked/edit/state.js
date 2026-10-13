var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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

import belt from "./tool/belt.js"

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
        this["textOfSelectionOrWordAtCursor"] = this["textOfSelectionOrWordAtCursor"].bind(this)
        this["setCursors"] = this["setCursors"].bind(this)
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
        var list = [del,insert,select,join,indent,multi,main]
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

    state.prototype["setCursors"] = function (cursors, opt)
    {
        var cur, idx, main, mainCursor, _81_15_

        opt = (opt != null ? opt : {})
        opt.mc = ((_81_15_=opt.mc) != null ? _81_15_ : this.mainCursor())
        main = opt.main
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
    
        this.s = immutable({lines:this.segls,selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0]})
        this.syntax.clear()
        this.h = []
        return this.r = []
    }

    state.prototype["addLine"] = function (line, ext)
    {
        var segl, _181_15_

        segl = kseg(line)
        this.syntax.addSegl(segl,ext)
        this.segls = ((_181_15_=this.segls) != null ? _181_15_ : [])
        this.segls.push(segl)
        return this.changeLinesSegls()
    }

    state.prototype["appendLines"] = function (lines, ext)
    {
        var segls, _190_15_

        segls = kseg.segls(lines)
        this.syntax.appendSegls(segls,ext)
        this.segls = ((_190_15_=this.segls) != null ? _190_15_ : [])
        this.segls = this.segls.concat(segls)
        return this.changeLinesSegls()
    }

    state.prototype["changeLinesSegls"] = function ()
    {
        var diff, oldLines

        oldLines = this.s.lines
        this.s = this.s.set('lines',this.segls)
        if (oldLines !== this.s.lines)
        {
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
        return this.syntax.setSegls(this.s.lines)
    }

    state.prototype["redo"] = function ()
    {
        if (_k_.empty(this.r))
        {
            return
        }
        this.h.push(this.r.pop())
        this.s = this.h.slice(-1)[0]
        return this.syntax.setSegls(this.s.lines)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFxQnVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUlmLEtBQUMsT0FBTyxPQUFPO1FBRWYsS0FBQztvQkFFVyxJQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTTs7OztzQkFDakM7O29CQUFBO2dCQUNQLEtBQUUsS0FBSyxFQUFFLEtBQUs7OztRQUV0QixLQUFDLFlBQVksS0FBSyxLQUFLO1FBRXZCLEtBQUMsYUFBZSxPQUFPLEtBQUMsT0FBTztRQUMvQixLQUFDLFdBQVc7UUFFWixLQUFDOzs7Ozs7WUFFcUMsS0FBQyxhQUFhOzttQkFBcEMsS0FBSyxPQUFPLEtBQUU7Ozs7OztZQUNRLEtBQUMsYUFBYTs7bUJBQXBDLEtBQUssTUFBTyxLQUFFOzs7Ozs7WUFDUSxLQUFDLGFBQWE7O21CQUFwQyxLQUFLLEtBQU8sS0FBRTs7Ozs7O1lBSTNCLEtBQUMsS0FBSyxTQUFTOzttQkFDZCxLQUFDLFdBQUs7Ozs7bUJBRU4sS0FBQzs7Ozs7O1FBSUwsS0FBQyxLQUFLLEtBQUM7ZUFDUCxLQUFDOzs7OztRQVVELEtBQUMsSUFBSSxLQUFDLEVBQUUsSUFBSSxLQUFLO1FBQ2pCLEtBQUM7ZUFDRDs7Ozs7ZUFFeUIsS0FBQyxJQUFJLGFBQWEsS0FBSyxnQkFBZ0IsS0FBQyxFQUFFLE1BQU07Ozs7O2VBQ2hELEtBQUMsSUFBSSxhQUFhLEtBQUssZUFBZTs7Ozs7OztRQVUvRCxPQUFBLGNBQUE7UUFDQSxJQUFJLGVBQUosSUFBSSx3QkFBTSxLQUFDO1FBRVgsT0FBTyxJQUFJO3NCQUVSOztZQUFjLE9BQU8sS0FBSyxzQkFBc0IsS0FBSzs7c0JBQ3JELFNBQWdCLE9BQU87O1lBQUksT0FBTyxRQUFRLFNBQU87O2FBRWpEOztZQUNDLHNCQUFrQixrQkFB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
//# sourceURL=file://kode/ked/edit/state.kode
