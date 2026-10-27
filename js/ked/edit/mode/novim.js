var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import color from "../../theme/color.js"

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"

import theme from "../../theme/theme.js"


novim = (function ()
{
    novim["operators"] = {c:'change',d:'delete',y:'yank'}
    novim["arrows"] = {left:'h',right:'l',up:'k',down:'j'}
    novim["areas"] = {i:'inner',a:'around'}
    novim["textObjects"] = {'w':'word','W':'WORD','"':'"',"'":"'",'(':'(',')':'(','b':'(','[':'[',']':'[','{':'{','}':'{','B':'{'}
    novim["commands"] = {'C':function ()
    {
        return {operator:'change',motion:{kind:'eol'}}
    },'D':function ()
    {
        return {operator:'delete',motion:{kind:'eol'}}
    },'s':function (n)
    {
        return {operator:'change',count:n,motion:{kind:'char'}}
    },'S':function (n)
    {
        return {operator:'change',count:n,motion:{kind:'line'}}
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
        return {operator:'searchNext',count:n,text:novim.lastVind}
    },'N':function (n)
    {
        return {operator:'searchPrev',count:n,text:novim.lastVind}
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
    },'Y':function (n)
    {
        return {operator:'yank',motion:{kind:'line',count:n}}
    },'o':function (n)
    {
        return {operator:'openLine',count:n,after:true}
    },'O':function (n)
    {
        return {operator:'openLine',count:n,after:false}
    },'I':function ()
    {
        return {operator:'insertAtIndent'}
    },'~':function (n)
    {
        return {operator:'toggleCase',count:n}
    },'J':function (n)
    {
        return {operator:'joinLinesVim',count:n}
    },'%':function ()
    {
        return {operator:'matchBracket'}
    },'*':function (n)
    {
        return {operator:'searchWord',count:n,forward:true}
    },'#':function (n)
    {
        return {operator:'searchWord',count:n,forward:false}
    }}
    novim["motions"] = {'0':function ()
    {
        return {kind:'bol'}
    },'$':function ()
    {
        return {kind:'eol'}
    },'c':function (n)
    {
        return {kind:'line',count:n}
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
    novim["lastVind"] = ''
    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.lastFind = null
        this.reset()
        post.on('vinder.text',(function (text)
        {
            return novim.lastVind = text
        }).bind(this))
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
        this.replace = null
        return this.logPending()
    }

    novim.prototype["resetOrExit"] = function ()
    {
        if (this.operator || this.count || this.prefix || this.registerPending || this.register || this.find || this.replace)
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
        if (this.replace)
        {
            t += 'r'
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

    novim.prototype["completeReplace"] = function (char)
    {
        this.execute({operator:'replace',char:char,count:this.countNumber()})
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
        var area, arrow, build, char, combo, command, prefix, target, _240_28_

        combo = ((_240_28_=event.combo) != null ? _240_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.reset()
            if (this.state.visual)
            {
                this.state.stopVisual()
            }
            else if (this.state.hasCursorsHighlightsOrSelections())
            {
                this.state.clearCursorsHighlightsAndSelections()
            }
            else
            {
                this.exitNovim()
            }
            return true
        }
        if (!this.find && !(_k_.in(char,',;nN0123456789')) && !(_k_.in(key,keyinfo.modifierNames)))
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
        if (this.replace)
        {
            if (char.length === 1)
            {
                this.completeReplace(char)
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
        if (this.state.visual && !this.operator && !this.area)
        {
            if (char === 'v')
            {
                this.state.startVisual('char')
                this.reset()
                return true
            }
            if (char === 'V')
            {
                this.state.startVisual('line')
                this.reset()
                return true
            }
            if (_k_.in(char,['d','x']))
            {
                this.execute({operator:'visualDelete'})
                this.reset()
                return true
            }
            if (char === 'y')
            {
                this.execute({operator:'visualYank'})
                this.reset()
                return true
            }
            if (_k_.in(char,['c','s']))
            {
                this.execute({operator:'visualChange'})
                this.reset()
                return true
            }
            if (char === 'o')
            {
                this.execute({operator:'visualSwap'})
                this.reset()
                return true
            }
            if (area = novim.areas[char])
            {
                this.area = area
                this.logPending()
                return true
            }
        }
        if (!this.operator && !this.area)
        {
            if (char === 'v')
            {
                this.state.startVisual('char')
                this.reset()
                return true
            }
            if (char === 'V')
            {
                this.state.startVisual('line')
                this.reset()
                return true
            }
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
                if (this.state.visual)
                {
                    this.execute({operator:'visualTextObject',motion:{kind:'textObject',area:this.area,target:target,count:this.countNumber()}})
                    this.reset()
                }
                else
                {
                    this.completeTextObject(target)
                }
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
        else if (char === 'a')
        {
            this.state.moveCursors('right')
            this.exitNovim()
        }
        else if (char === 'A')
        {
            this.state.moveCursors('eol')
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
        else if (char === 'r')
        {
            this.replace = true
            this.logPending()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFlBQVQ7O09BQ1MsV0FBTjtPQUFXLGNBQVg7O09BQ00sWUFBVDs7O0FBRUQsU0FBVDs7SUFFSSxPQUFDLGVBQ0csRUFBRyxTQUNILEVBQUcsU0FDSCxFQUFHO0lBRVAsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFFWCxPQUFDLFdBQ0csRUFBUSxRQUNSLEVBQVE7SUFFWixPQUFDLGlCQUNHLElBQVEsT0FDUixJQUFRLE9BQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUTtJQUVaLE9BQUMsY0FDRzs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckU7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
