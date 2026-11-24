var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, afterWord, bangComment, base, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, commentStyle, commentStyles, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, file, FILEXT, fillBangComment, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handler, handlers, hashComment, HEADER, HEX, HEXNUM, hnd, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, KODESYMS, kodeWord, kolorize, kolorizeChunks, kolorPunct, LI, line, luaComment, luaString, mdPunct, MDSPAN, mdString, mdTag, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonKey, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, punct, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, spaced, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, UNICODE, unicodeDoc, unicodeKey, urlPunct, urlWord, wordKey, xmlPunct

import fs from "fs"
import path from "path"

import kseg from "../kxk/kseg.js"

import klor from "../kxk/klor.js"

import extlang from "./extlang.js"
let exts = extlang.exts
let lang = extlang.lang

swtch = {pug:{script:{next:'.',to:'js',indent:1}},md:{coffeescript:{turd:'```',to:'coffee',end:'```',add:'code triple'},javascript:{turd:'```',to:'js',end:'```',add:'code triple'}}}
var list = _k_.list(exts)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    ext = list[_a_]
    swtch.md[ext] = {turd:'```',to:ext,end:'```',add:'code triple'}
}
SPACE = /\s/
HEADER = /^[0█]+$/u
PUNCT = /[^\wäöüßÄÖÜáéíóúÁÉÍÓÚñÑçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕåÅæÆœŒøØłŁđĐÀËÏÐÝÞëïðþÿĀ-ſ]+/u
NUMBER = /^\d+$/
FLOAT = /^\d+f$/
HEXNUM = /^0x[a-fA-F\d]+$/
HEX = /^[a-fA-F\d]+$/
NEWLINE = /\r?\n/
LI = /(\sli\d\s|\sh\d\s)/
UNICODE = {kode:'■□▪◆●◯▸➜⮐…',latin:[[0x00c0,0x00d6],[0x00d8,0x00f6],[0x00f8,0x024f],[0x1e00,0x1eff]],greek:[[0x0370,0x03ff],[0x1f00,0x1fff]],cyrillic:[[0x0400,0x052f],[0x2de0,0x2dff],[0xa640,0xa69f]],symbol:[[0x00a1,0x00bf],[0x00d7,0x00d7],[0x00f7,0x00f7]],punct:[[0x2010,0x205e]],arrow:[[0x2190,0x21ff],[0x27f0,0x27ff],[0x2900,0x297f],[0x2b00,0x2bff]],math:[[0x2200,0x22ff],[0x2a00,0x2aff]],box:[[0x2500,0x259f]],geometric:[[0x25A0,0x25ff]],cjk:[[0x3040,0x30ff],[0x4e00,0x9fff],[0xac00,0xd7af]]}

unicodeKey = function (ch)
{
    var cp, key, r, val

    for (key in UNICODE)
    {
        val = UNICODE[key]
        if (_k_.isStr(val) && val.includes(ch))
        {
            return key
        }
    }
    cp = ch.codePointAt(0)
    for (key in UNICODE)
    {
        val = UNICODE[key]
        if (_k_.isArr(val))
        {
            var list1 = _k_.list(val)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                r = list1[_b_]
                if ((r[0] <= cp && cp <= r[1]))
                {
                    return key
                }
            }
        }
    }
    return null
}

wordKey = function (segs)
{
    var ch, k, key, sg

    key = null
    var list1 = _k_.list(segs)
    for (var _c_ = 0; _c_ < list1.length; _c_++)
    {
        sg = list1[_c_]
        ch = kseg.str(sg)
        if (ch.codePointAt(0) < 0x80)
        {
            return null
        }
        k = unicodeKey(ch)
        if (!k || (key && k !== key))
        {
            return null
        }
        key = k
    }
    return key
}

unicodeDoc = function ()
{
    var b, bases, BASES, ch, cp, cs, head, hex, key, ms, pairs, printable, r, rows, s, val, _95_27_

    printable = function (c)
    {
        return !/[\p{Cn}\p{M}\p{Cs}\p{Co}\p{Cc}\p{Cf}\p{Z}]/u.test(c) && c.normalize('NFC') === c
    }
    hex = function (n)
    {
        return '0x' + n.toString(16).padStart(4,'0')
    }
    rows = function (cs)
    {
        var i, r

        r = []
        for (i = 0; i < cs.length; i += 32)
        {
            r.push(cs.slice(i,i + 32).join(' '))
        }
        return r.join('\n')
    }
    BASES = {cyrillic:'аоеи',greek:'αοει',latin:'aoei',cjk:'あいうえ'}
    pairs = function (ps)
    {
        var i, r

        r = []
        for (i = 0; i < ps.length; i += 10)
        {
            r.push(ps.slice(i,i + 10).join('  '))
        }
        return r.join('\n')
    }
    s = '# kulur\n\n'
    for (key in UNICODE)
    {
        val = UNICODE[key]
        s += `## ${key}\n\n`
        if (_k_.isStr(val))
        {
            s += Array.from(val).join(' ') + '\n\n'
            continue
        }
        bases = ((_95_27_=BASES[key]) != null ? _95_27_ : 'aoei')
        var list1 = _k_.list(val)
        for (var _d_ = 0; _d_ < list1.length; _d_++)
        {
            r = list1[_d_]
            head = `${hex(r[0])} - ${hex(r[1])}`
            cs = []
            ms = []
            for (cp = r[0]; cp <= r[1]; cp++)
            {
                ch = String.fromCodePoint(cp)
                if (printable(ch))
                {
                    cs.push(ch)
                }
                else if (/^\p{M}$/u.test(ch))
                {
                    b = bases[ms.length % bases.length]
                    if ((b + ch).normalize('NFC') === b + ch)
                    {
                        ms.push(b + ' ' + b + ch)
                    }
                }
            }
            if (_k_.empty(cs))
            {
                s += head + `  ■ ${ms.length} combining marks\n\n` + pairs(ms) + '\n\n'
                continue
            }
            if (cs.length > 320)
            {
                s += head + `  ■ 320 □ ${cs.length}\n\n` + rows(cs.slice(0,160)) + '\n...\n' + rows(cs.slice(-160)) + '\n\n'
            }
            else
            {
                s += head + `  ■ ${cs.length}\n\n` + rows(cs) + '\n\n'
            }
            if (!_k_.empty(ms))
            {
                s += `combining marks  ■ ${ms.length}\n\n` + pairs(ms) + '\n\n'
            }
        }
    }
    s += '## outside of the table\n\n'
    s += '✔ ✘ ☀ ★ 😀 🌈 get plain `text unicode`, © ° ± are `symbol`, ASCII like , ; ( ) stays `punct`.\n'
    return s
}
codeTypes = ['interpolation','code triple']

base = function (s)
{
    if (!s)
    {
        return ''
    }
    if (s.length === 1)
    {
        return s
    }
    return String.fromCodePoint(s.codePointAt(0))
}

