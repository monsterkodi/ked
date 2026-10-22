var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}}

var pepe


pepe = function (str, opt)
{
    var advance, cnt, contentPush, delimiters, end, ends, index, isGreedy, lp, next, op, p, pairs, popped, r, stack, start, starts, _42_22_, _43_32_

    if (!(_k_.isStr(str)))
    {
        return []
    }
    if (_k_.empty(str))
    {
        return ['']
    }
    opt = (opt != null ? opt : {})
    index = ((_42_22_=opt.index) != null ? _42_22_ : false)
    delimiters = ((_43_32_=opt.delimiters) != null ? _43_32_ : [['"','"'],["'","'"],['(',')'],['[',']'],['{','}']])
    starts = delimiters.map(function (d)
    {
        return d[0]
    })
    ends = delimiters.map(function (d)
    {
        return d[1]
    })
    pairs = {}
    delimiters.map(function (d)
    {
        return pairs[d[0]] = d[1]
    })
    stack = [{content:[]}]
    p = lp = 0
    isGreedy = function ()
    {
        return _k_.last(stack).start && pairs[_k_.last(stack).start] === _k_.last(stack).start
    }
    contentPush = function ()
    {
        if (lp !== p)
        {
            return _k_.last(stack).content.push(str.slice(lp, typeof p === 'number' ? p : -1))
        }
    }
    advance = function ()
    {
        return lp = p += start.length
    }
    while (p < str.length)
    {
        next = str.slice(p)
        op = p
        var list = _k_.list(starts)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            start = list[_a_]
            if (next.startsWith(start))
            {
                if (start === pairs[_k_.last(stack).start])
                {
                    break
                }
                if (isGreedy())
                {
                    break
                }
                contentPush()
                stack.push({start:start,content:[]})
                if (index)
                {
                    _k_.last(stack).rng = [p]
                }
                advance(start.length)
                break
            }
        }
        if (p === op)
        {
            if (isGreedy() && !next.startsWith(pairs[_k_.last(stack).start]))
            {
                contentPush()
                cnt = _k_.last(stack).content.pop() || ''
                _k_.last(stack).content.push(cnt + next[0])
                advance(1)
            }
            else
            {
                var list1 = _k_.list(ends)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    end = list1[_b_]
                    if (next.startsWith(end))
                    {
                        if (end === pairs[_k_.last(stack).start])
                        {
                            contentPush()
                            if (index)
                            {
                                _k_.last(stack).rng.push(p)
                            }
                            _k_.last(stack).end = end
                            popped = stack.pop()
                            _k_.last(stack).content.push(popped)
                            advance(end.length)
                        }
                        else
                        {
                            contentPush()
                            return {mismatch:stack,tail:str.slice(p, typeof str.length === 'number' ? str.length : -1)}
                        }
                        break
                    }
                }
            }
        }
        if (p === op)
        {
            p += 1
        }
    }
    if (stack.length > 1)
    {
        r = {unbalanced:stack}
        if (lp !== p)
        {
            r.tail = str.slice(lp, typeof p === 'number' ? p : -1)
        }
        return r
    }
    contentPush()
    return _k_.last(stack).content
}

pepe.depepe = function (pep, cb)
{
    var p, r

    r = ''
    var list = _k_.list(pep)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        p = list[_c_]
        if (_k_.isStr(p))
        {
            r += p
        }
        else
        {
            r += p.start
            r += cb(pepe.depepe(p.content,cb))
            r += p.end
        }
    }
    return r
}

pepe.flatten = function (pep)
{
    var f, p

    f = []
    if (!(_k_.isArr(f)))
    {
        return f
    }
    var list = _k_.list(pep)
    for (var _d_ = 0; _d_ < list.length; _d_++)
    {
        p = list[_d_]
        if (!(_k_.isStr(p)))
        {
            f.push({start:p.start,rng:p.rng,end:p.end})
            if (!_k_.empty(p.content))
            {
                f = f.concat(pepe.flatten(p.content))
            }
        }
    }
    return f
}

pepe.pairs = function (s)
{
    return pepe.flatten(pepe(s,{index:true}))
}

