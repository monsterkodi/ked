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
        var _22_29_
    
        if (cmd.motion)
        {
            cmd.motion.count = ((_22_29_=cmd.motion.count) != null ? _22_29_ : cmd.count)
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
        for (var _b_ = i = 0, _c_ = count; (_b_ <= _c_ ? i < count : i > count); (_b_ <= _c_ ? ++i : --i))
        {
            target = null
            var list = _k_.list(this.s.highlights)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                span = list[_d_]
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
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            span = list[_e_]
            var _f_ = span; x1 = _f_[0]; y = _f_[1]; x2 = _f_[2]
    
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
        for (var _10_ = i = 0, _11_ = _k_.max(1,(count != null ? count : 1)); (_10_ <= _11_ ? i < _k_.max(1,(count != null ? count : 1)) : i > _k_.max(1,(count != null ? count : 1))); (_10_ <= _11_ ? ++i : --i))
        {
            target = null
            var list = _k_.list(spans)
            for (var _12_ = 0; _12_ < list.length; _12_++)
            {
                span = list[_12_]
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
        for (var _13_ = 0; _13_ < list.length; _13_++)
        {
            c = list[_13_]
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
            var x, y, _281_56_
    
            y = _k_.clamp(0,lines.length - 1,(((_281_56_=lineMap[pos[1]]) != null ? _281_56_ : pos[1])))
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
        var anchor, anchors, cursor, cursors, i, pair, pairs, unique, _305_32_
    
        cursors = this.allCursors()
        anchors = this.novim.visualAnchors
        pairs = []
        var list = _k_.list(cursors)
        for (i = 0; i < list.length; i++)
        {
            cursor = list[i]
            anchor = ((_305_32_=anchors[i]) != null ? _305_32_ : [cursor[0],cursor[1]])
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
        for (var _15_ = 0; _15_ < list1.length; _15_++)
        {
            pair = list1[_15_]
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
            var _16_ = [b,a]; a = _16_[0]; b = _16_[1]
    
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
        for (var _17_ = y = y1, _18_ = y2; (_17_ <= _18_ ? y <= y2 : y >= y2); (_17_ <= _18_ ? ++y : --y))
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
        for (var _1a_ = 0; _1a_ < list1.length; _1a_++)
        {
            pair = list1[_1a_]
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
            for (var _1b_ = 0; _1b_ < list.length; _1b_++)
            {
                rng = list[_1b_]
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
                for (var _1c_ = 0; _1c_ < list1.length; _1c_++)
                {
                    rng = list1[_1c_]
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
            for (var _1d_ = 0; _1d_ < list2.length; _1d_++)
            {
                rng = list2[_1d_]
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
        for (var _1f_ = 0; _1f_ < list.length; _1f_++)
        {
            cursor = list[_1f_]
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
        for (var _20_ = 0; _20_ < list.length; _20_++)
        {
            cursor = list[_20_]
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
        for (var _21_ = 0; _21_ < list.length; _21_++)
        {
            index = list[_21_]
            indents[index] = belt.numIndent(this.s.lines[index])
        }
        this.indentAtIndices(indices,deindent,((count != null ? count : 1)))
        anchors = []
        var list1 = _k_.list(this.novim.visualAnchors)
        for (var _22_ = 0; _22_ < list1.length; _22_++)
        {
            anchor = list1[_22_]
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
        for (var _23_ = i = 0, _24_ = n; (_23_ <= _24_ ? i < n : i > n); (_23_ <= _24_ ? ++i : --i))
        {
            if (deindent)
            {
                var _25_ = belt.deindentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _25_[0]; selections = _25_[1]; cursors = _25_[2]
    
            }
            else
            {
                var _26_ = belt.indentLineRangesAndPositionsAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _26_[0]; selections = _26_[1]; cursors = _26_[2]
    
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
        var _692_27_
    
        this.novim.insert = _k_.copy(spec)
        this.novim.insert.text = ((_692_27_=this.novim.insert.text) != null ? _692_27_ : '')
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
        var i, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        this.novim.insert = {kind:'replace',text:'',count:n,undo:[]}
        for (var _27_ = i = 0, _28_ = this.s.cursors.length; (_27_ <= _28_ ? i < this.s.cursors.length : i > this.s.cursors.length); (_27_ <= _28_ ? ++i : --i))
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
        var c, changed, cursors, hist, i, line, lines, newLine, ni, rec, si, _782_22_
    
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
        var i, insert, n, text, _827_36_
    
        if (!this.novim.insert)
        {
            return
        }
        insert = this.novim.insert
        this.novim.insert = null
        if (insert.kind === 'replace')
        {
            n = _k_.max(1,(((_827_36_=insert.count) != null ? _827_36_ : 1)))
            if (n > 1 && !_k_.empty(insert.text) && !(_k_.in('\n',insert.text)))
            {
                this.replaceTextAtCursors(insert.text,(n - 1))
            }
            text = ''
            for (var _2b_ = i = 0, _2c_ = n; (_2b_ <= _2c_ ? i < n : i > n); (_2b_ <= _2c_ ? ++i : --i))
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
        var spec, _863_40_
    
        spec = _k_.copy((((_863_40_=this.lastChange.motion) != null ? _863_40_ : {kind:'line',count:1})))
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
        for (var _2d_ = 0; _2d_ < list.length; _2d_++)
        {
            c = list[_2d_]
            for (var _2e_ = k = 0, _2f_ = n; (_2e_ <= _2f_ ? k < n : k > n); (_2e_ <= _2f_ ? ++k : --k))
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
        for (var _30_ = i = 0, _31_ = n; (_30_ <= _31_ ? i < n : i > n); (_30_ <= _31_ ? ++i : --i))
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
        var i, n, _970_32_
    
        n = _k_.max(1,(((_970_32_=insert.count) != null ? _970_32_ : 1)))
        this.begin()
        for (var _32_ = i = 0, _33_ = n; (_32_ <= _33_ ? i < n : i > n); (_32_ <= _33_ ? ++i : --i))
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
        for (var _34_ = i = 0, _35_ = n; (_34_ <= _35_ ? i < n : i > n); (_34_ <= _35_ ? ++i : --i))
        {
            this.replayVisual(this.lastChange,action)
        }
    },
    replayVisual:function (change, action)
    {
        var changed, cursor, cursors, i, lines, rng, rngs, shape, starts, x, y, _1020_66_
    
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
            shape = ((_1020_66_=change.shapes[_k_.min(i,change.shapes.length - 1)]) != null ? _1020_66_ : change.shapes[0])
            if (!shape)
            {
                continue
            }
            if (shape.block)
            {
                var list1 = _k_.list(this.blockRangesForShape(shape,cursor))
                for (var _37_ = 0; _37_ < list1.length; _37_++)
                {
                    rng = list1[_37_]
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
                for (var _38_ = 0; _38_ < list2.length; _38_++)
                {
                    rng = list2[_38_]
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
                for (var _39_ = 0; _39_ < list3.length; _39_++)
                {
                    rng = list3[_39_]
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
        for (var _3a_ = 0; _3a_ < list.length; _3a_++)
        {
            cursor = list[_3a_]
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
        for (var _3b_ = 0; _3b_ < list.length; _3b_++)
        {
            rng = list[_3b_]
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
        var flashMs, _1234_29_, _1234_36_, _1234_50_
    
        if (_k_.empty(rngs))
        {
            return
        }
        if (this.novim.yankFlashTimer)
        {
            clearTimeout(this.novim.yankFlashTimer)
        }
        flashMs = ((_1234_50_=((_1234_29_=config.data) != null ? (_1234_36_=_1234_29_.novim) != null ? _1234_36_.yankFlashMs : undefined : undefined)) != null ? _1234_50_ : 500)
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
        for (var _3d_ = i = 0, _3e_ = count; (_3d_ <= _3e_ ? i < count : i > count); (_3d_ <= _3e_ ? ++i : --i))
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
        for (var _40_ = 0; _40_ < list1.length; _40_++)
        {
            idx = list1[_40_]
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
        for (var _41_ = 0; _41_ < list.length; _41_++)
        {
            c = list[_41_]
            width = kseg.width(lines[c[1]])
            x = _k_.min(c[0],width)
            if (!after)
            {
                x = _k_.max(0,x - 1)
            }
            posl.push([x,c[1]])
        }
        var _42_ = belt.insertTextAtPositions(lines,text,posl); newLines = _42_[0]; newPosl = _42_[1]
    
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
        for (var _43_ = 0; _43_ < list.length; _43_++)
        {
            rng = list[_43_]
            var _44_ = rng; x1 = _44_[0]; y1 = _44_[1]; x2 = _44_[2]; y2 = _44_[3]
    
            for (var _45_ = y = y1, _46_ = y2; (_45_ <= _46_ ? y <= y2 : y >= y2); (_45_ <= _46_ ? ++y : --y))
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
                for (var _47_ = i = 0, _48_ = ei - si; (_47_ <= _48_ ? i < ei - si : i > ei - si); (_47_ <= _48_ ? ++i : --i))
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
        for (var _49_ = 0; _49_ < list.length; _49_++)
        {
            c = list[_49_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi + n > line.length)
            {
                continue
            }
            repl = []
            for (var _4a_ = i = 0, _4b_ = n; (_4a_ <= _4b_ ? i < n : i > n); (_4a_ <= _4b_ ? ++i : --i))
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
        for (var _4c_ = 0; _4c_ < list.length; _4c_++)
        {
            rng = list[_4c_]
            var _4d_ = rng; x1 = _4d_[0]; y1 = _4d_[1]; x2 = _4d_[2]; y2 = _4d_[3]
    
            for (var _4e_ = y = y1, _4f_ = y2; (_4e_ <= _4f_ ? y <= y2 : y >= y2); (_4e_ <= _4f_ ? ++y : --y))
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
                for (var _50_ = i = si, _51_ = ei; (_50_ <= _51_ ? i < ei : i > ei); (_50_ <= _51_ ? ++i : --i))
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
        for (var _52_ = 0; _52_ < list.length; _52_++)
        {
            cursor = list[_52_]
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
        for (var _53_ = 0; _53_ < list.length; _53_++)
        {
            c = list[_53_]
            line = lines[c[1]].asMutable()
            segi = kseg.indexAtWidth(line,c[0])
            if (segi >= line.length)
            {
                continue
            }
            lasti = _k_.min(line.length - 1,segi + n - 1)
            for (var _54_ = i = segi, _55_ = lasti; (_54_ <= _55_ ? i <= lasti : i >= lasti); (_54_ <= _55_ ? ++i : --i))
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
        for (var _56_ = 0; _56_ < list.length; _56_++)
        {
            c = list[_56_]
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
        for (var _57_ = 0; _57_ < list1.length; _57_++)
        {
            y = list1[_57_]
            if (blocks.length && y < blocks.slice(-1)[0][0] + blocks.slice(-1)[0][1])
            {
                continue
            }
            blocks.push([y,_k_.min(n,lines.length - y),0])
        }
        var list2 = _k_.list(blocks)
        for (var _58_ = 0; _58_ < list2.length; _58_++)
        {
            block = list2[_58_]
            var _59_ = block; y = _59_[0]; take = _59_[1]
    
            first = kseg.str(lines[y]).replace(/\s+$/,'')
            parts = [first]
            for (var _5a_ = j = 1, _5b_ = take; (_5a_ <= _5b_ ? j < take : j > take); (_5a_ <= _5b_ ? ++j : --j))
            {
                text = kseg.str(lines[y + j]).replace(/^\s+/,'').replace(/\s+$/,'')
                parts.push(text)
            }
            joined = ''
            var list3 = _k_.list(parts)
            for (var _5c_ = 0; _5c_ < list3.length; _5c_++)
            {
                part = list3[_5c_]
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
        for (var _5d_ = 0; _5d_ < list4.length; _5d_++)
        {
            c = list4[_5d_]
            var _5e_ = c; x = _5e_[0]; y = _5e_[1]
    
            ny = y
            nx = x
            var list5 = _k_.list(blocks)
            for (var _5f_ = 0; _5f_ < list5.length; _5f_++)
            {
                block = list5[_5f_]
                var _60_ = block; by = _60_[0]; take = _60_[1]; seam = _60_[2]
    
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
        var i, jump, n, origin, _1640_23_
    
        n = ((_1640_23_=spec.count) != null ? _1640_23_ : count)
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
            for (var _61_ = i = 1, _62_ = n; (_61_ <= _62_ ? i <= n : i >= n); (_61_ <= _62_ ? ++i : --i))
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
        for (var _64_ = 0; _64_ < list.length; _64_++)
        {
            p = list[_64_]
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
        for (var _65_ = 0; _65_ < list.length; _65_++)
        {
            c = list[_65_]
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
        for (var _66_ = i = 0, _67_ = n; (_66_ <= _67_ ? i < n : i > n); (_66_ <= _67_ ? ++i : --i))
        {
            this.undo()
        }
    },
    collectSubstitutions:function (y1, y2, spec)
    {
        var entries, line, res, y
    
        entries = []
        for (var _68_ = y = y1, _69_ = y2; (_68_ <= _69_ ? y <= y2 : y >= y2); (_68_ <= _69_ ? ++y : --y))
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
        for (var _6a_ = 0; _6a_ < list.length; _6a_++)
        {
            entry = list[_6a_]
            var list1 = _k_.list(entry.matches)
            for (var _6b_ = 0; _6b_ < list1.length; _6b_++)
            {
                m = list1[_6b_]
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
        for (var _6c_ = 0; _6c_ < list.length; _6c_++)
        {
            entry = list[_6c_]
            lines[entry.y] = belt.joinSubstitution(entry.line,entry.matches,spec.tokens)
            var list1 = _k_.list(entry.matches)
            for (var _6d_ = 0; _6d_ < list1.length; _6d_++)
            {
                m = list1[_6d_]
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
        for (var _6e_ = 0; _6e_ < list.length; _6e_++)
        {
            c = list[_6e_]
            c[0] = x
            c[1] = line
        }
        return this.setCursors(cursors,{main:this.s.main})
    },
    windowMotionRange:function (cursor, spec)
    {
        var line, y1, y2, _1812_49_
    
        line = this.windowLine(spec.kind,(((_1812_49_=spec.count) != null ? _1812_49_ : 1)))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsWUFBWjs7T0FDWSxXQUFaO09BQWlCLGFBQWpCO09BQXdCLGVBQXhCO09BQWlDLGVBQWpDO09BQTBDLGlCQUExQzs7T0FDWSxhQUFSOzs7SUFJUDs7Z0JBRUksYUFBd0IsU0FDeEIsVUFBd0IsU0FDeEIsWUFBd0IsV0FDeEIsZUFBb0IsRUFDcEIsa0JBQW9COztJQUV4Qix1QkFBYzs7OztZQUlQLElBQUk7O1lBQ0gsSUFBSSxPQUFPLGtCQUFYLElBQUksT0FBTywyQkFBUyxJQUFJOztZQUV6QixLQUFDLE1BQU0sbUJBQVcsSUFBSSxVQUFpQixPQUFPLGVBQWUsZUFBZSxhQUFhLGVBQWUsYUFBYSxtQkFBbUIsZUFBZSxpQkFBaUIsZ0JBQWdCLGFBQWEscUJBQXFCOztZQUN6TixLQUFDOztnQkFFRSxJQUFJOztpQkFDUDt1QkFBMEIsS0FBQyxlQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLFlBQXFCOztpQkFDaEQ7dUJBQTBCLEtBQUMsYUFBcUIsSUFBSSxPQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQyxZQUFxQixJQUFJLE1BQVEsSUFBSSxNQUFNLElBQUk7O2lCQUMxRTt1QkFBMEIsS0FBQyxhQUFxQixJQUFJLE9BQVEsSUFBSTs7aUJBQ2hFO3VCQUEwQixLQUFDLGdCQUFxQixJQUFJLE1BQVEsSUFBSSxrQkFBWSxJQUFJLFdBQVUsSUFBSSxVQUFVLE1BQU07O2lCQUM5Rzt1QkFBMEIsS0FBQyxnQkFBcUIsSUFBSSxNQUFRLElBQUksa0JBQVksSUFBSSxXQUFVLElBQUksV0FBYyxNQUFNOztpQkFDbEg7dUJBQTBCLEtBQUMsV0FBcUIsSUFBSSxNQUFRLElBQUk7O2lCQUNoRTt1QkFBMEIsS0FBQzs7aUJBQzNCO3VCQUEwQixLQUFDLFNBQXFCLElB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
//# sourceURL=../../../../kode/ked/edit/act/novim.kode
