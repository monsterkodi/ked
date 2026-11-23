var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.Y5=_k_.k.B256(_k_.k.Y(5));_k_.w1=_k_.k.F256(_k_.k.w(1))

var closers, nameable, needsPair, Parse, reserved, wantsLeft, wantsOperand, wantsRight, wantsSlice

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol

import print from "./print.js"
import parseutils from "./parseutils.js"

wantsOperand = ['else','catch','finally','throw','super','extends','when','in','await','typeof']
reserved = ['await','break','case','catch','class','const','continue','debugger','default','delete','do','else','enum','export','extends','finally','for','function','if','implements','import','in','instanceof','interface','let','new','package','private','protected','public','return','static','super','switch','throw','try','typeof','var','void','while','with','yield']
nameable = ['await','enum','implements','interface','let','package','private','protected','public','static','yield']
wantsRight = ['+','-','~','!']
wantsLeft = ['*','/','%','^','&','|','<','>','=','==']
wantsSlice = ['..']
needsPair = {'(':'parens is missing closing )','[':'array is missing closing ]','{':'curly is missing closing }',',':"missing expression after ','",'.':'property access is missing property name',':':': is missing a key and a value','▴':'assert is missing what to assert','◯':'await is missing an operand','◆':'◆ is missing what it calls'}
closers = {'(':')','[':']','{':'}'}

