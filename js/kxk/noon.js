var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var defaults, load, pad, parse, parseStr, regs, save, stringify

import slash from "./slash.js"

import nfs from "./nfs.js"


parse = function (s)
{
    var addLine, d, dd, dk, dv, e, EMPTY, FLOAT, i, indent, insert, inspect, INT, isArray, k, key, l, last, leadingSpaces, line, lineFail, lines, makeObject, NEWLINE, oi, p, r, stack, ud, undense, v, value, values, vl

    if (!s)
    {
        return ''
    }
    if (s === '')
    {
        return ''
    }
    EMPTY = /^\s*$/
    NEWLINE = /\r?\n/
    FLOAT = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
    INT = /^(\-|\+)?([0-9]+|Infinity)$/
    last = function (a)
    {
        return (a != null ? a[a.length - 1] : undefined)
    }
    isArray = function (a)
    {
        return (a != null) && typeof(a) === 'object' && a.constructor.name === 'Array'
    }
    undense = function (d, s)
    {
        var esc, i, key, l, ld, p, pp, sd, sl, t

        sl = s.length
        sd = d
        p = 0
        while (p < sl && s[p] === '.')
        {
            d += 1
            p += 1
        }
        while (p < sl && s[p] === ' ')
        {
            p += 1
        }
        l = ''
        key = true
        esc = false
        while (p < sl)
        {
            if (l !== '' && s[p] === ' ' && s[p + 1] === '.')
            {
                pp = p + 2
                while (pp < sl && s[pp] === '.')
                {
                    pp += 1
                }
                if (s[pp] === ' ')
                {
                    p += 1
                    break
                }
            }
            esc |= s[p] === '|'
            l += s[p]
            if (!esc && key && s[p] === ' ')
            {
                if (p < sl + 1 && s[p + 1] !== ' ')
                {
                    l += ' '
                }
                key = false
            }
            p += 1
            esc ^= s[p] === '|'
        }
        ld = ''
        for (var _a_ = i = 0, _b_ = d; (_a_ <= _b_ ? i < d : i > d); (_a_ <= _b_ ? ++i : --i))
        {
            ld += ' '
        }
        ld += l
        if (p < sl)
        {
            t = undense(sd,s.substring(p))
            t.unshift(ld)
            return t
        }
        else
        {
            return [ld]
        }
    }
    leadingSpaces = 0
    lines = s.split(NEWLINE).filter(function (l)
    {
        return !EMPTY.test(l)
    })
    if (lines.length === 0)
    {
        return ''
    }
    else if (lines.length === 1)
    {
        lines = [lines[0].trim()]
    }
    else
    {
        while (lines[0][leadingSpaces] === ' ')
        {
            leadingSpaces += 1
        }
    }
    stack = [{o:[],d:leadingSpaces}]
    makeObject = function (t)
    {
        var b, i, o

        o = {}
        var list = _k_.list(t.o)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            i = list[_c_]
            o[i] = null
        }
        t.l = _k_.last(t.o)
        t.o = o
        if (stack.length > 1)
        {
            b = stack[stack.length - 2]
            if (isArray(b.o))
            {
                b.o.pop()
                b.o.push(o)
            }
            else
            {
                b.o[b.l] = o
            }
        }
        return o
    }
    key = function (k)
    {
        if ((k != null ? k[0] : undefined) === '|')
        {
            if (k[k.length - 1] === '|')
            {
                return k.substr(1,k.length - 2)
            }
            return k.substr(1).trimRight()
        }
        return k
    }
    values = {'null':null,'true':true,'false':false}
    value = function (v)
    {
        if (values[v] !== undefined)
        {
            return values[v]
        }
        if ((v != null ? v[0] : undefined) === '|')
        {
            return key(v)
        }
        else if ((v != null ? v[v.length - 1] : undefined) === '|')
        {
            return v.substr(0,v.length - 1)
        }
        if (FLOAT.test(v))
        {
            return parseFloat(v)
        }
        if (INT.test(v))
        {
            return parseInt(v)
        }
        return v
    }
    insert = function (t, k, v)
    {
        if (isArray(t.o))
        {
            if (!(v != null))
            {
                if ((_k_.last(t.o) === '.' && '.' === k))
                {
                    t.o.pop()
                    t.o.push([])
                }
                return t.o.push(value(k))
            }
            else
            {
                return makeObject(t)[key(k)] = value(v)
            }
        }
        else
        {
            t.o[key(k)] = value(v)
            return t.l = key(k)
        }
    }
    indent = function (t, k, v)
    {
        var l, o

        o = []
        if ((v != null))
        {
            o = {}
        }
        if (isArray(t.o))
        {
            if (_k_.last(t.o) === '.')
            {
                t.o.pop()
                t.o.push(o)
            }
            else
            {
                l = _k_.last(t.o)
                makeObject(t)
                t.o[l] = o
            }
        }
        else
        {
            t.o[t.l] = o
        }
        if ((v != null))
        {
            o[key(k)] = value(v)
        }
        else
        {
            o.push(value(k))
        }
        return o
    }
    addLine = function (d, k, v)
    {
        var t, undensed

        if ((k != null))
        {
            t = _k_.last(stack)
            undensed = t.undensed
            t.undensed = false
            if (d > t.d && !undensed)
            {
                return stack.push({o:indent(t,k,v),d:d})
            }
            else if (d < t.d)
            {
                if (isArray(t.o) && _k_.last(t.o) === '.')
                {
                    t.o.pop()
                    t.o.push([])
                }
                while ((t != null ? t.d : undefined) > d)
                {
                    stack.pop()
                    t = _k_.last(stack)
                }
                return insert(t,k,v)
            }
            else
            {
                if (undensed)
                {
                    t.d = d
                }
                return insert(t,k,v)
            }
        }
    }
    inspect = function (l)
    {
        var d, escl, escr, k, p, v

        p = 0
        while (l[p] === ' ')
        {
            p += 1
        }
        if (!(l[p] != null))
        {
            return [0,null,null,false]
        }
        d = p
        k = ''
        if (l[p] === '#')
        {
            return [0,null,null,false]
        }
        escl = false
        escr = false
        if (l[p] === '|')
        {
            escl = true
            k += '|'
            p += 1
        }
        while ((l[p] != null))
        {
            if (l[p] === ' ' && l[p + 1] === ' ' && !escl)
            {
                break
            }
            k += l[p]
            p += 1
            if (escl && l[p - 1] === '|')
            {
                break
            }
        }
        if (!escl)
        {
            k = k.trimRight()
        }
        while (l[p] === ' ')
        {
            p += 1
        }
        v = ''
        if (l[p] === '|')
        {
            escr = true
            v += '|'
            p += 1
        }
        while ((l[p] != null))
        {
            v += l[p]
            p += 1
            if (escr && l[p - 1] === '|' && l.trimRight().length === p)
            {
                break
            }
        }
        if (l[p - 1] === ' ' && !escr)
        {
            if ((v != null))
            {
                v = v.trimRight()
            }
        }
        if (k === '')
        {
            k = null
        }
        if (v === '')
        {
            v = null
        }
        return [d,k,v,escl]
    }
    if (lines.length === 1)
    {
        if (0 < lines[0].indexOf(':: '))
        {
            lines = lines[0].split(':: ').map(function (l)
            {
                var p

                p = 0
                while (l[p] === ' ')
                {
                    p += 1
                }
                while ((l[p] != null) && (l[p] !== ' '))
                {
                    p += 1
                }
                if (l[p] === ' ')
                {
                    return l.slice(0,p) + ' ' + l.slice(p)
                }
                else
                {
                    return l
                }
            })
        }
        p = lines[0].indexOf(' . ')
        e = lines[0].indexOf('|')
        if (p > 0 && (p === lines[0].indexOf(' ')) && (e < 0 || p < e))
        {
            lines = [lines[0].slice(0,p) + ' ' + lines[0].slice(p)]
        }
    }
    i = 0
    while (i < lines.length)
    {
        line = lines[i]
        var _d_ = inspect(line); d = _d_[0]; k = _d_[1]; v = _d_[2]; e = _d_[3]

        if ((k != null))
        {
            if ((v != null) && (!e) && (v.substr(0,2) === '. '))
            {
                addLine(d,k)
                ud = _k_.last(stack).d
                var list = _k_.list(undense(d,v))
                for (var _e_ = 0; _e_ < list.length; _e_++)
                {
                    e = list[_e_]
                    var _f_ = inspect(e); dd = _f_[0]; dk = _f_[1]; dv = _f_[2]

                    addLine(dd,dk,dv)
                }
                while (_k_.last(stack).d > ud + 1)
                {
                    stack.pop()
                }
                _k_.last(stack).undensed = true
            }
            else
            {
                oi = i
                lineFail = function ()
                {
                    if (i >= lines.length)
                    {
                        console.error(`unmatched multiline string in line ${oi + 1}`)
                        return 1
                    }
                }
                if (k === '...' && !(v != null))
                {
                    i += 1
                    vl = []
                    if (lineFail())
                    {
                        return
                    }
                    while (lines[i].trimLeft().substr(0,3) !== '...')
                    {
                        l = lines[i].trim()
                        if (l[0] === '|')
                        {
                            l = l.substr(1)
                        }
                        if (l[l.length - 1] === '|')
                        {
                            l = l.substr(0,l.length - 1)
                        }
                        vl.push(l)
                        i += 1
                        if (lineFail())
                        {
                            return
                        }
                    }
                    k = vl.join('\n')
                    r = lines[i].trimLeft().substr(3).trim()
                    if (r.length)
                    {
                        v = r
                    }
                }
                if (v === '...')
                {
                    i += 1
                    if (lineFail())
                    {
                        return
                    }
                    vl = []
                    while (lines[i].trim() !== '...')
                    {
                        l = lines[i].trim()
                        if (l[0] === '|')
                        {
                            l = l.substr(1)
                        }
                        if (l[l.length - 1] === '|')
                        {
                            l = l.substr(0,l.length - 1)
                        }
                        vl.push(l)
                        i += 1
                        if (lineFail())
                        {
                            return
                        }
                    }
                    v = vl.join('\n')
                }
                addLine(d,k,v)
            }
        }
        i += 1
    }
    return stack[0].o
}
defaults = {ext:'.noon',indent:4,align:true,maxalign:32,sort:false,circular:false,null:false,colors:false}
regs = {url:new RegExp('^(https?|git|file)(://)(\\S+)$'),path:new RegExp('^([\\.\\/\\S]+)(\\/\\S+)$'),semver:new RegExp('\\d+\\.\\d+\\.\\d+')}