chunked = function (segls, ext)
{
    var b, chnk, chnk2, chnks, chunkd, chunks, clss, l, lastWord, lastWordIndex, lineno, m, pushLastWord, s, segIndex, segs, sg, t, tb, turd, uniko, widths, wsum

    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    if (!(_k_.in(ext,exts)))
    {
        ext = 'txt'
    }
    lineno = 0
    chunkd = []
    var list1 = _k_.list(segls)
    for (var _e_ = 0; _e_ < list1.length; _e_++)
    {
        segs = list1[_e_]
        segs = kseg.segl(segs)
        chnks = {chunks:[],chars:0,index:lineno++,number:lineno,ext:ext}
        chunkd.push(chnks)
        if (_k_.empty(segs))
        {
            continue
        }
        chunks = kseg.chunks(kseg.detab(segs))
        if (_k_.empty(chunks))
        {
            continue
        }
        widths = [0]
        wsum = 0
        var list2 = _k_.list(segs)
        for (var _f_ = 0; _f_ < list2.length; _f_++)
        {
            sg = list2[_f_]
            wsum += kseg.width(sg)
            widths.push(wsum)
        }
        lastWord = null
        lastWordIndex = -1
        pushLastWord = function ()
        {
            var clss, wk

            if (lastWord !== null)
            {
                wk = wordKey(lastWord)
                clss = (wk ? 'text unicode ' + wk : 'text')
                chnks.chunks.push({start:widths[lastWordIndex],length:kseg.width(lastWord),match:kseg.str(lastWord),text:kseg.str(lastWord),clss:clss})
                lastWord = null
                return lastWordIndex = -1
            }
        }
        var list3 = _k_.list(chunks)
        for (var _10_ = 0; _10_ < list3.length; _10_++)
        {
            chnk = list3[_10_]
            pushLastWord()
            var list4 = _k_.list(chnk.segl)
            for (segIndex = 0; segIndex < list4.length; segIndex++)
            {
                s = list4[segIndex]
                b = base(s)
                if (m = PUNCT.exec(b))
                {
                    pushLastWord()
                    turd = ''
                    var list5 = _k_.list(chnk.segl.slice(segIndex))
                    for (var _12_ = 0; _12_ < list5.length; _12_++)
                    {
                        t = list5[_12_]
                        tb = base(t)
                        if (PUNCT.test(tb))
                        {
                            turd += tb
                        }
                        else
                        {
                            break
                        }
                    }
                    clss = 'punct'
                    uniko = unicodeKey(b)
                    if (uniko === 'kode')
                    {
                        clss = 'punct'
                    }
                    else if (uniko)
                    {
                        clss = 'text unicode ' + uniko
                    }
                    else if (b.charCodeAt(0) >= 2000)
                    {
                        clss = 'text unicode'
                    }
                    else
                    {
                        clss = 'punct'
                        if (_k_.in(b,[',',';','{','}','(',')']))
                        {
                            clss += ' minor'
                        }
                    }
                    chnk2 = {start:widths[chnk.index + segIndex],length:kseg.width(s),match:b,text:s,turd:turd,clss:clss}
                    if (uniko === 'kode')
                    {
                        chnk2.kodesym = true
                    }
                    chnks.chunks.push(chnk2)
                }
                else
                {
                    if (lastWord === null)
                    {
                        lastWord = []
                        lastWordIndex = chnk.index + segIndex
                    }
                    lastWord.push(s)
                }
            }
        }
        pushLastWord()
        if (chnks.chunks.length)
        {
            l = _k_.last(chnks.chunks)
            chnks.chars = l.start + l.length
        }
    }
    return chunkd
}
extStack = []
stack = []
handl = []
extTop = null
stackTop = null
notCode = false
topType = ''
ext = ''
line = null
chunk = null
chunkIndex = 0

fillComment = function (n)
{
    var c, i, mightBeHeader, restChunks

    for (i = 0; i < n; i++)
    {
        addValue(i,'comment')
    }
    if (chunkIndex < line.chunks.length - n)
    {
        restChunks = line.chunks.slice(chunkIndex + n)
        mightBeHeader = true
        var list1 = _k_.list(restChunks)
        for (var _13_ = 0; _13_ < list1.length; _13_++)
        {
            c = list1[_13_]
            c.clss = 'comment'
            if (mightBeHeader && !HEADER.test(c.match))
            {
                mightBeHeader = false
            }
        }
        if (mightBeHeader)
        {
            var list2 = _k_.list(restChunks)
            for (var _14_ = 0; _14_ < list2.length; _14_++)
            {
                c = list2[_14_]
                c.clss += ' header'
            }
        }
    }
    return line.chunks.length - chunkIndex + n
}

bangComment = function (n, name)
{
    var c

    addAndJoinValues(n,`comment ${name}`)
    var list1 = _k_.list(line.chunks.slice(chunkIndex + 1))
    for (var _15_ = 0; _15_ < list1.length; _15_++)
    {
        c = list1[_15_]
        c.clss = `comment ${name}`
    }
    return line.chunks.length - chunkIndex
}

hashComment = function ()
{
    if (stackTop && topType !== 'regexp triple')
    {
        return
    }
    if (stackTop && stackTop.lineno === line.number)
    {
        return
    }
    return fillBangComment()
}

fillBangComment = function ()
{
    var _289_21_, _292_21_

    if (chunk.match === "#")
    {
        if ((chunk.turd != null ? chunk.turd.startsWith('#!') : undefined))
        {
            return bangComment(2,'bang!')
        }
        if ((chunk.turd != null ? chunk.turd.startsWith('##') : undefined))
        {
            return bangComment(2,'bang')
        }
        return fillComment(1)
    }
}

noonComment = function ()
{
    if (stackTop)
    {
        return
    }
    if (chunkIndex === 0)
    {
        return fillBangComment()
    }
}

slashComment = function ()
{
    var _308_17_

    if (stackTop)
    {
        return
    }
    if ((chunk.turd != null ? chunk.turd.startsWith("//") : undefined))
    {
        return fillComment(2)
    }
}

blockComment = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    type = 'comment triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (chunk.turd.slice(0, 3) === '###')
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,strong:true})
        }
        return addAndJoinValues(3,type)
    }
}

nimComment = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    type = 'comment triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (_k_.in(chunk.turd.slice(0, 3),["#[","]#"]))
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,strong:true})
        }
        return addAndJoinValues(2,type)
    }
}

luaComment = function ()
{
    var type, _349_17_

    if (stackTop)
    {
        return
    }
    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    if ((chunk.turd != null ? chunk.turd.startsWith("--") : undefined))
    {
        fillComment(2)
        return
    }
    if (chunk.turd.length < 2)
    {
        return
    }
    type = 'comment triple'
    if (_k_.in(chunk.turd.slice(0, 5),["--[[","--]]"]))
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,strong:true})
        }
        return addAndJoinValues(4,type)
    }
}

starComment = function ()
{
    var type

    if (!chunk.turd)
    {
        return
    }
    type = 'comment triple'
    if (topType && topType !== type)
    {
        return
    }
    if (chunk.turd.slice(0, 2) === '/*' && !topType)
    {
        pushStack({type:type,strong:true})
        return addValues(2,type)
    }
    if (chunk.turd.slice(0, 2) === '*/' && topType === type)
    {
        popStack()
        return addValues(2,type)
    }
}

funcArgs = function ()
{
    var ch, turd, _388_25_

    if (notCode)
    {
        return
    }
    if (!chunk.turd)
    {
        return
    }
    turd = (chunk.turd[0] === '◯' ? chunk.turd.slice(1, 3) : chunk.turd.slice(0, 2))
    if (_k_.in(turd[0],'=-') && turd[1] === '>')
    {
        if (_k_.in((getChunk(-1) != null ? getChunk(-1).match : undefined),':)'))
        {
            return
        }
        if (_k_.in(line.chunks[0].clss,['text','dictionary key']) && _k_.in(line.chunks[1].match,':='))
        {
            var list1 = _k_.list(line.chunks.slice(2, typeof chunkIndex === 'number' ? chunkIndex : -1))
            for (var _16_ = 0; _16_ < list1.length; _16_++)
            {
                ch = list1[_16_]
                if (_k_.in(ch.clss,['function call','text']))
                {
                    ch.clss = 'function argument'
                }
            }
        }
    }
    return
}

