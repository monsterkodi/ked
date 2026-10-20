var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var jsOnly, Patterns

import noon from "../kxk/noon.js"
import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

import util from "../kxk/util.js"
let pullIf = util.pullIf

Patterns = {ws:"[ \\t]+",nl:"[ \\t]*\\r?\\n",comment:"\\#\\#\\#(?:.|\\n)*?\\#\\#\\#|\\#.*",num:"0x[a-fA-F\\d]+|0o[0-7]+|0b[0-1]+|[0-9]+n|[0-9]+\\.[0-9]+|[0-9]+e[-\\+]?[0-9]+|[1-9][0-9]*|0|\\-?Infinity",triple:"\"\"\"(?:.|\\n)*?\"\"\"",double:"\"(?:\\\\.|\\#\\{[^\\}]*}|[^\\n\\\\\"])*\"",single:"'(?:\\\\['\\\\]|[^\\n'])*'",regex:"(?<!\\d\\s*)\\/(?:\\\\[\\/]|\\([^\\n\\s]*\\)|[^\\n\\s\\)])*\\/[gimsuy]*(?!\\s*\\d)",dots:"(?<!\\.)\\.\\.\\.?(?!\\.)",paren:"[\\(\\)\\[\\]\\{\\}]",func:"(○->|○=>|->|=>)",then:"➜",this:"@",test:"(?<!●)▸[\\s\\n]+",profile:"●▸",profilend:"●▪",prof:"●",atest:"○▸",await:"○",assert:"▴",down:"▾",left:"◂",right:"▸",use:"▪",square:"■",diamond:"◆",return:"⮐",op:"(\\band\\b|\\bor\\b|\\bnot\\b|\\*\\*|\\+\\+|--|==|!=|>=|<=|\\+=|-=|\\*=|\\/=|\\|=|\\^=|\\?=|\\&=|%=|<<|>>>|>>|=|\\*|\\/|\\+|-|%|\\^|~|\\&|\\||<|>|\\beql\\b|\\bnew\\b|\\bis\\b|\\binstanceof\\b|\\bdelete\\b|\\bnoon\\b|\\bcopy\\b|\\bclone\\b)",punct:"[,:;!&~\\|\\.\\?\\\\]",bool:"(\\byes\\b|\\bno\\b|\\btrue\\b|\\bfalse\\b)",keyword:["if","then","else","for","each","break","await","return","continue","switch","while","when","is","in","of","class","super","extends","try","catch","throw","finally","function","require","import","export","from","typeof","empty","valid","dbg","log","warn","error","clamp","int","float","floor","ceil","round","first","last","lpad","rpad","trim","ltrim","rtrim","use","min","max","abs"],"var":"[▸a-zA-Z_$][a-zA-Z0-9_$]*"}
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
                    else if (key === 'atest')
                    {
                        if (!(tokens.slice(-2,-1)[0] != null) || tokens.slice(-2,-1)[0].type === 'nl' || tokens.slice(-2,-1)[0].type === 'ws' && (tokens.slice(-3,-2)[0] != null ? tokens.slice(-3,-2)[0].type : undefined) === 'nl')
                        {
                            end = text.indexOf('\n')
                            if (end < 0)
                            {
                                end = text.length
                            }
                            txt = _k_.trim(text.slice(2, typeof end === 'number' ? end : -1))
                            tokens.slice(-1)[0].type = 'section'
                            tokens.slice(-1)[0].text = txt
                            end >= text.length ? text = '' : text = text.slice(end)
                            break
                        }
                        else
                        {
                            tokens.slice(-1)[0].type = 'op'
                            tokens.slice(-1)[0].text = '▸'
                            tokens.slice(-1)[0].async = true
                            col += match[0].length
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9sZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBLFlBQ0ksR0FBSSxVQUNKLEdBQUksaUJBQ0osUUFBUyxzQ0FDVCxJQUFLLDJHQUNMLE9BQVEsMEJBQ1IsT0FBUSw2Q0FDUixPQUFRLDZCQUNSLE1BQU8scUZBQ1AsS0FBTSw0QkFDTixNQUFPLHVCQUNQLEtBQU0sa0JBQ04sS0FBTSxJQUNOLEtBQU0sSUFDTixLQUFNLG1CQUNOLFFBQVMsS0FDVCxVQUFXLEtBQ1gsS0FBTSxJQUNOLE1BQU8sS0FDUCxNQUFPLElBQ1AsT0FBUSxJQUNSLEtBQU0sSUFDTixLQUFNLElBQ04sTUFBTyxJQUNQLElBQUssSUFDTCxPQUFRLElBQ1IsUUFBUyxJQUNULE9BQVEsSUFDUixHQUFJLGtQQUNKLE1BQU8sd0JBQ1AsS0FBTSw4Q0FDTixTQUNJLEtBQ0EsT0FDQSxPQUNBLE1BQ0EsT0FDQSxRQUNBLFFBQ0EsU0FDQSxXQUNBLFNBQ0EsUUFDQSxPQUNBLEtBQ0EsS0FDQSxLQUNBLFFBQ0EsUUFDQSxVQUNBLE1BQ0EsUUFDQSxRQUNBLFVBQ0EsV0FDQSxVQUNBLFNBQ0EsU0FDQSxPQUNBLFNBQ0EsUUFDQSxRQUNBLE1BQ0EsTUFDQSxPQUNBLFFBQ0EsUUFDQSxNQUNBLFFBQ0EsUUFDQSxPQUNBLFFBQ0EsUUFDQSxPQUNBLE9BQ0EsT0FDQSxPQUNBLFFBQ0EsUUFDQSxNQUNBLE1BQ0EsTUFDQSxPQUVKLE1BQU87QUF5QlgsVUFDSSxNQUFRLEtBQ1IsTUFBUSxLQUNSLEtBQVEsTUFDUixLQUFRLEtBQ1IsTUFBUSxHQUNSLE1BQVEsR0FDUixPQUFRLEdBQ1IsTUFBUSxHQUNSLE1BQVEsR0FDUixNQUFRLEdBQ1IsS0FBUTs7Ozs7Ozs7O1FBTUosS0FBQyxRQUFXLEtBQUMsS0FBSyxLQUFLO1FBQ3ZCLEtBQUMsVUFBVyxLQUFDLEtBQUssS0FBSztRQUN2QixLQUFDLE1BQVcsS0FBQyxLQUFLLEtBQUs7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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/lexer.kode
