var _k_ = {copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import clip from "../../../kxk/clip.js"

import novim from "../mode/novim.js"

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
                return this.yankByMotion(cmd.motion,cmd.register)
    
            case 'put':
                return this.putRegister(cmd.count,cmd.after,cmd.register)
    
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
        return this.deleteByMotion(cmd.motion,cmd.register)
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
        return this.deleteByMotion(spec,this.lastChange.register)
    },
    usesClipboard:function (register)
    {
        if (register === 'clipboard')
        {
            return true
        }
        if (register)
        {
            return false
        }
        return novim.clipboardEnabled()
    },
    copyRegisterToClipboard:function (reg)
    {
        var text
    
        text = reg.lines.join('\n')
        if (reg.linewise)
        {
            text += '\n'
        }
        if (clip.detect() === 'none')
        {
            return clip.text = text
        }
        else
        {
            return clip.copy(text)
        }
    },
    registerFromClipboard:function ()
    {
        var lines, linewise, text
    
        text = (clip.detect() === 'none' ? clip.text : clip.paste())
        if (_k_.empty(text))
        {
            return null
        }
        linewise = text.endsWith('\n')
        lines = text.split('\n')
        if (linewise)
        {
            lines.pop()
        }
        return {lines:lines,linewise:linewise}
    },
    deleteByMotion:function (spec, register)
    {
        var cursor, lines, linewise, rng, rngs, texts
    
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
        linewise = motion.isLinewise(spec)
        texts = []
        var list1 = _k_.list(rngs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            rng = list1[_b_]
            texts.push(belt.textForLineRange(lines,rng))
        }
        this.novimRegister = {lines:texts.join('\n').split('\n'),linewise:linewise}
        if (this.usesClipboard(register))
        {
            this.copyRegisterToClipboard(this.novimRegister)
        }
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        return this.end()
    },
    yankByMotion:function (spec, register)
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
        if (this.usesClipboard(register))
        {
            this.copyRegisterToClipboard(this.novimRegister)
        }
        if (!linewise)
        {
            this.setCursors(cursors,{main:this.s.main})
            return this.clampCursorsToLines()
        }
    },
    putRegister:function (count, after, register)
    {
        var i, n, reg
    
        reg = this.novimRegister
        if (this.usesClipboard(register))
        {
            reg = this.registerFromClipboard()
        }
        if (!reg || _k_.empty(reg.lines))
        {
            return
        }
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _d_ = i = 0, _e_ = n; (_d_ <= _e_ ? i < n : i > n); (_d_ <= _e_ ? ++i : --i))
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
        for (var _10_ = 0; _10_ < list1.length; _10_++)
        {
            idx = list1[_10_]
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
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            c = list[_11_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _12_ = belt.insertTextAtPositions(lines,text,posl); newLines = _12_[0]; newPosl = _12_[1]
    
        newCursors = []
        var list1 = _k_.list(newPosl)
        for (var _13_ = 0; _13_ < list1.length; _13_++)
        {
            pos = list1[_13_]
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
        var i, n, _248_30_
    
        n = _k_.max(1,(((_248_30_=spec.count) != null ? _248_30_ : 1)))
        if (_k_.in(spec.kind,['left','right']))
        {
            for (var _14_ = i = 0, _15_ = n; (_14_ <= _15_ ? i < n : i > n); (_14_ <= _15_ ? ++i : --i))
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
        for (var _16_ = 0; _16_ < list.length; _16_++)
        {
            c = list[_16_]
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
        for (var _17_ = 0; _17_ < list.length; _17_++)
        {
            c = list[_17_]
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
        for (var _18_ = i = 0, _19_ = n; (_18_ <= _19_ ? i < n : i > n); (_18_ <= _19_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09Ba0JhLFVBQUE7SUFBTTs7T0FDQSxXQUFOOztPQUNJLFlBQVY7O09BQ1UsV0FBVjtPQUFlLGFBQWY7OztJQUlILHVCQUFjOztRQUVWLFlBQUksa0JBQWtCO2dCQUVmLElBQUk7O2lCQUNQO3VCQUFXLEtBQUMsWUFBWTs7aUJBQ3hCO3VCQUFXLEtBQUMsYUFBYSxJQUFJLE9BQU8sSUFBSTs7aUJBQ3hDO3VCQUFXLEtBQUMsWUFBWSxJQUFJLE1BQU0sSUFBSSxNQUFNLElBQUk7O2lCQUNoRDt1QkFBVyxLQUFDLGFBQWEsSUFBSTs7aUJBQzdCO3VCQUFXLEtBQUMsWUFBWSxJQUFJOztpQkFDNUI7dUJBQVcsS0FBQyxhQUFhLElBQUk7OztnQkFDbEIsWUFBSSwyQkFBMkIsSUFBSTs7OztJQUV0RCxzQkFBYTs7UUFFVCxLQUFDLGFBQWE7ZUFDZCxLQUFDLGVBQWUsSUFBSSxPQUFPLElBQUk7O0lBRW5DLHVCQUFjOzs7O2FBRUEsS0FBQzs7OztRQUVYLGdCQUFZLEtBQUMsV0FBVztZQUlGLFFBQVE7O1lBQTlCLEtBQUssUUFBUTs7ZUFFYixLQUFDLGVBQWUsS0FBSyxLQUFDLFdBQVc7O0lBSXJDLHdCQUFlOztZQUVBLGFBQVk7O21CQUFyQjs7WUFDUzs7bUJBQVQ7O2VBRUYsTUFBTTs7SUFFVixrQ0FBeUI7Ozs7UUFFckIsT0FBTyxJQUFJLE1BQU0sS0FBSztZQUNOLElBQUk7O1lBQXBCLFFBQVE7O1lBSUwsS0FBSyxhQUFZOzttQkFDaEIsS0FBSyxPQUFPOzs7O21CQUVaLEtBQUssS0FBSzs7O0lBRWxCOzs7O1FBRUksUUFBTyxLQUFLLGFBQVksU0FBUyxLQUFLLE9BQU8sS0FBSztzQkFFakM7O21CQUFkOztRQUlILFdBQVcsS0FBSyxTQUFTO1FBQ3pCLFFBQVcsS0FBSyxNQUFNO1lBRVA7O1lBQWYsTUFBTTs7Z0JBRUosTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
