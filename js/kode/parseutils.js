var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.M3=_k_.k.B256(_k_.k.M(3));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w1=_k_.k.F256(_k_.k.w(1));_k_.W1=_k_.k.B256(_k_.k.W(1))

var ParseUtils

import print from "./print.js"


ParseUtils = (function ()
{
    function ParseUtils ()
    {}

    ParseUtils.prototype["prepareCallAssign"] = function (rhs)
    {
        if ((rhs != null ? rhs.switch : undefined))
        {
            rhs = {call:{callee:{parens:{exps:[{func:{arrow:{text:'=>'},body:{vars:[],exps:[rhs]}}}]}}}}
        }
        if ((rhs != null ? rhs.if : undefined))
        {
            if (this.ifSuitableForInline(rhs))
            {
                rhs.if.inline = true
            }
            else
            {
                rhs = {call:{callee:{parens:{exps:[{func:{arrow:{text:'=>'},body:{vars:[],exps:[rhs]}}}]}}}}
            }
        }
        return rhs
    }

    ParseUtils.prototype["shiftClose"] = function (rule, text, tokens)
    {
        if ((tokens[0] != null ? tokens[0].text : undefined) === text)
        {
            return tokens.shift()
        }
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl' && (tokens[1] != null ? tokens[1].text : undefined) === text)
        {
            this.shiftNewline(rule,tokens)
            return tokens.shift()
        }
        this.onError(`${rule} is missing closing ${text}`,{tokens:tokens})
        return null
    }

    ParseUtils.prototype["shiftNewline"] = function (rule, tokens)
    {
        if (this.debug)
        {
            console.log(_k_.M3(_k_.y5(` ◂ ${_k_.w1(rule)}`)))
        }
        return tokens.shift()
    }

    ParseUtils.prototype["shiftNewlineTok"] = function (rule, tokens, tok, cond)
    {
        if ((tokens[0] != null ? tokens[0].type : undefined) === 'nl' && cond)
        {
            if ((tokens[1] != null ? tokens[1].col : undefined) === (tok != null ? tok.col : undefined))
            {
                return this.shiftNewline(rule,tokens)
            }
        }
    }

    ParseUtils.prototype["nameMethods"] = function (mthds)
    {
        var m, name, _106_34_, _106_39_, _107_35_, _107_41_

        if ((mthds != null ? mthds.length : undefined))
        {
            var list = _k_.list(mthds)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                m = list[_a_]
                if (name = ((_106_34_=m.keyval) != null ? (_106_39_=_106_34_.key) != null ? _106_39_.text : undefined : undefined))
                {
                    if (((m.keyval.val != null ? m.keyval.val.func : undefined) != null))
                    {
                        m.keyval.val.func.name = {type:'name',text:name,line:m.keyval.key.line,col:m.keyval.key.col}
                    }
                }
            }
        }
        return mthds
    }

    ParseUtils.prototype["then"] = function (id, tokens)
    {
        var block, thn

        if ((tokens[0] != null ? tokens[0].text : undefined) === 'then')
        {
            tokens.shift()
            if (_k_.in((tokens[0] != null ? tokens[0].type : undefined),['block','nl']))
            {
                this.verb('empty then!')
                thn = []
            }
            else
            {
                this.push('then')
                thn = this.exps(id,tokens,'nl')
                this.pop('then')
            }
        }
        else if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            block = tokens.shift()
            this.push('then')
            thn = this.exps(id,block.tokens)
            this.pop('then')
            if (block.tokens.length)
            {
                if (this.debug)
                {
                    print.tokens('then: dangling block tokens',tokens)
                }
                while (block.tokens.length)
                {
                    this.verb('unshift',block.tokens.slice(-1)[0])
                    tokens.unshift(block.tokens.pop())
                }
                if (this.debug)
                {
                    print.tokens('then after unshifting dangling block tokens',tokens)
                }
            }
        }
        else
        {
            this.verb(`no then and no block after ${id}!`)
        }
        return thn
    }

    ParseUtils.prototype["block"] = function (id, tokens)
    {
        var block, exps, nl, origTokens

        if ((tokens[0] != null ? tokens[0].type : undefined) === 'block')
        {
            origTokens = tokens
            block = tokens.shift()
            tokens = block.tokens
            nl = null
        }
        else
        {
            nl = 'nl'
        }
        this.push('▸' + id)
        exps = this.exps(id,tokens,nl)
        this.pop('▸' + id)
        if (block && block.tokens.length)
        {
            if (this.debug)
            {
                print.tokens('dangling block tokens',tokens)
            }
            while (block.tokens.length)
            {
                this.verb('unshift',block.tokens.slice(-1)[0])
                origTokens.unshift(block.tokens.pop())
            }
            if (this.debug)
            {
                print.tokens('block after unshifting dangling block tokens',origTokens)
            }
        }
        return exps
    }

    ParseUtils.prototype["subBlocks"] = function (tokens)
    {
        var elseTokens, subbs, t

        subbs = [[]]
        if (tokens.slice(-1)[0].type === 'block' && tokens.slice(-1)[0].tokens[0].text === 'then')
        {
            elseTokens = tokens.pop().tokens
            elseTokens[0].text = 'else'
        }
        if ((tokens[0] != null ? tokens[0].text : undefined) === 'then')
        {
            tokens[0].text = 'else'
            return [tokens]
        }
        while (!_k_.empty(tokens))
        {
            t = tokens.shift()
            if (t.type === 'nl')
            {
                if (_k_.in((tokens[0] != null ? tokens[0].text : undefined),')}]'))
                {
                    subbs.slice(-1)[0].push(t)
                }
                else
                {
                    subbs.push([])
                    if ((tokens[0] != null ? tokens[0].text : undefined) === 'then')
                    {
                        tokens[0].text = 'else'
                    }
                }
            }
            else
            {
                subbs.slice(-1)[0].push(t)
            }
        }
        if (elseTokens)
        {
            subbs.push(elseTokens)
        }
        return subbs
    }

    ParseUtils.prototype["isSuitableForImplicitCall"] = function (e)
    {
        return (!(_k_.in(e.type,this.kode.literals))) && (!(_k_.in(e.type,['punct','comment','op','section','test','func']))) && (!(_k_.in(e.text,['null','undefined','Infinity','NaN','if','then','else','for','while']))) && !e.array && !e.object && !e.keyval && !e.operation && !e.incond && !e.qmrkop
    }

    ParseUtils.prototype["ifSuitableForInline"] = function (e)
    {
        var ei, _258_24_, _259_24_, _260_24_, _261_24_, _266_26_, _267_26_

        if (e.if)
        {
            if ((e.if.then != null ? e.if.then.length : undefined) > 1)
            {
                return false
            }
            if ((e.if.then != null ? e.if.then[0].if : undefined))
            {
                if (!this.ifSuitableForInline(e.if.then[0]))
                {
                    return false
                }
            }
            if ((e.if.else != null ? e.if.else.length : undefined) > 1)
            {
                return false
            }
            if ((e.if.else != null ? e.if.else[0].if : undefined))
            {
                if (!this.ifSuitableForInline(e.if.else[0]))
                {
                    return false
                }
            }
            var list = _k_.list(e.if.elifs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                ei = list[_a_]
                if (!this.ifSuitableForInline(ei))
                {
                    return false
                }
            }
            return true
        }
        if (e.elif)
        {
            if ((e.elif.then != null ? e.elif.then.length : undefined) > 1)
            {
                return false
            }
            if ((e.elif.then != null ? e.elif.then[0].if : undefined))
            {
                if (!this.ifSuitableForInline(e.elif.then[0]))
                {
                    return false
                }
            }
            return true
        }
        return false
    }

    ParseUtils.prototype["stackAllowsBlockArg"] = function ()
    {
        var s

        s = this.stack.filter(function (s)
        {
            return _k_.in(s,['if','for','while','then','class','function','{',':','switch','when','▸body','try','catch'])
        })
        if (_k_.empty(s))
        {
            return true
        }
        if (_k_.in(s.slice(-1)[0],['then','▸body']))
        {
            return true
        }
        return false
    }

    ParseUtils.prototype["noThenAhead"] = function (tokens)
    {
        var ti

        if ((tokens[1] != null ? tokens[1].type : undefined) === 'block')
        {
            return false
        }
        ti = 0
        while (++ti < tokens.length)
        {
            if (tokens[ti].text === 'then')
            {
                if (tokens[ti].col > tokens[ti - 1].col + tokens[ti - 1].text.length)
                {
                    return false
                }
            }
            if (_k_.in(tokens[ti].type,['nl','block']))
            {
                return true
            }
        }
        return true
    }

    ParseUtils.prototype["funcAhead"] = function (tokens)
    {
        var ti

        ti = -1
        while (++ti < tokens.length)
        {
            if (tokens[ti].type === 'func')
            {
                return true
            }
            if (_k_.in(tokens[ti].text,['(',')']))
            {
                return false
            }
            if (_k_.in(tokens[ti].type,['nl','block']))
            {
                return false
            }
            if (tokens[ti].text === '.')
            {
                if (!_k_.empty(tokens.slice(0, typeof ti === 'number' ? ti : -1).filter(function (t)
                    {
                        return t.text === '='
                    })))
                {
                    continue
                }
                else
                {
                    return false
                }
            }
        }
        return false
    }

    ParseUtils.prototype["checkPostfix"] = function (e, nxt)
    {
        if (e.type !== 'var' && !(e.prop || e.index || e.call))
        {
            this.onError(`${nxt.text} is missing a variable to increment`,{tok:nxt})
        }
        return true
    }

    ParseUtils.prototype["sheapPush"] = function (type, text)
    {
        this.sheap.push({type:type,text:text})
        if (this.debug)
        {
            return print.sheap(this.sheap)
        }
    }

    ParseUtils.prototype["sheapPop"] = function (m, t)
    {
        var popped

        popped = this.sheap.pop()
        if (popped.text !== t && popped.text !== _k_.trim(t,"'"))
        {
            console.error('wrong pop?',popped.text,t)
        }
        if (this.debug)
        {
            return print.sheap(this.sheap,popped)
        }
    }

    ParseUtils.prototype["push"] = function (node)
    {
        if (this.debug)
        {
            print.stack(this.stack,node)
        }
        this.stack.push(node)
        return this.sheapPush('stack',node)
    }

    ParseUtils.prototype["pop"] = function (n)
    {
        var p

        p = this.stack.pop()
        this.sheapPop('stack',p)
        if (p !== n)
        {
            console.error("unexpected pop!",p,n)
        }
        if (this.debug)
        {
            return print.stack(this.stack,p,function (s)
            {
                return _k_.W1(_k_.w1(s))
            })
        }
    }

    ParseUtils.prototype["verb"] = function ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    return ParseUtils
})()

