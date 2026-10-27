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
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _233_32_
    
        cursors = this.allCursors()
        anchors = this.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_233_32_=anchors[i]) != null ? _233_32_ : [cursor[0],cursor[1]])
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
        var _570_26_
    
        this.novimInsert = _k_.copy((spec))
        this.novimInsert.text = ((_570_26_=this.novimInsert.text) != null ? _570_26_ : '')
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
        var spec, _620_40_
    
        spec = _k_.copy((((_620_40_=this.lastChange.motion) != null ? _620_40_ : {kind:'line',count:1})))
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
        var i, n, _670_32_
    
        n = _k_.max(1,(((_670_32_=insert.count) != null ? _670_32_ : 1)))
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
        var cursor, cursors, i, rng, rngs, shape, _720_66_
    
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
            shape = ((_720_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _720_66_ : change.shapes[0])
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
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
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
        var i, n, _1165_23_
    
        n = ((_1165_23_=spec.count) != null ? _1165_23_ : count)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BTWEsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCOzs7SUFJSCx1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLG1CQUFXLElBQUksVUFBaUIsT0FBTyxlQUFlLGVBQWUsYUFBYSxlQUFlLGFBQWEsbUJBQW1CLGVBQWUsaUJBQWlCLHFCQUFxQjs7WUFDdEwsS0FBQzs7Z0JBRUUsSUFBSTs7aUJBQ1A7dUJBQWdCLEtBQUMsZUFBbUIsSUFBSSxPQUFRLElBQUk7O2lCQUNwRDt1QkFBZ0IsS0FBQyxZQUFZOztpQkFDN0I7dUJBQWdCLEtBQUMsYUFBbUIsSUFBSSxPQUFRLElBQUk7O2lCQUNwRDt1QkFBZ0IsS0FBQyxZQUFtQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUM5RDt1QkFBZ0IsS0FBQyx1QkFBdUIsSUFBSSxPQUFPLElBQUk7O2lCQUN2RDt1QkFBZ0IsS0FBQyxnQkFBbUIsSUFBSSxNQUFNLElBQUksS0FBSzs7aUJBQ3ZEO3VCQUFnQixLQUFDLGdCQUFtQixJQUFJLE1BQU0sSUFBSSxLQUFLOztpQkFDdkQ7dUJBQWdCLEtBQUMsV0FBbUIsSUFBSSxNQUFNLElBQUk7O2lCQUNsRDtnQkFBaUIsS0FBQztvQkFBbUMsS0FBQzs7MkJBQXBCLEtBQUM7OztpQkFDbkM7dUJBQWdCLEtBQUMsU0FBbUIsSUFBSSxNQUFNLElBQUk7O2lCQUNsRDt1QkFBbUIsS0FBQzs7aUJBQ3BCO3VCQUFnQixLQUFDLGFBQW1CLElBQUksS0FBSyxJQUFJOztpQkFDakQ7dUJBQWdCLEtBQUMsV0FBbUIsSUFBSTs7aUJBQ3hDO3VCQUFpQixLQUFDLGFBQWtCLElBQUk7O2lCQUN4Qzt1QkFBaUIsS0FBQyxhQUFrQixJQUFJOztpQkFDeEM7dUJBQWdCLEtBQUMsV0FBbUIsSUFBSTs7aUJBQ3hDO3VCQUFpQixLQUFDOztpQkFDbEI7dUJBQWdCLEtBQUM7O2lCQUNqQjt1QkFBcUIsS0FBQyxpQkFBaUIsSUFBSTs7aUJBQzNDO3VCQUFnQixLQUFDLGVBQWtCLElBQUksT0FBTzs7aUJBQzlDO3VCQUFnQixLQUFDLGVBQWtCLElBQUksT0FBTzs7aUJBQzlDO3VCQUFpQixLQUFDLGFBQWlCLElBQUksTUFBTTs7aUJBQzdDO3VCQUFtQixLQUFDLGFBQWUsSUFBSSxNQUFNOztpQkFDN0M7dUJBQXVCLEtBQUMsa0JBQWtCOztpQkFDMUM7dUJBQXVCLEtBQUMsa0JBQWtCOztpQkFDMUM7dUJBQWdCLEtBQUMsWUFBbUIsSUFBSTs7aUJBQ3hDO3VCQUFnQixLQUFDLGFBQW1CLElBQUk7OztnQkFDeEIsWUFBSSwyQkFBMkIsSUFBSTs7OztJQUUzRCwwQkFBaUIsT0FBTSxNQUFLOzs7O3NCQUVmLEtBQUMsRUFBRTs7MkJBQ0M7O2dCQUNMLEtBQUMsY0FBYzs7Ozs7OztRQUl2QixNQUFNLEtBQUM7dUJBRUgsSUFBSyxTQUFJLHlCQUFBLFlBQUE7O1lBRVQsU0FBUztnQ0FFRyxLQUFDLEVBQUU7OztnQkFBWDtnQkFFQSxZQUFZLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxPQUFNLElBQUk7b0JBQzlDOztvQkFBWTs7Z0JBRWYsUUFBUyxLQUFLLEtBQU0sSUFBSSxPQUFPLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxLQUFLLElBQUk7Z0JBQ25FLFNBQVMsS0FBSyxLQUFNLElBQUksT0FBTyxLQUFLLE9BQU0sSUFBSSxNQUFPLEtBQUssS0FBSyxJQUFJO29CQUUvRCxXQUFZOztvQkFDWixTQUFTO29CQUNUOztxQkFDRyxXQUFZOztvQkFDZixTQUFTOzs7aUJBRVY7O2dCQUNIOztZQUVKLE9BQU8sT0FBTyxHQUFHLE9BQU87O2VBRTVCLEtBQUMsY0FBYzs7SUFFbkIsMkJBQWtCOzs7O1FBRWQ7NEJBRVksS0FBSyxpQkFBaUIsS0FBQyxFQUFFLE1BQU87OztZQUF4QztzQkFFWSxNQUFYLGFBQUcsWUFBRTs7WUFDTixPQUFZLEtBQUssSUFBSSxLQUFDLEVBQUUsTUFBTTtZQUM5QixVQUFZLEtBQUssSUFBSSxLQUFLLEtBQUcsS0FBSztZQUNsQyxTQUFZLEtBQUssS0FBSyxTQUFTLEtBQUssTUFBTTtnQkFFOUIsS0FBSyxLQUFLLEtBQUssT0FBUSxLQUFLLEtBQUs7O2dCQUE3Qzs7Z0JBQ1ksS0FBSyxLQUFLLEtBQUssS0FBSyxTQUFPLE9BQVEsS0FBSyxLQUFLOztnQkFBekQ7O1lBRUEsTUFBTSxLQUFLOztlQUVmOztJQUVKLHFCQUFZLE9BQU07Ozs7UUFFZCxPQUFPLEtBQUM7c0JBRUk7Ozs7UUFFWixNQUFNLFdBQVc7UUFFakIsUUFBUSxLQUFDLGlCQUFpQjtRQUUxQixLQUFDLGNBQWM7UUFFZixNQUFNLEtBQUssd0JBQXdCLEtBQUMsRUFBRSxNQUFNLEtBQUM7YUFFbkM7Ozs7UUFFVixTQUFTLElBQUksR0FBRyxJQUFJO1FBQ3BCLE9BQVMsSUFBSSxHQUFHLElBQUk7UUFDcEIsTUFBUSxLQUFDO1FBQ1QsUUFBUTt1QkFFSixJQUFLLGtCQUFRLEdBQUcsZ0JBQUEsUUFBUSxnQ0FBWCxHQUFHLGdCQUFBLFFBQVEsa0JBQVgsR0FBRyxnQkFBQSxRQUFROztZQUV4QixTQUFTO2dDQUVHOzs7Z0JBQVI7Z0JBRUEsUUFBUyxLQUFLLEtBQUssSUFBSSxPQUFPLEtBQUssT0FBTSxJQUFJLE1BQU8sS0FBSyxLQUFLLElBQUk7Z0JBQ2xFLFNBQVMsS0FBSyxLQUFLLE1BQU0sT0FBTyxLQUFLLE9BQU0sTUFBTSxNQUFPLEtBQUssS0FBSyxNQUFNO29CQUVyRSxXQUFZOztvQkFDWCxTQUFTO29CQUNUOztxQkFDRyxXQUFZOztvQkFDZixTQUFTOzs7aUJBRUo7O2dCQUFiOztZQUVBLFNBQVMsT0FBTyxHQUFHLE9BQU87WUFDMUIsT0FBUyxPQUFPLEtBQUcsS0FBSyxPQUFPLE9BQU87WUFDdEMsT0FBUyxPQUFPLEdBQUcsT0FBTztZQUMxQixRQUFROztZQUVvQjs7bUJBQWhDLEtBQUMsY0FBYyxJQUFJLEdBQUcsSUFBSTs7O0lBRTlCOzs7O1FBRUksUUFBYSxLQUFDLEVBQUU7UUFDaEIsVUFBYSxLQUFDO1FBQ2Q7UUFDQSxRQUFhOzRCQUVKOzs7WUFBTDtZQUVBLE9BQU8sTUFBTSxFQUFFO1lBQ2YsT0FBTyxLQUFLLGFBQWEsS0FBSyxFQUFFO1lBQ2hDLFFBQVE7bUJBRUYsT0FBTyxLQUFLOztnQkFFZCxLQUFLLEtBQUs7MkJBRVAsSUFBTyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7O29CQUMxQixTQUFTLEtBQUssWUFBWSxLQUFNLE1BQU8sRUFBRSxHQUFJO29CQUM3Qzs7Z0JBRUosUUFBUTs7aUJBRUw7O2dCQUNILFdBQVcsS0FBSztnQkFDaEI7O1lBRUosS0FBSyxNQUFNO1lBQ1g7O3dCQUFjOzt5QkFDVjt5QkFBSTt5QkFBSTsrQkFBTTs7eUJBQ2Q7K0JBQU07O3lCQUNOOytCQUFNOzt5QkFDTjsrQkFBTTs7Ozs7WUFFVixRQUFRLE9BQU8scUJBQXFCLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRztpQkFFckQ7O2dCQUNILFdBQVcsS0FBSztnQkFDaEI7O1lBRUosVUFBUyxTQUFRLE1BQU0sTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLE9BQU8sTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHO1lBRXhFLFdBQVcsS0FBSztZQUNoQixRQUFROztZQUVUOzttQkFDQyxLQUFDLFdBQVcsWUFBVyxLQUFLLEtBQUMsRUFBRTs7O0lBUXZDLHNCQUFhOztZQUVOLEtBQUMsV0FBVTs7bUJBQ1AsS0FBQzs7YUFFRCxLQUFDOztZQUNKLEtBQUMsZ0JBQWdCLEtBQUMsYUFBYSxjQUFLOzt3QkFBTyxFQUFFLEdBQUcsRUFBRTs7O1FBRXRELEtBQUMsU0FBUztlQUVWLEtBQUM7O0lBRUwscUJBQVksaUJBQWU7O1FBRXZCLEtBQUMsU0FBZ0I7UUFDakIsS0FBQzthQUVNOzttQkFDSCxLQUFDOzs7SUFFVDs7OztRQUVJLFVBQVUsS0FBQztRQUNYLFVBQVUsS0FBQztRQUNYOzRCQUVpQjthQUFMOztZQUFSO1lBRUEsb0JBQVMsUUFBUSwwQkFBTSxPQUFPLEdBQUcsT0FBTztZQUV4QyxNQUFNLE9BQU8sT0FBTyxHQUFHLE9BQU8sS0FBSyxPQUFPLEdBQUcsT0FBTzs7UUFFeEQsTUFBTSxlQUFNLEdBQUU7O2dCQUNQLEVBQUUsR0FBRyxPQUFNLEVBQUUsR0FBRzs7dUJBQ2YsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHOzs7O3VCQUVmLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRzs7O1FBRXZCOzZCQUVZOzs7WUFBUjtnQkFDWSxPQUFPLFVBQVcsS0FBSyxRQUFRLG9CQUFXLEdBQUcsS0FBSzs7Z0JBQTlEOztZQUNBLE9BQU8sS0FBSzs7ZUFFaEI7O0lBRUosNkJBQW9CLFFBQU87Ozs7WUFFcEIsS0FBQyxXQUFVOztZQUVWLGFBQVMsT0FBTyxHQUFHLE9BQU87WUFDMUIsYUFBUyxPQUFPLEdBQUcsT0FBTztvQkFFdEIsRUFBRSxHQUFHLEtBQUssTUFBTSxLQUFDLEVBQUUsTUFBTSxLQUFLOztRQUV0QyxLQUFLLE9BQU8sR0FBRyxPQUFPO1FBQ3RCLEtBQUssT0FBTyxHQUFHLE9BQU87WUFFbkIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU0sRUFBRSxNQUFPLEVBQUUsS0FBSyxFQUFFOzt3QkFDL0IsRUFBRSxJQUFWLGFBQUU7OztnQkFFTixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFOztJQUV0Qiw0QkFBbUIsUUFBTzs7OztRQUV0QixhQUFTLE9BQU8sR0FBRyxPQUFPO1FBQzFCLGFBQVMsT0FBTyxHQUFHLE9BQU87UUFDMUIsYUFBUyxPQUFPLEdBQUcsT0FBTztRQUMxQixhQUFTLE9BQU8sR0FBRyxPQUFPO1FBRTFCO1lBRVcsT0FBTTs7bUJBQWQ7O3dCQUVDLElBQUssV0FBSSx5QkFBQSxVQUFBOztnQkFFRyxLQUFLLEtBQUMsRUFBRSxNQUFNOztnQkFBMUI7O1lBRUEsUUFBUSxLQUFLLE1BQU0sS0FBQyxFQUFFLE1BQU07Z0JBRWhCLE1BQU07O2dCQUFsQjs7WUFFQSxhQUFTLEdBQUc7Z0JBRUEsTUFBTTs7Z0JBQWxCOztZQUVBLEtBQUssTUFBTSxHQUFHLEVBQUUsR0FBRzs7ZUFFdkI7O0lBRUo7Ozs7YUFFYyxLQUFDOzs7O1FBRVgsUUFBVSxLQUFDO1FBQ1gsVUFBVSxNQUFNLGNBQUs7O29CQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRzs7UUFDekMsVUFBVSxNQUFNLGNBQUs7O29CQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRzs7UUFFekMsS0FBQyxnQkFBZ0I7UUFFakIsT0FBTyxRQUFRLFdBQVUsS0FBQyxFQUFFLFFBQVE7WUFFakM7O2dDQUNrQjtpQkFBTDs7Z0JBQVI7cUJBQ29CLEtBQUssUUFBUSxPQUFPLEtBQUMsRUFBRSxRQUFROztvQkFBbkQsT0FBTzs7OzthQUVSOztZQUNILEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQzs7UUFFOUI7NkJBQ1k7OztZQUFSO2dCQUNHLEtBQUMsV0FBVTs7Z0JBQ1YsT0FBTyxLQUFLLE9BQU8sS0FBQyxrQkFBa0IsS0FBSyxHQUFHLEtBQUs7Ozs7Z0JBRW5ELEtBQUssS0FBSyxLQUFDLG1CQUFtQixLQUFLLEdBQUcsS0FBSzs7O2VBRW5ELEtBQUMsY0FBYzs7SUFFbkIsdUJBQWM7Ozs7UUFFVixPQUFPLEtBQUMsRUFBRSxXQUFXO3NCQUVUOzs7O1FBRVosV0FBVyxLQUFDLFdBQVU7UUFFdEIsY0FBYztZQUVYLEtBQUMsV0FBVTs7WUFDVixjQUFjLEtBQUMsY0FBYyxjQUFLOztnQ0FBVyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsWUFBUSxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUc7OztRQUVuRixLQUFDLGlCQUFpQixLQUFLLFNBQVM7UUFFaEMsS0FBQyxjQUFlLFNBQVUsZUFBZ0IsU0FBVSxTQUFVLFNBQVUsU0FBVSxPQUFRLEtBQUM7UUFFM0YsS0FBQztRQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYTtRQUVqQyxLQUFDO1lBRXdDOztZQUF6QyxLQUFDLFdBQVcsYUFBWSxLQUFLLEtBQUMsRUFBRTs7ZUFFaEMsS0FBQzs7SUFFTCxxQkFBWTs7OztRQUVSLE9BQU8sS0FBQyxFQUFFLFdBQVc7c0JBRVQ7Ozs7UUFFWixXQUFXLEtBQUMsV0FBVTtRQUV0QixLQUFDLGlCQUFpQixLQUFLLFNBQVM7WUFFN0IsS0FBQyxXQUFVOztZQUNWLFFBQVMsS0FBQztZQUNWLFNBQVMsTUFBTSxjQUFLOztnQ0FBVyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsWUFBUSxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUc7Ozs7O1lBRWpFLFNBQVMsS0FBSyxjQUFLOzt3QkFBTyxFQUFFLEdBQUcsRUFBRTs7O1FBRXJDLEtBQUMsV0FBVyxRQUFPLEtBQUssS0FBQztlQUV6QixLQUFDOztJQUVMOzs7O1FBRUksT0FBTyxLQUFDLEVBQUUsV0FBVztzQkFFVDs7OztRQUVaLEtBQUMsa0JBQW1CLEtBQU0sU0FBVSxTQUFVLEtBQUMsV0FBVSxPQUFRLE9BQVEsS0FBQztRQUUxRSxLQUFDLFdBQVcsS0FBSyxxQkFBcUIsT0FBTSxLQUFLLEtBQUM7UUFFbEQsS0FBQyxTQUFnQjtRQUNqQixLQUFDO2VBRUQsS0FBQyxTQUFTOztJQUVkLDRCQUFtQjs7OztRQUVmLE9BQU8sS0FBQyxFQUFFO3NCQUVFOzs7O1FBRVosVUFBVSxLQUFLLGNBQUs7O3FCQUFPLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBRyxFQUFFOztRQUVqRCxLQUFDLGtCQUFtQixNQUFNLFFBQVEsZ0JBQWdCLGdCQUFnQixPQUFRLEtBQUM7UUFFM0UsS0FBQztRQUVELEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFO2VBRTVCLEtBQUMsU0FBUzs7SUFFZDs7OztRQUVJO1lBRUcsS0FBQyxXQUFVOztZQUVWLEtBQUs7WUFDTCxLQUFLO2dDQUVNLEtBQUMsRUFBRTs7O2dCQUFWO2dCQUNBLGFBQVMsR0FBRyxJQUFJO2dCQUNoQixhQUFTLEdBQUcsSUFBSTs7WUFFcEIsT0FBTyxNQUFPLFNBQVUsS0FBTSxNQUFPLEtBQUcsS0FBRzs7aUJBRXZDLEtBQUMsV0FBVTs7MkJBRUYsS0FBQyxFQUFFOztnQkFFWixLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLO3FDQUVNLEtBQUMsRUFBRTs7O29CQUFWO29CQUNBLGFBQVMsR0FBRyxJQUFJO29CQUNoQixhQUFTLEdBQUcsSUFBSTtvQkFDaEIsYUFBUyxHQUFHLElBQUk7b0JBQ2hCLGFBQVMsR0FBRyxJQUFJOztnQkFFcEIsT0FBTyxNQUFPLE1BQU8sS0FBTSxHQUFJLEVBQUcsR0FBSSxFQUFHLEdBQUksS0FBRyxHQUFJLEdBQUksS0FBRzs7Ozs7aUNBSXBELEtBQUMsRUFBRTs7O2dCQUFWO2dCQUNBLE9BQU8sTUFBTyxTQUFVLE1BQU8sR0FBSSxFQUFHLEdBQUksRUFBRyxHQUFJLElBQUksS0FBRyxJQUFJLEdBQUksR0FBSSxJQUFJLEtBQUcsSUFBSTs7O2VBRXZGOztJQUVKOzs7O2FBRWMsS0FBQzs7OztRQUVYLFVBQVUsS0FBQztRQUNYLFVBQVUsS0FBQzs0QkFFTTthQUFMOztZQUFSO2lCQUVnQixRQUFROztnQkFBeEI7O1lBRUEsU0FBYSxRQUFRO1lBQ3JCLFFBQVEsTUFBTSxPQUFPLEdBQUcsT0FBTztZQUMvQixRQUFRLE1BQU0sT0FBTyxHQUFHLE9BQU87O1FBRW5DLEtBQUMsZ0JBQWdCO1FBRWpCLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQztlQUUxQixLQUFDOztJQUVMLDJCQUFrQjs7OzthQUVKLEtBQUM7Ozs7UUFFWDs0QkFFYyxLQUFDOzs7WUFBWDtZQUVBLE1BQU0sT0FBTyxNQUFNLEtBQUMsRUFBRSxNQUFNLE9BQU87aUJBRW5COztnQkFBaEI7O2dCQUNZLEtBQUssYUFBYTs7Z0JBQTlCOztZQUVBLEtBQUssS0FBSzs7c0JBRUY7Ozs7UUFFWixLQUFDLGdCQUFnQixLQUFLLGNBQUs7O29CQUFPLEVBQUUsR0FBRyxFQUFFOztRQUV6QyxVQUFVLEtBQUssY0FBSzs7NEJBQVcsRUFBRSxHQUFHLEVBQUUsS0FBRyxHQUFHLEVBQUU7O1FBRTlDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQztlQUUxQixLQUFDOztJQUVMLHlCQUFnQixNQUFLLFdBQVM7Ozs7UUFFMUI7NEJBRWMsS0FBQzs7O1lBQVg7WUFFQSxNQUFNLE9BQU8sTUFBTSxLQUFDLEVBQUUsTUFBTSxPQUFPO2lCQUVuQjs7Z0JBQWhCOztZQUVBLFVBQVUsUUFBUSxPQUFPLEtBQUssb0JBQW9COztzQkFFMUM7Ozs7UUFFWixLQUFDLGdCQUFnQixRQUFRO2VBRXpCLEtBQUMsY0FBZSxVQUFVLFdBQVcsYUFBYSxVQUFVLGlCQUFhOztJQUU3RSx1QkFBYyxPQUFNLFdBQVM7Ozs7UUFFekIsVUFBVSxLQUFLLHFCQUFxQixLQUFDLEVBQUU7c0JBRTNCOzs7O1FBRVosVUFBVSxNQUFNLFNBQVMsSUFBSTtRQUM3Qjs0QkFFYTs7O1lBQVQ7WUFDQSxRQUFRLFNBQVMsS0FBSyxVQUFVLEtBQUMsRUFBRSxNQUFNOztRQUU3QyxLQUFDLGdCQUFnQixRQUFRLFdBQVUsZ0JBQUEsUUFBUTtRQUUzQzs2QkFFYyxLQUFDOzs7WUFBWDtZQUVBLFlBQVksUUFBUSxPQUFPO2lCQUV4Qjs7Z0JBQ0MsUUFBUSxLQUFLLFVBQVUsS0FBQyxFQUFFLE1BQU0sT0FBTyxPQUFPO2dCQUM5QyxRQUFRLGNBQVUsRUFBRSxPQUFPLEtBQUcsT0FBTyxPQUFPOzs7O2dCQUU1QyxRQUFRLE1BQU0sT0FBTyxHQUFHLE9BQU87OztRQUV2QyxLQUFDLGdCQUFnQjtRQUVqQixLQUFDLGNBQWUsVUFBVSxXQUFXLGFBQWEsVUFBVSxRQUFVLEtBQU0sT0FBUSxNQUFPLFFBQVE7ZUFFbkcsS0FBQzs7SUFFTCwwQkFBaUIsU0FBUSxXQUFTLE9BQU0sUUFBTTs7OztRQUUxQyxVQUFVLE1BQU0sU0FBUyxJQUFJO1FBRTdCLFFBQVEsZUFBTSxHQUFFOzttQkFBTSxJQUFJOztzQkFFZDs7OztRQUVaLFlBQVEsSUFBRyxnQkFBQSxRQUFRO1FBRW5CLEtBQUM7d0JBRUcsSUFBSyxVQUFJLHVCQUFBLFFBQUE7O2dCQUVOOzsyQkFDOEIsS0FBSyx3Q0FBd0MsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFLFFBQVEsVUFBM0csaUJBQU0sc0JBQVc7Ozs7OzJCQUVXLEtBQUssc0NBQXNDLEtBQUMsRUFBRSxNQUFNLEtBQUMsRUFBRSxXQUFXLEtBQUMsRUFBRSxRQUFRLFVBQXpHLGlCQUFNLHNCQUFXOzs7WUFFdEIsS0FBQyxTQUFTO1lBQ1YsS0FBQyxjQUFjO1lBQ2YsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDOztlQUU5QixLQUFDOztJQUVMLHNCQUFhOztRQUVULEtBQUMsYUFBYTtlQUNkLEtBQUMsZUFBZSxJQUFJLE9BQU8sSUFBSTs7SUFFbkMsMkJBQWtCOzs7O1FBRWQsS0FBQyx3QkFBbUI7UUFFcEIsS0FBQyxZQUFZLGtCQUFiLEtBQUMsWUFBWSwyQkFBUTtlQUVyQixLQUFDOztJQUVMLDRCQUFtQjs7YUFFTCxLQUFDLGVBQWUsS0FBQzs7OztlQUUzQixLQUFDLFlBQVksUUFBUTs7SUFFekI7Ozs7YUFFYyxLQUFDLGVBQWUsS0FBQzs7OztRQUUzQixPQUFPLEtBQUMsWUFBWTtZQUVnQixLQUFLOzttQkFBekMsS0FBQyxZQUFZLE9BQU8sV0FBSzs7O0lBRTdCOzs7O2FBRWMsS0FBQzs7OztRQUVYLFNBQVMsS0FBQztRQUVWLEtBQUMsY0FBYztlQUVmLEtBQUMsY0FBZSxTQUFVLFNBQVUsT0FBUTs7SUFFaEQsdUJBQWM7Ozs7YUFFQSxLQUFDOzs7O2dCQUVKLEtBQUMsV0FBVzs7aUJBQ2Y7dUJBQWdCLEtBQUMsYUFBaUIsS0FBQyxXQUFXLE9BQVUsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOztpQkFDeEY7dUJBQWdCLEtBQUMsYUFBa0IsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOztpQkFDbkU7dUJBQWdCLEtBQUMsZUFBa0IsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXOztpQkFDbkU7dUJBQWdCLEtBQUMsYUFBaUIsTUFBTTs7aUJBQ3hDO3VCQUFnQixLQUFDLGFBQWlCLE1BQU07O2lCQUN4Qzt1QkFBZ0IsS0FBQyxhQUFpQjs7aUJBQ2xDO3VCQUFnQixLQUFDLFVBQWlCOztpQkFDbEM7dUJBQWdCLEtBQUMsYUFBaUIsTUFBTTs7O2dCQUVwQyxnQkFBWSxLQUFDLFdBQVc7b0JBRUYsUUFBUTs7Z0JBQTlCLEtBQUssUUFBUTs7dUJBRWIsS0FBQyxlQUFlLEtBQUssS0FBQyxXQUFXOzs7O0lBRTdDLHVCQUFjLE9BQU07Ozs7UUFFaEIsNEJBQWEsS0FBQyxXQUFXLDhCQUFXLEtBQU0sT0FBUSxNQUFPO1lBRW5DLFFBQVE7O1lBQTlCLEtBQUssUUFBUTs7ZUFFYixLQUFDLGVBQWUsS0FBSzs7SUFFekIsb0JBQVc7Ozs7UUFFUCxZQUFRLElBQUcsUUFBUSxJQUFJLFFBQVEsS0FBQyxXQUFXO2VBRTNDLEtBQUMsWUFBWSxLQUFDLFdBQVcsSUFBSSxFQUFFLEtBQUMsV0FBVzs7SUFFL0MsdUJBQWM7Ozs7UUFFVixTQUFTLEtBQUMsV0FBVztRQUVyQixZQUFRLElBQUcsZ0JBQUEsUUFBUTt3QkFFZixJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxLQUFDLGFBQWE7OztJQUV0Qix1QkFBYzs7Z0JBRUgsT0FBTzs7aUJBQ1Y7dUJBQW1CLEtBQUMsZ0JBQWdCLE9BQU87O2lCQUMzQztnQkFBbUIsS0FBQyxZQUFZO3VCQUFVLEtBQUMsZ0JBQWdCLE9BQU87O2lCQUNsRTtnQkFBbUIsS0FBQyxZQUFZO3VCQUFVLEtBQUMsZ0JBQWdCLE9BQU87O2lCQUNsRTtnQkFBbUIsS0FBQyxZQUFZO3VCQUFVLEtBQUMsZ0JBQWdCLE9BQU87O2lCQUNsRTtnQkFBbUIsS0FBQyxhQUFhLE9BQVE7dUJBQVEsS0FBQyxnQkFBZ0IsT0FBTzs7aUJBQ3pFO2dCQUFtQixLQUFDLGFBQWEsT0FBUTt1QkFBUSxLQUFDLGdCQUFnQixPQUFPOztpQkFDekU7dUJBQW1CLEtBQUMsa0JBQWtCLE9BQU87O2lCQUM3Qzt1QkFBbUIsS0FBQyxrQkFBa0IsT0FBTzs7aUJBQzdDO3VCQUFtQixLQUFDLGFBQWE7O2lCQUNqQzt1QkFBbUIsS0FBQyxhQUFhLE9BQU87OztnQkFDckIsWUFBSSx5QkFBeUIsT0FBTzs7OztJQUUvRCx1QkFBYzs7OztRQUVWLGdCQUFZLE9BQU87UUFFbkIsT0FBTyxLQUFDLGVBQWU7c0JBRVg7Ozs7UUFFWixLQUFDLFdBQVcsS0FBSyxxQkFBcUIsT0FBTSxLQUFLLEtBQUMsRUFBRTtlQUVwRCxLQUFDLGdCQUFnQixPQUFPOztJQUU1Qix1QkFBYyxRQUFPOzs7O1FBRWpCLFlBQVEsY0FBRyxPQUFPLDRCQUFRO1FBRTFCLEtBQUM7d0JBRUcsSUFBSyxVQUFJLHVCQUFBLFFBQUE7O1lBQ1QsS0FBQyxVQUFVLElBQUk7O2VBRW5CLEtBQUM7O0lBRUwsNEJBQW1CLFFBQU87Ozs7UUFFdEIsUUFBUSxPQUFPLE9BQU87YUFFWjs7OztRQUVWLE9BQU8sS0FBQyxvQkFBb0IsTUFBTSxLQUFDO3NCQUV2Qjs7OztRQUVaLFVBQVUsS0FBSyxjQUFLOztxQkFBTyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUcsRUFBRTs7UUFFakQsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDLEVBQUU7ZUFFNUIsS0FBQyxnQkFBZ0IsT0FBTzs7SUFFNUIsMEJBQWlCOztRQUViLEtBQUMsaUJBQWlCO1FBRWxCLEtBQUMsT0FBTztlQUVSLEtBQUMsaUJBQWlCOztJQUV0Qix1QkFBYyxPQUFNOzs7O1FBRWhCLFlBQVEsSUFBRyxnQkFBQSxRQUFRO3dCQUVmLElBQUssVUFBSSx1QkFBQSxRQUFBOztZQUNULEtBQUMsYUFBYSxLQUFDLFdBQVc7OztJQUVsQyx1QkFBYyxRQUFPOzs7O1FBRWpCO1FBRUEsVUFBVSxLQUFDO1lBRWtCLE9BQU8sT0FBTyxVQUFXLE9BQU8sT0FBTyxHQUFHOztZQUF2RSxXQUFXLEtBQUM7OzRCQUVLO2FBQUw7O1lBQVI7WUFFQSxtQkFBUSxPQUFPLGVBQVcsRUFBRyxPQUFPLE9BQU8sU0FBTywwQkFBTSxPQUFPLE9BQU87aUJBRXREOztnQkFBaEI7O2dCQUVHLE1BQU07O3FDQUNNLEtBQUMsb0JBQW9CLE1BQU87OztvQkFBbkM7b0JBQ0EsS0FBSyxLQUFLOztnQkFDZDs7WUFFSixNQUFNLEtBQUMsb0JBQW9CLE1BQU07aUJBRWpCOztnQkFBaEI7O2dCQUNZLEtBQUssYUFBYTs7Z0JBQTlCOztZQUVBLEtBQUssS0FBSzs7c0JBRUY7Ozs7WUFFVCxXQUFVOztZQUVULEtBQUMsaUJBQWlCLEtBQUssT0FBTyxTQUFTLE9BQU87WUFFOUMsS0FBQztZQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYSxPQUFPO21CQUV4QyxLQUFDOzs7O1lBSUQsS0FBQyxjQUFjO1lBRWYsS0FBQyxXQUFXLEtBQUsscUJBQXFCLE9BQU0sS0FBSyxLQUFDLEVBQUU7bUJBRXBELEtBQUMsZ0JBQWdCLE9BQU87OztJQUVoQyw4QkFBcUIsT0FBTTs7OztRQUV2QixRQUFRLEtBQUMsRUFBRTtzQkFFQzs7OztZQUVULE1BQU07O1lBRUwsYUFBUyxPQUFPLEdBQUcsTUFBTSxTQUFPO1lBQ2hDLGFBQVMsT0FBTyxLQUFHLE1BQU0sUUFBTSxFQUFFLE1BQU0sU0FBTztvQkFFMUMsRUFBRSxHQUFHLEtBQUssTUFBTSxNQUFNLEtBQUs7O1FBRW5DLGFBQVMsT0FBTyxHQUFHLE1BQU0sU0FBTztRQUNoQyxhQUFTLE9BQU8sS0FBRyxNQUFNLEdBQUcsTUFBTSxTQUFPO1FBRXpDLGFBQVMsT0FBTyxHQUFHLEtBQUssTUFBTSxNQUFNO1FBQ3BDLGFBQVMsT0FBTyxLQUFHLE1BQU0sR0FBRyxLQUFLLE1BQU0sTUFBTTtnQkFFNUMsR0FBRyxHQUFHLEdBQUc7O0lBRWQsOEJBQXFCLE9BQU07Ozs7UUFFdkIsUUFBUSxLQUFDLEVBQUU7UUFFWDtzQkFFaUI7O21CQUFkOztRQUVILGFBQVMsT0FBTyxHQUFHLE1BQU0sU0FBTztRQUNoQyxhQUFTLE9BQU8sS0FBRyxNQUFNLEdBQUcsTUFBTSxTQUFPO1FBQ3pDLEtBQUssT0FBTzt3QkFFUixJQUFLLFdBQUkseUJBQUEsVUFBQTs7WUFFVCxRQUFRLEtBQUssTUFBTSxNQUFNO2dCQUViLE1BQU07O2dCQUFsQjs7WUFFQSxhQUFTLEtBQUcsTUFBTSxHQUFHO2dCQUVULE1BQU07O2dCQUFsQjs7WUFFQSxLQUFLLE1BQU0sR0FBRyxFQUFFLEdBQUc7O2VBRXZCOztJQUVKLHdCQUFlOztZQUVBLGFBQVk7O21CQUFyQjs7WUFDUzs7bUJBQVQ7O2VBRUYsTUFBTTs7SUFFVixrQ0FBeUI7Ozs7UUFFckIsT0FBTyxJQUFJLE1BQU0sS0FBSztZQUNOLElBQUk7O1lBQXBCLFFBQVE7O1lBRUwsS0FBSyxhQUFZOzttQkFDaEIsS0FBSyxPQUFPOzs7O21CQUVaLEtBQUssS0FBSzs7O0lBRWxCOzs7O1FBRUksUUFBTyxLQUFLLGFBQVksU0FBUyxLQUFLLE9BQU8sS0FBSztzQkFFakM7O21CQUFkOztRQUVILFdBQVcsS0FBSyxTQUFTO1FBQ3pCLFFBQVcsS0FBSyxNQUFNO1lBRVA7O1lBQWYsTUFBTTs7Z0JBRUosTUFBTyxNQUFPLFNBQVU7O0lBRTlCLHlCQUFnQjs7OztRQUVaLFFBQVEsS0FBQyxFQUFFO1FBQ1g7NEJBRWMsS0FBQzs7O1lBQVg7WUFFQSxNQUFNLE9BQU8sTUFBTSxNQUFNLE9BQU87aUJBQ2hCOztnQkFBaEI7O2dCQUVZLEtBQUssYUFBYSxTQUFhLE9BQU8sV0FBVzs7Z0JBQTdEOztZQUVBLEtBQUssS0FBSzs7c0JBRUY7Ozs7UUFFWixPQUFPLE9BQU8sWUFBWTtRQUUxQixLQUFDLGNBQWM7ZUFFZjs7SUFFSiwyQkFBa0IsTUFBSyxVQUFTOzs7O1FBRTVCOzRCQUVXOzs7WUFBUDtZQUNBLE1BQU0sS0FBSyxLQUFLLGlCQUFpQixLQUFDLEVBQUUsTUFBTzs7UUFFL0MsS0FBQyxpQkFBa0IsTUFBTyxNQUFNLEtBQUssTUFBTSxNQUFNLE1BQU8sU0FBVTtZQUV2QixLQUFDLGNBQWM7O21CQUExRCxLQUFDLHdCQUF3QixLQUFDOzs7SUFFOUIseUJBQWdCLE1BQUs7Ozs7UUFFakIsT0FBTyxLQUFDLGVBQWU7c0JBRVg7Ozs7UUFFWixXQUFXLE9BQU8sV0FBVztRQUU3QixLQUFDLGlCQUFpQixLQUFLLFNBQVM7UUFFaEMsS0FBQztRQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYTtlQUVqQyxLQUFDOztJQUVMLHlCQUFnQixNQUFLOzs7O1FBRWpCLE9BQU8sS0FBQyxlQUFlO3NCQUVYOzs7O1FBRVosS0FBQyxXQUFXLEtBQUsscUJBQXFCO1FBRXRDLEtBQUMsa0JBQW1CLEtBQU0sU0FBVSxpQkFBYTtlQUVqRCxLQUFDLFNBQVM7O0lBRWQsdUJBQWMsTUFBSzs7OztRQUVmLFFBQVcsS0FBQyxFQUFFO1FBQ2QsV0FBVyxPQUFPLFdBQVc7UUFDN0IsVUFBVyxLQUFDO1FBQ1o7NEJBRW1CO2FBQVA7O1lBQVI7WUFFQSxNQUFNLE9BQU8sTUFBTSxNQUFNLE9BQU87aUJBQ2hCOztnQkFBaEI7O2dCQUNZLEtBQUssYUFBYSxTQUFhOztnQkFBM0M7O1lBRUEsTUFBTSxLQUFLLEtBQUssaUJBQWlCLE1BQU87aUJBQ0Y7O2dCQUF0QyxRQUFRLFFBQVEsSUFBSSxHQUFHLElBQUk7OztzQkFFbkI7Ozs7UUFFWixLQUFDLGlCQUFrQixNQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sTUFBTyxTQUFVO1lBRXZCLEtBQUMsY0FBYzs7WUFBMUQsS0FBQyx3QkFBd0IsS0FBQzs7YUFFbkI7O1lBQ0gsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDLEVBQUU7bUJBQzVCLEtBQUM7OztJQUVULHNCQUFhLE9BQU0sT0FBTTs7OztRQUVyQixNQUFNLEtBQUM7WUFFMkIsS0FBQyxjQUFjOztZQUFqRCxNQUFNLEtBQUM7O2FBRUcsaUJBQWEsSUFBSTs7OztRQUUzQixZQUFRLElBQUcsZ0JBQUEsUUFBUTtRQUVuQixLQUFDLFlBQVksSUFBSSxFQUFFO2VBRW5CLEtBQUMsY0FBZSxTQUFVLE1BQU8sTUFBTyxNQUFPLE1BQU8sRUFBRyxTQUFVLFNBQVUsS0FBTyxnQkFBWSxJQUFJLFFBQVEsU0FBVSxJQUFJOztJQUU5SCxzQkFBYSxLQUFJLE9BQU07Ozs7UUFFbkIsS0FBQzt3QkFFRyxJQUFLLFVBQUksMkJBQUEsWUFBQTs7Z0JBQ04sSUFBSTs7Z0JBQ0gsS0FBQyxTQUFTLElBQUksTUFBTTs7OztnQkFFcEIsS0FBQyxRQUFRLElBQUksTUFBTSxLQUFLLE1BQU07OztlQUV0QyxLQUFDOztJQUVMLG1CQUFVLGFBQVk7Ozs7UUFFbEIsUUFBVSxLQUFLLE1BQU07UUFDckIsUUFBVSxLQUFDLEVBQUUsTUFBTSxjQUFLOzttQkFBTTs7UUFDOUIsVUFBVSxLQUFDO1FBQ1g7NEJBRWM7YUFBUDs7WUFBSDtZQUNBLE1BQU0sS0FBSzs7UUFFZixNQUFNLGVBQU0sR0FBRTs7Z0JBQ1AsUUFBUSxHQUFHLE9BQU0sUUFBUSxHQUFHOzt1QkFDM0IsUUFBUSxHQUFHLEtBQUssUUFBUSxHQUFHOzs7O3VCQUUzQixRQUFRLEdBQUcsS0FBSyxRQUFRLEdBQUc7OztRQUVuQztRQUNBLFNBQWE7NkJBRUY7OztZQUFQO1lBRUEsSUFBSyxRQUFRLEtBQUssS0FBSztZQUN2QixNQUFLLFFBQVEsSUFBRSxJQUFJO1lBRW5CLFFBQVEsWUFBTSxVQUFJLGtCQUFBLFNBQUksT0FBTyxPQUFPLE9BQU8sWUFBTTtZQUVqRCxRQUFRLE1BQU07WUFDZCxZQUFZLEtBQUssVUFBVSxlQUFXLEVBQUUsS0FBSyxNQUFNLFNBQU87WUFFMUQsV0FBVyxNQUFNLEVBQUU7WUFDbkIsVUFBVSxNQUFNOztRQUVwQixLQUFDLFNBQVM7ZUFDVixLQUFDLFdBQVc7O0lBRWhCLGtCQUFTLE1BQUs7Ozs7UUFFVixRQUFVLEtBQUMsRUFBRTtRQUNiLFVBQVUsS0FBQztRQUNYOzRCQUVTOzs7WUFBTDtZQUNBLFFBQVEsS0FBSyxNQUFNLE1BQU0sRUFBRTtZQUMzQixZQUFZLEVBQUUsR0FBRztpQkFDUzs7Z0JBQTFCLFlBQVksRUFBRSxJQUFFOztZQUNoQixLQUFLLE1BQU0sRUFBRSxFQUFFOzttQkFFRSxLQUFLLHNCQUFzQixNQUFNLEtBQUssT0FBMUQsb0JBQVM7O1FBRVYsS0FBQyxTQUFTO2VBQ1YsS0FBQyxXQUFXOztJQUVoQixtQkFBVSxPQUFNOzs7O1FBRVosWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFFbkIsS0FBQzt3QkFFRyxJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxLQUFDLFVBQVUsSUFBSTs7UUFFbkIsS0FBQztRQUVELEtBQUMsa0JBQW1CLE1BQU0sUUFBUSxrQkFBa0Isa0JBQWtCLE1BQU87ZUFFN0UsS0FBQyxTQUFTOztJQUVkOztRQUVJLEtBQUMsWUFBWTtRQUViLEtBQUMsa0JBQW1CLEtBQU07ZUFFMUIsS0FBQyxTQUFTOztJQUVkLHVCQUFjLE1BQUs7Ozs7UUFFZixZQUFjLElBQUcsZ0JBQUEsUUFBUTtRQUN6QixRQUFVLEtBQUMsRUFBRSxNQUFNLGNBQUs7O21CQUFNOztRQUM5QixVQUFVLEtBQUM7UUFDWCxVQUFVOzRCQUVEOzs7WUFBTDtZQUVBLE9BQU8sTUFBTSxFQUFFLElBQUk7WUFDbkIsT0FBTyxLQUFLLGFBQWEsS0FBSyxFQUFFO2dCQUVwQixPQUFLLElBQUksS0FBSzs7Z0JBQTFCOztZQUVBOzRCQUNJLElBQUssVUFBSSx1QkFBQSxRQUFBOztnQkFDVCxLQUFLLEtBQUs7O1lBRWQsVUFBVSxXQUFLLFVBQUksb0JBQUEsV0FBTSxPQUFPLE1BQU0sT0FBTyxXQUFLLE9BQUs7WUFFdkQsTUFBTSxFQUFFLE1BQU07WUFDZCxFQUFFLEtBQVksS0FBSyxNQUFNLGNBQVEsR0FBSSxPQUFLO1lBQzFDLFVBQWM7O2FBRVI7Ozs7UUFFVixLQUFDO1FBRUQsS0FBQyxTQUFTO1FBQ1YsS0FBQyxXQUFXLFNBQVEsS0FBSyxLQUFDLEVBQUU7UUFFNUIsS0FBQztlQUVELEtBQUMsY0FBZSxTQUFVLFVBQVcsS0FBTSxLQUFNLE1BQU87O0lBRTVELHFCQUFZOzs7O1FBRVIsWUFBYyxJQUFHLGdCQUFBLFFBQVE7UUFDekIsUUFBVSxLQUFDLEVBQUUsTUFBTSxjQUFLOzttQkFBTTs7UUFDOUIsVUFBVSxLQUFDO1FBQ1gsVUFBVTs0QkFFRDs7O1lBQUw7WUFFQSxPQUFPLE1BQU0sRUFBRSxJQUFJO1lBQ25CLE9BQU8sS0FBSyxhQUFhLEtBQUssRUFBRTtnQkFFcEIsUUFBUSxLQUFLOztnQkFBekI7O1lBRUEsZ0JBQVksS0FBSyxTQUFPLEVBQUUsT0FBSyxJQUFFOzRCQUU3QixJQUFLLGFBQU0sNEJBQUEsYUFBQTs7Z0JBRVgsTUFBTyxLQUFLO2dCQUNaLFFBQVEsSUFBSTtnQkFFWixLQUFLLE1BQUssVUFBUyxNQUFNLFFBQVEsSUFBSTs7WUFFekMsTUFBTSxFQUFFLE1BQU07WUFDZCxFQUFFLEtBQVksS0FBSyxNQUFNLFdBQUssa0JBQVEsUUFBTSxFQUFHLEtBQUssU0FBTywwQkFBckIsUUFBTSxFQUFHLEtBQUssU0FBTztZQUMzRCxVQUFjOzthQUVSOzs7O1FBRVYsS0FBQztRQUVELEtBQUMsU0FBUztRQUNWLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFO1FBRTVCLEtBQUM7ZUFFRCxLQUFDLGNBQWUsU0FBVSxhQUFjLE1BQU87O0lBRW5ELHVCQUFjOzs7O1FBRVYsWUFBYyxJQUFHLGdCQUFBLFFBQVE7UUFDekIsUUFBVSxLQUFDLEVBQUUsTUFBTSxjQUFLOzttQkFBTTs7UUFDOUIsVUFBVSxLQUFDO1FBRVg7NEJBQ1M7OztZQUFMO2dCQUNvQixFQUFFLEtBQUssTUFBTSxTQUFPLGNBQU0sRUFBRSxHQUFVOztnQkFBMUQsT0FBTyxLQUFLLEVBQUU7OztzQkFFTjs7OztRQUVaLE9BQU8sZUFBTSxHQUFFOzttQkFBTSxJQUFJOztRQUV6Qjs2QkFDUzs7O1lBQUw7Z0JBQ1ksT0FBTyxVQUFXLElBQUksb0JBQVcsS0FBSyxvQkFBVzs7Z0JBQTdEOztZQUNBLE9BQU8sTUFBTSxVQUFNLEVBQUcsTUFBTSxTQUFPLEdBQUc7OzZCQUU3Qjs7O1lBQVQ7dUJBRVcsT0FBVixhQUFFOztZQUNILFFBQVcsS0FBSyxJQUFJLE1BQU0sSUFBSSxRQUFRLE9BQU87WUFDN0MsU0FBWTs0QkFFUixJQUFLLFVBQUksMEJBQUEsV0FBQTs7Z0JBQ1QsT0FBTyxLQUFLLElBQUksTUFBTSxJQUFFLElBQUksUUFBUSxPQUFPLElBQUksUUFBUSxPQUFPO2dCQUM5RCxNQUFNLEtBQUs7O1lBRWYsU0FBUztpQ0FDRzs7O2dCQUFSOzhCQUNrQjs7b0JBQWxCOztnQkFDQSxxQkFBZSxXQUFVLE9BQU8sU0FBUyxNQUFNOztZQUVuRCxNQUFNLEtBQUssS0FBSyxNQUFNO1lBRXRCLE1BQU0sT0FBTyxFQUFFLE1BQU0sS0FBSzs7UUFFOUI7NkJBRVM7OztZQUFMO3VCQUVRLEdBQVAsYUFBRTs7WUFDSCxLQUFRO1lBQ1IsS0FBUTtpQ0FFSzs7O2dCQUFUOzJCQUVpQixPQUFoQixjQUFHLGdCQUFLOztxQkFFTixNQUFNLEtBQUEsSUFBSSxLQUFHOztvQkFDWixLQUFLO29CQUNMLEtBQUs7b0JBQ0w7O29CQUVELEtBQUcsUUFBUTs7b0JBQ1YsTUFBTSxPQUFLOzs7WUFFbkIsV0FBVyxNQUFNLEdBQUc7O1FBRXhCLEtBQUM7UUFFRCxLQUFDLFNBQVM7UUFDVixLQUFDLFdBQVcsWUFBVyxLQUFLLEtBQUMsRUFBRTtRQUUvQixLQUFDO2VBRUQsS0FBQyxjQUFlLFNBQVUsZUFBZ0IsTUFBTzs7SUFFckQsdUJBQWMsTUFBSyxRQUFNOzs7O1FBRXJCLGdCQUFJLEtBQUssNkJBQVE7WUFFZCxLQUFLLFNBQVE7O21CQUNaLEtBQUMsZUFBZSxLQUFLOzs7OzRCQUVqQixJQUFLLFVBQUcsd0JBQUEsU0FBQTs7Z0JBQ1IsS0FBQyxZQUFZLEtBQUs7Ozs7SUFFOUIsaUNBQXdCLE1BQUssUUFBTTs7UUFFL0IsS0FBQyxhQUFhLEtBQUs7WUFFQSxLQUFDOzttQkFBcEIsS0FBQzs7O0lBRUwseUJBQWdCLE1BQUs7Ozs7UUFFakIsUUFBVSxLQUFDLEVBQUU7UUFDYixVQUFVLEtBQUM7UUFDWCxVQUFVLEtBQUssWUFBVzs0QkFFUDthQUFQOztZQUFSO1lBRUEsTUFBTSxPQUFPLGlCQUFpQixNQUFNLE9BQU8sS0FBSyxPQUFPLEVBQUUsS0FBSyxLQUFLO2dCQUVoRSxPQUFRLEtBQUssVUFBVyxLQUFLLFFBQVMsSUFBSSxPQUFNLE9BQU8sTUFBTyxJQUFJLE9BQU0sT0FBTzs7Z0JBQzlFLE1BQU0sT0FBTyxpQkFBaUIsTUFBTSxPQUFPLEtBQUssT0FBTyxJQUFFLEVBQUUsS0FBSyxLQUFLOztnQkFFdEU7O2dCQUNDLFFBQVEsT0FBTzs7O1FBRXZCLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFO2VBRTVCLEtBQUMsa0JBQWtCOztJQUV2Qiw0QkFBbUI7Ozs7UUFFZjtRQUNBLFVBQVUsS0FBSyxZQUFXOzRCQUVqQixPQUFPLGlCQUFpQixLQUFDLEVBQUUsTUFBTSxLQUFLLE9BQU8sS0FBSyxLQUFLOzs7WUFBNUQ7WUFFQSxRQUFRLEtBQUssTUFBTSxLQUFDLEVBQUUsTUFBTSxFQUFFO2dCQUUzQixFQUFFLEtBQUs7O2dCQUNOLE1BQU0sTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBRyxFQUFFLEVBQUU7OztlQUV2QyxLQUFDLGNBQWM7O0lBRW5CLHNCQUFhLE9BQU07Ozs7UUFFZixPQUFPLE1BQU0sSUFBSTtRQUNqQixJQUFPLEtBQUssYUFBYSxLQUFLLElBQUk7UUFFbEMsWUFBUSxFQUFFLElBQUU7Z0JBRVgsS0FBSyxZQUFZLEtBQU0sR0FBRyxJQUFJOztJQUVuQyw0QkFBbUIsTUFBSzs7OztRQUVwQixRQUFTLEtBQUMsRUFBRTtRQUNaLFVBQVMsSUFBSSxJQUFJLElBQUUsSUFBSTtZQUNJLFNBQVEsU0FBVSxLQUFLOztZQUFsRCxTQUFTLE1BQU0sU0FBTzs7UUFDdEIsbUJBQWUsRUFBRSxNQUFNLFNBQU8sRUFBRTtRQUVoQyxRQUFRLEtBQUssTUFBTSxNQUFNO1FBRXpCLFVBQVUsS0FBQzs0QkFFRjs7O1lBQUw7WUFDQSxFQUFFLEtBQUs7WUFDUCxFQUFFLGFBQVMsS0FBSyxVQUFVLE1BQU0saUJBQWEsRUFBRSxRQUFNOztlQUV6RCxLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUMsRUFBRTs7SUFFaEM7Ozs7UUFFSSxVQUFVLEtBQUM7UUFDWCxVQUFVOzRCQUVEOzs7WUFBTDtZQUVBLFFBQVEsS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLEVBQUU7WUFDOUIsY0FBYyxFQUFFLE1BQU0sRUFBRTtnQkFFckIsTUFBSyxFQUFFOztnQkFDTixFQUFFLEtBQVE7Z0JBQ1YsVUFBVTs7O1lBRWY7O21CQUNDLEtBQUMsV0FBVyxTQUFRLEtBQUssS0FBQyxFQUFFOzs7SUFFcEMsc0JBQWE7Ozs7UUFFVCxZQUFRLElBQUcsZ0JBQUEsUUFBUTt3QkFFZixJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxLQUFDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
