var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var B64, decodeSegment, dupes, gen, keys, kmap, mappingsOf, n, out, prev, sorted, src, t, VLQ, zero

import utils from "./utils.js"
let kc = utils.kc

import buffer from "buffer"

B64 = buffer.Buffer

kmap = function (c)
{
    return kc(c,'srcmap-probe.kode',{map:true})
}
VLQ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

decodeSegment = function (s)
{
    var c, d, n, sh, v, vals

    vals = []
    v = 0
    sh = 0
    var list = _k_.list(s)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        d = VLQ.indexOf(c)
        v += (d & 31) << sh
        sh += 5
        if (!(d & 32))
        {
            n = v & 1
            v = Math.floor(v / 2)
            vals.push(n ? -v : v)
            v = 0
            sh = 0
        }
    }
    return vals
}

mappingsOf = function (code)
{
    var at, b64, c, f, gc, i, li, line, mark, out, sc, seg, sl, sm

    mark = 'sourceMappingURL=data:application/json;base64,'
    at = code.indexOf(mark)
    if (at < 0)
    {
        return []
    }
    b64 = ''
    i = at + mark.length
    while (i < code.length)
    {
        c = code[i]
        if (!(_k_.in(c,'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=')))
        {
            break
        }
        b64 += c
        i++
    }
    sm = JSON.parse(B64.from(b64,'base64').toString())
    out = []
    sl = 0
    sc = 0
    var list = _k_.list(sm.mappings.split(';'))
    for (li = 0; li < list.length; li++)
    {
        line = list[li]
        gc = 0
        var list1 = _k_.list(line.split(','))
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            seg = list1[_c_]
            if (!seg)
            {
                continue
            }
            f = decodeSegment(seg)
            gc += f[0]
            if (f.length >= 4)
            {
                sl += f[2]
                sc += f[3]
                out.push([li + 1,gc,sl + 1,sc])
            }
        }
    }
    return out
}
toExport["srcmap"] = function ()
{
    section("on by default", function ()
    {
        compare(_k_.in('sourceMappingURL',kmap('a = 1')),true)
        compare(_k_.in('sourceURL',kmap('a = 1')),true)
    })
    section("maps every line", function ()
    {
        out = mappingsOf(kmap,'a = 1\nb = a + 2\nlog b\n')
        gen = out.map(function (t)
        {
            return t[0]
        })
        compare(gen,[5,5,6,6,6,7,7])
        src = out.map(function (t)
        {
            return t[2]
        })
        compare(src,[1,1,2,2,2,3,3])
    })
    section("finds column zero", function ()
    {
        out = mappingsOf(kmap,'a = 1\nb = a + 2\n')
        zero = out.filter(function (t)
        {
            return t[1] === 0
        }).map(function (t)
        {
            return t[0]
        })
        compare(zero,[5,6])
    })
    section("maps a nested body", function ()
    {
        out = mappingsOf(kmap,'f = ->\n    a = 1\n    b = a + 2\nf()\n')
        gen = out.map(function (t)
        {
            return t[0]
        })
        compare(gen,[6,8,10,11,11,11,13])
        src = out.map(function (t)
        {
            return t[2]
        })
        compare(src,[1,2,2,3,3,3,4])
    })
    section("no duplicate columns", function ()
    {
        out = mappingsOf(kmap,'a = 1\nb = a + 2\nlog b\n')
        keys = out.map(function (t)
        {
            return `${t[0]}:${t[1]}`
        })
        dupes = keys.filter(function (k, i)
        {
            return keys.indexOf(k) !== i
        })
        n = dupes.length
        compare(n,0)
    })
    section("ordered and monotonic", function ()
    {
        out = mappingsOf(kmap,'a = 1\nb = a + 2\nc = b + 3\nlog c\n')
        sorted = true
        prev = [-1,-1]
        var list = _k_.list(out)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            t = list[_d_]
            if (t[0] < prev[0] || (t[0] === prev[0] && t[1] <= prev[1]))
            {
                sorted = false
            }
            prev = [t[0],t[1]]
        }
        compare(sorted,true)
    })
}
toExport["srcmap"]._section_ = true
toExport._test_ = true
export default toExport
