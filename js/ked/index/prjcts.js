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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9wcmpjdHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRVSxVQUFBO0lBQU07SUFBSztJQUFNOztPQUNYLGFBQVQ7O0FBRVAsTUFBTTs7SUFFRixPQUFDOztJQUNELE9BQUM7O0lBQ0QsT0FBQzs7SUFDRCxPQUFDLFdBQVU7O0lBRVgsT0FBQyxPQUFPOzs7OzBCQUFRLEtBQUMsU0FBUyxLQUFDLElBQUksaUJBQWYsS0FBQyxTQUFTLEtBQUMsSUFBSSxPQUFROzs7SUFFdkMsT0FBQyxLQUFLOzs7O3VCQUVPOztZQUVMLE9BQU8sTUFBTSxTQUFTLEtBQUssUUFBUTtnQkFFaEMsVUFBVSxLQUFDLFNBQVM7O3VCQUNoQjs7Z0JBQ0osT0FBTyxTQUFTOzt1QkFDWixLQUFDLFNBQVMsTUFBTTs7aUJBQ25CLFdBQW1CLE9BQU87O2dCQUFsQixVQUFXLE9BQU87b0JBQ3ZCLEtBQUssV0FBVzs7MkJBQ1o7Ozs7UUFDZixZQUFJLGVBQWU7ZUFDbkI7OztJQVFKLGFBQUMsT0FBTzs7OztjQUVXLFVBQVI7O1lBQ0gsY0FBTSx3Q0FBd0M7OztZQUc1QyxLQUFLLFdBQVc7Ozs7UUFFdEIsT0FBTyxNQUFNLFNBQVMsS0FBSyxRQUFRO1FBSW5DLGVBQVUsSUFBSSxPQUFPO2FBRVg7Ozs7UUFFVixnQkFBVyxJQUFJLElBQUk7WUFJRCxZQUFXOztZQUE3QixVQUFVOztRQUVWLFdBQUEsa0JBQUEsVUFBVyxNQUFNLElBQUk7WUFJbEIsS0FBQzs7Z0JBQ00sS0FBQyxhQUFZOzs7O1lBQ25CLEtBQUMsa0JBQUQsS0FBQzt5QkFDRSxRQUFlLEtBQUM7O2dCQUNmLEtBQUMsTUFBTSxLQUFLOzs7O3VCQUdSLEtBQUMsU0FBUzs7OztRQUV0QixLQUFDLFdBQVc7UUFFWixXQUFXLFFBQ1AsS0FBVSxRQUNWLFNBQVUsR0FDVixTQUFVO1FBSWQsZUFBVSxLQUFLO1lBRVo7O1lBQ0MsS0FBQyxTQUFTLFlBQVcsSUFBSSxRQUFRLE1BQU0sT0FBTztnQ0FDbEMsT0FBTzs7O2dCQUFmO2dCQUNBLEtBQUMsU0FBUyxRQUFROztZQUl0QixLQUFLLEtBQUssa0JBQWtCOztlQUV6QixLQUFDO3VCQUVDLEtBQUM7O3lCQUVKLEtBQUMsTUFBTSxLQUFDLE1BQU07Ozs7O2VBRXJCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/prjcts.kode
