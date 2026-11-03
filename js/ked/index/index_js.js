var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var SPLITS

SPLITS = ['"','.',',',"'"]
class index_js
{
    constructor ()
    {
        this.classPtn = this.tokenize('class ●name',[])
        this.funcClassPtn = this.tokenize('●name = (function ()',[])
        this.classMethodPtns = [[this.tokenize('●name ○args',SPLITS),{}],[this.tokenize('async ●name ○args',SPLITS),{async:true}],[this.tokenize('static ●name ○args',SPLITS),{static:true}],[this.tokenize('static async ●name ○args',SPLITS),{static:true,async:true}]]
        this.classBoundPtn = this.tokenize('this.●name = this.●bound.bind(this)',SPLITS)
        this.funcBoundPtn = this.tokenize(`this["●name"] = this["●bound"].bind(this)`,SPLITS)
        this.topPtns = [[this.tokenize('●name = function ○args',SPLITS),{}],[this.tokenize('●name = async function ○args',SPLITS),{async:true}]]
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

    tokenize (line, splits)
    {
        var splitBy, tokens

        tokens = _k_.trim(line).split(/\s+/)
        var list = _k_.list(splits)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            splitBy = list[_a_]
            tokens = this.splitWords(tokens,splitBy)
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
            this.funcClassPtns = [[this.tokenize(`function ${className} ○args`,SPLITS),{name:className}],[this.tokenize(`${className}["●name"] = function ○args`,SPLITS),{static:true}],[this.tokenize(`${className}["●name"] = async function ○args`,SPLITS),{static:true,async:true}],[this.tokenize(`${className}.prototype["●name"] = function ○args`,SPLITS),{}],[this.tokenize(`${className}.prototype["●name"] = async function ○args`,SPLITS),{async:true}]]
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
                tokens = (tokens != null ? tokens : this.tokenize(t,SPLITS))
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
            tokens = (tokens != null ? tokens : this.tokenize(t,SPLITS))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxVQUFVLElBQUksSUFBSSxJQUFJO0FBRXRCLE1BQU07O0lBRUY7O1FBRUksS0FBQyxXQUFlLEtBQUMsU0FBUztRQUMxQixLQUFDLGVBQWUsS0FBQyxTQUFTO1FBRTFCLEtBQUMsb0JBQ0ksS0FBQyxTQUFTLGNBQWMsYUFDeEIsS0FBQyxTQUFTLG9CQUFvQixTQUFpQixNQUFNLFFBQ3JELEtBQUMsU0FBUyxxQkFBcUIsU0FBZ0IsT0FBTyxRQUN0RCxLQUFDLFNBQVMsMkJBQTJCLFNBQVUsT0FBTyxLQUFLLE1BQU07UUFHdEUsS0FBQyxnQkFBZ0IsS0FBQyxTQUFTLHNDQUFzQztRQUNqRSxLQUFDLGVBQWdCLEtBQUMsU0FBUyw0Q0FBZ0Q7UUFFM0UsS0FBQyxZQUNJLEtBQUMsU0FBUyx5QkFBeUIsYUFDbkMsS0FBQyxTQUFTLCtCQUErQixTQUFVLE1BQU07UUFHOUQsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxnQkFBZ0I7OztJQUVyQixZQUFhLE9BQU07Ozs7UUFFZjs0QkFFWTs7O1lBQVI7WUFDQSxRQUFRLEtBQUssTUFBTTtpQ0FDSDtpQkFBUDs7Z0JBQUw7Z0JBQ0EsSUFBSSxLQUFLO29CQUNXLE1BQU0sTUFBTSxTQUFPOztvQkFBdkMsSUFBSSxLQUFLOzs7O2VBRWpCOzs7SUFFSixVQUFXLE1BQUs7Ozs7UUFFWixrQkFBYyxNQUFNLE1BQU07NEJBRVg7OztZQUFYO1lBQ0EsU0FBUyxLQUFDLFdBQVcsT0FBTzs7ZUFFaEM7OztJQUVKLGFBQWMsUUFBTzs7OztzQkFFTDs7OztRQUVaLGNBQWM7UUFDZCxZQUFZO1FBQ1osVUFBVTtRQUVWLEtBQUs7UUFDTCxLQUFLO1FBQ0w7ZUFFTSxLQUFLLElBQUk7O1lBRVgsS0FBSyxJQUFJO2dCQUVOLE9BQU0sT0FBTzs7Z0JBQ1osY0FBYztnQkFDZCxVQUFVO2dCQUNWO2dC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_js.kode
