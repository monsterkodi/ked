var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"

import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"


novim = (function ()
{
    novim["operators"] = {'c':'change','d':'delete','y':'yank','>':'indent','<':'deindent'}
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
    novim["textObjects"] = {'w':'word','W':'WORD','"':'"',"'":"'",'(':'(',')':'(','b':'(','[':'[',']':'[','{':'{','}':'{','B':'{'}
    novim["lastVind"] = ''
    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.lastFind = null
        this.exRange = null
        this.exConfirms = null
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
        this.exRange = null
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
        var op, pending

        op = this.operator
        op = (op != null ? op : this.find)
        op = (op != null ? op : this.replace)
        pending = {op:op,area:this.area,prefix:this.prefix,count:this.count,register:this.register}
        post.emit('novim.pending',pending)
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
        var forward, motion, operator, till, _183_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_183_46_=novim.operators[this.operator]) != null ? _183_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        return this.execute(novim.commands['r'](this.countNumber(),char))
    }

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion, operator, _197_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_197_46_=novim.operators[this.operator]) != null ? _197_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["execute"] = function (cmd)
    {
        if (this.register)
        {
            cmd.register = this.register
        }
        this.state.executeNovim(cmd)
        this.reset()
        post.emit('novim.execute',cmd)
        return true
    }

    novim.prototype["runEx"] = function (line)
    {
        var file, name, parsed, visualRange

        visualRange = this.exRange
        this.reset()
        line = line.trim()
        if (_k_.empty(line))
        {
            return true
        }
        if (this.state.visual)
        {
            this.state.stopVisual()
        }
        parsed = belt.parseEx(line)
        if (parsed.error)
        {
            post.emit('novim.error',parsed.error)
            return false
        }
        if (_k_.in(parsed.name,['s','substitute']))
        {
            return this.runSubstitute(parsed,visualRange)
        }
        name = parsed.name
        if (parsed.bang)
        {
            name += '!'
        }
        file = parsed.args
        if (_k_.empty(file))
        {
            file = null
        }
        switch (name)
        {
            case 'q':
                if (this.state.isDirty())
                {
                    post.emit('novim.error','unsaved changes')
                    return false
                }
                post.emit('quit')
                break
            case 'q!':
                post.emit('quit')
                break
            case 'w':
            case 'w!':
                post.emit('file.save',file)
                break
            case 'wq':
            case 'wq!':
                post.emit('file.saveAndQuit',file)
                break
            case 'x':
            case 'x!':
                if (this.state.isDirty())
                {
                    post.emit('file.saveAndQuit',file)
                }
                else
                {
                    post.emit('quit')
                }
                break
            default:
                post.emit('novim.error',`not an editor command: ${name}`)
        }

        return true
    }

    novim.prototype["runSubstitute"] = function (parsed, visualRange)
    {
        var entries, range, spec

        spec = belt.parseSubstitute(parsed.args)
        if (spec.error)
        {
            post.emit('novim.error',spec.error)
            return false
        }
        range = this.resolveExRange(parsed.range,visualRange)
        if (!range)
        {
            post.emit('novim.error','no visual selection')
            return false
        }
        entries = this.state.collectSubstitutions(range[0],range[1],spec)
        if (_k_.empty(entries))
        {
            post.emit('novim.error',`pattern not found: ${spec.pattern}`)
            return false
        }
        if (spec.flags.c)
        {
            return this.startSubstituteConfirm(entries,spec)
        }
        this.state.applySubstitutions(entries,spec,null)
        return true
    }

    novim.prototype["resolveExRange"] = function (rng, visualRange)
    {
        var cursorY, lastY, resolve, y1, y2

        lastY = this.state.s.lines.length - 1
        cursorY = this.state.mainCursor()[1]
        if (!rng)
        {
            return [cursorY,cursorY]
        }
        switch (rng.kind)
        {
            case 'all':
                return [0,lastY]

            case 'visual':
                return visualRange

            default:
                resolve = function (b)
            {
                if (b === 'current')
                {
                    return cursorY
                }
                if (b === 'last')
                {
                    return lastY
                }
                return _k_.clamp(0,lastY,b - 1)
            }
                y1 = resolve(rng.from)
                y2 = resolve(rng.to)
                return (y1 < y2 ? [y1,y2] : [y2,y1])
        }

    }

    novim.prototype["visualLineRange"] = function ()
    {
        var hi, lo, pair, y, ys

        ys = [this.state.mainCursor()[1]]
        var list = _k_.list(this.state.visualPairs())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            ys.push(pair[0][1])
            ys.push(pair[1][1])
        }
        lo = ys[0]
        hi = ys[0]
        var list1 = _k_.list(ys)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            y = list1[_b_]
            if (y < lo)
            {
                lo = y
            }
            if (y > hi)
            {
                hi = y
            }
        }
        return [lo,hi]
    }

    novim.prototype["startSubstituteConfirm"] = function (entries, spec)
    {
        var entry, i, total

        total = 0
        var list = _k_.list(entries)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            entry = list[_a_]
            total += entry.matches.length
        }
        this.exConfirms = {entries:entries,spec:spec,decisions:(function () { var r_b_ = []; for (var _c_ = i = 0, _d_ = total; (_c_ <= _d_ ? i < total : i > total); (_c_ <= _d_ ? ++i : --i))  { r_b_.push(null)  } return r_b_ }).bind(this)(),index:0}
        return this.updateSubstituteConfirm()
    }

    novim.prototype["substitutionAt"] = function (index)
    {
        var entry, n

        n = index
        var list = _k_.list(this.exConfirms.entries)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            entry = list[_a_]
            if (n < entry.matches.length)
            {
                return [entry,entry.matches[n]]
            }
            n -= entry.matches.length
        }
    }

    novim.prototype["updateSubstituteConfirm"] = function ()
    {
        var c, entry, match

        c = this.exConfirms
        if (!c || c.index >= c.decisions.length)
        {
            return this.finishSubstituteConfirm()
        }
        var _a_ = this.substitutionAt(c.index); entry = _a_[0]; match = _a_[1]

        this.state.setHighlights([[match.x1,entry.y,match.x2]])
        post.emit('novim.pending',{op:'replace? [y/n/a/q/l]'})
        return true
    }

    novim.prototype["decideSubstitute"] = function (value, stop)
    {
        var c

        c = this.exConfirms
        c.decisions[c.index] = value
        c.index += 1
        if (stop)
        {
            while (c.index < c.decisions.length)
            {
                c.decisions[c.index] = false
                c.index += 1
            }
        }
        return this.updateSubstituteConfirm()
    }

    novim.prototype["handleSubstituteConfirmKey"] = function (combo, char)
    {
        var c

        switch (combo)
        {
            case 'esc':
            case 'escape':
            case 'ctrl+c':
                return this.decideSubstitute(false,true)

        }

        switch (char)
        {
            case 'y':
                this.decideSubstitute(true,false)
                break
            case 'n':
                this.decideSubstitute(false,false)
                break
            case 'q':
                this.decideSubstitute(false,true)
                break
            case 'l':
                this.decideSubstitute(true,true)
                break
            case 'a':
                c = this.exConfirms
                while (c.index < c.decisions.length)
                {
                    c.decisions[c.index] = true
                    c.index += 1
                }
                return this.updateSubstituteConfirm()

        }

        return true
    }

    novim.prototype["finishSubstituteConfirm"] = function ()
    {
        var c, decisions

        c = this.exConfirms
        this.exConfirms = null
        decisions = c.decisions.map(function (d)
        {
            return (d ? true : false)
        })
        this.state.setHighlights([])
        this.state.applySubstitutions(c.entries,c.spec,decisions)
        post.emit('novim.execute',{operator:'substitute'})
        return true
    }

    novim.prototype["startEx"] = function ()
    {
        var text

        this.reset()
        text = ''
        if (this.state.visual)
        {
            this.exRange = this.visualLineRange()
            text = "'<,'>"
        }
        this.ex = text
        post.emit('novim.ex.start',{state:this.state.name,text:text})
        return true
    }

    novim.prototype["cancelEx"] = function ()
    {
        this.reset()
        return true
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var build, char, combo, command, prefix, target, _422_28_

        combo = ((_422_28_=event.combo) != null ? _422_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (this.exConfirms)
        {
            this.handleSubstituteConfirmKey(combo,char)
            return true
        }
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
                case ':':
                    return this.startEx()

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
                        return this.startEx()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYOztPQUNNLFlBQVQ7O09BQ1MsV0FBWjs7O0FBQ04sU0FBRDs7SUFHSSxPQUFDLGVBQ0csSUFBSyxTQUNMLElBQUssU0FDTCxJQUFLLE9BQ0wsSUFBSyxTQUNMLElBQUs7SUFFVCxPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
