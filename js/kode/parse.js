var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.Y5=_k_.k.B256(_k_.k.Y(5));_k_.w1=_k_.k.F256(_k_.k.w(1))

var Parse

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol

import print from "./print.js"
import parseutils from "./parseutils.js"


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
                        return _k_.in(tok.text,['}','->','=>','○->','○=>','(','▸',':',']'])

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
            if (tok.text === ')')
            {
                if (_k_.in('(',this.stack) || _k_.in('args(',this.stack))
                {
                    this.verb('exps break on )')
                    break
                }
                this.onError('unmatched closing bracket',{tok:_k_.last(tokens)})
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
                    console.log('exps nl next line starts with .var!',this.stack)
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
        var block, e, numTokens, paren, tok, _295_34_, _306_45_, _369_33_

        if (_k_.empty(tokens))
        {
            return
        }
        tok = tokens.shift()
        if (this.debug)
        {
            console.log(_k_.Y5(_k_.w1((tok != null ? tok.text : undefined))))
        }
        switch (tok.type)
        {
            case 'block':
                return console.error("INTERNAL ERROR: unexpected block token in exp!")

            case 'nl':
                return console.error("INTERNAL ERROR: unexpected nl token in exp!")

            case ';':
                return console.error("INTERNAL ERROR: unexpected ; token in exp!")

            case 'section':
                return this.section(tok,tokens)

            case 'keyword':
                if (!(_k_.in((tokens[0] != null ? tokens[0].text : undefined),':')))
                {
                    if (tok.text === 'import')
                    {
                        if (tokens[0].text === '(')
                        {
                            tok.type = 'call'
                            return this.call(tok,tokens)
                        }
                        else if (_k_.in(tokens[0].text,'.'))
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

        this.sheapPush('exp',((_295_34_=tok.text) != null ? _295_34_ : tok.type))
        if (tok.type !== 'paren' && !(_k_.in('○rgs',this.stack)))
        {
            if (this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === 'class' || this.stack.slice(-1)[0] === 'op=' && !this.blockAssign || this.stack.slice(-1)[0] === ':' && this.stack.slice(-2,-1)[0] === '{' && !(_k_.in('▸args',this.stack)))
            {
                if (this.funcAhead(tokens))
                {
                    paren = this.argsWithoutParens(tok,tokens)
                    this.sheapPop('exp',((_306_45_=tok.text) != null ? _306_45_ : tok.type))
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
        this.sheapPop('exp',((_369_33_=tok.text) != null ? _369_33_ : tok.type))
        return e
    }

    Parse.prototype["rhs"] = function (e, tokens)
    {
        var llc, numTokens, nxt, spaced, unspaced, _430_22_

        this.sheapPush('rhs','rhs')
        while (nxt = tokens[0])
        {
            numTokens = tokens.length
            if (!e)
            {
                return console.error('no e?',nxt)
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
                else if (_k_.in(e.text,['first','last']) && (!(_k_.in(nxt.type,['op','nl'])) && !(_k_.in(nxt.text[0],',.}])'))))
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
                        return console.error('wrong rhs increment')
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
                return console.error('no e?',nxt)
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
            else if ((spaced && (nxt.line === last.line || (nxt.col > first.col && !(_k_.in(this.stack.slice(-1)[0],['if','when'])))) && !(_k_.in('○rgs',this.stack)) && !(_k_.in('[',this.stack)) && !(_k_.in(this.stack.slice(-1)[0],['(','call','args(','op|','op&','op/','op*','op+','op-'])) && (!(_k_.in(this.stack.slice(-1)[0],['▸args',':'])) || (nxt.line > last.line && nxt.col > first.col)) && !(_k_.in(nxt.text,['then','when','else','break','continue','in','of','for','while'])) && (!(_k_.in(nxt.text,['if'])) || !this.noThenAhead(tokens)) && !(_k_.in(nxt.text,',.;:)}]')) && !(_k_.in(nxt.type,['nl'])) && (nxt.type !== 'op' || _k_.in(nxt.text,['++','--','noon','new','not']) || _k_.in(nxt.text,['+','-']) && tokens[1].col === nxt.col + 1) && this.isSuitableForImplicitCall(e)))
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
                    if (this.isSuitableForImplicitCall(e) && this.stackAllowsBlockArg() && !(_k_.in((nxt.tokens[0] != null ? nxt.tokens[0].text : undefined),['then','when'])) && !(_k_.in(this.stack.slice(-1)[0],['if','then','for','while','switch','when','catch','in?','▸args','class','function','op+','op-','opis','opor','opand','op==','opnot','op<','op>'])))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9wYXJzZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkF5QnVCOzs7OztRQUlmLEtBQUMsUUFBVyxLQUFDLEtBQUssS0FBSztRQUN2QixLQUFDLFVBQVcsS0FBQyxLQUFLLEtBQUs7Ozs7OztlQUVOLEtBQUMsS0FBSyxRQUFRLElBQUk7Ozs7O1FBVW5DLEtBQUM7UUFDRCxLQUFDO2dCQUVELFFBQ0EsS0FBTSxLQUFDLEtBQUssS0FBSyxNQUFNOzs7Ozs7O3NCQXFCWjs7OztRQUVYLEtBQUMsVUFBVSxPQUFPO1FBRWxCO2VBRU0sT0FBTzs7WUFFVCxZQUFZLE9BQU87WUFFbkIsTUFBTSxPQUFPO1lBRWI7O3dCQUFpQixLQUFDOzt5QkFFZDsrQkFBYyxHQUFHOzt5QkFDakI7eUJBQ0E7eUJBQUs7eUJBQ0w7K0JBQWMsSUFBSSxTQUFROzt5QkFDMUI7K0JBQWMsSUFBSSxTQUFROzt5QkFDMUI7c0NBQWMsSUFBSSxNQUFTLElBQUksS0FBSyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksSUFBSTs7eUJBQ2pFOytCQUFjLElBQUksU0FBUTs7eUJBQzFCOytCQUFjLElBQUksU0FBUTs7eUJBQzFCO3NDQUFjLElBQUksTUFBUyxJQUFJLElBQUksT0FBTzs7eUJBQzFDOytCQUFjLElBQUksU0FBUTs7eUJBQzFCO3NDQUFjLElBQUksS0FBUTs7eUJBQzFCOytCQUFjLElBQUksU0FBUSxRQUFTLElBQUksU0FBUTs7OytCQUNqQzs7OztnQkFFZjs7Z0JBQ0MsS0FBQyx1QkFBdUIsSUFBSSxxQkFBcUIsS0FBQztnQkFDbEQ7O2dCQUVELFFBQVMsSUFBSSxTQUFRLFFBQVMsSUFBSSxTQUFROztnQkFDekMsS0FBQyx1QkFBdUIsSUFBSSxnQkFBZ0I7Z0JBQzVDOztnQkFFRCxJQUFJLFNBQVE7OzJCQUVSLE1BQVMsS0FBSTs7b0JBQ1osS0FBQyxtQ0FBbUM7b0JBQ3BDOztnQkFFSixRQUFRLE9BQU87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
//# sourceURL=file://kode/kode/parse.kode
