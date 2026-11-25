var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

import belt from "../tool/belt.js"
import sue from "../tool/sue.js"

export default {
    sueAt:function (pos)
    {
        var area, areas, i, x, y, _8_23_
    
        areas = ((_8_23_=this.s.sue) != null ? _8_23_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        ;[x,y] = pos
        for (i = areas.length - 1; i >= 0; i--)
        {
            area = areas[i]
            if (area.y === y && area.x <= x)
            {
                return area
            }
        }
    },
    setSue:function (x, y, value)
    {
        var areas, _20_23_
    
        areas = ((_20_23_=this.s.sue) != null ? _20_23_ : [])
        return this.changeSue(areas.concat([{x:x,y:y,value:value}]))
    },
    changeSue:function (areas)
    {
        this.s = this.s.set('sue',areas)
        this.rowCache = null
        this.r = []
        this.pushState()
        return this.emit('sue.changed')
    },
    loadSue:function (areas)
    {
        this.s = this.s.set('sue',((areas != null ? areas : [])))
        this.rowCache = null
        this.clearHistory()
        return this.emit('sue.changed')
    },
    applySueAreas:function (next)
    {
        var areas, _40_23_
    
        areas = ((_40_23_=this.s.sue) != null ? _40_23_ : [])
        if (_k_.eql(next, areas))
        {
            return
        }
        return this.changeSue(next)
    },
    clearSueForRanges:function (ranges)
    {
        var areas, cut, _47_21_, _49_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_49_23_=this.s.sue) != null ? _49_23_ : [])
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
    },
    toggleSueFlag:function (flag)
    {
        var next, ranges, _62_21_, _69_56_
    
        if ((this.rectree != null))
        {
            return
        }
        ranges = this.selectionsOrCursorWordRanges()
        if (_k_.empty(ranges))
        {
            return
        }
        ranges = belt.splitLineRanges(this.s.lines,ranges,false)
        next = sue.rangesWithToggledFlag(ranges,(((_69_56_=this.s.sue) != null ? _69_56_ : [])),this.s.lines,flag)
        if (_k_.eql(next, this.s.sue))
        {
            return
        }
        return this.changeSue(next)
    },
    stepScales:function (delta)
    {
        var areas, indices, lines, next, piece, runs, _77_21_, _79_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_79_23_=this.s.sue) != null ? _79_23_ : [])
        next = areas
        if (_k_.empty(this.s.selections))
        {
            indices = belt.lineIndicesForPositions(this.s.cursors)
            next = sue.areasWithSteppedLineScales(areas,indices,delta,this.lineScale)
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
            next = sue.areasWithSteppedLineScales(next,lines,delta,this.lineScale)
            next = sue.areasWithSteppedRunsInLines(next,runs,delta,this.s.lines)
        }
        return this.applySueAreas(next)
    },
    clearScales:function ()
    {
        var areas, indices, next, piece, run, _102_21_, _104_23_
    
        if ((this.rectree != null))
        {
            return
        }
        areas = ((_104_23_=this.s.sue) != null ? _104_23_ : [])
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        next = sue.areasWithoutLineScales(areas,indices)
        var list = _k_.list(belt.splitLineRanges(this.s.lines,this.s.selections,false))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            piece = list[_b_]
            if (belt.isFullLineRange(this.s.lines,piece))
            {
                continue
            }
            var list1 = _k_.list(sue.runsForLine(next,this.s.lines,piece[1]))
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                run = list1[_c_]
                if (run[0] <= piece[0] && piece[2] <= run[1])
                {
                    next = sue.areasWithoutRun(next,piece[1],run[0],run[1])
                    break
                }
            }
        }
        return this.applySueAreas(next)
    },
    toggleWrap:function ()
    {
        var areas, indices, wrap, _121_21_, _126_23_
    
        if ((this.rectree != null) || this.wrap.all)
        {
            return
        }
        indices = belt.lineIndicesForRangesAndPositions(this.s.selections,this.s.cursors)
        if (_k_.empty(indices))
        {
            return
        }
        areas = ((_126_23_=this.s.sue) != null ? _126_23_ : [])
        wrap = !sue.isWrapLine(areas,this.mainCursor()[1])
        this.applySueAreas(sue.areasWithWraps(areas,indices,wrap))
        return this.adjustViewForMainCursor()
    },
    toggleWrapAll:function ()
    {
        return this.setWrap({all:!this.wrap.all})
    },
    toggleWrapWord:function ()
    {
        return this.setWrap({word:!this.wrap.word})
    },
    scaleRunsForLine:function (y)
    {
        var areas, _137_23_
    
        areas = ((_137_23_=this.s.sue) != null ? _137_23_ : [])
        if (_k_.empty(areas))
        {
            return []
        }
        return sue.runsForLine(areas,this.s.lines,y)
    },
    clearSueAtCursorOrSelection:function ()
    {
        var ranges
    
        if (ranges = this.selectionsOrCursorWordRanges())
        {
            return this.clearSueForRanges(ranges)
        }
    },
    sueColorAtSelection:function (layer)
    {
        var area, code, fg, rng
    
        fg = layer === 'fg'
        var list = _k_.list(this.s.selections)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            rng = list[_d_]
            if (area = this.sueAt([rng[0],rng[1]]))
            {
                ;[code] = area.value
                if (code === sue.FG_BG_COLOR)
                {
                    return area.value[(fg ? 3 : 4)]
                }
                if (fg && code === sue.FG_COLOR)
                {
                    return area.value[3]
                }
                if (!fg && code === sue.BG_COLOR)
                {
                    return area.value[3]
                }
            }
        }
        return null
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9zdWUua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDYyxXQUFQO09BQVksVUFBWjs7O0lBSUgsZ0JBQU87Ozs7UUFFSCxpQkFBUSxLQUFDLEVBQUU7c0JBQ0E7Ozs7VUFFVixFQUFFLEtBQUs7YUFFSixJQUFLLE1BQU0sU0FBTyxRQUFHOztZQUNyQixPQUFPLE1BQU07Z0JBQ1YsS0FBSyxNQUFLLEtBQU0sS0FBSyxLQUFLOzt1QkFDdkI7Ozs7SUFFZCxpQkFBUyxHQUFFLEdBQUU7Ozs7UUFFVCxrQkFBUSxLQUFDLEVBQUU7ZUFDWCxLQUFDLFVBQVUsTUFBTSxTQUFTLEVBQUcsRUFBRSxFQUFHLEVBQUUsTUFBTzs7SUFFL0Msb0JBQVc7O1FBRVAsS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLE1BQU07UUFDbEIsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDLEtBQUs7O0lBRVYsa0JBQVM7O1FBRUwsS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLFFBQU8sZ0JBQUE7UUFDbkIsS0FBQyxXQUFXO1FBQ1osS0FBQztlQUNELEtBQUMsS0FBSzs7SUFFVix3QkFBZTs7OztRQUVYLGtCQUFRLEtBQUMsRUFBRTtvQkFDTixNQUFTOzs7O2VBRWQsS0FBQyxVQUFVOztJQUVmLDRCQUFtQjs7OzthQUVWLEtBQUM7Ozs7UUFFTixrQkFBUSxLQUFDLEVBQUU7c0JBQ0Esb0JBQWU7Ozs7UUFFMUIsU0FBUyxLQUFLLGdCQUFnQixLQUFDLEVBQUUsTUFBTSxPQUFPO1FBRTlDLE1BQU0sSUFBSSwwQkFBMEIsT0FBTyxNQUFNLEtBQUMsRUFBRTtvQkFFL0MsS0FBUTs7OztlQUViLEtBQUMsVUFBVTs7SUFFZix3QkFBZTs7OzthQUVOLEtBQUM7Ozs7UUFFTixTQUFTLEtBQUM7c0JBQ0M7Ozs7UUFFWCxTQUFTLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNLE9BQU87UUFFOUMsT0FB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
//# sourceURL=../../../../kode/ked/edit/act/sue.kode
