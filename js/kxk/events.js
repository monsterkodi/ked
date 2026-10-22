var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var events


events = (function ()
{
    function events ()
    {
        this.dispatcher = new EventTarget
    }

    events.prototype["on"] = function (eventName, cb)
    {
        if (!(_k_.isFunc(cb)))
        {
            return console.error('cb NOT A FUNCTION',eventName,cb)
        }
        return this.dispatcher.addEventListener(eventName,function (e)
        {
            return cb.apply(cb,e.args)
        })
    }

    events.prototype["emit"] = function (eventName, ...args)
    {
        var event

        event = new Event(eventName)
        event.args = args
        return this.dispatcher.dispatchEvent(event)
    }

    events.prototype["removeListener"] = function (eventName, listener)
    {
        return this.dispatcher.removeEventListener(eventName,listener)
    }

    return events
})()

export default events;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9ldmVudHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRUyxVQUFUOzthQUVJOztRQUVJLEtBQUMsaUJBQWlCOzs7bUNBRXRCLElBQUksV0FBVTs7Y0FFRyxXQUFOOzttQkFBZSxjQUFNLG9CQUFvQixVQUFVOztlQUMxRCxLQUFDLFdBQVcsaUJBQWlCLG9CQUFZOzttQkFBTSxHQUFHLE1BQU0sR0FBSSxFQUFFOzs7O3NCQUVsRSxtQkFBTSxXQUFVOzs7O1FBRVosWUFBWSxNQUFNO1FBQ2xCLE1BQU0sT0FBTztlQUViLEtBQUMsV0FBVyxjQUFjOzs7c0JBRTlCLDZCQUFnQixXQUFVOztlQUV0QixLQUFDLFdBQVcsb0JBQW9CLFVBQVU7OztXQXBCekM7OztlQXNCRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/events.kode