dashArrow = function ()
{
    var markFunc, _418_77_, _439_77_

    if (notCode)
    {
        return
    }
    markFunc = function ()
    {
        if (line.chunks[0].clss === 'text')
        {
            if (line.chunks[1].match === '=' && line.chunks[2].match !== '>')
            {
                line.chunks[0].clss = 'function'
                return line.chunks[1].clss += ' function'
            }
            else if (line.chunks[1].match === ':')
            {
                line.chunks[0].clss = 'method'
                return line.chunks[1].clss += ' method'
            }
        }
    }
    if (chunk.turd)
    {
        if (chunk.turd.startsWith('◯->'))
        {
            markFunc()
            addValue(0,'function async')
            addValue(1,'function tail')
            addValue(2,'function head')
            if (line.chunks[0].clss === 'dictionary key' || (line.chunks[0].turd != null ? line.chunks[0].turd.slice(0, 2) : undefined) === '@:')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            else if (line.chunks[0].match === '@' && line.chunks[1].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'punct method class'
                line.chunks[1].clss = 'method class'
                line.chunks[2].clss = 'punct method class'
            }
            return 3
        }
        if (chunk.turd.startsWith('◯=>'))
        {
            markFunc()
            addValue(0,'function bound async')
            addValue(1,'function bound tail')
            addValue(2,'function bound head')
            if (line.chunks[0].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            return 3
        }
        if (chunk.turd.startsWith('->'))
        {
            markFunc()
            if (line.chunks[0].clss === 'dictionary key' || (line.chunks[0].turd != null ? line.chunks[0].turd.slice(0, 2) : undefined) === '@:')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            else if (line.chunks[0].match === '@' && line.chunks[1].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'punct method class'
                line.chunks[1].clss = 'method class'
                line.chunks[2].clss = 'punct method class'
            }
            return addAndJoinValues(2,'function')
        }
        if (chunk.turd.startsWith('=>'))
        {
            markFunc()
            if (line.chunks[0].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            return addAndJoinValues(2,'function bound')
        }
    }
}

cppPointer = function ()
{
    if (notCode)
    {
        return
    }
    if (chunk.turd)
    {
        if (chunk.turd.startsWith('->'))
        {
            addValue(0,'arrow tail')
            addValue(1,'arrow head')
            return 2
        }
    }
}

commentHeader = function ()
{
    if (topType === 'comment triple')
    {
        if (HEADER.test(chunk.match))
        {
            chunk.clss = 'comment triple header'
            return 1
        }
    }
}

kolorPunct = function ()
{
    if (notCode)
    {
        return
    }
    if (_k_.in(chunk.match,'◌'))
    {
        return addValue(0,'range')
    }
}

kodePunct = function ()
{
    var next, prev, prevEnd, _521_21_, _533_50_

    if (notCode)
    {
        return
    }
    if (_k_.in(chunk.match,'▸➜…'))
    {
        return addValue(0,'keyword')
    }
    if (_k_.in(chunk.match,'⮐'))
    {
        return addValue(0,'keyword return')
    }
    if (_k_.in(chunk.match,'■'))
    {
        return addValue(0,'function class')
    }
    if (_k_.in(chunk.match,'□'))
    {
        return addValue(0,'keyword extends')
    }
    if (next = getChunk(1))
    {
        if (_k_.in(chunk.match,'◯') && !(_k_.in(next.match,'-=')))
        {
            return addValue(0,'await')
        }
        if (_k_.in(chunk.turd,['==','!=','>=','<=']))
        {
            addValue(0,'compare')
            addValue(1,'compare')
            return 2
        }
        if (_k_.in(chunk.match,'<>') && !chunk.turd)
        {
            return addValue(0,'compare')
        }
        if (_k_.in(chunk.match,'◆'))
        {
            if (_k_.in(next.match,['dir','file','main']))
            {
                addValue(0,'keyword')
                setValue(1,'keyword')
                return 2
            }
        }
    }
    if (prev = getChunk(-1))
    {
        if (prev.clss.endsWith('require') && chunk.match !== '"')
        {
            setValue(0,'punct require')
            return 1
        }
        if ((chunk.turd != null ? chunk.turd.startsWith('..') : undefined) && prev.match !== '.')
        {
            if (chunk.turd[2] !== '.')
            {
                return addValues(2,'range')
            }
            if (chunk.turd[3] !== '.')
            {
                return addValues(3,'range')
            }
        }
        if (prev.clss.startsWith('text') || prev.clss === 'property')
        {
            prevEnd = prev.start + prev.length
            if (chunk.match === '(' && prevEnd === chunk.start)
            {
                return thisCall()
            }
            else if (prevEnd < chunk.start)
            {
                if (chunkIndex === 1 || _k_.in((getChunk(-2) != null ? getChunk(-2).match : undefined),['⮐','=','return']))
                {
                    if (_k_.in(chunk.match,'@[({"\''))
                    {
                        return thisCall()
                    }
                    else if (_k_.in(chunk.match,'+-/'))
                    {
                        next = getChunk(1)
                        if (!next || next.match !== '=' && next.start === chunk.start + 1)
                        {
                            return thisCall()
                        }
                    }
                }
            }
        }
    }
}

kodeWord = function ()
{
    var c, prev, _546_22_, _595_46_

    if (notCode)
    {
        return
    }
    if (chunk.match === 'use')
    {
        if ((getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + chunk.length)
        {
            setValue(0,'keyword require')
            return 1
        }
        else
        {
            setValue(0,'text')
            return 0
        }
    }
    if (prev = getChunk(-1))
    {
        if (prev.match === 'use')
        {
            setValue(0,'require')
            return 1
        }
        if (prev.match === '▸')
        {
            if (_k_.empty(getChunk(-2)))
            {
                var list1 = _k_.list(line.chunks.slice(chunkIndex))
                for (var _17_ = 0; _17_ < list1.length; _17_++)
                {
                    c = list1[_17_]
                    c.clss = 'section'
                }
                return line.chunks.length - chunkIndex
            }
        }
        if (_k_.in(prev.match,['class','extends','function','■','□']))
        {
            setValue(0,'class')
            return 1
        }
        if (prev.match === 'is' && _k_.in(chunk.match,['str','num','obj','arr','func','elem']))
        {
            setValue(0,'keyword')
            return 1
        }
        if (chunk.clss.startsWith('keyword'))
        {
            return 1
        }
        if (prev.match === '@')
        {
            addValue(-1,'this')
            addValue(0,'this')
            return 1
        }
        if (prev.clss.endsWith('require'))
        {
            addValue(0,'require')
            if (prev.clss.endsWith('punct require') && _k_.in(prev.match,'▪◆●'))
            {
                addValue(0,'string')
            }
            else if (chunkIndex === line.chunks.length - 1)
            {
                addValue(0,'string')
            }
            return 1
        }
        if (prev.clss.endsWith('require string'))
        {
            addValue(0,'require string')
            return 1
        }
        if ((prev.clss.startsWith('text') || prev.clss === 'property') && prev.start + prev.length < chunk.start)
        {
            if (chunkIndex === 1 || _k_.in((getChunk(-2) != null ? getChunk(-2).match : undefined),['return','=','⮐']))
            {
                return thisCall()
            }
        }
    }
}

thisCall = function ()
{
    setValue(-1,'function call')
    if (getmatch(-2) === '@')
    {
        setValue(-2,'punct function call')
    }
    return 0
}

coffeePunct = function ()
{
    var next, prev, prevEnd, _617_21_

    if (notCode)
    {
        return
    }
    if (chunk.match === '▸')
    {
        return addValue(0,'meta')
    }
    if (chunk.turd === '~>')
    {
        return addValues(2,'meta')
    }
    if (prev = getChunk(-1))
    {
        if ((chunk.turd != null ? chunk.turd.startsWith('..') : undefined) && prev.match !== '.')
        {
            if (chunk.turd[2] !== '.')
            {
                return addValues(2,'range')
            }
            if (chunk.turd[3] !== '.')
            {
                return addValues(3,'range')
            }
        }
        if (prev.clss.startsWith('text') || prev.clss === 'property')
        {
            prevEnd = prev.start + prev.length
            if (chunk.match === '(' && prevEnd === chunk.start)
            {
                return thisCall()
            }
            else if (prevEnd < chunk.start)
            {
                if (_k_.in(chunk.match,'@[({"\''))
                {
                    return thisCall()
                }
                else if (_k_.in(chunk.match,'+-/'))
                {
                    next = getChunk(1)
                    if (!next || next.match !== '=' && next.start === chunk.start + 1)
                    {
                        return thisCall()
                    }
                }
            }
        }
    }
}

coffeeWord = function ()
{
    var prev

    if (notCode)
    {
        return
    }
    if (prev = getChunk(-1))
    {
        if (prev.clss === 'punct meta')
        {
            if (chunk.start === prev.start + 1)
            {
                setValue(0,'meta')
                return 0
            }
        }
        if (_k_.in(prev.match,['class','extends']))
        {
            setValue(0,'class')
            return 1
        }
        if (chunk.clss.startsWith('keyword'))
        {
            return 1
        }
        if (prev.match === '@')
        {
            addValue(-1,'this')
            addValue(0,'this')
            return 1
        }
        if ((prev.clss.startsWith('text') || prev.clss === 'property') && prev.start + prev.length < chunk.start)
        {
            return thisCall()
        }
    }
}

property = function ()
{
    var prevPrev

    if (notCode)
    {
        return
    }
    if (_k_.in(getmatch(-1),".∙"))
    {
        prevPrev = getChunk(-2)
        if (!(_k_.in((prevPrev != null ? prevPrev.match : undefined),".∙")))
        {
            setValue(-1,'punct property')
            setValue(0,'property')
            if (prevPrev)
            {
                if (!(_k_.in(prevPrev.clss,['property','number'])) && !prevPrev.clss.startsWith('punct'))
                {
                    setValue(-2,'obj')
                }
            }
            return 1
        }
    }
}

cppWord = function ()
{
    var p, prevPrev, _685_19_

    if (notCode)
    {
        return
    }
    if (p = property())
    {
        return p
    }
    if ((getChunk(-2) != null ? getChunk(-2).turd : undefined) === '::')
    {
        if (prevPrev = getChunk(-3))
        {
            setValue(-3,'punct obj')
            addValue(-2,'obj')
            addValue(-1,'obj')
            setValue(0,'method')
            return 1
        }
    }
    if (getmatch(-1) === '<' && _k_.in(getmatch(1),',>') || getmatch(1) === '>' && _k_.in(getmatch(-1),','))
    {
        setValue(-1,'punct template')
        setValue(0,'template')
        setValue(1,'punct template')
        return 2
    }
    if (/[A-Z]/.test(chunk.match[1]))
    {
        switch (chunk.match[0])
        {
            case 'T':
                if (getmatch(1) === '<')
                {
                    setValue(0,'keyword type')
                    return 1
                }
                break
            case 'F':
                setValue(0,'struct')
                return 1

            case 'A':
            case 'U':
                setValue(0,'obj')
                return 1

        }

    }
    if (chunk.clss === 'text' && getmatch(1) === '(')
    {
        setValue(0,'function call')
        return 1
    }
}

noonKey = function ()
{
    if (chunk.clss.startsWith('text unicode'))
    {
        chunk.noonKey = true
    }
    else
    {
        setValue(0,'obj')
    }
    return 1
}

noonProp = function ()
{
    var i, prev

    if (prev = getChunk(-1))
    {
        if (prev.start + prev.length + 1 < chunk.start)
        {
            if (prev.clss !== 'obj' && !prev.noonKey)
            {
                i = chunkIndex - 1
                while (i >= 0)
                {
                    if (i < chunkIndex - 1 && line.chunks[i].start + line.chunks[i].length + 1 < line.chunks[i + 1].start)
                    {
                        break
                    }
                    if (line.chunks[i].clss === 'text' || line.chunks[i].clss === 'obj')
                    {
                        line.chunks[i].clss = 'property'
                        i--
                    }
                    else if (line.chunks[i].clss === 'punct')
                    {
                        line.chunks[i].clss = 'punct property'
                        i--
                    }
                    else if (line.chunks[i].clss.startsWith('text unicode'))
                    {
                        i--
                    }
                    else
                    {
                        break
                    }
                }
            }
        }
        else if (prev.clss === 'obj' || prev.noonKey)
        {
            return noonKey()
        }
    }
    return 0
}

noonPunct = function ()
{
    return noonProp()
}

noonWord = function ()
{
    if (chunk.start === 0)
    {
        return noonKey()
    }
    return noonProp()
}
MDSPAN = /(code|bold|italic)$/
FILEXT = exts.concat(['png','gif','jpg','jpeg','bmp','tiff','icns','mov','toml','cast','text'])

urlPunct = function ()
{
    var d, fileext, i, mdSpan, next, prev, s, _800_48_

    mdSpan = ext === 'md' && MDSPAN.test(topType)
    if (prev = getChunk(-1))
    {
        if (chunk.turd === '://')
        {
            d = 3
            while (getmatch(d + 1) === '.' && getChunk(d + 2) && !getValue(d + 2).startsWith('punct'))
            {
                d += 2
            }
            if (d > 3)
            {
                setValue(-1,'url protocol')
                for (s = 0; s < 3; s++)
                {
                    setValue(s,'punct url')
                }
                for (s = 3; s < d - 2; s += 2)
                {
                    setValue(s,'url subdomain')
                    setValue(s + 1,'punct url')
                }
                setValue(d - 2,'url domain')
                setValue(d - 1,'punct url tld')
                setValue(d,'url tld')
                return d + 1
            }
        }
        if (chunk.match === '.')
        {
            if (!prev.clss.startsWith('number') && prev.clss !== 'semver' && !(_k_.in(prev.match,'\\./')) && !/^\d+$/.test(prev.match) && (_k_.empty((topType)) || mdSpan && prev.match !== '*'))
            {
                if (next = getChunk(1))
                {
                    if (next.start === chunk.start + chunk.length)
                    {
                        fileext = next.match
                        if (!next.clss.startsWith('punct') && (ext !== 'md' || _k_.in(fileext,FILEXT)))
                        {
                            setValue(-1,'file_' + fileext)
                            setValue(0,'file_punct_' + fileext)
                            setValue(1,'file_ext_' + fileext)
                            return 2
                        }
                    }
                }
            }
        }
        if (chunk.match === '/' && !(chunk.turd != null ? chunk.turd.startsWith('/>') : undefined))
        {
            for (i = chunkIndex; i >= 0; i--)
            {
                if (line.chunks[i].start + line.chunks[i].length < (line.chunks[i + 1] != null ? line.chunks[i + 1].start : undefined))
                {
                    break
                }
                if (line.chunks[i].clss.endsWith('dir'))
                {
                    break
                }
                if (line.chunks[i].clss.startsWith('url'))
                {
                    break
                }
                if (line.chunks[i].match === '"')
                {
                    break
                }
                if (mdSpan && _k_.in(line.chunks[i].match,'`*'))
                {
                    break
                }
                if (line.chunks[i].clss.startsWith('punct'))
                {
                    line.chunks[i].clss = 'punct dir'
                }
                else
                {
                    line.chunks[i].clss = 'text dir'
                }
            }
            return 1
        }
    }
    return 0
}

urlWord = function ()
{
    var next, prev

    if (_k_.in(chunk.clss,['keyword','property']))
    {
        return
    }
    if (prev = getChunk(-1))
    {
        if (_k_.in(prev.match,'\\/'))
        {
            next = getChunk(1)
            if (!next || next.start > chunk.start + chunk.length || !(_k_.in(next.match,'\\./')))
            {
                if (ext === 'md')
                {
                    setValue(0,'dir_leaf')
                    return 1
                }
                return addValue(0,'file')
            }
        }
    }
}

jsPunct = function ()
{
    var prev

    if (notCode)
    {
        return
    }
    if (prev = getChunk(-1))
    {
        if (chunk.match === '(')
        {
            if (prev.clss.startsWith('text') || prev.clss === 'property')
            {
                setValue(-1,'function call')
                return 1
            }
        }
    }
}

jsWord = function ()
{
    if (chunk.clss === 'keyword function')
    {
        if (getmatch(-1) === '=' && getValue(-2).startsWith('text'))
        {
            setValue(-2,'function')
        }
    }
    return 0
}

dict = function ()
{
    var prev, _852_44_

    if (notCode)
    {
        return
    }
    if (chunk.match === ':' && !(chunk.turd != null ? chunk.turd.startsWith('::') : undefined))
    {
        if (prev = getChunk(-1))
        {
            if (_k_.in(prev.clss.split(' ')[0],['string','number','text','keyword']))
            {
                setValue(-1,'dictionary key')
                setValue(0,'punct dictionary')
                return 1
            }
            if (prev.match === '*' && _k_.in(getChunk(-2).clss.split(' ')[0],['text','keyword']))
            {
                setValue(-1,'dictionary key')
                setValue(-2,'dictionary key')
                setValue(0,'punct dictionary')
                return 1
            }
        }
    }
}

jsonPunct = function ()
{
    var i, prev

    if (notCode)
    {
        return
    }
    if (chunk.match === ':')
    {
        if (prev = getChunk(-1))
        {
            if (prev.match === '"')
            {
                for (i = Math.max(0,chunkIndex - 2); i >= 0; i--)
                {
                    if ((line.chunks[i] != null ? line.chunks[i].clss : undefined) === 'punct string double')
                    {
                        line.chunks[i].clss = 'punct dictionary'
                        break
                    }
                    if (line.chunks[i])
                    {
                        line.chunks[i].clss = 'dictionary key'
                    }
                }
                setValue(-1,'punct dictionary')
                setValue(0,'punct dictionary')
                return 1
            }
        }
    }
}

jsonWord = function ()
{
    var prev

    if ((topType === 'string double' || topType === 'string single') && (prev = getChunk(-1)))
    {
        if (_k_.in(prev.match,'"^~='))
        {
            if (NUMBER.test(getmatch(0)) && getmatch(1) === '.' && NUMBER.test(getmatch(2)) && getmatch(3) === '.' && NUMBER.test(getmatch(4)))
            {
                if (_k_.in(prev.match,'^~='))
                {
                    setValue(-1,'punct semver')
                    if (getmatch(-2) === '>')
                    {
                        setValue(-2,'punct semver')
                    }
                }
                setValue(0,'semver')
                setValue(1,'punct semver')
                setValue(2,'semver')
                setValue(3,'punct semver')
                setValue(4,'semver')
                return 5
            }
        }
    }
}

escape = function ()
{
    var _902_46_, _903_26_, _907_61_, _910_61_

    if (chunk.match === '\\' && ((topType != null ? topType.startsWith('regexp') : undefined) || (topType != null ? topType.startsWith('string') : undefined)))
    {
        if (chunkIndex === 0 || !(getChunk(-1) != null ? getChunk(-1).escape : undefined))
        {
            if ((getChunk(1) != null ? getChunk(1).start : undefined) === chunk.start + 1)
            {
                chunk.escape = true
                addValue(0,'escape')
                if (topType === 'string single' && (getChunk(1) != null ? getChunk(1).match : undefined) === "'")
                {
                    setValue(0,topType)
                    return 1
                }
                if (topType === 'string double' && (getChunk(1) != null ? getChunk(1).match : undefined) === '"')
                {
                    setValue(0,topType)
                    return 1
                }
                return stacked()
            }
        }
    }
}

regexp = function ()
{
    var next, prev, _920_19_

    if ((topType != null ? topType.startsWith('string') : undefined))
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    if (chunk.match === '/')
    {
        if (topType === 'regexp')
        {
            chunk.clss += ' regexp end'
            popStack()
            return 1
        }
        if (chunkIndex)
        {
            prev = getChunk(-1)
            next = getChunk(1)
            if (!prev.clss.startsWith('punct') && !prev.clss.startsWith('keyword') || _k_.in(prev.match,")]"))
            {
                if ((prev.start + prev.length < chunk.start) && (next != null ? next.start : undefined) > chunk.start + 1)
                {
                    return
                }
                if ((prev.start + prev.length === chunk.start) && (next != null ? next.start : undefined) === chunk.start + 1)
                {
                    return
                }
            }
            if ((next != null ? next.match : undefined) === '=')
            {
                return
            }
            if (prev.clss.startsWith('number'))
            {
                return
            }
        }
        pushStack({type:'regexp'})
        return addValue(0,'regexp start')
    }
    return escape()
}

tripleRegexp = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    type = 'regexp triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (chunk.turd.slice(0, 3) === '///')
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,lineno:line.number})
        }
        return addValues(3,type)
    }
}

