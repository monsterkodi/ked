var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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

        text = this.exTrimLeft(line)
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
        switch (name)
        {
            case 'normal':
            case 'norm':
                args = this.exRemoveOneSpace(args)
                break
            case 'g':
            case 'v':
            case 'global':
            case 'vglobal':
                args = this.exTrimLeft(args)
                break
            default:
                if (args.startsWith(' ') || args.startsWith('\t'))
            {
                args = args.trim()
            }
        }

        return {name:name,bang:bang,args:args,range:range}
    }

    ex["exTrimLeft"] = function (text)
    {
        var i

        i = 0
        while (i < text.length && _k_.in(text[i],' \t'))
        {
            i += 1
        }
        return text.slice(i)
    }

    ex["exRemoveOneSpace"] = function (text)
    {
        if (text.startsWith(' ') || text.startsWith('\t'))
        {
            return text.slice(1)
        }
        return text
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
        var ch, delim, flags, flagsText, p, r, replacement, rt, tokens, _113_48_, _119_48_

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
        replacement = false
        if (p.closed)
        {
            r = this.exScan(args,p.index,delim)
            flagsText = r.text
            if (r.closed)
            {
                replacement = true
                rt = this.exReplacementTokens(r.text,delim)
                if ((rt.error != null))
                {
                    return {error:rt.error}
                }
                tokens = rt.tokens
                flagsText = args.slice(r.index)
            }
            else if (!_k_.empty(r.text) && !this.isSubstituteFlags(r.text))
            {
                replacement = true
                rt = this.exReplacementTokens(r.text,delim)
                if ((rt.error != null))
                {
                    return {error:rt.error}
                }
                tokens = rt.tokens
                flagsText = ''
            }
            var list = _k_.list(flagsText)
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
        return {pattern:p.text,tokens:tokens,flags:flags,hasReplacement:replacement}
    }

    ex["isSubstituteFlags"] = function (text)
    {
        var ch

        if (_k_.empty(text))
        {
            return false
        }
        var list = _k_.list(text)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            if (!(_k_.in(ch,'gic')))
            {
                return false
            }
        }
        return true
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

    ex["parseGlobal"] = function (args)
    {
        var command, delim, p, text

        text = this.exTrimLeft(args)
        if (_k_.empty(text))
        {
            return {error:'argument required'}
        }
        delim = text[0]
        if (delim.length !== 1)
        {
            return {error:'invalid delimiter'}
        }
        if (/[a-zA-Z0-9\s\\|"]/.test(delim))
        {
            return {error:'invalid delimiter'}
        }
        p = this.exScan(text,1,delim)
        if (_k_.empty(p.text))
        {
            return {error:'pattern required'}
        }
        command = ''
        if (p.closed)
        {
            command = this.exTrimLeft(text.slice(p.index))
        }
        if (_k_.empty(command))
        {
            return {error:'command required'}
        }
        return {pattern:p.text,command:command}
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
        var text, token, _299_57_

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
                    text += (((_299_57_=groups[token.index]) != null ? _299_57_ : ''))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9leC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQWEsVUFBQTtJQUFNOzs7QUFFbEIsTUFBRDs7Ozs7SUFFSSxJQUFDLHNCQUFTOzs7O1FBRU4sT0FBUSxLQUFDLFdBQVc7UUFDcEIsUUFBUTtZQUVMLEtBQUssV0FBVzs7WUFDZixTQUFVLEtBQUs7WUFDZixPQUFRLFdBQUs7O2lCQUNULEtBQUssV0FBVzs7WUFDcEIsU0FBVSxLQUFLO1lBQ2YsT0FBUSxXQUFLOztpQkFDVCxRQUFRLEtBQUssTUFBTTs7WUFDdkIsSUFBUSxLQUFDLFFBQVEsTUFBTTtZQUN2QixLQUFRLE1BQU0sS0FBSyxLQUFDLFFBQVEsTUFBTSxNQUFNO1lBQ3hDLFNBQVUsS0FBSyxFQUFFLEdBQUc7WUFDcEIsT0FBUSxNQUFNOztRQUVsQixRQUFRLEtBQUssTUFBTTthQUV3Qjs7b0JBQXZDLE1BQU07O1FBRVYsT0FBTyxNQUFNO1FBQ2IsT0FBTyxNQUFNLE9BQU07UUFDbkIsT0FBTyxNQUFNO2dCQUVOOztpQkFDSDtpQkFBUztnQkFBb0IsT0FBTyxLQUFDLGlCQUFpQjs7aUJBQ3REO2lCQUFJO2lCQUFJO2lCQUFTO2dCQUFZLE9BQU8sS0FBQyxXQUFXOzs7b0JBRXpDLEtBQUssV0FBVyxRQUFRLEtBQUssV0FBVzs7Z0JBQ3ZDLE9BQU8sS0FBSzs7OztnQkFFdEIsS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssTUFBTTs7O0lBRTFDLElBQUMseUJBQVk7Ozs7UUFFVCxJQUFJO2VBQ0UsSUFBSSxLQUFLLGlCQUFXLEtBQUssR0FBTTs7WUFDakMsS0FBSzs7ZUFFVCxXQUFLOzs7SUFFVCxJQUFDLCtCQUFrQjs7WUFFWixLQUFLLFdBQVcsUUFBUSxLQUFLLFdBQVc7O21CQUNyQyxXQUFLOztlQUVYOzs7SUFFSixJQUFDLHNCQUFTOztZQUVTLFNBQVE7O21CQUFyQjs7WUFDYSxTQUFROzttQkFBckI7O2VB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/ex.kode
