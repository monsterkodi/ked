var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var again, B64, back, body, c, cols, decode, decodeSegment, dir, eq, file, files, first, gen, gl, got, has, json, jsonOf, k, keys, kmap, kodfiles, kplain, linesOf, mapped, mapsOf, missed, ms, n, name, names, out, pairs, prev, PROBE, report, rewrites, same, sl, snips, sorted, src, t, text, tgt, tokAt, unmap, version, VLQ, wrong, zero

import kode from "../kode.js"

import slash from "../../kxk/slash.js"

import buffer from "buffer"

import fs from "fs"

B64 = buffer.Buffer
PROBE = slash.path(_k_.dir(),'..','..','..','kode','srcmap-probe.kode')

kmap = function (c)
{
    return (new kode({header:false,map:true})).compile(c,PROBE)
}

kplain = function (c)
{
    return (new kode({header:false})).compile(c,PROBE)
}

body = function (code)
{
    var i

    i = code.lastIndexOf('\n\n//# sourceMappingURL')
    return (i < 0 ? code : code.slice(0, typeof i === 'number' ? i : -1))
}

linesOf = function (code)
{
    return body(code).split('\n')
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

decode = function (code)
{
    var at, b64, c, f, gc, i, li, line, mark, out, sc, seg, sl, sm

    mark = 'sourceMappingURL=data:application/json;base64,'
    at = code.lastIndexOf(mark)
    if (at < 0)
    {
        return null
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
    return [sm,out]
}

mapsOf = function (code)
{
    var r

    r = decode(code)
    return (r ? r[1] : [])
}

jsonOf = function (code)
{
    var r

    r = decode(code)
    return (r ? r[0] : {})
}

tokAt = function (lines, line, col)
{
    var l, m

    l = lines[line - 1]
    if (!(l != null))
    {
        return ''
    }
    m = /^[\w$]+/.exec(l.slice(col))
    return (m ? m[0] : l[col])
}
rewrites = {log:'console.',warn:'console.',error:'console.',yes:'true',no:'false','@':'this','"':'`','●':'_k_.profile','●▸':'_k_.profile','●▪':'_k_.profilend',in:'_k_.in',valid:'!_k_.empty',empty:'_k_.empty',eql:'_k_.eql'}

same = function (st, gt)
{
    if (gt.startsWith(st))
    {
        return true
    }
    if (!(rewrites[st] != null))
    {
        return false
    }
    return gt.startsWith(rewrites[st])
}

pairs = function (c)
{
    var code, gl, gt, out, sl, st, t

    code = kmap(c)
    gl = linesOf(code)
    sl = c.split('\n')
    out = []
    var list = _k_.list(mapsOf(code))
    for (var _d_ = 0; _d_ < list.length; _d_++)
    {
        t = list[_d_]
        st = tokAt(sl,t[2],t[3])
        gt = (gl[t[0] - 1] != null ? gl[t[0] - 1].slice(t[1]) : undefined) || ''
        out.push([t,st,gt])
    }
    return out
}

kodfiles = function (dir, out = [])
{
    var name, p

    var list = _k_.list(fs.readdirSync(dir))
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        name = list[_e_]
        p = slash.path(dir,name)
        if (fs.statSync(p).isDirectory())
        {
            kodfiles(p,out)
        }
        else if (p.endsWith('.kode'))
        {
            out.push(p)
        }
    }
    return out
}
toExport["srcmap"] = function ()
{
    section("only when asked for", function ()
    {
        has = _k_.in('sourceMappingURL',kmap('a = 1'))
        compare(has,true)
        has = _k_.in('sourceURL',kmap('a = 1'))
        compare(has,true)
        has = _k_.in('sourceMappingURL',kplain('a = 1'))
        compare(has,false)
        has = _k_.in('sourceURL',kplain('a = 1'))
        compare(has,false)
    })
    section("names the file it was made from", function ()
    {
        json = jsonOf(kmap('a = 1'))
        src = json.sources
        compare(src.length,1)
        names = src[0].endsWith('kode/srcmap-probe.kode')
        compare(names,true)
        version = json.version
        compare(version,3)
    })
    section("names its source from where it is written", function ()
    {
        dir = slash.path(_k_.dir(),'..','..')
        tgt = slash.path(dir,'probe.js')
        out = (new kode({header:false,map:true})).compile('a = 1',PROBE,tgt)
        name = jsonOf(out).sources[0]
        back = slash.absolute(name,slash.dir(tgt))
        compare(back,PROBE)
    })
    section("writes the same js either way", function ()
    {
        snips = 'a = 1'
        var list = _k_.list(snips)
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            c = list[_f_]
            mapped = body(kmap(c))
            unmap = kplain(c)
            eq = mapped === unmap
            compare(eq,true)
        }
    })
    section("twice over", function ()
    {
        c = 'class Foo\n    @bar: 1\n    mthd: -> @bar\n'
        k = new kode({header:false,map:true})
        first = k.compile(c,PROBE)
        again = k.compile(c,PROBE)
        eq = body(first) === body(again)
        compare(eq,true)
    })
    section("points at the token it maps", function ()
    {
        out = pairs('a = 1\nb = a + 2\nc = b + 3\nlog c\n')
        wrong = out.filter(function (t)
        {
            var ok

            ok = same(t[1],t[2])
            return ok === false
        })
        report = wrong.map(function (t)
        {
            return `${t[0]} ${t[1]} ${t[2].slice(0, 13)}`
        }).join(' ')
        compare(report,'')
    })
    section("maps every line it can", function ()
    {
        snips = 'a = 1\nb = a + 2\nc = b + 3\nlog c\n'
        var list1 = _k_.list(snips)
        for (var _10_ = 0; _10_ < list1.length; _10_++)
        {
            c = list1[_10_]
            sl = c.split('\n').map(function (l, i)
            {
                if (_k_.trim(l))
                {
                    return i + 1
                }
                else
                {
                    return 0
                }
            }).filter(function (l)
            {
                return l
            })
            ms = mapsOf(kmap(c))
            got = ms.map(function (t)
            {
                return t[2]
            })
            missed = sl.filter(function (l)
            {
                return !(_k_.in(l,got))
            })
            compare(missed,[])
        }
    })
    section("finds column zero", function ()
    {
        out = mapsOf(kmap('a = 1\nb = a + 2\nlog b\n'))
        zero = out.filter(function (t)
        {
            return t[1] === 0
        }).map(function (t)
        {
            return t[0]
        })
        compare(zero,[3,4,5])
    })
    section("maps a call", function ()
    {
        out = mapsOf(kmap('log b\n'))
        compare(out[0],[1,0,1,0])
        compare(out[1],[1,12,1,4])
    })
    section("maps a nested body", function ()
    {
        c = 'f = ->\n    a = 1\n    b = a + 2\nf()\n'
        out = mapsOf(kmap(c))
        gl = linesOf(kmap(c))
        gen = out.map(function (t)
        {
            return t[0]
        })
        compare(gen,[4,8,8,9,9,9,11])
        src = out.map(function (t)
        {
            return t[2]
        })
        compare(src,[1,2,2,3,3,3,4])
        cols = out.filter(function (t)
        {
            return t[2] === 3
        }).map(function (t)
        {
            return t[1]
        })
        compare(cols,[11,15,19])
        text = gl[8].slice(11)
        compare(text,'b = a + 2')
    })
    section("maps a triple string", function ()
    {
        out = mapsOf(kmap('x = """\n    abc\n    def\n    """\n'))
        compare(out[0],[3,0,1,0])
        compare(out[1],[3,4,1,4])
    })
    section("maps an interpolation", function ()
    {
        out = mapsOf(kmap('x = "a #{b + 1} c"\n'))
        compare(out[0],[3,0,1,0])
        compare(out[1],[3,9,1,9])
        compare(out[2],[3,13,1,13])
    })
    section("ordered and monotonic", function ()
    {
        snips = 'a = 1\nb = a + 2\nlog b\n'
        var list2 = _k_.list(snips)
        for (var _11_ = 0; _11_ < list2.length; _11_++)
        {
            c = list2[_11_]
            sorted = true
            prev = [-1,-1]
            var list3 = _k_.list(mapsOf(kmap(c)))
            for (var _12_ = 0; _12_ < list3.length; _12_++)
            {
                t = list3[_12_]
                if (t[0] < prev[0] || (t[0] === prev[0] && t[1] <= prev[1]))
                {
                    sorted = false
                }
                prev = [t[0],t[1]]
            }
            compare(sorted,true)
        }
    })
    section("no column twice", function ()
    {
        snips = 'a = 1\nb = a + 2\nlog b\n'
        var list4 = _k_.list(snips)
        for (var _13_ = 0; _13_ < list4.length; _13_++)
        {
            c = list4[_13_]
            ms = mapsOf(kmap(c))
            keys = ms.map(function (t)
            {
                return `${t[0]}:${t[1]}`
            })
            n = keys.filter(function (k, i)
            {
                return keys.indexOf(k) !== i
            }).length
            compare(n,0)
        }
    })
    section("the whole compiler", function ()
    {
        dir = slash.path(_k_.dir(),'..','..','..','kode','kode')
        files = kodfiles(dir)
        compare(files.length > 20,true)
        wrong = []
        var list5 = _k_.list(files)
        for (var _14_ = 0; _14_ < list5.length; _14_++)
        {
            file = list5[_14_]
            text = fs.readFileSync(file,'utf8')
            out = (new kode({header:false,map:true})).compile(text,file)
            if (!(out != null))
            {
                continue
            }
            if (file.endsWith('srcmap-probe.kode'))
            {
                continue
            }
            unmap = (new kode({header:false})).compile(text,file)
            eq = body(out) === unmap
            if (eq === false)
            {
                wrong.push(file)
            }
        }
        report = wrong.join(' ')
        compare(report,'')
    })
}
toExport["srcmap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zcmNtYXAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXlCQSxNQUFNLE9BQU87QUFLYixRQUFRLE1BQU0sZUFBVSxLQUFLLEtBQUssS0FBSyxPQUFPOztBQUU5Qzs7Z0JBQXFCLE1BQUssT0FBTyxNQUFPLElBQUksUUFBTSxRQUFRLEVBQUc7OztBQUM3RDs7Z0JBQXFCLE1BQUssT0FBTyxTQUFPLFFBQVEsRUFBRzs7O0FBS25EOzs7O0lBSUksSUFBSSxLQUFLLFlBQVk7WUFDckIsSUFBSSxJQUFJLE9BQU8scUJBQVEsaUJBQUE7OztBQUUzQjs7V0FBb0IsS0FBSyxNQUFNLE1BQU07O0FBTXJDLE1BQU07O0FBRU47Ozs7SUFFSTtJQUNBLElBQUk7SUFDSixLQUFLO3dCQUVJOzs7O1FBQ0wsSUFBSSxJQUFJLFFBQVE7UUFDaEIsTUFBTSxJQUFJLE9BQU87UUFDakIsTUFBTTtjQUNFLElBQUk7O1lBQ1IsSUFBSSxJQUFJO1lBQ1IsSUFBSSxLQUFLLE1BQU0sSUFBSTtZQUNuQixLQUFLLEtBQVEsS0FBUSxJQUFPO1lBQzVCLElBQUk7WUFDSixLQUFLOzs7V0FFYjs7O0FBTUo7Ozs7SUFFSSxPQUFPO0lBQ1AsS0FBSyxLQUFLLFlBQVk7UUFDWixLQUFLOztlQUFiOztJQUVGLE1BQU07SUFDTixJQUFJLEtBQUssS0FBSztXQUVSLElBQUksS0FBSzs7UUFDWCxJQUFJLEtBQUs7cUJBQ0EsRUFBUzs7WUFBbEI7O1FBQ0EsT0FBTztRQUNQOztJQUVKLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxJQUFLLFVBQVU7SUFDeEM7SUFDQSxLQUFLO0lBQ0wsS0FBSzt3QkFFVyxHQUFHLFNBQVMsTUFBTTs7OztRQUM5QixLQUFLOzZCQUNNLEtBQUssTUFBTTs7OztpQkFDRjs7Z0JBQWhCOztZQUNBLElBQUksY0FBYztZQUNsQixNQUFNLEVBQUU7Z0JBQ0wsRUFBRSxVQUFVOztnQkFD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
//# sourceURL=kode/kode/test/srcmap.kode
