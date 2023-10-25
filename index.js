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
        fileContent = fileContent.replace( ^\s*\n gm, '');
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
                ! await checkFileStartsWithHeader("REAMME.md")
            ){}
        }
        
        catch(error){
            core.setFailed(error.message);
        }
    }
)();
