var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var POST, poster

POST = "__POST__"
import events from "events"

events.setMaxListeners(100)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvcG9zdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBUUEsT0FBTzs7O0FBR1AsT0FBTyxnQkFBZ0I7cUJBRUY7Ozs7Ozs7UUFJYixLQUFDLGlCQUFpQixLQUFLLEtBQUM7Ozs7Ozs7UUFJeEIsVUFBVSxNQUFNLE1BQU07UUFDdEIsSUFBSSxPQUFZLE1BQU07ZUFDdEIsS0FBQyxjQUFjOzs7OztlQUlmLEtBQUMsb0JBQW9CLEtBQUssS0FBQzs7Ozs7OztRQUkzQixRQUFRLE1BQU07UUFDZCxFQUFFLFFBQVE7UUFDVixFQUFFLE9BQU87ZUFDVCxLQUFDLGNBQWM7Ozs7QUFFdkIsYUFBYTs7SUFJVCxPQUFRO0lBRVI7O2VBQXlCLE9BQU8sS0FBSyxNQUFNOztJQUUzQzs7dUJBQ087O21CQUNDLE9BQU8saUJBQWlCOzt1QkFBYSxHQUFHLE1BQU0sR0FBRyxFQUFFOzs7OztZQUVuRCxZQUFJLG1CQUFtQixNQUFNOzs7SUFFckM7O2VBQTRCLE9BQU8sb0JBQW9CLE1BQU0ifQ==
//# sourceURL=file://kode/kxk/post.kode
