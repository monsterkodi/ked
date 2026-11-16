var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"
import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"
import cmdlinehistory from "../tool/cmdlinehistory.js"

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

        value = this.state.registers.read(':')
        if (!value)
        {
            return false
        }
        line = this.state.registers.textForValue(value)
        this.state.macroLastRegister = ':'
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
        var forward, motion, operator, till, _243_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_243_46_=novim.operators[this.operator]) != null ? _243_46_ : 'move')
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
        var forward, motion, operator, _279_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_279_46_=novim.operators[this.operator]) != null ? _279_46_ : 'move')
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
            this.state.registers.set(':',{lines:[line],linewise:false})
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
            this.state.keepJumps += 1
            result = this.runGlobal(parsed,visualRange)
            this.state.keepJumps -= 1
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
        this.state.registers.set('/',{lines:[text],linewise:false})
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
        this.state.registers.set('/',{lines:[text],linewise:false})
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
        var build, char, combo, command, count, doubled, kind, pending, prefix, target, _874_28_

        combo = ((_874_28_=event.combo) != null ? _874_28_ : key)
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
        if (_k_.in(combo,['ctrl+o','ctrl+i','tab']) && !this.state.novimInsert && !this.state.visual)
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
                    if (this.state.macroLastRegister === ':')
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
        if (char === 'q' && this.state.isMacroRecording())
        {
            this.state.markMacroControlKey()
            this.state.stopMacroRecording()
            this.reset()
            return true
        }
        if (char === 'q' && !this.state.visual && !this.operator && !this.area && !this.prefix)
        {
            this.state.markMacroControlKey()
            this.macroPending = 'record'
            return this.logPending()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjtPQUFpQixxQkFBakI7O09BQ1ksV0FBQTs7O0FBQ2xCLFNBQUQ7O0lBR0ksT0FBQyxlQUNHLElBQUssU0FDTCxJQUFLLFNBQ0wsSUFBSyxPQUNMLElBQUssU0FDTCxJQUFLLFdBQ0wsS0FBTSxZQUNOLEtBQU0sWUFDTixLQUFNO0lBRVYsT0FBQyxjQUNHOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRTs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/novim.kode
