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
    visualBlockRanges:function (anchor, cursor)
    {
        var ex, rngs, width, x1, x2, y, y1, y2
    
        y1 = _k_.min(anchor[1],cursor[1])
        y2 = _k_.max(anchor[1],cursor[1])
        x1 = _k_.min(anchor[0],cursor[0])
        x2 = _k_.max(anchor[0],cursor[0])
        rngs = []
        if (x1 === x2)
        {
            return rngs
        }
        for (var _16_ = y = y1, _17_ = y2; (_16_ <= _17_ ? y <= y2 : y >= y2); (_16_ <= _17_ ? ++y : --y))
        {
            if (y >= this.s.lines.length)
            {
                continue
            }
            width = kseg.width(this.s.lines[y])
            if (x1 >= width)
            {
                continue
            }
            ex = _k_.min(x2,width)
            if (ex <= x1)
            {
                continue
            }
            rngs.push([x1,y,ex,y])
        }
        return rngs
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
        for (var _19_ = 0; _19_ < list1.length; _19_++)
        {
            pair = list1[_19_]
            if (this.visual === 'block')
            {
                rngs = rngs.concat(this.visualBlockRanges(pair[0],pair[1]))
            }
            else
            {
                rngs.push(this.visualRangeForPair(pair[0],pair[1]))
            }
        }
        return this.setSelections(rngs)
    },
    visualDelete:function (register)
    {
        var blockStarts, linewise, rngs
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = this.visual === 'line'
        blockStarts = null
        if (this.visual === 'block')
        {
            blockStarts = this.visualPairs().map(function (p)
            {
                return [_k_.min(p[0][0],p[1][0]),_k_.min(p[0][1],p[1][1])]
            })
        }
        this.setNovimRegister(rngs,linewise,register)
        this.lastChange = {operator:'visualDelete',linewise:linewise,register:register,shapes:this.visualRepeatShapes()}
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        this.end()
        if (blockStarts)
        {
            this.setCursors(blockStarts,{main:this.s.main})
        }
        return this.stopVisual()
    },
    visualYank:function (register)
    {
        var linewise, pairs, rngs, starts
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = this.visual === 'line'
        this.setNovimRegister(rngs,linewise,register)
        if (this.visual === 'block')
        {
            pairs = this.visualPairs()
            starts = pairs.map(function (p)
            {
                return [_k_.min(p[0][0],p[1][0]),_k_.min(p[0][1],p[1][1])]
            })
        }
        else
        {
            starts = rngs.map(function (r)
            {
                return [r[0],r[1]]
            })
        }
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
        var rng, shapes, x1, x2, y1, y2
    
        shapes = []
        if (this.visual === 'line')
        {
            y1 = Infinity
            y2 = -1
            var list = _k_.list(this.s.selections)
            for (var _1a_ = 0; _1a_ < list.length; _1a_++)
            {
                rng = list[_1a_]
                y1 = _k_.min(y1,rng[1])
                y2 = _k_.max(y2,rng[3])
            }
            shapes.push({linewise:true,count:y2 - y1 + 1})
        }
        else if (this.visual === 'block')
        {
            if (!_k_.empty(this.s.selections))
            {
                x1 = Infinity
                x2 = -1
                y1 = Infinity
                y2 = -1
                var list1 = _k_.list(this.s.selections)
                for (var _1b_ = 0; _1b_ < list1.length; _1b_++)
                {
                    rng = list1[_1b_]
                    x1 = _k_.min(x1,rng[0])
                    x2 = _k_.max(x2,rng[2])
                    y1 = _k_.min(y1,rng[1])
                    y2 = _k_.max(y2,rng[3])
                }
                shapes.push({block:true,x1:0,y1:0,x2:x2 - x1,y2:y2 - y1})
            }
        }
        else
        {
            var list2 = _k_.list(this.s.selections)
            for (var _1c_ = 0; _1c_ < list2.length; _1c_++)
            {
                rng = list2[_1c_]
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
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            cursor = list[_1e_]
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
        for (var _1f_ = 0; _1f_ < list.length; _1f_++)
        {
            cursor = list[_1f_]
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
        for (var _20_ = 0; _20_ < list.length; _20_++)
        {
            index = list[_20_]
            indents[index] = belt.numIndent(this.s.lines[index])
        }
        this.indentAtIndices(indices,deindent,((count != null ? count : 1)))
        anchors = []
        var list1 = _k_.list(this.visualAnchors)
        for (var _21_ = 0; _21_ < list1.length; _21_++)
        {
            anchor = list1[_21_]
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
        for (var _22_ = i = 0, _23_ = n; (_22_ <= _23_ ? i < n : i > n); (_22_ <= _23_ ? ++i : --i))
        {
            if (deindent)
            {
                var _24_ = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _24_[0]; selections = _24_[1]; cursors = _24_[2]
    
            }
            else
            {
                var _25_ = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _25_[0]; selections = _25_[1]; cursors = _25_[2]
    
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
        var _552_26_
    
        this.novimInsert = _k_.copy((spec))
        this.novimInsert.text = ((_552_26_=this.novimInsert.text) != null ? _552_26_ : '')
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
        var spec, _602_40_
    
        spec = _k_.copy((((_602_40_=this.lastChange.motion) != null ? _602_40_ : {kind:'line',count:1})))
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
        for (var _26_ = i = 0, _27_ = n; (_26_ <= _27_ ? i < n : i > n); (_26_ <= _27_ ? ++i : --i))
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
        var i, n, _650_32_
    
        n = _k_.max(1,(((_650_32_=insert.count) != null ? _650_32_ : 1)))
        this.begin()
        for (var _28_ = i = 0, _29_ = n; (_28_ <= _29_ ? i < n : i > n); (_28_ <= _29_ ? ++i : --i))
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
        for (var _2a_ = i = 0, _2b_ = n; (_2a_ <= _2b_ ? i < n : i > n); (_2a_ <= _2b_ ? ++i : --i))
        {
            this.replayVisual(this.lastChange,action)
        }
    },
    replayVisual:function (change, action)
    {
        var cursor, cursors, i, rng, rngs, shape, _684_66_
    
        rngs = []
        cursors = this.allCursors()
        if (change.shapes.length && change.shapes[0].block)
        {
            cursors = [this.mainCursor()]
        }
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            shape = ((_684_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _684_66_ : change.shapes[0])
            if (!shape)
            {
                continue
            }
            if (shape.block)
            {
                var list1 = _k_.list(this.blockRangesForShape(shape,cursor))
                for (var _2d_ = 0; _2d_ < list1.length; _2d_++)
                {
                    rng = list1[_2d_]
                    rngs.push(rng)
                }
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
    blockRangesForShape:function (shape, cursor)
    {
        var lines, rngs, width, x1, x2, y, y1, y2
    
        lines = this.s.lines
        rngs = []
        if (_k_.empty(lines))
        {
            return rngs
        }
        y1 = _k_.min(cursor[1],lines.length - 1)
        y2 = _k_.min(cursor[1] + shape.y2,lines.length - 1)
        x1 = cursor[0]
        for (var _2e_ = y = y1, _2f_ = y2; (_2e_ <= _2f_ ? y <= y2 : y >= y2); (_2e_ <= _2f_ ? ++y : --y))
        {
            width = kseg.width(lines[y])
            if (x1 >= width)
            {
                continue
            }
            x2 = _k_.min(x1 + shape.x2,width)
            if (x2 <= x1)
            {
                continue
            }
            rngs.push([x1,y,x2,y])
        }
        return rngs
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
        for (var _30_ = 0; _30_ < list.length; _30_++)
        {
            cursor = list[_30_]
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
        for (var _31_ = 0; _31_ < list.length; _31_++)
        {
            rng = list[_31_]
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
        for (var _33_ = i = 0, _34_ = count; (_33_ <= _34_ ? i < count : i > count); (_33_ <= _34_ ? ++i : --i))
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
        for (var _36_ = 0; _36_ < list1.length; _36_++)
        {
            idx = list1[_36_]
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
        for (var _37_ = 0; _37_ < list.length; _37_++)
        {
            c = list[_37_]
            width = kseg.width(lines[c[1]])
            x = (after ? _k_.min(c[0] + 1,width) : _k_.min(c[0],width))
            posl.push([x,c[1]])
        }
        var _38_ = belt.insertTextAtPositions(lines,text,posl); newLines = _38_[0]; newPosl = _38_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.begin()
        for (var _39_ = i = 0, _3a_ = n; (_39_ <= _3a_ ? i < n : i > n); (_39_ <= _3a_ ? ++i : --i))
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
        for (var _3b_ = 0; _3b_ < list.length; _3b_++)
        {
            c = list[_3b_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _3c_ = i = 0, _3d_ = n; (_3c_ <= _3d_ ? i < n : i > n); (_3c_ <= _3d_ ? ++i : --i))
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
        for (var _3e_ = 0; _3e_ < list.length; _3e_++)
        {
            c = list[_3e_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _3f_ = i = segi, _40_ = lasti; (_3f_ <= _40_ ? i <= lasti : i >= lasti); (_3f_ <= _40_ ? ++i : --i))
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
        for (var _41_ = 0; _41_ < list.length; _41_++)
        {
            c = list[_41_]
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
        for (var _42_ = 0; _42_ < list1.length; _42_++)
        {
            y = list1[_42_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _43_ = 0; _43_ < list2.length; _43_++)
        {
            block = list2[_43_]
            var _44_ = block; y = _44_[0]; take = _44_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _45_ = j = 1, _46_ = take; (_45_ <= _46_ ? j < take : j > take); (_45_ <= _46_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _47_ = 0; _47_ < list3.length; _47_++)
            {
                part = list3[_47_]
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
        for (var _48_ = 0; _48_ < list4.length; _48_++)
        {
            c = list4[_48_]
            var _49_ = c; x = _49_[0]; y = _49_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _4a_ = 0; _4a_ < list5.length; _4a_++)
            {
                block = list5[_4a_]
                var _4b_ = block; by = _4b_[0]; take = _4b_[1]; seam = _4b_[2]
    
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
        var i, n, _1128_23_
    
        n = ((_1128_23_=spec.count) != null ? _1128_23_ : count)
        if (spec.kind === 'charFind')
        {
            return this.moveByCharFind(spec,n)
        }
        else
        {
            for (var _4c_ = i = 1, _4d_ = n; (_4c_ <= _4d_ ? i <= n : i >= n); (_4c_ <= _4d_ ? ++i : --i))
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
        for (var _4f_ = 0; _4f_ < list.length; _4f_++)
        {
            p = list[_4f_]
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
        for (var _50_ = 0; _50_ < list.length; _50_++)
        {
            c = list[_50_]
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
        for (var _51_ = 0; _51_ < list.length; _51_++)
        {
            c = list[_51_]
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
        for (var _52_ = i = 0, _53_ = n; (_52_ <= _53_ ? i < n : i > n); (_52_ <= _53_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCOzs7SUFJSCx1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLG1CQUFXLElBQUksVUFBaUIsT0FBTyxlQUFlLGVBQWUsYUFBYSxlQUFlLGFBQWEsbUJBQW1CLGVBQWU7O1lBQ2hKLEtBQUM7O2dCQUVFLElBQUk7O2lCQUNQO3VCQUFnQixLQUFDLGVBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBWTs7aUJBQzdCO3VCQUFnQixLQUFDLGFBQW1CLElBQUksT0FBUSxJQUFJOztpQkFDcEQ7dUJBQWdCLEtBQUMsWUFBbUIsSUFBSSxNQUFRLElBQUksTUFBTSxJQUFJOztpQkFDOUQ7dUJBQWdCLEtBQUMsdUJBQXVCLElBQUksT0FBTyxJQUFJOztpQkFDdkQ7dUJBQWdCLEtBQUMsZ0JBQW1CLElBQUksTUFBTSxJQUFJLEtBQUs7O2lCQUN2RDt1QkFBZ0IsS0FBQyxnQkFBbUIsSUFBSSxNQUFNLElBQUksS0FBSzs7aUJBQ3ZEO3VCQUFnQixLQUFDLFdBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7Z0JBQWlCLEtBQUM7b0JBQW1DLEtBQUM7OzJCQUFwQixLQUFDOzs7aUJBQ25DO3VCQUFnQixLQUFDLFNBQW1CLElBQUksTUFBTSxJQUFJOztpQkFDbEQ7dUJBQW1CLEtBQUM7O2lCQUNwQjt1QkFBZ0IsS0FBQyxhQUFtQixJQUFJLEtBQUssSUFBSTs7aUJBQ2pEO3VCQUFnQixLQUFDLFdBQW1CLElBQUk7O2lCQUN4Qzt1QkFBaUIsS0FBQyxhQUFrQixJQUFJOztpQkFDeEM7dUJBQWlCLEtBQUMsYUFBa0IsSUFBSTs7aUJBQ3hD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
