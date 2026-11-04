var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

var walker

import kxk from "../../kxk.js"
let slash = kxk.slash
let nfs = kxk.nfs

import fileutil from "./fileutil.js"
import config from "./config.js"


walker = (function ()
{
    function walker (cfg)
    {
        this.cfg = cfg
    
        var _10_25_, _11_25_, _12_25_, _13_25_, _14_25_, _15_25_, _16_25_

        this["stop"] = this["stop"].bind(this)
        this["start"] = this["start"].bind(this)
        this.cfg.files = []
        this.cfg.maxDepth = ((_10_25_=this.cfg.maxDepth) != null ? _10_25_ : 3)
        this.cfg.dotFiles = ((_11_25_=this.cfg.dotFiles) != null ? _11_25_ : false)
        this.cfg.maxFiles = ((_12_25_=this.cfg.maxFiles) != null ? _12_25_ : 15000)
        this.cfg.ignore = ((_13_25_=this.cfg.ignore) != null ? _13_25_ : ['node_modules'])
        this.cfg.include = ((_14_25_=this.cfg.include) != null ? _14_25_ : ['.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_15_25_=this.cfg.ignoreExt) != null ? _15_25_ : ['asar'])
        this.cfg.includeExt = ((_16_25_=this.cfg.includeExt) != null ? _16_25_ : [])
    }

    walker.prototype["start"] = async function ()
    {
        var depth, dir, ext, file, item, items, listDir, p, toWalk, _44_31_, _72_17_

        dir = this.cfg.root
        this.running = true
        toWalk = [[dir,0]]
        while (!_k_.empty(toWalk))
        {
            var _a_ = toWalk.shift(); listDir = _a_[0]; depth = _a_[1]

            items = await nfs.list(listDir,{recursive:false})
            var list = _k_.list(items)
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                item = list[_b_]
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
                    if (depth < this.cfg.maxDepth)
                    {
                        toWalk.push([item.path,depth + 1])
                    }
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

    walker.prototype["stop"] = function ()
    {
        this.running = false
        return this.walker = null
    }

    walker.prototype["ignore"] = function (p)
    {}

    return walker
})()

export default walker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL3dhbGtlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU07O09BQ04sZUFBQTtPQUFTLGFBQUE7OztBQUV4QixVQUFEOzthQUVJLFFBQUk7O1FBQUQ7Ozs7OztRQUVDLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSSxxQkFBTCxLQUFDLElBQUksOEJBQWU7UUFDcEIsS0FBQyxJQUFJLHFCQUFMLEtBQUMsSUFBSSw4QkFBZTtRQUNwQixLQUFDLElBQUkscUJBQUwsS0FBQyxJQUFJLDhCQUFlO1FBQ3BCLEtBQUMsSUFBSSxtQkFBTCxLQUFDLElBQUksNkJBQWdCO1FBQ3JCLEtBQUMsSUFBSSxvQkFBTCxLQUFDLElBQUksOEJBQWdCLGFBQWE7UUFDbEMsS0FBQyxJQUFJLHNCQUFMLEtBQUMsSUFBSSxnQ0FBZ0I7UUFDckIsS0FBQyxJQUFJLHVCQUFMLEtBQUMsSUFBSTs7O3NCQUVUOzs7O1FBRUksTUFBTSxLQUFDLElBQUk7UUFJWCxLQUFDLFVBQVU7UUFFWCxXQUFXLElBQUk7MEJBRUg7O3NCQUVVLE9BQU8sU0FBeEIsa0JBQVE7O1lBSVQsY0FBVSxJQUFJLEtBQUssU0FBUSxVQUFVO2dDQUd6Qjs7O2dCQUFSO2dCQUVBLE9BQU8sS0FBSztnQkFDWixNQUFNLE1BQU0sSUFBSTtnQkFDaEIsSUFBSSxLQUFLOzRCQUdMLEtBQUMsSUFBSSx3QkFBTCxLQUFDLElBQUksT0FBUTs7b0JBQUssS0FBQyxPQUFPO29CQUFHOztnQ0FDN0IsTUFBUyxZQUFZLHFCQUFhLEtBQVE7O29CQUFTLEtBQUMsT0FBTztvQkFBRzs7Z0NBQzlELEtBQVEsS0FBQyxJQUFJOztvQkFBUyxLQUFDLE9BQU87b0JBQUc7O2dDQUNqQyxLQUFRLEtBQUMsSUFBSTs7b0JBQVUsS0FBQyxJQUFJLE1BQU0sS0FBSyxLQUFLOzt5QkFDNUMsS0FBSyxXQUFXOzt3QkFDVCxLQUFDLElBQUk7O3dCQUNKLEtBQUMsSUFBSSxNQUFNLEtBQUssS0FBSzs7Ozt3QkFFckIsS0FBQyxPQUFPO3dCQUFHOzs7Z0NBQ25CLElBQU8sS0FBQyxJQUFJOztvQkFBWSxLQUFDLE9BQU87b0JBQUc7O2dDQUNuQyxJQUFPLEtBQUMsSUFBSSxlQUFjLEtBQUMsSUFBSSxXQUFXLFFBQVEsT0FBTzs7b0JBQ3JELEtBQUMsSUFBSSxNQUFNLEtBQUssS0FBSzs7b0JBRU8sV0FBYixLQUFDLElBQUk7O29CQUE1QixLQUFDLElBQUksS0FBSyxLQUFLOztvQkFFWixLQUFLLFNBQVE7O3dCQUNHLFdBQVosS0FBQyxJQUFJOzs2QkFDWSxLQUFDLElBQUksSUFBSSxLQUFLOzs0QkFBOUI7Ozt3QkFDK0IsUUFBUSxLQUFDLElBQUk7O3dCQUFoRCxPQUFPLE1BQU0sS0FBSyxLQUFLLFFBQU07Ozs7OytCQUUxQixJQUFPLEtBQUMsSUFBSSxzQkFBYyxNQUFNLEtBQUssS0FBSyxNQUFTLEtBQUMsSUFBSSxZQUFXLEtBQUMsSUFBSSxXQUFXLFFBQVEsT0FBTzs7NEJBQzdELFdBQWIsS0FBQyxJQUFJOzs0QkFBNUIsS0FBQyxJQUFJLEtBQUssS0FBSzs7OztvQkFFcEIsS0FBQyxJQUFJLE1BQU0sU0FBUyxLQUFDLElBQUk7O29CQUN4QixZQUFJO29CQUNKOzs7O1FBRVosS0FBQyxVQUFVO2lCQUNYLEtBQUMsSUFBSSxzQkFBTCxLQUFDLElBQUksS0FBTTtlQUNYLEtBQUM7OztzQkFFTDs7UUFFSSxLQUFDLFVBQVU7ZUFDWCxLQUFDLFNBQVM7OztzQkFFZCxxQkFBUTs7O1dBM0VYOzs7ZUE2RU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/walker.kode
