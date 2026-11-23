var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Scoper


Scoper = (function ()
{
    function Scoper (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
        this.raw = this.kode.args.raw
    }

    Scoper.prototype["collect"] = function (tl)
    {
        this.maps = []
        this.args = []
        this.vars = []
        this.scope(tl)
        return tl
    }

    Scoper.prototype["scope"] = function (body)
    {
        var e

        this.maps.push({})
        this.args.push({})
        this.vars.push(body.vars)
        var list = _k_.list(body.exps)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            this.exp(e)
        }
        this.maps.pop()
        this.args.pop()
        this.vars.pop()
        return body
    }

    Scoper.prototype["func"] = function (f)
    {
        var arg, e, t, _37_25_, _40_37_, _40_42_, _42_34_, _45_72_, _45_77_, _47_30_

        this.maps.push({})
        this.args.push({})
        this.vars.push(f.body.vars)
        var list = _k_.list((f.args != null ? f.args.parens.exps : undefined))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            arg = list[_a_]
            if (t = arg.text)
            {
                this.args.slice(-1)[0][t] = t
            }
            else if (t = ((_40_37_=arg.operation) != null ? (_40_42_=_40_37_.lhs) != null ? _40_42_.text : undefined : undefined))
            {
                this.args.slice(-1)[0][t] = t
            }
            else if (t = (arg.spread != null ? arg.spread.exp.text : undefined))
            {
                this.args.slice(-1)[0][t] = t
            }
            else
            {
                if (((_45_72_=arg.prop) != null ? (_45_77_=_45_72_.obj) != null ? _45_77_.text : undefined : undefined) !== '@')
                {
                    this.verb('todo: scoper handle complex arg?',arg)
                }
            }
        }
        var list1 = _k_.list((f.body != null ? f.body.exps : undefined))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            e = list1[_b_]
            this.exp(e)
        }
        this.maps.pop()
        this.args.pop()
        this.vars.pop()
        return f
    }

    Scoper.prototype["exp"] = function (e)
    {
        var fv, insert, insertArray, k, key, op, v, val, _84_29_, _93_25_, _98_37_, _98_45_

        if (!e)
        {
            return
        }
        insert = (function (v, t)
        {
            var arg, map

            var list = _k_.list(this.maps)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                map = list[_a_]
                if (map[v])
                {
                    return
                }
            }
            var list1 = _k_.list(this.args)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                arg = list1[_b_]
                if (arg[v])
                {
                    return
                }
            }
            this.verb(yellow(v),red(t))
            this.vars.slice(-1)[0].push({text:v,type:t})
            return this.maps.slice(-1)[0][v] = t
        }).bind(this)
        insertArray = (function (items)
        {
            var val

            var list = _k_.list(items)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                val = list[_c_]
                if (_k_.in(val.type,['var','keyword']))
                {
                    insert(val.text,'array')
                }
                else if (val.array)
                {
                    insertArray(val.array.items)
                }
            }
        }).bind(this)
        if (e.type)
        {
            if (e.type === 'code')
            {
                this.exp(e.exps)
            }
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (var _d_ = 0; _d_ < list.length; _d_++)
                {
                    v = list[_d_]
                    this.exp(v)
                }
            }
        }
        else if (e instanceof Object)
        {
            if (op = e.operation)
            {
                if (op.operator.text === '=')
                {
                    if ((op.lhs != null ? op.lhs.text : undefined))
                    {
                        insert(op.lhs.text,op.operator.text)
                    }
                    else if (op.lhs.array)
                    {
                        insertArray(op.lhs.array.items)
                    }
                }
            }
            if (e.destruct)
            {
                var list1 = _k_.list(e.destruct.keys)
                for (var _e_ = 0; _e_ < list1.length; _e_++)
                {
                    k = list1[_e_]
                    insert(k.target.text,'curly')
                }
            }
            if (fv = (e.for != null ? e.for.vals : undefined))
            {
                if (fv.text)
                {
                    insert(fv.text,'for')
                }
                else
                {
                    var list2 = ((_98_45_=(fv.array != null ? fv.array.items : undefined)) != null ? _98_45_ : e.for.vals)
                    for (var _f_ = 0; _f_ < list2.length; _f_++)
                    {
                        v = list2[_f_]
                        if (v.text)
                        {
                            insert(v.text,'for')
                        }
                    }
                }
            }
            if (e.assert)
            {
                this.verb('assert',e)
                if (e.assert.obj.type !== 'var' && !e.assert.obj.index)
                {
                    insert(`_${e.assert.qmrk.line}_${e.assert.qmrk.col}_`,'?.')
                }
            }
            if (e.qmrkop)
            {
                this.verb('qmrkop',e)
                if (e.qmrkop.lhs.type !== 'var')
                {
                    insert(`_${e.qmrkop.qmrk.line}_${e.qmrkop.qmrk.col}_`,' ? ')
                }
            }
            if (e.function)
            {
                insert(e.function.name.text)
            }
            if (e.func)
            {
                this.func(e.func)
            }
            else
            {
                for (key in e)
                {
                    val = e[key]
                    this.exp(val)
                }
            }
        }
        return
    }

    Scoper.prototype["verb"] = function (...args)
    {
        if (this.debug)
        {
            return console.log(...args)
        }
    }

    return Scoper
})()

