#!/bin/bash
set -e
echo "Running deploy script"

echo "Building"
npm run build

echo "Copying Files"
files=("./build" "./package.json" "./server.*" "./run.sh")
for file in "${files}"; do
  rsync -avze "ssh" ${file} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
done

echo "Running Remote Script"
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH}; chmod +x run.sh; ./run.sh" &
