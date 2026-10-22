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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9ldmVudHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRUyxVQUFUOzthQUVJOztRQUVJLEtBQUMsaUJBQWlCOzs7bUNBRXRCLElBQUksV0FBVTs7eUJBRUg7O21CQUFlLGNBQU0sb0JBQW9CLFVBQVU7O2VBQzFELEtBQUMsV0FBVyxpQkFBaUIsb0JBQVk7O21CQUFNLEdBQUcsTUFBTSxHQUFJLEVBQUU7Ozs7c0JBRWxFLG1CQUFNLFdBQVU7Ozs7UUFFWixZQUFZLE1BQU07UUFDbEIsTUFBTSxPQUFPO2VBRWIsS0FBQyxXQUFXLGNBQWM7OztzQkFFOUIsNkJBQWdCLFdBQVU7O2VBRXRCLEtBQUMsV0FBVyxvQkFBb0IsVUFBVTs7O1dBcEJ6Qzs7O2VBc0JGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/events.kode
