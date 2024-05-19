
$content = 'GIT_REPO=https://github.com/etupdt/ecf-garage-front.git --branch feature/security' + "`n`r"
$content += 'BUILD_OPTIONS=--no-cache' + "`n`r"
# $content += 'ENV=development'
$content += 'ENV=production'

Set-Content C:\Temp\deploy $content

scp 'C:\Temp\deploy' 'admin@nasts2311:/share/Web/docker/Applications/ecf-garage-front/'
