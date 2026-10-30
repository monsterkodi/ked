var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, afterWord, base, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, commentStyle, commentStyles, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handler, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, kolorPunct, LI, line, luaComment, luaString, mdPunct, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, punct, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, spaced, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

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
    var _229_17_

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
    var type, _270_17_

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
    var ch, turd, _315_26_

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
    var markFunc, _351_77_, _372_77_

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
    var next, prev, prevEnd, _453_21_, _465_50_

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
    var c, prev, _484_22_, _533_46_

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
    var next, prev, prevEnd, _561_21_

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
    var p, prevPrev, _629_19_

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
    var prev, _785_44_

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
    var _843_46_, _844_26_, _848_61_, _851_61_

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
    var next, prev, _861_19_

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
    var next, scnd, type, _909_19_

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
    var type, _963_19_

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
    var type, _986_19_

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
    var prev, prevPrev, _1090_45_

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
    var type, _1124_73_, _1149_21_, _1174_21_

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
    var _1206_21_

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
    var _1305_42_, _1305_64_, _1308_102_, _1308_41_, _1308_82_, _1314_102_, _1314_41_, _1314_82_

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
    var _1376_27_, _1376_34_

    return ((_1376_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1376_34_ : '')
}

getmatch = function (d)
{
    var _1377_27_, _1377_35_

    return ((_1377_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1377_35_ : '')
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
for (var _1f_ = 0; _1f_ < list2.length; _1f_++)
{
    ext = list2[_1f_]
    commentStyles[ext] = {start:'<!--',end:'-->'}
}

commentStyle = function (ext)
{
    var _1474_23_

    if (!(_k_.isStr(ext)))
    {
        return null
    }
    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    return ((_1474_23_=commentStyles[ext]) != null ? _1474_23_ : null)
}

blocked = function (lines)
{
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1559_40_, _1574_61_

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
    for (var _20_ = 0; _20_ < list3.length; _20_++)
    {
        line = list3[_20_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list4 = _k_.list(line.chunks)
                for (var _21_ = 0; _21_ < list4.length; _21_++)
                {
                    chunk = list4[_21_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list5 = _k_.list(line.chunks)
                    for (var _22_ = 0; _22_ < list5.length; _22_++)
                    {
                        chunk = list5[_22_]
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
            else
            {
                if (!notCode)
                {
                    if (mtch = (swtch[line.ext] != null ? swtch[line.ext][chunk.match] : undefined))
                    {
                        if (mtch.turd)
                        {
                            turdChunk = getChunk(-mtch.turd.length)
                            if (mtch.turd === (((_1574_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1574_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
                for (var _24_ = 0; _24_ < list7.length; _24_++)
                {
                    hnd = list7[_24_]
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
    var cn, cr, txt, v, _1605_21_

    txt = ((_1605_21_=chunk.text) != null ? _1605_21_ : chunk.match)
    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = txt
            var list3 = _k_.list(cn)
            for (var _25_ = 0; _25_ < list3.length; _25_++)
            {
                cr = list3[_25_]
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
    for (var _26_ = i = 0, _27_ = chunks.length; (_26_ <= _27_ ? i < chunks.length : i > chunks.length); (_26_ <= _27_ ? ++i : --i))
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
    var clines, index, lines, rngs, text, _1653_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1653_19_=arg.ext) != null ? _1653_19_ : 'coffee')
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (var _28_ = index = 0, _29_ = lines.length; (_28_ <= _29_ ? index < lines.length : index > lines.length); (_28_ <= _29_ ? ++index : --index))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFXLFdBQUE7O09BQ0EsV0FBQTs7T0FDTCxjQUFBO0lBQVU7SUFBSzs7QUFFckIsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7OztJQUFQO0lBQ0EsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFRVixRQUFVO0FBQ1YsU0FBVTtBQUNWLFFBQVU7QUFDVixTQUFVO0FBQ1YsTUFBVTtBQUNWLFVBQVU7QUFDVixLQUFVO0FBRVYsYUFBYSxnQkFBZ0I7O0FBTTdCLGlCQUFPOztTQUNVOztlQUFWOztRQUNLLEVBQUUsV0FBVTs7ZUFBakI7O1dBQ0gsT0FBTyxjQUFjLEVBQUUsWUFBWTs7O0FBd0J2QyxvQkFBVSxPQUFNOzs7O1FBRU0sSUFBSSxPQUFNOztRQUE1QixNQUFNLFVBQUk7O2lCQUNLLElBQVc7O1FBQTFCLE1BQU07O0lBRU4sU0FBUztJQUNUO3lCQUVZOzs7UUFBUjtRQUVBLE9BQU8sS0FBSyxLQUFLO1FBRWpCLFNBQ0ksVUFDQSxNQUFRLEVBQ1IsTUFBUSxTQUNSLE9BQVEsT0FDUixJQUFRO1FBRVosT0FBTyxLQUFLO3NCQUVNOztZQUFsQjs7UUFFQSxTQUFTLEtBQUssT0FBTyxLQUFLLE1BQU07c0JBRWQ7O1lBQWxCOztRQUVBLFVBQVU7UUFDVixPQUFPOzZCQUNHOzs7WUFBTjtZQUNBLFFBQVEsS0FBSyxNQUFNO1lBQ25CLE9BQU8sS0FBSzs7UUFFaEIsV0FBVztRQUNYLGdCQUFnQjtRQUVoQjs7Z0JBRU8sYUFBWTs7Z0JBQ1gsTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/kulur.kode
