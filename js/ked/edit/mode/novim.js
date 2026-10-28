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
    },'r':function (n, c = '')
    {
        return {operator:'replace',count:n,char:c}
    }}
    novim["exCommands"] = {'q':{desc:'quit, fail if there are pending changes',run:'exQuit',arg:false},'q!':{desc:'quit discarding pending changes',run:'exQuitForce',arg:false},'w':{desc:'write the buffer',run:'exWrite'},'w!':{desc:'write the buffer, overriding a refusal',run:'exWrite'},'wa':{desc:'write all buffers with pending changes',run:'exWriteAll',arg:false},'wq':{desc:'write the buffer and quit',run:'exWriteAndQuit'},'wq!':{desc:'write the buffer and quit, overriding a refusal',run:'exWriteAndQuit'},'x':{desc:'write if changed, then quit',run:'exWriteIfChangedAndQuit'},'x!':{desc:'write if changed, then quit, overriding a refusal',run:'exWriteIfChangedAndQuit'}}
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
        this.logPending()
        return true
    }

    novim.prototype["exitNovim"] = function ()
    {
        this.state.stopMode('novim')
        return true
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
        var t, _197_29_

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
        post.emit('title.novim',t)
        return true
    }

    novim.prototype["complete"] = function (build)
    {
        var operator

        operator = novim.operators[this.operator]
        return this.execute({operator:operator,motion:build(this.countNumber())})
    }

    novim.prototype["completeTextObject"] = function (target)
    {
        var area, operator

        area = this.area
        operator = novim.operators[this.operator]
        return this.execute({operator:operator,motion:{kind:'textObject',area:area,target:target,count:this.countNumber()}})
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
            return this.execute({operator:novim.operators[this.operator],motion:motion})
        }
        else
        {
            return this.execute({operator:'move',motion:motion})
        }
    }

    novim.prototype["completeReplace"] = function (char)
    {
        return this.execute(novim.commands['r'](this.countNumber(),char))
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
            return this.execute({operator:novim.operators[this.operator],motion:motion})
        }
        else
        {
            return this.execute({operator:'move',motion:motion})
        }
    }

    novim.prototype["execute"] = function (cmd)
    {
        if (this.register)
        {
            cmd.register = this.register
        }
        this.state.executeNovim(cmd)
        return this.reset()
    }

    novim.prototype["runEx"] = function ()
    {
        var cmd, file, line, name

        line = this.ex
        this.reset()
        if (_k_.empty(line))
        {
            return true
        }
        var _a_ = novim.splitEx(line); name = _a_[0]; file = _a_[1]

        cmd = novim.exCommands[name]
        if (!cmd)
        {
            post.emit('title.novim',`E492: ${name}`)
            return false
        }
        if (cmd.arg === false && (file != null))
        {
            post.emit('title.novim',`E488: Trailing characters: ${file}`)
            return false
        }
        this[cmd.run](file)
        return true
    }

    novim["splitEx"] = function (line)
    {
        var idx

        line = line.trim()
        idx = line.search(/\s/)
        if (idx < 0)
        {
            return [line,null]
        }
        return [line.slice(0, typeof idx === 'number' ? idx : -1),line.slice(idx).trim()]
    }

    novim.prototype["exQuit"] = function ()
    {
        if (this.state.isDirty())
        {
            post.emit('title.novim','E37: No write since last change (add ! to override)')
            return false
        }
        post.emit('quit')
        return true
    }

    novim.prototype["exQuitForce"] = function ()
    {
        post.emit('quit')
        return true
    }

    novim.prototype["exWrite"] = function (file)
    {
        if (!this.exFileIsPath(file))
        {
            return false
        }
        post.emit('file.save',file)
        return true
    }

    novim.prototype["exWriteAll"] = function ()
    {
        if (this.state.isDirty())
        {
            post.emit('file.save')
        }
        return true
    }

    novim.prototype["exWriteAndQuit"] = function (file)
    {
        if (!this.exFileIsPath(file))
        {
            return false
        }
        post.emit('file.saveAndQuit',file)
        return true
    }

    novim.prototype["exWriteIfChangedAndQuit"] = function (file)
    {
        if (!this.exFileIsPath(file))
        {
            return false
        }
        if (this.state.isDirty())
        {
            post.emit('file.saveAndQuit',file)
        }
        else
        {
            post.emit('quit')
        }
        return true
    }

    novim.prototype["exFileIsPath"] = function (file)
    {
        if (!(file != null ? file.startsWith('!') : undefined))
        {
            return true
        }
        post.emit('title.novim','E492: shell commands are not supported')
        return false
    }

    novim.prototype["handleExKey"] = function (combo, char)
    {
        if (_k_.in(combo,['esc','escape']))
        {
            return this.reset()
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
            return this.logPending()
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
        var area, arrow, build, char, combo, command, operator, prefix, target, _367_28_, _379_14_

        combo = ((_367_28_=event.combo) != null ? _367_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (combo === 'ctrl+v')
        {
            if (!this.operator && !this.area)
            {
                this.state.startVisual('block')
            }
            return this.reset()
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
                return this.completeReplace(char)
            }
            else if (key !== 'shift')
            {
                return this.reset()
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
                return this.reset()
            }
            return this.logPending()
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
                return this.reset()
            }
            if (char === 'V')
            {
                this.state.startVisual('line')
                return this.reset()
            }
            if (_k_.in(char,['d','x']))
            {
                return this.execute({operator:'visualDelete'})
            }
            if (char === 'y')
            {
                return this.execute({operator:'visualYank'})
            }
            if (_k_.in(char,['c','s']))
            {
                return this.execute({operator:'visualChange'})
            }
            if (char === 'o')
            {
                return this.execute({operator:'visualSwap'})
            }
            if (_k_.in(char,['>','<']))
            {
                operator = (char === '>' ? 'visualIndent' : 'visualDeindent')
                return this.execute({operator:operator,count:this.countNumber()})
            }
            if (this.state.visual === 'block' && _k_.in(char,['I','A']))
            {
                operator = (char === 'I' ? 'visualBlockPrepend' : 'visualBlockAppend')
                return this.execute({operator:operator})
            }
            if (area = novim.areas[char])
            {
                this.area = area
                return this.logPending()
            }
        }
        if (!this.operator && !this.area)
        {
            if (char === 'v')
            {
                this.state.startVisual('char')
                return this.reset()
            }
            if (char === 'V')
            {
                this.state.startVisual('line')
                return this.reset()
            }
            if (char === ':' && !this.state.visual)
            {
                this.reset()
                this.ex = ''
                return this.logPending()
            }
        }
        if (this.prefix)
        {
            prefix = this.prefix
            this.prefix = null
            if (prefix === 'g' && char === 'g')
            {
                return this.execute({operator:'move',motion:{kind:'bof',count:this.countNumber()}})
            }
        }
        else if (this.area)
        {
            if (target = novim.textObjects[char])
            {
                if (this.state.visual)
                {
                    return this.execute({operator:'visualTextObject',motion:{kind:'textObject',area:this.area,target:target,count:this.countNumber()}})
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
                return this.logPending()
            }
            else if (char === ';')
            {
                return this.repeatFind()
            }
            else if (char === ',')
            {
                return this.repeatFind(true)
            }
            else if (area = novim.areas[char])
            {
                this.area = area
                return this.logPending()
            }
            else if (_k_.in(char,'0123456789'))
            {
                this.count += char
                return this.logPending()
            }
            else
            {
                return this.reset()
            }
        }
        else if (_k_.in(char,['f','t','F','T']))
        {
            this.find = char
            return this.logPending()
        }
        else if (char === 'i')
        {
            this.state.startNovimInsert({kind:'insert'})
            return this.exitNovim()
        }
        else if (char === 'a')
        {
            this.state.startNovimInsert({kind:'append'})
            this.state.moveCursors('right')
            return this.exitNovim()
        }
        else if (char === 'A')
        {
            this.state.startNovimInsert({kind:'appendEol'})
            this.state.moveCursors('eol')
            return this.exitNovim()
        }
        else if (char === ';')
        {
            return this.repeatFind()
        }
        else if (char === ',')
        {
            return this.repeatFind(true)
        }
        else if (char === 'r')
        {
            this.replace = true
            return this.logPending()
        }
        else if (novim.operators[char])
        {
            this.operator = char
            return this.logPending()
        }
        else if (char === '"')
        {
            this.registerPending = true
            return this.logPending()
        }
        else if (char === 'g')
        {
            this.prefix = 'g'
            return this.logPending()
        }
        else if (char === '/')
        {
            post.emit('vinder.show')
            return this.reset()
        }
        else if (command = novim.commands[char])
        {
            return this.execute(command(this.countNumber()))
        }
        else if (_k_.in(char,'0123456789'))
        {
            if (char === '0' && _k_.empty(this.count))
            {
                return this.execute({operator:'move',motion:{kind:'bol'}})
            }
            else
            {
                this.count += char
                return this.logPending()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFdBQU47T0FBVyxjQUFYOztPQUNNLFlBQVQ7OztBQUVELFNBQVQ7O0lBRUksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHLFNBQ0gsRUFBRyxPQUNILElBQUssU0FDTCxJQUFLO0lBRVQsT0FBQyxZQUNHLEtBQU8sSUFDUCxNQUFPLElBQ1AsR0FBTyxJQUNQLEtBQU87SUFFWCxPQUFDLFdBQ0csRUFBUSxRQUNSLEVBQVE7SUFFWixPQUFDLGlCQUNHLElBQVEsT0FDUixJQUFRLE9BQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUTtJQUVaLE9BQUMsY0FDRzs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckU7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsYUFBZSxNQUFPLEVBQU0sS0FBTyxNQUFNO01BQ2xFLGNBQVE7O2dCQUFPLFNBQVUsYUFBZSxNQUFPLEVBQU0sS0FBTyxNQUFNO01BQ2xFLGNBQVE7O2dCQUFPLFNBQVUsTUFBZSxNQUFPLEVBQU0sTUFBTztNQUM1RCxjQUFROztnQkFBTyxTQUFVLE1BQWUsTUFBTyxFQUFNLE1BQU87TUFDNUQsY0FBUTs7Z0JBQU8s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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
