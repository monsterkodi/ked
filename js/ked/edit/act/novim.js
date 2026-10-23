var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import clip from "../../../kxk/clip.js"

import novim from "../mode/novim.js"

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

export default {
    executeNovim:function (cmd)
    {
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
    
            case 'searchNext':
                return this.jumpByHighlight(cmd.count,true)
    
            case 'searchPrev':
                return this.jumpByHighlight(cmd.count,false)
    
            case 'undo':
                return this.undoCommand(cmd.count)
    
            case 'repeat':
                return this.repeatChange(cmd.count)
    
            default:
                console.log('novim unknown operator ▸',cmd.operator)
        }
    
    },
    jumpByHighlight:function (count = 1, forward = true)
    {
        var after, before, i, pos, sameStart, span, target
    
        if (_k_.empty(this.s.highlights))
        {
            return
        }
        pos = this.mainCursor()
        for (var _a_ = i = 0, _b_ = count; (_a_ <= _b_ ? i < count : i > count); (_a_ <= _b_ ? ++i : --i))
        {
            target = null
            var list = _k_.list(this.s.highlights)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                span = list[_c_]
                sameStart = span[1] === pos[1] && span[0] === pos[0]
                if (sameStart)
                {
                    continue
                }
                after = span[1] > pos[1] || (span[1] === pos[1] && span[0] > pos[0])
                before = span[1] < pos[1] || (span[1] === pos[1] && span[0] < pos[0])
                if (forward && after)
                {
                    target = span
                    break
                }
                if (!forward && before)
                {
                    target = span
                }
            }
            if (!target)
            {
                break
            }
            pos = [target[0],target[1]]
        }
        return this.setMainCursor(pos)
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
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            cursor = list[_d_]
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
        if (_k_.empty(rngs))
        {
            return
        }
        rngs = motion.mergeRanges(rngs)
        linewise = motion.isLinewise(spec)
        texts = []
        var list1 = _k_.list(rngs)
        for (var _e_ = 0; _e_ < list1.length; _e_++)
        {
            rng = list1[_e_]
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
        for (var _10_ = i = 0, _11_ = n; (_10_ <= _11_ ? i < n : i > n); (_10_ <= _11_ ? ++i : --i))
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
        for (var _13_ = 0; _13_ < list1.length; _13_++)
        {
            idx = list1[_13_]
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
        var c, cursors, lines, newLines, newPosl, posl, width, x
    
        lines = this.s.lines
        cursors = this.allCursors()
        posl = []
        var list = _k_.list(cursors)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            c = list[_14_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _15_ = belt.insertTextAtPositions(lines,text,posl); newLines = _15_[0]; newPosl = _15_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    moveByMotion:function (spec)
    {
        var i, n, _240_30_
    
        n = _k_.max(1,(((_240_30_=spec.count) != null ? _240_30_ : 1)))
        if (_k_.in(spec.kind,['left','right']))
        {
            for (var _16_ = i = 0, _17_ = n; (_16_ <= _17_ ? i < n : i > n); (_16_ <= _17_ ? ++i : --i))
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
        else if (_k_.in(spec.kind,['word','wordBack','wordEnd','wordBig','wordBackBig','wordEndBig']))
        {
            this.moveByWordMotion(spec.kind,n)
        }
        else if (spec.kind === 'charFind')
        {
            this.moveByCharFind(spec,n)
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
    moveByWordMotion:function (kind, count)
    {
        var big, cursor, cursors, i, idx, lines, n, pos
    
        n = _k_.max(1,((count != null ? count : 1)))
        lines = this.s.lines
        cursors = this.allCursors()
        big = _k_.in(kind,['wordBig','wordBackBig','wordEndBig'])
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            pos = [cursor[0],cursor[1]]
            for (var _19_ = i = 0, _1a_ = n; (_19_ <= _1a_ ? i < n : i > n); (_19_ <= _1a_ ? ++i : --i))
            {
                if (_k_.in(kind,['word','wordBig']))
                {
                    pos = motion.wordStartAfter(lines,pos,false,big)
                }
                else if (_k_.in(kind,['wordBack','wordBackBig']))
                {
                    pos = motion.wordStartBefore(lines,pos,big)
                }
                else
                {
                    pos = motion.wordEndAfter(lines,pos,big)
                }
            }
            if (_k_.in(kind,['wordEnd','wordEndBig']))
            {
                pos = this.widthBefore(lines,pos)
            }
            cursors[idx] = pos
        }
        return this.setCursors(cursors,{main:this.s.main})
    },
    moveByCharFind:function (spec, n)
    {
        var cursor, cursors, forward, idx, lines, pos
    
        lines = this.s.lines
        cursors = this.allCursors()
        forward = spec.forward !== false
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            pos = motion.charFindPosition(lines,cursor,spec.target,n,spec.till,forward)
            if (pos && spec.repeat && spec.till && pos[0] === cursor[0] && pos[1] === cursor[1])
            {
                pos = motion.charFindPosition(lines,cursor,spec.target,n + 1,spec.till,forward)
            }
            if (pos)
            {
                cursors[idx] = pos
            }
        }
        this.setCursors(cursors,{main:this.s.main})
        return this.highlightCharFind(spec)
    },
    highlightCharFind:function (spec)
    {
        var forward, p, spans, width
    
        spans = []
        forward = spec.forward !== false
        var list = _k_.list(motion.charFindLandings(this.s.lines,spec.target,spec.till,forward))
        for (var _1c_ = 0; _1c_ < list.length; _1c_++)
        {
            p = list[_1c_]
            width = kseg.width(this.s.lines[p[1]])
            if (p[0] < width)
            {
                spans.push([p[0],p[1],p[0] + 1,p[1]])
            }
        }
        return this.setHighlights(spans)
    },
    widthBefore:function (lines, pos)
    {
        var i, segs
    
        segs = lines[pos[1]]
        i = kseg.indexAtWidth(segs,pos[0])
        i = _k_.max(0,i - 1)
        return [kseg.widthAtSegi(segs,i),pos[1]]
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
        for (var _1d_ = 0; _1d_ < list.length; _1d_++)
        {
            c = list[_1d_]
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
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            c = list[_1e_]
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
        for (var _1f_ = i = 0, _20_ = n; (_1f_ <= _20_ ? i < n : i > n); (_1f_ <= _20_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNOztPQUNBLFdBQU47O09BQ0ksWUFBVjs7T0FDVSxXQUFWO09BQWUsYUFBZjs7O0lBSUgsdUJBQWM7O2dCQUlILElBQUk7O2lCQUNQO3VCQUFnQixLQUFDLFlBQVk7O2lCQUM3Qjt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJLE9BQVEsSUFBSTs7aUJBQ3BEO3VCQUFnQixLQUFDLFlBQW1CLElBQUksTUFBUSxJQUFJLE1BQU0sSUFBSTs7aUJBQzlEO3VCQUFnQixLQUFDLGFBQW1CLElBQUk7O2lCQUN4Qzt1QkFBZ0IsS0FBQyxnQkFBbUIsSUFBSSxNQUFNOztpQkFDOUM7dUJBQWdCLEtBQUMsZ0JBQW1CLElBQUksTUFBTTs7aUJBQzlDO3VCQUFnQixLQUFDLFlBQW1CLElBQUk7O2lCQUN4Qzt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJOzs7Z0JBQ3hCLFlBQUksMkJBQTJCLElBQUk7Ozs7SUFFM0QsMEJBQWlCLFFBQU0sR0FBRSxVQUFROzs7O3NCQUVsQixLQUFDLEVBQUU7Ozs7UUFFZCxNQUFNLEtBQUM7dUJBRUgsSUFBSyxTQUFJLHlCQUFBLFlBQUE7O1lBRVQsU0FBUztnQ0FFRyxLQUFDLEVBQUU7OztnQkFBWDtnQkFFQSxZQUFZLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxPQUFNLElBQUk7b0JBQzlDOztvQkFBWTs7Z0JBRWYsUUFBUyxLQUFLLEtBQU0sSUFBSSxPQUFPLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxLQUFLLElBQUk7Z0JBQ25FLFNBQVMsS0FBSyxLQUFNLElBQUksT0FBTyxLQUFLLE9BQU0sSUFBSSxNQUFPLEtBQUssS0FBSyxJQUFJO29CQUUvRCxXQUFZOztvQkFDWixTQUFTO29CQUNUOztxQkFDRyxXQUFZOztvQkFDZixTQUFTOzs7aUJBRVY7O2dCQUNIOztZQUVKLE9BQU8sT0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
