var diritem

import icons from "../../theme/icons.js"

import kxk from "../../../kxk.js"
let slash = kxk.slash


diritem = (function ()
{
    function diritem ()
    {}

    diritem["symbol"] = function (item)
    {
        var _24_51_

        switch (item.type)
        {
            case 'dir':
                return (item.open ? icons.dir_open : icons.dir_close)

            default:
                return ((_24_51_=icons[slash.ext(item.path)]) != null ? _24_51_ : icons.file)
        }

    }

    diritem["symbolName"] = function (item)
    {
        var name

        switch (slash.ext(item.path))
        {
            case 'kode':
            case 'noon':
            case 'json':
            case 'pug':
            case 'styl':
            case 'html':
            case 'kim':
            case 'nim':
            case 'kua':
            case 'lua':
            case 'js':
            case 'md':
                name = slash.name(item.path)
                break
            default:
                name = slash.file(item.path)
        }

        if (item.modified)
        {
            name += ' ✔'
        }
        if (item.added)
        {
            name += ' ✚'
        }
        return this.symbol(item) + '\u00A0' + name
    }

    return diritem
})()

export default diritem;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyaXRlbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlyaXRlbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztnQkFxQmUsS0FBSzs7aUJBQ1I7d0JBQVcsS0FBSyxPQUFPLE1BQU0sV0FBVyxNQUFNOzs7aUNBQ25DLE1BQU0sTUFBTSxJQUFJLEtBQUssNEJBQVMsTUFBTTs7Ozs7Ozs7O2dCQUk1QyxNQUFNLElBQUksS0FBSzs7aUJBQ2xCO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2lCQUNBO2dCQUNJLE9BQU8sTUFBTSxLQUFLLEtBQUs7OztnQkFFdkIsT0FBTyxNQUFNLEtBQUssS0FBSzs7O1lBRWYsS0FBSzs7WUFBckIsUUFBUTs7WUFDUSxLQUFLOztZQUFyQixRQUFROztlQUdSLEtBQUMsT0FBTyxRQUFRLFdBQVc7Ozs7OztlQUU1QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/diritem.kode
