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
        compare(lm("func (arg1, arg2)","●name ○args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  func (arg1, arg2)","●name ○args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  constructor ()","●name ○args"),{name:'constructor',args:'()'})
        compare(lm(`Git.prototype["onFileChanged"] = function (file)`,`Git.prototype["●name"] = function ○args`,['"']),{name:'onFileChanged',args:'(file)'})
        compare(lm("post.on('index',(function (file)",'●name ○args',['"','.',',',"'"]),{name:'post',args:". on( ' index '  , (function (file)"})
        compare(lm('        this["onKeyUp"] = this["onKeyUp"].bind(this)','this["●name"] = this["●bind"].bind(this)',['"','.',',',"'"]),{name:'onKeyUp',bind:'onKeyUp'})
        compare(lm("proc build() =",'proc ●name(●args) =',['(',')']),{name:'build',args:''})
        compare(lm("proc build() : int =","proc ●name(●args) : ●type =",['(',')']),{name:'build',args:'',type:'int'})
        compare(lm('logFile = ◇string f prefix="" ->','●name = ○args ->'),{name:'logFile',args:'◇string f prefix=""'})
        compare(lm('myfunc = args ->','●name = ○args ->'),{name:'myfunc',args:"args"})
        compare(lm('nofunc = args','●name = ○args ->'),undefined)
        compare(lm("function test hello(arg1, arg2)","function test ●name(○args)",['(',')']),{name:"hello",args:"arg1, arg2"})
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
        compare(kermit(`○line`,"               GitInfo.diff()"),[{line:'               GitInfo.diff()'}])
        compare(kermit(`●type ○line`,"+               GitInfo.diff()\n-               more stuff"),[{type:'+',line:'               GitInfo.diff()'},{type:'-',line:'               more stuff'}])
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
        ●type ○line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
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
        ●type ○line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VybWl0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L2tlcm1pdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FRUyxhQUFBOzs7Ozs7Z0JBTUQsT0FBTyxRQUFROztrQkFLTCxTQUFTLGlCQUNULE1BQU0sU0FBVTtnQkFHMUIsT0FBTyxRQUFROzs7OzZCQU9MLFNBQVMsaUJBQ1QsTUFBTSxTQUFVLGFBQ2hCLFVBQVUsWUFBYSxTQUFTOzs7O1FBSzFDLEtBQUssT0FBTztnQkFFWixHQUFHLEdBQUcsZ0JBQWdDO2dCQUN0QyxHQUFHLFFBQVEsZ0JBQTJCO2dCQUN0QyxHQUFHLFFBQVEsaUJBQTJCLE1BQU07Z0JBQzVDLEdBQUcsZ0JBQWdCLGlCQUFtQixNQUFNO2dCQUU1QyxHQUFHLG9CQUFvQixnQkFBbUIsS0FBSyxPQUFPLEtBQUs7Z0JBQzNELEdBQUcsc0JBQXNCLGdCQUFpQixLQUFLLE9BQU8sS0FBSztnQkFDM0QsR0FBRyxtQkFBbUIsZ0JBQW9CLEtBQUssY0FBYyxLQUFLO2dCQUVsRSxHQUFHLG1EQUF1RCwyQ0FBK0MsT0FDckcsS0FBSyxnQkFDTCxLQUFLO2dCQUVULEdBQUcsbUNBQW1DLGVBQWUsSUFBRyxJQUFHLElBQUcsT0FDMUQsS0FBSyxPQUNMLEtBQUs7Z0JBRVQsR0FBRyx1REFBdUQsNENBQTRDLElBQUcsSUFBRyxJQUFHLE9BQzNHLEtBQUssVUFDTCxLQUFLO2dCQUVULEdBQUcsaUJBQWlCLHVCQUF1QixJQUFJLE9BQU8sS0FBSyxRQUFRLEtBQUs7Z0JBQ3hFLEdBQUcsdUJBQXVCLCtCQUErQixJQUFJLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxLQUFLO2dCQUU5RixHQUFHLG1DQUFtQyxxQkFBcUIsS0FBSyxVQUFVLEtBQUs7Z0JBQy9FLEdBQUcsbUJBQW1CLHFCQUFxQixLQUFLLFNBQVMsS0FBSztnQkFDOUQsR0FBRyxnQkFBZ0Isb0JBQXFCO2dCQUV4QyxHQUFHLGtDQUFrQyw4QkFBOEIsSUFBSSxPQUFPLEtBQUssUUFBUSxLQUFLOzs7O2dCQVVoRyxPQUFPOztNQUlDOzs7Ozs7OztnQkFXQSxPQUFRLGNBQ1IsT0FBUSxjQUNSLElBQVEsYUFFUixPQUFRLGlCQUNSLE9BQVEsaUJBQ1IsSUFBUTs7OztnQkFXaEIsT0FBTywyQkFBMkI7K0JBSTFCLFNBQVUsWUFDVixRQUFTLGdCQUVULFNBQVUsWUFDVixRQUFTOzs7O2dCQWFqQixPQUFPOztpQkFJQzs7Ozs7Ozs7O0tBWUEsT0FBUSxLQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sa0JBRU4sS0FBTSxJQUNOLEtBQU0sbUJBR1YsT0FBUSxRQUNSLFFBQ0ksS0FBTSxJQUNOLEtBQU0sbUJBRU4sS0FBTSxJQUNOLEtBQU07Ozs7Z0JBWWxCLE9BQU87Ozs7O2lCQU9DOzs7Ozs7Ozs7Ozs7Ozs7O0tBbUJBLE9BQVEsMkNBQ1IsT0FBUSxvQ0FDUixLQUFRLGdDQUNSLElBQVEsT0FDUixRQUNJLEtBQU0sSUFDTixLQUFNLHVDQUdWLE9BQVEsMkNBQ1IsT0FBUSxvQ0FDUixLQUFRLGdDQUNSLElBQVEsYUFDUixRQUNJLEtBQU0sSUFDTixLQUFNLGtCQUVOLEtBQU0sSUFDTixLQUFNOzs7O2dCQVlsQixPQUFPOzs7O3lCQU1DOztvQkFLQSxPQUFRLEtBQ1IsU0FDSSxJQUFLLEtBQ0wsU0FDSSxPQUFRLE1BQ1IsT0FBUTs7OztnQkFPeEIsT0FBTzs7Ozt5QkFNQzs7Ozs7OztvQkFVQSxPQUFRLEtBQ1IsU0FDSSxJQUFLLEtBQ0wsU0FDSSxPQUFRLE1BQ1IsT0FBUSxRQUVSLE9BQVEsTUFDUixPQUFRLFVBR1osSUFBSyxLQUNMLFNBQ0ksT0FBUSxNQUNSLE9BQVEsUUFFUixPQUFRLE1BQ1IsT0FBUSxRQUVSLE9BQVEsTUFDUixPQUFROzs7O2dCQWF4QixPQUFPLFFBRUMsbUNBQ0osS0FBTTtnQkFHVixPQUFPLGNBRUMsZ0VBQ0EsS0FBTSxJQUNOLEtBQU0sa0NBRU4sS0FBTSxJQUNOLEtBQU07Ozs7Z0JBT2QsT0FBTzs7Ozs7OztxQkFTQzs7Ozs7O3dDQVNBLEtBQU0sMEVBQ04sS0FBTSwwQkFDTixRQUFTLHNDQUNULFFBQVMsc0NBQ1QsVUFDSSxTQUFVLFlBQ1YsUUFBUyx1QkFDVCxlQUNJLEtBQU0sSUFDTixLQUFNLG1DQUVOLEtBQU0sSUFDTixLQUFNOzs7OztnQkFTdEIsT0FBTzs7Ozs7Ozs7cUJBVUM7Ozs7Ozs7Ozs0QkFZQSxLQUFNLDBFQUNOLEtBQU0sMEJBQ04sUUFBUyxzQ0FDVCxRQUFTLHNDQUNULFVBQ0ksU0FBVSxZQUNWLFFBQVMsdUJBQ1QsZUFDSSxLQUFNLElBQ04sS0FBTSxtQ0FFTixLQUFNLElBQ04sS0FBTSwyQ0FJZCxLQUFNLGdEQUNOLFFBQVUsbUJBQ1YsS0FBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/kermit.kode
