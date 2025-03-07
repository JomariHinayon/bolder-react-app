@echo off

REM Navigate to the android directory
cd android

REM Clean the build
gradlew clean

REM Navigate back to the root directory
cd ..

REM Remove node_modules and reinstall dependencies
rd /s /q node_modules
npm install

REM Rebuild the project
npm run android
