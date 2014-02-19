chrome.browserAction.onClicked.addListener(function(tab){
    console.log('Turning ' + tab.url + ' red!');
    //chrome.tabs.executeScript({
    //  code: 'document.body.style.backgroundColor="red"'
    //});
    chrome.tabs.executeScript(null, {file: "scripts.js"});
    window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
});

