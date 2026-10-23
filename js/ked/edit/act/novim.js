var _k_ = {copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
                return this.applyChange(cmd)
    
            case 'move':
                return this.moveByMotion(cmd.motion)
    
            case 'undo':
                return this.undoCommand(cmd.count)
    
            case 'repeat':
                return this.repeatChange(cmd.count)
    
            default:
                console.log('novim unknown operator ▸',cmd.operator)
        }
    
    },
    applyChange:function (cmd)
    {
        this.lastChange = cmd
        return this.deleteByMotion(cmd.motion)
    },
    repeatChange:function (count)
    {
        var spec
    
        if (!this.lastChange)
        {
            return
        }
        spec = _k_.copy(this.lastChange.motion)
        if (count > 1)
        {
            spec.count = count
        }
        return this.deleteByMotion(spec)
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
        var i, n, _81_30_
    
        n = _k_.max(1,(((_81_30_=spec.count) != null ? _81_30_ : 1)))
        if (_k_.in(spec.kind,['left','right']))
        {
            for (var _b_ = i = 0, _c_ = n; (_b_ <= _c_ ? i < n : i > n); (_b_ <= _c_ ? ++i : --i))
            {
                this.moveCursors(spec.kind)
            }
        }
        else if (spec.kind === 'eol')
        {
            if (n > 1)
            {
                this.moveCursors('down',{count:n - 1})
            }
            this.moveCursorsToEndOfLine()
        }
        else if (_k_.in(spec.kind,['bof','eof']))
        {
            this.moveCursorsToLine(spec.kind,n)
        }
        else
        {
            this.moveCursors(spec.kind,{count:n})
        }
        return this.clampCursorsToLines()
    },
    moveCursorsToEndOfLine:function ()
    {
        var c, cursors
    
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            c = list[_d_]
            c[0] = _k_.max(0,kseg.width(this.s.lines[c[1]]) - 1)
        }
        return this.setCursors(cursors,{main:this.s.main})
    },
    moveCursorsToLine:function (kind, n)
    {
        var c, cursors, lines, target, width
    
        lines = this.s.lines
        target = (n > 1 ? n - 1 : 0)
        if (kind === 'eof' && n <= 1)
        {
            target = lines.length - 1
        }
        target = _k_.clamp(0,lines.length - 1,target)
        width = kseg.width(lines[target])
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            c = list[_e_]
            c[1] = target
            c[0] = _k_.min(belt.numIndent(lines[target]),_k_.max(0,width - 1))
        }
        return this.setCursors(cursors,{main:this.s.main})
    },
    clampCursorsToLines:function ()
    {
        var c, changed, cursors, width, x
    
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            c = list[_f_]
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
        for (var _10_ = i = 0, _11_ = n; (_10_ <= _11_ ? i < n : i > n); (_10_ <= _11_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BZ0JhLFVBQUE7SUFBTTs7T0FDTCxXQUFQO09BQVksYUFBWjs7O0lBSUgsdUJBQWM7O1FBRVYsWUFBSSxrQkFBa0I7Z0JBRWYsSUFBSTs7aUJBQ1A7dUJBQVcsS0FBQyxZQUFZOztpQkFDeEI7dUJBQVcsS0FBQyxhQUFhLElBQUk7O2lCQUM3Qjt1QkFBVyxLQUFDLFlBQVksSUFBSTs7aUJBQzVCO3VCQUFXLEtBQUMsYUFBYSxJQUFJOzs7Z0JBQ2xCLFlBQUksMkJBQTJCLElBQUk7Ozs7SUFFdEQsc0JBQWE7O1FBRVQsS0FBQyxhQUFhO2VBQ2QsS0FBQyxlQUFlLElBQUk7O0lBRXhCLHVCQUFjOzs7O2FBRUEsS0FBQzs7OztRQUVYLGdCQUFZLEtBQUMsV0FBVztZQUlGLFFBQVE7O1lBQTlCLEtBQUssUUFBUTs7ZUFFYixLQUFDLGVBQWU7O0lBRXBCLHlCQUFnQjs7OztRQUVaLFFBQVEsS0FBQyxFQUFFO1FBQ1g7NEJBRWMsS0FBQzs7O1lBQVg7WUFFQSxNQUFNLE9BQU8sTUFBTSxNQUFNLE9BQU87aUJBQ2hCOztnQkFBaEI7O2dCQUlZLEtBQUssYUFBYSxTQUFhLE9BQU8sV0FBVzs7Z0JBQTdEOztZQUVBLEtBQUssS0FBSzs7UUFFZCxZQUFJLGlCQUFpQjtzQkFFVDs7OztRQUdaLE9BQU8sT0FBTyxZQUFZO1FBRTFCLEtBQUM7UUFFRCxLQUFDLGFBQWEsS0FBSyxLQUFDLGFBQWEsT0FBTyxXQUFXO2VBRW5ELEtBQUM7O0lBRUwsdUJBQWM7Ozs7UUFFVixZQUFRLGFBQUcsS0FBSywyQkFBUTttQkFJckIsS0FBSyxNQUFTLE9BQU87OzJCQUNoQixJQUFLLFNBQUkscUJBQUEsUUFBQTs7Z0JBQ1QsS0FBQyxZQUFZLEtBQUs7OztpQkFDbEIsS0FBSyxTQUFROztnQkFHZCxJQUFJOztnQkFDSCxLQUFDLFlBQVksUUFBTyxNQUFNLElBQUU7O1lBRWhDLEtBQUM7O3dCQUNHLEtBQUssTUFBUyxNQUFNOztZQUN4QixLQUFDLGtCQUFrQixLQUFLLEtBQUs7Ozs7WUFFN0IsS0FBQyxZQUFZLEtBQUssTUFBSyxNQUFNOztlQUVqQyxLQUFDOztJQUlMOzs7O1FBRUksVUFBVSxLQUFDOzRCQUVGOzs7WUFBTDtZQUNBLEVBQUUsYUFBUyxFQUFFLEtBQUssTUFBTSxLQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU87O2VBRTlDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFOztJQUloQyw0QkFBbUIsTUFBSzs7OztRQUVwQixRQUFTLEtBQUMsRUFBRTtRQUNaLFVBQVMsSUFBSSxJQUFJLElBQUUsSUFBSTtZQUNJLFNBQVEsU0FBVSxLQUFLOztZQUFsRCxTQUFTLE1BQU0sU0FBTzs7UUFDdEIsbUJBQWUsRUFBRSxNQUFNLFNBQU8sRUFBRTtRQUVoQyxRQUFRLEtBQUssTUFBTSxNQUFNO1FBRXpCLFVBQVUsS0FBQzs0QkFFRjs7O1lBQUw7WUFDQSxFQUFFLEtBQUs7WUFDUCxFQUFFLGFBQVMsS0FBSyxVQUFVLE1BQU0saUJBQWEsRUFBRSxRQUFNOztlQUV6RCxLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUMsRUFBRTs7SUFFaEM7Ozs7UUFFSSxVQUFVLEtBQUM7UUFDWCxVQUFVOzRCQUVEOzs7WUFBTDtZQUVBLFFBQVEsS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLEVBQUU7WUFDOUIsY0FBYyxFQUFFLE1BQU0sRUFBRTtnQkFFckIsTUFBSyxFQUFFOztnQkFDTixFQUFFLEtBQVE7Z0JBQ1YsVUFBVTs7O1lBRWY7O21CQUNDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFOzs7SUFFcEMsc0JBQWE7Ozs7UUFFVCxZQUFRLElBQUcsZ0JBQUEsUUFBUTt3QkFFZixJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxLQUFDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
