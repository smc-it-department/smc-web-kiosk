const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path')

app.commandLine.appendSwitch('ignore-certificate-errors');

app
  .whenReady()
  .then(() => {
    const win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
      },

      kiosk: true,
      fullscreen: true,
    });
    const argsArray = [...process.argv]
    console.log(argsArray);    
    
    var argsUrls = argsArray.filter((a) => a.includes("url=http"));
    var argsReload = argsArray.filter((a) => a.includes("reload="));
    if (argsReload.length === 0) {argsReload[0] = "reload=0"} 

    if (argsUrls.length === 1) {
      const spt_index = argsUrls[0].indexOf("=");
      const argsUrl = argsUrls[0].substring(spt_index + 1).trim();
      const spt_reload = argsReload[0].indexOf("=");
      const argReload = parseInt(argsReload[0].substring(spt_reload + 1).trim());
      
      function reloadLoop(){
	      	win
		.loadURL(argsUrl)
		.then(() => {
		  console.log("Url loaded: " + argsUrl);
		})
		.catch((err) => {
		  console.error("Error while loading url: " + argsUrl);
		  console.error(err);
		  });	  
 	}
	reloadLoop()
	if (argReload > 0)
	{
		setInterval(reloadLoop, argReload);
	}
    } else {
      win
        .loadFile("index.html")
        .then(() => {
          console.log("Did load empty information page");
          console.log("No url given to web-kiosk");
          console.log(
            "Use this format when running program: web-kiosk url=https://google.com"
          );
        })
        .catch((err) => {
          console.error("Fatal error. Could not load empty information page.");
          console.error(err);
        });
    }
  })
  .catch((err) => {
    console.error("Unknown error wile running web-kiosk.");
    console.error(err);
  });

app.on("window-all-closed", () => {
  app.quit();
});
