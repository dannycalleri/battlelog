/**
 * Created by danny on 27/01/16.
 */

class Utils
{
    static getGistContentWithId(id, callback)
    {
        var api = Utils.GITHUB_BASE_URL + "/gists/" + id;

        $.get(api)
        .success(function(data){
            var files = data.files;
            if(Object.keys(files).length > 0)
            {
                callback(null, files[Object.keys(files)[0]].content);
                return;
            }

            callback({ error: "No files." }, null);
        })
        .error(function(){
            callback({ error: "Network error." }, null);
        });
    }
}

Utils.GITHUB_BASE_URL = "https://api.github.com";
Utils.index = null;
Utils.tags = null;

export default Utils;
