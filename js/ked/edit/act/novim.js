var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let clip = kxk.clip
let post = kxk.post

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
        if (this.visual && !(_k_.in(cmd.operator,['move','matchBracket','visualDelete','visualYank','visualChange','visualSwap','visualTextObject','visualIndent','visualDeindent','visualBlockPrepend','visualBlockAppend'])))
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
    
            case 'visualBlockPrepend':
                return this.visualBlockInsert(false)
    
            case 'visualBlockAppend':
                return this.visualBlockInsert(true)
    
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
            this.setCursors(newCursors,{main:this.s.main})
        }
        if (this.visual)
        {
            return this.updateVisual()
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
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _229_32_
    
        cursors = this.allCursors()
        anchors = this.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_229_32_=anchors[i]) != null ? _229_32_ : [cursor[0],cursor[1]])
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
        var x1, x2, y1, y2
    
        y1 = _k_.min(anchor[1],cursor[1])
        y2 = _k_.max(anchor[1],cursor[1])
        x1 = _k_.min(anchor[0],cursor[0])
        x2 = _k_.max(anchor[0],cursor[0])
        if (x1 === x2)
        {
            return []
        }
        return this.blockRangesForRect(this.s.lines,x1,y1,x2,y2)
    },
    blockRangesForShape:function (shape, cursor)
    {
        var x1, x2, y1, y2
    
        if (_k_.empty(this.s.lines))
        {
            return []
        }
        y1 = _k_.min(cursor[1],this.s.lines.length - 1)
        y2 = _k_.min(cursor[1] + shape.y2,this.s.lines.length - 1)
        x1 = cursor[0]
        x2 = x1 + shape.x2
        return this.blockRangesForRect(this.s.lines,x1,y1,x2,y2)
    },
    blockRangesForRect:function (lines, x1, y1, x2, y2)
    {
        var rngs, width, y
    
        rngs = []
        for (var _16_ = y = y1, _17_ = y2; (_16_ <= _17_ ? y <= y2 : y >= y2); (_16_ <= _17_ ? ++y : --y))
        {
            if (y >= lines.length)
            {
                continue
            }
            width = kseg.width(lines[y])
            if (x1 >= width)
            {
                continue
            }
            x2 = _k_.min(x2,width)
            if (x2 <= x1)
            {
                continue
            }
            rngs.push([x1,y,x2,y])
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
        this.flashYank(rngs)
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
    visualBlockInsert:function (after)
    {
        var cursors, rngs
    
        rngs = this.s.selections
        if (_k_.empty(rngs))
        {
            return
        }
        cursors = rngs.map(function (r)
        {
            return [(after ? r[2] : r[0]),r[1]]
        })
        this.startNovimInsert({kind:(after ? 'blockAppend' : 'blockPrepend'),shapes:this.visualRepeatShapes()})
        this.stopVisual()
        this.setCursors(cursors,{main:this.s.main})
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
        var _581_26_
    
        this.novimInsert = _k_.copy((spec))
        this.novimInsert.text = ((_581_26_=this.novimInsert.text) != null ? _581_26_ : '')
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
        var spec, _631_40_
    
        spec = _k_.copy((((_631_40_=this.lastChange.motion) != null ? _631_40_ : {kind:'line',count:1})))
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
    
            case 'blockPrepend':
                return this.replayBlockInsert(insert,false)
    
            case 'blockAppend':
                return this.replayBlockInsert(insert,true)
    
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
        var i, n, _681_32_
    
        n = _k_.max(1,(((_681_32_=insert.count) != null ? _681_32_ : 1)))
        this.begin()
        for (var _28_ = i = 0, _29_ = n; (_28_ <= _29_ ? i < n : i > n); (_28_ <= _29_ ? ++i : --i))
        {
            this.putLines([''],after)
        }
        return this.end()
    },
    replayBlockInsert:function (insert, after)
    {
        var cursors, rngs, shape
    
        shape = insert.shapes[0]
        if (!shape)
        {
            return
        }
        rngs = this.blockRangesForShape(shape,this.mainCursor())
        if (_k_.empty(rngs))
        {
            return
        }
        cursors = rngs.map(function (r)
        {
            return [(after ? r[2] : r[0]),r[1]]
        })
        this.setCursors(cursors,{main:this.s.main})
        return this.insertForRepeat(insert.text)
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
        var cursor, cursors, i, rng, rngs, shape, _731_66_
    
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
            shape = ((_731_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _731_66_ : change.shapes[0])
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
        for (var _2e_ = 0; _2e_ < list.length; _2e_++)
        {
            cursor = list[_2e_]
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
        for (var _2f_ = 0; _2f_ < list.length; _2f_++)
        {
            rng = list[_2f_]
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
        var cursor, cursors, idx, linewise, rng, rngs
    
        linewise = motion.isLinewise(spec)
        cursors = this.allCursors()
        rngs = []
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            rng = motion.range(this.s.lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            if (belt.isEmptyRange(rng) && !linewise)
            {
                continue
            }
            rngs.push(rng)
            if (!linewise)
            {
                cursors[idx] = [rng[0],rng[1]]
            }
        }
        if (_k_.empty(rngs))
        {
            return
        }
        this.setNovimRegister(rngs,linewise,register)
        this.flashYank(rngs)
        if (!linewise)
        {
            this.setCursors(cursors,{main:this.s.main})
            return this.clampCursorsToLines()
        }
    },
    flashYank:function (rngs)
    {
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        this.yankFlash = rngs
        return this.yankFlashTimer = setTimeout(((function ()
        {
            return this.clearYankFlash()
        }).bind(this)),200)
    },
    clearYankFlash:function ()
    {
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        this.yankFlashTimer = null
        if (!this.yankFlash)
        {
            return
        }
        this.yankFlash = null
        return post.emit('redraw')
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
        for (var _31_ = i = 0, _32_ = count; (_31_ <= _32_ ? i < count : i > count); (_31_ <= _32_ ? ++i : --i))
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
        for (var _34_ = 0; _34_ < list1.length; _34_++)
        {
            idx = list1[_34_]
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
        for (var _35_ = 0; _35_ < list.length; _35_++)
        {
            c = list[_35_]
            width = kseg.width(lines[c[1]])
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
            posl.push([x,c[1]])
        }
        var _36_ = belt.insertTextAtPositions(lines,text,posl); newLines = _36_[0]; newPosl = _36_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        this.putOpenLines({count:count},after)
        this.startNovimInsert({kind:(after ? 'openLineAfter' : 'openLineBefore'),count:count})
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
        for (var _37_ = 0; _37_ < list.length; _37_++)
        {
            c = list[_37_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _38_ = i = 0, _39_ = n; (_38_ <= _39_ ? i < n : i > n); (_38_ <= _39_ ? ++i : --i))
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
        for (var _3a_ = 0; _3a_ < list.length; _3a_++)
        {
            c = list[_3a_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _3b_ = i = segi, _3c_ = lasti; (_3b_ <= _3c_ ? i <= lasti : i >= lasti); (_3b_ <= _3c_ ? ++i : --i))
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
        for (var _3d_ = 0; _3d_ < list.length; _3d_++)
        {
            c = list[_3d_]
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
        for (var _3e_ = 0; _3e_ < list1.length; _3e_++)
        {
            y = list1[_3e_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _3f_ = 0; _3f_ < list2.length; _3f_++)
        {
            block = list2[_3f_]
            var _40_ = block; y = _40_[0]; take = _40_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _41_ = j = 1, _42_ = take; (_41_ <= _42_ ? j < take : j > take); (_41_ <= _42_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _43_ = 0; _43_ < list3.length; _43_++)
            {
                part = list3[_43_]
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
        for (var _44_ = 0; _44_ < list4.length; _44_++)
        {
            c = list4[_44_]
            var _45_ = c; x = _45_[0]; y = _45_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _46_ = 0; _46_ < list5.length; _46_++)
            {
                block = list5[_46_]
                var _47_ = block; by = _47_[0]; take = _47_[1]; seam = _47_[2]
    
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
        var i, n, _1160_23_
    
        n = ((_1160_23_=spec.count) != null ? _1160_23_ : count)
        if (spec.kind === 'charFind')
        {
            this.moveByCharFind(spec,n)
        }
        else if (spec.kind === 'lineFirst')
        {
            if (n > 1)
            {
                this.moveCursors('down',{count:n - 1})
            }
            this.moveCursors('ind')
        }
        else
        {
            for (var _48_ = i = 1, _49_ = n; (_48_ <= _49_ ? i <= n : i >= n); (_48_ <= _49_ ? ++i : --i))
            {
                this.moveCursors(spec.kind)
            }
        }
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
        for (var _4b_ = 0; _4b_ < list.length; _4b_++)
        {
            p = list[_4b_]
            width = kseg.width(this.s.lines[p[1]])
            if (p[0] < width)
            {
                spans.push([p[0],p[1],p[0] + 1,p[1]])
            }
        }
        return this.setHighlights(spans)
    },
    clampCursorsToLines:function ()
    {
        var c, changed, cursors, width, x
    
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _4c_ = 0; _4c_ < list.length; _4c_++)
        {
            c = list[_4c_]
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
        for (var _4d_ = i = 0, _4e_ = n; (_4d_ <= _4e_ ? i < n : i > n); (_4d_ <= _4e_ ? ++i : --i))
        {
            this.undo()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7SUFBSzs7T0FDVixZQUFaOztPQUNZLFdBQVo7T0FBaUIsYUFBakI7OztJQUlILHVCQUFjOzs7O1lBSVAsSUFBSTs7WUFDSCxJQUFJLE9BQU8sa0JBQVgsSUFBSSxPQUFPLDJCQUFTLElBQUk7O1lBRXpCLEtBQUMsbUJBQVcsSUFBSSxVQUFpQixPQUFPLGVBQWUsZUFBZSxhQUFhLGVBQWUsYUFBYSxtQkFBbUIsZUFBZSxpQkFBaUIscUJBQXFCOztZQUN0TCxLQUFDOztnQkFFRSxJQUFJOztpQkFDUDt1QkFBMEIsS0FBQyxlQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLFlBQXFCOztpQkFDaEQ7dUJBQTBCLEtBQUMsYUFBcUIsSUFBSSxPQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQyxZQUFxQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUMxRTt1QkFBMEIsS0FBQyxhQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLGdCQUFxQixJQUFJLE1BQVEsSUFBSSxLQUFLOztpQkFDckU7dUJBQTBCLEtBQUMsZ0JBQXFCLElBQUksTUFBUSxJQUFJLEtBQUs7O2lCQUNyRTt1QkFBMEIsS0FBQyxXQUFxQixJQUFJLE1BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDOztpQkFDM0I7dUJBQTBCLEtBQUMsU0FBcUIsSUFBSSxNQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQzs7aUJBQzNCO3VCQUEwQixLQUFDLGFBQXFCLElBQUksS0FBUSxJQUFJOztpQkFDaEU7dUJBQTBCLEtBQUMsV0FBcUIsSUFBSTs7aUJBQ3BEO3VCQUEwQixLQUFDLGFBQXFCLElBQUk7O2lCQUNwRDt1QkFBMEIsS0FBQyxhQUFxQixJQUFJOztpQkFDcEQ7dUJBQTBC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
