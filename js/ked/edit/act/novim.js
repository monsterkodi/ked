var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

export default {
    executeNovim:function (cmd)
    {
        console.log('novim command ▸',cmd)
        switch (cmd.operator)
        {
            case 'delete':
                return this.deleteByMotion(cmd.motion)
    
            case 'move':
                return this.moveByMotion(cmd.motion)
    
            case 'undo':
                return this.undoCommand(cmd.count)
    
            default:
                console.log('novim unknown operator ▸',cmd.operator)
        }
    
    },
    deleteByMotion:function (spec)
    {
        var cursor, lines, rng, rngs
    
        lines = this.s.lines
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            rng = motion.range(lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            if (belt.isEmptyRange(rng) && !motion.isLinewise(spec))
            {
                continue
            }
            rngs.push(rng)
        }
        console.log('novim ranges ▸',rngs)
        if (_k_.empty(rngs))
        {
            return
        }
        rngs = motion.mergeRanges(rngs)
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),motion.isLinewise(spec))
        return this.end()
    },
    moveByMotion:function (spec)
    {
        var i, n, _60_30_
    
        n = _k_.max(1,(((_60_30_=spec.count) != null ? _60_30_ : 1)))
        if (_k_.in(spec.kind,['left','right']))
        {
            for (var _b_ = i = 0, _c_ = n; (_b_ <= _c_ ? i < n : i > n); (_b_ <= _c_ ? ++i : --i))
            {
                this.moveCursors(spec.kind)
            }
        }
        else
        {
            this.moveCursors(spec.kind,{count:n})
        }
        return this.clampCursorsToLines()
    },
    clampCursorsToLines:function ()
    {
        var c, changed, cursors, width, x
    
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            c = list[_d_]
            width = kseg.width(this.s.lines[c[1]])
            x = _k_.clamp(0,width,c[0])
            if (x !== c[0])
            {
                c[0] = x
                changed = true
            }
        }
        if (changed)
        {
            return this.setCursors(cursors,{main:this.s.main})
        }
    },
    undoCommand:function (count)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        for (var _e_ = i = 0, _f_ = n; (_e_ <= _f_ ? i < n : i > n); (_e_ <= _f_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BYWEsVUFBQTtJQUFNOztPQUNMLFdBQVA7T0FBWSxhQUFaOzs7SUFJSCx1QkFBYzs7UUFFVixZQUFJLGtCQUFrQjtnQkFFZixJQUFJOztpQkFDUDt1QkFBVyxLQUFDLGVBQWUsSUFBSTs7aUJBQy9CO3VCQUFXLEtBQUMsYUFBYSxJQUFJOztpQkFDN0I7dUJBQVcsS0FBQyxZQUFZLElBQUk7OztnQkFDakIsWUFBSSwyQkFBMkIsSUFBSTs7OztJQUV0RCx5QkFBZ0I7Ozs7UUFFWixRQUFRLEtBQUMsRUFBRTtRQUNYOzRCQUVjLEtBQUM7OztZQUFYO1lBRUEsTUFBTSxPQUFPLE1BQU0sTUFBTSxPQUFPO2lCQUNoQjs7Z0JBQWhCOztnQkFJWSxLQUFLLGFBQWEsU0FBYSxPQUFPLFdBQVc7O2dCQUE3RDs7WUFFQSxLQUFLLEtBQUs7O1FBRWQsWUFBSSxpQkFBaUI7c0JBRVQ7Ozs7UUFHWixPQUFPLE9BQU8sWUFBWTtRQUUxQixLQUFDO1FBRUQsS0FBQyxhQUFhLEtBQUssS0FBQyxhQUFhLE9BQU8sV0FBVztlQUVuRCxLQUFDOztJQUVMLHVCQUFjOzs7O1FBRVYsWUFBUSxhQUFHLEtBQUssMkJBQVE7bUJBSXJCLEtBQUssTUFBUyxPQUFPOzsyQkFDaEIsSUFBSyxTQUFJLHFCQUFBLFFBQUE7O2dCQUNULEtBQUMsWUFBWSxLQUFLOzs7OztZQUV0QixLQUFDLFlBQVksS0FBSyxNQUFLLE1BQU07O2VBRWpDLEtBQUM7O0lBRUw7Ozs7UUFFSSxVQUFVLEtBQUM7UUFDWCxVQUFVOzRCQUVEOzs7WUFBTDtZQUVBLFFBQVEsS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLEVBQUU7WUFDOUIsY0FBYyxFQUFFLE1BQU0sRUFBRTtnQkFFckIsTUFBSyxFQUFFOztnQkFDTixFQUFFLEtBQVE7Z0JBQ1YsVUFBVTs7O1lBRWY7O21CQUNDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFOzs7SUFFcEMsc0JBQWE7Ozs7UUFFVCxZQUFRLElBQUcsZ0JBQUEsUUFBUTt1QkFFZixJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxLQUFDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
