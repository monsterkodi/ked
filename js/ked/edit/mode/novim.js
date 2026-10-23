var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"


novim = (function ()
{
    novim["operators"] = {d:'delete',y:'yank'}
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
    },'$':function (n)
    {
        return {operator:'move',motion:{kind:'eol',count:n}}
    },G:function (n)
    {
        return {operator:'move',motion:{kind:'eof',count:n}}
    },p:function (n)
    {
        return {operator:'put',count:n,after:true}
    },P:function (n)
    {
        return {operator:'put',count:n,after:false}
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
    },y:function (n)
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
        this.prefix = null
        if (announce)
        {
            console.log('novim reset')
        }
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count || this.prefix)
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
        console.log('novim pending ▸',this.operator,this.area,this.prefix,this.count)
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
        var area, arrow, build, char, combo, command, prefix, target, _131_28_

        combo = ((_131_28_=event.combo) != null ? _131_28_ : key)
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
        if (this.prefix)
        {
            prefix = this.prefix
            this.prefix = null
            if (prefix === 'g' && char === 'g')
            {
                this.execute({operator:'move',motion:{kind:'bof',count:this.countNumber()}})
                this.reset(false)
            }
            else
            {
                this.reset()
            }
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
        else if (char === 'g')
        {
            this.prefix = 'g'
            this.logPending()
        }
        else if (command = novim.commands[char])
        {
            this.execute(command(this.countNumber()))
            this.reset(false)
        }
        else if (_k_.in(char,'0123456789'))
        {
            if (char === '0' && _k_.empty(this.count))
            {
                this.execute({operator:'move',motion:{kind:'bol'}})
                this.reset(false)
            }
            else
            {
                this.count += char
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHO0lBR1AsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFHWCxPQUFDLFdBQ0csRUFBRyxRQUNILEVBQUc7SUFFUCxPQUFDLGlCQUNHLEVBQUcsT0FDSCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsRUFBRyxJQUNILElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxFQUFHO0lBSVAsT0FBQyxjQUNHLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sT0FBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sV0FBVyxNQUFPO01BQ2xFOztnQkFBUSxTQUFVLFNBQVUsUUFBVSxLQUFNO01BQzVDLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sS0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sUUFBUSxNQUFPO01BQy9ELGNBQU07O2dCQUFRLFNBQVUsT0FBUSxRQUFVLEtBQU0sTUFBUSxNQUFPO01BQy9ELFlBQU07O2dCQUFRLFNBQVUsT0FBUSxRQUFVLEtBQU0sTUFBUSxNQUFPO01BQy9ELFlBQU07O2dCQUFRLFNBQVUsTUFBUSxNQUFPLEVBQUcsTUFBTztNQUNqRCxZQUFNOztnQkFBUSxTQUFVLE1BQVEsTUFBTyxFQUFHLE1BQU87TUFDakQsWUFBSTs7Z0JBQVEsU0FBVSxPQUFVLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
