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
    },'(':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'sentenceBack'}}
    },')':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'sentence'}}
    },'{':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'paragraphBack'}}
    },'}':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'paragraph'}}
    },'+':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirstDown'}}
    },'-':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirstUp'}}
    },'_':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirst'}}
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
    novim["exCommands"] = {'q':{desc:'save pending changes and quit',run:(function ()
    {
        return post.emit('file.saveAndQuit')
    })},'q!':{desc:'quit discarding pending changes',run:(function ()
    {
        return post.emit('quit')
    })},'w':{desc:'save pending changes',run:(function ()
    {
        return post.emit('file.save')
    })},'wq':{desc:'save pending changes and quit',run:(function ()
    {
        return post.emit('file.saveAndQuit')
    })}}
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
    },'(':function (n)
    {
        return {kind:'sentenceBack',count:n}
    },')':function (n)
    {
        return {kind:'sentence',count:n}
    },'{':function (n)
    {
        return {kind:'paragraphBack',count:n}
    },'}':function (n)
    {
        return {kind:'paragraph',count:n}
    },'+':function (n)
    {
        return {kind:'lineFirstDown',count:n}
    },'-':function (n)
    {
        return {kind:'lineFirstUp',count:n}
    },'_':function (n)
    {
        return {kind:'lineFirst',count:n}
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
        this.ex = null
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
        var t, _189_29_

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
        if ((this.ex != null))
        {
            t += ':' + this.ex
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

    novim.prototype["runEx"] = function ()
    {
        var cmd, name

        name = this.ex
        this.reset()
        if (_k_.empty(name))
        {
            return true
        }
        cmd = novim.exCommands[name]
        if (!cmd)
        {
            post.emit('title.novim',`E492: ${name}`)
            return false
        }
        cmd.run()
        return true
    }

    novim.prototype["handleExKey"] = function (combo, char)
    {
        if (_k_.in(combo,['esc','escape']))
        {
            this.reset()
            return true
        }
        if (_k_.in(combo,['return','enter']))
        {
            this.runEx()
            return true
        }
        if (_k_.in(combo,['backspace','delete','ctrl+h']))
        {
            if (this.ex.length)
            {
                this.ex = this.ex.slice(0, -1)
            }
            this.logPending()
            return true
        }
        if (char.length === 1 && !(_k_.in(char,['\n','\r','\t'])))
        {
            this.ex += char
            this.logPending()
        }
        return true
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var area, arrow, build, char, combo, command, operator, prefix, target, _298_28_, _311_14_

        combo = ((_298_28_=event.combo) != null ? _298_28_ : key)
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
        if ((this.ex != null))
        {
            this.handleExKey(combo,char)
            return true
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
            if (char === ':' && !this.state.visual)
            {
                this.reset()
                this.ex = ''
                this.logPending()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFdBQU47T0FBVyxjQUFYOztPQUNNLFlBQVQ7OztBQUVELFNBQVQ7O0lBRUksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHLFNBQ0gsRUFBRyxPQUNILElBQUssU0FDTCxJQUFLO0lBRVQsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFFWCxPQUFDLFdBQ0csRUFBUSxRQUNSLEVBQVE7SUFFWixPQUFDLGlCQUNHLElBQVEsT0FDUixJQUFRLE9BQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUTtJQUVaLE9BQUMsY0FDRzs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckU7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsYUFBZSxNQUFPLEVBQU0sS0FBTyxNQUFNO01BQ2xFLGNBQVE7O2dCQUFPLFNBQVUsYUFBZSxNQUFPLEVBQU0sS0FBTyxNQUFNO01BQ2xFLGNBQVE7O2dCQUFPLFNBQVUsTUFBZSxNQUFPLEVBQU0sTUFBTztNQUM1RCxjQUFROztnQkFBTyxTQUFVLE1BQWUsTUFBTyxFQUFNLE1BQU87TUFDNUQsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLFFBQVUsS0FBTSxPQUFRLE1BQU87TUFDdkUsY0FBUTs7Z0JBQU8sU0FBVSxXQUFlLE1BQU8sRUFBRyxNQUFPO01BQ3pELGNBQVE7O2dCQUFPLFNBQVUsV0FBZSxNQUFPLEVBQUcsTUFBTztNQUN6RDs7Z0JBQWUsU0FBVTtNQUN6QixjQUFROztnQkFBTyxTQUFVLGFBQWUsTUFBTztNQUMvQyxjQUFROztnQkFBTyxTQUFVLGVBQWUsTUFBTztNQUMvQzs7Z0JBQWUsU0FBVTtNQUN6QixjQUFROztnQkFBTyxTQUFVLGFBQWUsTUFBTyxFQUFHLFFBQVM7TUFDM0QsY0FBUTs7Z0JBQU8sU0FBVSxhQUFlLE1BQU8sRUFBRyxRQUFTOztJQUcvRCxPQUFDLGdCQUNHLEtBQVEsS0FBTSxnQ0FBa0M7O2VBQVMsS0FBSyxLQUFLO1FBQ25FLE1BQVEsS0FBTSxrQ0FBa0M7O2VBQVMsS0FBSyxLQUFLO1FBQ25FLEtBQVEsS0FBTSx1QkFBa0M7O2VBQVMsS0FBSyxLQUFLO1FBQ25FLE1BQVEsS0FBTSxnQ0FBa0M7O2VBQVMsS0FBSyxLQUFLOztJQUd2RSxPQUFDLGFBQ0c7O2dCQUFlLEtBQU07TUFDckI7O2dCQUFlLEtBQU07TUFDckIsY0FBUTs7Z0JBQU8sS0FBTSxPQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sT0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLE9BQW1CLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sS0FBTSxPQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sT0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLE9BQW1CLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sS0FBTSxPQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sT0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLE9BQW1CLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sS0FBTSxPQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sT0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLFdBQW1CLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sS0FBTSxPQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sV0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLFNBQW1CLE1BQU87TUFDL0MsY0FBUTs7Z0JBQU8sS0FBTSxlQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sV0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLGdCQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sWUFBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLGdCQUFtQixNQUFPO01BQy9DLGNBQVE7O2dCQUFPLEtBQU0sY0FBbUIsTUFBTztNQUMvQyxjQUFROztnQkFBTyxLQUFNLFlBQW1CLE1BQU87O0lBR25ELE9BQUMsYUFBVTthQUVYLE9BQUk7O1FBQUQ7O1FBRUMsS0FBQyxPQUFXO1FBQ1osS0FBQyxXQUFXO1FBQ1osS0FBQztRQUVELEtBQUssR0FBRyx5QkFBZTs7bUJBQVMsTUFBTSxXQUFXOzs7O0lBRXJELE9BQUMsa0JBQWU7SUFFaEIsT0FBQzs7OztRQUVHLFNBQVMsT0FBTzthQUVGOzttQkFBWjs7WUFDUSxPQUFPLEtBQU0sT0FBTyxFQUFFOzttQkFBOUI7O2VBQ0Y7OztJQUVKLE9BQUM7O1lBRU0sTUFBTSxrQkFBaUI7O29CQUNmLE1BQU07O2VBRWpCLE1BQU07OztJQUVWLE9BQUM7Ozs7UUFFRyxXQUFjLE1BQU07UUFFcEIsTUFBTSxnQkFBZ0I7ZUFFdEI7OztxQkFFSjs7UUFFSSxLQUFDLFFBQWtCO1FBQ25CLEtBQUMsV0FBa0I7UUFDbkIsS0FBQyxPQUFrQjtRQUNuQixLQUFDLFNBQWtCO1FBQ25CLEtBQUMsV0FBa0I7UUFDbkIsS0FBQyxrQkFBa0I7UUFDbkIsS0FBQyxPQUFrQjtRQUNuQixLQUFDLFVBQWtCO1FBQ25CLEtBQUMsS0FBa0I7ZUFDbkIsS0FBQzs7O3FCQUVMOztlQUVJLEtBQUMsTUFBTSxTQUFTOzs7cUJBRXBCOztzQkFBeUIsS0FBQzs7bUJBQVc7Ozs7bUJBQU8sU0FBUyxLQUFDOzs7O3FCQUV0RDs7OztRQUVJLElBQUk7WUFDYyxLQUFDOztZQUFuQixLQUFLLEtBQUM7O1lBQ1csS0FBQzs7WUFBbEIsS0FBSyxLQUFDLEtBQUs7O1lBQ0ssS0FBQzs7WUFBakIsS0FBSyxLQUFDOztZQUNTLEtBQUM7O1lBQWhCLEtBQUssS0FBQzs7WUFDWSxLQUFDOztZQUFuQixLQUFLLEtBQUM7O1lBQ1EsS0FBQzs7WUFBZixLQUFLLEtBQUM7O1lBQ00sS0FBQzs7WUFBYixLQUFLOzthQUNhLEtBQUM7O1lBQW5CLEtBQUssTUFBTSxLQUFDOztlQUVaLEtBQUssS0FBSyxjQUFjOzs7cUJBRTVCLHVCQUFVOzs7O1FBRU4sV0FBVyxNQUFNLFVBQVUsS0FBQztRQUU1QixLQUFDLFNBQVUsU0FBVSxTQUFVLE9BQVEsTUFBTSxLQUFDO2VBQzlDLEtBQUM7OztxQkFFTCxpQ0FBb0I7Ozs7UUFFaEIsT0FBVyxLQUFDO1FBQ1osV0FBVyxNQUFNLFVBQVUsS0FBQztRQUU1QixLQUFDLFNBQVUsU0FBVSxTQUFVLFFBQVUsS0FBTSxhQUFjLEtBQU0sS0FBTSxPQUFRLE9BQVEsTUFBTyxLQUFDO2VBQ2pHLEtBQUM7OztxQkFFTCwyQkFBYzs7OztRQUVWLGNBQVUsS0FBQyxNQUFTLElBQUk7UUFDeEIsaUJBQVUsS0FBQyxNQUFTLElBQUk7UUFFeEIsS0FBQyxZQUFhLE9BQVEsT0FBUSxLQUFNLEtBQU0sUUFBUztRQUVuRCxVQUFXLEtBQU0sV0FBWSxPQUFRLE9BQVEsS0FBTSxLQUFNLFFBQVMsUUFBUyxNQUFPLEtBQUM7WUFFaEYsS0FBQzs7WUFDQSxLQUFDLFNBQVUsU0FBVSxNQUFNLFVBQVUsS0FBQyxVQUFXLE9BQVE7Ozs7WUFFekQsS0FBQyxTQUFVLFNBQVUsT0FBUSxPQUFROztlQUV6QyxLQUFDOzs7cUJBRUwsOEJBQWlCOztRQUViLEtBQUMsU0FBVSxTQUFVLFVBQVcsS0FBTSxLQUFNLE1BQU8sS0FBQztlQUNwRCxLQUFDOzs7cUJBRUwseUJBQVksVUFBUTs7OzthQUVOLEtBQUM7Ozs7UUFFWCxXQUFVLFdBQWMsS0FBQyxTQUFTLFVBQVUsS0FBQyxTQUFTO1FBRXRELFVBQVcsS0FBTSxXQUFZLE9BQVEsS0FBQyxTQUFTLE9BQVEsS0FBTSxLQUFDLFNBQVMsS0FBTSxRQUFTLFFBQVMsTUFBTyxLQUFDLGNBQWUsT0FBUTtZQUUzSCxLQUFDOztZQUNBLEtBQUMsU0FBVSxTQUFVLE1BQU0sVUFBVSxLQUFDLFVBQVcsT0FBUTs7OztZQUV6RCxLQUFDLFNBQVUsU0FBVSxPQUFRLE9BQVE7O2VBRXpDLEtBQUM7OztxQkFFTCxzQkFBUzs7WUFFRixLQUFDOztZQUNBLElBQUksV0FBVyxLQUFDOztlQUVwQixLQUFDLE1BQU0sYUFBYTs7O3FCQUV4Qjs7OztRQUVJLE9BQU8sS0FBQztRQUVSLEtBQUM7c0JBRWdCOzttQkFBZDs7UUFFSCxNQUFNLE1BQU0sV0FBVzthQUVoQjs7WUFDSCxLQUFLLEtBQUssdUJBQXVCO21CQUM5Qjs7UUFFUCxJQUFJO2VBRUo7OztxQkFFSiwwQkFBYSxPQUFNOzttQkFFWixPQUFVLE1BQU07O1lBQ2YsS0FBQzttQkFDRTs7bUJBRUosT0FBVSxTQUFTOztZQUNsQixLQUFDO21CQUNFOzttQkFFSixPQUFVLFlBQVksU0FBUzs7Z0JBQ1QsS0FBQyxHQUFHOztnQkFBekIsS0FBQyxLQUFLLEtBQUMsU0FBRzs7WUFDVixLQUFDO21CQUNFOztZQUVKLEtBQUssV0FBVSxjQUFNLE1BQWEsS0FBSyxLQUFLOztZQUMzQyxLQUFDLE1BQU07WUFDUCxLQUFDOztlQUVMOzs7cUJBUUosd0JBQVcsS0FBSTs7OztRQUVYLG1CQUFRLE1BQU0sNEJBQVE7UUFDdEIsb0JBQWMsTUFBTSxTQUFRLE1BQU0sT0FBTztZQUV0QyxVQUFTOztpQkFDRCxLQUFDLGFBQWlCLEtBQUM7O2dCQUN0QixLQUFDLE1BQU0sWUFBWTs7WUFDdkIsS0FBQzttQkFDRTs7WUFHSixNQUFNLFNBQVMsV0FBVyxNQUFNLFNBQVMsWUFBWSxNQUFNLFNBQVM7O21CQUNoRTs7YUFFSixLQUFDOztZQUNBLEtBQUMsWUFBWSxNQUFNO21CQUNoQjs7bUJBRUosT0FBVSxNQUFNOztZQUNmLEtBQUM7Z0JBQ0UsS0FBQyxNQUFNOztnQkFDTixLQUFDLE1BQU07O3FCQUNILEtBQUMsTUFBTTs7Z0JBQ1gsS0FBQyxNQUFNOzs7O2dCQUVQLEtBQUM7O21CQUNIOzthQUVDLEtBQUMsaUJBQVMsS0FBWSwrQkFBcUIsSUFBVyxRQUFROztZQUNqRSxLQUFDLE1BQU07O1lBRVIsS0FBQzs7Z0JBRUcsS0FBSyxXQUFVOztnQkFDZCxLQUFDLGFBQWE7O3FCQUNWLFFBQU87O2dCQUNYLEtBQUM7O21CQUNIOztZQUVILEtBQUM7O2dCQUNHLEtBQUssV0FBVTs7Z0JBQ2QsS0FBQyxnQkFBZ0I7O3FCQUNiLFFBQU87O2dCQUNYLEtBQUM7O21CQUNIOztZQUVILFFBQVEsTUFBTSxPQUFPOztZQUNwQixPQUFPOztZQUVSLEtBQUM7O1lBQ0EsS0FBQyxrQkFBa0I7dUJBR2hCLE1BQVMsSUFBSTs7Z0JBQ1osS0FBQyxXQUFXOzs0QkFDUixNQUFTLElBQUk7O2dCQUNqQixLQUFDLFdBQVc7Ozs7Z0JBRVosS0FBQzt1QkFDRTs7WUFFUCxLQUFDO21CQUNFOztZQUVXLEtBQUssV0FBVTs7bUJBQTlCOztZQUVBLEtBQUMsTUFBTSxXQUFlLEtBQUMsYUFBaUIsS0FBQzs7Z0JBRXJDLFNBQVE7O2dCQUNQLEtBQUMsTUFBTSxZQUFZO2dCQUNuQixLQUFDO3VCQUNFOztnQkFFSixTQUFROztnQkFDUCxLQUFDLE1BQU0sWUFBWTtnQkFDbkIsS0FBQzt1QkFDRTs7dUJBRUosTUFBUyxJQUFJOztnQkFDWixLQUFDLFNBQVUsU0FBVTtnQkFDckIsS0FBQzt1QkFDRTs7Z0JBRUosU0FBUTs7Z0JBQ1AsS0FBQyxTQUFVLFNBQVU7Z0JBQ3JCLEtBQUM7dUJBQ0U7O3VCQUVKLE1BQVMsSUFBSTs7Z0JBQ1osS0FBQyxTQUFVLFNBQVU7Z0JBQ3JCLEtBQUM7dUJBQ0U7O2dCQUVKLFNBQVE7O2dCQUNQLEtBQUMsU0FBVSxTQUFVO2dCQUNyQixLQUFDO3VCQUNFOzt1QkFFSixNQUFTLElBQUk7O2dCQUNaLFlBQVcsU0FBUSxNQUFNLGlCQUFpQjtnQkFDMUMsS0FBQyxTQUFVLFNBQVUsU0FBVSxNQUFPLEtBQUM7Z0JBQ3ZDLEtBQUM7dUJBQ0U7O2dCQUVKLEtBQUMsTUFBTSxXQUFVLGtCQUFZLE1BQVMsSUFBSTs7Z0JBQ3pDLFlBQVcsU0FBUSxNQUFNLHVCQUF1QjtnQkFDaEQsS0FBQyxTQUFVLFNBQVU7Z0JBQ3JCLEtBQUM7dUJBQ0U7O2dCQUVKLE9BQU8sTUFBTSxNQUFNOztnQkFDbEIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7dUJBQ0U7OzthQUVKLEtBQUMsYUFBaUIsS0FBQzs7Z0JBRW5CLFNBQVE7O2dCQUNQLEtBQUMsTUFBTSxZQUFZO2dCQUNuQixLQUFDO3VCQUNFOztnQkFFSixTQUFROztnQkFDUCxLQUFDLE1BQU0sWUFBWTtnQkFDbkIsS0FBQzt1QkFDRTs7Z0JBRUosU0FBUSxRQUFZLEtBQUMsTUFBTTs7Z0JBQzFCLEtBQUM7Z0JBQ0QsS0FBQyxLQUFLO2dCQUNOLEtBQUM7dUJBQ0U7OztZQUdQLEtBQUM7O1lBRUcsU0FBVSxLQUFDO1lBQ1gsS0FBQyxTQUFTO2dCQUNQLFdBQVUsT0FBUSxTQUFROztnQkFDekIsS0FBQyxTQUFVLFNBQVUsT0FBUSxRQUFVLEtBQU0sTUFBTyxNQUFPLEtBQUM7O1lBQ2hFLEtBQUM7O2lCQUVMLEtBQUM7O2dCQUVNLFNBQVMsTUFBTSxZQUFZOztvQkFDdkIsS0FBQyxNQUFNOztvQkFDTixLQUFDLFNBQVUsU0FBVSxtQkFBb0IsUUFBVSxLQUFNLGFBQWMsS0FBTSxLQUFDLEtBQU0sT0FBUSxPQUFRLE1BQU8sS0FBQztvQkFDNUcsS0FBQzs7OztvQkFFRCxLQUFDLG1CQUFtQjs7Ozs7Z0JBRXhCLEtBQUM7OztpQkFFVCxLQUFDOztnQkFHTyxRQUFRLE1BQU0sUUFBUTs7Z0JBQ2xCLEtBQUMsU0FBUzs7NEJBQ2QsTUFBUyxJQUFJLElBQUksSUFBSTs7Z0JBQ2pCLEtBQUMsT0FBTztnQkFDUixLQUFDOztxQkFDTCxTQUFROztnQkFDSixLQUFDOztxQkFDTCxTQUFROztnQkFDSixLQUFDLFdBQVc7O3FCQUNoQixPQUFPLE1BQU0sTUFBTTs7Z0JBQ2YsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OzRCQUNMLEtBQVE7O2dCQUNKLEtBQUMsU0FBUztnQkFDVixLQUFDOzs7O2dCQUVELEtBQUM7Ozt3QkFFYixNQUFTLElBQUksSUFBSSxJQUFJOztZQUVqQixLQUFDLE9BQU87WUFDUixLQUFDOztpQkFFTCxTQUFROztZQUVKLEtBQUMsTUFBTSxrQkFBbUIsS0FBTTtZQUNoQyxLQUFDOztpQkFFTCxTQUFROztZQUVKLEtBQUMsTUFBTSxrQkFBbUIsS0FBTTtZQUNoQyxLQUFDLE1BQU0sWUFBWTtZQUNuQixLQUFDOztpQkFFTCxTQUFROztZQUVKLEtBQUMsTUFBTSxrQkFBbUIsS0FBTTtZQUNoQyxLQUFDLE1BQU0sWUFBWTtZQUNuQixLQUFDOztpQkFFTCxTQUFROztZQUVKLEtBQUM7O2lCQUVMLFNBQVE7O1lBRUosS0FBQyxXQUFXOztpQkFFaEIsU0FBUTs7WUFFSixLQUFDLFVBQVU7WUFDWCxLQUFDOztpQkFFTCxNQUFNLFVBQVU7O1lBRVosS0FBQyxXQUFXO1lBQ1osS0FBQzs7aUJBRUwsU0FBUTs7WUFFSixLQUFDLGtCQUFrQjtZQUNuQixLQUFDOztpQkFFTCxTQUFROztZQUVKLEtBQUMsU0FBUztZQUNWLEtBQUM7O2lCQUVMLFNBQVE7O1lBRUosS0FBSyxLQUFLO1lBQ1YsS0FBQzs7aUJBRUwsVUFBVSxNQUFNLFNBQVM7O1lBRXJCLEtBQUMsUUFBUSxRQUFRLEtBQUM7WUFDbEIsS0FBQzs7d0JBRUwsS0FBUTs7Z0JBRUQsU0FBUSxpQkFBYyxLQUFDOztnQkFDdEIsS0FBQyxTQUFVLFNBQVUsT0FBUSxRQUFVLEtBQU07Z0JBQzdDLEtBQUM7Ozs7Z0JBRUQsS0FBQyxTQUFTO2dCQUNWLEtBQUM7Ozs7O21CQUVIOztlQUVWOzs7cUJBUUoseUJBQVksV0FBVTs7Z0JBRVg7O2lCQUNIO3VCQUFtQixNQUFNLE1BQU0sT0FBTzs7aUJBQ3RDO3VCQUFtQixNQUFNLE1BQU0sT0FBTzs7OztlQUUxQzs7O1dBN2hCQzs7O2VBK2hCRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
