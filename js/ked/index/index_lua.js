var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class index_lua
{
    constructor ()
    {}

    parseLine (index, line)
    {
        var addFunc, addMeth, className, funcMatch, match, methMatch, validFuncMatch, validFuncName

        if (!line.startsWith(' '))
        {
            if (match = kermit.lineMatch(line,'local ●name = class',['(']))
            {
                match.type = 'class'
                match.line = index
                this.result.classes.push(match)
                return
            }
        }
        validFuncName = function (name)
        {
            return !_k_.empty((name)) && !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncMatch = function (match)
        {
            return match && validFuncName(match.name)
        }
        methMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,["(",")",":","."])
            if (validFuncMatch(match))
            {
                return match
            }
        }
        funcMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,["(",")"])
            if (validFuncMatch(match))
            {
                return match
            }
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
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
            if (match = methMatch(`function ${className}:●name(○args)`))
            {
                return addMeth(match.name)
            }
            if (match = methMatch(`function ${className}.static.●name(○args)`))
            {
                return addMeth(match.name,{static:true})
            }
        }
        addFunc = (function (name, opt = {})
        {
            var fnc

            fnc = {name:name,line:index}
            if (opt.async)
            {
                fnc.async = true
            }
            if (opt.test)
            {
                fnc.test = true
            }
            this.result.funcs.push(fnc)
            return null
        }).bind(this)
        if (!line.startsWith(' '))
        {
            if (match = funcMatch('function ●name(○args)'))
            {
                return addFunc(match.name)
            }
        }
        if (match = kermit.lineMatch(line,'test("●name", function()',["(",")",',','"']))
        {
            return addFunc(`▸ ${match.name}`,{test:true})
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

export default index_lua;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbHVhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9sdWEua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7YUFzQmUsS0FBSyxXQUFXOztnQkFFaEIsUUFBUSxPQUFPLFVBQVUsS0FBSyx1QkFBdUI7O2dCQUNwRCxNQUFNLE9BQU87Z0JBQ2IsTUFBTSxPQUFPO2dCQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7Ozs7UUFHN0I7OytCQUFnQyxtQkFBVSxNQUFhLEtBQUksTUFBSyxRQUFPLFNBQVEsU0FBUTs7UUFDdkY7O21CQUEwQixTQUFVLGNBQWMsTUFBTTs7UUFFeEQ7O1lBRUksUUFBUSxPQUFPLFVBQVUsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJO2dCQUN0QyxlQUFlOzt1QkFBeEI7OztRQUVKOztZQUVJLFFBQVEsT0FBTyxVQUFVLEtBQUssS0FBSyxJQUFJO2dCQUM5QixlQUFlOzt1QkFBeEI7OztZQUVELEtBQUMsT0FBTyxRQUFROztZQUVmLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBRWhDOzs7O2dCQUVJLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNO29CQUNkLElBQUk7O29CQUF6QixJQUFJLFNBQVM7O29CQUNRLElBQUk7O29CQUF6QixJQUFJLFFBQVM7O29CQUNRLEtBQUMsTUFBTSxTQUFVLFNBQVE7O29CQUE5QyxJQUFJLFFBQVM7O2dCQUViLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztnQkFFRCxRQUFRLHNCQUFzQjs7dUJBQXFDLFFBQVEsTUFBTTs7Z0JBQ2pGLFFBQVEsc0JBQXNCOzt1QkFBcUMsUUFBUSxNQUFNLE1BQU0sT0FBTzs7O1FBRXJHOzs7O1lBRUksT0FBTSxLQUFLLEtBQU0sS0FBSztnQkFDRCxJQUFJOztnQkFBekIsSUFBSSxRQUFTOztnQkFDUSxJQUFJOztnQkFBekIsSUFBSSxPQUFTOztZQUNiLEtBQUMsT0FBTyxNQUFNLEtBQUs7bUJBQ25COzthQUVHLEtBQUssV0FBVzs7Z0JBRWhCLFFBQVEsVUFBVTs7dUJBQTRCLFFBQVEsTUFBTTs7O1lBRWhFLFFBQVEsT0FBTyxVQUFVLEtBQU0sNEJBQTZCLElBQUksSUFBSSxJQUFJOzttQkFFckUsYUFBYSxNQUFNLFFBQVEsS0FBSzs7Ozs7Ozs7UUFVdEMsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQztRQUNELEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUVoQjs7OztZQUN0QixLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=file://kode/ked/index/index_lua.kode
