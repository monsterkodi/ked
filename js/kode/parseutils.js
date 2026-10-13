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
                        m.keyval.val.func.name = {type:'name',text:name}
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
        var ei, _255_24_, _256_24_, _257_24_, _258_24_, _263_26_, _264_26_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2V1dGlscy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL3BhcnNldXRpbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7YUFvQlcsY0FBQSxJQUFLOztZQUNKLE9BQ0ksTUFDSSxRQUNJLFFBQ0ksT0FDWSxNQUNJLE9BQ0ksS0FBTSxNQUNWLE1BQ0ksUUFDQSxNQUFPOzthQUc1QyxjQUFBLElBQUs7O2dCQUNELEtBQUMsb0JBQW9COztnQkFDcEIsSUFBSSxHQUFHLFNBQVM7Ozs7Z0JBRWhCLE9BQ0ksTUFDSSxRQUNJLFFBQ0ksT0FDWSxNQUNJLE9BQ0ksS0FBTSxNQUNWLE1BQ0ksUUFDQSxNQUFPOzs7ZUFFbkQ7Ozs7O2FBWUcsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7bUJBQ1gsT0FBTzs7YUFFZixPQUFPLGFBQVAsT0FBTyxHQUFJLHNCQUFRLFNBQVMsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUTs7WUFDOUMsS0FBQyxhQUFhLEtBQU07bUJBQ2IsT0FBTzs7UUFFbEIsS0FBQyxXQUFXLDJCQUEyQixRQUFPLE9BQU87ZUFDckQ7Ozs7O1lBY0csS0FBQzs7WUFBVyx1Q0FBbUI7O2VBQ2xDLE9BQU87Ozs7O2FBSUosT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBUSxRQUFTOztpQkFDekIsT0FBTyxhQUFQLE9BQU8sR0FBSSxzQkFBTyxjQUFBLElBQUs7O3VCQUN0QixLQUFDLGFBQWEsS0FBTTs7Ozs7Ozs7O2FBWXhCLGdCQUFBLE1BQU87O2dDQUNHOzs7O29CQUNGLGtCQUFPLEVBQUUscUNBQVEsd0JBQUs7OzBCQUNsQixFQUFFLE9BQU8sY0FBVCxFQUFFLE9BQU8sSUFBSzs7d0JBQ2IsRUFBRSxPQUFPLElBQUksS0FBSyxRQUFPLEtBQUssT0FBTyxLQUFLOzs7OztlQUMxRDs7Ozs7OzthQWFHLE9BQU8sYUFBUCxPQUFPLEdBQUksc0JBQVE7O1lBRWxCLE9BQU87d0JBQ0osT0FBTyxhQUFQLE9BQU8sR0FBSSxtQkFBUyxRQUFR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
//# sourceURL=kode/kode/parseutils.kode
