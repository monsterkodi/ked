var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var again, at, B64, back, body, c, code, cols, decode, decodeSegment, dir, eq, file, files, first, gen, gl, got, has, js, JS_FILE, json, jsonOf, k, keys, kmap, kodfiles, kplain, lines, linesOf, mapped, mapsOf, mark, missed, ms, n, name, names, out, pairs, plain, pos, prev, report, rewrites, same, sl, smap, snips, sorted, src, SRCFILE, t, text, tgt, tmpjs, tokAt, unmap, url, version, VLQ, writeJs, wrong, zero

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
    await section("sourcePosition says nothing where the map says nothing", async function ()
    {
        file = await writeJs('class Foo\n    @: ->\n        @a = 1\n    mthd: -> @a\n')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9zcmNtYXAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxNQUFNLE9BQU87QUFFYixVQUFVO0FBQ1YsVUFBVTtBQUVWLFdBQVc7O0FBRVg7O2dCQUErQixNQUFLLE9BQU8sTUFBTyxJQUFJLFFBQU0sUUFBUSxFQUFHOzs7QUFDdkU7O2dCQUFxQixNQUFLLE9BQU8sU0FBTyxRQUFRLEVBQUc7OztBQU1uRDs7OztJQU9JLElBQUksS0FBSyxRQUFRO1FBQ2QsS0FBSzs7UUFBTyxPQUFPLHFCQUFRLGlCQUFBOztXQUU5QixLQUFLOzs7QUFFVDs7V0FBb0IsS0FBSyxNQUFNLE1BQU07O0FBTXJDLE1BQU07O0FBRU47Ozs7SUFFSTtJQUNBLElBQUk7SUFDSixLQUFLO3dCQUVJOzs7O1FBQ0wsSUFBSSxJQUFJLFFBQVE7UUFDaEIsTUFBTSxJQUFJLE9BQU87UUFDakIsTUFBTTtjQUNFLElBQUk7O1lBQ1IsSUFBSSxJQUFJO1lBQ1IsSUFBSSxLQUFLLE1BQU0sSUFBSTtZQUNuQixLQUFLLEtBQVEsS0FBUSxJQUFPO1lBQzVCLElBQUk7WUFDSixLQUFLOzs7V0FFYjs7O0FBTUo7Ozs7SUFFSSxPQUFPO0lBQ1AsS0FBSyxLQUFLLFlBQVk7UUFDWixLQUFLOztlQUFiOztJQUVGLE1BQU07SUFDTixJQUFJLEtBQUssS0FBSztXQUVSLElBQUksS0FBSzs7UUFDWCxJQUFJLEtBQUs7cUJBQ0EsRUFBUzs7WUFBbEI7O1FBQ0EsT0FBTztRQUNQOztJQUVKLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxJQUFLLFVBQVU7SUFDeEM7SUFDQSxLQUFLO0lBQ0wsS0FBSzt3QkFFVyxHQUFHLFNBQVMsTUFBTTs7OztRQUM5QixLQUFLOzZCQUNNLEtBQUssTUFBTTs7OztpQkFDRjs7Z0JBQWhCOztZQUNBLElBQUksY0FBYztZQUNsQixNQUFNLEVBQUU7Z0JBQ0wsRUFBRSxVQUFVOztn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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/srcmap.kode
