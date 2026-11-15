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
    novim["operators"] = {'c':'change','d':'delete','y':'yank','>':'indent','<':'deindent','gu':'lowercase','gU':'uppercase','g~':'toggleCaseMotion'}
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
        return {operator:'searchNext',count:n,text:novim.lastVind,forward:(novim.lastVind ? novim.lastVindForward : true)}
    },'N':function (n)
    {
        return {operator:'searchPrev',count:n,text:novim.lastVind,forward:(novim.lastVind ? !novim.lastVindForward : false)}
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
    novim["lastVindForward"] = true
    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.lastFind = null
        this.exRange = null
        this.exConfirms = null
        this.exHighlighting = false
        this.searchForward = true
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
        var forward, motion, operator, till, _188_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_188_46_=novim.operators[this.operator]) != null ? _188_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        if (this.state.visual)
        {
            return this.execute({operator:'visualReplace',char:char})
        }
        return this.execute(novim.commands['r'](this.countNumber(),char))
    }

    novim.prototype["handleReplaceKey"] = function (combo, char)
    {
        if (_k_.in(combo,['esc','escape']))
        {
            this.state.finishNovimInsert()
            return true
        }
        if (_k_.in(combo,['delete','backspace']))
        {
            this.state.replaceNovimBackspace()
            return true
        }
        if (combo === 'return')
        {
            return 'unhandled'
        }
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (char.length === 1 && char !== '\n')
        {
            this.state.replaceNovimChar(char)
            return true
        }
        return 'unhandled'
    }

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion, operator, _224_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_224_46_=novim.operators[this.operator]) != null ? _224_46_ : 'move')
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
        if (_k_.in(cmd.operator,['searchNext','searchPrev','searchWord']))
        {
            this.emitSearchPosition()
        }
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

    novim.prototype["startSearch"] = function (forward = true)
    {
        var rng, sel, text

        this.searchForward = forward
        novim.lastVindForward = forward
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

    novim.prototype["emitSearchPosition"] = function ()
    {
        var position

        position = this.state.searchPosition()
        if (!position || position[1] === 0)
        {
            return false
        }
        post.emit('novim.search.position',{state:this.state.name,current:position[0],total:position[1]})
        return true
    }

    novim.prototype["commitSearch"] = function ()
    {
        var after, before, pos, span, spans, target

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
                this.emitSearchPosition()
                return true
            }
        }
        target = null
        var list1 = _k_.list(spans)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            after = span[1] > pos[1] || (span[1] === pos[1] && span[0] > pos[0])
            before = span[1] < pos[1] || (span[1] === pos[1] && span[0] < pos[0])
            if (this.searchForward && after)
            {
                target = span
                break
            }
            if (!this.searchForward && before)
            {
                target = span
            }
        }
        target = (target != null ? target : (this.searchForward ? spans[0] : spans.slice(-1)[0]))
        this.state.setMainCursor([target[0],target[1]])
        this.emitSearchPosition()
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
        var build, char, combo, command, count, doubled, kind, prefix, target, _792_28_

        combo = ((_792_28_=event.combo) != null ? _792_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (this.exConfirms)
        {
            this.handleSubstituteConfirmKey(combo,char)
            return true
        }
        if (this.state.novimInsert && this.state.novimInsert.kind === 'replace')
        {
            return this.handleReplaceKey(combo,char)
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
        if (this.state.visual && !this.operator && !this.area && !this.prefix)
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

                case 'R':
                    return this.execute({operator:'visualChange'})

                case 'u':
                    return this.execute({operator:'visualCase',kind:'lower'})

                case 'U':
                    return this.execute({operator:'visualCase',kind:'upper'})

                case '~':
                    return this.execute({operator:'visualCase',kind:'toggle'})

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
        if (!this.operator && !this.area && !this.prefix)
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
            if (prefix === 'g' && char === 'v')
            {
                this.state.startLastVisual()
                return this.reset()
            }
            if (prefix === 'g' && _k_.in(char,'uU~'))
            {
                kind = 'toggle'
                if (char === 'u')
                {
                    kind = 'lower'
                }
                if (char === 'U')
                {
                    kind = 'upper'
                }
                if (this.state.visual)
                {
                    return this.execute({operator:'visualCase',kind:kind})
                }
                this.operator = 'g' + char
                return this.logPending()
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
            doubled = this.operator === 'gu' && char === 'u' || this.operator === 'gU' && char === 'U' || this.operator === 'g~' && char === '~'
            if (doubled)
            {
                return this.execute({operator:novim.operators[this.operator],motion:{kind:'line',count:this.countNumber()}})
            }
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

            case 'R':
                if (!this.state.visual)
                {
                    count = this.countNumber()
                    this.reset()
                    return this.state.startNovimReplace(count)
                }
                break
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
            case '?':
                this.reset()
                return this.startSearch(char === '/')

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjs7T0FDWSxXQUFBOzs7QUFDbEIsU0FBRDs7SUFHSSxPQUFDLGVBQ0csSUFBSyxTQUNMLElBQUssU0FDTCxJQUFLLE9BQ0wsSUFBSyxTQUNMLElBQUssV0FDTCxLQUFNLFlBQ04sS0FBTSxZQUNOLEtBQU07SUFFVixPQUFDLGNBQ0c7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLFNBQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFVLE9BQWUsTUFBTyxFQUFNLFFBQVUsS0FBTTtNQUNyRSxjQUFROztnQkFBTyxTQUFV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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
