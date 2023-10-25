const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function checkFileExists(filePath) {
    return fs.promises.access(filePath)
    .then(() => {
        core.info(`File ${filePath} exists`);
        return true;
    })
    .catch(() => {
        core.setFailed(`File ${filePath} does not exist`);
        return false;
    });
}

async function checkFileStartsWithHeader(filePath){
    return fs.promises.readFile(filePath,'utf8')
    .then(fileContent => {
        // remove all spaces at the beginning of the file
        fileContent = fileContent.replace(/^\s*\n/gm, '');
        if (fileContent.startWith('#')){
            core.info('File ${filePath} starts with a header');
            return true;            
        } else{
          core.setFailed('File ${filePath}  does not start with a header' );
            return false;
        }
    });
}

(  async() => {
        try{
            core.notice("Calling our action");
            checkFileExists("README.md");
            checkFileExists("LICENSE");
            if (
                ! await checkFileStartsWithHeader("README.md")
            ){
                //get token for octokit
                const token = core.getInput('repo-token');
                const octokit = new github.getOctokit(token);

                // call octokit to create a check with annotation and details
                const check = await octokit.checks.create({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    name: 'readme-header',
                    head_sha: github.context.sha,
                    status: 'completed',
                    conclusion: 'failure',
                    output:{
                        title: 'README.md does not start with a header',
                        summary: 'README.md does not start with a header',
                        annotations:[
                            {
                                path: 'README.md',
                                start_line: 1,
                                end_line: 1,
                                annotation_level: 'failure',
                                message: 'READEME.md does not start with a header',
                                start_column:1,
                                end_column:1
                            }
                        ]
                    }
                });
            }
        }
        
        catch(error){
            core.setFailed(error.message);
        }
    }
)();
