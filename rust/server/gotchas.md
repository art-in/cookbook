server rebuilds are too slow

for basic actix-web example with single endpoint it takes ~15sec,  
and for completed REST API server it takes ~35sec

---

typechecking with RLS in vscode is slow

after each source code change it takes ~4sec

---

cargo warns on builds sometimes

`warning: Error finalizing incremental compilation session directory`

https://github.com/rust-lang/rust/issues/62031

---

cargo fails on rebuilds sometimes

`error: failed to link or copy`  
`error: unable to copy <...> No such file or directory (os error 2)`

```
[Running 'cargo run']
   Compiling server v0.1.0 (/workspaces/cookbook/rust/server)
error: unable to copy /workspaces/cookbook/rust/target/debug/incremental/server-vr9l6c56dd5r/s-fivs35fi87-1j19rqk-working/24q9aggu6j5p0j1o.o to /workspaces/cookbook/rust/target/debug/deps/server-2e8bb0725aec4b50.24q9aggu6j5p0j1o.rcgu.o: No such file or directory (os error 2)

error: aborting due to previous error

error: could not compile `server`.

To learn more, run the command again with --verbose.
[Finished running. Exit status: 101]
```

https://github.com/actix/actix-web/issues/1180

solution: restart docker

---

cargo cannot install several versions of same package

eg. trying to install `reqwest` which depends on `tokio`, but there's also
`actix-web` already installed which also depends on `tokio`:

```
error: failed to select a version for `tokio`.
    ... required by package `reqwest v0.10.0-alpha.2`
    ... which is depended on by `server v0.1.0 (/workspaces/cookbook/rust/server)`
versions that meet the requirements `= 0.2.0-alpha.6` are: 0.2.0-alpha.6

all possible versions conflict with previously selected packages.

  previously selected package `tokio v0.2.4`
    ... which is depended on by `actix-rt v1.0.0`
    ... which is depended on by `actix-web v2.0.0-alpha.6`
    ... which is depended on by `server v0.1.0 (/workspaces/cookbook/rust/server)`

failed to select a version for `tokio` which could resolve this conflict
```

it happens even across different packages of same workspace

https://stackoverflow.com/questions/59399723/how-to-have-multiple-versions-of-the-same-indirect-dependency

---

cargo-watch does not detect changes sometimes

probably related to in-docker use (win host, hyper-v vm, fs bindings)

solution: using polling (`cargo-watch --poll`)

---

actix-web auto-reload requires too much setup

1. install `systemfd` and `cargo-watch` crates
2. update source code (!) to restart server without losing socket
3. start with ugly CLI: `systemfd --no-pid -s http::0.0.0.0:8080 -- cargo watch -x run`

---

actix-web truncates response when using brotli compression

https://github.com/actix/actix-web/issues/1224

---

diesel requires to write migrations in raw SQL

"Writing database agnostic code is an explicit non-goal of the project." (c) sgrif
https://github.com/diesel-rs/diesel/issues/1397#issuecomment-352205250

---

diesel not allowing to configure location of migrations folder

will be fixed in next version (fixed in repo already)

---

failing on manual restarts because of busy port

`error: EADDRINUSE: Address already in use`

but there's no processes blocking port as per `lsof -t -i:8080`

---

diesel does not have async API (nor has underlying postgres driver)

each database query blocks current thread  
even if we start actix-web server on thread pool of (cpu cores) size, blocked thread will make one of cores idle

https://github.com/diesel-rs/diesel/issues/399  
https://github.com/fairingrey/actix-realworld-example-app/issues/18

solution: wrap blocking calls into `actix_web::web::block` to execute them on thread pool (of size 5 * cpu_num)

---

diesel does not support logging

https://github.com/diesel-rs/diesel/issues/150

---

diesel query building code is ugly

eg. trying to conditionally order by a column based on a dynamic parameter (sort property / direction)
https://stackoverflow.com/questions/59291037/how-do-i-conditionally-order-by-a-column-based-on-a-dynamic-parameter-with-diese

---

ORM has separate querying DSL

eg. diesel requires you to know DSL which loosely mapped to actual SQL queries
https://docs.diesel.rs/diesel/query_dsl/trait.QueryDsl.html