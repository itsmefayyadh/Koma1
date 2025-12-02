@echo off
REM Monitor Cloud Build status
REM Perlu gcloud SDK terinstall

echo.
echo ================================
echo Cloud Build Status Monitor
echo ================================
echo.

:retry
echo Checking latest build status...
echo.

REM Get the latest build
for /f "tokens=*" %%i in ('gcloud builds list --limit=1 --format="table[no-heading](ID,STATUS,IMAGES)" 2^>nul') do (
    echo %%i
)

echo.
echo Waiting 10 seconds before next check...
echo.
timeout /t 10

goto retry
