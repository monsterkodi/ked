var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import print from "./print.js"

class Returner
{
    constructor (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
    }

    collect (tl)
    {
        return this.scope(tl)
    }

    scope (body)
    {
        var e, _36_21_

        if ((body != null ? (_36_21_=body.exps) != null ? _36_21_.length : undefined : undefined))
        {
            var list = _k_.list(body.exps)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                e = list[_a_]
                this.exp(e)
            }
        }
        return body
    }

    func (f)
    {
        var e, lst, _50_17_, _50_23_, _52_21_

        if (f.args)
        {
            this.exp(f.args)
        }
        if (((_50_17_=f.body) != null ? (_50_23_=_50_17_.exps) != null ? _50_23_.length : undefined : undefined))
        {
            if (!(_k_.in((f.name != null ? f.name.text : undefined),['@','constructor'])))
            {
                lst = f.body.exps.slice(-1)[0]
                var list = _k_.list(f.body.exps)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    e = list[_a_]
                    if (e.text === '●')
                    {
                        this.profile = e
                        break
                    }
                }
                this.insert(f.body.exps)
                delete this.profile
            }
            return this.scope(f.body)
        }
    }

    if (e)
    {
        var ei

        e.returns = true
        this.insert(e.then)
        var list = _k_.list(e.elifs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ei = list[_a_]
            if (ei.elif.then)
            {
                this.insert(ei.elif.then)
            }
        }
        if (e.else)
        {
            return this.insert(e.else)
        }
    }

    try (e)
    {
        var _94_23_

        if (!_k_.empty(e.exps))
        {
            this.insert(e.exps)
        }
        this.insert((e.catch != null ? e.catch.exps : undefined))
        if (!_k_.empty(e.finally))
        {
            return this.insert(e.finally)
        }
    }

    switch (e)
    {
        var w

        var list = _k_.list(e.whens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            w = list[_a_]
            if (!_k_.empty(w.when.then))
            {
                this.insert(w.when.then)
            }
        }
        if (!_k_.empty(e.else))
        {
            return this.insert(e.else)
        }
    }

    insert (e)
    {
        var lst, _132_28_, _132_36_

        if (e instanceof Array)
        {
            if (_k_.empty(e))
            {
                return
            }
            lst = e.slice(-1)[0]
            if (lst.return)
            {
                return this.profilend(e,-1)
            }
            else if (lst.while)
            {
                return this.profilend(e)
            }
            else if (lst.for)
            {
                return this.profilend(e)
            }
            else if (lst.if)
            {
                return this.if(lst.if)
            }
            else if (lst.try)
            {
                return this.try(lst.try)
            }
            else if (lst.switch)
            {
                return this.switch(lst.switch)
            }
            if (!(_k_.in(((_132_28_=lst.call) != null ? (_132_36_=_132_28_.callee) != null ? _132_36_.text : undefined : undefined),['log','warn','error','throw'])))
            {
                e.push({return:{ret:{type:'keyword',text:'return'},val:e.pop()}})
                return this.profilend(e,-1)
            }
            else
            {
                return this.profilend(e)
            }
        }
    }

    profilend (e, offset = 0)
    {
        var c

        if (this.profile)
        {
            c = {type:'profilend',text:'●▪',id:this.profile.id}
            if (offset)
            {
                return e.splice(offset,0,c)
            }
            else
            {
                return e.push(c)
            }
        }
    }

    exp (e)
    {
        var k, key, v, val

        if (!e)
        {
            return
        }
        if (e.type)
        {
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    v = list[_a_]
                    this.exp(v)
                }
            }
        }
        else if (e instanceof Object)
        {
            if (e.func)
            {
                return this.func(e.func)
            }
            else
            {
                for (key in e)
                {
                    val = e[key]
                    if (val)
                    {
                        if (val.type)
                        {
                            this.exp(val)
                        }
                        else
                        {
                            for (k in val)
                            {
                                v = val[k]
                                this.exp(v)
                            }
                        }
                    }
                }
            }
        }
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }
}

