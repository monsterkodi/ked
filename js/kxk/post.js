var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var POST, poster

POST = "__POST__"
import events from "events"

events.setMaxListeners(1000)
class Poster extends EventTarget
{
    constructor ()
    {
        super()
    
        this.dispose = this.dispose.bind(this)
        this.addEventListener(POST,this.onPostEvent)
    }

    onPostEvent (event)
    {
        var out

        out = new Event(event.event)
        out.args = event.args
        return this.dispatchEvent(out)
    }

    dispose ()
    {
        return this.removeEventListener(POST,this.onPostEvent)
    }

    post (event, args)
    {
        var e

        e = new Event(POST)
        e.event = event
        e.args = args
        return this.dispatchEvent(e)
    }
}

poster = new Poster
export default {
    poster:poster,
    emit:function (event, ...args)
    {
        return poster.post(event,args)
    },
    on:function (event, cb)
    {
        if (_k_.isFunc(cb))
        {
            return poster.addEventListener(event,function (e)
            {
                return cb.apply(cb,e.args)
            })
        }
        else
        {
            console.log('post.on no func?',event,cb)
        }
    },
    removeListener:function (event, cb)
    {
        return poster.removeEventListener(event,cb)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvcG9zdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBUUEsT0FBTztPQUVILGFBQUE7O0FBQ0osT0FBTyxnQkFBZ0I7QUFFdkIsTUFBTSxlQUFlOztJQUVqQjs7Ozs7UUFFSSxLQUFDLGlCQUFpQixLQUFLLEtBQUM7OztJQUU1QixhQUFhOzs7O1FBRVQsVUFBVSxNQUFNLE1BQU07UUFDdEIsSUFBSSxPQUFZLE1BQU07ZUFDdEIsS0FBQyxjQUFjOzs7SUFFbkI7O2VBRUksS0FBQyxvQkFBb0IsS0FBSyxLQUFDOzs7SUFFL0IsTUFBTSxPQUFNOzs7O1FBRVIsUUFBUSxNQUFNO1FBQ2QsRUFBRSxRQUFRO1FBQ1YsRUFBRSxPQUFPO2VBQ1QsS0FBQyxjQUFjOzs7O0FBRXZCLGFBQWE7O0lBSVQsT0FBUTtJQUVSLGVBQVEsT0FBTTs7ZUFBVyxPQUFPLEtBQUssTUFBTTs7SUFFM0MsYUFBSSxPQUFNOztZQUNHLFdBQU47O21CQUNDLE9BQU8saUJBQWlCLGdCQUFPOzt1QkFBTSxHQUFHLE1BQU0sR0FBRyxFQUFFOzs7OztZQUVuRCxZQUFJLG1CQUFtQixNQUFNOzs7SUFFckMseUJBQWdCLE9BQU07O2VBQU0sT0FBTyxvQkFBb0IsTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/post.kode
