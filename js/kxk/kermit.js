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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VybWl0LmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9rZXJtaXQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFVQSxzQkFBYSxLQUFJOztZQUFZLElBQUksT0FBSyxVQUFVLElBQUksSUFBSTs7O0FBRXhELDJCQUFrQixNQUFNLEtBQUs7O1dBQU0sS0FBSyxPQUFNLElBQUksSUFBSSxVQUFVLElBQUksSUFBSSxHQUFHOzs7QUFRM0UsdUJBQWMsT0FBTzs7OztJQUVqQjt3QkFFWTs7O1FBQVI7UUFDQSxNQUFNLEtBQUssTUFBTTs2QkFDRDs7O1lBQVo7WUFDQSxTQUFTLEtBQUs7Z0JBQ1csUUFBUSxJQUFJLFNBQU87O2dCQUE1QyxTQUFTLEtBQUs7Ozs7V0FFdEI7OztBQUVKLHNCQUFhLE1BQU0sSUFBSTs7OztJQUVuQixlQUFXO2tCQUNDOzs7O0lBRVosT0FBTyxJQUFJLE1BQU07SUFDakIsZUFBWSxJQUFJLE1BQU07d0JBRVo7OztRQUFOO1FBQ0EsT0FBTyxXQUFXLEtBQU07UUFDeEIsTUFBTyxXQUFXLElBQUs7O2tCQUlmOzs7O0lBRVosY0FBYztJQUNkLFlBQVk7SUFDWixVQUFVO0lBRVYsS0FBSztJQUNMLEtBQUs7SUFDTDtXQUVNLEtBQUssSUFBSTs7UUFFWCxLQUFLLElBQUk7WUFFTixPQUFNLEtBQUs7O1lBRVYsY0FBYztZQUNkLFVBQVU7WUFDVjtZQUNBO1lBQ0E7O29CQUVELGFBQUEsR0FBSSxnQkFBTTs7WUFDVCxZQUFZO1lBRVosVUFBVSxTQUFHO29CQUNOLEdBQUc7O3FCQUNOO29CQUNJLEtBQUssV0FBVyxLQUFLO29CQUNyQjtvQkFDQTtvQkFDQTs7cUJBQ0o7d0JBQ08sT0FBTSxJQUFJLFNBQU87O3dCQUNoQixLQUFLLFdBQVcsV0FBSyxJQUFNLEtBQUs7K0JBQzdCOzs7OzRCQUVBLElBQUksS0FBRyxPQUFNLEtBQUs7OzRCQUNqQixZQUFZOzRCQUNaLE1BQU07NEJBQ047Ozs7Ozs7WUFFakIsYUFBYzs7MkJBQ0osS0FBSzs7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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kermit.kode
