#!/bin/bash
set -e
echo "Running deploy script"

echo "Building"
npm run build

echo "Copying Files"
files=("./build" "./package.json" "./server.*")
for file in "${files[@]}"; do
  rsync -avze "ssh" ${file} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
done

echo "Running Remote Script"
ssh ${REMOTE_USER}@${REMOTE_HOST} ${DEV_RESTART_COMMAND}
