function readTextFileArt(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                let jsonArt = JSON.parse(csvJSON(allText));
                let selectedArt = getRandom(jsonArt, 1);
                let selectedArtURL = selectedArt[0]["Please upload an image of the art. Aspect ratios of 4:3 are preferred (and high-res) but any art is great! If you're getting this art from instagram we recommend https://ingramer.com/tools/instagram-photo-downloader/"];
                let selectedArtTitle = selectedArt[0]["What is the name of this piece? (Untitled if there is no name)"];
                let selectedArtTitleURL = selectedArt[0]["Link where we can find this work online"];
                let selectedArtist = selectedArt[0]["What is the name of the artist?"];
                let selectedArtistURL = selectedArt[0]["The artist's online portfolio or Instagram handle - if possible (i.e. @kerryjamesmarshs)\r"]
                document.body.style.backgroundImage = "url(\'" + convertGoogleImageToURL(selectedArtURL) + "\')";
                document.getElementById("artTitle").innerHTML = selectedArtTitle;
                document.getElementById("artTitle").href = selectedArtTitleURL;
                document.getElementById("artistName").innerHTML = selectedArtist;
                document.getElementById("artistName").href = selectedArtistURL;
            }
        }
    }
    rawFile.send(null);
}

function readTextFileResources(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                let jsonResources = JSON.parse(csvJSON(allText));
                let jsonSign = []
                let jsonRead = []
                let jsonDonate = []

                let allContentURLs = new Set()

                for (let i = 0; i < jsonResources.length; i++) {
                  let resource = jsonResources[i];
                  if (resource['Category'] === 'Petition') {
                    if (!allContentURLs.has(resource['URL to resource'])) {
                      jsonSign.push(resource);
                      allContentURLs.add(resource['URL to resource'])
                    }
                  } else if (resource['Category'] === 'Donation fund') {
                    if (!allContentURLs.has(resource['URL to resource'])) {
                      jsonDonate.push(resource);
                      allContentURLs.add(resource['URL to resource'])
                    }
                  } else {
                    if (!allContentURLs.has(resource['URL to resource'])) {
                      jsonRead.push(resource);
                      allContentURLs.add(resource['URL to resource'])
                    }
                  }
                }

                const numToGrab = 10
                let selectedPetition = getRandom(jsonSign, numToGrab);
                let i = 0;
                while (i < 3) {
                  if (selectedPetition[i]['URL to resource'].substring(0, 4).toLowerCase() === "http") {
                    let addOne = (i + 1).toString()
                    document.getElementById("sign" + addOne).href = selectedPetition[i]['URL to resource'];
                    document.getElementById("sign" + addOne).innerHTML = selectedPetition[i]['Title'];
                    document.getElementById("save-sign-" + addOne).addEventListener("click", function(){
                      saveArticle("sign" + addOne);
                    });
                    i += 1
                  }
                }
                let selectedPetition = getRandom(jsonSign, 3);
                document.getElementById("sign1").href = selectedPetition[0]['URL to resource'];
                document.getElementById("sign1").innerHTML = selectedPetition[0]['Title'];
                document.getElementById("save-sign-1").addEventListener("click", function(){
                  saveArticle("sign1");
                  changeColor("save-sign-1");
                });
                document.getElementById("sign2").href = selectedPetition[1]['URL to resource'];
                document.getElementById("sign2").innerHTML = selectedPetition[1]['Title'];
                document.getElementById("save-sign-2").addEventListener("click", function(){
                  saveArticle("sign2");
                  changeColor("save-sign-2");
                });
                document.getElementById("sign3").href = selectedPetition[2]['URL to resource'];
                document.getElementById("sign3").innerHTML = selectedPetition[2]['Title'];
                document.getElementById("save-sign-3").addEventListener("click", function(){
                  saveArticle("sign3");
                  changeColor("save-sign-3");
                });

                let selectedDonation = getRandom(jsonDonate, 3);
                document.getElementById("donate1").href = selectedDonation[0]['URL to resource'];
                document.getElementById("donate1").innerHTML = selectedDonation[0]['Title'];
                document.getElementById("save-donate-1").addEventListener("click", function(){
                  saveArticle("donate1");
                  changeColor("save-donate-1");
                });
                document.getElementById("donate2").href = selectedDonation[1]['URL to resource'];
                document.getElementById("donate2").innerHTML = selectedDonation[1]['Title'];
                document.getElementById("save-donate-2").addEventListener("click", function(){
                  saveArticle("donate2");
                  changeColor("save-donate-2");
                });
                document.getElementById("donate3").href = selectedDonation[2]['URL to resource'];
                document.getElementById("donate3").innerHTML = selectedDonation[2]['Title'];
                document.getElementById("save-donate-3").addEventListener("click", function(){
                  saveArticle("donate3");
                  changeColor("save-donate-3");
                });

                i = 0;
                let selectedDonation = getRandom(jsonDonate, numToGrab);
                while (i < 3) {
                  if (selectedDonation[i]['URL to resource'].substring(0, 4).toLowerCase() === "http") {
                    let addOne = (i + 1).toString()
                    document.getElementById("donate" + addOne).href = selectedDonation[i]['URL to resource'];
                    document.getElementById("donate" + addOne).innerHTML = selectedDonation[i]['Title'];
                    document.getElementById("save-donate-" + addOne).addEventListener("click", function(){
                      saveArticle("donate" + addOne);
                    });
                    i += 1
                  }
                }

                i = 0;
                let selectedRead = getRandom(jsonRead, 3);
                while (i < 3) {
                  if (selectedDonation[i]['URL to resource'].substring(0, 4).toLowerCase() === "http") {
                    let addOne = (i + 1).toString()
                    document.getElementById("read" + addOne).href = selectedRead[i]['URL to resource'];
                    document.getElementById("read" + addOne).innerHTML = selectedRead[i]['Title'];
                    document.getElementById("save-read-" + addOne).addEventListener("click", function(){
                      saveArticle("read" + addOne);
                    });
                    i += 1
                  }
                }
                document.getElementById("read1").href = selectedRead[0]['URL to resource'];
                document.getElementById("read1").innerHTML = selectedRead[0]['Title'];
                document.getElementById("save-read-1").addEventListener("click", function(){
                  saveArticle("read1");
                  changeColor("save-read-1");
                });
                document.getElementById("read2").href = selectedRead[1]['URL to resource'];
                document.getElementById("read2").innerHTML = selectedRead[1]['Title'];
                document.getElementById("save-read-2").addEventListener("click", function(){
                  saveArticle("read2");
                  changeColor("save-read-2");
                });
                document.getElementById("read3").href = selectedRead[2]['URL to resource'];
                document.getElementById("read3").innerHTML = selectedRead[2]['Title'];
                document.getElementById("save-read-3").addEventListener("click", function(){
                  saveArticle("read3");
                  changeColor("save-read-3");
                });

            }
        }
    }
    rawFile.send(null);
}

