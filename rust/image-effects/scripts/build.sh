# move to root folder so all relative paths start from there
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH && cd ..

# profiles: dev / release / profiling
# targets: bundler / nodejs / web / no-modules
wasm-pack build --release