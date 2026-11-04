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

        var _a_ = target; line = _a_[0]; column = _a_[1]

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
        sourceURL = `//# sourceURL=file://${this.source}`
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

        var _b_ = srcloc; sourceLine = _b_[0]; sourceColumn = _b_[1]

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjbWFwLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc3JjbWFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxXQUFOO09BQVcsWUFBWDtPQUFpQixVQUFqQjs7T0FDSCxhQUFBOztBQUtKLGdCQUFnQixPQUFPOztBQUV0QixhQUFEOzthQUVJLFdBQUssUUFBUzs7UUFBVjtRQUFTOztRQUVULEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxXQUFXO1FBQ1osS0FBQyxVQUFXOzs7eUJBRWhCOztZQUFZLEtBQUM7O21CQUFhLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSzs7Ozt5QkFJekQsbUJBQU8sR0FBRzs7OztRQUVOLEtBQUMsS0FBSyxNQUFNLEVBQUc7UUFDZixJQUFJLEtBQUMsS0FBSyxTQUFPO2VBQ2pCLElBQUksV0FBVyxJQUFJOzs7eUJBTXZCLG9CQUFROztlQUFNLEVBQUUsV0FBVyxtQkFBb0I7Ozt5QkFLL0Msb0JBQVE7Ozs7c0JBRVk7O21CQUFkOztRQUVGLE1BQU87UUFDUCxLQUFPO1FBQ1AsTUFBTztRQUNQLE1BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTztRQUNQLEtBQU87Z0JBRUEsSUFBSSxHQUFHLEtBQUs7O1lBRWYsUUFBUSxXQUFLLFlBQU0sRUFBRSxxQkFBRixFQUFFO1lBQ3JCLEtBQVEsTUFBTSxZQUFZO2dCQUV2QixNQUFNOztnQkFDTCxNQUFPLE1BQU0sTUFBTSxNQUFNLFNBQVM7Z0JBQ2xDLE1BQU8sTUFBTSxTQUFTLEtBQUs7Ozs7Z0JBRTNCLE9BQU8sTUFBTTs7WUFFakIsT0FBTztZQVNQLEtBQUssS0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFFakI7OzBCQUVhLElBQVgsYUFBSTs7Z0JBQ0wsS0FBTSxNQUFNLFNBQVMsR0FBRztvQkFFckIsTUFBTTs7b0JBRUwsT0FBVSxLQUFRLFlBQU0sVUFBSSxrQkFBQSxXQUFTO29CQUNyQyxLQUFPLEtBQUssWUFBWTtvQkFDeEIsS0FBTyxNQUFNLEtBQUssTUFBTSxNQUFNLFNBQVM7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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/srcmap.kode
