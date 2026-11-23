var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var config, dissect, merge, ranges, sortRanges


config = function (patterns, flags)
{
    var a, p

    return (function () { var r_a_ = []; for (var p in patterns)  { var a = patterns[p];r_a_.push([new RegExp(p,flags),a])  } return r_a_ }).bind(this)()
}

sortRanges = function (rgs)
{
    return rgs.sort(function (a, b)
    {
        if (a.start === b.start)
        {
            return a.index - b.index
        }
        else
        {
            return a.start - b.start
        }
    })
}

ranges = function (regexes, text, flags)
{
    var arg, gi, gs, i, j, match, r, reg, rgs, s, value, _49_35_

    if (!(regexes instanceof Array))
    {
        if (_k_.isStr(regexes))
        {
            regexes = [[new RegExp(regexes,flags),'found']]
        }
        else
        {
            regexes = [[regexes,'found']]
        }
    }
    else if (!_k_.empty((regexes)) && !(regexes[0] instanceof Array))
    {
        regexes = [regexes]
    }
    rgs = []
    if (!(text != null) || _k_.empty(regexes))
    {
        return rgs
    }
    for (r = 0; r < regexes.length; r++)
    {
        reg = regexes[r][0]
        if (!(reg != null) || !(reg.exec != null))
        {
            console.error('no reg?',regexes,text,flags)
            return rgs
        }
        arg = regexes[r][1]
        i = 0
        s = text
        while (s.length)
        {
            match = reg.exec(s)
            if (!(match != null))
            {
                break
            }
            if (match.length === 1)
            {
                if (match[0].length > 0)
                {
                    rgs.push({start:match.index + i,match:match[0],length:match[0].length,clss:arg,index:r})
                }
                i += match.index + Math.max(1,match[0].length)
                s = text.slice(i)
            }
            else
            {
                gs = 0
                for (j = 0; j <= match.length - 2; j++)
                {
                    value = arg
                    if (value instanceof Array && j < value.length)
                    {
                        value = value[j]
                    }
                    else if (_k_.isObj(value) && j < Object.keys(value).length)
                    {
                        value = [Object.keys(value)[j],value[Object.keys(value)[j]]]
                    }
                    if (!(match[j + 1] != null))
                    {
                        break
                    }
                    gi = match[0].slice(gs).indexOf(match[j + 1])
                    rgs.push({start:match.index + i + gs + gi,match:match[j + 1],length:match[j + 1].length,clss:value,index:r})
                    gs += match[j + 1].length
                }
                i += match.index + match[0].length
                s = text.slice(i)
            }
        }
    }
    return sortRanges(rgs)
}

dissect = function (ranges, opt = {join:false})
{
    var c, d, di, dps, i, p, pn, r, rg, ri, si, _144_22_, _145_36_, _147_48_

    if (!ranges.length)
    {
        return []
    }
    di = []
    var list = _k_.list(ranges)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        rg = list[_b_]
        di.push([rg.start,rg.index])
        di.push([rg.start + rg.match.length,rg.index])
    }
    di.sort(function (a, b)
    {
        if (a[0] === b[0])
        {
            return a[1] - b[1]
        }
        else
        {
            return a[0] - b[0]
        }
    })
    d = []
    si = -1
    var list1 = _k_.list(di)
    for (var _c_ = 0; _c_ < list1.length; _c_++)
    {
        dps = list1[_c_]
        if (dps[0] > si)
        {
            si = dps[0]
            d.push({start:si,cls:[]})
        }
    }
    p = 0
    for (ri = 0; ri < ranges.length; ri++)
    {
        rg = ranges[ri]
        while (d[p].start < rg.start)
        {
            p += 1
        }
        pn = p
        while (d[pn].start < rg.start + rg.match.length)
        {
            if ((rg.clss != null))
            {
                if (!(rg.clss.split != null))
                {
                    var list2 = _k_.list(rg.clss)
                    for (var _d_ = 0; _d_ < list2.length; _d_++)
                    {
                        r = list2[_d_]
                        if (!((r != null ? r.split : undefined) != null))
                        {
                            continue
                        }
                        var list3 = _k_.list(r.split('.'))
                        for (var _e_ = 0; _e_ < list3.length; _e_++)
                        {
                            c = list3[_e_]
                            if (d[pn].cls.indexOf(c) < 0)
                            {
                                d[pn].cls.push(c)
                            }
                        }
                    }
                }
                else
                {
                    var list4 = _k_.list(rg.clss.split('.'))
                    for (var _f_ = 0; _f_ < list4.length; _f_++)
                    {
                        c = list4[_f_]
                        if (d[pn].cls.indexOf(c) < 0)
                        {
                            d[pn].cls.push(c)
                        }
                    }
                }
            }
            if (pn + 1 < d.length)
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start,d[pn + 1].start - d[pn].start)
                }
                pn += 1
            }
            else
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start)
                }
                break
            }
        }
    }
    d = d.filter(function (i)
    {
        var _162_31_

        return (i.match != null ? i.match.trim().length : undefined)
    })
    var list5 = _k_.list(d)
    for (var _10_ = 0; _10_ < list5.length; _10_++)
    {
        i = list5[_10_]
        i.clss = i.cls.join(' ')
        delete i.cls
    }
    if (d.length > 1)
    {
        for (i = d.length - 2; i >= 0; i--)
        {
            if (d[i].start + d[i].match.length === d[i + 1].start)
            {
                if (d[i].clss === d[i + 1].clss)
                {
                    d[i].match += d[i + 1].match
                    d.splice(i + 1,1)
                }
            }
        }
    }
    return d
}

