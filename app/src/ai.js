const { LMStudioClient } = require("@lmstudio/sdk");
const { ipcMain, dialog, BrowserWindow } = require("electron");

const client = new LMStudioClient();

const askAI = async (text) => {
    //Demande à l'IA
        const model = await client.llm.model("google/gemma-3-4b");
        const result = await model.respond("Improve the formatting, syntax, vocabulary and grammar of this text, keeping simple to read but not dumb. Keep the text in the language of the user. Do not translate. Respond with only the text, without introduction and follow up questions: " + text);
        console.info(result.content);

        //Demander une confirmation à l'utilisateur
        const dialogResult = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
            message: "Is this OK ? \n" + result.content,
            title: "Validate AI input",
            buttons: ["Cancel", "Regenerate", "Ok"],
            noLink: true
        })
        
        console.log(dialogResult)

        switch(dialogResult) {
            //Cancel
            case 0:
                return text
            
            case 1:
                return askAI(text)

            case 2:
                return result.content
            
            default:
                return text
        }
}

const aiModule = () => {
    ipcMain.on("ai:format-text", async (event, arg) => {
        event.returnValue = await askAI(arg)
    });
}

module.exports = { aiModule }