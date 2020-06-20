function saveResource() {
    document
    .getElementById("bookmark")
    .addEventListener("click", function(){
      console.log("running");
      var element = document.getElementById("select");
      var type = element.options[element.selectedIndex].value;
      chrome.tabs.query({
        active: true,
        currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            console.log(tab.title);
            console.log(tab.url);
            chrome.storage.sync.get("savedArticles", function (result) {
                allArticles = result.savedArticles;
                console.log(allArticles);
                var newArticle = {link: tab.url, title: tab.title, type: type}
                allArticles.push(newArticle);
                chrome.storage.sync.set({ savedArticles: allArticles }, function () {
                    console.log("store");
                    var preBookmark = document.getElementById("prebookmark");
                    preBookmark.style.display = "none";
                    var postBookmark = document.getElementById("postbookmark");
                    postbookmark.style.display = "block";
                    var outerBox = document.getElementById("outer-box");
                    outerBox.style.minWidth = "50px";
                });
            });
        });
    });
}

window.onload = function () {
    saveResource();
};


