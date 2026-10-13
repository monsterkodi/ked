var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var again, at, B64, back, body, c, code, cols, decode, decodeSegment, dir, eq, file, files, first, gen, gl, got, has, json, jsonOf, k, keys, kmap, kodfiles, kplain, linesOf, mapped, mapsOf, mark, missed, ms, n, name, names, out, pairs, prev, PROBE, report, rewrites, same, sl, snips, sorted, src, t, text, tgt, tokAt, unmap, url, version, VLQ, wrong, zero

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
    section("names it as a file:// uri", function ()
    {
        code = kmap('a = 1')
        mark = '//# sourceURL='
        at = code.lastIndexOf(mark)
        has = at >= 0
        compare(has,true)
        url = code.slice((at + mark.length)).split('\n')[0]
        compare(url.startsWith('file://'),true)
        src = url.replace('file://','')
        compare(src.endsWith('kode/srcmap-probe.kode'),true)
        back = slash.absolute(src,process.cwd())
        compare(back,PROBE)
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
//# sourceURL=file://kode/kode/test/srcmap.kode
