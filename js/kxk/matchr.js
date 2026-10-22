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
    var arg, gi, gs, i, j, match, r, reg, rgs, s, value, _68_35_

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
    for (var _b_ = r = 0, _c_ = regexes.length; (_b_ <= _c_ ? r < regexes.length : r > regexes.length); (_b_ <= _c_ ? ++r : --r))
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
                for (var _d_ = j = 0, _e_ = match.length - 2; (_d_ <= _e_ ? j <= match.length - 2 : j >= match.length - 2); (_d_ <= _e_ ? ++j : --j))
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
    var c, d, di, dps, i, p, pn, r, rg, ri, si, _169_22_, _170_36_, _172_48_

    if (!ranges.length)
    {
        return []
    }
    di = []
    var list = _k_.list(ranges)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        rg = list[_f_]
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
    for (var _10_ = 0; _10_ < list1.length; _10_++)
    {
        dps = list1[_10_]
        if (dps[0] > si)
        {
            si = dps[0]
            d.push({start:si,cls:[]})
        }
    }
    p = 0
    for (var _11_ = ri = 0, _12_ = ranges.length; (_11_ <= _12_ ? ri < ranges.length : ri > ranges.length); (_11_ <= _12_ ? ++ri : --ri))
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
                    for (var _13_ = 0; _13_ < list2.length; _13_++)
                    {
                        r = list2[_13_]
                        if (!((r != null ? r.split : undefined) != null))
                        {
                            continue
                        }
                        var list3 = _k_.list(r.split('.'))
                        for (var _14_ = 0; _14_ < list3.length; _14_++)
                        {
                            c = list3[_14_]
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
                    for (var _15_ = 0; _15_ < list4.length; _15_++)
                    {
                        c = list4[_15_]
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
        var _187_31_

        return (i.match != null ? i.match.trim().length : undefined)
    })
    var list5 = _k_.list(d)
    for (var _16_ = 0; _16_ < list5.length; _16_++)
    {
        i = list5[_16_]
        i.clss = i.cls.join(' ')
        delete i.cls
    }
    if (d.length > 1)
    {
        for (var _17_ = i = d.length - 2, _18_ = 0; (_17_ <= _18_ ? i <= 0 : i >= 0); (_17_ <= _18_ ? ++i : --i))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9tYXRjaHIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFnQkEsbUJBQVUsVUFBVTs7Ozt1REFBaUQscUJBQUEsMkJBQWhDLE9BQU8sRUFBRyxPQUFROzs7QUFFdkQsdUJBQWM7O1dBRVYsSUFBSSxlQUFNLEdBQUU7O1lBQ0wsRUFBRSxVQUFTLEVBQUU7O21CQUNaLEVBQUUsUUFBUSxFQUFFOzs7O21CQUVaLEVBQUUsUUFBUSxFQUFFOzs7OztBQTBCeEIsbUJBQVMsU0FBUSxNQUFLOzs7O1VBRVgsbUJBQVc7O3NCQUNYOztZQUNDLGdCQUFnQixPQUFPLFFBQVMsT0FBUTs7OztZQUV4QyxZQUFZLFFBQVM7Ozt5QkFDZixlQUFpQixRQUFRLGNBQU07O1FBQ3pDLFdBQVc7O0lBRWY7VUFDa0IsMkJBQWU7O2VBQTFCOzttQkFFSCxJQUFNLFNBQUksUUFBUSwwQkFBUixRQUFRLGFBQVIsUUFBUTs7UUFFbEIsTUFBTSxRQUFRLEdBQUc7Y0FFVixrQkFBWSxJQUFJOztZQUNuQixjQUFNLFVBQVcsUUFBUyxLQUFNO21CQUN6Qjs7UUFFWCxNQUFNLFFBQVEsR0FBRztRQUNqQixJQUFJO1FBQ0osSUFBSTtlQUVFLEVBQUU7O1lBRUosUUFBUSxJQUFJLEtBQUs7a0JBRUo7O2dCQUFiOztnQkFFRyxNQUFNLFdBQVU7O29CQUVaLE1BQU0sR0FBRyxTQUFTOztvQkFDakIsSUFBSSxNQUNBLE1BQU8sTUFBTSxRQUFRLEVBQ3JCLE1BQU8sTUFBTSxHQUNiLE9BQVEsTUFBTSxHQUFHLE9BQ2pCLEtBQU8sSUFDUCxNQUFPOztnQkFFZixLQUFLLE1BQU0sUUFBUSxLQUFLLElBQUksRUFBRyxNQUFNLEdBQUc7Z0JBQ3hDLElBQUksS0FBSyxNQUFNOzs7O2dCQUlmLEtBQUs7K0JBRUQsSUFBTSxTQUFHLE1BQU0sU0FBTyxzQkFBYixNQUFNLFNBQU8sU0FBYixNQUFNLFNBQU87O29CQUN0QixRQUFRO3dCQUNMLGlCQUFTLFNB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/matchr.kode
