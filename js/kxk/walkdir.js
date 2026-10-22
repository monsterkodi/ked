var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import slash from "./slash.js"
import nfs from "./nfs.js"

class walkdir
{
    constructor (cfg)
    {
        this.cfg = cfg
    
        var _16_25_, _17_25_, _18_25_, _19_25_, _20_25_

        this.cfg.files = []
        this.cfg.maxDepth = ((_16_25_=this.cfg.maxDepth) != null ? _16_25_ : 3)
        this.cfg.dotFiles = ((_17_25_=this.cfg.dotFiles) != null ? _17_25_ : false)
        this.cfg.maxFiles = ((_18_25_=this.cfg.maxFiles) != null ? _18_25_ : 15000)
        this.cfg.ignore = ((_19_25_=this.cfg.ignore) != null ? _19_25_ : ['node_modules'])
        this.cfg.ignoreExt = ((_20_25_=this.cfg.ignoreExt) != null ? _20_25_ : ['asar'])
    }

    ignore (p)
    {}

    async start ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _57_31_, _78_17_

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
}

export default async function (cfg)
{
    var w

    w = new walkdir(cfg)
    return await w.start()
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2Rpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvd2Fsa2Rpci5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQVFNLFlBQUE7T0FBTSxVQUFBOztBQUVaLE1BQU07O0lBRUYsYUFBSzs7UUFBRDs7OztRQUVBLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSSxxQkFBTCxLQUFDLElBQUksOEJBQWU7UUFDcEIsS0FBQyxJQUFJLHFCQUFMLEtBQUMsSUFBSSw4QkFBZTtRQUNwQixLQUFDLElBQUkscUJBQUwsS0FBQyxJQUFJLDhCQUFlO1FBQ3BCLEtBQUMsSUFBSSxtQkFBTCxLQUFDLElBQUksNkJBQWdCO1FBQ3JCLEtBQUMsSUFBSSxzQkFBTCxLQUFDLElBQUksZ0NBQWdCOzs7SUFJekIsUUFBUzs7O1VBUVQ7Ozs7UUFFSSxNQUFNLEtBQUMsSUFBSTtRQUlYLFVBQVU7MEJBRUU7O1lBRVIsVUFBVSxPQUFPO1lBSWpCLGNBQVUsSUFBSSxLQUFLO2dDQUlQOzs7Z0JBQVI7Z0JBRUEsT0FBTyxLQUFLO2dCQUNaLE1BQU0sTUFBTSxJQUFJO2dCQUNoQixJQUFJLEtBQUs7NEJBR0wsS0FBQyxJQUFJLHdCQUFMLEtBQUMsSUFBSSxPQUFROztvQkFBSyxLQUFDLE9BQU87b0JBQUc7O2dDQUM3QixNQUFTLFlBQVkscUJBQWEsS0FBUTs7b0JBQVMsS0FBQyxPQUFPO29CQUFHOztnQ0FDOUQsS0FBUSxLQUFDLElBQUk7O29CQUFTLEtBQUMsT0FBTztvQkFBRzs7eUJBQ2pDLEtBQUssV0FBVzs7d0JBQ1QsS0FBQyxJQUFJOzt3QkFDSixLQUFDLElBQUksTUFBTSxLQUFLLEtBQUs7Ozs7d0JBRXJCLEtBQUMsT0FBTzt3QkFBRzs7O2dDQUNuQixJQUFPLEtBQUMsSUFBSTs7b0JBQVksS0FBQyxPQUFPO29CQUFHOztvQkFJcEMsS0FBSyxTQUFROzt3QkFDRyxXQUFaLEtBQUMsSUFBSTs7NkJBQ1ksS0FBQyxJQUFJLElBQUksS0FBSzs7NEJBQTlCOzs7b0JBQ0osT0FBTyxLQUFLLEtBQUs7O29CQUVsQixLQUFDLElBQUksTUFBTSxTQUFTLEtBQUMsSUFBSTs7b0JBQ3hCLFlBQUk7b0JBQ0o7Ozs7aUJBRVosS0FBQyxJQUFJLHNCQUFMLEtBQUMsSUFBSSxLQUFNO2VBRVgsS0FBQzs7OzsrQkFFRDs7OztJQUFTLFFBQVEsUUFBUTtpQkFBUyxFQUFFIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/walkdir.kode
