var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b2=_k_.k.F256(_k_.k.b(2));_k_.b3=_k_.k.F256(_k_.k.b(3));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.b7=_k_.k.F256(_k_.k.b(7))

var TAG

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

TAG = '\u0001'
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
        return s + TAG + i + TAG
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
        var column, line, _149_21_

        var _a_ = target; line = _a_[0]; column = _a_[1]

        this.lines[line] = ((_149_21_=this.lines[line]) != null ? _149_21_ : new LineMap(line))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc3JjbWFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUEwQkEsTUFBTTs7Ozs7Ozs7UUFNRSxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUMsV0FBVztRQUNaLEtBQUMsVUFBVzs7Ozs7WUFLSixLQUFDOzttQkFBYSxRQUFRLElBQUksTUFBTSxRQUFRLElBQUs7Ozs7Ozs7O1FBTXJELEtBQUMsS0FBSyxNQUFNLEVBQUc7UUFDZixJQUFJLEtBQUMsS0FBSyxTQUFPO2VBQ2pCLElBQUksTUFBTSxJQUFJOzs7OztlQU9KLEVBQUUsV0FBVyxtQkFBb0I7Ozs7Ozs7c0JBUTNCOzttQkFBZDs7UUFFRixNQUFPO1FBQ1AsS0FBTztRQUNQLE1BQU87UUFDUCxNQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU87UUFDUCxLQUFPO2dCQUVBLElBQUksR0FBRyxLQUFLOztZQUVmLFFBQVEsV0FBSyxZQUFNLEVBQUUscUJBQUYsRUFBRTtZQUNyQixLQUFRLE1BQU0sWUFBWTtnQkFFdkIsTUFBTTs7Z0JBQ0wsTUFBTyxNQUFNLE1BQU0sTUFBTSxTQUFTO2dCQUNsQyxNQUFPLE1BQU0sU0FBUyxLQUFLOzs7O2dCQUUzQixPQUFPLE1BQU07O1lBRWpCLE9BQU87WUFTUCxLQUFLLEtBQUMsS0FBSyxPQUFPLEVBQUU7Z0JBRWpCOzswQkFFYTs7Z0JBQ1osS0FBTSxNQUFNLFNBQVMsR0FBRztvQkFFckIsTUFBTTs7b0JBRUwsT0FBVSxLQUFRLFlBQU0sVUFBSSxrQkFBQSxXQUFTO29CQUNyQyxLQUFPLEtBQUssWUFBWTtvQkFDeEIsS0FBTyxNQUFNLEtBQUssTUFBTSxNQUFNLFNBQVM7b0JBQ3ZDLEtBQVUsTUFBTSxJQUFPLEtBQUssU0FBUyxLQUFLLElBQU8sT0FBTyxLQUFLO29CQUU3RCxLQUFDLEtBQUssSUFBSSxPQUFLLEVBQUcsSUFBSSxNQUFPLEdBQUksSUFBSztvQkFDdEMsS0FBQztvQkFFRCxLQUFDLFlBQVEsV0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/srcmap.kode
