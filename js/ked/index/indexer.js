var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../../kxk.js"
let pickBy = kxk.pickBy
let pullIf = kxk.pullIf
let deleteBy = kxk.deleteBy
let kstr = kxk.kstr
let sds = kxk.sds
let matchr = kxk.matchr
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

import fileutil from "../util/fileutil.js"

import prjcts from "./prjcts.js"
import index_utils from "./index_utils.js"
import index_kode from "./index_kode.js"
import index_styl from "./index_styl.js"
import index_js from "./index_js.js"
import index_hpp from "./index_hpp.js"
import index_mm from "./index_mm.js"
import index_nim from "./index_nim.js"
import index_kim from "./index_kim.js"
import index_lua from "./index_lua.js"
import index_kua from "./index_kua.js"

class indexer
{
    constructor ()
    {
        this.index = this.index.bind(this)
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        indexer.singleton = this
        post.on('project.indexed',this.onProjectIndexed)
        post.on('index',(function (file)
        {
            return this.index(file)
        }).bind(this))
        post.on('file.change',(function (info)
        {
            if (this.files[info.path])
            {
                return this.index(info.path,{refresh:true})
            }
        }).bind(this))
        this.dirs = Object.create(null)
        this.files = Object.create(null)
        this.classes = Object.create(null)
        this.funcs = Object.create(null)
        this.words = Object.create(null)
    }

    static file (file)
    {
        return this.singleton.files[file]
    }

    addFuncInfo (funcName, funcInfo)
    {
        var funcInfos, _57_37_

        if (!funcName)
        {
            return
        }
        if (funcName.length > 1 && funcName.startsWith('@'))
        {
            funcName = funcName.slice(1)
            funcInfo.static = true
        }
        funcInfo.name = funcName
        funcInfos = ((_57_37_=this.funcs[funcName]) != null ? _57_37_ : [])
        if (!(_k_.isArr(funcInfos)))
        {
            funcInfos = []
        }
        funcInfos.push(funcInfo)
        this.funcs[funcName] = funcInfos
        return funcInfo
    }

