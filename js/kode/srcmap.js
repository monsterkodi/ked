var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b2=_k_.k.F256(_k_.k.b(2));_k_.b3=_k_.k.F256(_k_.k.b(3));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.b7=_k_.k.F256(_k_.k.b(7))

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

class SourceMap
{
    constructor (source, name)
    {
        this.source = source
        this.name = name
    
        this.toks = []
        this.lines = []
        this.stripped = 0
        this.verbose = false
    }

    verb ()
    {
        if (this.verbose)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    mark (s, tok)
    {
        var i

        this.toks.push([s,tok])
        i = this.toks.length - 1
        return s + '\u0001' + i + '\u0001'
    }

    plain (s)
    {
        return s.replaceAll(/\u0001\d+\u0001/g,'')
    }

    strip (code)
    {
        var at, chunk, col, head, js, li, m, nl, out, pos, rg, scol, sli, tc, tk, tl, tok

        if (_k_.empty(code))
        {
            return code
        }
        out = ''
        li = 0
        col = 0
        sli = 0
        scol = 0
        pos = 0
        rg = /\u0001(\d+)\u0001/g
        while ((m = rg.exec(code)))
        {
            chunk = code.slice(pos, typeof m.index === 'number' ? m.index : -1)
            nl = chunk.lastIndexOf('\n')
            if (nl >= 0)
            {
                li += chunk.split('\n').length - 1
                col = chunk.length - nl - 1
            }
            else
            {
                col += chunk.length
            }
            out += chunk
            tk = this.toks[Number(m[1])]
            if (tk)
            {
                var _a_ = tk; js = _a_[0]; tok = _a_[1]

                at = chunk.length - js.length
                if (at >= 0)
                {
                    head = at ? chunk.slice(0, typeof at === 'number' ? at : -1) : ''
                    nl = head.lastIndexOf('\n')
                    tl = sli + head.split('\n').length - 1
                    tc = nl >= 0 ? head.length - nl - 1 : scol + head.length
                    this.add([tok.line - 1,tok.col],[tl,tc],js)
                    this.stripped++
                    this.verb(_k_.b5(li),_k_.b3(col),_k_.r2(tok.line),_k_.b2(tok.col),js)
                }
                else
                {
                    this.verb(_k_.r4(`token ${tok.text} does not fit what was written`))
                }
            }
            else
            {
                this.verb(_k_.r4(`no token for tag ${m[1]}`))
            }
            pos = m.index + m[0].length
            sli = li
            scol = col
        }
        this.verb(_k_.b7('t'),this.stripped,'of',this.toks.length)
        return out + code.slice(pos)
    }

    done (s)
    {
        var c, li, lm, ln, ls

        ls = s.split('\n')
        this.verb(_k_.b5('d'),this.stripped,'of',this.toks.length,'tags in',ls.length,'lines,',this.lines.length,'mapped')
        this.verb(ls)
        for (var _a_ = li = 0, _b_ = ls.length; (_a_ <= _b_ ? li < ls.length : li > ls.length); (_a_ <= _b_ ? ++li : --li))
        {
            ln = ls[li]
            this.verb(`${_k_.b3(kstr.lstrip,li,4)} ${ln}${_k_.r2('◂')}`)
            if (lm = this.lines[li])
            {
                var list = _k_.list(lm.columns)
                for (var _c_ = 0; _c_ < list.length; _c_++)
                {
                    c = list[_c_]
                    if (!c)
                    {
                        continue
                    }
                    this.verb(`${_k_.r4(c.jsstr)} ${c.sourceLine} ${c.sourceColumn}`)
                }
            }
        }
    }

    add (source, target, jsstr)
    {
        var column, line, _123_21_

        var _a_ = target; line = _a_[0]; column = _a_[1]

        this.lines[line] = ((_123_21_=this.lines[line]) != null ? _123_21_ : new LineMap(line))
        this.lines[line].verbose = this.verbose
        return this.lines[line].add(column,source,jsstr)
    }

    generate ()
    {
        var buffer, file, lastColumn, lastSourceColumn, lastSourceLine, lineMap, mapping, needComma, writingline

        writingline = 0
        lastColumn = 0
        lastSourceLine = 0
        lastSourceColumn = 0
        needComma = false
        buffer = ''
        var list = _k_.list(this.lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            lineMap = list[_a_]
            if (!lineMap)
            {
                continue
            }
            var list1 = _k_.list(lineMap.columns)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                mapping = list1[_b_]
                if (!mapping)
                {
                    continue
                }
                while (writingline < mapping.line)
                {
                    lastColumn = 0
                    needComma = false
                    buffer += ";"
                    writingline++
                }
                if (needComma)
                {
                    buffer += ","
                    needComma = false
                }
                buffer += this.encodeVlq(mapping.column - lastColumn)
                lastColumn = mapping.column
                buffer += this.encodeVlq(0)
                buffer += this.encodeVlq(mapping.sourceLine - lastSourceLine)
                lastSourceLine = mapping.sourceLine
                buffer += this.encodeVlq(mapping.sourceColumn - lastSourceColumn)
                lastSourceColumn = mapping.sourceColumn
                needComma = true
            }
        }
        file = slash.file(slash.swapExt(this.source,'js'))
        return {version:3,file:file,sources:[this.name || this.source],mappings:buffer}
    }

