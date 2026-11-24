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
    var ch, cp, cs, head, hex, key, printable, r, rows, s, val

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
        var list1 = _k_.list(val)
        for (var _d_ = 0; _d_ < list1.length; _d_++)
        {
            r = list1[_d_]
            head = `${hex(r[0])} - ${hex(r[1])}`
            cs = []
            for (cp = r[0]; cp <= r[1]; cp++)
            {
                ch = String.fromCodePoint(cp)
                if (printable(ch))
                {
                    cs.push(ch)
                }
            }
            if (_k_.empty(cs))
            {
                s += head + ' holds only combining marks, which are not shown here.\n\n'
            }
            else if (cs.length > 320)
            {
                s += head + `  ■ 320 □ ${cs.length}\n\n` + rows(cs.slice(0,160)) + '\n...\n' + rows(cs.slice(-160)) + '\n\n'
            }
            else
            {
                s += head + `  ■ ${cs.length}\n\n` + rows(cs) + '\n\n'
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
    var _270_21_, _273_21_

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
    var _289_17_

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
    var type, _330_17_

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
    var ch, turd, _369_25_

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
    var markFunc, _399_77_, _420_77_

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
    var next, prev, prevEnd, _502_21_, _514_50_

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
    var c, prev, _527_22_, _576_46_

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
    var next, prev, prevEnd, _598_21_

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
    var p, prevPrev, _666_19_

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
    var d, fileext, i, mdSpan, next, prev, s, _781_48_

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
    var prev, _833_44_

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
    var _883_46_, _884_26_, _888_61_, _891_61_

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
    var next, prev, _901_19_

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
    var next, scnd, type, _945_19_

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
    var type, _999_19_

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
    var type, _1022_19_

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
    var prev, prevPrev, _1113_45_

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
    var adv, lng, prev, stuck, type, _1167_73_, _1191_18_, _1191_50_, _1202_21_, _1227_21_

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
    var _1255_21_

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
    var _1316_17_

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
    var _1355_42_, _1355_64_, _1358_102_, _1358_41_, _1358_82_, _1364_102_, _1364_41_, _1364_82_

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
    var _1420_27_, _1420_34_

    return ((_1420_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1420_34_ : '')
}

getmatch = function (d)
{
    var _1421_27_, _1421_35_

    return ((_1421_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1421_35_ : '')
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
    var advance, beforeIndex, c, mightBeHeader, mtch, turdChunk, _1595_40_, _1610_61_

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
                            if (mtch.turd === (((_1610_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1610_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
    var cn, cr, txt, v, _1629_21_

    txt = ((_1629_21_=chunk.text) != null ? _1629_21_ : chunk.match)
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
    var clines, index, lines, rngs, text, _1671_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1671_19_=arg.ext) != null ? _1671_19_ : 'coffee')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNJLFNBQUE7T0FBRyxXQUFBOztPQUNJLFdBQUE7O09BQ0EsV0FBQTs7T0FDTCxjQUFBO0lBQVU7SUFBSzs7QUFFckIsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7OztJQUFQO0lBQ0EsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFFVixRQUFVO0FBQ1YsU0FBVTtBQUNWLFFBQVU7QUFDVixTQUFVO0FBQ1YsTUFBVTtBQUNWLFVBQVU7QUFDVixLQUFVO0FBT1YsV0FFSSxLQUFhLGFBQ2IsUUFBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQ3RFLFFBQWUsT0FBTyxTQUFTLE9BQU8sU0FDdEMsV0FBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FDdEQsU0FBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FDdEQsUUFBZSxPQUFPLFNBQ3RCLFFBQWUsT0FBTyxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQVMsT0FBTyxTQUN0RSxPQUFlLE9BQU8sU0FBUyxPQUFPLFNBQ3RDLE1BQWUsT0FBTyxTQUN0QixZQUFlLE9BQU8sU0FDdEIsTUFBZSxPQUFPLFNBQVMsT0FBTyxTQUFTLE9BQU87O0FBRTFELHVCQUFhOzs7O1NBRUwsT0FBVzs7UUFBUCxNQUFPO1lBQ0ssVUFBUCxRQUFlLElBQUksU0FBUzs7bUJBQW5DOzs7SUFDTixLQUFLLEdBQUcsWUFBWTtTQUNoQixPQUFXOztRQUFQLE1BQU87WUFDRCxVQUFQOztpQ0FD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
//# sourceURL=../../kode/kolor/kulur.kode