    addMethod (className, funcName, file, li, async, bound, statik = false)
    {
        var funcInfo

        funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,class:className,async:async,bound:bound,static:statik})
        sds.set(this.classes,`${className}.methods.${funcInfo.name}`,funcInfo)
        return funcInfo
    }

    removeFile (file)
    {
        var infos, name

        if (!(this.files[file] != null))
        {
            return
        }
        for (name in this.funcs)
        {
            infos = this.funcs[name]
            pullIf(infos,function (v)
            {
                return v.file === file
            })
            if (!infos.length)
            {
                delete this.funcs[name]
            }
        }
        deleteBy(this.classes,function (k, v)
        {
            return v.file === file
        })
        return delete this.files[file]
    }

    applyIndexer (file, fileInfo, text, indexerClass)
    {
        var clss, func, funcAdded, funcInfo, indexr, parsed

        indexr = new indexerClass
        parsed = indexr.parse(text)
        funcAdded = !_k_.empty((parsed.classes)) || !_k_.empty((parsed.funcs))
        var list = _k_.list(parsed.classes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            sds.set(this.classes,`${clss.name}.file`,file)
            sds.set(this.classes,`${clss.name}.line`,clss.line + 1)
            fileInfo.classes.push({clss:true,name:clss.name,line:clss.line + 1})
        }
        var list1 = _k_.list(parsed.funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            if (func.method)
            {
                funcInfo = this.addMethod(func.class,func.method,file,func.line,func.async,func.bound,func.static)
            }
            else
            {
                func.line = func.line + 1
                func.file = file
                funcInfo = this.addFuncInfo(func.name,func)
            }
            fileInfo.funcs.push(funcInfo)
        }
        this.files[file] = fileInfo
        return post.emit('file.indexed',file,fileInfo)
    }

    async onProjectIndexed (prjDir)
    {
        var file, files

        files = prjcts.projects[prjDir].files
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            await this.index(file)
        }
    }

    async index (file, opt)
    {
        var fileExt

        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return
        }
        fileExt = slash.ext(file)
        if (_k_.in(fileExt,fileutil.imageExtensions))
        {
            this.files[file] = {}
            return
        }
        nfs.read(file).then((function (text)
        {
            var currentClass, fileInfo, funcAdded, funcStack, hash, isCpp, isHpp, isJS, lines

            if (_k_.empty(text))
            {
                return
            }
            hash = kstr.hash(text)
            if ((this.files[file] != null ? this.files[file].hash : undefined) === hash)
            {
                post.emit('file.indexed',file,this.files[file])
                return
            }
            lines = text.split(/\r?\n/)
            fileInfo = {lines:lines.length,funcs:[],classes:[],hash:hash}
            funcAdded = false
            funcStack = []
            currentClass = null
            isCpp = _k_.in(fileExt,['cpp','cc','c','frag','vert'])
            isHpp = _k_.in(fileExt,['hpp','h'])
            isJS = _k_.in(fileExt,['js','mjs'])
            if (isHpp || isCpp)
            {
                return this.applyIndexer(file,fileInfo,text,index_hpp)
            }
            else if (isJS)
            {
                return this.applyIndexer(file,fileInfo,text,index_js)
            }
            else if (fileExt === 'mm')
            {
                return this.applyIndexer(file,fileInfo,text,index_mm)
            }
            else if (fileExt === 'styl')
            {
                return this.applyIndexer(file,fileInfo,text,index_styl)
            }
            else if (fileExt === 'kode')
            {
                return this.applyIndexer(file,fileInfo,text,index_kode)
            }
            else if (fileExt === 'nim')
            {
                return this.applyIndexer(file,fileInfo,text,index_nim)
            }
            else if (fileExt === 'lua')
            {
                return this.applyIndexer(file,fileInfo,text,index_lua)
            }
            else if (fileExt === 'kim')
            {
                return this.applyIndexer(file,fileInfo,text,index_kim)
            }
            else if (fileExt === 'kua')
            {
                return this.applyIndexer(file,fileInfo,text,index_kua)
            }
        }).bind(this))
        return this
    }
}