    jscode (v3Map)
    {
        var dataURL, encoded, sourceURL

        encoded = this.base64encode(JSON.stringify(v3Map))
        dataURL = `//# sourceMappingURL=data:application/json;base64,${encoded}`
        sourceURL = `//# sourceURL=file://${this.source}`
        return `\n\n${dataURL}\n${sourceURL}\n`
    }

    decodejs (encoded)
    {
        return JSON.parse(this.base64decode,encoded)
    }

    encodeVlq (value)
    {
        var answer, nextChunk, signBit, valueToEncode, VLQ_CONTINUATION_BIT, VLQ_SHIFT, VLQ_VALUE_MASK

        VLQ_SHIFT = 5
        VLQ_CONTINUATION_BIT = 1 << VLQ_SHIFT
        VLQ_VALUE_MASK = VLQ_CONTINUATION_BIT - 1
        signBit = value < 0 ? 1 : 0
        valueToEncode = (Math.abs(value) << 1) + signBit
        answer = ''
        while (valueToEncode || !answer)
        {
            nextChunk = valueToEncode & VLQ_VALUE_MASK
            valueToEncode = valueToEncode >> VLQ_SHIFT
            if (valueToEncode)
            {
                nextChunk |= VLQ_CONTINUATION_BIT
            }
            answer += this.encodeBase64(nextChunk)
        }
        return answer
    }

    base64decode (src)
    {
        return Buffer.from(src,'base64').toString()
    }

    base64encode (src)
    {
        return Buffer.from(src).toString('base64')
    }

    encodeBase64 (value)
    {
        var BASE64_CHARS

        BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        return BASE64_CHARS[value]
    }
}

class LineMap
{
    constructor (line)
    {
        this.line = line
    
        this.columns = []
        this.verbose = false
    }

    verb ()
    {
        if (this.verbose)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    add (column, srcloc, jsstr)
    {
        var sourceColumn, sourceLine

        var _b_ = srcloc; sourceLine = _b_[0]; sourceColumn = _b_[1]

        if (this.columns[column])
        {
            this.verb(`LineMap has column ${column}`,sourceLine,sourceColumn)
            return
        }
        return this.columns[column] = {line:this.line,column:column,sourceLine:sourceLine,sourceColumn:sourceColumn,jsstr:jsstr}
    }
}

export default SourceMap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc3JjbWFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztRQWNRLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxXQUFXO1FBQ1osS0FBQyxVQUFXOzs7OztZQUVKLEtBQUM7O21CQUFhLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSzs7Ozs7Ozs7UUFNckQsS0FBQyxLQUFLLE1BQU0sRUFBRztRQUNmLElBQUksS0FBQyxLQUFLLFNBQU87ZUFDakIsSUFBSSxXQUFXLElBQUk7Ozs7O2VBTVQsRUFBRSxXQUFXLG1CQUFvQjs7Ozs7OztzQkFPM0I7O21CQUFkOztRQUVGLE1BQU87UUFDUCxLQUFPO1FBQ1AsTUFBTztRQUNQLE1BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTztRQUNQLEtBQU87Z0JBRUEsSUFBSSxHQUFHLEtBQUs7O1lBRWYsUUFBUSxXQUFLLFlBQU0sRUFBRSxxQkFBRixFQUFFO1lBQ3JCLEtBQVEsTUFBTSxZQUFZO2dCQUV2QixNQUFNOztnQkFDTCxNQUFPLE1BQU0sTUFBTSxNQUFNLFNBQVM7Z0JBQ2xDLE1BQU8sTUFBTSxTQUFTLEtBQUs7Ozs7Z0JBRTNCLE9BQU8sTUFBTTs7WUFFakIsT0FBTztZQVNQLEtBQUssS0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFFakI7OzBCQUVhOztnQkFDWixLQUFNLE1BQU0sU0FBUyxHQUFHO29CQUVyQixNQUFNOztvQkFFTCxPQUFVLEtBQVEsWUFBTSxVQUFJLGtCQUFBLFdBQVM7b0JBQ3JDLEtBQU8sS0FBSyxZQUFZO29CQUN4QixLQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sU0FBUztvQkFDdkMsS0FBVSxNQUFNLElBQU8sS0FBSyxTQUFTLEtBQUssSUFBTyxPQUFPLEtBQUs7b0JBRTdELEtBQUMsS0FBSyxJQUFJLE9BQUssRUFBRyxJQUFJLE1BQU8sR0FBSSxJQUFLO29CQUN0QyxLQUFDO29CQUVELEtBQUMsWUFBUSxXQUFRLFlBQVMsSUFBSSxh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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/srcmap.kode
