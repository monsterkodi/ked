var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var prjcts

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs
let pullIf = kxk.pullIf

import walker from "../util/walker.js"
import config from "../util/config.js"


prjcts = (function ()
{
    function prjcts ()
    {}

    prjcts["queue"] = []
    prjcts["projects"] = {}
    prjcts["allFiles"] = {}
    prjcts["indexing"] = null
    prjcts["files"] = function (path)
    {
        var _12_49_

        return ((_12_49_=(this.projects[this.dir(path)] != null ? this.projects[this.dir(path)].files : undefined)) != null ? _12_49_ : [])
    }

    prjcts["dir"] = function (path)
    {
        var prjPath, project

        if (!_k_.empty(path))
        {
            path = slash.absolute(path,process.cwd())
            if (prjPath = this.allFiles[path])
            {
                return prjPath
            }
            if (prjcts.projects[path])
            {
                return this.projects[path].dir
            }
            for (prjPath in prjcts.projects)
            {
                project = prjcts.projects[prjPath]
                if (path.startsWith(prjPath))
                {
                    return prjPath
                }
            }
        }
        console.log('missing prj?',path)
        return null
    }

    prjcts["addFile"] = async function (file)
    {
        var extensions, prjPath, project, _34_32_

        file = slash.absolute(file,process.cwd())
        extensions = (config.data != null ? config.data.sourceFileExtensions : undefined)
        if (extensions && !(_k_.in(slash.ext(file),extensions)))
        {
            return
        }
        prjPath = await nfs.prj(file)
        if (prjPath === '/')
        {
            prjPath = null
        }
        prjPath = (prjPath != null ? prjPath : slash.dir(file))
        project = this.projects[prjPath]
        if (!project)
        {
            return
        }
        if (_k_.in(file,project.files))
        {
            return
        }
        project.files.push(file)
        return this.allFiles[file] = prjPath
    }

    prjcts["removeFile"] = function (file)
    {
        var files, prjPath

        prjPath = this.allFiles[file]
        if (!prjPath)
        {
            return
        }
        delete this.allFiles[file]
        files = (this.projects[prjPath] != null ? this.projects[prjPath].files : undefined)
        if (files)
        {
            return pullIf(files,function (f)
            {
                return f === file
            })
        }
    }

    prjcts["removePath"] = function (path)
    {
        var file, prefix

        if (this.allFiles[path])
        {
            this.removeFile(path)
            return
        }
        prefix = path + '/'
        var list = _k_.list(Object.keys(this.allFiles))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (file.startsWith(prefix))
            {
                this.removeFile(file)
            }
        }
    }

    prjcts["renamePath"] = async function (oldPath, newPath)
    {
        var file, moved, pair, prefix

        if (this.allFiles[oldPath])
        {
            this.removeFile(oldPath)
            await this.addFile(newPath)
            return
        }
        prefix = oldPath + '/'
        moved = []
        var list = _k_.list(Object.keys(this.allFiles))
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
            await this.addFile(pair[1])
        }
    }

    prjcts["index"] = async function (file)
    {
        var exists, prjPath, result, walk, _117_19_

        if (!(_k_.isStr(file)))
        {
            console.error("prjcts.index - expected a string, got",file)
            return
        }
        if (file.startsWith('untitled-'))
        {
            return
        }
        file = slash.absolute(file,process.cwd())
        exists = await nfs.exists(file)
        if (!exists)
        {
            return
        }
        prjPath = await nfs.prj(file)
        if (prjPath === '/')
        {
            prjPath = null
        }
        prjPath = (prjPath != null ? prjPath : slash.dir(file))
        if (this.indexing)
        {
            if (this.indexing === prjPath)
            {
                return
            }
            this.queue = ((_117_19_=this.queue) != null ? _117_19_ : [])
            if (!(_k_.in(prjPath,this.queue)))
            {
                this.queue.push(prjPath)
            }
            return
        }
        if (!_k_.empty(this.projects[prjPath]))
        {
            return
        }
        this.indexing = prjPath
        walk = new walker({root:prjPath,maxDepth:config.data.project.maxDepth,ignore:config.data.project.ignore,includeExt:config.data.sourceFileExtensions,maxFiles:10000})
        result = await walk.start()
        if (result)
        {
            this.projects[prjPath] = {dir:prjPath,files:result.files}
            var list = _k_.list(result.files)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                this.allFiles[file] = prjPath
            }
            post.emit('project.indexed',prjPath)
        }
        delete this.indexing
        if (!_k_.empty(this.queue))
        {
            return await this.index(this.queue.shift())
        }
    }

    return prjcts
})()