export default indexer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF3QlEsUUFBUSxZQUFZO1FBRXBCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUc7O21CQUF3QixLQUFDLE1BQU07O1FBQ3ZDLEtBQUssR0FBRzs7Z0JBQ0QsS0FBQyxNQUFNLEtBQUs7O3VCQUNYLEtBQUMsTUFBTSxLQUFLLE1BQUssUUFBUTs7O1FBRWpDLEtBQUMsT0FBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxRQUFVLE9BQU8sT0FBTztRQUN6QixLQUFDLFVBQVUsT0FBTyxPQUFPO1FBQ3pCLEtBQUMsUUFBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxRQUFVLE9BQU8sT0FBTzs7Ozs7ZUFFZCxLQUFDLFVBQVUsTUFBTTs7Ozs7OzthQVVsQjs7OztZQUVQLFNBQVMsU0FBUyxLQUFNLFNBQVMsV0FBVzs7WUFDM0MsV0FBVyxTQUFTLE1BQU07WUFDMUIsU0FBUyxTQUFTOztRQUV0QixTQUFTLE9BQU87UUFFaEIsc0JBQVksS0FBQyxNQUFNO3dCQUNHOztZQUF0Qjs7UUFDQSxVQUFVLEtBQUs7UUFDZixLQUFDLE1BQU0sWUFBWTtlQUVuQjs7Ozs7OztRQUlBLFdBQVcsS0FBQyxZQUFZLFVBQ3BCLEtBQVEsS0FBRyxFQUNYLEtBQVEsS0FDUixNQUFRLFVBQ1IsTUFBUSxNQUNSLE1BQVEsTUFDUixPQUFRO1FBRVosSUFBSSxJQUFJLEtBQUMsV0FBVyxxQkFBcUIsU0FBUyxPQUFPO2VBRXpEOzs7Ozs7O2NBVVUsS0FBQyxNQUFNOzs7O3FCQUVDLEtBQUM7O29CQUFELEtBQUM7WUFDZixPQUFPOzt1QkFBYSxFQUFFLFNBQVE7O2lCQUNILE1BQU07O3VCQUExQixLQUFDLE1BQU07OztRQUVsQixTQUFTLEtBQUM7O21CQUFpQixFQUFFLFNBQVE7O3NCQUU5QixLQUFDLE1BQU07Ozs7Ozs7UUFVZCxhQUFhO1FBQ2IsU0FBUyxPQUFPLE1BQU07UUFJdEIsd0JBQXNCLE9BQU8seUJBQXNCLE9BQU87NEJBRTlDLE9BQU87Ozs7WUFFZixJQUFJLElBQUksS0FBQyxXQUFXLEtBQUssWUFBWTtZQUNyQyxJQUFJLElBQUksS0FBQyxXQUFXLEtBQUssWUFBWSxLQUFLLE9BQUs7WUFFL0MsU0FBUyxRQUFRLE1BQ2IsS0FBTSxLQUNOLEtBQU0sS0FBSyxLQUNYLEtBQU0sS0FBSyxPQUFLOzs2QkFFWixPQUFPOzs7O2dCQUVaLEtBQUs7O2dCQUNKLFdBQVcsS0FBQyxVQUFVLEtBQUssTUFBTSxLQUFLLE9BQU8sS0FBSyxLQUFLLEtBQUssS0FBSyxNQUFNLEtBQUssTUFBTSxLQUFLOzs7O2dCQUV2RixLQUFLLE9BQU8sS0FBSyxPQUFLO2dCQUN0QixLQUFLLE9BQU87Z0JBQ1osV0FBVyxLQUFDLFlBQVksS0FBSyxLQUFLOztZQUV0QyxTQUFTLE1BQU0sS0FBSzs7UUFFeEIsS0FBQyxNQUFNLFFBQVE7ZUFDZixLQUFLLEtBQUssZUFBZSxLQUFLOzs7Ozs7O1FBVTlCLFFBQVEsT0FBTyxTQUFTLFFBQVE7NEJBQ3BCOzs7O2tCQUNOLEtBQUMsTUFBTTs7Ozs7Ozs7YUFZVixLQUFDLE1BQU0sb0JBQWUsY0FBQSxJQUFLOztZQUUxQixLQUFLLEtBQUssZUFBZSxLQUFLLEtBQUMsTUFBTTs7O1FBS3pDLFVBQVUsTUFBTSxJQUFJO21CQUVqQixRQUFXLFNBQVM7O1lBQ25CLEtBQUMsTUFBTTs7O1FBR1gsSUFBSSxLQUFLLE1BQU07Ozs7MEJBRUM7Ozs7WUFHWixPQUFPLEtBQUssS0FBSztpQkFHZCxLQUFDLE1BQU0sZ0JBQVAsS0FBQyxNQUFNLE1BQU8sc0JBQVE7O2dCQUVyQixLQUFLLEtBQUssZUFBZSxLQUFLLEtBQUMsTUFBTTs7O1lBSXpDLFFBQVEsS0FBSyxNQUFNO1lBRW5CLFlBQ0ksTUFBUyxNQUFNLE9BQ2YsU0FDQSxXQUNBLEtBQVM7WUFFYixZQUFZO1lBQ1o7WUFDQSxlQUFlO1lBRWYsZUFBUSxTQUFZLE1BQU0sS0FBSyxJQUFJLE9BQU87WUFDMUMsZUFBUSxTQUFZLE1BQU07WUFDMUIsY0FBUSxTQUFZLEtBQUs7Z0JBSXJCLFNBQVM7O3VCQUFjLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7cUJBQ3hEOzt1QkFBdUIsS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOztxQkFDeEQsWUFBVzs7dUJBQVksS0FBQyxhQUFhLEtBQUssU0FBUyxLQUFLOzs7ZUFHaEU7Ozs7ZUFFRCJ9
//# sourceURL=file://kode/ked/index/indexer.kode
