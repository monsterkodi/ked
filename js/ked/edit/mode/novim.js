var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"


novim = (function ()
{
    novim["operators"] = {d:'delete'}
    novim["commands"] = {x:function (n)
    {
        return {operator:'delete',motion:{kind:'char',count:n}}
    },X:function (n)
    {
        return {operator:'delete',motion:{kind:'charBack',count:n}}
    },D:function ()
    {
        return {operator:'delete',motion:{kind:'eol'}}
    },h:function (n)
    {
        return {operator:'move',motion:{kind:'left',count:n}}
    },j:function (n)
    {
        return {operator:'move',motion:{kind:'down',count:n}}
    },k:function (n)
    {
        return {operator:'move',motion:{kind:'up',count:n}}
    },l:function (n)
    {
        return {operator:'move',motion:{kind:'right',count:n}}
    },u:function (n)
    {
        return {operator:'undo',count:n}
    }}
    novim["motions"] = {d:function (n)
    {
        return {kind:'line',count:n}
    },w:function (n)
    {
        return {kind:'word',count:n}
    },e:function (n)
    {
        return {kind:'wordEnd',count:n}
    },b:function (n)
    {
        return {kind:'wordBack',count:n}
    },'0':function ()
    {
        return {kind:'bol'}
    },'$':function ()
    {
        return {kind:'eol'}
    },j:function (n)
    {
        return {kind:'lineDown',count:n}
    },k:function (n)
    {
        return {kind:'lineUp',count:n}
    }}
    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.reset(false)
    }

    novim.prototype["reset"] = function (announce = true)
    {
        this.count = ''
        this.operator = null
        if (announce)
        {
            console.log('novim reset')
        }
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count)
        {
            return this.reset()
        }
        else
        {
            console.log('novim exit')
            return this.state.stopMode('novim')
        }
    }

    novim.prototype["countNumber"] = function ()
    {
        if (_k_.empty(this.count))
        {
            return 1
        }
        else
        {
            return parseInt(this.count)
        }
    }

    novim.prototype["logPending"] = function ()
    {
        console.log('novim pending ▸',this.operator,this.count)
    }

    novim.prototype["complete"] = function (spec)
    {
        var operator

        operator = novim.operators[this.operator]
        this.execute({operator:operator,motion:spec(this.countNumber())})
        return this.reset(false)
    }

    novim.prototype["execute"] = function (cmd)
    {
        return this.state.executeNovim(cmd)
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var build, char, combo, command, _87_28_

        combo = ((_87_28_=event.combo) != null ? _87_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.resetOrExit()
            return true
        }
        if (_k_.in(char,['left','right','up','down']))
        {
            if (this.operator)
            {
                this.reset()
            }
            else
            {
                this.execute({operator:'move',motion:{kind:char,count:this.countNumber()}})
                this.reset(false)
            }
            return true
        }
        if (char.length !== 1)
        {
            return true
        }
        if (this.operator)
        {
            if (build = novim.motions[char])
            {
                this.complete(build)
            }
            else if (_k_.in(char,'0123456789'))
            {
                this.count += char
                this.logPending()
            }
            else
            {
                this.reset()
            }
        }
        else if (novim.operators[char])
        {
            this.operator = char
            this.logPending()
        }
        else if (command = novim.commands[char])
        {
            this.execute(command(this.countNumber()))
            this.reset(false)
        }
        else if (_k_.in(char,'0123456789'))
        {
            this.count += char
        }
        return true
    }

    novim.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return color.values('#c00000')

            case 'cursor.main':
                return color.values('#ff3030')

        }

        return defaultColor
    }

    return novim
})()

