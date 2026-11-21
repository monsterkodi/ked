var _k_ = {copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var registers

import clip from "../../../kxk/clip.js"


registers = (function ()
{
    function registers ()
    {
        this.values = {}
    }

    registers["cloneValue"] = function (value)
    {
        var cloned, _12_36_, _13_37_

        if (!value)
        {
            return
        }
        cloned = {lines:_k_.copy((((_12_36_=value.lines) != null ? _12_36_ : []))),linewise:((_13_37_=value.linewise) != null ? _13_37_ : false)}
        if (value.keys)
        {
            cloned.keys = value.keys.map(function (event)
            {
                return {key:event.key,combo:event.combo,char:event.char}
            })
        }
        return cloned
    }

    registers["textForValue"] = function (value)
    {
        var text

        if (!value)
        {
            return ''
        }
        text = value.lines.join('\n')
        if (value.linewise)
        {
            text += '\n'
        }
        return text
    }

    registers["recordForText"] = function (text)
    {
        var lines, linewise

        if (_k_.empty(text))
        {
            return
        }
        linewise = text.endsWith('\n')
        lines = text.split('\n')
        if (linewise)
        {
            lines.pop()
        }
        return {lines:lines,linewise:linewise}
    }

    registers["eventForSpecial"] = function (name)
    {
        switch (name.toLowerCase())
        {
            case 'esc':
            case 'escape':
                return {key:'esc',combo:'esc',char:'esc'}

            case 'cr':
            case 'return':
                return {key:'return',combo:'return',char:'\n'}

            case 'tab':
                return {key:'tab',combo:'tab',char:'\t'}

            case 'space':
                return {key:'space',combo:'space',char:' '}

            case 'bs':
            case 'backspace':
                return {key:'backspace',combo:'backspace',char:'backspace'}

        }

        return null
    }

    registers["keysForText"] = function (text)
    {
        var ch, close, event, i, keys

        keys = []
        i = 0
        while (i < text.length)
        {
            ch = text[i]
            if (ch === '<')
            {
                close = text.indexOf('>',i + 1)
                if (close > i)
                {
                    event = registers.eventForSpecial(text.slice(i + 1, typeof close === 'number' ? close : -1))
                    if (event)
                    {
                        keys.push(event)
                        i = close + 1
                        continue
                    }
                }
            }
            if (ch === '\n')
            {
                keys.push({key:'return',combo:'return',char:'\n'})
            }
            else
            {
                keys.push({key:ch,combo:ch,char:ch})
            }
            i += 1
        }
        return keys
    }

    registers["textForKeys"] = function (keys)
    {
        var event, key, text, _85_29_

        text = ''
        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            event = list[_a_]
            key = ((_85_29_=event.char) != null ? _85_29_ : event.key)
            if (key === 'return' || key === '\n')
            {
                text += '\n'
            }
            else if (key === 'tab' || key === '\t')
            {
                text += '\t'
            }
            else if (key === 'space')
            {
                text += ' '
            }
            else if (key === 'esc')
            {
                text += '<Esc>'
            }
            else if (key === 'backspace')
            {
                text += '<BS>'
            }
            else if (key.length === 1)
            {
                text += key
            }
            else
            {
                text += '<' + key + '>'
            }
        }
        return text
    }

    registers["target"] = function (name)
    {
        if (name === 'clipboard')
        {
            name = '+'
        }
        if (!name || name === '' || name === '"')
        {
            return {name:'"',append:false}
        }
        if (name.length !== 1)
        {
            return
        }
        if (/^[A-Z]$/.test(name))
        {
            return {name:name.toLowerCase(),append:true}
        }
        if (/^[a-z0-9\-_+*\/:%.=#]$/.test(name))
        {
            return {name:name,append:false}
        }
    }

    registers["appendValues"] = function (old, value)
    {
        var last

        if (!old)
        {
            return registers.cloneValue(value)
        }
        old = registers.cloneValue(old)
        value = registers.cloneValue(value)
        if (value.linewise)
        {
            old.lines = old.lines.concat(value.lines)
        }
        else
        {
            last = old.lines.length - 1
            old.lines[last] = old.lines[last] + value.lines[0]
            old.lines = old.lines.concat(value.lines.slice(1))
        }
        old.keys = null
        return old
    }

    registers.prototype["textForValue"] = function (value)
    {
        return registers.textForValue(value)
    }

    registers.prototype["keysForText"] = function (text)
    {
        return registers.keysForText(text)
    }

    registers.prototype["macroTarget"] = function (name)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return
        }
        if (!(_k_.in(target.name,'abcdefghijklmnopqrstuvwxyz')))
        {
            return
        }
        return target
    }

    registers.prototype["read"] = function (name)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return
        }
        if (target.name === '_')
        {
            return
        }
        if (_k_.in(target.name,['+','*']))
        {
            return this.readClipboard()
        }
        return registers.cloneValue(this.values[target.name])
    }

    registers.prototype["write"] = function (name, value, operation = 'yank')
    {
        var appended, target

        target = registers.target(name)
        if (!target)
        {
            return
        }
        if (target.name === '_')
        {
            return
        }
        value = registers.cloneValue(value)
        if (!value)
        {
            return
        }
        this.values['"'] = value
        if (operation === 'yank')
        {
            if (target.name === '"')
            {
                this.values['0'] = registers.cloneValue(value)
            }
        }
        else if (_k_.in(operation,['delete','change']))
        {
            if (!value.linewise && value.lines.length <= 1)
            {
                this.values['-'] = registers.cloneValue(value)
            }
            else
            {
                this.shiftNumbered(value)
            }
        }
        if (_k_.in(target.name,['+','*']))
        {
            this.writeClipboard(value)
        }
        else if (target.name === '"')
        {
        }
        else if (target.append)
        {
            appended = registers.appendValues(this.values[target.name],value)
            this.values[target.name] = appended
        }
        else
        {
            this.values[target.name] = registers.cloneValue(value)
        }
        return registers.cloneValue(this.values['"'])
    }

    registers.prototype["set"] = function (name, value)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return false
        }
        if (target.name === '_')
        {
            return false
        }
        this.values[target.name] = registers.cloneValue(value)
        return true
    }

    registers.prototype["setMacro"] = function (name, keys)
    {
        var old, target

        target = this.macroTarget(name)
        if (!target)
        {
            return false
        }
        keys = keys.map(function (event)
        {
            return {key:event.key,combo:event.combo,char:event.char}
        })
        if (target.append && this.values[target.name])
        {
            old = this.values[target.name]
            if (old.keys)
            {
                keys = old.keys.concat(keys)
            }
            else
            {
                keys = registers.keysForText(registers.textForValue(old)).concat(keys)
            }
        }
        this.values[target.name] = {lines:registers.textForKeys(keys).split('\n'),linewise:false,keys:keys}
        return true
    }

    registers.prototype["shiftNumbered"] = function (value)
    {
        var i, source

        for (i = 9; i >= 2; i--)
        {
            source = this.values[`${i - 1}`]
            if (source)
            {
                this.values[`${i}`] = registers.cloneValue(source)
            }
            else
            {
                delete this.values[`${i}`]
            }
        }
        return this.values['1'] = registers.cloneValue(value)
    }

    registers.prototype["readClipboard"] = function ()
    {
        var text

        text = (clip.detect() === 'none' ? clip.text : clip.paste())
        return registers.recordForText(text)
    }

    registers.prototype["writeClipboard"] = function (value)
    {
        var text

        text = registers.textForValue(value)
        if (clip.detect() === 'none')
        {
            return clip.text = text
        }
        else
        {
            return clip.copy(text)
        }
    }

    return registers
})()