export default Returner;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZXR1cm5lci5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQVVNLFlBQUE7O0FBRU4sTUFBTTs7SUFFRixhQUFJOztRQUFEOztRQUVDLEtBQUMsVUFBVSxLQUFDLEtBQUssS0FBSztRQUN0QixLQUFDLFFBQVUsS0FBQyxLQUFLLEtBQUs7OztJQVExQixTQUFTOztlQUFNLEtBQUMsTUFBTTs7O0lBUXRCLE9BQU87Ozs7YUFFQSx3QkFBQSxLQUFNLHdCQUFNOztnQ0FDSyxLQUFLOzs7Z0JBQVY7Z0JBQVgsS0FBQyxJQUFJOzs7ZUFDVDs7O0lBUUosTUFBTTs7OztZQUVhLEVBQUU7O1lBQWpCLEtBQUMsSUFBSSxFQUFFOztzQkFFSixFQUFFLGlDQUFNLHdCQUFNOzswQkFFVixFQUFFLGVBQUYsRUFBRSxLQUFNLG1CQUFhLElBQUk7O2dCQUV4QixNQUFNLEVBQUUsS0FBSztvQ0FFSixFQUFFLEtBQUs7OztvQkFBWjt3QkFDRyxFQUFFLFNBQVE7O3dCQUNULEtBQUMsVUFBVTt3QkFDWDs7O2dCQUVSLEtBQUMsT0FBTyxFQUFFLEtBQUs7dUJBRVIsS0FBQzs7bUJBRVosS0FBQyxNQUFNLEVBQUU7Ozs7SUFRakIsSUFBSTs7OztRQUVBLEVBQUUsVUFBVTtRQUNaLEtBQUMsT0FBTyxFQUFFOzRCQUNBLEVBQUU7OztZQUFSO2dCQUN3QixHQUFHLEtBQUs7O2dCQUFoQyxLQUFDLE9BQU8sR0FBRyxLQUFLOzs7WUFFRixFQUFFOzttQkFBcEIsS0FBQyxPQUFPLEVBQUU7Ozs7SUFRZCxLQUFLOzs7O3VCQUswQixFQUFFOztZQUE3QixLQUFDLE9BQU8sRUFBRTs7UUFDVixLQUFDLFFBQU8sRUFBRSxnQkFBRixFQUFFLE1BQU87dUJBQ2EsRUFBRTs7bUJBQWhDLEtBQUMsT0FBTyxFQUFFOzs7O0lBUWQsUUFBUTs7Ozs0QkFFSyxFQUFFOzs7WUFBUDsyQkFDNkIsRUFBRSxLQUFLOztnQkFBcEMsS0FBQyxPQUFPLEVBQUUsS0FBSzs7O3VCQUVLLEVBQUU7O21CQUExQixLQUFDLE9BQU8sRUFBRTs7OztJQVFkLFFBQVE7Ozs7WUFFRCxhQUFLOzswQkFHTzs7OztZQUVYLE1BQU07Z0JBRUYsSUFBSTs7dUJBQVksS0FBQyxVQUFVLEVBQUc7O3FCQUM5QixJQUFJOzt1QkFBWSxLQUFDLFVBQVU7O3FCQUMzQixJQUFJOzt1QkFBWSxLQUFDLFVBQVU7O3FCQUMzQixJQUFJOzt1QkFBWSxLQUFDLEdBQUcsSUFBSTs7cUJBQ3hCLElBQUk7O3VCQUFZLEtBQUMsSUFBSSxJQUFJOztxQkFDekIsSUFBSTs7dUJBQVksS0FBQyxPQUFPLElBQUk7O29DQUV4QixJQUFJLG1DQUFNLDJCQUFRLCtCQUFTLE1BQU0sT0FBTyxRQUFROztnQkFDcEQsRUFBRSxNQUNFLFFBQ0ksS0FBSyxLQUFLLFVBQVUsS0FBSyxVQUN6QixJQUFLLEVBQUU7dUJBQ2YsS0FBQyxVQUFVLEVBQUc7Ozs7dUJBRWQsS0FBQyxVQUFVOzs7OztJQUV2QixXQUFXLEdBQUUsU0FBTzs7OztZQUViLEtBQUM7O1lBRUEsS0FBSSxLQUFNLFlBQ04sS0FBTSxLQUNOLEdBQU0sS0FBQyxRQUFRO2dCQUVoQjs7dUJBQ0MsRUFBRSxPQUFPLE9BQVEsRUFBRTs7Ozt1QkFFbkIsRUFBRSxLQUFLOzs7OztJQVFuQixLQUFLOzs7O2FBRVE7Ozs7WUFHTCxFQUFFOzs7O2lCQUNGLGFBQUs7O2dCQUE4QixFQUFFOztvQ0FBUDs7O29CQUFMO29CQUFYLEtBQUMsSUFBSTs7OztpQkFDbkIsYUFBSzs7Z0JBRUUsRUFBRTs7dUJBQ0QsS0FBQyxLQUFLLEVBQUU7Ozs7cUJBRUosT0FBVzs7b0JBQVAsTUFBTzt3QkFDUjs7NEJBQ0ksSUFBSTs7NEJBQ0gsS0FBQyxJQUFJOzs7O2lDQUVNLEtBQU87O2dDQUFMLElBQUs7Z0NBQWxCLEtBQUMsSUFBSTs7Ozs7Ozs7O0lBRWpDOztZQUFZLEtBQUM7O21CQUFRLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSzs7Ozs7ZUFFakQifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/returner.kode
