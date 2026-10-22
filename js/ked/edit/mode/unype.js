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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW55cGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS91bnlwZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUW1CLFdBQU47O09BQ00sWUFBVDs7T0FFSCxNQUFNLEtBQUssd0JBQXdCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFckQsU0FBVDs7SUFFSSxPQUFDO2FBRUQ7Ozs7UUFFSSxLQUFDLE9BQU87UUFDUixLQUFDLE9BQU87c0JBRUMsTUFBTTs7WUFDWCxNQUFNLE1BQU0sUUFBUSxLQUFLO2lCQUNyQixRQUFhOztnQkFBUixPQUFRO29CQUNELFNBQVE7O29CQUFwQjs7Z0JBQ0EsTUFBTSxJQUFJO29DQUNNLEtBQUssS0FBSyxLQUFLO3FCQUF0Qjs7b0JBQUw7d0JBQ0csSUFBSSxTQUFROzt3QkFDWCxNQUFNLElBQUksTUFBTSxJQUFJLFFBQVE7Ozs7WUFFeEMsTUFBTSxJQUFJLGNBQWMsT0FBTzs7OztxQkFRdkMscUJBQVE7Ozs7WUFFRCxPQUFPLE1BQU0sSUFBSSxLQUFDLE1BQU07O1lBQ3ZCLE9BQU87O2VBRVg7OztxQkFRSix5QkFBWSxXQUFVOztnQkFFWDs7aUJBQ0g7dUJBQW9CLE1BQU0sT0FBTzs7aUJBQ2pDO3VCQUFvQixNQUFNLE9BQU87Ozs7ZUFFckM7OztXQTdDQzs7O2VBK0NGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/unype.kode
