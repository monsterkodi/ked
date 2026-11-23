var toExport = {}
var all, before, c, check, cols, copied, e, h, m, mat, mk, s, u, uni, x, y0, y1

import clip from "../../kxk/clip.js"
import kseg from "../../kxk/kseg.js"
import post from "../../kxk/post.js"

import detector from "../util/detector.js"
import harness from "../util/harness.js"

import editor from "../edit/editor.js"
import specs from "../edit/specs.js"

import matrix from "../view/base/matrix.js"

import uniko from "../view/colmns/uniko.js"

import clippo from "../view/menu/clippo.js"

import theme from "../theme/theme.js"


mk = function (history, current)
{
    var c, e, h, opt

    h = new harness({cols:80,rows:20})
    e = new editor(h.screen,'editor',[])
    e.cells.layout(0,0,80,20)
    e.state.loadLines(['start'])
    e.state.setMainCursor(0,0)
    opt = {watch:false,readClipboard:(function ()
    {
        return current
    })}
    c = new clippo(h.screen,e,'clippo',opt)
    c.history = history
    return [h,e,c]
}

uni = function (rows = 16)
{
    var e, h, u

    h = new harness({cols:60,rows:30})
    e = new editor(h.screen,'test_editor',[])
    e.state.loadLines(['abc'])
    e.state.setMainCursor(1,0)
    u = new uniko(h.screen,e,'test_uniko')
    u.layout(0,0,60,rows)
    u.show()
    return [h,e,u]
}

