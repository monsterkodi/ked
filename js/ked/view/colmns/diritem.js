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
        var _9_51_

        switch (item.type)
        {
            case 'dir':
                return (item.open ? icons.dir_open : icons.dir_close)

            default:
                return ((_9_51_=icons[slash.ext(item.path)]) != null ? _9_51_ : icons.file)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyaXRlbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlyaXRlbS5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNtQixZQUFUOztPQUNHLFVBQUE7SUFBTTs7O0FBQ2xCLFdBQUQ7Ozs7O0lBQ0ksU0FBQyxxQkFBUTs7OztnQkFFRSxLQUFLOztpQkFDUjt3QkFBVyxLQUFLLE9BQU8sTUFBTSxXQUFXLE1BQU07OztnQ0FDbkMsTUFBTSxNQUFNLElBQUksS0FBSywyQkFBUyxNQUFNOzs7OztJQUV2RCxTQUFDLHlCQUFZOzs7O2dCQUVGLE1BQU0sSUFBSSxLQUFLOztpQkFDbEI7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7aUJBQ0E7Z0JBQ0ksT0FBTyxNQUFNLEtBQUssS0FBSzs7O2dCQUV2QixPQUFPLE1BQU0sS0FBSyxLQUFLOzs7WUFFZixLQUFLOztZQUFyQixRQUFROztZQUNRLEtBQUs7O1lBQXJCLFFBQVE7O2VBR1IsS0FBQyxPQUFPLFFBQVEsV0FBVzs7O1dBOUJsQzs7O2VBZ0NNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/diritem.kode
