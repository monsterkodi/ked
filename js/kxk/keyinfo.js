var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

class Keyinfo
{
    static forEvent (event)
    {
        var combo, info

        combo = this.comboForEvent(event)
        info = {mod:this.modifiersForEvent(event),key:this.keynameForEvent(event),char:this.characterForEvent(event),combo:combo,short:this.short(combo)}
        return info
    }

    static modifierNames = ['shift','ctrl','alt','command']

    static modifierChars = ['⌂','⌃','⌥','⌘']

    static iconKeyNames = ['shift','ctrl','alt','command','backspace','delete','home','end','page up','page down','return','enter','up','down','left','right','tab','space','click']

    static iconKeyChars = ['⌂','⌃','⌥','⌘','⌫','⌦','↖','↘','⇞','⇟','↩','↩','▴','▾','◂','▸','⤠','␣','⍝']

    static forCombo (combo)
    {
        var c, char, key, mods

        mods = []
        char = null
        var list = _k_.list(combo.split('+'))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (this.isModifier(c))
            {
                mods.push(c)
            }
            else
            {
                key = c
                if (c.length === 1)
                {
                    char = c
                }
            }
        }
        return {mod:mods.join('+'),key:key,combo:combo,char:char}
    }

    static isModifier (keyname)
    {
        return _k_.in(keyname,this.modifierNames)
    }

    static modifiersForEvent (event)
    {
        var mods

        mods = []
        if (event.metaKey || event.key === 'Meta')
        {
            mods.push('command')
        }
        if (event.altKey || event.key === 'Alt')
        {
            mods.push('alt')
        }
        if (event.ctrlKey || event.key === 'Control')
        {
            mods.push('ctrl')
        }
        if (event.shiftKey || event.key === 'Shift')
        {
            mods.push('shift')
        }
        return mods.join('+')
    }

    static comboForEvent (event)
    {
        var join, key

        join = function ()
        {
            var args

            args = [].slice.call(arguments,0)
            args = args.filter(function (e)
            {
                return (e != null ? e.length : undefined)
            })
            return args.join('+')
        }
        key = this.keynameForEvent(event)
        if (!(_k_.in(key,this.modifierNames)))
        {
            return join(this.modifiersForEvent(event),key)
        }
        return ''
    }

    static convertCmdCtrl (combo)
    {
        var index

        index = combo.indexOf('cmdctrl')
        if (index >= 0)
        {
            combo = combo.replace('cmdctrl','command')
            combo = combo.replace('alt+command','command+alt')
        }
        return combo
    }

    static keynameForEvent (event)
    {
        var _105_45_, _96_33_

        switch (event.code)
        {
            case 'IntlBackslash':
            case 'Backslash':
                return '\\'

            case 'Equal':
                return '='

            case 'Minus':
                return '-'

            case 'Plus':
                return '+'

            case 'Slash':
                return '/'

            case 'Quote':
                return "'"

            case 'Comma':
                return ','

            case 'Period':
                return '.'

            case 'Space':
                return 'space'

            case 'Escape':
                return 'esc'

            case 'Semicolon':
                return ';'

            case 'BracketLeft':
                return '['

            case 'BracketRight':
                return ']'

            case 'Backquote':
                return '`'

            default:
                if (!(event.key != null))
            {
                return ''
            }
            else if (event.key.startsWith('Arrow'))
            {
                return event.key.slice(5).toLowerCase()
            }
            else if (event.code.startsWith('Key'))
            {
                return event.code.slice(3).toLowerCase()
            }
            else if (event.code.startsWith('Digit'))
            {
                return event.code.slice(5)
            }
            else if (_k_.in(event.key,['Delete','Insert','Enter','Backspace','Home','End']))
            {
                return event.key.toLowerCase()
            }
            else if (event.key === 'PageUp')
            {
                return 'page up'
            }
            else if (event.key === 'PageDown')
            {
                return 'page down'
            }
            else if (event.key === 'Control')
            {
                return 'ctrl'
            }
            else if (event.key === 'Meta')
            {
                return 'command'
            }
            else if ((this.characterForEvent(event) != null ? this.characterForEvent(event).length : undefined) === 1)
            {
                return this.characterForEvent(event).toLowerCase()
            }
            else
            {
                return event.key.toLowerCase()
            }
        }

    }

    static characterForEvent (event)
    {
        var _110_20_

        if ((event.key != null ? event.key.length : undefined) === 1)
        {
            return event.key
        }
        else if (event.code === 'NumpadEqual')
        {
            return '='
        }
    }

    static short (combo)
    {
        var i, short

        short = this.convertCmdCtrl(combo.toLowerCase())
        for (var _a_ = i = 0, _b_ = this.iconKeyNames.length; (_a_ <= _b_ ? i < this.iconKeyNames.length : i > this.iconKeyNames.length); (_a_ <= _b_ ? ++i : --i))
        {
            short = short.replace(new RegExp(this.iconKeyNames[i],'gi'),this.iconKeyChars[i])
        }
        short = short.replace(/\+/g,'')
        return short.toUpperCase()
    }
}

