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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VybWl0LmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9rZXJtaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFNLFdBQUE7T0FBSyxZQUFBOzs7QUFFWCxzQkFBYSxLQUFJOztZQUFZLElBQUksT0FBSyxVQUFVLElBQUksSUFBSTs7O0FBRXhELDJCQUFrQixNQUFNLEtBQUs7O1dBQU0sS0FBSyxPQUFNLElBQUksSUFBSSxVQUFVLElBQUksSUFBSSxHQUFHOzs7QUFRM0UsdUJBQWMsT0FBTzs7OztJQUVqQjt3QkFFWTs7O1FBQVI7UUFDQSxNQUFNLEtBQUssTUFBTTs2QkFDRDthQUFUOztZQUFIO1lBQ0EsU0FBUyxLQUFLO2dCQUNXLFFBQVEsSUFBSSxTQUFPOztnQkFBNUMsU0FBUyxLQUFLOzs7O1dBRXRCOzs7QUFFSixzQkFBYSxNQUFNLElBQUk7Ozs7SUFFbkIsZUFBVztrQkFDQzs7OztJQUVaLE9BQU8sSUFBSSxNQUFNO0lBQ2pCLGVBQVksSUFBSSxNQUFNO3dCQUVaOzs7UUFBTjtRQUNBLE9BQU8sV0FBVyxLQUFNO1FBQ3hCLE1BQU8sV0FBVyxJQUFLOztrQkFJZjs7OztJQUVaLGNBQWM7SUFDZCxZQUFZO0lBQ1osVUFBVTtJQUVWLEtBQUs7SUFDTCxLQUFLO0lBQ0w7V0FFTSxLQUFLLElBQUk7O1FBRVgsS0FBSyxJQUFJO1lBRU4sT0FBTSxLQUFLOztZQUVWLGNBQWM7WUFDZCxVQUFVO1lBQ1Y7WUFDQTtZQUNBOztvQkFFRCxhQUFBLEdBQUksZ0JBQU07O1lBQ1QsWUFBWTtZQUVaLFVBQVUsU0FBRztvQkFDTixHQUFHOztxQkFDTjtvQkFDSSxLQUFLLFdBQVcsS0FBSztvQkFDckI7b0JBQ0E7b0JBQ0E7O3FCQUNKO3dCQUNPLE9BQU0sSUFBSSxTQUFPOzt3QkFDaEIsS0FBSyxXQUFXLFdBQUssSUFBTSxLQUFLOytCQUM3Qjs7Ozs0QkFFQSxJQUFJLEtBQUcsT0FBTSxLQUFLOzs0QkFDakIsWUFBWTs0QkFDWixNQUFNOzRCQUNOOzs7Ozs7O1lB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kermit.kode
