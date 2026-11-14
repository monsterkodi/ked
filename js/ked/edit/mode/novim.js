var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"
import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"

import mode from "../mode.js"


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

        this.clearExHighlight()
        visualRange = this.exRange
        this.reset()
        line = belt.exTrimLeft(line)
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
        if (_k_.in(parsed.name,['g','v','global','vglobal']))
        {
            return this.runGlobal(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['normal','norm']))
        {
            return this.runNormal(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['d','delete']))
        {
            return this.deleteExRange(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['e','edit']))
        {
            return this.runEdit(parsed)
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
                return false
        }

        return true
    }

    novim.prototype["runSubstitute"] = function (parsed, visualRange)
    {
        var entries, range, searching, searchSpec, spec

        spec = belt.parseSubstitute(parsed.args.trim())
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
        searching = !spec.hasReplacement
        searchSpec = spec
        if (searching)
        {
            searchSpec = {pattern:spec.pattern,flags:{g:true,i:spec.flags.i,c:false}}
        }
        entries = this.state.collectSubstitutions(range[0],range[1],searchSpec)
        if (_k_.empty(entries))
        {
            post.emit('novim.error',`pattern not found: ${spec.pattern}`)
            return false
        }
        if (searching)
        {
            return this.state.selectSubstitutions(entries)
        }
        if (spec.flags.c)
        {
            return this.startSubstituteConfirm(range[0],range[1],spec)
        }
        this.state.applySubstitutions(entries,spec)
        return true
    }

    novim.prototype["runGlobal"] = function (parsed, visualRange)
    {
        var before, delta, invert, line, marks, matched, range, re, spec, target, y

        spec = belt.parseGlobal(parsed.args)
        if (spec.error)
        {
            post.emit('novim.error',spec.error)
            return false
        }
        invert = _k_.in(parsed.name,['v','vglobal'])
        if (parsed.bang)
        {
            invert = !invert
        }
        range = this.resolveExRange(parsed.range,visualRange,true)
        try
        {
            re = new RegExp(spec.pattern)
        }
        catch (err)
        {
            post.emit('novim.error',`invalid pattern: ${err.message}`)
            return false
        }
        marks = []
        for (var _a_ = y = range[0], _b_ = range[1]; (_a_ <= _b_ ? y <= range[1] : y >= range[1]); (_a_ <= _b_ ? ++y : --y))
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            matched = re.test(kseg.str(this.state.s.lines[y]))
            if (matched === invert)
            {
                continue
            }
            marks.push(y)
        }
        delta = 0
        this.state.begin()
        var list = _k_.list(marks)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            y = list[_c_]
            target = y + delta
            if (target < 0 || target >= this.state.s.lines.length)
            {
                continue
            }
            before = this.state.s.lines.length
            line = `${target + 1},${target + 1}${spec.command}`
            if (this.runEx(line) === false)
            {
                break
            }
            if (this.exConfirms)
            {
                this.finishSubstituteConfirm()
                post.emit('novim.error','confirm not supported in :g')
                break
            }
            delta += this.state.s.lines.length - before
        }
        this.state.end()
        return true
    }

    novim.prototype["runNormal"] = function (parsed, visualRange)
    {
        var keys, range, wasActive, y

        keys = parsed.args
        if (_k_.empty(keys))
        {
            return true
        }
        range = this.resolveExRange(parsed.range,visualRange)
        wasActive = mode.isActive(this.state,'novim')
        this.state.begin()
        for (var _a_ = y = range[0], _b_ = range[1]; (_a_ <= _b_ ? y <= range[1] : y >= range[1]); (_a_ <= _b_ ? ++y : --y))
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            this.state.setMainCursor(0,y)
            this.feedNormalKeys(keys)
            if (wasActive && !mode.isActive(this.state,'novim'))
            {
                this.state.startMode('novim')
            }
        }
        this.state.end()
        if (wasActive && !mode.isActive(this.state,'novim'))
        {
            this.state.startMode('novim')
        }
        return true
    }

    novim.prototype["feedNormalKeys"] = function (keys)
    {
        var c, event, sr

        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (this.state.novimInsert)
            {
                event = {combo:c,char:c}
                sr = this.state.handleKey(c,event)
                if (sr === 'unhandled')
                {
                    this.state.insert(c)
                }
            }
            else
            {
                this.handleKey(c,{combo:c,char:c})
            }
        }
        if (this.state.novimInsert)
        {
            this.state.finishNovimInsert()
        }
        return true
    }

    novim.prototype["deleteExRange"] = function (parsed, visualRange)
    {
        var lines, range, rng, y1, y2

        range = this.resolveExRange(parsed.range,visualRange)
        var _a_ = range; y1 = _a_[0]; y2 = _a_[1]

        lines = this.state.s.lines
        y2 = _k_.min(y2,lines.length - 1)
        if (y1 > y2 || y1 >= lines.length)
        {
            return true
        }
        rng = [0,y1,kseg.width(lines[y2]),y2]
        this.state.deleteRanges([rng],[[0,y1]])
        return true
    }

    novim.prototype["runEdit"] = function (parsed)
    {
        var file

        file = parsed.args.trim()
        if (!parsed.bang && this.state.isDirty())
        {
            post.emit('novim.error','unsaved changes (add ! to override)')
            return false
        }
        post.emit('file.edit',file,parsed.bang)
        return true
    }

    novim.prototype["resolveExRange"] = function (rng, visualRange, all = false)
    {
        var cursorY, lastY, resolve, y1, y2

        lastY = this.state.s.lines.length - 1
        cursorY = this.state.mainCursor()[1]
        if (!rng)
        {
            if (all)
            {
                return [0,lastY]
            }
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

    novim.prototype["startSearch"] = function ()
    {
        var rng, sel, text

        text = this.state.textOfSelectionOrWordAtCursor()
        text = (text != null ? text : '')
        if (this.state.s.selections.length)
        {
            sel = this.state.s.selections[_k_.clamp(0,this.state.s.selections.length - 1,this.state.s.main)]
            this.state.setMainCursor(sel[0],sel[1])
        }
        else if (rng = belt.rangeOfClosestWordToPos(this.state.s.lines,this.state.mainCursor()))
        {
            this.state.setMainCursor(rng[0],rng[1])
        }
        novim.lastVind = text
        if (_k_.empty(text))
        {
            this.state.setHighlights([])
        }
        else
        {
            this.state.highlightText(text)
        }
        post.emit('novim.search.start',{state:this.state.name,text:text})
        return true
    }

    novim.prototype["searchChanged"] = function (text)
    {
        novim.lastVind = text
        if (_k_.empty(text))
        {
            this.state.setHighlights([])
        }
        else
        {
            this.state.highlightText(text)
        }
        return true
    }

    novim.prototype["cancelSearch"] = function ()
    {
        this.state.setHighlights([])
        return true
    }

    novim.prototype["commitSearch"] = function ()
    {
        var after, pos, span, spans, target

        spans = this.state.s.highlights
        if (_k_.empty(spans))
        {
            return true
        }
        pos = this.state.mainCursor()
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (span[0] === pos[0] && span[1] === pos[1])
            {
                return true
            }
        }
        target = null
        var list1 = _k_.list(spans)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            after = span[1] > pos[1] || (span[1] === pos[1] && span[0] > pos[0])
            if (after)
            {
                target = span
                break
            }
        }
        target = (target != null ? target : spans[0])
        this.state.setMainCursor([target[0],target[1]])
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
        var build, char, combo, command, prefix, target, _745_28_

        combo = ((_745_28_=event.combo) != null ? _745_28_ : key)
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
                this.reset()
                return this.startSearch()

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjs7T0FDWSxXQUFBOzs7QUFDbEIsU0FBRDs7SUFHSSxPQUFDLGVBQ0csSUFBSyxTQUNMLElBQUssU0FDTCxJQUFLLE9BQ0wsSUFBSyxTQUNMLElBQUs7SUFFVCxPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNy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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
