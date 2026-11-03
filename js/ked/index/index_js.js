var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

class index_js
{
    constructor ()
    {
        this.classPtn = this.tokenize('class ●name',false)
        this.funcClassPtn = this.tokenize('●name = (function ()',false)
        this.classMethodPtns = [[this.tokenize('●name ○args'),{}],[this.tokenize('async ●name ○args'),{async:true}],[this.tokenize('static ●name ○args'),{static:true}],[this.tokenize('static async ●name ○args'),{static:true,async:true}]]
        this.classBoundPtn = this.tokenize('this.●name = this.●bound.bind(this)')
        this.funcBoundPtn = this.tokenize('this["●name"] = this["●bound"].bind(this)')
        this.topPtns = [[this.tokenize('●name = function ○args'),{}],[this.tokenize('●name = async function ○args'),{async:true}]]
        this.funcClassName = null
        this.funcClassPtns = null
    }

    splitWords (words, splitBy)
    {
        var idx, out, part, parts, word

        out = []
        var list = _k_.list(words)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            word = list[_a_]
            parts = word.split(splitBy)
            var list1 = _k_.list(parts)
            for (idx = 0; idx < list1.length; idx++)
            {
                part = list1[idx]
                out.push(part)
                if (idx < parts.length - 1)
                {
                    out.push(splitBy)
                }
            }
        }
        return out
    }

    tokenize (line, doSplit = true)
    {
        var splitBy, tokens

        tokens = _k_.trim(line).split(/\s+/)
        if (doSplit)
        {
            var list = ['"','.',',',"'"]
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                splitBy = list[_a_]
                tokens = this.splitWords(tokens,splitBy)
            }
        }
        return tokens
    }

    matchTokens (tokens, ptn)
    {
        var ci, cp, rslt, si, strongMatch, varName, weakMatch

        if (_k_.empty(tokens))
        {
            return
        }
        strongMatch = false
        weakMatch = false
        varName = null
        ci = 0
        si = 0
        rslt = {}
        while (ci < ptn.length)
        {
            cp = ptn[ci]
            if (cp === tokens[si])
            {
                strongMatch = true
                varName = null
                si++
                ci++
                continue
            }
            if (_k_.in((cp != null ? cp[0] : undefined),'●○'))
            {
                weakMatch = true
                varName = cp.slice(1)
                switch (cp[0])
                {
                    case '●':
                        rslt[varName] = tokens[si]
                        si++
                        ci++
                        continue
                        break
                    case '○':
                        if (ci === ptn.length - 1)
                        {
                            rslt[varName] = tokens.slice(si).join(' ')
                            return rslt
                        }
                        else
                        {
                            if (ptn[ci + 1] === tokens[si])
                            {
                                weakMatch = false
                                ci += 1
                                continue
                            }
                        }
                        break
                }

            }
            if (weakMatch && varName)
            {
                if (!_k_.empty(rslt[varName]))
                {
                    rslt[varName] += ' ' + tokens[si]
                }
                else
                {
                    rslt[varName] = tokens[si]
                }
                if (si < tokens.length - 1)
                {
                    si++
                    continue
                }
                else
                {
                    break
                }
            }
            return
        }
        if (ci < ptn.length)
        {
            return
        }
        if (ci === ptn.length && varName && si < tokens.length)
        {
            rslt[varName] += ' ' + tokens.slice(si).join(' ')
        }
        if (strongMatch || weakMatch)
        {
            return rslt
        }
    }

    validFuncName (name)
    {
        return !(_k_.in(name,['if','for','while','switch','return','catch']))
    }

    validFuncArgs (args)
    {
        return args[0] === '(' && args.slice(-1)[0] === ')'
    }

    validFuncMatch (match)
    {
        return match && this.validFuncArgs(match.args) && this.validFuncName(match.name)
    }

    funcClassPatterns (className)
    {
        if (this.funcClassName !== className)
        {
            this.funcClassName = className
            this.funcClassPtns = [[this.tokenize(`function ${className} ○args`),{name:className}],[this.tokenize(`${className}["●name"] = function ○args`),{static:true}],[this.tokenize(`${className}["●name"] = async function ○args`),{static:true,async:true}],[this.tokenize(`${className}.prototype["●name"] = function ○args`),{}],[this.tokenize(`${className}.prototype["●name"] = async function ○args`),{async:true}]]
        }
        return this.funcClassPtns
    }

    parseLine (index, line)
    {
        var className, classType, fnc, match, name, opt, ptn, ptns, t, tokens, top, _170_44_

        t = _k_.trim(line)
        if (_k_.empty(t))
        {
            return
        }
        top = !line.startsWith(' ')
        tokens = null
        if (top)
        {
            if (match = this.matchTokens(t.split(/\s+/),this.classPtn))
            {
                match.type = 'class'
                match.line = index
                this.result.classes.push(match)
                return
            }
            if (match = this.matchTokens(t.split(/\s+/),this.funcClassPtn))
            {
                match.type = 'function'
                match.line = index
                this.result.classes.push(match)
                return
            }
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            classType = this.result.classes.slice(-1)[0].type
            if ((t.includes('(') && t.endsWith(')')) || t.includes('.bind(this)'))
            {
                tokens = (tokens != null ? tokens : this.tokenize(t))
                ptns = (classType === 'class' ? this.classMethodPtns : this.funcClassPatterns(className))
                var list = _k_.list(ptns)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    ptn = list[_a_][0]
                    opt = list[_a_][1]
                    if (match = this.matchTokens(tokens,ptn))
                    {
                        if (this.validFuncMatch(match))
                        {
                            name = ((_170_44_=opt.name) != null ? _170_44_ : match.name)
                            fnc = {method:name,line:index,class:className}
                            if (opt.static)
                            {
                                fnc.static = true
                            }
                            if (opt.async)
                            {
                                fnc.async = true
                            }
                            if (this.bound[name] && name !== 'constructor')
                            {
                                fnc.bound = true
                            }
                            this.result.funcs.push(fnc)
                            return
                        }
                    }
                }
                if (match = this.matchTokens(tokens,(classType === 'class' ? this.classBoundPtn : this.funcBoundPtn)))
                {
                    this.bound[match.name] = true
                }
            }
        }
        if (top && t.includes('function') && t.endsWith(')'))
        {
            tokens = (tokens != null ? tokens : this.tokenize(t))
            var list1 = _k_.list(this.topPtns)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                ptn = list1[_b_][0]
                opt = list1[_b_][1]
                if (match = this.matchTokens(tokens,ptn))
                {
                    if (this.validFuncMatch(match))
                    {
                        fnc = {name:match.name,line:index}
                        if (opt.async)
                        {
                            fnc.async = true
                        }
                        this.result.funcs.push(fnc)
                        return
                    }
                }
            }
        }
    }

    parse (text)
    {
        var lineIndex, lines, lineText

        lines = text.split('\n')
        this.bound = {}
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (lineIndex = 0; lineIndex < list.length; lineIndex++)
        {
            lineText = list[lineIndex]
            this.parseLine(lineIndex,lineText)
        }
        return this.result
    }
}

