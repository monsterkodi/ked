var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var index_kode

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash

import index_utils from "./index_utils.js"


index_kode = (function ()
{
    function index_kode ()
    {}

    index_kode.prototype["parse"] = function (text)
    {
        var addFuncInfo, async, bound, boundIndex, className, currentClass, firstClass, funcInfo, funcName, funcStack, indent, li, line, lines, m, methodName, result, unbndIndex, word, words, _140_27_

        lines = kstr.lines(text)
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
            if (_k_.empty(_k_.trim(line)))
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
                if (methodName = index_utils.methodNameInLine(line))
                {
                    unbndIndex = line.indexOf('->')
                    boundIndex = line.indexOf('=>')
                    bound = boundIndex > 0 && (unbndIndex < 0 || boundIndex < unbndIndex)
                    async = line.indexOf('○') >= 0
                    funcInfo = {line:li,name:methodName,class:currentClass,async:async,bound:bound}
                    funcStack.push([indent,funcInfo])
                }
            }
            else
            {
                if (indent < 2)
                {
                    currentClass = null
                }
                if (funcName = index_utils.funcNameInLine(line))
                {
                    funcInfo = addFuncInfo(funcName,{line:li,async:line.indexOf('○') >= 0})
                    funcStack.push([indent,funcInfo])
                }
                else if (funcName = index_utils.postNameInLine(line))
                {
                    funcInfo = addFuncInfo(funcName,{line:li,post:true})
                    funcStack.push([indent,funcInfo])
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
            words = line.split(index_utils.splitRegExp)
            var list1 = _k_.list(words)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                word = list1[_b_]
                result.words.add(word)
                switch (word)
                {
                    case 'class':
                    case 'function':
                        if (className = index_utils.classNameInLine(line))
                        {
                            firstClass = (firstClass != null ? firstClass : className)
                            currentClass = className
                            result.classes.push({name:className,line:li})
                        }
                        break
                }

            }
        }
        while (funcStack.length)
        {
            _k_.last(funcStack)[1].last = li - 1
            funcInfo = funcStack.pop()[1]
            funcInfo.class = ((_140_27_=funcInfo.class) != null ? _140_27_ : firstClass)
            result.funcs.push(funcInfo)
        }
        result.words = Array.from(result.words)
        return result
    }

    return index_kode
})()

export default index_kode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfa29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfa29kZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUVUsVUFBQTtJQUFNO0lBQUs7O09BQ0wsa0JBQUE7OztBQUVQLGNBQVQ7O2FBRUk7OzswQkFRQSxvQkFBTzs7OztRQUVILFFBQVEsS0FBSyxNQUFNO1FBRW5CO1FBQ0EsVUFDSSxXQUNBLFNBQ0EsVUFBYSxNQUNiLE1BQVMsTUFBTTtRQUVuQjtRQUNBLGVBQWU7UUFFZix3QkFBYyxVQUFTOztpQkFFVDs7OztnQkFFUCxTQUFTLFNBQVMsS0FBTSxTQUFTLFdBQVc7O2dCQUMzQyxXQUFXLFNBQVMsTUFBTTtnQkFDMUIsU0FBUyxTQUFTOztZQUV0QixTQUFTLE9BQU87bUJBQ2hCOzs0QkFFVzthQUFOOztZQUFMO21DQUV1Qjs7Z0JBQXZCOztZQUVBLFNBQVMsS0FBSyxPQUFPO21CQUVmLFVBQVUsVUFBVyxtQkFBZSxXQUFXOzt5QkFDNUMsV0FBVyxHQUFHLE9BQU8sS0FBSztnQkFDL0IsV0FBVyxVQUFVLE1BQU07Z0JBQzNCLE9BQU8sTUFBTSxLQUFLOztpQkFFbkI7O29CQVFJLGFBQWEsWUFBWSxpQkFBaUI7O29CQUN6QyxhQUFhLEtBQUssUUFBUTtvQkFDMUIsYUFBYSxLQUFLLFFBQVE7b0JBQzFCLFFBQVEsYUFBYSxNQUFPLGFBQWEsS0FBSyxhQUFhO29CQUMzRCxRQUFRLEtBQUssUUFBUSxRQUFNO29CQUUzQixZQUNJLEtBQVEsR0FDUixLQUFRLFdBQ1IsTUFBUSxhQUNSLE1BQVEsTUFDUixNQUFRO29CQUVaLFVBQVUsTUFBTSxPQUFPOzs7OztvQkFTSixTQUFTOztvQkFBaEMsZUFBZTs7b0JBRVosV0FBVyxZQUFZLGVBQWU7O29CQUNyQyxXQUFXLFlBQVksVUFDbkIsS0FBTSxHQUNOLE1BQU8sS0FBSyxRQUFRLFFBQU07b0JBRTlCLFVBQVUsTUFBTSxPQUFPOzt5QkFFbkIsV0FBVyxZQUFZLGVBQWU7O29CQUMxQyxXQUFXLFlBQVksVUFDbkIsS0FBTSxHQUNOLEtBQU07b0JBRVYsVUFBVSxNQUFNLE9BQU87Ozs7b0JBR3ZCLElBQUksS0FBSyxNQUFNLFlBQVk7MEJBQ3hCLFlBQUEsRUFBRzs7d0JBRUYsV0FBVyxZQUFZLEVBQUUsSUFDckIsS0FBTSxHQUNOLEtBQU07d0JBRVYsVUFBVSxNQUFNLE9BQU87Ozs7WUFFbkMsUUFBUSxLQUFLLE1BQU0sWUFBWTtpQ0FFbkI7OztnQkFBUjtnQkFDQSxPQUFPLE1BQU0sSUFBSTt3QkFDVjs7eUJBUUg7eUJBQVE7NEJBRUQsWUFBWSxZQUFZLGdCQUFnQjs7NEJBRXZDLGNBQUEscUJBQUEsYUFBZTs0QkFDZixlQUFlOzRCQUVmLE9BQU8sUUFBUSxNQUNYLEtBQU0sVUFDTixLQUFNOzs7Ozs7O2VBRXhCLFVBQVU7O3FCQUNQLFdBQVcsR0FBRyxPQUFPLEtBQUs7WUFDL0IsV0FBVyxVQUFVLE1BQU07WUFDM0IsU0FBUyxtQkFBVCxTQUFTLDRCQUFTO1lBQ2xCLE9BQU8sTUFBTSxLQUFLOztRQUV0QixPQUFPLFFBQVEsTUFBTSxLQUFLLE9BQU87ZUFFakM7OztXQXJJQzs7O2VBdUlGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_kode.kode
