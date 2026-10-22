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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbHVhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9sdWEua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRVSxVQUFBO0lBQU07O0FBRWhCLE1BQU07O0lBRUY7OztJQVFBLFdBQVcsT0FBTTs7OzthQUVOLEtBQUssV0FBVzs7Z0JBRWhCLFFBQVEsT0FBTyxVQUFVLEtBQUssdUJBQXVCOztnQkFDcEQsTUFBTSxPQUFPO2dCQUNiLE1BQU0sT0FBTztnQkFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7O1FBRzdCLDBCQUFpQjs7K0JBQWUsbUJBQVUsTUFBYSxLQUFJLE1BQUssUUFBTyxTQUFRLFNBQVE7O1FBQ3ZGLDJCQUFpQjs7bUJBQVMsU0FBVSxjQUFjLE1BQU07O1FBRXhELHNCQUFZOztZQUVSLFFBQVEsT0FBTyxVQUFVLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSTtnQkFDdEMsZUFBZTs7dUJBQXhCOzs7UUFFSixzQkFBWTs7WUFFUixRQUFRLE9BQU8sVUFBVSxLQUFLLEtBQUssSUFBSTtnQkFDOUIsZUFBZTs7dUJBQXhCOzs7WUFFRCxLQUFDLE9BQU8sUUFBUTs7WUFFZixZQUFZLEtBQUMsT0FBTyxxQkFBWTtZQUVoQyxxQkFBVSxNQUFLOzs7O2dCQUVYLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNO29CQUNkLElBQUk7O29CQUF6QixJQUFJLFNBQVM7O29CQUNRLElBQUk7O29CQUF6QixJQUFJLFFBQVM7O29CQUNRLEtBQUMsTUFBTSxTQUFVLFNBQVE7O29CQUE5QyxJQUFJLFFBQVM7O2dCQUViLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztnQkFFRCxRQUFRLHNCQUFzQjs7dUJBQXFDLFFBQVEsTUFBTTs7Z0JBQ2pGLFFBQVEsc0JBQXNCOzt1QkFBcUMsUUFBUSxNQUFNLE1BQU0sT0FBTzs7O1FBRXJHLHFCQUFVLE1BQUs7Ozs7WUFFWCxPQUFNLEtBQUssS0FBTSxLQUFLO2dCQUNELElBQUk7O2dCQUF6QixJQUFJLFFBQVM7O2dCQUNRLElBQUk7O2dCQUF6QixJQUFJLE9BQVM7O1lBQ2IsS0FBQyxPQUFPLE1BQU0sS0FBSzttQkFDbkI7O2FBRUcsS0FBSyxXQUFXOztnQkFFaEIsUUFBUSxVQUFVOzt1QkFBNEIsUUFBUSxNQUFNOzs7WUFFaEUsUUFBUSxPQUFPLFVBQVUsS0FBTSw0QkFBNkIsSUFBSSxJQUFJLElBQUk7O21CQUVyRSxhQUFhLE1BQU0sUUFBUSxLQUFLOzs7O0lBUTFDLE9BQU87Ozs7UUFFSCxRQUFRLEtBQUssTUFBTTtRQUVuQixLQUFDO1FBQ0QsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRWhCO2FBQWI7O1lBQVQ7WUFDQSxLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_lua.kode