export default index_js;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7O0FBQ0EsTUFBTTs7SUFFRjs7UUFFSSxLQUFDLFdBQWUsS0FBQyxTQUFTLGNBQWM7UUFDeEMsS0FBQyxlQUFlLEtBQUMsU0FBUyx1QkFBdUI7UUFFakQsS0FBQyxvQkFDSSxLQUFDLFNBQVMsb0JBQ1YsS0FBQyxTQUFTLHNCQUE4QixNQUFNLFFBQzlDLEtBQUMsU0FBUyx1QkFBOEIsT0FBTyxRQUMvQyxLQUFDLFNBQVMsNkJBQThCLE9BQU8sS0FBSyxNQUFNO1FBRy9ELEtBQUMsZ0JBQWdCLEtBQUMsU0FBUztRQUMzQixLQUFDLGVBQWdCLEtBQUMsU0FBUztRQUUzQixLQUFDLFlBQ0ksS0FBQyxTQUFTLCtCQUNWLEtBQUMsU0FBUyxpQ0FBa0MsTUFBTTtRQUd2RCxLQUFDLGdCQUFnQjtRQUNqQixLQUFDLGdCQUFnQjs7O0lBRXJCLFlBQWEsT0FBTTs7OztRQUVmOzRCQUVZOzs7WUFBUjtZQUNBLFFBQVEsS0FBSyxNQUFNO2lDQUNIO2lCQUFQOztnQkFBTDtnQkFDQSxJQUFJLEtBQUs7b0JBQ1csTUFBTSxNQUFNLFNBQU87O29CQUF2QyxJQUFJLEtBQUs7Ozs7ZUFFakI7OztJQUVKLFVBQVcsTUFBSyxVQUFROzs7O1FBRXBCLGtCQUFjLE1BQU0sTUFBTTtZQUV2Qjs7d0JBQ2lCLElBQUksSUFBSSxJQUFJOzs7Z0JBQXhCO2dCQUNBLFNBQVMsS0FBQyxXQUFXLE9BQU87OztlQUVwQzs7O0lBRUosYUFBYyxRQUFPOzs7O3NCQUVMOzs7O1FBRVosY0FBYztRQUNkLFlBQVk7UUFDWixVQUFVO1FBRVYsS0FBSztRQUNMLEtBQUs7UUFDTDtlQUVNLEtBQUssSUFBSTs7WUFFWCxLQUFLLElBQUk7Z0JBRU4sT0FBTSxPQUFPOztnQkFDWixjQUFjO2dCQUNkLFVBQVU7Z0JBQ1Y7Z0JBQ0E7Z0JBQ0E7O3dCQUVELGFBQUEsR0FBSSxnQkFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_js.kode
