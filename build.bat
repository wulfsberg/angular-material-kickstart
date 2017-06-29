@rem yarn
call npm run build
@IF %ERRORLEVEL% NEQ 0 GOTO error
call mvn clean package
@IF %ERRORLEVEL% NEQ 0 GOTO error
GOTO success

:error
@echo Build failed. See above for errors.
@EXIT /B %ERRORLEVEL%

:success
@echo Build complete.