mat = function (cols, rows)
{
    var h, m

    h = new harness({cols:cols,rows:rows})
    m = new matrix(h.screen,'test_matrix')
    m.layout(0,0,cols,rows)
    return [h,m]
}
toExport["clippo"] = async function ()
{
    await section("entries", async function ()
    {
        ;[h,e,c] = mk(['older','current','oldest'],'current')
        c.show()
        compare(c.history,['current','older','oldest'])
        compare(c.choices.currentIndex(),0)
        compare(c.choices.hasFocus(),true)
        compare(c.choices.state.s.selections,[])
        ;[h,e,c] = mk(['one\ntwo','old'],'new')
        c.show()
        compare(c.choices.state.s.lines.map(function (line)
        {
            return kseg.str(line)
        }),['','new','','one','two','','old'])
        compare(c.dividerRows,[0,2,5])
        compare(c.entryStart,[0,2,5])
        ;[h,e,c] = mk(['const greet = (name) => name',"use ../../kxk ▪ post"],'current')
        c.show()
        compare(c.choices.state.syntax.getClasses(3)[0],'keyword')
    })
    await section("divider color", async function ()
    {
        ;[h,e,c] = mk(['new','old'],'new')
        c.show()
        c.draw()
        y0 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[0]
        y1 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[1]
        x = c.choices.cells.x
        compare(h.screen.get_fg(x,y0),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y0),theme.selection.span)
        compare(h.screen.get_fg(x + 2,y1),theme.finder.frame)
        h.key(c,'down')
        c.draw()
        compare(h.screen.get_fg(x,y0),theme.finder.frame)
        compare(h.screen.get_fg(x + 2,y0),theme.finder.frame)
        compare(h.screen.get_fg(x,y1),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y1),theme.selection.span)
    })
    await section("navigation", async function ()
    {
        ;[h,e,c] = mk(['new','middle','old'],'new')
        c.show()
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[0])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[2])
        h.key(c,'alt+,')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("search", async function ()
    {
        ;[h,e,c] = mk(['one'],'one')
        c.show()
        compare(c.choices.hasFocus(),true)
        h.key(c,'tab')
        compare(c.input.hasFocus(),true)
        h.key(c,'tab')
        compare(c.choices.hasFocus(),true)
        ;[h,e,c] = mk(['alpha','beta','alphabet'],'gamma')
        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        compare(c.matchEntries,[1,3])
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[3])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("insert", async function ()
    {
        ;[h,e,c] = mk(['hello'],'hello')
        c.show()
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'hellostart')
        compare(e.hasFocus(),true)
        ;[h,e,c] = mk(['hello'],'hello')
        c.show()
        h.key(c,'space')
        compare(c.hidden(),false)
        compare(kseg.str(e.state.s.lines),'hellostart')
        ;[h,e,c] = mk(['alpha','beta','alphabet'],'gamma')
        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        h.key(c,'down')
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'alphabetstart')
    })
}
toExport["clippo"]._section_ = true
toExport["detector"] = async function ()
{
    await section("languages", async function ()
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
toExport["uniko"] = async function ()
{
    await section("filter", async function ()
    {
        ;[h,e,u] = uni()
        all = u.matrix.numItems()
        u.filter('GREEK')
        compare(u.matrix.numItems() > 0,true)
        u.filter('sqrt')
        u.filter('')
        compare(u.matrix.numItems(),all)
    })
    await section("focus", async function ()
    {
        ;[h,e,u] = uni()
        compare(u.focus,'matrix')
        compare(u.matrix.selectedIndex,0)
        h.key(u,'s','s')
        compare(u.focus,'input')
        compare(u.input.current(),'s')
    })
    await section("insert", async function ()
    {
        check = function (e, u)
        {
            compare(kseg.str(e.state.s.lines[0]),'a√bc')
            compare(u.hidden(),false)
            compare(u.focus,'matrix')
            return compare(e.hasFocus(),false)
        }
        ;[h,e,u] = uni()
        u.filter('sqrt')
        h.key(u,'return','')
        check(e,u)
        ;[h,e,u] = uni()
        u.filter('sqrt')
        h.key(u,'space',' ')
        check(e,u)
        ;[h,e,u] = uni(14)
        u.filter('sqrt')
        u.onMouse({type:'press',cell:[2,3],button:'left',count:1})
        check(e,u)
    })
    await section("copy", async function ()
    {
        ;[h,e,u] = uni()
        copied = []
        before = clip.copy
        clip.copy = function (text)
        {
            return copied.push(text)
        }
        u.filter('sqrt')
        h.key(u,'cmd+c','')
        compare(copied,['√'])
        compare(u.hidden(),false)
        clip.copy = before
    })
    await section("escape", async function ()
    {
        ;[h,e,u] = uni()
        h.key(u,'esc','')
        compare(kseg.str(e.state.s.lines[0]),'abc')
        compare(u.hidden(),true)
        compare(e.hasFocus(),true)
    })
    await section("scale", async function ()
    {
        ;[h,e,u] = uni()
        compare(u.matrix.scale,2)
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+up','')
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,2)
        h.key(u,'cmd+down','')
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,1)
    })
}
toExport["uniko"]._section_ = true
toExport["matrix"] = async function ()
{
    await section("selection", async function ()
    {
        ;[h,m] = mat(10,5)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedText(),'a')
        compare(m.moveSelection('right'),true)
        compare(m.selectedText(),'b')
        cols = m.columns()
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedIndex,0)
        compare(m.moveSelection('down'),true)
        compare(m.selectedIndex,cols)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('left'),false)
        compare(m.selectedIndex,0)
        compare(m.moveSelection('up'),false)
        compare(m.selectedIndex,0)
    })
    await section("focus", async function ()
    {
        ;[h,m] = mat(10,5)
        compare(!m.hasFocus(),true)
        h.focus(m)
        compare(m.hasFocus(),true)
        post.emit('focus','somewhere_else')
        compare(!m.hasFocus(),true)
    })
    await section("scale", async function ()
    {
        ;[h,m] = mat(20,20)
        compare(m.scale,2)
        compare(m.viewportRows(),10)
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,4),[0,1])
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,3),[0,1])
        m.incScale(-1)
        m.incScale(-1)
        compare(m.scale,1)
        compare(m.viewportRows(),20)
        var list = [2,3]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            s = list[_a_]
            ;[h,m] = mat(24,20)
            while (m.scale < s)
            {
                m.incScale(1)
            }
            m.setItems(['a'])
            m.draw()
            x = s
            compare(h.screen.get_char(x - s,0),'')
            compare(h.screen.get_char(x,0),'a')
            compare(h.screen.get_char(x + s,0),'')
        }
    })
}
toExport["matrix"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdG9vbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3NCLFdBQVo7T0FBaUIsV0FBakI7T0FBc0IsV0FBdEI7O09BQ1ksZUFBZjtPQUF3QixjQUF4Qjs7T0FDZSxhQUFmO09BQXNCLFlBQXRCOztPQUNlLGFBQVY7O09BQ1UsWUFBVjs7T0FDVSxhQUFUOztPQUNTLFlBQWY7OztBQUVQLGVBQU0sU0FBUTs7OztJQUNWLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3RCLEVBQUUsTUFBTSxXQUFXO0lBQ25CLEVBQUUsTUFBTSxjQUFjLEVBQUU7SUFDeEIsT0FBTSxNQUFNLE1BQU07O2VBQWtCOztJQUNwQyxRQUFRLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUztJQUNuQyxFQUFFLFVBQVU7WUFDWCxFQUFFLEVBQUU7OztBQUVULGdCQUFPLE9BQUs7Ozs7SUFDUixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE1BQU0sV0FBVztJQUNuQixFQUFFLE1BQU0sY0FBYyxFQUFFO0lBQ3hCLFFBQVEsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDaEIsRUFBRTtZQUNELEVBQUUsRUFBRTs7O0FBRVQsZ0JBQU8sTUFBSzs7OztJQUNSLFFBQVEsU0FBUSxLQUFLLEtBQUssS0FBSztJQUMvQixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztZQUNqQixFQUFFOzs7Ozs7VUFPRSxFQUFFLEVBQUUsS0FBSyxJQUFJLFFBQVEsVUFBVSxVQUFVO1FBRTFDLEVBQUU7UUFFUSxRQUFWLEVBQUUsU0FBVyxVQUFVLFFBQVE7UUFDTixRQUF6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
//# sourceURL=../../../kode/ked/test/tools.kode
