var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isArr: function (o) {return Array.isArray(o)}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.r5=_k_.k.F256(_k_.k.r(5))

var addMatch, collect, hasStrongMatch, kermit, lineMatch, pattern, splitWords, traverse, wrapIndex

import kstr from "./kstr.js"
import gonzo from "./gonzo.js"


wrapIndex = function (ctx, offset)
{
    return (ctx.pind + offset) % ctx.ptn.length
}

hasStrongMatch = function (splt, ctx, d)
{
    return splt[0] === ctx.ptn[wrapIndex(ctx,d)][0][0]
}

splitWords = function (words, splitBy)
{
    var index, newWords, sw, sws, word

    newWords = []
    var list = _k_.list(words)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        word = list[_a_]
        sws = word.split(splitBy)
        var list1 = _k_.list(sws)
        for (index = 0; index < list1.length; index++)
        {
            sw = list1[index]
            newWords.push(sw)
            if (index < sws.length - 1)
            {
                newWords.push(splitBy)
            }
        }
    }
    return newWords
}

lineMatch = function (line, pt, splitlist)
{
    var ci, cp, cpt, rslt, si, sl, splt, strongMatch, tln, varName, weakMatch

    tln = _k_.trim(line)
    if (_k_.empty(tln))
    {
        return
    }
    splt = tln.split(/\s+/)
    cpt = _k_.trim(pt).split(/\s+/)
    var list = _k_.list(splitlist)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        sl = list[_c_]
        splt = splitWords(splt,sl)
        cpt = splitWords(cpt,sl)
    }
    if (_k_.empty(splt))
    {
        return
    }
    strongMatch = false
    weakMatch = false
    varName = null
    ci = 0
    si = 0
    rslt = {}
    while (ci < cpt.length)
    {
        cp = cpt[ci]
        if (cp === splt[si])
        {
            strongMatch = true
            varName = null
            si++
            ci++
            continue
        }
        if (_k_.in((cp != null ? cp[0] : undefined),'●○'))
        {
            weakMatch = true
            varName = cp.slice(1)
            switch (cp[0])
            {
                case '●':
                    rslt[varName] = splt[si]
                    si++
                    ci++
                    continue
                    break
                case '○':
                    if (ci === cpt.length - 1)
                    {
                        rslt[varName] = splt.slice(si).join(' ')
                        return rslt
                    }
                    else
                    {
                        if (cpt[ci + 1] === splt[si])
                        {
                            weakMatch = false
                            ci += 1
                            continue
                        }
                    }
                    break
            }

        }
        if (weakMatch && varName)
        {
            if (!_k_.empty(rslt[varName]))
            {
                rslt[varName] += ' ' + splt[si]
            }
            else
            {
                rslt[varName] = splt[si]
            }
            if (si < splt.length - 1)
            {
                si++
                continue
            }
            else
            {
                break
            }
        }
        return
    }
    if (ci < cpt.length)
    {
        return
    }
    if (ci === cpt.length && varName && si < splt.length)
    {
        rslt[varName] += ' ' + splt.slice(si).join(' ')
    }
    if (strongMatch || weakMatch)
    {
        return rslt
    }
}

