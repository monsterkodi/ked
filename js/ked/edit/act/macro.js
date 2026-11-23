var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../../kxk.js"
let post = kxk.post

export default {
    macroEvent:function (key, event)
    {
        var char, combo, _7_29_
    
        combo = ((_7_29_=(event != null ? event.combo : undefined)) != null ? _7_29_ : key)
        char = (event != null ? event.char : undefined)
        return {key:key,combo:combo,char:char}
    },
    markMacroControlKey:function ()
    {
        return this.novim.macroSkipKey = true
    },
    startMacroRecording:function (register, append)
    {
        var name
    
        if (!register)
        {
            return false
        }
        name = register.toLowerCase()
        if (name.length !== 1)
        {
            return false
        }
        if (!(_k_.in(name,'abcdefghijklmnopqrstuvwxyz')))
        {
            return false
        }
        this.macroRecording = {register:name,append:append,keys:[]}
        post.emit('novim.macro.start',{state:this.name,register:name,append:append})
        return true
    },
    stopMacroRecording:function ()
    {
        var name, recording
    
        recording = this.macroRecording
        if (!recording)
        {
            return false
        }
        delete this.macroRecording
        name = recording.register
        if (recording.append)
        {
            name = name.toUpperCase()
        }
        this.novim.register.setMacro(name,recording.keys)
        post.emit('novim.macro.stop',{state:this.name,register:recording.register})
        return true
    },
    macroError:function (text)
    {
        post.emit('novim.error',text)
        return false
    },
    playLastMacro:function (count)
    {
        if (!this.novim.macroLastRegister)
        {
            return this.macroError('no previous macro')
        }
        return this.playMacro(this.novim.macroLastRegister,count)
    },
    playMacro:function (register, count)
    {
        var i, keys, n, value
    
        if (!register)
        {
            return this.macroError('invalid register')
        }
        value = this.novim.register.read(register)
        if (!value)
        {
            return this.macroError(`register ${register} is empty`)
        }
        keys = value.keys
        keys = (keys != null ? keys : this.novim.register.keysForText(this.novim.register.textForValue(value)))
        if (_k_.empty(keys))
        {
            return this.macroError(`register ${register} is empty`)
        }
        this.novim.macroLastRegister = register
        n = _k_.max(1,((count != null ? count : 1)))
        for (i = 0; i < n; i++)
        {
            this.replayMacroKeys(keys)
        }
        return true
    },
    replayMacroKeys:function (events)
    {
        var event
    
        if (this.novim.macroReplaying >= 100)
        {
            return this.macroError('macro recursion too deep')
        }
        this.novim.macroReplaying += 1
        try
        {
            var list = _k_.list(events)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                event = list[_a_]
                this.feedKey(event.key,event)
            }
        }
        catch (err)
        {
            this.macroError(`macro failed: ${err.message}`)
        }
        finally
        {
            this.novim.macroReplaying -= 1
        }
        return true
    },
    recordMacroKey:function (key, event)
    {
        if (this.novim.macroSkipKey)
        {
            this.novim.macroSkipKey = false
            return false
        }
        if (this.novim.macroReplaying > 0)
        {
            return false
        }
        if (!this.macroRecording)
        {
            return false
        }
        this.macroRecording.keys.push(this.macroEvent(key,event))
        return true
    },
    feedKey:function (key, event)
    {
        var char, combo, result, _124_28_
    
        result = this.handleKey(key,event)
        this.recordMacroKey(key,event)
        if (result !== 'unhandled')
        {
            return 'handled'
        }
        if (!event)
        {
            return 'unhandled'
        }
        char = event.char
        combo = ((_124_28_=event.combo) != null ? _124_28_ : key)
        if (!_k_.empty(char) && (char === combo || _k_.in(combo,['space','shift+space','return','tab']) || combo.slice(0, -1) === 'shift+'))
        {
            this.insert(char)
            return 'inserted'
        }
        return 'unhandled'
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L21hY3JvLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQWEsVUFBQTtJQUFNOzs7SUFJZixxQkFBYSxLQUFJOzs7O1FBRWIsa0JBQVEsZ0JBQUEsTUFBTyx1Q0FBUTtRQUN2QixRQUFRLGdCQUFBLE1BQU87Z0JBRWIsSUFBSyxJQUFLLE1BQU8sTUFBTyxLQUFNOztJQUVwQzs7ZUFBd0IsS0FBQyxNQUFNLGVBQWU7O0lBRTlDLDhCQUFxQixVQUFTOzs7O2FBRVg7O21CQUFiOztRQUVGLE9BQU8sU0FBUztZQUVMLEtBQUssV0FBVTs7bUJBQXhCOztxQkFDUyxLQUFZOzttQkFBckI7O1FBRUYsS0FBQyxrQkFDRyxTQUFVLEtBQ1YsT0FBVSxPQUNWO1FBRUosS0FBSyxLQUFLLHFCQUFvQixNQUFNLEtBQUMsS0FBSyxTQUFTLEtBQUssT0FBTztlQUUvRDs7SUFFSjs7OztRQUVJLFlBQVksS0FBQzthQUVFOzttQkFBYjs7ZUFFSyxLQUFDO1FBRVIsT0FBTyxVQUFVO1lBQ1ksVUFBVTs7WUFBdkMsT0FBTyxLQUFLOztRQUVaLEtBQUMsTUFBTSxTQUFTLFNBQVMsS0FBSyxVQUFVO1FBRXhDLEtBQUssS0FBSyxvQkFBbUIsTUFBTSxLQUFDLEtBQUssU0FBUyxVQUFVO2VBRTVEOztJQUVKLHFCQUFZOztRQUVSLEtBQUssS0FBSyxjQUFjO2VBRXhCOztJQUVKLHdCQUFlOzthQUUrQixLQUFDLE1BQU07O21CQUEvQyxLQUFDLFdBQVc7O2VBRWQsS0FBQyxVQUFVLEtBQUMsTUFBTSxrQkFBa0I7O0lBRXhDLG9CQUFXLFVBQVM7Ozs7YUFFeUI7O21CQUF2QyxLQUFDLFdBQVc7O1FBRWQsUUFBUSxLQUFDLE1BQU0sU0FBUyxLQUFLO2FBRXlCOzttQkFBcEQsS0FBQyx1QkFBdUI7O1FBRTFCLE9BQU8sTUFBTTtRQUViLFFBQUEsZUFBQSxPQUFRLEtBQUMsTUFBTSxTQUFTLFlBQVksS0FBQyxNQUFNLFNBQVMsYUFBYTtzQkFFVDs7bUJBQXRELEtBQUMsdUJBQXVCOztRQUUxQixLQUFDLE1BQU0sb0JBQW9CO1FBRTNCLFlBQVEsSUFBRyxnQkFBQSxRQUFRO2FBRWYsSUFBSyxPQUFJOztZQUNULEtBQUMsZ0JBQWdCOztlQUVyQjs7SUFFSiwwQkFBaUI7Ozs7WUFFVixLQUFDLE1BQU0sa0JBQWtCOzttQkFDdEIsS0FBQyxXQUFXOztRQUVsQixLQUFDLE1BQU0sa0JBQWtCOzs7Z0NBR1I7OztnQkFBVDtnQkFDQSxLQUFDLFFBQVEsTUFBTSxJQUFJOzs7ZUFDckI7O1lBQ0YsS0FBQyw0QkFBNEIsSUFBSTs7OztZQUVqQyxLQUFDLE1BQU0sa0JBQWtCOztlQUU3Qjs7SUFFSix5QkFBaUIsS0FBSTs7WUFFZCxLQUFDLE1BQU07O1lBQ04sS0FBQyxNQUFNLGVBQWU7bUJBQ3BCOztZQUVLLEtBQUMsTUFBTSxpQkFBaUI7O21CQUFqQzs7YUFDYSxLQUFDOzttQkFBZDs7UUFFRixLQUFDLGVBQWUsS0FBSyxLQUFLLEtBQUMsV0FBVyxJQUFJO2VBRTFDOztJQUVKLGtCQUFVLEtBQUk7Ozs7UUFFVixTQUFTLEtBQUMsVUFBVSxJQUFJO1FBRXhCLEtBQUMsZUFBZSxJQUFJO1lBRUwsV0FBVTs7bUJBQXZCOzthQUNtQjs7bUJBQW5COztRQUVGLE9BQVEsTUFBTTtRQUNkLG1CQUFRLE1BQU0sNEJBQVE7dUJBRWIsVUFDQSxTQUFRLGdCQUNULE9BQVUsUUFBUSxjQUFjLFNBQVMsV0FDekMsWUFBTSxXQUFVOztZQUNwQixLQUFDLE9BQU87bUJBQ047O2VBRU4ifQ==
//# sourceURL=../../../../kode/ked/edit/act/macro.kode
