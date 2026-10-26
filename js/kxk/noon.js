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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvbm9vbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUU0sWUFBQTs7T0FDQSxVQUFBOzs7QUFRTixrQkFBUTs7OztTQUVROztlQUFWOztRQUNNLE1BQUs7O2VBQVg7O0lBRUYsUUFBVTtJQUNWLFVBQVU7SUFDVixRQUFVO0lBQ1YsTUFBVTtJQUVWLGlCQUFROztnQkFBTSxZQUFBLEVBQUcsRUFBRSxTQUFPOztJQUMxQixvQkFBVzs7Z0JBQU0sY0FBTyxPQUFPLE9BQU0sWUFBYSxFQUFFLFlBQVksU0FBUTs7SUFReEUsb0JBQVUsR0FBRTs7OztRQUVSLEtBQUssRUFBRTtRQUNQLEtBQUs7UUFFTCxJQUFJO2VBQ0UsSUFBSSxNQUFPLEVBQUUsT0FBTTs7WUFDckIsS0FBSztZQUNMLEtBQUs7O2VBRUgsSUFBSSxNQUFPLEVBQUUsT0FBTTs7WUFDckIsS0FBSzs7UUFFVCxJQUFJO1FBQ0osTUFBTTtRQUNOLE1BQU07ZUFFQSxJQUFJOztnQkFDSCxNQUFLLE1BQU8sRUFBRSxPQUFNLE9BQVEsRUFBRSxJQUFFLE9BQU07O2dCQUNyQyxLQUFLLElBQUU7dUJBQ0QsS0FBSyxNQUFPLEVBQUUsUUFBTzs7b0JBQ3ZCLE1BQU07O29CQUNQLEVBQUUsUUFBTzs7b0JBQ1IsS0FBSztvQkFDTDs7O1lBQ1IsT0FBTyxFQUFFLE9BQU87WUFDaEIsS0FBSyxFQUFFO2lCQUNBLE9BQVEsT0FBUSxFQUFFLE9BQU07O29CQUN4QixJQUFJLEtBQUcsS0FBTSxFQUFFLElBQUUsT0FBTTs7b0JBQ3RCLEtBQUs7O2dCQUNULE1BQU07O1lBQ1YsS0FBSztZQUNMLE9BQU8sRUFBRSxPQUFNOztRQUVuQixLQUFLO3VCQUNELElBQU0sU0FBSSxxQkFBQSxRQUFBOztZQUNWLE1BQU07O1FBQ1YsTUFBTTtZQUVILElBQUk7O1lBQ0gsSUFBSSxRQUFRLEdBQUksRUFBRSxVQUFVO1lBQzVCLEVBQUUsUUFBUTttQkFDVjs7OztvQkFFQzs7O0lB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/noon.kode
