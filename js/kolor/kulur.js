var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, afterWord, base, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, kolorPunct, LI, line, luaComment, luaString, mdPunct, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, spaced, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

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
                        if (_k_.in(ch,'■▪◆●○▸➜⮐'))
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

    for (var _10_ = i = 0, _11_ = n; (_10_ <= _11_ ? i < n : i > n); (_10_ <= _11_ ? ++i : --i))
    {
        addValue(i,'comment')
    }
    if (chunkIndex < line.chunks.length - n)
    {
        restChunks = line.chunks.slice(chunkIndex + n)
        mightBeHeader = true
        var list1 = _k_.list(restChunks)
        for (var _12_ = 0; _12_ < list1.length; _12_++)
        {
            c = list1[_12_]
            c.clss = 'comment'
            if (mightBeHeader && !HEADER.test(c.match))
            {
                mightBeHeader = false
            }
        }
        if (mightBeHeader)
        {
            var list2 = _k_.list(restChunks)
            for (var _13_ = 0; _13_ < list2.length; _13_++)
            {
                c = list2[_13_]
                c.clss += ' header'
            }
        }
    }
    return line.chunks.length - chunkIndex + n
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
    if (chunk.match === "#")
    {
        return fillComment(1)
    }
}

noonComment = function ()
{
    if (stackTop)
    {
        return
    }
    if (chunk.match === "#" && chunkIndex === 0)
    {
        return fillComment(1)
    }
}

