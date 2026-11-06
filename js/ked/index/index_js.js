var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var index_js


index_js = (function ()
{
    function index_js ()
    {
        this.classPtn = this.tokenize('class ●name',false)
        this.funcClassPtn = this.tokenize('●name = (function ()',false)
        this.classMethodPtns = [[this.tokenize('●name ◯args'),{}],[this.tokenize('async ●name ◯args'),{async:true}],[this.tokenize('static ●name ◯args'),{static:true}],[this.tokenize('static async ●name ◯args'),{static:true,async:true}]]
        this.classBoundPtn = this.tokenize('this.●name = this.●bound.bind(this)')
        this.funcBoundPtn = this.tokenize('this["●name"] = this["●bound"].bind(this)')
        this.topPtns = [[this.tokenize('●name = function ◯args'),{}],[this.tokenize('●name = async function ◯args'),{async:true}]]
        this.funcClassName = null
        this.funcClassPtns = null
    }

    index_js.prototype["splitWords"] = function (words, splitBy)
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

    index_js.prototype["tokenize"] = function (line, doSplit = true)
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

    index_js.prototype["matchTokens"] = function (tokens, ptn)
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
            if (_k_.in((cp != null ? cp[0] : undefined),'●◯'))
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
                    case '◯':
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

    index_js.prototype["validFuncName"] = function (name)
    {
        return !(_k_.in(name,['if','for','while','switch','return','catch']))
    }

    index_js.prototype["validFuncArgs"] = function (args)
    {
        return args[0] === '(' && args.slice(-1)[0] === ')'
    }

    index_js.prototype["validFuncMatch"] = function (match)
    {
        return match && this.validFuncArgs(match.args) && this.validFuncName(match.name)
    }

    index_js.prototype["funcClassPatterns"] = function (className)
    {
        if (this.funcClassName !== className)
        {
            this.funcClassName = className
            this.funcClassPtns = [[this.tokenize(`function ${className} ◯args`),{name:className}],[this.tokenize(`${className}["●name"] = function ◯args`),{static:true}],[this.tokenize(`${className}["●name"] = async function ◯args`),{static:true,async:true}],[this.tokenize(`${className}.prototype["●name"] = function ◯args`),{}],[this.tokenize(`${className}.prototype["●name"] = async function ◯args`),{async:true}]]
        }
        return this.funcClassPtns
    }

    index_js.prototype["parseLine"] = function (index, line)
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

    index_js.prototype["parse"] = function (text)
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

    return index_js
})()

export default index_js;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0MsWUFBRDs7YUFFSTs7UUFFSSxLQUFDLFdBQWUsS0FBQyxTQUFTLGNBQWM7UUFDeEMsS0FBQyxlQUFlLEtBQUMsU0FBUyx1QkFBdUI7UUFFakQsS0FBQyxvQkFDSSxLQUFDLFNBQVMsb0JBQ1YsS0FBQyxTQUFTLHNCQUE4QixNQUFNLFFBQzlDLEtBQUMsU0FBUyx1QkFBOEIsT0FBTyxRQUMvQyxLQUFDLFNBQVMsNkJBQThCLE9BQU8sS0FBSyxNQUFNO1FBRy9ELEtBQUMsZ0JBQWdCLEtBQUMsU0FBUztRQUMzQixLQUFDLGVBQWdCLEtBQUMsU0FBUztRQUUzQixLQUFDLFlBQ0ksS0FBQyxTQUFTLCtCQUNWLEtBQUMsU0FBUyxpQ0FBa0MsTUFBTTtRQUd2RCxLQUFDLGdCQUFnQjtRQUNqQixLQUFDLGdCQUFnQjs7O3dCQUVyQix5QkFBYSxPQUFNOzs7O1FBRWY7NEJBRVk7OztZQUFSO1lBQ0EsUUFBUSxLQUFLLE1BQU07aUNBQ0g7aUJBQVA7O2dCQUFMO2dCQUNBLElBQUksS0FBSztvQkFDVyxNQUFNLE1BQU0sU0FBTzs7b0JBQXZDLElBQUksS0FBSzs7OztlQUVqQjs7O3dCQUVKLHVCQUFXLE1BQUssVUFBUTs7OztRQUVwQixrQkFBYyxNQUFNLE1BQU07WUFFdkI7O3dCQUNpQixJQUFJLElBQUksSUFBSTs7O2dCQUF4QjtnQkFDQSxTQUFTLEtBQUMsV0FBVyxPQUFPOzs7ZUFFcEM7Ozt3QkFFSiwwQkFBYyxRQUFPOzs7O3NCQUVOOzs7O1FBRVgsY0FBYztRQUNkLFlBQVk7UUFDWixVQUFVO1FBRVYsS0FBSztRQUNMLEtBQUs7UUFDTDtlQUVNLEtBQUssSUFBSTs7WUFFWCxLQUFLLElBQUk7Z0JBRU4sT0FBTSxPQUFPOztnQkFDWixjQUFjO2dCQUNkLFVBQVU7Z0JBQ1Y7Z0JBQ0E7Z0JBQ0E7O3dCQUVELGFBQUEs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_js.kode
