#!/bin/bash
cd /backend

if [ "$MODE" = "dev" ]; then
  echo "/!\\ Mode is set to DEV /!\\"
else
  echo "/!\\ Mode is set to PRODUCTION /!\\"
fi
echo "(i) Npm version is $(npm -v)"
echo "(i) Node version is $(node -v)"

echo
echo " ~"
echo " ~ Install dependencies"
echo " ~"
echo
npm install

export configuration="docker"

if [ "$MODE" = "dev" ]; then
  echo
  echo " ~"
  echo " ~ Starting"
  echo " ~"
  echo
  npm run serve

else
  echo
  echo " ~"
  echo " ~ Building the application"
  echo " ~"
  echo
  npm run build

  echo
  echo " ~"
  echo " ~ Run the server"
  echo " ~"
  echo
  node ./build/index.js
fi
