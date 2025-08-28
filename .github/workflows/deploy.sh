#!/bin/bash
set -e
echo "Running deploy script"

REMOTE_PATH=$([ "$BRANCH" == "main" ] && echo $REMOTE_PATH_PROD || echo $REMOTE_PATH_DEV)
RESTART_COMMAND=$([ "$BRANCH" == "main" ] && echo $PROD_RESTART_COMMAND || echo $DEV_RESTART_COMMAND)

if [ $BRANCH = "main" ]; then
  export NODE_ENV="production"
else
  export NODE_ENV="develop"
fi

echo "Building"
npm run build

echo "Copying Files"
files=("./build" "./package.json" "./server.*" "./server" "./node_modules")
for file in "${files[@]}"; do
  rsync -avze "ssh" ${file} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
done

echo "Running Remote Script"
ssh ${REMOTE_USER}@${REMOTE_HOST} ${RESTART_COMMAND}
