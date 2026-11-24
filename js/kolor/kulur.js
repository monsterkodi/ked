var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, afterWord, bangComment, base, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, commentStyle, commentStyles, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, FILEXT, fillBangComment, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handler, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, kolorPunct, LI, line, luaComment, luaString, mdPunct, MDSPAN, mdTag, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, punct, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, spaced, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

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
    var b, chnk, chnks, chunkd, chunks, clss, isUniko, l, lastWord, lastWordIndex, lineno, m, pushLastWord, s, segIndex, segs, sg, t, tb, turd, widths, wsum

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
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        segs = list1[_b_]
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
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            sg = list2[_c_]
            wsum += kseg.width(sg)
            widths.push(wsum)
        }
        lastWord = null
        lastWordIndex = -1
        pushLastWord = function ()
        {
            if (lastWord !== null)
            {
                chnks.chunks.push({start:widths[lastWordIndex],length:kseg.width(lastWord),match:kseg.str(lastWord),text:kseg.str(lastWord),clss:'text'})
                lastWord = null
                return lastWordIndex = -1
            }
        }
        var list3 = _k_.list(chunks)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            chnk = list3[_d_]
            pushLastWord()
            var list4 = _k_.list(chnk.segl)
            for (segIndex = 0; segIndex < list4.length; segIndex++)
            {
                s = list4[segIndex]
                isUniko = function (ch, cc)
                {
                    var isu

                    isu = cc >= 2000
                    if (isu)
                    {
                        if (_k_.in(ch,'■□▪◆●◯▸➜⮐…'))
                        {
                            return false
                        }
                    }
                    return isu
                }
                b = base(s)
                if (m = PUNCT.exec(b))
                {
                    pushLastWord()
                    turd = ''
                    var list5 = _k_.list(chnk.segl.slice(segIndex))
                    for (var _f_ = 0; _f_ < list5.length; _f_++)
                    {
                        t = list5[_f_]
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
                    if (isUniko(b,b.charCodeAt(0)))
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
                    chnks.chunks.push({start:widths[chnk.index + segIndex],length:kseg.width(s),match:b,text:s,turd:turd,clss:clss})
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
        for (var _10_ = 0; _10_ < list1.length; _10_++)
        {
            c = list1[_10_]
            c.clss = 'comment'
            if (mightBeHeader && !HEADER.test(c.match))
            {
                mightBeHeader = false
            }
        }
        if (mightBeHeader)
        {
            var list2 = _k_.list(restChunks)
            for (var _11_ = 0; _11_ < list2.length; _11_++)
            {
                c = list2[_11_]
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
    for (var _12_ = 0; _12_ < list1.length; _12_++)
    {
        c = list1[_12_]
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
    var _192_21_, _195_21_

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
    var _211_17_

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
    var type, _252_17_

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
    var ch, turd, _291_25_

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
            for (var _13_ = 0; _13_ < list1.length; _13_++)
            {
                ch = list1[_13_]
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
    var markFunc, _321_77_, _342_77_

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
    var next, prev, prevEnd, _424_21_, _436_50_

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
    var c, prev, _449_22_, _498_46_

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
                for (var _14_ = 0; _14_ < list1.length; _14_++)
                {
                    c = list1[_14_]
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
    var next, prev, prevEnd, _520_21_

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
    var p, prevPrev, _588_19_

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

noonProp = function ()
{
    var i, prev

    if (prev = getChunk(-1))
    {
        if (prev.start + prev.length + 1 < chunk.start)
        {
            if (prev.clss !== 'obj')
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
                    else
                    {
                        break
                    }
                }
            }
        }
        else if (prev.clss === 'obj')
        {
            setValue(0,'obj')
            return 1
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
        setValue(0,'obj')
        return 1
    }
    return noonProp()
}
MDSPAN = /(code|bold|italic)$/
FILEXT = exts.concat(['png','gif','jpg','jpeg','bmp','tiff','icns','mov','toml','cast','text'])

urlPunct = function ()
{
    var d, fileext, i, mdSpan, next, prev, s, _696_48_

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
    var prev, _748_44_

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
    var _798_46_, _799_26_, _803_61_, _806_61_

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
    var next, prev, _816_19_

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
    var next, scnd, type, _860_19_

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
    var type, _914_19_

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
    var type, _937_19_

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
    var prev, prevPrev, _1028_45_

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

mdPunct = function ()
{
    var lng, prev, stuck, type, _1058_73_, _1082_18_, _1082_50_, _1090_21_, _1115_21_

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
    var _1143_21_

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
    var _1204_17_

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
    var _1243_42_, _1243_64_, _1246_102_, _1246_41_, _1246_82_, _1252_102_, _1252_41_, _1252_82_

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
    var _1308_27_, _1308_34_

    return ((_1308_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1308_34_ : '')
}

getmatch = function (d)
{
    var _1309_27_, _1309_35_

    return ((_1309_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1309_35_ : '')
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
for (var _15_ = 0; _15_ < list1.length; _15_++)
{
    ext = list1[_15_]
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
for (var _16_ = 0; _16_ < list2.length; _16_++)
{
    ext = list2[_16_]
    commentStyles[ext] = {start:'<!--',end:'-->'}
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
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1472_40_, _1487_61_

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
    var list3 = _k_.list(lines)
    for (var _17_ = 0; _17_ < list3.length; _17_++)
    {
        line = list3[_17_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list4 = _k_.list(line.chunks)
                for (var _18_ = 0; _18_ < list4.length; _18_++)
                {
                    chunk = list4[_18_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list5 = _k_.list(line.chunks)
                    for (var _19_ = 0; _19_ < list5.length; _19_++)
                    {
                        chunk = list5[_19_]
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
                var list6 = _k_.list(handl.punct)
                for (var _1a_ = 0; _1a_ < list6.length; _1a_++)
                {
                    hnd = list6[_1a_]
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
                            if (mtch.turd === (((_1487_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1487_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
                var list7 = _k_.list(handl.word)
                for (var _1b_ = 0; _1b_ < list7.length; _1b_++)
                {
                    hnd = list7[_1b_]
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
    var cn, cr, txt, v, _1506_21_

    txt = ((_1506_21_=chunk.text) != null ? _1506_21_ : chunk.match)
    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = txt
            var list3 = _k_.list(cn)
            for (var _1c_ = 0; _1c_ < list3.length; _1c_++)
            {
                cr = list3[_1c_]
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
    var clines, index, lines, rngs, text, _1548_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1548_19_=arg.ext) != null ? _1548_19_ : 'coffee')
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
    commentStyles:commentStyles
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNXLFdBQUE7O09BQ0EsV0FBQTs7T0FDTCxjQUFBO0lBQVU7SUFBSzs7QUFFckIsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7OztJQUFQO0lBQ0EsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFFVixRQUFVO0FBQ1YsU0FBVTtBQUNWLFFBQVU7QUFDVixTQUFVO0FBQ1YsTUFBVTtBQUNWLFVBQVU7QUFDVixLQUFVO0FBRVYsYUFBYSxnQkFBZ0I7O0FBRTdCLGlCQUFPOztTQUNTOztlQUFWOztRQUNLLEVBQUUsV0FBVTs7ZUFBakI7O1dBQ0YsT0FBTyxjQUFjLEVBQUUsWUFBWTs7O0FBa0J2QyxvQkFBVSxPQUFNOzs7O1FBRU0sSUFBSSxPQUFNOztRQUE1QixNQUFNLFVBQUk7O2lCQUNLLElBQVc7O1FBQTFCLE1BQU07O0lBRU4sU0FBUztJQUNUO3lCQUVZOzs7UUFBUjtRQUVBLE9BQU8sS0FBSyxLQUFLO1FBRWpCLFNBQ0ksVUFDQSxNQUFRLEVBQ1IsTUFBUSxTQUNSLE9BQVEsT0FDUixJQUFRO1FBRVosT0FBTyxLQUFLO3NCQUVNOztZQUFsQjs7UUFFQSxTQUFTLEtBQUssT0FBTyxLQUFLLE1BQU07c0JBRWQ7O1lBQWxCOztRQUVBLFVBQVU7UUFDVixPQUFPOzZCQUNHOzs7WUFBTjtZQUNBLFFBQVEsS0FBSyxNQUFNO1lBQ25CLE9BQU8sS0FBSzs7UUFFaEIsV0FBVztRQUNYLGdCQUFnQjtRQUVoQjs7Z0JBRU8sYUFBWTs7Z0JBQ1gsTUFB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
//# sourceURL=../../kode/kolor/kulur.kode
