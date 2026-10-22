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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X2pzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBVUEsTUFBTTs7SUFFRjs7O0lBUUEsV0FBVyxPQUFNOzs7O2FBRU4sS0FBSyxXQUFXOztnQkFFaEIsUUFBUSxPQUFPLFVBQVUsS0FBSzs7Z0JBQzdCLE1BQU0sT0FBTztnQkFDYixNQUFNLE9BQU87Z0JBQ2IsS0FBQyxPQUFPLFFBQVEsS0FBSzs7O2dCQUd0QixRQUFRLE9BQU8sVUFBVSxLQUFLOztnQkFDN0IsTUFBTSxPQUFPO2dCQUNiLE1BQU0sT0FBTztnQkFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7O1FBRzdCLDBCQUFpQjs7NEJBQVMsTUFBYSxLQUFJLE1BQUssUUFBTyxTQUFRLFNBQVE7O1FBQ3ZFLDBCQUFpQjs7bUJBQVMsS0FBSyxPQUFNLE9BQVEsc0JBQVk7O1FBQ3pELDJCQUFpQjs7bUJBQVMsU0FBVSxjQUFjLE1BQU0sU0FBVSxjQUFjLE1BQU07O1FBRXRGLG9CQUFVOzttQkFBTyxPQUFPLFVBQVUsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJOztRQUV4RCxzQkFBWTs7WUFFUixRQUFRLFFBQVE7Z0JBQ1AsZUFBZTs7dUJBQXhCOzs7WUFFRCxLQUFDLE9BQU8sUUFBUTs7WUFFZixZQUFZLEtBQUMsT0FBTyxxQkFBWTtZQUNoQyxZQUFZLEtBQUMsT0FBTyxxQkFBWTtZQUVoQyxxQkFBVSxNQUFLOzs7O2dCQUVYLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNO29CQUNkLElBQUk7O29CQUF6QixJQUFJLFNBQVM7O29CQUNRLElBQUk7O29CQUF6QixJQUFJLFFBQVM7O29CQUNRLEtBQUMsTUFBTSxTQUFVLFNBQVE7O29CQUE5QyxJQUFJLFFBQVM7O2dCQUViLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztnQkFFRCxjQUFhOztvQkFFVCxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU07O29CQUNoRSxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU0sTUFBa0IsTUFBTTs7b0JBQ3hGLFFBQVEsVUFBVTs7MkJBQWdDLFFBQVEsTUFBTSxNQUFNLE9BQU87O29CQUM3RSxRQUFRLFVBQVU7OzJCQUFnQyxRQUFRLE1BQU0sTUFBTSxPQUFPLEtBQUssTUFBTTs7b0JBRXhGLFFBQVEsUUFBUTs7b0JBQTRDLEtBQUMsTUFBTSxNQUFNLFFBQVE7OztnQkFFckYsY0FBYTs7b0JBRVQsUUFBUSxzQkFBc0I7OzJCQUFzRCxRQUFROztvQkFDNUYsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNLE1BQU0sT0FBTzs7b0JBQy9HLFFBQVEsYUFBZTs7MkJBQTZELFFBQVEsTUFBTSxNQUFNLE9BQU8sS0FBSyxNQUFNOztvQkFDMUgsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNOztvQkFDbEcsUUFBUSxhQUFlOzsyQkFBNkQsUUFBUSxNQUFNLE1BQU0sTUFBTTs7b0JBRTlHLFFBQVEsUUFBUTs7b0JBQWtELEtBQUMsTUFBTSxNQUFNLFFBQVE7Ozs7YUFFM0YsS0FBSyxXQUFXOztZQUVuQixxQkFBVSxNQUFLOzs7O2dCQUVYLE9BQU0sS0FBSyxLQUFNLEtBQUs7b0JBQ0QsSUFBSTs7b0JBQXpCLElBQUksUUFBUzs7Z0JBQ2IsS0FBQyxPQUFPLE1BQU0sS0FBSzt1QkFDbkI7O2dCQUVELFFBQVEsVUFBVTs7Z0JBQWlDLFFBQVEsTUFBTTs7Z0JBQ2pFLFFBQVEsVUFBVTs7dUJBQWlDLFFBQVEsTUFBTSxNQUFNLE1BQU07Ozs7O0lBUXhGLE9BQU87Ozs7UUFFSCxRQUFRLEtBQUssTUFBTTtRQUVuQixLQUFDO1FBQ0QsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRWhCOzs7WUFBdEI7WUFDQSxLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_js.kode
