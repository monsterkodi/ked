var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["onFileChange"] = this["onFileChange"].bind(this)
        indexer.singleton = this
        this.dirs = Object.create(null)
        this.files = Object.create(null)
        this.classes = Object.create(null)
        this.funcs = Object.create(null)
        this.words = Object.create(null)
        post.on('project.indexed',this.onProjectIndexed)
        post.on('index',(function (file)
        {
            return this.index(file)
        }).bind(this))
        post.on('file.change',this.onFileChange)
    }

    indexer.prototype["onFileChange"] = async function (info)
    {
        switch (info.change)
        {
            case 'create':
                if (_k_.in(slash.ext(info.path),fileutil.sourceFileExtensions))
                {
                    return await this.index(info.path)
                }
                break
            case 'delete':
                return this.removePath(info.path)

            case 'rename':
                return await this.renamePath(info.oldPath,info.path)

            case 'modify':
                if (this.files[info.path])
                {
                    return await this.index(info.path,{refresh:true})
                }
                break
        }

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
        var funcInfos, _73_37_

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
        funcInfos = ((_73_37_=this.funcs[funcName]) != null ? _73_37_ : [])
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
        var files, infos, name, word

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
        for (word in this.words)
        {
            files = this.words[word]
            files.delete(file)
            if (!files.size)
            {
                delete this.words[word]
            }
        }
        return delete this.files[file]
    }

    indexer.prototype["removePath"] = function (path)
    {
        var file, prefix

        if ((this.files[path] != null))
        {
            this.removeFile(path)
            return
        }
        prefix = path + '/'
        var list = _k_.list(Object.keys(this.files))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (file.startsWith(prefix))
            {
                this.removeFile(file)
            }
        }
    }

    indexer.prototype["renamePath"] = async function (oldPath, newPath)
    {
        var file, moved, pair, prefix

        if ((this.files[oldPath] != null))
        {
            this.removeFile(oldPath)
            if (_k_.in(slash.ext(newPath),fileutil.sourceFileExtensions))
            {
                await this.index(newPath)
            }
            return
        }
        prefix = oldPath + '/'
        moved = []
        var list = _k_.list(Object.keys(this.files))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (file.startsWith(prefix))
            {
                moved.push([file,`${newPath}${file.slice(oldPath.length)}`])
            }
        }
        var list1 = _k_.list(moved)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            pair = list1[_b_]
            this.removeFile(pair[0])
            if (_k_.in(slash.ext(pair[1]),fileutil.sourceFileExtensions))
            {
                await this.index(pair[1])
            }
        }
    }

    indexer.prototype["applyIndexer"] = function (file, fileInfo, text, indexerClass)
    {
        var clss, func, funcAdded, funcInfo, indexr, parsed, word, _181_29_

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
                this.words[word] = ((_181_29_=this.words[word]) != null ? _181_29_ : new Set())
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
        var currentClass, fileExt, fileInfo, funcAdded, funcStack, hash, isCpp, isHpp, isJS, lines, text, _208_27_

        await new Promise(function (resolve)
        {
            return setImmediate(resolve)
        })
        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return
        }
        fileExt = ((_208_27_=(opt != null ? opt.ext : undefined)) != null ? _208_27_ : slash.ext(file))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU87SUFBTztJQUFTO0lBQUs7SUFBSTtJQUFPO0lBQU07SUFBSzs7T0FDbEQsZUFBVDs7T0FDUyxhQUFBO09BQU8sa0JBQUE7T0FBWSxpQkFBQTtPQUFXLGlCQUFBO09BQVcsaUJBQUE7T0FBVyxpQkFBQTtPQUFXLGVBQUE7T0FBUyxnQkFBQTtPQUFVLGVBQUE7T0FBUyxlQUFBO09BQVMsZ0JBQUE7T0FBVSxnQkFBQTtPQUFVLGdCQUFBO09BQVUsZ0JBQUE7OztBQUVqSixXQUFEOzthQUVJOzs7OztRQUVJLFFBQVEsWUFBWTtRQUVwQixLQUFDLE9BQVUsT0FBTyxPQUFPO1FBQ3pCLEtBQUMsUUFBVSxPQUFPLE9BQU87UUFDekIsS0FBQyxVQUFVLE9BQU8sT0FBTztRQUN6QixLQUFDLFFBQVUsT0FBTyxPQUFPO1FBQ3pCLEtBQUMsUUFBVSxPQUFPLE9BQU87UUFFekIsS0FBSyxHQUFHLGtCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxtQkFBZTs7bUJBQVMsS0FBQyxNQUFNOztRQUN2QyxLQUFLLEdBQUcsY0FBYyxLQUFDOzs7dUJBRTNCLGlDQUFjOztnQkFFSCxLQUFLOztpQkFDUjsyQkFDTyxNQUFNLElBQUksS0FBSyxNQUFTLFNBQVM7O2lDQUM5QixLQUFDLE1BQU0sS0FBSzs7O2lCQUN0Qjt1QkFDSSxLQUFDLFdBQVcsS0FBSzs7aUJBQ3JCOzZCQUNNLEtBQUMsV0FBVyxLQUFLLFFBQVEsS0FBSzs7aUJBQ3BDO29CQUNPLEtBQUMsTUFBTSxLQUFLOztpQ0FDVCxLQUFDLE1BQU0sS0FBSyxNQUFLLFFBQVE7Ozs7Ozs7SUFFM0MsU0FBQyxtQkFBTTs7ZUFBUSxLQUFDLFVBQVUsTUFBTTs7O3VCQUVoQyx3QkFBVzs7ZUFBYSxLQUFDLFFBQVE7Ozt1QkFFakMsNkJBQWdCOzs7O1FBRVosT0FB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QXVCLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7aUJBQ3hELFlBQVc7O21CQUFZLEtBQUMsYUFBYSxLQUFLLFNBQVMsS0FBSzs7ZUFHNUQ7OztXQTlQUDs7O2VBZ1FNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/indexer.kode
