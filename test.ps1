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
 
$projectRoot = (Get-Item $PSScriptRoot).parent.FullName
$sampleAppPath = "$projectRoot/sample/nextjs-app"
$url="http://localhost:3000"
 
 
#Create Sitecore JSS application
npx --yes create-sitecore-jss --templates nextjs,nextjs-styleguide --fetchWith REST --destination $sampleAppPath --yes
try {
    #Run the Sitecore JSS app in Disconnected mode. This will spin up the SUT in http://localhost:3000
    Write-Host "Running the Next.js Application in Disconnected mode..."
    $job = Start-Job -Name "RenderingHostJob_Disconnected" -InputObject $sampleAppPath -ScriptBlock {
        Set-Location $input
        npm run start
    }
 
    #Verify Site Availability
    $intervalSec=10
    $retries=10
    $originalRetryCount = $retries
    $client = New-Object System.Net.WebClient
    do { Start-Sleep -Seconds $intervalSec; $retries-- } 
    until (
        $(try { Write-Host "[$($originalRetryCount - $retries)] Requesting: $Url"
            $response = $client.DownloadString($Url)
            Write-Host "Response code: OK"
            $null -ne $response
        } catch [System.Net.WebException] { 
            Write-Host "A web exception was caught (waiting for another $intervalSec sec.): $($_.Exception.Message)"
        }) -or $retries -lt 1
    )
 
    #Run tests here
    Write-Output "Current Directory: $(Get-Location)"
    npm install
    npx playwright test
}
finally {
    # Clean up any background jobs and node processes
    Write-Host "Removing Job $job.ID ..."
    Stop-Job -Id $job.ID
    Remove-Job -Id $job.ID -Force         
    npx --yes kill-port 3000
}