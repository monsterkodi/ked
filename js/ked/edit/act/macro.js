var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            this.replayMacroKeys(keys)
        }
        return true
    },
    replayMacroKeys:function (keys)
    {
        var event
    
        if (this.novim.macroReplaying >= 100)
        {
            return this.macroError('macro recursion too deep')
        }
        this.novim.macroReplaying += 1
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
            this.novim.macroReplaying -= 1
        }
        return true
    },
    feedKey:function (key, event)
    {
        var char, combo, result, _130_28_
    
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
        combo = ((_130_28_=event.combo) != null ? _130_28_ : key)
        if (!_k_.empty(char) && (char === combo || _k_.in(combo,['space','shift+space','return','tab']) || combo.slice(0, -1) === 'shift+'))
        {
            this.insert(char)
            return 'inserted'
        }
        return 'unhandled'
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjcm8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L21hY3JvLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQWEsVUFBQTtJQUFNOzs7SUFJZixpQ0FBeUIsS0FBSTs7OztRQUV6QixTQUFTLEtBQUMsV0FBVyxJQUFJO1FBRXpCLEtBQUMsZUFBZSxJQUFJO2VBRXBCOztJQUVKLHFCQUFhLEtBQUk7Ozs7UUFFYixtQkFBUSxnQkFBQSxNQUFPLHdDQUFRO1FBQ3ZCLFFBQVEsZ0JBQUEsTUFBTztnQkFFYixJQUFLLElBQUssTUFBTyxNQUFPLEtBQU07O0lBRXBDLHlCQUFpQixLQUFJOztZQUVkLEtBQUMsTUFBTTs7WUFDTixLQUFDLE1BQU0sZUFBZTttQkFDcEI7O1lBRUssS0FBQyxNQUFNLGlCQUFpQjs7bUJBQWpDOzthQUNhLEtBQUM7O21CQUFkOztRQUVGLEtBQUMsZUFBZSxLQUFLLEtBQUssS0FBQyxXQUFXLElBQUk7ZUFFMUM7O0lBRUo7O2VBQXdCLEtBQUMsTUFBTSxlQUFlOztJQUU5Qyw4QkFBcUIsVUFBUzs7OzthQUVYOzttQkFBYjs7UUFFRixPQUFPLFNBQVM7WUFFTCxLQUFLLFdBQVU7O21CQUF4Qjs7cUJBQ1MsS0FBWTs7bUJBQXJCOztRQUVGLEtBQUMsa0JBQ0csU0FBVSxLQUNWLE9BQVUsT0FDVjtRQUVKLEtBQUssS0FBSyxxQkFBb0IsTUFBTSxLQUFDLEtBQUssU0FBUyxLQUFLLE9BQU87ZUFFL0Q7O0lBRUo7Ozs7UUFFSSxZQUFZLEtBQUM7YUFFRTs7bUJBQWI7O2VBRUssS0FBQztRQUVSLE9BQU8sVUFBVTtZQUNZLFVBQVU7O1lBQXZDLE9BQU8sS0FBSzs7UUFFWixLQUFDLE1BQU0sU0FBUyxTQUFTLEtBQUssVUFBVTtRQUV4QyxLQUFLLEtBQUssb0JBQW1CLE1BQU0sS0FBQyxLQUFLLFNBQVMsVUFBVTtlQUU1RDs7SUFFSixxQkFBWTs7UUFFUixLQUFLLEtBQUssY0FBYztlQUV4Qjs7SUFFSix3QkFBZTs7YUFFK0IsS0FBQyxNQUFNOzttQkFBL0MsS0FBQyxXQUFXOztlQUVkLEtBQUMsVUFBVSxLQUFDLE1BQU0sa0JBQWtCOztJQUV4QyxvQkFBVyxVQUFTOzs7O2FBRXlCOzttQkFBdkMsS0FBQyxXQUFXOztRQUVkLFFBQVEsS0FBQyxNQUFNLFNBQVMsS0FBSzthQUV5Qjs7bUJBQXBELEtBQUMsdUJBQXVCOztRQUUxQixPQUFPLE1BQU07UUFFYixRQUFBLGVBQUEsT0FBUSxLQUFDLE1BQU0sU0FBUyxZQUFZLEtBQUMsTUFBTSxTQUFTLGFBQWE7c0JBRVQ7O21CQUF0RCxLQUFDLHVCQUF1Qjs7UUFFMUIsS0FBQyxNQUFNLG9CQUFvQjtRQUUzQixZQUFRLElBQUcsZ0JBQUEsUUFBUTt1QkFFZixJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxLQUFDLGdCQUFnQjs7ZUFFckI7O0lBRUosMEJBQWlCOzs7O1lBRVYsS0FBQyxNQUFNLGtCQUFrQjs7bUJBQ3RCLEtBQUMsV0FBVzs7UUFFbEIsS0FBQyxNQUFNLGtCQUFrQjs7O2dDQUdSOzs7Z0JBQVQ7Z0JBQ0EsS0FBQyxRQUFRLE1BQU0sSUFBSTs7O2VBQ3JCOztZQUNGLEtBQUMsNEJBQTRCLElBQUk7Ozs7WUFFakMsS0FBQyxNQUFNLGtCQUFrQjs7ZUFFN0I7O0lBRUosa0JBQVUsS0FBSTs7OztRQUVWLFNBQVMsS0FBQyxVQUFVLElBQUk7WUFFVCxXQUFVOzttQkFBdkI7O2FBQ21COzttQkFBbkI7O1FBRUYsT0FBUSxNQUFNO1FBQ2QsbUJBQVEsTUFBTSw0QkFBUTt1QkFFYixVQUNBLFNBQVEsZ0JBQ1QsT0FBVSxRQUFRLGNBQWMsU0FBUyxXQUN6QyxZQUFNLFdBQVU7O1lBQ3BCLEtBQUMsT0FBTzttQkFDTjs7ZUFFTiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/macro.kode
