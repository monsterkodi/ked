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
    },'r':function (n, c)
    {
        return {operator:'replace',count:n,char:(c != null ? c : '')}
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
        switch (combo)
        {
            case 'esc':
            case 'escape':
                return this.reset()

            case 'return':
            case 'enter':
                return this.runEx()

            case 'backspace':
            case 'delete':
            case 'ctrl+h':
                if (this.ex.length)
                {
                    this.ex = this.ex.slice(0, -1)
                }
                return this.logPending()

        }

        if (char.length === 1 && !(_k_.in(char,'\n\r\t')))
        {
            this.ex += char
            this.logPending()
        }
        return true
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var area, arrow, build, char, combo, command, prefix, target, _360_28_, _372_14_

        combo = ((_360_28_=event.combo) != null ? _360_28_ : key)
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
        else if (char === 'r')
        {
            this.replace = true
            return this.logPending()
        }
        if (arrow = novim.arrows[char])
        {
            char = arrow
        }
        if (this.registerPending)
        {
            this.registerPending = false
            switch (char)
            {
                case '+':
                case '*':
                    this.register = 'clipboard'
                    break
                case '"':
                case '0':
                    this.register = null
                    break
                default:
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
            switch (char)
            {
                case 'v':
                    this.state.startVisual('char')
                    return this.reset()

                case 'V':
                    this.state.startVisual('line')
                    return this.reset()

                case ':':
                    if (!this.state.visual)
                    {
                        this.reset()
                        this.ex = ''
                        return this.logPending()
                    }
                    break
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
            return this.reset()
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
                    return this.completeTextObject(target)
                }
            }
            return this.reset()
        }
        else if (this.operator)
        {
            if (build = novim.motions[char])
            {
                return this.complete(build)
            }
            else if (area = novim.areas[char])
            {
                this.area = area
                return this.logPending()
            }
            switch (char)
            {
                case ';':
                    return this.repeatFind(false)

                case ',':
                    return this.repeatFind(true)

                case 'f':
                case 't':
                case 'F':
                case 'T':
                    this.find = char
                    return this.logPending()

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.count += char
                    return this.logPending()

            }

            return this.reset()
        }
        else if (novim.operators[char])
        {
            this.operator = char
            return this.logPending()
        }
        else if (command = novim.commands[char])
        {
            return this.execute(command(this.countNumber()))
        }
        switch (char)
        {
            case 'i':
                return this.state.startNovimInsert({kind:'insert'})

            case 'a':
                return this.state.startNovimInsert({kind:'append'})

            case 'A':
                return this.state.startNovimInsert({kind:'appendEol'})

            case ';':
                return this.repeatFind(false)

            case ',':
                return this.repeatFind(true)

            case '"':
                this.registerPending = true
                return this.logPending()

            case 'g':
                this.prefix = 'g'
                return this.logPending()

            case '/':
                post.emit('vinder.show')
                return this.reset()

            case 'f':
            case 't':
            case 'F':
            case 'T':
                this.find = char
                return this.logPending()

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (char === '0' && _k_.empty(this.count))
                {
                    return this.execute({operator:'move',motion:{kind:'bol'}})
                }
                else
                {
                    this.count += char
                    return this.logPending()
                }
                break
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
