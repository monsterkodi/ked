var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"
import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"
import cmdlinehistory from "../tool/cmdlinehistory.js"

import mode from "../mode.js"
import keys from "../keys.js"


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
    },'H':function (n)
    {
        return {kind:'windowTop',count:n}
    },'M':function (n)
    {
        return {kind:'windowMiddle',count:n}
    },'L':function (n)
    {
        return {kind:'windowBottom',count:n}
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
        this.searchText = ''
        this.searchHistory = new cmdlinehistory('search')
        this.exHistory = new cmdlinehistory('ex')
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
        this.macroPending = null
        this.find = null
        this.replace = null
        this.ex = null
        this.exRange = null
        this.searchHistory.reset()
        this.exHistory.reset()
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

    novim.prototype["history"] = function (kind)
    {
        return (kind === 'search' ? this.searchHistory : this.exHistory)
    }

    novim.prototype["historyUp"] = function (kind, text)
    {
        return this.navigateHistory(kind,'prev',text)
    }

    novim.prototype["historyDown"] = function (kind, text)
    {
        return this.navigateHistory(kind,'next',text)
    }

    novim.prototype["navigateHistory"] = function (kind, direction, text)
    {
        var current, history, value

        history = this.history(kind)
        current = (text != null ? text : ((kind === 'search' ? this.searchText : this.ex)))
        value = (direction === 'prev' ? history.prev(current) : history.next(current))
        if (!(value != null))
        {
            return false
        }
        if (kind === 'search')
        {
            this.searchChanged(value)
            post.emit('novim.search.text',{state:this.state.name,text:value})
        }
        else
        {
            this.exChanged(value)
            post.emit('novim.ex.text',{state:this.state.name,text:value})
        }
        return true
    }

    novim.prototype["logPending"] = function ()
    {
        var op, pending

        op = null
        if (this.macroPending === 'record')
        {
            op = 'q'
        }
        if (this.macroPending === 'play')
        {
            op = '@'
        }
        op = (op != null ? op : this.operator)
        op = (op != null ? op : this.find)
        op = (op != null ? op : this.replace)
        pending = {op:op,area:this.area,prefix:this.prefix,count:this.count,register:this.register}
        post.emit('novim.pending',pending)
        return true
    }

    novim.prototype["playLastExCommand"] = function (count)
    {
        var i, line, n, value

        value = this.state.novim.register.read(':')
        if (!value)
        {
            return false
        }
        line = this.state.novim.register.textForValue(value)
        this.state.novim.macroLastRegister = ':'
        n = _k_.max(1,((count != null ? count : 1)))
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            this.runEx(line)
        }
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
        var forward, motion, operator, till, _246_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_246_46_=novim.operators[this.operator]) != null ? _246_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        if (this.state.novim.visual)
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
        var forward, motion, operator, _282_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_282_46_=novim.operators[this.operator]) != null ? _282_46_ : 'move')
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

    novim.prototype["runEx"] = function (line, record = true)
    {
        var file, name, parsed, result, visualRange

        this.clearExHighlight()
        visualRange = this.exRange
        this.reset()
        line = belt.exTrimLeft(line)
        if (_k_.empty(line))
        {
            return true
        }
        if (record)
        {
            this.exHistory.add(line)
        }
        if (record)
        {
            this.state.novim.register.set(':',{lines:[line],linewise:false})
        }
        if (this.state.novim.visual)
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
            this.state.novim.jumps.keep += 1
            result = this.runGlobal(parsed,visualRange)
            this.state.novim.jumps.keep -= 1
            return result
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
        this.state.pushJump()
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
            if (this.runEx(line,false) === false)
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
        var chars, range, wasActive, y

        chars = parsed.args
        if (_k_.empty(chars))
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
            this.feedNormalKeys(chars)
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

    novim.prototype["feedNormalKeys"] = function (chars)
    {
        var c, event, sr

        var list = _k_.list(chars)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (this.state.novim.insert)
            {
                event = {combo:c,char:c}
                sr = keys.handleKey(this.state,c,event)
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
        if (this.state.novim.insert)
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
        this.state.pushJump()
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
        this.searchText = text
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
        this.state.novim.register.set('/',{lines:[text],linewise:false})
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
        this.searchText = text
        novim.lastVind = text
        this.state.novim.register.set('/',{lines:[text],linewise:false})
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
        this.searchHistory.reset()
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

        this.searchHistory.add(this.searchText)
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
        before = this.state.mainCursor()
        if (!(_k_.eql(before, [target[0],target[1]])))
        {
            this.state.pushJump(before)
            this.state.setMainCursor([target[0],target[1]])
        }
        this.emitSearchPosition()
        return true
    }

    novim.prototype["startEx"] = function ()
    {
        var text

        this.reset()
        text = ''
        if (this.state.novim.visual)
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
        var build, char, combo, command, count, doubled, kind, pending, prefix, target, _877_28_

        combo = ((_877_28_=event.combo) != null ? _877_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (this.exConfirms)
        {
            this.handleSubstituteConfirmKey(combo,char)
            return true
        }
        if (this.state.novim.insert && this.state.novim.insert.kind === 'replace')
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
        if (_k_.in(combo,['ctrl+o','ctrl+i','tab']) && !this.state.novim.insert && !this.state.novim.visual)
        {
            count = this.countNumber()
            this.reset()
            if (combo === 'ctrl+o')
            {
                this.state.jumpOlder(count)
            }
            else
            {
                this.state.jumpNewer(count)
            }
            return true
        }
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (this.macroPending)
        {
            pending = this.macroPending
            this.macroPending = null
            if (_k_.in(combo,['esc','escape']))
            {
                this.reset()
                return true
            }
            if (pending === 'record')
            {
                this.state.markMacroControlKey()
                if (char.length === 1 && /^[a-zA-Z]$/.test(char))
                {
                    this.state.startMacroRecording(char.toLowerCase(),/^[A-Z]$/.test(char))
                }
                else if (char === ':')
                {
                    post.emit('novim.error','command-line window not implemented')
                }
                else
                {
                    post.emit('novim.error','invalid register')
                }
            }
            else if (pending === 'play')
            {
                count = this.countNumber()
                this.count = ''
                if (char === ':')
                {
                    this.playLastExCommand(count)
                }
                else if (char === '@')
                {
                    if (this.state.novim.macroLastRegister === ':')
                    {
                        this.playLastExCommand(count)
                    }
                    else
                    {
                        this.state.playLastMacro(count)
                    }
                }
                else if (char.length === 1)
                {
                    this.state.playMacro(char,count)
                }
                else
                {
                    post.emit('novim.error','invalid register')
                }
            }
            this.reset()
            return true
        }
        if (char === 'q' && this.state.macroRecording)
        {
            this.state.markMacroControlKey()
            this.state.stopMacroRecording()
            this.reset()
            return true
        }
        if (char === 'q' && !this.state.novim.visual && !this.operator && !this.area && !this.prefix)
        {
            this.state.markMacroControlKey()
            this.macroPending = 'record'
            return this.logPending()
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.reset()
            if (this.state.novim.visual)
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
        if (!this.find && !(_k_.in(char,',;nN0123456789@q')) && !(_k_.in(key,keyinfo.modifierNames)))
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
            if (char === '"')
            {
                this.register = null
            }
            else if (char.length === 1 && _k_.in(char,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_+*/:%.=#'))
            {
                this.register = char
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
        if (this.state.novim.visual && !this.operator && !this.area && !this.prefix)
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
                    if (this.state.novim.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockPrepend'})
                    }
                    break
                case 'A':
                    if (this.state.novim.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockAppend'})
                    }
                    break
            }

        }
        if ((this.state.novim.visual || this.operator) && !this.area && _k_.in(char,'ia'))
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
                    if (!this.state.novim.visual)
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
            if (prefix === 'g' && _k_.in(char,[';',',']))
            {
                if (this.operator || this.area || this.state.novim.visual)
                {
                    return this.reset()
                }
                count = this.countNumber()
                this.reset()
                if (char === ';')
                {
                    this.state.jumpChangeOlder(count)
                }
                else
                {
                    this.state.jumpChangeNewer(count)
                }
                return true
            }
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
                if (this.state.novim.visual)
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
                if (this.state.novim.visual)
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
            case 'H':
                return this.execute({operator:'move',motion:{kind:'windowTop',count:this.countNumber()}})

            case 'M':
                return this.execute({operator:'move',motion:{kind:'windowMiddle',count:this.countNumber()}})

            case 'L':
                return this.execute({operator:'move',motion:{kind:'windowBottom',count:this.countNumber()}})

            case 'i':
                return this.state.startNovimInsert({kind:'insert'})

            case 'a':
                return this.state.startNovimInsert({kind:'append'})

            case 'A':
                return this.state.startNovimInsert({kind:'appendEol'})

            case 'R':
                if (!this.state.novim.visual)
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

            case '@':
                this.macroPending = 'play'
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjtPQUFpQixxQkFBakI7O09BQ1ksV0FBQTtPQUFLLFdBQUE7OztBQUN2QixTQUFEOztJQUdJLE9BQUMsZUFDRyxJQUFLLFNBQ0wsSUFBSyxTQUNMLElBQUssT0FDTCxJQUFLLFNBQ0wsSUFBSyxXQUNMLEtBQU0sWUFDTixLQUFNLFlBQ04sS0FBTTtJQUVWLE9BQUMsY0FDRzs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckU7O2dCQUFlLFNBQVUsU0FBNEIsUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsU0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFNO01BQ3JFLGNBQVE7O2dCQUFPLFNBQVUsT0FBZSxNQUFPLEVBQU0sUUFBVSxLQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
