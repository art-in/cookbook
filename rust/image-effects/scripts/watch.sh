# move to root folder so all relative paths start from there
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH && cd ..

cargo watch --poll -i .gitignore -i "pkg/*" -s "./scripts/build.sh"