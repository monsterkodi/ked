var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var brckts, clos, opns, pair

import kxk from "../../../kxk.js"
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

    pair["openCloseSpansForPosition"] = function (lines, idx, pos, kind)
    {
        var ai, cc, cline, e, firstClose, firstCloseIndex, firstCloseLine, isClose, isOpen, j, lastOpen, lastOpenIndex, lastOpenLine, line, next, oc, oline, open, openEncounters, prev, revs, si, stack

        open = {'[':']','{':'}','(':')'}
        revs = {']':'[','}':'{',')':'('}
        isOpen = function (c)
        {
            return opns.has(c) && (!kind || c === kind)
        }
        isClose = function (c)
        {
            return clos.has(c) && (!kind || c === open[kind])
        }
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
        if (isOpen(line[si]))
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
                if (isOpen(prev))
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
                else if (isClose(prev))
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
        if (isOpen(line[si]))
        {
            ai = si + 1
        }
        j = this.indexOfBracketAtOrAfter(idx,pos[1],ai)
        while (j < idx.length)
        {
            e = idx[j]
            next = e[2]
            if (isClose(next))
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
            else if (isOpen(next))
            {
                stack.push(next)
            }
            j += 1
        }
        if (!(lastOpen != null) || !(firstClose != null))
        {
            if (si - 1 >= 0 && isClose(line[si - 1]) && _k_.in(revs[line[si - 1]],openEncounters))
            {
                return this.openCloseSpansForPosition(lines,idx,[kseg.widthAtSegi(line,si - 1),pos[1]],kind)
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

    pair["pairSpansAtPosition"] = function (lines, pos, kind)
    {
        var c0, c1, chosen, f, idx, li, line, pair

        chosen = null
        var list = _k_.list(this.pairsAtPositions(lines,[pos]))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            if (f[1].start === kind)
            {
                chosen = f
            }
        }
        if (chosen)
        {
            var _b_ = chosen; li = _b_[0]; pair = _b_[1]

            line = lines[li]
            c0 = this.columnForCodeunitIndex(line,pair.rng[0])
            c1 = this.columnForCodeunitIndex(line,pair.rng[1])
            return [[c0,li,c0 + 1],[c1,li,c1 + 1]]
        }
        if (this.isRangeInString(lines,[pos[0],pos[1],pos[0] + 1,pos[1]]))
        {
            return null
        }
        idx = this.bracketIndex(lines)
        return this.openCloseSpansForPosition(lines,idx,pos,kind)
    }

    return pair
})()

export default pair;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3BhaXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFdBQUE7O0FBRW5CLGFBQWEsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFDdEMsV0FBYSxLQUFLLElBQUksSUFBSTtBQUMxQixXQUFhLEtBQUssSUFBSSxJQUFJOztBQUVqQixRQUFUOzs7OztJQVFJLE1BQUMsbUNBQXNCLE9BQU0sS0FBSTs7OztRQUU3QixRQUNJLElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLO1FBRVQsSUFBSSxLQUFLLEtBQUssSUFBSSxNQUFNLElBQUk7UUFDNUIsU0FBUSxFQUFFLHFCQUFGLEVBQUUsaUJBQVksR0FBSyxjQUFLOzttQkFBTSxFQUFFOzswQkFDbEMsaUJBQVUsS0FBSyxNQUFTOzs7SUFRbEMsTUFBQyw4QkFBaUIsT0FBTTs7OztnQkFBTyxLQUFDLDhCQUE4QixNQUFNOzs7SUFFcEUsTUFBQyw0Q0FBK0IsT0FBTTs7OztZQUUvQixLQUFLLEtBQUMsbUNBQW1DLE1BQU07O21CQUM5QyxLQUFDLGFBQWEsR0FBRzs7OztJQUV6QixNQUFDLGlEQUFvQyxPQUFNOzs7O1lBRWpDLEtBQUMsbUJBQW1CLE1BQU0sSUFBSTs7OztRQUVwQyxNQUFNLEtBQUMsc0JBQXNCLE1BQU0sSUFBSSxJQUFJLElBQUk7UUFDL0MsTUFBTSxLQUFDLGlCQUFpQixJQUFJOzRCQUNuQjs7O1lBQUw7Z0JBQ1EsS0FBQyxtQkFBbUIsRUFBRTs7dUJBQTNCOzs7OztJQUVYLE1BQUMsb0NBQXVCLE1BQUssS0FBRzs7OztRQUU1QjtRQUNBLEtBQUs7UUFDTCxLQUFLO3VCQUNELElBQUssU0FBSSxLQUFLLDBCQUFMLEtBQUssYUFBTCxLQUFLOztZQUNkLElBQUksS0FBSztpQkFDRixhQUFPLEVBQUs7O2dCQUNmLEtBQUs7Z0JBQ0ws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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/pair.kode
