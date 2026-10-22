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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfa2ltLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9pbmRleF9raW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsa0JBQUE7OztBQUVQLGFBQVQ7O2FBRUk7Ozt5QkFRQSx3QkFBVyxPQUFNOzs7O1lBRVYsUUFBUSxPQUFPLFVBQVUsS0FBSzs7WUFDN0IsTUFBTSxPQUFPO1lBQ2IsTUFBTSxPQUFPO1lBQ2IsS0FBQyxPQUFPLFFBQVEsS0FBSzs7O1lBR3RCLFFBQVEsT0FBTyxVQUFVLEtBQUs7O1lBQzdCLE1BQU0sT0FBTztZQUNiLE1BQU0sT0FBTztZQUNiLEtBQUMsT0FBTyxRQUFRLEtBQUs7OztRQUd6QiwwQkFBaUI7OzRCQUFTLE1BQWEsS0FBSSxNQUFLLFFBQU8sU0FBUSxTQUFROztRQUN2RSwyQkFBaUI7O21CQUFTLFNBQVUsY0FBYyxNQUFNOztRQUV4RCxzQkFBWTs7WUFFUixRQUFRLE9BQU8sVUFBVSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO2dCQUNwRCxlQUFlOzt1QkFDZDs7O1lBRUwsS0FBQyxPQUFPLFFBQVE7O1lBRWYsWUFBWSxLQUFDLE9BQU8scUJBQVk7WUFDaEMsWUFBWSxLQUFDLE9BQU8scUJBQVk7WUFFaEMscUJBQVUsTUFBSzs7OztnQkFFWCxPQUFNLE9BQU8sS0FBSyxLQUFLLE1BQU0sTUFBTTtvQkFDZixJQUFJOztvQkFBeEIsSUFBSSxRQUFROztnQkFDWixLQUFDLE9BQU8sTUFBTSxLQUFLO3VCQUNuQjs7b0JBRUc7O3FCQUNIO3dCQUNPLFFBQVEsT0FBTyxVQUFVLHlCQUF5QixtQkFBbUIsSUFBSTs7d0JBQVEsUUFBUSxNQUFNOzs7cUJBQ3RHO3dCQUNPLFFBQVEsT0FBTyxVQUFVLEtBQUssbUJBQW1COzt3QkFBUSxRQUFRLE1BQU07O3dCQUN2RSxRQUFRLE9BQU8sVUFBVSxLQUFLLG1CQUFtQjs7d0JBQVEsUUFBUSxNQUFNLE1BQUssTUFBTTs7Ozs7O1FBRWpHLHFCQUFVLE1BQUs7Ozs7WUFFWCxPQUFNLEtBQUssS0FBTSxLQUFLO2dCQUNGLElBQUk7O2dCQUF4QixJQUFJLE9BQVE7O2dCQUNRLElBQUk7O2dCQUF4QixJQUFJLFFBQVE7O2dCQUNRLElBQUk7O2dCQUF4QixJQUFJLFFBQVE7O1lBQ1osS0FBQyxPQUFPLE1BQU0sS0FBSzttQkFDbkI7O1lBRUQsUUFBUSxPQUFPLFVBQVUsS0FBSyxvQkFBb0IsSUFBSTs7WUFBUSxRQUFRLE1BQU0sTUFBSyxNQUFNOztZQUN2RixRQUFRLE9BQU8sVUFBVSxLQUFLLHFCQUFxQixJQUFJOztZQUFRLFFBQVEsTUFBTSxNQUFLLE1BQU0sS0FBSyxNQUFNOztZQUNuRyxRQUFRLE9BQU8sVUFBVSxLQUFLLHdCQUF3QixJQUFJOztZQUFRLFFBQVEsTUFBTSxNQUFLLE1BQU07O1lBRTNGLFFBQVEsT0FBTyxVQUFVLEtBQUs7O1lBQXNCLFFBQVEsTUFBTTs7WUFDbEUsUUFBUSxPQUFPLFVBQVUsS0FBSzs7bUJBQWEsUUFBUSxNQUFLLEtBQUs7Ozs7eUJBUXBFLG9CQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRWhCO2FBQWI7O1lBQVQ7WUFDQSxLQUFDLFVBQVUsVUFBVTs7ZUFFekIsS0FBQzs7O1dBbkZBOzs7ZUFxRkYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_kim.kode
