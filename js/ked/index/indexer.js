var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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

    indexer.prototype["addFuncInfo"] = function (funcName, funcInfo)
    {
        var funcInfos, _36_37_

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
        funcInfos = ((_36_37_=this.funcs[funcName]) != null ? _36_37_ : [])
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
        var clss, func, funcAdded, funcInfo, indexr, parsed, word, _103_29_

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
        if (!_k_.empty(parsed.words))
        {
            fileInfo.words = parsed.words
            var list2 = _k_.list(parsed.words)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                word = list2[_c_]
                this.words[word] = ((_103_29_=this.words[word]) != null ? _103_29_ : new Set())
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
        var currentClass, fileExt, fileInfo, funcAdded, funcStack, hash, isCpp, isHpp, isJS, lines, text, _130_27_

        await new Promise(function (resolve)
        {
            return setImmediate(resolve)
        })
        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return
        }
        fileExt = ((_130_27_=(opt != null ? opt.ext : undefined)) != null ? _130_27_ : slash.ext(file))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU87SUFBTztJQUFTO0lBQUs7SUFBSTtJQUFPO0lBQU07SUFBSzs7T0FDbEQsZUFBVDs7T0FDUyxhQUFBO09BQU8sa0JBQUE7T0FBWSxpQkFBQTtPQUFXLGlCQUFBO09BQVcsaUJBQUE7T0FBVyxpQkFBQTtPQUFXLGVBQUE7T0FBUyxnQkFBQTtPQUFVLGVBQUE7T0FBUyxnQkFBQTtPQUFVLGdCQUFBO09BQVUsZ0JBQUE7T0FBVSxnQkFBQTs7O0FBRXhJLFdBQUQ7O2FBRUk7Ozs7UUFFSSxRQUFRLFlBQVk7UUFFcEIsS0FBSyxHQUFHLGtCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxtQkFBZTs7bUJBQVMsS0FBQyxNQUFNOztRQUN2QyxLQUFLLEdBQUcseUJBQWU7O2dCQUNoQixLQUFDLE1BQU0sS0FBSzs7dUJBQ1gsS0FBQyxNQUFNLEtBQUssTUFBSyxRQUFROzs7UUFFakMsS0FBQyxPQUFVLE9BQU8sT0FBTztRQUN6QixLQUFDLFFBQVUsT0FBTyxPQUFPO1FBQ3pCLEtBQUMsVUFBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxRQUFVLE9BQU8sT0FBTztRQUN6QixLQUFDLFFBQVUsT0FBTyxPQUFPOzs7SUFFN0IsU0FBQyxtQkFBTTs7ZUFBUSxLQUFDLFVBQVUsTUFBTTs7O3VCQUVoQywwQkFBYSxVQUFTOzs7O2FBRVI7Ozs7WUFFUCxTQUFTLFNBQVMsS0FBTSxTQUFTLFdBQVc7O1lBQzNDLFdBQVcsU0FBUyxNQUFNO1lBQzFCLFNBQVMsU0FBUzs7UUFFdEIsU0FBUyxPQUFPO1FBRWhCLHNCQUFZLEtBQUMsTUFBTTtjQUNnQixVQUFiOztZQUF0Qjs7UUFDQSxVQUFVLEtBQUs7UUFDZixLQUFDLE1BQU0sWUFBWTtlQUVuQjs7O3VCQUVKLHdCQUFXLFdBQVUsVUFBUyxNQUFLLElBQUcsT0FBTSxP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/indexer.kode
