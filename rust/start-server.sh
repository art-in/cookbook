# start database service
service postgresql start

# start server in watch mode
systemfd --no-pid -s http::0.0.0.0:8080 -- cargo watch -x run &
