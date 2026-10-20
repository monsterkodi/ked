var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addValue, addValues, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, escape, ext, extStack, extTop, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, LI, ligatures, line, mdPunct, mmMacro, mmString, NEWLINE, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, PUNCT, pushExt, pushStack, regexp, replaceTabs, setValue, shPunct, simpleString, slashComment, SPACE, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

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
PUNCT = /\W+/gu
PUNCT = /[^\wäöüßÄÖÜáéíóúÁÉÍÓÚñÑçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕåÅæÆœŒøØłŁđĐ]+/gu
NUMBER = /^\d+$/
FLOAT = /^\d+f$/
HEXNUM = /^0x[a-fA-F\d]+$/
HEX = /^[a-fA-F\d]+$/
NEWLINE = /\r?\n/
LI = /(\sli\d\s|\sh\d\s)/
codeTypes = ['interpolation','code triple']

chunked = function (lines, ext)
{
    var lineno

    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    if (!(_k_.in(ext,exts)))
    {
        ext = 'txt'
    }
    lineno = 0
    return lines.map(function (text)
    {
        var advance, c, cc, chunks, clss, isUniko, l, last, line, m, pc, pi, punct, rl, s, sc, turd, w, wl

        line = {chunks:[],chars:0,index:lineno++,number:lineno,ext:ext}
        if (!(_k_.isStr(text)))
        {
            return line
        }
        chunks = replaceTabs(text).split(SPACE)
        if (chunks.length === 1 && chunks[0] === '')
        {
            return line
        }
        c = 0
        var list1 = _k_.list(chunks)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            s = list1[_b_]
            if (s === '')
            {
                c++
            }
            else
            {
                if (line.chunks.length)
                {
                    c++
                }
                l = s.length
                sc = c
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
                while (m = PUNCT.exec(s))
                {
                    if (m.index > 0)
                    {
                        wl = m.index - (c - sc)
                        w = s.slice(c - sc, typeof m.index === 'number' ? m.index : -1)
                        line.chunks.push({start:c,length:wl,match:w,clss:'text'})
                        c += wl
                    }
                    turd = punct = m[0]
                    pi = 0
                    advance = 1
                    clss = 'punct'
                    while (pi < punct.length - 1)
                    {
                        pc = punct[pi]
                        cc = punct.charCodeAt(pi)
                        advance = 1
                        if ((0xD800 <= cc && cc < 0xDBFF) && (0xDC00 <= punct.charCodeAt(pi + 1) && punct.charCodeAt(pi + 1) <= 0xDFFF))
                        {
                            advance = 2
                            clss = 'text'
                            pc += punct[pi + 1]
                        }
                        else if (isUniko(pc,cc))
                        {
                            clss = 'text unicode'
                        }
                        else
                        {
                            clss = 'punct'
                            if (_k_.in(pc,[',',';','{','}','(',')']))
                            {
                                clss += ' minor'
                            }
                        }
                        pi += advance
                        line.chunks.push({start:c,length:advance,match:pc,turd:turd,clss:clss})
                        c += advance
                        turd = turd.slice(advance)
                    }
                    if (pi < punct.length)
                    {
                        pc = punct[pi]
                        cc = punct.charCodeAt(pi)
                        if (isUniko(pc,cc))
                        {
                            clss = 'text unicode'
                        }
                        else
                        {
                            clss = 'punct'
                        }
                        if (_k_.in(punct.slice(pi),[',',';','{','}','(',')']))
                        {
                            clss += ' minor'
                        }
                        line.chunks.push({start:c,length:advance,match:punct.slice(pi),clss:clss})
                        c += advance
                    }
                }
                if (c < sc + l)
                {
                    rl = sc + l - c
                    w = s.slice(l - rl)
                    line.chunks.push({start:c,length:rl,match:w,clss:'text'})
                    c += rl
                }
            }
        }
        if (line.chunks.length)
        {
            last = line.chunks.slice(-1)[0]
            line.chars = last.start + last.length
        }
        return line
    })
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

    for (var _c_ = i = 0, _d_ = n; (_c_ <= _d_ ? i < n : i > n); (_c_ <= _d_ ? ++i : --i))
    {
        addValue(i,'comment')
    }
    if (chunkIndex < line.chunks.length - n)
    {
        restChunks = line.chunks.slice(chunkIndex + n)
        mightBeHeader = true
        var list1 = _k_.list(restChunks)
        for (var _e_ = 0; _e_ < list1.length; _e_++)
        {
            c = list1[_e_]
            c.clss = 'comment'
            if (mightBeHeader && !HEADER.test(c.match))
            {
                mightBeHeader = false
            }
        }
        if (mightBeHeader)
        {
            var list2 = _k_.list(restChunks)
            for (var _f_ = 0; _f_ < list2.length; _f_++)
            {
                c = list2[_f_]
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
    var _216_17_

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
        return addValues(3,type)
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
    var ch, turd, _262_25_

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
            for (var _10_ = 0; _10_ < list1.length; _10_++)
            {
                ch = list1[_10_]
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
    var markFunc, _298_77_, _321_77_

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
            addValue(0,'function tail')
            addValue(1,'function head')
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
            return 2
        }
        if (chunk.turd.startsWith('=>'))
        {
            markFunc()
            addValue(0,'function bound tail')
            addValue(1,'function bound head')
            if (line.chunks[0].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            return 2
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

kodePunct = function ()
{
    var next, prev, prevEnd, _397_21_, _409_50_

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
        if (prev.clss.endsWith('require'))
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
    var c, prev, _428_22_, _477_46_

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
                for (var _11_ = 0; _11_ < list1.length; _11_++)
                {
                    c = list1[_11_]
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
    var next, prev, prevEnd, _507_21_

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
    if (getmatch(-1) === '.')
    {
        prevPrev = getChunk(-2)
        if ((prevPrev != null ? prevPrev.match : undefined) !== '.')
        {
            addValue(-1,'property')
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
    var p, prevPrev, _575_19_

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
    if (notCode)
    {
        return
    }
    return noonProp()
}

noonWord = function ()
{
    if (notCode)
    {
        return
    }
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
            if (!prev.clss.startsWith('number') && prev.clss !== 'semver' && !(_k_.in(prev.match,'\\./')))
            {
                if (next = getChunk(1))
                {
                    if (next.start === chunk.start + chunk.length)
                    {
                        fileext = next.match
                        if (!(_k_.in(fileext,'\\./*+')))
                        {
                            setValue(-1,fileext + ' file')
                            addValue(0,fileext)
                            setValue(1,fileext + ' ext')
                            return 2
                        }
                    }
                }
            }
        }
        if (chunk.match === '/')
        {
            for (var _12_ = i = chunkIndex, _13_ = 0; (_12_ <= _13_ ? i <= 0 : i >= 0); (_12_ <= _13_ ? ++i : --i))
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
    var prev, _734_44_

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
                for (var _14_ = i = Math.max(0,chunkIndex - 2), _15_ = 0; (_14_ <= _15_ ? i <= 0 : i >= 0); (_14_ <= _15_ ? ++i : --i))
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
    var _787_46_, _788_26_, _792_61_, _795_61_

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
    var next, prev, _805_19_

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
    var next, scnd, type, _853_19_

    if (topType === 'regexp')
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    if (_k_.in(chunk.match,'"\''))
    {
        type = ((function ()
        {
            switch (chunk.match)
            {
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
                        return stacked()
                    }
                }
            }
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

tripleString = function ()
{
    var type, _893_19_

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
                return 'string double triple'

            case "'''":
                return 'string single triple'

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

number = function ()
{
    if (notCode)
    {
        return
    }
    if (NUMBER.test(chunk.match))
    {
        if (getmatch(-1) === '.')
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
                addValue(-1,'number float')
                setValue(0,'number float')
                return 1
            }
        }
        chunk.clss = 'number'
        return 1
    }
    if (HEXNUM.test(chunk.match))
    {
        chunk.clss = 'number hex'
        return 1
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
    var prev, prevPrev, _989_45_

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
        if (prev.match === '.' && (getChunk(-2) != null ? getChunk(-2).clss : undefined) !== 'number')
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
    var type, _1023_65_, _1048_21_, _1073_21_

    if (chunkIndex === 0)
    {
        if (!chunk.turd && _k_.in(chunk.match,'-*') && (getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + 1)
        {
            type = ['li1','li2','li3'][chunk.start / 4]
            pushStack({merge:true,fill:true,type:type})
            return addValue(0,type + ' marker')
        }
        if (chunk.match === '#')
        {
            if (!chunk.turd)
            {
                pushStack({merge:true,fill:true,type:'h1'})
                return addValue(0,'h1')
            }
            switch (chunk.turd)
            {
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
    var _1105_21_

    if ((topType != null ? topType.startsWith('string double') : undefined))
    {
        if ((chunk.turd != null ? chunk.turd.startsWith("\#{") : undefined))
        {
            pushStack({type:'interpolation',weak:true})
            setValue(0,'punct string interpolation start')
            setValue(1,'punct string interpolation start')
            return 2
        }
    }
    else if (topType === 'interpolation')
    {
        if (chunk.match === '}')
        {
            setValue(0,'punct string interpolation end')
            popStack()
            return 1
        }
    }
}

keyword = function ()
{
    var _1130_61_

    if (notCode)
    {
        return
    }
    if (!lang[ext])
    {
        return
    }
    if (lang[ext].hasOwnProperty(chunk.match) && !(_k_.in((getChunk(-1) != null ? getChunk(-1).match : undefined),['.'])))
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
        console.log(chunk,topType)
        pushStack({strong:true,merge:true,type:type})
        return addValues(2,type)
    }
}

shPunct = function ()
{
    var _1198_42_, _1198_64_, _1201_102_, _1201_41_, _1201_82_, _1207_102_, _1207_41_, _1207_82_

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
    var _1268_27_, _1268_34_

    return ((_1268_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1268_34_ : '')
}

getmatch = function (d)
{
    var _1269_27_, _1269_35_

    return ((_1269_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1269_35_ : '')
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

    for (var _16_ = i = 0, _17_ = n; (_16_ <= _17_ ? i < n : i > n); (_16_ <= _17_ ? ++i : --i))
    {
        addValue(i,value)
    }
    return n
}
handlers = {coffee:{punct:[blockComment,hashComment,tripleRegexp,coffeePunct,tripleString,simpleString,interpolation,dashArrow,regexp,dict],word:[keyword,coffeeWord,number,property]},kode:{punct:[blockComment,hashComment,tripleRegexp,kodePunct,tripleString,simpleString,interpolation,funcArgs,dashArrow,regexp,dict],word:[keyword,kodeWord,number,property]},noon:{punct:[noonComment,noonPunct,urlPunct],word:[noonWord,urlWord,number]},js:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},ts:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},iss:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},ini:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[number]},cpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},mm:{punct:[starComment,slashComment,simpleString,cppPointer],word:[keyword,number,float,cppWord]},zig:{punct:[starComment,slashComment,simpleString],word:[keyword,number,float,cppWord]},frag:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},vert:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},hpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},c:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},h:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},cs:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},pug:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},styl:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},css:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},sass:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},scss:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},swift:{punct:[starComment,slashComment,simpleString,dict],word:[keyword,number,property]},svg:{punct:[simpleString,xmlPunct],word:[keyword,number]},html:{punct:[simpleString,xmlPunct],word:[keyword,number]},htm:{punct:[simpleString,xmlPunct],word:[keyword,number]},xml:{punct:[simpleString,xmlPunct],word:[number]},sh:{punct:[hashComment,simpleString,urlPunct,shPunct],word:[keyword,urlWord,number]},json:{punct:[simpleString,jsonPunct,urlPunct],word:[keyword,jsonWord,urlWord,number]},yml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},yaml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},log:{punct:[simpleString,urlPunct,dict],word:[urlWord,number]},md:{punct:[mdPunct,urlPunct,xmlPunct],word:[urlWord,number]},fish:{punct:[hashComment,simpleString],word:[keyword,number]},py:{punct:[hashComment,simpleString],word:[keyword,number]}}
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

