var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var brckts, clos, opns, pair

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kutil = kxk.kutil
let kseg = kxk.kseg
let pepe = kxk.pepe

import belt from "./belt.js"

brckts = new Set(['(',')','[',']','{','}'])
opns = new Set(['(','[','{'])
clos = new Set([')',']','}'])

pair = (function ()
{
    function pair ()
    {}

    pair["isUnbalancedPosition"] = function (lines, pos, char)
    {
        var p, revs, start, _34_28_

        revs = {']':'[','}':'{',')':'(','"':'"',"'":"'"}
        p = pepe(kseg.str(lines[pos[1]]))
        start = (p.unbalanced != null ? p.unbalanced.slice(1).map(function (s)
        {
            return s.start
        }) : undefined)
        return !_k_.empty(start) && _k_.in(revs[char],start)
    }

    pair["isRangeInString"] = function (lines, rng)
    {
        var _43_76_

        return (this.rangeOfStringSurroundingRange(lines,rng) != null)
    }

    pair["rangeOfStringSurroundingRange"] = function (lines, rng)
    {
        var ir

        if (ir = this.rangeOfInnerStringSurroundingRange(lines,rng))
        {
            return this.rangeGrownBy(ir,1)
        }
    }

    pair["rangeOfInnerStringSurroundingRange"] = function (lines, rng)
    {
        var r, rgs

        if (this.isInvalidLineIndex(lines,rng[1]))
        {
            return
        }
        rgs = this.rangesOfStringsInText(lines[rng[1]],rng[1])
        rgs = this.rangesShrunkenBy(rgs,1)
        var list = _k_.list(rgs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            r = list[_a_]
            if (this.rangeContainsRange(r,rng))
            {
                return r
            }
        }
    }

    pair["rangesOfStringsInText"] = function (text, li = 0)
    {
        var c, cc, i, rngs, ss

        rngs = []
        ss = -1
        cc = null
        for (var _a_ = i = 0, _b_ = text.length; (_a_ <= _b_ ? i < text.length : i > text.length); (_a_ <= _b_ ? ++i : --i))
        {
            c = text[i]
            if (!cc && _k_.in(c,"'\""))
            {
                cc = c
                ss = i
            }
            else if (c === cc)
            {
                if ((text[i - 1] !== '\\') || (i > 2 && text[i - 2] === '\\'))
                {
                    rngs.push([ss,li,i + 1,li])
                    cc = null
                    ss = -1
                }
            }
        }
        return rngs
    }

    pair["positionsAndRangesOutsideStrings"] = function (lines, rngs, posl)
    {
        var found, pos, rng

        found = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (!belt.isRangeInString(lines,rng))
            {
                found.push(rng)
            }
        }
        var list1 = _k_.list(posl)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            pos = list1[_b_]
            if (!belt.isRangeInString(lines,belt.rangeForPos(pos)))
            {
                found.push(pos)
            }
        }
        return found
    }

    pair["codeunitIndexForColumn"] = function (line, col)
    {
        var segi

        segi = kseg.segiAtWidth(line,col)
        return kseg.str(line.slice(0, typeof segi === 'number' ? segi : -1)).length
    }

    pair["columnForCodeunitIndex"] = function (line, cu)
    {
        var c, g, n

        n = 0
        c = 0
        var list = _k_.list(line)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            g = list[_a_]
            if (n >= cu)
            {
                return c
            }
            n += g.length
            c += kseg.segWidth(g)
        }
        return c
    }

    pair["pairsAtPositions"] = function (lines, posl)
    {
        var byLine, cu, found, li, pair, pairs, pos

        byLine = {}
        found = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (this.isInvalidLineIndex(lines,pos[1]))
            {
                continue
            }
            li = pos[1]
            pairs = byLine[li]
            if (!pairs)
            {
                pairs = byLine[li] = pepe.pairs(kseg.str(lines[li]))
            }
            cu = this.codeunitIndexForColumn(lines[li],pos[0])
            var list1 = _k_.list(pairs)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pair = list1[_b_]
                if (pair.rng[0] <= cu && pair.rng[1] >= cu)
                {
                    found.push([li,pair])
                }
            }
        }
        return found
    }

    pair["rangesOfNestedPairsAtPositions"] = function (lines, posl)
    {
        var f, li, line, pair, rngs

        rngs = []
        var list = _k_.list(this.pairsAtPositions(lines,posl))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            li = f[0]
            pair = f[1]
            line = lines[li]
            rngs.push([this.columnForCodeunitIndex(line,pair.rng[0]),li,this.columnForCodeunitIndex(line,pair.rng[1]),li])
        }
        return rngs
    }

    pair["spansOfNestedPairsAtPositions"] = function (lines, posl)
    {
        var brackets, c0, c1, close, f, li, line, open, pair, spans, strings

        spans = []
        brackets = []
        strings = []
        var list = _k_.list(this.pairsAtPositions(lines,posl))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            li = f[0]
            pair = f[1]
            line = lines[li]
            c0 = this.columnForCodeunitIndex(line,pair.rng[0])
            c1 = this.columnForCodeunitIndex(line,pair.rng[1])
            open = [c0,li,c0 + pair.start.length]
            close = [c1,li,c1 + pair.end.length]
            spans.push(open)
            spans.push(close)
            if (_k_.in(pair.start,'"\''))
            {
                strings.push(open)
                strings.push(close)
            }
            else
            {
                brackets.push(open)
                brackets.push(close)
            }
        }
        return [spans,brackets,strings]
    }

    pair["rangesOfPairsSurroundingPositions"] = function (lines, pairs, posl)
    {
        var pair, pos, rngs

        rngs = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            var list1 = _k_.list(pairs)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pair = list1[_b_]
                if (this.chunkBeforePos(lines,pos).endsWith(pair[0]) && this.chunkAfterPos(lines,pos).startsWith(pair[1]))
                {
                    rngs.push([pos[0] - pair[0].length,pos[1],pos[0] + pair[1].length,pos[1]])
                }
            }
        }
        return rngs
    }

    pair["stringDelimiterSpansForPositions"] = function (lines, posl)
    {
        var pos, spans, srng

        spans = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (srng = this.rangeOfStringSurroundingRange(lines,[pos[0],pos[1],pos[0],pos[1]]))
            {
                spans.push([srng[0],srng[1],srng[0] + 1])
                spans.push([srng[2] - 1,srng[3],srng[2]])
            }
            else if (_k_.in(lines[pos[1]][pos[0]],"\"'"))
            {
                if (srng = this.rangeOfStringSurroundingRange(lines,[pos[0] + 1,pos[1],pos[0] + 1,pos[1]]))
                {
                    spans.push([srng[0],srng[1],srng[0] + 1])
                    spans.push([srng[2] - 1,srng[3],srng[2]])
                }
            }
        }
        return spans
    }

    pair["bracketIndex"] = function (lines)
    {
        var c, idx, l, line, s

        idx = []
        var list = _k_.list(lines)
        for (l = 0; l < list.length; l++)
        {
            line = list[l]
            var list1 = _k_.list(line)
            for (s = 0; s < list1.length; s++)
            {
                c = list1[s]
                if (brckts.has(c))
                {
                    idx.push([l,s,c])
                }
            }
        }
        return idx
    }

    pair["indexOfBracketAtOrAfter"] = function (idx, l, s)
    {
        var e, hi, lo, mid

        lo = 0
        hi = idx.length
        while (lo < hi)
        {
            mid = (lo + hi) >> 1
            e = idx[mid]
            if (e[0] > l || (e[0] === l && e[1] >= s))
            {
                hi = mid
            }
            else
            {
                lo = mid + 1
            }
        }
        return lo
    }

    pair["openCloseSpansForPositions"] = function (lines, posl)
    {
        var idx, pos, spans, sps

        idx = this.bracketIndex(lines)
        spans = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (sps = this.openCloseSpansForPosition(lines,idx,pos))
            {
                spans = spans.concat(sps)
            }
        }
        return spans
    }

    pair["openCloseSpansForPosition"] = function (lines, idx, pos)
    {
        var ai, cc, cline, e, firstClose, firstCloseIndex, firstCloseLine, j, lastOpen, lastOpenIndex, lastOpenLine, line, next, oc, oline, open, openEncounters, prev, revs, si, stack

        open = {'[':']','{':'}','(':')'}
        revs = {']':'[','}':'{',')':'('}
        if (this.isInvalidLineIndex(lines,pos[1]))
        {
            return
        }
        line = lines[pos[1]]
        si = kseg.segiAtWidth(line,pos[0])
        stack = []
        openEncounters = ''
        lastOpen = undefined
        lastOpenLine = pos[1]
        lastOpenIndex = -1
        if (opns.has(line[si]))
        {
            lastOpen = line[si]
            lastOpenLine = pos[1]
            lastOpenIndex = si
            j = -1
        }
        else
        {
            j = this.indexOfBracketAtOrAfter(idx,pos[1],si)
            j -= 1
            while (j >= 0)
            {
                e = idx[j]
                prev = e[2]
                if (opns.has(prev))
                {
                    if (stack.length)
                    {
                        if (open[prev] === _k_.last(stack))
                        {
                            openEncounters += prev
                            stack.pop()
                            j -= 1
                            continue
                        }
                        else
                        {
                            return
                        }
                    }
                    lastOpen = prev
                    lastOpenLine = e[0]
                    lastOpenIndex = e[1]
                    break
                }
                else
                {
                    stack.push(prev)
                }
                j -= 1
            }
        }
        firstClose = undefined
        firstCloseLine = pos[1]
        firstCloseIndex = -1
        stack = []
        ai = si
        if (opns.has(line[si]))
        {
            ai = si + 1
        }
        j = this.indexOfBracketAtOrAfter(idx,pos[1],ai)
        while (j < idx.length)
        {
            e = idx[j]
            next = e[2]
            if (clos.has(next))
            {
                if (stack.length)
                {
                    if (open[_k_.last(stack)] === next)
                    {
                        stack.pop()
                    }
                    else
                    {
                        return
                    }
                }
                else
                {
                    firstClose = next
                    firstCloseLine = e[0]
                    firstCloseIndex = e[1]
                    break
                }
            }
            else
            {
                stack.push(next)
            }
            j += 1
        }
        if (!(lastOpen != null) || !(firstClose != null))
        {
            if (si - 1 >= 0 && clos.has(line[si - 1]) && _k_.in(revs[line[si - 1]],openEncounters))
            {
                return this.openCloseSpansForPosition(lines,idx,[kseg.widthAtSegi(line,si - 1),pos[1]])
            }
            return
        }
        if (open[lastOpen] === firstClose)
        {
            oline = lines[lastOpenLine]
            cline = lines[firstCloseLine]
            oc = kseg.widthAtSegi(oline,lastOpenIndex)
            cc = kseg.widthAtSegi(cline,firstCloseIndex)
            return [[oc,lastOpenLine,oc + 1],[cc,firstCloseLine,cc + 1]]
        }
    }

    return pair
})()