post.on('file.change',async function (info)
{
    switch (info.change)
    {
        case 'create':
            return await prjcts.addFile(info.path)

        case 'delete':
            return prjcts.removePath(info.path)

        case 'rename':
            return await prjcts.renamePath(info.oldPath,info.path)

    }

})
export default prjcts;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9wcmpjdHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLO0lBQU07SUFBSTs7T0FDZixhQUFUO09BQWdCLGFBQWhCOzs7QUFFTixVQUFEOzs7OztJQUVJLFFBQUM7SUFDRCxRQUFDO0lBQ0QsUUFBQztJQUNELFFBQUMsYUFBVTtJQUVYLFFBQUMsb0JBQU87Ozs7MEJBQVEsS0FBQyxTQUFTLEtBQUMsSUFBSSxpQkFBZixLQUFDLFNBQVMsS0FBQyxJQUFJLE9BQVE7OztJQUV2QyxRQUFDLGtCQUFLOzs7O3VCQUVPOztZQUVMLE9BQU8sTUFBTSxTQUFTLEtBQUssUUFBUTtnQkFFaEMsVUFBVSxLQUFDLFNBQVM7O3VCQUNqQjs7Z0JBQ0gsT0FBTyxTQUFTOzt1QkFDYixLQUFDLFNBQVMsTUFBTTs7aUJBQ2xCLFdBQW1CLE9BQU87O2dCQUFsQixVQUFXLE9BQU87b0JBQ3ZCLEtBQUssV0FBVzs7MkJBQ2I7Ozs7UUFDZCxZQUFJLGVBQWU7ZUFDbkI7OztJQUVKLFFBQUMsNEJBQVM7Ozs7UUFFTixPQUFPLE1BQU0sU0FBUyxLQUFLLFFBQVE7UUFFbkMsY0FBYSxPQUFPLGVBQVAsT0FBTyxLQUFNO1lBQ3JCLHVCQUFlLE1BQU0sSUFBSSxNQUFhOzs7O1FBRTNDLGdCQUFXLElBQUksSUFBSTtZQUNELFlBQVc7O1lBQTdCLFVBQVU7O1FBQ1YsV0FBQSxrQkFBQSxVQUFXLE1BQU0sSUFBSTtRQUVyQixVQUFVLEtBQUMsU0FBUzthQUNYOzs7O21CQUNKLEtBQVEsUUFBUTs7OztRQUVyQixRQUFRLE1BQU0sS0FBSztlQUNuQixLQUFDLFNBQVMsUUFBUTs7O0lBRXRCLFFBQUMseUJBQVk7Ozs7UUFFVCxVQUFVLEtBQUMsU0FBUzthQUNYOzs7O2VBRUYsS0FBQyxTQUFTO1FBRWpCLFNBQVEsS0FBQyxTQUFTLG1CQUFWLEtBQUMsU0FBUyxTQUFVO1lBQ3pCOzttQkFDQyxPQUFPLGdCQUFPOzt1QkFBTSxNQUFLOzs7OztJQUVqQyxRQUFDLHlCQUFZOzs7O1lBRU4sS0FBQyxTQUFTOztZQUNULEtBQUMsV0FBVzs7O1FBR2hCLFNBQVMsT0FBTzs0QkFFSixPQUFPLEtBQUssS0FBQzs7O1lBQXJCO2dCQUNHLEtBQUssV0FBVzs7Z0JBQ2YsS0FBQyxXQUFXOzs7OztJQUV4QixRQUFDLCtCQUFZLFNBQVE7Ozs7WUFFZCxLQUFDLFNBQVM7O1lBQ1QsS0FBQyxXQUFXO2tCQUNWLEtBQUMsUUFBUTs7O1FBR2YsU0FBUyxVQUFVO1FBQ25COzRCQUVZLE9BQU8sS0FBSyxLQUFDOzs7WUFBckI7Z0JBQ0csS0FBSyxXQUFXOztnQkFDZixNQUFNLE1BQU0sUUFBUyxVQUFVLEtBQUssTUFBTSxRQUFROzs7NkJBRTlDOzs7WUFBUjtZQUNBLEtBQUMsV0FBVyxLQUFLO2tCQUNmLEtBQUMsUUFBUSxLQUFLOzs7O0lBRXhCLFFBQUMsMEJBQU87Ozs7Y0FFVyxVQUFSOztZQUNILGNBQU0sd0NBQXdDOzs7WUFHN0MsS0FBSyxXQUFXOzs7O1FBRXJCLE9BQU8sTUFBTSxTQUFTLEtBQUssUUFBUTtRQUluQyxlQUFVLElBQUksT0FBTzthQUVaOzs7O1FBRVQsZ0JBQVcsSUFBSSxJQUFJO1lBSUQsWUFBVzs7WUFBN0IsVUFBVTs7UUFFVixXQUFBLGtCQUFBLFVBQVcsTUFBTSxJQUFJO1lBSWxCLEtBQUM7O2dCQUNLLEtBQUMsYUFBWTs7OztZQUNsQixLQUFDLG1CQUFELEtBQUM7eUJBQ0UsUUFBZSxLQUFDOztnQkFDZixLQUFDLE1BQU0sS0FBSzs7Ozt1QkFHVCxLQUFDLFNBQVM7Ozs7UUFFckIsS0FBQyxXQUFXO1FBRVosV0FBVyxRQUNQLEtBQVksUUFDWixTQUFZLE9BQU8sS0FBSyxRQUFRLFNBQ2hDLE9BQVksT0FBTyxLQUFLLFFBQVEsT0FDaEMsV0FBWSxPQUFPLEtBQUsscUJBQ3hCLFNBQVk7UUFJaEIsZUFBVSxLQUFLO1lBRVo7O1lBQ0MsS0FBQyxTQUFTLFlBQVcsSUFBSSxRQUFRLE1BQU0sT0FBTztnQ0FDbEMsT0FBTzs7O2dCQUFmO2dCQUNBLEtBQUMsU0FBUyxRQUFROztZQUl0QixLQUFLLEtBQUssa0JBQWtCOztlQUV6QixLQUFDO3VCQUVDLEtBQUM7O3lCQUVKLEtBQUMsTUFBTSxLQUFDLE1BQU07Ozs7V0FqSjNCOzs7QUFtSkQsS0FBSyxHQUFHLDhCQUFlOztZQUVaLEtBQUs7O2FBQ1I7eUJBQ00sT0FBTyxRQUFRLEtBQUs7O2FBQzFCO21CQUNJLE9BQU8sV0FBVyxLQUFLOzthQUMzQjt5QkFDTSxPQUFPLFdBQVcsS0FBSyxRQUFRLEtBQUs7Ozs7O2VBRTNDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/prjcts.kode