pepe.pairsAtCol = function (s, col)
{
    return pepe.pairs(s).filter(function (p)
    {
        return p.rng[0] <= col && p.rng[1] >= col
    })
}
export default pepe;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVwZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvcGVwZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQW1DQSxpQkFBTyxLQUFJOzs7O29CQUVROzs7O2tCQUNFOztnQkFBYjs7SUFFSixPQUFBLGNBQUE7SUFDQSxrQkFBUSxJQUFJLDJCQUFRO0lBQ3BCLHVCQUFhLElBQUksa0NBQWUsSUFBRyxNQUFNLElBQUcsTUFBTSxJQUFHLE1BQU0sSUFBRyxNQUFNLElBQUc7SUFFdkUsU0FBUyxXQUFXLGNBQUs7O2VBQU0sRUFBRTs7SUFDakMsT0FBUyxXQUFXLGNBQUs7O2VBQU0sRUFBRTs7SUFFakM7SUFDQSxXQUFXLGNBQUs7O2VBQU0sTUFBTSxFQUFFLE1BQU0sRUFBRTs7SUFFdEMsVUFBVTtJQUNWLElBQUksS0FBSztJQUVUOzt3QkFBc0IsT0FBTyxTQUFVLGVBQVcsT0FBTyxvQkFBZSxPQUFPOztJQUMvRTs7WUFBeUQsT0FBTTs7NEJBQXpDLE9BQU8sUUFBUSxLQUFLLFVBQUksV0FBSyxpQkFBQTs7O0lBQ25EOztlQUFpQixLQUFLLEtBQUssTUFBTTs7V0FFM0IsSUFBSSxJQUFJOztRQUVWLE9BQU8sVUFBSTtRQUNYLEtBQUs7NEJBRVE7OztZQUFUO2dCQUNHLEtBQUssV0FBVzs7b0JBQ04sVUFBUyxlQUFXLE9BQU87O29CQUFwQzs7b0JBQ1M7O29CQUFUOztnQkFDQTtnQkFDQSxNQUFNLE1BQUssTUFBTSxNQUFNO29CQUNFOzs2QkFBcEIsT0FBTyxPQUFPOztnQkFDbkIsUUFBUSxNQUFNO2dCQUNkOzs7WUFFTCxNQUFLOztnQkFFRCxlQUFtQixLQUFLLFdBQVcsZUFBVyxPQUFPOztnQkFDcEQ7Z0JBQ0EsZUFBVyxPQUFPLFFBQVEsU0FBUzt5QkFDOUIsT0FBTyxRQUFRLEtBQUssTUFBTSxLQUFLO2dCQUNwQyxRQUFROzs7O3FDQUdHOzs7b0JBQVA7d0JBQ0csS0FBSyxXQUFXOzs0QkFDWixRQUFPLGVBQVcsT0FBTzs7NEJBQ3hCO2dDQUMwQjs7eUNBQXJCLE9BQU8sSUFBSSxLQUFLOztxQ0FDaEIsT0FBTyxNQUFNOzRCQUNsQixTQUFTLE1BQU07cUNBQ1YsT0FBTyxRQUFRLEtBQUs7NEJBQ3pCLFFBQVEsSUFBSTs7Ozs0QkFFWjtvQ0FDRyxTQUFTLE1BQU0sS0FBSyxVQUFJLFVBQUksSUFBSSxzQkFBSixJQUFJOzt3QkFDdkM7Ozs7O1lBRWIsTUFBSzs7WUFDSixLQUFLOzs7UUFFVixNQUFNLFNBQVM7O1FBQ2QsS0FBSSxXQUFXO1lBQ1MsT0FBTTs7WUFBOUIsRUFBRSxPQUFPLFVBQUksV0FBSyxpQkFBQTs7ZUFDaEI7O0lBRU47b0JBQ0ssT0FBTzs7O0FBYWhCLEtBQUssbUJBQVMsS0FBSTs7OztJQUVkLElBQUk7d0JBRUs7OztRQUFMO3NCQUNHOztZQUNDLEtBQUs7Ozs7WUFFTCxLQUFLLEVBQUU7WUFDUCxLQUFLLEdBQUcsS0FBSyxPQUFPLEVBQUUsUUFBUztZQUMvQixLQUFLLEVBQUU7OztXQUNmOzs7QUFxQkosS0FBSyxvQkFBVTs7OztJQUVYO29CQUNZOztlQUFUOzt3QkFDTTs7O1FBQUw7d0JBQ087O1lBQ0gsRUFBRSxNQUFLLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTsyQkFDNUIsRUFBRTs7Z0JBQ1AsSUFBSSxFQUFFLE9BQU8sS0FBSyxRQUFRLEVBQUU7Ozs7V0FDeEM7OztBQVFKLEtBQUssa0JBQVE7O1dBQUssS0FBSyxRQUFRLEtBQUssR0FBRSxNQUFNOzs7QUFRNUMsS0FBSyx1QkFBYSxHQUFFOztXQUVoQixLQUFLLE1BQU0sR0FBRyxpQkFBUTs7ZUFBTSxFQUFFLElBQUksTUFBTSxPQUFRLEVBQUUsSUFBSSxNQUFNOzs7ZUFFekQifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/pepe.kode
