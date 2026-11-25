var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
    setWrap:function (wrap)
    {
        this.wrap = Object.assign({},this.wrap,wrap)
        this.rowCache = null
        return this.adjustViewForMainCursor()
    },
    isWrapped:function (li)
    {
        if (!this.isValidLineIndex(li))
        {
            return false
        }
        return this.wrap.all || sue.isWrapLine(this.s.sue,li)
    },
    wrapCols:function (li)
    {
        return _k_.max(1,parseInt(this.cells.cols / this.lineScale(li)))
    },
    setRowWidths:function (widths)
    {
        this.rowWidths = widths
        return this.rowCache = null
    },
    rowWidthAt:function (i)
    {
        return _k_.max(1,this.rowWidths[_k_.clamp(0,this.rowWidths.length - 1,i)])
    },
    rowCols:function (li, k = 0)
    {
        if (!!_k_.empty(this.rowWidths))
        {
            return this.wrapCols(li)
        }
        return this.rowWidthAt(this.flowLayout().tops[li] + k)
    },
    flowLayout:function ()
    {
        var f, li, lines, off, row, starts, startsAt, tops, view
    
        lines = this.s.lines
        view = _k_.clamp(0,lines.length - 1,this.s.view[1])
        off = this.s.scrollOffset
        f = this.flowCache
        if ((f != null) && f.lines === lines && f.widths === this.rowWidths && f.word === this.wrap.word && f.ext === this.syntax.ext && f.view === view && f.off === off)
        {
            return f
        }
        starts = []
        tops = []
        startsAt = (function (li, row)
        {
            var indent, width
    
            if (!this.isWrapped(li))
            {
                return [0]
            }
            indent = this.wrapLineIndent(li)
            width = (function (k)
            {
                var w
    
                w = this.rowWidthAt(row + k)
                return (k === 0 ? w : _k_.max(1,w - _k_.min(indent,parseInt(w / 2))))
            }).bind(this)
            return sue.wrapStarts(lines[li],width,this.wrap.word)
        }).bind(this)
        row = -off
        for (li = view; li < lines.length; li++)
        {
            tops[li] = row
            starts[li] = startsAt(li,row)
            row += starts[li].length
        }
        row = -off
        for (li = view - 1; li >= 0; li--)
        {
            starts[li] = startsAt(li,0)
            row -= starts[li].length
            tops[li] = row
        }
        return this.flowCache = {lines:lines,widths:this.rowWidths,word:this.wrap.word,ext:this.syntax.ext,view:view,off:off,starts:starts,tops:tops}
    },
    wrapStarts:function (li)
    {
        var cached, cols, indent, key, line, starts, _215_19_
    
        if (!this.isWrapped(li))
        {
            return [0]
        }
        if (!_k_.empty(this.rowWidths))
        {
            return this.flowLayout().starts[li]
        }
        line = this.s.lines[li]
        cols = this.wrapCols(li)
        indent = this.wrapIndent(li,1)
        key = `${cols} ${this.wrap.word} ${indent}`
        this.wrapCache = ((_215_19_=this.wrapCache) != null ? _215_19_ : new WeakMap())
        if (_k_.isArr(line))
        {
            cached = this.wrapCache.get(line)
            if ((cached != null ? cached.key : undefined) === key)
            {
                return cached.starts
            }
        }
        starts = sue.wrapStarts(line,cols,this.wrap.word,indent)
        if (_k_.isArr(line))
        {
            this.wrapCache.set(line,{key:key,starts:starts})
        }
        return starts
    },
    wrapIndent:function (li, k)
    {
        if (k === 0 || !this.isWrapped(li))
        {
            return 0
        }
        return _k_.min(this.wrapLineIndent(li),parseInt(this.rowCols(li,k) / 2))
    },
    wrapLineIndent:function (li)
    {
        var clss, md
    
        md = _k_.in(this.syntax.ext,['md','markdown'])
        clss = (function (x)
        {
            return this.syntax.getClass(x,li)
        }).bind(this)
        return sue.wrapIndent(this.s.lines[li],null,clss,md)
    },
    wrapRow:function (x, li)
    {
        var k, starts
    
        starts = this.wrapStarts(li)
        k = starts.length - 1
        while (k > 0 && starts[k] > x)
        {
            k -= 1
        }
        return k
    },
    lineCell:function (x, li, cells)
    {
        var cx, k, scale
    
        scale = this.lineScale(li)
        ;[k,cx] = this.rowCol(x,li,cells)
        if (this.isWrapped(li))
        {
            cx = _k_.min(cx,this.rowCols(li,k) - 1)
        }
        return [cx * scale,k * scale]
    },
    rowCol:function (x, li, cells)
    {
        var cx, k, lastIndex
    
        cells = (cells != null ? cells : sue.cellPositionsForLine(this.s.lines,li,[]))
        lastIndex = cells.length - 1
        cx = (x <= lastIndex ? cells[x] : cells[lastIndex] + x - lastIndex)
        if (!this.isWrapped(li))
        {
            return [0,cx]
        }
        k = this.wrapRow(x,li)
        return [k,cx - cells[this.wrapStarts(li)[k]] + this.wrapIndent(li,k)]
    },
    posInRow:function (li, k, col)
    {
        var c, cells, end, gi, starts, stop
    
        starts = this.wrapStarts(li)
        cells = sue.cellPositionsForLine(this.s.lines,li,[])
        end = this.s.lines[li].length
        c = _k_.max(0,col - this.wrapIndent(li,k)) + cells[starts[k]]
        stop = ((k + 1 < starts.length) ? starts[k + 1] - 1 : end)
        gi = starts[k]
        while (gi < stop && cells[gi + 1] <= c)
        {
            gi += 1
        }
        if (gi === end)
        {
            gi += c - cells[gi]
        }
        return gi
    },
    viewX:function (li)
    {
        return (this.isWrapped(li) ? 0 : this.s.view[0])
    },
    wrapMaxX:function (li)
    {
        var cells, cend, end, k, lastIndex, starts, used
    
        end = this.s.lines[li].length
        starts = this.wrapStarts(li)
        k = starts.length - 1
        cells = sue.cellPositionsForLine(this.s.lines,li,[])
        lastIndex = cells.length - 1
        cend = (end <= lastIndex ? cells[end] : cells[lastIndex] + end - lastIndex)
        used = cend - cells[starts[k]] + this.wrapIndent(li,k)
        return _k_.max(end,end + this.rowCols(li,k) - 1 - used)
    },
    clampToWrap:function (cursors)
    {
        var c, out
    
        out = []
        var list = _k_.list(cursors)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            c = list[_d_]
            if (c[1] >= 0 && this.isWrapped(c[1]) && c[0] > this.wrapMaxX(c[1]))
            {
                out.push([this.wrapMaxX(c[1]),c[1]])
            }
            else
            {
                out.push(c)
            }
        }
        return out
    },
    hasWrap:function ()
    {
        var _326_16_
    
        if (this.wrap.all)
        {
            return true
        }
        return (((_326_16_=this.s.sue) != null ? _326_16_ : [])).some(function (area)
        {
            return area.value[0] === sue.WRAP
        })
    },
    rowStep:function (pos, dir, goal)
    {
        var col, dy, k, nx, x, y
    
        ;[x,y] = pos
        ;[k,col] = this.rowCol(x,y)
        if ((goal != null))
        {
            col = goal
        }
        dy = (dir === 'up' ? -1 : 1)
        k += dy
        if (k < 0 || k >= this.wrapStarts(y).length)
        {
            y += dy
            if (!this.isValidLineIndex(y))
            {
                return [[x,pos[1]],col]
            }
            k = (dy < 0 ? this.wrapStarts(y).length - 1 : 0)
        }
        nx = this.posInRow(y,k,col)
        if (this.isWrapped(y))
        {
            nx = _k_.min(nx,this.wrapMaxX(y))
        }
        return [[nx,y],col]
    },
    rowSteps:function (pos, dir, count, goal)
    {
        var i
    
        for (i = 0; i < count; i++)
        {
            ;[pos,goal] = this.rowStep(pos,dir,goal)
        }
        return [pos,goal]
    },
    rowGoals:function ()
    {
        var g
    
        g = this.rowGoalCache
        if (!(g != null) || g.cursors !== this.s.cursors)
        {
            return {}
        }
        return g.goals
    },
    keepRowGoals:function (goals)
    {
        return this.rowGoalCache = {cursors:this.s.cursors,goals:goals}
    },
    moveRowsAndSelect:function (dir)
    {
        var after, anch, between, cursors, goal, goals, idx, next, np, pos, rngs, _379_33_
    
        if (_k_.empty(this.anchors))
        {
            this.anchors = this.allCursors()
        }
        after = function (a, b)
        {
            return a[1] > b[1] || a[1] === b[1] && a[0] > b[0]
        }
        between = function (a, b)
        {
            return (after(a,b) ? [b[0],b[1],a[0],a[1]] : [a[0],a[1],b[0],b[1]])
        }
        rngs = this.s.selections.asMutable({deep:true})
        goals = this.rowGoals()
        next = {}
        cursors = []
        var list = _k_.list(this.allCursors())
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            anch = ((_379_33_=this.anchors[idx]) != null ? _379_33_ : pos)
            ;[np,goal] = this.rowStep(pos,dir,goals[`${pos[0]} ${pos[1]}`])
            next[`${np[0]} ${np[1]}`] = goal
            cursors.push(np)
            if ((dir === 'up' ? after(pos,anch) : after(anch,pos)))
            {
                rngs = belt.removeFromLineRangesBetweenPositions(rngs,pos,np)
                rngs.push(between(anch,np))
            }
            else
            {
                rngs.push(between(pos,np))
            }
        }
        this.setSelections(belt.clampLineRanges(this.s.lines,rngs))
        this.setCursors(cursors,{adjust:'topBotDelta',keepAnchors:true})
        return this.keepRowGoals(next)
    },
    scaleRunsForLine:function (y)
    {
        var areas, _396_23_
    
        areas = ((_396_23_=this.s.sue) != null ? _396_23_ : [])
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
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            rng = list[_f_]
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
