<#
Task: Create an small automated test suite using Cypress/Playwright/Selenium/ElasticProject. It should utilize this powershell script. The repository should have the following:
    1. A test that validates the content from the home page displayed when accessing http://localhost:3000
	    - At least 1 test case is needed.
    2. Update this script to include running your test.
    3. Github workflow that runs this script 
    4. Github workflow must be executable on GH and should output an html report of the results.
Notes: 
    1. DON'T BE AFRAID TO ASK.
	2. Googling is allowed. 
    3. Show everything you're doing in the screen.
    4. Using of AI is not allowed. [I'm here to assess you, not chatgpt. You can use AI when you get hired :)]
    5. It's a plus if you decide to use a testing framework that you're least familiar with.
#>
 

param (
    [int]$Workers = 2,
    [int]$Retries = 1
)

$projectRoot = (Get-Item $PSScriptRoot).parent.FullName
$sampleAppPath = "$projectRoot/sample/nextjs-app"
$url="http://localhost:3000"
#Create Sitecore JSS application
npx --yes create-sitecore-jss --templates nextjs,nextjs-styleguide --fetchWith REST --destination $sampleAppPath --yes

# Verify that the nextjs-app directory exists
if (Test-Path $sampleAppPath) {
    Write-Host "The directory $sampleAppPath exists."
} else {
    Write-Host "The directory $sampleAppPath does not exist"
}

# Print out all the files and folders at the root level of the directory
Write-Host "Listing all files and folders in ${sampleAppPath}:"
Get-ChildItem -Path $sampleAppPath | ForEach-Object {
    Write-Host $_.FullName
}

try {
    #Run the Sitecore JSS app in Disconnected mode. This will spin up the SUT in http://localhost:3000
    Write-Host "Running the Next.js Application in Disconnected mode..."
    $job = Start-Job -Name "RenderingHostJob_Disconnected" -InputObject $sampleAppPath -ScriptBlock {
        param ($input)
        Set-Location $input
        $startOutput = npm run start 2>&1 | Out-String
        return $startOutput
    }

    #Verify Site Availability
    $intervalSec=10
    $retries=10
    $originalRetryCount = $retries
    $client = New-Object System.Net.WebClient
    do { Start-Sleep -Seconds $intervalSec; $retries-- } 
    until (
        $(try { Write-Host "[$($originalRetryCount - $retries)] Requesting: $url"
            $response = $client.DownloadString("$url")
            Write-Host "Response code: OK"
            $null -ne $response
        } catch [System.Net.WebException] { 
            Write-Host "A web exception was caught (waiting for another $intervalSec sec.): $($_.Exception.Message)"
        }) -or $retries -lt 1
    )

    # Retrieve and print the output of the npm run start command
    $jobOutput = Receive-Job -Job $job -Keep
    Write-Host "npm run start output:"
    Write-Host $jobOutput

    #Run tests here
    Write-Output "Current Directory: $(Get-Location)"
    npm install
    npx playwright install --with-deps
    npx playwright test --workers=$Workers --retries=$Retries

    #Failed the pipeline if there are tests failed
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Tests failed"
        exit 1
    }
}
finally {
    # Clean up any background jobs and node processes
    Write-Host "Removing Job $job.ID ..."
    Stop-Job -Id $job.ID
    Remove-Job -Id $job.ID -Force         
    npx --yes kill-port 3000
}