Parse = (function ()
{
    _k_.extend(Parse, parseutils)
    function Parse (kode)
    {
        this.kode = kode
    
        this.debug = this.kode.args.debug
        this.verbose = this.kode.args.verbose
        return Parse.__super__.constructor.apply(this, arguments)
    }

    Parse.prototype["onError"] = function (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    Parse.prototype["nameIsReserved"] = function (name)
    {
        if (_k_.in(name.text,reserved))
        {
            this.onError(`${name.text} is a javascript reserved word`,{tok:name})
        }
        return true
    }

    Parse.prototype["parse"] = function (block)
    {
        var ast, p

        this.stack = []
        this.sheap = []
        this.seps = []
        this.juxta = []
        this.collectSeps(block.tokens)
        ast = {vars:[],exps:this.exps('tl',block.tokens)}
        var list = _k_.list(this.juxta)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            this.onError(`did you mean [${this.groupText(p)}]?`,{tok:p.parens.open})
        }
        return ast
    }

    Parse.prototype["collectSeps"] = function (tokens)
    {
        var t

        var list = _k_.list(tokens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            t = list[_a_]
            if (t.type === 'block')
            {
                this.collectSeps(t.tokens)
            }
            else if (_k_.in(t.text,[',',';']))
            {
                this.seps.push(t)
            }
        }
    }

    Parse.prototype["separated"] = function (a, b)
    {
        var after, before, e, s, t

        e = lastLineCol(a)
        s = firstLineCol(b)
        var list = _k_.list(this.seps)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            t = list[_a_]
            after = t.line > e.line || t.line === e.line && t.col >= e.col
            before = t.line < s.line || t.line === s.line && t.col < s.col
            if (after && before)
            {
                return true
            }
        }
        return false
    }

    Parse.prototype["juxtaposed"] = function (exps)
    {
        var i

        for (i = 1; i < exps.length; i++)
        {
            if (!this.separated(exps[i - 1],exps[i]))
            {
                return true
            }
        }
        return false
    }

    Parse.prototype["srcText"] = function (from, to)
    {
        var line, _129_27_, _129_58_

        if (from.line !== to.line)
        {
            return ''
        }
        line = ((_129_58_=(((_129_27_=this.kode.text) != null ? _129_27_ : '')).split('\n')[from.line - 1]) != null ? _129_58_ : '')
        return line.slice(from.col, typeof to.col === 'number' ? to.col : -1)
    }

    Parse.prototype["groupText"] = function (p)
    {
        return this.srcText({line:p.parens.open.line,col:p.parens.open.col + 1},p.parens.close)
    }

    Parse.prototype["callable"] = function (e)
    {
        return e && (_k_.in(e.type,['var','keyword']) || e.prop || e.index || e.call)
    }

    Parse.prototype["plainGroup"] = function (e)
    {
        var x

        if (e.parens.exps.length !== 1)
        {
            return false
        }
        x = e.parens.exps[0]
        return _k_.in(x.type,['var','keyword']) || x.prop || x.index
    }

    Parse.prototype["checkGlued"] = function (prev, e)
    {
        if (!(e != null ? e.parens : undefined) || !this.callable(prev))
        {
            return
        }
        if (lastLineCol(prev).line !== e.parens.open.line || this.separated(prev,e))
        {
            return
        }
        if (!(_k_.in(e,this.juxta) || this.plainGroup(e)))
        {
            return
        }
        return this.onError(`did you mean ${this.srcText(firstLineCol(prev),lastLineCol(prev))}(${this.groupText(e)})?`,{tok:e.parens.open})
    }

    Parse.prototype["exps"] = function (rule, tokens, stop)
    {
        var block, blocked, blockExps, colon, doBreak, e, es, llc, nl, numTokens, tok

        if (_k_.empty(tokens))
        {
            return
        }
        this.sheapPush('exps',rule)
        es = []
        while (tokens.length)
        {
            numTokens = tokens.length
            tok = tokens[0]
            doBreak = ((function ()
            {
                switch (this.stack.slice(-1)[0])
                {
                    case '▸arg':
                        return es.length

                    case 'switch':
                    case 'if':
                    case 'then':
                    case '▸else':
                        return tok.text === 'else'

                    case '[':
                        return tok.text === ']'

                    case '{':
                        return _k_.in(tok.text,['}','->','=>','◯->','◯=>','[','{','(','▸',':',']'])

                    case '(':
                        return tok.text === ')'

                    case '◯rgs':
                        return tok.type === 'func'

                    case '▸args':
                        return _k_.in(tok.text,[']',';','else','then'])

                    case '▸return':
                        return tok.text === 'if'

                    case 'call':
                        return _k_.in(tok.text,';')

                    case rule:
                        return tok.text === stop && tok.type !== 'var'

                    default:
                        return false
                }

            }).bind(this))()
            if (doBreak)
            {
                this.verb(`exps break for ${tok.text} and stack top`,this.stack)
                break
            }
            if (stop && tok.text === stop && tok.type !== 'var')
            {
                this.verb(`exps break for ${tok.text} and stop`,stop)
                break
            }
            if (tok.type === 'block')
            {
                if (_k_.in(stop,['nl',';']))
                {
                    this.verb(`exps block start with stop ${stop} break!`)
                    break
                }
                block = tokens.shift()
                this.verb(`exps block start stop ${stop} block:`,block)
                blocked = true
                blockExps = this.exps('block',block.tokens)
                es = es.concat(blockExps)
                if (block.tokens.length)
                {
                    this.verb('exps block end remaining block tokens:',block.tokens.length)
                    if (this.debug)
                    {
                        print.tokens('before unshifting dangling block tokens',tokens)
                    }
                    while (block.tokens.length)
                    {
                        tokens.unshift(block.tokens.pop())
                    }
                    if (this.debug)
                    {
                        print.tokens('exps after unshifting dangling block tokens',tokens)
                    }
                }
                if ((tokens[0] != null ? tokens[0].text : undefined) === ',')
                {
                    this.verb("exps block end shift comma , and continue...")
                    tokens.shift()
                    continue
                }
                else if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl' && (tokens[1] != null ? tokens[1].text : undefined) === ',')
                {
                    this.shiftNewline("exps block end nl comma , and continue...",tokens)
                    tokens.shift()
                    continue
                }
                this.verb('exps block end, break!')
                break
            }
            if (_k_.in(tok.text,[')',']','}']))
            {
                if (_k_.in('(',this.stack) || _k_.in('args(',this.stack))
                {
                    this.verb(`exps break on ${tok.text}`)
                    break
                }
                this.onError('unmatched closing bracket',{tok:tok})
            }
            if (_k_.in(tok.text,['in','of']) && rule === 'for vals')
            {
                this.verb('exps break on in|of')
                break
            }
            if (tok.type === 'nl')
            {
                this.verb('exps nl stop:',stop,tok,this.stack)
                if (this.stack.slice(-1)[0] === '[' && (tokens[1] != null ? tokens[1].text : undefined) === ']')
                {
                    this.shiftNewline('exps nl ] in array',tokens)
                    break
                }
                if (stop)
                {
                    this.verb('exps nl with stop',stop)
                    if (_k_.in(this.stack.slice(-1)[0],['▸args','▸body','▸return','then','▸else']) || stop !== 'nl')
                    {
                        this.verb(`exps nl with stop '${stop}' in ${this.stack.slice(-1)[0]} (break, but don't shift nl)`)
                    }
                    else
                    {
                        this.shiftNewline(`exps nl with stop '${stop}'`,tokens)
                    }
                    break
                }
                nl = this.shiftNewline("exps nl (no stop) ...",tokens)
                if ((tokens[0] != null ? tokens[0].text : undefined) === '.' && (tokens[1] != null ? tokens[1].type : undefined) === 'var')
                {
                    if (this.debug)
                    {
                        console.log('exps nl next line starts with .var!',this.stack)
                    }
                    es.push(this.prop(es.pop(),tokens))
                }
                this.verb('exps nl continue...')
                continue
            }
            if (tok.text === ',')
            {
                if (_k_.in(this.stack.slice(-1)[0],['▸args']))
                {
                    this.verb('exps comma continues args ...')
                    tokens.shift()
                    if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
                    {
                        this.verb('exps comma followed by block ...')
                        tokens = tokens.shift().tokens
                    }
                    continue
                }
            }
            if (tok.text === ';' && (tokens[1] != null ? tokens[1].text : undefined) !== ':')
            {
                this.verb("exps shift semicolon ; and continue...")
                tokens.shift()
                continue
            }
            e = this.exp(tokens)
            llc = lastLineCol(e)
            while ((_k_.in((tokens[0] != null ? tokens[0].text : undefined),['if','for','while']) && this.noThenAhead(tokens) && !(_k_.in(this.stack.slice(-1)[0],['▸args','▸return'])) && llc.line === tokens[0].line))
            {
                this.verb(`exps ${tokens[0].text}Tail`,e,this.stack)
                switch (tokens[0].text)
                {
                    case 'if':
                        e = this.ifTail(e,tokens.shift(),tokens)
                        break
                    case 'for':
                        e = this.forTail(e,tokens.shift(),tokens)
                        break
                    case 'while':
                        e = this.whileTail(e,tokens.shift(),tokens)
                        break
                }

            }
            if (es.length)
            {
                this.checkGlued(es.slice(-1)[0],e)
            }
            if ((tokens[0] != null ? tokens[0].text : undefined) === '▸')
            {
                if (_k_.in(this.stack.slice(-1)[0],['▸args','{']))
                {
                    es.push(e)
                    break
                }
                else
                {
                    e = this.compare(e,tokens)
                }
            }
            es.push(e)
            if ((_k_.in((tokens[0] != null ? tokens[0].text : undefined),['if','then','for','while']) && tokens[0].col > llc.col && es.length && !blocked && llc.line === tokens[0].line))
            {
                this.verb('exps break on if|then|for|while')
                break
            }
            if ((tokens[0] != null ? tokens[0].text : undefined) === ';')
            {
                if (!(_k_.in(this.stack.slice(-1)[0],['▸args','when','{'])))
                {
                    this.verb('exps shift colon',this.stack)
                    colon = tokens.shift()
                }
                else
                {
                    this.verb('exps break on colon',this.stack)
                    break
                }
            }
            if (numTokens === tokens.length)
            {
                this.verb('exps no token consumed',tokens)
                break
            }
        }
        this.sheapPop('exps',rule)
        return es
    }

    Parse.prototype["exp"] = function (tokens)
    {
        var alone, block, e, key, m, numTokens, nxt, paren, tok, _425_34_, _436_45_, _503_33_

        if (_k_.empty(tokens))
        {
            return
        }
        tok = tokens.shift()
        if (this.debug)
        {
            console.log(_k_.Y5(_k_.w1((tok != null ? tok.text : undefined))))
        }
        if (_k_.in(tok.type,['keyword','op','punct','paren','dots','assert','await','diamond']) && !this.prefixOperand)
        {
            nxt = tokens[0]
            alone = !nxt || nxt.type === 'nl' || _k_.in(nxt.text,[')',']','}',';',','])
            if (nxt && nxt.text === closers[tok.text])
            {
                alone = false
            }
            if (alone)
            {
                if (_k_.in(tok.text,['first','last']) && tok.type === 'keyword')
                {
                    this.firstLastError(tok)
                }
                if (m = needsPair[tok.text])
                {
                    this.onError(m,{tok:tok})
                }
                if (_k_.in(tok.text,['++','--']))
                {
                    this.onError(`${tok.text} is missing a variable to increment`,{tok:tok})
                }
                if (_k_.in(tok.text,wantsRight))
                {
                    this.onError(`${tok.text} is missing a right operand`,{tok:tok})
                }
                if (_k_.in(tok.text,wantsLeft) || _k_.in(tok.text,wantsSlice) || _k_.in(tok.text,wantsOperand))
                {
                    this.onError(`${tok.text} is missing an operand`,{tok:tok})
                }
            }
        }
        switch (tok.type)
        {
            case 'block':
                return this.onError("unexpected block token in exp!",{tok:tok})

            case 'nl':
                return this.onError("unexpected nl token in exp!",{tok:tok})

            case ';':
                return this.onError("unexpected ; token in exp!",{tok:tok})

            case 'section':
                return this.section(tok,tokens)

            case 'keyword':
                if (!(_k_.in((tokens[0] != null ? tokens[0].text : undefined),':')))
                {
                    if (tok.text === 'import')
                    {
                        if ((tokens[0] != null ? tokens[0].text : undefined) === '(')
                        {
                            tok.type = 'call'
                            return this.call(tok,tokens)
                        }
                        else if (_k_.in((tokens[0] != null ? tokens[0].text : undefined),'.'))
                        {
                            break
                        }
                    }
                    switch (tok.text)
                    {
                        case 'return':
                            return this.return(tok,tokens)

                        case 'switch':
                            return this.switch(tok,tokens)

                        case 'class':
                            return this.class(tok,tokens)

                        case 'function':
                            return this.function(tok,tokens)

                        case 'await':
                            return this.await(tok,tokens)

                        case 'import':
                            return this.import(tok,tokens)

                        case 'export':
                            return this.export(tok,tokens)

                        case 'while':
                            return this.while(tok,tokens)

                        case 'when':
                            return this.when(tok,tokens)

                        case 'use':
                            return this.use(tok,tokens)

                        case 'try':
                            return this.try(tok,tokens)

                        case 'for':
                            return this.for(tok,tokens)

                        case 'if':
                            if (!(_k_.in(this.stack.slice(-1)[0],['▸return'])))
                            {
                                if (this.stack.length)
                                {
                                    this.verb('if',this.stack)
                                }
                                return this.if(tok,tokens)
                            }
                            break
                    }

                }
                break
            default:
                switch (tok.text)
            {
                case '◯':
                    return this.await(tok,tokens)

                case '->':
                case '=>':
                case '◯->':
                case '◯=>':
                    if (!(_k_.in(this.stack.slice(-1)[0],['{'])))
                    {
                        return this.func(null,tok,tokens)
                    }
                    break
            }

        }

        if ((tok.type === 'var' || tok.text === 'in') && _k_.in(tok.text,reserved))
        {
            key = (tokens[0] != null ? tokens[0].text : undefined) === ':' && (tok.type === 'keyword' || _k_.in(tok.text,nameable))
            if (!key)
            {
                this.onError(`${tok.text} is a javascript reserved word`,{tok:tok})
            }
        }
        nxt = tokens[0]
        if (tok.text === '?' && !(nxt && (nxt.text === '.' || nxt.type === 'op')))
        {
            this.onError('? is missing a left operand',{tok:tok})
        }
        if (_k_.in(tok.text,['▪','▸']))
        {
            this.onError(`${tok.text} is missing what it goes with`,{tok:tok})
        }
        this.sheapPush('exp',((_425_34_=tok.text) != null ? _425_34_ : tok.type))
        if (tok.type !== 'paren' && !(_k_.in('◯rgs',this.stack)))
        {
            if (this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === 'class' || this.stack.slice(-1)[0] === 'op=' && !this.blockAssign || this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === '{' && !(_k_.in('▸args',this.stack)))
            {
                if (this.funcAhead(tokens))
                {
                    paren = this.argsWithoutParens(tok,tokens)
                    this.sheapPop('exp',((_436_45_=tok.text) != null ? _436_45_ : tok.type))
                    return this.lhs(paren,tokens)
                }
            }
        }
        e = tok
        while (tokens.length)
        {
            numTokens = tokens.length
            e = this.rhs(e,tokens)
            if (this.debug)
            {
                print.ast("rhs",e)
            }
            e = this.lhs(e,tokens)
            if (this.debug)
            {
                print.ast("lhs",e)
            }
            if (_k_.in((tokens[0] != null ? tokens[0].text : undefined),';'))
            {
                this.verb('exp break on ;',(tokens[0] != null ? tokens[0].text : undefined))
                break
            }
            if (numTokens === tokens.length)
            {
                if (_k_.in((tokens[0] != null ? tokens[0].text : undefined),','))
                {
                    if (_k_.in(this.stack.slice(-1)[0],['▸args']))
                    {
                        this.verb('comma in args, break without shifting')
                        break
                    }
                    if ((this.stack.slice(-1)[0] != null ? this.stack.slice(-1)[0].startsWith('op') : undefined))
                    {
                        this.verb('comma in operation, break without shifting')
                        break
                    }
                    if (_k_.empty(this.stack) && _k_.empty(tokens[1]))
                    {
                        this.onError("missing expression after ','",{tok:tok})
                    }
                    this.verb('exp shift comma')
                    tokens.shift()
                }
                if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
                {
                    if ((tokens[0].tokens[0] != null ? tokens[0].tokens[0].text : undefined) === '.')
                    {
                        this.verb('exp prop chain block! shift block and continue ...')
                        this.push('propchain' + tokens[0].tokens[0].col)
                        block = tokens.shift()
                        e = this.prop(e,block.tokens)
                        if (block.tokens.length)
                        {
                            this.verb('dangling prop chain tokens',block.tokens,this.stack.slice(-1)[0])
                            tokens = block.tokens
                            continue
                        }
                        break
                    }
                }
                if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl')
                {
                    if ((tokens[1] != null ? tokens[1].text : undefined) === '.')
                    {
                        if (_k_.in(`propchain${(tokens[1] != null ? tokens[1].col : undefined)}`,this.stack.slice(0, -1)))
                        {
                            this.verb('exp higher level prop chain active! break!')
                            break
                        }
                        this.verb('exp prop chain block continues on next line! shift nl and continue ...')
                        this.shiftNewline('exp prop chain block continues',tokens)
                        continue
                    }
                }
                this.verb('exp no token consumed: break!',this.stack.slice(-1)[0])
                break
            }
        }
        if (this.debug)
        {
            print.ast(`exp ${_k_.empty((this.stack)) ? 'DONE' : ''}`,e)
        }
        if ((this.stack.slice(-1)[0] != null ? this.stack.slice(-1)[0].startsWith('propchain') : undefined))
        {
            this.verb(`exp cleanup ${this.stack.slice(-1)[0]}`)
            this.pop(this.stack.slice(-1)[0])
        }
        this.sheapPop('exp',((_503_33_=tok.text) != null ? _503_33_ : tok.type))
        return e
    }

    Parse.prototype["rhs"] = function (e, tokens)
    {
        var llc, numTokens, nxt, spaced, unspaced, _561_22_

        this.sheapPush('rhs','rhs')
        while (nxt = tokens[0])
        {
            numTokens = tokens.length
            if (!e)
            {
                this.onError('missing expression on the left',{tok:nxt})
            }
            unspaced = (llc = lastLineCol(e)).col === nxt.col && llc.line === nxt.line
            spaced = !unspaced
            if (_k_.in(nxt.text,'({') && _k_.in(e.type,this.kode.literals))
            {
                break
            }
            if (nxt.text === '▸')
            {
                this.verb('rhs break for ▸')
                break
            }
            if (this.stack.slice(-1)[0] === '▸arg' && nxt.type === 'op')
            {
                this.verb('rhs break for ▸arg')
                break
            }
            if (nxt.text === ':' && _k_.in(this.stack.slice(-1)[0],['class']))
            {
                if (this.debug)
                {
                    print.tokens('rhs is class method',tokens.slice(0, 21))
                }
                e = this.keyval(e,tokens)
                break
            }
            else if (nxt.text === ':' && (unspaced || (!(_k_.in('?',this.stack)))))
            {
                if (this.stack.slice(-1)[0] !== '{')
                {
                    this.verb('rhs is first key of implicit object',e)
                    if (this.debug)
                    {
                        print.tokens('rhs is first key of implicit object ...',tokens.slice(0, 21))
                    }
                    e = this.object(e,tokens)
                }
                else
                {
                    this.verb('rhs is key of (implicit) object',e)
                    e = this.keyval(e,tokens)
                }
            }
            else if (nxt.text === 'in' && this.stack.slice(-1)[0] !== 'for')
            {
                this.verb('incond',e,tokens)
                e = this.incond(e,tokens)
            }
            else if ((e.text != null))
            {
                if (e.text === '[')
                {
                    e = this.array(e,tokens)
                }
                else if (e.text === '(')
                {
                    e = this.parens(e,tokens)
                }
                else if (e.text === '{')
                {
                    e = this.curly(e,tokens)
                }
                else if (_k_.in(e.text,['not']) && (!(_k_.in(nxt.type,['op'])) || _k_.in(nxt.text,['++','--','+','-'])))
                {
                    e = this.operation(null,e,tokens)
                }
                else if (_k_.in(e.text,['delete','new','empty','valid','noon','copy','clone']) && (!(_k_.in(nxt.type,['op','nl'])) && !(_k_.in(nxt.text,',.}])'))))
                {
                    e = this.operation(null,e,tokens)
                }
                else if (_k_.in(e.text,['first','last']) && e.type === 'keyword')
                {
                    if (this.firstLastOperand(e,nxt,unspaced))
                    {
                        e = this.operation(null,e,tokens)
                    }
                    else
                    {
                        this.firstLastError(e)
                    }
                }
                else if (_k_.in(e.text,['++','--']) && unspaced)
                {
                    this.verb('rhs increment')
                    e = this.operation(null,e,tokens)
                }
                else if (_k_.in(e.text,['+','-']) && unspaced)
                {
                    if (nxt.type === 'num')
                    {
                        this.verb('rhs +- num')
                        if (e.text === '-')
                        {
                            nxt.text = '-' + nxt.text
                            nxt.col -= 1
                        }
                        e = tokens.shift()
                    }
                    else
                    {
                        this.verb('rhs +- operation')
                        e = this.operation(null,e,tokens)
                    }
                }
                else if (_k_.in(nxt.text,['++','--']) && unspaced)
                {
                    if (!(_k_.in(e.type,['var'])))
                    {
                        this.onError(`${nxt.text} is missing a variable to increment`,{tok:nxt})
                    }
                    e = this.operation(e,tokens.shift())
                }
                else
                {
                    if (this.debug)
                    {
                        print.tokens(`rhs no nxt match? break! stack:${this.stack} nxt:`,[nxt])
                    }
                    break
                }
            }
            else
            {
                if (_k_.in(nxt.text,['++','--']) && unspaced)
                {
                    this.checkPostfix(e,nxt)
                    e = this.operation(e,tokens.shift())
                    break
                }
                else if (this.stack.slice(-1)[0] === 'call' && nxt.text === ']')
                {
                    this.verb('rhs call array end')
                    break
                }
                else if (this.stack.slice(-1)[0] === '{' && nxt.text === '}')
                {
                    this.verb('rhs curly end')
                    break
                }
                else if (this.stack.slice(-1)[0] === '[' && nxt.text === ']')
                {
                    this.verb('rhs array end')
                    break
                }
                else
                {
                    if (this.debug)
                    {
                        print.ast(`rhs no nxt match?? stack:${this.stack} e:`,e)
                    }
                    if (this.debug)
                    {
                        print.tokens("rhs no nxt match?? nxt:",nxt)
                    }
                    break
                }
            }
            if (numTokens === tokens.length)
            {
                this.verb('rhs no token consumed, break!')
                break
            }
        }
        if (_k_.in((e != null ? e.text : undefined),['first','last']) && e.type === 'keyword')
        {
            this.firstLastError(e)
        }
        this.sheapPop('rhs','rhs')
        return e
    }

    Parse.prototype["firstLastOperand"] = function (op, nxt, unspaced)
    {
        if (unspaced)
        {
            return nxt.text === '('
        }
        if (_k_.in(nxt.type,['op','nl','block']) || !nxt.text)
        {
            return false
        }
        if (_k_.in(nxt.text[0],',.}])?=:;'))
        {
            return false
        }
        return !(_k_.in(nxt.text,['in','of','if','then','else','for','while','when','➜','▸']))
    }

    Parse.prototype["firstLastError"] = function (tok)
    {
        return this.onError(`'${tok.text}' is an operator (${tok.text} [1 2 3] ▸ ${(tok.text === 'first' ? 1 : 3)}) and can't be a variable name`,{tok:tok})
    }

    Parse.prototype["lhs"] = function (e, tokens)
    {
        var b, flc, llc, numTokens, nxt, spaced, unspaced

        this.sheapPush('lhs','lhs')
        while (nxt = tokens[0])
        {
            numTokens = tokens.length
            if (!e)
            {
                this.onError('missing expression on the right',{tok:nxt})
            }
            llc = lastLineCol(e)
            flc = firstLineCol(e)
            unspaced = llc.col === nxt.col && llc.line === nxt.line
            spaced = !unspaced
            b = ((function ()
            {
                switch (this.stack.slice(-1)[0])
                {
                    case '[':
                        return nxt.text === ']'

                    case '{':
                        return nxt.text === '}'

                }

            }).bind(this))()
            if (b)
            {
                break
            }
            if (e.text === '@' && unspaced && _k_.in(tokens[0].type,['var','keyword','op']))
            {
                e = this.this(e,tokens)
                break
            }
            if (e.text === '◆' && _k_.in(nxt.text,['file','dir']))
            {
                e = this.dirFile(e,tokens)
                break
            }
            if (e.text === '◆' && nxt.text === 'main')
            {
                e = this.main(e,tokens)
                break
            }
            if (nxt.text === '.')
            {
                e = this.prop(e,tokens)
            }
            else if (nxt.type === 'dots' && !(this.stack.slice(-1)[0] != null ? this.stack.slice(-1)[0].startsWith('op') : undefined) && this.stack.slice(-1)[0] !== '(' && !(_k_.in('◯rgs',this.stack)))
            {
                e = this.slice(e,tokens)
            }
            else if (nxt.text === 'each')
            {
                e = this.each(e,tokens)
            }
            else if (nxt.text === '?')
            {
                if (unspaced)
                {
                    e = this.assert(e,tokens)
                }
                else
                {
                    e = this.qmrkop(e,tokens)
                }
            }
            else if (nxt.text === ':' && e.qmrkop)
            {
                e = this.qmrkcolon(e.qmrkop,tokens)
            }
            else if ((nxt.type === 'op' && !(_k_.in(nxt.text,['++','--','+','-','not','noon','new','empty','valid'])) && !(_k_.in(e.text,['[','('])) && !(_k_.in('▸arg',this.stack))))
            {
                if (_k_.in(this.stack.slice(-1)[0],['in?','opempty','opvalid']))
                {
                    this.verb(`lhs stop on ${this.stack.slice(-1)[0]}`,e,nxt)
                    break
                }
                else if (nxt.text === '▸')
                {
                    this.verb("lhs break on ▸")
                    break
                }
                else
                {
                    this.verb('lhs is lhs of op',e,nxt)
                    e = this.operation(e,tokens.shift(),tokens)
                }
            }
            else if ((_k_.in(nxt.text,['+','-']) && !(_k_.in(e.text,['[','('])) && spaced && (tokens[1] != null ? tokens[1].col : undefined) > nxt.col + nxt.text.length))
            {
                this.verb('lhs is lhs of +-\s',e,nxt)
                e = this.operation(e,tokens.shift(),tokens)
            }
            else if (nxt.type === 'func' && e.parens)
            {
                this.verb('lhs is args for func',e)
                e = this.func(e,tokens.shift(),tokens)
            }
            else if (nxt.text === '(' && unspaced)
            {
                this.verb('lhs is lhs of call')
                e = this.call(e,tokens)
            }
            else if (nxt.text === '[' && unspaced && (tokens[1] != null ? tokens[1].text : undefined) !== ']')
            {
                this.verb('lhs is lhs of index',e)
                e = this.index(e,tokens)
            }
            else if (nxt.text === 'not' && (tokens[1] != null ? tokens[1].text : undefined) === 'in')
            {
                e = {operation:{operator:tokens.shift(),rhs:this.incond(e,tokens)}}
            }
            else if ((spaced && (nxt.line === llc.line || (nxt.col > flc.col && !(_k_.in(this.stack.slice(-1)[0],['if','when'])))) && !(_k_.in('◯rgs',this.stack)) && (nxt.text !== 'by' || this.stack.slice(-1)[0] !== '▸by' && !e.slice) && !(_k_.in('[',this.stack)) && !(_k_.in(this.stack.slice(-1)[0],['(','call','args(','op|','op&','op/','op*','op+','op-'])) && (!(_k_.in(this.stack.slice(-1)[0],['▸args',':'])) || (nxt.line > llc.line && nxt.col > flc.col)) && !(_k_.in(nxt.text,['then','when','else','break','continue','in','of','for','while'])) && (!(_k_.in(nxt.text,['if'])) || !this.noThenAhead(tokens)) && !(_k_.in(nxt.text,',.;:)}]')) && !(_k_.in(nxt.type,['nl'])) && !(nxt.type === 'block' && (nxt.tokens[0] != null ? nxt.tokens[0].text : undefined) === '.') && (nxt.type !== 'op' || _k_.in(nxt.text,['++','--','noon','new','not']) || _k_.in(nxt.text,['+','-']) && (tokens[1] != null ? tokens[1].col : undefined) === nxt.col + 1) && this.isSuitableForImplicitCall(e)))
            {
                this.verb('lhs is lhs of implicit call! e',e,this.stack.slice(-1)[0])
                this.verb('    is lhs of implicit call! nxt',nxt)
                this.verb('    is lhs first',flc)
                e = this.call(e,tokens)
                break
            }
            else if (_k_.in(nxt.text,['+','-']) && !(_k_.in(e.text,['[','('])))
            {
                if (spaced && (tokens[1] != null ? tokens[1].col : undefined) === nxt.col + nxt.text.length)
                {
                    this.verb('lhs op is unbalanced +- break...',e,nxt,this.stack)
                    break
                }
                this.verb('lhs is lhs of +- op',e,nxt)
                e = this.operation(e,tokens.shift(),tokens)
            }
            else
            {
                if (this.debug)
                {
                    print.tokens(`lhs no nxt match? break! stack:${this.stack} nxt:`,[nxt])
                }
                if (this.debug)
                {
                    print.ast(`lhs no nxt match? break! stack:${this.stack}`,e)
                }
                if (nxt.type === 'block')
                {
                    if (this.isSuitableForImplicitCall(e) && this.stackAllowsBlockArg() && !(_k_.in((nxt.tokens[0] != null ? nxt.tokens[0].text : undefined),['then','when','.'])) && !(_k_.in(this.stack.slice(-1)[0],['if','then','for','while','switch','when','catch','in?','▸args','class','function','op+','op-','opis','opor','opand','op==','opnot','op<','op>'])))
                    {
                        this.verb('blocked call arg',this.stack,e,nxt)
                        e = this.call(e,tokens)
                    }
                }
                break
            }
            if (numTokens === tokens.length)
            {
                break
            }
        }
        this.sheapPop('lhs','lhs')
        return e
    }

    return Parse
})()

