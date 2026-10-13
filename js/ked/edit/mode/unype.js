var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var unype

import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import fonts from '../../util/fonts.json' with { type : "json" }

unype = (function ()
{
    unype["map"] = {}
    function unype ()
    {
        var char, def, font, idx, text

        this.name = 'unype'
        this.font = 'crazy'
        if (_k_.empty(unype.map))
        {
            def = fonts.default.join(' ')
            for (font in fonts)
            {
                text = fonts[font]
                if (font === 'default')
                {
                    continue
                }
                unype.map[font] = {}
                var list = _k_.list(kseg(text.join(' ')))
                for (idx = 0; idx < list.length; idx++)
                {
                    char = list[idx]
                    if (def[idx] !== ' ')
                    {
                        unype.map[font][def[idx]] = char
                    }
                }
            }
            unype.map['full width'][' '] = '　'
        }
    }

    unype.prototype["insert"] = function (text)
    {
        var repl

        if (repl = unype.map[this.font][text])
        {
            text = repl
        }
        return text
    }

    unype.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return theme.scroll.hover

            case 'cursor.main':
                return theme.scroll.dot

        }

        return defaultColor
    }

    return unype
})()

export default unype;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW55cGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS91bnlwZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQVdPLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOzs7Ozs7Ozs7UUFRdEQsS0FBQyxPQUFPO1FBQ1IsS0FBQyxPQUFPO3NCQUVDLE1BQU07O1lBQ1gsTUFBTSxNQUFNLFFBQVEsS0FBSzt5QkFDUjs7dUJBQUE7b0JBQ0QsU0FBUTs7b0JBQXBCOztnQkFDQSxNQUFNLElBQUk7b0NBQ00sS0FBSyxLQUFLLEtBQUs7Ozs7d0JBQ3hCLElBQUksU0FBUTs7d0JBQ1gsTUFBTSxJQUFJLE1BQU0sSUFBSSxRQUFROzs7O1lBRXhDLE1BQU0sSUFBSSxjQUFjLE9BQU87Ozs7Ozs7O1lBVWhDLE9BQU8sTUFBTSxJQUFJLEtBQUMsTUFBTTs7WUFDdkIsT0FBTzs7ZUFFWDs7Ozs7Z0JBVU87O2lCQUNIO3VCQUFvQixNQUFNLE9BQU87O2lCQUNqQzt1QkFBb0IsTUFBTSxPQUFPOzs7O2VBRXJDOzs7Ozs7ZUFFRCJ9
//# sourceURL=file://kode/ked/edit/mode/unype.kode
