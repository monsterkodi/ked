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
        var count, _64_23_

        count = ((_64_23_=this.count) != null ? _64_23_ : '')
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
        return this.reset(false)
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var char, combo, command, motion, _82_28_

        combo = ((_82_28_=event.combo) != null ? _82_28_ : key)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUc7SUFHUCxPQUFDLGNBQ0csWUFBSTs7ZUFBTSxNQUFNLE9BQU8sRUFBRSxZQUFZO01BQ3JDLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsWUFBWSxnQkFBZ0I7TUFDckQ7O2VBQU07O0lBSVYsT0FBQyxhQUNHLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTztNQUNoQyxZQUFJOztlQUFNLE1BQU0sT0FBTyxFQUFFLE9BQU87TUFDaEMsWUFBSTs7ZUFBTSxlQUFlLE1BQU0sT0FBTyxFQUFFLE9BQU87TUFDL0MsWUFBSTs7ZUFBTSxNQUFNLE9BQU8sRUFBRSxPQUFPLFdBQVc7TUFDM0M7O2VBQVE7TUFDUjs7ZUFBUTtNQUNSLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTyxXQUFXO01BQzNDLFlBQUk7O2VBQU0sTUFBTSxPQUFPLEVBQUUsT0FBTyxXQUFXOztJQUUvQyxPQUFDLHFCQUFRLEdBQUUsS0FBSTs7WUFBVyxNQUFLOzttQkFBTzs7OztzQkFBWSxLQUFLOzs7O2FBRXZELE9BQUk7O1FBQUQ7O1FBRUMsS0FBQyxPQUFPO1FBQ1IsS0FBQyxNQUFNOzs7cUJBRVgsb0JBQU8sV0FBUzs7UUFFWixLQUFDLFFBQVE7UUFDVCxLQUFDLFdBQVc7WUFDUzs7WUFBckIsWUFBSTs7OztxQkFFUjs7WUFFTyxLQUFDLFlBQVksS0FBQzs7bUJBQ2IsS0FBQzs7OztZQUVELFlBQUk7bUJBQ0osS0FBQyxNQUFNLFNBQVM7Ozs7cUJBRXhCOztzQkFBeUIsS0FBQzs7bUJBQVc7Ozs7bUJBQU8sU0FBUyxLQUFDOzs7O3FCQUV0RDs7OztRQUVJLGtCQUFRLEtBQUMsMkJBQVE7WUFDRDs7WUFBaEIsU0FBUzs7UUFDVCxlQUFPLE1BQU0sVUFBVSxLQUFDLGFBQWE7OztxQkFFekMsdUJBQVU7Ozs7UUFFTixJQUFJLEtBQUM7UUFDTCxlQUFPLE1BQU0sVUFBVSxLQUFDLGFBQWEsT0FBTztlQUM1QyxLQUFDLE1BQU07OztxQkFRWCx3QkFBVyxLQUFJOzs7O1FBRVgsa0JBQVEsTUFBTSwyQkFBUTtRQUN0QixvQkFBYyxNQUFNLFNBQVEsTUFBTSxPQUFPO1lBR3RDLE1BQU0sU0FBUyxXQUFXLE1BQU0sU0FBUyxZQUFZLE1BQU0sU0FBUzs7bUJBQ2hFOzttQkFFSixPQUFVLE1BQU07O1lBQ2YsS0FBQzttQkFDRTs7WUFHSSxLQUFLLFdBQVU7O21CQUF2Qjs7WUFFQSxLQUFDOztnQkFFRyxTQUFTLE1BQU0sUUFBUTs7Z0JBQ3RCLEtBQUMsU0FBUzs7NEJBQ04sS0FBUTs7Z0JBQ1osS0FBQyxTQUFTO2dCQUNWLEtBQUM7Ozs7Z0JBRUQsS0FBQzs7O2lCQUVELE1BQU0sVUFBVTs7WUFFcEIsS0FBQyxXQUFXO1lBQ1osS0FBQzs7aUJBRUcsVUFBVSxNQUFNLFNBQVM7O1lBRTdCLHNCQUFjLFFBQVEsS0FBQztZQUN2QixLQUFDLE1BQU07O3dCQUVILEtBQVE7O1lBRVosS0FBQyxTQUFTOztlQUdkOzs7cUJBUUoseUJBQVksV0FBVTs7Z0JBRVg7O2lCQUNIO3VCQUFvQixNQUFNLE9BQU87O2lCQUNqQzt1QkFBb0IsTUFBTSxPQUFPOzs7O2VBRXJDOzs7V0F4SEM7OztlQTBIRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
