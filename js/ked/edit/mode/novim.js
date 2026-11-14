var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"
import kseg from "../../../kxk/kseg.js"

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
        this.exHighlighting = false
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
        var forward, motion, operator, till, _184_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_184_46_=novim.operators[this.operator]) != null ? _184_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        return this.execute(novim.commands['r'](this.countNumber(),char))
    }

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion, operator, _198_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_198_46_=novim.operators[this.operator]) != null ? _198_46_ : 'move')
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

        this.clearExHighlight()
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
            return this.startSubstituteConfirm(range[0],range[1],spec)
        }
        this.state.applySubstitutions(entries,spec)
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

    novim.prototype["startSubstituteConfirm"] = function (y1, y2, spec)
    {
        this.exConfirms = {y1:y1,y2:y2,spec:spec,y:y1,fromX:0,remaining:[],total:0}
        this.state.begin()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["remainingSubstitutions"] = function ()
    {
        var c, line, m, result, start, y

        c = this.exConfirms
        result = []
        if (c.y > c.y2)
        {
            return []
        }
        for (var _a_ = y = c.y, _b_ = c.y2; (_a_ <= _b_ ? y <= c.y2 : y >= c.y2); (_a_ <= _b_ ? ++y : --y))
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            line = kseg.str(this.state.s.lines[y])
            start = (y === c.y ? c.fromX : 0)
            var list = _k_.list(belt.lineMatches(line,c.spec,start))
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                m = list[_c_]
                result.push({y:y,match:m})
            }
        }
        return result
    }

    novim.prototype["advanceSubstituteConfirm"] = function ()
    {
        var c, entry, r, spans

        c = this.exConfirms
        if (!c)
        {
            return this.finishSubstituteConfirm()
        }
        c.remaining = this.remainingSubstitutions()
        if (_k_.empty(c.remaining))
        {
            return this.finishSubstituteConfirm()
        }
        entry = c.remaining[0]
        spans = []
        var list = _k_.list(c.remaining)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            r = list[_a_]
            spans.push([r.match.x1,r.y,r.match.x2])
        }
        this.state.setHighlights(spans)
        this.state.setSelections([[entry.match.x1,entry.y,entry.match.x2,entry.y]])
        this.state.setCursors([[entry.match.x1,entry.y]])
        post.emit('novim.pending',{op:'replace? [y/n/a/q/l]'})
        return true
    }

    novim.prototype["applyCurrentSubstitution"] = function ()
    {
        var c, entry, match, repl

        c = this.exConfirms
        if (!c || _k_.empty(c.remaining))
        {
            return false
        }
        entry = c.remaining[0]
        match = entry.match
        repl = belt.exExpandReplacement(c.spec.tokens,match.groups)
        this.state.applySubstitutionAt(entry.y,match,c.spec)
        c.total += 1
        c.y = entry.y
        c.fromX = match.index + repl.length
        if (match.length === 0 && repl.length === 0)
        {
            c.fromX = match.index + 1
        }
        if (!c.spec.flags.g)
        {
            c.y = entry.y + 1
            c.fromX = 0
        }
        return true
    }

    novim.prototype["skipCurrentSubstitution"] = function ()
    {
        var c, entry, match

        c = this.exConfirms
        if (!c || _k_.empty(c.remaining))
        {
            return false
        }
        entry = c.remaining[0]
        match = entry.match
        c.y = entry.y
        c.fromX = match.index + _k_.max(1,match.length)
        if (!c.spec.flags.g)
        {
            c.y = entry.y + 1
            c.fromX = 0
        }
        return true
    }

    novim.prototype["acceptSubstituteConfirm"] = function ()
    {
        this.applyCurrentSubstitution()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["skipSubstituteConfirm"] = function ()
    {
        this.skipCurrentSubstitution()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["acceptAllSubstitutions"] = function ()
    {
        while (this.exConfirms && !_k_.empty(this.exConfirms.remaining))
        {
            this.applyCurrentSubstitution()
            this.advanceSubstituteConfirm()
        }
        return true
    }

    novim.prototype["handleSubstituteConfirmKey"] = function (combo, char)
    {
        switch (combo)
        {
            case 'esc':
            case 'escape':
            case 'ctrl+c':
                return this.finishSubstituteConfirm()

        }

        switch (char)
        {
            case 'y':
                this.acceptSubstituteConfirm()
                break
            case 'n':
                this.skipSubstituteConfirm()
                break
            case 'q':
                this.finishSubstituteConfirm()
                break
            case 'l':
                this.applyCurrentSubstitution()
                return this.finishSubstituteConfirm()

            case 'a':
                this.acceptAllSubstitutions()
                break
        }

        return true
    }

    novim.prototype["finishSubstituteConfirm"] = function ()
    {
        var c

        c = this.exConfirms
        if (!c)
        {
            return false
        }
        this.exConfirms = null
        this.state.setHighlights([])
        this.state.setSelections([])
        this.state.end()
        post.emit('novim.execute',{operator:'substitute',count:c.total})
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
        this.clearExHighlight()
        this.reset()
        return true
    }

    novim.prototype["exChanged"] = function (text)
    {
        this.ex = text
        this.updateExHighlight()
        return true
    }

    novim.prototype["updateExHighlight"] = function ()
    {
        var head, parsed, spans

        parsed = belt.parseEx(this.ex)
        head = null
        if (!parsed.error && _k_.in(parsed.name,['s','substitute']))
        {
            head = belt.parseSubstitutePattern(parsed.args)
        }
        if (head && !_k_.empty(head.pattern))
        {
            if (!head.open)
            {
                return false
            }
            spans = belt.patternSpans(this.state.s.lines,head.pattern)
            this.exHighlighting = true
            this.state.setHighlights(spans)
            return true
        }
        return this.clearExHighlight()
    }

    novim.prototype["clearExHighlight"] = function ()
    {
        if (!this.exHighlighting)
        {
            return false
        }
        this.exHighlighting = false
        this.state.setHighlights([])
        return true
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var build, char, combo, command, prefix, target, _537_28_

        combo = ((_537_28_=event.combo) != null ? _537_28_ : key)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjs7O0FBQ04sU0FBRDs7SUFHSSxPQUFDLGVBQ0csSUFBSyxTQUNMLElBQUssU0FDTCxJQUFLLE9BQ0wsSUFBSyxTQUNMLElBQUs7SUFFVCxPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
