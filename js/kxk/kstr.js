var _k_ = {noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isArr: function (o) {return Array.isArray(o)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var ESCAPE_REGEXP, LINES_REGEXP, str

import ansi from "./ansi.js"

import matchr from "./matchr.js"


str = function (o)
{
    if (!(o != null))
    {
        return 'null'
    }
    return _k_.noon(o)
}
LINES_REGEXP = /\r?\n/

str.lines = function (s)
{
    return s.split(LINES_REGEXP)
}

str.graphemes = function (s)
{
    var segmenter

    segmenter = new Intl.Segmenter("en-US",{granularity:'grapheme'})
    return Array.from(segmenter.segment(s))
}

str.segments = function (s)
{
    var segmenter

    segmenter = new Intl.Segmenter("en-US",{granularity:'grapheme'})
    return Array.from(segmenter.segment(s)).map(function (s)
    {
        return s.segment
    })
}

str.fillet = function (s, wordCharacterSet = '')
{
    var ch, ci, fillet, fillets, isWord

    fillets = []
    if (!(_k_.isStr(s)))
    {
        return fillets
    }
    for (var _a_ = ci = 0, _b_ = s.length; (_a_ <= _b_ ? ci < s.length : ci > s.length); (_a_ <= _b_ ? ++ci : --ci))
    {
        ch = s[ci]
        if (_k_.in(ch,' \t\n\r'))
        {
            if (!_k_.empty(fillet))
            {
                fillets.push(fillet)
            }
            fillet = null
            continue
        }
        isWord = /\w/.test(ch) || _k_.in(ch,wordCharacterSet)
        if ((fillet != null ? fillet.word : undefined) === isWord)
        {
            fillet.match += ch
            fillet.length++
        }
        else
        {
            if (!_k_.empty(fillet))
            {
                fillets.push(fillet)
            }
            fillet = {match:ch,index:ci,length:1,word:isWord}
        }
    }
    if (!_k_.empty(fillet))
    {
        fillets.push(fillet)
    }
    return fillets
}

str.unfillet = function (fillets)
{
    var fillet, s

    s = ''
    var list = _k_.list(fillets)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        fillet = list[_c_]
        s = _k_.rpad(fillet.index,s)
        s += fillet.match
    }
    return _k_.trim(s)
}

str.blockFillets = function (lineFillets)
{
    var block, blocks, fillet, indent, lineIndex, stack, stackTop

    blocks = []
    stack = []
    var list = _k_.list(lineFillets)
    for (lineIndex = 0; lineIndex < list.length; lineIndex++)
    {
        fillet = list[lineIndex]
        if (_k_.empty(fillet))
        {
            continue
        }
        indent = (fillet[0] != null ? fillet[0].index : undefined)
        block = {line:lineIndex,indent:indent,fillet:fillet,blocks:[]}
        if (stackTop = _k_.last(stack))
        {
            if (indent > stackTop.indent)
            {
                stackTop.blocks.push(block)
            }
            else if (indent === stackTop.indent)
            {
                stack.pop()
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
            else
            {
                while (!_k_.empty((stack)) && indent <= _k_.last(stack).indent)
                {
                    stack.pop()
                }
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
        }
        else
        {
            blocks.push(block)
            stack.pop()
        }
        stack.push(block)
    }
    return blocks
}

str.unfilletBlock = function (block)
{
    var s

    s = ''
    s += str.unfillet(block.fillet)
    s += '\n'
    s += str.unfilletBlocks(block.blocks)
    return s
}

str.unfilletBlocks = function (blocks)
{
    var b, s

    s = ''
    var list = _k_.list(blocks)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        b = list[_e_]
        s += _k_.rpad(b.indent,'') + str.unfilletBlock(b)
    }
    return s
}

str.indexOfClosestNonWhitespace = function (s, x)
{
    var dl, dr

    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    if (!(_k_.in(s[x],'\n\t\r ')))
    {
        return x
    }
    dl = dr = 0
    while (_k_.in(s[x - dl],'\r\n\t '))
    {
        dl += 1
    }
    if (x - dl < 0)
    {
        dl = Infinity
    }
    while (_k_.in(s[x + dr],'\r\n\t '))
    {
        dr += 1
    }
    if (x + dr >= s.length)
    {
        dr = Infinity
    }
    if ((dl === dr && dr === Infinity))
    {
        return -1
    }
    if (dl < dr)
    {
        return x - dl
    }
    else
    {
        return x + dr
    }
}

str.indexOfPreviousWhitespace = function (s, x)
{
    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    while (x >= 0 && !(_k_.in(s[x],'\r\n\t ')))
    {
        x--
    }
    return x
}

str.indexOfNextWhitespace = function (s, x)
{
    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    while (x < s.length && !(_k_.in(s[x],'\r\n\t ')))
    {
        x++
    }
    return x
}

str.isAlphaNumeric = function (s)
{
    var c

    var list = _k_.list(s)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        c = list[_f_]
        if (!/\w+/.test(c))
        {
            return false
        }
    }
    return true
}

str.indexOfClosestAlphaNumeric = function (s, x)
{
    var dl, dr

    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    if (str.isAlphaNumeric(s[x]))
    {
        return x
    }
    dl = dr = 0
    while (!str.isAlphaNumeric(s[x - dl]))
    {
        dl += 1
    }
    if (x - dl < 0)
    {
        dl = Infinity
    }
    while (!str.isAlphaNumeric(s[x + dr]))
    {
        dr += 1
    }
    if (x + dr >= s.length)
    {
        dr = Infinity
    }
    if ((dl === dr && dr === Infinity))
    {
        return -1
    }
    if (dl < dr)
    {
        return x - dl
    }
    else
    {
        return x + dr
    }
}

str.indexOfPreviousNonAlphaNumeric = function (s, x)
{
    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    while (x >= 0 && str.isAlphaNumeric(s[x]))
    {
        x--
    }
    return x
}

str.indexOfNextNonAlphaNumeric = function (s, x)
{
    if (_k_.empty(s))
    {
        return -1
    }
    x = _k_.clamp(0,s.length - 1,x)
    while (x < s.length && str.isAlphaNumeric(s[x]))
    {
        x++
    }
    return x
}

str.rangeOfClosestWord = function (s, x)
{
    var re, rs

    if (_k_.empty(str))
    {
        return
    }
    x = str.indexOfClosestAlphaNumeric(s,x)
    if (x < 0)
    {
        return
    }
    rs = str.indexOfPreviousNonAlphaNumeric(s,x)
    re = str.indexOfNextNonAlphaNumeric(s,x)
    if (re > rs)
    {
        return [rs + 1,re]
    }
}

str.rangeOfClosestChunk = function (s, x)
{
    var re, rs

    if (_k_.empty(str))
    {
        return
    }
    x = str.indexOfClosestNonWhitespace(s,x)
    if (x < 0)
    {
        return
    }
    rs = str.indexOfPreviousWhitespace(s,x)
    re = str.indexOfNextWhitespace(s,x)
    if (re > rs)
    {
        return [rs + 1,re]
    }
}

str.splice = function (s, i, c, r = '')
{
    return s.slice(0,i) + r + s.slice(i + Math.abs(c))
}

str.clean = function (s)
{
    return s.replaceAll('\r\n','\n')
}

str.encode = function (s, spaces = true)
{
    var r

    if (s)
    {
        r = encodeURI(s)
        if (spaces)
        {
            r = r.replace(/\s/g,'&nbsp;')
        }
        return r
    }
    else
    {
        return ''
    }
}
ESCAPE_REGEXP = /[\-\\\^\$\*\+\?\.\(\)\|\[\]\{\}\/]/g

str.escapeRegexp = function (s)
{
    return s.replace(ESCAPE_REGEXP,'\\$&')
}

str.escapeRegExp = function (s)
{
    return s.replace(ESCAPE_REGEXP,'\\$&')
}

str.hex = function (s)
{
    if (_k_.isStr(s))
    {
        return Number.parseInt(s,16)
    }
    if (_k_.isNum(s))
    {
        return Number(s).toString(16)
    }
}

str.scaleColor = function (s, f = 0.5)
{
    if (!(_k_.isStr(s)))
    {
        s = str.hexColor(s)
    }
    return str.hexColor(str.hexColor(s).map(function (v)
    {
        return _k_.clamp(0,255,parseInt(f * v))
    }))
}

str.hexColor = function (s)
{
    var h, l, validate

    if (_k_.isArr(s))
    {
        h = '#' + s.slice(0, 3).map(function (v)
        {
            return _k_.lpad(2,str.hex(v),'0')
        }).join('')
        if (s.length > 3 && _k_.isNum(s[3]))
        {
            h = str.scaleColor(h,s[3])
        }
        return h
    }
    if (_k_.isStr(s))
    {
        validate = function (a)
        {
            var v

            var list = _k_.list(a)
            for (var _10_ = 0; _10_ < list.length; _10_++)
            {
                v = list[_10_]
                if (_k_.empty(v))
                {
                    return
                }
            }
            return a
        }
        if (s.startsWith('rgb'))
        {
            if (s = str.rgbaToHexColor(s))
            {
            }
        }
        if (_k_.empty(s))
        {
            return
        }
        l = s.length
        if ((l === 7 || l === 4) && s[0] === "#")
        {
            s = s.slice(1)
            l--
        }
        if (l === 6)
        {
            return validate([str.hex(s.slice(0, 2)),str.hex(s.slice(2, 4)),str.hex(s.slice(4, 6))])
        }
        if (l === 3)
        {
            return validate([str.hex(s[0]) * 17,str.hex(s[1]) * 17,str.hex(s[2]) * 17])
        }
        return
    }
    if (_k_.isNum(s))
    {
        return str.hexColor(str.hexColor(_k_.lpad(6,Number(s).toString(16),'0')))
    }
}

str.rgbaToHexColor = function (s)
{
    var f, spl, v, vls

    if (_k_.isStr(s) && s.startsWith('rgb'))
    {
        spl = s.split('(')[1].split(')')[0].split(',')
        vls = spl.slice(0, 3).map(function (c)
        {
            return parseInt(c)
        })
        if (!((3 <= vls.length && vls.length <= 4)))
        {
            return
        }
        var list = _k_.list(vls)
        for (var _11_ = 0; _11_ < list.length; _11_++)
        {
            v = list[_11_]
            if (_k_.empty((v)) || v < 0 || v > 255)
            {
                return
            }
        }
        if (spl.length > 3)
        {
            f = parseFloat(spl[3])
            if (_k_.empty(f))
            {
                return
            }
            if (!((0 <= f && f <= 1)))
            {
                return
            }
            vls.push(f)
        }
        return str.hexColor(vls)
    }
}

str.hash = function (s)
{
    var h, i

    h = 9
    for (var _12_ = i = s.length, _13_ = 0; (_12_ <= _13_ ? i <= 0 : i >= 0); (_12_ <= _13_ ? ++i : --i))
    {
        h = Math.imul(h ^ s.charCodeAt(i),9 ** 9)
    }
    return h ^ h >> 9
}

str.colorRanges = function (s)
{
    var hexa, regexps, rgb, rgba, rng, rngs, trio

    trio = /#[a-fA-F0-9]{3}(?![\w\d])/
    hexa = /#[a-fA-F0-9]{6}|0x[a-fA-F0-9]{6}(?![\w\d])/
    rgb = /rgb\s*\(\s*\d+\s*\,\s*\d+\s*\,\s*\d+\s*\)/
    rgba = /rgba\s*\(\s*\d+\s*\,\s*\d+\s*\,\s*\d+\s*\,\s*\d+\.?\d*\s*\)/
    regexps = [[trio,'trio'],[hexa,'hexa'],[rgb,'rgb'],[rgba,'rgba']]
    if (rngs = matchr.ranges(regexps,s))
    {
        var list = _k_.list(rngs)
        for (var _14_ = 0; _14_ < list.length; _14_++)
        {
            rng = list[_14_]
            if (_k_.in(rng.clss,['rgb','rgba']))
            {
                rng.color = str.hexColor(str.rgbaToHexColor(rng.match))
            }
            else
            {
                rng.color = str.hexColor(rng.match)
            }
        }
    }
    rngs = rngs.filter(function (r)
    {
        return !_k_.empty(r.color)
    })
    return rngs
}

str.rstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s.slice(-1)[0],cs))
    {
        s = s.slice(0, s.length - 1)
    }
    return s
}

