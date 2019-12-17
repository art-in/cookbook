server rebuilds are too slow

with basic actix-web example and single endpoint it takes ~15sec

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

https://github.com/actix/actix-web/issues/1180

solution: restart docker

---

actix-web auto-reload requires too much

1. install `systemfd` and `cargo-watch` crates
2. update source code (!) to restart server without losing socket
3. start with ugly CLI: `systemfd --no-pid -s http::0.0.0.0:8080 -- cargo watch -x run`

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