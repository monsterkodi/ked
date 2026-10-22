var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var again, at, B64, back, body, c, code, cols, decode, decodeSegment, dir, eq, file, files, first, gen, gl, got, has, js, json, jsonOf, k, keys, kmap, kodfiles, kplain, lines, linesOf, mapped, mapsOf, mark, missed, ms, n, name, names, out, pairs, plain, pos, prev, PROBE, report, rewrites, root, same, sl, smap, snips, sorted, src, t, text, tgt, tmpfile, tokAt, unmap, url, version, VLQ, writeJs, wrong, zero

import kode from "../kode.js"

import srcmap from "../srcmap.js"

import slash from "../../kxk/slash.js"
import nfs from "../../kxk/nfs.js"

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

    i = code.indexOf('\n//# source')
    if (i >= 0)
    {
        code = code.slice(0, typeof i === 'number' ? i : -1)
    }
    return code.trimEnd()
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
root = '/tmp/opencode/kedsrcmap'
tmpfile = slash.path(root,'probe.js')
smap = new srcmap

writeJs = async function (c)
{
    var js

    js = kmap(c)
    await nfs.write(tmpfile,js)
    return tmpfile
}
toExport["srcmap"] = async function ()
{
    await section("the map is only written when asked for", async function ()
    {
        has = _k_.in('sourceMappingURL',kmap('a = 1'))
        compare(has,true)
        has = _k_.in('sourceMappingURL',kplain('a = 1'))
        compare(has,false)
    })
    await section("the sourceURL is written either way", async function ()
    {
        has = _k_.in('sourceURL',kmap('a = 1'))
        compare(has,true)
        has = _k_.in('sourceURL',kplain('a = 1'))
        compare(has,true)
    })
    await section("the sourceURL without a map still names the source", async function ()
    {
        url = kplain('a = 1')
        lines = url.split('\n')
        url = lines.find(function (l)
        {
            return l.startsWith('//# sourceURL=')
        })
        compare(url,`//# sourceURL=file://${PROBE}`)
    })
    await section("and it names the file by its own path", async function ()
    {
        url = kplain('a = 1')
        lines = url.split('\n')
        url = lines.find(function (l)
        {
            return l.startsWith('//# sourceURL=')
        })
        url = url.replace('//# sourceURL=file://','')
        compare(slash.isAbsolute(url),true)
        compare(url,PROBE)
    })
    await section("and the js it wraps is untouched", async function ()
    {
        mapped = kmap('a = 1')
        plain = kplain('a = 1')
        mapped = body(mapped)
        plain = body(plain)
        compare(mapped,plain)
    })
    await section("names the file it was made from", async function ()
    {
        json = jsonOf(kmap('a = 1'))
        src = json.sources
        compare(src.length,1)
        names = src[0].endsWith('kode/srcmap-probe.kode')
        compare(names,true)
        version = json.version
        compare(version,3)
    })
    await section("names it as a file:// uri", async function ()
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
    await section("names its source from where it is written", async function ()
    {
        dir = slash.path(_k_.dir(),'..','..')
        tgt = slash.path(dir,'probe.js')
        out = (new kode({header:false,map:true})).compile('a = 1',PROBE,tgt)
        name = jsonOf(out).sources[0]
        back = slash.absolute(name,slash.dir(tgt))
        compare(back,PROBE)
    })
    await section("writes the same js either way", async function ()
    {
        snips = ['a = 1','a = 1\nb = a + 2\nlog b','f = (a, b) -> a + b','class Foo\n    @: (a) ->\n        @a ?= a\n    mthd: -> @a + 1\n','x = if a ➜ 1 else 2','for i in 0...10 ➜ log i','x = "a #{b} c"','try\n    f()\ncatch e\n    log e','x = """\n    a #{b}\n    """','l = [1 2 3]\nl.map (i) -> i * 2','log b4 "hi" a','switch a\n    when 1 ➜ log "one"\n    else ➜ log "other"','x = int "42" + min 1 2 + trim " a "']
        var list = _k_.list(snips)
        for (var _f_ = 0; _f_ < list.length; _f_++)
        {
            c = list[_f_]
            mapped = kmap(c)
            unmap = kplain(c)
            mapped = body(mapped)
            unmap = body(unmap)
            eq = mapped === unmap
            compare(eq,true)
        }
    })
    await section("twice over", async function ()
    {
        c = 'class Foo\n    @bar: 1\n    mthd: -> @bar\n'
        k = new kode({header:false,map:true})
        first = k.compile(c,PROBE)
        again = k.compile(c,PROBE)
        eq = body(first) === body(again)
        compare(eq,true)
    })
    await section("points at the token it maps", async function ()
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
    await section("maps every line it can", async function ()
    {
        snips = ['a = 1\nb = a + 2\nc = b + 3\nlog c\n','f = ->\n    a = 1\n    b = a + 2\n    log b\nf()\n']
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
    await section("a class maps its body and not its head", async function ()
    {
        code = kmap('class Foo\n    @: ->\n        @a = 1\n    mthd: -> @a\n')
        out = mapsOf(code)
        lines = out.map(function (t)
        {
            return t[2]
        })
        compare(lines,[3,3,3,4,4])
    })
    await section("finds column zero", async function ()
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
    await section("maps a call", async function ()
    {
        out = mapsOf(kmap('log b\n'))
        compare(out[0],[1,0,1,0])
        compare(out[1],[1,12,1,4])
    })
    await section("maps a nested body", async function ()
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
    await section("maps a triple string", async function ()
    {
        out = mapsOf(kmap('x = """\n    abc\n    def\n    """\n'))
        compare(out[0],[3,0,1,0])
        compare(out[1],[3,4,1,4])
    })
    await section("maps an interpolation", async function ()
    {
        out = mapsOf(kmap('x = "a #{b + 1} c"\n'))
        compare(out[0],[3,0,1,0])
        compare(out[1],[3,9,1,9])
        compare(out[2],[3,13,1,13])
    })
    await section("ordered and monotonic", async function ()
    {
        snips = ['a = 1\nb = a + 2\nlog b\n','class Foo\n    @: ->\n        @a = [1 2 3]\n        for i in @a ➜ log i\n','f = (a, b) ->\n    g = -> a + b\n    g()\n']
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
    await section("no column twice", async function ()
    {
        snips = ['a = 1\nb = a + 2\nlog b\n','f = (a, b) -> if a then a + b else b - a\n']
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
    await section("the whole compiler", async function ()
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
            eq = body(out) === body(unmap)
            if (eq === false)
            {
                wrong.push(file)
            }
        }
        report = wrong.join(' ')
        compare(report,'')
    })
    await section("sourcePosition finds where a position came from", async function ()
    {
        file = await writeJs('log b\n')
        pos = await smap.sourcePosition(file,1,12)
        compare(pos.file,PROBE)
        compare(pos.line,1)
        compare(pos.col,4)
    })
    await section("sourcePosition takes columns from zero", async function ()
    {
        file = await writeJs('log b\n')
        pos = await smap.sourcePosition(file,1)
        compare(pos.line,1)
        compare(pos.col,0)
    })
    await section("sourcePosition takes lines from one", async function ()
    {
        file = await writeJs('a = 1\n')
        pos = await smap.sourcePosition(file,3,0)
        compare(pos.file,PROBE)
        compare(pos.line,1)
        compare(pos.col,0)
    })
    await section("sourcePosition says nothing where the map says nothing", async function ()
    {
        file = await writeJs('class Foo\n    @: ->\n        @a = 1\n    mthd: -> @a\n')
        pos = await smap.sourcePosition(file,1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition says nothing for a file with no map", async function ()
    {
        js = kplain('a = 1\n')
        await nfs.write(tmpfile,js)
        pos = await smap.sourcePosition(tmpfile,1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition says nothing for a file that is not there", async function ()
    {
        pos = await smap.sourcePosition(slash.path(root,'gone.js'),1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition reads the map at the foot and not the marker in the code", async function ()
    {
        c = 'x = "//# sourceMappingURL=data:application/json;base64,"\nlog x\n'
        file = await writeJs(c)
        pos = await smap.sourcePosition(file,4,0)
        compare(pos.file,PROBE)
        compare(pos.line,2)
        compare(pos.col,0)
    })
    await section("sourcePosition names the source from where the map was written", async function ()
    {
        out = (new kode({header:false,map:true})).compile('a = 1\n',PROBE,tmpfile)
        await nfs.write(tmpfile,out)
        pos = await smap.sourcePosition(tmpfile,3,0)
        compare(pos.file,PROBE)
        compare(pos.line,1)
        compare(pos.col,0)
    })
}
toExport["srcmap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zcmNtYXAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxNQUFNLE9BQU87QUFLYixRQUFRLE1BQU0sZUFBVSxLQUFLLEtBQUssS0FBSyxPQUFPOztBQUU5Qzs7Z0JBQXFCLE1BQUssT0FBTyxNQUFPLElBQUksUUFBTSxRQUFRLEVBQUc7OztBQUM3RDs7Z0JBQXFCLE1BQUssT0FBTyxTQUFPLFFBQVEsRUFBRzs7O0FBTW5EOzs7O0lBT0ksSUFBSSxLQUFLLFFBQVE7UUFDZCxLQUFLOztRQUFPLE9BQU8scUJBQVEsaUJBQUE7O1dBRTlCLEtBQUs7OztBQUVUOztXQUFvQixLQUFLLE1BQU0sTUFBTTs7QUFNckMsTUFBTTs7QUFFTjs7OztJQUVJO0lBQ0EsSUFBSTtJQUNKLEtBQUs7d0JBRUk7Ozs7UUFDTCxJQUFJLElBQUksUUFBUTtRQUNoQixNQUFNLElBQUksT0FBTztRQUNqQixNQUFNO2NBQ0UsSUFBSTs7WUFDUixJQUFJLElBQUk7WUFDUixJQUFJLEtBQUssTUFBTSxJQUFJO1lBQ25CLEtBQUssS0FBUSxLQUFRLElBQU87WUFDNUIsSUFBSTtZQUNKLEtBQUs7OztXQUViOzs7QUFNSjs7OztJQUVJLE9BQU87SUFDUCxLQUFLLEtBQUssWUFBWTtRQUNaLEtBQUs7O2VBQWI7O0lBRUYsTUFBTTtJQUNOLElBQUksS0FBSyxLQUFLO1dBRVIsSUFBSSxLQUFLOztRQUNYLElBQUksS0FBSztxQkFDQSxFQUFTOztZQUFsQjs7UUFDQSxPQUFPO1FBQ1A7O0lBRUosS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLElBQUssVUFBVTtJQUN4QztJQUNBLEtBQUs7SUFDTCxLQUFLO3dCQUVXLEdBQUcsU0FBUyxNQUFNOzs7O1FBQzlCLEtBQUs7NkJBQ00sS0FBSyxNQUFNOzs7O2lCQUNGOztnQkFBaEI7O1lBQ0EsSUFBSSxjQUFjO1lBQ2xCLE1BQU0sRUFBRTtnQkFDTCxF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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/srcmap.kode
