var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import belt from "../tool/belt.js"

export default {
    select:function (from, to)
    {
        var selections
    
        selections = []
        this.setMainCursor(to[0],to[1])
        if (from[1] > to[1] || from[1] === to[1] && from[0] > to[0])
        {
            var _a_ = [to,from]; from = _a_[0]; to = _a_[1]
    
        }
        to[1] = _k_.clamp(0,this.s.lines.length - 1,to[1])
        from[1] = _k_.clamp(0,this.s.lines.length - 1,from[1])
        to[0] = _k_.clamp(0,this.s.lines[to[1]].length,to[0])
        from[0] = _k_.clamp(0,this.s.lines[from[1]].length,from[0])
        selections.push([from[0],from[1],to[0],to[1]])
        return this.setSelections(selections)
    },
    allSelections:function ()
    {
        return this.s.selections.asMutable()
    },
    allHighlights:function ()
    {
        return this.s.highlights.asMutable()
    },
    selectWordAtCursor_highlightSelection_selectAllHighlights:function ()
    {
        var pos
    
        if (!_k_.empty(this.s.highlights))
        {
            pos = this.mainCursor()
            if (this.s.selections.length < this.s.highlights.length)
            {
                this.selectAllHighlights()
            }
            else
            {
                this.addNextHighlightToSelection()
            }
            return
        }
        this.selectWordAtCursor_highlightSelection()
        return this.selectAllHighlights()
    },
    highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            if (!this.deselectCursorHighlight())
            {
                this.moveCursorToNextHighlight()
            }
            return
        }
        this.selectWordAtCursor_highlightSelection()
        return this.deselectCursorHighlight()
    },
    selectWordAtCursor_highlightSelection_addNextHighlightToSelection:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            return this.addCurrentOrNextHighlightToSelection()
        }
        return this.selectWordAtCursor_highlightSelection()
    },
    selectWordAtCursor_highlightSelection_selectNextHighlight:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            this.clearCursors()
            this.selectNextHighlight()
        }
        return this.selectWordAtCursor_highlightSelection()
    },
    highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            if (!this.deselectCursorHighlight())
            {
                this.moveCursorToPrevHighlight()
            }
            return
        }
        this.selectWordAtCursor_highlightSelection()
        return this.deselectCursorHighlight()
    },
    selectWordAtCursor_highlightSelection_addPrevHighlightToSelection:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            return this.addCurrentOrPrevHighlightToSelection()
        }
        return this.selectWordAtCursor_highlightSelection()
    },
    selectWordAtCursor_highlightSelection_selectPrevHighlight:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            this.clearCursors()
            this.selectPrevHighlight()
        }
        return this.selectWordAtCursor_highlightSelection()
    },
    selectWordAtCursor_highlightSelection:function ()
    {
        if (_k_.empty(this.s.selections))
        {
            this.selectWord(this.mainCursor())
        }
        return this.highlightSelection()
    },
    highlightSelection:function ()
    {
        var rng, spans, text
    
        if (_k_.empty(this.s.selections))
        {
            return
        }
        spans = []
        var list = _k_.list(this.allSelections())
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            rng = list[_b_]
            if (rng[1] !== rng[3])
            {
                continue
            }
            text = belt.textForLineRange(this.s.lines,rng)
            spans = spans.concat(belt.lineSpansForText(this.s.lines,text))
        }
        return this.setHighlights(spans)
    },
    highlightText:function (text)
    {
        if (_k_.empty(text))
        {
            return
        }
        return this.setHighlights(belt.lineSpansForText(this.s.lines,text))
    },
    deselectCursorHighlight:function ()
    {
        var prev
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        if (_k_.empty(this.s.selections))
        {
            return
        }
        if (prev = belt.prevSpanBeforePos(this.s.highlights,this.mainCursor()))
        {
            return this.deselectSpan(prev)
        }
    },
    selectAllHighlights:function ()
    {
        var cursors, selections, span
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        selections = []
        cursors = []
        var list = _k_.list(this.s.highlights)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            span = list[_c_]
            selections.push(belt.rangeForSpan(span))
            cursors.push(belt.endOfSpan(span))
        }
        this.addCursors(cursors)
        return this.setSelections(selections)
    },
    selectNextHighlight:function ()
    {
        var next
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        if (next = belt.nextSpanAfterPos(this.s.highlights,this.mainCursor()))
        {
            this.selectSpan(next)
            return this.setMainCursor(belt.endOfSpan(next))
        }
    },
    selectPrevHighlight:function ()
    {
        var pos, prev
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        pos = this.mainCursor()
        if (prev = belt.prevSpanBeforePos(this.s.highlights,pos))
        {
            if (_k_.eql(belt.endOfSpan(prev), pos))
            {
                prev = belt.prevSpanBeforePos(this.s.highlights,belt.startOfSpan(prev))
            }
            if (prev)
            {
                this.selectSpan(prev)
                return this.setMainCursor(belt.endOfSpan(prev))
            }
        }
    },
    addCurrentOrNextHighlightToSelection:function ()
    {
        var prev
    
        if (prev = belt.prevSpanBeforePos(this.s.highlights,this.mainCursor()))
        {
            if (!belt.rangesContainSpan(this.s.selections,prev))
            {
                this.addSpanToSelection(prev)
                this.addCursor(belt.endOfSpan(prev))
                return
            }
        }
        return this.addNextHighlightToSelection()
    },
    addCurrentOrPrevHighlightToSelection:function ()
    {
        var prev
    
        if (prev = belt.prevSpanBeforePos(this.s.highlights,this.mainCursor()))
        {
            if (!belt.rangesContainSpan(this.s.selections,prev))
            {
                this.addSpanToSelection(prev)
                this.addCursor(belt.endOfSpan(prev))
                return
            }
        }
        return this.addPrevHighlightToSelection()
    },
    addNextHighlightToSelection:function ()
    {
        var next
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        if (next = belt.nextSpanAfterPos(this.s.highlights,this.mainCursor()))
        {
            this.addSpanToSelection(next)
            return this.addCursor(belt.endOfSpan(next))
        }
    },
    addPrevHighlightToSelection:function ()
    {
        var pos, prev
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        pos = this.mainCursor()
        if (prev = belt.prevSpanBeforePos(this.s.highlights,pos))
        {
            if (_k_.eql(belt.endOfSpan(prev), pos))
            {
                prev = belt.prevSpanBeforePos(this.s.highlights,belt.startOfSpan(prev))
            }
            if (prev)
            {
                this.addSpanToSelection(prev)
                return this.addCursor(belt.endOfSpan(prev))
            }
        }
    },
    moveCursorToNextHighlight:function (pos)
    {
        var next
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        pos = (pos != null ? pos : this.mainCursor())
        if (next = belt.nextSpanAfterPos(this.s.highlights,pos))
        {
            return this.moveMainCursor(belt.endOfSpan(next))
        }
    },
    moveCursorToPrevHighlight:function (pos)
    {
        var prev
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        pos = (pos != null ? pos : this.mainCursor())
        if (prev = belt.prevSpanBeforePos(this.s.highlights,pos))
        {
            if (_k_.eql(belt.endOfSpan(prev), pos))
            {
                prev = belt.prevSpanBeforePos(this.s.highlights,belt.startOfSpan(prev))
            }
            if (prev)
            {
                return this.moveMainCursor(belt.endOfSpan(prev))
            }
        }
    },
    selectSpan:function (span)
    {
        return this.setSelections([belt.rangeForSpan(span)])
    },
    deselectSpan:function (span)
    {
        var index, rng, selection, selections
    
        rng = belt.rangeForSpan(span)
        selections = this.allSelections()
        var list = _k_.list(selections)
        for (index = 0; index < list.length; index++)
        {
            selection = list[index]
            if (belt.isSameRange(selection,rng))
            {
                selections.splice(index,1)
                this.setSelections(selections)
                return true
            }
        }
        return false
    },
    addRangeToSelectionWithMainCursorAtEnd:function (rng)
    {
        this.addRangeToSelection(rng)
        return this.delCursorsInRange(rng)
    },
    addRangeToSelection:function (rng)
    {
        var selections
    
        selections = this.allSelections()
        selections.push(rng)
        return this.setSelections(selections)
    },
    addSpanToSelection:function (span)
    {
        return this.addRangeToSelection(belt.rangeForSpan(span))
    },
    selectChunk:function (x, y)
    {
        var rng
    
        if (rng = belt.rangeOfClosestChunkToPos(this.s.lines,belt.pos(x,y)))
        {
            this.addRangeToSelectionWithMainCursorAtEnd(rng)
        }
        return this
    },
    selectWord:function (x, y)
    {
        var range
    
        if (range = belt.rangeOfClosestWordToPos(this.s.lines,belt.pos(x,y)))
        {
            this.addRangeToSelectionWithMainCursorAtEnd(range)
        }
        return this
    },
    selectLine:function (y)
    {
        y = (y != null ? y : this.mainCursor()[1])
        if ((0 <= y && y < this.s.lines.length))
        {
            this.select([0,y],[this.s.lines[y].length,y])
        }
        return this
    },
    selectPrevLine:function (y)
    {
        y = (y != null ? y : this.mainCursor()[1])
        return this.selectLine(y - 1)
    },
    selectNextLine:function (y)
    {
        y = (y != null ? y : this.mainCursor()[1])
        return this.selectLine(y + 1)
    },
    selectCursorLines:function ()
    {
        var selections
    
        selections = belt.lineRangesForPositions(this.s.lines,this.s.cursors)
        _k_.assert("/home/kodi/s/ked/kode/ked/edit/act/select.kode", 321, 8, "assert failed!" + " selections.length === this.s.cursors.length", selections.length === this.s.cursors.length)
        return this.setSelections(selections)
    },
    selectAllLines:function ()
    {
        var allsel
    
        allsel = [[0,0,kseg.width(this.s.lines[this.s.lines.length - 1]),this.s.lines.length - 1]]
        if (_k_.eql(allsel, this.s.selections))
        {
            return this.deselect()
        }
        else
        {
            return this.setSelections(allsel)
        }
    },
    selectMoreLines:function ()
    {
        var cursors, selections
    
        var _e_ = belt.addLinesBelowPositionsToRanges(this.s.lines,this.s.cursors,this.s.selections); cursors = _e_[0]; selections = _e_[1]
    
        this.setSelections(selections)
        return this.setCursors(cursors,{main:-1})
    },
    selectLessLines:function ()
    {
        var cursors, selections
    
        var _f_ = belt.removeLinesAtPositionsFromRanges(this.s.lines,this.s.cursors,this.s.selections); cursors = _f_[0]; selections = _f_[1]
    
        this.setSelections(selections)
        return this.setCursors(cursors,{main:-1})
    },
    textOfSelection:function ()
    {
        return belt.textForLineRanges(this.s.lines,this.s.selections)
    },
    selectedText:function ()
    {
        return belt.textForLineRanges(this.s.lines,this.s.selections)
    },
    selectionsOrCursorLineRanges:function ()
    {
        var _369_51_
    
        return ((_369_51_=this.s.selections) != null ? _369_51_ : belt.lineRangesForPositions(this.s.lines,this.s.cursors,true))
    },
    textOfSelectionOrCursorLines:function ()
    {
        return belt.textForLineRanges(this.s.lines,this.selectionsOrCursorLineRanges())
    },
    isSingleLineSelected:function ()
    {
        return this.s.selections.length === 1 && this.s.selections[0][1] === this.s.selections[0][3]
    },
    isSelectedLine:function (y)
    {
        var selection
    
        var list = _k_.list(this.s.selections)
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            selection = list[_10_]
            if (selection[3] === y && selection[2] === 0)
            {
                continue
            }
            if ((selection[1] <= y && y <= selection[3]))
            {
                return true
            }
        }
        return false
    },
    isFullySelectedLine:function (y)
    {
        var selection
    
        var list = _k_.list(this.s.selections)
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            selection = list[_11_]
            if ((selection[1] <= y && y <= selection[3]))
            {
                return belt.isFullLineRange(this.s.lines,selection)
            }
        }
        return false
    },
    isPartiallySelectedLine:function (y)
    {
        var selection
    
        var list = _k_.list(this.s.selections)
        for (var _12_ = 0; _12_ < list.length; _12_++)
        {
            selection = list[_12_]
            if ((selection[1] <= y && y <= selection[3]))
            {
                return !belt.isFullLineRange(this.s.lines,selection)
            }
        }
        return false
    },
    isSpanSelectedLine:function (y)
    {
        var selection, span
    
        var list = _k_.list(this.s.selections)
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            selection = list[_13_]
            if ((selection[1] <= y && y <= selection[3]))
            {
                span = belt.isSpanLineRange(this.s.lines,selection)
                if (span)
                {
                    return true
                }
            }
            if (selection[1] > y)
            {
                return false
            }
        }
        return false
    },
    isHighlightedLine:function (y)
    {
        var highlight
    
        var list = _k_.list(this.s.highlights)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            highlight = list[_14_]
            if (highlight[1] === y)
            {
                return true
            }
        }
        return false
    },
    deselect:function ()
    {
        if (!_k_.empty(this.s.selections))
        {
            return this.setSelections([])
        }
    },
    clearHighlights:function ()
    {
        if (!_k_.empty(this.s.highlights))
        {
            return this.setHighlights([])
        }
    },
    clearCursors:function ()
    {
        if (this.s.cursors.length > 1)
        {
            return this.setCursors([this.mainCursor()])
        }
    },
    clearCursorsHighlightsAndSelections:function ()
    {
        if (this.s.cursors.length > 1 || !_k_.empty(this.s.selections))
        {
            this.pushState()
        }
        this.clearCursors()
        this.clearHighlights()
        return this.deselect()
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9zZWxlY3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRYSxVQUFBO0lBQU07SUFBSzs7T0FDTCxXQUFaOzs7SUFVSCxpQkFBUSxNQUFLOzs7O1FBRVQ7UUFFQSxLQUFDLGNBQWMsR0FBRyxHQUFHLEdBQUc7WUFFckIsS0FBSyxLQUFLLEdBQUcsTUFBTSxLQUFLLE9BQU0sR0FBRyxNQUFPLEtBQUssS0FBSyxHQUFHOzt1QkFDdkMsR0FBRyxPQUFmLGVBQUs7OztRQUVWLEdBQUcsZUFBYSxFQUFFLEtBQUMsRUFBRSxNQUFNLFNBQU8sRUFBRSxHQUFHO1FBQ3ZDLEtBQUssZUFBVyxFQUFFLEtBQUMsRUFBRSxNQUFNLFNBQU8sRUFBRSxLQUFLO1FBRXpDLEdBQUcsZUFBYSxFQUFFLEtBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxPQUFPLEdBQUc7UUFDNUMsS0FBSyxlQUFXLEVBQUUsS0FBQyxFQUFFLE1BQU0sS0FBSyxJQUFJLE9BQU8sS0FBSztRQUVoRCxXQUFXLE1BQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRztlQUUxQyxLQUFDLGNBQWM7O0lBRW5COztlQUFrQixLQUFDLEVBQUUsV0FBVzs7SUFDaEM7O2VBQWtCLEtBQUMsRUFBRSxXQUFXOztJQVFoQzs7Ozt1QkFFYSxLQUFDLEVBQUU7O1lBQ1IsTUFBTSxLQUFDO2dCQUNKLEtBQUMsRUFBRSxXQUFXLFNBQVMsS0FBQyxFQUFFLFdBQVc7O2dCQUNwQyxLQUFDOzs7O2dCQUVELEtBQUM7Ozs7UUFHVCxLQUFDO2VBQ0QsS0FBQzs7SUFFTDs7dUJBRWEsS0FBQyxFQUFFOztpQkFDRCxLQUFDOztnQkFDSixLQUFDOzs7O1FBR1QsS0FBQztlQUNELEtBQUM7O0lBRUw7O3VCQUVhLEtBQUMsRUFBRTs7bUJBQWdCLEtBQUM7O2VBRTdCLEtBQUM7O0lBRUw7O3VCQUVhLEtBQUMsRUFBRTs7WUFDUixLQUFDO1lB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/select.kode
