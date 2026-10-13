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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5aW5mby5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2V5aW5mby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVlRLFFBQVEsS0FBQyxjQUFjO1FBQ3ZCLFFBQ0ksSUFBTyxLQUFDLGtCQUFrQixPQUMxQixJQUFPLEtBQUMsZ0JBQWdCLE9BQ3hCLEtBQU8sS0FBQyxrQkFBa0IsT0FDMUIsTUFBTyxNQUNQLE1BQU8sS0FBQyxNQUFNO2VBQ2xCOzs7NEJBRWEsUUFBUSxPQUFPLE1BQU07OzRCQUNyQixJQUFJLElBQUksSUFBSTs7MkJBRVosUUFBUSxPQUFPLE1BQU0sVUFBVSxZQUFZLFNBQVMsT0FBTyxNQUFNLFVBQVUsWUFBWSxTQUFTLFFBQVEsS0FBSyxPQUFPLE9BQU8sUUFBUSxNQUFPLFFBQVE7OzJCQUNsSixJQUFRLElBQU8sSUFBTSxJQUFVLElBQVksSUFBUyxJQUFPLElBQU0sSUFBVSxJQUFZLElBQVMsSUFBUSxJQUFLLElBQU8sSUFBTyxJQUFRLElBQU8sSUFBUTs7Ozs7O1FBTS9KO1FBQ0EsT0FBTzs0QkFDRSxNQUFNLE1BQU07Ozs7Z0JBQ2QsS0FBQyxXQUFXOztnQkFDWCxLQUFLLEtBQUs7Ozs7Z0JBRVYsTUFBTTtvQkFDTSxFQUFFLFdBQVU7O29CQUF4QixPQUFPOzs7O2dCQUNmLElBQU8sS0FBSyxLQUFLLEtBQ2pCLElBQU8sSUFDUCxNQUFPLE1BQ1AsS0FBTzs7Ozs7c0JBRWEsUUFBVyxLQUFDOzs7Ozs7O1FBSWhDO1lBQ3VCLE1BQU0sV0FBWSxNQUFNLFFBQU87O1lBQXRELEtBQUssS0FBSzs7WUFDYSxNQUFNLFVBQVksTUFBTSxRQUFPOztZQUF0RCxLQUFLLEtBQUs7O1lBQ2EsTUFBTSxXQUFZLE1BQU0sUUFBTzs7WUFBdEQsS0FBSyxLQUFLOztZQUNhLE1BQU0sWUFBWSxNQUFNLFFBQU87O1lBQXRELEtBQUssS0FBSzs7ZUFDSCxLQUFLLEtBQUs7Ozs7Ozs7UUFJakI7Ozs7WUFDSSxVQUFVLE1BQU0sS0FBSyxVQUFXO1lBQ2hDLE9BQU8sS0FBSzs7d0JBQWMsWUFBQSxFQUFHOzttQkFDN0IsS0FBSyxLQUFLOztRQUVkLE1BQU0sS0FBQyxnQkFBZ0I7cUJBQ3BCLElBQVcsS0FBQzs7bUJBQ0osS0FBSyxLQUFDLGtCQUFrQixPQUFROztlQUNwQzs7Ozs7OztRQUlQLFFBQVEsTUFBTSxRQUFRO1lBQ25CLFNBQVM7O1lBQ1IsUUFBUSxNQUFNLFFBQVEsVUFBVTtZQUNoQyxRQUFRLE1BQU0sUUFBUSxjQUFjOztlQUN4Qzs7Ozs7OztnQkFJTyxNQUFNOztpQkFDVDtpQkFDQTt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7O2lCQUNsQjt1QkFBa0I7OztzQkFHTixNQUFNOzt1QkFBd0I7O3FCQUNsQyxNQUFNLElBQUksV0FBVzs7dUJBQWEsTUFBTSxJQUFJLE1BQU0sR0FBRzs7cUJBQ3JELE1BQU0sS0FBSyxXQUFXOzt1QkFBWSxNQUFNLEtBQUssTUFBTSxHQUFHOztxQkFDdEQsTUFBTSxLQUFLLFdBQVc7O3VCQUFZLE1BQU0sS0FBSyxNQUFNOzs0QkFDbkQsTUFBTSxLQUFRLFNBQVMsU0FBUyxRQUFRLFlBQVksT0FBTzs7dUJBQVMsTUFBTSxJQUFJOztxQkFDOUUsTUFBTSxRQUFPOzt1QkFBcUI7O3FCQUNsQyxNQUFNLFFBQU87O3VCQUFxQjs7cUJBQ2xDLE1BQU0sUUFBTzs7dUJBQXFCOztxQkFDbEMsTUFBTSxRQUFPOzt1QkFBcUI7O3NCQUNsQyxLQUFDLGtCQUFrQixpQkFBbkIsS0FBQyxrQkFBa0IsT0FBUSx3QkFBVTs7dUJBQUksS0FBQyxrQkFBa0IsT0FBTzs7Ozt1QkFDOUQsTUFBTSxJQUFJOzs7Ozs7Ozs7O2FBSXhCLE1BQU0sY0FBTixNQUFNLElBQUssd0JBQVU7O21CQUNwQixNQUFNOztpQkFDRixNQUFNLFNBQVE7O21CQUNsQjs7Ozs7Ozs7UUFJSixRQUFRLEtBQUMsZUFBZSxNQUFNOzJCQUNyQixTQUFJLEtBQUMsYUFBYSwwQkFBZCxLQUFDLGFBQWEsYUFBZCxLQUFDLGFBQWE7O1lBQ3ZCLFFBQVEsTUFBTSxZQUFZLE9BQU8sS0FBQyxhQUFhLEdBQUksTUFBTyxLQUFDLGFBQWE7O1FBQzVFLFFBQVEsTUFBTSxRQUFRLE1BQU87ZUFDN0IsTUFBTTs7OztlQUVQIn0=
//# sourceURL=file://kode/kxk/keyinfo.kode
