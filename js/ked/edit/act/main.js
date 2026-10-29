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
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]
    
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
    
        var _b_ = belt.pos(x,y); x = _b_[0]; y = _b_[1]
    
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3QvbWFpbi5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQVFhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFdBQVo7OztJQUlILGtCQUFTOzs7O1FBQ0wsS0FBSyxLQUFDO1FBQ04sS0FBQyxJQUFJLEtBQUMsRUFBRSxJQUFJLGlCQUFhLEVBQUUsS0FBQyxFQUFFLFFBQVEsU0FBTyxFQUFFO2VBQy9DLEtBQUMseUJBQXdCLE9BQU8sa0JBQWtCLEdBQUc7O0lBRXpEOztlQUFlLEtBQUMsRUFBRSxRQUFRLEtBQUMsRUFBRSxNQUFNOztJQVFuQyx3QkFBZSxHQUFFOztrQkFFTCxLQUFLLElBQUksRUFBRSxJQUFsQixZQUFFOztRQUVILGNBQVUsRUFBRSxLQUFDLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFDOUIsWUFBUSxFQUFFO2VBRVYsS0FBQyxhQUFhLEVBQUU7O0lBUXBCLG9DQUEyQixLQUFJOzs7O1FBRTNCLEtBQUssS0FBSyxvQkFBb0IsS0FBQyxhQUFhO1lBRXpDLElBQUk7O21CQUNILEtBQUMsVUFBVTs7OzttQkFFWCxLQUFDLGVBQWU7OztJQUV4Qix5QkFBZ0IsR0FBRTs7OztrQkFFTixLQUFLLElBQUksRUFBRSxJQUFsQixZQUFFOztRQUVILGNBQVUsRUFBRSxLQUFDLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFDOUIsWUFBUSxFQUFFO1FBRVYsYUFBYSxLQUFDO29CQUVSLGFBQWdCLEVBQUU7Ozs7UUFFeEIsVUFBVSxLQUFDO1FBRVgsUUFBUSxPQUFPLEtBQUssc0JBQXNCLFdBQVcsU0FBUztRQUU5RCxPQUFPLEtBQUssdUJBQXVCLEVBQUUsR0FBRztZQUNyQyxPQUFPOztZQUNOLFFBQVEsTUFBTSxFQUFFO1lBQ2hCLE9BQU8sUUFBUSxTQUFPOztlQUUxQixLQUFDLFdBQVcsU0FBUSxLQUFLOztJQVE3Qjs7OztRQUVJLE1BQU0sS0FBSyxlQUFlLEtBQUMsRUFBRSxNQUFNLEtBQUM7UUFDcEMsS0FBTSxLQUFLLFdBQVc7UUFFdEIsS0FBQztlQUNELEtBQUMsWUFBWTs7SUFRakI7Ozs7UUFFSSxRQUFRLEtBQUMsRUFBRTtRQUNYLEtBQVEsS0FBQztRQUVULE1BQVEsS0FBSyxlQUFnQixNQUFNO1FBQ25DLE1BQVEsS0FBSyxnQkFBZ0IsTUFBTTtZQUVoQyxNQUFNLEdBQUc7O1lBQ1IsR0FBRyxLQUFLOzs7O1lBRVIsS0FBTSxLQUFLLGFBQWE7O1FBRTVCLEtBQUM7ZUFDRCxLQUFDLFlBQVk7O0lBRWpCLDJCQUFrQjs7OztRQUVkLEtBQUssS0FBQztnQkFFQzs7aUJBQ0g7Z0JBQVUsR0FBRyxNQUFNLEtBQUMsTUFBTTs7aUJBQzFCO2dCQUFVLEdBQUcsTUFBTSxLQUFDLE1BQU07Ozs7UUFFOUIsS0FBQztlQUNELEtBQUMsWUFBWTs7SUFFakI7Ozs7WUFFTyxPQUFPLEtBQUM7O21CQUNQLEtBQUssS0FBSyxhQUFhOzs7SUFFL0I7O2VBQXNCLEtBQUssVUFBZSxLQUFDLEVBQUUsTUFBTSxLQUFDOztJQUNwRDs7ZUFBc0IsS0FBSyxlQUFlLEtBQUMsRUFBRSxNQUFNLEtBQUM7O0lBQ3BEOztlQUFzQixLQUFLLGNBQWUsS0FBQyxFQUFFLE1BQU0sS0FBQzs7SUFFcEQsaUNBQXdCLEdBQUU7O1FBRXRCLEtBQUMsY0FBYyxLQUFLLHVDQUF1QyxLQUFDLEVBQUUsTUFBTSxLQUFDLGdCQUFnQixLQUFDLGNBQWMsRUFBRTtlQUN0RyxLQUFDLGFBQWEsRUFBRSxLQUFJLE9BQU8ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/main.kode