export default registers;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvdG9vbC9yZWdpc3Rlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQW1CLFdBQU47OztBQUNaLGFBQUQ7O2FBRUk7O1FBQ0ksS0FBQzs7O0lBRUwsV0FBQyx5QkFBWTs7OzthQUVBOzs7O1FBRVQsVUFDSSwwQkFBWSxNQUFNLGlDQUNsQixtQkFBVSxNQUFNLDhCQUFXO1lBRTVCLE1BQU07O1lBQ0wsT0FBTyxPQUFPLE1BQU0sS0FBSyxjQUFLOzt3QkFDeEIsSUFBSyxNQUFNLElBQUssTUFBTyxNQUFNLE1BQU8sS0FBTSxNQUFNOzs7ZUFFMUQ7OztJQUVKLFdBQUMsMkJBQWM7Ozs7YUFFQzs7bUJBQVY7O1FBRUYsT0FBTyxNQUFNLE1BQU0sS0FBSztZQUNSLE1BQU07O1lBQXRCLFFBQVE7O2VBRVI7OztJQUVKLFdBQUMsNEJBQWU7Ozs7c0JBRUQ7Ozs7UUFFWCxXQUFXLEtBQUssU0FBUztRQUN6QixRQUFXLEtBQUssTUFBTTtZQUVQOztZQUFmLE1BQU07O2dCQUVKLE1BQU8sTUFBTyxTQUFVOzs7SUFFOUIsV0FBQyw4QkFBaUI7O2dCQUVQLEtBQUs7O2lCQUNSO2lCQUFNO3dCQUFtQixJQUFLLE1BQVksTUFBTyxNQUFZLEtBQU07O2lCQUNuRTtpQkFBSzt3QkFBb0IsSUFBSyxTQUFZLE1BQU8sU0FBWSxLQUFNOztpQkFDbkU7d0JBQXlCLElBQUssTUFBWSxNQUFPLE1BQVksS0FBTTs7aUJBQ25FO3dCQUF5QixJQUFLLFFBQVksTUFBTyxRQUFZLEtBQU07O2lCQUNuRTtpQkFBSzt3QkFBb0IsSUFBSyxZQUFZLE1BQU8sWUFBWSxLQUFNOzs7O2VBRXZFOzs7SUFFSixXQUFDLDBCQUFhOzs7O1FBRVY7UUFDQSxJQUFPO2VBRUQsSUFBSSxLQUFLOztZQUVYLEtBQUssS0FBSztnQkFFUCxPQUFNOztnQkFDTCxRQUFRLEtBQUssUUFBUSxJQUFJLElBQUU7b0JBQ3hCLFFBQVE7O29C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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/register.kode