pad = function (s, l)
{
    while (s.length < l)
    {
        s += ' '
    }
    return s
}

stringify = function (obj, options = {})
{
    var def, escape, indstr, opt, pretty, toStr

    def = function (o, d)
    {
        var k, r, v

        r = {}
        for (k in o)
        {
            v = o[k]
            r[k] = v
        }
        for (k in d)
        {
            v = d[k]
            if (!(r[k] != null))
            {
                r[k] = v
            }
        }
        return r
    }
    opt = def(options,defaults)
    if (opt.ext === '.json')
    {
        return JSON.stringify(obj,null,opt.indent)
    }
    if (typeof(opt.indent) === 'string')
    {
        opt.indent = opt.indent.length
    }
    indstr = pad('',opt.indent)
    escape = function (k, arry)
    {
        var es, sp

        if (0 <= k.indexOf('\n'))
        {
            sp = k.split('\n')
            es = sp.map(function (s)
            {
                return escape(s,arry)
            })
            es.unshift('...')
            es.push('...')
            return es.join('\n')
        }
        if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|']))
        {
            k = '|' + k + '|'
        }
        else if (arry && /\s\s/.test(k))
        {
            k = '|' + k + '|'
        }
        return k
    }
    pretty = function (o, ind, visited)
    {
        var k, keyValue, kl, l, maxKey, v

        if (opt.align)
        {
            maxKey = opt.indent
            if (Object.keys(o).length > 1)
            {
                for (k in o)
                {
                    v = o[k]
                    if (true)
                    {
                        kl = parseInt(Math.ceil((k.length + 2) / opt.indent) * opt.indent)
                        maxKey = Math.max(maxKey,kl)
                        if (opt.maxalign && (maxKey > opt.maxalign))
                        {
                            maxKey = opt.maxalign
                            break
                        }
                    }
                }
            }
        }
        l = []
        keyValue = function (k, v)
        {
            var i, ks, s, vs

            s = ind
            k = escape(k,true)
            if (k.indexOf('  ') > 0 && k[0] !== '|')
            {
                k = `|${k}|`
            }
            else if (k[0] !== '|' && k[k.length - 1] === '|')
            {
                k = '|' + k
            }
            else if (k[0] === '|' && k[k.length - 1] !== '|')
            {
                k += '|'
            }
            if (opt.align)
            {
                ks = pad(k,Math.max(maxKey,k.length + 2))
                i = pad(ind + indstr,maxKey)
            }
            else
            {
                ks = pad(k,k.length + 2)
                i = ind + indstr
            }
            s += ks
            vs = toStr(v,i,false,visited)
            if (vs[0] === '\n')
            {
                while (s[s.length - 1] === ' ')
                {
                    s = s.substr(0,s.length - 1)
                }
            }
            s += vs
            while (s[s.length - 1] === ' ')
            {
                s = s.substr(0,s.length - 1)
            }
            return s
        }
        if (opt.sort)
        {
            var list = _k_.list(Object.keys(o).sort())
            for (var _10_ = 0; _10_ < list.length; _10_++)
            {
                k = list[_10_]
                l.push(keyValue(k,o[k]))
            }
        }
        else
        {
            for (k in o)
            {
                v = o[k]
                if (true)
                {
                    l.push(keyValue(k,v))
                }
            }
        }
        return l.join('\n')
    }
    toStr = function (o, ind = '', arry = false, visited = [])
    {
        var s, t, v, _550_32_, _554_37_

        if (!(o != null))
        {
            if (o === null)
            {
                return opt.null || arry && "null" || ''
            }
            if (o === undefined)
            {
                return "undefined"
            }
            return '<?>'
        }
        switch (t = typeof(o))
        {
            case 'string':
                return escape(o,arry)

            case 'object':
                if (opt.circular)
                {
                    if (_k_.in(o,visited))
                    {
                        return '<v>'
                    }
                    visited.push(o)
                }
                if ((o.constructor != null ? o.constructor.name : undefined) === 'Array')
                {
                    s = ind !== '' && arry && '.' || ''
                    if (o.length && ind !== '')
                    {
                        s += '\n'
                    }
                    s += (function () { var r_11_ = []; var list = _k_.list(o); for (var _12_ = 0; _12_ < list.length; _12_++)  { v = list[_12_];r_11_.push(ind + toStr(v,ind + indstr,true,visited))  } return r_11_ }).bind(this)().join('\n')
                }
                else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp')
                {
                    return o.source
                }
                else
                {
                    s = (arry && '.\n') || ((ind !== '') && '\n' || '')
                    s += pretty(o,ind,visited)
                }
                return s

            default:
                return String(o)
        }

        return '<???>'
    }
    return toStr(obj)
}

