$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$lib = Join-Path $root 'web\WEB-INF\lib'
New-Item -ItemType Directory -Force -Path $lib | Out-Null
$dependencies = @'
artifact,version,path
spring-aop,5.3.39,org/springframework/spring-aop
spring-beans,5.3.39,org/springframework/spring-beans
spring-context,5.3.39,org/springframework/spring-context
spring-core,5.3.39,org/springframework/spring-core
spring-expression,5.3.39,org/springframework/spring-expression
spring-jcl,5.3.39,org/springframework/spring-jcl
spring-jdbc,5.3.39,org/springframework/spring-jdbc
spring-tx,5.3.39,org/springframework/spring-tx
spring-web,5.3.39,org/springframework/spring-web
spring-webmvc,5.3.39,org/springframework/spring-webmvc
mybatis,3.5.19,org/mybatis/mybatis
mybatis-spring,2.1.2,org/mybatis/mybatis-spring
postgresql,42.7.8,org/postgresql/postgresql
checker-qual,3.49.5,org/checkerframework/checker-qual
jackson-annotations,2.17.3,com/fasterxml/jackson/core/jackson-annotations
jackson-core,2.17.3,com/fasterxml/jackson/core/jackson-core
jackson-databind,2.17.3,com/fasterxml/jackson/core/jackson-databind
'@ | ConvertFrom-Csv
foreach ($dep in $dependencies) {
    $name = '{0}-{1}.jar' -f $dep.artifact, $dep.version
    $url = 'https://repo.maven.apache.org/maven2/{0}/{1}/{2}' -f $dep.path, $dep.version, $name
    $target = Join-Path $lib $name
    $temporary = "$target.download"
    try {
        & curl.exe --fail --location --silent --show-error --output $temporary $url
        if ($LASTEXITCODE -ne 0) { throw "Download failed: $name" }
        $checksum = & curl.exe --fail --location --silent --show-error "$url.sha1"
        if ($LASTEXITCODE -ne 0) { throw "Checksum download failed: $name" }
        if ((Get-FileHash -LiteralPath $temporary -Algorithm SHA1).Hash -ine $checksum.Trim()) {
            throw "Checksum mismatch: $name"
        }
        Move-Item -LiteralPath $temporary -Destination $target -Force
        Write-Output "Ready: $name"
    } finally {
        if (Test-Path -LiteralPath $temporary) {
            Remove-Item -LiteralPath $temporary -Force
        }
    }
}
