var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var defaults, load, pad, parse, parseStr, regs, save, stringify

import slash from "./slash.js"

import nfs from "./nfs.js"


parse = function (s)
{
    var addLine, d, dd, dk, dv, e, EMPTY, FLOAT, i, indent, insert, inspect, INT, isArray, k, key, l, leadingSpaces, line, lineFail, lines, makeObject, NEWLINE, oi, p, r, stack, ud, undense, v, value, values, vl

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
        for (i = 0; i < d; i++)
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
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            i = list[_a_]
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
        ;[d,k,v,e] = inspect(line)
        if ((k != null))
        {
            if ((v != null) && (!e) && (v.substr(0,2) === '. '))
            {
                addLine(d,k)
                ud = _k_.last(stack).d
                var list = _k_.list(undense(d,v))
                for (var _b_ = 0; _b_ < list.length; _b_++)
                {
                    e = list[_b_]
                    ;[dd,dk,dv] = inspect(e)
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
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                k = list[_c_]
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
        var s, t, v, _443_32_, _447_37_

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
                    s += (function () { var r_d_ = []; var list = _k_.list(o); for (var _e_ = 0; _e_ < list.length; _e_++)  { v = list[_e_];r_d_.push(ind + toStr(v,ind + indstr,true,visited))  } return r_d_ }).bind(this)().join('\n')
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
        return
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
        console.log('noon load null')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvbm9vbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BRU0sWUFBQTs7T0FDQSxVQUFBOzs7QUFJTixrQkFBUTs7OztTQUVROztlQUFWOztRQUNNLE1BQUs7O2VBQVg7O0lBRUYsUUFBVTtJQUNWLFVBQVU7SUFDVixRQUFVO0lBQ1YsTUFBVTtJQUVWLG9CQUFXOztnQkFBTSxjQUFPLE9BQU8sT0FBTSxZQUFhLEVBQUUsWUFBWSxTQUFROztJQUV4RSxvQkFBVSxHQUFFOzs7O1FBRVIsS0FBSyxFQUFFO1FBQ1AsS0FBSztRQUVMLElBQUk7ZUFDRSxJQUFJLE1BQU8sRUFBRSxPQUFNOztZQUNyQixLQUFLO1lBQ0wsS0FBSzs7ZUFFSCxJQUFJLE1BQU8sRUFBRSxPQUFNOztZQUNyQixLQUFLOztRQUVULElBQUk7UUFDSixNQUFNO1FBQ04sTUFBTTtlQUVBLElBQUk7O2dCQUNILE1BQUssTUFBTyxFQUFFLE9BQU0sT0FBUSxFQUFFLElBQUUsT0FBTTs7Z0JBQ3JDLEtBQUssSUFBRTt1QkFDRCxLQUFLLE1BQU8sRUFBRSxRQUFPOztvQkFDdkIsTUFBTTs7b0JBQ1AsRUFBRSxRQUFPOztvQkFDUixLQUFLO29CQUNMOzs7WUFDUixPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFLLEVBQUU7aUJBQ0EsT0FBUSxPQUFRLEVBQUUsT0FBTTs7b0JBQ3hCLElBQUksS0FBRyxLQUFNLEVBQUUsSUFBRSxPQUFNOztvQkFDdEIsS0FBSzs7Z0JBQ1QsTUFBTTs7WUFDVixLQUFLO1lBQ0wsT0FBTyxFQUFFLE9BQU07O1FBRW5CLEtBQUs7YUFDRCxJQUFNLE9BQUk7O1lBQ1YsTUFBTTs7UUFDVixNQUFNO1lBRUgsSUFBSTs7WUFDSCxJQUFJLFFBQVEsR0FBSSxFQUFFLFVBQVU7WUFDNUIsRUFBRSxRQUFRO21CQUNWOzs7O29CQUVDOzs7SUFFVCxnQkFBZ0I7SUFFaEIsUUFBUSxFQUFFLE1BQU0sU0FBUyxpQkFBUTs7Z0JBQVUsTUFB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
//# sourceURL=../../kode/kxk/noon.kode
