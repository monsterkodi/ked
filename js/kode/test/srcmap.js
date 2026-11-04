var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var again, at, B64, back, body, c, code, cols, decode, decodeSegment, dir, eq, file, first, gen, gl, got, has, js, JS_FILE, json, jsonOf, k, keys, kmap, kodfiles, kplain, lines, linesOf, mapped, mapsOf, mark, missed, ms, n, name, names, out, pairs, plain, pos, prev, report, rewrites, same, sl, smap, snips, sorted, src, SRCFILE, t, text, tgt, tmpjs, tokAt, unmap, url, version, VLQ, writeJs, wrong, zero

import kode from "../kode.js"

import srcmap from "../srcmap.js"

import slash from "../../kxk/slash.js"
import nfs from "../../kxk/nfs.js"

import buffer from "buffer"
import fs from "fs"

B64 = buffer.Buffer
JS_FILE = '/tmp/probe.js'
SRCFILE = '/tmp/probe.kode'
smap = new srcmap

kmap = function (c, s = SRCFILE)
{
    return (new kode({header:false,map:true})).compile(c,s)
}

kplain = function (c)
{
    return (new kode({header:false})).compile(c,SRCFILE)
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

writeJs = async function (c, file = JS_FILE)
{
    var js, s

    s = slash.swapExt(file,'kode')
    js = kmap(c,s)
    await nfs.write(file,js)
    return file
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
        compare(url,`//# sourceURL=file://${SRCFILE}`)
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
        compare(url,SRCFILE)
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
        names = src[0].endsWith('probe.kode')
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
        compare(src.endsWith('probe.kode'),true)
        back = slash.absolute(src,process.cwd())
        compare(back,SRCFILE)
    })
    await section("names its source from where it is written", async function ()
    {
        dir = slash.path(_k_.dir(),'..','..')
        tgt = slash.path(dir,'probe.js')
        out = (new kode({header:false,map:true})).compile('a = 1',SRCFILE,tgt)
        name = jsonOf(out).sources[0]
        back = slash.absolute(name,slash.dir(tgt))
        compare(back,SRCFILE)
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
        first = k.compile(c,SRCFILE)
        again = k.compile(c,SRCFILE)
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
    await section("maps every name", async function ()
    {
        snips = ['a = 1\nb = a + 2\nlog b\n','f = (a, b) -> a + b\nf 1 2\n','g = (x) -> x * 2\n','class Foo\n    @: (a) ->\n        @a = a\n    mthd: (b) -> @a + b\n','function Bar\n    @: (x) ->\n        @x = x\n    mthd: (y) -> @x + y\n','class Members\n    @value: 1\n    @method: (x) -> @value + x\n','function Old\n    @value: 1\n','for i in 0...10 ➜ log i\n','for a,b in [1 2] ➜ log a b\n','for a,b of {x:1} ➜ log a b\n','[a b] = f()\n','a = 1\nb = a is num\n','f = (@x) -> @x\n','f = (@x=1) -> @x\n','f = (c=klor.y5, d=@dir) -> c\n','f = ([l,c]) -> l + c\n','x = ◆dir\ny = ◆file\n','◆main\n    log "hi"\n','log r5("red")\nlog R3(y5("x"))\n','use ./snippet ▪ alpha beta\n','l = [1 2 3]\nl.map (i) -> i * 2\n','try\n    f()\ncatch e\n    log e\n','switch a\n    when 1 ➜ log "one"\n    else ➜ log "other"\n']
        var list2 = _k_.list(snips)
        for (var _11_ = 0; _11_ < list2.length; _11_++)
        {
            c = list2[_11_]
            names = (new kode({header:false})).lexer.tokenize(c).filter(function (t)
            {
                return _k_.in(t.type,['var','this'])
            })
            got = mapsOf(kmap(c)).map(function (t)
            {
                return `${t[2]}:${t[3]}`
            })
            missed = names.filter(function (t)
            {
                return !(_k_.in(`${t.line}:${t.col}`,got))
            })
            report = missed.map(function (t)
            {
                return `${t.text} at ${t.line}:${t.col}`
            }).join(' ')
            compare(report,'')
        }
    })
    await section("a class maps its head and its body", async function ()
    {
        code = kmap('class Foo\n    @: ->\n        @a = 1\n    mthd: -> @a\n')
        out = mapsOf(code)
        lines = out.map(function (t)
        {
            return t[2]
        })
        compare(lines,[1,1,2,3,3,3,4,4,4])
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
        var list3 = _k_.list(snips)
        for (var _12_ = 0; _12_ < list3.length; _12_++)
        {
            c = list3[_12_]
            sorted = true
            prev = [-1,-1]
            var list4 = _k_.list(mapsOf(kmap(c)))
            for (var _13_ = 0; _13_ < list4.length; _13_++)
            {
                t = list4[_13_]
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
        var list5 = _k_.list(snips)
        for (var _14_ = 0; _14_ < list5.length; _14_++)
        {
            c = list5[_14_]
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
    await section("sourcePosition finds where a position came from", async function ()
    {
        file = await writeJs('log b\n')
        pos = await smap.sourcePosition(file,1,12)
        compare(pos.file,SRCFILE)
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
        compare(pos.file,SRCFILE)
        compare(pos.line,1)
        compare(pos.col,0)
    })
    await section("sourcePosition says nothing before the first mapping", async function ()
    {
        file = await writeJs('a = 1\n')
        pos = await smap.sourcePosition(file,1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition says nothing for a file with no map", async function ()
    {
        js = kplain('a = 1\n')
        await nfs.write(JS_FILE,js)
        pos = await smap.sourcePosition(JS_FILE,1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition says nothing for a file that is not there", async function ()
    {
        pos = await smap.sourcePosition(slash.path('/tmp','gone.js'),1,0)
        compare(pos,undefined)
    })
    await section("sourcePosition reads the map at the foot and not the marker in the code", async function ()
    {
        c = 'x = "//# sourceMappingURL=data:application/json;base64,"\nlog x\n'
        file = await writeJs(c)
        pos = await smap.sourcePosition(file,4,0)
        compare(pos.file,SRCFILE)
        compare(pos.line,2)
        compare(pos.col,0)
    })
    await section("sourcePosition for function", async function ()
    {
        tmpjs = slash.tmpfile() + ".js"
        file = await writeJs(`test = ->
    log "hello"`,tmpjs)
        pos = await smap.sourcePosition(file,4,0)
        compare(pos.line,1)
        compare(pos.col,0)
    })
    await section("sourcePosition for function method", async function ()
    {
        tmpjs = slash.tmpfile() + ".js"
        file = await writeJs(`function Test
    @: ->
    method: -> log "hello"`,tmpjs)
        pos = await smap.sourcePosition(file,9,5)
        compare(!_k_.empty(pos),true)
    })
    await section("sourcePosition names the source from where the map was written", async function ()
    {
        out = (new kode({header:false,map:true})).compile('a = 1\n',SRCFILE,JS_FILE)
        await nfs.write(JS_FILE,out)
        pos = await smap.sourcePosition(JS_FILE,3,0)
        compare(pos.file,SRCFILE)
        compare(pos.line,1)
        compare(pos.col,0)
    })
}
toExport["srcmap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zcmNtYXAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDTyxXQUFBOztPQUNBLGFBQUE7O09BQ1MsWUFBTjtPQUFZLFVBQVo7O09BQ04sYUFBQTtPQUFPLFNBQUE7O0FBRVgsTUFBTSxPQUFPO0FBRWIsVUFBVTtBQUNWLFVBQVU7QUFFVixXQUFXOztBQUVYLGlCQUFVLEdBQUUsSUFBRTs7Z0JBQWlCLE1BQUssT0FBTyxNQUFPLElBQUksUUFBTSxRQUFRLEVBQUc7OztBQUN2RSxtQkFBVTs7Z0JBQVcsTUFBSyxPQUFPLFNBQU8sUUFBUSxFQUFHOzs7QUFFbkQsaUJBQVE7Ozs7SUFFSixJQUFJLEtBQUssUUFBUTtRQUNkLEtBQUs7O1FBQU8sT0FBTyxxQkFBUSxpQkFBQTs7V0FFOUIsS0FBSzs7O0FBRVQsb0JBQVc7O1dBQVMsS0FBSyxNQUFNLE1BQU07O0FBRXJDLE1BQU07O0FBRU4sMEJBQWlCOzs7O0lBRWI7SUFDQSxJQUFJO0lBQ0osS0FBSzt3QkFFSTs7O1FBQUw7UUFDQSxJQUFJLElBQUksUUFBUTtRQUNoQixNQUFNLElBQUksT0FBTztRQUNqQixNQUFNO2NBQ0UsSUFBSTs7WUFDUixJQUFJLElBQUk7WUFDUixJQUFJLEtBQUssTUFBTSxJQUFJO1lBQ25CLEtBQUssS0FBUSxLQUFRLElBQU87WUFDNUIsSUFBSTtZQUNKLEtBQUs7OztXQUViOzs7QUFFSixtQkFBVTs7OztJQUVOLE9BQU87SUFDUCxLQUFLLEtBQUssWUFBWTtRQUNaLEtBQUs7O2VBQWI7O0lBRUYsTUFBTTtJQUNOLElBQUksS0FBSyxLQUFLO1dBRVIsSUFBSSxLQUFLOztRQUNYLElBQUksS0FBSztxQkFDQSxFQUFTOztZQUFsQjs7UUFDQSxPQUFPO1FBQ1A7O0lBRUosS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLElBQUssVUFBVTtJQUN4QztJQUNBLEtBQUs7SUFDTCxLQUFLO3dCQUVXLEdBQUcsU0FBUyxN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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/srcmap.kode
