var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var ex

import kxk from "../../../kxk.js"
let kseg = kxk.kseg


ex = (function ()
{
    function ex ()
    {}

    ex["parseEx"] = function (line)
    {
        var a, args, b, bang, match, name, range, text

        text = line.trim()
        range = null
        if (text.startsWith("'<,'>"))
        {
            range = {kind:'visual'}
            text = text.slice(5)
        }
        else if (text.startsWith('%'))
        {
            range = {kind:'all'}
            text = text.slice(1)
        }
        else if (match = text.match(/^([0-9]+|\.|\$)(?:,([0-9]+|\.|\$))?(.*)$/))
        {
            a = this.exBound(match[1])
            b = (match[2] ? this.exBound(match[2]) : a)
            range = {from:a,to:b}
            text = match[3]
        }
        match = text.match(/^([a-zA-Z]+)(!?)(.*)$/)
        if (!match)
        {
            return {error:'not an editor command'}
        }
        name = match[1]
        bang = match[2] === '!'
        args = match[3]
        if (args.startsWith(' ') || args.startsWith('\t'))
        {
            args = args.trim()
        }
        return {name:name,bang:bang,args:args,range:range}
    }

    ex["exBound"] = function (text)
    {
        if (text === '.')
        {
            return 'current'
        }
        if (text === '$')
        {
            return 'last'
        }
        return parseInt(text)
    }

    ex["exScan"] = function (text, start, delim)
    {
        var ch, closed, i, nxt, scanned

        scanned = ''
        closed = false
        i = start
        while (i < text.length)
        {
            ch = text[i]
            if (ch === '\\' && i + 1 < text.length)
            {
                nxt = text[i + 1]
                if (nxt === delim)
                {
                    scanned += delim
                }
                else
                {
                    scanned += '\\' + nxt
                }
                i += 2
            }
            else if (ch === delim)
            {
                closed = true
                i += 1
                break
            }
            else
            {
                scanned += ch
                i += 1
            }
        }
        return {text:scanned,closed:closed,index:i}
    }

    ex["parseSubstitute"] = function (args)
    {
        var ch, delim, flags, flagsText, p, r, rt, tokens, _90_44_

        if (_k_.empty(args))
        {
            return {error:'argument required'}
        }
        delim = args[0]
        if (delim.length !== 1)
        {
            return {error:'invalid delimiter'}
        }
        if (/[a-zA-Z0-9\s\\|"]/.test(delim))
        {
            return {error:'invalid delimiter'}
        }
        p = this.exScan(args,1,delim)
        if (_k_.empty(p.text))
        {
            return {error:'no previous pattern'}
        }
        tokens = []
        flags = {g:false,i:false}
        if (p.closed)
        {
            r = this.exScan(args,p.index,delim)
            rt = this.exReplacementTokens(r.text,delim)
            if ((rt.error != null))
            {
                return {error:rt.error}
            }
            tokens = rt.tokens
            if (r.closed)
            {
                var list = _k_.list(args.slice(r.index))
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    ch = list[_a_]
                    switch (ch)
                    {
                        case 'g':
                            flags.g = true
                            break
                        case 'i':
                            flags.i = true
                            break
                        default:
                            return {error:`unknown flag: ${ch}`}
                    }

                }
            }
        }
        flagsText = 'g'
        if (flags.i)
        {
            flagsText += 'i'
        }
        try
        {
            new RegExp(p.text,flagsText)
        }
        catch (err)
        {
            return {error:`invalid pattern: ${err.message}`}
        }
        return {pattern:p.text,tokens:tokens,flags:flags}
    }

    ex["exReplacementTokens"] = function (text, delim)
    {
        var addLiteral, ch, i, nxt, tokens

        tokens = []
        i = 0
        addLiteral = function (t)
        {
            if (!_k_.empty(tokens) && tokens.slice(-1)[0].kind === 'literal')
            {
                return tokens.slice(-1)[0].text += t
            }
            else
            {
                return tokens.push({kind:'literal',text:t})
            }
        }
        while (i < text.length)
        {
            ch = text[i]
            if (ch === '&')
            {
                tokens.push({kind:'whole'})
                i += 1
            }
            else if (ch === '\\' && i + 1 < text.length)
            {
                nxt = text[i + 1]
                if (_k_.in(nxt,'0123456789'))
                {
                    tokens.push({kind:'group',index:parseInt(nxt)})
                }
                else if (nxt === '\\')
                {
                    addLiteral('\\')
                }
                else if (nxt === '&')
                {
                    addLiteral('&')
                }
                else if (nxt === 't')
                {
                    addLiteral('\t')
                }
                else if (_k_.in(nxt,'nr'))
                {
                    return {error:'multi-line replacement not supported'}
                }
                else if (nxt === delim)
                {
                    addLiteral(delim)
                }
                else
                {
                    addLiteral(nxt)
                }
                i += 2
            }
            else
            {
                addLiteral(ch)
                i += 1
            }
        }
        return {tokens:tokens}
    }

    ex["substituteLine"] = function (line, spec)
    {
        var flagsText, limit, m, matches, rx

        flagsText = 'g'
        if (spec.flags.i)
        {
            flagsText += 'i'
        }
        rx = new RegExp(spec.pattern,flagsText)
        matches = []
        limit = (spec.flags.g ? Infinity : 1)
        while (matches.length < limit)
        {
            m = rx.exec(line)
            if (!m)
            {
                break
            }
            matches.push({index:m.index,length:m[0].length,text:m[0],groups:m,x1:kseg.width(kseg(line.slice(0, typeof m.index === 'number' ? m.index : -1))),x2:kseg.width(kseg(line.slice(0, m.index + m[0].length)))})
            if (m[0].length === 0)
            {
                rx.lastIndex = m.index + 1
            }
        }
        if (_k_.empty(matches))
        {
            return {line:line,matches:[]}
        }
        return {line:this.joinSubstitution(line,matches,spec.tokens),matches:matches}
    }

    ex["joinSubstitution"] = function (line, matches, tokens)
    {
        var last, m, out

        out = ''
        last = 0
        var list = _k_.list(matches)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            out += line.slice(last, typeof m.index === 'number' ? m.index : -1)
            out += this.exExpandReplacement(tokens,m.groups)
            last = m.index + m.length
        }
        out += line.slice(last)
        return out
    }

    ex["exExpandReplacement"] = function (tokens, groups)
    {
        var text, token, _202_57_

        text = ''
        var list = _k_.list(tokens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            token = list[_a_]
            switch (token.kind)
            {
                case 'whole':
                    text += groups[0]
                    break
                case 'group':
                    text += (((_202_57_=groups[token.index]) != null ? _202_57_ : ''))
                    break
                case 'literal':
                    text += token.text
                    break
            }

        }
        return text
    }

    return ex
})()

