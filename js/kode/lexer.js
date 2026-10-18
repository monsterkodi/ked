var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var jsOnly, Patterns

import noon from "../kxk/noon.js"
import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

import util from "../kxk/util.js"
let pullIf = util.pullIf

Patterns = {ws:"[ \\t]+",nl:"[ \\t]*\\r?\\n",comment:"\\#\\#\\#(?:.|\\n)*?\\#\\#\\#|\\#.*",num:"0x[a-fA-F\\d]+|0o[0-7]+|0b[0-1]+|[0-9]+n|[0-9]+\\.[0-9]+|[0-9]+e[-\\+]?[0-9]+|[1-9][0-9]*|0|\\-?Infinity",triple:"\"\"\"(?:.|\\n)*?\"\"\"",double:"\"(?:\\\\.|\\#\\{[^\\}]*}|[^\\n\\\\\"])*\"",single:"'(?:\\\\['\\\\]|[^\\n'])*'",regex:"(?<!\\d\\s*)\\/(?:\\\\[\\/]|\\([^\\n\\s]*\\)|[^\\n\\s\\)])*\\/[gimsuy]*(?!\\s*\\d)",dots:"(?<!\\.)\\.\\.\\.?(?!\\.)",paren:"[\\(\\)\\[\\]\\{\\}]",func:"(○->|○=>|->|=>)",then:"➜",this:"@",test:"(?<!●)▸[\\s\\n]+",profile:"●▸",profilend:"●▪",prof:"●",await:"○",assert:"▴",down:"▾",left:"◂",right:"▸",use:"▪",square:"■",diamond:"◆",return:"⮐",op:"(\\band\\b|\\bor\\b|\\bnot\\b|\\*\\*|\\+\\+|--|==|!=|>=|<=|\\+=|-=|\\*=|\\/=|\\|=|\\^=|\\?=|\\&=|%=|<<|>>>|>>|=|\\*|\\/|\\+|-|%|\\^|~|\\&|\\||<|>|\\beql\\b|\\bnew\\b|\\bis\\b|\\binstanceof\\b|\\bdelete\\b|\\bnoon\\b|\\bcopy\\b|\\bclone\\b)",punct:"[,:;!&~\\|\\.\\?\\\\]",bool:"(\\byes\\b|\\bno\\b|\\btrue\\b|\\bfalse\\b)",keyword:["if","then","else","for","each","break","await","return","continue","switch","while","when","is","in","of","class","super","extends","try","catch","throw","finally","function","require","import","export","from","typeof","empty","valid","dbg","log","warn","error","clamp","int","float","floor","ceil","round","first","last","lpad","rpad","trim","ltrim","rtrim","use","min","max","abs"],"var":"[▸a-zA-Z_$][a-zA-Z0-9_$]*"}
jsOnly = {'===':'==','!==':'!=','&&':'and','||':'or','<<=':'','>>=':'','>>>=':'','&&=':'','||=':'','**=':'','&^':''}
class Lexer
{
    constructor (kode)
    {
        this.kode = kode
    
        var key, pat, reg

        this.debug = this.kode.args.debug
        this.verbose = this.kode.args.verbose
        this.raw = this.kode.args.raw
        this.regs = []
        for (key in Patterns)
        {
            pat = Patterns[key]
            if (typeof(pat) === 'string')
            {
                this.regs.push([key,new RegExp(pat,'y')])
            }
            else if (pat instanceof Array)
            {
                pat = pat.map(function (p)
                {
                    return kstr.escapeRegexp(`${p}`)
                })
                reg = '\\b(' + pat.join('|') + ')\\b'
                this.regs.push([key,new RegExp(reg,'y')])
            }
        }
    }