blocked = function (lines)
{
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1411_40_, _1426_61_

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
    for (var _19_ = 0; _19_ < list2.length; _19_++)
    {
        line = list2[_19_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list3 = _k_.list(line.chunks)
                for (var _1a_ = 0; _1a_ < list3.length; _1a_++)
                {
                    chunk = list3[_1a_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list4 = _k_.list(line.chunks)
                    for (var _1b_ = 0; _1b_ < list4.length; _1b_++)
                    {
                        chunk = list4[_1b_]
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
                for (var _1c_ = 0; _1c_ < list5.length; _1c_++)
                {
                    hnd = list5[_1c_]
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
                            if (mtch.turd === (((_1426_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1426_61_ : (turdChunk != null ? turdChunk.match : undefined))))
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
                for (var _1d_ = 0; _1d_ < list6.length; _1d_++)
                {
                    hnd = list6[_1d_]
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

replaceTabs = function (s)
{
    var i

    if (!(_k_.isStr(s)))
    {
        return s
    }
    i = 0
    while (i < s.length)
    {
        if (s[i] === '\t')
        {
            s = s.slice(0, typeof i === 'number' ? i : -1) + _k_.rpad(4 - (i % 4)) + s.slice(i + 1)
        }
        i += 1
    }
    return s
}

ligatures = function (lines)
{
    var index, _1467_26_, _1474_26_

    var list2 = _k_.list(lines)
    for (var _1e_ = 0; _1e_ < list2.length; _1e_++)
    {
        line = list2[_1e_]
        if (!(_k_.in(line.ext,['kode'])))
        {
            continue
        }
        var list3 = _k_.list(line.chunks)
        for (index = 0; index < list3.length; index++)
        {
            chunk = list3[index]
            if ((chunk.turd != null ? chunk.turd.startsWith('...') : undefined))
            {
                chunk.clss += ' ligature'
                chunk.match = '...'
                chunk.length = 3
                line.chunks.splice(index + 1,2)
            }
            else if ((chunk.turd != null ? chunk.turd.startsWith('..') : undefined))
            {
                if (chunk.turd[2] !== '/')
                {
                    chunk.clss += ' ligature'
                    chunk.match = '..'
                    chunk.length = 2
                    line.chunks.splice(index + 1,1)
                }
            }
            else if (_k_.in(chunk.turd,['->','=>','==','!=','<=','>=','===','>>','<<','//']))
            {
                chunk.clss += ' ligature'
                chunk.match = chunk.turd
                chunk.length = chunk.turd.length
                line.chunks.splice(index + 1,chunk.turd.length - 1)
            }
        }
    }
    return lines
}

parse = function (lines, ext = 'kode')
{
    return ligatures(blocked(chunked(lines,ext)))
}

kolorize = function (chunk)
{
    var cn, cr, v

    if (cn = klor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = chunk.match
            var list2 = _k_.list(cn)
            for (var _20_ = 0; _20_ < list2.length; _20_++)
            {
                cr = list2[_20_]
                v = klor[cr](v)
            }
            return v
        }
        else
        {
            return klor[cn](chunk.match)
        }
    }
    if (chunk.clss.endsWith('file'))
    {
        return _k_.w8(chunk.match)
    }
    else if (chunk.clss.endsWith('ext'))
    {
        return _k_.w3(chunk.match)
    }
    else if (chunk.clss.startsWith('punct'))
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return _k_.w2(chunk.match)
        }
    }
    else
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return chunk.match
        }
    }
}

kolorizeChunks = function (chunks = [], number)
{
    var c, clrzd, i, numstr

    clrzd = ''
    if (number)
    {
        numstr = String(number)
        clrzd += _k_.w2(numstr) + _k_.rpad(4 - numstr.length)
    }
    c = 0
    for (var _21_ = i = 0, _22_ = chunks.length; (_21_ <= _22_ ? i < chunks.length : i > chunks.length); (_21_ <= _22_ ? ++i : --i))
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
    var clines, index, lines, numbers, rngs, text, _1556_19_, _1557_25_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1556_19_=arg.ext) != null ? _1556_19_ : 'coffee')
    numbers = ((_1557_25_=arg.numers) != null ? _1557_25_ : false)
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (var _23_ = index = 0, _24_ = lines.length; (_23_ <= _24_ ? index < lines.length : index > lines.length); (_23_ <= _24_ ? ++index : --index))
    {
        line = lines[index]
        if (ext === 'js' && line.startsWith('//# source'))
        {
            continue
        }
        clines.push(kolorizeChunks(rngs[index],numbers && index + 1))
    }
    return clines.join('\n')
}
export default {
    klor:klor,
    exts:exts,
    parse:parse,
    chunked:chunked,
    ranges:function (line, ext = 'kode')
    {
        return parse([line],ext)[0].chunks
    },
    dissect:function (lines, ext = 'kode')
    {
        return parse(lines,ext).map(function (l)
        {
            return l.chunks
        })
    },
    kolorize:kolorize,
    kolorizeChunks:kolorizeChunks,
    syntax:syntax
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29sb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29sb3Iva29sb3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVdBLFNBQ0ksS0FDSSxRQUFRLEtBQUssSUFBSSxHQUFHLEtBQUssT0FBTyxJQUNwQyxJQUNJLGNBQWMsS0FBSyxNQUFNLEdBQUcsU0FBUyxJQUFJLE1BQU0sSUFBSSxlQUNuRCxZQUFjLEtBQUssTUFBTSxHQUFHLEtBQVMsSUFBSSxNQUFNLElBQUk7b0JBRWhEOzs7O0lBQ1AsTUFBTSxHQUFHLFFBQU8sS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sSUFBSTs7QUFFcEQsUUFBVTtBQUNWLFNBQVU7QUFDVixRQUFVO0FBRVYsUUFBVztBQUNYLFNBQVU7QUFDVixRQUFVO0FBQ1YsU0FBVTtBQUNWLE1BQVU7QUFDVixVQUFVO0FBQ1YsS0FBVTtBQUVWLGFBQWEsZ0JBQWdCOztBQXdCN0I7Ozs7UUFFc0IsSUFBSSxPQUFNOztRQUE1QixNQUFNLFVBQUk7O2lCQUNLLElBQVc7O1FBQTFCLE1BQU07O0lBRU4sU0FBUztXQUNULE1BQU07Ozs7UUFFRixRQUNJLFVBQ0EsTUFBUSxFQUNSLE1BQVEsU0FDUixPQUFRLE9BQ1IsSUFBUTt3QkFFRTs7bUJBQVo7O1FBRUYsU0FBUyxZQUFZLE1BQU0sTUFBTTtZQUU5QixPQUFPLFdBQVUsS0FBTSxPQUFPLE9BQU07O21CQUNqQzs7UUFFTixJQUFJOzZCQUNLOzs7O2dCQUNGLE1BQUs7O2dCQUNKOzs7O29CQUVHLEtBQUssT0FBTzs7b0JBQVk7O2dCQUMzQixJQUFJLEVBQUU7Z0JBQ04sS0FBSztnQkFFTDs7OztvQkFDSSxNQUFNLE1BQU07d0JBQ1Q7O21DQUFpQixHQUFNOzttQ0FBZjs7OzJCQUNYOzt1QkFJRSxJQUFJLE1BQU0sS0FBSzs7d0JBRWQsRUFBRSxRQUFROzt3QkFDVCxLQUFLLEVBQUUsU0FBTyxJQUFFO3dCQUNoQixJQUFJLFFBQUUsSUFBRSxXQUFLLEVBQUUscUJBQUYsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/kolor/kolor.kode