export default pair;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3BhaXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBV0EsYUFBYSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtBQUN0QyxXQUFhLEtBQUssSUFBSSxJQUFJO0FBQzFCLFdBQWEsS0FBSyxJQUFJLElBQUk7Ozs7Ozs7Ozs7O1FBWWxCLFFBQ0ksSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUs7UUFFVCxJQUFJLEtBQUssS0FBSyxJQUFJLE1BQU0sSUFBSTtRQUM1QixTQUFRLEVBQUUscUJBQUYsRUFBRSxpQkFBWSxHQUFLOzttQkFBVyxFQUFFOzswQkFDbEMsaUJBQVUsS0FBSyxNQUFTOzs7Ozs7O2dCQVFILEtBQUMsOEJBQThCLE1BQU07Ozs7Ozs7WUFJN0QsS0FBSyxLQUFDLG1DQUFtQyxNQUFNOzttQkFDOUMsS0FBQyxhQUFhLEdBQUc7Ozs7Ozs7O1lBSWYsS0FBQyxtQkFBbUIsTUFBTSxJQUFJOzs7O1FBRXBDLE1BQU0sS0FBQyxzQkFBc0IsTUFBTSxJQUFJLElBQUksSUFBSTtRQUMvQyxNQUFNLEtBQUMsaUJBQWlCLElBQUk7NEJBQ25COzs7O2dCQUNHLEtBQUMsbUJBQW1CLEVBQUU7O3VCQUEzQjs7Ozs7Ozs7O1FBSVA7UUFDQSxLQUFLO1FBQ0wsS0FBSzsyQkFDSSxTQUFJLEtBQUssMEJBQUwsS0FBSyxhQUFMLEtBQUs7O1lBQ2QsSUFBSSxLQUFLO2lCQUNGLGFBQU8sRUFBSzs7Z0JBQ2YsS0FBSztnQkFDTCxLQUFLOztxQkFDRCxNQUFLOztxQkFDTCxLQUFLLElBQUUsT0FBTSxVQUFVLElBQUUsS0FBTSxLQUFLLElBQUUsT0FBTTs7b0JBQzVDLEtBQUssTUFBTSxHQUFHLEdBQUcsSUFBRSxFQUFFO29CQUNyQixLQUFLO29CQUNMLEtBQUs7Ozs7ZUFDakI7Ozs7Ozs7UUFVQTs0QkFFVzs7OztpQkFDQSxLQUFL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/pair.kode
