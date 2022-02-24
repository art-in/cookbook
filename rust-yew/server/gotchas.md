`diesel` (and `diesel_async`) doesn't support postgres pipelining  
https://github.com/weiznich/diesel_async/discussions/4

pipelining allows to reuse same database connection for multiple queries
simultaneously.  
https://docs.rs/tokio-postgres/latest/tokio_postgres/#pipelining

pipelining is the main feature that allows actix-web to be on top of http
server performance benchmark chart for several years now.  
https://www.techempower.com/benchmarks/  
https://habr.com/ru/post/485452/

so in this project i'm using `diesel` ORM for running migrations only, so
i don't need to setup db schema with all needed tables manually on each db
reset. and all other queries serving api requests are run directly with
`tokio-postgres` client, which supports pipelining.  

ORM with connection pool is less performant approach (per same benchmark),
but still better code-complexity wise, since with ORM you don't need to
construct SQL queries manually, prepare statements separately AOT, map rows
to model structs, etc.

i think in production project i would still use ORM with connection pool
approach, unless peak performance is really necessary.

hopefully `diesel` or any other rust ORM will support pipelining someday.

---

SQL doesn't allow using query parameters as identifiers (eg. column names)  

eg. impossible to prepare select-query ordered by parameterized column:   

```sql
SELECT * FROM recipes ORDER BY $1
```  

query cannot be prepared AOT and should be constructed manually in place

https://stackoverflow.com/questions/67506420/access-column-using-variable-instead-of-explicit-column-name  
https://stackoverflow.com/questions/57539838/rust-postgres-execute-how-to-pass-table-name-as-a-variable

---

`tokio_postgres` doesn't provide distinct types of errors  
https://github.com/sfackler/rust-postgres/issues/790

eg. when GET /api/recipes request handler encounters "column doesn't exist"
db-error i want to respond with status code 400 since it's client fault to pass
unknown sort prop, and respond with 500 for pretty much everything else (eg.
invalid SQL statement, connection error, etc.)
