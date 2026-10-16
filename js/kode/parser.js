var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Parser

import print from "./print.js"
import parse from "./parse.js"

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol


Parser = (function ()
{
    _k_.extend(Parser, parse)
    function Parser ()
    {
        return Parser.__super__.constructor.apply(this, arguments)
    }

    Parser.prototype["scope"] = function (exps)
    {
        return {vars:[],exps:exps}
    }

    Parser.prototype["if"] = function (tok, tokens)
    {
        var cond, e, thn, _69_23_

        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            return this.ifBlock(tok,tokens)
        }
        this.push('if')
        this.lockBlock = true
        cond = this.exp(tokens)
        this.lockBlock = false
        if (!cond)
        {
            this.onError("if is missing a condition",{tok:tok})
        }
        thn = this.then('if',tokens)
        e = {if:{cond:cond,then:thn}}
        this.shiftNewlineTok('if after then',tokens,tok,(tokens[1] != null ? tokens[1].text : undefined) === 'else')
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            this.verb('block after if then -> switch to block mode')
            this.pop('if')
            return this.ifBlock(tok,tokens,e)
        }
        while ((tokens[0] != null ? tokens[0].text : undefined) === 'else' && (tokens[1] != null ? tokens[1].text : undefined) === 'if')
        {
            tokens.shift()
            tokens.shift()
            e.if.elifs = ((_69_23_=e.if.elifs) != null ? _69_23_ : [])
            cond = this.exp(tokens)
            thn = this.then('elif',tokens)
            this.shiftNewlineTok('if after elif then',tokens,tok,(tokens[1] != null ? tokens[1].text : undefined) === 'else')
            e.if.elifs.push({elif:{cond:cond,then:thn}})
        }
        if ((tokens[0] != null ? tokens[0].text : undefined) === 'else')
        {
            tokens.shift()
            e.if.else = this.block('else',tokens)
        }
        this.pop('if')
        return e
    }

    Parser.prototype["ifBlock"] = function (tok, tokens, e)
    {
        var cond, subbs, thn, _119_23_

        this.push('if')
        subbs = this.subBlocks(tokens.shift().tokens)
        if (!e)
        {
            tokens = subbs.shift()
            e = {if:{cond:this.exp(tokens),then:this.then('if',tokens)}}
        }
        while (subbs.length)
        {
            tokens = subbs.shift()
            if ((tokens[0] != null ? tokens[0].text : undefined) === 'else')
            {
                tokens.shift()
                e.if.else = this.block('else',tokens)
                break
            }
            cond = this.exp(tokens)
            thn = this.then('elif',tokens)
            e.if.elifs = ((_119_23_=e.if.elifs) != null ? _119_23_ : [])
            e.if.elifs.push({elif:{cond:cond,then:thn}})
        }
        this.pop('if')
        return e
    }

    Parser.prototype["ifTail"] = function (e, tok, tokens)
    {
        var cond

        cond = this.exp(tokens)
        if (!cond)
        {
            this.onError('if is missing a condition',{tok:tok})
        }
        return {if:{cond:cond,then:[e]}}
    }

    Parser.prototype["for"] = function (tok, tokens)
    {
        var inof, list, thn, vals

        this.push('for')
        vals = this.exps('for vals',tokens)
        if (!(vals != null ? vals.length : undefined))
        {
            this.onError("for is missing the variable to iterate",{tok:tok})
        }
        if (vals.length === 1)
        {
            vals = vals[0]
        }
        inof = tokens.shift()
        if (!inof)
        {
            this.onError("for is missing 'in' or 'of'",{tok:tok})
        }
        list = this.exp(tokens)
        if (!list)
        {
            this.onError("for is missing the list to iterate",{tok:tok})
        }
        thn = this.then('for',tokens)
        this.pop('for')
        return {for:{vals:vals,inof:inof,list:list,then:thn}}
    }

    Parser.prototype["each"] = function (e, tokens)
    {
        var ech

        ech = tokens.shift()
        return {each:{lhs:e,each:ech,fnc:this.exp(tokens)}}
    }

    Parser.prototype["forTail"] = function (e, tok, tokens)
    {
        var inof, list, vals

        this.push('for')
        vals = this.exps('for vals',tokens)
        if (!(vals != null ? vals.length : undefined))
        {
            this.onError("for is missing the variable to iterate",{tok:tok})
        }
        if (vals.length === 1)
        {
            vals = vals[0]
        }
        inof = tokens.shift()
        if (!inof)
        {
            this.onError("for is missing 'in' or 'of'",{tok:tok})
        }
        list = this.exp(tokens)
        if (!list)
        {
            this.onError("for is missing the list to iterate",{tok:tok})
        }
        this.pop('for')
        return {for:{vals:vals,inof:inof,list:list,then:[e]}}
    }

    Parser.prototype["while"] = function (tok, tokens)
    {
        var cond, thn

        this.push('while')
        cond = this.exp(tokens)
        if (!cond)
        {
            this.onError('while is missing a condition',{tok:tok})
        }
        thn = this.then('while',tokens)
        this.pop('while')
        return {while:{cond:cond,then:thn}}
    }

    Parser.prototype["whileTail"] = function (e, tok, tokens)
    {
        var cond

        cond = this.exp(tokens)
        if (!cond)
        {
            this.onError('while is missing a condition',{tok:tok})
        }
        return {while:{cond:cond,then:[e]}}
    }

    Parser.prototype["switch"] = function (tok, tokens)
    {
        var e, lastWhen, match, subbs, whens

        this.push('switch')
        match = this.exp(tokens)
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            tokens = tokens.shift().tokens
        }
        else
        {
            return this.error({pop:'switch',msg:'block expected!',tokens:tokens})
        }
        whens = []
        e = {switch:{match:match,whens:whens}}
        if ((tokens[0] != null ? tokens[0].text : undefined) !== 'when')
        {
            subbs = this.subBlocks(tokens)
            while (subbs.length)
            {
                tokens = subbs.shift()
                if ((tokens[0] != null ? tokens[0].text : undefined) === 'else')
                {
                    tokens.shift()
                    e.switch.else = this.block('else',tokens)
                    break
                }
                whens.push(this.when(null,tokens))
                if ((whens.slice(-2,-1)[0] != null) && _k_.empty(whens.slice(-2,-1)[0].when.then))
                {
                    whens.slice(-1)[0].when.vals = whens.slice(-2,-1)[0].when.vals.concat(whens.slice(-1)[0].when.vals)
                    whens.splice(-2,1)
                }
            }
        }
        else
        {
            while ((tokens[0] != null ? tokens[0].text : undefined) === 'when')
            {
                lastWhen = tokens[0]
                whens.push(this.exp(tokens))
                this.shiftNewlineTok('switch after when',tokens,lastWhen,_k_.in((tokens[1] != null ? tokens[1].text : undefined),['when','else']))
            }
            if ((tokens[0] != null ? tokens[0].text : undefined) === 'else')
            {
                tokens.shift()
                e.switch.else = this.block('else',tokens)
            }
        }
        this.pop('switch')
        return e
    }

    Parser.prototype["when"] = function (tok, tokens)
    {
        var thn, vals

        this.push('when')
        vals = []
        while (((tokens[0] != null) && (!(_k_.in(tokens[0].type,['block','nl']))) && tokens[0].text !== 'then'))
        {
            vals.push(this.exp(tokens))
        }
        thn = this.then('when',tokens)
        this.shiftNewlineTok('when with empty then',tokens,tok,_k_.empty(thn))
        this.pop('when')
        return {when:{vals:vals,then:thn}}
    }

    Parser.prototype["try"] = function (tok, tokens)
    {
        var ctch, errr, exps, fnlly

        this.push('try')
        exps = this.block('body',tokens)
        this.shiftNewlineTok('try body end',tokens,tok,_k_.in((tokens[1] != null ? tokens[1].text : undefined),['catch','finally']))
        if ((tokens[0] != null ? tokens[0].text : undefined) === 'catch')
        {
            this.push('catch')
            tokens.shift()
            if ((tokens[0] != null ? tokens[0].type : undefined) !== 'block')
            {
                errr = this.exp(tokens)
            }
            ctch = {errr:errr,exps:this.block('body',tokens)}
            this.pop('catch')
            this.shiftNewlineTok('try catch end',tokens,tok,(tokens[1] != null ? tokens[1].text : undefined) === 'finally')
        }
        if ((tokens[0] != null ? tokens[0].text : undefined) === 'finally')
        {
            tokens.shift()
            fnlly = this.block('body',tokens)
        }
        if (!ctch && !fnlly)
        {
            this.onError("try is missing catch or finally",{tok:tok})
        }
        this.pop('try')
        return {try:{exps:exps,catch:ctch,finally:fnlly}}
    }

    Parser.prototype["import"] = function (obj, tokens)
    {
        var toImport, token

        toImport = []
        while (token = tokens.shift())
        {
            if (token.type === 'nl')
            {
                break
            }
            toImport.push(token)
        }
        if (!toImport.length)
        {
            this.onError("import is missing what to import",{tok:obj})
        }
        return {import:{args:toImport}}
    }

    Parser.prototype["use"] = function (obj, tokens)
    {
        var item, items, module, name, token, toUse

        toUse = []
        token = tokens.shift()
        if (!token || token.type === 'nl')
        {
            this.onError('use is missing what to use',{tok:obj})
        }
        while (token)
        {
            module = token.text
            if (module === '◆')
            {
                module = '.'
                tokens.unshift(token)
                break
            }
            while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
            {
                token = tokens.shift()
                module += token.text
            }
            toUse.push({type:'var',text:module})
            if (tokens.length && (tokens[0].type === 'nl' || _k_.in(tokens[0].text,'▪●◆')))
            {
                break
            }
            token = tokens.shift()
        }
        items = []
        if (tokens.length && tokens[0].text === '▪')
        {
            tokens.shift()
            token = tokens.shift()
            while (token && token.type !== 'nl' && _k_.in(token.type,['var','keyword','bool','op']))
            {
                item = token.text
                while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
                {
                    token = tokens.shift()
                    item += token.text
                }
                items.push(item)
                if (tokens.length && (tokens[0].type === 'nl' || _k_.in(tokens[0].text,'▪●◆')))
                {
                    break
                }
                if (!(_k_.in((tokens[0] != null ? tokens[0].type : undefined),['var','keyword','bool','op'])))
                {
                    break
                }
                token = tokens.shift()
            }
        }
        if (tokens.length && tokens[0].text === '◆' && !items.length)
        {
            toUse = []
            tokens.shift()
            token = tokens.shift()
            while (token && token.type !== 'nl')
            {
                item = module + '/' + token.text
                while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
                {
                    token = tokens.shift()
                    item += token.text
                }
                toUse.push({type:'var',text:item})
                if (tokens.length && (tokens[0].type === 'nl' || _k_.in(tokens[0].text,'▪●◆')))
                {
                    break
                }
                token = tokens.shift()
            }
        }
        if (tokens.length && tokens[0].text === '●')
        {
            tokens.shift()
            token = tokens.shift()
            name = (token != null ? token.text : undefined)
            while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
            {
                token = tokens.shift()
                name += token.text
            }
        }
        if (tokens.length && tokens[0].type !== 'nl')
        {
            this.onError('use has a dangling token',{tok:tokens[0]})
        }
        return {use:{toUse:toUse,items:items,name:name}}
    }

    Parser.prototype["export"] = function (obj, tokens)
    {
        var start, toExport

        toExport = []
        start = tokens.shift()
        if (!start)
        {
            this.onError("export is missing what to export",{tok:obj})
        }
        if (start.text === '{')
        {
            toExport = this.object('export',start.tokens)
        }
        else if (start.type === 'block')
        {
            toExport = this.block('export',start.tokens)
        }
        else
        {
            tokens.unshift(start)
            toExport = this.exp(tokens)
        }
        return {export:{args:toExport}}
    }

    Parser.prototype["dirFile"] = function (tok, tokens)
    {
        return {dirFile:tokens.shift().text}
    }

    Parser.prototype["main"] = function (tok, tokens)
    {
        tokens.shift()
        return {main:this.block('main',tokens)}
    }

    Parser.prototype["class"] = function (tok, tokens, type = 'class')
    {
        var e, name

        this.push('class')
        name = tokens.shift()
        if (!name || name.type === 'nl')
        {
            this.onError(`${type} is missing a name`,{tok:tok})
        }
        e = {}
        e[type] = {name:name}
        if ((tokens[0] != null ? tokens[0].text : undefined) === 'extends')
        {
            tokens.shift()
            e[type].extends = this.exps('class extends',tokens,'nl')
        }
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            tokens = tokens.shift().tokens
            e[type].body = this.exps('class body',tokens)
            this.nameMethods(e[type].body)
        }
        this.pop('class')
        return e
    }

    Parser.prototype["function"] = function (tok, tokens)
    {
        return this.class(tok,tokens,'function')
    }

    Parser.prototype["func"] = function (args, arrow, tokens)
    {
        var body, e

        this.push('func')
        body = this.scope(this.block('body',tokens))
        this.pop('func')
        e = {func:{}}
        if (args)
        {
            e.func.args = args
        }
        e.func.arrow = arrow
        e.func.body = body
        return e
    }

    Parser.prototype["return"] = function (tok, tokens)
    {
        var e, val

        if ((tokens[0] != null ? tokens[0].type : undefined) !== 'nl')
        {
            val = this.block('return',tokens)
            if ((val != null ? val.length : undefined) > 1)
            {
                this.onError('unreachable code after return statement?',{tok:tok,tokens:tokens})
            }
            val = (val != null ? val[0] : undefined)
        }
        e = {return:{ret:tok}}
        if (val)
        {
            e.return.val = val
        }
        return e
    }

    Parser.prototype["await"] = function (tok, tokens)
    {
        var e

        e = {await:{exp:this.exp(tokens)}}
        return e
    }

    Parser.prototype["call"] = function (tok, tokens, qmrk)
    {
        var args, close, e, last, open

        this.push('call')
        if (tok.token)
        {
            tok = tok.token
        }
        last = lastLineCol(tok)
        if (tokens[0].text === '(' && tokens[0].line === last.line && tokens[0].col === last.col)
        {
            open = tokens.shift()
            if ((tokens[0] != null ? tokens[0].text : undefined) === ')')
            {
                args = []
            }
            else
            {
                this.push('args(')
                args = this.exps('(',tokens,')')
                this.pop('args(')
            }
        }
        else
        {
            if (_k_.in(tok.text,['typeof','new']))
            {
                this.push('▸arg')
                args = [this.exp(tokens)]
                this.pop('▸arg')
            }
            else
            {
                args = this.block('args',tokens)
            }
        }
        if (open)
        {
            if ((tokens[0] != null ? tokens[0].text : undefined) === ')')
            {
                close = tokens.shift()
            }
            else if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl' && tokens[1].text === ')')
            {
                this.shiftNewline('implicit call ends',tokens)
                close = tokens.shift()
            }
        }
        if (open && !close)
        {
            this.onError("explicit call is missing closing bracket )",{tok:tok,tokens:tokens})
        }
        this.pop('call')
        if (!_k_.empty(args))
        {
            args[0] = this.prepareCallAssign(args[0])
        }
        e = {call:{callee:tok}}
        if (open)
        {
            e.call.open = open
        }
        if (qmrk)
        {
            e.call.qmrk = qmrk
        }
        e.call.args = args
        if (close)
        {
            e.call.close = close
        }
        return e
    }

    Parser.prototype["operation"] = function (lhs, op, tokens)
    {
        var e, rhs, wasPrefix

        if (op.text === '=')
        {
            if (_k_.empty(tokens))
            {
                this.onError("assignment without operand",{tok:lhs})
                return {operation:{lhs:lhs,operator:op}}
            }
            if (tokens[0].type === 'block')
            {
                this.blockAssign = true
                tokens = tokens.shift().tokens
            }
        }
        this.push(`op${op.text}`)
        wasPrefix = this.prefixOperand
        this.prefixOperand = !lhs
        rhs = this.exp(tokens)
        this.prefixOperand = wasPrefix
        if (!(_k_.in(op.text,['++','--']) && lhs))
        {
            if (!(_k_.in('(',this.stack)) && !(_k_.in('args(',this.stack)))
            {
                if ((rhs != null ? rhs.type : undefined) === 'paren' && _k_.in(rhs.text,[')',']','}']))
                {
                    this.onError('unmatched closing bracket',{tok:rhs})
                }
            }
            if (!rhs || (!lhs && rhs.type === 'op'))
            {
                if (op.text === 'is')
                {
                    this.onError("'is' is missing what to test against",{tok:op})
                }
                else
                {
                    this.onError(`${op.text} is missing a right operand`,{tok:op})
                }
            }
        }
        if (op.text === '~' && !((lhs != null ? lhs.type : undefined) === 'op' && lhs.text === '~'))
        {
            this.onError('~ is not a binary operator',{tok:op})
        }
        delete this.blockAssign
        this.pop(`op${op.text}`)
        rhs = this.prepareCallAssign(rhs)
        if (op.text === '?=')
        {
            op.text = '='
            rhs = {qmrkop:{lhs:lhs,qmrk:{type:'op',text:'?',line:op.line,col:op.col},rhs:rhs}}
        }
        e = {operation:{}}
        if (lhs)
        {
            e.operation.lhs = lhs
        }
        e.operation.operator = op
        if (rhs)
        {
            e.operation.rhs = rhs
        }
        return e
    }

    Parser.prototype["incond"] = function (lhs, tokens)
    {
        var intok, rhs

        intok = tokens.shift()
        this.push('in?')
        rhs = this.exp(tokens)
        this.pop('in?')
        if (!rhs)
        {
            this.onError('in is missing a right operand',{tok:intok})
        }
        return {incond:{lhs:lhs,in:intok,rhs:rhs}}
    }

    Parser.prototype["array"] = function (open, tokens)
    {
        var close, comp, items

        if ((tokens[0] != null ? tokens[0].text : undefined) === ']')
        {
            return {array:{open:open,items:[],close:tokens.shift()}}
        }
        this.push('[')
        items = this.exps('[',tokens,']')
        close = this.shiftClose('array',']',tokens)
        this.pop('[')
        if (comp = this.lcomp(items))
        {
            return comp
        }
        return {array:{open:open,items:items,close:close}}
    }

    Parser.prototype["slice"] = function (from, tokens)
    {
        var dots, upto

        dots = tokens.shift()
        if ((tokens[0] != null ? tokens[0].text : undefined) === ']')
        {
            upto = null
        }
        else
        {
            upto = this.exp(tokens)
            if (!upto)
            {
                this.onError("slice is missing the end",{tok:dots})
            }
        }
        return {slice:{from:from,dots:dots,upto:upto}}
    }

    Parser.prototype["index"] = function (tok, tokens)
    {
        var close, open, slice

        this.push('idx')
        open = tokens.shift()
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'dots')
        {
            slice = this.slice(null,tokens)
        }
        else
        {
            slice = this.exp(tokens)
        }
        close = this.shiftClose('index',']',tokens)
        this.pop('idx')
        return {index:{idxee:tok,open:open,slidx:slice,close:close}}
    }

    Parser.prototype["parens"] = function (open, tokens)
    {
        var close, comp, exps

        if ((tokens[0] != null ? tokens[0].text : undefined) === ')')
        {
            return {parens:{open:open,exps:[],close:tokens.shift()}}
        }
        this.push('(')
        exps = this.exps('(',tokens,')')
        close = this.shiftClose('parens',')',tokens)
        this.pop('(')
        if (comp = this.lcomp(exps))
        {
            return comp
        }
        return {parens:{open:open,exps:exps,close:close}}
    }

    Parser.prototype["argsWithoutParens"] = function (firstArg, tokens)
    {
        var exps

        this.push('○rgs')
        tokens.unshift(firstArg)
        exps = this.exps('○rgs',tokens)
        this.pop('○rgs')
        return {parens:{open:{type:'paren',text:'('},exps:exps,close:{type:'paren',text:')'}}}
    }

    Parser.prototype["lcomp"] = function (exps)
    {
        if (_k_.empty(exps))
        {
            return
        }
        if (!exps[0]['for'])
        {
            return
        }
        return {lcomp:exps[0]}
    }

    Parser.prototype["curly"] = function (open, tokens)
    {
        var close, exps

        if ((tokens[0] != null ? tokens[0].text : undefined) === '}')
        {
            return {object:{open:open,keyvals:[],close:tokens.shift()}}
        }
        this.push('{')
        exps = this.exps('{',tokens,'}')
        close = this.shiftClose('curly','}',tokens)
        this.pop('{')
        return {object:{open:open,keyvals:exps,close:close}}
    }

    Parser.prototype["object"] = function (key, tokens)
    {
        var block, exps, first, literals

        this.push('{')
        first = firstLineCol(key)
        exps = [this.keyval(key,tokens)]
        literals = this.kode.atoms.concat(['keyword','op'])
        while (tokens.length)
        {
            if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl')
            {
                if (!(_k_.in((tokens[1] != null ? tokens[1].type : undefined),literals)))
                {
                    break
                }
                if (!(_k_.in((tokens[2] != null ? tokens[2].text : undefined),': ')))
                {
                    break
                }
                if ((tokens[1] != null ? tokens[1].col : undefined) >= first.col && !(_k_.in(tokens[1].text,'])')))
                {
                    this.shiftNewline('continue implicit object on nl...',tokens)
                    exps.push(this.exp(tokens))
                    continue
                }
                break
            }
            else if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
            {
                if (tokens[0].col >= first.col || this.stack.slice(-1)[0] === '{' && _k_.in('section',this.stack))
                {
                    block = tokens.shift()
                    tokens = block.tokens
                    exps = exps.concat(this.exps('object',block.tokens))
                }
                break
            }
            else if ((tokens[0] != null ? tokens[0].line : undefined) === first.line && !(_k_.in(tokens[0].text,'])};')))
            {
                exps = exps.concat(this.exps('object',tokens,';'))
                break
            }
            else
            {
                if (_k_.in(tokens[0].text,'])};'))
                {
                    break
                }
                if (!(_k_.in(tokens[0].type,literals)))
                {
                    break
                }
                if (this.debug)
                {
                    console.log('object ... exps?',key,tokens)
                }
                break
            }
        }
        this.pop('{')
        return {object:{keyvals:exps}}
    }

    Parser.prototype["keyval"] = function (key, tokens)
    {
        var block, col, colon, k, line, text, value

        if (_k_.empty(tokens))
        {
            this.onError(`keyval is missing tokens in:\n${_k_.noon(key)}`)
            return
        }
        colon = tokens.shift()
        this.push(':')
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            block = tokens.shift()
            value = this.exp(block.tokens)
        }
        else
        {
            value = this.exp(tokens)
        }
        this.pop(':')
        if (!value)
        {
            this.onError("key is missing a value",{tok:key})
        }
        k = {type:'key'}
        if (key.type)
        {
            k.text = key.text
            k.line = key.line
            k.col = key.col
        }
        else if (key.prop)
        {
            line = firstLineCol(key).line
            col = firstLineCol(key).col

            text = this.kode.renderer.plain(this.kode.renderer.node(key))
            if ((text != null ? text.startsWith('this') : undefined))
            {
                if (text === 'this')
                {
                    text = '@'
                }
                else if (text.startsWith('this.'))
                {
                    text = '@' + text.slice(5)
                }
            }
            k.text = text
            k.line = line
            k.col = col
        }
        else
        {
            this.onError(`keyval is missing type or prop in:\n${_k_.noon(key)}`,{tokens:tokens})
        }
        return {keyval:{key:k,colon:colon,val:value}}
    }

    Parser.prototype["this"] = function (obj, tokens)
    {
        return {prop:{obj:obj,dot:{type:'punct',text:'.',line:obj.line,col:obj.col},prop:tokens.shift()}}
    }

    Parser.prototype["prop"] = function (obj, tokens)
    {
        var dot, prop

        dot = tokens.shift()
        prop = tokens.shift()
        if (!prop || !(_k_.in(prop.type,['var','keyword','bool','op'])))
        {
            this.onError("property access is missing property name",{tok:dot})
        }
        prop.type = 'var'
        return {prop:{obj:obj,dot:dot,prop:prop}}
    }

    Parser.prototype["assert"] = function (obj, tokens)
    {
        return {assert:{obj:obj,qmrk:tokens.shift()}}
    }

    Parser.prototype["qmrkop"] = function (lhs, tokens)
    {
        var qmrk, rhs

        this.push('?')
        qmrk = tokens.shift()
        rhs = this.exp(tokens)
        if (!rhs)
        {
            this.onError(`${qmrk.text} is missing a right operand`,{tok:qmrk})
        }
        this.pop('?')
        return {qmrkop:{lhs:lhs,qmrk:qmrk,rhs:rhs}}
    }

    Parser.prototype["qmrkcolon"] = function (qmrkop, tokens)
    {
        var colon, rhs

        this.push(':')
        colon = tokens.shift()
        rhs = this.exp(tokens)
        if (!rhs)
        {
            this.onError(`${colon.text} is missing a right operand`,{tok:colon})
        }
        this.pop(':')
        return {qmrkcolon:{lhs:qmrkop.lhs,qmrk:qmrkop.qmrk,mid:qmrkop.rhs,colon:colon,rhs:rhs}}
    }

    Parser.prototype["section"] = function (tok, tokens)
    {
        var exps, title

        title = {type:'double',text:'"' + tok.text + '"',line:tok.line,col:tok.col}
        if (_k_.in('section',this.stack))
        {
            this.push('subsect')
            exps = this.block('subsect',tokens)
            this.pop('subsect')
            return {subsect:{title:title,exps:exps}}
        }
        else
        {
            this.push('section')
            exps = this.block('section',tokens)
            this.pop('section')
            return {section:{title:title,exps:exps}}
        }
    }

    Parser.prototype["compare"] = function (lhs, tokens)
    {
        tokens.shift()
        return {compare:{lhs:lhs,rhs:this.exp(tokens)}}
    }

    Parser.prototype["error"] = function (o, tokens)
    {
        if (o.pop)
        {
            this.pop(o.pop)
        }
        return this.onError(o.msg,{tokens:tokens})
    }

    return Parser
})()

