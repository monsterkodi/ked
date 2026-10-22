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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbHVhLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9sdWEua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFVQSxNQUFNOztJQUVGOzs7SUFRQSxXQUFXLE9BQU07Ozs7YUFFTixLQUFLLFdBQVc7O2dCQUVoQixRQUFRLE9BQU8sVUFBVSxLQUFLLHVCQUF1Qjs7Z0JBQ3BELE1BQU0sT0FBTztnQkFDYixNQUFNLE9BQU87Z0JBQ2IsS0FBQyxPQUFPLFFBQVEsS0FBSzs7OztRQUc3QiwwQkFBaUI7OytCQUFlLG1CQUFVLE1BQWEsS0FBSSxNQUFLLFFBQU8sU0FBUSxTQUFROztRQUN2RiwyQkFBaUI7O21CQUFTLFNBQVUsY0FBYyxNQUFNOztRQUV4RCxzQkFBWTs7WUFFUixRQUFRLE9BQU8sVUFBVSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUk7Z0JBQ3RDLGVBQWU7O3VCQUF4Qjs7O1FBRUosc0JBQVk7O1lBRVIsUUFBUSxPQUFPLFVBQVUsS0FBSyxLQUFLLElBQUk7Z0JBQzlCLGVBQWU7O3VCQUF4Qjs7O1lBRUQsS0FBQyxPQUFPLFFBQVE7O1lBRWYsWUFBWSxLQUFDLE9BQU8scUJBQVk7WUFFaEMscUJBQVUsTUFBSzs7OztnQkFFWCxPQUFNLE9BQU8sS0FBSyxLQUFLLE1BQU0sTUFBTTtvQkFDZCxJQUFJOztvQkFBekIsSUFBSSxTQUFTOztvQkFDUSxJQUFJOztvQkFBekIsSUFBSSxRQUFTOztvQkFDUSxLQUFDLE1BQU0sU0FBVSxTQUFROztvQkFBOUMsSUFBSSxRQUFTOztnQkFFYixLQUFDLE9BQU8sTUFBTSxLQUFLO3VCQUNuQjs7Z0JBRUQsUUFBUSxzQkFBc0I7O3VCQUFxQyxRQUFRLE1BQU07O2dCQUNqRixRQUFRLHNCQUFzQjs7dUJBQXFDLFFBQVEsTUFBTSxNQUFNLE9BQU87OztRQUVyRyxxQkFBVSxNQUFLOzs7O1lBRVgsT0FBTSxLQUFLLEtBQU0sS0FBSztnQkFDRCxJQUFJOztnQkFBekIsSUFBSSxRQUFTOztnQkFDUSxJQUFJOztnQkFBekIsSUFBSSxPQUFTOztZQUNiLEtBQUMsT0FBTyxNQUFNLEtBQUs7bUJBQ25COzthQUVHLEtBQUssV0FBVzs7Z0JBRWhCLFFBQVEsVUFBVTs7dUJBQTRCLFFBQVEsTUFBTTs7O1lBRWhFLFFBQVEsT0FBTyxVQUFVLEtBQU0sNEJBQTZCLElBQUksSUFBSSxJQUFJOzttQkFFckUsYUFBYSxNQUFNLFFBQVEsS0FBSzs7OztJQVExQyxPQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQztRQUNELEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUVoQjs7O1lBQXRCO1lBQ0EsS0FBQyxVQUFVLFVBQVU7O2VBRXpCLEtBQUM7Ozs7ZUFFRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_lua.kode
