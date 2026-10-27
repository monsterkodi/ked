var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        if (this.visual && !(_k_.in(cmd.operator,['move','matchBracket','visualDelete','visualYank','visualChange','visualSwap','visualTextObject'])))
        {
            this.stopVisual()
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
                return this.moveByMotionWithVisual(cmd.motion,cmd.count)
    
            case 'searchNext':
                return this.jumpByHighlight(cmd.count,cmd.text,true)
    
            case 'searchPrev':
                return this.jumpByHighlight(cmd.count,cmd.text,false)
    
            case 'searchWord':
                return this.searchWord(cmd.count,cmd.forward)
    
            case 'matchBracket':
                this.matchBracket()
                if (this.visual)
                {
                    return this.updateVisual()
                }
                break
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
    
            case 'visualDelete':
                return this.visualDelete(cmd.register)
    
            case 'visualYank':
                return this.visualYank(cmd.register)
    
            case 'visualChange':
                return this.visualChange()
    
            case 'visualSwap':
                return this.visualSwap()
    
            case 'visualTextObject':
                return this.visualTextObject(cmd.motion)
    
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
    startVisual:function (kind)
    {
        if (this.visual === kind)
        {
            return this.stopVisual()
        }
        if (!this.visual)
        {
            this.visualAnchors = this.allCursors().map(function (c)
            {
                return [c[0],c[1]]
            })
        }
        this.visual = kind
        return this.updateVisual()
    },
    stopVisual:function (keepSelections = false)
    {
        this.visual = null
        this.visualAnchors = []
        if (!keepSelections)
        {
            return this.setSelections([])
        }
    },
    visualPairs:function ()
    {
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _227_32_
    
        cursors = this.allCursors()
        anchors = this.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_227_32_=anchors[i]) != null ? _227_32_ : [cursor[0],cursor[1]])
            pairs.push([[anchor[0],anchor[1]],[cursor[0],cursor[1]]])
        }
        pairs.sort(function (a, b)
        {
            if (a[1][1] === b[1][1])
            {
                return a[1][0] - b[1][0]
            }
            else
            {
                return a[1][1] - b[1][1]
            }
        })
        unique = []
        var list1 = _k_.list(pairs)
        for (var _14_ = 0; _14_ < list1.length; _14_++)
        {
            pair = list1[_14_]
            if (unique.length && belt.samePos(unique.slice(-1)[0][1],pair[1]))
            {
                continue
            }
            unique.push(pair)
        }
        return unique
    },
    visualRangeForPair:function (anchor, cursor)
    {
        var a, b, y1, y2
    
        if (this.visual === 'line')
        {
            y1 = _k_.min(anchor[1],cursor[1])
            y2 = _k_.max(anchor[1],cursor[1])
            return [0,y1,kseg.width(this.s.lines[y2]),y2]
        }
        a = [anchor[0],anchor[1]]
        b = [cursor[0],cursor[1]]
        if (b[1] < a[1] || b[1] === a[1] && b[0] < a[0])
        {
            var _15_ = [b,a]; a = _15_[0]; b = _15_[1]
    
        }
        return [a[0],a[1],b[0],b[1]]
    },
    updateVisual:function ()
    {
        var anchors, cursor, cursors, i, pair, pairs, rngs, same
    
        if (!this.visual)
        {
            return
        }
        pairs = this.visualPairs()
        cursors = pairs.map(function (p)
        {
            return [p[1][0],p[1][1]]
        })
        anchors = pairs.map(function (p)
        {
            return [p[0][0],p[0][1]]
        })
        this.visualAnchors = anchors
        same = cursors.length === this.s.cursors.length
        if (same)
        {
            var list = _k_.list(cursors)
            for (i = 0; i < list.length; i++)
            {
                cursor = list[i]
                if (!belt.samePos(cursor,this.s.cursors[i]))
                {
                    same = false
                }
            }
        }
        if (!same)
        {
            this.setCursors(cursors,{main:this.mainCursor()})
        }
        rngs = []
        var list1 = _k_.list(pairs)
        for (var _17_ = 0; _17_ < list1.length; _17_++)
        {
            pair = list1[_17_]
            rngs.push(this.visualRangeForPair(pair[0],pair[1]))
        }
        return this.setSelections(rngs)
    },
    visualDelete:function (register)
    {
        var linewise, rngs
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = this.visual === 'line'
        this.setNovimRegister(rngs,linewise,register)
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        this.end()
        return this.stopVisual()
    },
    visualYank:function (register)
    {
        var linewise, rngs, starts
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = this.visual === 'line'
        this.setNovimRegister(rngs,linewise,register)
        starts = rngs.map(function (r)
        {
            return [r[0],r[1]]
        })
        this.setCursors(starts,{main:this.mainCursor()})
        return this.stopVisual()
    },
    visualChange:function ()
    {
        var rngs
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.mainCursor()})
        this.lastChange = null
        this.visual = null
        this.visualAnchors = []
        return this.stopMode('novim')
    },
    visualSwap:function ()
    {
        var anchor, anchors, cursor, cursors, i
    
        if (!this.visual)
        {
            return
        }
        cursors = this.allCursors()
        anchors = this.visualAnchors
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            if (!anchors[i])
            {
                continue
            }
            anchor = anchors[i]
            anchors[i] = [cursor[0],cursor[1]]
            cursors[i] = [anchor[0],anchor[1]]
        }
        this.visualAnchors = anchors
        this.setCursors(cursors,{main:this.mainCursor()})
        return this.updateVisual()
    },
    visualTextObject:function (spec)
    {
        var cursor, cursors, rng, rngs
    
        if (!this.visual)
        {
            return
        }
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _19_ = 0; _19_ < list.length; _19_++)
        {
            cursor = list[_19_]
            rng = motion.range(this.s.lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            if (belt.isEmptyRange(rng))
            {
                continue
            }
            rngs.push(rng)
        }
        if (_k_.empty(rngs))
        {
            return
        }
        this.visualAnchors = rngs.map(function (r)
        {
            return [r[0],r[1]]
        })
        cursors = rngs.map(function (r)
        {
            return [_k_.max(r[0],r[2] - 1),r[3]]
        })
        this.setCursors(cursors,{main:this.mainCursor()})
        return this.updateVisual()
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
        for (var _1a_ = 0; _1a_ < list.length; _1a_++)
        {
            cursor = list[_1a_]
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
        for (var _1b_ = 0; _1b_ < list.length; _1b_++)
        {
            rng = list[_1b_]
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
        for (var _1d_ = i = 0, _1e_ = n; (_1d_ <= _1e_ ? i < n : i > n); (_1d_ <= _1e_ ? ++i : --i))
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
        for (var _20_ = 0; _20_ < list1.length; _20_++)
        {
            idx = list1[_20_]
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
        for (var _21_ = 0; _21_ < list.length; _21_++)
        {
            c = list[_21_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _22_ = belt.insertTextAtPositions(lines,text,posl); newLines = _22_[0]; newPosl = _22_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _23_ = i = 0, _24_ = n; (_23_ <= _24_ ? i < n : i > n); (_23_ <= _24_ ? ++i : --i))
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
        for (var _25_ = 0; _25_ < list.length; _25_++)
        {
            c = list[_25_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _26_ = i = 0, _27_ = n; (_26_ <= _27_ ? i < n : i > n); (_26_ <= _27_ ? ++i : --i))
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
        for (var _28_ = 0; _28_ < list.length; _28_++)
        {
            c = list[_28_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _29_ = i = segi, _2a_ = lasti; (_29_ <= _2a_ ? i <= lasti : i >= lasti); (_29_ <= _2a_ ? ++i : --i))
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
        for (var _2b_ = 0; _2b_ < list.length; _2b_++)
        {
            c = list[_2b_]
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
        for (var _2c_ = 0; _2c_ < list1.length; _2c_++)
        {
            y = list1[_2c_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _2d_ = 0; _2d_ < list2.length; _2d_++)
        {
            block = list2[_2d_]
            var _2e_ = block; y = _2e_[0]; take = _2e_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _2f_ = j = 1, _30_ = take; (_2f_ <= _30_ ? j < take : j > take); (_2f_ <= _30_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _31_ = 0; _31_ < list3.length; _31_++)
            {
                part = list3[_31_]
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
        for (var _32_ = 0; _32_ < list4.length; _32_++)
        {
            c = list4[_32_]
            var _33_ = c; x = _33_[0]; y = _33_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _34_ = 0; _34_ < list5.length; _34_++)
            {
                block = list5[_34_]
                var _35_ = block; by = _35_[0]; take = _35_[1]; seam = _35_[2]
    
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
        var i, n, _753_23_
    
        n = ((_753_23_=spec.count) != null ? _753_23_ : count)
        if (spec.kind === 'charFind')
        {
            return this.moveByCharFind(spec,n)
        }
        else
        {
            for (var _36_ = i = 1, _37_ = n; (_36_ <= _37_ ? i <= n : i >= n); (_36_ <= _37_ ? ++i : --i))
            {
                this.moveCursors(spec.kind)
            }
        }
    },
    moveByMotionWithVisual:function (spec, count = 1)
    {
        this.moveByMotion(spec,count)
        if (this.visual)
        {
            return this.updateVisual()
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
        for (var _39_ = 0; _39_ < list.length; _39_++)
        {
            p = list[_39_]
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
        for (var _3a_ = 0; _3a_ < list.length; _3a_++)
        {
            c = list[_3a_]
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
        for (var _3b_ = 0; _3b_ < list.length; _3b_++)
        {
            c = list[_3b_]
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
        for (var _3c_ = i = 0, _3d_ = n; (_3c_ <= _3d_ ? i < n : i > n); (_3c_ <= _3d_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCOzs7SUFJSCx1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLG1CQUFXLElBQUksVUFBaUIsT0FBTyxlQUFlLGVBQWUsYUFBYSxlQUFlLGFBQWE7O1lBQzlHLEtBQUM7O2dCQUVFLElBQUk7O2lCQUNQO3VCQUFnQixLQUFDLGVBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBWTs7aUJBQzdCO3VCQUFnQixLQUFDLGFBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBbUIsSUFBSSxNQUFRLElBQUksTUFBTSxJQUFJOztpQkFDOUQ7dUJBQWdCLEtBQUMsdUJBQXVCLElBQUksT0FBTyxJQUFJOztpQkFDdkQ7dUJBQWdCLEtBQUMsZ0JBQW1CLElBQUksTUFBTSxJQUFJLEtBQUs7O2lCQUN2RDt1QkFBZ0IsS0FBQyxnQkFBbUIsSUFBSSxNQUFNLElBQUksS0FBSzs7aUJBQ3ZEO3VCQUFnQixLQUFDLFdBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7Z0JBQWlCLEtBQUM7b0JBQW1DLEtBQUM7OzJCQUFwQixLQUFDOzs7aUJBQ25DO3VCQUFnQixLQUFDLFNBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7dUJBQW1CLEtBQUM7O2lCQUNwQjt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJLEtBQUssSUFBSTs7aUJBQ2pEO3VCQUFnQixLQUFDLFdBQW1CLElBQUk7O2lCQUN4Qzt1QkFBaUIsS0FBQyxhQUFrQixJQUFJOztpQkFDeEM7dUJBQWlCLEtBQUMsYUFBa0IsSUFBSTs7aUJBQ3hDO3VCQUFnQixLQUFDLFdBQW1CLElBQUk7O2lCQUN4Qzt1QkFBaUIsS0FBQzs7aUJBQ2xCO3VCQUFnQixLQUFDOztpQkFDakI7dUJBQXFCLEtBQUMsaUJBQWlCLElBQUk7O2lCQUMzQzt1QkFBZ0IsS0FBQyxZQUFtQixJQUFJOztpQkFDeEM7dUJBQWdCLEtBQUMsYUFBbUIsSUFBSTs7O2dCQUN4QixZQUFJLDJCQUEyQixJQUFJOzs7O0lBRTNELDBCQUFpQixPQUFNLE1BQUs7Ozs7c0JBRWYsS0FBQyxFQUFFOzsyQkFDQzs7Z0JBQ0wsS0FBQyxjQUFjOzs7Ozs7O1FBSXZCLE1BQU0sS0FBQzt1QkFFSCxJQUFLLFNBQUkseUJBQUEsWUFBQTs7WUFFVCxTQUFTO2dDQUVHLEtBQUMsRUFBRTs7O2dCQUFYO2dCQUVBLFlBQVksS0FBSyxPQUFNLElBQUksTUFBTyxLQUFLLE9BQU0sSUFBSTtvQkFDOUM7O29CQUFZOztnQkFFZixRQUFTLEtBQUssS0FBTSxJQUFJLE9BQU8sS0FBSyxPQUFNLElBQUksTUFBTyxLQUFLLEtBQUssSUFBSTtnQkFDbkUsU0FBUyxLQUFLLEtBQU0sSUFBSSxPQUFPLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxLQUFLLElBQUk7b0JBRS9ELFdBQVk7O29CQUNaLFNBQVM7b0JBQ1Q7O3FCQUNHLFdBQVk7O29CQUNmLFNBQVM7OztpQkFFVjs7Z0JBQ0g7O1lBRUosT0FBTyxPQUFPLEdBQUcsT0FBTzs7ZUFFNUIsS0FBQyxjQUFjOztJQUVuQiwyQkFBa0I7Ozs7UUFFZDs0QkFFWSxLQUFLLGlCQUFpQixLQUFDLEVBQUUsTUFBTzs7O1lBQXhDO3NCQUVZLE1BQVgsYUFBRyxZQUFFOztZQUNOLE9BQVksS0FBSyxJQUFJLEtBQUMsRUFBRSxNQUFNO1lBQzlCLFVBQVksS0FBSyxJQUFJLEtBQUssS0FBRyxLQUFLO1lBQ2xDLFNBQVksS0FBSyxLQUFLLFNBQVMsS0FBSyxNQUFNO2dCQUU5QixLQUFLLEtBQUssS0FBSyxPQUFRLEtBQUssS0FBSzs7Z0JBQTdDOztnQkFDWSxLQUFLLEtBQUssS0FBSyxLQUFLLFNBQU8sT0FBUSxLQUFLLEtBQUs7O2dCQUF6RDs7WUFFQSxNQUFNLEtBQUs7O2VBRWY7O0lBRUoscUJBQVksT0FBTTs7OztRQUVkLE9BQU8sS0FBQztzQkFFSTs7OztRQUVaLE1BQU0sV0FBVztRQUVqQixRQUFRLEtBQUMsaUJBQWlCO1FBRTFCLEtBQUMsY0FBYztRQUVmLE1BQU0sS0FBSyx3QkFBd0IsS0FBQyxFQUFFLE1BQU0sS0FBQzthQUVuQzs7OztRQUVWLFNBQVMsSUFBSSxHQUFHLElBQUk7UUFDcEIsT0FBUyxJQUFJLEdBQUcsSUFBSTtRQUNwQixNQUFRLEtBQUM7UUFDVCxRQUFRO3VCQUVKLElBQUssa0JBQVEsR0FBRyxnQkFBQSxRQUFRLGdDQUFYLEdBQUcsZ0JBQUEsUUFBUSxrQkFBWCxHQUFHLGdCQUFBLFFBQVE7O1lBRXhCLFNBQVM7Z0NBRUc7OztnQkFBUjtnQkFFQSxRQUFTLEtBQUssS0FBSyxJQUFJLE9BQU8sS0FBSyxPQUFNLElBQUksTUFBTyxLQUFLLEtBQUssSUFBSTtnQkFDbEUsU0FBUyxLQUFLLEtBQUssTUFBTSxPQUFPLEtBQUssT0FBTSxNQUFNLE1BQU8sS0FBSyxLQUFLLE1BQU07b0JBRXJFLFdBQVk7O29CQUNYLFNBQVM7b0JBQ1Q7O3FCQUNHLFdBQVk7O29CQUNmLFNBQVM7OztpQkFFSjs7Z0JBQWI7O1lBRUEsU0FBUyxPQUFPLEdBQUcsT0FBTztZQUMxQixPQUFTLE9BQU8sS0FBRyxLQUFLLE9BQU8sT0FBTztZQUN0QyxPQUFTLE9BQU8sR0FBRyxPQUFPO1lBQzFCLFFBQVE7O1lBRW9COzttQkFBaEMsS0FBQyxjQUFjLElBQUksR0FBRyxJQUFJOzs7SUFFOUI7Ozs7UUFFSSxRQUFhLEtBQUMsRUFBRTtRQUNoQixVQUFhLEtBQUM7UUFDZDtRQUNBLFFBQWE7NEJBRUo7OztZQUFMO1lBRUEsT0FBTyxNQUFNLEVBQUU7WUFDZixPQUFPLEtBQUssYUFBYSxLQUFLLEVBQUU7WUFDaEMsUUFBUTttQkFFRixPQUFPLEtBQUs7O2dCQUVkLEtBQUssS0FBSzsyQkFFUCxJQUFPLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTs7b0JBQzFCLFNBQVMsS0FBSyxZQUFZLEtBQU0sTUFBTyxFQUFFLEdBQUk7b0JBQzdDOztnQkFFSixRQUFROztpQkFFTDs7Z0JBQ0gsV0FBVyxLQUFLO2dCQUNoQjs7WUFFSixLQUFLLE1BQU07WUFDWDs7d0JBQWM7O3lCQUNWO3lCQUFJO3lCQUFJOytCQUFNOzt5QkFDZDsrQkFBTTs7eUJBQ047K0JBQU07O3lCQUNOOytCQUFNOzs7OztZQUVWLFFBQVEsT0FBTyxxQkFBcUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHO2lCQUVyRDs7Z0JBQ0gsV0FBVyxLQUFLO2dCQUNoQjs7WUFFSixVQUFTLFNBQVEsTUFBTSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsT0FBTyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUc7WUFFeEUsV0FBVyxLQUFLO1lBQ2hCLFFBQVE7O1lBRVQ7O21CQUNDLEtBQUMsV0FBVyxZQUFXLEtBQUssS0FBQyxFQUFFOzs7SUFRdkMsc0JBQWE7O1lBRU4sS0FBQyxXQUFVOzttQkFDUCxLQUFDOzthQUVELEtBQUM7O1lBQ0osS0FBQyxnQkFBZ0IsS0FBQyxhQUFhLGNBQUs7O3dCQUFPLEVBQUUsR0FBRyxFQUFFOzs7UUFFdEQsS0FBQyxTQUFTO2VBRVYsS0FBQzs7SUFFTCxxQkFBWSxpQkFBZTs7UUFFdkIsS0FBQyxTQUFnQjtRQUNqQixLQUFDO2FBRU07O21CQUNILEtBQUM7OztJQUVUOzs7O1FBRUksVUFBVSxLQUFDO1FBQ1gsVUFBVSxLQUFDO1FBQ1g7NEJBRWlCO2FBQUw7O1lBQVI7WUFFQSxvQkFBUyxRQUFRLDBCQUFNLE9BQU8sR0FBRyxPQUFPO1lBRXhDLE1BQU0sT0FBTyxPQUFPLEdBQUcsT0FBTyxLQUFLLE9BQU8sR0FBRyxPQUFPOztRQUV4RCxNQUFNLGVBQU0sR0FBRTs7Z0JBQ1AsRUFBRSxHQUFHLE9BQU0sRUFBRSxHQUFHOzt1QkFDZixFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUc7Ozs7dUJBRWYsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHOzs7UUFFdkI7NkJBRVk7OztZQUFSO2dCQUNZLE9BQU8sVUFBVyxLQUFLLFFBQVEsb0JBQVcsR0FBRyxLQUFLOztnQkFBOUQ7O1lBQ0EsT0FBTyxLQUFLOztlQUVoQjs7SUFFSiw2QkFBb0IsUUFBTzs7OztZQUVwQixLQUFDLFdBQVU7O1lBRVYsYUFBUyxPQUFPLEdBQUcsT0FBTztZQUMxQixhQUFTLE9BQU8sR0FBRyxPQUFPO29CQUV0QixFQUFFLEdBQUcsS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLEtBQUs7O1FBRXRDLEtBQUssT0FBTyxHQUFHLE9BQU87UUFDdEIsS0FBSyxPQUFPLEdBQUcsT0FBTztZQUVuQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTSxFQUFFLE1BQU8sRUFBRSxLQUFLLEVBQUU7O3dCQUMvQixFQUFFLElBQVYsYUFBRTs7O2dCQUVOLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7O0lBRXRCOzs7O2FBRWMsS0FBQzs7OztRQUVYLFFBQVUsS0FBQztRQUNYLFVBQVUsTUFBTSxjQUFLOztvQkFBTyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUc7O1FBQ3pDLFVBQVUsTUFBTSxjQUFLOztvQkFBTyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUc7O1FBRXpDLEtBQUMsZ0JBQWdCO1FBRWpCLE9BQU8sUUFBUSxXQUFVLEtBQUMsRUFBRSxRQUFRO1lBRWpDOztnQ0FDa0I7aUJBQUw7O2dCQUFSO3FCQUNvQixLQUFLLFFBQVEsT0FBTyxLQUFDLEVBQUUsUUFBUTs7b0JBQW5ELE9BQU87Ozs7YUFFUjs7WUFDSCxLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUM7O1FBRTlCOzZCQUNZOzs7WUFBUjtZQUNBLEtBQUssS0FBSyxLQUFDLG1CQUFtQixLQUFLLEdBQUcsS0FBSzs7ZUFFL0MsS0FBQyxjQUFjOztJQUVuQix1QkFBYzs7OztRQUVWLE9BQU8sS0FBQyxFQUFFLFdBQVc7c0JBRVQ7Ozs7UUFFWixXQUFXLEtBQUMsV0FBVTtRQUV0QixLQUFDLGlCQUFpQixLQUFLLFNBQVM7UUFFaEMsS0FBQztRQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYTtRQUVqQyxLQUFDO2VBRUQsS0FBQzs7SUFFTCxxQkFBWTs7OztRQUVSLE9BQU8sS0FBQyxFQUFFLFdBQVc7c0JBRVQ7Ozs7UUFFWixXQUFXLEtBQUMsV0FBVTtRQUV0QixLQUFDLGlCQUFpQixLQUFLLFNBQVM7UUFFaEMsU0FBUyxLQUFLLGNBQUs7O29CQUFPLEVBQUUsR0FBRyxFQUFFOztRQUVqQyxLQUFDLFdBQVcsUUFBTyxLQUFLLEtBQUM7ZUFFekIsS0FBQzs7SUFFTDs7OztRQUVJLE9BQU8sS0FBQyxFQUFFLFdBQVc7c0JBRVQ7Ozs7UUFFWixLQUFDLFdBQVcsS0FBSyxxQkFBcUIsT0FBTSxLQUFLLEtBQUM7UUFFbEQsS0FBQyxhQUFhO1FBRWQsS0FBQyxTQUFnQjtRQUNqQixLQUFDO2VBRUQsS0FBQyxTQUFTOztJQUVkOzs7O2FBRWMsS0FBQzs7OztRQUVYLFVBQVUsS0FBQztRQUNYLFVBQVUsS0FBQzs0QkFFTTthQUFMOztZQUFSO2lCQUVnQixRQUFROztnQkFBeEI7O1lBRUEsU0FBYSxRQUFRO1lBQ3JCLFFBQVEsTUFBTSxPQUFPLEdBQUcsT0FBTztZQUMvQixRQUFRLE1BQU0sT0FBTyxHQUFHLE9BQU87O1FBRW5DLEtBQUMsZ0JBQWdCO1FBRWpCLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQztlQUUxQixLQUFDOztJQUVMLDJCQUFrQjs7OzthQUVKLEtBQUM7Ozs7UUFFWDs0QkFFYyxLQUFDOzs7WUFBWDtZQUVBLE1BQU0sT0FBTyxNQUFNLEtBQUMsRUFBRSxNQUFNLE9BQU87aUJBRW5COztnQkFBaEI7O2dCQUNZLEtBQUssYUFBYTs7Z0JBQTlCOztZQUVBLEtBQUssS0FBSzs7c0JBRUY7Ozs7UUFFWixLQUFDLGdCQUFnQixLQUFLLGNBQUs7O29CQUFPLEVBQUUsR0FBRyxFQUFFOztRQUV6QyxVQUFVLEtBQUssY0FBSzs7NEJBQVcsRUFBRSxHQUFHLEVBQUUsS0FBRyxHQUFHLEVBQUU7O1FBRTlDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQztlQUUxQixLQUFDOztJQUVMLHNCQUFhOztRQUVULEtBQUMsYUFBYTtlQUNkLEtBQUMsZUFBZSxJQUFJLE9BQU8sSUFBSTs7SUFFbkMsdUJBQWM7Ozs7YUFFQSxLQUFDOzs7O2dCQUVKLEtBQUMsV0FBVzs7aUJBQ2Y7dUJBQWdCLEtBQUMsYUFBaUIsS0FBQyxXQUFXLE9BQVUsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOztpQkFDeEY7dUJBQWdCLEtBQUMsYUFBa0IsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOztpQkFDbkU7dUJBQWdCLEtBQUMsZUFBa0IsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOzs7Z0JBRS9ELGdCQUFZLEtBQUMsV0FBVztvQkFFRixRQUFROztnQkFBOUIsS0FBSyxRQUFROzt1QkFFYixLQUFDLGVBQWUsS0FBSyxLQUFDLFdBQVc7Ozs7SUFFN0Msd0JBQWU7O1lBRUEsYUFBWTs7bUJBQXJCOztZQUNTOzttQkFBVDs7ZUFFRixNQUFNOztJQUVWLGtDQUF5Qjs7OztRQUVyQixPQUFPLElBQUksTUFBTSxLQUFLO1lBQ04sSUFBSTs7WUFBcEIsUUFBUTs7WUFFTCxLQUFLLGFBQVk7O21CQUNoQixLQUFLLE9BQU87Ozs7bUJBRVosS0FBSyxLQUFLOzs7SUFFbEI7Ozs7UUFFSSxRQUFPLEtBQUssYUFBWSxTQUFTLEtBQUssT0FBTyxLQUFLO3NCQUVqQzs7bUJBQWQ7O1FBRUgsV0FBVyxLQUFLLFNBQVM7UUFDekIsUUFBVyxLQUFLLE1BQU07WUFFUDs7WUFBZixNQUFNOztnQkFFSixNQUFPLE1BQU8sU0FBVTs7SUFFOUIseUJBQWdCOzs7O1FBRVosUUFBUSxLQUFDLEVBQUU7UUFDWDs0QkFFYyxLQUFDOzs7WUFBWDtZQUVBLE1BQU0sT0FBTyxNQUFNLE1BQU0sT0FBTztpQkFDaEI7O2dCQUFoQjs7Z0JBRVksS0FBSyxhQUFhLFNBQWEsT0FBTyxXQUFXOztnQkFBN0Q7O1lBRUEsS0FBSyxLQUFLOztzQkFFRjs7OztRQUVaLE9BQU8sT0FBTyxZQUFZO1FBRTFCLEtBQUMsY0FBYztlQUVmOztJQUVKLDJCQUFrQixNQUFLLFVBQVM7Ozs7UUFFNUI7NEJBRVc7OztZQUFQO1lBQ0EsTUFBTSxLQUFLLEtBQUssaUJBQWlCLEtBQUMsRUFBRSxNQUFPOztRQUUvQyxLQUFDLGlCQUFrQixNQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sTUFBTyxTQUFVO1lBRXZCLEtBQUMsY0FBYzs7bUJBQTFELEtBQUMsd0JBQXdCLEtBQUM7OztJQUU5Qix5QkFBZ0IsTUFBSzs7OztRQUVqQixPQUFPLEtBQUMsZUFBZTtzQkFFWDs7OztRQUVaLFdBQVcsT0FBTyxXQUFXO1FBRTdCLEtBQUMsaUJBQWlCLEtBQUssU0FBUztRQUVoQyxLQUFDO1FBRUQsS0FBQyxhQUFhLEtBQUssS0FBQyxhQUFhO2VBRWpDLEtBQUM7O0lBRUwseUJBQWdCLE1BQUs7Ozs7UUFFakIsT0FBTyxLQUFDLGVBQWU7c0JBRVg7Ozs7UUFFWixLQUFDLFdBQVcsS0FBSyxxQkFBcUI7UUFFdEMsS0FBQyxhQUFhO2VBRWQsS0FBQyxTQUFTOztJQUVkLHVCQUFjLE1BQUs7Ozs7UUFFZixRQUFXLEtBQUMsRUFBRTtRQUNkLFdBQVcsT0FBTyxXQUFXO1FBQzdCLFVBQVcsS0FBQztRQUNaOzRCQUVtQjthQUFQOztZQUFSO1lBRUEsTUFBTSxPQUFPLE1BQU0sTUFBTSxPQUFPO2lCQUNoQjs7Z0JBQWhCOztnQkFDWSxLQUFLLGFBQWEsU0FBYTs7Z0JBQTNDOztZQUVBLE1BQU0sS0FBSyxLQUFLLGlCQUFpQixNQUFPO2lCQUNGOztnQkFBdEMsUUFBUSxRQUFRLElBQUksR0FBRyxJQUFJOzs7c0JBRW5COzs7O1FBRVosS0FBQyxpQkFBa0IsTUFBTyxNQUFNLEtBQUssTUFBTSxNQUFNLE1BQU8sU0FBVTtZQUV2QixLQUFDLGNBQWM7O1lBQTFELEtBQUMsd0JBQXdCLEtBQUM7O2FBRW5COztZQUNILEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFO21CQUM1QixLQUFDOzs7SUFFVCxzQkFBYSxPQUFNLE9BQU07Ozs7UUFFckIsTUFBTSxLQUFDO1lBRTJCLEtBQUMsY0FBYzs7WUFBakQsTUFBTSxLQUFDOzthQUVHLGlCQUFhLElBQUk7Ozs7UUFFM0IsWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFFbkIsS0FBQzt3QkFFRyxJQUFLLFVBQUksdUJBQUEsUUFBQTs7Z0JBQ04sSUFBSTs7Z0JBQ0gsS0FBQyxTQUFTLElBQUksTUFBTTs7OztnQkFFcEIsS0FBQyxRQUFRLElBQUksTUFBTSxLQUFLLE1BQU07OztlQUV0QyxLQUFDOztJQUVMLG1CQUFVLGFBQVk7Ozs7UUFFbEIsUUFBVSxLQUFLLE1BQU07UUFDckIsUUFBVSxLQUFDLEVBQUUsTUFBTSxjQUFLOzttQkFBTTs7UUFDOUIsVUFBVSxLQUFDO1FBQ1g7NEJBRWM7YUFBUDs7WUFBSDtZQUNBLE1BQU0sS0FBSzs7UUFFZixNQUFNLGVBQU0sR0FBRTs7Z0JBQ1AsUUFBUSxHQUFHLE9BQU0sUUFBUSxHQUFHOzt1QkFDM0IsUUFBUSxHQUFHLEtBQUssUUFBUSxHQUFHOzs7O3VCQUUzQixRQUFRLEdBQUcsS0FBSyxRQUFRLEdBQUc7OztRQUVuQztRQUNBLFNBQWE7NkJBRUY7OztZQUFQO1lBRUEsSUFBSyxRQUFRLEtBQUssS0FBSztZQUN2QixNQUFLLFFBQVEsSUFBRSxJQUFJO1lBRW5CLFFBQVEsWUFBTSxVQUFJLGtCQUFBLFNBQUksT0FBTyxPQUFPLE9BQU8sWUFBTTtZQUVqRCxRQUFRLE1BQU07WUFDZCxZQUFZLEtBQUssVUFBVSxlQUFXLEVBQUUsS0FBSyxNQUFNLFNBQU87WUFFMUQsV0FBVyxNQUFNLEVBQUU7WUFDbkIsVUFBVSxNQUFNOztRQUVwQixLQUFDLFNBQVM7ZUFDVixLQUFDLFdBQVc7O0lBRWhCLGtCQUFTLE1BQUs7Ozs7UUFFVixRQUFVLEtBQUMsRUFBRTtRQUNiLFVBQVUsS0FBQztRQUNYOzRCQUVTOzs7WUFBTDtZQUNBLFFBQVEsS0FBSyxNQUFNLE1BQU0sRUFBRTtZQUMzQixLQUFRLGdCQUFZLEVBQUUsS0FBRyxFQUFFLGlCQUFhLEVBQUUsR0FBRztZQUM3QyxLQUFLLE1BQU0sRUFBRSxFQUFFOzttQkFFRSxLQUFLLHNCQUFzQixNQUFNLEtBQUssT0FBMUQsb0JBQVM7O1FBRVYsS0FBQyxTQUFTO2VBQ1YsS0FBQyxXQUFXOztJQUVoQixtQkFBVSxPQUFNOzs7O1FBRVosWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFFbkIsS0FBQzt3QkFFRyxJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxLQUFDLFVBQVUsSUFBSTs7UUFFbkIsS0FBQztlQUVELEtBQUMsU0FBUzs7SUFFZDs7UUFFSSxLQUFDLFlBQVk7ZUFFYixLQUFDLFNBQVM7O0lBRWQsdUJBQWMsTUFBSzs7OztRQUVmLFlBQWMsSUFBRyxnQkFBQSxRQUFRO1FBQ3pCLFFBQVUsS0FBQyxFQUFFLE1BQU0sY0FBSzs7bUJBQU07O1FBQzlCLFVBQVUsS0FBQztRQUNYLFVBQVU7NEJBRUQ7OztZQUFMO1lBRUEsT0FBTyxNQUFNLEVBQUUsSUFBSTtZQUNuQixPQUFPLEtBQUssYUFBYSxLQUFLLEVBQUU7Z0JBRXBCLE9BQUssSUFBSSxLQUFLOztnQkFBMUI7O1lBRUE7NEJBQ0ksSUFBSyxVQUFJLHVCQUFBLFFBQUE7O2dCQUNULEtBQUssS0FBSzs7WUFFZCxVQUFVLFdBQUssVUFBSSxvQkFBQSxXQUFNLE9BQU8sTUFBTSxPQUFPLFdBQUssT0FBSztZQUV2RCxNQUFNLEVBQUUsTUFBTTtZQUNkLEVBQUUsS0FBWSxLQUFLLE1BQU0sY0FBUSxHQUFJLE9BQUs7WUFDMUMsVUFBYzs7YUFFUjs7OztRQUVWLEtBQUM7UUFFRCxLQUFDLFNBQVM7UUFDVixLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUMsRUFBRTtRQUU1QixLQUFDO2VBRUQsS0FBQyxjQUFlLFNBQVUsVUFBVyxLQUFNLEtBQU0sTUFBTzs7SUFFNUQscUJBQVk7Ozs7UUFFUixZQUFjLElBQUcsZ0JBQUEsUUFBUTtRQUN6QixRQUFVLEtBQUMsRUFBRSxNQUFNLGNBQUs7O21CQUFNOztRQUM5QixVQUFVLEtBQUM7UUFDWCxVQUFVOzRCQUVEOzs7WUFBTDtZQUVBLE9BQU8sTUFBTSxFQUFFLElBQUk7WUFDbkIsT0FBTyxLQUFLLGFBQWEsS0FBSyxFQUFFO2dCQUVwQixRQUFRLEtBQUs7O2dCQUF6Qjs7WUFFQSxnQkFBWSxLQUFLLFNBQU8sRUFBRSxPQUFLLElBQUU7NEJBRTdCLElBQUssYUFBTSw0QkFBQSxhQUFBOztnQkFFWCxNQUFPLEtBQUs7Z0JBQ1osUUFBUSxJQUFJO2dCQUVaLEtBQUssTUFBSyxVQUFTLE1BQU0sUUFBUSxJQUFJOztZQUV6QyxNQUFNLEVBQUUsTUFBTTtZQUNkLEVBQUUsS0FBWSxLQUFLLE1BQU0sV0FBSyxrQkFBUSxRQUFNLEVBQUcsS0FBSyxTQUFPLDBCQUFyQixRQUFNLEVBQUcsS0FBSyxTQUFPO1lBQzNELFVBQWM7O2FBRVI7Ozs7UUFFVixLQUFDO1FBRUQsS0FBQyxTQUFTO1FBQ1YsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDLEVBQUU7UUFFNUIsS0FBQztlQUVELEtBQUMsY0FBZSxTQUFVLGFBQWMsTUFBTzs7SUFFbkQsdUJBQWM7Ozs7UUFFVixZQUFjLElBQUcsZ0JBQUEsUUFBUTtRQUN6QixRQUFVLEtBQUMsRUFBRSxNQUFNLGNBQUs7O21CQUFNOztRQUM5QixVQUFVLEtBQUM7UUFFWDs0QkFDUzs7O1lBQUw7Z0JBQ29CLEVBQUUsS0FBSyxNQUFNLFNBQU8sY0FBTSxFQUFFLEdBQVU7O2dCQUExRCxPQUFPLEtBQUssRUFBRTs7O3NCQUVOOzs7O1FBRVosT0FBTyxlQUFNLEdBQUU7O21CQUFNLElBQUk7O1FBRXpCOzZCQUNTOzs7WUFBTDtnQkFDWSxPQUFPLFVBQVcsSUFBSSxvQkFBVyxLQUFLLG9CQUFXOztnQkFBN0Q7O1lBQ0EsT0FBTyxNQUFNLFVBQU0sRUFBRyxNQUFNLFNBQU8sR0FBRzs7NkJBRTdCOzs7WUFBVDt1QkFFVyxPQUFWLGFBQUU7O1lBQ0gsUUFBVyxLQUFLLElBQUksTUFBTSxJQUFJLFFBQVEsT0FBTztZQUM3QyxTQUFZOzRCQUVSLElBQUssVUFBSSwwQkFBQSxXQUFBOztnQkFDVCxPQUFPLEtBQUssSUFBSSxNQUFNLElBQUUsSUFBSSxRQUFRLE9BQU8sSUFBSSxRQUFRLE9BQU87Z0JBQzlELE1BQU0sS0FBSzs7WUFFZixTQUFTO2lDQUNHOzs7Z0JBQVI7OEJBQ2tCOztvQkFBbEI7O2dCQUNBLHFCQUFlLFdBQVUsT0FBTyxTQUFTLE1BQU07O1lBRW5ELE1BQU0sS0FBSyxLQUFLLE1BQU07WUFFdEIsTUFBTSxPQUFPLEVBQUUsTUFBTSxLQUFLOztRQUU5Qjs2QkFFUzs7O1lBQUw7dUJBRVEsR0FBUCxhQUFFOztZQUNILEtBQVE7WUFDUixLQUFRO2lDQUVLOzs7Z0JBQVQ7MkJBRWlCLE9BQWhCLGNBQUcsZ0JBQUs7O3FCQUVOLE1BQU0sS0FBQSxJQUFJLEtBQUc7O29CQUNaLEtBQUs7b0JBQ0wsS0FBSztvQkFDTDs7b0JBRUQsS0FBRyxRQUFROztvQkFDVixNQUFNLE9BQUs7OztZQUVuQixXQUFXLE1BQU0sR0FBRzs7UUFFeEIsS0FBQztRQUVELEtBQUMsU0FBUztRQUNWLEtBQUMsV0FBVyxZQUFXLEtBQUssS0FBQyxFQUFFO1FBRS9CLEtBQUM7ZUFFRCxLQUFDLGNBQWUsU0FBVSxlQUFnQixNQUFPOztJQUVyRCx1QkFBYyxNQUFLLFFBQU07Ozs7UUFFckIsZUFBSSxLQUFLLDRCQUFRO1lBRWQsS0FBSyxTQUFROzttQkFDWixLQUFDLGVBQWUsS0FBSzs7Ozs0QkFFakIsSUFBSyxVQUFHLHdCQUFBLFNBQUE7O2dCQUNSLEtBQUMsWUFBWSxLQUFLOzs7O0lBRTlCLGlDQUF3QixNQUFLLFFBQU07O1FBRS9CLEtBQUMsYUFBYSxLQUFLO1lBRUEsS0FBQzs7bUJBQXBCLEtBQUM7OztJQUVMLHlCQUFnQixNQUFLOzs7O1FBRWpCLFFBQVUsS0FBQyxFQUFFO1FBQ2IsVUFBVSxLQUFDO1FBQ1gsVUFBVSxLQUFLLFlBQVc7NEJBRVA7YUFBUDs7WUFBUjtZQUVBLE1BQU0sT0FBTyxpQkFBaUIsTUFBTSxPQUFPLEtBQUssT0FBTyxFQUFFLEtBQUssS0FBSztnQkFFaEUsT0FBUSxLQUFLLFVBQVcsS0FBSyxRQUFTLElBQUksT0FBTSxPQUFPLE1BQU8sSUFBSSxPQUFNLE9BQU87O2dCQUM5RSxNQUFNLE9BQU8saUJBQWlCLE1BQU0sT0FBTyxLQUFLLE9BQU8sSUFBRSxFQUFFLEtBQUssS0FBSzs7Z0JBRXRFOztnQkFDQyxRQUFRLE9BQU87OztRQUV2QixLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUMsRUFBRTtlQUU1QixLQUFDLGtCQUFrQjs7SUFFdkIsNEJBQW1COzs7O1FBRWY7UUFDQSxVQUFVLEtBQUssWUFBVzs0QkFFakIsT0FBTyxpQkFBaUIsS0FBQyxFQUFFLE1BQU0sS0FBSyxPQUFPLEtBQUssS0FBSzs7O1lBQTVEO1lBRUEsUUFBUSxLQUFLLE1BQU0sS0FBQyxFQUFFLE1BQU0sRUFBRTtnQkFFM0IsRUFBRSxLQUFLOztnQkFDTixNQUFNLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUcsRUFBRSxFQUFFOzs7ZUFFdkMsS0FBQyxjQUFjOztJQUVuQixzQkFBYSxPQUFNOzs7O1FBRWYsT0FBTyxNQUFNLElBQUk7UUFDakIsSUFBTyxLQUFLLGFBQWEsS0FBSyxJQUFJO1FBRWxDLFlBQVEsRUFBRSxJQUFFO2dCQUVYLEtBQUssWUFBWSxLQUFNLEdBQUcsSUFBSTs7SUFFbkMsNEJBQW1CLE1BQUs7Ozs7UUFFcEIsUUFBUyxLQUFDLEVBQUU7UUFDWixVQUFTLElBQUksSUFBSSxJQUFFLElBQUk7WUFDSSxTQUFRLFNBQVUsS0FBSzs7WUFBbEQsU0FBUyxNQUFNLFNBQU87O1FBQ3RCLG1CQUFlLEVBQUUsTUFBTSxTQUFPLEVBQUU7UUFFaEMsUUFBUSxLQUFLLE1BQU0sTUFBTTtRQUV6QixVQUFVLEtBQUM7NEJBRUY7OztZQUFMO1lBQ0EsRUFBRSxLQUFLO1lBQ1AsRUFBRSxhQUFTLEtBQUssVUFBVSxNQUFNLGlCQUFhLEVBQUUsUUFBTTs7ZUFFekQsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDLEVBQUU7O0lBRWhDOzs7O1FBRUksVUFBVSxLQUFDO1FBQ1gsVUFBVTs0QkFFRDs7O1lBQUw7WUFFQSxRQUFRLEtBQUssTUFBTSxLQUFDLEVBQUUsTUFBTSxFQUFFO1lBQzlCLGNBQWMsRUFBRSxNQUFNLEVBQUU7Z0JBRXJCLE1BQUssRUFBRTs7Z0JBQ04sRUFBRSxLQUFRO2dCQUNWLFVBQVU7OztZQUVmOzttQkFDQyxLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUMsRUFBRTs7O0lBRXBDLHNCQUFhOzs7O1FBRVQsWUFBUSxJQUFHLGdCQUFBLFFBQVE7d0JBRWYsSUFBSyxVQUFJLHVCQUFBLFFBQUE7O1lBQ1QsS0FBQyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
