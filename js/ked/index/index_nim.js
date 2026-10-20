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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbmltLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9uaW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBdUJXLFFBQVEsT0FBTyxVQUFVLEtBQUs7O1lBQzdCLE1BQU0sT0FBTztZQUNiLE1BQU0sT0FBTztZQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7OztZQUd0QixLQUFDLE9BQU8sUUFBUTs7WUFFZixZQUFZLEtBQUMsT0FBTyxxQkFBWTtZQUNoQyxZQUFZLEtBQUMsT0FBTyxxQkFBWTtZQUVoQzs7OztnQkFFSSxPQUFNLE9BQU8sS0FBSyxLQUFLLE1BQU0sTUFBTTtnQkFDbkMsS0FBQyxPQUFPLE1BQU0sS0FBSzt1QkFDbkI7O2dCQUVELGNBQWE7O29CQUVULFFBQVEsT0FBTyxVQUFVLEtBQUssc0NBQXNDLElBQUk7O29CQUFRLFFBQVEsTUFBTTs7OztRQUV6Rzs7OztZQUVJLE9BQU0sS0FBSyxLQUFNLEtBQUs7Z0JBQ0gsSUFBSTs7Z0JBQXZCLElBQUksT0FBTzs7WUFDWCxLQUFDLE9BQU8sTUFBTSxLQUFLO21CQUNuQjs7WUFFRCxRQUFRLE9BQU8sVUFBVSxLQUFLLG9CQUFvQixJQUFJOztZQUFRLFFBQVEsTUFBTTs7UUFFL0UsSUFBSSxLQUFLLE1BQU0sWUFBWTtjQUN4QixZQUFBLEVBQUc7O1lBQ0YsT0FBTyxFQUFFLEdBQUcsV0FBVyxnQkFBaUI7WUFDeEMsT0FBTyxLQUFLLFdBQVcsSUFBSTtZQUMzQixPQUFPLEtBQUssV0FBVyxJQUFJO21CQUMzQixRQUFRLE1BQUssS0FBSzs7Ozs7Ozs7UUFVdEIsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRWhCOzs7O1lBQ3RCLEtBQUMsVUFBVSxVQUFVOztlQUV6QixLQUFDOzs7Ozs7ZUFFRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_nim.kode
