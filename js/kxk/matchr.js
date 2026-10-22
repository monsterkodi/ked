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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9tYXRjaHIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFnQkEsbUJBQVUsVUFBVTs7OztrREFBMEMsS0FBTyxpQkFBTCxJQUFLLDJCQUFoQyxPQUFPLEVBQUcsT0FBUTs7O0FBRXZELHVCQUFjOztXQUVWLElBQUksZUFBTSxHQUFFOztZQUNMLEVBQUUsVUFBUyxFQUFFOzttQkFDWixFQUFFLFFBQVEsRUFBRTs7OzttQkFFWixFQUFFLFFBQVEsRUFBRTs7Ozs7QUEwQnhCLG1CQUFTLFNBQVEsTUFBSzs7OztVQUVYLG1CQUFXOztZQUNBLFVBQVg7O1lBQ0MsZ0JBQWdCLE9BQU8sUUFBUyxPQUFROzs7O1lBRXhDLFlBQVksUUFBUzs7O3lCQUNmLGVBQWlCLFFBQVEsY0FBTTs7UUFDekMsV0FBVzs7SUFFZjtVQUNrQiwyQkFBZTs7ZUFBMUI7O21CQUVILElBQU0sU0FBSSxRQUFRLDBCQUFSLFFBQVEsYUFBUixRQUFROztRQUVsQixNQUFNLFFBQVEsR0FBRztjQUVWLGtCQUFZLElBQUk7O1lBQ25CLGNBQU0sVUFBVyxRQUFTLEtBQU07bUJBQ3pCOztRQUVYLE1BQU0sUUFBUSxHQUFHO1FBQ2pCLElBQUk7UUFDSixJQUFJO2VBRUUsRUFBRTs7WUFFSixRQUFRLElBQUksS0FBSztrQkFFSjs7Z0JBQWI7O2dCQUVHLE1BQU0sV0FBVTs7b0JBRVosTUFBTSxHQUFHLFNBQVM7O29CQUNqQixJQUFJLE1BQ0EsTUFBTyxNQUFNLFFBQVEsRUFDckIsTUFBTyxNQUFNLEdBQ2IsT0FBUSxNQUFNLEdBQUcsT0FDakIsS0FBTyxJQUNQLE1BQU87O2dCQUVmLEtBQUssTUFBTSxRQUFRLEtBQUssSUFBSSxFQUFHLE1BQU0sR0FBRztnQkFDeEMsSUFBSSxLQUFLLE1BQU07Ozs7Z0JBSWYsS0FBSzsrQkFFRCxJQUFNLFNBQUcsTUFBTSxTQUFPLHNCQUFiLE1BQU0sU0FBTyxTQUFiLE1BQU0sU0FBTzs7b0JBQ3RCLFFBQVE7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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/matchr.kode
