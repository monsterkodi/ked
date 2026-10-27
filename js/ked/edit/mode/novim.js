var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"

import theme from "../../theme/theme.js"


novim = (function ()
{
    novim["operators"] = {c:'change',d:'delete',y:'yank','>':'indent','<':'deindent'}
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
    },'>':function (n)
    {
        return {kind:'line',count:n}
    },'<':function (n)
    {
        return {kind:'line',count:n}
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
        var area, arrow, build, char, combo, command, operator, prefix, target, _236_28_

        combo = ((_236_28_=event.combo) != null ? _236_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo === 'ctrl+v')
        {
            if (!this.operator && !this.area)
            {
                this.state.startVisual('block')
            }
            this.reset()
            return true
        }
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
            return 'unhandled'
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
            if (_k_.in(char,['>','<']))
            {
                operator = (char === '>' ? 'visualIndent' : 'visualDeindent')
                this.execute({operator:operator,count:this.countNumber()})
                this.reset()
                return true
            }
            if (this.state.visual === 'block' && _k_.in(char,['I','A']))
            {
                operator = (char === 'I' ? 'visualBlockPrepend' : 'visualBlockAppend')
                this.execute({operator:operator})
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
        }
        else if (this.area)
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
            this.state.startNovimInsert({kind:'insert'})
            this.exitNovim()
        }
        else if (char === 'a')
        {
            this.state.startNovimInsert({kind:'append'})
            this.state.moveCursors('right')
            this.exitNovim()
        }
        else if (char === 'A')
        {
            this.state.startNovimInsert({kind:'appendEol'})
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
        else
        {
            return 'unhandled'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFdBQU47T0FBVyxjQUFYOztPQUNNLFlBQVQ7OztBQUVELFNBQVQ7O0lBRUksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHLFNBQ0gsRUFBRyxPQUNILElBQUssU0FDTCxJQUFLO0lBRVQsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFFWCxPQUFDLFdBQ0csRUFBUSxRQUNSLEVBQVE7SUFFWixPQUFDLGlCQUNHLElBQVEsT0FDUixJQUFRLE9BQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUTtJQUVaLE9BQUMsY0FDRzs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckU7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