merge = function (dssA, dssB)
{
    var A, B, d, result

    result = []
    A = dssA.shift()
    B = dssB.shift()
    while (A && B)
    {
        if (A.start + A.match.length < B.start)
        {
            result.push(A)
            A = dssA.shift()
            continue
        }
        if (B.start + B.match.length < A.start)
        {
            result.push(B)
            B = dssB.shift()
            continue
        }
        if (A.start < B.start)
        {
            d = B.start - A.start
            result.push({start:A.start,clss:A.clss,match:A.match.slice(0,d)})
            A.start += d
            A.match = A.match.slice(d)
            continue
        }
        if (B.start < A.start)
        {
            d = A.start - B.start
            result.push({start:B.start,clss:B.clss,match:B.match.slice(0,d)})
            B.start += d
            B.match = B.match.slice(d)
            continue
        }
        if (A.start === B.start)
        {
            d = A.match.length - B.match.length
            result.push({start:A.start,clss:A.clss + " " + B.clss,match:d >= 0 && B.match || A.match})
            if (d > 0)
            {
                A.match = A.match.slice(B.match.length)
                A.start += B.match.length
                B = dssB.shift()
            }
            else if (d < 0)
            {
                B.match = B.match.slice(A.match.length)
                B.start += A.match.length
                A = dssA.shift()
            }
            else
            {
                A = dssA.shift()
                B = dssB.shift()
            }
        }
    }
    if (B && !A)
    {
        result = result.concat([B],dssB)
    }
    if (A && !B)
    {
        result = result.concat([A],dssA)
    }
    return result
}
export default {
    config:config,
    ranges:ranges,
    dissect:dissect,
    sortRanges:sortRanges,
    merge:merge
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9tYXRjaHIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxtQkFBVSxVQUFVOzs7O2tEQUEwQyxLQUFPLGlCQUFMLElBQUssMkJBQWhDLE9BQU8sRUFBRyxPQUFROzs7QUFFdkQsdUJBQWM7O1dBRVYsSUFBSSxlQUFNLEdBQUU7O1lBQ0wsRUFBRSxVQUFTLEVBQUU7O21CQUNaLEVBQUUsUUFBUSxFQUFFOzs7O21CQUVaLEVBQUUsUUFBUSxFQUFFOzs7OztBQW9CeEIsbUJBQVMsU0FBUSxNQUFLOzs7O1VBRVgsbUJBQVc7O1lBQ0EsVUFBWDs7WUFDQyxnQkFBZ0IsT0FBTyxRQUFTLE9BQVE7Ozs7WUFFeEMsWUFBWSxRQUFTOzs7eUJBQ2YsZUFBaUIsUUFBUSxjQUFNOztRQUN6QyxXQUFXOztJQUVmO1VBQ2tCLDJCQUFlOztlQUExQjs7U0FFSCxJQUFNLE9BQUksUUFBUTs7UUFFbEIsTUFBTSxRQUFRLEdBQUc7Y0FFVixrQkFBWSxJQUFJOztZQUNuQixjQUFNLFVBQVcsUUFBUyxLQUFNO21CQUN6Qjs7UUFFWCxNQUFNLFFBQVEsR0FBRztRQUNqQixJQUFJO1FBQ0osSUFBSTtlQUVFLEVBQUU7O1lBRUosUUFBUSxJQUFJLEtBQUs7a0JBRUo7O2dCQUFiOztnQkFFRyxNQUFNLFdBQVU7O29CQUVaLE1BQU0sR0FBRyxTQUFTOztvQkFDakIsSUFBSSxNQUNBLE1BQU8sTUFBTSxRQUFRLEVBQ3JCLE1BQU8sTUFBTSxHQUNiLE9BQVEsTUFBTSxHQUFHLE9BQ2pCLEtBQU8sSUFDUCxNQUFPOztnQkFFZixLQUFLLE1BQU0sUUFBUSxLQUFLLElBQUksRUFBRyxNQUFNLEdBQUc7Z0JBQ3hDLElBQUksS0FBSyxNQUFNOzs7O2dCQUlmLEtBQUs7cUJBRUQsSUFBTSxRQUFHLE1BQU0sU0FBTzs7b0JBQ3RCLFFBQVE7d0JBQ0wsaUJBQVMsU0FBVSxJQUFJLE1BQU07O3dCQUFZLFFBQVEsTUFBTTs7NkJBQ3pDLFVB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
//# sourceURL=../../kode/kxk/matchr.kode
