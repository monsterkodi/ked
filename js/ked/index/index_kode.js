var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var index_kode, maskStrings, stringOrComment

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash

import index_utils from "./index_utils.js"

stringOrComment = /###[\s\S]*?###|#.*|"""[\s\S]*?"""|"(?:\\.|\#\{[^\}]*}|[^\n\\"])*"|'(?:\\['\\]|[^\n'])*'/g

maskStrings = function (text)
{
    return text.replace(stringOrComment,function (m)
    {
        if (m[0] === '#')
        {
            return m
        }
        return m.replace(/[^\n]/g,' ')
    })
}

index_kode = (function ()
{
    function index_kode ()
    {
        this["base"] = this["base"].bind(this)
    }

    index_kode.prototype["parse"] = function (text)
    {
        var addFuncInfo, async, base, bound, boundIndex, className, code, codeLines, currentClass, firstClass, funcInfo, funcName, funcStack, indent, li, line, lines, m, methodName, result, unbndIndex, word, words, _122_27_

        lines = kstr.lines(text)
        codeLines = kstr.lines(maskStrings(text))
        bound = {}
        result = {classes:[],funcs:[],words:new Set(),lines:lines.length}
        funcStack = []
        currentClass = null
        addFuncInfo = function (funcName, funcInfo)
        {
            if (!funcName)
            {
                return
            }
            if (funcName.length > 1 && funcName.startsWith('@'))
            {
                funcName = funcName.slice(1)
                funcInfo.static = true
            }
            funcInfo.name = funcName
            return funcInfo
        }
        var list = _k_.list(lines)
        for (li = 0; li < list.length; li++)
        {
            line = list[li]
            code = codeLines[li]
            if (_k_.empty(_k_.trim(code)))
            {
                continue
            }
            indent = line.search(/\S/)
            while (funcStack.length && indent <= _k_.last(funcStack)[0])
            {
                _k_.last(funcStack)[1].last = li - 1
                funcInfo = funcStack.pop()[1]
                result.funcs.push(funcInfo)
            }
            if ((currentClass != null))
            {
                if (code.includes('->') || code.includes('=>'))
                {
                    if (methodName = index_utils.methodNameInLine(code))
                    {
                        unbndIndex = code.indexOf('->')
                        boundIndex = code.indexOf('=>')
                        bound = boundIndex > 0 && (unbndIndex < 0 || boundIndex < unbndIndex)
                        async = code.indexOf('◯') >= 0
                        funcInfo = {line:li,name:methodName,method:methodName,class:currentClass,async:async,bound:bound}
                        funcStack.push([indent,funcInfo])
                    }
                }
            }
            else
            {
                if (indent < 2)
                {
                    currentClass = null
                }
                if (funcName = index_utils.funcNameInLine(code))
                {
                    funcInfo = addFuncInfo(funcName,{line:li,async:code.indexOf('◯') >= 0})
                    funcStack.push([indent,funcInfo])
                }
                else if (code.includes('post.on'))
                {
                    if (funcName = index_utils.postNameInLine(line))
                    {
                        funcInfo = addFuncInfo(funcName,{line:li,post:true})
                        funcStack.push([indent,funcInfo])
                    }
                }
                else
                {
                    m = line.match(index_utils.testRegExp)
                    if (((m != null ? m[0] : undefined) != null))
                    {
                        funcInfo = addFuncInfo(m[0],{line:li,test:true})
                        funcStack.push([indent,funcInfo])
                    }
                }
            }
            if (className = index_utils.classNameInLine(code))
            {
                firstClass = (firstClass != null ? firstClass : className)
                currentClass = className
                result.classes.push({name:className,line:li})
                if (base = this.base(code))
                {
                    result.classes.slice(-1)[0].base = base
                }
            }
            words = code.split(index_utils.splitRegExp)
            var list1 = _k_.list(words)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                word = list1[_b_]
                result.words.add(word)
            }
        }
        while (funcStack.length)
        {
            _k_.last(funcStack)[1].last = li - 1
            funcInfo = funcStack.pop()[1]
            funcInfo.class = ((_122_27_=funcInfo.class) != null ? _122_27_ : firstClass)
            result.funcs.push(funcInfo)
        }
        result.words = Array.from(result.words)
        return result
    }

    index_kode.prototype["base"] = function (code)
    {
        var s, splt

        var list = [' extends ','□']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            s = list[_a_]
            splt = code.split(s)
            if (splt.length === 2)
            {
                return _k_.trim(splt[1])
            }
        }
    }

    return index_kode
})()

