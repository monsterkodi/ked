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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3N0ci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva3N0ci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BVU0sV0FBQTs7T0FDQSxhQUFBOzs7QUFFTixnQkFBTTs7VUFFYzs7ZUFBZDs7b0JBRUc7O0FBS1QsZUFBZTs7QUFFZixJQUFJLGtCQUFROztXQUFLLEVBQUUsTUFBTTs7O0FBRXpCLElBQUksc0JBQVk7Ozs7SUFFWixnQkFBZ0IsS0FBSyxVQUFVLFNBQVEsWUFBWTtXQUNuRCxNQUFNLEtBQUssVUFBVSxRQUFROzs7QUFFakMsSUFBSSxxQkFBVzs7OztJQUVYLGdCQUFnQixLQUFLLFVBQVUsU0FBUSxZQUFZO1dBQ25ELE1BQU0sS0FBSyxVQUFVLFFBQVEsSUFBSSxjQUFLOztlQUFNLEVBQUU7Ozs7QUFvQmxELElBQUksbUJBQVMsR0FBRSxtQkFBaUI7Ozs7SUFFNUI7VUFFc0IsVUFBTDs7ZUFBZjs7bUJBRUUsS0FBTSxTQUFJLEVBQUUsMkJBQUYsRUFBRSxjQUFGLEVBQUU7O1FBRVosS0FBSyxFQUFFO21CQUVKLEdBQU07OzJCQUN3Qjs7Z0JBQTdCLFFBQVEsS0FBSzs7WUFDYixTQUFTO1lBQ1Q7O1FBRUosU0FBUyxLQUFLLEtBQUssY0FBTyxHQUFNO2FBRTdCLGlCQUFBLE9BQVEsc0JBQVE7O1lBQ2YsT0FBTyxTQUFTO1lBQ2hCLE9BQU87Ozs7MkJBRXNCOztnQkFBN0IsUUFBUSxLQUFLOztZQUNiLFVBQVMsTUFBTSxHQUFJLE1BQU0sR0FBSSxPQUFPLEVBQUUsS0FBSzs7O21CQUV0Qjs7UUFBN0IsUUFBUSxLQUFLOztXQUNiOzs7QUFRSixJQUFJLHFCQUFXOzs7O0lBRVgsSUFBSTt3QkFDVTs7O1FBQVY7UUFDQSxhQUFTLE9BQU8sTUFBTztRQUN2QixLQUFLLE9BQU87O29CQUNYOzs7QUFRVCxJQUFJLHlCQUFlOzs7O0lBRWY7SUFDQTt3QkFFd0I7U0FBYjs7UUFBUDtzQkFFa0I7O1lBQWxCOztRQUVBLFVBQVMsT0FBTyxhQUFQLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kstr.kode
