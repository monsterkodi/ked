var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var exp, kxk, utl

kxk = {}
import post from "./kxk/post.js"
import slash from "./kxk/slash.js"
import stash from "./kxk/stash.js"
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

var list = _k_.list("post slash stash watcher matchr immutable linediff karg krzl pretty profile keyinfo clip events kstr kseg kermit scooter pepe kpos util sds os nfs walkdir noon".split(' '))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3hrLmpzIiwic291cmNlcyI6WyIuLi9rb2RlL2t4ay5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBS0E7T0FFWSxXQUFOO09BQVcsWUFBWDtPQUFpQixZQUFqQjtPQUF1QixjQUF2QjtPQUErQixhQUEvQjtPQUFzQyxnQkFBdEM7T0FBZ0QsZUFBaEQ7T0FBeUQsV0FBekQ7T0FBOEQsV0FBOUQ7T0FBbUUsYUFBbkU7T0FBMEUsY0FBMUU7T0FBa0YsY0FBbEY7T0FBMEYsV0FBMUY7T0FBK0YsYUFBL0Y7T0FBc0csV0FBdEc7T0FBMkcsV0FBM0c7T0FBZ0gsYUFBaEg7T0FBdUgsY0FBdkg7T0FBK0gsV0FBL0g7T0FBb0ksV0FBcEk7T0FBeUksV0FBekk7T0FBOEksVUFBOUk7T0FBa0osU0FBbEo7T0FBcUosVUFBcko7T0FBeUosY0FBeko7T0FBaUssV0FBaks7O29CQUNLLGtLQUFrSyxNQUFNOzs7SUFBL0s7SUFBc0wsSUFBSSxPQUFPLEtBQUs7O0tBRXRNLE9BQVc7O0lBQVAsTUFBTztJQUFPLElBQUksT0FBTzs7QUFFakMsSUFBSSxRQUFRO2VBRUwifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk.kode
