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
        var p, revs, start, _45_28_

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
        var _54_76_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3BhaXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBcUJBLGFBQWEsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFFdEMsV0FBVyxLQUFLLElBQUksSUFBSTtBQUN4QixXQUFXLEtBQUssSUFBSSxJQUFJOzs7Ozs7Ozs7OztRQVloQixRQUNJLElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLO1FBRVQsSUFBSSxLQUFLLEtBQUssSUFBSSxNQUFNLElBQUk7UUFDNUIsU0FBUSxFQUFFLHFCQUFGLEVBQUUsaUJBQVksR0FBSzs7bUJBQVcsRUFBRTs7MEJBQ2xDLGlCQUFVLEtBQUssTUFBUzs7Ozs7OztnQkFRSCxLQUFDLDhCQUE4QixNQUFNOzs7Ozs7O1lBSTdELEtBQUssS0FBQyxtQ0FBbUMsTUFBTTs7bUJBQzlDLEtBQUMsYUFBYSxHQUFHOzs7Ozs7OztZQUlmLEtBQUMsbUJBQW1CLE1BQU0sSUFBSTs7OztRQUVwQyxNQUFNLEtBQUMsc0JBQXNCLE1BQU0sSUFBSSxJQUFJLElBQUk7UUFDL0MsTUFBTSxLQUFDLGlCQUFpQixJQUFJOzRCQUNuQjs7OztnQkFDRyxLQUFDLG1CQUFtQixFQUFFOzt1QkFBM0I7Ozs7Ozs7OztRQUlQO1FBQ0EsS0FBSztRQUNMLEtBQUs7MkJBQ0ksU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztZQUNkLElBQUksS0FBSztpQkFDRixhQUFPLEVBQUs7O2dCQUNmLEtBQUs7Z0JBQ0wsS0FBSzs7cUJBQ0QsTUFBSzs7cUJBQ0wsS0FBSyxJQUFFLE9BQU0sVUFBVSxJQUFFLEtBQU0sS0FBSyxJQUFFLE9BQU07O29CQUM1QyxLQUFLLE1BQU0sR0FBRyxHQUFHLElBQUUsRUFBRTtvQkFDckIsS0FBSztvQkFDTCxLQUFLOzs7O2VBQ2pCOzs7Ozs7O1FBVUE7NEJBRVc7Ozs7aUJBQ0EsS0FB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
//# sourceURL=file://kode/ked/edit/tool/pair.kode
