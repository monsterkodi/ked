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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvbm9vbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFpQkEsa0JBQVE7Ozs7U0FFUTs7ZUFBVjs7UUFDTSxNQUFLOztlQUFYOztJQUVGLFFBQVU7SUFDVixVQUFVO0lBQ1YsUUFBVTtJQUNWLE1BQVU7SUFFVixpQkFBUTs7Z0JBQU0sWUFBQSxFQUFHLEVBQUUsU0FBTzs7SUFDMUIsb0JBQVc7O2dCQUFNLGNBQU8sT0FBTyxPQUFNLFlBQWEsRUFBRSxZQUFZLFNBQVE7O0lBUXhFLG9CQUFVLEdBQUU7Ozs7UUFFUixLQUFLLEVBQUU7UUFDUCxLQUFLO1FBRUwsSUFBSTtlQUNFLElBQUksTUFBTyxFQUFFLE9BQU07O1lBQ3JCLEtBQUs7WUFDTCxLQUFLOztlQUVILElBQUksTUFBTyxFQUFFLE9BQU07O1lBQ3JCLEtBQUs7O1FBRVQsSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO2VBRUEsSUFBSTs7Z0JBQ0gsTUFBSyxNQUFPLEVBQUUsT0FBTSxPQUFRLEVBQUUsSUFBRSxPQUFNOztnQkFDckMsS0FBSyxJQUFFO3VCQUNELEtBQUssTUFBTyxFQUFFLFFBQU87O29CQUN2QixNQUFNOztvQkFDUCxFQUFFLFFBQU87O29CQUNSLEtBQUs7b0JBQ0w7OztZQUNSLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRTtpQkFDQSxPQUFRLE9BQVEsRUFBRSxPQUFNOztvQkFDeEIsSUFBSSxLQUFHLEtBQU0sRUFBRSxJQUFFLE9BQU07O29CQUN0QixLQUFLOztnQkFDVCxNQUFNOztZQUNWLEtBQUs7WUFDTCxPQUFPLEVBQUUsT0FBTTs7UUFFbkIsS0FBSzt1QkFDRCxJQUFNLFNBQUkscUJBQUEsUUFBQTs7WUFDVixNQUFNOztRQUNWLE1BQU07WUFFSCxJQUFJOztZQUNILElBQUksUUFBUSxHQUFJLEVBQUUsVUFBVTtZQUM1QixFQUFFLFFBQVE7bUJBQ1Y7Ozs7b0JBRUM7OztJQVFULGdCQUFnQjtJQUVoQixR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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/noon.kode
