var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"


novim = (function ()
{
    novim["operators"] = {d:'delete'}
    novim["commands"] = {x:function (n)
    {
        return novim.plural(n,'character','characters')
    },X:function (n)
    {
        return novim.plural(n,'character','characters') + ' before'
    },D:function ()
    {
        return 'to end of line'
    }}
    novim["motions"] = {d:function (n)
    {
        return novim.plural(n,'line','lines')
    },w:function (n)
    {
        return novim.plural(n,'word','words')
    },e:function (n)
    {
        return 'to end of ' + novim.plural(n,'word','words')
    },b:function (n)
    {
        return novim.plural(n,'word','words') + ' back'
    },'0':function ()
    {
        return 'to start of line'
    },'$':function ()
    {
        return 'to end of line'
    },j:function (n)
    {
        return novim.plural(n,'line','lines') + ' down'
    },k:function (n)
    {
        return novim.plural(n,'line','lines') + ' up'
    }}
    novim["plural"] = function (n, one, many)
    {
        if (n === 1)
        {
            return one
        }
        else
        {
            return `${n} ${many}`
        }
    }

    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.reset()
    }

    novim.prototype["reset"] = function ()
    {
        this.count = ''
        return this.operator = null
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
        var count, _55_23_

        count = ((_55_23_=this.count) != null ? _55_23_ : '')
        if (count)
        {
            count += ' '
        }
        console.log(`${novim.operators[this.operator]} ${count}...`)
    }

    novim.prototype["complete"] = function (motion)
    {
        var n

        n = this.countNumber()
        console.log(`${novim.operators[this.operator]} ${motion(n)}`)
        return this.reset()
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var char, combo, command, motion, _73_28_

        combo = ((_73_28_=event.combo) != null ? _73_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.reset()
            return true
        }
        if (char.length !== 1)
        {
            return true
        }
        if (this.operator)
        {
            if (motion = novim.motions[char])
            {
                this.complete(motion)
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
            console.log(`delete ${command(this.countNumber())}`)
            this.reset()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUc7SUFHUCxPQUFDLGNBQ0csWUFBSTs7ZUFBTSxNQUFNLE9BQU8sRUFBRSxZQUFZO01BQ3JDLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsWUFBWSxnQkFBZ0I7TUFDckQ7O2VBQU07O0lBSVYsT0FBQyxhQUNHLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTztNQUNoQyxZQUFJOztlQUFNLE1BQU0sT0FBTyxFQUFFLE9BQU87TUFDaEMsWUFBSTs7ZUFBTSxlQUFlLE1BQU0sT0FBTyxFQUFFLE9BQU87TUFDL0MsWUFBSTs7ZUFBTSxNQUFNLE9BQU8sRUFBRSxPQUFPLFdBQVc7TUFDM0M7O2VBQVE7TUFDUjs7ZUFBUTtNQUNSLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTyxXQUFXO01BQzNDLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTyxXQUFXOztJQUUvQyxPQUFDLHFCQUFRLEdBQUUsS0FBSTs7WUFBVyxNQUFLOzttQkFBTzs7OztzQkFBWSxLQUFLOzs7O2FBRXZELE9BQUk7O1FBQUQ7O1FBRUMsS0FBQyxPQUFPO1FBQ1IsS0FBQzs7O3FCQUVMOztRQUVJLEtBQUMsUUFBUTtlQUNULEtBQUMsV0FBVzs7O3FCQUVoQjs7c0JBQXlCLEtBQUM7O21CQUFXOzs7O21CQUFPLFNBQVMsS0FBQzs7OztxQkFFdEQ7Ozs7UUFFSSxrQkFBUSxLQUFDLDJCQUFRO1lBQ0Q7O1lBQWhCLFNBQVM7O1FBQ1QsZUFBTyxNQUFNLFVBQVUsS0FBQyxhQUFhOzs7cUJBRXpDLHVCQUFVOzs7O1FBRU4sSUFBSSxLQUFDO1FBQ0wsZUFBTyxNQUFNLFVBQVUsS0FBQyxhQUFhLE9BQU87ZUFDNUMsS0FBQzs7O3FCQVFMLHdCQUFXLEtBQUk7Ozs7UUFFWCxrQkFBUSxNQUFNLDJCQUFRO1FBQ3RCLG9CQUFjLE1BQU0sU0FBUSxNQUFNLE9BQU87WUFHdEMsTUFBTSxTQUFTLFdBQVcsTUFBTSxTQUFTLFlBQVksTUFBTSxTQUFTOzttQkFDaEU7O21CQUVKLE9BQVUsTUFBTTs7WUFDZixLQUFDO21CQUNFOztZQUdJLEtBQUssV0FBVTs7bUJBQXZCOztZQUVBLEtBQUM7O2dCQUVHLFNBQVMsTUFBTSxRQUFROztnQkFDdEIsS0FBQyxTQUFTOzs0QkFDTixLQUFROztnQkFDWixLQUFDLFNBQVM7Z0JBQ1YsS0FBQzs7OztnQkFFRCxLQUFDOzs7aUJBRUQsTUFBTSxVQUFVOztZQUVwQixLQUFDLFdBQVc7WUFDWixLQUFDOztpQkFFRyxVQUFVLE1BQU0sU0FBUzs7WUFFN0Isc0JBQWMsUUFBUSxLQUFDO1lBQ3ZCLEtBQUM7O3dCQUVHLEtBQVE7O1lBRVosS0FBQyxTQUFTOztlQUdkOzs7cUJBUUoseUJBQVksV0FBVTs7Z0JBRVg7O2lCQUNIO3VCQUFvQixNQUFNLE9BQU87O2lCQUNqQzt1QkFBb0IsTUFBTSxPQUFPOzs7O2VBRXJDOzs7V0EvR0M7OztlQWlIRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
