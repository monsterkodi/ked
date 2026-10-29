var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"

import theme from "../../theme/theme.js"


novim = (function ()
{
    novim["operators"] = {c:'change',d:'delete',y:'yank','>':'indent','<':'deindent'}
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
        var t, _187_29_

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

    novim.prototype["completeTextObject"] = function (target)
    {
        var area, operator

        area = this.area
        operator = novim.operators[this.operator]
        return this.execute({operator:operator,motion:{kind:'textObject',area:area,target:target,count:this.countNumber()}})
    }

    novim.prototype["completeFind"] = function (target)
    {
        var forward, motion, operator, till, _207_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_207_46_=novim.operators[this.operator]) != null ? _207_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        return this.execute(novim.commands['r'](this.countNumber(),char))
    }

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion, operator, _221_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_221_46_=novim.operators[this.operator]) != null ? _221_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
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
        var build, char, combo, command, prefix, target, _338_28_, _350_14_

        combo = ((_338_28_=event.combo) != null ? _338_28_ : key)
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
        switch (char)
        {
            case 'left':
                char = 'h'
                break
            case 'right':
                char = 'l'
                break
            case 'up':
                char = 'k'
                break
            case 'down':
                char = 'j'
                break
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

        }
        if ((this.state.visual || this.operator) && !this.area && _k_.in(char,'ia'))
        {
            this.area = (char === 'i' ? 'inner' : 'around')
            return this.logPending()
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
                return this.execute({operator:novim.operators[this.operator],motion:build(this.countNumber())})
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BV21CLFdBQU47T0FBVyxjQUFYOztPQUNNLFlBQVQ7OztBQUVELFNBQVQ7O0lBRUksT0FBQyxlQUNHLEVBQUcsU0FDSCxFQUFHLFNBQ0gsRUFBRyxPQUNILElBQUssU0FDTCxJQUFLO0lBRVQsT0FBQyxpQkFDRyxJQUFRLE9BQ1IsSUFBUSxPQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVEsSUFDUixJQUFRLElBQ1IsSUFBUSxJQUNSLElBQVE7SUFFWixPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLGFBQWUsTUFBTyxFQUFNLEtBQU8sTUFBTTtNQUNsRSxjQUFROztnQkFBTyxTQUFVLGFBQWUsTUFBTyxFQUFNLEtBQU8sTUFBTTtNQUNsRSxjQUFROztnQkFBTyxTQUFVLE1BQWUsTUFBTyxFQUFNLE1BQU87TUFDNUQsY0FBUTs7Z0JBQU8sU0FBVSxNQUFlLE1BQU8sRUFBTSxNQUFPO01BQzVELGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPO01BQy9DLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPO01BQy9DLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxRQUFV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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