export default index_kode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfa29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfa29kZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQUs7O09BQ0wsa0JBQUE7O0FBRWhCLGtCQUFrQjs7QUFFbEIsd0JBQWU7O1dBQ1gsS0FBSyxRQUFRLDBCQUFrQjs7WUFDcEIsRUFBRSxPQUFNOzttQkFBYjs7ZUFDRixFQUFFLFFBQVEsU0FBVTs7OztBQUUzQixjQUFEOzthQUVJOzs7OzswQkFFQSxvQkFBTzs7OztRQUVILFFBQVEsS0FBSyxNQUFNO1FBQ25CLFlBQVksS0FBSyxNQUFNLFlBQVk7UUFFbkM7UUFDQSxVQUNJLFdBQ0EsU0FDQSxVQUFhLE1BQ2IsTUFBUyxNQUFNO1FBRW5CO1FBQ0EsZUFBZTtRQUVmLHdCQUFjLFVBQVM7O2lCQUVWOzs7O2dCQUVOLFNBQVMsU0FBUyxLQUFNLFNBQVMsV0FBVzs7Z0JBQzNDLFdBQVcsU0FBUyxNQUFNO2dCQUMxQixTQUFTLFNBQVM7O1lBRXRCLFNBQVMsT0FBTzttQkFDaEI7OzRCQUVXO2FBQU47O1lBQUw7WUFFQSxPQUFPLFVBQVU7bUNBQ007O2dCQUF2Qjs7WUFFQSxTQUFTLEtBQUssT0FBTzttQkFFZixVQUFVLFVBQVcsbUJBQWUsV0FBVzs7eUJBQzVDLFdBQVcsR0FBRyxPQUFPLEtBQUs7Z0JBQy9CLFdBQVcsVUFBVSxNQUFNO2dCQUMzQixPQUFPLE1BQU0sS0FBSzs7aUJBRW5COztvQkFFSSxLQUFLLFNBQVMsU0FBUyxLQUFLLFNBQVM7O3dCQUVqQyxhQUFhLFlBQVksaUJBQWlCOzt3QkFDekMsYUFBYSxLQUFLLFFBQVE7d0JBQzFCLGFBQWEsS0FBSyxRQUFRO3dCQUMxQixRQUFRLGFBQWEsTUFBTyxhQUFhLEtBQUssYUFBYTt3QkFDM0QsUUFBUSxLQUFLLFFBQVEsUUFBTTt3QkFFM0IsWUFDSSxLQUFRLEdBQ1IsS0FBUSxXQUNSLE9BQVEsV0FDUixNQUFRLGFBQ1IsTUFBUSxNQUNSLE1BQVE7d0JBRVosVUFBVSxNQUFNLE9BQU87Ozs7OztvQkFHUixTQUFTOztvQkFBaEMsZUFBZTs7b0JBRVosV0FBVyxZQUFZLGVBQWU7O29CQUNyQyxXQUFXLFlBQVksVUFDbkIsS0FBTSxHQUNOLE1BQU8sS0FBSyxRQUFRLFFBQU07b0JBRTlCLFVBQVUsTUFBTSxPQUFPOzt5QkFFbkIsS0FBSyxTQUFTOzt3QkFFZixXQUFXLFlBQVksZUFBZTs7d0JBQ3JDLFdBQVcsWUFBWSxVQUNuQixLQUFNLEdBQ04sS0FBTTt3QkFFVixVQUFVLE1BQU0sT0FBTzs7Ozs7b0JBRzNCLElBQUksS0FBSyxNQUFNLFlBQVk7MEJBQ3hCLFlBQUEsRUFBRzs7d0JBRUYsV0FBVyxZQUFZLEVBQUUsSUFDckIsS0FBTSxHQUNOLEtBQU07d0JBRVYsVUFBVSxNQUFNLE9BQU87Ozs7Z0JBRWhDLFlBQVksWUFBWSxnQkFBZ0I7O2dCQUV2QyxjQUFBLHFCQUFBLGFBQWU7Z0JBQ2YsZUFBZTtnQkFFZixPQUFPLFFBQVEsTUFDWCxLQUFNLFVBQ04sS0FBTTtvQkFFUCxPQUFPLEtBQUMsS0FBSzs7b0JBQ1osT0FBTyxxQkFBWSxPQUFPOzs7WUFFbEMsUUFBUSxLQUFLLE1BQU0sWUFBWTtpQ0FDbkI7OztnQkFBUjtnQkFDQSxPQUFPLE1BQU0sSUFBSTs7O2VBRW5CLFVBQVU7O3FCQUNQLFdBQVcsR0FBRyxPQUFPLEtBQUs7WUFDL0IsV0FBVyxVQUFVLE1BQU07WUFDM0IsU0FBUyxtQkFBVCxTQUFTLDRCQUFTO1lBQ2xCLE9BQU8sTUFBTSxLQUFLOztRQUV0QixPQUFPLFFBQVEsTUFBTSxLQUFLLE9BQU87ZUFFakM7OzswQkFFSixtQkFBTTs7OztvQkFDUSxZQUFZOzs7WUFBbEI7WUFDQSxPQUFPLEtBQUssTUFBTTtnQkFDZixLQUFLLFdBQVU7O2dDQUNQLEtBQUs7Ozs7O1dBekgzQjs7O2VBMkhNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_kode.kode