export default ex;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9leC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQWEsVUFBQTtJQUFNOzs7QUFFbEIsTUFBRDs7Ozs7SUFFSSxJQUFDLHNCQUFTOzs7O1FBRU4sT0FBUSxLQUFLO1FBQ2IsUUFBUTtZQUVMLEtBQUssV0FBVzs7WUFDZixTQUFVLEtBQUs7WUFDZixPQUFRLFdBQUs7O2lCQUNULEtBQUssV0FBVzs7WUFDcEIsU0FBVSxLQUFLO1lBQ2YsT0FBUSxXQUFLOztpQkFDVCxRQUFRLEtBQUssTUFBTTs7WUFDdkIsSUFBUSxLQUFDLFFBQVEsTUFBTTtZQUN2QixLQUFRLE1BQU0sS0FBSyxLQUFDLFFBQVEsTUFBTSxNQUFNO1lBQ3hDLFNBQVUsS0FBSyxFQUFFLEdBQUc7WUFDcEIsT0FBUSxNQUFNOztRQUVsQixRQUFRLEtBQUssTUFBTTthQUV3Qjs7b0JBQXZDLE1BQU07O1FBRVYsT0FBTyxNQUFNO1FBQ2IsT0FBTyxNQUFNLE9BQU07UUFDbkIsT0FBTyxNQUFNO1lBRVYsS0FBSyxXQUFXLFFBQVEsS0FBSyxXQUFXOztZQUN2QyxPQUFPLEtBQUs7O2dCQUVkLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU07OztJQUUxQyxJQUFDLHNCQUFTOztZQUVTLFNBQVE7O21CQUFyQjs7WUFDYSxTQUFROzttQkFBckI7O2VBQ0YsU0FBUzs7O0lBRWIsSUFBQyxxQkFBUSxNQUFLLE9BQU07Ozs7UUFFaEIsVUFBVTtRQUNWLFNBQVU7UUFDVixJQUFVO2VBRUosSUFBSSxLQUFLOztZQUVYLEtBQUssS0FBSztnQkFFUCxPQUFNLFFBQVMsSUFBRSxJQUFJLEtBQUs7O2dCQUN6QixNQUFNLEtBQUssSUFBRTtvQkFDVixRQUFPOztvQkFDTixXQUFXOzs7O29CQUVYLFdBQVcsT0FBTzs7Z0JBQ3RCLEtBQUs7O3FCQUNELE9BQU07O2dCQUNWLFNBQVM7Z0JBQ1QsS0FBSztnQkFDTDs7OztnQkFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/ex.kode
