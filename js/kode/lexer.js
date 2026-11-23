var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var jsOnly, Lexer, Patterns

import noon from "../kxk/noon.js"
import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

import util from "../kxk/util.js"
let pullIf = util.pullIf

Patterns = {ws:"[ \\t]+",nl:"[ \\t]*\\r?\\n",comment:"\\#\\#\\#(?:.|\\n)*?\\#\\#\\#|\\#.*",num:"0x[a-fA-F\\d]+|0o[0-7]+|0b[0-1]+|[0-9]+n|[0-9]+\\.[0-9]+|[0-9]+e[-\\+]?[0-9]+|[1-9][0-9]*|0|\\-?Infinity",triple:"\"\"\"(?:.|\\n)*?\"\"\"",double:"\"(?:\\\\.|\\#\\{[^\\}]*}|[^\\n\\\\\"])*\"",single:"'(?:\\\\['\\\\]|[^\\n'])*'",regex:"(?<!\\d\\s*)\\/(?:\\\\[\\/]|\\([^\\n\\s]*\\)|[^\\n\\s\\)])*\\/[gimsuy]*(?!\\s*\\d)",dots:"(?<!\\.)\\.\\.\\.?(?!\\.)",spread:"…",paren:"[\\(\\)\\[\\]\\{\\}]",func:"(◯->|◯=>|->|=>)",then:"➜",this:"@",test:"(?<!●)▸[\\s\\n]+",profile:"●▸",profilend:"●▪",prof:"●",atest:"◯▸",await:"◯",assert:"▴",down:"▾",left:"◂",right:"▸",use:"▪",extends:"□",function:"■",diamond:"◆",return:"⮐",op:"(\\band\\b|\\bor\\b|\\bnot\\b|\\*\\*|\\+\\+|--|==|!=|>=|<=|\\+=|-=|\\*=|\\/=|\\|=|\\^=|\\?=|\\&=|%=|<<|>>>|>>|=|\\*|\\/|\\+|-|%|\\^|~|\\&|\\||<|>|\\beql\\b|\\bnew\\b|\\bis\\b|\\binstanceof\\b|\\bdelete\\b|\\bnoon\\b|\\bcopy\\b|\\bclone\\b)",punct:"[,:;!&~\\|\\.\\?\\\\]",bool:"(\\byes\\b|\\bno\\b|\\btrue\\b|\\bfalse\\b)",keyword:["if","then","else","for","each","break","await","return","continue","switch","while","when","is","in","of","class","super","extends","try","catch","throw","finally","function","require","import","export","from","typeof","empty","valid","dbg","log","warn","error","clamp","int","float","floor","ceil","round","first","last","lpad","rpad","trim","ltrim","rtrim","use","min","max","abs"],"var":"[▸a-zA-Z_$][a-zA-Z0-9_$]*"}
jsOnly = {'===':'==','!==':'!=','&&':'and','||':'or','<<=':'','>>=':'','>>>=':'','&&=':'','||=':'','**=':'','&^':''}

Lexer = (function ()
{
    function Lexer (kode)
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

    Lexer.prototype["onError"] = function (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    Lexer.prototype["jsOnlyError"] = function (matched, text)
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

    Lexer.prototype["tokenize"] = function (text)
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
                    if (key === 'function')
                    {
                        value = 'function'
                        key = 'keyword'
                    }
                    if (key === 'extends')
                    {
                        value = 'extends'
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

    Lexer.prototype["tripdent"] = function (tokens)
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
            for (i = 1; i < splt.length; i++)
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
                    minind = Math.min(...splt.map(function (s)
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

    Lexer.prototype["unslash"] = function (tokens)
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

    Lexer.prototype["mergeop"] = function (tokens)
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

    Lexer.prototype["uncomment"] = function (tokens)
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

    Lexer.prototype["blockify"] = function (tokens)
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
        for (idx = 0; idx < tokens.length; idx++)
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

    return Lexer
})()

Lexer.Patterns = Patterns
export default Lexer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9sZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsV0FBTjtPQUFXLFdBQVg7T0FBZ0IsWUFBaEI7O09BQ0ssV0FBQTtJQUFNOztBQUVsQixZQUNJLEdBQUksVUFDSixHQUFJLGlCQUNKLFFBQVMsc0NBQ1QsSUFBSywyR0FDTCxPQUFRLDBCQUNSLE9BQVEsNkNBQ1IsT0FBUSw2QkFDUixNQUFPLHFGQUNQLEtBQU0sNEJBQ04sT0FBUSxJQUNSLE1BQU8sdUJBQ1AsS0FBTSxrQkFDTixLQUFNLElBQ04sS0FBTSxJQUNOLEtBQU0sbUJBQ04sUUFBUyxLQUNULFVBQVcsS0FDWCxLQUFNLElBQ04sTUFBTyxLQUNQLE1BQU8sSUFDUCxPQUFRLElBQ1IsS0FBTSxJQUNOLEtBQU0sSUFDTixNQUFPLElBQ1AsSUFBSyxJQUNMLFFBQVMsSUFDVCxTQUFVLElBQ1YsUUFBUyxJQUNULE9BQVEsSUFDUixHQUFJLGtQQUNKLE1BQU8sd0JBQ1AsS0FBTSw4Q0FDTixTQUNJLEtBQ0EsT0FDQSxPQUNBLE1BQ0EsT0FDQSxRQUNBLFFBQ0EsU0FDQSxXQUNBLFNBQ0EsUUFDQSxPQUNBLEtBQ0EsS0FDQSxLQUNBLFFBQ0EsUUFDQSxVQUNBLE1BQ0EsUUFDQSxRQUNBLFVBQ0EsV0FDQSxVQUNBLFNBQ0EsU0FDQSxPQUNBLFNBQ0EsUUFDQSxRQUNBLE1BQ0EsTUFDQSxPQUNBLFFBQ0EsUUFDQSxNQUNBLFFBQ0EsUUFDQSxPQUNBLFFBQ0EsUUFDQSxPQUNBLE9BQ0EsT0FDQSxPQUNBLFFBQ0EsUUFDQSxNQUNBLE1BQ0EsTUFDQSxPQUVKLE1BQU87QUFFWCxVQUNJLE1BQVEsS0FDUixNQUFRLEtBQ1IsS0FBUSxNQUNSLEtBQVEsS0FDUixNQUFRLEdBQ1IsTUFBUSxHQUNSLE9BQVEsR0FDUixNQUFRLEdBQ1IsTUFBUSxHQUNSLE1BQVEsR0FDUixLQUFROztBQUVYLFNBQUQ7O2FBRUksT0FBSTs7UUFBRDs7OztRQUVDLEtB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
//# sourceURL=../../kode/kode/lexer.kode