export default Scoper;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc2NvcGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsVUFBRDs7YUFLSSxRQUFJOztRQUFEOztRQUVDLEtBQUMsVUFBVSxLQUFDLEtBQUssS0FBSztRQUN0QixLQUFDLFFBQVUsS0FBQyxLQUFLLEtBQUs7UUFDdEIsS0FBQyxNQUFVLEtBQUMsS0FBSyxLQUFLOzs7c0JBRTFCLHNCQUFTOztRQUVMLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUMsTUFBTTtlQUNQOzs7c0JBRUosb0JBQU87Ozs7UUFFSCxLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUssS0FBSyxLQUFLOzRCQUNBLEtBQUs7OztZQUFWO1lBQVgsS0FBQyxJQUFJOztRQUNMLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztlQUNOOzs7K0JBRUosVUFBTTs7OztRQUVGLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSyxLQUFLLEVBQUUsS0FBSzs2QkFFUCxFQUFFLGVBQUYsRUFBRSxLQUFNLE9BQU87OztZQUF0QjtnQkFDRyxJQUFJLElBQUk7O2dCQUNQLEtBQUMsa0JBQVMsS0FBSzs7cUJBQ1gsY0FBSSxJQUFJLHNDQUFXLHVCQUFLOztnQkFDNUIsS0FBQyxrQkFBUyxLQUFLOztxQkFDWCxLQUFJLElBQUksaUJBQUosSUFBSSxPQUFRLElBQUk7O2dCQUN4QixLQUFDLGtCQUFTLEtBQUs7Ozs7OEJBRWlDLElBQUksaUNBQU0sdUJBQUssa0NBQVE7O29CQUF2RSxLQUFDLEtBQUssbUNBQW1DOzs7OzhCQUVqQyxFQUFFLGVBQUYsRUFBRSxLQUFNOzs7WUFBYjtZQUFYLEtBQUMsSUFBSTs7UUFDTCxLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUs7ZUFDTjs7O3NCQUVKLGtCQUFLOzs7O2FBRVE7Ozs7UUFFVCxvQkFBVSxHQUFFOzs7O2dDQUVlLEtBQUM7OztnQkFBUjtvQkFBWCxJQUFJOzs7OztpQ0FDYyxLQUFDOzs7Z0JBQVI7b0JBQVgsSUFBSTs7Ozs7WUFFVCxLQUFDLEtBQUssT0FBTyxHQUFJLElBQUk7WUFFckIsS0FBQyxrQkFBUyxNQUFLLEtBQUssRUFBRyxLQUFLO21CQUM1QixLQUFDLGtCQUFTLEtBQUs7O1FBRW5CLHlCQUFlOzs7O2dDQUVBOzs7Z0JBQVA7MkJBQ0csSUFBSSxNQUFTLE1BQU07O29CQUNsQixPQUFPLElBQUksS0FBTTs7eUJBQ2IsSUFBSTs7b0JBQ1IsWUFBWSxJQUFJLE1BQU07Ozs7WUFFL0IsRUFBRTs7Z0JBQ0UsRUFBRSxTQUFROztnQkFDVCxLQUFDLElBQUksRUFBRTs7OztpQkFFUCxhQUFLOztnQkFBOEIsRUFBRTs7b0NBQVA7OztvQkFBTDtvQkFBWCxLQUFDLElBQUk7Ozs7aUJBQ25CLGFBQUs7O2dCQUVOLEtBQUssRUFBRTs7b0JBQ0gsR0FBRyxTQUFTLFNBQVE7O3lCQUNoQixHQUFHLGNBQUgsR0FBRyxJQUFLOzt3QkFDUCxPQUFPLEdBQUcsSUFBSSxLQUFNLEdBQUcsU0FBUzs7NkJBQzVCLEdBQUcsSUFBSTs7d0JBQ1gsWUFBWSxHQUFHLElBQUksTUFBTTs7OztnQkFFbEMsRUFBRTs7cUNBQ1EsRUFBRSxTQUFTOzs7b0JBQWhCO29CQUNBLE9BQU8sRUFBRSxPQUFPLEtBQU07OztnQkFFM0IsTUFBSyxFQUFFLGNBQUYsRUFBRSxJQUFLOztvQkFFUixHQUFHOztvQkFDRixPQUFPLEdBQUcsS0FBTTs7OzsyQ0FFUCxHQUFHLGdCQUFILEdBQUcsTUFBTyx3Q0FBUSxFQUFFLElBQUk7Ozt3QkFBN0I7NEJBQ3dCLEVBQUU7OzRCQUExQixPQUFPLEVBQUUsS0FBTTs7Ozs7Z0JBRXhCLEVBQUU7O2dCQUNELEtBQUMsS0FBSyxTQUFTO29CQUNaLEVBQUUsT0FBTyxJQUFJLFNBQVEsVUFBYyxFQUFFLE9BQU8sSUFBSTs7b0JBQy9DLFdBQVcsRUFBRSxPQUFPLEtBQUssUUFBUSxFQUFFLE9BQU8sS0FBSyxPQUFPOzs7Z0JBRTNELEVBQUU7O2dCQUNELEtBQUMsS0FBSyxTQUFTO29CQUNaLEVBQUUsT0FBTyxJQUFJLFNBQVE7O29CQUNwQixXQUFXLEVBQUUsT0FBTyxLQUFLLFFBQVEsRUFBRSxPQUFPLEtBQUssT0FBTzs7O2dCQUUzRCxFQUFFOztnQkFDRCxPQUFPLEVBQUUsU0FBUyxLQUFLOztnQkFFeEIsRUFBRTs7Z0JBQ0QsS0FBQyxLQUFLLEVBQUU7Ozs7cUJBRUssT0FBVzs7b0JBQVAsTUFBTztvQkFBeEIsS0FBQyxJQUFJOzs7Ozs7O3NCQUdqQixzQkFBTTs7WUFBOEIsS0FBQzs7bUJBQXRCLFFBQVEsT0FBSTs7OztXQXZIOUI7OztlQXlITSJ9
//# sourceURL=../../kode/kode/scoper.kode