slashComment = function ()
{
    var _238_17_

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
    var type, _279_17_

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
    var ch, turd, _326_26_

    if (notCode)
    {
        return
    }
    if (!chunk.turd)
    {
        return
    }
    turd = (chunk.turd[0] === '○' ? chunk.turd.slice(1, 3) : chunk.turd.slice(0, 2))
    if (_k_.in(turd[0],'=-') && turd[1] === '>')
    {
        if (_k_.in((getChunk(-1) != null ? getChunk(-1).match : undefined),':)'))
        {
            return
        }
        if (_k_.in(line.chunks[0].clss,['text','dictionary key']) && _k_.in(line.chunks[1].match,':='))
        {
            var list1 = _k_.list(line.chunks.slice(2, typeof chunkIndex === 'number' ? chunkIndex : -1))
            for (var _14_ = 0; _14_ < list1.length; _14_++)
            {
                ch = list1[_14_]
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
    var markFunc, _362_77_, _383_77_

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
        if (chunk.turd.startsWith('○->'))
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
        if (chunk.turd.startsWith('○=>'))
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
    var next, prev, prevEnd, _464_21_, _476_50_

    if (notCode)
    {
        return
    }
    if (_k_.in(chunk.match,'▸➜'))
    {
        return addValue(0,'keyword')
    }
    if (_k_.in(chunk.match,'⮐'))
    {
        return addValue(0,'keyword return')
    }
    if (next = getChunk(1))
    {
        if (_k_.in(chunk.match,'○') && !(_k_.in(next.match,'-=')))
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
    var c, prev, _495_22_, _544_46_

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
                for (var _15_ = 0; _15_ < list1.length; _15_++)
                {
                    c = list1[_15_]
                    c.clss = 'section'
                }
                return line.chunks.length - chunkIndex
            }
        }
        if (_k_.in(prev.match,['class','extends','function']))
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
    var next, prev, prevEnd, _572_21_

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
    var p, prevPrev, _640_19_

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

urlPunct = function ()
{
    var fileext, i, next, prev

    if (prev = getChunk(-1))
    {
        if (chunk.turd === '://')
        {
            if (getmatch(4) === '.' && getChunk(5))
            {
                setValue(-1,'url protocol')
                addValues(3,'url')
                setValue(3,'url domain')
                setValue(4,'punct url tld')
                setValue(5,'url tld')
                return 6
            }
        }
        if (chunk.match === '.')
        {
            if (!prev.clss.startsWith('number') && prev.clss !== 'semver' && !(_k_.in(prev.match,'\\./')) && !/\d+/.test(prev.match) && _k_.empty(topType))
            {
                if (next = getChunk(1))
                {
                    if (next.start === chunk.start + chunk.length)
                    {
                        fileext = next.match
                        if (!(_k_.in(fileext,'\\./*+')))
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
        if (chunk.match === '/')
        {
            for (var _16_ = i = chunkIndex, _17_ = 0; (_16_ <= _17_ ? i <= 0 : i >= 0); (_16_ <= _17_ ? ++i : --i))
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

    if (prev = getChunk(-1))
    {
        if (_k_.in(prev.match,'\\/'))
        {
            next = getChunk(1)
            if (!next || next.start > chunk.start + chunk.length || !(_k_.in(next.match,'\\./')))
            {
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
    var prev, _796_44_

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
                for (var _18_ = i = Math.max(0,chunkIndex - 2), _19_ = 0; (_18_ <= _19_ ? i <= 0 : i >= 0); (_18_ <= _19_ ? ++i : --i))
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
    var _854_46_, _855_26_, _859_61_, _862_61_

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
    var next, prev, _872_19_

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
    var next, scnd, type, _920_19_

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
    var type, _977_19_

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
    var type, _1000_19_

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
    var prev, prevPrev, _1104_45_

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
    var type, _1138_73_, _1163_21_, _1188_21_

    if (chunkIndex === 0)
    {
        if (chunk.turd.length <= 1 && _k_.in(chunk.match,'-*') && (getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + 1)
        {
            type = ['li1','li2','li3','li4','li5'][parseInt(chunk.start / 4)]
            pushStack({merge:true,fill:true,type:type})
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
    if (chunk.match === '*')
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
            if (_k_.in(getmatch(3),['coffeescript','javascript','js']))
            {
                setValue(3,'comment')
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
    var _1220_21_

    if ((topType != null ? topType.startsWith('string double') : undefined))
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

xmlPunct = function ()
{
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
    var _1320_42_, _1320_64_, _1323_102_, _1323_41_, _1323_82_, _1329_102_, _1329_41_, _1329_82_

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
    var _1391_27_, _1391_34_

    return ((_1391_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1391_34_ : '')
}

getmatch = function (d)
{
    var _1392_27_, _1392_35_

    return ((_1392_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1392_35_ : '')
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

    for (var _1a_ = i = 0, _1b_ = n; (_1a_ <= _1b_ ? i < n : i > n); (_1a_ <= _1b_ ? ++i : --i))
    {
        addValue(i,value)
    }
    return n
}

addAndJoinValues = function (n, value)
{
    var i

    line.chunks[chunkIndex].clss += ' ' + value
    for (var _1c_ = i = 1, _1d_ = n; (_1c_ <= _1d_ ? i < n : i > n); (_1c_ <= _1d_ ? ++i : --i))
    {
        line.chunks[chunkIndex].match += line.chunks[chunkIndex + i].match
        line.chunks[chunkIndex].text += line.chunks[chunkIndex + i].text
        line.chunks[chunkIndex].length += 1
    }
    line.chunks.splice(chunkIndex + 1,n - 1)
    return 1
}
handlers = {coffee:{punct:[blockComment,hashComment,tripleRegexp,coffeePunct,tripleString,simpleString,interpolation,dashArrow,regexp,dict],word:[keyword,coffeeWord,number,property]},kode:{punct:[blockComment,hashComment,tripleRegexp,kodePunct,tripleString,simpleString,interpolation,funcArgs,dashArrow,regexp,dict],word:[keyword,kodeWord,number,property]},kim:{punct:[blockComment,hashComment,kodePunct,tripleString,interpolation,simpleString,funcArgs,dashArrow,dict],word:[keyword,kodeWord,number,property]},kua:{punct:[blockComment,hashComment,kodePunct,kolorPunct,tripleString,interpolation,simpleString,funcArgs,dashArrow,dict],word:[keyword,kodeWord,number,property]},nim:{punct:[nimComment,hashComment,simpleString,funcArgs,dashArrow],word:[keyword,number,property]},lua:{punct:[luaComment,simpleString,luaString,funcArgs,dashArrow],word:[keyword,number,property]},noon:{punct:[noonComment,noonPunct,urlPunct],word:[noonWord,urlWord,number]},js:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},ts:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},iss:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},ini:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[number]},cpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},mm:{punct:[starComment,slashComment,simpleString,cppPointer],word:[keyword,number,float,cppWord]},zig:{punct:[starComment,slashComment,simpleString],word:[keyword,number,float,cppWord]},frag:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},vert:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},hpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},c:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},h:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},cs:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},pug:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},styl:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},css:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},sass:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},scss:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},swift:{punct:[starComment,slashComment,simpleString,dict],word:[keyword,number,property]},svg:{punct:[simpleString,xmlPunct],word:[keyword,number]},html:{punct:[simpleString,xmlPunct],word:[keyword,number]},htm:{punct:[simpleString,xmlPunct],word:[keyword,number]},xml:{punct:[simpleString,xmlPunct],word:[number]},sh:{punct:[hashComment,simpleString,urlPunct,shPunct],word:[keyword,urlWord,number]},json:{punct:[simpleString,jsonPunct,urlPunct],word:[keyword,jsonWord,urlWord,number]},yml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},yaml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},log:{punct:[simpleString,urlPunct,dict],word:[urlWord,number]},md:{punct:[mdPunct,urlPunct,xmlPunct],word:[urlWord,number]},fish:{punct:[hashComment,simpleString],word:[keyword,number]},py:{punct:[hashComment,simpleString],word:[keyword,number]}}
var list1 = _k_.list(exts)
for (var _1e_ = 0; _1e_ < list1.length; _1e_++)
{
    ext = list1[_1e_]
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

blocked = function (lines)
{
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1551_40_, _1566_61_

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
    var list2 = _k_.list(lines)
    for (var _1f_ = 0; _1f_ < list2.length; _1f_++)
    {
        line = list2[_1f_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list3 = _k_.list(line.chunks)
                for (var _20_ = 0; _20_ < list3.length; _20_++)
                {
                    chunk = list3[_20_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list4 = _k_.list(line.chunks)
                    for (var _21_ = 0; _21_ < list4.length; _21_++)
                    {
                        chunk = list4[_21_]
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
                var list5 = _k_.list(handl.punct)
                for (var _22_ = 0; _22_ < list5.length; _22_++)
                {
                    hnd = list5[_22_]
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
                            if (mtch.turd === (((_1566_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1566_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
                var list6 = _k_.list(handl.word)
                for (var _23_ = 0; _23_ < list6.length; _23_++)
                {
                    hnd = list6[_23_]
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
    var cn, cr, txt, v, _1597_21_

    txt = ((_1597_21_=chunk.text) != null ? _1597_21_ : chunk.match)
    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = txt
            var list2 = _k_.list(cn)
            for (var _24_ = 0; _24_ < list2.length; _24_++)
            {
                cr = list2[_24_]
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
    for (var _25_ = i = 0, _26_ = chunks.length; (_25_ <= _26_ ? i < chunks.length : i > chunks.length); (_25_ <= _26_ ? ++i : --i))
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
    var clines, index, lines, rngs, text, _1645_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1645_19_=arg.ext) != null ? _1645_19_ : 'coffee')
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (var _27_ = index = 0, _28_ = lines.length; (_27_ <= _28_ ? index < lines.length : index > lines.length); (_27_ <= _28_ ? ++index : --index))
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
    syntax:syntax
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUEsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7Ozs7SUFDUCxNQUFNLEdBQUcsUUFBTyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksTUFBTSxJQUFJOztBQUVwRCxRQUFVO0FBQ1YsU0FBVTtBQVlWLFFBQVc7QUFDWCxTQUFVO0FBQ1YsUUFBVTtBQUNWLFNBQVU7QUFDVixNQUFVO0FBQ1YsVUFBVTtBQUNWLEtBQVU7QUFFVixhQUFhLGdCQUFnQjs7QUFLN0I7O1NBQ2lCOztlQUFWOztRQUNLLEVBQUUsV0FBVTs7ZUFBakI7O1dBQ0gsT0FBTyxjQUFjLEVBQUUsWUFBWTs7O0FBd0J2Qzs7OztRQUVzQixJQUFJLE9BQU07O1FBQTVCLE1BQU0sVUFBSTs7aUJBQ0ssSUFBVzs7UUFBMUIsTUFBTTs7SUFFTixTQUFTO0lBQ1Q7eUJBRVk7Ozs7UUFNUixPQUFPLEtBQUssS0FBSztRQUVqQixTQUNJLFVBQ0EsTUFBUSxFQUNSLE1BQVEsU0FDUixPQUFRLE9BQ1IsSUFBUTtRQUVaLE9BQU8sS0FBSztzQkFFTTs7WUFBbEI7O1FBRUEsU0FBUyxLQUFLLE9BQU8sS0FBSyxNQUFNO3NCQUVkOztZQUFsQjs7UUFJQSxVQUFVO1FBQ1YsT0FBTzs2QkFDRzs7OztZQUNOLFFBQVEsS0FBSyxNQUFNO1lBQ25CLE9BQU8sS0FBSzs7UUFFaEIsV0FBVztRQUNYLGdCQUFnQjtRQUVoQjs7Z0JBRU8sYUFBWTs7Z0JBQ1gsTUFBTSxPQUFPLE1BQUssTUFBTSxPQUFPLGVBQWUsT0FBTyxLQUFLLE1BQU0sVUFBVSxNQUFNLEtBQUssSUFBSSxV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
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/kulur.kode
