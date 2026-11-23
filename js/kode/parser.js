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
        var cond, e, thn, _61_23_

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
            e.if.elifs = ((_61_23_=e.if.elifs) != null ? _61_23_ : [])
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
        var cond, subbs, thn, _107_23_

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
            e.if.elifs = ((_107_23_=e.if.elifs) != null ? _107_23_ : [])
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
        var item, items, itemTok, module, moduleToks, name, nameTok, token, toUse

        toUse = []
        token = tokens.shift()
        if (!token || token.type === 'nl')
        {
            this.onError('use is missing what to use',{tok:obj})
        }
        moduleToks = []
        while (token)
        {
            module = token.text
            moduleToks = []
            if (token.type === 'var')
            {
                moduleToks.push(token)
            }
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
                if (token.type === 'var')
                {
                    moduleToks.push(token)
                }
            }
            toUse.push({type:'var',text:module,line:(moduleToks.slice(-1)[0] != null ? moduleToks.slice(-1)[0].line : undefined),col:(moduleToks.slice(-1)[0] != null ? moduleToks.slice(-1)[0].col : undefined),base:moduleToks[0]})
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
                itemTok = token
                item = token.text
                while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
                {
                    token = tokens.shift()
                    item += token.text
                }
                if (_k_.in(item,['first','last']))
                {
                    this.firstLastError(itemTok)
                }
                items.push({type:'var',text:item,line:(itemTok != null ? itemTok.line : undefined),col:(itemTok != null ? itemTok.col : undefined)})
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
                itemTok = token
                item = module + '/' + token.text
                while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
                {
                    token = tokens.shift()
                    item += token.text
                }
                toUse.push({type:'var',text:item,line:(itemTok != null ? itemTok.line : undefined),col:(itemTok != null ? itemTok.col : undefined),base:moduleToks[0]})
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
            nameTok = token
            name = (token != null ? token.text : undefined)
            while (tokens.length && tokens[0].type !== 'nl' && tokens[0].col === token.col + token.text.length)
            {
                token = tokens.shift()
                name += token.text
            }
            name = {type:'var',text:name,line:(nameTok != null ? nameTok.line : undefined),col:(nameTok != null ? nameTok.col : undefined)}
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
        var token

        token = tokens.shift()
        return {dirFile:{type:'var',text:(token != null ? token.text : undefined),line:(token != null ? token.line : undefined),col:(token != null ? token.col : undefined)}}
    }

    Parser.prototype["main"] = function (tok, tokens)
    {
        var name

        name = tokens.shift()
        return {main:{exps:this.block('main',tokens),token:name}}
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
        var args, close, e, llc, open

        this.push('call')
        if (tok.token)
        {
            tok = tok.token
        }
        llc = lastLineCol(tok)
        if (tokens[0].text === '(' && tokens[0].line === llc.line && tokens[0].col === llc.col)
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
        if (!open && !_k_.empty(args))
        {
            this.checkGlued(tok,args[0])
        }
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
        var close, comp, exps, p

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
        p = {parens:{open:open,exps:exps,close:close}}
        if ((tokens[0] != null ? tokens[0].type : undefined) !== 'func' && this.juxtaposed(exps))
        {
            this.juxta.push(p)
        }
        return p
    }

    Parser.prototype["argsWithoutParens"] = function (firstArg, tokens)
    {
        var exps

        this.push('◯rgs')
        tokens.unshift(firstArg)
        exps = this.exps('◯rgs',tokens)
        this.pop('◯rgs')
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
            return _k_.in(t.text,['->','=>','◯->','◯=>'])
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
        var block, exps, flc, literals, rest

        this.push('{')
        flc = firstLineCol(key)
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
                if ((tokens[1] != null ? tokens[1].col : undefined) >= flc.col && !(_k_.in(tokens[1].text,'])')))
                {
                    this.shiftNewline('continue implicit object on nl...',tokens)
                    exps.push(this.exp(tokens))
                    continue
                }
                break
            }
            else if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
            {
                if (tokens[0].col >= flc.col || this.stack.slice(-1)[0] === '{' && _k_.in('section',this.stack))
                {
                    block = tokens.shift()
                    tokens = block.tokens
                    exps = exps.concat(this.exps('object',block.tokens))
                }
                break
            }
            else if ((tokens[0] != null ? tokens[0].line : undefined) === flc.line && !(_k_.in(tokens[0].text,'])};')))
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
        return {compare:{lhs:lhs,rhs:this.exp(tokens),async:tok.async,arrow:tok}}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvcGFyc2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7T0FDYyxZQUFBO09BQU0sWUFBQTs7T0FDZCxZQUFBO0lBQVE7SUFBYTs7O0FBQzFCLFVBQUQ7O3VCQUFROzs7Ozs7c0JBZUosb0JBQU87O2dCQUVILFFBQ0EsS0FBTTs7O3NCQVFWLGlCQUFJLEtBQUk7Ozs7YUFFRCxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzttQkFDaEIsS0FBQyxRQUFRLElBQUk7O1FBRW5CLEtBQUMsS0FBSztRQUNOLEtBQUMsWUFBWTtRQUNiLE9BQU8sS0FBQyxJQUFJO1FBQ1osS0FBQyxZQUFZO2FBRU47O1lBQ0gsS0FBQyxRQUFRLDZCQUE0QixJQUFJOztRQUU3QyxNQUFNLEtBQUMsS0FBSyxLQUFLO1FBRWpCLEtBQUksSUFDSSxLQUFRLEtBQ1IsS0FBUTtRQUVoQixLQUFDLGdCQUFnQixnQkFBZ0IsT0FBTyxLQUFJLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7YUFFNUQsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFDbEIsS0FBQyxLQUFLO1lBQ04sS0FBQyxJQUFJO21CQUNILEtBQUMsUUFBUSxJQUFJLE9BQU87O2dCQUVwQixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFdBQVcsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbkQsT0FBTztZQUNQLE9BQU87WUFFUCxFQUFFLEdBQUcsa0JBQUwsRUFBRSxHQUFHO1lBRUwsT0FBTyxLQUFDLElBQUk7WUFFWixNQUFNLEtBQUMsS0FBSyxPQUFPO1lBRW5CLEtBQUMsZ0JBQWdCLHFCQUFxQixPQUFPLEtBQUksT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTtZQUVwRSxFQUFFLEdBQUcsTUFBTSxNQUNQLE1BQ0ksS0FBTSxLQUNOLEtBQU07O2FBRWYsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFFbEIsT0FBTztZQUVQLEVBQUUs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
//# sourceURL=../../kode/kode/parser.kode
