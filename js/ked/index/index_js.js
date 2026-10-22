var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class index_js
{
    constructor ()
    {}

    parseLine (index, line)
    {
        var addFunc, addMeth, className, classType, doMatch, funcMatch, match, validFuncArgs, validFuncMatch, validFuncName

        if (!line.startsWith(' '))
        {
            if (match = kermit.lineMatch(line,'class ●name'))
            {
                match.type = 'class'
                match.line = index
                this.result.classes.push(match)
                return
            }
            if (match = kermit.lineMatch(line,'●name = (function ()'))
            {
                match.type = 'function'
                match.line = index
                this.result.classes.push(match)
                return
            }
        }
        validFuncName = function (name)
        {
            return !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncArgs = function (args)
        {
            return args[0] === '(' && args.slice(-1)[0] === ')'
        }
        validFuncMatch = function (match)
        {
            return match && validFuncArgs(match.args) && validFuncName(match.name)
        }
        doMatch = function (ptn)
        {
            return kermit.lineMatch(line,ptn,['"','.',',',"'"])
        }
        funcMatch = function (ptn)
        {
            match = doMatch(ptn)
            if (validFuncMatch(match))
            {
                return match
            }
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            classType = this.result.classes.slice(-1)[0].type
            addMeth = (function (name, opt = {})
            {
                var fnc

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
                return null
            }).bind(this)
            if (classType === 'class')
            {
                if (match = funcMatch('●name ○args'))
                {
                    return addMeth(match.name)
                }
                if (match = funcMatch('async ●name ○args'))
                {
                    return addMeth(match.name,{async:true})
                }
                if (match = funcMatch('static ●name ○args'))
                {
                    return addMeth(match.name,{static:true})
                }
                if (match = funcMatch('static async ●name ○args'))
                {
                    return addMeth(match.name,{static:true,async:true})
                }
                if (match = doMatch(`this.●name = this.●bound.bind(this)`))
                {
                    this.bound[match.name] = true
                }
            }
            if (classType === 'function')
            {
                if (match = funcMatch(`function ${className} ○args`))
                {
                    return addMeth(className)
                }
                if (match = funcMatch(`${className}["●name"] = function ○args`))
                {
                    return addMeth(match.name,{static:true})
                }
                if (match = funcMatch(`${className}["●name"] = async function ○args`))
                {
                    return addMeth(match.name,{static:true,async:true})
                }
                if (match = funcMatch(`${className}.prototype["●name"] = function ○args`))
                {
                    return addMeth(match.name)
                }
                if (match = funcMatch(`${className}.prototype["●name"] = async function ○args`))
                {
                    return addMeth(match.name,{async:true})
                }
                if (match = doMatch(`this["●name"] = this["●bound"].bind(this)`))
                {
                    this.bound[match.name] = true
                }
            }
        }
        if (!line.startsWith(' '))
        {
            addFunc = (function (name, opt = {})
            {
                var fnc

                fnc = {name:name,line:index}
                if (opt.async)
                {
                    fnc.async = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (match = funcMatch('●name = function ○args'))
            {
                addFunc(match.name)
            }
            if (match = funcMatch('●name = async function ○args'))
            {
                return addFunc(match.name,{async:true})
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BUVUsVUFBQTtJQUFNOztBQUVoQixNQUFNOztJQUVGOzs7SUFRQSxXQUFXLE9BQU07Ozs7YUFFTixLQUFLLFdBQVc7O2dCQUVoQixRQUFRLE9BQU8sVUFBVSxLQUFLOztnQkFDN0IsTUFBTSxPQUFPO2dCQUNiLE1BQU0sT0FBTztnQkFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7Z0JBR3RCLFFBQVEsT0FBTyxVQUFVLEtBQUs7O2dCQUM3QixNQUFNLE9BQU87Z0JBQ2IsTUFBTSxPQUFPO2dCQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7Ozs7UUFHN0IsMEJBQWlCOzs0QkFBUyxNQUFhLEtBQUksTUFBSyxRQUFPLFNBQVEsU0FBUTs7UUFDdkUsMEJBQWlCOzttQkFBUyxLQUFLLE9BQU0sT0FBUSxzQkFBWTs7UUFDekQsMkJBQWlCOzttQkFBUyxTQUFVLGNBQWMsTUFBTSxTQUFVLGNBQWMsTUFBTTs7UUFFdEYsb0JBQVU7O21CQUFPLE9BQU8sVUFBVSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUk7O1FBRXhELHNCQUFZOztZQUVSLFFBQVEsUUFBUTtnQkFDUCxlQUFlOzt1QkFBeEI7OztZQUVELEtBQUMsT0FBTyxRQUFROztZQUVmLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBQ2hDLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBRWhDLHFCQUFVLE1BQUs7Ozs7Z0JBRVgsT0FBTSxPQUFPLEtBQUssS0FBSyxNQUFNLE1BQU07b0JBQ2QsSUFBSTs7b0JBQXpCLElBQUksU0FBUzs7b0JBQ1EsSUFBSTs7b0JBQXpCLElBQUksUUFBUzs7b0JBQ1EsS0FBQyxNQUFNLFNBQVUsU0FBUTs7b0JBQTlDLElBQUksUUFBUzs7Z0JBRWIsS0FBQyxPQUFPLE1BQU0sS0FBSzt1QkFDbkI7O2dCQUVELGNBQWE7O29CQUVULFFBQVEsVUFBVTs7MkJBQWdDLFFBQVEsTUFBTTs7b0JBQ2hFLFFBQVEsVUFBVTs7MkJBQWdDLFFBQVEsTUFBTSxNQUFrQixNQUFNOztvQkFDeEYsUUFBUSxVQUFVOzsyQkFBZ0MsUUFBUSxNQUFNLE1BQU0sT0FBTzs7b0JBQzdFLFFBQVEsVUFBVTs7MkJBQWdDLFFBQVEsTUFBTSxNQUFNLE9BQU8sS0FBSyxNQUFNOztvQkFFeEYsUUFBUSxRQUFROztvQkFBNEMsS0FBQyxNQUFNLE1BQU0sUUFBUTs7O2dCQUVyRixjQUFhOztvQkFFVCxRQUFRLHNCQUFzQjs7MkJBQXNELFFBQVE7O29CQUM1RixRQUFRLGFBQWU7OzJCQUE2RCxRQUFRLE1BQU0sTUFBTSxPQUFPOztvQkFDL0csUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNLE1BQU0sT0FBTyxLQUFLLE1BQU07O29CQUMxSCxRQUFRLGFBQWU7OzJCQUE2RCxRQUFRLE1BQU07O29CQUNsRyxRQUFRLGFBQWU7OzJCQUE2RCxRQUFRLE1BQU0sTUFBTSxNQUFNOztvQkFFOUcsUUFBUSxRQUFROztvQkFBa0QsS0FBQyxNQUFNLE1BQU0sUUFBUTs7OzthQUUzRixLQUFLLFdBQVc7O1lBRW5CLHFCQUFVLE1BQUs7Ozs7Z0JBRVgsT0FBTSxLQUFLLEtBQU0sS0FBSztvQkFDRCxJQUFJOztvQkFBekIsSUFBSSxRQUFTOztnQkFDYixLQUFDLE9BQU8sTUFBTSxLQUFLO3VCQUNuQjs7Z0JBRUQsUUFBUSxVQUFVOztnQkFBaUMsUUFBUSxNQUFNOztnQkFDakUsUUFBUSxVQUFVOzt1QkFBaUMsUUFBUSxNQUFNLE1BQU0sTUFBTTs7Ozs7SUFReEYsT0FBTzs7OztRQUVILFFBQVEsS0FBSyxNQUFNO1FBRW5CLEtBQUM7UUFDRCxLQUFDLFVBQVMsV0FBVyxTQUFTLE1BQU0sTUFBTTs0QkFFaEI7YUFBYjs7WUFBVDtZQUNBLEtBQUMsVUFBVSxVQUFVOztlQUV6QixLQUFDOzs7O2VBRUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_js.kode
