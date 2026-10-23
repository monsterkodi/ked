var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"


novim = (function ()
{
    novim["operators"] = {d:'delete',y:'yank'}
    novim["arrows"] = {left:'h',right:'l',up:'k',down:'j'}
    novim["areas"] = {i:'inner',a:'around'}
    novim["textObjects"] = {w:'word',W:'wordBig','"':'"',"'":"'",'(':'(',')':'(',b:'(','[':'[',']':'[','{':'{','}':'{',B:'{'}
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
        var forward, motion, till

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
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

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
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
        var area, arrow, build, char, combo, command, prefix, target, _210_28_

        combo = ((_210_28_=event.combo) != null ? _210_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.state.setHighlights([])
            this.resetOrExit()
            return true
        }
        if (!this.find && !(_k_.in(char,[',',';'])))
        {
            this.state.setHighlights([])
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
            else if (_k_.in(char,['f','t','F','T']))
            {
                this.find = char
                this.logPending()
            }
            else if (char === ';')
            {
                this.repeatFind()
            }
            else if (char === ',')
            {
                this.repeatFind(true)
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
        else if (_k_.in(char,['f','t','F','T']))
        {
            this.find = char
            this.logPending()
        }
        else if (char === ';')
        {
            this.repeatFind()
        }
        else if (char === ',')
        {
            this.repeatFind(true)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BWWtCLFlBQVI7OztBQUVELFNBQVQ7O0lBR0ksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHO0lBR1AsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFHWCxPQUFDLFdBQ0csRUFBRyxRQUNILEVBQUc7SUFFUCxPQUFDLGlCQUNHLEVBQUcsT0FDSCxFQUFHLFVBQ0gsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLEVBQUcsSUFDSCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsRUFBRztJQUlQLE9BQUMsY0FDRyxZQUFJOztnQkFBUSxTQUFVLFNBQVUsUUFBVSxLQUFNLE9BQVcsTUFBTztNQUNsRSxZQUFJOztnQkFBUSxTQUFVLFNBQVUsUUFBVSxLQUFNLFdBQVcsTUFBTztNQUNsRTs7Z0JBQVEsU0FBVSxTQUFVLFFBQVUsS0FBTTtNQUM1QyxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLE9BQVEsTUFBTztNQUMvRCxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLE9BQVEsTUFBTztNQUMvRCxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLEtBQVEsTUFBTztNQUMvRCxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLFFBQVEsTUFBTztNQUMvRCxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLE9BQVEsTUFBTztNQUMvRCxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLFdBQVcsTUFBTztNQUNsRSxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLFVBQVcsTUFBTztNQUNsRSxZQUFJOztnQkFBUSxTQUFVLE9BQVUsUUFBVSxLQUFNLFVBQWMsTUFBTztNQUNyRSxZQUFJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
