// chrome.bookmarks.getTree(function(bookmarkTreeNodes){
//     console.log(bookmarkTreeNodes[0].children[1]);
// });

// var tabID; 
// var readID;
// var signID;
// var donateID;

// function makeFolders() {
//     chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
//     var flag = false;
//     for(var i = 0; i < bookmarkTreeNodes[0].children[1].children.length; i++){
//         if (bookmarkTreeNodes[0].children[1].children[i].title === 'TabsForBlackLivesMatter') {
//             flag = true;
//             tabID = bookmarkTreeNodes[0].children[1].children[i].id;
//             console.log(bookmarkTreeNodes[0].children[1].children[i]);
//             for(var j = 0; j < bookmarkTreeNodes[0].children[1].children[i].children.length; j++){
//                 console.log(bookmarkTreeNodes[0].children[1].children[i].children[j])
//                 if (bookmarkTreeNodes[0].children[1].children[i].children[j].title === 'Read') {
//                     readID = bookmarkTreeNodes[0].children[1].children[i].children[j].id;
//                 }
//                 if (bookmarkTreeNodes[0].children[1].children[i].children[j].title === 'Sign') {
//                     signID = bookmarkTreeNodes[0].children[1].children[i].children[j].id;
//                 }
//                 if (bookmarkTreeNodes[0].children[1].children[i].children[j].title === 'Donate') {
//                     donateID = bookmarkTreeNodes[0].children[1].children[i].children[j].id;
//                 }
//             }
//         }
//     }
//     if (!flag) {
//         var folderID;
//         chrome.bookmarks.create({'parentId': bookmarkTreeNodes[0].children[1].id,  'title': 'TabsForBlackLivesMatter'}, function(newFolder) {
//             console.log("added folder: " + newFolder.title);
//             console.log("added folder: " + newFolder.id);
//             tabID = bookmarkTreeNodes[0].children[1].id
//             folderID = newFolder.id;
//             chrome.bookmarks.create({'parentId': folderID,  'title': 'Read'}, function(readFolder) {
//                 console.log("added folder: " + readFolder.title);
//                 readID = readFolder.id;
//             });
//             chrome.bookmarks.create({'parentId': folderID,  'title': 'Sign'}, function(signFolder) {
//                 console.log("added folder: " + signFolder.title);
//                 signID = signFolder.id;
//             });
//             chrome.bookmarks.create({'parentId': folderID,  'title': 'Donate'}, function(donateFolder) {
//                 console.log("added folder: " + donateFolder.title);
//                 donateID = donateFolder.id;
//             });
//         });
//     }
// });
// }

// makeFolders();

// chrome.browserAction.onClicked.addListener(buttonClicked)

// function buttonClicked(){
//     console.log("running");
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, function(tabs) {
//         var tab = tabs[0];
//         console.log(tab.title);
//         console.log(tab.url);
//         chrome.storage.sync.get("savedArticles", function (result) {
//             allArticles = result.savedArticles;
//             console.log(allArticles);
//             var newArticle = {link: tab.url, title: tab.title, type: "External"}
//             allArticles.push(newArticle);
//             chrome.storage.sync.set({ savedArticles: allArticles }, function () {
//                 console.log("store");
//             });
//         });
//     });
// }

// chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//       }, function(tabs) {
//         var tab = tabs[0];
//         console.log(tab.title);
//         console.log(tab.url);
//         console.log(bookmark);
//         console.log(readID);
//         console.log(signID);
//         console.log(donateID);
//         if(bookmark.parentId == readID) {
//             chrome.storage.sync.get("savedArticles", function (result) {
//                 allArticles = result.savedArticles;
//                 var newArticle = {link: tab.url, title: tab.title, type: "read"}
//                 allArticles.push(newArticle);
//                 chrome.storage.sync.set({ savedArticles: allArticles }, function () {
//                     console.log("store");
//                 });
//             });
//         }
//         if(bookmark.parentId  == signID) {
//             chrome.storage.sync.get("savedArticles", function (result) {
//                 allArticles = result.savedArticles;
//                 var newArticle = {link: tab.url, title: tab.title, type: "sign"}
//                 allArticles.push(newArticle);
//                 chrome.storage.sync.set({ savedArticles: allArticles }, function () {
//                     console.log("store");
//                 });
//             });
//         }
//         if(bookmark.parentId  == donateID) {
//             chrome.storage.sync.get("savedArticles", function (result) {
//                 allArticles = result.savedArticles;
//                 var newArticle = {link: tab.url, title: tab.title, type: "donate"}
//                 allArticles.push(newArticle);
//                 chrome.storage.sync.set({ savedArticles: allArticles }, function () {
//                     console.log("store");
//                 });
//             });
//         }
//     });
// });

