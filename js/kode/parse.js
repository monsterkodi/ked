var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.Y5=_k_.k.B256(_k_.k.Y(5));_k_.w1=_k_.k.F256(_k_.k.w(1))

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
needsPair = {'(':'parens is missing closing )','[':'array is missing closing ]','{':'curly is missing closing }',',':"missing expression after ','",'.':'property access is missing property name',':':': is missing a key and a value','▴':'assert is missing what to assert','○':'await is missing an operand','◆':'◆ is missing what it calls'}
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
        this.stack = []
        this.sheap = []
        return {vars:[],exps:this.exps('tl',block.tokens)}
    }

    Parse.prototype["exps"] = function (rule, tokens, stop)
    {
        var block, blocked, blockExps, colon, doBreak, e, es, last, nl, numTokens, tok

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
                        return _k_.in(tok.text,['}','->','=>','○->','○=>','[','{','(','▸',':',']'])

                    case '(':
                        return tok.text === ')'

                    case '○rgs':
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
            last = lastLineCol(e)
            while ((_k_.in((tokens[0] != null ? tokens[0].text : undefined),['if','for','while']) && this.noThenAhead(tokens) && !(_k_.in(this.stack.slice(-1)[0],['▸args','▸return'])) && last.line === tokens[0].line))
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
            if ((_k_.in((tokens[0] != null ? tokens[0].text : undefined),['if','then','for','while']) && tokens[0].col > last.col && es.length && !blocked && last.line === tokens[0].line))
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
        var alone, block, e, key, m, numTokens, nxt, paren, tok, _384_34_, _395_45_, _462_33_

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
                case '○':
                    return this.await(tok,tokens)

                case '->':
                case '=>':
                case '○->':
                case '○=>':
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
        if (tok.text === '■')
        {
            this.onError('■ is not a kode character',{tok:tok})
        }
        if (_k_.in(tok.text,['▪','▸']))
        {
            this.onError(`${tok.text} is missing what it goes with`,{tok:tok})
        }
        this.sheapPush('exp',((_384_34_=tok.text) != null ? _384_34_ : tok.type))
        if (tok.type !== 'paren' && !(_k_.in('○rgs',this.stack)))
        {
            if (this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === 'class' || this.stack.slice(-1)[0] === 'op=' && !this.blockAssign || this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === '{' && !(_k_.in('▸args',this.stack)))
            {
                if (this.funcAhead(tokens))
                {
                    paren = this.argsWithoutParens(tok,tokens)
                    this.sheapPop('exp',((_395_45_=tok.text) != null ? _395_45_ : tok.type))
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
        this.sheapPop('exp',((_462_33_=tok.text) != null ? _462_33_ : tok.type))
        return e
    }

    Parse.prototype["rhs"] = function (e, tokens)
    {
        var llc, numTokens, nxt, spaced, unspaced, _524_22_, _533_94_

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
                else if (_k_.in(e.text,['first','last']) && (!(_k_.in(nxt.type,['op','nl'])) && !(_k_.in((nxt.text != null ? nxt.text[0] : undefined),',.}])'))))
                {
                    e = this.operation(null,e,tokens)
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
        this.sheapPop('rhs','rhs')
        return e
    }

    Parse.prototype["lhs"] = function (e, tokens)
    {
        var b, first, last, numTokens, nxt, spaced, unspaced

        this.sheapPush('lhs','lhs')
        while (nxt = tokens[0])
        {
            numTokens = tokens.length
            if (!e)
            {
                this.onError('missing expression on the right',{tok:nxt})
            }
            last = lastLineCol(e)
            first = firstLineCol(e)
            unspaced = last.col === nxt.col && last.line === nxt.line
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
            else if (nxt.type === 'dots' && !(this.stack.slice(-1)[0] != null ? this.stack.slice(-1)[0].startsWith('op') : undefined) && this.stack.slice(-1)[0] !== '(' && !(_k_.in('○rgs',this.stack)))
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
                if ((this.stack.slice(-1)[0] != null ? this.stack.slice(-1)[0].startsWith('op' && this.stack.slice(-1)[0] !== 'op=') : undefined))
                {
                    this.verb('lhs stop on operation',e,nxt)
                    break
                }
                else if (_k_.in(this.stack.slice(-1)[0],['in?','opempty','opvalid']))
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
            else if ((spaced && (nxt.line === last.line || (nxt.col > first.col && !(_k_.in(this.stack.slice(-1)[0],['if','when'])))) && !(_k_.in('○rgs',this.stack)) && !(_k_.in('[',this.stack)) && !(_k_.in(this.stack.slice(-1)[0],['(','call','args(','op|','op&','op/','op*','op+','op-'])) && (!(_k_.in(this.stack.slice(-1)[0],['▸args',':'])) || (nxt.line > last.line && nxt.col > first.col)) && !(_k_.in(nxt.text,['then','when','else','break','continue','in','of','for','while'])) && (!(_k_.in(nxt.text,['if'])) || !this.noThenAhead(tokens)) && !(_k_.in(nxt.text,',.;:)}]')) && !(_k_.in(nxt.type,['nl'])) && !(nxt.type === 'block' && (nxt.tokens[0] != null ? nxt.tokens[0].text : undefined) === '.') && (nxt.type !== 'op' || _k_.in(nxt.text,['++','--','noon','new','not']) || _k_.in(nxt.text,['+','-']) && (tokens[1] != null ? tokens[1].col : undefined) === nxt.col + 1) && this.isSuitableForImplicitCall(e)))
            {
                this.verb('lhs is lhs of implicit call! e',e,this.stack.slice(-1)[0])
                this.verb('    is lhs of implicit call! nxt',nxt)
                this.verb('    is lhs first',first)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9wYXJzZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQXlCQSxnQkFBZ0IsT0FBTyxRQUFRLFVBQVUsUUFBUSxRQUFRLFVBQVUsT0FBTyxLQUFLLFFBQVE7QUFJdkYsWUFDSSxRQUFTLFFBQVcsT0FBWSxRQUFZLFFBQWEsUUFDekQsV0FBVyxXQUFXLFVBQVUsU0FBWSxLQUFhLE9BQ3pELE9BQVMsU0FBVyxVQUFZLFVBQVksTUFBYSxXQUN6RCxLQUFTLGFBQWEsU0FBVSxLQUFZLGFBQWEsWUFDekQsTUFBUyxNQUFXLFVBQVksVUFBWSxZQUFhLFNBQ3pELFNBQVMsU0FBVyxRQUFZLFNBQVksUUFBYSxNQUN6RCxTQUFTLE1BQVcsT0FBWSxRQUFZLE9BQWE7QUFLN0QsWUFBWSxRQUFRLE9BQU8sYUFBYSxZQUFZLE1BQU0sVUFBVSxVQUFVLFlBQVksU0FBUyxTQUFTO0FBSzVHLGNBQWMsSUFBSSxJQUFJLElBQUk7QUFJMUIsYUFBYSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtBQUVqRCxjQUFjO0FBRWQsYUFDSSxJQUFNLDhCQUNOLElBQU0sNkJBQ04sSUFBTSw2QkFDTixJQUFNLCtCQUNOLElBQU0sMkNBQ04sSUFBTSxpQ0FDTixJQUFNLG1DQUNOLElBQU0sOEJBQ04sSUFBTTtBQUVWLFdBQVUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOzs7O3NCQUVQOzs7OztRQUlmLEtBQUMsUUFBVyxLQUFDLEtBQUssS0FBSztRQUN2QixLQUFDLFVBQVcsS0FBQyxLQUFLLEtBQUs7Ozs7OztlQUVOLEtBQUMsS0FBSyxRQUFRLElBQUk7Ozs7O21CQUloQyxLQUFLLEtBQVE7O1lBQ1osS0FBQyxXQUFXLEtBQUssc0NBQXFDLElBQUk7O2VBRTlEOzs7OztRQVVBLEtBQUM7UUFDRCxLQUFDO2dCQUVELFFBQ0EsS0FBTSxLQUFDLEtBQUssS0FBSyxNQUFNOzs7Ozs7O3NC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
//# sourceURL=file://kode/kode/parse.kode
