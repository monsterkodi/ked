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
