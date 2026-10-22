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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9wYXJzZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQXlCQSxnQkFBZ0IsT0FBTyxRQUFRLFVBQVUsUUFBUSxRQUFRLFVBQVUsT0FBTyxLQUFLLFFBQVE7QUFJdkYsWUFDSSxRQUFTLFFBQVcsT0FBWSxRQUFZLFFBQWEsUUFDekQsV0FBVyxXQUFXLFVBQVUsU0FBWSxLQUFhLE9BQ3pELE9BQVMsU0FBVyxVQUFZLFVBQVksTUFBYSxXQUN6RCxLQUFTLGFBQWEsU0FBVSxLQUFZLGFBQWEsWUFDekQsTUFBUyxNQUFXLFVBQVksVUFBWSxZQUFhLFNBQ3pELFNBQVMsU0FBVyxRQUFZLFNBQVksUUFBYSxNQUN6RCxTQUFTLE1BQVcsT0FBWSxRQUFZLE9BQWE7QUFLN0QsWUFBWSxRQUFRLE9BQU8sYUFBYSxZQUFZLE1BQU0sVUFBVSxVQUFVLFlBQVksU0FBUyxTQUFTO0FBSzVHLGNBQWMsSUFBSSxJQUFJLElBQUk7QUFJMUIsYUFBYSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtBQUVqRCxjQUFjO0FBRWQsYUFDSSxJQUFNLDhCQUNOLElBQU0sNkJBQ04sSUFBTSw2QkFDTixJQUFNLCtCQUNOLElBQU0sMkNBQ04sSUFBTSxpQ0FDTixJQUFNLG1DQUNOLElBQU0sOEJBQ04sSUFBTTtBQUVWLFdBQVUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOztBQUVyQixTQUFUOztzQkFBdUI7YUFFbkIsT0FBRzs7OztRQUVDLEtBQUMsUUFBVyxLQUFDLEtBQUssS0FBSztRQUN2QixLQUFDLFVBQVcsS0FBQyxLQUFLLEtBQUs7Ozs7cUJBRTNCLHNCQUFTLEtBQUk7O2VBQVEsS0FBQyxLQUFLLFFBQVEsSUFBSTs7O3FCQUV2Qyw2QkFBZ0I7O21CQUVULEtBQUssS0FBUTs7WUFDWixLQUFDLFdBQVcsS0FBSyxzQ0FBcUMsSUFBSTs7ZUFFOUQ7OztxQkFRSixvQkFBTzs7UUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/parse.kode