simpleString = function ()
{
    var next, scnd, type, _964_19_

    if (topType === 'regexp')
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    if (_k_.in(chunk.match,'`"\''))
    {
        type = ((function ()
        {
            switch (chunk.match)
            {
                case '`':
                    return 'string double'

                case '"':
                    return 'string double'

                case "'":
                    return 'string single'

            }

        }).bind(this))()
        if (chunk.match === "'")
        {
            next = getChunk(1)
            if (_k_.in((next != null ? next.match : undefined),['s','d','t','ll','re']))
            {
                if (next.start === chunk.start + chunk.length)
                {
                    scnd = getChunk(2)
                    if (!scnd || scnd.match !== "'")
                    {
                        if (afterWord())
                        {
                            return stacked()
                        }
                    }
                }
            }
        }
        if (chunk.clss === 'punct code triple')
        {
            return 0
        }
        if (topType === type)
        {
            addValue(0,type)
            popStack()
            return 1
        }
        else if (notCode)
        {
            if (topType === "string double nsstring")
            {
                addValue(0,topType)
                popStack()
                return 1
            }
            else
            {
                return stacked()
            }
        }
        pushStack({strong:true,type:type})
        addValue(0,type)
        return 1
    }
    return escape()
}

afterWord = function ()
{
    var prev

    prev = getChunk(-1)
    if (!prev)
    {
        return false
    }
    if (prev.start + prev.length < chunk.start)
    {
        return false
    }
    return !PUNCT.test(prev.match[prev.match.length - 1])
}

