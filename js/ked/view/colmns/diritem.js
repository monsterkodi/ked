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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyaXRlbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlyaXRlbS5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQVFtQixZQUFUOztPQUNHLFVBQUE7SUFBTTs7O0FBRVYsV0FBVDs7Ozs7SUFRSSxTQUFDLHFCQUFROzs7O2dCQUVFLEtBQUs7O2lCQUNSO3dCQUFXLEtBQUssT0FBTyxNQUFNLFdBQVcsTUFBTTs7O2lDQUNuQyxNQUFNLE1BQU0sSUFBSSxLQUFLLDRCQUFTLE1BQU07Ozs7O0lBRXZELFNBQUMseUJBQVk7Ozs7Z0JBRUYsTUFBTSxJQUFJLEtBQUs7O2lCQUNsQjtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtpQkFDQTtnQkFDSSxPQUFPLE1BQU0sS0FBSyxLQUFLOzs7Z0JBRXZCLE9BQU8sTUFBTSxLQUFLLEtBQUs7OztZQUVmLEtBQUs7O1lBQXJCLFFBQVE7O1lBQ1EsS0FBSzs7WUFBckIsUUFBUTs7ZUFHUixLQUFDLE9BQU8sUUFBUSxXQUFXOzs7V0FyQzFCOzs7ZUF1Q0YifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/diritem.kode
