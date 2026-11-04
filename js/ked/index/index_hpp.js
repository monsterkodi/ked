var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var index_hpp


index_hpp = (function ()
{
    function index_hpp ()
    {
        this.regions = {character:{open:"'",close:"'"},string:{open:'"',close:'"'},bracketArgs:{open:'(',close:')'},bracketSquare:{open:'[',close:']'},codeBlock:{open:'{',close:'}'},blockComment:{open:'/*',close:'*/'},lineComment:{open:'//',close:null}}
        this.classRegExp = /^\s*(\S+\s+)?(enum|enum\s+class|class|struct)\s+/
        this.methodRegExp = /^([\w\&\*]+)\s+(\w+)\s*\(/
        this.constrRegExp = /^(\~?\w+)\s*\(/
        this.topMethRegExp = /^(\w+)\:\:(\w+)\s*\(/
        this.funcRegExp = /^(\w+)\s+(\w+)\s*\(/
    }

    index_hpp.prototype["parseLine"] = function (lineIndex, lineText)
    {
        var advance, ch, key, lst, match, p, poppedRegion, region, rest, topRegion, topToken, _169_37_, _169_44_, _169_71_, _55_41_, _60_82_, _60_89_

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
                    if (((topToken != null ? (_169_37_=topToken.args) != null ? _169_37_.start : undefined : undefined) != null) && !(topToken.args.end != null) && key === 'bracketArgs' && this.regionStack.length === (topToken != null ? topToken.depth : undefined))
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

    index_hpp.prototype["parse"] = function (text)
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

    return index_hpp
})()

export default index_hpp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfaHBwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9ocHAua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQyxhQUFEOzthQUVJOztRQUVJLEtBQUMsV0FDRyxXQUFpQixLQUFNLElBQUssTUFBTyxLQUNuQyxRQUFpQixLQUFNLElBQUssTUFBTyxLQUNuQyxhQUFpQixLQUFNLElBQUssTUFBTyxLQUNuQyxlQUFpQixLQUFNLElBQUssTUFBTyxLQUNuQyxXQUFpQixLQUFNLElBQUssTUFBTyxLQUNuQyxjQUFpQixLQUFNLEtBQUssTUFBTyxNQUNuQyxhQUFpQixLQUFNLEtBQUssTUFBTztRQUV2QyxLQUFDLGNBQWdCO1FBQ2pCLEtBQUMsZUFBZ0I7UUFDakIsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLGFBQWdCOzs7eUJBRXJCLHdCQUFXLFdBQVU7Ozs7dUJBRXFCLEtBQUM7O1lBQXZDLEtBQUMsV0FBVyxLQUFDOztRQUNiLEtBQUMsY0FBYztZQUVaLGVBQVcsS0FBQzs7Z0JBQ1IsSUFBSSxjQUFrQixJQUFJOztvQkFDdEIsS0FBQyxTQUFTLFdBQVc7O29CQUNwQixLQUFDLFdBQVc7Ozs7b0JBRVosSUFBSSxPQUFPLEtBQUM7Ozs7UUFFeEIsSUFBTztRQUNQLE9BQU87ZUFDRCxJQUFJLFNBQVMsU0FBTzs7WUFDdEIsS0FBSztZQUNMLEtBQUssU0FBUztZQUVkLG9CQUFXOztvQkFDSyxJQUFJOztvQkFBaEIsS0FBSyxJQUFFOzt1QkFDUCxPQUFPLEtBQUssTUFBTTs7dUJBRW5CLElBQU8sSUFBSTs7K0JBQzRCLEtBQUM7O29CQUF2QyxLQUFDLFdBQVcsS0FBQzs7Z0JBQ2IsS0FBQyxjQUFjOzs7O2dCQUVmLEtBQUMsZUFBZTs7WUFFcEIsb0JBQWdCLEtBQUM7aUJBRWQsbUJBQUEsU0FBVTs7cUJBQ0YsU0FBUzs7d0JBQ1QsS0FBSyxPQUFNOzt3QkFDVixTQUFTLE9BQU8sS0FBQzs7O3NCQUNs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_hpp.kode
