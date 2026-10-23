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
    },W:function (n)
    {
        return {operator:'move',motion:{kind:'wordBig',count:n}}
    },B:function (n)
    {
        return {operator:'move',motion:{kind:'wordBackBig',count:n}}
    },E:function (n)
    {
        return {operator:'move',motion:{kind:'wordEndBig',count:n}}
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
    },W:function (n)
    {
        return {kind:'wordBig',count:n}
    },E:function (n)
    {
        return {kind:'wordEndBig',count:n}
    },B:function (n)
    {
        return {kind:'wordBackBig',count:n}
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
        this.lastFind = null
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
        this.find = null
        if (announce)
        {
            console.log('novim reset')
        }
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count || this.prefix || this.registerPending || this.register || this.find)
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
        console.log('novim pending ▸',this.operator,this.area,this.prefix,this.count,this.register,this.find)
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

    novim.prototype["completeFind"] = function (target)
    {
        var motion, till

        till = this.find === 't'
        this.lastFind = {target:target,till:till}
        motion = {kind:'charFind',target:target,till:till,count:this.countNumber()}
        if (this.operator)
        {
            this.execute({operator:novim.operators[this.operator],motion:motion})
        }
        else
        {
            this.execute({operator:'move',motion:motion})
        }
        return this.reset(false)
    }

    novim.prototype["repeatFind"] = function ()
    {
        var motion

        if (!this.lastFind)
        {
            return
        }
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,count:this.countNumber(),repeat:true}
        if (this.operator)
        {
            this.execute({operator:novim.operators[this.operator],motion:motion})
        }
        else
        {
            this.execute({operator:'move',motion:motion})
        }
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
        var area, arrow, build, char, combo, command, prefix, target, _206_28_

        combo = ((_206_28_=event.combo) != null ? _206_28_ : key)
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
        if (this.find)
        {
            if (char.length === 1)
            {
                this.completeFind(char)
            }
            else
            {
                this.reset()
            }
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
            else if (_k_.in(char,['f','t']))
            {
                this.find = char
                this.logPending()
            }
            else if (char === ';')
            {
                this.repeatFind()
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
        else if (_k_.in(char,['f','t']))
        {
            this.find = char
            this.logPending()
        }
        else if (char === ';')
        {
            this.repeatFind()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHO0lBR1AsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFHWCxPQUFDLFdBQ0csRUFBRyxRQUNILEVBQUc7SUFFUCxPQUFDLGlCQUNHLEVBQUcsT0FDSCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsRUFBRyxJQUNILElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxFQUFHO0lBSVAsT0FBQyxjQUNHLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sT0FBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsU0FBVSxRQUFVLEtBQU0sV0FBVyxNQUFPO01BQ2xFOztnQkFBUSxTQUFVLFNBQVUsUUFBVSxLQUFNO01BQzVDLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sS0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sUUFBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sT0FBUSxNQUFPO01BQy9ELFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sV0FBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sVUFBVyxNQUFPO01BQ2xFLFlBQUk7O2dCQUFRLFNBQVUsT0FBVSxRQUFVLEtBQU0sVUFBYyxNQUFPO01BQ3JFLFlBQUk7O2dCQUFRLFNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