str.lstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s[0],cs))
    {
        s = s.slice(1)
    }
    return s
}

str.strip = function (s, cs = ' ')
{
    return str.rstrip(str.lstrip(s,cs),cs)
}
str.trim = str.strip
str.ltrim = str.lstrip
str.rtrim = str.rstrip

str.lcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[++i],c))
    {
    }
    return i
}

str.rcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[s.length - (++i) - 1],c))
    {
    }
    return i
}

str.cnt = function (s, c)
{
    var m

    m = s.match(new RegExp(c,'g'))
    return ((m != null) ? m.length : 0)
}

str.lpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s = c + s
    }
    return s
}

str.rpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s += c
    }
    return s
}
str.pad = str.rpad

str.crop = function (s, len)
{
    s = String(s)
    if (len <= 0)
    {
        return ''
    }
    if (s.length <= len)
    {
        return str.rpad(s,len)
    }
    return s.slice(0, len - 1) + '…'
}

str.detab = function (s)
{
    var i

    s = String(s)
    i = 0
    while (i < s.length)
    {
        if (s[i] === '\t')
        {
            s = s.slice(0, typeof i === 'number' ? i : -1) + str.lpad('',4 - (i % 4)) + s.slice(i + 1)
        }
        i += 1
    }
    return s
}

