#!/bin/bash

# Navigate to the android directory
cd android

# Clean the build
./gradlew clean

# Navigate back to the root directory
cd ..

# Remove node_modules and reinstall dependencies
rm -rf node_modules
npm install

# Rebuild the project
npm run android
