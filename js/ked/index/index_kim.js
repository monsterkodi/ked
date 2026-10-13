var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_kim

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let kermit = kxk.kermit

import index_utils from "./index_utils.js"


index_kim = (function ()
{
    function index_kim ()
    {}

    index_kim.prototype["parseLine"] = function (index, line)
    {
        var addFunc, addMeth, className, classType, funcMatch, match, validFuncMatch, validFuncName

        if (match = kermit.lineMatch(line,'type ●name = ref object'))
        {
            match.type = 'object'
            match.line = index
            this.result.classes.push(match)
            return
        }
        if (match = kermit.lineMatch(line,'class ●name'))
        {
            match.type = 'class'
            match.line = index
            this.result.classes.push(match)
            return
        }
        validFuncName = function (name)
        {
            return !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncMatch = function (match)
        {
            return match && validFuncName(match.name)
        }
        funcMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,['(',')','"','.',',',"'"])
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
                if (opt.bound)
                {
                    fnc.bound = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            switch (classType)
            {
                case 'object':
                    if (match = kermit.lineMatch(line,`proc ●name(●this:${className}○args)`,['(',')']))
                    {
                        addMeth(match.name)
                    }
                    break
                case 'class':
                    if (match = kermit.lineMatch(line,"●name: ○args ->",[':']))
                    {
                        addMeth(match.name)
                    }
                    if (match = kermit.lineMatch(line,"●name: ○args =>",[':']))
                    {
                        addMeth(match.name,{bound:true})
                    }
                    break
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
            if (opt.bound)
            {
                fnc.bound = true
            }
            if (opt.async)
            {
                fnc.async = true
            }
            this.result.funcs.push(fnc)
            return null
        }).bind(this)
        if (match = kermit.lineMatch(line,'proc ●name ○args',['(',')']))
        {
            addFunc(match.name,{bound:true})
        }
        if (match = kermit.lineMatch(line,'macro ●name ○args',['(',')']))
        {
            addFunc(match.name,{bound:true,async:true})
        }
        if (match = kermit.lineMatch(line,'template ●name ○args',['(',')']))
        {
            addFunc(match.name,{async:true})
        }
        if (match = kermit.lineMatch(line,'●name = ○args ->'))
        {
            addFunc(match.name)
        }
        if (match = kermit.lineMatch(line,'▸ ○name'))
        {
            return addFunc(line,{test:true})
        }
    }

    index_kim.prototype["parse"] = function (text)
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

    return index_kim
})()

export default index_kim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfa2ltLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9raW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBdUJXLFFBQVEsT0FBTyxVQUFVLEtBQUs7O1lBQzdCLE1BQU0sT0FBTztZQUNiLE1BQU0sT0FBTztZQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7OztZQUd0QixRQUFRLE9BQU8sVUFBVSxLQUFLOztZQUM3QixNQUFNLE9BQU87WUFDYixNQUFNLE9BQU87WUFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7UUFHekI7OzRCQUEwQixNQUFhLEtBQUksTUFBSyxRQUFPLFNBQVEsU0FBUTs7UUFDdkU7O21CQUEwQixTQUFVLGNBQWMsTUFBTTs7UUFFeEQ7O1lBRUksUUFBUSxPQUFPLFVBQVUsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFDcEQsZUFBZTs7dUJBQ2Q7OztZQUVMLEtBQUMsT0FBTyxRQUFROztZQUVmLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBQ2hDLFlBQVksS0FBQyxPQUFPLHFCQUFZO1lBRWhDOzs7O2dCQUVJLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNO29CQUNmLElBQUk7O29CQUF4QixJQUFJLFFBQVE7O2dCQUNaLEtBQUMsT0FBTyxNQUFNLEtBQUs7dUJBQ25COztvQkFFRzs7cUJBQ0g7d0JBQ08sUUFBUSxPQUFPLFVBQVUseUJBQXlCLG1CQUFtQixJQUFJOzt3QkFBUSxRQUFRLE1BQU07OztxQkFDdEc7d0JBQ08sUUFBUSxPQUFPLFVBQVUsS0FBSyxtQkFBbUI7O3dCQUFRLFFBQVEsTUFBTTs7d0JBQ3ZFLFFBQVEsT0FBTyxVQUFVLEtBQUssbUJBQW1COzt3QkFBUSxRQUFRLE1BQU0sTUFBSyxNQUFNOzs7Ozs7UUFFakc7Ozs7WUFFSSxPQUFNLEtBQUssS0FBTSxLQUFLO2dCQUNGLElBQUk7O2dCQUF4QixJQUFJLE9BQVE7O2dCQUNRLElBQUk7O2dCQUF4QixJQUFJLFFBQVE7O2dCQUNRLElBQUk7O2dCQUF4QixJQUFJLFFBQVE7O1lBQ1osS0FBQyxPQUFPLE1BQU0sS0FBSzttQkFDbkI7O1lBRUQsUUFBUSxPQUFPLFVBQVUsS0FBSyxvQkFBb0IsSUFBSTs7WUFBUSxRQUFRLE1BQU0sTUFBSyxNQUFNOztZQUN2RixRQUFRLE9BQU8sVUFBVSxLQUFLLHFCQUFxQixJQUFJOztZQUFRLFFBQVEsTUFBTSxNQUFLLE1BQU0sS0FBSyxNQUFNOztZQUNuRyxRQUFRLE9BQU8sVUFBVSxLQUFLLHdCQUF3QixJQUFJOztZQUFRLFFBQVEsTUFBTSxNQUFLLE1BQU07O1lBRTNGLFFBQVEsT0FBTyxVQUFVLEtBQUs7O1lBQXNCLFFBQVEsTUFBTTs7WUFDbEUsUUFBUSxPQUFPLFVBQVUsS0FBSzs7bUJBQWEsUUFBUSxNQUFLLEtBQUs7Ozs7Ozs7O1FBVWhFLFFBQVEsS0FBSyxNQUFNO1FBRW5CLEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUVoQjs7OztZQUN0QixLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7Ozs7O2VBRUYifQ==
//# sourceURL=file://kode/ked/index/index_kim.kode
