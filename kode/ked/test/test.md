# tests

## how tests are run here

- **Several test runs share the machine at the same time.** A `kk -w` is
  usually running all the time: it transpiles and tests every change, and it is
  also how agents working on ked are watched. On top of that, agents and manual
  runs use `kk -t`. Every test must pass while other `kk -t` / `kk -w`
  processes are compiling and testing the same checkout.
- `kk -t` transpiles what changed, then runs all tests. `kk -t <module>` runs one
  module (`kode` `kxk` `kolor` `ked` `konrad`), and `kk -t plain` prints only
  the failures.
- Tests live in `kode/<module>/test/*.kode`. `js/` is generated: never edit a
  test there.

## tests first

1. Write or change the tests.
2. Run them and check that they **fail**, and fail for the expected reason.
3. Then do the implementation, and run the tests again until they pass.

## how tests read

- **No comments in tests.** The `▸` section name and the cases are the
  documentation. Explain the reasons in the chat or in the commit message.
- **Setup must not hide the cases.** Put harness, editor and fixture setup in
  small helpers at the top of the file, and extend the existing ones instead of
  duplicating them.
- Don't open a new section just to repeat the same setup: add the cases to the
  section that already has that fixture.
- **Short, topical section names**: `sheet cursor`, not a sentence.
- **Compact cases**, one per line: `key 'down' ; mc() ▸ [2 2]`.
- Plain prose lines in a `▸` file are parsed as code (a word like `do` breaks
  it), which is one more reason for no comments.
- **Visual changes** are also checked with a headless dump (`bin/ked -H file`,
  keys piped on stdin), not only with unit tests: the unit-test harness has no
  text sizing.

## file handling in tests

- **Get every scratch path from `testdir`** (`kode/kxk/testdir.kode`):

  ```kode
  use ../../kxk ◆ testdir          # from kode/ked/test (kxk tests: use .. ◆ testdir)

  root = testdir 'ked-index-foo'   # below a mkdtemp root, unique per process
  tmp  = testdir()                 # the root itself
  ```

  The root is created with `mkdtemp` on first use, and removed when the process
  exits. The returned path is not created: set it up the way the test needs.
- **Never hardcode a scratch path**: no `/tmp/…`, `~/tmp/…` or `/tmp/opencode/…`.
  `Date.now()` is not unique enough either.
- **When a test must use a particular place** (the trash code treats `/tmp`,
  `~/tmp` and the trash folder differently), pass that place as the base:
  `testdir 'name' slash.path(slash.home() 'tmp')`. For a name in a folder that
  every process shares (like `~/.local/share/Trash/files`), build it from
  `testdir.id()`.
- **Never write into the checkout**: not `kode/`, not `js/`, and not the cwd.
  If a test needs real files from the repo, it copies them into a `testdir`
  and works on the copy. The fingerprint test in `konrad/test/knrd.kode` copies
  the compiler and probes the copy. Code under test that works on a fixed place
  gets that place as an optional argument, for example
  `knrd.fingerprint(root)`.
- **Use paths straight from `testdir`, not from values a test computes.** If an
  earlier step fails, a computed path can be `undefined`, and then it quietly
  becomes relative to the repo.
- **Watching:** a test watches only its own `testdir`, never the repo,
  `kode/`, `js/` or the cwd. Otherwise it gets the file events of every other
  build that is running. Close the watchers before the test ends
  (`watcher.close()`). Keep event filters tight, so that only the files the
  test created count.
- **Sessions:** use the fake `ked_session` (`ked_sess()` in the test files). A
  real session dir is shared by every ked on the machine. If a test needs a
  real session on disk, point `s.dir` into a `testdir`.
- **Global stubs** like `post.emit = …` or `console.log = …` must be put back
  even when the test throws. Otherwise every later test in the run fails too,
  which hides the one real failure. Restore them in a `try` / `finally`, or put
  them back before the first assertion that can throw.

## checking parallel runs

Run a module several times at once, and compare with a single run:

```sh
out=$(mktemp -d)
for i in 1 2 3 4; do ./kk -t konrad plain > $out/$i.txt 2>&1 & done; wait
grep -c ✘ $out/*.txt
```