//let csv is the CSV file with headers
function csvJSON(csv){
  let lines=csv.split("\n");
  let result = [];
  let commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g
  let quotesRegex = /^"(.*)"$/g
  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  let headers = lines[0].split(commaRegex).map(h => h.replace(quotesRegex, "$1"));
  for(let i=1;i<lines.length;i++){
      let obj = {};
      let currentline=lines[i].split(commaRegex);
      for(let j=0;j<headers.length;j++){
          if(obj[headers[j]] = currentline[j] != null){
            obj[headers[j]] = currentline[j].replace(quotesRegex, "$1");
          }
      }
      result.push(obj);
  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function convertGoogleImageToURL(googleURL) {
  let arr = googleURL.split('https://drive.google.com/open?id=');
  img_id = arr[1];
  return 'https://drive.google.com/uc?export=view&id=' + img_id;
}

function updateTime() {
    let date = new Date();
    let minuteString = "";
    let hourString = "";
    if (date.getMinutes() < 10) {
        minuteString = "0" + date.getMinutes();
    } else {
        minuteString = date.getMinutes();
    }
    if (date.getHours() > 12) {
        hourString = date.getHours() - 12;
    } else {
        hourString = date.getHours();
    }
    let timeString = hourString + ":" + minuteString;
    let dateString = convertDay(date.getDay()) + ", " + convertMonth(date.getMonth()) + " " + date.getDate()

    document.getElementById("clock").innerHTML = timeString;
    document.getElementById("date").innerHTML = dateString;
}

function convertDay(num) {
  switch(num) {
  case 0:
    return "Sunday"
    break;
  case 1:
    return "Monday"
    break;
  case 2:
    return "Tuesday"
    break;
  case 3:
    return "Wednesday"
    break;
  case 4:
    return "Thursday"
    break;
  case 5:
    return "Friday"
    break;
  default:
    return "Saturday"
}
}

function convertMonth(num) {
  switch(num) {
  case 0:
    return "January"
    break;
  case 1:
    return "February"
    break;
  case 2:
    return "March"
    break;
  case 3:
    return "April"
    break;
  case 4:
    return "May"
    break;
  case 5:
    return "June"
    break;
  case 6:
    return "July"
    break;
  case 7:
    return "August"
    break;
  case 8:
    return "September"
    break;
  case 9:
    return "October"
    break;
  case 10:
    return "November"
    break;
  default:
    return "December"
}
}

function addSavedItemsToList() {
  let content = document.getElementById("saved-articles-list");
  let i = 0;
  chrome.storage.sync.get('savedArticles', function(result) {
    for (let savedItem in result['savedArticles']) {
      let a = document.createElement('a');
      let link = document.createTextNode(result['savedArticles'][i]['title']);
      a.appendChild(link);
      a.title = result['savedArticles'][i]['title'];
      a.href = result['savedArticles'][i]['link'];
      content.appendChild(a);
      i = i+1;
    }
  });

}

function storeLink(id) {
  console.log(id);
  chrome.storage.sync.set({'name': 'Chris'}, function() {
    console.log('Value is set to ' + 'chris');
  });
function changeColor(id){
  if (document.getElementById(id).style.color==="white"){
    document.getElementById(id).style.color="orange";
  } else {
    document.getElementById(id).style.color="white";
  }
}

function saveArticle(id){
  var saved = {};
  var allArticles = [];
  chrome.storage.sync.get('savedArticles', function(result) {
    allArticles = result.savedArticles;
    saved.title = document.getElementById(id).innerHTML;
    saved.link = document.getElementById(id).href;
    allArticles.push(saved);
    chrome.storage.sync.set({'savedArticles': allArticles}, function() {
      console.log(allArticles);
    });
  });
}

window.onload = function () {
  updateTime();
  addSavedItemsToList();
};

readTextFileArt('art.csv');
readTextFileResources('resources.csv');

// This updates every second in case the time changes
setInterval(updateTime,1000);
