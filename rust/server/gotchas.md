server rebuilds too long

with basic actix-web example and single endpoint it takes ~15sec

---


cargo warns on builds sometimes

`warning: Error finalizing incremental compilation session directory`

https://github.com/rust-lang/rust/issues/62031

---

cargo fails on rebuilds sometimes

https://github.com/actix/actix-web/issues/1180

---

actix-web auto-reload requires too much

1. install `systemfd` and `cargo-watch` crates
2. update source code (!) to restart server without losing socket
3. start with ugly CLI: `systemfd --no-pid -s http::0.0.0.0:8080 -- cargo watch -x run`

---

diesel requires to write migrations in raw SQL