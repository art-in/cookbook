# move to root folder so all relative paths start from there
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH && cd ..

# start database service
service postgresql start

cargo run --release