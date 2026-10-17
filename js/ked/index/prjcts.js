var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import walker from "../util/walker.js"

class prjcts
{
    static queue = []

    static projects = {}

    static allFiles = {}

    static indexing = null

    static files (path)
    {
        var _19_49_

        return ((_19_49_=(this.projects[this.dir(path)] != null ? this.projects[this.dir(path)].files : undefined)) != null ? _19_49_ : [])
    }

    static dir (path)
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

    static async index (file)
    {
        var exists, prjPath, result, walk, _71_19_

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
            this.queue = ((_71_19_=this.queue) != null ? _71_19_ : [])
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
        walk = new walker({root:prjPath,maxDepth:12,maxFiles:10000})
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
}

export default prjcts;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9wcmpjdHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBZ0JlOzs7Ozs7MEJBRUssS0FBQyxTQUFTLEtBQUMsSUFBSSxpQkFBZixLQUFDLFNBQVMsS0FBQyxJQUFJLE9BQVE7Ozs7Ozs7dUJBSTFCOztZQUVMLE9BQU8sTUFBTSxTQUFTLEtBQUssUUFBUTtnQkFFaEMsVUFBVSxLQUFDLFNBQVM7O3VCQUNoQjs7Z0JBQ0osT0FBTyxTQUFTOzt1QkFDWixLQUFDLFNBQVMsTUFBTTs7NEJBQ0EsT0FBTzs7MEJBQVAsT0FBTztvQkFDdkIsS0FBSyxXQUFXOzsyQkFDWjs7OztRQUNmLFlBQUksZUFBZTtlQUNuQjs7Ozs7Ozt3QkFVTzs7WUFDSCxjQUFNLHdDQUF3Qzs7O1lBRzVDLEtBQUssV0FBVzs7OztRQUV0QixPQUFPLE1BQU0sU0FBUyxLQUFLLFFBQVE7UUFJbkMsZUFBVSxJQUFJLE9BQU87YUFFWDs7OztRQUVWLGdCQUFXLElBQUksSUFBSTtZQUlELFlBQVc7O1lBQTdCLFVBQVU7O1FBRVYsV0FBQSxrQkFBQSxVQUFXLE1BQU0sSUFBSTtZQUlsQixLQUFDOztnQkFDTSxLQUFDLGFBQVk7Ozs7WUFDbkIsS0FBQyxrQkFBRCxLQUFDO3lCQUNFLFFBQWUsS0FBQzs7Z0JBQ2YsS0FBQyxNQUFNLEtBQUs7Ozs7dUJBR1IsS0FBQyxTQUFTOzs7O1FBRXRCLEtBQUMsV0FBVztRQUVaLFdBQVcsUUFDUCxLQUFVLFFBQ1YsU0FBVSxHQUNWLFNBQVU7UUFJZCxlQUFVLEtBQUs7WUFFWjs7WUFDQyxLQUFDLFNBQVMsWUFBVyxJQUFJLFFBQVEsTUFBTSxPQUFPO2dDQUNsQyxPQUFPOzs7O2dCQUNmLEtBQUMsU0FBUyxRQUFROztZQUl0QixLQUFLLEtBQUssa0JBQWtCOztlQUV6QixLQUFDO3VCQUVDLEtBQUM7O3lCQUVKLEtBQUMsTUFBTSxLQUFDLE1BQU07Ozs7O2VBRXJCIn0=
//# sourceURL=file://kode/ked/index/prjcts.kode
