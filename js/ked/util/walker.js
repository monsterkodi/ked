var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import kxk from "../../kxk.js"
let slash = kxk.slash

import nfs from "../../kxk/nfs.js"

import fileutil from "./fileutil.js"

class walker
{
    constructor (cfg)
    {
        this.cfg = cfg
    
        var _18_25_, _19_25_, _20_25_, _21_25_, _22_25_, _23_25_, _24_25_

        this.stop = this.stop.bind(this)
        this.start = this.start.bind(this)
        this.cfg.files = []
        this.cfg.maxDepth = ((_18_25_=this.cfg.maxDepth) != null ? _18_25_ : 3)
        this.cfg.dotFiles = ((_19_25_=this.cfg.dotFiles) != null ? _19_25_ : false)
        this.cfg.maxFiles = ((_20_25_=this.cfg.maxFiles) != null ? _20_25_ : 15000)
        this.cfg.ignore = ((_21_25_=this.cfg.ignore) != null ? _21_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_22_25_=this.cfg.include) != null ? _22_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_23_25_=this.cfg.ignoreExt) != null ? _23_25_ : ['asar'])
        this.cfg.includeExt = ((_24_25_=this.cfg.includeExt) != null ? _24_25_ : fileutil.sourceFileExtensions)
    }

    async start ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _58_31_, _86_17_

        dir = this.cfg.root
        this.running = true
        toWalk = [dir]
        while (!_k_.empty(toWalk))
        {
            listDir = toWalk.shift()
            items = await nfs.list(listDir,{recursive:false})
            var list = _k_.list(items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                file = item.file
                ext = slash.ext(file)
                p = item.path
                if ((typeof this.cfg.filter === "function" ? this.cfg.filter(p) : undefined))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,['.DS_Store','Icon\r']) || _k_.in(ext,['pyc']))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,this.cfg.ignore))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,this.cfg.include))
                {
                    this.cfg.files.push(item.path)
                }
                else if (file.startsWith('.'))
                {
                    if (this.cfg.dotFiles)
                    {
                        this.cfg.files.push(item.path)
                    }
                    else
                    {
                        this.ignore(p)
                        continue
                    }
                }
                else if (_k_.in(ext,this.cfg.ignoreExt))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(ext,this.cfg.includeExt) || this.cfg.includeExt.indexOf('') >= 0)
                {
                    this.cfg.files.push(item.path)
                }
                if (_k_.isFunc(this.cfg.path))
                {
                    this.cfg.path(item.path)
                }
                if (item.type === 'dir')
                {
                    if (_k_.isFunc(this.cfg.dir))
                    {
                        if (!this.cfg.dir(item.path))
                        {
                            continue
                        }
                    }
                    toWalk.push(item.path)
                }
                else
                {
                    if (_k_.in(ext,this.cfg.includeExt) || _k_.in(slash.file(item.path),this.cfg.include) || this.cfg.includeExt.indexOf('') >= 0)
                    {
                        if (_k_.isFunc(this.cfg.file))
                        {
                            this.cfg.file(item.path)
                        }
                    }
                }
                if (this.cfg.files.length > this.cfg.maxFiles)
                {
                    console.log('maxFiles reached')
                    break
                }
            }
        }
        this.running = false
        ;(typeof this.cfg.done === "function" ? this.cfg.done(this) : undefined)
        return this.cfg
    }

    stop ()
    {
        this.running = false
        return this.walker = null
    }

    ignore (p)
    {}
}

