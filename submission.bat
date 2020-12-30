echo off

Echo zipping...

del submission.zip

echo F|xcopy README.pdf documentation.pdf
echo F|xcopy all.sql all.mysql

"C:\Program Files\7-Zip\7z.exe" a -tzip ".\submission.zip" "..\mid-term\"
"C:\Program Files\7-Zip\7z.exe" a -tzip ".\submission.zip" "all.mysql"
"C:\Program Files\7-Zip\7z.exe" a -tzip ".\submission.zip" "documentation.pdf"
"C:\Program Files\7-Zip\7z.exe" a -tzip ".\submission.zip" "source.txt"

"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\all.sql"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\documentation.pdf"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\source.txt"

"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\all.mysql"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\submission.*" -r
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\README.*" -r

"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\.git\"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\.DS_Store"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\.env"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\.gitignore"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\Procfile"
"C:\Program Files\7-Zip\7z.exe" d ".\submission.zip" "mid-term\README-imgs\"

del documentation.pdf
del all.mysql

echo Done!