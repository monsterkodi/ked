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
    },w:function (n)
    {
        return {operator:'move',motion:{kind:'word',count:n}}
    },b:function (n)
    {
        return {operator:'move',motion:{kind:'wordBack',count:n}}
    },e:function (n)
    {
        return {operator:'move',motion:{kind:'wordEnd',count:n}}
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

    novim["clipboardSync"] = null
    novim["isHeadless"] = function ()
    {
        var screen

        screen = global.ked_screen
        if (!screen)
        {
            return true
        }
        if (screen.t && screen.t.headless)
        {
            return true
        }
        return false
    }

    novim["clipboardEnabled"] = function ()
    {
        if (novim.clipboardSync === null)
        {
            return !novim.isHeadless()
        }
        return novim.clipboardSync
    }

    novim["toggleClipboard"] = function ()
    {
        var enabled

        enabled = !novim.clipboardEnabled()
        novim.clipboardSync = enabled
        console.log('novim clipboard ▸',((enabled ? 'on' : 'off')))
        return enabled
    }

    novim.prototype["reset"] = function (announce = true)
    {
        this.count = ''
        this.operator = null
        this.area = null
        this.prefix = null
        this.register = null
        this.registerPending = false
        if (announce)
        {
            console.log('novim reset')
        }
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count || this.prefix || this.registerPending || this.register)
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
        console.log('novim pending ▸',this.operator,this.area,this.prefix,this.count,this.register)
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
        if (this.register)
        {
            cmd.register = this.register
        }
        return this.state.executeNovim(cmd)
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var area, arrow, build, char, combo, command, prefix, target, _170_28_

        combo = ((_170_28_=event.combo) != null ? _170_28_ : key)
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
        if (this.registerPending)
        {
            this.registerPending = false
            if (_k_.in(char,['+','*']))
            {
                this.register = 'clipboard'
            }
            else if (_k_.in(char,['"','0']))
            {
                this.register = null
            }
            else
            {
                this.reset()
                return true
            }
            this.logPending()
            return true
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
        else if (char === '"')
        {
            this.registerPending = true
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHO0lBR1AsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFHWCxPQUFDLFdBQ0csRUFBRyxRQUNILEVBQUc7SUFFUCxPQUFDLGlCQUNHLEVBQUcsT0FDSCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsRUFBRyxJQUNILElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxFQUFHO0lBSVAsT0FBQyxjQUNHLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sT0FBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sV0FBVyxNQUFPO01BQ2xFOztnQkFBUSxTQUFVLFNBQVUsUUFBVSxLQUFNO01BQzVDLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sS0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sUUFBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sV0FBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sVUFBVyxNQUFPO01BQ2xFLGNBQU07O2dCQUFRLFNBQVUsT0FBUSxRQUFVLEtBQU0sTUFBUSxNQUFPO01BQy9ELFlBQU07O2dCQUFRLFNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
