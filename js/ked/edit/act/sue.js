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
        var _145_27_
    
        if ((this.rectree != null) || !this.isValidLineIndex(li))
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
        var cached, cols, indent, key, line, starts, _217_19_
    
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
        this.wrapCache = ((_217_19_=this.wrapCache) != null ? _217_19_ : new WeakMap())
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
    rowDelta:function (pos, delta)
    {
        var hi, k, li, starts, x
    
        ;[x,li] = pos
        if (!this.isWrapped(li))
        {
            return delta
        }
        starts = this.wrapStarts(li)
        k = this.wrapRow(x,li)
        hi = ((k + 1 < starts.length) ? starts[k + 1] - 1 : Infinity)
        return _k_.clamp(starts[k],hi,x + delta) - x
    },
    hasWrap:function ()
    {
        var _342_27_, _344_16_
    
        if ((this.rectree != null))
        {
            return false
        }
        if (this.wrap.all)
        {
            return true
        }
        return (((_344_16_=this.s.sue) != null ? _344_16_ : [])).some(function (area)
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
        var after, anch, between, cursors, goal, goals, idx, next, np, pos, rngs, _397_33_
    
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
            anch = ((_397_33_=this.anchors[idx]) != null ? _397_33_ : pos)
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
        var areas, _414_23_
    
        areas = ((_414_23_=this.s.sue) != null ? _414_23_ : [])
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