tripleString = function ()
{
    var type, _1018_19_

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    if (_k_.in(topType,['regexp','string single','string double']))
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    type = ((function ()
    {
        switch (chunk.turd.slice(0, 3))
        {
            case '"""':
                return 'string triple'

        }

    }).bind(this))()
    if (type)
    {
        if (type !== topType && (topType != null ? topType.startsWith('string') : undefined))
        {
            return
        }
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({strong:true,type:type})
        }
        return addValues(3,type)
    }
    return escape()
}

luaString = function ()
{
    var type, _1041_19_

    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    if (_k_.in(topType,['regexp','string single','string double']))
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    type = ((function ()
    {
        switch (chunk.turd.slice(0, 2))
        {
            case '[[':
                return 'string triple'

            case ']]':
                return 'string triple'

        }

    }).bind(this))()
    if (type)
    {
        if (type !== topType && (topType != null ? topType.startsWith('string') : undefined))
        {
            return
        }
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({strong:true,type:type})
        }
        return addValues(2,type)
    }
    return escape()
}

number = function ()
{
    var prev

    if ((topType != null ? topType.startsWith('string') : undefined))
    {
        return 0
    }
    if ((topType != null ? topType.startsWith('comment') : undefined))
    {
        return 0
    }
    if (NUMBER.test(chunk.match))
    {
        prev = getmatch(-1)
        if (prev === '.')
        {
            if (getValue(-4) === 'number float' && getValue(-2) === 'number float')
            {
                if (_k_.in(getmatch(-5),'^~='))
                {
                    setValue(-5,'punct semver')
                    if (getmatch(-6) === '>')
                    {
                        setValue(-6,'punct semver')
                    }
                }
                setValue(-4,'semver')
                setValue(-3,'punct semver')
                setValue(-2,'semver')
                setValue(-1,'punct semver')
                setValue(0,'semver')
                return 1
            }
            if (getValue(-2) === 'number')
            {
                setValue(-2,'number float')
                setValue(-1,'punct number float')
                setValue(0,'number float')
                return 1
            }
        }
        if (prev === '#')
        {
            chunk.clss = 'number hex'
        }
        else
        {
            chunk.clss = 'number'
        }
        return 1
    }
    if (HEXNUM.test(chunk.match))
    {
        chunk.clss = 'number hex'
        return 1
    }
    if (HEX.test(chunk.match))
    {
        if (getmatch(-1) === '#')
        {
            chunk.clss = 'number hex'
            return 1
        }
    }
}

float = function ()
{
    if (FLOAT.test(chunk.match))
    {
        if (getmatch(-1) === '.')
        {
            if (getValue(-2) === 'number')
            {
                setValue(-2,'number float')
                addValue(-1,'number float')
                setValue(0,'number float')
                return 1
            }
        }
        chunk.clss = 'number float'
        return 1
    }
}

