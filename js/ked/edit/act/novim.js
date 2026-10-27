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
        if (this.visual && !(_k_.in(cmd.operator,['move','matchBracket','visualDelete','visualYank','visualChange','visualSwap','visualTextObject','visualIndent','visualDeindent'])))
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
    
            case 'indent':
                return this.indentByMotion(cmd.motion,false)
    
            case 'deindent':
                return this.indentByMotion(cmd.motion,true)
    
            case 'visualIndent':
                return this.indentVisual(cmd.count,false)
    
            case 'visualDeindent':
                return this.indentVisual(cmd.count,true)
    
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
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _231_32_
    
        cursors = this.allCursors()
        anchors = this.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_231_32_=anchors[i]) != null ? _231_32_ : [cursor[0],cursor[1]])
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
        this.lastChange = {operator:'visualDelete',linewise:linewise,register:register,shapes:this.visualRepeatShapes()}
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
        this.startNovimInsert({kind:'visual',linewise:this.visual === 'line',shapes:this.visualRepeatShapes()})
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.mainCursor()})
        this.visual = null
        this.visualAnchors = []
        return this.stopMode('novim')
    },
    visualRepeatShapes:function ()
    {
        var rng, shapes, y1, y2
    
        shapes = []
        if (this.visual === 'line')
        {
            y1 = Infinity
            y2 = -1
            var list = _k_.list(this.s.selections)
            for (var _18_ = 0; _18_ < list.length; _18_++)
            {
                rng = list[_18_]
                y1 = _k_.min(y1,rng[1])
                y2 = _k_.max(y2,rng[3])
            }
            shapes.push({linewise:true,count:y2 - y1 + 1})
        }
        else
        {
            var list1 = _k_.list(this.s.selections)
            for (var _19_ = 0; _19_ < list1.length; _19_++)
            {
                rng = list1[_19_]
                shapes.push({linewise:false,x1:0,y1:0,x2:rng[2] - rng[0],y2:rng[3] - rng[1]})
            }
        }
        return shapes
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
        for (var _1b_ = 0; _1b_ < list.length; _1b_++)
        {
            cursor = list[_1b_]
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
    indentByMotion:function (spec, deindent = false)
    {
        var cursor, indices, rng
    
        indices = []
        var list = _k_.list(this.allCursors())
        for (var _1c_ = 0; _1c_ < list.length; _1c_++)
        {
            cursor = list[_1c_]
            rng = motion.range(this.s.lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            indices = indices.concat(belt.lineIndicesForRange(rng))
        }
        if (_k_.empty(indices))
        {
            return
        }
        this.indentAtIndices(indices,deindent)
        return this.lastChange = {operator:(deindent ? 'deindent' : 'indent'),motion:_k_.copy((spec))}
    },
    indentVisual:function (count, deindent = false)
    {
        var anchor, anchors, indents, index, indices, oldIndent, shift
    
        indices = belt.lineIndicesForRanges(this.s.selections)
        if (_k_.empty(indices))
        {
            return
        }
        indices = Array.from(new Set(indices))
        indents = {}
        var list = _k_.list(indices)
        for (var _1d_ = 0; _1d_ < list.length; _1d_++)
        {
            index = list[_1d_]
            indents[index] = belt.numIndent(this.s.lines[index])
        }
        this.indentAtIndices(indices,deindent,((count != null ? count : 1)))
        anchors = []
        var list1 = _k_.list(this.visualAnchors)
        for (var _1e_ = 0; _1e_ < list1.length; _1e_++)
        {
            anchor = list1[_1e_]
            oldIndent = indents[anchor[1]]
            if ((oldIndent != null))
            {
                shift = belt.numIndent(this.s.lines[anchor[1]]) - oldIndent
                anchors.push([_k_.max(0,anchor[0] + shift),anchor[1]])
            }
            else
            {
                anchors.push([anchor[0],anchor[1]])
            }
        }
        this.visualAnchors = anchors
        this.lastChange = {operator:(deindent ? 'deindent' : 'indent'),motion:{kind:'line',count:indices.length}}
        return this.updateVisual()
    },
    indentAtIndices:function (indices, deindent = false, times = 1)
    {
        var cursors, i, lines, n, selections
    
        indices = Array.from(new Set(indices))
        indices.sort(function (a, b)
        {
            return a - b
        })
        if (_k_.empty(indices))
        {
            return
        }
        n = _k_.max(1,((times != null ? times : 1)))
        this.begin()
        for (var _1f_ = i = 0, _20_ = n; (_1f_ <= _20_ ? i < n : i > n); (_1f_ <= _20_ ? ++i : --i))
        {
            if (deindent)
            {
                var _21_ = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _21_[0]; selections = _21_[1]; cursors = _21_[2]
    
            }
            else
            {
                var _22_ = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _22_[0]; selections = _22_[1]; cursors = _22_[2]
    
            }
            this.setLines(lines)
            this.setSelections(selections)
            this.setCursors(cursors,{main:this.mainCursor()})
        }
        return this.end()
    },
    applyChange:function (cmd)
    {
        this.lastChange = cmd
        return this.deleteByMotion(cmd.motion,cmd.register)
    },
    startNovimInsert:function (spec)
    {
        var _494_26_
    
        this.novimInsert = _k_.copy((spec))
        this.novimInsert.text = ((_494_26_=this.novimInsert.text) != null ? _494_26_ : '')
        return this.novimInsert
    },
    recordNovimInsert:function (text)
    {
        if (!this.novimInsert || this.novimReplaying)
        {
            return
        }
        return this.novimInsert.text += text
    },
    recordNovimBackspace:function ()
    {
        var text
    
        if (!this.novimInsert || this.novimReplaying)
        {
            return
        }
        text = this.novimInsert.text
        if (text.length)
        {
            return this.novimInsert.text = text.slice(0, -1)
        }
    },
    finishNovimInsert:function ()
    {
        var insert
    
        if (!this.novimInsert)
        {
            return
        }
        insert = this.novimInsert
        this.novimInsert = null
        return this.lastChange = {operator:'insert',insert:insert}
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
    
            case 'indent':
                return this.repeatIndent(count,false)
    
            case 'deindent':
                return this.repeatIndent(count,true)
    
            case 'insert':
                return this.repeatInsert(count)
    
            case 'put':
                return this.repeatPut(count)
    
            case 'visualDelete':
                return this.repeatVisual(count,'delete')
    
            default:
                spec = _k_.copy(this.lastChange.motion)
                if (count > 1)
            {
                spec.count = count
            }
                return this.deleteByMotion(spec,this.lastChange.register)
        }
    
    },
    repeatIndent:function (count, deindent)
    {
        var spec, _544_40_
    
        spec = _k_.copy((((_544_40_=this.lastChange.motion) != null ? _544_40_ : {kind:'line',count:1})))
        if (count > 1)
        {
            spec.count = count
        }
        return this.indentByMotion(spec,deindent)
    },
    repeatPut:function (count)
    {
        var n
    
        n = _k_.max(1,((count > 1 ? count : this.lastChange.count)))
        return this.putRegLines(this.lastChange.reg,n,this.lastChange.after)
    },
    repeatInsert:function (count)
    {
        var i, insert, n
    
        insert = this.lastChange.insert
        n = _k_.max(1,((count != null ? count : 1)))
        for (var _23_ = i = 0, _24_ = n; (_23_ <= _24_ ? i < n : i > n); (_23_ <= _24_ ? ++i : --i))
        {
            this.replayInsert(insert)
        }
    },
    replayInsert:function (insert)
    {
        switch (insert.kind)
        {
            case 'insert':
                return this.insertForRepeat(insert.text)
    
            case 'append':
                this.moveCursors('right')
                return this.insertForRepeat(insert.text)
    
            case 'appendEol':
                this.moveCursors('eol')
                return this.insertForRepeat(insert.text)
    
            case 'insertAtIndent':
                this.moveCursors('ind')
                return this.insertForRepeat(insert.text)
    
            case 'openLineAfter':
                this.putOpenLines(insert,true)
                return this.insertForRepeat(insert.text)
    
            case 'openLineBefore':
                this.putOpenLines(insert,false)
                return this.insertForRepeat(insert.text)
    
            case 'change':
                return this.replayChange(insert)
    
            case 'visual':
                return this.replayVisual(insert,'change')
    
            default:
                console.log('novim unknown insert ▸',insert.kind)
        }
    
    },
    replayChange:function (insert)
    {
        var rngs, spec
    
        spec = _k_.copy(insert.motion)
        rngs = this.selectByMotion(spec)
        if (_k_.empty(rngs))
        {
            return
        }
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.s.main})
        return this.insertForRepeat(insert.text)
    },
    putOpenLines:function (insert, after)
    {
        var i, n, _592_32_
    
        n = _k_.max(1,(((_592_32_=insert.count) != null ? _592_32_ : 1)))
        this.begin()
        for (var _25_ = i = 0, _26_ = n; (_25_ <= _26_ ? i < n : i > n); (_25_ <= _26_ ? ++i : --i))
        {
            this.putLines([''],after)
        }
        return this.end()
    },
    insertForRepeat:function (text)
    {
        this.novimReplaying = true
        this.insert(text)
        return this.novimReplaying = false
    },
    repeatVisual:function (count, action)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        for (var _27_ = i = 0, _28_ = n; (_27_ <= _28_ ? i < n : i > n); (_27_ <= _28_ ? ++i : --i))
        {
            this.replayVisual(this.lastChange,action)
        }
    },
    replayVisual:function (change, action)
    {
        var cursor, cursors, i, rng, rngs, shape, _624_66_
    
        rngs = []
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            shape = ((_624_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _624_66_ : change.shapes[0])
            if (!shape)
            {
                continue
            }
            rng = this.rangeForVisualShape(shape,cursor)
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
        if (action === 'delete')
        {
            this.setNovimRegister(rngs,change.linewise,change.register)
            this.begin()
            this.deleteRanges(rngs,this.allCursors(),change.linewise)
            return this.end()
        }
        else
        {
            this.setSelections(rngs)
            this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.s.main})
            return this.insertForRepeat(change.text)
        }
    },
    rangeForVisualShape:function (shape, cursor)
    {
        var lines, x1, x2, y1, y2
    
        lines = this.s.lines
        if (_k_.empty(lines))
        {
            return
        }
        if (shape.linewise)
        {
            y1 = _k_.min(cursor[1],lines.length - 1)
            y2 = _k_.min(cursor[1] + shape.count - 1,lines.length - 1)
            return [0,y1,kseg.width(lines[y2]),y2]
        }
        y1 = _k_.min(cursor[1],lines.length - 1)
        y2 = _k_.min(cursor[1] + shape.y2,lines.length - 1)
        x1 = _k_.min(cursor[0],kseg.width(lines[y1]))
        x2 = _k_.min(cursor[0] + shape.x2,kseg.width(lines[y2]))
        return [x1,y1,x2,y2]
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
        for (var _2a_ = 0; _2a_ < list.length; _2a_++)
        {
            cursor = list[_2a_]
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
        for (var _2b_ = 0; _2b_ < list.length; _2b_++)
        {
            rng = list[_2b_]
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
        this.startNovimInsert({kind:'change',motion:_k_.copy((spec))})
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
        var n, reg
    
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
        this.putRegLines(reg,n,after)
        return this.lastChange = {operator:'put',after:after,count:n,register:register,reg:{lines:_k_.copy((reg.lines)),linewise:reg.linewise}}
    },
    putRegLines:function (reg, count, after)
    {
        var i
    
        this.begin()
        for (var _2d_ = i = 0, _2e_ = count; (_2d_ <= _2e_ ? i < count : i > count); (_2d_ <= _2e_ ? ++i : --i))
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
        for (var _30_ = 0; _30_ < list1.length; _30_++)
        {
            idx = list1[_30_]
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
        for (var _31_ = 0; _31_ < list.length; _31_++)
        {
            c = list[_31_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _32_ = belt.insertTextAtPositions(lines,text,posl); newLines = _32_[0]; newPosl = _32_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _33_ = i = 0, _34_ = n; (_33_ <= _34_ ? i < n : i > n); (_33_ <= _34_ ? ++i : --i))
        {
            this.putLines([''],after)
        }
        this.end()
        this.startNovimInsert({kind:(after ? 'openLineAfter' : 'openLineBefore'),count:n})
        return this.stopMode('novim')
    },
    insertAtIndent:function ()
    {
        this.moveCursors('ind')
        this.startNovimInsert({kind:'insertAtIndent'})
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
        for (var _35_ = 0; _35_ < list.length; _35_++)
        {
            c = list[_35_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _36_ = i = 0, _37_ = n; (_36_ <= _37_ ? i < n : i > n); (_36_ <= _37_ ? ++i : --i))
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
        for (var _38_ = 0; _38_ < list.length; _38_++)
        {
            c = list[_38_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _39_ = i = segi, _3a_ = lasti; (_39_ <= _3a_ ? i <= lasti : i >= lasti); (_39_ <= _3a_ ? ++i : --i))
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
        for (var _3b_ = 0; _3b_ < list.length; _3b_++)
        {
            c = list[_3b_]
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
        for (var _3c_ = 0; _3c_ < list1.length; _3c_++)
        {
            y = list1[_3c_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _3d_ = 0; _3d_ < list2.length; _3d_++)
        {
            block = list2[_3d_]
            var _3e_ = block; y = _3e_[0]; take = _3e_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _3f_ = j = 1, _40_ = take; (_3f_ <= _40_ ? j < take : j > take); (_3f_ <= _40_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _41_ = 0; _41_ < list3.length; _41_++)
            {
                part = list3[_41_]
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
        for (var _42_ = 0; _42_ < list4.length; _42_++)
        {
            c = list4[_42_]
            var _43_ = c; x = _43_[0]; y = _43_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _44_ = 0; _44_ < list5.length; _44_++)
            {
                block = list5[_44_]
                var _45_ = block; by = _45_[0]; take = _45_[1]; seam = _45_[2]
    
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
        var i, n, _1037_23_
    
        n = ((_1037_23_=spec.count) != null ? _1037_23_ : count)
        if (spec.kind === 'charFind')
        {
            return this.moveByCharFind(spec,n)
        }
        else
        {
            for (var _46_ = i = 1, _47_ = n; (_46_ <= _47_ ? i <= n : i >= n); (_46_ <= _47_ ? ++i : --i))
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
        for (var _49_ = 0; _49_ < list.length; _49_++)
        {
            p = list[_49_]
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
        for (var _4a_ = 0; _4a_ < list.length; _4a_++)
        {
            c = list[_4a_]
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
        for (var _4b_ = 0; _4b_ < list.length; _4b_++)
        {
            c = list[_4b_]
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
        for (var _4c_ = i = 0, _4d_ = n; (_4c_ <= _4d_ ? i < n : i > n); (_4c_ <= _4d_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCOzs7SUFJSCx1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLG1CQUFXLElBQUksVUFBaUIsT0FBTyxlQUFlLGVBQWUsYUFBYSxlQUFlLGFBQWEsbUJBQW1CLGVBQWU7O1lBQ2hKLEtBQUM7O2dCQUVFLElBQUk7O2lCQUNQO3VCQUFnQixLQUFDLGVBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBWTs7aUJBQzdCO3VCQUFnQixLQUFDLGFBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBbUIsSUFBSSxNQUFRLElBQUksTUFBTSxJQUFJOztpQkFDOUQ7dUJBQWdCLEtBQUMsdUJBQXVCLElBQUksT0FBTyxJQUFJOztpQkFDdkQ7dUJBQWdCLEtBQUMsZ0JBQW1CLElBQUksTUFBTSxJQUFJLEtBQUs7O2lCQUN2RDt1QkFBZ0IsS0FBQyxnQkFBbUIsSUFBSSxNQUFNLElBQUksS0FBSzs7aUJBQ3ZEO3VCQUFnQixLQUFDLFdBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7Z0JBQWlCLEtBQUM7b0JBQW1DLEtBQUM7OzJCQUFwQixLQUFDOzs7aUJBQ25DO3VCQUFnQixLQUFDLFNBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7dUJBQW1CLEtBQUM7O2lCQUNwQjt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJLEtBQUssSUFBSTs7aUJBQ2pEO3VCQUFnQixLQUFDLFdBQW1CLElBQUk7O2lCQUN4Qzt1QkFBaUIsS0FBQyxhQUFrQixJQUFJOztpQkFDeEM7dUJBQWlCLEtBQUMsYUFBa0IsSUFBSTs7aUJBQ3hD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
