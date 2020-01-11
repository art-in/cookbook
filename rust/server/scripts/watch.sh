# move to root folder so all relative paths start from there
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH && cd ..

# start database service
service postgresql start

# start server in watch mode
systemfd --no-pid -s http::0.0.0.0:8080 -- cargo watch --poll -x run
