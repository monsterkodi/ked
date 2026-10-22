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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZXR1cm5lci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUEsTUFBTTs7SUFFRixhQUFHOzs7O1FBRUMsS0FBQyxVQUFVLEtBQUMsS0FBSyxLQUFLO1FBQ3RCLEtBQUMsUUFBVSxLQUFDLEtBQUssS0FBSzs7O0lBUTFCLFNBQVM7O2VBQU0sS0FBQyxNQUFNOzs7SUFRdEIsT0FBTzs7OzthQUVBLHdCQUFBLEtBQU0sd0JBQU07O2dDQUNLLEtBQUs7OztnQkFBVjtnQkFBWCxLQUFDLElBQUk7OztlQUNUOzs7SUFRSixNQUFNOzs7O1lBRWEsRUFBRTs7WUFBakIsS0FBQyxJQUFJLEVBQUU7O3NCQUVKLEVBQUUsaUNBQU0sd0JBQU07OzBCQUVWLEVBQUUsZUFBRixFQUFFLEtBQU0sbUJBQWEsSUFBSTs7Z0JBRXhCLE1BQU0sRUFBRSxLQUFLO29DQUVKLEVBQUUsS0FBSzs7O29CQUFaO3dCQUNHLEVBQUUsU0FBUTs7d0JBQ1QsS0FBQyxVQUFVO3dCQUNYOzs7Z0JBRVIsS0FBQyxPQUFPLEVBQUUsS0FBSzt1QkFFUixLQUFDOzttQkFFWixLQUFDLE1BQU0sRUFBRTs7OztJQVFqQixJQUFJOzs7O1FBRUEsRUFBRSxVQUFVO1FBQ1osS0FBQyxPQUFPLEVBQUU7NEJBQ0EsRUFBRTs7O1lBQVI7Z0JBQ3dCLEdBQUcsS0FBSzs7Z0JBQWhDLEtBQUMsT0FBTyxHQUFHLEtBQUs7OztZQUVGLEVBQUU7O21CQUFwQixLQUFDLE9BQU8sRUFBRTs7OztJQVFkLEtBQUs7Ozs7dUJBSzBCLEVBQUU7O1lBQTdCLEtBQUMsT0FBTyxFQUFFOztRQUNWLEtBQUMsUUFBTyxFQUFFLGdCQUFGLEVBQUUsTUFBTzt1QkFDYSxFQUFFOzttQkFBaEMsS0FBQyxPQUFPLEVBQUU7Ozs7SUFRZCxRQUFROzs7OzRCQUVLLEVBQUU7OztZQUFQOzJCQUM2QixFQUFFLEtBQUs7O2dCQUFwQyxLQUFDLE9BQU8sRUFBRSxLQUFLOzs7dUJBRUssRUFBRTs7bUJBQTFCLEtBQUMsT0FBTyxFQUFFOzs7O0lBUWQsUUFBUTs7OztZQUVELGFBQUs7OzBCQUdPOzs7O1lBRVgsTUFBTTtnQkFFRixJQUFJOzt1QkFBWSxLQUFDLFVBQVUsRUFBRzs7cUJBQzlCLElBQUk7O3VCQUFZLEtBQUMsVUFBVTs7cUJBQzNCLElBQUk7O3VCQUFZLEtBQUMsVUFBVTs7cUJBQzNCLElBQUk7O3VCQUFZLEtBQUMsR0FBRyxJQUFJOztxQkFDeEIsSUFBSTs7dUJBQVksS0FBQyxJQUFJLElBQUk7O3FCQUN6QixJQUFJOzt1QkFBWSxLQUFDLE9BQU8sSUFBSTs7b0NBRXhCLElBQUksbUNBQU0sMkJBQVEsK0JBQVMsTUFBTSxPQUFPLFFBQVE7O2dCQUNwRCxFQUFFLE1BQ0UsUUFDSSxLQUFLLEtBQUssVUFBVSxLQUFLLFVBQ3pCLElBQUssRUFBRTt1QkFDZixLQUFDLFVBQVUsRUFBRzs7Ozt1QkFFZCxLQUFDLFVBQVU7Ozs7O0lBRXZCLFdBQVcsR0FBRTs7OztZQUVOLEtBQUM7O1lBRUEsS0FBSSxLQUFNLFlBQ04sS0FBTSxLQUNOLEdBQU0sS0FBQyxRQUFRO2dCQUVoQjs7dUJBQ0MsRUFBRSxPQUFPLE9BQVEsRUFBRTs7Ozt1QkFFbkIsRUFBRSxLQUFLOzs7OztJQVFuQixLQUFLOzs7O2FBRVE7Ozs7WUFHTCxFQUFFOzs7O2lCQUNGLGFBQUs7O2dCQUE4QixFQUFFOztvQ0FBUDs7O29CQUFMO29CQUFYLEtBQUMsSUFBSTs7OztpQkFDbkIsYUFBSzs7Z0JBRUUsRUFBRTs7dUJBQ0QsS0FBQyxLQUFLLEVBQUU7Ozs7NEJBRU87OzBCQUFBO3dCQUNSOzs0QkFDSSxJQUFJOzs0QkFDSCxLQUFDLElBQUk7Ozs7c0NBRWE7O29DQUFBO2dDQUFsQixLQUFDLElBQUk7Ozs7Ozs7OztJQUVqQzs7WUFBWSxLQUFDOzttQkFBUSxRQUFRLElBQUksTUFBTSxRQUFRLElBQUs7Ozs7O2VBRWpEIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/returner.kode