export default Parser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvcGFyc2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQXdCd0I7Ozs7Ozs7O2dCQUloQixRQUNBLEtBQU07Ozs7Ozs7YUFVSCxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzttQkFDaEIsS0FBQyxRQUFRLElBQUk7O1FBRW5CLEtBQUMsS0FBSztRQUNOLEtBQUMsWUFBWTtRQUNiLE9BQU8sS0FBQyxJQUFJO1FBQ1osS0FBQyxZQUFZO2FBRU47O1lBQ0gsS0FBQyxRQUFRLDZCQUE0QixJQUFJOztRQUU3QyxNQUFNLEtBQUMsS0FBSyxLQUFLO1FBRWpCLEtBQUksSUFDSSxLQUFRLEtBQ1IsS0FBUTtRQUVoQixLQUFDLGdCQUFnQixnQkFBZ0IsT0FBTyxLQUFJLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7YUFFNUQsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFDbEIsS0FBQyxLQUFLO1lBQ04sS0FBQyxJQUFJO21CQUNILEtBQUMsUUFBUSxJQUFJLE9BQU87O2dCQUVwQixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFdBQVcsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbkQsT0FBTztZQUNQLE9BQU87WUFFUCxFQUFFLEdBQUcsa0JBQUwsRUFBRSxHQUFHO1lBRUwsT0FBTyxLQUFDLElBQUk7WUFFWixNQUFNLEtBQUMsS0FBSyxPQUFPO1lBRW5CLEtBQUMsZ0JBQWdCLHFCQUFxQixPQUFPLEtBQUksT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTtZQUVwRSxFQUFFLEdBQUcsTUFBTSxNQUNQLE1BQ0ksS0FBTSxLQUNOLEtBQU07O2FBRWYsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbEIsT0FBTztZQUVQLEVBQUUsR0FBRyxPQUFPLEtBQUMsTUFBTSxPQUFPOztRQUU5QixLQUFDLElBQUk7ZUFDTDs7Ozs7OztRQVVBLEtBQUMsS0FBSztR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
//# sourceURL=file://kode/kode/parser.kode
