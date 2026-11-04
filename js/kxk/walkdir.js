var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

var walkdir

import slash from "./slash.js"
import nfs from "./nfs.js"


walkdir = (function ()
{
    function walkdir (cfg)
    {
        this.cfg = cfg
    
        var _10_25_, _11_25_, _12_25_, _8_25_, _9_25_

        this.cfg.files = []
        this.cfg.maxDepth = ((_8_25_=this.cfg.maxDepth) != null ? _8_25_ : 3)
        this.cfg.dotFiles = ((_9_25_=this.cfg.dotFiles) != null ? _9_25_ : false)
        this.cfg.maxFiles = ((_10_25_=this.cfg.maxFiles) != null ? _10_25_ : 15000)
        this.cfg.ignore = ((_11_25_=this.cfg.ignore) != null ? _11_25_ : ['node_modules'])
        this.cfg.ignoreExt = ((_12_25_=this.cfg.ignoreExt) != null ? _12_25_ : ['asar'])
    }

    walkdir.prototype["ignore"] = function (p)
    {}

    walkdir.prototype["start"] = async function ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _43_31_, _64_17_

        dir = this.cfg.root
        toWalk = [dir]
        while (!_k_.empty(toWalk))
        {
            listDir = toWalk.shift()
            items = await nfs.list(listDir)
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
                if (this.cfg.files.length > this.cfg.maxFiles)
                {
                    console.log('maxFiles reached')
                    break
                }
            }
        }
        ;(typeof this.cfg.done === "function" ? this.cfg.done(this) : undefined)
        return this.cfg
    }

    return walkdir
})()

export default async function (cfg)
{
    var w

    w = new walkdir(cfg)
    return await w.start()
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2Rpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvd2Fsa2Rpci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTtPQUFNLFVBQUE7OztBQUNYLFdBQUQ7O2FBRUksU0FBSzs7UUFBRDs7OztRQUVBLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSSxvQkFBTCxLQUFDLElBQUksNkJBQWU7UUFDcEIsS0FBQyxJQUFJLG9CQUFMLEtBQUMsSUFBSSw2QkFBZTtRQUNwQixLQUFDLElBQUkscUJBQUwsS0FBQyxJQUFJLDhCQUFlO1FBQ3BCLEtBQUMsSUFBSSxtQkFBTCxLQUFDLElBQUksNkJBQWdCO1FBQ3JCLEtBQUMsSUFBSSxzQkFBTCxLQUFDLElBQUksZ0NBQWdCOzs7dUJBSXpCLHFCQUFTOzs7dUJBRVQ7Ozs7UUFFSSxNQUFNLEtBQUMsSUFBSTtRQUlYLFVBQVU7MEJBRUU7O1lBRVIsVUFBVSxPQUFPO1lBSWpCLGNBQVUsSUFBSSxLQUFLO2dDQUlQOzs7Z0JBQVI7Z0JBRUEsT0FBTyxLQUFLO2dCQUNaLE1BQU0sTUFBTSxJQUFJO2dCQUNoQixJQUFJLEtBQUs7NEJBR0wsS0FBQyxJQUFJLHdCQUFMLEtBQUMsSUFBSSxPQUFROztvQkFBSyxLQUFDLE9BQU87b0JBQUc7O2dDQUM3QixNQUFTLFlBQVkscUJBQWEsS0FBUTs7b0JBQVMsS0FBQyxPQUFPO29CQUFHOztnQ0FDOUQsS0FBUSxLQUFDLElBQUk7O29CQUFTLEtBQUMsT0FBTztvQkFBRzs7eUJBQ2pDLEtBQUssV0FBVzs7d0JBQ1QsS0FBQyxJQUFJOzt3QkFDSixLQUFDLElBQUksTUFBTSxLQUFLLEtBQUs7Ozs7d0JBRXJCLEtBQUMsT0FBTzt3QkFBRzs7O2dDQUNuQixJQUFPLEtBQUMsSUFBSTs7b0JBQVksS0FBQyxPQUFPO29CQUFHOztvQkFJcEMsS0FBSyxTQUFROzt3QkFDRyxXQUFaLEtBQUMsSUFBSTs7NkJBQ1ksS0FBQyxJQUFJLElBQUksS0FBSzs7NEJBQTlCOzs7b0JBQ0osT0FBTyxLQUFLLEtBQUs7O29CQUVsQixLQUFDLElBQUksTUFBTSxTQUFTLEtBQUMsSUFBSTs7b0JBQ3hCLFlBQUk7b0JBQ0o7Ozs7aUJBRVosS0FBQyxJQUFJLHNCQUFMLEtBQUMsSUFBSSxLQUFNO2VBRVgsS0FBQzs7O1dBL0RSOzs7K0JBaUVPOzs7O0lBQVMsUUFBUSxRQUFRO2lCQUFTLEVBQUUifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/walkdir.kode
