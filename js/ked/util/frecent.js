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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJlY2VudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9mcmVjZW50LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzswQkFZYzs7O2VBRUQsS0FBSzs7Ozs7ZUFFSSxLQUFLLFFBQVEsSUFBRSxLQUFDLFFBQU0sS0FBSzs7Ozs7OztzQkFJaEM7O1lBQ0wsY0FBTSw0Q0FBNEM7OztRQUd0RCxLQUFDLFFBQVEsUUFBUSxpQkFBakIsS0FBQyxRQUFRLFFBQVEsMkJBQVEsS0FBSyxFQUFFLEtBQUssS0FBQztRQUV0QyxNQUFNLEtBQUMsUUFBUSxRQUFRO1FBRXZCLElBQUksUUFBUTtRQUNaLElBQUksT0FBUSxLQUFDOzRCQUVILEtBQUMsS0FBSzs7OztZQUNaLE9BQU8sS0FBQyxRQUFRLFFBQVE7Ozs7Ozs7O29CQUdiLEtBQUMsUUFBUTs7a0JBQVQsS0FBQyxRQUFRO1lBQ3BCLElBQUksUUFBUSxLQUFDLFFBQVE7Ozs7Ozs7O1FBSXpCLEtBQUMsTUFBTTtRQUNQLE1BQU0sS0FBQyxRQUFRO1FBQ2YsTUFBTSxPQUFPLEtBQUs7UUFDbEIsSUFBSTs7bUJBQWMsSUFBSSxHQUFHLFFBQVEsSUFBSSxHQUFHOztlQUN4Qzs7Ozs7OztRQUlBOzRCQUNTLEtBQUMsS0FBSzs7OztZQUNYLElBQUksS0FBSyxLQUFDLFFBQVEsUUFBUTs7ZUFDOUI7Ozs7Ozs7UUFJQTs7b0JBQWU7O3FCQUNYOzJCQUFXOztxQkFDWDsyQkFBVzs7Ozs7UUFFZixLQUFDLE9BQU8sT0FBTyxLQUFLO2VBQ3BCLEtBQUMsTUFBTzs7Ozs7O0FBUWhCLEtBQUssR0FBRzs7OzttQkFFSyxPQUFPOzt1QkFDSCxPQUFPLE1BQU07O1lBQ2xCLFlBQVk7WUFDWjtnQ0FDWSxPQUFPLEtBQUssT0FBTyxNQUFNLGNBQVEsVUFBSSx5QkFBQTs7OztnQkFDN0MsVUFBVSxRQUFRLE9BQU8sTUFBTSxPQUFPOztZQUMxQyxRQUFRLFFBQVEsVUFBVTttQkFDMUIsT0FBTyxNQUFNLFNBQVM7Ozs7ZUFFM0IifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/frecent.kode