addMatch = function (line, ctx)
{
    var ci, cp, cpt, d, rslt, si, splt, strongMatch, type, varName, weakMatch

    splt = _k_.trim(line).split(/\s+/)
    cpt = ctx.ptn[ctx.pind][0]
    strongMatch = false
    weakMatch = false
    varName = null
    ci = 0
    si = 0
    rslt = {}
    while (ci < cpt.length)
    {
        cp = cpt[ci]
        if (cp === splt[si])
        {
            strongMatch = true
            varName = null
            si++
            ci++
            continue
        }
        if (_k_.in((cp != null ? cp[0] : undefined),'●○'))
        {
            weakMatch = true
            varName = cp.slice(1)
            switch (cp[0])
            {
                case '●':
                    rslt[varName] = splt[si]
                    break
                case '○':
                    rslt[varName] = line.slice((splt.slice(0, typeof si === 'number' ? si : -1).join(' ').length))
                    varName = null
                    break
                    break
            }

            si++
            ci++
            continue
        }
        else if (weakMatch && varName && !_k_.empty(splt[si + 1]))
        {
            rslt[varName] += ' ' + splt[si]
            si++
            continue
        }
        else
        {
            throw new Error(`kermit failed to parse ▸${line}◂ ▪${kstr(ctx.lines)}▪`)
            ci++
            continue
        }
    }
    if (ci === cpt.length && varName && si < splt.length)
    {
        rslt[varName] += ' ' + splt.slice(si).join(' ')
    }
    if (!strongMatch)
    {
        var list = [1,-1]
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            d = list[_d_]
            if (hasStrongMatch(splt,ctx,d))
            {
                ctx.pind = wrapIndex(ctx,d)
                return addMatch(line,ctx)
            }
        }
    }
    if (strongMatch || weakMatch)
    {
        type = (strongMatch ? 'strong' : 'weak')
        ctx.matches.push({type:type,rslt:rslt,pind:ctx.pind,arr:_k_.clone(ctx.ptn[ctx.pind][1])})
        if (strongMatch || _k_.empty(ctx.ptn[ctx.pind][1]))
        {
            return ctx.pind = wrapIndex(ctx,1)
        }
    }
}

traverse = function (ctx)
{
    var line

    ctx.matches = []
    var list = _k_.list(ctx.lines)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        line = list[_e_]
        addMatch(line,ctx)
    }
    return collect(ctx)
}

collect = function (ctx)
{
    var i, k, la, lm, lo, ma, match, po, stack, v

    ctx.result = []
    lm = {pind:Infinity}
    la = []
    stack = [_k_.last(ctx.result)]
    var list = _k_.list(ctx.matches)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        match = list[_f_]
        ma = ctx.ptn[match.pind][1]
        lo = _k_.last(stack)
        if (ma.length > la.length)
        {
            lo = (lo != null ? lo : {})
            lo[_k_.last(ma)] = [{}]
            stack.push(_k_.last(lo[_k_.last(ma)]))
        }
        else if (ma.length < la.length)
        {
            for (var _10_ = i = 0, _11_ = la.length - ma.length; (_10_ <= _11_ ? i < la.length - ma.length : i > la.length - ma.length); (_10_ <= _11_ ? ++i : --i))
            {
                stack.pop()
            }
        }
        else
        {
            if (ma.length)
            {
                po = stack.slice(-2,-1)[0]
                if (po && _k_.isArr(po[_k_.last(ma)]))
                {
                    lo = po
                    stack.pop()
                    lo[_k_.last(ma)].push({})
                    stack.push(_k_.last(lo[_k_.last(ma)]))
                }
                else
                {
                    console.log(_k_.r5('cant push into lo array?'),ma,po)
                }
            }
        }
        if (match.pind <= lm.pind)
        {
            if (_k_.empty(ma))
            {
                ctx.result.push({})
                stack = [_k_.last(ctx.result)]
            }
            else if (ma.length < la.length)
            {
                po = stack.slice(-2,-1)[0]
                if (po && _k_.isArr(po[_k_.last(ma)]))
                {
                    lo = po
                    stack.pop()
                    lo[_k_.last(ma)].push({})
                    stack.push(_k_.last(lo[_k_.last(ma)]))
                }
            }
        }
        lo = _k_.last(stack)
        for (k in match.rslt)
        {
            v = match.rslt[k]
            lo[k] = v
        }
        lm = match
        la = ma
    }
    ctx.result = ctx.result.filter(function (o)
    {
        return !_k_.empty(o)
    })
    return ctx
}