cssWord = function ()
{
    var prev, prevPrev, _1132_45_

    if (_k_.in(chunk.match.slice(-2),['px','em','ex']) && NUMBER.test(chunk.match.slice(0, -2)))
    {
        setValue(0,'number')
        return 1
    }
    if (_k_.in(chunk.match.slice(-1),['s']) && NUMBER.test(chunk.match.slice(0, -1)))
    {
        setValue(0,'number')
        return 1
    }
    if (prev = getChunk(-1))
    {
        if (prev.match === '.' && (getChunk(-2) != null ? getChunk(-2).clss : undefined) !== 'number' && _k_.empty(topType))
        {
            addValue(-1,'class')
            setValue(0,'class')
            return 1
        }
        if (prev.match === "#")
        {
            if (chunk.match.length === 3 || chunk.match.length === 6)
            {
                if (HEX.test(chunk.match))
                {
                    addValue(-1,'number hex')
                    setValue(0,'number hex')
                    return 1
                }
            }
            addValue(-1,'function')
            setValue(0,'function')
            return 1
        }
        if (prev.match === '-')
        {
            if (prevPrev = getChunk(-2))
            {
                if (_k_.in(prevPrev.clss,['class','function']))
                {
                    addValue(-1,prevPrev.clss)
                    setValue(0,prevPrev.clss)
                    return 1
                }
            }
        }
    }
}

mdString = function ()
{
    var after, c, chunks, j, k, next, prev, touches, type, word

    if (!(_k_.in(chunk.match,['"',"'"])) || chunk.clss !== 'punct' || !_k_.empty(topType))
    {
        return 0
    }
    chunks = line.chunks
    word = function (c)
    {
        return c && !c.clss.startsWith('punct')
    }
    touches = function (a, b)
    {
        return a.start + a.length === b.start
    }
    prev = chunks[chunkIndex - 1]
    if (prev && touches(prev,chunk) && !(_k_.in(prev.match,'([')))
    {
        return 0
    }
    next = chunks[chunkIndex + 1]
    if (!word(next) || !touches(chunk,next))
    {
        return 0
    }
    for (j = chunkIndex + 2; j < chunks.length; j++)
    {
        c = chunks[j]
        if (c.match === chunk.match && word(chunks[j - 1]) && touches(chunks[j - 1],c))
        {
            after = chunks[j + 1]
            if (word(after) && touches(c,after))
            {
                continue
            }
            type = (chunk.match === '"' ? 'string double' : 'string single')
            for (k = chunkIndex; k <= j; k++)
            {
                chunks[k].clss = ((k === chunkIndex || k === j || chunks[k].clss.startsWith('punct')) ? 'punct ' + type : type)
            }
            return j - chunkIndex + 1
        }
    }
    return 0
}

mdPunct = function ()
{
    var adv, lng, prev, stuck, type, _1186_73_, _1210_18_, _1210_50_, _1221_21_, _1246_21_

    if (chunkIndex === 0)
    {
        if (chunk.turd.length <= 1 && _k_.in(chunk.match,'-*') && (getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + 1)
        {
            type = ['li1','li2','li3','li4','li5'][parseInt(chunk.start / 4)]
            return addValue(0,type + ' marker')
        }
        if (chunk.match === '#')
        {
            switch (chunk.turd)
            {
                case '#':
                    pushStack({merge:true,fill:true,type:'h1'})
                    return addValue(0,'h1')

                case '##':
                    pushStack({merge:true,fill:true,type:'h2'})
                    return addValues(2,'h2')

                case '###':
                    pushStack({merge:true,fill:true,type:'h3'})
                    return addValues(3,'h3')

                case '####':
                    pushStack({merge:true,fill:true,type:'h4'})
                    return addValues(4,'h4')

                case '#####':
                    pushStack({merge:true,fill:true,type:'h5'})
                    return addValues(5,'h5')

            }

        }
    }
    prev = getChunk(-1)
    stuck = prev && prev.start + prev.length === chunk.start && _k_.in(prev.match,'-=')
    if (((chunk.turd != null ? chunk.turd.startsWith('->') : undefined) || (chunk.turd != null ? chunk.turd.startsWith('=>') : undefined)) && !stuck)
    {
        type = (chunk.match === '-' ? 'punct function' : 'punct function bound')
        setValue(0,type)
        setValue(1,type)
        return 2
    }
    adv = mdString()
    if (adv)
    {
        return adv
    }
    if (chunk.match === '*' && !(topType != null ? topType.endsWith('code') : undefined))
    {
        if ((chunk.turd != null ? chunk.turd.slice(0, 2) : undefined) === '**')
        {
            type = 'bold'
            if ((topType != null ? topType.endsWith(type) : undefined))
            {
                addValues(2,topType)
                popStack()
                return 2
            }
            if ((stackTop != null ? stackTop.merge : undefined))
            {
                type = stackTop.type + ' ' + type
            }
            pushStack({merge:true,type:type})
            return addValues(2,type)
        }
        type = 'italic'
        if ((topType != null ? topType.endsWith(type) : undefined))
        {
            addValue(0,topType)
            popStack()
            return 1
        }
        if ((stackTop != null ? stackTop.merge : undefined))
        {
            type = stackTop.type + ' ' + type
        }
        pushStack({merge:true,type:type})
        addValue(0,type)
        return 1
    }
    if (chunk.match === '`')
    {
        if ((chunk.turd != null ? chunk.turd.slice(0, 3) : undefined) === '```')
        {
            type = 'code triple'
            if ((lng = getChunk(3)) && lng.start === chunk.start + 3 && !lng.clss.startsWith('punct'))
            {
                setValue(3,'code lang')
            }
            if (_k_.in(getmatch(3),['coffeescript','javascript','js']))
            {
                return addValues(3,type)
            }
            pushStack({weak:true,type:type})
            return addValues(3,type)
        }
        type = 'code'
        if ((topType != null ? topType.endsWith(type) : undefined))
        {
            addValue(0,topType)
            popStack()
            return 1
        }
        if ((stackTop != null ? stackTop.merge : undefined))
        {
            type = stackTop.type + ' ' + type
        }
        pushStack({merge:true,type:type})
        return addValue(0,type)
    }
}

interpolation = function ()
{
    var _1274_21_

    if ((topType != null ? topType.startsWith('string double') : undefined) || topType === 'string triple')
    {
        if ((chunk.turd != null ? chunk.turd.startsWith("\#{") : undefined))
        {
            pushStack({type:'interpolation',weak:true})
            setValue(0,'punct string interpolation')
            setValue(1,'punct string interpolation')
            return 2
        }
    }
    else if (topType === 'interpolation')
    {
        if (chunk.match === '}')
        {
            setValue(0,'punct string interpolation')
            popStack()
            return 1
        }
    }
}

spaced = function ()
{
    var prev

    if (prev = getChunk(-1))
    {
        return prev.start + prev.length < chunk.start
    }
    return false
}

keyword = function ()
{
    var prev

    if (notCode)
    {
        return
    }
    if (!lang[ext])
    {
        return
    }
    prev = getChunk(-1)
    if (lang[ext].hasOwnProperty(chunk.match) && (!prev || (!(_k_.in(prev.match,['.'])) && (spaced() || (_k_.in(prev.match,['@','['])) || (prev.clss !== 'punct')))))
    {
        chunk.clss = lang[ext][chunk.match]
        return
    }
}

mdTag = function ()
{
    var adjacent, c, chunks, i, j, k, str

    chunks = line.chunks
    adjacent = function (k)
    {
        return chunks[k] && chunks[k - 1] && chunks[k - 1].start + chunks[k - 1].length === chunks[k].start
    }
    i = chunkIndex + 1
    if ((chunks[i] != null ? chunks[i].match : undefined) === '/' && adjacent(i))
    {
        i++
    }
    if (!adjacent(i) || chunks[i].clss.startsWith('punct'))
    {
        return
    }
    for (j = i + 1; j < chunks.length; j++)
    {
        if (chunks[j].match === '<')
        {
            return
        }
        if (chunks[j].match === '>')
        {
            chunks[i].clss = 'keyword'
            str = false
            for (k = i + 1; k < j; k++)
            {
                c = chunks[k]
                if (c.match === '"')
                {
                    c.clss = 'punct string double'
                    str = !str
                }
                else if (str)
                {
                    c.clss = c.clss.startsWith('punct') ? 'punct string double' : 'string double'
                }
                else if (!c.clss.startsWith('punct') && chunks[k + 1].match === '=' && adjacent(k + 1))
                {
                    c.clss = 'property'
                }
            }
            return
        }
    }
}

xmlPunct = function ()
{
    var _1335_17_

    if (ext === 'md' && chunk.match === '<' && _k_.empty(topType))
    {
        mdTag()
    }
    if ((chunk.turd != null ? chunk.turd.startsWith('/>') : undefined))
    {
        return addValues(2,'keyword')
    }
    if (chunk.turd === '</')
    {
        return addValues(2,'keyword')
    }
    if (_k_.in(chunk.match,['<','>']))
    {
        return addValue(0,'keyword')
    }
}

cppMacro = function ()
{
    if (chunk.match === "#")
    {
        addValue(0,'define')
        setValue(1,'define')
        return 2
    }
}

mmMacro = function ()
{
    if (chunk.match === "@")
    {
        addValue(0,'define')
        setValue(1,'define')
        return 2
    }
}

mmString = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    type = 'string double nsstring'
    if (chunk.turd.slice(0, 2) === '@"')
    {
        pushStack({strong:true,merge:true,type:type})
        return addValues(2,type)
    }
}