    onError (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    jsOnlyError (matched, text)
    {
        var alt, op

        for (op in jsOnly)
        {
            alt = jsOnly[op]
            if (text.startsWith(op) && matched !== op)
            {
                if (op === '&^')
                {
                    return '&^ is not a javascript operator'
                }
                if (alt)
                {
                    return `${op} is not a kode operator - ${alt} is`
                }
                return `${op} is not a kode operator`
            }
        }
        return ''
    }

    tokenize (text)
    {
        var after, before, col, end, key, line, lines, linetokens, m, match, ni, reg, si, token, tokens, txt, value

        linetokens = []
        tokens = []
        line = 1
        col = 0
        while (text.length)
        {
            before = text.length
            var list = _k_.list(this.regs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                key = list[_a_][0]
                reg = list[_a_][1]
                reg.lastIndex = 0
                match = text.match(reg)
                if ((match != null ? match.index : undefined) === 0)
                {
                    value = key === 'nl' ? '' : match[0]
                    if (key === 'then')
                    {
                        value = 'then'
                        key = 'keyword'
                    }
                    if (key === 'return')
                    {
                        value = 'return'
                        key = 'keyword'
                    }
                    if (key === 'op')
                    {
                        if (m = this.jsOnlyError(match[0],text))
                        {
                            this.onError(m,{tok:{type:key,text:value,line:line,col:col}})
                        }
                    }
                    if (value === 'then' && (tokens.slice(-2,-1)[0] != null ? tokens.slice(-2,-1)[0].text : undefined) === 'else')
                    {
                    }
                    else
                    {
                        token = {type:key,text:value,line:line,col:col}
                        tokens.push(token)
                        linetokens.push(token)
                    }
                    if (key === 'nl')
                    {
                        col = 0
                        linetokens = []
                        line++
                    }
                    else if (_k_.in(key,['comment','triple']))
                    {
                        lines = value.split('\n')
                        line += lines.length - 1
                        if (lines.length > 1)
                        {
                            col = lines.slice(-1)[0].length
                        }
                        else
                        {
                            col += value.length
                        }
                    }
                    else if (key === 'test')
                    {
                        if (!(tokens.slice(-2,-1)[0] != null) || tokens.slice(-2,-1)[0].type === 'nl' || tokens.slice(-2,-1)[0].type === 'ws' && (tokens.slice(-3,-2)[0] != null ? tokens.slice(-3,-2)[0].type : undefined) === 'nl')
                        {
                            end = text.indexOf('\n')
                            if (end < 0)
                            {
                                end = text.length
                            }
                            txt = _k_.trim(text.slice(1, typeof end === 'number' ? end : -1))
                            tokens.slice(-1)[0].type = 'section'
                            tokens.slice(-1)[0].text = txt
                            end >= text.length ? text = '' : text = text.slice(end)
                            break
                        }
                        else
                        {
                            tokens.slice(-1)[0].type = 'op'
                            tokens.slice(-1)[0].text = _k_.trim(tokens.slice(-1)[0].text,' \n')
                            lines = match[0].split('\n')
                            line += lines.length - 1
                            if (lines.length > 1)
                            {
                                col = lines.slice(-1)[0].length
                            }
                            else
                            {
                                col += match[0].length
                            }
                        }
                    }
                    else if (key.startsWith('prof') && _k_.empty(pullIf(linetokens,function (t)
                        {
                            return t.text !== 'use'
                        })))
                    {
                        ni = text.indexOf('\n')
                        si = text.indexOf(';')
                        if (ni >= 0 && si >= 0)
                        {
                            end = _k_.min(ni,si)
                        }
                        else if (ni >= 0)
                        {
                            end = ni
                        }
                        else if (si >= 0)
                        {
                            end = si
                        }
                        else
                        {
                            end = text.length
                        }
                        txt = _k_.trim(text.slice(tokens.slice(-1)[0].text.length, typeof end === 'number' ? end : -1))
                        tokens.slice(-1)[0].id = txt
                        end >= text.length ? text = '' : text = text.slice(end)
                        break
                    }
                    else
                    {
                        col += match[0].length
                    }
                    text = text.slice(match[0].length)
                    break
                }
            }
            after = text.length
            if (before === after)
            {
                this.onError(`stray character ${text[0]} at column ${col}`,{tok:_k_.last(tokens)})
                return
            }
        }
        return tokens
    }

    tripdent (tokens)
    {
        var i, minind, org, splt, tok

        var list = _k_.list(tokens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            tok = list[_a_]
            if (tok.type !== 'triple')
            {
                continue
            }
            splt = tok.text.slice(3, -3).split('\n')
            if (splt.length < 2)
            {
                continue
            }
            org = [[tok.line,tok.col + 3]]
            for (var _b_ = i = 1, _c_ = splt.length; (_b_ <= _c_ ? i < splt.length : i > splt.length); (_b_ <= _c_ ? ++i : --i))
            {
                org.push([tok.line + i,0])
            }
            if (splt.length === 2)
            {
                if (_k_.empty(_k_.trim(splt[1])))
                {
                    org.pop()
                    tok.text = '"""' + splt[0] + '"""'
                }
                else
                {
                    org[1][1] += kstr.lcnt(splt[1],' ')
                    tok.text = '"""' + splt[0] + '\n' + kstr.lstrip(splt[1]) + '"""'
                }
            }
            else
            {
                if (_k_.trim(splt[0]) === '' && splt.length > 2)
                {
                    splt.shift()
                    org.shift()
                }
                if (_k_.trim(splt.slice(-1)[0]) === '')
                {
                    splt.pop()
                    org.pop()
                }
                if (splt.length === 1)
                {
                    org[0][1] += kstr.lcnt(splt[0],' ')
                    tok.text = '"""' + kstr.lstrip(splt[0]) + '"""'
                }
                else
                {
                    minind = Math.min.apply(0,splt.map(function (s)
                    {
                        if (_k_.empty((_k_.trim(s))))
                        {
                            return Infinity
                        }
                        else
                        {
                            return kstr.lcnt(s,' ')
                        }
                    }))
                    if ((Infinity > minind && minind > 0))
                    {
                        splt = splt.map(function (s)
                        {
                            return s.slice(minind)
                        })
                        org = org.map(function ([l,c])
                        {
                            return [l,c + minind]
                        })
                    }
                    tok.text = '"""' + splt.join('\n') + '"""'
                }
            }
            tok.org = org
        }
        return tokens
    }

    unslash (tokens)
    {
        var idx, newTokens, tok

        newTokens = []
        idx = 0
        while (idx < tokens.length)
        {
            tok = tokens[idx]
            if (tok.text === '\\')
            {
                idx += 1
                while (tokens[idx] && _k_.in(tokens[idx].type,['nl','ws']))
                {
                    idx += 1
                }
            }
            else
            {
                newTokens.push(tok)
                idx += 1
            }
        }
        return newTokens
    }

    mergeop (tokens)
    {
        var idx, newTokens, tok

        newTokens = []
        idx = 0
        while (idx < tokens.length)
        {
            tok = tokens[idx]
            if (tok.type === 'op' && !(_k_.in(tok.text,['--','++','=','clone','copy','delete','new','is','instanceof','noon','last','first'])))
            {
                newTokens.push(tok)
                idx += 1
                while (_k_.in((tokens[idx] != null ? tokens[idx].type : undefined),['nl','ws']))
                {
                    idx += 1
                }
            }
            else
            {
                newTokens.push(tok)
                idx += 1
            }
        }
        return newTokens
    }

    uncomment (tokens)
    {
        var idx, newTokens, tok

        newTokens = []
        idx = 0
        while (idx < tokens.length)
        {
            tok = tokens[idx]
            if (tok.type === 'comment')
            {
                idx += 1
                continue
            }
            newTokens.push(tok)
            idx += 1
        }
        return newTokens
    }

    blockify (tokens)
    {
        var block, blocks, idx, nxt, outdentTo, tok

        tokens = this.tripdent(tokens)
        tokens = this.unslash(tokens)
        tokens = this.uncomment(tokens)
        tokens = this.mergeop(tokens)
        blocks = []
        block = {type:'block',tokens:[],indent:'',line:1,col:0}
        blocks.push(block)
        outdentTo = function (depth, line)
        {
            while (depth < block.indent.length)
            {
                blocks.pop()
                block = blocks.slice(-1)[0]
            }
        }
        for (var _a_ = idx = 0, _b_ = tokens.length; (_a_ <= _b_ ? idx < tokens.length : idx > tokens.length); (_a_ <= _b_ ? ++idx : --idx))
        {
            tok = tokens[idx]
            if (tok.type === 'nl')
            {
                nxt = tokens[idx + 1]
                if (_k_.in((nxt != null ? nxt.type : undefined),['nl']))
                {
                    continue
                }
                if ((nxt != null ? nxt.type : undefined) === 'ws')
                {
                    if ((tokens[idx + 2] != null ? tokens[idx + 2].type : undefined) === 'nl' || idx + 1 >= tokens.length - 1)
                    {
                        continue
                    }
                    if (nxt.text.length > block.indent.length)
                    {
                        block = {type:'block',tokens:[],line:nxt.line,indent:nxt.text,col:nxt.text.length}
                        blocks.slice(-1)[0].tokens.push(block)
                        blocks.push(block)
                        continue
                    }
                    else if (nxt.text.length < block.indent.length)
                    {
                        outdentTo(nxt.text.length,nxt.line)
                    }
                }
                else if (nxt)
                {
                    if (block.indent.length)
                    {
                        outdentTo(0,nxt.line)
                    }
                }
            }
            else if (tok.type === 'ws')
            {
                continue
            }
            block.tokens.push(tok)
        }
        return blocks[0]
    }
}

Lexer.Patterns = Patterns
export default Lexer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9sZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBLFlBQ0ksR0FBSSxVQUNKLEdBQUksaUJBQ0osUUFBUyxzQ0FDVCxJQUFLLDJHQUNMLE9BQVEsMEJBQ1IsT0FBUSw2Q0FDUixPQUFRLDZCQUNSLE1BQU8scUZBQ1AsS0FBTSw0QkFDTixNQUFPLHVCQUNQLEtBQU0sa0JBQ04sS0FBTSxJQUNOLEtBQU0sSUFDTixLQUFNLG1CQUNOLFFBQVMsS0FDVCxVQUFXLEtBQ1gsS0FBTSxJQUNOLE1BQU8sSUFDUCxPQUFRLElBQ1IsS0FBTSxJQUNOLEtBQU0sSUFDTixNQUFPLElBQ1AsSUFBSyxJQUNMLE9BQVEsSUFDUixRQUFTLElBQ1QsT0FBUSxJQUNSLEdBQUksa1BBQ0osTUFBTyx3QkFDUCxLQUFNLDhDQUNOLFNBQ0ksS0FDQSxPQUNBLE9BQ0EsTUFDQSxPQUNBLFFBQ0EsUUFDQSxTQUNBLFdBQ0EsU0FDQSxRQUNBLE9BQ0EsS0FDQSxLQUNBLEtBQ0EsUUFDQSxRQUNBLFVBQ0EsTUFDQSxRQUNBLFFBQ0EsVUFDQSxXQUNBLFVBQ0EsU0FDQSxTQUNBLE9BQ0EsU0FDQSxRQUNBLFFBQ0EsTUFDQSxNQUNBLE9BQ0EsUUFDQSxRQUNBLE1BQ0EsUUFDQSxRQUNBLE9BQ0EsUUFDQSxRQUNBLE9BQ0EsT0FDQSxPQUNBLE9BQ0EsUUFDQSxRQUNBLE1BQ0EsTUFDQSxNQUNBLE9BRUosTUFBTztBQXlCWCxVQUNJLE1BQVEsS0FDUixNQUFRLEtBQ1IsS0FBUSxNQUNSLEtBQVEsS0FDUixNQUFRLEdBQ1IsTUFBUSxHQUNSLE9BQVEsR0FDUixNQUFRLEdBQ1IsTUFBUSxHQUNSLE1BQVEsR0FDUixLQUFROzs7Ozs7Ozs7UUFNSixLQUFDLFFBQVcsS0FBQyxLQUFLLEtBQUs7UUFDdkIsS0FBQyxVQUFXLEtBQUMsS0FBSyxLQUFLO1FBQ3ZCLEtBQUMsTUFBVyxLQUFDLEtBQUssS0FBSztRQUN2QixLQUFD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
//# sourceURL=file://kode/kode/lexer.kode
