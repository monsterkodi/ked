var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Stripol

import print from "./print.js"


Stripol = (function ()
{
    function Stripol (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
        this.raw = this.kode.args.raw
    }

    Stripol.prototype["onError"] = function (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    Stripol.prototype["collect"] = function (tl)
    {
        this.scope(tl)
        return tl
    }

    Stripol.prototype["scope"] = function (body)
    {
        var e, k

        var list = _k_.list(body.exps)
        for (k = 0; k < list.length; k++)
        {
            e = list[k]
            this.exp(body.exps,k,e)
        }
    }

    Stripol.prototype["exp"] = function (p, k, e)
    {
        var key, v, val

        if (!e)
        {
            return
        }
        if (e.type)
        {
            if (_k_.in(e.type,['double','triple']))
            {
                p[k] = this.string(e)
            }
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (k = 0; k < list.length; k++)
                {
                    v = list[k]
                    this.exp(e,k,v)
                }
            }
        }
        else if (e instanceof Object)
        {
            for (key in e)
            {
                val = e[key]
                if (val)
                {
                    if (val.type)
                    {
                        this.exp(e,key,val)
                    }
                    else
                    {
                        for (k in val)
                        {
                            v = val[k]
                            this.exp(val,k,v)
                        }
                    }
                }
            }
        }
    }

    Stripol.prototype["string"] = function (e)
    {
        var chunks, col, s

        s = e.type === 'triple' ? e.text.slice(3, -3) : e.text.slice(1, -1)
        col = e.col + (e.type === 'triple' ? 3 : 1)
        chunks = this.dissect(s,e.line,col,e.org)
        if (chunks.length > 1)
        {
            if (chunks.slice(-1)[0].type !== 'close')
            {
                chunks.push({type:'close',text:'',line:e.line,col:col + s.length})
            }
            return {stripol:chunks}
        }
        else
        {
            e.text = e.text.replace('#{}','')
        }
        return e
    }

    Stripol.prototype["place"] = function (ast, line, col)
    {
        var a, k, l, v

        if (_k_.isArr(ast))
        {
            var list = _k_.list(ast)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                a = list[_a_]
                this.place(a,line,col)
            }
            return
        }
        if (!(_k_.isObj(ast)))
        {
            return
        }
        if (!_k_.empty(ast.line) && !_k_.empty(ast.type) && !_k_.empty(ast.text))
        {
            l = ast.line
            ast.line = l + line - 1
            if (l === 1)
            {
                ast.col += col
            }
        }
        for (k in ast)
        {
            v = ast[k]
            if (_k_.isArr(v) || _k_.isObj(v))
            {
                this.place(v,line,col)
            }
        }
    }

    Stripol.prototype["dissect"] = function (s, line, col, org = [])
    {
        var b, c, chunks, i, ic, index, k, length, m, matches, push, r, rgs, t

        c = 0
        chunks = []
        push = (function (type, text, at = 0)
        {
            var ast, bc, nl, o, pre, tc, tl

            if (type === 'code')
            {
                if (!_k_.empty(text))
                {
                    ast = this.kode.ast(text)
                    pre = s.slice(0, typeof at === 'number' ? at : -1)
                    nl = pre.split('\n').length - 1
                    bc = nl ? pre.length - pre.lastIndexOf('\n') - 1 : at
                    o = org[nl]
                    if (!_k_.empty(o))
                    {
                        tl = o[0]
                        tc = o[1] + bc
                    }
                    else
                    {
                        tl = line + nl
                        tc = col + bc
                    }
                    this.place(ast.exps,tl,tc)
                    return chunks.push({code:{exps:ast.exps}})
                }
            }
            else
            {
                return chunks.push({type:type,text:text,line:line,col:col + c})
            }
        }).bind(this)
        while (c < s.length)
        {
            t = s.slice(c)
            if (!(m = /(?<!\\)#{/.exec(t)))
            {
                push('close',t)
                break
            }
            push(_k_.empty((chunks)) && 'open' || 'midl',t.slice(0, typeof m.index === 'number' ? m.index : -1))
            c += m.index + 2
            ic = c
            while (c < s.length)
            {
                t = s.slice(c)
                rgs = {triple:/"""(?:.|\n)*?"""/,double:/"(?:\\["\\]|[^\n"])*"/,single:/'(?:\\['\\]|[^\n'])*'/,comment:/[\#]/,open:/[\{]/,close:/[\}]/}
                matches = []
                for (k in rgs)
                {
                    r = rgs[k]
                    m = r.exec(t)
                    if ((m != null))
                    {
                        matches.push([k,m])
                    }
                }
                matches.sort(function (a, b)
                {
                    return a[1].index - b[1].index
                })
                if (_k_.empty(matches))
                {
                    this.onError("unterminated string interpolation",{line:line,col:col + c})
                }
                length = matches[0][1][0].length
                index = matches[0][1].index
                b = ((function ()
                {
                    switch (matches[0][0])
                    {
                        case 'close':
                            push('code',s.slice(ic, c + index),ic)
                            c += index + length
                            return true

                        case 'triple':
                        case 'double':
                        case 'single':
                            c += index + length
                            return false

                        default:
                            if (this.debug)
                        {
                            console.log('unhandled?',matches[0])
                        }
                            c += index + length
                            return true
                    }

                }).bind(this))()
                if (b)
                {
                    break
                }
            }
        }
        for (var _a_ = i = 1, _b_ = chunks.length; (_a_ <= _b_ ? i < chunks.length : i > chunks.length); (_a_ <= _b_ ? ++i : --i))
        {
            if (_k_.empty(chunks))
            {
                break
            }
            if (chunks[i].type === 'close' && chunks[i - 1].type === 'open')
            {
                chunks.splice(i - 1,2)
                i--
            }
        }
        return chunks
    }

    Stripol.prototype["verb"] = function ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    return Stripol
})()

export default Stripol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBvbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL3N0cmlwb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNNLFlBQUE7OztBQUVMLFdBQUQ7O2FBR0ksU0FBSTs7UUFBRDs7UUFFQyxLQUFDLFVBQVUsS0FBQyxLQUFLLEtBQUs7UUFDdEIsS0FBQyxRQUFVLEtBQUMsS0FBSyxLQUFLO1FBQ3RCLEtBQUMsTUFBVSxLQUFDLEtBQUssS0FBSzs7O3VCQUUxQixzQkFBUyxLQUFJOztlQUFRLEtBQUMsS0FBSyxRQUFRLElBQUk7Ozt1QkFFdkMsc0JBQVM7O1FBRUwsS0FBQyxNQUFNO2VBQ1A7Ozt1QkFFSixvQkFBTzs7Ozs0QkFFMkIsS0FBSzthQUFWOztZQUFGO1lBQXZCLEtBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTs7Ozt1QkFFckIsa0JBQUssR0FBRSxHQUFFOzs7O2FBRUk7Ozs7WUFFTixFQUFFOzt1QkFDRSxFQUFFLE1BQVMsU0FBUzs7Z0JBQ25CLEVBQUUsS0FBSyxLQUFDLE9BQU87Ozs7aUJBR2YsYUFBSzs7Z0JBQXNDLEVBQUU7O29DQUFQO3FCQUFMOztvQkFBRjtvQkFBakIsS0FBQyxJQUFJLEVBQUcsRUFBRzs7OztpQkFDekIsYUFBSzs7aUJBRUwsT0FBVzs7Z0JBQVAsTUFBTztvQkFDUjs7d0JBQ0ksSUFBSTs7d0JBQ0gsS0FBQyxJQUFJLEVBQUcsSUFBSzs7Ozs2QkFFSSxLQUFPOzs0QkFBTCxJQUFLOzRCQUF4QixLQUFDLElBQUksSUFBSSxFQUFFOzs7Ozs7Ozt1QkFFL0IscUJBQVE7Ozs7UUFFSixJQUFTLEVBQUUsU0FBUSxXQUFjLEVBQUUsV0FBSyxTQUFhLEVBQUUsV0FBSztRQUM1RCxNQUFNLEVBQUUsT0FBVSxFQUFFLFNBQVEsV0FBYyxJQUFPO1FBRWpELFNBQVMsS0FBQyxRQUFRLEVBQUcsRUFBRSxLQUFNLElBQUssRUFBRTtZQUVqQyxPQUFPLFNBQVM7O2dCQUNaLG9CQUFXLFNBQVE7O2dCQUNsQixPQUFPLE1BQUssS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/stripol.kode
