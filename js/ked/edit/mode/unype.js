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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW55cGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS91bnlwZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQVdPLE1BQU0sS0FBSyx3QkFBd0IsS0FBSyxFQUFFLEtBQUksRUFBRSxPQUFPOztBQUVyRCxTQUFUOzs7YUFJSTs7OztRQUVJLEtBQUMsT0FBTztRQUNSLEtBQUMsT0FBTztzQkFFQyxNQUFNOztZQUNYLE1BQU0sTUFBTSxRQUFRLEtBQUs7eUJBQ1I7O3VCQUFBO29CQUNELFNBQVE7O29CQUFwQjs7Z0JBQ0EsTUFBTSxJQUFJO29DQUNNLEtBQUssS0FBSyxLQUFLOzs7b0JBQTNCO3dCQUNHLElBQUksU0FBUTs7d0JBQ1gsTUFBTSxJQUFJLE1BQU0sSUFBSSxRQUFROzs7O1lBRXhDLE1BQU0sSUFBSSxjQUFjLE9BQU87Ozs7cUJBUXZDLHFCQUFROzs7O1lBRUQsT0FBTyxNQUFNLElBQUksS0FBQyxNQUFNOztZQUN2QixPQUFPOztlQUVYOzs7cUJBUUoseUJBQVksV0FBVTs7Z0JBRVg7O2lCQUNIO3VCQUFvQixNQUFNLE9BQU87O2lCQUNqQzt1QkFBb0IsTUFBTSxPQUFPOzs7O2VBRXJDOzs7V0E3Q0M7OztlQStDRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/unype.kode
