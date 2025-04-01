#!/bin/bash
set -e
echo "Running deploy script"
echo $DH_SSH_KEY >.key
chmod 600 .key

echo "Building"
npm run build

echo "Copying Files"
files=("./build", "./package.json", "./server.*", "./run.sh")
for file in "${files}"; do
  rsync -avze "ssh -o StrictHostKeyChecking=no -i .key" "$file" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
done

echo "Installing NPM Packages"
ssh -o StrictHostKeyChecking=no -i .key ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH}; npm install"
