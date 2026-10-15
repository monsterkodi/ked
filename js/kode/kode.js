var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

var args, file, js, kode, nfs, out, res, text

import slash from "../kxk/slash.js"
import karg from "../kxk/karg.js"

import lexer from "./lexer.js"
import print from "./print.js"
import parser from "./parser.js"
import scoper from "./scoper.js"
import stripol from "./stripol.js"
import returner from "./returner.js"
import operator from "./operator.js"
import renderer from "./renderer.js"

class Kode
{
    constructor (args)
    {
        this.args = args
    
        var _16_14_, _17_21_

        this.onError = this.onError.bind(this)
        this.args = ((_16_14_=this.args) != null ? _16_14_ : {})
        this.args.header = ((_17_21_=this.args.header) != null ? _17_21_ : true)
        this.version = '0.2.0'
        this.literals = ['bool','num','regex','single','double','triple']
        this.atoms = this.literals.concat(['var'])
        this.lexer = new lexer(this)
        this.parser = new parser(this)
        this.scoper = new scoper(this)
        this.stripol = new stripol(this)
        this.returner = new returner(this)
        this.operator = new operator(this)
        this.renderer = new renderer(this)
    }

    onError (msg, info)
    {
        var li, message

        message = this.file
        if (!_k_.empty(info))
        {
            if (!_k_.empty(info.tokens) && !_k_.empty(info.tokens[0]))
            {
                li = info.tokens[0].line
            }
            else if (!_k_.empty(info.tok))
            {
                li = info.tok.line
            }
            else if (!_k_.empty(info.line))
            {
                li = info.line
            }
            if (!_k_.empty(li))
            {
                message += `\n${li}: ` + this.text.split(/\r?\n/)[li - 1]
            }
        }
        message += "\n" + msg
        throw message
    }

    eval (text, file, glob)
    {
        var js

        if (_k_.empty(text))
        {
            return
        }
        try
        {
            js = this.compile(text,file)
            return eval(js)
        }
        catch (err)
        {
            console.log(js)
            console.error(err)
            throw err
        }
    }

    static compile (text, opt = {})
    {
        return (new Kode(opt)).compile(text)
    }

    compile (text, file, target)
    {
        this.text = text
        this.file = file
        this.target = target
    
        var ast, msg

        if (_k_.empty(_k_.trim(this.text)))
        {
            return ''
        }
        if (this.args.verbose)
        {
            console.log(this.text)
        }
        try
        {
            ast = this.ast(this.text)
            return this.renderer.render(ast,this.file,this.target)
        }
        catch (err)
        {
            msg = ""
            if (_k_.isStr(err))
            {
                msg += err
            }
            else
            {
                msg += "[internal kode compiler error]\n"
                if (!_k_.empty(err.stack))
                {
                    msg += err.stack
                }
                else
                {
                    msg += err.message
                }
                msg += "\n"
            }
            throw msg
        }
    }

    ast (text)
    {
        var ast, blocks, tokens

        tokens = this.lexer.tokenize(text)
        blocks = this.lexer.blockify(tokens)
        ast = this.parser.parse(blocks)
        ast = this.stripol.collect(ast)
        ast = this.scoper.collect(ast)
        ast = this.returner.collect(ast)
        return ast = this.operator.collect(ast)
    }

    astr (text, scopes)
    {
        return print.astr(this.ast(text),scopes)
    }
}

