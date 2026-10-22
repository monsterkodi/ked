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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9zZWxlY3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBbUJJLGlCQUFRLE1BQUs7Ozs7UUFFVDtRQUVBLEtBQUMsY0FBYyxHQUFHLEdBQUcsR0FBRztZQUVyQixLQUFLLEtBQUssR0FBRyxNQUFNLEtBQUssT0FBTSxHQUFHLE1BQU8sS0FBSyxLQUFLLEdBQUc7O3VCQUN2QyxHQUFHOzs7UUFFcEIsR0FBRyxlQUFhLEVBQUUsS0FBQyxFQUFFLE1BQU0sU0FBTyxFQUFFLEdBQUc7UUFDdkMsS0FBSyxlQUFXLEVBQUUsS0FBQyxFQUFFLE1BQU0sU0FBTyxFQUFFLEtBQUs7UUFFekMsR0FBRyxlQUFhLEVBQUUsS0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLE9BQU8sR0FBRztRQUM1QyxLQUFLLGVBQVcsRUFBRSxLQUFDLEVBQUUsTUFBTSxLQUFLLElBQUksT0FBTyxLQUFLO1FBRWhELFdBQVcsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHO2VBRTFDLEtBQUMsY0FBYzs7SUFFbkI7O2VBQWtCLEtBQUMsRUFBRSxXQUFXOztJQUNoQzs7ZUFBa0IsS0FBQyxFQUFFLFdBQVc7O0lBUWhDOzs7O3VCQUVhLEtBQUMsRUFBRTs7WUFDUixNQUFNLEtBQUM7Z0JBQ0osS0FBQyxFQUFFLFdBQVcsU0FBUyxLQUFDLEVBQUUsV0FBVzs7Z0JBQ3BDLEtBQUM7Ozs7Z0JBRUQsS0FBQzs7OztRQUdULEtBQUM7ZUFDRCxLQUFDOztJQUVMOzt1QkFFYSxLQUFDLEVBQUU7O2lCQUNELEtBQUM7O2dCQUNKLEtBQUM7Ozs7UUFHVCxLQUFDO2VBQ0QsS0FBQzs7SUFFTDs7dUJBRWEsS0FBQyxFQUFFOzttQkFBZ0IsS0FBQzs7ZUFFN0IsS0FBQzs7SUFFTDs7dUJBRWEsS0FBQyxFQUFFOztZQUNSLEtBQUM7WUFDRCxLQUFDOztlQUVMLEtBQUM7O0lBRUw7O3VCQUVhLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/select.kode