export default Keyinfo;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5aW5mby5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2V5aW5mby5rb2RlIl0sIm1hcHBpbmdzIjoiOztBQVFBLE1BQU07O0lBRUYsaUJBQVc7Ozs7UUFFUCxRQUFRLEtBQUMsY0FBYztRQUN2QixRQUNJLElBQU8sS0FBQyxrQkFBa0IsT0FDMUIsSUFBTyxLQUFDLGdCQUFnQixPQUN4QixLQUFPLEtBQUMsa0JBQWtCLE9BQzFCLE1BQU8sTUFDUCxNQUFPLEtBQUMsTUFBTTtlQUNsQjs7OzRCQUVhLFFBQVEsT0FBTyxNQUFNOzs0QkFDckIsSUFBSSxJQUFJLElBQUk7OzJCQUVaLFFBQVEsT0FBTyxNQUFNLFVBQVUsWUFBWSxTQUFTLE9BQU8sTUFBTSxVQUFVLFlBQVksU0FBUyxRQUFRLEtBQUssT0FBTyxPQUFPLFFBQVEsTUFBTyxRQUFROzsyQkFDbEosSUFBUSxJQUFPLElBQU0sSUFBVSxJQUFZLElBQVMsSUFBTyxJQUFNLElBQVUsSUFBWSxJQUFTLElBQVEsSUFBSyxJQUFPLElBQU8sSUFBUSxJQUFPLElBQVE7O0lBSW5LLGlCQUFXOzs7O1FBRVA7UUFDQSxPQUFPOzRCQUNFLE1BQU0sTUFBTTs7O1lBQWpCO2dCQUNHLEtBQUMsV0FBVzs7Z0JBQ1gsS0FBSyxLQUFLOzs7O2dCQUVWLE1BQU07b0JBQ00sRUFBRSxXQUFVOztvQkFBeEIsT0FBTzs7OztnQkFDZixJQUFPLEtBQUssS0FBSyxLQUNqQixJQUFPLElBQ1AsTUFBTyxNQUNQLEtBQU87OztJQUVYLG1CQUFhOztzQkFBVyxRQUFXLEtBQUM7OztJQUVwQywwQkFBb0I7Ozs7UUFFaEI7WUFDdUIsTUFBTSxXQUFZLE1BQU0sUUFBTzs7WUFBdEQsS0FBSyxLQUFLOztZQUNhLE1BQU0sVUFBWSxNQUFNLFFBQU87O1lBQXRELEtBQUssS0FBSzs7WUFDYSxNQUFNLFdBQVksTUFBTSxRQUFPOztZQUF0RCxLQUFLLEtBQUs7O1lBQ2EsTUFBTSxZQUFZLE1BQU0sUUFBTzs7WUFBdEQsS0FBSyxLQUFLOztlQUNILEtBQUssS0FBSzs7O0lBRXJCLHNCQUFnQjs7OztRQUVaOzs7O1lBQ0ksVUFBVSxNQUFNLEtBQUssVUFBVztZQUNoQyxPQUFPLEtBQUssaUJBQVE7O3dCQUFNLFlBQUEsRUFBRzs7bUJBQzdCLEtBQUssS0FBSzs7UUFFZCxNQUFNLEtBQUMsZ0JBQWdCO3FCQUNwQixJQUFXLEtBQUM7O21CQUNKLEtBQUssS0FBQyxrQkFBa0IsT0FBUTs7ZUFDcEM7OztJQUVYLHVCQUFpQjs7OztRQUViLFFBQVEsTUFBTSxRQUFRO1lBQ25CLFNBQVM7O1lBQ1IsUUFBUSxNQUFNLFFBQVEsVUFBVTtZQUNoQyxRQUFRLE1BQU0sUUFBUSxjQUFjOztlQUN4Qzs7O0lBRUosd0JBQWtCOzs7O2dCQUVQLE1BQU07O2lCQUNUO2lCQUNBO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7aUJBQ2xCO3VCQUFrQjs7O3NCQUdOLE1BQU07O3VCQUF3Qjs7cUJBQ2xDLE1BQU0sSUFBSSxXQUFXOzt1QkFBYSxNQUFNLElBQUksTUFBTSxHQUFHOztxQkFDckQsTUFBTSxLQUFLLFdBQVc7O3VCQUFZLE1BQU0sS0FBSyxNQUFNLEdBQUc7O3FCQUN0RCxNQUFNLEtBQUssV0FBVzs7dUJBQVksTUFBTSxLQUFLLE1BQU07OzRCQUNuRCxNQUFNLEtBQVEsU0FBUyxTQUFTLFFBQVEsWUFBWSxPQUFPOzt1QkFBUyxNQUFNLElBQUk7O3FCQUM5RSxNQUFNLFFBQU87O3VCQUFxQjs7cUJBQ2xDLE1BQU0sUUFBTzs7dUJBQXFCOztxQkFDbEMsTUFBTSxRQUFPOzt1QkFBcUI7O3FCQUNsQyxNQUFNLFFBQU87O3VCQUFxQjs7c0JBQ2xDLEtBQUMsa0JBQWtCLGlCQUFuQixLQUFDLGtCQUFrQixPQUFRLHdCQUFVOzt1QkFBSSxLQUFDLGtCQUFrQixPQUFPOzs7O3VCQUM5RCxNQUFNLElBQUk7Ozs7OztJQUUvQiwwQkFBb0I7Ozs7YUFFYixNQUFNLGNBQU4sTUFBTSxJQUFLLHdCQUFVOzttQkFDcEIsTUFBTTs7aUJBQ0YsTUFBTSxTQUFROzttQkFDbEI7Ozs7SUFFUixjQUFROzs7O1FBRUosUUFBUSxLQUFDLGVBQWUsTUFBTTt1QkFDMUIsSUFBSyxTQUFJLEtBQUMsYUFBYSwwQkFBZCxLQUFDLGFBQWEsYUFBZCxLQUFDLGFBQWE7O1lBQ3ZCLFFBQVEsTUFBTSxZQUFZLE9BQU8sS0FBQyxhQUFhLEdBQUksTUFBTyxLQUFDLGFBQWE7O1FBQzVFLFFBQVEsTUFBTSxRQUFRLE1BQU87ZUFDN0IsTUFBTTs7OztlQUVQIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/keyinfo.kode
