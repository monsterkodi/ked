var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"

import post from "../../../kxk/post.js"


novim = (function ()
{
    novim["operators"] = {d:'delete',y:'yank'}
    novim["arrows"] = {left:'h',right:'l',up:'k',down:'j'}
    novim["areas"] = {i:'inner',a:'around'}
    novim["textObjects"] = {w:'word',W:'wordBig','"':'"',"'":"'",'(':'(',')':'(',b:'(','[':'[',']':'[','{':'{','}':'{',B:'{'}
    novim["commands"] = {D:function ()
    {
        return {operator:'delete',motion:{kind:'eol'}}
    },x:function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'char'}}
    },X:function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'charBack'}}
    },h:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'left'}}
    },j:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'down'}}
    },k:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'up'}}
    },l:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'right'}}
    },w:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'word'}}
    },b:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wordBack'}}
    },e:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wordEnd'}}
    },W:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wordBig'}}
    },B:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wordBackBig'}}
    },E:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wordEndBig'}}
    },'$':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eol'}}
    },G:function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eof'}}
    },n:function (n)
    {
        return {operator:'searchNext',count:n}
    },N:function (n)
    {
        return {operator:'searchPrev',count:n}
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
    novim["motions"] = {'0':function ()
    {
        return {kind:'bol'}
    },'$':function ()
    {
        return {kind:'eol'}
    },d:function (n)
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
        this.reset()
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

    novim.prototype["reset"] = function ()
    {
        this.count = ''
        this.operator = null
        this.area = null
        this.prefix = null
        this.register = null
        this.registerPending = false
        return this.find = null
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
    {}

    novim.prototype["complete"] = function (build)
    {
        var operator

        operator = novim.operators[this.operator]
        this.execute({operator:operator,motion:build(this.countNumber())})
        return this.reset()
    }

    novim.prototype["completeTextObject"] = function (target)
    {
        var area, operator

        area = this.area
        operator = novim.operators[this.operator]
        this.execute({operator:operator,motion:{kind:'textObject',area:area,target:target,count:this.countNumber()}})
        return this.reset()
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
        return this.reset()
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
        return this.reset()
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
        var area, arrow, build, char, combo, command, prefix, target, _204_28_

        combo = ((_204_28_=event.combo) != null ? _204_28_ : key)
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
        if (!this.find && !(_k_.in(char,[',',';','n','N'])) && !(char.length === 1 && +char >= 0 && +char <= 9))
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
                this.reset()
            }
            else if (prefix === '/' && char === '/')
            {
                console.log("VINDER.SHOW")
                post.emit('vinder.show')
                this.reset()
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
        else if (char === '/')
        {
            console.log('vinder.show')
            post.emit('vinder.show')
            this.reset()
        }
        else if (command = novim.commands[char])
        {
            this.execute(command(this.countNumber()))
            this.reset()
        }
        else if (_k_.in(char,'0123456789'))
        {
            if (char === '0' && _k_.empty(this.count))
            {
                this.execute({operator:'move',motion:{kind:'bol'}})
                this.reset()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV2tCLFlBQVI7O09BQ1MsV0FBTjs7O0FBRUosU0FBVDs7SUFFSSxPQUFDLGVBQ0csRUFBRyxTQUNILEVBQUc7SUFFUCxPQUFDLFlBQ0csS0FBTyxJQUNQLE1BQU8sSUFDUCxHQUFPLElBQ1AsS0FBTztJQUVYLE9BQUMsV0FDRyxFQUFHLFFBQ0gsRUFBRztJQUVQLE9BQUMsaUJBQ0csRUFBRyxPQUNILEVBQUcsVUFDSCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxJQUFLLElBQ0wsRUFBRyxJQUNILElBQUssSUFDTCxJQUFLLElBQ0wsSUFBSyxJQUNMLElBQUssSUFDTCxFQUFHO0lBRVAsT0FBQyxjQUNHOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxZQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
