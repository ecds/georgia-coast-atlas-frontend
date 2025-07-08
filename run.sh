#!/bin/bash
set -e
source ~/.bash_profile
echo "Installing NPM Packages"
npm install

echo "Stopping previous process"
PID=$(head -n 1 pid)
kill ${PID}

echo "Start App"
nohup npm run start &
echo $! >pid
exit
