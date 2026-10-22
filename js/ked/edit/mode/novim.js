var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"


novim = (function ()
{
    novim["operators"] = {d:'delete'}
    novim["arrows"] = {left:'h',right:'l',up:'k',down:'j'}
    novim["areas"] = {i:'inner',a:'around'}
    novim["textObjects"] = {w:'word','"':'"',"'":"'",'(':'(',')':'(',b:'(','[':'[',']':'[','{':'{','}':'{',B:'{'}
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
    },'.':function (n)
    {
        return {operator:'repeat',count:n}
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
    },h:function (n)
    {
        return {kind:'charBack',count:n}
    },l:function (n)
    {
        return {kind:'char',count:n}
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
        this.area = null
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
        console.log('novim pending ▸',this.operator,this.area,this.count)
    }

    novim.prototype["complete"] = function (build)
    {
        var operator

        operator = novim.operators[this.operator]
        this.execute({operator:operator,motion:build(this.countNumber())})
        return this.reset(false)
    }

    novim.prototype["completeTextObject"] = function (target)
    {
        var area, operator

        area = this.area
        operator = novim.operators[this.operator]
        this.execute({operator:operator,motion:{kind:'textObject',area:area,target:target,count:this.countNumber()}})
        return this.reset(false)
    }

    novim.prototype["execute"] = function (cmd)
    {
        return this.state.executeNovim(cmd)
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var area, arrow, build, char, combo, command, target, _124_28_

        combo = ((_124_28_=event.combo) != null ? _124_28_ : key)
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
        if (arrow = novim.arrows[char])
        {
            char = arrow
        }
        if (char.length !== 1)
        {
            return true
        }
        if (this.area)
        {
            if (target = novim.textObjects[char])
            {
                this.completeTextObject(target)
            }
            else
            {
                this.reset()
            }
        }
        else if (this.operator)
        {
            if (build = novim.motions[char])
            {
                this.complete(build)
            }
            else if (area = novim.areas[char])
            {
                this.area = area
                this.logPending()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUc7SUFHUCxPQUFDLFlBQ0csS0FBTyxJQUNQLE1BQU8sSUFDUCxHQUFPLElBQ1AsS0FBTztJQUdYLE9BQUMsV0FDRyxFQUFHLFFBQ0gsRUFBRztJQUVQLE9BQUMsaUJBQ0csRUFBRyxPQUNILElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxFQUFHLElBQ0gsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLEVBQUc7SUFJUCxPQUFDLGNBQ0csWUFBSTs7Z0JBQVEsU0FBVSxTQUFVLFFBQVUsS0FBTSxPQUFXLE1BQU87TUFDbEUsWUFBSTs7Z0JBQVEsU0FBVSxTQUFVLFFBQVUsS0FBTSxXQUFXLE1BQU87TUFDbEU7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU07TUFDNUMsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxPQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxPQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxLQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLFFBQVUsS0FBTSxRQUFRLE1BQU87TUFDL0QsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLE1BQU87TUFDdkMsY0FBTTs7Z0JBQVEsU0FBVSxTQUFVLE1BQU87O0lBSTdDLE9BQUMsYUFDRyxZQUFJOztnQkFBUSxLQUFNLE9BQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLE9BQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFVBQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFdBQVcsTUFBTztNQUNwQzs7Z0JBQVUsS0FBTTtNQUNoQjs7Z0JBQVUsS0FBTTtNQUNoQixZQUFJOztnQkFBUSxLQUFNLFdBQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLE9BQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFdBQVcsTUFBTztNQUNwQyxZQUFJOztnQkFBUSxLQUFNLFNBQVcsTUFBTzs7YUFFeEMsT0FBSTs7UUFBRDs7UUFFQyxLQUFDLE9BQU87UUFDUixLQUFDLE1BQU07OztxQkFFWCxvQkFBTyxXQUFTOztRQUVaLEtBQUMsUUFBVztRQUNaLEtBQUMsV0FBVztRQUNaLEtBQUMsT0FBVztZQUNTOztZQUFyQixZQUFJOzs7O3FCQUVSOztZQUVPLEtBQUMsWUFBWSxLQUFDOzttQkFDYixLQUFDOzs7O1lBRUQsWUFBSTttQkFDSixLQUFDLE1BQU0sU0FBUzs7OztxQkFFeEI7O3NCQUF5QixLQUFDOzttQkFBVzs7OzttQkFBTyxTQUFTLEtBQUM7Ozs7cUJBRXREOztRQUVJLFlBQUksa0JBQWtCLEtBQUMsU0FBUyxLQUFDLEtBQUssS0FBQzs7O3FCQUUzQyx1QkFBVTs7OztRQUVOLFdBQVcsTUFBTSxVQUFVLEtBQUM7UUFFNUIsS0FBQyxTQUFVLFNBQVUsU0FBVSxPQUFRLE1BQU0sS0FBQztlQUM5QyxLQUFDLE1BQU07OztxQkFFWCxpQ0FBb0I7Ozs7UUFFaEIsT0FBVyxLQUFDO1FBQ1osV0FBVyxNQUFNLFVBQVUsS0FBQztRQUU1QixLQUFDLFNBQVUsU0FBVSxTQUFVLFFBQVUsS0FBTSxhQUFjLEtBQU0sS0FBTSxPQUFRLE9BQVEsTUFBTyxLQUFDO2VBQ2pHLEtBQUMsTUFBTTs7O3FCQUVYLHNCQUFTOztlQUFPLEtBQUMsTUFBTSxhQUFhOzs7cUJBUXBDLHdCQUFXLEtBQUk7Ozs7UUFFWCxtQkFBUSxNQUFNLDRCQUFRO1FBQ3RCLG9CQUFjLE1BQU0sU0FBUSxNQUFNLE9BQU87WUFHdEMsTUFBTSxTQUFTLFdBQVcsTUFBTSxTQUFTLFlBQVksTUFBTSxTQUFTOzttQkFDaEU7O21CQUVKLE9BQVUsTUFBTTs7WUFDZixLQUFDO21CQUNFOztZQUdKLFFBQVEsTUFBTSxPQUFPOztZQUNwQixPQUFPOztZQUdBLEtBQUssV0FBVTs7bUJBQXZCOztZQUVBLEtBQUM7O2dCQUVHLFNBQVMsTUFBTSxZQUFZOztnQkFDMUIsS0FBQyxtQkFBbUI7Ozs7Z0JBRXBCLEtBQUM7OztpQkFFRCxLQUFDOztnQkFFRixRQUFRLE1BQU0sUUFBUTs7Z0JBQ3JCLEtBQUMsU0FBUzs7cUJBQ04sT0FBTyxNQUFNLE1BQU07O2dCQUN2QixLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7NEJBQ0csS0FBUTs7Z0JBQ1osS0FBQyxTQUFTO2dCQUNWLEtBQUM7Ozs7Z0JBRUQsS0FBQzs7O2lCQUVELE1BQU0sVUFBVTs7WUFFcEIsS0FBQyxXQUFXO1lBQ1osS0FBQzs7aUJBRUcsVUFBVSxNQUFNLFNBQVM7O1lBRTdCLEtBQUMsUUFBUSxRQUFRLEtBQUM7WUFDbEIsS0FBQyxNQUFNOzt3QkFFSCxLQUFROztZQUVaLEtBQUMsU0FBUzs7ZUFHZDs7O3FCQVFKLHlCQUFZLFdBQVU7O2dCQUVYOztpQkFDSDt1QkFBb0IsTUFBTSxPQUFPOztpQkFDakM7dUJBQW9CLE1BQU0sT0FBTzs7OztlQUVyQzs7O1dBaExDOzs7ZUFrTEYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