parseStr = function (str, p, ext)
{
    if (str.length <= 0)
    {
        return null
    }
    switch ((ext != null ? ext : slash.ext(p)))
    {
        case 'json':
            return JSON.parse(str)

        default:
            return parse(str)
    }

}

load = async function (p, ext)
{
    var str

    str = await nfs.readText(p)
    if (!_k_.empty(str))
    {
        return parseStr(str,p,ext)
    }
    else
    {
        return null
    }
}

save = async function (p, data, strOpt)
{
    var str

    str = stringify(data,Object.assign({ext:slash.ext(p),strOpt:strOpt}))
    return nfs.write(p,str)
}
export default {
    load:load,
    read:load,
    save:save,
    write:save,
    parse:parse,
    stringify:stringify
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvbm9vbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFpQkE7Ozs7U0FFZ0I7O2VBQVY7O1FBQ00sTUFBSzs7ZUFBWDs7SUFFRixRQUFVO0lBQ1YsVUFBVTtJQUNWLFFBQVU7SUFDVixNQUFVO0lBRVY7O2dCQUFjLFlBQUEsRUFBRyxFQUFFLFNBQU87O0lBQzFCOztnQkFBaUIsY0FBTyxPQUFPLE9BQU0sWUFBYSxFQUFFLFlBQVksU0FBUTs7SUFReEU7Ozs7UUFFSSxLQUFLLEVBQUU7UUFDUCxLQUFLO1FBRUwsSUFBSTtlQUNFLElBQUksTUFBTyxFQUFFLE9BQU07O1lBQ3JCLEtBQUs7WUFDTCxLQUFLOztlQUVILElBQUksTUFBTyxFQUFFLE9BQU07O1lBQ3JCLEtBQUs7O1FBRVQsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO2VBRUEsSUFBSTs7Z0JBQ0gsTUFBSyxNQUFPLEVBQUUsT0FBTSxPQUFRLEVBQUUsSUFBRSxPQUFNOztnQkFDckMsS0FBSyxJQUFFO3VCQUNELEtBQUssTUFBTyxFQUFFLFFBQU87O29CQUN2QixNQUFNOztvQkFDUCxFQUFFLFFBQU87O29CQUNSLEtBQUs7b0JBQ0w7OztZQUNSLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRTtpQkFDQSxPQUFRLE9BQVEsRUFBRSxPQUFNOztvQkFDeEIsSUFBSSxLQUFHLEtBQU0sRUFBRSxJQUFFLE9BQU07O29CQUN0QixLQUFLOztnQkFDVCxNQUFNOztZQUNWLEtBQUs7WUFDTCxPQUFPLEVBQUUsT0FBTTs7UUFFbkIsS0FBSzsyQkFDSyxTQUFJLHFCQUFBLFFBQUE7O1lBQ1YsTUFBTTs7UUFDVixNQUFNO1lBRUgsSUFBSTs7WUFDSCxJQUFJLFFBQVEsR0FBSSxFQUFFLFVBQVU7WUFDNUIsRUFBRSxRQUFRO21CQUNWOzs7O29CQUVDOzs7SUFRVCxnQkFBZ0I7SUFFaEIsUUFBUSxFQUFFLE1BQU0sU0FBUzs7Z0JBQWtCLE1BQU0s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
//# sourceURL=kode/kxk/noon.kode
