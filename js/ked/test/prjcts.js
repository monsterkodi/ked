var waitFor

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import prjcts from "../index/prjcts.js"


waitFor = async function (cond)
{
    var n

    n = 0
    while (n < 100)
    {
        if (cond())
        {
            return true
        }
        await sleep(10)
        n += 1
    }
    return false
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJqY3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3ByamN0cy5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFNO0lBQU07SUFBTTs7T0FDYixhQUFSOzs7QUFFUCwwQkFBVzs7OztJQUVQLElBQUk7V0FDRSxJQUFJOztZQUNJOzttQkFBUjs7Y0FDQSxNQUFNO1FBQ1IsS0FBSzs7V0FDVCJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/prjcts.kode