export default novim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUc7SUFJUCxPQUFDLGNBQ0csWUFBSTs7Z0JBQVEsU0FBVSxTQUFVLFFBQVUsS0FBTSxPQUFXLE1BQU87TUFDbEUsWUFBSTs7Z0JBQVEsU0FBVSxTQUFVLFFBQVUsS0FBTSxXQUFXLE1BQU87TUFDbEU7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU07TUFDNUMsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxPQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxPQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxLQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxRQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLE1BQU87O0lBSTNDLE9BQUMsYUFDRyxZQUFJOztnQkFBUSxLQUFNLE9BQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLE9BQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFVBQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFdBQVcsTUFBTztNQUNwQzs7Z0JBQVUsS0FBTTtNQUNoQjs7Z0JBQVUsS0FBTTtNQUNoQixZQUFJOztnQkFBUSxLQUFNLFdBQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFNBQVcsTUFBTzs7YUFFeEMsT0FBSTs7UUFBRDs7UUFFQyxLQUFDLE9BQU87UUFDUixLQUFDLE1BQU07OztxQkFFWCxvQkFBTyxXQUFTOztRQUVaLEtBQUMsUUFBUTtRQUNULEtBQUMsV0FBVztZQUNTOztZQUFyQixZQUFJOzs7O3FCQUVSOztZQUVPLEtBQUMsWUFBWSxLQUFDOzttQkFDYixLQUFDOzs7O1lBRUQsWUFBSTttQkFDSixLQUFDLE1BQU0sU0FBUzs7OztxQkFFeEI7O3NCQUF5QixLQUFDOzttQkFBVzs7OzttQkFBTyxTQUFTLEtBQUM7Ozs7cUJBRXREOztRQUVJLFlBQUksa0JBQWtCLEtBQUMsU0FBUyxLQUFDOzs7cUJBRXJDLHVCQUFVOzs7O1FBRU4sV0FBVyxNQUFNLFVBQVUsS0FBQztRQUU1QixLQUFDLFNBQVUsU0FBVSxTQUFVLE9BQVEsS0FBSyxLQUFDO2VBQzdDLEtBQUMsTUFBTTs7O3FCQUVYLHNCQUFTOztlQUFPLEtBQUMsTUFBTSxhQUFhOzs7cUJBUXBDLHdCQUFXLEtBQUk7Ozs7UUFFWCxrQkFBUSxNQUFNLDJCQUFRO1FBQ3RCLG9CQUFjLE1BQU0sU0FBUSxNQUFNLE9BQU87WUFHdEMsTUFBTSxTQUFTLFdBQVcsTUFBTSxTQUFTLFlBQVksTUFBTSxTQUFTOzttQkFDaEU7O21CQUVKLE9BQVUsTUFBTTs7WUFDZixLQUFDO21CQUNFOzttQkFHSixNQUFTLE9BQU8sUUFBUSxLQUFLOztnQkFDekIsS0FBQzs7Z0JBQ0EsS0FBQzs7OztnQkFFRCxLQUFDLFNBQVUsU0FBVSxPQUFRLFFBQVUsS0FBTSxLQUFNLE1BQU8sS0FBQztnQkFDM0QsS0FBQyxNQUFNOzttQkFDUjs7WUFHSSxLQUFLLFdBQVU7O21CQUF2Qjs7WUFFQSxLQUFDOztnQkFFRyxRQUFRLE1BQU0sUUFBUTs7Z0JBQ3JCLEtBQUMsU0FBUzs7NEJBQ04sS0FBUTs7Z0JBQ1osS0FBQyxTQUFTO2dCQUNWLEtBQUM7Ozs7Z0JBRUQsS0FBQzs7O2lCQUVELE1BQU0sVUFBVTs7WUFFcEIsS0FBQyxXQUFXO1lBQ1osS0FBQzs7aUJBRUcsVUFBVSxNQUFNLFNBQVM7O1lBRTdCLEtBQUMsUUFBUSxRQUFRLEtBQUM7WUFDbEIsS0FBQyxNQUFNOzt3QkFFSCxLQUFROztZQUVaLEtBQUMsU0FBUzs7ZUFHZDs7O3FCQVFKLHlCQUFZLFdBQVU7O2dCQUVYOztpQkFDSDt1QkFBb0IsTUFBTSxPQUFPOztpQkFDakM7dUJBQW9CLE1BQU0sT0FBTzs7OztlQUVyQzs7O1dBdElDOzs7ZUF3SUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
