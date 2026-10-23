var _k_ = {copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
    
            case 'yank':
                return this.yankByMotion(cmd.motion)
    
            case 'put':
                return this.putRegister(cmd.count,cmd.after)
    
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
    yankByMotion:function (spec)
    {
        var cursor, cursors, idx, lines, linewise, rng, texts
    
        lines = this.s.lines
        linewise = motion.isLinewise(spec)
        cursors = this.allCursors()
        texts = []
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            rng = motion.range(lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            if (belt.isEmptyRange(rng) && !linewise)
            {
                continue
            }
            texts.push(belt.textForLineRange(lines,rng))
            if (!linewise)
            {
                cursors[idx] = [rng[0],rng[1]]
            }
        }
        if (_k_.empty(texts))
        {
            return
        }
        this.novimRegister = {lines:texts.join('\n').split('\n'),linewise:linewise}
        if (!linewise)
        {
            this.setCursors(cursors,{main:this.s.main})
            return this.clampCursorsToLines()
        }
    },
    putRegister:function (count, after)
    {
        var i, n, reg
    
        reg = this.novimRegister
        if (!reg || _k_.empty(reg.lines))
        {
            return
        }
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _c_ = i = 0, _d_ = n; (_c_ <= _d_ ? i < n : i > n); (_c_ <= _d_ ? ++i : --i))
        {
            if (reg.linewise)
            {
                this.putLines(reg.lines,after)
            }
            else
            {
                this.putText(reg.lines.join('\n'),after)
            }
        }
        return this.end()
    },
    putLines:function (insertLines, after)
    {
        var at, c, cursors, first, idx, lines, newCursors, offset, order, segls, x, y
    
        segls = kseg.segls(insertLines)
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        order = []
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            c = list[idx]
            order.push(idx)
        }
        order.sort(function (a, b)
        {
            if (cursors[a][1] === cursors[b][1])
            {
                return cursors[a][0] - cursors[b][0]
            }
            else
            {
                return cursors[a][1] - cursors[b][1]
            }
        })
        newCursors = []
        offset = 0
        var list1 = _k_.list(order)
        for (var _f_ = 0; _f_ < list1.length; _f_++)
        {
            idx = list1[_f_]
            y = cursors[idx][1] + offset
            at = (after ? y + 1 : y)
            lines = lines.slice(0, typeof at === 'number' ? at : -1).concat(segls).concat(lines.slice(at))
            first = segls[0]
            x = _k_.min(belt.numIndent(first),_k_.max(0,kseg.width(first) - 1))
            newCursors.push([x,at])
            offset += segls.length
        }
        this.setLines(lines)
        return this.setCursors(newCursors)
    },
    putText:function (text, after)
    {
        var c, cursors, insertls, lastWidth, lines, newCursors, newLines, newPosl, pos, posl, width, x
    
        insertls = text.split('\n')
        lines = this.s.lines
        cursors = this.allCursors()
        posl = []
        var list = _k_.list(cursors)
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            c = list[_10_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _11_ = belt.insertTextAtPositions(lines,text,posl); newLines = _11_[0]; newPosl = _11_[1]
    
        newCursors = []
        var list1 = _k_.list(newPosl)
        for (var _12_ = 0; _12_ < list1.length; _12_++)
        {
            pos = list1[_12_]
            if (insertls.length > 1)
            {
                lastWidth = kseg.width(kseg(insertls.slice(-1)[0]))
                newCursors.push([_k_.max(0,pos[0] - lastWidth),pos[1] - (insertls.length - 1)])
            }
            else
            {
                newCursors.push([_k_.max(0,pos[0] - 1),pos[1]])
            }
        }
        this.setLines(newLines)
        return this.setCursors(newCursors)
    },
    moveByMotion:function (spec)
    {
        var i, n, _196_30_
    
        n = _k_.max(1,(((_196_30_=spec.count) != null ? _196_30_ : 1)))
        if (_k_.in(spec.kind,['left','right']))
        {
            for (var _13_ = i = 0, _14_ = n; (_13_ <= _14_ ? i < n : i > n); (_13_ <= _14_ ? ++i : --i))
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
            this.moveCursors('eol')
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
        for (var _15_ = 0; _15_ < list.length; _15_++)
        {
            c = list[_15_]
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
        for (var _16_ = 0; _16_ < list.length; _16_++)
        {
            c = list[_16_]
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
        for (var _17_ = i = 0, _18_ = n; (_17_ <= _18_ ? i < n : i > n); (_17_ <= _18_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09Ba0JhLFVBQUE7SUFBTTs7T0FDTCxXQUFQO09BQVksYUFBWjs7O0lBSUgsdUJBQWM7O1FBRVYsWUFBSSxrQkFBa0I7Z0JBRWYsSUFBSTs7aUJBQ1A7dUJBQVcsS0FBQyxZQUFZOztpQkFDeEI7dUJBQVcsS0FBQyxhQUFhLElBQUk7O2lCQUM3Qjt1QkFBVyxLQUFDLFlBQVksSUFBSSxNQUFNLElBQUk7O2lCQUN0Qzt1QkFBVyxLQUFDLGFBQWEsSUFBSTs7aUJBQzdCO3VCQUFXLEtBQUMsWUFBWSxJQUFJOztpQkFDNUI7dUJBQVcsS0FBQyxhQUFhLElBQUk7OztnQkFDbEIsWUFBSSwyQkFBMkIsSUFBSTs7OztJQUV0RCxzQkFBYTs7UUFFVCxLQUFDLGFBQWE7ZUFDZCxLQUFDLGVBQWUsSUFBSTs7SUFFeEIsdUJBQWM7Ozs7YUFFQSxLQUFDOzs7O1FBRVgsZ0JBQVksS0FBQyxXQUFXO1lBSUYsUUFBUTs7WUFBOUIsS0FBSyxRQUFROztlQUViLEtBQUMsZUFBZTs7SUFFcEIseUJBQWdCOzs7O1FBRVosUUFBUSxLQUFDLEVBQUU7UUFDWDs0QkFFYyxLQUFDOzs7WUFBWDtZQUVBLE1BQU0sT0FBTyxNQUFNLE1BQU0sT0FBTztpQkFDaEI7O2dCQUFoQjs7Z0JBSVksS0FBSyxhQUFhLFNBQWEsT0FBTyxXQUFXOztnQkFBN0Q7O1lBRUEsS0FBSyxLQUFLOztRQUVkLFlBQUksaUJBQWlCO3NCQUVUOzs7O1FBR1osT0FBTyxPQUFPLFlBQVk7UUFFMUIsS0FBQztRQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYSxPQUFPLFdBQVc7ZUFFbkQsS0FBQzs7SUFJTCx1QkFBYzs7OztRQUVWLFFBQVcsS0FBQyxFQUFFO1FBQ2QsV0FBVyxPQUFPLFdBQVc7UUFDN0IsVUFBVyxLQUFDO1FBQ1o7NEJBRW1CO2FBQVA7O1lBQVI7WUFFQSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
