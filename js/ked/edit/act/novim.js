var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let clip = kxk.clip

import novim from "../mode/novim.js"

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

export default {
    executeNovim:function (cmd)
    {
        var _18_29_
    
        if (cmd.motion)
        {
            cmd.motion.count = ((_18_29_=cmd.motion.count) != null ? _18_29_ : cmd.count)
        }
        switch (cmd.operator)
        {
            case 'change':
                return this.changeByMotion(cmd.motion,cmd.register)
    
            case 'delete':
                return this.applyChange(cmd)
    
            case 'yank':
                return this.yankByMotion(cmd.motion,cmd.register)
    
            case 'put':
                return this.putRegister(cmd.count,cmd.after,cmd.register)
    
            case 'move':
                return this.moveByMotion(cmd.motion,cmd.count)
    
            case 'searchNext':
                return this.jumpByHighlight(cmd.count,cmd.text,true)
    
            case 'searchPrev':
                return this.jumpByHighlight(cmd.count,cmd.text,false)
    
            case 'searchWord':
                return this.searchWord(cmd.count,cmd.forward)
    
            case 'matchBracket':
                return this.matchBracket()
    
            case 'openLine':
                return this.openLine(cmd.count,cmd.after)
    
            case 'insertAtIndent':
                return this.insertAtIndent()
    
            case 'replace':
                return this.replaceChars(cmd.char,cmd.count)
    
            case 'toggleCase':
                return this.toggleCase(cmd.count)
    
            case 'joinLinesVim':
                return this.joinLinesVim(cmd.count)
    
            case 'undo':
                return this.undoCommand(cmd.count)
    
            case 'repeat':
                return this.repeatChange(cmd.count)
    
            default:
                console.log('novim unknown operator ▸',cmd.operator)
        }
    
    },
    jumpByHighlight:function (count, text, forward)
    {
        var after, before, i, pos, sameStart, span, target
    
        if (_k_.empty(this.s.highlights))
        {
            if (!_k_.empty(text))
            {
                this.highlightText(text)
            }
            else
            {
                return
            }
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
    wordSpansForText:function (text)
    {
        var after, before, line, span, spans, x1, x2, y
    
        spans = []
        var list = _k_.list(belt.lineSpansForText(this.s.lines,text))
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            span = list[_d_]
            var _e_ = span; x1 = _e_[0]; y = _e_[1]; x2 = _e_[2]
    
            line = kseg.str(this.s.lines[y])
            before = (x1 > 0 ? line[x1 - 1] : '')
            after = (x2 < line.length ? line[x2] : '')
            if (/\w/.test(text[0]) && /\w/.test(before))
            {
                continue
            }
            if (/\w/.test(text[text.length - 1]) && /\w/.test(after))
            {
                continue
            }
            spans.push(span)
        }
        return spans
    },
    searchWord:function (count, forward)
    {
        var after, before, end, i, moved, pos, rng, span, spans, start, target, text
    
        text = this.wordAtCursor()
        if (_k_.empty(text))
        {
            return
        }
        novim.lastVind = text
        spans = this.wordSpansForText(text)
        this.setHighlights(spans)
        rng = belt.rangeOfClosestWordToPos(this.s.lines,this.mainCursor())
        if (!rng)
        {
            return
        }
        start = [rng[0],rng[1]]
        end = [rng[2],rng[3]]
        pos = this.mainCursor()
        moved = false
        for (var _f_ = i = 0, _10_ = _k_.max(1,(count != null ? count : 1)); (_f_ <= _10_ ? i < _k_.max(1,(count != null ? count : 1)) : i > _k_.max(1,(count != null ? count : 1))); (_f_ <= _10_ ? ++i : --i))
        {
            target = null
            var list = _k_.list(spans)
            for (var _11_ = 0; _11_ < list.length; _11_++)
            {
                span = list[_11_]
                after = span[1] > end[1] || (span[1] === end[1] && span[0] > end[0])
                before = span[1] < start[1] || (span[1] === start[1] && span[0] < start[0])
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
            start = [target[0],target[1]]
            end = [target[0] + text.length,target[1]]
            pos = [target[0],target[1]]
            moved = true
        }
        if (moved)
        {
            return this.setMainCursor(pos[0],pos[1])
        }
    },
    matchBracket:function ()
    {
        var c, ch, cursors, found, line, lines, moved, newCursors, open, segi, spans, target
    
        lines = this.s.lines
        cursors = this.allCursors()
        newCursors = []
        moved = false
        var list = _k_.list(cursors)
        for (var _12_ = 0; _12_ < list.length; _12_++)
        {
            c = list[_12_]
            line = lines[c[1]]
            segi = kseg.indexAtWidth(line,c[0])
            found = null
            while (segi < line.length)
            {
                ch = line[segi]
                if (_k_.in(ch,['(',')','[',']','{','}']))
                {
                    found = [kseg.widthAtSegi(line,segi),c[1],ch]
                    break
                }
                segi += 1
            }
            if (!found)
            {
                newCursors.push(c)
                continue
            }
            ch = found[2]
            open = ((function ()
            {
                switch (ch)
                {
                    case '(':
                    case '[':
                    case '{':
                        return ch
    
                    case ')':
                        return '('
    
                    case ']':
                        return '['
    
                    case '}':
                        return '{'
    
                }
    
            }).bind(this))()
            spans = motion.pairSpansForPosition(lines,found[0],found[1],open)
            if (!spans)
            {
                newCursors.push(c)
                continue
            }
            target = (open === ch ? [spans[1][0],spans[1][1]] : [spans[0][0],spans[0][1]])
            newCursors.push(target)
            moved = true
        }
        if (moved)
        {
            return this.setCursors(newCursors,{main:this.s.main})
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
        switch (this.lastChange.operator)
        {
            case 'replace':
                return this.replaceChars(this.lastChange.char,((count > 1 ? count : this.lastChange.count)))
    
            case 'toggleCase':
                return this.toggleCase(((count > 1 ? count : this.lastChange.count)))
    
            case 'joinLinesVim':
                return this.joinLinesVim(((count > 1 ? count : this.lastChange.count)))
    
            default:
                spec = _k_.copy(this.lastChange.motion)
                if (count > 1)
            {
                spec.count = count
            }
                return this.deleteByMotion(spec,this.lastChange.register)
        }
    
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
    selectByMotion:function (spec)
    {
        var cursor, lines, rng, rngs
    
        lines = this.s.lines
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            cursor = list[_13_]
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
        this.setSelections(rngs)
        return rngs
    },
    setNovimRegister:function (rngs, linewise, register)
    {
        var rng, texts
    
        texts = []
        var list = _k_.list(rngs)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            rng = list[_14_]
            texts.push(belt.textForLineRange(this.s.lines,rng))
        }
        this.novimRegister = {lines:texts.join('\n').split('\n'),linewise:linewise}
        if (this.usesClipboard(register))
        {
            return this.copyRegisterToClipboard(this.novimRegister)
        }
    },
    deleteByMotion:function (spec, register)
    {
        var linewise, rngs
    
        rngs = this.selectByMotion(spec)
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = motion.isLinewise(spec)
        this.setNovimRegister(rngs,linewise,register)
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        return this.end()
    },
    changeByMotion:function (spec, register)
    {
        var rngs
    
        rngs = this.selectByMotion(spec)
        if (_k_.empty(rngs))
        {
            return
        }
        this.setCursors(belt.endPositionsOfRanges(rngs))
        this.lastChange = null
        return this.stopMode('novim')
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
        for (var _16_ = i = 0, _17_ = n; (_16_ <= _17_ ? i < n : i > n); (_16_ <= _17_ ? ++i : --i))
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
        for (var _19_ = 0; _19_ < list1.length; _19_++)
        {
            idx = list1[_19_]
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
        for (var _1a_ = 0; _1a_ < list.length; _1a_++)
        {
            c = list[_1a_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _1b_ = belt.insertTextAtPositions(lines,text,posl); newLines = _1b_[0]; newPosl = _1b_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _1c_ = i = 0, _1d_ = n; (_1c_ <= _1d_ ? i < n : i > n); (_1c_ <= _1d_ ? ++i : --i))
        {
            this.putLines([''],after)
        }
        this.end()
        return this.stopMode('novim')
    },
    insertAtIndent:function ()
    {
        this.moveCursors('ind')
        return this.stopMode('novim')
    },
    replaceChars:function (text, count)
    {
        var c, changed, cursors, i, line, lines, n, newLine, repl, segi
    
        n = _k_.max(1,((count != null ? count : 1)))
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            c = list[_1e_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _1f_ = i = 0, _20_ = n; (_1f_ <= _20_ ? i < n : i > n); (_1f_ <= _20_ ? ++i : --i))
            {
                repl.push(text)
            }
            newLine = line.slice(0, typeof segi === 'number' ? segi : -1).concat(repl).concat(line.slice(segi + n))
            lines[c[1]] = newLine
            c[0] = kseg.width(newLine.slice(0, segi + n))
            changed = true
        }
        if (!changed)
        {
            return
        }
        this.begin()
        this.setLines(lines)
        this.setCursors(cursors,{main:this.s.main})
        this.end()
        return this.lastChange = {operator:'replace',char:text,count:n}
    },
    toggleCase:function (count)
    {
        var c, changed, cursors, i, lasti, line, lines, n, seg, segi, upper
    
        n = _k_.max(1,((count != null ? count : 1)))
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _21_ = 0; _21_ < list.length; _21_++)
        {
            c = list[_21_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _22_ = i = segi, _23_ = lasti; (_22_ <= _23_ ? i <= lasti : i >= lasti); (_22_ <= _23_ ? ++i : --i))
            {
                seg = line[i]
                upper = seg.toUpperCase()
                line[i] = (upper !== seg ? upper : seg.toLowerCase())
            }
            lines[c[1]] = line
            c[0] = kseg.width(line.slice(0, typeof _k_.min(lasti + 1,line.length - 1) === 'number' ? _k_.min(lasti + 1,line.length - 1) : -1))
            changed = true
        }
        if (!changed)
        {
            return
        }
        this.begin()
        this.setLines(lines)
        this.setCursors(cursors,{main:this.s.main})
        this.end()
        return this.lastChange = {operator:'toggleCase',count:n}
    },
    joinLinesVim:function (count)
    {
        var block, blocks, by, c, cursors, first, j, joined, lines, n, newCursors, nx, ny, part, parts, seam, starts, take, text, x, y
    
        n = _k_.max(2,((count != null ? count : 1)))
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        starts = []
        var list = _k_.list(cursors)
        for (var _24_ = 0; _24_ < list.length; _24_++)
        {
            c = list[_24_]
            if (c[1] < lines.length - 1 && !(_k_.in(c[1],starts)))
            {
                starts.push(c[1])
            }
        }
        if (_k_.empty(starts))
        {
            return
        }
        starts.sort(function (a, b)
        {
            return a - b
        })
        blocks = []
        var list1 = _k_.list(starts)
        for (var _25_ = 0; _25_ < list1.length; _25_++)
        {
            y = list1[_25_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _26_ = 0; _26_ < list2.length; _26_++)
        {
            block = list2[_26_]
            var _27_ = block; y = _27_[0]; take = _27_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _28_ = j = 1, _29_ = take; (_28_ <= _29_ ? j < take : j > take); (_28_ <= _29_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _2a_ = 0; _2a_ < list3.length; _2a_++)
            {
                part = list3[_2a_]
                if (_k_.empty(part))
                {
                    continue
                }
                joined = (_k_.empty((joined)) ? part : joined + ' ' + part)
            }
            block[2] = kseg.width(first)
            lines.splice(y,take,(kseg,joined))
        }
        newCursors = []
        var list4 = _k_.list(cursors)
        for (var _2b_ = 0; _2b_ < list4.length; _2b_++)
        {
            c = list4[_2b_]
            var _2c_ = c; x = _2c_[0]; y = _2c_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _2d_ = 0; _2d_ < list5.length; _2d_++)
            {
                block = list5[_2d_]
                var _2e_ = block; by = _2e_[0]; take = _2e_[1]; seam = _2e_[2]
    
                if ((by <= y && y < by + take))
                {
                    ny = by
                    nx = seam
                    break
                }
                if (by + take <= y)
                {
                    ny -= take - 1
                }
            }
            newCursors.push([nx,ny])
        }
        this.begin()
        this.setLines(lines)
        this.setCursors(newCursors,{main:this.s.main})
        this.end()
        return this.lastChange = {operator:'joinLinesVim',count:n}
    },
    moveByMotion:function (spec, count = 1)
    {
        var i, n, _556_23_
    
        n = ((_556_23_=spec.count) != null ? _556_23_ : count)
        if (spec.kind === 'charFind')
        {
            return this.moveByCharFind(spec,n)
        }
        else
        {
            for (var _2f_ = i = 1, _30_ = n; (_2f_ <= _30_ ? i <= n : i >= n); (_2f_ <= _30_ ? ++i : --i))
            {
                this.moveCursors(spec.kind)
            }
        }
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
        for (var _32_ = 0; _32_ < list.length; _32_++)
        {
            p = list[_32_]
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
        for (var _33_ = 0; _33_ < list.length; _33_++)
        {
            c = list[_33_]
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
        for (var _34_ = 0; _34_ < list.length; _34_++)
        {
            c = list[_34_]
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
        for (var _35_ = i = 0, _36_ = n; (_35_ <= _36_ ? i < n : i > n); (_35_ <= _36_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCOzs7SUFJSCx1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztnQkFFckIsSUFBSTs7aUJBQ1A7dUJBQWdCLEtBQUMsZUFBbUIsSUFBSSxPQUFRLElBQUk7O2lCQUNwRDt1QkFBZ0IsS0FBQyxZQUFZOztpQkFDN0I7dUJBQWdCLEtBQUMsYUFBbUIsSUFBSSxPQUFRLElBQUk7O2lCQUNwRDt1QkFBZ0IsS0FBQyxZQUFtQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUM5RDt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJLE9BQVEsSUFBSTs7aUJBQ3BEO3VCQUFnQixLQUFDLGdCQUFtQixJQUFJLE1BQU0sSUFBSSxLQUFLOztpQkFDdkQ7dUJBQWdCLEtBQUMsZ0JBQW1CLElBQUksTUFBTSxJQUFJLEtBQUs7O2lCQUN2RDt1QkFBZ0IsS0FBQyxXQUFtQixJQUFJLE1BQU0sSUFBSTs7aUJBQ2xEO3VCQUFpQixLQUFDOztpQkFDbEI7dUJBQWdCLEtBQUMsU0FBbUIsSUFBSSxNQUFNLElBQUk7O2lCQUNsRDt1QkFBbUIsS0FBQzs7aUJBQ3BCO3VCQUFnQixLQUFDLGFBQW1CLElBQUksS0FBSyxJQUFJOztpQkFDakQ7dUJBQWdCLEtBQUMsV0FBbUIsSUFBSTs7aUJBQ3hDO3VCQUFpQixLQUFDLGFBQWtCLElBQUk7O2lCQUN4Qzt1QkFBZ0IsS0FBQyxZQUFtQixJQUFJOztpQkFDeEM7dUJBQWdCLEtBQUMsYUFBbUIsSUFBSTs7O2dCQUN4QixZQUFJLDJCQUEyQixJQUFJOzs7O0lBRTNELDBCQUFpQixPQUFNLE1BQUs7Ozs7c0JBRWYsS0FBQyxFQUFFOzsyQkFDQzs7Z0JBQ0ws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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
