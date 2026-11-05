var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var indexer

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
import index_noon from "./index_noon.js"
import index_json from "./index_json.js"
import index_styl from "./index_styl.js"
import index_js from "./index_js.js"
import index_hpp from "./index_hpp.js"
import index_mm from "./index_mm.js"
import index_md from "./index_md.js"
import index_nim from "./index_nim.js"
import index_kim from "./index_kim.js"
import index_lua from "./index_lua.js"
import index_kua from "./index_kua.js"


indexer = (function ()
{
    function indexer ()
    {
        this["index"] = this["index"].bind(this)
        this["onProjectIndexed"] = this["onProjectIndexed"].bind(this)
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

    indexer["file"] = function (file)
    {
        return this.singleton.files[file]
    }

    indexer.prototype["classInfo"] = function (className)
    {
        return this.classes[className]
    }

    indexer.prototype["methodsOfClass"] = function (className)
    {
        var clss, methods

        clss = this.classInfo(className)
        if (_k_.empty((clss != null ? clss.methods : undefined)))
        {
            return []
        }
        methods = Object.values(clss.methods)
        methods.sort(function (a, b)
        {
            return a.line - b.line
        })
        return methods
    }

    indexer.prototype["baseClassesOf"] = function (className)
    {
        var classes, clss, seen

        classes = []
        seen = {}
        while (className && !seen[className])
        {
            seen[className] = true
            clss = this.classInfo(className)
            if (_k_.empty(clss))
            {
                return classes
            }
            classes.push(clss)
            className = clss.base
        }
        return classes
    }

    indexer.prototype["addFuncInfo"] = function (funcName, funcInfo)
    {
        var funcInfos, _61_37_

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
        funcInfos = ((_61_37_=this.funcs[funcName]) != null ? _61_37_ : [])
        if (!(_k_.isArr(funcInfos)))
        {
            funcInfos = []
        }
        funcInfos.push(funcInfo)
        this.funcs[funcName] = funcInfos
        return funcInfo
    }

    indexer.prototype["addMethod"] = function (className, funcName, file, li, async, bound, statik = false)
    {
        var funcInfo

        funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,class:className,async:async,bound:bound,static:statik})
        sds.set(this.classes,`${className}.methods.${funcInfo.name}`,funcInfo)
        return funcInfo
    }

    indexer.prototype["removeFile"] = function (file)
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

    indexer.prototype["applyIndexer"] = function (file, fileInfo, text, indexerClass)
    {
        var clss, func, funcAdded, funcInfo, indexr, parsed, word, _133_29_

        indexr = new indexerClass
        parsed = indexr.parse(text)
        funcAdded = !_k_.empty((parsed.classes)) || !_k_.empty((parsed.funcs))
        var list = _k_.list(parsed.classes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            sds.set(this.classes,`${clss.name}.name`,clss.name)
            sds.set(this.classes,`${clss.name}.file`,file)
            sds.set(this.classes,`${clss.name}.line`,clss.line + 1)
            sds.set(this.classes,`${clss.name}.base`,clss.base)
            fileInfo.classes.push({clss:true,name:clss.name,line:clss.line + 1})
            if (clss.base)
            {
                fileInfo.classes.slice(-1)[0].base = clss.base
            }
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
        if (!_k_.empty(parsed.words))
        {
            fileInfo.words = parsed.words
            var list2 = _k_.list(parsed.words)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                word = list2[_c_]
                this.words[word] = ((_133_29_=this.words[word]) != null ? _133_29_ : new Set())
                this.words[word].add(file)
            }
        }
        this.files[file] = fileInfo
        return post.emit('file.indexed',file,fileInfo)
    }

    indexer.prototype["onProjectIndexed"] = async function (prjDir)
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

    indexer.prototype["index"] = async function (file, opt)
    {
        var currentClass, fileExt, fileInfo, funcAdded, funcStack, hash, isCpp, isHpp, isJS, lines, text, _160_27_

        await new Promise(function (resolve)
        {
            return setImmediate(resolve)
        })
        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return
        }
        fileExt = ((_160_27_=(opt != null ? opt.ext : undefined)) != null ? _160_27_ : slash.ext(file))
        if (_k_.in(fileExt,fileutil.imageExtensions))
        {
            this.files[file] = {}
            return
        }
        text = await nfs.read(file)
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
        else if (fileExt === 'md')
        {
            return this.applyIndexer(file,fileInfo,text,index_md)
        }
        else if (fileExt === 'styl')
        {
            return this.applyIndexer(file,fileInfo,text,index_styl)
        }
        else if (fileExt === 'kode')
        {
            return this.applyIndexer(file,fileInfo,text,index_kode)
        }
        else if (fileExt === 'noon')
        {
            return this.applyIndexer(file,fileInfo,text,index_noon)
        }
        else if (fileExt === 'json')
        {
            return this.applyIndexer(file,fileInfo,text,index_json)
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
        return this
    }

    return indexer
})()

export default indexer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU87SUFBTztJQUFTO0lBQUs7SUFBSTtJQUFPO0lBQU07SUFBSzs7T0FDbEQsZUFBVDs7T0FDUyxhQUFBO09BQU8sa0JBQUE7T0FBWSxpQkFBQTtPQUFXLGlCQUFBO09BQVcsaUJBQUE7T0FBVyxpQkFBQTtPQUFXLGVBQUE7T0FBUyxnQkFBQTtPQUFVLGVBQUE7T0FBUyxlQUFBO09BQVMsZ0JBQUE7T0FBVSxnQkFBQTtPQUFVLGdCQUFBO09BQVUsZ0JBQUE7OztBQUVqSixXQUFEOzthQUVJOzs7O1FBRUksUUFBUSxZQUFZO1FBRXBCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsbUJBQWU7O21CQUFTLEtBQUMsTUFBTTs7UUFDdkMsS0FBSyxHQUFHLHlCQUFlOztnQkFDaEIsS0FBQyxNQUFNLEtBQUs7O3VCQUNYLEtBQUMsTUFBTSxLQUFLLE1BQUssUUFBUTs7O1FBRWpDLEtBQUMsT0FBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxRQUFVLE9BQU8sT0FBTztRQUN6QixLQUFDLFVBQVUsT0FBTyxPQUFPO1FBQ3pCLEtBQUMsUUFBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxRQUFVLE9BQU8sT0FBTzs7O0lBRTdCLFNBQUMsbUJBQU07O2VBQVEsS0FBQyxVQUFVLE1BQU07Ozt1QkFFaEMsd0JBQVc7O2VBQWEsS0FBQyxRQUFROzs7dUJBRWpDLDZCQUFnQjs7OztRQUVaLE9BQU8sS0FBQyxVQUFVO3VCQUNKLGVBQUEsS0FBTTs7OztRQUVwQixVQUFVLE9BQU8sT0FBTyxLQUFLO1FBQzdCLFFBQVEsZUFBTSxHQUFFOzttQkFBTSxFQUFFLE9BQU8sRUFBRTs7ZUFDakM7Ozt1QkFFSiw0QkFBZTs7OztRQUVYO1FBQ0E7ZUFFTSxjQUFrQixLQUFLOztZQUN6QixLQUFLLGFBQWE7WUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/indexer.kode
