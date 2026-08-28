@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "SOURCE=C:\Users\ROG\Documents\Codex\2026-06-08\quiero-crear-una-p-gina-web\outputs\betta-bcn"
set "DEST=C:\Users\ROG\Documents\betta-bcn-github"

echo.
echo ========================================
echo   Publicar Betta BCN
echo ========================================
echo.

if not exist "%SOURCE%\" (
  echo ERROR: No existe la carpeta de trabajo:
  echo %SOURCE%
  pause
  exit /b 1
)

if not exist "%DEST%\.git\" (
  echo ERROR: No existe el repositorio GitHub o no contiene .git:
  echo %DEST%
  pause
  exit /b 1
)

echo Copiando archivos desde:
echo %SOURCE%
echo.
echo Hacia:
echo %DEST%
echo.

for %%F in (datos.js app.js estilos.css index.html) do (
  if not exist "%SOURCE%\%%F" (
    echo ERROR: Falta el archivo obligatorio %%F en la carpeta de trabajo.
    pause
    exit /b 1
  )

  copy /Y "%SOURCE%\%%F" "%DEST%\%%F" >nul
  if errorlevel 1 (
    echo ERROR: No se pudo copiar %%F.
    pause
    exit /b 1
  )
)

if exist "%SOURCE%\README.md" (
  copy /Y "%SOURCE%\README.md" "%DEST%\README.md" >nul
  if errorlevel 1 (
    echo ERROR: No se pudo copiar README.md.
    pause
    exit /b 1
  )
)

call :copiar_carpeta "imagenes"
if errorlevel 1 exit /b 1

call :copiar_carpeta "videos"
if errorlevel 1 exit /b 1

cd /d "%DEST%"
if errorlevel 1 (
  echo ERROR: No se pudo entrar en el repositorio GitHub.
  pause
  exit /b 1
)

echo.
echo Preparando cambios en Git...
git add .
if errorlevel 1 (
  echo ERROR: git add falló.
  pause
  exit /b 1
)

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo No hay cambios para publicar.
  pause
  exit /b 0
)

for /f "tokens=1-4 delims=/ " %%A in ("%date%") do set "FECHA=%%A-%%B-%%C-%%D"
set "HORA=%time: =0%"
set "HORA=%HORA::=-%"
set "HORA=%HORA:~0,8%"

echo.
echo Creando commit...
git commit -m "Actualizar Betta BCN %FECHA% %HORA%"
if errorlevel 1 (
  echo ERROR: git commit falló.
  pause
  exit /b 1
)

echo.
echo Subiendo a GitHub...
git push origin main
if errorlevel 1 (
  echo.
  echo ERROR: git push falló. No se ha publicado en GitHub.
  pause
  exit /b 1
)

echo.
echo SUCCESS: Betta BCN publicado correctamente en GitHub.
pause
exit /b 0

:copiar_carpeta
set "CARPETA=%~1"

if not exist "%SOURCE%\%CARPETA%\" (
  echo ERROR: Falta la carpeta obligatoria %CARPETA% en la carpeta de trabajo.
  pause
  exit /b 1
)

if not exist "%DEST%\%CARPETA%\" mkdir "%DEST%\%CARPETA%"

robocopy "%SOURCE%\%CARPETA%" "%DEST%\%CARPETA%" /MIR /NFL /NDL /NJH /NJS /NC /NS /NP >nul
set "ROBOCOPY_EXIT=!ERRORLEVEL!"

if !ROBOCOPY_EXIT! GEQ 8 (
  echo ERROR: No se pudo copiar la carpeta %CARPETA%.
  pause
  exit /b 1
)

exit /b 0
