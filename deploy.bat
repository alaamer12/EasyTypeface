@echo off
echo Initializing public repository...

:: Check if Git is already initialized
if exist .git (
    echo Git is already initialized in this directory.
) else (
    :: Initialize git
    git init
    echo Git initialized successfully.
)

:: Add all files
git add .

:: Initial commit
git commit -m "Initial commit" || echo Initial commit skipped (perhaps there were no changes).

:: Create GitHub repository and push
echo Enter your GitHub username:
set /p username=
echo Enter your project name [will be displayed in the URL]:
set /p project_name=

:: Create and push to GitHub
gh repo create %username%/%project_name% --public --source=. --remote=origin --push

:: Setup GitHub Pages
git checkout -b gh-pages
git push origin gh-pages

echo.
echo Public site created successfully!
echo Your site will be available at: https://%username%.github.io/%project_name%
echo Note: It might take a few minutes for the site to be accessible.
pause
