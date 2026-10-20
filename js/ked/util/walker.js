var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import kxk from "../../kxk.js"
let slash = kxk.slash
let nfs = kxk.nfs

import fileutil from "./fileutil.js"

class walker
{
    constructor (cfg)
    {
        this.cfg = cfg
    
        var _17_25_, _18_25_, _19_25_, _20_25_, _21_25_, _22_25_, _23_25_

        this.stop = this.stop.bind(this)
        this.start = this.start.bind(this)
        this.cfg.files = []
        this.cfg.maxDepth = ((_17_25_=this.cfg.maxDepth) != null ? _17_25_ : 3)
        this.cfg.dotFiles = ((_18_25_=this.cfg.dotFiles) != null ? _18_25_ : false)
        this.cfg.maxFiles = ((_19_25_=this.cfg.maxFiles) != null ? _19_25_ : 15000)
        this.cfg.ignore = ((_20_25_=this.cfg.ignore) != null ? _20_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_21_25_=this.cfg.include) != null ? _21_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_22_25_=this.cfg.ignoreExt) != null ? _22_25_ : ['asar'])
        this.cfg.includeExt = ((_23_25_=this.cfg.includeExt) != null ? _23_25_ : fileutil.sourceFileExtensions)
    }

    async start ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _57_31_, _85_17_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3dhbGtlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFlUSxLQUFDLElBQUk7UUFDTCxLQUFDLElBQUkscUJBQUwsS0FBQyxJQUFJLDhCQUFlO1FBQ3BCLEtBQUMsSUFBSSxxQkFBTCxLQUFDLElBQUksOEJBQWU7UUFDcEIsS0FBQyxJQUFJLHFCQUFMLEtBQUMsSUFBSSw4QkFBZTtRQUNwQixLQUFDLElBQUksbUJBQUwsS0FBQyxJQUFJLDZCQUFnQixlQUFlLFFBQVEsUUFBUSxVQUFVO1FBQzlELEtBQUMsSUFBSSxvQkFBTCxLQUFDLElBQUksOEJBQWdCLGVBQWUsYUFBYTtRQUNqRCxLQUFDLElBQUksc0JBQUwsS0FBQyxJQUFJLGdDQUFnQjtRQUNyQixLQUFDLElBQUksdUJBQUwsS0FBQyxJQUFJLGdDQUFlLFNBQVM7Ozs7Ozs7UUFVN0IsTUFBTSxLQUFDLElBQUk7UUFJWCxLQUFDLFVBQVU7UUFFWCxVQUFVOzBCQUVFOztZQUVSLFVBQVUsT0FBTztZQUlqQixjQUFVLElBQUksS0FBSyxTQUFRLFVBQVU7Z0NBR3pCOzs7O2dCQUVSLE9BQU8sS0FBSztnQkFDWixNQUFNLE1BQU0sSUFBSTtnQkFDaEIsSUFBSSxLQUFLOzRCQUdMLEtBQUMsSUFBSSx3QkFBTCxLQUFDLElBQUksT0FBUTs7b0JBQUssS0FBQyxPQUFPO29CQUFHOztnQ0FDN0IsTUFBUyxZQUFZLHFCQUFhLEtBQVE7O29CQUFTLEtBQUMsT0FBTztvQkFBRzs7Z0NBQzlELEtBQVEsS0FBQyxJQUFJOztvQkFBUyxLQUFDLE9BQU87b0JBQUc7O2dDQUNqQyxLQUFRLEtBQUMsSUFBSTs7b0JBQVUsS0FBQyxJQUFJLE1BQU0sS0FBSyxLQUFLOzt5QkFDNUMsS0FBSyxXQUFXOzt3QkFDVCxLQUFDLElBQUk7O3dCQUNKLEtBQUMsSUFBSSxNQUFNLEtBQUssS0FBSzs7Ozt3QkFFckIsS0FBQyxPQUFPO3dCQUFHOzs7Z0NBQ25CLElBQU8sS0FBQyxJQUFJOztvQkFBWSxLQUFDLE9BQU87b0JBQUc7O2dDQUNuQyxJQUFPLEtBQUMsSUFBSSxlQUFjLEtBQUMsSUFBSSxXQUFXLFFBQVEsT0FBTzs7b0JBQ3JELEtBQUMsSUFBSSxNQUFNLEtBQUssS0FBSzs7K0JBRU4sS0FBQyxJQUFJOztvQkFBNUIsS0FBQyxJQUFJLEtBQUssS0FBSzs7b0JBRVosS0FBSyxTQUFROzttQ0FDVCxLQUFDLElBQUk7OzZCQUNZLEtBQUMsSUFBSSxJQUFJLEtBQUs7OzRCQUE5Qjs7O29CQUNKLE9BQU8sS0FBSyxLQUFLOzs7OytCQUVkLElBQU8sS0FBQyxJQUFJLHNCQUFjLE1BQU0sS0FBSyxLQUFLLE1BQVMsS0FBQyxJQUFJLFlBQVcsS0FBQyxJQUFJLFdBQVcsUUFBUSxPQUFPOzt1Q0FDMUUsS0FBQyxJQUFJOzs0QkFBNUIsS0FBQyxJQUFJLEtBQUssS0FBSzs7OztvQkFFcEIsS0FBQyxJQUFJLE1BQU0sU0FBUyxLQUFDLElBQUk7O29CQUN4QixZQUFJO29CQUNKOzs7O1FBRVosS0FBQyxVQUFVO2lCQUNYLEtBQUMsSUFBSSxzQkFBTCxLQUFDLElBQUksS0FBTTtlQUVYLEtBQUM7Ozs7O1FBVUQsS0FBQyxVQUFVO2VBQ1gsS0FBQyxTQUFTOzs7Ozs7O2VBSVgifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/walker.kode
