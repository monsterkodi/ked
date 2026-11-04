var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, afterWord, bangComment, base, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, commentStyle, commentStyles, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, fillBangComment, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handler, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, kolorPunct, LI, line, luaComment, luaString, mdPunct, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, punct, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, spaced, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

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
                        if (_k_.in(ch,'■□▪◆●○▸➜⮐'))
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

bangComment = function (n, name)
{
    var c

    addAndJoinValues(n,`comment ${name}`)
    var list1 = _k_.list(line.chunks.slice(chunkIndex + 1))
    for (var _14_ = 0; _14_ < list1.length; _14_++)
    {
        c = list1[_14_]
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
    var ch, turd, _291_26_

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
            for (var _15_ = 0; _15_ < list1.length; _15_++)
            {
                ch = list1[_15_]
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
    var next, prev, prevEnd, _424_21_, _436_50_

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
                for (var _16_ = 0; _16_ < list1.length; _16_++)
                {
                    c = list1[_16_]
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
            for (var _17_ = i = chunkIndex, _18_ = 0; (_17_ <= _18_ ? i <= 0 : i >= 0); (_17_ <= _18_ ? ++i : --i))
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
    var prev, _731_44_

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
                for (var _19_ = i = Math.max(0,chunkIndex - 2), _1a_ = 0; (_19_ <= _1a_ ? i <= 0 : i >= 0); (_19_ <= _1a_ ? ++i : --i))
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
    var _781_46_, _782_26_, _786_61_, _789_61_

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
    var next, prev, _799_19_

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
    var next, scnd, type, _843_19_

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
    var type, _897_19_

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
    var type, _920_19_

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
    var prev, prevPrev, _1010_45_

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
    var type, _1040_73_, _1065_21_, _1090_21_

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
    var _1116_21_

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
    var _1185_42_, _1185_64_, _1188_102_, _1188_41_, _1188_82_, _1194_102_, _1194_41_, _1194_82_

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
    var _1250_27_, _1250_34_

    return ((_1250_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1250_34_ : '')
}

getmatch = function (d)
{
    var _1251_27_, _1251_35_

    return ((_1251_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1251_35_ : '')
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

    for (var _1b_ = i = 0, _1c_ = n; (_1b_ <= _1c_ ? i < n : i > n); (_1b_ <= _1c_ ? ++i : --i))
    {
        addValue(i,value)
    }
    return n
}

addAndJoinValues = function (n, value)
{
    var i

    line.chunks[chunkIndex].clss += ' ' + value
    for (var _1d_ = i = 1, _1e_ = n; (_1d_ <= _1e_ ? i < n : i > n); (_1d_ <= _1e_ ? ++i : --i))
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
for (var _1f_ = 0; _1f_ < list1.length; _1f_++)
{
    ext = list1[_1f_]
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
for (var _20_ = 0; _20_ < list2.length; _20_++)
{
    ext = list2[_20_]
    commentStyles[ext] = {start:'<!--',end:'-->'}
}

commentStyle = function (ext)
{
    var _1348_23_

    if (!(_k_.isStr(ext)))
    {
        return null
    }
    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    return ((_1348_23_=commentStyles[ext]) != null ? _1348_23_ : null)
}

blocked = function (lines)
{
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1413_40_, _1428_61_

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
    for (var _21_ = 0; _21_ < list3.length; _21_++)
    {
        line = list3[_21_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list4 = _k_.list(line.chunks)
                for (var _22_ = 0; _22_ < list4.length; _22_++)
                {
                    chunk = list4[_22_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list5 = _k_.list(line.chunks)
                    for (var _23_ = 0; _23_ < list5.length; _23_++)
                    {
                        chunk = list5[_23_]
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
                for (var _24_ = 0; _24_ < list6.length; _24_++)
                {
                    hnd = list6[_24_]
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
                            if (mtch.turd === (((_1428_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1428_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
                for (var _25_ = 0; _25_ < list7.length; _25_++)
                {
                    hnd = list7[_25_]
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
    var cn, cr, txt, v, _1447_21_

    txt = ((_1447_21_=chunk.text) != null ? _1447_21_ : chunk.match)
    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = txt
            var list3 = _k_.list(cn)
            for (var _26_ = 0; _26_ < list3.length; _26_++)
            {
                cr = list3[_26_]
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
    for (var _27_ = i = 0, _28_ = chunks.length; (_27_ <= _28_ ? i < chunks.length : i > chunks.length); (_27_ <= _28_ ? ++i : --i))
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
    var clines, index, lines, rngs, text, _1489_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1489_19_=arg.ext) != null ? _1489_19_ : 'coffee')
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (var _29_ = index = 0, _2a_ = lines.length; (_29_ <= _2a_ ? index < lines.length : index > lines.length); (_29_ <= _2a_ ? ++index : --index))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VsdXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva3VsdXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNXLFdBQUE7O09BQ0EsV0FBQTs7T0FDTCxjQUFBO0lBQVU7SUFBSzs7QUFFckIsU0FDSSxLQUNJLFFBQVEsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQ3BDLElBQ0ksY0FBYyxLQUFLLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxJQUFJLGVBQ25ELFlBQWMsS0FBSyxNQUFNLEdBQUcsS0FBUyxJQUFJLE1BQU0sSUFBSTtvQkFFaEQ7OztJQUFQO0lBQ0EsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFFVixRQUFVO0FBQ1YsU0FBVTtBQUNWLFFBQVU7QUFDVixTQUFVO0FBQ1YsTUFBVTtBQUNWLFVBQVU7QUFDVixLQUFVO0FBRVYsYUFBYSxnQkFBZ0I7O0FBRTdCLGlCQUFPOztTQUNVOztlQUFWOztRQUNLLEVBQUUsV0FBVTs7ZUFBakI7O1dBQ0gsT0FBTyxjQUFjLEVBQUUsWUFBWTs7O0FBa0J2QyxvQkFBVSxPQUFNOzs7O1FBRU0sSUFBSSxPQUFNOztRQUE1QixNQUFNLFVBQUk7O2lCQUNLLElBQVc7O1FBQTFCLE1BQU07O0lBRU4sU0FBUztJQUNUO3lCQUVZOzs7UUFBUjtRQUVBLE9BQU8sS0FBSyxLQUFLO1FBRWpCLFNBQ0ksVUFDQSxNQUFRLEVBQ1IsTUFBUSxTQUNSLE9BQVEsT0FDUixJQUFRO1FBRVosT0FBTyxLQUFLO3NCQUVNOztZQUFsQjs7UUFFQSxTQUFTLEtBQUssT0FBTyxLQUFLLE1BQU07c0JBRWQ7O1lBQWxCOztRQUVBLFVBQVU7UUFDVixPQUFPOzZCQUNHOzs7WUFBTjtZQUNBLFFBQVEsS0FBSyxNQUFNO1lBQ25CLE9BQU8sS0FBSzs7UUFFaEIsV0FBVztRQUNYLGdCQUFnQjtRQUVoQjs7Z0JBRU8sYUFBWTs7Z0JBQ1gsTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/kulur.kode
