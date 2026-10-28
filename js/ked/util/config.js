var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

var config

import kxk from "../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash
let post = kxk.post


config = (function ()
{
    function config ()
    {}



    config["load"] = async function ()
    {
        var configFile

        this.loaded = new Promise((function (resolve)
        {
            return this.resolveLoaded = resolve
        }).bind(this))
        configFile = slash.path(_k_.dir(),'../../../config')
        this.data = await noon.load(configFile)
        console.log('config loaded')
        post.emit('config.loaded')
        return this.resolveLoaded()
    }

    return config
})()

export default config;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUVUsVUFBQTtJQUFNO0lBQUs7SUFBTTs7O0FBRWxCLFVBQVQ7Ozs7Ozs7SUFLSSxRQUFDOzs7O1FBRUcsS0FBQyxhQUFhLG1CQUFTOzttQkFBWSxLQUFDLGdCQUFnQjs7UUFFcEQsYUFBYSxNQUFNLEtBQU0sVUFBSTtRQUU3QixLQUFDLGFBQVEsS0FBSyxLQUFLO1FBQ25CLFlBQUk7UUFDSixLQUFLLEtBQUs7ZUFFVixLQUFDOzs7V0FmQTs7O2VBaUJGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
