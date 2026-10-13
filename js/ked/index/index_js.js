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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2FBc0JlLEtBQUssV0FBVzs7Z0JBRWhCLFFBQVEsT0FBTyxVQUFVLEtBQUs7O2dCQUM3QixNQUFNLE9BQU87Z0JBQ2IsTUFBTSxPQUFPO2dCQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7OztnQkFHdEIsUUFBUSxPQUFPLFVBQVUsS0FBSzs7Z0JBQzdCLE1BQU0sT0FBTztnQkFDYixNQUFNLE9BQU87Z0JBQ2IsS0FBQyxPQUFPLFFBQVEsS0FBSzs7OztRQUc3Qjs7NEJBQTBCLE1BQWEsS0FBSSxNQUFLLFFBQU8sU0FBUSxTQUFROztRQUN2RTs7bUJBQTBCLEtBQUssT0FBTSxPQUFRLHNCQUFZOztRQUN6RDs7bUJBQTBCLFNBQVUsY0FBYyxNQUFNLFNBQVUsY0FBYyxNQUFNOztRQUV0Rjs7bUJBQWlCLE9BQU8sVUFBVSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUk7O1FBRXhEOztZQUVJLFFBQVEsUUFBUTtnQkFDUCxlQUFlOzt1QkFBeEI7OztZQUVELEtBQUMsT0FBTyxRQUFROztZQUVmLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBQ2hDLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBRWhDOzs7O2dCQUVJLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNO29CQUNkLElBQUk7O29CQUF6QixJQUFJLFNBQVM7O29CQUNRLElBQUk7O29CQUF6QixJQUFJLFFBQVM7O29CQUNRLEtBQUMsTUFBTSxTQUFVLFNBQVE7O29CQUE5QyxJQUFJLFFBQVM7O2dCQUViLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztnQkFFRCxjQUFhOztvQkFFVCxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU07O29CQUNoRSxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU0sTUFBa0IsTUFBTTs7b0JBQ3hGLFFBQVEsVUFBVTs7MkJBQWdDLFFBQVEsTUFBTSxNQUFNLE9BQU87O29CQUM3RSxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU0sTUFBTSxPQUFPLEtBQUssTUFBTTs7b0JBRXhGLFFBQVEsUUFBUTs7b0JBQTRDLEtBQUMsTUFBTSxNQUFNLFFBQVE7OztnQkFFckYsY0FBYTs7b0JBRVQsUUFBUSxzQkFBc0I7OzJCQUFzRCxRQUFROztvQkFDNUYsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNLE1BQU0sT0FBTzs7b0JBQy9HLFFBQVEsYUFBZTs7MkJBQTZELFFBQVEsTUFBTSxNQUFNLE9BQU8sS0FBSyxNQUFNOztvQkFDMUgsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNOztvQkFDbEcsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNLE1BQU0sTUFBTTs7b0JBRTlHLFFBQVEsUUFBUTs7b0JBQWtELEtBQUMsTUFBTSxNQUFNLFFBQVE7Ozs7YUFFM0YsS0FBSyxXQUFXOztZQUVuQjs7OztnQkFFSSxPQUFNLEtBQUssS0FBTSxLQUFLO29CQUNELElBQUk7O29CQUF6QixJQUFJLFFBQVM7O2dCQUNiLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztnQkFFRCxRQUFRLFVBQVU7O2dCQUFpQyxRQUFRLE1BQU07O2dCQUNqRSxRQUFRLFVBQVU7O3VCQUFpQyxRQUFRLE1BQU0sTUFBTSxNQUFNOzs7Ozs7Ozs7UUFVcEYsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQztRQUNELEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUVoQjs7OztZQUN0QixLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=kode/ked/index/index_js.kode
