var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let clip = kxk.clip
let post = kxk.post

import novim from "../mode/novim.js"

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

import config from "../../util/config.js"

export default {
    executeNovim:function (cmd)
    {
        var _14_29_
    
        if (cmd.motion)
        {
            cmd.motion.count = ((_14_29_=cmd.motion.count) != null ? _14_29_ : cmd.count)
        }
        if (this.visual && !(_k_.in(cmd.operator,['move','matchBracket','visualDelete','visualYank','visualChange','visualSwap','visualTextObject','visualIndent','visualDeindent','visualReplace','visualBlockPrepend','visualBlockAppend'])))
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
    
            case 'visualReplace':
                return this.visualReplace(cmd.char)
    
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
    stopVisual:function (keepSelections = false, remember = true)
    {
        if (remember)
        {
            this.rememberVisual()
        }
        this.visual = null
        this.visualAnchors = []
        if (!keepSelections)
        {
            return this.setSelections([])
        }
    },
    rememberVisual:function ()
    {
        var main, pairs
    
        if (!this.visual)
        {
            return false
        }
        pairs = this.visualPairs()
        if (_k_.empty(pairs))
        {
            return false
        }
        main = this.mainCursor()
        this.lastVisual = {kind:this.visual,pairs:pairs,main:[main[0],main[1]],lines:this.s.lines}
        return true
    },
    startLastVisual:function ()
    {
        var lineMap, lines, lv, main, mapped, pairs, starts
    
        lv = this.lastVisual
        if (!lv || _k_.empty(lv.pairs))
        {
            return false
        }
        lines = this.s.lines
        lineMap = belt.lineIndexMap(lv.lines,lines)
        mapped = function (pos)
        {
            var x, y, _248_56_
    
            y = _k_.clamp(0,lines.length - 1,(((_248_56_=lineMap[pos[1]]) != null ? _248_56_ : pos[1])))
            x = _k_.clamp(0,kseg.width(lines[y]),pos[0])
            return [x,y]
        }
        pairs = lv.pairs.map(function (p)
        {
            return [mapped(p[0]),mapped(p[1])]
        })
        main = mapped(lv.main)
        starts = pairs.map(function (p)
        {
            return [p[1][0],p[1][1]]
        })
        this.visual = lv.kind
        this.visualAnchors = pairs.map(function (p)
        {
            return [p[0][0],p[0][1]]
        })
        this.setCursors(starts,{main:main})
        this.updateVisual()
        return true
    },
    visualPairs:function ()
    {
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _272_32_
    
        cursors = this.allCursors()
        anchors = this.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_272_32_=anchors[i]) != null ? _272_32_ : [cursor[0],cursor[1]])
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
        var rngs, width, xe, y
    
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
            xe = _k_.min(x2,width)
            if (xe <= x1)
            {
                continue
            }
            rngs.push([x1,y,xe,y])
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
        this.rememberVisual()
        this.lastChange = {operator:'visualDelete',linewise:linewise,register:register,shapes:this.visualRepeatShapes()}
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        this.end()
        if (blockStarts)
        {
            this.setCursors(blockStarts,{main:this.s.main})
        }
        return this.stopVisual(false,false)
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
        this.rememberVisual()
        this.setCursors(starts,{main:this.mainCursor()})
        return this.stopVisual(false,false)
    },
    visualChange:function ()
    {
        var rngs
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        this.rememberVisual()
        this.startNovimInsert({kind:'visual',linewise:this.visual === 'line',shapes:this.visualRepeatShapes()})
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.mainCursor()})
        this.visual = null
        return this.visualAnchors = []
    },
    visualReplace:function (text)
    {
        var changed, lines, pairs, rngs, shapes, starts
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
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
        shapes = this.visualRepeatShapes()
        this.rememberVisual()
        this.begin()
        changed = this.replaceRanges(rngs,text)
        this.end()
        if (!changed)
        {
            return
        }
        lines = this.s.lines
        starts = starts.map(function (p)
        {
            return [_k_.min(p[0],kseg.width(lines[p[1]])),p[1]]
        })
        this.setCursors(starts,{main:this.s.main})
        this.stopVisual(false,false)
        return this.lastChange = {operator:'visualReplace',char:text,shapes:shapes}
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
        this.rememberVisual()
        this.startNovimInsert({kind:(after ? 'blockAppend' : 'blockPrepend'),shapes:this.visualRepeatShapes()})
        this.stopVisual(false,false)
        return this.setCursors(cursors,{main:this.s.main})
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
        var _660_26_
    
        this.novimInsert = _k_.copy(spec)
        this.novimInsert.text = ((_660_26_=this.novimInsert.text) != null ? _660_26_ : '')
        switch (spec.kind)
        {
            case 'append':
                this.moveCursors('right')
                break
            case 'appendEol':
                this.moveCursors('eol')
                break
            case 'insertAtIndent':
                this.moveCursors('ind')
                break
        }
    
        this.stopMode('novim')
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
    
            case 'visualReplace':
                return this.repeatVisual(count,'replace')
    
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
        var spec, _717_40_
    
        spec = _k_.copy((((_717_40_=this.lastChange.motion) != null ? _717_40_ : {kind:'line',count:1})))
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
        var i, n, _767_32_
    
        n = _k_.max(1,(((_767_32_=insert.count) != null ? _767_32_ : 1)))
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
        var changed, cursor, cursors, i, lines, rng, rngs, shape, starts, x, y, _817_66_
    
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
            shape = ((_817_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _817_66_ : change.shapes[0])
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
        else if (action === 'replace')
        {
            this.begin()
            changed = this.replaceRanges(rngs,change.char)
            this.end()
            if (!changed)
            {
                return
            }
            if (change.shapes.length && change.shapes[0].block)
            {
                x = Infinity
                y = Infinity
                var list2 = _k_.list(rngs)
                for (var _2e_ = 0; _2e_ < list2.length; _2e_++)
                {
                    rng = list2[_2e_]
                    x = _k_.min(x,rng[0])
                    y = _k_.min(y,rng[1])
                }
                starts = [[x,y]]
            }
            else
            {
                starts = rngs.map(function (r)
                {
                    return [r[0],r[1]]
                })
            }
            lines = this.s.lines
            starts = starts.map(function (p)
            {
                return [_k_.min(p[0],kseg.width(lines[p[1]])),p[1]]
            })
            return this.setCursors(starts,{main:this.s.main})
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
        for (var _2f_ = 0; _2f_ < list.length; _2f_++)
        {
            cursor = list[_2f_]
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
        for (var _30_ = 0; _30_ < list.length; _30_++)
        {
            rng = list[_30_]
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
        return this.startNovimInsert({kind:'change',motion:_k_.copy((spec))})
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
        var flashMs, _1016_29_, _1016_36_, _1016_50_
    
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        flashMs = ((_1016_50_=((_1016_29_=config.data) != null ? (_1016_36_=_1016_29_.novim) != null ? _1016_36_.yankFlashMs : undefined : undefined)) != null ? _1016_50_ : 500)
        this.yankFlash = rngs
        return this.yankFlashTimer = setTimeout(((function ()
        {
            return this.clearYankFlash()
        }).bind(this)),flashMs)
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
        for (var _32_ = i = 0, _33_ = count; (_32_ <= _33_ ? i < count : i > count); (_32_ <= _33_ ? ++i : --i))
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
        for (var _35_ = 0; _35_ < list1.length; _35_++)
        {
            idx = list1[_35_]
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
        for (var _36_ = 0; _36_ < list.length; _36_++)
        {
            c = list[_36_]
            width = kseg.width(lines[c[1]])
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
            posl.push([x,c[1]])
        }
        var _37_ = belt.insertTextAtPositions(lines,text,posl); newLines = _37_[0]; newPosl = _37_[1]
    
        this.setLines(newLines)
        return this.setCursors(newPosl)
    },
    openLine:function (count, after)
    {
        this.putOpenLines({count:count},after)
        return this.startNovimInsert({kind:(after ? 'openLineAfter' : 'openLineBefore'),count:count})
    },
    insertAtIndent:function ()
    {
        return this.startNovimInsert({kind:'insertAtIndent'})
    },
    replaceRanges:function (rngs, text)
    {
        var changed, ei, from, i, line, lines, repl, rng, si, to, width, x1, x2, y, y1, y2
    
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        changed = false
        var list = _k_.list(rngs)
        for (var _38_ = 0; _38_ < list.length; _38_++)
        {
            rng = list[_38_]
            var _39_ = rng; x1 = _39_[0]; y1 = _39_[1]; x2 = _39_[2]; y2 = _39_[3]
    
            for (var _3a_ = y = y1, _3b_ = y2; (_3a_ <= _3b_ ? y <= y2 : y >= y2); (_3a_ <= _3b_ ? ++y : --y))
            {
                if (y < 0 || y >= lines.length)
                {
                    continue
                }
                line = lines[y]
                width = kseg.width(line)
                from = (y === y1 ? x1 : 0)
                to = (y === y2 ? x2 : width)
                from = _k_.clamp(0,width,from)
                to = _k_.clamp(0,width,to)
                if (to <= from)
                {
                    continue
                }
                si = kseg.indexAtWidth(line,from)
                ei = kseg.indexAtWidth(line,to)
                if (ei <= si)
                {
                    continue
                }
                repl = []
                for (var _3c_ = i = 0, _3d_ = ei - si; (_3c_ <= _3d_ ? i < ei - si : i > ei - si); (_3c_ <= _3d_ ? ++i : --i))
                {
                    repl.push(text)
                }
                lines[y] = line.slice(0, typeof si === 'number' ? si : -1).concat(repl).concat(line.slice(ei))
                changed = true
            }
        }
        if (!changed)
        {
            return false
        }
        this.setLines(lines)
        return true
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
        for (var _3e_ = 0; _3e_ < list.length; _3e_++)
        {
            c = list[_3e_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _3f_ = i = 0, _40_ = n; (_3f_ <= _40_ ? i < n : i > n); (_3f_ <= _40_ ? ++i : --i))
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
        for (var _41_ = 0; _41_ < list.length; _41_++)
        {
            c = list[_41_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _42_ = i = segi, _43_ = lasti; (_42_ <= _43_ ? i <= lasti : i >= lasti); (_42_ <= _43_ ? ++i : --i))
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
        for (var _44_ = 0; _44_ < list.length; _44_++)
        {
            c = list[_44_]
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
        for (var _45_ = 0; _45_ < list1.length; _45_++)
        {
            y = list1[_45_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _46_ = 0; _46_ < list2.length; _46_++)
        {
            block = list2[_46_]
            var _47_ = block; y = _47_[0]; take = _47_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _48_ = j = 1, _49_ = take; (_48_ <= _49_ ? j < take : j > take); (_48_ <= _49_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _4a_ = 0; _4a_ < list3.length; _4a_++)
            {
                part = list3[_4a_]
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
        for (var _4b_ = 0; _4b_ < list4.length; _4b_++)
        {
            c = list4[_4b_]
            var _4c_ = c; x = _4c_[0]; y = _4c_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _4d_ = 0; _4d_ < list5.length; _4d_++)
            {
                block = list5[_4d_]
                var _4e_ = block; by = _4e_[0]; take = _4e_[1]; seam = _4e_[2]
    
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
        var i, n, _1306_23_
    
        n = ((_1306_23_=spec.count) != null ? _1306_23_ : count)
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
            for (var _4f_ = i = 1, _50_ = n; (_4f_ <= _50_ ? i <= n : i >= n); (_4f_ <= _50_ ? ++i : --i))
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
        for (var _52_ = 0; _52_ < list.length; _52_++)
        {
            p = list[_52_]
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
        for (var _53_ = 0; _53_ < list.length; _53_++)
        {
            c = list[_53_]
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
        for (var _54_ = i = 0, _55_ = n; (_54_ <= _55_ ? i < n : i > n); (_54_ <= _55_ ? ++i : --i))
        {
            this.undo()
        }
    },
    collectSubstitutions:function (y1, y2, spec)
    {
        var entries, line, res, y
    
        entries = []
        for (var _56_ = y = y1, _57_ = y2; (_56_ <= _57_ ? y <= y2 : y >= y2); (_56_ <= _57_ ? ++y : --y))
        {
            if (y < 0 || y >= this.s.lines.length)
            {
                continue
            }
            line = kseg.str(this.s.lines[y])
            res = belt.substituteLine(line,spec)
            if (_k_.empty(res.matches))
            {
                continue
            }
            entries.push({y:y,line:line,matches:res.matches})
        }
        return entries
    },
    selectSubstitutions:function (entries)
    {
        var cursors, entry, m, rngs
    
        rngs = []
        cursors = []
        var list = _k_.list(entries)
        for (var _58_ = 0; _58_ < list.length; _58_++)
        {
            entry = list[_58_]
            var list1 = _k_.list(entry.matches)
            for (var _59_ = 0; _59_ < list1.length; _59_++)
            {
                m = list1[_59_]
                rngs.push([m.x1,entry.y,m.x2,entry.y])
                cursors.push([m.x2,entry.y])
            }
        }
        if (_k_.empty(rngs))
        {
            return false
        }
        this.setSelections(rngs)
        this.setCursors(cursors,{main:0})
        return true
    },
    applySubstitutions:function (entries, spec)
    {
        var entry, last, lines, m, total
    
        lines = this.s.lines.map(function (l)
        {
            return kseg.str(l)
        })
        total = 0
        last = null
        var list = _k_.list(entries)
        for (var _5a_ = 0; _5a_ < list.length; _5a_++)
        {
            entry = list[_5a_]
            lines[entry.y] = belt.joinSubstitution(entry.line,entry.matches,spec.tokens)
            var list1 = _k_.list(entry.matches)
            for (var _5b_ = 0; _5b_ < list1.length; _5b_++)
            {
                m = list1[_5b_]
                total += 1
                last = [m.x1,entry.y]
            }
        }
        if (!total)
        {
            return 0
        }
        this.begin()
        this.setLines(lines)
        this.setCursors([last])
        this.end()
        return total
    },
    applySubstitutionAt:function (y, match, spec)
    {
        var lines
    
        if (y < 0 || y >= this.s.lines.length)
        {
            return false
        }
        lines = this.s.lines.map(function (l)
        {
            return kseg.str(l)
        })
        lines[y] = belt.joinSubstitution(lines[y],[match],spec.tokens)
        this.setLines(lines)
        return true
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7SUFBSzs7T0FDVixZQUFaOztPQUNZLFdBQVo7T0FBaUIsYUFBakI7O09BQ1ksYUFBUjs7O0lBSVAsdUJBQWM7Ozs7WUFJUCxJQUFJOztZQUNILElBQUksT0FBTyxrQkFBWCxJQUFJLE9BQU8sMkJBQVMsSUFBSTs7WUFFekIsS0FBQyxtQkFBVyxJQUFJLFVBQWlCLE9BQU8sZUFBZSxlQUFlLGFBQWEsZUFBZSxhQUFhLG1CQUFtQixlQUFlLGlCQUFpQixnQkFBZ0IscUJBQXFCOztZQUN0TSxLQUFDOztnQkFFRSxJQUFJOztpQkFDUDt1QkFBMEIsS0FBQyxlQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLFlBQXFCOztpQkFDaEQ7dUJBQTBCLEtBQUMsYUFBcUIsSUFBSSxPQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQyxZQUFxQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUMxRTt1QkFBMEIsS0FBQyxhQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLGdCQUFxQixJQUFJLE1BQVEsSUFBSSxLQUFLOztpQkFDckU7dUJBQTBCLEtBQUMsZ0JBQXFCLElBQUksTUFBUSxJQUFJLEtBQUs7O2lCQUNyRTt1QkFBMEIsS0FBQyxXQUFxQixJQUFJLE1BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDOztpQkFDM0I7dUJBQTBCLEtBQUMsU0FBcUIsSUFBSSxNQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQzs7aUJBQzNCO3VCQUEwQixLQUFDLGFBQXFCLElBQUksS0FBUSxJQUFJOztpQkFDaEU7dUJBQTBCLEtBQUMsY0FBcUIsSUFBSTs7aUJBQ3BEO3VCQUEwQixLQUFDLFdBQXFCLElBQUk7O2lCQUNwRDt1QkFBMEIsS0FBQyxhQUFxQixJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
