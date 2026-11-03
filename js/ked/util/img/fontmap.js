var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var fontmap

import child_process from "child_process"
let spawnSync = child_process.spawnSync

import fs from "fs"

import os from "os"

import kxk from "../../../kxk.js"
let noon = kxk.noon
let slash = kxk.slash


fontmap = (function ()
{
    function fontmap ()
    {}

    fontmap["font"] = 'JetBrainsMono NFM'
    fontmap["sizes"] = [[4,8],[6,12],[8,16],[10,20],[12,24],[14,28]]
    fontmap["chars"] = Array.from("0123456789!?-+_=/><^[](){}" + "\"'#*$@%&:;., " + "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    fontmap["out"] = slash.path(_k_.dir(),'../../../../img')
    fontmap["mapFile"] = slash.path(_k_.dir(),'../../../../kode/ked/util/img/fontmap.noon')
    fontmap["tmp"] = function (name)
    {
        return slash.path(os.tmpdir(),`ked-fontmap-${name}.png`)
    }

    fontmap["fontFile"] = function ()
    {
        var result

        result = this.exec('fc-match',['-f','%{file}',this.font])
        if (!result)
        {
            return ''
        }
        return slash.file(String(result.stdout).trim())
    }

    fontmap["exec"] = function (cmd, args)
    {
        var result

        result = child_process.spawnSync(cmd,args,{maxBuffer:0x10000000})
        if (result.status !== 0)
        {
            console.error(`fontmap: ${cmd} failed with ${result.status}`)
            console.error(String(result.stderr))
            return null
        }
        return result
    }

    fontmap["identify"] = function (file)
    {
        var h, result, w

        result = this.exec('magick',['identify','-format','%wx%h',file])
        if (!result)
        {
            return null
        }
        var _a_ = String(result.stdout).trim().split('x'); w = _a_[0]; h = _a_[1]

        return [parseInt(w),parseInt(h)]
    }

    fontmap["render"] = function (text, px, file)
    {
        this.exec('pango-view',['-q','--pixels',`--font=${this.font} ${px}`,'--background=black','--foreground=white','--margin=0',`--text=${text}`,'-o',file])
        return this.identify(file)
    }

    fontmap["grayscale"] = function (file, w, h)
    {
        var result

        result = this.exec('magick',[file,'-filter','Triangle','-resize',`${w}x${h}!`,'-depth','8','gray:-'])
        if (!result)
        {
            return null
        }
        return result.stdout
    }

    fontmap["pxFor"] = function (height)
    {
        var best, d, m, px

        best = null
        for (px = 3; px <= 44; px++)
        {
            m = this.render('MMMMMMMMMM',px,this.tmp('probe'))
            if (!m)
            {
                return null
            }
            d = Math.abs(m[1] - height)
            if (!best || d < best.d)
            {
                best = {d:d,px:px}
            }
            if (m[1] > height + 4)
            {
                break
            }
        }
        return best.px
    }

    fontmap["buildMap"] = function (w, h, px)
    {
        var ch, cov, data, glyphs, i, result, total, x, y

        result = this.render(this.chars.join(''),px,this.tmp('glyphs'))
        if (!result)
        {
            return null
        }
        total = w * this.chars.length
        data = this.grayscale(this.tmp('glyphs'),total,h)
        if (!data)
        {
            return null
        }
        glyphs = {}
        var list = _k_.list(this.chars)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            cov = new Uint8Array(new ArrayBuffer(w * h))
            for (var _b_ = y = 0, _c_ = h; (_b_ <= _c_ ? y < h : y > h); (_b_ <= _c_ ? ++y : --y))
            {
                for (var _d_ = x = 0, _e_ = w; (_d_ <= _e_ ? x < w : x > w); (_d_ <= _e_ ? ++x : --x))
                {
                    cov[y * w + x] = data[y * total + i * w + x]
                }
            }
            glyphs[ch] = cov
        }
        return glyphs
    }

    fontmap["rowsFor"] = function (cov, w, h)
    {
        var row, rows, x, y

        rows = []
        for (var _a_ = y = 0, _b_ = h; (_a_ <= _b_ ? y < h : y > h); (_a_ <= _b_ ? ++y : --y))
        {
            row = '0x'
            for (var _c_ = x = 0, _d_ = w; (_c_ <= _d_ ? x < w : x > w); (_c_ <= _d_ ? ++x : --x))
            {
                row += cov[y * w + x].toString(16).padStart(2,'0')
            }
            rows.push(row)
        }
        return rows
    }

    fontmap["noonFor"] = function (maps)
    {
        var ch, data, gl, key, map

        data = {}
        for (key in maps)
        {
            map = maps[key]
            gl = {}
            var list = _k_.list(this.chars)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                ch = list[_a_]
                gl[ch] = this.rowsFor(map.glyphs[ch],map.width,map.height)
            }
            data[key] = {width:map.width,height:map.height,font:map.font,file:map.file,glyphs:gl}
        }
        return noon.stringify(data,{indent:4,maxalign:8}) + '\n'
    }

    fontmap["savePNG"] = function (file, image)
    {
        var result

        result = child_process.spawnSync('magick',['-size',`${image.w}x${image.h}`,'-depth','8','rgba:-','-strip',file],{input:image.rgba,maxBuffer:0x10000000})
        if (result.status !== 0)
        {
            console.error(`fontmap: magick could not write ${file}`)
            console.error(String(result.stderr))
        }
    }

    fontmap["preview"] = function (glyphs, w, h)
    {
        var c, ch, cols, cov, cx, cy, gap, gz, i, ph, pixels, pw, rows, v, x, xx, y, yy

        gz = 4
        cols = 13
        gap = 1
        rows = Math.ceil(this.chars.length / cols)
        pw = cols * w * gz + (cols - 1) * gap
        ph = rows * h * gz + (rows - 1) * gap
        pixels = new Uint32Array(new ArrayBuffer(pw * ph * 4))
        pixels.fill(0xff000000)
        var list = _k_.list(this.chars)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            cx = (i % cols) * (w * gz + gap)
            cy = parseInt(i / cols) * (h * gz + gap)
            cov = glyphs[ch]
            for (var _b_ = y = 0, _c_ = h; (_b_ <= _c_ ? y < h : y > h); (_b_ <= _c_ ? ++y : --y))
            {
                for (var _d_ = x = 0, _e_ = w; (_d_ <= _e_ ? x < w : x > w); (_d_ <= _e_ ? ++x : --x))
                {
                    c = cov[y * w + x]
                    v = c | c << 8 | c << 16 | 0xff000000
                    for (var _f_ = yy = 0, _10_ = gz; (_f_ <= _10_ ? yy < gz : yy > gz); (_f_ <= _10_ ? ++yy : --yy))
                    {
                        for (var _11_ = xx = 0, _12_ = gz; (_11_ <= _12_ ? xx < gz : xx > gz); (_11_ <= _12_ ? ++xx : --xx))
                        {
                            pixels[(cy + y * gz + yy) * pw + cx + x * gz + xx] = v
                        }
                    }
                }
            }
        }
        return {w:pw,h:ph,rgba:pixels}
    }

    fontmap["generate"] = function ()
    {
        var glyphs, h, maps, pngFile, px, w

        fs.mkdirSync(this.out,{recursive:true})
        console.log(`font ${this.fontFile()}`)
        maps = {}
        var list = _k_.list(this.sizes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            w = list[_a_][0]
            h = list[_a_][1]
            px = this.pxFor(h)
            if (!px)
            {
                return
            }
            glyphs = this.buildMap(w,h,px)
            if (!glyphs)
            {
                return
            }
            maps[`${w}x${h}`] = {width:w,height:h,font:this.font,file:this.fontFile(),glyphs:glyphs}
            pngFile = slash.path(this.out,`fontmap-${w}x${h}.png`)
            this.savePNG(pngFile,(this.preview(glyphs,w,h)))
            console.log(`glyphs ${w}x${h} px=${px}`)
        }
        fs.writeFileSync(this.mapFile,this.noonFor(maps))
        console.log(`map ${this.mapFile}`)
    }

    return fontmap
})()

