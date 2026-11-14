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
        flags = {g:false,i:false,c:false}
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
                        case 'c':
                            flags.c = true
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

    ex["parseSubstitutePattern"] = function (args)
    {
        var delim, scan

        if (_k_.empty(args))
        {
            return null
        }
        delim = args[0]
        if (delim.length !== 1)
        {
            return null
        }
        if (/[a-zA-Z0-9\s\\|"]/.test(delim))
        {
            return null
        }
        scan = this.exScan(args,1,delim)
        return {pattern:scan.text,open:!scan.closed}
    }

    ex["substituteLine"] = function (line, spec)
    {
        var matches

        matches = this.lineMatches(line,spec)
        if (_k_.empty(matches))
        {
            return {line:line,matches:[]}
        }
        return {line:this.joinSubstitution(line,matches,spec.tokens),matches:matches}
    }

    ex["lineMatches"] = function (line, spec, start = 0)
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
        rx.lastIndex = start
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
        return matches
    }

    ex["patternSpans"] = function (lines, pattern, i = false)
    {
        var line, m, spans, spec, y

        if (_k_.empty(pattern))
        {
            return []
        }
        spec = {pattern:pattern,flags:{g:true,i:i}}
        spans = []
        try
        {
            var list = _k_.list(lines)
            for (y = 0; y < list.length; y++)
            {
                line = list[y]
                var list1 = _k_.list(this.lineMatches(kseg.str(line),spec))
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    m = list1[_b_]
                    spans.push([m.x1,y,m.x2])
                }
            }
        }
        catch (err)
        {
            return []
        }
        return spans
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
        var text, token, _240_57_

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
                    text += (((_240_57_=groups[token.index]) != null ? _240_57_ : ''))
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