export default walker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3dhbGtlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0JRLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSSxxQkFBTCxLQUFDLElBQUksOEJBQWU7UUFDcEIsS0FBQyxJQUFJLHFCQUFMLEtBQUMsSUFBSSw4QkFBZTtRQUNwQixLQUFDLElBQUkscUJBQUwsS0FBQyxJQUFJLDhCQUFlO1FBQ3BCLEtBQUMsSUFBSSxtQkFBTCxLQUFDLElBQUksNkJBQWdCLGVBQWUsUUFBUSxRQUFRLFVBQVU7UUFDOUQsS0FBQyxJQUFJLG9CQUFMLEtBQUMsSUFBSSw4QkFBZ0IsZUFBZSxhQUFhO1FBQ2pELEtBQUMsSUFBSSxzQkFBTCxLQUFDLElBQUksZ0NBQWdCO1FBQ3JCLEtBQUMsSUFBSSx1QkFBTCxLQUFDLElBQUksZ0NBQWUsU0FBUzs7Ozs7OztRQVU3QixNQUFNLEtBQUMsSUFBSTtRQUlYLEtBQUMsVUFBVTtRQUVYLFVBQVU7MEJBRUU7O1lBRVIsVUFBVSxPQUFPO1lBSWpCLGNBQVUsSUFBSSxLQUFLLFNBQVEsVUFBVTtnQ0FHekI7Ozs7Z0JBRVIsT0FBTyxLQUFLO2dCQUNaLE1BQU0sTUFBTSxJQUFJO2dCQUNoQixJQUFJLEtBQUs7NEJBR0wsS0FBQyxJQUFJLHdCQUFMLEtBQUMsSUFBSSxPQUFROztvQkFBSyxLQUFDLE9BQU87b0JBQUc7O2dDQUM3QixNQUFTLFlBQVkscUJBQWEsS0FBUTs7b0JBQVMsS0FBQyxPQUFPO29CQUFHOztnQ0FDOUQsS0FBUSxLQUFDLElBQUk7O29CQUFTLEtBQUMsT0FBTztvQkFBRzs7Z0NBQ2pDLEtBQVEsS0FBQyxJQUFJOztvQkFBVSxLQUFDLElBQUksTUFBTSxLQUFLLEtBQUs7O3lCQUM1QyxLQUFLLFdBQVc7O3dCQUNULEtBQUMsSUFBSTs7d0JBQ0osS0FBQyxJQUFJLE1BQU0sS0FBSyxLQUFLOzs7O3dCQUVyQixLQUFDLE9BQU87d0JBQUc7OztnQ0FDbkIsSUFBTyxLQUFDLElBQUk7O29CQUFZLEtBQUMsT0FBTztvQkFBRzs7Z0NBQ25DLElBQU8sS0FBQyxJQUFJLGVBQWMsS0FBQyxJQUFJLFdBQVcsUUFBUSxPQUFPOztvQkFDckQsS0FBQyxJQUFJLE1BQU0sS0FBSyxLQUFLOzsrQkFFTixLQUFDLElBQUk7O29CQUE1QixLQUFDLElBQUksS0FBSyxLQUFLOztvQkFFWixLQUFLLFNBQVE7O21DQUNULEtBQUMsSUFBSTs7NkJBQ1ksS0FBQyxJQUFJLElBQUksS0FBSzs7NEJBQTlCOzs7b0JBQ0osT0FBTyxLQUFLLEtBQUs7Ozs7K0JBRWQsSUFBTyxLQUFDLElBQUksc0JBQWMsTUFBTSxLQUFLLEtBQUssTUFBUyxLQUFDLElBQUksWUFBVyxLQUFDLElBQUksV0FBVyxRQUFRLE9BQU87O3VDQUMxRSxLQUFDLElBQUk7OzRCQUE1QixLQUFDLElBQUksS0FBSyxLQUFLOzs7O29CQUVwQixLQUFDLElBQUksTUFBTSxTQUFTLEtBQUMsSUFBSTs7b0JBQ3hCLFlBQUk7b0JBQ0o7Ozs7UUFFWixLQUFDLFVBQVU7aUJBQ1gsS0FBQyxJQUFJLHNCQUFMLEtBQUMsSUFBSSxLQUFNO2VBRVgsS0FBQzs7Ozs7UUFVRCxLQUFDLFVBQVU7ZUFDWCxLQUFDLFNBQVM7Ozs7Ozs7ZUFJWCJ9
//# sourceURL=file://kode/ked/util/walker.kode