shPunct = function ()
{
    var _1374_42_, _1374_64_, _1377_102_, _1377_41_, _1377_82_, _1383_102_, _1383_41_, _1383_82_

    if (notCode)
    {
        return
    }
    if (chunk.match === '/' && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) === chunk.start)
    {
        return addValue(-1,'dir')
    }
    if (chunk.turd === '--' && (getChunk(2) != null ? getChunk(2).start : undefined) === chunk.start + 2 && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) < chunk.start)
    {
        addValue(0,'argument')
        addValue(1,'argument')
        setValue(2,'argument')
        return 3
    }
    if (chunk.match === '-' && (getChunk(1) != null ? getChunk(1).start : undefined) === chunk.start + 1 && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) < chunk.start)
    {
        addValue(0,'argument')
        setValue(1,'argument')
        return 2
    }
    if (chunk.match === '~' && (!getChunk(-1) || getChunk(-1).start + getChunk(-1).length < chunk.start))
    {
        setValue(0,'text dir')
        return 1
    }
}

stacked = function ()
{
    if (stackTop)
    {
        if (stackTop.weak)
        {
            return
        }
        if (stackTop.strong)
        {
            chunk.clss = topType
        }
        else
        {
            chunk.clss += ' ' + topType
        }
        return 1
    }
}

pushExt = function (mtch)
{
    extTop = {switch:mtch,start:line,stack:stack}
    return extStack.push(extTop)
}

actExt = function ()
{
    stack = []
    stackTop = null
    topType = ''
    return notCode = false
}

popExt = function ()
{
    stack = extTop.stack
    line.ext = extTop.start.ext
    extStack.pop()
    extTop = extStack.slice(-1)[0]
    stackTop = stack.slice(-1)[0]
    topType = (stackTop != null ? stackTop.type : undefined)
    return notCode = stackTop && !(_k_.in(topType,codeTypes))
}

pushStack = function (o)
{
    stack.push(o)
    stackTop = o
    topType = o.type
    return notCode = !(_k_.in(topType,codeTypes))
}

popStack = function ()
{
    stack.pop()
    stackTop = stack.slice(-1)[0]
    topType = (stackTop != null ? stackTop.type : undefined)
    return notCode = stackTop && !(_k_.in(topType,codeTypes))
}

getChunk = function (d)
{
    return line.chunks[chunkIndex + d]
}

setValue = function (d, value)
{
    if ((0 <= chunkIndex + d && chunkIndex + d < line.chunks.length))
    {
        return line.chunks[chunkIndex + d].clss = value
    }
}

getValue = function (d)
{
    var _1439_27_, _1439_34_

    return ((_1439_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1439_34_ : '')
}

getmatch = function (d)
{
    var _1440_27_, _1440_35_

    return ((_1440_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1440_35_ : '')
}

addValue = function (d, value)
{
    if ((0 <= chunkIndex + d && chunkIndex + d < line.chunks.length))
    {
        line.chunks[chunkIndex + d].clss += ' ' + value
    }
    return 1
}

addValues = function (n, value)
{
    var i

    for (i = 0; i < n; i++)
    {
        addValue(i,value)
    }
    return n
}

addAndJoinValues = function (n, value)
{
    var i

    line.chunks[chunkIndex].clss += ' ' + value
    for (i = 1; i < n; i++)
    {
        line.chunks[chunkIndex].match += line.chunks[chunkIndex + i].match
        line.chunks[chunkIndex].text += line.chunks[chunkIndex + i].text
        line.chunks[chunkIndex].length += 1
    }
    line.chunks.splice(chunkIndex + 1,n - 1)
    return 1
}
handlers = {coffee:{punct:[blockComment,hashComment,tripleRegexp,coffeePunct,tripleString,simpleString,interpolation,dashArrow,regexp,dict],word:[keyword,coffeeWord,number,property]},kode:{punct:[blockComment,hashComment,tripleRegexp,kodePunct,tripleString,simpleString,interpolation,funcArgs,dashArrow,regexp,dict],word:[keyword,kodeWord,number,property]},kim:{punct:[blockComment,hashComment,kodePunct,tripleString,interpolation,simpleString,funcArgs,dashArrow,dict],word:[keyword,kodeWord,number,property]},kua:{punct:[blockComment,hashComment,kodePunct,kolorPunct,tripleString,interpolation,simpleString,funcArgs,dashArrow,dict],word:[keyword,kodeWord,number,property]},nim:{punct:[nimComment,hashComment,simpleString,funcArgs,dashArrow],word:[keyword,number,property]},lua:{punct:[luaComment,simpleString,luaString,funcArgs,dashArrow],word:[keyword,number,property]},conf:{punct:[noonComment,noonPunct,urlPunct],word:[noonWord,urlWord,number]},noon:{punct:[noonComment,noonPunct,urlPunct],word:[noonWord,urlWord,number]},js:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},ts:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},iss:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},ini:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[number]},cpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},mm:{punct:[starComment,slashComment,simpleString,cppPointer],word:[keyword,number,float,cppWord]},zig:{punct:[starComment,slashComment,simpleString],word:[keyword,number,float,cppWord]},frag:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},vert:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},hpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},c:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},h:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},cs:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},pug:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},styl:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},css:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},sass:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},scss:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},swift:{punct:[starComment,slashComment,simpleString,dict],word:[keyword,number,property]},svg:{punct:[simpleString,xmlPunct],word:[keyword,number]},html:{punct:[simpleString,xmlPunct],word:[keyword,number]},htm:{punct:[simpleString,xmlPunct],word:[keyword,number]},xml:{punct:[simpleString,xmlPunct],word:[number]},sh:{punct:[hashComment,simpleString,urlPunct,shPunct],word:[keyword,urlWord,number]},json:{punct:[simpleString,jsonPunct,urlPunct],word:[keyword,jsonWord,urlWord,number]},yml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},yaml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},log:{punct:[simpleString,urlPunct,dict],word:[urlWord,number]},md:{punct:[mdPunct,urlPunct,xmlPunct],word:[urlWord,number]},fish:{punct:[hashComment,simpleString],word:[keyword,number]},py:{punct:[hashComment,simpleString],word:[keyword,number]}}
var list1 = _k_.list(exts)
for (var _18_ = 0; _18_ < list1.length; _18_++)
{
    ext = list1[_18_]
    if (!(handlers[ext] != null))
    {
        handlers[ext] = {punct:[simpleString],word:[number]}
    }
}
for (ext in handlers)
{
    obj = handlers[ext]
    handlers[ext].punct.push(stacked)
    handlers[ext].word.push(stacked)
}
commentStyles = {}
for (ext in handlers)
{
    handler = handlers[ext]
    punct = handler.punct
    if (_k_.in(hashComment,punct) || _k_.in(noonComment,punct) || _k_.in(nimComment,punct))
    {
        commentStyles[ext] = {start:'#',end:''}
    }
    else if (_k_.in(luaComment,punct))
    {
        commentStyles[ext] = {start:'--',end:''}
    }
    else if (_k_.in(starComment,punct))
    {
        commentStyles[ext] = {start:'/*',end:'*/'}
    }
    else if (_k_.in(slashComment,punct))
    {
        commentStyles[ext] = {start:'//',end:''}
    }
}
var list2 = ['html','htm','xml','svg','md']
for (var _19_ = 0; _19_ < list2.length; _19_++)
{
    ext = list2[_19_]
    commentStyles[ext] = {start:'<!--',end:'-->'}
}
KODESYMS = []
for (ext in handlers)
{
    handler = handlers[ext]
    var list3 = [kodePunct,coffeePunct,dashArrow]
    for (var _1a_ = 0; _1a_ < list3.length; _1a_++)
    {
        hnd = list3[_1a_]
        if (_k_.in(hnd,handler.punct))
        {
            KODESYMS.push(ext)
            break
        }
    }
}

