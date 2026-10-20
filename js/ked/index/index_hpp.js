var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

class index_hpp
{
    constructor ()
    {
        this.regions = {character:{open:"'",close:"'"},string:{open:'"',close:'"'},bracketArgs:{open:'(',close:')'},bracketSquare:{open:'[',close:']'},codeBlock:{open:'{',close:'}'},blockComment:{open:'/*',close:'*/'},lineComment:{open:'//',close:null}}
        this.classRegExp = /^\s*(\S+\s+)?(enum|enum\s+class|class|struct)\s+/
        this.methodRegExp = /^([\w\&\*]+)\s+(\w+)\s*\(/
        this.constrRegExp = /^(\~?\w+)\s*\(/
        this.topMethRegExp = /^(\w+)\:\:(\w+)\s*\(/
        this.funcRegExp = /^(\w+)\s+(\w+)\s*\(/
    }

    parseLine (lineIndex, lineText)
    {
        var advance, ch, key, lst, match, p, poppedRegion, region, rest, topRegion, topToken, _182_37_, _182_44_, _182_71_, _68_41_, _73_82_, _73_89_

        if (!_k_.empty(this.currentWord))
        {
            this.lastWord = this.currentWord
        }
        this.currentWord = ''
        if (lst = _k_.last(this.tokenStack))
        {
            if (lst.classType && !lst.name)
            {
                if (this.lastWord.startsWith('>'))
                {
                    this.tokenStack.pop()
                }
                else
                {
                    lst.name = this.lastWord
                }
            }
        }
        p = -1
        rest = lineText
        while (p < lineText.length - 1)
        {
            p += 1
            ch = lineText[p]
            advance = function (n)
            {
                if (n > 1)
                {
                    p += n - 1
                }
                return rest = rest.slice(n)
            }
            if (_k_.in(ch,[' ','\t']))
            {
                if (!_k_.empty(this.currentWord))
                {
                    this.lastWord = this.currentWord
                }
                this.currentWord = ''
            }
            else
            {
                this.currentWord += ch
            }
            topToken = _k_.last(this.tokenStack)
            if ((topToken != null ? topToken.classType : undefined))
            {
                if (!topToken.name)
                {
                    if (rest[0] === ':')
                    {
                        topToken.name = this.lastWord
                    }
                }
                if (!(topToken.codeBlock != null ? topToken.codeBlock.start : undefined))
                {
                    if (_k_.in(rest[0],[';','*','&']))
                    {
                        this.tokenStack.pop()
                    }
                }
            }
            else if ((topToken != null ? topToken.method : undefined))
            {
                if (rest[0] === ';' && topToken.args.end && !((topToken.codeBlock != null ? topToken.codeBlock.start : undefined) != null))
                {
                    this.result.funcs.push(topToken)
                    this.tokenStack.pop()
                }
            }
            if (_k_.empty((this.regionStack)) || _k_.last(this.regionStack).region === 'codeBlock')
            {
                if (_k_.empty((this.tokenStack)) || _k_.last(this.tokenStack).classType)
                {
                    if (p === 0 && (match = lineText.match(this.classRegExp)))
                    {
                        this.tokenStack.push({line:lineIndex,col:p,classType:match[1],depth:this.regionStack.length})
                        advance(match[0].length)
                        this.currentWord = ''
                        continue
                    }
                }
                if (_k_.empty((this.tokenStack)))
                {
                    if (_k_.empty(this.regionStack))
                    {
                        if (match = rest.match(this.topMethRegExp))
                        {
                            this.tokenStack.push({line:lineIndex,col:p,class:match[1],method:match[2],depth:0})
                            if (!(_k_.in(match[1],this.result.classes.map(function (ci)
                                {
                                    return ci.name
                                }))))
                            {
                                this.result.classes.push({line:lineIndex,col:p,name:match[1]})
                            }
                        }
                        else if (match = rest.match(this.funcRegExp))
                        {
                            this.tokenStack.push({line:lineIndex,col:p,method:match[2],name:match[2],depth:0,static:true})
                        }
                    }
                }
                else if (_k_.last(this.tokenStack).classType)
                {
                    if (match = rest.match(this.methodRegExp))
                    {
                        this.tokenStack.push({line:lineIndex,col:p,method:match[2],depth:this.regionStack.length,class:_k_.last(this.tokenStack).name})
                    }
                    else if (match = rest.match(this.constrRegExp))
                    {
                        if (match[1] === _k_.last(this.tokenStack).name || match[1] === '~' + _k_.last(this.tokenStack).name)
                        {
                            this.tokenStack.push({line:lineIndex,col:p,method:match[1],depth:this.regionStack.length,class:_k_.last(this.tokenStack).name})
                        }
                    }
                }
            }
            topRegion = _k_.last(this.regionStack)
            if (_k_.in((topRegion != null ? topRegion.region : undefined),['blockComment','string','character']))
            {
                if (_k_.in(topRegion.region,['string','character']))
                {
                    if (rest.startsWith('\\'))
                    {
                        advance(2)
                        continue
                    }
                }
                if (!rest.startsWith(this.regions[topRegion.region].close))
                {
                    advance(1)
                    continue
                }
            }
            for (key in this.regions)
            {
                region = this.regions[key]
                if (rest.startsWith(region.open) && (!topRegion || region.open !== region.close || topRegion.region !== key))
                {
                    if ((topToken != null) && key === 'codeBlock' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.codeBlock = {start:{line:lineIndex,col:p}}
                    }
                    if ((topToken != null ? topToken.method : undefined) && !topToken.args && key === 'bracketArgs' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.args = {start:{line:lineIndex,col:p}}
                    }
                    if (key === 'lineComment')
                    {
                        return
                    }
                    this.regionStack.push({line:lineIndex,col:p,region:key})
                    break
                }
                else if (region.close && rest.startsWith(region.close))
                {
                    poppedRegion = this.regionStack.pop()
                    if ((topToken != null) && key === 'codeBlock' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.codeBlock.end = {line:lineIndex,col:p}
                        this.tokenStack.pop()
                        if (topToken.classType)
                        {
                            this.result.classes.push(topToken)
                        }
                        else
                        {
                            this.result.funcs.push(topToken)
                        }
                    }
                    if (((topToken != null ? (_182_37_=topToken.args) != null ? _182_37_.start : undefined : undefined) != null) && !(topToken.args.end != null) && key === 'bracketArgs' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
                    {
                        topToken.args.end = {line:lineIndex,col:p}
                    }
                    break
                }
            }
            advance(1)
        }
        return true
    }

    parse (text)
    {
        var ch, lineEnd, lineIndex, lineStart, lineText, p

        this.escapes = 0
        this.regionStack = []
        this.tokenStack = []
        this.lastWord = ''
        this.currentWord = ''
        this.result = {classes:[],funcs:[]}
        lineStart = 0
        lineEnd = 0
        lineIndex = 0
        lineText = ''
        p = -1
        while (p < text.length - 1)
        {
            p += 1
            ch = text[p]
            if (ch === '\n')
            {
                this.parseLine(lineIndex,lineText)
                lineIndex += 1
                lineText = ''
            }
            else
            {
                lineEnd += 1
                lineText += ch
            }
        }
        this.parseLine(lineIndex,lineText)
        return this.result
    }
}

export default index_hpp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfaHBwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9ocHAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBWVEsS0FBQyxXQUNHLFdBQWlCLEtBQU0sSUFBSyxNQUFPLEtBQ25DLFFBQWlCLEtBQU0sSUFBSyxNQUFPLEtBQ25DLGFBQWlCLEtBQU0sSUFBSyxNQUFPLEtBQ25DLGVBQWlCLEtBQU0sSUFBSyxNQUFPLEtBQ25DLFdBQWlCLEtBQU0sSUFBSyxNQUFPLEtBQ25DLGNBQWlCLEtBQU0sS0FBSyxNQUFPLE1BQ25DLGFBQWlCLEtBQU0sS0FBSyxNQUFPO1FBRXZDLEtBQUMsY0FBZ0I7UUFDakIsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsYUFBZ0I7Ozs7Ozs7dUJBVXFCLEtBQUM7O1lBQXZDLEtBQUMsV0FBVyxLQUFDOztRQUNiLEtBQUMsY0FBYztZQUVaLGVBQVcsS0FBQzs7Z0JBQ1IsSUFBSSxjQUFrQixJQUFJOztvQkFDdEIsS0FBQyxTQUFTLFdBQVc7O29CQUNwQixLQUFDLFdBQVc7Ozs7b0JBRVosSUFBSSxPQUFPLEtBQUM7Ozs7UUFFeEIsSUFBTztRQUNQLE9BQU87ZUFDRCxJQUFJLFNBQVMsU0FBTzs7WUFDdEIsS0FBSztZQUNMLEtBQUssU0FBUztZQUVkOztvQkFDZ0IsSUFBSTs7b0JBQWhCLEtBQUssSUFBRTs7dUJBQ1AsT0FBTyxLQUFLLE1BQU07O3VCQUVuQixJQUFPLElBQUk7OytCQUM0QixLQUFDOztvQkFBdkMsS0FBQyxXQUFXLEtBQUM7O2dCQUNiLEtBQUMsY0FBYzs7OztnQkFFZixLQUFDLGVBQWU7O1lBRXBCLG9CQUFnQixLQUFDO2lCQUVkLG1CQUFBLFNBQVU7O3FCQUNGLFNBQVM7O3dCQUNULEtBQUssT0FBTTs7d0JBQ1YsU0FBUyxPQUFPLEtBQUM7OztzQkFDbEIsU0FBUyxvQkFBVCxTQUFTLFVBQVc7OytCQUVwQixLQUFLLElB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_hpp.kode
