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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2V1dGlscy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL3BhcnNldXRpbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFNLFlBQUE7OztBQUVHLGNBQVQ7Ozs7OzBCQVFJLGdDQUFtQjs7YUFFWixjQUFBLElBQUs7O1lBQ0osT0FDSSxNQUNJLFFBQ0ksUUFDSSxPQUNZLE1BQ0ksT0FDSSxLQUFNLE1BQ1YsTUFDSSxRQUNBLE1BQU87O2FBRzVDLGNBQUEsSUFBSzs7Z0JBQ0QsS0FBQyxvQkFBb0I7O2dCQUNwQixJQUFJLEdBQUcsU0FBUzs7OztnQkFFaEIsT0FDSSxNQUNJLFFBQ0ksUUFDSSxPQUNZLE1BQ0ksT0FDSSxLQUFNLE1BQ1YsTUFDSSxRQUNBLE1BQU87OztlQUVuRDs7OzBCQVVKLHlCQUFZLE1BQUssTUFBSzs7YUFFZixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROzttQkFDWCxPQUFPOzthQUVmLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVEsU0FBUyxPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFROztZQUM5QyxLQUFDLGFBQWEsS0FBTTttQkFDYixPQUFPOztRQUVsQixLQUFDLFdBQVcsMkJBQTJCLFFBQU8sT0FBTztlQUNyRDs7OzBCQVlKLDJCQUFjLE1BQUs7O1lBRVosS0FBQzs7WUFBVyxZQUFJLE9BQUcsYUFBUyxPQUFHOztlQUNsQyxPQUFPOzs7MEJBRVgsOEJBQWlCLE1BQUssUUFBTyxLQUFJOzthQUUxQixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFFBQVM7O2lCQUN6QixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFPLGNBQUEsSUFBSzs7dUJBQ3RCLEtBQUMsYUFBYSxLQUFNOzs7OzswQkFVL0IsMEJBQWE7Ozs7YUFFTixnQkFBQSxNQUFPOztnQ0FDRzs7O2dCQUFMO29CQUNHLGtCQUFPLEVBQUUscUNBQVEsd0JBQUs7OzBCQUNsQixFQUFFLE9BQU8sY0FBVCxFQUFFLE9BQU8sSUFBSzs7d0JBSWIsRUFBRSxPQUFPLElB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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/parseutils.kode
