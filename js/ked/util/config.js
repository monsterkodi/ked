var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

var config

import kxk from "../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash


config = (function ()
{
    function config ()
    {}


    config["load"] = function ()
    {
        var configFile

        configFile = slash.path(_k_.dir(),'../../../config')
        console.log('load config file',configFile)
        this.data = noon.read(configFile)
        console.log('config loaded',this.data)
    }

    return config
})()

export default config;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2NvbmZpZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUVUsVUFBQTtJQUFNO0lBQUs7OztBQUVaLFVBQVQ7Ozs7OztJQUlJLFFBQUM7Ozs7UUFFRyxhQUFhLE1BQU0sS0FBTSxVQUFJO1FBQzdCLFlBQUksbUJBQW1CO1FBQ3ZCLEtBQUMsT0FBTyxLQUFLLEtBQUs7UUFDbEIsWUFBSSxnQkFBZ0IsS0FBQzs7O1dBVHBCOzs7ZUFXRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/config.kode
