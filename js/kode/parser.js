var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}}

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
        this.nameIsReserved(name)
        e = {}
        e[type] = {name:name}
        if (tok)
        {
            e[type].keyword = tok
        }
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
        if (exps.length && this.unusableKey(tokens))
        {
            this.onError("malformed object value",{tokens:tokens})
        }
        close = this.shiftClose('curly','}',tokens)
        this.pop('{')
        return {object:{open:open,keyvals:exps,close:close}}
    }

    Parser.prototype["arrowAhead"] = function (tokens)
    {
        var closed, depth, t

        depth = 0
        closed = false
        var list = _k_.list(tokens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            t = list[_a_]
            if (_k_.in(t.type,['nl','block']))
            {
                return false
            }
            if (!closed)
            {
                if (_k_.in(t.text,['(','[','{']))
                {
                    depth++
                }
                else if (_k_.in(t.text,[')',']','}']))
                {
                    depth--
                    if (depth === 0)
                    {
                        closed = true
                    }
                }
                continue
            }
            return _k_.in(t.text,['->','=>','○->','○=>'])
        }
        return false
    }

    Parser.prototype["unusableKey"] = function (tokens)
    {
        var t

        if (_k_.empty(tokens))
        {
            return false
        }
        t = tokens[0]
        if (t.type !== 'paren')
        {
            return false
        }
        if (_k_.in(t.text,[')',']','}']))
        {
            return false
        }
        if (this.arrowAhead(tokens))
        {
            return false
        }
        return true
    }

    Parser.prototype["object"] = function (key, tokens)
    {
        var block, exps, first, literals, rest

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
                rest = tokens.length
                exps = exps.concat(this.exps('object',tokens,';'))
                if (tokens.length === rest && this.unusableKey(tokens))
                {
                    this.onError("malformed object value",{tokens:tokens})
                }
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
        var tok

        tok = tokens.shift()
        return {compare:{lhs:lhs,rhs:this.exp(tokens),async:tok.async}}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvcGFyc2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCUyxVQUFUOzt1QkFBd0I7Ozs7OztzQkFFcEIsb0JBQU87O2dCQUVILFFBQ0EsS0FBTTs7O3NCQVFWLGlCQUFJLEtBQUk7Ozs7YUFFRCxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzttQkFDaEIsS0FBQyxRQUFRLElBQUk7O1FBRW5CLEtBQUMsS0FBSztRQUNOLEtBQUMsWUFBWTtRQUNiLE9BQU8sS0FBQyxJQUFJO1FBQ1osS0FBQyxZQUFZO2FBRU47O1lBQ0gsS0FBQyxRQUFRLDZCQUE0QixJQUFJOztRQUU3QyxNQUFNLEtBQUMsS0FBSyxLQUFLO1FBRWpCLEtBQUksSUFDSSxLQUFRLEtBQ1IsS0FBUTtRQUVoQixLQUFDLGdCQUFnQixnQkFBZ0IsT0FBTyxLQUFJLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7YUFFNUQsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFDbEIsS0FBQyxLQUFLO1lBQ04sS0FBQyxJQUFJO21CQUNILEtBQUMsUUFBUSxJQUFJLE9BQU87O2dCQUVwQixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFdBQVcsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbkQsT0FBTztZQUNQLE9BQU87WUFFUCxFQUFFLEdBQUcsa0JBQUwsRUFBRSxHQUFHO1lBRUwsT0FBTyxLQUFDLElBQUk7WUFFWixNQUFNLEtBQUMsS0FBSyxPQUFPO1lBRW5CLEtBQUMsZ0JBQWdCLHFCQUFxQixPQUFPLEtBQUksT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTtZQUVwRSxFQUFFLEdBQUcsTUFBTSxNQUNQLE1BQ0ksS0FBTSxLQUNOLEtBQU07O2FBRWYsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbEIsT0FBTztZQUVQLEVBQUUsR0FBRyxPQUFPLEtBQUMsTUFBTSxPQUFPOztRQUU5QixL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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/parser.kode
