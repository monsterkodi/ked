var toExport = {}
import detector from "../util/detector.js"

toExport["detector"] = async function ()
{
    await section("the language of a snippet is detected", async function ()
    {
        compare(detector.detectExt(''),'kode')
        compare(detector.detectExt('ordinary words only'),'kode')
        compare(detector.detectExt('{\n  "name": "kodi",\n  "ok": true\n}'),'json')
        compare(detector.detectExt("log 'hello'"),'kode')
        compare(detector.detectExt("use ../../kxk ▪ post\nlog 'hi'"),'kode')
        compare(detector.detectExt('function foo() { const x = 1; return x; }'),'js')
        compare(detector.detectExt('async function load() { await fetch(url) }'),'js')
        compare(detector.detectExt('const greet = (name) => console.log(name)'),'js')
        compare(detector.detectExt('function f() {\n  return 1;\n}'),'js')
        compare(detector.detectExt('console.log("hi")'),'js')
        compare(detector.detectExt('interface Foo { readonly name: string }'),'ts')
        compare(detector.detectExt('const x: number = 1'),'ts')
        compare(detector.detectExt('def greet(name):\n    print(name)'),'py')
        compare(detector.detectExt('class Foo:\n    def __init__(self):\n        self.x = 1'),'py')
        compare(detector.detectExt('for f in *.txt; do cat "$f"; done'),'sh')
        compare(detector.detectExt('#!/bin/bash\necho "$HOME" | grep home'),'sh')
        compare(detector.detectExt('#!/usr/bin/fish\nset x 1'),'fish')
        compare(detector.detectExt('pub fn main() void { var x: u32 = 1; }'),'zig')
        compare(detector.detectExt('const std = @import("std");'),'zig')
        compare(detector.detectExt('#include <stdio.h>\nint main(void) { return 0; }'),'c')
        compare(detector.detectExt('template <typename T>\nclass Foo { public: T x; };'),'cpp')
        compare(detector.detectExt('@interface Foo : NSObject\n@end'),'mm')
        compare(detector.detectExt('proc greet(name: string): string =\n  echo name'),'nim')
        compare(detector.detectExt('func greet(name: String) -> String { return name }'),'swift')
        compare(detector.detectExt('using System;\nclass Program { static void Main() { Console.WriteLine("hi"); } }'),'cs')
        compare(detector.detectExt('local x = 1\nprint(x)'),'lua')
        compare(detector.detectExt('function foo()\n  return 1\nend'),'lua')
        compare(detector.detectExt('unless x then y else z'),'coffee')
        compare(detector.detectExt('x = -> 42'),'coffee')
        compare(detector.detectExt('<div class="foo">hello</div>'),'html')
        compare(detector.detectExt('<!DOCTYPE html>\n<html><body><p>hi</p></body></html>'),'html')
        compare(detector.detectExt('body { color: #fff; margin: 0; }'),'css')
        compare(detector.detectExt('body\n  color #fff\n  margin 0'),'styl')
        compare(detector.detectExt('$color: red;\n.foo { color: $color; }'),'scss')
        compare(detector.detectExt('<svg viewBox="0 0 10 10"><circle r="4"/></svg>'),'svg')
        compare(detector.detectExt('# heading\nsome **bold** text'),'md')
        compare(detector.detectExt('name: foo\nitems:\n  - a\n  - b'),'yml')
        compare(detector.detectExt('[user]\n\tname = Foo\n\temail = a@b.c'),'ini')
        compare(detector.detectExt('key = value'),'ini')
        compare(detector.detectExt('<?xml version="1.0"?><plist><dict><key>a</key></dict></plist>'),'plist')
        compare(detector.detectExt('file     = dirent.name'),'kode')
        compare(detector.detectExt('this["onFileChange"] = this["onFileChange"].bind(this)'),'js')
        compare(detector.detectExt('let slash = kxk.slash'),'js')
        compare(detector.detectExt('let kstr = kxk.kstr'),'js')
        compare(detector.detectExt('GtkWidget* window = nullptr;'),'cpp')
        compare(detector.detectExt('static JsonNode* node_null ()\n{\n    return json_node_new(JSON_NODE_NULL);\n}'),'cpp')
        compare(detector.detectExt('return json_node_new(JSON_NODE_NULL);'),'cpp')
        compare(detector.detectExt('return foo();'),'kode')
        compare(detector.detectExt('{'),'kode')
    })
}
toExport["detector"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0ZWN0b3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvZGV0ZWN0b3Iua29kZSJdLCJtYXBwaW5ncyI6IjtPQUFjLGVBQVA7Ozs7OztnQkFNQyxTQUFTLFVBQVUsSUFBTTtnQkFDekIsU0FBUyxVQUFVLHVCQUF5QjtnQkFDNUMsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGVBQWlCO2dCQUNwQyxTQUFTLFVBQVUsa0NBQW9DO2dCQUV2RCxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsOENBQWdEO2dCQUNuRSxTQUFTLFVBQVUsNkNBQStDO2dCQUNsRSxTQUFTLFVBQVUsa0NBQW9DO2dCQUN2RCxTQUFTLFVBQVUscUJBQXVCO2dCQUMxQyxTQUFTLFVBQVUsMkNBQTZDO2dCQUNoRSxTQUFTLFVBQVUsdUJBQXlCO2dCQUU1QyxTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUsMkRBQTZEO2dCQUNoRixTQUFTLFVBQVUscUNBQXVDO2dCQUMxRCxTQUFTLFVBQVUseUNBQTJDO2dCQUM5RCxTQUFTLFVBQVUsNEJBQThCO2dCQUNqRCxTQUFTLFVBQVUsMENBQTRDO2dCQUMvRCxTQUFTLFVBQVUsK0JBQWlDO2dCQUNwRCxTQUFTLFVBQVUsb0RBQXNEO2dCQUN6RSxTQUFTLFVBQVUsc0RBQXdEO2dCQUMzRSxTQUFTLFVBQVUsbUNBQXFDO2dCQUN4RCxTQUFTLFVBQVUsbURBQXFEO2dCQUN4RSxTQUFTLFVBQVUsc0RBQXdEO2dCQUMzRSxTQUFTLFVBQVUsb0ZBQXNGO2dCQUN6RyxTQUFTLFVBQVUseUJBQTJCO2dCQUM5QyxTQUFTLFVBQVUsbUNBQXFDO2dCQUN4RCxTQUFTLFVBQVUsMEJBQTRCO2dCQUMvQyxTQUFTLFVBQVUsYUFBZTtnQkFDbEMsU0FBUyxVQUFVLGdDQUFrQztnQkFDckQsU0FBUyxVQUFVLHdEQUEwRDtnQkFDN0UsU0FBUyxVQUFVLG9DQUFzQztnQkFDekQsU0FBUyxVQUFVLGtDQUFvQztnQkFDdkQsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGtEQUFvRDtnQkFDdkUsU0FBUyxVQUFVLGlDQUFtQztnQkFDdEQsU0FBUyxVQUFVLG1DQUFxQztnQkFDeEQsU0FBUyxVQUFVLHlDQUEyQztnQkFDOUQsU0FBUyxVQUFVLGVBQWlCO2dCQUNwQyxTQUFTLFVBQVUsaUVBQW1FO2dCQUV0RixTQUFTLFVBQVUsMEJBQTRCO2dCQUMvQyxTQUFTLFVBQVUsMERBQTREO2dCQUMvRSxTQUFTLFVBQVUseUJBQTJCO2dCQUM5QyxTQUFTLFVBQVUsdUJBQXlCO2dCQUM1QyxTQUFTLFVBQVUsZ0NBQWtDO2dCQUNyRCxTQUFTLFVBQVUsa0ZBQW9GO2dCQUN2RyxTQUFTLFVBQVUseUNBQTJDO2dCQUM5RCxTQUFTLFVBQVUsaUJBQW1CO2dCQUN0QyxTQUFTLFVBQVUsS0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/detector.kode
