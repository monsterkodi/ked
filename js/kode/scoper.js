var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        var arg, e, t, _37_25_, _40_37_, _40_42_, _43_72_, _43_77_, _45_30_

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
            else
            {
                if (((_43_72_=arg.prop) != null ? (_43_77_=_43_72_.obj) != null ? _43_77_.text : undefined : undefined) !== '@')
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
        var fv, insert, key, keyval, op, v, val, _74_29_, _85_25_, _90_37_, _90_45_

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
                for (var _c_ = 0; _c_ < list.length; _c_++)
                {
                    v = list[_c_]
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
                    else if (op.lhs.object)
                    {
                        var list1 = _k_.list(op.lhs.object.keyvals)
                        for (var _d_ = 0; _d_ < list1.length; _d_++)
                        {
                            keyval = list1[_d_]
                            if (keyval.type === 'var')
                            {
                                insert(keyval.text,'curly')
                            }
                        }
                    }
                    else if (op.lhs.array)
                    {
                        var list2 = _k_.list(op.lhs.array.items)
                        for (var _e_ = 0; _e_ < list2.length; _e_++)
                        {
                            val = list2[_e_]
                            if (val.type === 'var')
                            {
                                insert(val.text,'array')
                            }
                        }
                    }
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
                    var list3 = ((_90_45_=(fv.array != null ? fv.array.items : undefined)) != null ? _90_45_ : e.for.vals)
                    for (var _f_ = 0; _f_ < list3.length; _f_++)
                    {
                        v = list3[_f_]
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

    Scoper.prototype["verb"] = function ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    return Scoper
})()

export default Scoper;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvc2NvcGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsVUFBRDs7YUFLSSxRQUFJOztRQUFEOztRQUVDLEtBQUMsVUFBVSxLQUFDLEtBQUssS0FBSztRQUN0QixLQUFDLFFBQVUsS0FBQyxLQUFLLEtBQUs7UUFDdEIsS0FBQyxNQUFVLEtBQUMsS0FBSyxLQUFLOzs7c0JBRTFCLHNCQUFTOztRQUVMLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUMsTUFBTTtlQUNQOzs7c0JBRUosb0JBQU87Ozs7UUFFSCxLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUs7UUFDTixLQUFDLEtBQUssS0FBSyxLQUFLOzRCQUNBLEtBQUs7OztZQUFWO1lBQVgsS0FBQyxJQUFJOztRQUNMLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztlQUNOOzs7K0JBRUosVUFBTTs7OztRQUVGLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSztRQUNOLEtBQUMsS0FBSyxLQUFLLEVBQUUsS0FBSzs2QkFFUCxFQUFFLGVBQUYsRUFBRSxLQUFNLE9BQU87OztZQUF0QjtnQkFDRyxJQUFJLElBQUk7O2dCQUNQLEtBQUMsa0JBQVMsS0FBSzs7cUJBQ1gsY0FBSSxJQUFJLHNDQUFXLHVCQUFLOztnQkFDNUIsS0FBQyxrQkFBUyxLQUFLOzs7OzhCQUVpQyxJQUFJLGlDQUFNLHVCQUFLLGtDQUFROztvQkFBdkUsS0FBQyxLQUFLLG1DQUFtQzs7Ozs4QkFFakMsRUFBRSxlQUFGLEVBQUUsS0FBTTs7O1lBQWI7WUFBWCxLQUFDLElBQUk7O1FBQ0wsS0FBQyxLQUFLO1FBQ04sS0FBQyxLQUFLO1FBQ04sS0FBQyxLQUFLO2VBQ047OztzQkFFSixrQkFBSzs7OzthQUVROzs7O1FBRVQsb0JBQVUsR0FBRTs7OztnQ0FFZSxLQUFDOzs7Z0JBQVI7b0JBQVgsSUFBSTs7Ozs7aUNBQ2MsS0FBQzs7O2dCQUFSO29CQUFYLElBQUk7Ozs7O1lBRVQsS0FBQyxLQUFLLE9BQU8sR0FBSSxJQUFJO1lBRXJCLEtBQUMsa0JBQVMsTUFBSyxLQUFLLEVBQUcsS0FBSzttQkFDNUIsS0FBQyxrQkFBUyxLQUFLOztZQUVoQixFQUFFOztnQkFDRSxFQUFFLFNBQVE7O2dCQUNULEtBQUMsSUFBSSxFQUFFOzs7O2lCQUVQLGFBQUs7O2dCQUE4QixFQUFFOztvQ0FBUDs7O29CQUFMO29CQUFYLEtBQUMsSUFBSTs7OztpQkFDbkIsYUFBSzs7Z0JBRU4sS0FBSyxFQUFFOztvQkFDSCxHQUFHLFNBQVMsU0FBUTs7eUJBQ2hCLEdBQUcsY0FBSCxHQUFHLElBQUs7O3dCQUNQLE9BQU8sR0FBRyxJQUFJLEtBQU0sR0FBRyxTQUFTOzs2QkFDNUIsR0FBRyxJQUFJOzs2Q0FDRyxHQUFHLElBQUksT0FBTzs7OzRCQUF4QjtnQ0FDRyxPQUFPLFNBQVE7O2dDQUNkLE9BQU8sT0FBTyxLQUFNOzs7OzZCQUN4QixHQUFHLElBQUk7OzZDQUNBLEdBQUcsSUFBSSxNQUFNOzs7NEJBQXBCO2dDQUNHLElBQUksU0FBUTs7Z0NBQ1gsT0FBTyxJQUFJLEtBQU07Ozs7OztnQkFFbEMsTUFBSyxFQUFFLGNBQUYsRUFBRSxJQUFLOztvQkFFUixHQUFHOztvQkFDRixPQUFPLEdBQUcsS0FBTTs7OzsyQ0FFUCxHQUFHLGdCQUFILEdBQUcsTUFBTyx3Q0FBUSxFQUFFLElBQUk7Ozt3QkFBN0I7NEJBQ3dCLEVBQUU7OzRCQUExQixPQUFPLEVBQUUsS0FBTTs7Ozs7Z0JBRXhCLEVBQUU7O2dCQUNELEtBQUMsS0FBSyxTQUFTO29CQUNaLEVBQUUsT0FBTyxJQUFJLFNBQVEsVUFBYyxFQUFFLE9BQU8sSUFBSTs7b0JBQy9DLFdBQVcsRUFBRSxPQUFPLEtBQUssUUFBUSxFQUFFLE9BQU8sS0FBSyxPQUFPOzs7Z0JBRTNELEVBQUU7O2dCQUNELEtBQUMsS0FBSyxTQUFTO29CQUNaLEVBQUUsT0FBTyxJQUFJLFNBQVE7O29CQUNwQixXQUFXLEVBQUUsT0FBTyxLQUFLLFFBQVEsRUFBRSxPQUFPLEtBQUssT0FBTzs7O2dCQUUzRCxFQUFFOztnQkFDRCxPQUFPLEVBQUUsU0FBUyxLQUFLOztnQkFFeEIsRUFBRTs7Z0JBQ0QsS0FBQyxLQUFLLEVBQUU7Ozs7cUJBRUssT0FBVzs7b0JBQVAsTUFBTztvQkFBeEIsS0FBQyxJQUFJOzs7Ozs7O3NCQUdqQjs7WUFBWSxLQUFDOzttQkFBUSxRQUFRLElBQUksTUFBTSxRQUFRLElBQUk7Ozs7V0EvR3REOzs7ZUFpSE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/scoper.kode
