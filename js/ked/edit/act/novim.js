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
    startNovimReplace:function (count)
    {
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.novimInsert = {kind:'replace',text:'',count:n,undo:[]}
        for (var _26_ = i = 0, _27_ = this.s.cursors.length; (_26_ <= _27_ ? i < this.s.cursors.length : i > this.s.cursors.length); (_26_ <= _27_ ? ++i : --i))
        {
            this.novimInsert.undo.push([])
        }
        return this.novimInsert
    },
    replaceNovimChar:function (text)
    {
        var c, changed, cursors, i, line, lines, newLine, ni, old, si, width, x
    
        ni = this.novimInsert
        if (!ni || ni.kind !== 'replace')
        {
            return false
        }
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            c = list[i]
            if (!ni.undo[i])
            {
                ni.undo[i] = []
            }
            line = lines[c[1]]
            width = kseg.width(line)
            x = _k_.min(c[0],width)
            si = kseg.indexAtWidth(line,x)
            old = null
            if (si < line.length)
            {
                old = line[si]
            }
            if ((old != null))
            {
                newLine = line.slice(0, typeof si === 'number' ? si : -1).concat([text]).concat(line.slice(si + 1))
            }
            else
            {
                newLine = line.slice(0, typeof si === 'number' ? si : -1).concat([text])
            }
            lines[c[1]] = newLine
            ni.undo[i].push({x:x,y:c[1],old:old})
            c[0] = kseg.width(newLine.slice(0, si + 1))
            changed = true
        }
        if (!changed)
        {
            return false
        }
        this.setLines(lines)
        this.setCursors(cursors,{main:this.s.main})
        this.recordNovimInsert(text)
        return true
    },
    replaceNovimBackspace:function ()
    {
        var c, changed, cursors, hist, i, line, lines, newLine, ni, rec, si, _750_22_
    
        ni = this.novimInsert
        if (!ni || ni.kind !== 'replace')
        {
            return false
        }
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            c = list[i]
            hist = ni.undo[i]
            if (_k_.empty(hist))
            {
                continue
            }
            rec = hist.pop()
            if (!rec)
            {
                continue
            }
            if (rec.y < 0 || rec.y >= lines.length)
            {
                continue
            }
            line = lines[rec.y]
            si = kseg.indexAtWidth(line,rec.x)
            if (si >= line.length)
            {
                continue
            }
            if ((rec.old != null))
            {
                newLine = line.slice(0, typeof si === 'number' ? si : -1).concat([rec.old]).concat(line.slice(si + 1))
            }
            else
            {
                newLine = line.slice(0, typeof si === 'number' ? si : -1).concat(line.slice(si + 1))
            }
            lines[rec.y] = newLine
            c[0] = rec.x
            c[1] = rec.y
            changed = true
        }
        if (!changed)
        {
            return false
        }
        this.setLines(lines)
        this.setCursors(cursors,{main:this.s.main})
        this.recordNovimBackspace()
        return true
    },
    recordNovimInsert:function (text)
    {
        if (!this.novimInsert || this.novimReplaying)
        {
            return
        }
        if (this.novimInsert.kind === 'replace' && _k_.in('\n',text))
        {
            this.novimInsert.undo = this.novimInsert.undo.map(function (h)
            {
                return []
            })
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
        var i, insert, n, text, _795_36_
    
        if (!this.novimInsert)
        {
            return
        }
        insert = this.novimInsert
        this.novimInsert = null
        if (insert.kind === 'replace')
        {
            n = _k_.max(1,(((_795_36_=insert.count) != null ? _795_36_ : 1)))
            if (n > 1 && !_k_.empty(insert.text) && !(_k_.in('\n',insert.text)))
            {
                this.replaceTextAtCursors(insert.text,(n - 1))
            }
            text = ''
            for (var _2a_ = i = 0, _2b_ = n; (_2a_ <= _2b_ ? i < n : i > n); (_2a_ <= _2b_ ? ++i : --i))
            {
                text += insert.text
            }
            return this.lastChange = {operator:'replaceMode',text:text}
        }
        else
        {
            return this.lastChange = {operator:'insert',insert:insert}
        }
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
    
            case 'replaceMode':
                return this.repeatReplaceMode(count)
    
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
        var spec, _829_40_
    
        spec = _k_.copy((((_829_40_=this.lastChange.motion) != null ? _829_40_ : {kind:'line',count:1})))
        if (count > 1)
        {
            spec.count = count
        }
        return this.indentByMotion(spec,deindent)
    },
    repeatReplaceMode:function (count)
    {
        var n, text
    
        text = this.lastChange.text
        if (_k_.empty(text))
        {
            return
        }
        if (_k_.in('\n',text))
        {
            return
        }
        n = _k_.max(1,((count != null ? count : 1)))
        return this.replaceTextAtCursors(text,n)
    },
    replaceTextAtCursors:function (text, times)
    {
        var c, changed, cursors, gone, graphemes, k, line, lines, n, newLine, si, width, x
    
        graphemes = kseg(text)
        if (_k_.empty(graphemes))
        {
            return
        }
        n = _k_.max(1,((times != null ? times : 1)))
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        changed = false
        var list = _k_.list(cursors)
        for (var _2c_ = 0; _2c_ < list.length; _2c_++)
        {
            c = list[_2c_]
            for (var _2d_ = k = 0, _2e_ = n; (_2d_ <= _2e_ ? k < n : k > n); (_2d_ <= _2e_ ? ++k : --k))
            {
                line = lines[c[1]]
                width = kseg.width(line)
                x = _k_.min(c[0],width)
                si = kseg.indexAtWidth(line,x)
                gone = _k_.min(graphemes.length,line.length - si)
                newLine = line.slice(0, typeof si === 'number' ? si : -1).concat(graphemes).concat(line.slice(si + gone))
                lines[c[1]] = newLine
                c[0] = kseg.width(newLine.slice(0, si + graphemes.length))
                changed = true
            }
        }
        if (!changed)
        {
            return
        }
        this.setLines(lines)
        this.setCursors(cursors,{main:this.s.main})
        return true
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
        for (var _2f_ = i = 0, _30_ = n; (_2f_ <= _30_ ? i < n : i > n); (_2f_ <= _30_ ? ++i : --i))
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
        var i, n, _924_32_
    
        n = _k_.max(1,(((_924_32_=insert.count) != null ? _924_32_ : 1)))
        this.begin()
        for (var _31_ = i = 0, _32_ = n; (_31_ <= _32_ ? i < n : i > n); (_31_ <= _32_ ? ++i : --i))
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
        for (var _33_ = i = 0, _34_ = n; (_33_ <= _34_ ? i < n : i > n); (_33_ <= _34_ ? ++i : --i))
        {
            this.replayVisual(this.lastChange,action)
        }
    },
    replayVisual:function (change, action)
    {
        var changed, cursor, cursors, i, lines, rng, rngs, shape, starts, x, y, _974_66_
    
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
            shape = ((_974_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _974_66_ : change.shapes[0])
            if (!shape)
            {
                continue
            }
            if (shape.block)
            {
                var list1 = _k_.list(this.blockRangesForShape(shape,cursor))
                for (var _36_ = 0; _36_ < list1.length; _36_++)
                {
                    rng = list1[_36_]
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
                for (var _37_ = 0; _37_ < list2.length; _37_++)
                {
                    rng = list2[_37_]
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
        for (var _38_ = 0; _38_ < list.length; _38_++)
        {
            cursor = list[_38_]
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
        for (var _39_ = 0; _39_ < list.length; _39_++)
        {
            rng = list[_39_]
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
        var flashMs, _1173_29_, _1173_36_, _1173_50_
    
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.yankFlashTimer)
        {
            clearTimeout(this.yankFlashTimer)
        }
        flashMs = ((_1173_50_=((_1173_29_=config.data) != null ? (_1173_36_=_1173_29_.novim) != null ? _1173_36_.yankFlashMs : undefined : undefined)) != null ? _1173_50_ : 500)
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
        for (var _3b_ = i = 0, _3c_ = count; (_3b_ <= _3c_ ? i < count : i > count); (_3b_ <= _3c_ ? ++i : --i))
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
        for (var _3e_ = 0; _3e_ < list1.length; _3e_++)
        {
            idx = list1[_3e_]
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
        for (var _3f_ = 0; _3f_ < list.length; _3f_++)
        {
            c = list[_3f_]
            width = kseg.width(lines[c[1]])
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
            posl.push([x,c[1]])
        }
        var _40_ = belt.insertTextAtPositions(lines,text,posl); newLines = _40_[0]; newPosl = _40_[1]
    
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
        for (var _41_ = 0; _41_ < list.length; _41_++)
        {
            rng = list[_41_]
            var _42_ = rng; x1 = _42_[0]; y1 = _42_[1]; x2 = _42_[2]; y2 = _42_[3]
    
            for (var _43_ = y = y1, _44_ = y2; (_43_ <= _44_ ? y <= y2 : y >= y2); (_43_ <= _44_ ? ++y : --y))
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
                for (var _45_ = i = 0, _46_ = ei - si; (_45_ <= _46_ ? i < ei - si : i > ei - si); (_45_ <= _46_ ? ++i : --i))
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
        for (var _47_ = 0; _47_ < list.length; _47_++)
        {
            c = list[_47_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _48_ = i = 0, _49_ = n; (_48_ <= _49_ ? i < n : i > n); (_48_ <= _49_ ? ++i : --i))
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
        for (var _4a_ = 0; _4a_ < list.length; _4a_++)
        {
            c = list[_4a_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _4b_ = i = segi, _4c_ = lasti; (_4b_ <= _4c_ ? i <= lasti : i >= lasti); (_4b_ <= _4c_ ? ++i : --i))
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
        for (var _4d_ = 0; _4d_ < list.length; _4d_++)
        {
            c = list[_4d_]
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
        for (var _4e_ = 0; _4e_ < list1.length; _4e_++)
        {
            y = list1[_4e_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _4f_ = 0; _4f_ < list2.length; _4f_++)
        {
            block = list2[_4f_]
            var _50_ = block; y = _50_[0]; take = _50_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _51_ = j = 1, _52_ = take; (_51_ <= _52_ ? j < take : j > take); (_51_ <= _52_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _53_ = 0; _53_ < list3.length; _53_++)
            {
                part = list3[_53_]
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
        for (var _54_ = 0; _54_ < list4.length; _54_++)
        {
            c = list4[_54_]
            var _55_ = c; x = _55_[0]; y = _55_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _56_ = 0; _56_ < list5.length; _56_++)
            {
                block = list5[_56_]
                var _57_ = block; by = _57_[0]; take = _57_[1]; seam = _57_[2]
    
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
        var i, n, _1463_23_
    
        n = ((_1463_23_=spec.count) != null ? _1463_23_ : count)
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
            for (var _58_ = i = 1, _59_ = n; (_58_ <= _59_ ? i <= n : i >= n); (_58_ <= _59_ ? ++i : --i))
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
        for (var _5b_ = 0; _5b_ < list.length; _5b_++)
        {
            p = list[_5b_]
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
        for (var _5c_ = 0; _5c_ < list.length; _5c_++)
        {
            c = list[_5c_]
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
        for (var _5d_ = i = 0, _5e_ = n; (_5d_ <= _5e_ ? i < n : i > n); (_5d_ <= _5e_ ? ++i : --i))
        {
            this.undo()
        }
    },
    collectSubstitutions:function (y1, y2, spec)
    {
        var entries, line, res, y
    
        entries = []
        for (var _5f_ = y = y1, _60_ = y2; (_5f_ <= _60_ ? y <= y2 : y >= y2); (_5f_ <= _60_ ? ++y : --y))
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
        for (var _61_ = 0; _61_ < list.length; _61_++)
        {
            entry = list[_61_]
            var list1 = _k_.list(entry.matches)
            for (var _62_ = 0; _62_ < list1.length; _62_++)
            {
                m = list1[_62_]
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
        for (var _63_ = 0; _63_ < list.length; _63_++)
        {
            entry = list[_63_]
            lines[entry.y] = belt.joinSubstitution(entry.line,entry.matches,spec.tokens)
            var list1 = _k_.list(entry.matches)
            for (var _64_ = 0; _64_ < list1.length; _64_++)
            {
                m = list1[_64_]
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
