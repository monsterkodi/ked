var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var parseStatus, report

import kxk from "../kxk.js"
let pretty = kxk.pretty
let slash = kxk.slash

import kolor from "../kolor/kolor.js"
let klor = kolor.klor

import child_process from "child_process"


report = async function (status, opt = {})
{
    var b, c, change, changes, cmd, diff, gitFile, gitPath, k, l, lame, ls, m, prfx, relPath, res, rgs, split, start

    changes = []
    for (gitFile in status.files)
    {
        k = status.files[gitFile]
        relPath = slash.relative(gitFile,process.cwd())
        l = {deleted:r1,created:w2,changed:g1}
        m = {deleted:r4,created:w5,changed:g4}
        b = {deleted:R5,created:W1,changed:G1}
        if (_k_.in(k,Object.keys(m)))
        {
            prfx = b[k]("  ")
            prfx += reset('  ')
            lame = _k_.in(slash.ext(gitFile),['js','json'])
            change = prfx + pretty.filePath(relPath,(lame && l[k] || m[k]))
            if (_k_.in(k,['changed','created']) && opt.diff)
            {
                if (lame)
                {
                    continue
                }
                cmd = `git --no-pager diff -U0  --ignore-blank-lines --ignore-space-at-eol --no-color ${gitFile}`
                res = child_process.execSync(cmd,{encoding:'utf8',cwd:status.gitDir})
                diff = ""
                c = _k_.w2('●')
                start = 0
                var list = _k_.list(res.split(/\r?\n/))
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    ls = list[_a_]
                    if (_k_.in(ls.substr(0,4),['+++ ','--- ']))
                    {
                    }
                    else if (ls[0] === '@')
                    {
                        split = ls.split('@@')
                        split = split[1].split(' +')
                        split = split[1].split(',')
                        start = parseInt(split[0])
                        diff += "\n" + c
                        c = _k_.w2('●')
                    }
                    else if (ls[0] === '+')
                    {
                        diff += "\n "
                        start++
                        rgs = kolor.ranges(ls.substr(1),slash.ext(gitFile))
                        if (!_k_.empty(rgs))
                        {
                            diff += pretty.ranges(rgs)
                        }
                        else
                        {
                            diff += _k_.w8(ls.substr(1))
                        }
                    }
                    else if (ls[0] === '-')
                    {
                        diff += "\n " + _k_.w3(ls.substr(1))
                    }
                }
                if (diff.length)
                {
                    change += diff + "\n" + _k_.w2('●')
                }
            }
            changes.push(change)
        }
    }
    relPath = slash.relative(status.gitDir,process.cwd())
    if (relPath === '')
    {
        relPath = '.'
    }
    gitPath = pretty.filePath(relPath,klor.w5)
    console.log(_k_.B5('    ' + gitPath + ' ') + ' ')
    var list1 = _k_.list(changes)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        c = list1[_b_]
        console.log(c)
    }
}

