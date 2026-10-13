var events


events = (function ()
{
    function events ()
    {
        this.dispatcher = new EventTarget
    }

    events.prototype["on"] = function (eventName, cb)
    {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9ldmVudHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztRQVlRLEtBQUMsaUJBQWlCOzs7OztlQUlsQixLQUFDLFdBQVcsaUJBQWlCOzttQkFBa0IsR0FBRyxNQUFNLEdBQUksRUFBRTs7Ozs7Ozs7UUFJOUQsWUFBWSxNQUFNO1FBQ2xCLE1BQU0sT0FBTztlQUViLEtBQUMsV0FBVyxjQUFjOzs7OztlQUkxQixLQUFDLFdBQVcsb0JBQW9CLFVBQVU7Ozs7OztlQUUzQyJ9
//# sourceURL=file://kode/kxk/events.kode
