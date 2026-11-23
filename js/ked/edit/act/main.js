var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import belt from "../tool/belt.js"

export default {
    setMain:function (m)
    {
        var mc
    
        mc = this.mainCursor()
        this.s = this.s.set('main',_k_.clamp(0,this.s.cursors.length - 1,m))
        return this.adjustViewForMainCursor({adjust:'topBotDeltaGrow',mc:mc})
    },
    mainCursor:function ()
    {
        return this.s.cursors[this.s.main].asMutable()
    },
    setMainCursor:function (x, y)
    {
        ;[x,y] = belt.pos(x,y)
        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.max(0,x)
        return this.setCursors([[x,y]])
    },
    moveMainCursorInDirection:function (dir, opt = {})
    {
        var mc
    
        mc = belt.positionInDirection(this.mainCursor(),dir)
        if (opt.keep)
        {
            return this.addCursor(mc)
        }
        else
        {
            return this.moveMainCursor(mc)
        }
    },
    moveMainCursor:function (x, y)
    {
        var cursors, main, mainCursor
    
        ;[x,y] = belt.pos(x,y)
        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.max(0,x)
        mainCursor = this.mainCursor()
        if (_k_.eql(mainCursor, [x,y]))
        {
            return
        }
        cursors = this.allCursors()
        cursors.splice(belt.indexOfPosInPositions(mainCursor,cursors),1)
        main = belt.indexOfPosInPositions([x,y],cursors)
        if (main < 0)
        {
            cursors.push([x,y])
            main = cursors.length - 1
        }
        return this.setCursors(cursors,{main:main})
    },
    singleCursorAtEndOfLine:function ()
    {
        var mc, rng
    
        rng = belt.lineRangeAtPos(this.s.lines,this.mainCursor())
        mc = belt.endOfRange(rng)
        this.deselect()
        return this.setCursors([mc])
    },
    singleCursorAtIndentOrStartOfLine:function ()
    {
        var ind, lines, mc, rng
    
        lines = this.s.lines
        mc = this.mainCursor()
        rng = belt.lineRangeAtPos(lines,mc)
        ind = belt.lineIndentAtPos(lines,mc)
        if (ind < mc[0])
        {
            mc[0] = ind
        }
        else
        {
            mc = belt.startOfRange(rng)
        }
        this.deselect()
        return this.setCursors([mc])
    },
    singleCursorPage:function (dir)
    {
        var mc
    
        mc = this.mainCursor()
        switch (dir)
        {
            case 'up':
                mc[1] -= this.cells.rows
                break
            case 'down':
                mc[1] += this.cells.rows
                break
        }
    
        this.deselect()
        return this.setCursors([mc])
    },
    jumpToWordAtCursor:function ()
    {
        var word
    
        if (word = this.wordAtCursor())
        {
            return post.emit('jumpToWord',word)
        }
    },
    wordAtCursor:function ()
    {
        return belt.wordAtPos(this.s.lines,this.mainCursor())
    },
    chunkBeforeCursor:function ()
    {
        return belt.chunkBeforePos(this.s.lines,this.mainCursor())
    },
    chunkAfterCursor:function ()
    {
        return belt.chunkAfterPos(this.s.lines,this.mainCursor())
    },
    setMainCursorAndSelect:function (x, y)
    {
        this.setSelections(belt.extendLineRangesFromPositionToPosition,this.s.lines,this.allSelections(),this.mainCursor(),[x,y])
        return this.setCursors([[x,y]],{adjust:'topBotDelta'})
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3QvbWFpbi5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFdBQVo7OztJQUlILGtCQUFTOzs7O1FBQ0wsS0FBSyxLQUFDO1FBQ04sS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLGlCQUFhLEVBQUUsS0FBQyxFQUFFLFFBQVEsU0FBTyxFQUFFO2VBQy9DLEtBQUMseUJBQXdCLE9BQU8sa0JBQWtCLEdBQUc7O0lBRXpEOztlQUFlLEtBQUMsRUFBRSxRQUFRLEtBQUMsRUFBRSxNQUFNOztJQUVuQyx3QkFBZSxHQUFFOztVQUVaLEVBQUUsS0FBSyxLQUFLLElBQUksRUFBRTtRQUVuQixjQUFVLEVBQUUsS0FBQyxFQUFFLE1BQU0sU0FBTyxFQUFFO1FBQzlCLFlBQVEsRUFBRTtlQUVWLEtBQUMsYUFBYSxFQUFFOztJQUVwQixvQ0FBMkIsS0FBSTs7OztRQUUzQixLQUFLLEtBQUssb0JBQW9CLEtBQUMsYUFBYTtZQUV6QyxJQUFJOzttQkFDSCxLQUFDLFVBQVU7Ozs7bUJBRVgsS0FBQyxlQUFlOzs7SUFFeEIseUJBQWdCLEdBQUU7Ozs7VUFFYixFQUFFLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFFbkIsY0FBVSxFQUFFLEtBQUMsRUFBRSxNQUFNLFNBQU8sRUFBRTtRQUM5QixZQUFRLEVBQUU7UUFFVixhQUFhLEtBQUM7b0JBRVQsYUFBZ0IsRUFBRTs7OztRQUV2QixVQUFVLEtBQUM7UUFFWCxRQUFRLE9BQU8sS0FBSyxzQkFBc0IsV0FBVyxTQUFTO1FBRTlELE9BQU8sS0FBSyx1QkFBdUIsRUFBRSxHQUFHO1lBQ3JDLE9BQU87O1lBQ04sUUFBUSxNQUFNLEVBQUU7WUFDaEIsT0FBTyxRQUFRLFNBQU87O2VBRTFCLEtBQUMsV0FBVyxTQUFRLEtBQUs7O0lBRTdCOzs7O1FBRUksTUFBTSxLQUFLLGVBQWUsS0FBQyxFQUFFLE1BQU0sS0FBQztRQUNwQyxLQUFNLEtBQUssV0FBVztRQUV0QixLQUFDO2VBQ0QsS0FBQyxZQUFZOztJQUVqQjs7OztRQUVJLFFBQVEsS0FBQyxFQUFFO1FBQ1gsS0FBUSxLQUFDO1FBRVQsTUFBUSxLQUFLLGVBQWdCLE1BQU07UUFDbkMsTUFBUSxLQUFLLGdCQUFnQixNQUFNO1lBRWhDLE1BQU0sR0FBRzs7WUFDUixHQUFHLEtBQUs7Ozs7WUFFUixLQUFNLEtBQUssYUFBYTs7UUFFNUIsS0FBQztlQUNELEtBQUMsWUFBWTs7SUFFakIsMkJBQWtCOzs7O1FBRWQsS0FBSyxLQUFDO2dCQUVDOztpQkFDSDtnQkFBVSxHQUFHLE1BQU0sS0FBQyxNQUFNOztpQkFDMUI7Z0JBQVUsR0FBRyxNQUFNLEtBQUMsTUFBTTs7OztRQUU5QixLQUFDO2VBQ0QsS0FBQyxZQUFZOztJQUVqQjs7OztZQUVPLE9BQU8sS0FBQzs7bUJBQ1AsS0FBSyxLQUFLLGFBQWE7OztJQUUvQjs7ZUFBc0IsS0FBSyxVQUFlLEtBQUMsRUFBRSxNQUFNLEtBQUM7O0lBQ3BEOztlQUFzQixLQUFLLGVBQWUsS0FBQyxFQUFFLE1BQU0sS0FBQzs7SUFDcEQ7O2VBQXNCLEtBQUssY0FBZSxLQUFDLEVBQUUsTUFBTSxLQUFDOztJQUVwRCxpQ0FBd0IsR0FBRTs7UUFFdEIsS0FBQyxjQUFjLEtBQUssdUNBQXVDLEtBQUMsRUFBRSxNQUFNLEtBQUMsZ0JBQWdCLEtBQUMsY0FBYyxFQUFFO2VBQ3RHLEtBQUMsYUFBYSxFQUFFLEtBQUksT0FBTyJ9
//# sourceURL=../../../../kode/ked/edit/act/main.kode
