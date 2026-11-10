var toExport = {}
var files, first, gone, names, second

import kxk from "../../kxk.js"
let nfs = kxk.nfs
let slash = kxk.slash

import fileutil from "../util/fileutil.js"

toExport["fileutil"] = async function ()
{
    await section("existing files are absolute, resolved and unique", async function ()
    {
        first = slash.tmpfile('txt')
        second = slash.tmpfile('txt')
        gone = slash.tmpfile('txt')
        await nfs.write(first,'first')
        await nfs.write(second,'second')
        names = [slash.file(first),slash.file(second),slash.file(gone),slash.file(first)]
        files = await fileutil.existingFiles(names,slash.dir(first))
        compare(files,[first,second])
        await nfs.remove(first)
        await nfs.remove(second)
    })
    await section("the language of a snippet is detected", async function ()
    {
        compare(fileutil.detectExt(''),'kode')
        compare(fileutil.detectExt('ordinary words only'),'kode')
        compare(fileutil.detectExt('{\n  "name": "kodi",\n  "ok": true\n}'),'json')
        compare(fileutil.detectExt("log 'hello'"),'kode')
        compare(fileutil.detectExt("use ../../kxk ▪ post\nlog 'hi'"),'kode')
        compare(fileutil.detectExt('function foo() { const x = 1; return x; }'),'js')
        compare(fileutil.detectExt('async function load() { await fetch(url) }'),'js')
        compare(fileutil.detectExt('const greet = (name) => console.log(name)'),'js')
        compare(fileutil.detectExt('function f() {\n  return 1;\n}'),'js')
        compare(fileutil.detectExt('console.log("hi")'),'js')
        compare(fileutil.detectExt('interface Foo { readonly name: string }'),'ts')
        compare(fileutil.detectExt('const x: number = 1'),'ts')
        compare(fileutil.detectExt('def greet(name):\n    print(name)'),'py')
        compare(fileutil.detectExt('class Foo:\n    def __init__(self):\n        self.x = 1'),'py')
        compare(fileutil.detectExt('for f in *.txt; do cat "$f"; done'),'sh')
        compare(fileutil.detectExt('#!/bin/bash\necho "$HOME" | grep home'),'sh')
        compare(fileutil.detectExt('#!/usr/bin/fish\nset x 1'),'fish')
        compare(fileutil.detectExt('pub fn main() void { var x: u32 = 1; }'),'zig')
        compare(fileutil.detectExt('const std = @import("std");'),'zig')
        compare(fileutil.detectExt('#include <stdio.h>\nint main(void) { return 0; }'),'c')
        compare(fileutil.detectExt('template <typename T>\nclass Foo { public: T x; };'),'cpp')
        compare(fileutil.detectExt('@interface Foo : NSObject\n@end'),'mm')
        compare(fileutil.detectExt('proc greet(name: string): string =\n  echo name'),'nim')
        compare(fileutil.detectExt('func greet(name: String) -> String { return name }'),'swift')
        compare(fileutil.detectExt('using System;\nclass Program { static void Main() { Console.WriteLine("hi"); } }'),'cs')
        compare(fileutil.detectExt('local x = 1\nprint(x)'),'lua')
        compare(fileutil.detectExt('function foo()\n  return 1\nend'),'lua')
        compare(fileutil.detectExt('unless x then y else z'),'coffee')
        compare(fileutil.detectExt('x = -> 42'),'coffee')
        compare(fileutil.detectExt('<div class="foo">hello</div>'),'html')
        compare(fileutil.detectExt('<!DOCTYPE html>\n<html><body><p>hi</p></body></html>'),'html')
        compare(fileutil.detectExt('body { color: #fff; margin: 0; }'),'css')
        compare(fileutil.detectExt('body\n  color #fff\n  margin 0'),'styl')
        compare(fileutil.detectExt('$color: red;\n.foo { color: $color; }'),'scss')
        compare(fileutil.detectExt('<svg viewBox="0 0 10 10"><circle r="4"/></svg>'),'svg')
        compare(fileutil.detectExt('# heading\nsome **bold** text'),'md')
        compare(fileutil.detectExt('name: foo\nitems:\n  - a\n  - b'),'yml')
        compare(fileutil.detectExt('[user]\n\tname = Foo\n\temail = a@b.c'),'ini')
        compare(fileutil.detectExt('key = value'),'ini')
        compare(fileutil.detectExt('<?xml version="1.0"?><plist><dict><key>a</key></dict></plist>'),'plist')
    })
}
toExport["fileutil"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNO0lBQUk7O09BQ0osZUFBVDs7Ozs7O1FBTUMsUUFBUyxNQUFNLFFBQVE7UUFDdkIsU0FBUyxNQUFNLFFBQVE7UUFDdkIsT0FBUyxNQUFNLFFBQVE7Y0FFckIsSUFBSSxNQUFNLE1BQVE7Y0FDbEIsSUFBSSxNQUFNLE9BQVE7UUFFcEIsU0FBUyxNQUFNLEtBQUssT0FBUSxNQUFNLEtBQUssUUFBUyxNQUFNLEtBQUssTUFBTyxNQUFNLEtBQUs7UUFFN0UsY0FBUyxTQUFTLGNBQWMsTUFBTSxNQUFNLElBQUk7Z0JBRWhELE9BQVMsTUFBTztjQUVkLElBQUksT0FBTztjQUNYLElBQUksT0FBTzs7OztnQkFJYixTQUFTLFVBQVUsSUFBTTtnQkFDekIsU0FBUyxVQUFVLHVCQUF5QjtnQkFDNUMsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGVBQWlCO2dCQUNwQyxTQUFTLFVBQVUsa0NBQW9DO2dCQUV2RCxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsOENBQWdEO2dCQUNuRSxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsa0NBQW9DO2dCQUN2RCxTQUFTLFVBQVUscUJBQXVCO2dCQUMxQyxTQUFTLFVBQVUsMkNBQTZDO2dCQUNoRSxTQUFTLFVBQVUsdUJBQXlCO2dCQUU1QyxTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUsMkRBQTZEO2dCQUNoRixTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUseUNBQTJDO2dCQUM5RCxTQUFTLFVBQVUsNEJBQThCO2dCQUNqRCxTQUFTLFVBQVUsMENBQTRDO2dCQUMvRCxTQUFTLFVBQVUsK0JBQWlDO2dCQUNwRCxTQUFTLFVBQVUsb0RBQXNEO2dCQUN6RSxTQUFTLFVBQVUsc0RBQXdEO2dCQUMzRSxTQUFTLFVBQVUsbUNBQXFDO2dCQUN4RCxTQUFTLFVBQVUsbURBQXFEO2dCQUN4RSxTQUFTLFVBQVUsc0RBQXdEO2dCQUMzRSxTQUFTLFVBQVUsb0ZBQXNGO2dCQUN6RyxTQUFTLFVBQVUseUJBQTJCO2dCQUM5QyxTQUFTLFVBQVUsbUNBQXFDO2dCQUN4RCxTQUFTLFVBQVUsMEJBQTRCO2dCQUMvQyxTQUFTLFVBQVUsYUFBZTtnQkFDbEMsU0FBUyxVQUFVLGdDQUFrQztnQkFDckQsU0FBUyxVQUFVLHdEQUEwRDtnQkFDN0UsU0FBUyxVQUFVLG9DQUFzQztnQkFDekQsU0FBUyxVQUFVLGtDQUFvQztnQkFDdkQsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGtEQUFvRDtnQkFDdkUsU0FBUyxVQUFVLGlDQUFtQztnQkFDdEQsU0FBUyxVQUFVLG1DQUFxQztnQkFDeEQsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGVBQWlCO2dCQUNwQyxTQUFTLFVBQVUsaUVBQW1FIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/fileutil.kode