export default ParseUtils;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2V1dGlscy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL3BhcnNldXRpbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVVTLGNBQVQ7Ozs7OzBCQVFJLGdDQUFtQjs7YUFFWixjQUFBLElBQUs7O1lBQ0osT0FDSSxNQUNJLFFBQ0ksUUFDSSxPQUNZLE1BQ0ksT0FDSSxLQUFNLE1BQ1YsTUFDSSxRQUNBLE1BQU87O2FBRzVDLGNBQUEsSUFBSzs7Z0JBQ0QsS0FBQyxvQkFBb0I7O2dCQUNwQixJQUFJLEdBQUcsU0FBUzs7OztnQkFFaEIsT0FDSSxNQUNJLFFBQ0ksUUFDSSxPQUNZLE1BQ0ksT0FDSSxLQUFNLE1BQ1YsTUFDSSxRQUNBLE1BQU87OztlQUVuRDs7OzBCQVVKLHlCQUFZLE1BQUssTUFBSzs7YUFFZixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzttQkFDWCxPQUFPOzthQUVmLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVEsU0FBUyxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROztZQUM5QyxLQUFDLGFBQWEsS0FBTTttQkFDYixPQUFPOztRQUVsQixLQUFDLFdBQVcsMkJBQTJCLFFBQU8sT0FBTztlQUNyRDs7OzBCQVlKLDJCQUFjLE1BQUs7O1lBRVosS0FBQzs7WUFBVyx1Q0FBbUI7O2VBQ2xDLE9BQU87OzswQkFFWCw4QkFBaUIsTUFBSyxRQUFPLEtBQUk7O2FBRTFCLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVEsUUFBUzs7aUJBQ3pCLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQU8sY0FBQSxJQUFLOzt1QkFDdEIsS0FBQyxhQUFhLEtBQU07Ozs7OzBCQVUvQiwwQkFBYTs7OzthQUVOLGdCQUFBLE1BQU87O2dDQUNHOzs7Z0JBQUw7b0JBQ0csa0JBQU8sRUFBRSxxQ0FBUSx3QkFBSzs7MEJBQ2xCLEVBQUUsT0FBTyxjQUFULEVBQUUsT0FBTyxJQUFLOzt3QkFJYixFQUFFLE9BQU8sSUFBSSxLQUFLLFFBQU8sS0FBSyxPQUFP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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/parseutils.kode