export default Parse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9wYXJzZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BaUJNLFlBQUE7SUFBUTtJQUFhOztPQUNiLFlBQUE7T0FBTSxpQkFBQTs7QUFFcEIsZ0JBQWdCLE9BQU8sUUFBUSxVQUFVLFFBQVEsUUFBUSxVQUFVLE9BQU8sS0FBSyxRQUFRO0FBSXZGLFlBQ0ksUUFBWSxRQUFnQixPQUFZLFFBQVksUUFBYSxRQUNqRSxXQUFZLFdBQWdCLFVBQVksU0FBWSxLQUFhLE9BQ2pFLE9BQVksU0FBZ0IsVUFBWSxVQUFZLE1BQWEsV0FDakUsS0FBWSxhQUFnQixTQUFZLEtBQVksYUFBYSxZQUNqRSxNQUFZLE1BQWdCLFVBQVksVUFBWSxZQUFhLFNBQ2pFLFNBQVksU0FBZ0IsUUFBWSxTQUFZLFFBQWEsTUFDakUsU0FBWSxNQUFnQixPQUFZLFFBQVksT0FBYTtBQUtyRSxZQUFZLFFBQVEsT0FBTyxhQUFhLFlBQVksTUFBTSxVQUFVLFVBQVUsWUFBWSxTQUFTLFNBQVM7QUFLNUcsY0FBYyxJQUFJLElBQUksSUFBSTtBQUkxQixhQUFhLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBRWpELGNBQWM7QUFFZCxhQUNJLElBQU0sOEJBQ04sSUFBTSw2QkFDTixJQUFNLDZCQUNOLElBQU0sK0JBQ04sSUFBTSwyQ0FDTixJQUFNLGlDQUNOLElBQU0sbUNBQ04sSUFBTSw4QkFDTixJQUFNO0FBRVYsV0FBVSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7O0FBRTdCLFNBQUQ7O3NCQUFPO2FBRUgsT0FBSTs7UUFBRDs7UUFFQyxLQUFDLFFBQVcsS0FBQyxLQUFLLEtBQUs7UUFDdkIsS0FBQyxVQUFXLEtBQUMsS0FBSyxLQUFLOzs7O3FCQUUzQixzQkFBUyxLQUFJOztlQUFRLEtBQUMsS0FBSyxRQUFRLElBQUk7OztxQkFFdkMsNkJBQWdCOzttQkFFVCxLQUFLLEtBQVE7O1lBQ1osS0FBQyxXQUFXLEtBQUssc0NBQXFDLElBQUk7O2VBRTlEOzs7cUJBRUosb0JBQU87Ozs7UUFFSCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxZQUFZLE1BQU07UUFFbkIsT0FDSSxRQUNBLEtBQU0sS0FBQyxLQUFLLEtBQUssTUFBTTs0QkFFbEIsS0FBQzs7O1lBQU47WUFDQSxLQUFDLHlCQUF5QixLQUFDLFVBQVUsUUFBTSxJQUFJLEVBQUUsT0FBTzs7ZUFFNUQ7OztxQkFPSiwwQkFBYTs7Ozs0QkFFQTs7O1lBQUw7Z0JBQ0csRUFBRSxTQUFROztnQkFDVCxLQUFDLFlBQVksRUFBRTs7NEJBQ1gsRUFBRSxNQUFTLElBQUk7O2dCQUNuQixLQUFDLEtBQUssS0FBSzs7Ozs7cUJBRXZCLHdCQUFXLEdBQUU7Ozs7UUFFVCxJQUFJLFlBQVk7UUFDaEIsSUFBSSxhQUFhOzRCQUNSLEtBQUM7OztZQUFOO1lBQ0EsUUFBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUSxFQUFFLFFBQVMsRUFBRSxPQUFPLEVBQUU7WUFDNUQsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUSxFQUFFLFFBQVMsRUFBRSxNQUFNLEVBQUU7Z0JBQ2pELFNBQVU7O3VCQUFsQjs7O2VBQ047OztxQkFFSix5QkFBWTs7OzthQUVKLElBQUssT0FBSSxLQUFLOztpQkFDQSxLQUFDLFVBQVUsS0FBSyxJQUFFLEdBQUksS0FBSzs7dUJBQXZDOzs7ZUFDTjs7O3FCQUVKLHNCQUFTLE1BQUs7Ozs7WUFFRixLQUFLLFNBQVEsR0FBRzs7bUJBQXRCOztRQUNGLDhCQUFRLEtBQUMsS0FBSywyQkFBTyxLQUFJLE1BQU0sTUFBTSxLQUFLLE9BQUsseUJBQUs7ZUFDcEQsV0FBSyxLQUFLLFlBQU0sR0FBRyxtQkFBSCxHQUFHOzs7cUJBRXZCLHdCQUFXOztlQUFLLEtBQUMsU0FBUyxLQUFLLEVBQUUsT0FBTyxLQUFLLEtBQU0sSUFBSSxFQUFFLE9BQU8sS0FBSyxNQUFJLEdBQUksRUFBRSxPQUFPOzs7cUJBRXRGLHVCQUFVOztlQUFLLGFBQU8sRUFBRSxNQUFTLE1BQU0sZUFBYyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUU7OztxQkFFNUUseUJBQVk7Ozs7WUFFRyxFQUFFLE9BQU8sS0FBSyxXQUFVOzttQkFBakM7O1FBQ0YsSUFBSSxFQUFFLE9BQU8sS0FBSztzQkFDbEIsRUFBRSxNQUFTLE1BQU0sZUFBYyxFQUFFLFFBQVEsRUFBRTs7O3FCQUUvQyx5QkFBWSxNQUFLOztjQUVKLFlBQUEsRUFBRyx3QkFBYyxLQUFDLFNBQVM7Ozs7WUFDL0IsWUFBWSxNQUFNLFNBQVEsRUFBRSxPQUFPLEtBQUssUUFBUSxLQUFDLFVBQVUsS0FBTTs7OztxQkFDNUQsRUFBSyxLQUFDLFVBQVMsS0FBQyxXQUFXOzs7O2VBQ3JDLEtBQUMsd0JBQXdCLEtBQUMsUUFBUSxhQUFhLE1BQU8sWUFBWSxVQUFTLEtBQUMsVUFBVSxRQUFNLElBQUksRUFBRSxPQUFPOzs7cUJBZTdHLG1CQUFNLE1BQUssUUFBTzs7OztzQkFFSDs7OztRQUVYLEtBQUMsVUFBVSxPQUFPO1FBRWxCO2VBRU0sT0FBTzs7WUFFVCxZQUFZLE9BQU87WUFFbkIsTUFBTSxPQUFPO1lBRWI7O3dCQUFpQixLQUFDOzt5QkFFZDsrQkFBYyxHQUFHOzt5QkFDakI7eUJBQ0E7eUJBQUs7eUJBQ0w7K0JBQWMsSUFBSSxTQUFROzt5QkFDMUI7K0JBQWMsSUFBSSxTQUFROzt5QkFDMUI7c0NBQWMsSUFBSSxNQUFTLElBQUksS0FBSyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7O3lCQUN6RTsrQkFBYyxJQUFJLFNBQVE7O3lCQUMxQjsrQkFBYyxJQUFJLFNBQVE7O3lCQUMxQjtzQ0FBYyxJQUFJLE1BQVMsSUFBSSxJQUFJLE9BQU87O3lCQUMxQzsrQkFBYyxJQUFJLFNBQVE7O3lCQUMxQjtzQ0FBYyxJQUFJLEtBQVE7O3lCQUMxQjsrQkFBYyxJQUFJLFNBQVEsUUFBUyxJQUFJLFNBQVE7OzsrQkFDakM7Ozs7Z0JBRWY7O2dCQUNDLEtBQUMsdUJBQXVCLElBQUkscUJBQXFCLEtBQUM7Z0JBQ2xEOztnQkFFRCxRQUFTLElBQUksU0FBUSxRQUFTLElBQUksU0FBUTs7Z0JBQ3pDLEtBQUMsdUJBQXVCLElBQUksZ0JBQWdCO2dCQUM1Qzs7Z0JBRUQsSUFBSSxTQUFROzsyQkFFUixNQUFTLEtBQUk7O29CQUNaLEtBQUMsbUNBQW1DO29CQUNwQzs7Z0JBRUosUUFBUSxPQUFPO2dCQUVmLEtBQUMsOEJBQThCLGNBQWM7Z0JBRTdDLFVBQVU7Z0JBQ1YsWUFBWSxLQUFDLEtBQUssUUFBUSxNQUFNO2dCQUVoQyxLQUFLLEdBQUcsT0FBTztvQkFFWixNQUFNLE9BQU87O29CQUNaLEtBQUMsS0FBSyx5Q0FBeUMsTUFBTSxPQUFPO3dCQUNLLEtBQUM7O3dCQUFsRSxNQUFNLE9BQU8sMENBQTBDOzsyQkFDakQsTUFBTSxPQUFPOzt3QkFDZixPQUFPLFFBQVEsTUFBTSxPQUFPOzt3QkFDcUMsS0FBQzs7d0JBQXRFLE1BQU0sT0FBTyw4Q0FBOEM7OztxQkFFNUQsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7b0JBQ2xCLEtBQUMsS0FBSztvQkFDTixPQUFPO29CQUNQOzswQkFFSSxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFNBQVMsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7b0JBQ25ELEtBQUMsYUFBYSw0Q0FBNEM7b0JBQzFELE9BQU87b0JBQ1A7O2dCQUVKLEtBQUMsS0FBSztnQkFDTjs7dUJBRUQsSUFBSSxNQUFTLElBQUksSUFBSTs7MkJBQ2pCLElBQU8sS0FBQyxpQkFBUyxRQUFXLEtBQUM7O29CQUM1QixLQUFDLHNCQUFzQixJQUFJO29CQUMzQjs7Z0JBQ0osS0FBQyxRQUFRLDZCQUE0QixJQUFJOzt1QkFDMUMsSUFBSSxNQUFTLEtBQUksVUFBVSxTQUFROztnQkFBYSxLQUFDLEtBQUs7Z0JBQXdCOztnQkFDOUUsSUFBSSxTQUFROztnQkFFWCxLQUFDLEtBQUssZ0JBQWdCLEtBQUssSUFBSSxLQUFDO29CQUU3QixLQUFDLHVCQUFhLFFBQVEsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7b0JBQ3hDLEtBQUMsYUFBYSxxQkFBcUI7b0JBQ25DOztvQkFFRDs7b0JBQ0MsS0FBQyxLQUFLLG9CQUFvQjsrQkFDdkIsS0FBQyxvQkFBYyxRQUFRLFFBQVEsVUFBVSxPQUFPLGFBQVksU0FBUTs7d0JBQ25FLEtBQUMsMkJBQTJCLFlBQVksS0FBQzs7Ozt3QkFFekMsS0FBQyxtQ0FBbUMsUUFBUTs7b0JBQ2hEOztnQkFFSixLQUFLLEtBQUMsYUFBYSx3QkFBd0I7cUJBRXhDLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVEsUUFBUSxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzt3QkFDTyxLQUFDOzt3QkFBckQsWUFBSSxzQ0FBc0MsS0FBQzs7b0JBQzNDLEdBQUcsS0FBSyxLQUFDLEtBQUssR0FBRyxNQUFNOztnQkFFM0IsS0FBQyxLQUFLO2dCQUNOOztnQkFFRCxJQUFJLFNBQVE7OzJCQUNSLEtBQUMsb0JBQWM7O29CQUNkLEtBQUMsS0FBSztvQkFDTixPQUFPO3lCQUNKLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7O3dCQUNsQixLQUFDLEtBQUs7d0JBQ04sU0FBUyxPQUFPLFFBQVE7O29CQUM1Qjs7O2dCQUVMLElBQUksU0FBUSxRQUFRLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7O2dCQUN0QyxLQUFDLEtBQUs7Z0JBQ04sT0FBTztnQkFDUDs7WUFFSixJQUFJLEtBQUMsSUFBSTtZQUVULE1BQU0sWUFBWTs0QkFFVixPQUFPLGFBQVAsT0FBTyxHQUFJLG1CQUFTLEtBQUssTUFBTSxhQUMvQixLQUFDLFlBQVksb0JBQ2IsS0FBQyxvQkFBa0IsUUFBUSxnQkFDM0IsSUFBSSxTQUFRLE9BQU8sR0FBRzs7Z0JBRTFCLEtBQUMsYUFBYSxPQUFPLEdBQUcsV0FBWSxFQUFFLEtBQUM7d0JBQ2hDLE9BQU8sR0FBRzs7eUJBQ2I7d0JBQVUsSUFBSSxLQUFDLE9BQVUsRUFBRSxPQUFPLFFBQVE7O3lCQUMxQzt3QkFBVSxJQUFJLEtBQUMsUUFBVSxFQUFFLE9BQU8sUUFBUTs7eUJBQzFDO3dCQUFVLElBQUksS0FBQyxVQUFVLEVBQUUsT0FBTyxRQUFROzs7OztnQkFFekIsR0FBRzs7Z0JBQTVCLEtBQUMsV0FBVyxnQkFBUTs7aUJBRWpCLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7OzJCQUNmLEtBQUMsb0JBQWMsUUFBUTs7b0JBQ3RCLEdBQUcsS0FBSztvQkFDUjs7OztvQkFFQSxJQUFJLEtBQUMsUUFBUSxFQUFFOzs7WUFFdkIsR0FBRyxLQUFLO3lCQUVBLE9BQU8sYUFBUCxPQUFPLEdBQUksbUJBQVMsS0FBSSxPQUFNLE1BQUssYUFDbkMsT0FBTyxHQUFHLE1BQU0sSUFBSSxPQUNwQixHQUFHLFdBQ0MsV0FDSixJQUFJLFNBQVEsT0FBTyxHQUFHOztnQkFFMUIsS0FBQyxLQUFLO2dCQUNOOztpQkFFRCxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzs2QkFDZixLQUFDLG9CQUFrQixRQUFRLE9BQU87O29CQUNqQyxLQUFDLEtBQUssbUJBQW1CLEtBQUM7b0JBQzFCLFFBQVEsT0FBTzs7OztvQkFFZixLQUFDLEtBQUssc0JBQXNCLEtBQUM7b0JBQzdCOzs7Z0JBRUwsY0FBYSxPQUFPOztnQkFDbkIsS0FBQyxLQUFLLHlCQUF5QjtnQkFDL0I7OztRQUVSLEtBQUMsU0FBUyxPQUFPO2VBRWpCOzs7cUJBWUosa0JBQUs7Ozs7c0JBRVU7Ozs7UUFFWCxNQUFNLE9BQU87WUFFWSxLQUFDOztZQUExQixZQUFJLE9BQUcsUUFBRyxjQUFBLElBQUs7O21CQUVaLElBQUksTUFBUyxVQUFVLEtBQUssUUFBUSxRQUFRLE9BQU8sU0FBUyxRQUFRLGdCQUFtQixLQUFDOztZQUV2RixNQUFNLE9BQU87WUFFYixTQUFZLE9BQU8sSUFBSSxTQUFRLGVBQVEsSUFBSSxNQUFTLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBRWpFLE9BQVEsSUFBSSxTQUFRLFFBQVEsSUFBSTs7Z0JBQy9CLFFBQVE7O2dCQUVUOzsyQkFDSSxJQUFJLE1BQVMsUUFBUSxZQUFZLElBQUksU0FBUTs7b0JBQzVDLEtBQUMsZUFBZTs7b0JBQ2pCLElBQUksVUFBVSxJQUFJOztvQkFDakIsS0FBQyxRQUFRLEdBQUUsSUFBSTs7MkJBQ2hCLElBQUksTUFBUyxLQUFLOztvQkFDakIsS0FBQyxXQUFXLElBQUksMkNBQTBDLElBQUk7OzJCQUMvRCxJQUFJLEtBQVE7O29CQUNYLEtBQUMsV0FBVyxJQUFJLG1DQUFrQyxJQUFJOzsyQkFDdkQsSUFBSSxLQUFRLHFCQUFhLElBQUksS0FBUSxzQkFBYyxJQUFJLEtBQVE7O29CQUM5RCxLQUFDLFdBQVcsSUFBSSw4QkFBNkIsSUFBSTs7OztnQkFFdEQsSUFBSTs7aUJBRVA7dUJBQWdCLEtBQUMsUUFBUSxrQ0FBaUMsSUFBSTs7aUJBQzlEO3VCQUFnQixLQUFDLFFBQVEsK0JBQThCLElBQUk7O2lCQUMzRDt1QkFBZ0IsS0FBQyxRQUFRLDhCQUE2QixJQUFJOztpQkFDMUQ7dUJBQWdCLEtBQUMsUUFBUSxJQUFLOztpQkFDOUI7OEJBQ21CLE9BQU8sYUFBUCxPQUFPLEdBQUksa0JBQVk7O3dCQUVuQixJQUFJLFNBQVE7OzZCQUNSLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7OzRCQUNsQixJQUFJLE9BQU87bUNBQ1QsS0FBQyxLQUFLLElBQUs7O3lDQUNULE9BQU8sYUFBUCxPQUFPLEdBQUksa0JBQVE7OzRCQUN2Qjs7OzRCQUVELElBQUk7OzZCQUNQO21DQUFlLEtBQUMsT0FBUyxJQUFJOzs2QkFDN0I7bUNBQWUsS0FBQyxPQUFTLElBQUk7OzZCQUM3QjttQ0FBZSxLQUFDLE1BQVMsSUFBSTs7NkJBQzdCO21DQUFlLEtBQUMsU0FBUyxJQUFJOzs2QkFDN0I7bUNBQWUsS0FBQyxNQUFTLElBQUk7OzZCQUM3QjttQ0FBZSxLQUFDLE9BQVMsSUFBSTs7NkJBQzdCO21DQUFlLEtBQUMsT0FBUyxJQUFJOzs2QkFDN0I7bUNBQWUsS0FBQyxNQUFTLElBQUk7OzZCQUM3QjttQ0FBZSxLQUFDLEtBQVMsSUFBSTs7NkJBQzdCO21DQUFlLEtBQUMsSUFBUyxJQUFJOzs2QkFDN0I7bUNBQWUsS0FBQyxJQUFTLElBQUk7OzZCQUM3QjttQ0FBZSxLQUFDLElBQVMsSUFBSTs7NkJBQzdCO3lDQUNPLEtBQUMsb0JBQWtCOztvQ0FDRyxLQUFDLE1BQU07O29DQUE1QixLQUFDLEtBQUssS0FBSyxLQUFDOzt1Q0FDVixLQUFDLEdBQUcsSUFBSTs7Ozs7Ozs7d0JBQ3JCLElBQUk7O3FCQUNMOzJCQUFRLEtBQUMsTUFBTSxJQUFJOztxQkFDbkI7cUJBQUs7cUJBQUs7cUJBQU07aUNBQ1QsS0FBQyxvQkFBa0I7OytCQUNoQixLQUFDLEtBQUssS0FBSyxJQUFJOzs7Ozs7O2FBRTdDLElBQUksU0FBUSxTQUFTLElBQUksU0FBUSxnQkFBVSxJQUFJLEtBQVE7O1lBQ3ZELE9BQU0sT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUSxRQUFTLElBQUksU0FBUSxvQkFBYSxJQUFJLEtBQVE7aUJBQ2hFOztnQkFDSCxLQUFDLFdBQVcsSUFBSSxzQ0FBcUMsSUFBSTs7O1FBRWpFLE1BQU0sT0FBTztZQUVWLElBQUksU0FBUSxTQUFhLFFBQVMsSUFBSSxTQUFRLE9BQU8sSUFBSSxTQUFROztZQUNoRSxLQUFDLFFBQVEsK0JBQThCLElBQUk7O21CQUs1QyxJQUFJLE1BQVMsSUFBSTs7WUFDaEIsS0FBQyxXQUFXLElBQUkscUNBQW9DLElBQUk7O1FBRTVELEtBQUMsVUFBVSxpQkFBTSxJQUFJLDJCQUFPLElBQUk7WUFFN0IsSUFBSSxTQUFRLG9CQUFZLE9BQWMsS0FBQzs7Z0JBRW5DLEtBQUMsdUJBQWEsT0FBUSxLQUFDLDBCQUFhLFdBQ3BDLEtBQUMsdUJBQWEsVUFBYyxLQUFDLGVBQzdCLEtBQUMsdUJBQWEsT0FBUSxLQUFDLDBCQUFhLGdCQUFZLFFBQVcsS0FBQzs7b0JBRXhELEtBQUMsVUFBVTs7b0JBRVYsUUFBUSxLQUFDLGtCQUFrQixJQUFLO29CQUNoQyxLQUFDLFNBQVMsaUJBQU0sSUFBSSwyQkFBTyxJQUFJOzJCQUM3QixLQUFDLElBQUksTUFBTzs7OztRQUUxQixJQUFJO2VBQ0UsT0FBTzs7WUFFVCxZQUFZLE9BQU87WUFFbkIsSUFBSSxLQUFDLElBQUksRUFBRTtnQkFFVSxLQUFDOztnQkFBdEIsTUFBTSxJQUFJLE1BQU07O1lBRWhCLElBQUksS0FBQyxJQUFJLEVBQUU7Z0JBRVUsS0FBQzs7Z0JBQXRCLE1BQU0sSUFBSSxNQUFNOzt3QkFFYixPQUFPLGFBQVAsT0FBTyxHQUFJLGtCQUFROztnQkFDbEIsS0FBQyxLQUFLLGtCQUFpQixPQUFPLGFBQVAsT0FBTyxHQUFJO2dCQUNsQzs7Z0JBRUQsY0FBYSxPQUFPOzs0QkFFaEIsT0FBTyxhQUFQLE9BQU8sR0FBSSxrQkFBUTs7K0JBQ2YsS0FBQyxvQkFBYzs7d0JBQ2QsS0FBQyxLQUFLO3dCQUNOOzt5QkFFRCxLQUFDLDZCQUFELEtBQUMsbUJBQVcsV0FBVzs7d0JBQ3RCLEtBQUMsS0FBSzt3QkFDTjs7a0NBRUssS0FBQyxvQkFBZ0IsT0FBTzs7d0JBQzdCLEtBQUMsUUFBUSxnQ0FBK0IsSUFBSTs7b0JBRWhELEtBQUMsS0FBSztvQkFDTixPQUFPOztxQkFFUixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzt5QkFDZixPQUFPLEdBQUcsT0FBTyxhQUFqQixPQUFPLEdBQUcsT0FBTyxHQUFJLHNCQUFROzt3QkFDNUIsS0FBQyxLQUFLO3dCQUNOLEtBQUMsS0FBSyxjQUFjLE9BQU8sR0FBRyxPQUFPLEdBQUc7d0JBQ3hDLFFBQVEsT0FBTzt3QkFDZixJQUFJLEtBQUMsS0FBSyxFQUFFLE1BQU07NEJBQ2YsTUFBTSxPQUFPOzs0QkFDWixLQUFDLEtBQUssNkJBQTZCLE1BQU0sT0FBTyxLQUFDOzRCQUNqRCxTQUFTLE1BQU07NEJBQ2Y7O3dCQUNKOzs7cUJBRUwsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7eUJBQ2YsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7Z0RBQ0gsT0FBTyxhQUFQLE9BQU8sR0FBSSxtQkFBUyxLQUFDOzs0QkFDaEMsS0FBQyxLQUFLOzRCQUNOOzt3QkFDSixLQUFDLEtBQUs7d0JBQ04sS0FBQyxhQUFhLGlDQUFpQzt3QkFDL0M7OztnQkFFUixLQUFDLEtBQUssZ0NBQWdDLEtBQUM7Z0JBQ3ZDOzs7WUFFcUQsS0FBQzs7WUFBOUQsTUFBTSxzQkFBb0IsS0FBQyxVQUFZLFNBQVksS0FBSzs7YUFFckQsS0FBQyw2QkFBRCxLQUFDLG1CQUFXLFdBQVc7O1lBQ3RCLEtBQUMsb0JBQW9CLEtBQUM7WUFDdEIsS0FBQyxJQUFJLEtBQUM7O1FBRVYsS0FBQyxTQUFTLGlCQUFNLElBQUksMkJBQU8sSUFBSTtlQUMvQjs7O3FCQWNKLGtCQUFLLEdBQUU7Ozs7UUFFSCxLQUFDLFVBQVUsTUFBTTtlQUVYLE1BQU0sT0FBTzs7WUFFZixZQUFZLE9BQU87aUJBRVo7O2dCQUNILEtBQUMsUUFBUSxrQ0FBaUMsSUFBSTs7WUFFbEQsWUFBWSxNQUFNLFlBQVksSUFBSSxRQUFPLElBQUksT0FBUSxJQUFJLFNBQVEsSUFBSTtZQUNyRSxVQUFhO3VCQUVWLElBQUksS0FBUSxnQkFBUyxFQUFFLEtBQVEsS0FBQyxLQUFLOztnQkFDcEM7O2dCQUVELElBQUksU0FBUTs7Z0JBQVMsS0FBQyxLQUFLO2dCQUFtQjs7Z0JBRTlDLEtBQUMsdUJBQWEsVUFBVyxJQUFJLFNBQVE7O2dCQUFVLEtBQUMsS0FBSztnQkFBc0I7O2dCQUcxRSxJQUFJLFNBQVEsY0FBUSxLQUFDLG9CQUFjOztvQkFFb0IsS0FBQzs7b0JBQXBELE1BQU0sT0FBTyxzQkFBc0I7O2dCQUNuQyxJQUFJLEtBQUMsT0FBTyxFQUFFO2dCQUNkOztxQkFFSixJQUFJLFNBQVEsUUFBUyxzQkFBYSxJQUFXLEtBQUM7O29CQUV2QyxLQUFDLHVCQUFhOztvQkFDYixLQUFDLEtBQUssc0NBQXNDO3dCQUMyQixLQUFDOzt3QkFBeEUsTUFBTSxPQUFPLDBDQUEwQzs7b0JBQ3ZELElBQUksS0FBQyxPQUFPLEVBQUU7Ozs7b0JBRWQsS0FBQyxLQUFLLGtDQUFrQztvQkFDeEMsSUFBSSxLQUFDLE9BQU8sRUFBRTs7O3FCQUV0QixJQUFJLFNBQVEsUUFBUyxLQUFDLHVCQUFhOztnQkFFL0IsS0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDakIsSUFBSSxLQUFDLE9BQU8sRUFBRTs7c0JBRWxCLEVBQUU7O29CQUdNLEVBQUUsU0FBUTs7b0JBQVEsSUFBSSxLQUFDLE1BQU8sRUFBRTs7eUJBQ2hDLEVBQUUsU0FBUTs7b0JBQVEsSUFBSSxLQUFDLE9BQU8sRUFBRTs7eUJBQ2hDLEVBQUUsU0FBUTs7b0JBQVEsSUFBSSxLQUFDLE1BQU8sRUFBRTs7Z0NBQ2hDLEVBQUUsTUFBUyxxQkFBWSxJQUFJLE1BQWEsa0JBQVMsSUFBSSxNQUFTLEtBQUssS0FBSyxJQUFJOztvQkFBUyxJQUFJLEtBQUMsVUFBVSxLQUFNLEVBQUc7O2dDQUM3RyxFQUFFLE1BQVMsU0FBUSxNQUFLLFFBQU8sUUFBTyxPQUFNLE9BQU0sdUJBQWMsSUFBSSxNQUFhLEtBQUksb0JBQVUsSUFBSSxLQUFZOztvQkFBVyxJQUFJLEtBQUMsVUFBVSxLQUFNLEVBQUc7O2dDQUNsSixFQUFFLE1BQVMsUUFBTyxZQUFZLEVBQUUsU0FBUTs7d0JBQ2pDLEtBQUMsaUJBQWlCLEVBQUUsSUFBSzs7d0JBQ3hCLElBQUksS0FBQyxVQUFVLEtBQU0sRUFBRzs7Ozt3QkFFeEIsS0FBQyxlQUFlOzs7Z0NBQ3hCLEVBQUUsTUFBUyxLQUFJLFVBQVU7O29CQUNyQixLQUFDLEtBQUs7b0JBQ04sSUFBSSxLQUFDLFVBQVUsS0FBSyxFQUFFOztnQ0FDMUIsRUFBRSxNQUFTLElBQUcsU0FBUzs7d0JBQ2hCLElBQUksU0FBUTs7d0JBQ1gsS0FBQyxLQUFLOzRCQUNILEVBQUUsU0FBUTs7NEJBQ1QsSUFBSSxPQUFPLE1BQU0sSUFBSTs0QkFDckIsSUFBSSxPQUFPOzt3QkFDZixJQUFJLE9BQU87Ozs7d0JBRVgsS0FBQyxLQUFLO3dCQUNOLElBQUksS0FBQyxVQUFVLEtBQUssRUFBRTs7O2dDQUM5QixJQUFJLE1BQVMsS0FBSSxVQUFVOztpQ0FDcEIsRUFBRSxNQUFhOzt3QkFDZCxLQUFDLFdBQVcsSUFBSSwyQ0FBMEMsSUFBSTs7b0JBQ2xFLElBQUksS0FBQyxVQUFVLEVBQUUsT0FBTzs7Ozt3QkFFOEMsS0FBQzs7d0JBQXZFLE1BQU0seUNBQXlDLEtBQUMsY0FBYzs7b0JBQzlEOzs7OzsyQkFLSixJQUFJLE1BQVMsS0FBSSxVQUFXOztvQkFBa0IsS0FBQyxhQUFhLEVBQUU7b0JBQUssSUFBSSxLQUFDLFVBQVUsRUFBRSxPQUFPO29CQUFVOzt5QkFDckcsS0FBQyx1QkFBYSxVQUFjLElBQUksU0FBUTs7b0JBQU0sS0FBQyxLQUFLO29CQUE0Qjs7eUJBQ2hGLEtBQUMsdUJBQWEsT0FBYyxJQUFJLFNBQVE7O29CQUFNLEtBQUMsS0FBSztvQkFBNEI7O3lCQUNoRixLQUFDLHVCQUFhLE9BQWMsSUFBSSxTQUFROztvQkFBTSxLQUFDLEtBQUs7b0JBQTRCOzs7O3dCQUVyQixLQUFDOzt3QkFBeEQsTUFBTSxnQ0FBZ0MsS0FBQyxXQUFXOzt3QkFDSixLQUFDOzt3QkFBL0MsTUFBTSxPQUFPLDBCQUEwQjs7b0JBQ3ZDOzs7Z0JBRWIsY0FBYSxPQUFPOztnQkFDbkIsS0FBQyxLQUFLO2dCQUNOOzs7b0JBRWEsWUFBQSxFQUFHLG1CQUFTLFFBQU8sWUFBWSxFQUFFLFNBQVE7O1lBQTlELEtBQUMsZUFBZTs7UUFFaEIsS0FBQyxTQUFTLE1BQU07ZUFDaEI7OztxQkFJSiwrQkFBa0IsSUFBRyxLQUFJOztZQUVBOzttQkFBbkIsSUFBSSxTQUFROzttQkFDSCxJQUFJLE1BQVMsS0FBSyxLQUFLLGNBQWdCLElBQUk7O21CQUFwRDs7bUJBQ1MsSUFBSSxLQUFLLEdBQU07O21CQUF4Qjs7d0JBQ0YsSUFBSSxNQUFhLEtBQUssS0FBSyxLQUFLLE9BQU8sT0FBTyxNQUFNLFFBQVEsT0FBTyxJQUFJOzs7cUJBRTNFLDZCQUFnQjs7ZUFFWixLQUFDLFlBQVksSUFBSSx5QkFBeUIsSUFBSSxtQkFBa0IsSUFBSSxTQUFRLFVBQVUsSUFBSSxvQ0FBa0MsSUFBSTs7O3FCQVdwSSxrQkFBSyxHQUFFOzs7O1FBRUgsS0FBQyxVQUFVLE1BQU07ZUFFWCxNQUFNLE9BQU87O1lBRWYsWUFBWSxPQUFPO2lCQUVaOztnQkFDSCxLQUFDLFFBQVEsbUNBQWtDLElBQUk7O1lBRW5ELE1BQU0sWUFBYTtZQUNuQixNQUFNLGFBQWE7WUFDbkIsV0FBVyxJQUFJLFFBQU8sSUFBSSxPQUFRLElBQUksU0FBUSxJQUFJO1lBQ2xELFVBQWE7WUFFYjs7d0JBQVcsS0FBQzs7eUJBQ1I7K0JBQU0sSUFBSSxTQUFROzt5QkFDbEI7K0JBQU0sSUFBSSxTQUFROzs7OztnQkFFYjs7Z0JBQVQ7O2dCQUVHLEVBQUUsU0FBUSxPQUFRLG1CQUFhLE9BQU8sR0FBRyxNQUFTLE1BQUssVUFBUzs7Z0JBQy9ELElBQUksS0FBQyxLQUFLLEVBQUU7Z0JBQ1o7O2dCQUVELEVBQUUsU0FBUSxjQUFRLElBQUksTUFBUyxPQUFPOztnQkFDckMsSUFBSSxLQUFDLFFBQVEsRUFBRTtnQkFDZjs7Z0JBRUQsRUFBRSxTQUFRLE9BQVEsSUFBSSxTQUFROztnQkFDN0IsSUFBSSxLQUFDLEtBQUssRUFBRTtnQkFDWjs7Z0JBR0EsSUFBSSxTQUFROztnQkFBUyxJQUFJLEtBQUMsS0FBSyxFQUFFOztxQkFDakMsSUFBSSxTQUFRLFlBQWUsS0FBQyw2QkFBRCxLQUFDLG1CQUFXLFdBQVcsc0JBQVUsS0FBQyx1QkFBYSxnQkFBUSxPQUFjLEtBQUM7O2dCQUFRLElBQUksS0FBQyxNQUFNLEVBQUU7O3FCQUN0SCxJQUFJLFNBQVE7O2dCQUFTLElBQUksS0FBQyxLQUFLLEVBQUU7O3FCQUNqQyxJQUFJLFNBQVE7O29CQUVMOztvQkFFQyxJQUFJLEtBQUMsT0FBTyxFQUFFOzs7O29CQUlkLElBQUksS0FBQyxPQUFPLEVBQUU7OztxQkFFdEIsSUFBSSxTQUFRLE9BQVEsRUFBRTs7Z0JBRWxCLElBQUksS0FBQyxVQUFVLEVBQUUsT0FBTzs7c0JBRXhCLElBQUksU0FBUSxpQkFDWixJQUFJLE1BQWEsS0FBSyxLQUFLLElBQUksSUFBSSxNQUFNLE9BQU8sTUFBTSxRQUFRLHVCQUM5RCxFQUFFLE1BQWEsSUFBSSxtQkFDbkIsT0FBYyxLQUFDOzsyQkFHWCxLQUFDLG9CQUFjLE1BQU0sVUFBVTs7b0JBQzNCLEtBQUMsb0JBQW9CLEtBQUMscUJBQVksRUFBRTtvQkFDcEM7O3lCQUNKLElBQUksU0FBUTs7b0JBQ1IsS0FBQyxLQUFLO29CQUNOOzs7O29CQUVBLEtBQUMsS0FBSyxtQkFBbUIsRUFBRTtvQkFDM0IsSUFBSSxLQUFDLFVBQVUsRUFBRSxPQUFPLFFBQVE7Ozs2QkFFeEMsSUFBSSxNQUFTLElBQUksa0JBQ2pCLEVBQUUsTUFBYSxJQUFJLFVBQ25CLFdBQVcsT0FBTyxhQUFQLE9BQU8sR0FBSSxtQkFBTSxJQUFJLE1BQUksSUFBSSxLQUFLOztnQkFFN0MsS0FBQyxLQUFLLHFCQUFxQixFQUFHO2dCQUM5QixJQUFJLEtBQUMsVUFBVSxFQUFFLE9BQU8sUUFBUTs7cUJBRXBDLElBQUksU0FBUSxVQUFXLEVBQUU7O2dCQUNyQixLQUFDLEtBQUssdUJBQXVCO2dCQUM3QixJQUFJLEtBQUMsS0FBSyxFQUFFLE9BQU8sUUFBUTs7cUJBRS9CLElBQUksU0FBUSxPQUFROztnQkFDaEIsS0FBQyxLQUFLO2dCQUNOLElBQUksS0FBQyxLQUFLLEVBQUU7O3FCQUVoQixJQUFJLFNBQVEsT0FBUSxhQUFhLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7O2dCQUNoRCxLQUFDLEtBQUssc0JBQXNCO2dCQUM1QixJQUFJLEtBQUMsTUFBTSxFQUFFOztxQkFFakIsSUFBSSxTQUFRLFVBQVUsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7Z0JBRXJDLEtBQUksV0FDQSxTQUFTLE9BQU8sUUFDaEIsSUFBSSxLQUFDLE9BQU8sRUFBRTs7c0JBUWxCLFdBQ0MsSUFBSSxTQUFRLElBQUksU0FBUyxJQUFJLE1BQU0sSUFBSSxnQkFBUSxLQUFDLG9CQUFrQixLQUFJLHdCQUN2RSxPQUFjLEtBQUMsWUFDZCxJQUFJLFNBQVEsUUFBUSxLQUFDLHVCQUFhLFVBQWMsRUFBRSxtQkFDbkQsSUFBVyxLQUFDLG9CQUNaLEtBQUMsb0JBQWtCLElBQUksT0FBTyxRQUFRLE1BQU0sTUFBTSxNQUFNLE1BQU0sTUFBTSxzQkFDbkUsS0FBQyxvQkFBa0IsUUFBUSxXQUFTLElBQUksT0FBTyxJQUFJLFFBQVMsSUFBSSxNQUFNLElBQUksa0JBQzNFLElBQUksTUFBYSxPQUFPLE9BQU8sT0FBTyxRQUFRLFdBQVcsS0FBSyxLQUFLLE1BQU0sd0JBQ3hFLElBQUksTUFBYSxZQUFhLEtBQUMsWUFBWSxxQkFDNUMsSUFBSSxLQUFZLHdCQUNoQixJQUFJLE1BQWEsYUFDWixJQUFJLFNBQVEsWUFBWSxJQUFJLE9BQU8sYUFBWCxJQUFJLE9BQU8sR0FBSSxzQkFBUSxTQUNuRCxJQUFJLFNBQVEsZUFBUSxJQUFJLE1BQVMsS0FBSSxLQUFJLE9BQU0sTUFBSyxrQkFBVSxJQUFJLE1BQVMsSUFBRyxVQUFTLE9BQU8sYUFBUCxPQUFPLEdBQUkscUJBQU8sSUFBSSxNQUFJLE1BQ2xILEtBQUMsMEJBQTBCOztnQkFFM0IsS0FBQyxLQUFLLGlDQUFpQyxFQUFHLEtBQUM7Z0JBQzNDLEtBQUMsS0FBSyxtQ0FBbUM7Z0JBQ3pDLEtBQUMsS0FBSyxtQkFBbUI7Z0JBQ3pCLElBQUksS0FBQyxLQUFLLEVBQUU7Z0JBQ1o7OzRCQUVKLElBQUksTUFBUyxJQUFJLGtCQUFTLEVBQUUsTUFBYSxJQUFJOztvQkFDdEMsV0FBVyxPQUFPLGFBQVAsT0FBTyxHQUFJLHFCQUFPLElBQUksTUFBSSxJQUFJLEtBQUs7O29CQUM3QyxLQUFDLEtBQUssbUNBQW1DLEVBQUUsSUFBSSxLQUFDO29CQUNoRDs7Z0JBQ0osS0FBQyxLQUFLLHNCQUFzQixFQUFFO2dCQUM5QixJQUFJLEtBQUMsVUFBVSxFQUFFLE9BQU8sUUFBUTs7OztvQkFHc0MsS0FBQzs7b0JBQXZFLE1BQU0seUNBQXlDLEtBQUMsY0FBYzs7b0JBQ0osS0FBQzs7b0JBQTNELE1BQU0sc0NBQXNDLEtBQUMsUUFBUTs7b0JBQ2xELElBQUksU0FBUTs7d0JBQ1AsS0FBQywwQkFBMEIsTUFDM0IsS0FBQyxtQ0FDRCxJQUFJLE9BQU8sYUFBWCxJQUFJLE9BQU8sR0FBSSxtQkFBYSxPQUFPLE9BQU8sbUJBQzFDLEtBQUMsb0JBQWtCLEtBQUssT0FBTyxNQUFNLFFBQVEsU0FBUyxPQUFPLFFBQVEsTUFBTSxRQUFRLFFBQVEsV0FBVyxNQUFNLE1BQU0sT0FBTyxPQUFPLFFBQVEsT0FBTyxRQUFRLE1BQU07O3dCQUN6SixLQUFDLEtBQUssbUJBQW1CLEtBQUMsTUFBTSxFQUFFO3dCQUNsQyxJQUFJLEtBQUMsS0FBSyxFQUFFOzs7Z0JBS3hCOztnQkFFTCxjQUFhLE9BQU87O2dCQUVuQjs7O1FBRVIsS0FBQyxTQUFTLE1BQU07ZUFDaEI7OztXQW50QlA7OztlQXF0Qk0ifQ==
//# sourceURL=../../kode/kode/parse.kode
