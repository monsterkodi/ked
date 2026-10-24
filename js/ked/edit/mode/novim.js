var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"

import post from "../../../kxk/post.js"

import theme from "../../theme/theme.js"


novim = (function ()
{
    novim["operators"] = {d:'delete',y:'yank'}
    novim["arrows"] = {left:'h',right:'l',up:'k',down:'j'}
    novim["areas"] = {i:'inner',a:'around'}
    novim["textObjects"] = {'w':'word','W':'WORD','"':'"',"'":"'",'(':'(',')':'(','b':'(','[':'[',']':'[','{':'{','}':'{','B':'{'}
    novim["commands"] = {'D':function ()
    {
        return {operator:'delete',motion:{kind:'eol'}}
    },'x':function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'char'}}
    },'X':function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'charBack'}}
    },'h':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'left'}}
    },'j':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'down'}}
    },'k':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'up'}}
    },'l':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'right'}}
    },'w':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'word'}}
    },'b':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'drow'}}
    },'e':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wend'}}
    },'W':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'WORD'}}
    },'B':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'DROW'}}
    },'E':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'WEND'}}
    },'$':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eol'}}
    },'G':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eof'}}
    },'n':function (n)
    {
        return {operator:'searchNext',count:n}
    },'N':function (n)
    {
        return {operator:'searchPrev',count:n}
    },'p':function (n)
    {
        return {operator:'put',count:n,after:true}
    },'P':function (n)
    {
        return {operator:'put',count:n,after:false}
    },'u':function (n)
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
    },'d':function (n)
    {
        return {kind:'line',count:n}
    },'y':function (n)
    {
        return {kind:'line',count:n}
    },'w':function (n)
    {
        return {kind:'word',count:n}
    },'e':function (n)
    {
        return {kind:'wend',count:n}
    },'b':function (n)
    {
        return {kind:'drow',count:n}
    },'W':function (n)
    {
        return {kind:'WORD',count:n}
    },'E':function (n)
    {
        return {kind:'WEND',count:n}
    },'B':function (n)
    {
        return {kind:'DROW',count:n}
    },'h':function (n)
    {
        return {kind:'charBack',count:n}
    },'l':function (n)
    {
        return {kind:'char',count:n}
    },'j':function (n)
    {
        return {kind:'lineDown',count:n}
    },'k':function (n)
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
        this.find = null
        return this.logPending()
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count || this.prefix || this.registerPending || this.register || this.find)
        {
            return this.reset()
        }
        else
        {
            return this.exitNovim()
        }
    }

    novim.prototype["exitNovim"] = function ()
    {
        return this.state.stopMode('novim')
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
        var t

        t = ''
        if (this.operator)
        {
            t += this.operator
        }
        if (this.area)
        {
            t += this.area[0]
        }
        if (this.prefix)
        {
            t += this.prefix
        }
        if (this.count)
        {
            t += this.count
        }
        if (this.register)
        {
            t += this.register
        }
        if (this.find)
        {
            t += this.find
        }
        return post.emit('title.novim',t)
    }

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
        var area, arrow, build, char, combo, command, prefix, target, _217_28_

        combo = ((_217_28_=event.combo) != null ? _217_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.state.setHighlights([])
            this.reset()
            return true
        }
        if (!this.find && !(_k_.in(char,',;nN0123456789')))
        {
            this.state.setHighlights([])
        }
        if (this.find)
        {
            if (char.length === 1)
            {
                this.completeFind(char)
            }
            else if (key !== 'shift')
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
            }
            this.reset()
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
        else if (char === 'i')
        {
            this.exitNovim()
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
                this.logPending()
            }
        }
        return true
    }

    novim.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return theme.novim.cursor.multi

            case 'cursor.main':
                return theme.novim.cursor.main

        }

        return defaultColor
    }

    return novim
})()

export default novim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFlBQVQ7O09BQ1MsV0FBTjs7T0FDTSxZQUFUOzs7QUFFRCxTQUFUOztJQUVJLE9BQUMsZUFDRyxFQUFHLFNBQ0gsRUFBRztJQUVQLE9BQUMsWUFDRyxLQUFPLElBQ1AsTUFBTyxJQUNQLEdBQU8sSUFDUCxLQUFPO0lBRVgsT0FBQyxXQUNHLEVBQVEsUUFDUixFQUFRO0lBRVosT0FBQyxpQkFDRyxJQUFRLE9BQ1IsSUFBUSxPQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVE7SUFFWixPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
