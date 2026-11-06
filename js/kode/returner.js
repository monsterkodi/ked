var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Returner

import print from "./print.js"


Returner = (function ()
{
    function Returner (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
    }

    Returner.prototype["collect"] = function (tl)
    {
        return this.scope(tl)
    }

    Returner.prototype["scope"] = function (body)
    {
        var e, _18_21_

        if ((body != null ? (_18_21_=body.exps) != null ? _18_21_.length : undefined : undefined))
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

    Returner.prototype["func"] = function (f)
    {
        var e, lst, _26_17_, _26_23_, _28_21_

        if (f.args)
        {
            this.exp(f.args)
        }
        if (((_26_17_=f.body) != null ? (_26_23_=_26_17_.exps) != null ? _26_23_.length : undefined : undefined))
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

    Returner.prototype["if"] = function (e)
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

    Returner.prototype["try"] = function (e)
    {
        var _58_23_

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

    Returner.prototype["switch"] = function (e)
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

    Returner.prototype["insert"] = function (e)
    {
        var lst, _84_28_, _84_36_

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
            if (!(_k_.in(((_84_28_=lst.call) != null ? (_84_36_=_84_28_.callee) != null ? _84_36_.text : undefined : undefined),['log','warn','error','throw'])))
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

    Returner.prototype["profilend"] = function (e, offset = 0)
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

    Returner.prototype["exp"] = function (e)
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

    Returner.prototype["verb"] = function ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    return Returner
})()

export default Returner;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZXR1cm5lci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTs7O0FBRUwsWUFBRDs7YUFLSSxVQUFJOztRQUFEOztRQUVDLEtBQUMsVUFBVSxLQUFDLEtBQUssS0FBSztRQUN0QixLQUFDLFFBQVUsS0FBQyxLQUFLLEtBQUs7Ozt3QkFFMUIsc0JBQVM7O2VBQU0sS0FBQyxNQUFNOzs7d0JBRXRCLG9CQUFPOzs7O2FBRUEsd0JBQUEsS0FBTSx3QkFBTTs7Z0NBQ0ssS0FBSzs7O2dCQUFWO2dCQUFYLEtBQUMsSUFBSTs7O2VBQ1Q7OztpQ0FFSixVQUFNOzs7O1lBRWEsRUFBRTs7WUFBakIsS0FBQyxJQUFJLEVBQUU7O3NCQUVKLEVBQUUsaUNBQU0sd0JBQU07OzBCQUVWLEVBQUUsZUFBRixFQUFFLEtBQU0sbUJBQWEsSUFBSTs7Z0JBRXhCLE1BQU0sRUFBRSxLQUFLO29DQUVKLEVBQUUsS0FBSzs7O29CQUFaO3dCQUNHLEVBQUUsU0FBUTs7d0JBQ1QsS0FBQyxVQUFVO3dCQUNYOzs7Z0JBRVIsS0FBQyxPQUFPLEVBQUUsS0FBSzt1QkFFUixLQUFDOzttQkFFWixLQUFDLE1BQU0sRUFBRTs7Ozt3QkFFakIsaUJBQUk7Ozs7UUFFQSxFQUFFLFVBQVU7UUFDWixLQUFDLE9BQU8sRUFBRTs0QkFDQSxFQUFFOzs7WUFBUjtnQkFDd0IsR0FBRyxLQUFLOztnQkFBaEMsS0FBQyxPQUFPLEdBQUcsS0FBSzs7O1lBRUYsRUFBRTs7bUJBQXBCLEtBQUMsT0FBTyxFQUFFOzs7O3dCQUVkLGtCQUFLOzs7O3VCQUswQixFQUFFOztZQUE3QixLQUFDLE9BQU8sRUFBRTs7UUFDVixLQUFDLFFBQU8sRUFBRSxnQkFBRixFQUFFLE1BQU87dUJBQ2EsRUFBRTs7bUJBQWhDLEtBQUMsT0FBTyxFQUFFOzs7O3dCQUVkLHFCQUFROzs7OzRCQUVLLEVBQUU7OztZQUFQOzJCQUM2QixFQUFFLEtBQUs7O2dCQUFwQyxLQUFDLE9BQU8sRUFBRSxLQUFLOzs7dUJBRUssRUFBRTs7bUJBQTFCLEtBQUMsT0FBTyxFQUFFOzs7O3dCQUVkLHFCQUFROzs7O1lBRUQsYUFBSzs7MEJBR087Ozs7WUFFWCxNQUFNO2dCQUVGLElBQUk7O3VCQUFXLEtBQUMsVUFBVSxFQUFHOztxQkFDN0IsSUFBSTs7dUJBQVcsS0FBQyxVQUFVOztxQkFDMUIsSUFBSTs7dUJBQVcsS0FBQyxVQUFVOztxQkFDMUIsSUFBSTs7dUJBQVcsS0FBQyxHQUFHLElBQUk7O3FCQUN2QixJQUFJOzt1QkFBVyxLQUFDLElBQUksSUFBSTs7cUJBQ3hCLElBQUk7O3VCQUFXLEtBQUMsT0FBTyxJQUFJOzttQ0FFdkIsSUFBSSxpQ0FBTSwwQkFBUSwrQkFBUyxNQUFNLE9BQU8sUUFBUTs7Z0JBQ3BELEVBQUUsTUFDRSxRQUNJLEtBQUssS0FBSyxVQUFVLEtBQUssVUFDekIsSUFBSyxFQUFFO3VCQUNmLEtBQUMsVUFBVSxFQUFHOzs7O3VCQUVkLEtBQUMsVUFBVTs7Ozs7d0JBRXZCLHdCQUFXLEdBQUUsU0FBTzs7OztZQUViLEtBQUM7O1lBRUEsS0FBSSxLQUFNLFlBQ04sS0FBTSxLQUNOLEdBQU0sS0FBQyxRQUFRO2dCQUVoQjs7dUJBQ0MsRUFBRSxPQUFPLE9BQVEsRUFBRTs7Ozt1QkFFbkIsRUFBRSxLQUFLOzs7Ozt3QkFFbkIsa0JBQUs7Ozs7YUFFUTs7OztZQUdMLEVBQUU7Ozs7aUJBQ0YsYUFBSzs7Z0JBQThCLEVBQUU7O29DQUFQOzs7b0JBQUw7b0JBQVgsS0FBQyxJQUFJOzs7O2lCQUNuQixhQUFLOztnQkFFRSxFQUFFOzt1QkFDRCxLQUFDLEtBQUssRUFBRTs7OztxQkFFSixPQUFXOztvQkFBUCxNQUFPO3dCQUNSOzs0QkFDSSxJQUFJOzs0QkFDSCxLQUFDLElBQUk7Ozs7aUNBRU0sS0FBTzs7Z0NBQUwsSUFBSztnQ0FBbEIsS0FBQyxJQUFJOzs7Ozs7Ozs7d0JBRWpDOztZQUFZLEtBQUM7O21CQUFRLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSzs7OztXQXpIdkQ7OztlQTJITSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/returner.kode
