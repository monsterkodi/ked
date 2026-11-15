var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../../kxk.js"
let post = kxk.post

export default {
    handleKeyWithRecording:function (key, event)
    {
        var result
    
        result = this.keyHandler(key,event)
        this.recordMacroKey(key,event)
        return result
    },
    macroEvent:function (key, event)
    {
        var char, combo, _15_29_
    
        combo = ((_15_29_=(event != null ? event.combo : undefined)) != null ? _15_29_ : key)
        char = (event != null ? event.char : undefined)
        return {key:key,combo:combo,char:char}
    },
    recordMacroKey:function (key, event)
    {
        if (this.macroSkipKey)
        {
            this.macroSkipKey = false
            return false
        }
        if (this.macroReplaying > 0)
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
    isMacroRecording:function ()
    {
        return !_k_.empty(this.macroRecording)
    },
    markMacroControlKey:function ()
    {
        return this.macroSkipKey = true
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
        this.macroRecording = null
        name = recording.register
        if (recording.append)
        {
            name = name.toUpperCase()
        }
        this.registers.setMacro(name,recording.keys)
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
        if (!this.macroLastRegister)
        {
            return this.macroError('no previous macro')
        }
        return this.playMacro(this.macroLastRegister,count)
    },
    playMacro:function (register, count)
    {
        var i, keys, n, value
    
        if (!register)
        {
            return this.macroError('invalid register')
        }
        value = this.registers.read(register)
        if (!value)
        {
            return this.macroError(`register ${register} is empty`)
        }
        keys = value.keys
        keys = (keys != null ? keys : this.registers.keysForText(this.registers.textForValue(value)))
        if (_k_.empty(keys))
        {
            return this.macroError(`register ${register} is empty`)
        }
        this.macroLastRegister = register
        n = _k_.max(1,((count != null ? count : 1)))
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            this.replayMacroKeys(keys)
        }
        return true
    },
    replayMacroKeys:function (keys)
    {
        var event
    
        if (this.macroReplaying >= 100)
        {
            return this.macroError('macro recursion too deep')
        }
        this.macroReplaying += 1
        try
        {
            var list = _k_.list(keys)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                event = list[_c_]
                this.feedKey(event.key,event)
            }
        }
        catch (err)
        {
            this.macroError(`macro failed: ${err.message}`)
        }
        finally
        {
            this.macroReplaying -= 1
        }
        return true
    },
    feedKey:function (key, event)
    {
        var char, combo, result, _132_28_
    
        result = this.handleKey(key,event)
        if (result !== 'unhandled')
        {
            return 'handled'
        }
        if (!event)
        {
            return 'unhandled'
        }
        char = event.char
        combo = ((_132_28_=event.combo) != null ? _132_28_ : key)
        if (!_k_.empty(char) && (char === combo || _k_.in(combo,['space','shift+space','return','tab']) || combo.slice(0, -1) === 'shift+'))
        {
            this.insert(char)
            return 'inserted'
        }
        return 'unhandled'
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L21hY3JvLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQWEsVUFBQTtJQUFNOzs7SUFJZixpQ0FBeUIsS0FBSTs7OztRQUV6QixTQUFTLEtBQUMsV0FBVyxJQUFJO1FBRXpCLEtBQUMsZUFBZSxJQUFJO2VBRXBCOztJQUVKLHFCQUFhLEtBQUk7Ozs7UUFFYixtQkFBUSxnQkFBQSxNQUFPLHdDQUFRO1FBQ3ZCLFFBQVEsZ0JBQUEsTUFBTztnQkFFYixJQUFLLElBQUssTUFBTyxNQUFPLEtBQU07O0lBRXBDLHlCQUFpQixLQUFJOztZQUVkLEtBQUM7O1lBQ0EsS0FBQyxlQUFlO21CQUNkOztZQUVLLEtBQUMsaUJBQWlCOzttQkFBM0I7O2FBQ2EsS0FBQzs7bUJBQWQ7O1FBRUYsS0FBQyxlQUFlLEtBQUssS0FBSyxLQUFDLFdBQVcsSUFBSTtlQUUxQzs7SUFFSjs7MEJBQTJCLEtBQUM7O0lBRTVCOztlQUF3QixLQUFDLGVBQWU7O0lBRXhDLDhCQUFxQixVQUFTOzs7O2FBRVg7O21CQUFiOztRQUVGLE9BQU8sU0FBUztZQUVMLEtBQUssV0FBVTs7bUJBQXhCOztxQkFDUyxLQUFZOzttQkFBckI7O1FBRUYsS0FBQyxrQkFDRyxTQUFVLEtBQ1YsT0FBVSxPQUNWO1FBRUosS0FBSyxLQUFLLHFCQUFvQixNQUFNLEtBQUMsS0FBSyxTQUFTLEtBQUssT0FBTztlQUUvRDs7SUFFSjs7OztRQUVJLFlBQVksS0FBQzthQUVFOzttQkFBYjs7UUFFRixLQUFDLGlCQUFpQjtRQUVsQixPQUFPLFVBQVU7WUFDWSxVQUFVOztZQUF2QyxPQUFPLEtBQUs7O1FBRVosS0FBQyxVQUFVLFNBQVMsS0FBSyxVQUFVO1FBRW5DLEtBQUssS0FBSyxvQkFBbUIsTUFBTSxLQUFDLEtBQUssU0FBUyxVQUFVO2VBRTVEOztJQUVKLHFCQUFZOztRQUVSLEtBQUssS0FBSyxjQUFjO2VBRXhCOztJQUVKLHdCQUFlOzthQUUrQixLQUFDOzttQkFBekMsS0FBQyxXQUFXOztlQUVkLEtBQUMsVUFBVSxLQUFDLGtCQUFrQjs7SUFFbEMsb0JBQVcsVUFBUzs7OzthQUV5Qjs7bUJBQXZDLEtBQUMsV0FBVzs7UUFFZCxRQUFRLEtBQUMsVUFBVSxLQUFLO2FBRThCOzttQkFBcEQsS0FBQyx1QkFBdUI7O1FBRTFCLE9BQU8sTUFBTTtRQUViLFFBQUEsZUFBQSxPQUFRLEtBQUMsVUFBVSxZQUFZLEtBQUMsVUFBVSxhQUFhO3NCQUVDOzttQkFBdEQsS0FBQyx1QkFBdUI7O1FBRTFCLEtBQUMsb0JBQW9CO1FBRXJCLFlBQVEsSUFBRyxnQkFBQSxRQUFRO3VCQUVmLElBQUssU0FBSSxxQkFBQSxRQUFBOztZQUNULEtBQUMsZ0JBQWdCOztlQUVyQjs7SUFFSiwwQkFBaUI7Ozs7WUFFVixLQUFDLGtCQUFrQjs7bUJBQ2hCLEtBQUMsV0FBVzs7UUFFbEIsS0FBQyxrQkFBa0I7OztnQ0FHRjs7O2dCQUFUO2dCQUNBLEtBQUMsUUFBUSxNQUFNLElBQUk7OztlQUNyQjs7WUFDRixLQUFDLDRCQUE0QixJQUFJOzs7O1lBRWpDLEtBQUMsa0JBQWtCOztlQUV2Qjs7SUFFSixrQkFBVSxLQUFJOzs7O1FBRVYsU0FBUyxLQUFDLFVBQVUsSUFBSTtZQUVULFdBQVU7O21CQUF2Qjs7YUFDbUI7O21CQUFuQjs7UUFFRixPQUFRLE1BQU07UUFDZCxtQkFBUSxNQUFNLDRCQUFRO3VCQUViLFVBQ0EsU0FBUSxnQkFDVCxPQUFVLFFBQVEsY0FBYyxTQUFTLFdBQ3pDLFlBQU0sV0FBVTs7WUFDcEIsS0FBQyxPQUFPO21CQUNOOztlQUVOIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/macro.kode