parseStatus = function (gitStatus, gitDir)
{
    var dirSet, file, key, line, lines, list, rel, status

    lines = gitStatus.split('\n')
    status = {gitDir:gitDir,deleted:[],created:[],changed:[],files:{}}
    dirSet = new Set
    while (line = lines.shift())
    {
        rel = line.slice(3)
        file = slash.path(gitDir,line.slice(3))
        while ((rel = slash.dir(rel)) !== '')
        {
            dirSet.add(rel)
        }
        switch (line.slice(0,2))
        {
            case ' D':
                status.deleted.push(file)
                break
            case 'MM':
            case ' M':
                status.changed.push(file)
                break
            case '??':
                status.created.push(file)
                break
        }

    }
    status.dirs = Array.from(dirSet).map(function (d)
    {
        return slash.path(gitDir,d)
    })
    list = ['deleted','created','changed']
    var list1 = _k_.list(list)
    for (var _c_ = 0; _c_ < list1.length; _c_++)
    {
        key = list1[_c_]
        var list2 = _k_.list(status[key])
        for (var _d_ = 0; _d_ < list2.length; _d_++)
        {
            file = list2[_d_]
            status.files[file] = key
        }
    }
    return status
}
export default async function (opt = {})
{
    return new Promise(function (resolve, reject)
    {
        var shopt

        shopt = {shell:true}
        return child_process.exec('git rev-parse --show-toplevel',shopt,function (err, gitDir, stderr)
        {
            if (err)
            {
                return resolve()
            }
            else if (!_k_.empty(gitDir))
            {
                gitDir = _k_.trim(gitDir,' \n')
                return child_process.exec('/usr/bin/git status --porcelain',shopt,function (err, status, stderr)
                {
                    if (err)
                    {
                        console.error('ERROR',err)
                        return reject()
                    }
                    else if (!_k_.empty(status))
                    {
                        report(parseStatus(status,gitDir),opt)
                        return resolve()
                    }
                })
            }
        })
    })
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvbnJhZC9zdGF0dXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFrQkE7Ozs7SUFFSTtvQkFFaUIsT0FBTzs7WUFBUCxPQUFPO1FBRXBCLFVBQVUsTUFBTSxTQUFTLFFBQVEsUUFBUTtRQUV6QyxLQUFLLFFBQVEsR0FBRyxRQUFRLEdBQUcsUUFBUTtRQUNuQyxLQUFLLFFBQVEsR0FBRyxRQUFRLEdBQUcsUUFBUTtRQUNuQyxLQUFLLFFBQVEsR0FBRyxRQUFRLEdBQUcsUUFBUTttQkFFaEMsRUFBSyxPQUFPLEtBQUs7O1lBRWhCLE9BQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUyxNQUFNO1lBQ2YsY0FBUyxNQUFNLElBQUksVUFBYSxLQUFLO1lBQ3JDLFNBQVMsT0FBTyxPQUFPLFNBQVMsU0FBVSxRQUFTLEVBQUUsTUFBTSxFQUFFO3VCQUUxRCxHQUFNLFVBQVUsZUFBZSxJQUFJOztvQkFFdEI7O29CQUFaOztnQkFFQSx3RkFBd0Y7Z0JBQ3hGLE1BQU0sY0FBYyxTQUFTLEtBQUssU0FBUyxPQUFPLElBQUksT0FBTztnQkFDN0QsT0FBTztnQkFDUCxXQUFPO2dCQUNQLFFBQVE7b0NBRUUsSUFBSSxNQUFNOzs7OytCQUdaLEdBQUcsT0FBTyxFQUFFLElBQU8sT0FBTzs7OzZCQUUxQixHQUFHLE9BQU07O3dCQUVMLFFBQVEsR0FBRyxNQUFNO3dCQUNqQixRQUFRLE1BQU0sR0FBRyxNQUFNO3dCQUN2QixRQUFRLE1BQU0sR0FBRyxNQUFNO3dCQUN2QixRQUFRLFNBQVMsTUFBTTt3QkFDdkIsUUFBUSxPQUFPO3dCQUNmLFdBQU87OzZCQUVYLEdBQUcsT0FBTTs7d0JBRUwsUUFBUTt3QkFDUjt3QkFDQSxNQUFNLE1BQU0sT0FBTyxHQUFHLE9BQU8sR0FBSSxNQUFNLElBQUk7dUNBQ2xDOzs0QkFDTCxRQUFRLE9BQU8sT0FBTzs7Ozs0QkFFdEIsZUFBVyxHQUFHLE9BQU87Ozs2QkFFN0IsR0FBRyxPQUFNOzt3QkFFTCxRQUFRLGVBQVcsR0FBRyxPQUFPOzs7b0JBRXRDLEtBQUs7O29CQUFTLFVBQVUsT0FBTyxjQUFVOzs7WUFFaEQsUUFBUSxLQUFLOzs7SUFFckIsVUFBVSxNQUFNLFNBQVMsT0FBTyxPQUFRLFFBQVE7UUFDL0IsWUFBVzs7UUFBNUIsVUFBVTs7SUFDVixVQUFVLE9BQU8sU0FBUyxRQUFTLEtBQUs7SUFjeEMsbUJBQU8sU0FBUyxVQUFVLE9BQU87eUJBQ3hCOzs7O1FBQ0wsWUFBSTs7OztBQVFaOzs7O0lBRUksUUFBUSxVQUFVLE1BQU07SUFDeEIsVUFDSSxPQUFTLE9BQ1QsV0FDQSxXQUNBLFdBQ0E7SUFFSixhQUFhO1dBRVAsT0FBTyxNQUFNOztRQUVmLE1BQU0sS0FBSyxNQUFNO1FBQ2pCLE9BQU8sTUFBTSxLQUFLLE9BQVEsS0FBSyxNQUFNO2dCQUM5QixNQUFNLE1BQU0sSUFBSSxVQUFTOztZQUM1QixPQUFPLElBQUk7O2dCQUVSLEtBQUssTUFBTSxFQUFFOztpQkFDaEI7Z0JBQVEsT0FBTyxRQUFRLEtBQUs7O2lCQUM1QjtpQkFDQTtnQkFBUSxPQUFPLFFBQVEsS0FBSzs7aUJBQzVCO2dCQUFRLE9BQU8sUUFBUSxLQUFLOzs7OztJQUVwQyxPQUFPLE9BQU8sTUFBTSxLQUFLLFFBQVE7O2VBQVcsTUFBTSxLQUFLLE9BQU87O0lBQzlELFFBQVEsVUFBVSxVQUFVO3lCQUVqQjs7Ozs2QkFDSyxPQUFPOzs7O1lBQ2YsT0FBTyxNQUFNLFFBQVE7OztXQUU3Qjs7OztlQVVJOzs7O1FBRUEsU0FBUSxNQUFNO2VBQ2QsY0FBYyxLQUFLLGdDQUFnQzs7Z0JBRTVDOzt1QkFHRzs7Z0NBRVE7O2dCQUVWLGtCQUFjLE9BQU87dUJBRXJCLGNBQWMsS0FBSyxrQ0FBa0M7O3dCQUU5Qzs7d0JBQ0MsY0FBTSxRQUFROytCQUNaOzt3Q0FFUTs7d0JBRVYsT0FBTyxZQUFZLE9BQU8sUUFBUTsrQkFFaEMifQ==
//# sourceURL=file://kode/konrad/status.kode
