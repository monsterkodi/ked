var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var prjcts

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

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

    prjcts["index"] = async function (file)
    {
        var exists, prjPath, result, walk, _58_19_

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
            this.queue = ((_58_19_=this.queue) != null ? _58_19_ : [])
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

export default prjcts;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9wcmpjdHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsYUFBVDtPQUFnQixhQUFoQjs7O0FBRU4sVUFBRDs7Ozs7SUFFSSxRQUFDO0lBQ0QsUUFBQztJQUNELFFBQUM7SUFDRCxRQUFDLGFBQVU7SUFFWCxRQUFDLG9CQUFPOzs7OzBCQUFRLEtBQUMsU0FBUyxLQUFDLElBQUksaUJBQWYsS0FBQyxTQUFTLEtBQUMsSUFBSSxPQUFROzs7SUFFdkMsUUFBQyxrQkFBSzs7Ozt1QkFFTzs7WUFFTCxPQUFPLE1BQU0sU0FBUyxLQUFLLFFBQVE7Z0JBRWhDLFVBQVUsS0FBQyxTQUFTOzt1QkFDakI7O2dCQUNILE9BQU8sU0FBUzs7dUJBQ2IsS0FBQyxTQUFTLE1BQU07O2lCQUNsQixXQUFtQixPQUFPOztnQkFBbEIsVUFBVyxPQUFPO29CQUN2QixLQUFLLFdBQVc7OzJCQUNiOzs7O1FBQ2QsWUFBSSxlQUFlO2VBQ25COzs7SUFFSixRQUFDLDBCQUFPOzs7O2NBRVcsVUFBUjs7WUFDSCxjQUFNLHdDQUF3Qzs7O1lBRzdDLEtBQUssV0FBVzs7OztRQUVyQixPQUFPLE1BQU0sU0FBUyxLQUFLLFFBQVE7UUFJbkMsZUFBVSxJQUFJLE9BQU87YUFFWjs7OztRQUVULGdCQUFXLElBQUksSUFBSTtZQUlELFlBQVc7O1lBQTdCLFVBQVU7O1FBRVYsV0FBQSxrQkFBQSxVQUFXLE1BQU0sSUFBSTtZQUlsQixLQUFDOztnQkFDSyxLQUFDLGFBQVk7Ozs7WUFDbEIsS0FBQyxrQkFBRCxLQUFDO3lCQUNFLFFBQWUsS0FBQzs7Z0JBQ2YsS0FBQyxNQUFNLEtBQUs7Ozs7dUJBR1QsS0FBQyxTQUFTOzs7O1FBRXJCLEtBQUMsV0FBVztRQUVaLFdBQVcsUUFDUCxLQUFZLFFBQ1osU0FBWSxPQUFPLEtBQUssUUFBUSxTQUNoQyxPQUFZLE9BQU8sS0FBSyxRQUFRLE9BQ2hDLFdBQVksT0FBTyxLQUFLLHFCQUN4QixTQUFZO1FBSWhCLGVBQVUsS0FBSztZQUVaOztZQUNDLEtBQUMsU0FBUyxZQUFXLElBQUksUUFBUSxNQUFNLE9BQU87Z0NBQ2xDLE9BQU87OztnQkFBZjtnQkFDQSxLQUFDLFNBQVMsUUFBUTs7WUFJdEIsS0FBSyxLQUFLLGtCQUFrQjs7ZUFFekIsS0FBQzt1QkFFQyxLQUFDOzt5QkFFSixLQUFDLE1BQU0sS0FBQyxNQUFNOzs7O1dBdEYzQjs7O2VBd0ZNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/prjcts.kode