export default Kode;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    args = karg(`kode
    files       **
    eval        evaluate a string and print the result
    compile     transpile a string and print the result
    outdir      transpile files into output directory
    run         execute files                               = true
    js          print transpiled js code                    = false
    map         generate inline source maps                 = true
    header      prepend output with version header          = false -H
    verbose     log more                                    = false
    debug       debug output                                = false`)
    kode = new Kode(args)
    args = kode.args
    if (args.compile)
{
    console.log(kode.compile(args.compile))
    process.exit(0)
}
    if (args.eval)
{
    console.log(kode.eval(args.eval,'eval',global))
    process.exit(0)
}
    nfs = await import('../kxk/nfs.js')
    nfs = nfs.default
    var list = _k_.list(args.files)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    file = list[_a_]
    file = slash.absolute(slash.path(file),process.cwd())
    if (args.verbose)
    {
        console.log(gray(file))
    }
    text = await nfs.read(file)
    if (_k_.empty(text))
    {
        console.error(_k_.Y4(_k_.r2(`can't read ${_k_.R3(_k_.y5(file))}`)))
        continue
    }
    if (args.outdir)
    {
        out = slash.absolute(slash.swapExt(slash.path(args.outdir,slash.file(file)),'js'),process.cwd())
        if (args.verbose)
        {
            console.log(out)
        }
        js = kode.compile(text,file,out)
        res = await nfs.write(out,js)
        if ((res != null ? res.error : undefined))
        {
            console.error(_k_.R2(_k_.y3(`can't write ${_k_.R3(_k_.y6(out))}`)))
        }
    }
    else if (args.js)
    {
        console.log(kode.compile(text,file))
    }
    else if (args.run)
    {
        console.log(kode.eval(text,file,global))
    }
    else
    {
        console.log(kode.compile(text,file))
    }
}
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL2tvZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVRLEtBQUMsaUJBQUQsS0FBQztRQUNELEtBQUMsS0FBSyxtQkFBTixLQUFDLEtBQUssNEJBQVU7UUFDaEIsS0FBQyxVQUFXO1FBQ1osS0FBQyxZQUFZLE9BQU0sTUFBSyxRQUFPLFNBQVEsU0FBUTtRQUMvQyxLQUFDLFFBQVcsS0FBQyxTQUFTLFFBQVE7UUFFOUIsS0FBQyxZQUFlLE1BQVM7UUFDekIsS0FBQyxhQUFlLE9BQVM7UUFDekIsS0FBQyxhQUFlLE9BQVM7UUFDekIsS0FBQyxjQUFlLFFBQVM7UUFDekIsS0FBQyxlQUFlLFNBQVM7UUFDekIsS0FBQyxlQUFlLFNBQVM7UUFDekIsS0FBQyxlQUFlLFNBQVM7Ozs7Ozs7UUFXekIsVUFBVSxLQUFDO3VCQUNGOzsyQkFFSyxLQUFLLHNCQUFpQixLQUFLLE9BQU87O2dCQUNwQyxLQUFLLEtBQUssT0FBTyxHQUFHOztnQ0FDbEIsS0FBSzs7Z0JBQ1AsS0FBSyxLQUFLLElBQUk7O2dDQUNaLEtBQUs7O2dCQUNQLEtBQUssS0FBSzs7MkJBQ1Q7O2dCQUNMLGdCQUFnQixTQUFTLEtBQUMsS0FBSyxNQUFNLFNBQVMsS0FBRzs7O1FBRXpELFdBQVcsT0FBTztRQUNsQixNQUFNOzs7Ozs7O3NCQVVLOzs7Ozs7WUFHUCxLQUFLLEtBQUMsUUFBUSxLQUFLO21CQUNuQixLQUFLOztlQUNIOztZQUNGLFlBQUk7WUFDSixjQUFNO1lBQ04sTUFBTTs7Ozs7O29CQWNnQixLQUFLLE1BQU0sUUFBUTs7Ozs7Ozs7Ozs7K0JBSXpCLEtBQUM7O21CQUFsQjs7WUFFVSxLQUFDLEtBQUs7O1lBQW5CLFlBQUksS0FBQzs7OztZQUdELE1BQU0sS0FBQyxJQUFJLEtBQUM7bUJBQ1osS0FBQyxTQUFTLE9BQU8sSUFBSyxLQUFDLEtBQU0sS0FBQzs7ZUFDNUI7O1lBQ0YsTUFBTTswQkFDSDs7Z0JBRUMsT0FBTzs7OztnQkFFUCxPQUFPOytCQUNFLElBQUk7O29CQUNULE9BQU8sSUFBSTs7OztvQkFFWCxPQUFPLElBQUk7O2dCQUNmLE9BQU87O1lBQ1gsTUFBTTs7Ozs7Ozs7UUFZVixTQUFTLEtBQUMsTUFBTSxTQUFTO1FBQ3pCLFNBQVMsS0FBQyxNQUFNLFNBQVM7UUFFekIsTUFBTSxLQUFDLE9BQU8sTUFBTztRQUNyQixNQUFNLEtBQUMsUUFBUSxRQUFTO1FBQ3hCLE1BQU0sS0FBQyxPQUFPLFFBQVU7UUFDeEIsTUFBTSxLQUFDLFNBQVMsUUFBUTtlQUN4QixNQUFNLEtBQUMsU0FBUyxRQUFROzs7OztlQUVQLE1BQU0sS0FBSyxLQUFDLElBQUksTUFBTTs7OztlQUV4Qzs7O0lBR0gsT0FBTyxLQUFLOzs7Ozs7Ozs7OztJQWVaLFdBQVcsS0FBSztJQVFoQixPQUFPLEtBQUs7UUFFVCxLQUFLOztJQUNKLFlBQUksS0FBSyxRQUFRLEtBQUs7SUFDdEIsUUFBUSxLQUFLOztRQUVkLEtBQUs7O0lBQ0osWUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLE9BQU87SUFDL0IsUUFBUSxLQUFLOztJQUVqQixZQUFPLE9BQU87SUFDZCxNQUFNLElBQUk7d0JBRUUsS0FBSzs7OztJQUtiLE9BQU8sTUFBTSxTQUFTLE1BQU0sS0FBSyxNQUFPLFFBQVE7UUFDOUIsS0FBSzs7UUFBdkIsWUFBSSxLQUFLOztJQUVULGFBQVEsSUFBSSxLQUFLO2tCQUVSOztRQUFVLHdEQUFnQztRQUFZOztRQUczRCxLQUFLOztRQUNXLE1BQU0sTUFBTSxTQUFTLE1BQU0sUUFBUSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxPQUFPLE1BQU8sUUFBUTtZQUNoRixLQUFLOztZQUFoQixZQUFJOztRQUNKLEtBQU0sS0FBSyxRQUFRLEtBQU0sS0FBTTtRQUMvQixZQUFRLElBQUksTUFBTSxJQUFJO2FBQ25CLGNBQUEsSUFBSzs7WUFBVyx5REFBaUM7OzthQUNwRSxLQUFLOztRQUFXLFlBQUksS0FBSyxRQUFRLEtBQUs7O2FBQ3RDLEtBQUs7O1FBQVcsWUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLOzs7O1FBQ3hCLFlBQUksS0FBSyxRQUFRLEtBQUsifQ==
//# sourceURL=file://kode/kode/kode.kode