str.time = function (t)
{
    var f, k, num, o, thsnd

    switch (typeof(t))
    {
        case 'number':
            f = 1
            o = {ms:1000,second:60,minute:60,hour:24,day:30,month:12,year:0}
            var list = _k_.list(Object.keys(o))
            for (var _15_ = 0; _15_ < list.length; _15_++)
            {
                k = list[_15_]
                num = parseInt(t / f)
                f *= o[k]
                if (k === 'year' || t < f)
                {
                    if (k !== 'ms' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
            }
            break
        case 'bigint':
            thsnd = BigInt(1000)
            f = thsnd
            var list1 = ['ns','μs','ms','second']
            for (var _16_ = 0; _16_ < list1.length; _16_++)
            {
                k = list1[_16_]
                if (k === 'seconds' || t < f)
                {
                    num = parseInt(thsnd * t / f)
                    if (k === 'second' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
                f *= thsnd
            }
            return 'big:' + String(t)

        default:
            return 'time:' + String(t)
    }

}

str.now = function ()
{
    var now

    now = new Date(Date.now())
    return `${str.lpad(now.getHours(),2,'0')}:${str.lpad(now.getMinutes(),2,'0')}:${str.lpad(now.getSeconds(),2,'0')}.${str.lpad(now.getMilliseconds(),3,'0')}`
}

str.stripAnsi = function (s)
{
    return ansi.strip(s)
}

str.ansi2html = function (s)
{
    return ansi.html(s)
}
str.ansi = ansi

str.levensthein = function (a, b = '')
{
    var ay, bx0, bx1, bx2, bx3, d0, d1, d2, d3, dd, dy, la, lb, len, offset, vector, x, y, y2, _min

    if (a === b)
    {
        return 0
    }
    if (a.length > b.length)
    {
        var _17_ = [b,a]; a = _17_[0]; b = _17_[1]

    }
    la = a.length
    lb = b.length
    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)))
    {
        la--
        lb--
    }
    offset = 0
    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset)))
    {
        offset++
    }
    la -= offset
    lb -= offset
    if (la === 0 || lb < 3)
    {
        return lb
    }
    x = 0
    vector = []
    for (var _18_ = y = 0, _19_ = la; (_18_ <= _19_ ? y < la : y > la); (_18_ <= _19_ ? ++y : --y))
    {
        vector.push(y + 1)
        vector.push(a.charCodeAt(offset + y))
    }
    len = vector.length - 1
    _min = function (d0, d1, d2, bx, ay)
    {
        if (d0 < d1 || d2 < d1)
        {
            return (d0 > d2 ? d2 + 1 : d0 + 1)
        }
        else
        {
            return (bx === ay ? d1 : d1 + 1)
        }
    }
    while (x < lb - 3)
    {
        bx0 = b.charCodeAt(offset + (d0 = x))
        bx1 = b.charCodeAt(offset + (d1 = x + 1))
        bx2 = b.charCodeAt(offset + (d2 = x + 2))
        bx3 = b.charCodeAt(offset + (d3 = x + 3))
        dd = (x += 4)
        for (var _1a_ = y2 = 0, _1b_ = len / 2; (_1a_ <= _1b_ ? y2 < len / 2 : y2 > len / 2); (_1a_ <= _1b_ ? ++y2 : --y2))
        {
            y = y2 * 2
            dy = vector[y]
            ay = vector[y + 1]
            d0 = _min(dy,d0,d1,bx0,ay)
            d1 = _min(d0,d1,d2,bx1,ay)
            d2 = _min(d1,d2,d3,bx2,ay)
            dd = _min(d2,d3,dd,bx3,ay)
            vector[y] = dd
            d3 = d2
            d2 = d1
            d1 = d0
            d0 = dy
        }
    }
    while (x < lb)
    {
        bx0 = b.charCodeAt(offset + (d0 = x))
        dd = ++x
        for (var _1c_ = y2 = 0, _1d_ = len / 2; (_1c_ <= _1d_ ? y2 < len / 2 : y2 > len / 2); (_1c_ <= _1d_ ? ++y2 : --y2))
        {
            y = y2 * 2
            dy = vector[y]
            vector[y] = dd = _min(dy,d0,dd,bx0,vector[y + 1])
            d0 = dy
        }
    }
    return dd
}

