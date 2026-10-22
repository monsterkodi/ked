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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVwZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvcGVwZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQW1DQSxpQkFBTyxLQUFJOzs7O1VBRWUsVUFBUDs7OztrQkFDRTs7Z0JBQWI7O0lBRUosT0FBQSxjQUFBO0lBQ0Esa0JBQVEsSUFBSSwyQkFBUTtJQUNwQix1QkFBYSxJQUFJLGtDQUFlLElBQUcsTUFBTSxJQUFHLE1BQU0sSUFBRyxNQUFNLElBQUcsTUFBTSxJQUFHO0lBRXZFLFNBQVMsV0FBVyxjQUFLOztlQUFNLEVBQUU7O0lBQ2pDLE9BQVMsV0FBVyxjQUFLOztlQUFNLEVBQUU7O0lBRWpDO0lBQ0EsV0FBVyxjQUFLOztlQUFNLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0lBRXRDLFVBQVU7SUFDVixJQUFJLEtBQUs7SUFFVDs7d0JBQXNCLE9BQU8sU0FBVSxlQUFXLE9BQU8sb0JBQWUsT0FBTzs7SUFDL0U7O1lBQXlELE9BQU07OzRCQUF6QyxPQUFPLFFBQVEsS0FBSyxVQUFJLFdBQUssaUJBQUE7OztJQUNuRDs7ZUFBaUIsS0FBSyxLQUFLLE1BQU07O1dBRTNCLElBQUksSUFBSTs7UUFFVixPQUFPLFVBQUk7UUFDWCxLQUFLOzRCQUVROzs7WUFBVDtnQkFDRyxLQUFLLFdBQVc7O29CQUNOLFVBQVMsZUFBVyxPQUFPOztvQkFBcEM7O29CQUNTOztvQkFBVDs7Z0JBQ0E7Z0JBQ0EsTUFBTSxNQUFLLE1BQU0sTUFBTTtvQkFDRTs7NkJBQXBCLE9BQU8sT0FBTzs7Z0JBQ25CLFFBQVEsTUFBTTtnQkFDZDs7O1lBRUwsTUFBSzs7Z0JBRUQsZUFBbUIsS0FBSyxXQUFXLGVBQVcsT0FBTzs7Z0JBQ3BEO2dCQUNBLGVBQVcsT0FBTyxRQUFRLFNBQVM7eUJBQzlCLE9BQU8sUUFBUSxLQUFLLE1BQU0sS0FBSztnQkFDcEMsUUFBUTs7OztxQ0FHRzs7O29CQUFQO3dCQUNHLEtBQUssV0FBVzs7NEJBQ1osUUFBTyxlQUFXLE9BQU87OzRCQUN4QjtnQ0FDMEI7O3lDQUFyQixPQUFPLElBQUksS0FBSzs7cUNBQ2hCLE9BQU8sTUFBTTs0QkFDbEIsU0FBUyxNQUFNO3FDQUNWLE9BQU8sUUFBUSxLQUFLOzRCQUN6QixRQUFRLElBQUk7Ozs7NEJBRVo7b0NBQ0csU0FBUyxNQUFNLEtBQUssVUFBSSxVQUFJLElBQUksc0JBQUosSUFBSTs7d0JBQ3ZDOzs7OztZQUViLE1BQUs7O1lBQ0osS0FBSzs7O1FBRVYsTUFBTSxTQUFTOztRQUNkLEtBQUksV0FBVztZQUNTLE9BQU07O1lBQTlCLEVBQUUsT0FBTyxVQUFJLFdBQUssaUJBQUE7O2VBQ2hCOztJQUVOO29CQUNLLE9BQU87OztBQWFoQixLQUFLLG1CQUFTLEtBQUk7Ozs7SUFFZCxJQUFJO3dCQUVLOzs7UUFBTDtZQUNRLFVBQUw7O1lBQ0MsS0FBSzs7OztZQUVMLEtBQUssRUFBRTtZQUNQLEtBQUssR0FBRyxLQUFLLE9BQU8sRUFBRSxRQUFTO1lBQy9CLEtBQUssRUFBRTs7O1dBQ2Y7OztBQXFCSixLQUFLLG9CQUFVOzs7O0lBRVg7VUFDaUIsVUFBTDs7ZUFBVDs7d0JBQ007OztRQUFMO2NBQ1ksVUFBTDs7WUFDSCxFQUFFLE1BQUssTUFBTSxFQUFFLE1BQU0sSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFOzJCQUM1QixFQUFFOztnQkFDUCxJQUFJLEVBQUUsT0FBTyxLQUFLLFFBQVEsRUFBRTs7OztXQUN4Qzs7O0FBUUosS0FBSyxrQkFBUTs7V0FBSyxLQUFLLFFBQVEsS0FBSyxHQUFFLE1BQU07OztBQVE1QyxLQUFLLHVCQUFhLEdBQUU7O1dBRWhCLEtBQUssTUFBTSxHQUFHLGlCQUFROztlQUFNLEVBQUUsSUFBSSxNQUFNLE9BQVEsRUFBRSxJQUFJLE1BQU07OztlQUV6RCJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/pepe.kode
