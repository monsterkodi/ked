var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b2=_k_.k.F256(_k_.k.b(2));_k_.b3=_k_.k.F256(_k_.k.b(3));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.b7=_k_.k.F256(_k_.k.b(7))

var LineMap, NodeSourceMap, SourceMap

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"
import nfs from "../kxk/nfs.js"

import module from "module"

NodeSourceMap = module.SourceMap

SourceMap = (function ()
{
    function SourceMap (source, name)
    {
        this.source = source
        this.name = name
    
        this.toks = []
        this.lines = []
        this.stripped = 0
        this.verbose = false
    }

    SourceMap.prototype["verb"] = function ()
    {
        if (this.verbose)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    SourceMap.prototype["mark"] = function (s, tok)
    {
        var i

        this.toks.push([s,tok])
        i = this.toks.length - 1
        return s + '\u0001' + i + '\u0001'
    }

    SourceMap.prototype["plain"] = function (s)
    {
        return s.replaceAll(/\u0001\d+\u0001/g,'')
    }

    SourceMap.prototype["strip"] = function (code)
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
                ;[js,tok] = tk
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

    SourceMap.prototype["done"] = function (s)
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

    SourceMap.prototype["add"] = function (source, target, jsstr)
    {
        var column, line, _122_21_

        ;[line,column] = target
        this.lines[line] = ((_122_21_=this.lines[line]) != null ? _122_21_ : new LineMap(line))
        this.lines[line].verbose = this.verbose
        return this.lines[line].add(column,source,jsstr)
    }

    SourceMap.prototype["generate"] = function ()
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

    SourceMap.prototype["jscode"] = function (v3Map)
    {
        var dataURL, encoded, sourceURL

        encoded = this.base64encode(JSON.stringify(v3Map))
        dataURL = `//# sourceMappingURL=data:application/json;base64,${encoded}`
        sourceURL = this.name ? `//# sourceURL=${this.name}` : `//# sourceURL=file://${this.source}`
        return `\n\n${dataURL}\n${sourceURL}\n`
    }

    SourceMap.prototype["decodejs"] = function (encoded)
    {
        return JSON.parse(this.base64decode(encoded))
    }

    SourceMap.prototype["sourcePosition"] = async function (file, line, col = 0)
    {
        var at, entry, map, mark, rg, sm, src, text

        text = await nfs.read(file)
        if (!text)
        {
            return
        }
        mark = 'sourceMappingURL=data:application/json;base64,'
        at = text.lastIndexOf(mark)
        if (at < 0)
        {
            return
        }
        rg = /^[A-Za-z0-9+\/=]*/.exec(text.slice((at + mark.length)))
        if (!rg[0])
        {
            return
        }
        try
        {
            map = this.decodejs(rg[0])
            sm = new NodeSourceMap(map)
            entry = sm.findEntry(line - 1,col)
        }
        catch (err)
        {
            console.error(err)
            return
        }
        if (!entry.originalSource)
        {
            return
        }
        src = slash.absolute(entry.originalSource,slash.dir(file))
        return {file:src,line:entry.originalLine + 1,col:entry.originalColumn}
    }

    SourceMap.prototype["encodeVlq"] = function (value)
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

    SourceMap.prototype["base64decode"] = function (src)
    {
        return Buffer.from(src,'base64').toString()
    }

    SourceMap.prototype["base64encode"] = function (src)
    {
        return Buffer.from(src).toString('base64')
    }

    SourceMap.prototype["encodeBase64"] = function (value)
    {
        var BASE64_CHARS

        BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        return BASE64_CHARS[value]
    }

    return SourceMap
})()


LineMap = (function ()
{
    function LineMap (line)
    {
        this.line = line
    
        this.columns = []
        this.verbose = false
    }

    LineMap.prototype["verb"] = function ()
    {
        if (this.verbose)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    LineMap.prototype["add"] = function (column, srcloc, jsstr)
    {
        var sourceColumn, sourceLine

        ;[sourceLine,sourceColumn] = srcloc
        if (this.columns[column])
        {
            this.verb(`LineMap has column ${column}`,sourceLine,sourceColumn)
            return
        }
        return this.columns[column] = {line:this.line,column:column,sourceLine:sourceLine,sourceColumn:sourceColumn,jsstr:jsstr}
    }

    return LineMap
})()

export default SourceMap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc3JjbWFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxXQUFOO09BQVcsWUFBWDtPQUFpQixVQUFqQjs7T0FDSCxhQUFBOztBQUtKLGdCQUFnQixPQUFPOztBQUV0QixhQUFEOzthQUVJLFdBQUssUUFBUzs7UUFBVjtRQUFTOztRQUVULEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxXQUFXO1FBQ1osS0FBQyxVQUFXOzs7eUJBRWhCOztZQUFZLEtBQUM7O21CQUFhLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSzs7Ozt5QkFJekQsbUJBQU8sR0FBRzs7OztRQUVOLEtBQUMsS0FBSyxNQUFNLEVBQUc7UUFDZixJQUFJLEtBQUMsS0FBSyxTQUFPO2VBQ2pCLElBQUksV0FBVyxJQUFJOzs7eUJBTXZCLG9CQUFROztlQUFNLEVBQUUsV0FBVyxtQkFBb0I7Ozt5QkFLL0Msb0JBQVE7Ozs7c0JBRVk7O21CQUFkOztRQUVGLE1BQU87UUFDUCxLQUFPO1FBQ1AsTUFBTztRQUNQLE1BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTztRQUNQLEtBQU87Z0JBRUEsSUFBSSxHQUFHLEtBQUs7O1lBRWYsUUFBUSxXQUFLLFlBQU0sRUFBRSxxQkFBRixFQUFFO1lBQ3JCLEtBQVEsTUFBTSxZQUFZO2dCQUV2QixNQUFNOztnQkFDTCxNQUFPLE1BQU0sTUFBTSxNQUFNLFNBQVM7Z0JBQ2xDLE1BQU8sTUFBTSxTQUFTLEtBQUs7Ozs7Z0JBRTNCLE9BQU8sTUFBTTs7WUFFakIsT0FBTztZQVNQLEtBQUssS0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFFakI7O2tCQUVFLEdBQUksT0FBTztnQkFDWixLQUFNLE1BQU0sU0FBUyxHQUFHO29CQUVyQixNQUFNOztvQkFFTCxPQUFVLEtBQVEsWUFBTSxVQUFJLGtCQUFBLFdBQVM7b0JBQ3JDLEtBQU8sS0FBSyxZQUFZO29CQUN4QixLQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sU0FBUztv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
//# sourceURL=../../kode/kode/srcmap.kode
