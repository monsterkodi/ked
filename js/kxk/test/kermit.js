var toExport = {}
var lm

import kermit from "../kermit.js"

toExport["kermit"] = async function ()
{
    await section("pattern", async function ()
    {
        compare(kermit.pattern(`header ●header
■level1
    sub ●sub`),[[['header','●header'],[]],[['sub','●sub'],['level1']]])
        compare(kermit.pattern(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`),[[['header','●header'],[]],[['sub','●sub'],['level1']],[['●prefix','●suffix'],['level1','level2']]])
    })
    await section("lineMatch", async function ()
    {
        lm = kermit.lineMatch
        compare(lm("","class ●class"),undefined)
        compare(lm("hello","class ●class"),undefined)
        compare(lm("class","class ●class"),{class:undefined})
        compare(lm("class MyClass","class ●class"),{class:'MyClass'})
        compare(lm("func (arg1, arg2)","●name ◯args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  func (arg1, arg2)","●name ◯args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  constructor ()","●name ◯args"),{name:'constructor',args:'()'})
        compare(lm(`Git.prototype["onFileChanged"] = function (file)`,`Git.prototype["●name"] = function ◯args`,['"']),{name:'onFileChanged',args:'(file)'})
        compare(lm("post.on('index',(function (file)",'●name ◯args',['"','.',',',"'"]),{name:'post',args:". on( ' index '  , (function (file)"})
        compare(lm('        this["onKeyUp"] = this["onKeyUp"].bind(this)','this["●name"] = this["●bind"].bind(this)',['"','.',',',"'"]),{name:'onKeyUp',bind:'onKeyUp'})
        compare(lm("proc build() =",'proc ●name(●args) =',['(',')']),{name:'build',args:''})
        compare(lm("proc build() : int =","proc ●name(●args) : ●type =",['(',')']),{name:'build',args:'',type:'int'})
        compare(lm('logFile = ◇string f prefix="" ->','●name = ◯args ->'),{name:'logFile',args:'◇string f prefix=""'})
        compare(lm('myfunc = args ->','●name = ◯args ->'),{name:'myfunc',args:"args"})
        compare(lm('nofunc = args','●name = ◯args ->'),undefined)
        compare(lm("function test hello(arg1, arg2)","function test ●name(◯args)",['(',')']),{name:"hello",args:"arg1, arg2"})
    })
    await section("simple", async function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
●msg`,`commit  some commit
Author: some author

    some msg

commit      another     commit

Author: another         author
another msg`),[{commit:'some commit',author:'some author',msg:'some msg'},{commit:'another commit',author:'another author',msg:'another msg'}])
    })
    await section("inline", async function ()
    {
        compare(kermit("@@ ●lineinfo @@ ●context",`@@ -111 +222 @@ one two ...
@@ -333 +444 @@ three four`),[{lineinfo:'-111 +222',context:'one two ...'},{lineinfo:'-333 +444',context:'three four'}])
    })
    await section("array1", async function ()
    {
        compare(kermit(`commit  ●commit
■files
    ●type ●path`,`commit id

M   modified/file
C   changed/file

commit other

M   modified/other
C   changed/other
`),[{commit:'id',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]},{commit:'other',files:[{type:'M',path:'modified/other'},{type:'C',path:'changed/other'}]}])
    })
    await section("array2", async function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,`commit 5255e93531d91abee2583fded9c13559f2445489
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Thu Apr 4 00:15:12 2024 +0200

    misc

M   kakao.app/kode/ko/tools/Git.kode

commit 85cfa741ce4e17f142c06d02a857b6646a26d34a
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Wed Apr 3 01:10:28 2024 +0200

    git status

M   modified/file
C   changed/file
`),[{commit:'5255e93531d91abee2583fded9c13559f2445489',author:'monsterkodi <monsterkodi@gmx.net>',date:'Thu Apr 4 00:15:12 2024 +0200',msg:'misc',files:[{type:'M',path:'kakao.app/kode/ko/tools/Git.kode'}]},{commit:'85cfa741ce4e17f142c06d02a857b6646a26d34a',author:'monsterkodi <monsterkodi@gmx.net>',date:'Wed Apr 3 01:10:28 2024 +0200',msg:'git status',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]}])
    })
    await section("nested", async function ()
    {
        compare(kermit(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`,`header h1
    sub s1
        1p1 1s1`),[{header:'h1',level1:[{sub:'s1',level2:[{prefix:'1p1',suffix:'1s1'}]}]}])
    })
    await section("nested array", async function ()
    {
        compare(kermit(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`,`header h1
    sub s1
        1p1 1s1
        1p2 1s2
    sub s2
        2p1 2s1
        2p2 2s2
        2p3 2s3`),[{header:'h1',level1:[{sub:'s1',level2:[{prefix:'1p1',suffix:'1s1'},{prefix:'1p2',suffix:'1s2'}]},{sub:'s2',level2:[{prefix:'2p1',suffix:'2s1'},{prefix:'2p2',suffix:'2s2'},{prefix:'2p3',suffix:'2s3'}]}]}])
    })
    await section("pre", async function ()
    {
        compare(kermit(`◯line`,"               GitInfo.diff()"),[{line:'               GitInfo.diff()'}])
        compare(kermit(`●type ◯line`,"+               GitInfo.diff()\n-               more stuff"),[{type:'+',line:'               GitInfo.diff()'},{type:'-',line:'               more stuff'}])
    })
    await section("patch", async function ()
    {
        compare(kermit(`diff --git ●path
index ●refs
--- ●srcfile
+++ ●tgtfile
■changes
    @@ ●lineinfo @@ ●context
    ■changedlines
        ●type ◯line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
index a6bb5d7..10b7d0a 100644
--- a/kakao.app/js/ko/commands/macro.js
+++ b/kakao.app/js/ko/commands/macro.js
@@ -122 +122 @@ Macro = (function ()
-                GitInfo.diff()
+                GitInfo.diff(cmds)`),[{path:'a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js',refs:'a6bb5d7..10b7d0a 100644',srcfile:'a/kakao.app/js/ko/commands/macro.js',tgtfile:'b/kakao.app/js/ko/commands/macro.js',changes:[{lineinfo:'-122 +122',context:'Macro = (function ()',changedlines:[{type:'-',line:'                GitInfo.diff()'},{type:'+',line:'                GitInfo.diff(cmds)'}]}]}])
    })
    await section("patch deleted", async function ()
    {
        return
        compare(kermit(`diff --git ●path
deleted ●deleted
index ●refs
--- ●srcfile
+++ ●tgtfile
■changes
    @@ ●lineinfo @@ ●context
    ■changedlines
        ●type ◯line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
index a6bb5d7..10b7d0a 100644
--- a/kakao.app/js/ko/commands/macro.js
+++ b/kakao.app/js/ko/commands/macro.js
@@ -122 +122 @@ Macro = (function ()
-                GitInfo.diff()
+                GitInfo.diff(cmds)
diff --git a/kakao.app/deleted.js b/kakao.app/deleted.js
deleted file mode 100644
index a6bb5d7..00000000`),[{path:'a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js',refs:'a6bb5d7..10b7d0a 100644',srcfile:'a/kakao.app/js/ko/commands/macro.js',tgtfile:'b/kakao.app/js/ko/commands/macro.js',changes:[{lineinfo:'-122 +122',context:'Macro = (function ()',changedlines:[{type:'-',line:'                GitInfo.diff()'},{type:'+',line:'                GitInfo.diff(cmds)'}]}]},{path:'a/kakao.app/deleted.js b/kakao.app/deleted.js',deleted:'file mode 100644',refs:'a6bb5d7..00000000'}])
    })
}
toExport["kermit"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VybWl0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L2tlcm1pdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDUyxhQUFBOzs7Ozs7UUFVTyxRQUpSLE9BQU8sUUFBUTs7a0JBS0wsU0FBUyxpQkFDVCxNQUFNLFNBQVU7UUFTbEIsUUFOUixPQUFPLFFBQVE7Ozs7NkJBT0wsU0FBUyxpQkFDVCxNQUFNLFNBQVUsYUFDaEIsVUFBVSxZQUFhLFNBQVM7Ozs7UUFLMUMsS0FBSyxPQUFPO1FBRXdCLFFBQXBDLEdBQUcsR0FBRyxnQkFBZ0M7UUFDRixRQUFwQyxHQUFHLFFBQVEsZ0JBQTJCO1FBQ0YsUUFBcEMsR0FBRyxRQUFRLGlCQUEyQixNQUFNO1FBQ1IsUUFBcEMsR0FBRyxnQkFBZ0IsaUJBQW1CLE1BQU07UUFFSixRQUF4QyxHQUFHLG9CQUFvQixnQkFBbUIsS0FBSyxPQUFPLEtBQUs7UUFDbkIsUUFBeEMsR0FBRyxzQkFBc0IsZ0JBQWlCLEtBQUssT0FBTyxLQUFLO1FBQ25CLFFBQXhDLEdBQUcsbUJBQW1CLGdCQUFvQixLQUFLLGNBQWMsS0FBSztRQUU0QyxRQUE5RyxHQUFHLG1EQUF1RCwyQ0FBK0MsT0FDckcsS0FBSyxnQkFDTCxLQUFLO1FBRTBELFFBQW5FLEdBQUcsbUNBQW1DLGVBQWUsSUFBRyxJQUFHLElBQUcsT0FDMUQsS0FBSyxPQUNMLEtBQUs7UUFFMkcsUUFBcEgsR0FBRyx1REFBdUQsNENBQTRDLElBQUcsSUFBRyxJQUFHLE9BQzNHLEtBQUssVUFDTCxLQUFLO1FBRTJDLFFBQXBELEdBQUcsaUJBQWlCLHVCQUF1QixJQUFJLE9BQU8sS0FBSyxRQUFRLEtBQUs7UUFDTixRQUFsRSxHQUFHLHVCQUF1QiwrQkFBK0IsSUFBSSxPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsS0FBSztRQUVyQyxRQUF6RCxHQUFHLG1DQUFtQyxxQkFBcUIsS0FBSyxVQUFVLEtBQUs7UUFDdEMsUUFBekMsR0FBRyxtQkFBbUIscUJBQXFCLEtBQUssU0FBUyxLQUFLO1FBQ3hCLFFBQXRDLEdBQUcsZ0JBQWdCLG9CQUFxQjtRQUVvQyxRQUE1RSxHQUFHLGtDQUFrQyw4QkFBOEIsSUFBSSxPQUFPLEtBQUssUUFBUSxLQUFLOzs7O1FBd0J4RixRQWRSLE9BQU87O01BSUM7Ozs7Ozs7O2dCQVdBLE9BQVEsY0FDUixPQUFRLGNBQ1IsSUFBUSxhQUVSLE9BQVEsaUJBQ1IsT0FBUSxpQkFDUixJQUFROzs7O1FBY1IsUUFIUixPQUFPLDJCQUEyQjsrQkFJMUIsU0FBVSxZQUNWLFFBQVMsZ0JBRVQsU0FBVSxZQUNWLFFBQVM7Ozs7UUE0QlQsUUFmUixPQUFPOztpQkFJQzs7Ozs7Ozs7O0tBWUEsT0FBUSxLQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sa0JBRU4sS0FBTSxJQUNOLEtBQU0sbUJBR1YsT0FBUSxRQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sbUJBRU4sS0FBTSxJQUNOLEtBQU07Ozs7UUFxQ1YsUUF6QlIsT0FBTzs7Ozs7aUJBT0M7Ozs7Ozs7Ozs7Ozs7Ozs7S0FtQkEsT0FBUSwyQ0FDUixPQUFRLG9DQUNSLEtBQVEsZ0NBQ1IsSUFBUSxPQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sdUNBR1YsT0FBUSwyQ0FDUixPQUFRLG9DQUNSLEtBQVEsZ0NBQ1IsSUFBUSxhQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sa0JBRU4sS0FBTSxJQUNOLEtBQU07Ozs7UUFzQlYsUUFWUixPQUFPOzs7O3lCQU1DOztvQkFLQSxPQUFRLEtBQ1IsU0FDSSxJQUFLLEtBQ0wsU0FDSSxPQUFRLE1BQ1IsT0FBUTs7OztRQXNCaEIsUUFmUixPQUFPOzs7O3lCQU1DOzs7Ozs7O29CQVVBLE9BQVEsS0FDUixTQUNJLElBQUssS0FDTCxTQUNJLE9BQVEsTUFDUixPQUFRLFFBRVIsT0FBUSxNQUNSLE9BQVEsVUFHWixJQUFLLEtBQ0wsU0FDSSxPQUFRLE1BQ1IsT0FBUSxRQUVSLE9BQVEsTUFDUixPQUFRLFFBRVIsT0FBUSxNQUNSLE9BQVE7Ozs7UUFlZ0IsUUFGeEMsT0FBTyxRQUVDLG1DQUNKLEtBQU07UUFLMkQsUUFGckUsT0FBTyxjQUVDLGdFQUNBLEtBQU0sSUFDTixLQUFNLGtDQUVOLEtBQU0sSUFDTixLQUFNOzs7O1FBd0JOLFFBakJSLE9BQU87Ozs7Ozs7cUJBU0M7Ozs7Ozt3Q0FTQSxLQUFNLDBFQUNOLEtBQU0sMEJBQ04sUUFBUyxzQ0FDVCxRQUFTLHNDQUNULFVBQ0ksU0FBVSxZQUNWLFFBQVMsdUJBQ1QsZUFDSSxLQUFNLElBQ04sS0FBTSxtQ0FFTixLQUFNLElBQ04sS0FBTTs7Ozs7UUE4QmQsUUFyQlIsT0FBTzs7Ozs7Ozs7cUJBVUM7Ozs7Ozs7Ozs0QkFZQSxLQUFNLDBFQUNOLEtBQU0sMEJBQ04sUUFBUyxzQ0FDVCxRQUFTLHNDQUNULFVBQ0ksU0FBVSxZQUNWLFFBQVMsdUJBQ1QsZUFDSSxLQUFNLElBQ04sS0FBTSxtQ0FFTixLQUFNLElBQ04sS0FBTSwyQ0FJZCxLQUFNLGdEQUNOLFFBQVUsbUJBQ1YsS0FBTSJ9
//# sourceURL=../../../kode/kxk/test/kermit.kode
