# check if lore folder exists

echo "Compiling branch $1..."
echo "Checking if lore folder exists... you will need access to webaverse/lore for this to work"

# if it doesn't, clone it
# if it does, reset and pull it
if [ ! -d "lore" ]; then
    git clone https://github.com/webaverse/lore
    cd lore
else
    cd lore
    git reset --hard
    git pull
fi

echo "Synced lore folder"

# get the first arg passed to this script
# this is the branch name
branch=$1

# checkout branch
git checkout $branch

cd ..

node format-training-data-local.js ./lore/datasets