var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var frecent

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let pretty = kxk.pretty
let post = kxk.post


frecent = (function ()
{
    function frecent ()
    {}

    frecent["buckets"] = {file:{}}
    frecent["now"] = function ()
    {
        return Date.now()
    }

    frecent["frecent"] = function (item)
    {
        return item.rank / (1 + this.now() - item.time)
    }

    frecent["sample"] = function (bucket, key, delta)
    {
        var bi, item, rec, _25_30_

        if (_k_.empty(key))
        {
            console.error("frecent.sample - needs key to sample! got",key)
            return
        }
        this.buckets[bucket][key] = ((_25_30_=this.buckets[bucket][key]) != null ? _25_30_ : {rank:1,time:this.now()})
        rec = this.buckets[bucket][key]
        rec.rank += delta
        rec.time = this.now()
        var list = _k_.list(this.list(bucket))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            bi = list[_a_]
            item = this.buckets[bucket][bi]
        }
    }

    frecent["score"] = function (bucket)
    {
        var pth, rec

        for (pth in this.buckets[bucket])
        {
            rec = this.buckets[bucket][pth]
            rec.score = this.frecent(rec)
        }
    }

    frecent["list"] = function (bucket)
    {
        var bkt, lst

        this.score(bucket)
        bkt = this.buckets[bucket]
        lst = Object.keys(bkt)
        lst.sort((function (a, b)
        {
            return bkt[b].score - bkt[a].score
        }).bind(this))
        return lst
    }

    frecent["store"] = function (bucket)
    {
        var i, lst

        lst = {}
        var list = _k_.list(this.list(bucket))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            i = list[_a_]
            lst[i] = this.buckets[bucket][i]
        }
        return lst
    }

    frecent["fileAction"] = function (file, action)
    {
        var delta

        delta = ((function ()
        {
            switch (action)
            {
                case 'loaded':
                    return 1

                case 'saved':
                    return 10

            }

        }).bind(this))()
        this.sample('file',file,delta)
        return this.score('file')
    }

    return frecent
})()

post.on('session.merge',function (recent)
{
    var file, maxRecent, newRecent

    if (!_k_.empty(recent.files))
    {
        if (!_k_.empty(recent.files.recent))
        {
            maxRecent = 60
            newRecent = {}
            var list = _k_.list(Object.keys(recent.files.recent).slice(0, typeof maxRecent === 'number' ? maxRecent : -1))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                newRecent[file] = recent.files.recent[file]
            }
            frecent.buckets['file'] = newRecent
            return recent.files.recent = newRecent
        }
    }
})
export default frecent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJlY2VudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9mcmVjZW50LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVUyxXQUFUOzs7OzswQkFFYzthQUVWOztlQUFTLEtBQUs7OzthQUVkLHNCQUFVOztlQUFRLEtBQUssUUFBUSxJQUFFLEtBQUMsUUFBTSxLQUFLOzs7YUFFN0MscUJBQVMsUUFBTyxLQUFJOzs7O3NCQUVQOztZQUNMLGNBQU0sNENBQTRDOzs7UUFHdEQsS0FBQyxRQUFRLFFBQVEsaUJBQWpCLEtBQUMsUUFBUSxRQUFRLDJCQUFRLEtBQUssRUFBRSxLQUFLLEtBQUM7UUFFdEMsTUFBTSxLQUFDLFFBQVEsUUFBUTtRQUV2QixJQUFJLFFBQVE7UUFDWixJQUFJLE9BQVEsS0FBQzs0QkFFSCxLQUFDLEtBQUs7OztZQUFaO1lBQ0EsT0FBTyxLQUFDLFFBQVEsUUFBUTs7OzthQUVoQyxvQkFBUTs7OztvQkFDVyxLQUFDLFFBQVE7O2tCQUFULEtBQUMsUUFBUTtZQUNwQixJQUFJLFFBQVEsS0FBQyxRQUFROzs7O2FBRTdCLG1CQUFPOzs7O1FBRUgsS0FBQyxNQUFNO1FBQ1AsTUFBTSxLQUFDLFFBQVE7UUFDZixNQUFNLE9BQU8sS0FBSztRQUNsQixJQUFJLGdCQUFNLEdBQUU7O21CQUFNLElBQUksR0FBRyxRQUFRLElBQUksR0FBRzs7ZUFDeEM7OzthQUVKLG9CQUFROzs7O1FBRUo7NEJBQ1MsS0FBQyxLQUFLOzs7WUFBWDtZQUNBLElBQUksS0FBSyxLQUFDLFFBQVEsUUFBUTs7ZUFDOUI7OzthQUVKLHlCQUFhLE1BQUs7Ozs7UUFFZDs7b0JBQWU7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVzs7Ozs7UUFFZixLQUFDLE9BQU8sT0FBTyxLQUFLO2VBQ3BCLEtBQUMsTUFBTzs7O1dBbERQOzs7QUEwRFQsS0FBSyxHQUFHLDBCQUFpQjs7OzttQkFFWixPQUFPOzt1QkFDSCxPQUFPLE1BQU07O1lBQ2xCLFlBQVk7WUFDWjtnQ0FDWSxPQUFPLEtBQUssT0FBTyxNQUFNLGNBQVEsVUFBSSx5QkFBQTs7O2dCQUE3QztnQkFDQSxVQUFVLFFBQVEsT0FBTyxNQUFNLE9BQU87O1lBQzFDLFFBQVEsUUFBUSxVQUFVO21CQUMxQixPQUFPLE1BQU0sU0FBUzs7OztlQUUzQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/frecent.kode
