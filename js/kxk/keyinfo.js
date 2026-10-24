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

    static modifierNames = ['shift','ctrl','alt','command','cmd']

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

    static isModifier (key)
    {
        return _k_.in(key,this.modifierNames)
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
        var _104_45_, _95_33_

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
        var _109_20_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5aW5mby5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2V5aW5mby5rb2RlIl0sIm1hcHBpbmdzIjoiOztBQVFBLE1BQU07O0lBRUYsT0FBQyxVQUFVOzs7O1FBRVAsUUFBUSxLQUFDLGNBQWM7UUFDdkIsUUFDSSxJQUFPLEtBQUMsa0JBQWtCLE9BQzFCLElBQU8sS0FBQyxnQkFBZ0IsT0FDeEIsS0FBTyxLQUFDLGtCQUFrQixPQUMxQixNQUFPLE1BQ1AsTUFBTyxLQUFDLE1BQU07ZUFDbEI7OztJQUVKLE9BQUMsaUJBQWdCLFFBQVEsT0FBTyxNQUFNLFVBQVU7O0lBQ2hELE9BQUMsaUJBQWdCLElBQUksSUFBSSxJQUFJOztJQUU3QixPQUFDLGdCQUFnQixRQUFRLE9BQU8sTUFBTSxVQUFVLFlBQVksU0FBUyxPQUFPLE1BQU0sVUFBVSxZQUFZLFNBQVMsUUFBUSxLQUFLLE9BQU8sT0FBTyxRQUFRLE1BQU8sUUFBUTs7SUFDbkssT0FBQyxnQkFBZ0IsSUFBUSxJQUFPLElBQU0sSUFBVSxJQUFZLElBQVMsSUFBTyxJQUFNLElBQVUsSUFBWSxJQUFTLElBQVEsSUFBSyxJQUFPLElBQU8sSUFBUSxJQUFPLElBQVE7O0lBR25LLE9BQUMsVUFBVTs7OztRQUVQO1FBQ0EsT0FBTzs0QkFDRSxNQUFNLE1BQU07OztZQUFqQjtnQkFDRyxLQUFDLFdBQVc7O2dCQUNYLEtBQUssS0FBSzs7OztnQkFFVixNQUFNO29CQUNNLEVBQUUsV0FBVTs7b0JBQXhCLE9BQU87Ozs7Z0JBQ2YsSUFBTyxLQUFLLEtBQUssS0FDakIsSUFBTyxJQUNQLE1BQU8sTUFDUCxLQUFPOzs7SUFFWCxPQUFDLFlBQVk7O3NCQUFNLElBQU8sS0FBQzs7O0lBRTNCLE9BQUMsbUJBQW1COzs7O1FBRWhCO1lBQ3VCLE1BQU0sV0FBWSxNQUFNLFFBQU87O1lBQXRELEtBQUssS0FBSzs7WUFDYSxNQUFNLFVBQVksTUFBTSxRQUFPOztZQUF0RCxLQUFLLEtBQUs7O1lBQ2EsTUFBTSxXQUFZLE1BQU0sUUFBTzs7WUFBdEQsS0FBSyxLQUFLOztZQUNhLE1BQU0sWUFBWSxNQUFNLFFBQU87O1lBQXRELEtBQUssS0FBSzs7ZUFDSCxLQUFLLEtBQUs7OztJQUVyQixPQUFDLGVBQWU7Ozs7UUFFWjs7OztZQUNJLFVBQVUsTUFBTSxLQUFLLFVBQVc7WUFDaEMsT0FBTyxLQUFLLGlCQUFROzt3QkFBTSxZQUFBLEVBQUc7O21CQUM3QixLQUFLLEtBQUs7O1FBRWQsTUFBTSxLQUFDLGdCQUFnQjtxQkFDcEIsSUFBVyxLQUFDOzttQkFDSixLQUFLLEtBQUMsa0JBQWtCLE9BQVE7O2VBQ3BDOzs7SUFFWCxPQUFDLGdCQUFnQjs7OztRQUViLFFBQVEsTUFBTSxRQUFRO1lBQ25CLFNBQVM7O1lBQ1IsUUFBUSxNQUFNLFFBQVEsVUFBVTtZQUNoQyxRQUFRLE1BQU0sUUFBUSxjQUFjOztlQUN4Qzs7O0lBRUosT0FBQyxpQkFBaUI7Ozs7Z0JBRVAsTUFBTTs7aUJBQ1Q7aUJBQ0E7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOztpQkFDbEI7dUJBQWtCOzs7c0JBR04sTUFBTTs7dUJBQXdCOztxQkFDbEMsTUFBTSxJQUFJLFdBQVc7O3VCQUFhLE1BQU0sSUFBSSxNQUFNLEdBQUc7O3FCQUNyRCxNQUFNLEtBQUssV0FBVzs7dUJBQVksTUFBTSxLQUFLLE1BQU0sR0FBRzs7cUJBQ3RELE1BQU0sS0FBSyxXQUFXOzt1QkFBWSxNQUFNLEtBQUssTUFBTTs7NEJBQ25ELE1BQU0sS0FBUSxTQUFTLFNBQVMsUUFBUSxZQUFZLE9BQU87O3VCQUFTLE1BQU0sSUFBSTs7cUJBQzlFLE1BQU0sUUFBTzs7dUJBQXFCOztxQkFDbEMsTUFBTSxRQUFPOzt1QkFBcUI7O3FCQUNsQyxNQUFNLFFBQU87O3VCQUFxQjs7cUJBQ2xDLE1BQU0sUUFBTzs7dUJBQXFCOztzQkFDbEMsS0FBQyxrQkFBa0IsaUJBQW5CLEtBQUMsa0JBQWtCLE9BQVEsd0JBQVU7O3VCQUFJLEtBQUMsa0JBQWtCLE9BQU87Ozs7dUJBQzlELE1BQU0sSUFBSTs7Ozs7O0lBRS9CLE9BQUMsbUJBQW1COzs7O2FBRWIsTUFBTSxjQUFOLE1BQU0sSUFBSyx3QkFBVTs7bUJBQ3BCLE1BQU07O2lCQUNGLE1BQU0sU0FBUTs7bUJBQ2xCOzs7O0lBRVIsT0FBQyxPQUFPOzs7O1FBRUosUUFBUSxLQUFDLGVBQWUsTUFBTTt1QkFDMUIsSUFBSyxTQUFJLEtBQUMsYUFBYSwwQkFBZCxLQUFDLGFBQWEsYUFBZCxLQUFDLGFBQWE7O1lBQ3ZCLFFBQVEsTUFBTSxZQUFZLE9BQU8sS0FBQyxhQUFhLEdBQUksTUFBTyxLQUFDLGFBQWE7O1FBQzVFLFFBQVEsTUFBTSxRQUFRLE1BQU87ZUFDN0IsTUFBTTs7OztlQUVQIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/keyinfo.kode
