var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var exp, kxk, utl

kxk = {}
import post from "./kxk/post.js"
import slash from "./kxk/slash.js"
import stash from "./kxk/stash.js"
import watch from "./kxk/watch.js"
import watcher from "./kxk/watcher.js"
import matchr from "./kxk/matchr.js"
import immutable from "./kxk/immutable.js"
import linediff from "./kxk/linediff.js"
import karg from "./kxk/karg.js"
import krzl from "./kxk/krzl.js"
import pretty from "./kxk/pretty.js"
import profile from "./kxk/profile.js"
import keyinfo from "./kxk/keyinfo.js"
import clip from "./kxk/clip.js"
import events from "./kxk/events.js"
import kstr from "./kxk/kstr.js"
import kseg from "./kxk/kseg.js"
import kermit from "./kxk/kermit.js"
import scooter from "./kxk/scooter.js"
import pepe from "./kxk/pepe.js"
import kpos from "./kxk/kpos.js"
import util from "./kxk/util.js"
import sds from "./kxk/sds.js"
import os from "./kxk/os.js"
import nfs from "./kxk/nfs.js"
import walkdir from "./kxk/walkdir.js"
import noon from "./kxk/noon.js"

var list = _k_.list("post slash stash watch watcher matchr immutable linediff karg krzl pretty profile keyinfo clip events kstr kseg kermit scooter pepe kpos util sds os nfs walkdir noon".split(' '))
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    exp = list[_a_]
    kxk[exp] = eval(exp)
}
for (exp in util)
{
    utl = util[exp]
    kxk[exp] = utl
}
kxk.kutil = util
export default kxk;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3hrLmpzIiwic291cmNlcyI6WyIuLi9rb2RlL2t4ay5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBS0E7T0FFWSxXQUFOO09BQVcsWUFBWDtPQUFpQixZQUFqQjtPQUF1QixZQUF2QjtPQUE2QixjQUE3QjtPQUFxQyxhQUFyQztPQUE0QyxnQkFBNUM7T0FBc0QsZUFBdEQ7T0FBK0QsV0FBL0Q7T0FBb0UsV0FBcEU7T0FBeUUsYUFBekU7T0FBZ0YsY0FBaEY7T0FBd0YsY0FBeEY7T0FBZ0csV0FBaEc7T0FBcUcsYUFBckc7T0FBNEcsV0FBNUc7T0FBaUgsV0FBakg7T0FBc0gsYUFBdEg7T0FBNkgsY0FBN0g7T0FBcUksV0FBckk7T0FBMEksV0FBMUk7T0FBK0ksV0FBL0k7T0FBb0osVUFBcEo7T0FBd0osU0FBeEo7T0FBMkosVUFBM0o7T0FBK0osY0FBL0o7T0FBdUssV0FBdks7O29CQUNLLHdLQUF3SyxNQUFNOzs7SUFBckw7SUFBNEwsSUFBSSxPQUFPLEtBQUs7O0tBRTVNLE9BQVc7O0lBQVAsTUFBTztJQUFPLElBQUksT0FBTzs7QUFFakMsSUFBSSxRQUFRO2VBRUwifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk.kode
