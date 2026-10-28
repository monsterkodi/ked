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
        return (_k_.empty(this.count) ? 1 : parseInt(this.count))
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
        var area, arrow, build, char, combo, command, prefix, target, _367_28_, _379_14_

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
            switch (char)
            {
                case 'v':
                    this.state.startVisual('char')
                    return this.reset()

                case 'V':
                    this.state.startVisual('line')
                    return this.reset()

                case 'd':
                case 'x':
                    return this.execute({operator:'visualDelete'})

                case 'y':
                    return this.execute({operator:'visualYank'})

                case 'c':
                case 's':
                    return this.execute({operator:'visualChange'})

                case 'o':
                    return this.execute({operator:'visualSwap'})

                case '>':
                    return this.execute({operator:'visualIndent',count:this.countNumber()})

                case '<':
                    return this.execute({operator:'visualDeindent',count:this.countNumber()})

                case 'I':
                    if (this.state.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockPrepend'})
                    }
                    break
                case 'A':
                    if (this.state.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockAppend'})
                    }
                    break
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
                return this.repeatFind(false)
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
            return this.repeatFind(false)
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
        return 'unhandled'
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