str.weight = function (s)
{
    var c, f, i, w

    if (_k_.isStr(s))
    {
        s = _k_.trim(s)
    }
    if (_k_.empty(s))
    {
        return 0
    }
    w = 0
    f = 1
    var list = _k_.list(s)
    for (i = 0; i < list.length; i++)
    {
        c = list[i]
        w += c.charCodeAt(0) * f
        f /= 256.0
    }
    return w
}
export default str;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3N0ci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva3N0ci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ00sV0FBQTs7T0FDQSxhQUFBOzs7QUFPTixnQkFBTTs7VUFFYzs7ZUFBZDs7b0JBRUc7O0FBS1QsZUFBZTs7QUFFZixJQUFJLGtCQUFROztXQUFLLEVBQUUsTUFBTTs7O0FBRXpCLElBQUksc0JBQVk7Ozs7SUFFWixnQkFBZ0IsS0FBSyxVQUFVLFNBQVEsWUFBWTtXQUNuRCxNQUFNLEtBQUssVUFBVSxRQUFROzs7QUFFakMsSUFBSSxxQkFBVzs7OztJQUVYLGdCQUFnQixLQUFLLFVBQVUsU0FBUSxZQUFZO1dBQ25ELE1BQU0sS0FBSyxVQUFVLFFBQVEsSUFBSSxjQUFLOztlQUFNLEVBQUU7Ozs7QUFjbEQsSUFBSSxtQkFBUyxHQUFFLG1CQUFpQjs7OztJQUU1QjtVQUVzQixVQUFMOztlQUFmOzttQkFFRSxLQUFNLFNBQUksRUFBRSwyQkFBRixFQUFFLGNBQUYsRUFBRTs7UUFFWixLQUFLLEVBQUU7bUJBRUosR0FBTTs7MkJBQ3dCOztnQkFBN0IsUUFBUSxLQUFLOztZQUNiLFNBQVM7WUFDVDs7UUFFSixTQUFTLEtBQUssS0FBSyxjQUFPLEdBQU07YUFFN0IsaUJBQUEsT0FBUSxzQkFBUTs7WUFDZixPQUFPLFNBQVM7WUFDaEIsT0FBTzs7OzsyQkFFc0I7O2dCQUE3QixRQUFRLEtBQUs7O1lBQ2IsVUFBUyxNQUFNLEdBQUksTUFBTSxHQUFJLE9BQU8sRUFBRSxLQUFLOzs7bUJBRXRCOztRQUE3QixRQUFRLEtBQUs7O1dBQ2I7OztBQUVKLElBQUkscUJBQVc7Ozs7SUFFWCxJQUFJO3dCQUNVOzs7UUFBVjtRQUNBLGFBQVMsT0FBTyxNQUFPO1FBQ3ZCLEtBQUssT0FBTzs7b0JBQ1g7OztBQUVULElBQUkseUJBQWU7Ozs7SUFFZjtJQUNBO3dCQUV3QjtTQUFiOztRQUFQO3NCQUVrQjs7WUFBbEI7O1FBRUEsVUFBUyxPQUFPLGFBQVAsT0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kstr.kode