if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    fontmap.generate()
}
export default fontmap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udG1hcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvZm9udG1hcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BeUJJLG9CQUFBO0lBQWdCOztPQUNoQixTQUFBOztPQUNBLFNBQUE7O09BQ1MsVUFBQTtJQUFTO0lBQUs7OztBQUVsQixXQUFUOzs7OztJQUVJLFNBQUMsU0FBUTtJQUNULFNBQUMsWUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUc7SUFDbEQsU0FBQyxVQUFRLE1BQU0sS0FBSywrQkFBK0IsbUJBQW1CLCtCQUErQjtJQUNyRyxTQUFDLFFBQVEsTUFBTSxLQUFNLFVBQUs7SUFDMUIsU0FBQyxZQUFTLE1BQU0sS0FBTSxVQUFLO0lBRTNCLFNBQUMsa0JBQUs7O2VBQVEsTUFBTSxLQUFLLEdBQUcsd0JBQXlCOzs7SUFFckQsU0FBQzs7OztRQUVHLFNBQVMsS0FBQyxLQUFLLFlBQVksS0FBSyxVQUFVLEtBQUM7YUFDOUI7O21CQUFWOztlQUVILE1BQU0sS0FBSyxPQUFPLE9BQU8sUUFBUTs7O0lBR3JDLFNBQUMsbUJBQU0sS0FBSTs7OztRQUVQLFNBQVMsY0FBYyxVQUFVLElBQUksTUFBSyxVQUFVO1lBRWpELE9BQU8sV0FBVTs7WUFDaEIsMEJBQWtCLG1CQUFtQixPQUFPO1lBQzVDLGNBQU0sT0FBTyxPQUFPO21CQUNqQjs7ZUFFUDs7O0lBRUosU0FBQyx1QkFBVTs7OztRQUVQLFNBQVMsS0FBQyxLQUFLLFVBQVUsV0FBVyxVQUFVLFFBQVE7YUFDdkM7O21CQUFaOztrQkFFSyxPQUFPLE9BQU8sUUFBUSxPQUFPLE1BQU0sTUFBMUMsWUFBRTs7eUJBQ0UsWUFBTzs7O0lBRWhCLFNBQUMscUJBQVEsTUFBSyxJQUFHOztRQUViLEtBQUMsS0FBSyxjQUFjLEtBQUsscUJBQXFCLEtBQUMsUUFBUSxLQUFLLHFCQUFxQixxQkFBcUIsdUJBQXVCLE9BQU8sS0FBSztl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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/fontmap.kode