pattern = function (kmt)
{
    var ars, gzo, p, parseGonzo

    p = []
    ars = []
    parseGonzo = function (gzo)
    {
        var gz, lpt

        var list = _k_.list(gzo)
        for (var _12_ = 0; _12_ < list.length; _12_++)
        {
            gz = list[_12_]
            lpt = _k_.trim(gz.line).split(/\s+/)
            if (lpt[0][0] === '■')
            {
                ars.push(lpt[0].slice(1))
                parseGonzo(gz.blck,ars)
                ars.pop()
            }
            else
            {
                p.push([lpt,_k_.clone(ars)])
            }
        }
    }
    gzo = gonzo(kmt)
    if (_k_.empty(gzo))
    {
        return p
    }
    parseGonzo(gzo)
    return p
}

kermit = function (kmt, str)
{
    var ctx, lines

    lines = str.split('\n')
    lines = lines.filter(function (l)
    {
        return !_k_.empty(_k_.trim(l))
    })
    ctx = traverse({lines:lines,pind:0,ptn:pattern(kmt)})
    return ctx.result
}
kermit.pattern = pattern
kermit.lineMatch = lineMatch
export default kermit;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VybWl0LmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9rZXJtaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFVQTs7WUFBNkIsSUFBSSxPQUFLLFVBQVUsSUFBSSxJQUFJOzs7QUFFeEQ7O1dBQW1DLEtBQUssT0FBTSxJQUFJLElBQUksVUFBVSxJQUFJLElBQUksR0FBRzs7O0FBUTNFOzs7O0lBRUk7d0JBRVk7Ozs7UUFDUixNQUFNLEtBQUssTUFBTTs2QkFDRDs7OztZQUNaLFNBQVMsS0FBSztnQkFDVyxRQUFRLElBQUksU0FBTzs7Z0JBQTVDLFNBQVMsS0FBSzs7OztXQUV0Qjs7O0FBRUo7Ozs7SUFFSSxlQUFXO2tCQUNDOzs7O0lBRVosT0FBTyxJQUFJLE1BQU07SUFDakIsZUFBWSxJQUFJLE1BQU07d0JBRVo7Ozs7UUFDTixPQUFPLFdBQVcsS0FBTTtRQUN4QixNQUFPLFdBQVcsSUFBSzs7a0JBSWY7Ozs7SUFFWixjQUFjO0lBQ2QsWUFBWTtJQUNaLFVBQVU7SUFFVixLQUFLO0lBQ0wsS0FBSztJQUNMO1dBRU0sS0FBSyxJQUFJOztRQUVYLEtBQUssSUFBSTtZQUVOLE9BQU0sS0FBSzs7WUFFVixjQUFjO1lBQ2QsVUFBVTtZQUNWO1lBQ0E7WUFDQTs7b0JBRUQsYUFBQSxHQUFJLGdCQUFNOztZQUNULFlBQVk7WUFFWixVQUFVLFNBQUc7b0JBQ04sR0FBRzs7cUJBQ047b0JBQ0ksS0FBSyxXQUFXLEtBQUs7b0JBQ3JCO29CQUNBO29CQUNBOztxQkFDSjt3QkFDTyxPQUFNLElBQUksU0FBTzs7d0JBQ2hCLEtBQUssV0FBVyxXQUFLLElBQU0sS0FBSzsrQkFDN0I7Ozs7NEJBRUEsSUFBSSxLQUFHLE9BQU0sS0FBSzs7NEJBQ2pCLFlBQVk7NEJBQ1osTUFBTTs0QkFDTjs7Ozs7OztZQUVqQixhQUFjOzsyQkFDSixLQUFLOztnQkFDVixLQUFLLFlBQVksTUFBTSxLQUFLOzs7O2dCQUU1QixLQUFLLFdBQVcsS0FBSzs7Z0JBQ3RCLEtBQUssS0FB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
//# sourceURL=file://kode/kxk/kermit.kode