commentStyle = function (ext)
{
    if (!(_k_.isStr(ext)))
    {
        return
    }
    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    return commentStyles[ext]
}

blocked = function (lines)
{
    var advance, beforeIndex, c, mightBeHeader, mtch, turdChunk, _1614_40_, _1629_61_

    extStack = []
    stack = []
    handl = []
    extTop = null
    stackTop = null
    notCode = false
    topType = ''
    ext = ''
    line = null
    chunk = null
    chunkIndex = 0
    var list4 = _k_.list(lines)
    for (var _1b_ = 0; _1b_ < list4.length; _1b_++)
    {
        line = list4[_1b_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list5 = _k_.list(line.chunks)
                for (var _1c_ = 0; _1c_ < list5.length; _1c_++)
                {
                    chunk = list5[_1c_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list6 = _k_.list(line.chunks)
                    for (var _1d_ = 0; _1d_ < list6.length; _1d_++)
                    {
                        chunk = list6[_1d_]
                        chunk.clss = 'comment triple header'
                    }
                    continue
                }
            }
            if (stackTop.fill)
            {
                popStack()
            }
        }
        if (extTop)
        {
            if (extTop.switch.indent && (line.chunks[0] != null ? line.chunks[0].start : undefined) <= extTop.start.chunks[0].start)
            {
                popExt()
            }
            else
            {
                line.ext = extTop.switch.to
            }
        }
        if (ext !== line.ext)
        {
            actExt()
            handl = handlers[ext = line.ext]
            if (!handl)
            {
                console.warn('no handl?',ext)
                console.warn('no handl?',line)
                console.warn('no handl?',handlers[ext])
            }
        }
        if (!(_k_.in(ext,KODESYMS)))
        {
            var list7 = _k_.list(line.chunks)
            for (var _1e_ = 0; _1e_ < list7.length; _1e_++)
            {
                c = list7[_1e_]
                if (c.kodesym && c.clss === 'punct')
                {
                    c.clss = 'text unicode kode'
                }
            }
        }
        chunkIndex = 0
        while (chunkIndex < line.chunks.length)
        {
            chunk = line.chunks[chunkIndex]
            beforeIndex = chunkIndex
            if (chunk.clss.startsWith('punct'))
            {
                if (extTop)
                {
                    if ((extTop.switch.end != null) && extTop.switch.end === chunk.turd)
                    {
                        if (extTop.switch.add)
                        {
                            addValues(chunk.turd.length,extTop.switch.add)
                        }
                        popExt()
                    }
                }
                var list8 = _k_.list(handl.punct)
                for (var _1f_ = 0; _1f_ < list8.length; _1f_++)
                {
                    hnd = list8[_1f_]
                    if (advance = hnd())
                    {
                        chunkIndex += advance
                        break
                    }
                }
            }
            else
            {
                if (!notCode)
                {
                    if (mtch = (swtch[line.ext] != null ? swtch[line.ext][chunk.match] : undefined))
                    {
                        if (mtch.turd)
                        {
                            turdChunk = getChunk(-mtch.turd.length)
                            if (mtch.turd === (((_1629_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1629_61_ : (turdChunk != null ? turdChunk.match : undefined))))
                            {
                                pushExt(mtch)
                            }
                        }
                        else if (mtch.next && getChunk(1).match === mtch.next)
                        {
                            pushExt(mtch)
                        }
                    }
                }
                var list9 = _k_.list(handl.word)
                for (var _20_ = 0; _20_ < list9.length; _20_++)
                {
                    hnd = list9[_20_]
                    if (advance = hnd())
                    {
                        chunkIndex += advance
                        break
                    }
                }
            }
            if (chunkIndex === beforeIndex)
            {
                chunkIndex++
            }
        }
    }
    return lines
}

parse = function (segls, ext = 'kode')
{
    return blocked(chunked(segls,ext))
}

kolorize = function (chunk)
{
    var cn, cr, txt, v, _1648_21_

    txt = ((_1648_21_=chunk.text) != null ? _1648_21_ : chunk.match)
    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = txt
            var list4 = _k_.list(cn)
            for (var _21_ = 0; _21_ < list4.length; _21_++)
            {
                cr = list4[_21_]
                v = klor[cr](v)
            }
            return v
        }
        else
        {
            return klor[cn](txt)
        }
    }
    if (chunk.clss.endsWith('file'))
    {
        return _k_.w8(txt)
    }
    else if (chunk.clss.endsWith('ext'))
    {
        return _k_.w3(txt)
    }
    else if (chunk.clss.startsWith('punct'))
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:txt,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return _k_.w2(txt)
        }
    }
    else
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:txt,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return txt
        }
    }
}

kolorizeChunks = function (chunks = [])
{
    var c, clrzd, i

    clrzd = ''
    c = 0
    for (i = 0; i < chunks.length; i++)
    {
        while (c < chunks[i].start)
        {
            clrzd += ' '
            c++
        }
        clrzd += kolorize(chunks[i])
        c += chunks[i].length
    }
    return clrzd
}

syntax = function (arg)
{
    var clines, index, lines, rngs, text, _1690_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1690_19_=arg.ext) != null ? _1690_19_ : 'coffee')
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (index = 0; index < lines.length; index++)
    {
        if (ext === 'js' && lines[index].startsWith('//# source'))
        {
            continue
        }
        clines.push(kolorizeChunks(rngs[index]))
    }
    return clines.join('\n')
}

dissect = function (segls, ext = 'kode')
{
    if (_k_.empty(segls))
    {
        return []
    }
    segls = kseg.segls(segls)
    return parse(segls,ext).map(function (l)
    {
        return l.chunks
    })
}

ranges = function (str, ext = 'kode')
{
    return parse([kseg(str)],ext)[0].chunks
}
export default {
    klor:klor,
    exts:exts,
    parse:parse,
    chunked:chunked,
    ranges:ranges,
    dissect:dissect,
    kolorize:kolorize,
    kolorizeChunks:kolorizeChunks,
    syntax:syntax,
    commentStyle:commentStyle,
    commentStyles:commentStyles,
    UNICODE:UNICODE,
    unicodeDoc:unicodeDoc
}
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    file = path.resolve(_k_.dir(),'../../kode/kolor/kulur.md')
    fs.writeFileSync(file,unicodeDoc())
    console.log(file)
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFJLFNBQUE7T0FBRyxXQUFBOztPQUNJLFdBQUE7O09BQ0EsV0FBQTs7T0FDTCxjQUFBO0lBQVU7SUFBSzs7QUFNckIsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7OztJQUFQO0lBQ0EsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFFVixRQUFVO0FBQ1YsU0FBVTtBQUNWLFFBQVU7QUFDVixTQUFVO0FBQ1YsTUFBVTtBQUNWLFVBQVU7QUFDVixLQUFVO0FBT1YsV0FFSSxLQUFhLGFBQ2IsUUFBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQ3RFLFFBQWUsT0FBTyxTQUFTLE9BQU8sU0FDdEMsV0FBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FDdEQsU0FBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FDdEQsUUFBZSxPQUFPLFNBQ3RCLFFBQWUsT0FBTyxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQVMsT0FBTyxTQUN0RSxPQUFlLE9BQU8sU0FBUyxPQUFPLFNBQ3RDLE1BQWUsT0FBTyxTQUN0QixZQUFlLE9BQU8sU0FDdEIsTUFBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU87O0FBRTFELHVCQUFhOzs7O1NBRUwsT0FBVzs7UUFBUCxNQUFPO1lBQ0ssVUFBUCxRQUFlLElBQUksU0FBUzs7bUJBQW5DOzs7SUFDTixLQUFLLEdBQUcsWUFBWTtTQUNoQixPQUFXOztRQUFQLE1BQU87WUFDRCxVQUFQOztpQ0FD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
//# sourceURL=../../kode/kolor/kulur.kode
