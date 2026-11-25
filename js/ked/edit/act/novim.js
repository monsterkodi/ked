var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import novim from "../mode/novim.js"

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"
import register from "../tool/register.js"
import jumplist from "../tool/jumplist.js"
import changelist from "../tool/changelist.js"

import config from "../../util/config.js"

export default {
    novimState:function ()
    {
        return {register:new register,jumps:new jumplist,changes:new changelist,macroReplaying:0,macroLastRegister:null}
    },
    executeNovim:function (cmd)
    {
        var _21_21_, _24_29_
    
        if ((this.rectree != null) && this.sheetNovim(cmd))
        {
            return
        }
        if (cmd.motion)
        {
            cmd.motion.count = ((_24_29_=cmd.motion.count) != null ? _24_29_ : cmd.count)
        }
        if (this.novim.visual && !(_k_.in(cmd.operator,['move','matchBracket','visualDelete','visualYank','visualChange','visualSwap','visualTextObject','visualIndent','visualDeindent','visualReplace','visualCase','visualBlockPrepend','visualBlockAppend'])))
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
                return this.jumpByHighlight(cmd.count,cmd.text,((!_k_.empty(cmd.forward) ? cmd.forward : novim.lastVindForward)))
    
            case 'searchPrev':
                return this.jumpByHighlight(cmd.count,cmd.text,((!_k_.empty(cmd.forward) ? cmd.forward : !novim.lastVindForward)))
    
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
    
            case 'lowercase':
                return this.caseByMotion(cmd.motion,'lower')
    
            case 'uppercase':
                return this.caseByMotion(cmd.motion,'upper')
    
            case 'toggleCaseMotion':
                return this.caseByMotion(cmd.motion,'toggle')
    
            case 'visualCase':
                return this.visualCase(cmd.kind)
    
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
    searchPosition:function ()
    {
        var index, pos, span, spans
    
        spans = this.s.highlights
        if (_k_.empty(spans))
        {
            return
        }
        pos = this.mainCursor()
        var list = _k_.list(spans)
        for (index = 0; index < list.length; index++)
        {
            span = list[index]
            if (span[0] === pos[0] && span[1] === pos[1])
            {
                return [index + 1,spans.length]
            }
        }
        return [0,spans.length]
    },
    jumpByHighlight:function (count, text, forward)
    {
        var after, before, i, origin, pos, sameStart, span, target
    
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
        origin = this.mainCursor()
        for (i = 0; i < count; i++)
        {
            target = null
            var list = _k_.list(this.s.highlights)
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                span = list[_b_]
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
        if (!(_k_.eql(origin, pos)))
        {
            this.pushJump(origin)
        }
        return this.setMainCursor(pos)
    },
    wordSpansForText:function (text)
    {
        var after, before, line, span, spans, x1, x2, y
    
        spans = []
        var list = _k_.list(belt.lineSpansForText(this.s.lines,text))
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            span = list[_c_]
            ;[x1,y,x2] = span
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
        var after, before, end, i, moved, origin, pos, rng, span, spans, start, target, text
    
        text = this.wordAtCursor()
        if (_k_.empty(text))
        {
            return
        }
        novim.lastVind = text
        novim.lastVindForward = forward
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
        origin = pos
        moved = false
        for (i = 0; i < _k_.max(1,(count != null ? count : 1)); i++)
        {
            target = null
            var list = _k_.list(spans)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                span = list[_d_]
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
            this.pushJump(origin)
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
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            c = list[_e_]
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
            this.pushJump()
            this.setCursors(newCursors,{main:this.s.main})
        }
        if (this.novim.visual)
        {
            return this.updateVisual()
        }
    },
    startVisual:function (kind)
    {
        if (this.novim.visual === kind)
        {
            return this.stopVisual()
        }
        if (!this.novim.visual)
        {
            this.novim.visualAnchors = this.allCursors().map(function (c)
            {
                return [c[0],c[1]]
            })
        }
        this.novim.visual = kind
        return this.updateVisual()
    },
    stopVisual:function (keepSelections = false, remember = true)
    {
        if (remember)
        {
            this.rememberVisual()
        }
        this.novim.visual = null
        this.novim.visualAnchors = []
        if (!keepSelections)
        {
            return this.setSelections([])
        }
    },
    rememberVisual:function ()
    {
        var main, pairs
    
        if (!this.novim.visual)
        {
            return false
        }
        pairs = this.visualPairs()
        if (_k_.empty(pairs))
        {
            return false
        }
        main = this.mainCursor()
        this.novim.lastVisual = {kind:this.novim.visual,pairs:pairs,main:[main[0],main[1]],lines:this.s.lines}
        return true
    },
    startLastVisual:function ()
    {
        var lineMap, lines, lv, main, mapped, pairs, starts
    
        lv = this.novim.lastVisual
        if (!lv || _k_.empty(lv.pairs))
        {
            return false
        }
        lines = this.s.lines
        lineMap = belt.lineIndexMap(lv.lines,lines)
        mapped = function (pos)
        {
            var x, y, _283_56_
    
            y = _k_.clamp(0,lines.length - 1,(((_283_56_=lineMap[pos[1]]) != null ? _283_56_ : pos[1])))
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
        this.novim.visual = lv.kind
        this.novim.visualAnchors = pairs.map(function (p)
        {
            return [p[0][0],p[0][1]]
        })
        this.setCursors(starts,{main:main})
        this.updateVisual()
        return true
    },
    visualPairs:function ()
    {
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _307_32_
    
        cursors = this.allCursors()
        anchors = this.novim.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_307_32_=anchors[i]) != null ? _307_32_ : [cursor[0],cursor[1]])
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
        for (var _10_ = 0; _10_ < list1.length; _10_++)
        {
            pair = list1[_10_]
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
    
        if (this.novim.visual === 'line')
        {
            y1 = _k_.min(anchor[1],cursor[1])
            y2 = _k_.max(anchor[1],cursor[1])
            return [0,y1,kseg.width(this.s.lines[y2]),y2]
        }
        a = [anchor[0],anchor[1]]
        b = [cursor[0],cursor[1]]
        if (b[1] < a[1] || b[1] === a[1] && b[0] < a[0])
        {
            ;[a,b] = [b,a]
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
        for (y = y1; y <= y2; y++)
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
    
        if (!this.novim.visual)
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
        this.novim.visualAnchors = anchors
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
        for (var _12_ = 0; _12_ < list1.length; _12_++)
        {
            pair = list1[_12_]
            if (this.novim.visual === 'block')
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
        linewise = this.novim.visual === 'line'
        blockStarts = null
        if (this.novim.visual === 'block')
        {
            blockStarts = this.visualPairs().map(function (p)
            {
                return [_k_.min(p[0][0],p[1][0]),_k_.min(p[0][1],p[1][1])]
            })
        }
        this.setNovimRegister(rngs,linewise,register,'delete')
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
        linewise = this.novim.visual === 'line'
        this.setNovimRegister(rngs,linewise,register,'yank')
        this.flashYank(rngs)
        if (this.novim.visual === 'block')
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
        this.startNovimInsert({kind:'visual',linewise:this.novim.visual === 'line',shapes:this.visualRepeatShapes()})
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.mainCursor()})
        this.novim.visual = null
        return this.novim.visualAnchors = []
    },
    visualReplace:function (text)
    {
        var changed, pairs, rngs, shapes, starts
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.novim.visual === 'block')
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
        starts = starts.map((function (p)
        {
            return [_k_.min(p[0],kseg.width(this.s.lines[p[1]])),p[1]]
        }).bind(this))
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
        if (this.novim.visual === 'line')
        {
            y1 = Infinity
            y2 = -1
            var list = _k_.list(this.s.selections)
            for (var _13_ = 0; _13_ < list.length; _13_++)
            {
                rng = list[_13_]
                y1 = _k_.min(y1,rng[1])
                y2 = _k_.max(y2,rng[3])
            }
            shapes.push({linewise:true,count:y2 - y1 + 1})
        }
        else if (this.novim.visual === 'block')
        {
            if (!_k_.empty(this.s.selections))
            {
                x1 = Infinity
                x2 = -1
                y1 = Infinity
                y2 = -1
                var list1 = _k_.list(this.s.selections)
                for (var _14_ = 0; _14_ < list1.length; _14_++)
                {
                    rng = list1[_14_]
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
            for (var _15_ = 0; _15_ < list2.length; _15_++)
            {
                rng = list2[_15_]
                shapes.push({linewise:false,x1:0,y1:0,x2:rng[2] - rng[0],y2:rng[3] - rng[1]})
            }
        }
        return shapes
    },
    visualSwap:function ()
    {
        var anchor, anchors, cursor, cursors, i
    
        if (!this.novim.visual)
        {
            return
        }
        cursors = this.allCursors()
        anchors = this.novim.visualAnchors
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
        this.novim.visualAnchors = anchors
        this.setCursors(cursors,{main:this.mainCursor()})
        return this.updateVisual()
    },
    visualTextObject:function (spec)
    {
        var cursor, cursors, rng, rngs
    
        if (!this.novim.visual)
        {
            return
        }
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _17_ = 0; _17_ < list.length; _17_++)
        {
            cursor = list[_17_]
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
        this.novim.visualAnchors = rngs.map(function (r)
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
        for (var _18_ = 0; _18_ < list.length; _18_++)
        {
            cursor = list[_18_]
            rng = this.rangeForMotion(cursor,spec)
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
        for (var _19_ = 0; _19_ < list.length; _19_++)
        {
            index = list[_19_]
            indents[index] = belt.numIndent(this.s.lines[index])
        }
        this.indentAtIndices(indices,deindent,((count != null ? count : 1)))
        anchors = []
        var list1 = _k_.list(this.novim.visualAnchors)
        for (var _1a_ = 0; _1a_ < list1.length; _1a_++)
        {
            anchor = list1[_1a_]
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
        this.novim.visualAnchors = anchors
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
        for (i = 0; i < n; i++)
        {
            if (deindent)
            {
                ;[lines,selections,cursors] = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
            }
            else
            {
                ;[lines,selections,cursors] = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices)
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
        var _694_27_
    
        this.novim.insert = _k_.copy(spec)
        this.novim.insert.text = ((_694_27_=this.novim.insert.text) != null ? _694_27_ : '')
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
        return this.novim.insert
    },
    startNovimReplace:function (count)
    {
        var i, n, _706_21_
    
        if ((this.rectree != null))
        {
            return
        }
        n = _k_.max(1,((count != null ? count : 1)))
        this.novim.insert = {kind:'replace',text:'',count:n,undo:[]}
        for (i = 0; i < this.s.cursors.length; i++)
        {
            this.novim.insert.undo.push([])
        }
        return this.novim.insert
    },
    replaceNovimChar:function (text)
    {
        var c, changed, cursors, i, line, lines, newLine, ni, old, si, width, x
    
        ni = this.novim.insert
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
        var c, changed, cursors, hist, i, line, lines, newLine, ni, rec, si, _786_22_
    
        ni = this.novim.insert
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
        if (!this.novim.insert || this.novimReplaying)
        {
            return
        }
        if (this.novim.insert.kind === 'replace' && _k_.in('\n',text))
        {
            this.novim.insert.undo = this.novim.insert.undo.map(function (h)
            {
                return []
            })
        }
        return this.novim.insert.text += text
    },
    recordNovimBackspace:function ()
    {
        var text
    
        if (!this.novim.insert || this.novimReplaying)
        {
            return
        }
        text = this.novim.insert.text
        if (text.length)
        {
            return this.novim.insert.text = text.slice(0, -1)
        }
    },
    finishNovimInsert:function ()
    {
        var i, insert, n, text, _831_36_
    
        if (!this.novim.insert)
        {
            return
        }
        insert = this.novim.insert
        this.novim.insert = null
        if (insert.kind === 'replace')
        {
            n = _k_.max(1,(((_831_36_=insert.count) != null ? _831_36_ : 1)))
            if (n > 1 && !_k_.empty(insert.text) && !(_k_.in('\n',insert.text)))
            {
                this.replaceTextAtCursors(insert.text,(n - 1))
            }
            text = ''
            for (i = 0; i < n; i++)
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
    
            case 'visualCase':
                return this.repeatVisual(count,'case')
    
            case 'replaceMode':
                return this.repeatReplaceMode(count)
    
            case 'case':
                return this.repeatCase(count)
    
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
        var spec, _867_40_
    
        spec = _k_.copy((((_867_40_=this.lastChange.motion) != null ? _867_40_ : {kind:'line',count:1})))
        if (count > 1)
        {
            spec.count = count
        }
        return this.indentByMotion(spec,deindent)
    },
    repeatCase:function (count)
    {
        var spec
    
        spec = _k_.copy(this.lastChange.motion)
        if (count > 1)
        {
            spec.count = count
        }
        return this.caseByMotion(spec,this.lastChange.kind)
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
        for (var _1d_ = 0; _1d_ < list.length; _1d_++)
        {
            c = list[_1d_]
            for (k = 0; k < n; k++)
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
        for (i = 0; i < n; i++)
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
        var linewise, rngs, spec
    
        spec = _k_.copy(insert.motion)
        rngs = this.selectByMotion(spec)
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = motion.isLinewise(spec)
        this.setNovimRegister(rngs,linewise,insert.register,'change')
        this.setCursors(belt.endPositionsOfRanges(rngs),{main:this.s.main})
        return this.insertForRepeat(insert.text)
    },
    putOpenLines:function (insert, after)
    {
        var i, n, _974_32_
    
        n = _k_.max(1,(((_974_32_=insert.count) != null ? _974_32_ : 1)))
        this.begin()
        for (i = 0; i < n; i++)
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
        for (i = 0; i < n; i++)
        {
            this.replayVisual(this.lastChange,action)
        }
    },
    replayVisual:function (change, action)
    {
        var changed, cursor, cursors, i, lines, rng, rngs, shape, starts, x, y, _1024_66_
    
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
            shape = ((_1024_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _1024_66_ : change.shapes[0])
            if (!shape)
            {
                continue
            }
            if (shape.block)
            {
                var list1 = _k_.list(this.blockRangesForShape(shape,cursor))
                for (var _1f_ = 0; _1f_ < list1.length; _1f_++)
                {
                    rng = list1[_1f_]
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
            this.setNovimRegister(rngs,change.linewise,change.register,'delete')
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
                for (var _20_ = 0; _20_ < list2.length; _20_++)
                {
                    rng = list2[_20_]
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
        else if (action === 'case')
        {
            this.begin()
            this.changeCaseInRanges(rngs,change.kind)
            this.end()
            if (change.shapes.length && change.shapes[0].block)
            {
                x = Infinity
                y = Infinity
                var list3 = _k_.list(rngs)
                for (var _21_ = 0; _21_ < list3.length; _21_++)
                {
                    rng = list3[_21_]
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
            register = '+'
        }
        if (_k_.in(register,['+','*']))
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
        return this.novim.register.writeClipboard(reg)
    },
    registerFromClipboard:function ()
    {
        return this.novim.register.readClipboard()
    },
    selectByMotion:function (spec)
    {
        var cursor, rng, rngs
    
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _22_ = 0; _22_ < list.length; _22_++)
        {
            cursor = list[_22_]
            rng = this.rangeForMotion(cursor,spec)
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
    setNovimRegister:function (rngs, linewise, register, operation = 'yank')
    {
        var rng, texts, value
    
        texts = []
        var list = _k_.list(rngs)
        for (var _23_ = 0; _23_ < list.length; _23_++)
        {
            rng = list[_23_]
            texts.push(belt.textForLineRange(this.s.lines,rng))
        }
        value = {lines:texts.join('\n').split('\n'),linewise:linewise}
        this.novim.register.write(register,value,operation)
        if (this.usesClipboard(register) && !register)
        {
            return this.copyRegisterToClipboard(value)
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
        this.setNovimRegister(rngs,linewise,register,'delete')
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),linewise)
        return this.end()
    },
    changeByMotion:function (spec, register)
    {
        var linewise, rngs
    
        rngs = this.selectByMotion(spec)
        if (_k_.empty(rngs))
        {
            return
        }
        linewise = motion.isLinewise(spec)
        this.setNovimRegister(rngs,linewise,register,'change')
        this.setCursors(belt.endPositionsOfRanges(rngs))
        return this.startNovimInsert({kind:'change',motion:_k_.copy((spec)),register:register})
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
            rng = this.rangeForMotion(cursor,spec)
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
        this.setNovimRegister(rngs,linewise,register,'yank')
        this.flashYank(rngs)
        if (!linewise)
        {
            this.setCursors(cursors,{main:this.s.main})
            return this.clampCursorsToLines()
        }
    },
    flashYank:function (rngs)
    {
        var flashMs, _1238_29_, _1238_36_, _1238_50_
    
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.novim.yankFlashTimer)
        {
            clearTimeout(this.novim.yankFlashTimer)
        }
        flashMs = ((_1238_50_=((_1238_29_=config.data) != null ? (_1238_36_=_1238_29_.novim) != null ? _1238_36_.yankFlashMs : undefined : undefined)) != null ? _1238_50_ : 500)
        this.novim.yankFlash = rngs
        return this.novim.yankFlashTimer = setTimeout(((function ()
        {
            return this.clearYankFlash()
        }).bind(this)),flashMs)
    },
    clearYankFlash:function ()
    {
        if (this.novim.yankFlashTimer)
        {
            clearTimeout(this.novim.yankFlashTimer)
        }
        this.novim.yankFlashTimer = null
        if (!this.novim.yankFlash)
        {
            return
        }
        this.novim.yankFlash = null
        return post.emit('redraw')
    },
    registerForPut:function (register)
    {
        if (this.usesClipboard(register))
        {
            return this.novim.register.read('+')
        }
        if (register)
        {
            return this.novim.register.read(register)
        }
        return this.novim.register.value
    },
    putRegister:function (count, after, register)
    {
        var n, reg
    
        reg = this.registerForPut(register)
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
        for (i = 0; i < count; i++)
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
        var at, c, cursors, head, idx, lines, newCursors, offset, order, segls, x, y
    
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
        for (var _26_ = 0; _26_ < list1.length; _26_++)
        {
            idx = list1[_26_]
            y = cursors[idx][1] + offset
            at = (after ? y + 1 : y)
            lines = lines.slice(0, typeof at === 'number' ? at : -1).concat(segls).concat(lines.slice(at))
            head = segls[0]
            x = _k_.min(belt.numIndent(head),_k_.max(0,kseg.width(head) - 1))
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
        for (var _27_ = 0; _27_ < list.length; _27_++)
        {
            c = list[_27_]
            width = kseg.width(lines[c[1]])
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
            posl.push([x,c[1]])
        }
        ;[newLines,newPosl] = belt.insertTextAtPositions(lines,text,posl)
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
        for (var _28_ = 0; _28_ < list.length; _28_++)
        {
            rng = list[_28_]
            ;[x1,y1,x2,y2] = rng
            for (y = y1; y <= y2; y++)
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
                for (i = 0; i < ei - si; i++)
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
        for (var _29_ = 0; _29_ < list.length; _29_++)
        {
            c = list[_29_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (i = 0; i < n; i++)
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
    changeCaseInRanges:function (rngs, kind)
    {
        var changed, ei, from, i, line, lines, lower, newSeg, rng, seg, si, to, upper, width, x1, x2, y, y1, y2
    
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        changed = false
        var list = _k_.list(rngs)
        for (var _2a_ = 0; _2a_ < list.length; _2a_++)
        {
            rng = list[_2a_]
            ;[x1,y1,x2,y2] = rng
            for (y = y1; y <= y2; y++)
            {
                if (y < 0 || y >= lines.length)
                {
                    continue
                }
                line = lines[y].asMutable()
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
                for (i = si; i < ei; i++)
                {
                    seg = line[i]
                    upper = seg.toUpperCase()
                    lower = seg.toLowerCase()
                    if (kind === 'lower')
                    {
                        newSeg = lower
                    }
                    else if (kind === 'upper')
                    {
                        newSeg = upper
                    }
                    else
                    {
                        newSeg = (upper !== seg ? upper : lower)
                    }
                    if (newSeg !== seg)
                    {
                        line[i] = newSeg
                        changed = true
                    }
                }
                lines[y] = line
            }
        }
        if (!changed)
        {
            return false
        }
        this.setLines(lines)
        return true
    },
    caseByMotion:function (spec, kind)
    {
        var cursor, rng, rngs, starts
    
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _2b_ = 0; _2b_ < list.length; _2b_++)
        {
            cursor = list[_2b_]
            rng = this.rangeForMotion(cursor,spec)
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
        this.begin()
        this.changeCaseInRanges(rngs,kind)
        starts = rngs.map(function (r)
        {
            return [r[0],r[1]]
        })
        this.setCursors(starts,{main:this.s.main})
        this.end()
        return this.lastChange = {operator:'case',kind:kind,motion:_k_.copy((spec))}
    },
    visualCase:function (kind)
    {
        var lines, pairs, rngs, shapes, starts
    
        rngs = this.s.selections.asMutable()
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.novim.visual === 'block')
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
        this.changeCaseInRanges(rngs,kind)
        this.end()
        lines = this.s.lines
        starts = starts.map(function (p)
        {
            return [_k_.min(p[0],kseg.width(lines[p[1]])),p[1]]
        })
        this.setCursors(starts,{main:this.s.main})
        this.stopVisual(false,false)
        return this.lastChange = {operator:'visualCase',kind:kind,shapes:shapes}
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
        for (var _2c_ = 0; _2c_ < list.length; _2c_++)
        {
            c = list[_2c_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (i = segi; i <= lasti; i++)
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
        var block, blocks, by, c, cursors, head, j, joined, lines, n, newCursors, nx, ny, part, parts, seam, starts, take, text, x, y
    
        n = _k_.max(2,((count != null ? count : 1)))
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        starts = []
        var list = _k_.list(cursors)
        for (var _2d_ = 0; _2d_ < list.length; _2d_++)
        {
            c = list[_2d_]
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
        for (var _2e_ = 0; _2e_ < list1.length; _2e_++)
        {
            y = list1[_2e_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _2f_ = 0; _2f_ < list2.length; _2f_++)
        {
            block = list2[_2f_]
            ;[y,take] = block
            head = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [head]
            for (j = 1; j < take; j++)
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _30_ = 0; _30_ < list3.length; _30_++)
            {
                part = list3[_30_]
                if (_k_.empty(part))
                {
                    continue
                }
                joined = (_k_.empty((joined)) ? part : joined + ' ' + part)
            }
            block[2] = kseg.width(head)
            lines.splice(y,take,kseg(joined))
        }
        newCursors = []
        var list4 = _k_.list(cursors)
        for (var _31_ = 0; _31_ < list4.length; _31_++)
        {
            c = list4[_31_]
            ;[x,y] = c
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _32_ = 0; _32_ < list5.length; _32_++)
            {
                block = list5[_32_]
                ;[by,take,seam] = block
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
        var i, jump, n, origin, _1644_23_
    
        n = ((_1644_23_=spec.count) != null ? _1644_23_ : count)
        jump = _k_.in(spec.kind,['eof','bof','sentence','sentenceBack','paragraph','paragraphBack','windowTop','windowMiddle','windowBottom'])
        origin = (jump ? this.mainCursor() : null)
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
        else if (_k_.in(spec.kind,['windowTop','windowMiddle','windowBottom']))
        {
            this.moveCursorsToWindowLine(spec.kind,n)
        }
        else
        {
            for (i = 1; i <= n; i++)
            {
                this.moveCursors(spec.kind)
            }
        }
        if (this.novim.visual)
        {
            this.updateVisual()
        }
        if (jump && !(_k_.eql(origin, this.mainCursor())))
        {
            return this.pushJump(origin)
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
        for (var _34_ = 0; _34_ < list.length; _34_++)
        {
            p = list[_34_]
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
        for (var _35_ = 0; _35_ < list.length; _35_++)
        {
            c = list[_35_]
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
        for (i = 0; i < n; i++)
        {
            this.undo()
        }
    },
    collectSubstitutions:function (y1, y2, spec)
    {
        var entries, line, res, y
    
        entries = []
        for (y = y1; y <= y2; y++)
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
        for (var _36_ = 0; _36_ < list.length; _36_++)
        {
            entry = list[_36_]
            var list1 = _k_.list(entry.matches)
            for (var _37_ = 0; _37_ < list1.length; _37_++)
            {
                m = list1[_37_]
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
        var entry, lastPos, lines, m, total
    
        lines = this.s.lines.map(function (l)
        {
            return kseg.str(l)
        })
        total = 0
        lastPos = null
        var list = _k_.list(entries)
        for (var _38_ = 0; _38_ < list.length; _38_++)
        {
            entry = list[_38_]
            lines[entry.y] = belt.joinSubstitution(entry.line,entry.matches,spec.tokens)
            var list1 = _k_.list(entry.matches)
            for (var _39_ = 0; _39_ < list1.length; _39_++)
            {
                m = list1[_39_]
                total += 1
                lastPos = [m.x1,entry.y]
            }
        }
        if (!total)
        {
            return 0
        }
        this.begin()
        this.setLines(lines)
        this.setCursors([lastPos])
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
    },
    windowLine:function (kind, count = 1)
    {
        var bottom, n, rows, top
    
        rows = _k_.max(1,this.cells.rows)
        top = this.lineAtRow(0)
        bottom = this.lineAtRow(rows - 1)
        n = _k_.max(1,((count != null ? count : 1)))
        switch (kind)
        {
            case 'windowTop':
                return _k_.clamp(top,bottom,(top + n - 1))
    
            case 'windowBottom':
                return _k_.clamp(top,bottom,(bottom - n + 1))
    
            default:
                return this.lineAtRow(parseInt((rows - 1) / 2))
        }
    
    },
    moveCursorsToWindowLine:function (kind, count = 1)
    {
        var c, cursors, line, x
    
        line = this.windowLine(kind,count)
        x = belt.lineIndentAtPos(this.s.lines,[0,line])
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _3a_ = 0; _3a_ < list.length; _3a_++)
        {
            c = list[_3a_]
            c[0] = x
            c[1] = line
        }
        return this.setCursors(cursors,{main:this.s.main})
    },
    windowMotionRange:function (cursor, spec)
    {
        var line, y1, y2, _1816_49_
    
        line = this.windowLine(spec.kind,(((_1816_49_=spec.count) != null ? _1816_49_ : 1)))
        y1 = _k_.min(cursor[1],line)
        y2 = _k_.max(cursor[1],line)
        return [0,y1,kseg.width(this.s.lines[y2]),y2]
    },
    rangeForMotion:function (cursor, spec)
    {
        if (_k_.in(spec.kind,['windowTop','windowMiddle','windowBottom']))
        {
            return this.windowMotionRange(cursor,spec)
        }
        return motion.range(this.s.lines,cursor,spec)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCO09BQXdCLGVBQXhCO09BQWlDLGVBQWpDO09BQTBDLGlCQUExQzs7T0FDWSxhQUFSOzs7SUFJUDs7Z0JBRUksYUFBd0IsU0FDeEIsVUFBd0IsU0FDeEIsWUFBd0IsV0FDeEIsZUFBb0IsRUFDcEIsa0JBQW9COztJQUV4Qix1QkFBYzs7OzthQUlMLEtBQUMsb0JBQWEsS0FBQyxXQUFXOzs7O1lBRTVCLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLE1BQU0sbUJBQVcsSUFBSSxVQUFpQixPQUFPLGVBQWUsZUFBZSxhQUFhLGVBQWUsYUFBYSxtQkFBbUIsZUFBZSxpQkFBaUIsZ0JBQWdCLGFBQWEscUJBQXFCOztZQUN6TixLQUFDOztnQkFFRSxJQUFJOztpQkFDUDt1QkFBMEIsS0FBQyxlQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLFlBQXFCOztpQkFDaEQ7dUJBQTBCLEtBQUMsYUFBcUIsSUFBSSxPQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQyxZQUFxQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUMxRTt1QkFBMEIsS0FBQyxhQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLGdCQUFxQixJQUFJLE1BQVEsSUFBSSxrQkFBWSxJQUFJLFdBQVUsSUFBSSxVQUFVLE1BQU07O2lCQUM5Rzt1QkFBMEIsS0FBQyxnQkFBcUIsSUFBSSxNQUFRLElBQUksa0JBQVksSUFBSSxXQUFVLElBQUksV0FBYyxNQUFNOztpQkFDbEg7dUJBQTBCLEtBQUMsV0FBcUIsSUFBSSxNQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FB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
//# sourceURL=../../../../kode/ked/edit/act/novim.kode
