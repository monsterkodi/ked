var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_nim

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let kermit = kxk.kermit

import index_utils from "./index_utils.js"


index_nim = (function ()
{
    function index_nim ()
    {}

    index_nim.prototype["parseLine"] = function (index, line)
    {
        var addFunc, addMeth, className, classType, m, match, name

        if (match = kermit.lineMatch(line,'●type ●name = ●ref object'))
        {
            match.type = 'object'
            match.line = index
            this.result.classes.push(match)
            return
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            classType = this.result.classes.slice(-1)[0].type
            addMeth = (function (name, opt = {})
            {
                var fnc

                fnc = {method:name,line:index,class:className}
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (classType === 'object')
            {
                if (match = kermit.lineMatch(line,'proc ●name(self:#{className}○args)',['(',')']))
                {
                    addMeth(match.name)
                }
            }
        }
        addFunc = (function (name, opt = {})
        {
            var fnc

            fnc = {name:name,line:index}
            if (opt.test)
            {
                fnc.test = true
            }
            this.result.funcs.push(fnc)
            return null
        }).bind(this)
        if (match = kermit.lineMatch(line,'proc ●name ○args',['(',')']))
        {
            addFunc(match.name)
        }
        m = line.match(index_utils.nimTestRegExp)
        if (((m != null ? m[0] : undefined) != null))
        {
            name = m[0].replaceAll(/(suite|test)/g,'▸')
            name = name.replaceAll('"','')
            name = name.replaceAll(':','')
            return addFunc(name,{test:true})
        }
    }

    index_nim.prototype["parse"] = function (text)
    {
        var lineIndex, lines, lineText

        lines = text.split('\n')
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (lineIndex = 0; lineIndex < list.length; lineIndex++)
        {
            lineText = list[lineIndex]
            this.parseLine(lineIndex,lineText)
        }
        return this.result
    }

    return index_nim
})()

export default index_nim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbmltLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9uaW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBV1MsYUFBVDs7YUFFSTs7O3lCQVFBLHdCQUFXLE9BQU07Ozs7WUFFVixRQUFRLE9BQU8sVUFBVSxLQUFLOztZQUM3QixNQUFNLE9BQU87WUFDYixNQUFNLE9BQU87WUFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7WUFHdEIsS0FBQyxPQUFPLFFBQVE7O1lBRWYsWUFBWSxLQUFDLE9BQU8scUJBQVk7WUFDaEMsWUFBWSxLQUFDLE9BQU8scUJBQVk7WUFFaEMscUJBQVUsTUFBSzs7OztnQkFFWCxPQUFNLE9BQU8sS0FBSyxLQUFLLE1BQU0sTUFBTTtnQkFDbkMsS0FBQyxPQUFPLE1BQU0sS0FBSzt1QkFDbkI7O2dCQUVELGNBQWE7O29CQUVULFFBQVEsT0FBTyxVQUFVLEtBQUssc0NBQXNDLElBQUk7O29CQUFRLFFBQVEsTUFBTTs7OztRQUV6RyxxQkFBVSxNQUFLOzs7O1lBRVgsT0FBTSxLQUFLLEtBQU0sS0FBSztnQkFDSCxJQUFJOztnQkFBdkIsSUFBSSxPQUFPOztZQUNYLEtBQUMsT0FBTyxNQUFNLEtBQUs7bUJBQ25COztZQUVELFFBQVEsT0FBTyxVQUFVLEtBQUssb0JBQW9CLElBQUk7O1lBQVEsUUFBUSxNQUFNOztRQUUvRSxJQUFJLEtBQUssTUFBTSxZQUFZO2NBQ3hCLFlBQUEsRUFBRzs7WUFDRixPQUFPLEVBQUUsR0FBRyxXQUFXLGdCQUFpQjtZQUN4QyxPQUFPLEtBQUssV0FBVyxJQUFJO1lBQzNCLE9BQU8sS0FBSyxXQUFXLElBQUk7bUJBQzNCLFFBQVEsTUFBSyxLQUFLOzs7O3lCQVExQixvQkFBTzs7OztRQUVILFFBQVEsS0FBSyxNQUFNO1FBRW5CLEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUVoQjs7O1lBQXRCO1lBQ0EsS0FBQyxVQUFVLFVBQVU7O2VBRXpCLEtBQUM7OztXQWhFQTs7O2VBa0VGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_nim.kode
