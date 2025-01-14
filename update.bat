@echo off
echo Updating public site...

:: Add all changes
git add .

:: Get commit message
set /p commit_message=Enter commit message (press Enter for default): 
if "%commit_message%"=="" set commit_message=Update site content

:: Commit and push changes
git commit -m "%commit_message%"
git push origin main

:: Update gh-pages
git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main

echo.
echo Changes pushed successfully!
echo Note: It might take a few minutes for changes to be visible.
pause
