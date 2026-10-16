var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import print from "./print.js"

class Stripol
{
    constructor (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
        this.raw = this.kode.args.raw
    }

    onError (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    collect (tl)
    {
        this.scope(tl)
        return tl
    }

    scope (body)
    {
        var e, k

        var list = _k_.list(body.exps)
        for (k = 0; k < list.length; k++)
        {
            e = list[k]
            this.exp(body.exps,k,e)
        }
    }

    exp (p, k, e)
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

    string (e)
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

    place (ast, line, col)
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

    dissect (s, line, col, org = [])
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
                            console.log('unhandled?',matches[0])
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

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }
}

export default Stripol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBvbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL3N0cmlwb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQWdCUSxLQUFDLFVBQVUsS0FBQyxLQUFLLEtBQUs7UUFDdEIsS0FBQyxRQUFVLEtBQUMsS0FBSyxLQUFLO1FBQ3RCLEtBQUMsTUFBVSxLQUFDLEtBQUssS0FBSzs7Ozs7ZUFFTCxLQUFDLEtBQUssUUFBUSxJQUFJOzs7OztRQVVuQyxLQUFDLE1BQU07ZUFDUDs7Ozs7Ozs0QkFVOEIsS0FBSzs7OztZQUFuQyxLQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7Ozs7Ozs7O2FBVVI7Ozs7WUFFTixFQUFFOzt1QkFDRSxFQUFFLE1BQVMsU0FBUzs7Z0JBQ25CLEVBQUUsS0FBSyxLQUFDLE9BQU87Ozs7aUJBR2YsYUFBSzs7Z0JBQXNDLEVBQUU7O29DQUFQOzs7O29CQUF4QixLQUFDLElBQUksRUFBRyxFQUFHOzs7O2lCQUN6QixhQUFLOzt3QkFFTTs7c0JBQUE7b0JBQ1I7O3dCQUNJLElBQUk7O3dCQUNILEtBQUMsSUFBSSxFQUFHLElBQUs7Ozs7a0NBRVc7O2dDQUFBOzRCQUF4QixLQUFDLElBQUksSUFBSSxFQUFFOzs7Ozs7Ozs7Ozs7UUFpQjNCLElBQVMsRUFBRSxTQUFRLFdBQWMsRUFBRSxXQUFLLFNBQWEsRUFBRSxXQUFLO1FBQzVELE1BQU0sRUFBRSxPQUFVLEVBQUUsU0FBUSxXQUFjLElBQU87UUFFakQsU0FBUyxLQUFDLFFBQVEsRUFBRyxFQUFFLEtBQU0sSUFBSyxFQUFFO1lBRWpDLE9BQU8sU0FBUzs7Z0JBQ1osb0JBQVcsU0FBUTs7Z0JBQ2xCLE9BQU8sTUFBSyxLQUFLLFFBQVEsS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFNLElBQUksTUFBSSxFQUFFOztvQkFFMUQsUUFBUTs7OztZQUVWLEVBQUUsT0FBTyxFQUFFLEtBQUssUUFBUSxNQUFNOztlQUNsQzs7Ozs7OztzQkFlRzs7Z0NBQ1U7Ozs7Z0JBQU0sS0FBQyxNQUFNLEVBQUcsS0FBTTs7Ozt3QkFHNUI7Ozs7dUJBRUUsSUFBSSxvQkFBZSxJQUFJLG9CQUFlLElBQUk7O1lBQy9DLElBQUksSUFBSTtZQUNSLElBQUksT0FBTyxJQUFJLE9BQU87Z0JBQ0osTUFBSzs7Z0JBQXZCLElBQUksT0FBTzs7O2tCQUVKOztnQkFBQTswQkFDZ0IsZ0JBQVk7O2dCQUFuQyxLQUFDLE1BQU0sRUFBRyxLQUFNOzs7Ozs7Ozs7UUFVcEIsSUFBSTtRQUFHO1FBRVA7Ozs7Z0JBQ08sU0FBUTs7K0JBQ0U7O29CQUNMLE1BQU0sS0FBQyxLQUFLLElBQUk7b0JBS2hCLE1BQU0sa0JBQUssa0JBQUE7b0JBQ1gsS0FBTSxJQUFJLE1BQU0sTUFBTSxTQUFTO29CQUMvQixLQUFTLEtBQVEsSUFBSSxTQUFTLElBQUksWUFBWSxRQUFRLElBQU87b0JBSzdELElBQUksSUFBSTttQ0FFQzs7d0JBQ0wsS0FBSyxFQUFFO3dCQUNQLEtBQUssRUFBRSxLQUFLOzs7O3dCQUVaLEtBQUssT0FBTzt3QkFDWixLQUFLLE1BQU07O29CQUVmLEtBQUMsTUFBTSxJQUFJLEtBQU0sR0FBSTsyQkFFckIsT0FBTyxNQUFLLE1BQU0sS0FBSyxJQUFJOzs7Ozt1QkFFL0IsT0FBTyxNQUFLLEtBQUssS0FBTSxLQUFLLEtBQU0sS0FBSyxLQUFNLElBQUksTUFBSTs7O2VBRXZELElBQUksRUFBRTs7WUFFUixJQUFJLFFBQUU7a0JBRUMsSUFBSSxZQUFZLEtBQUs7O2dCQUN4QixLQUFLLFFBQVE7Z0JBQ2I7O1lBRUosZ0JBQVcsWUFBWSxVQUFVLE9BQVEsa0JBQUssRUFBRSxxQkFBRixFQUFFO1lBRWhELEtBQUssRUFBRSxRQUFNO1lBQ2IsS0FBSzttQkFFQyxJQUFJLEVBQUU7O2dCQUVSLElBQUksUUFBRTtnQkFFTixPQUNJLE9BQVMsbUJBQ1QsT0FBUyx3QkFDVCxPQUFTLHdCQUNULFFBQVMsT0FDVCxLQUFTLE9BQ1QsTUFBUztnQkFFYjswQkFDVzs7d0JBQUE7b0JBQ1AsSUFBSSxFQUFFLEtBQUs7eUJBQ1I7O3dCQUFRLFFBQVEsTUFBTSxFQUFHOzs7Z0JBRWhDLFFBQVE7OzJCQUFjLEVBQUUsR0FBRyxRQUFRLEVBQUUsR0FBRzs7OEJBSy9COztvQkFDTCxLQUFDLFFBQVEscUNBQW9DLEtBQUssS0FBSyxJQUFJLE1BQUk7O2dCQUVuRSxTQUFTLFFBQVEsR0FBRyxHQUFHLEdBQUc7Z0JBQzFCLFFBQVMsUUFBUSxHQUFHLEdBQUc7Z0JBRXZCOzs0QkFBVyxRQUFRLEdBQUc7OzZCQUNiOzRCQUNELEtBQUssT0FBTyxRQUFFLElBQUssSUFBRSxPQUFROzRCQUM3QixLQUFLLFFBQU07bUNBQ1g7OzZCQUNDOzZCQUFTOzZCQUFTOzRCQUNuQixLQUFLLFFBQU07bUNBQ1g7Ozs0QkFFQSxZQUFJLGFBQWEsUUFBUTs0QkFDekIsS0FBSyxRQUFNO21DQUNYOzs7O29CQUNDOztvQkFBVDs7OzsyQkFFQyxTQUFJLE9BQU8sMEJBQVAsT0FBTyxhQUFQLE9BQU87OzBCQUNEOztnQkFBZjs7Z0JBQ0csT0FBTyxHQUFHLFNBQVEsV0FBWSxPQUFPLElBQUUsR0FBRyxTQUFROztnQkFDakQsT0FBTyxPQUFPLElBQUUsRUFBRTtnQkFDbEI7OztlQUVSOzs7OztZQUVRLEtBQUM7O21CQUFRLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSTs7Ozs7ZUFFaEQifQ==
//# sourceURL=file://kode/kode/stripol.kode
