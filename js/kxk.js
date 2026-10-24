var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var exp, kxk, utl

kxk = {}
import post from "./kxk/post.js"
import slash from "./kxk/slash.js"
import stash from "./kxk/stash.js"
import watch from "./kxk/watch.js"
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

var list = _k_.list("post slash stash watch matchr immutable linediff karg krzl pretty profile keyinfo clip events kstr kseg kermit scooter pepe kpos util sds os nfs walkdir noon".split(' '))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3hrLmpzIiwic291cmNlcyI6WyIuLi9rb2RlL2t4ay5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBVUE7T0FFWSxXQUFOO09BQVcsWUFBWDtPQUFpQixZQUFqQjtPQUF1QixZQUF2QjtPQUE2QixhQUE3QjtPQUFvQyxnQkFBcEM7T0FBOEMsZUFBOUM7T0FBdUQsV0FBdkQ7T0FBNEQsV0FBNUQ7T0FBaUUsYUFBakU7T0FBd0UsY0FBeEU7T0FBZ0YsY0FBaEY7T0FBd0YsV0FBeEY7T0FBNkYsYUFBN0Y7T0FBb0csV0FBcEc7T0FBeUcsV0FBekc7T0FBOEcsYUFBOUc7T0FBcUgsY0FBckg7T0FBNkgsV0FBN0g7T0FBa0ksV0FBbEk7T0FBdUksV0FBdkk7T0FBNEksVUFBNUk7T0FBZ0osU0FBaEo7T0FBbUosVUFBbko7T0FBdUosY0FBdko7T0FBK0osV0FBL0o7O29CQUNLLGdLQUFnSyxNQUFNOzs7SUFBN0s7SUFBb0wsSUFBSSxPQUFPLEtBQUs7O0tBRXBNLE9BQVc7O0lBQVAsTUFBTztJQUFPLElBQUksT0FBTzs7QUFFakMsSUFBSSxRQUFRO2VBRUwifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk.kode
