const core = require('@actions/core');
const github = require('@actions/github');

{
    async() => {
        try{
            core.notice("Calling our action");
            core.message("Calling my action");
        }
        
        catch(error){
            core.setFailed(error.message);
        }
    }
}