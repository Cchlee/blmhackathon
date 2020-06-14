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
                let selectedArtURL = selectedArt[0]["Please upload an image of the art. Aspect ratios of 4:3 are preferred but any art is great!"];
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
                    checkIfSaved(selectedPetition[i]['Title'], i, "save-sign-");
                    document.getElementById("save-sign-" + addOne).addEventListener("click", function(){
                      saveArticle("sign" + addOne);
                      changeColor("save-sign-" + addOne);
                      updateSavedContent()
                    });
                    i += 1
                  }
                }

                i = 0;
                let selectedDonation = getRandom(jsonDonate, numToGrab);
                while (i < 3) {
                  if (selectedDonation[i]['URL to resource'].substring(0, 4).toLowerCase() === "http") {
                    let addOne = (i + 1).toString()
                    document.getElementById("donate" + addOne).href = selectedDonation[i]['URL to resource'];
                    document.getElementById("donate" + addOne).innerHTML = selectedDonation[i]['Title'];
                    checkIfSaved(selectedDonation[i]['Title'], i, "save-donate-");
                    document.getElementById("save-donate-" + addOne).addEventListener("click", function(){
                      saveArticle("donate" + addOne);
                      changeColor("save-donate-" + addOne);
                      updateSavedContent()
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
                    checkIfSaved(selectedRead[i]['Title'], i, "save-read-");
                    document.getElementById("save-read-" + addOne).addEventListener("click", function(){
                      saveArticle("read" + addOne);
                      changeColor("save-read-" + addOne);
                      updateSavedContent()
                    });
                    i += 1
                  }
                }
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
      let outerdiv = document.createElement('div');
      outerdiv.setAttribute('class', 'row align-items-center');

      let topdiv = document.createElement('div');
      topdiv.setAttribute('class', 'col-10');

      let bottomdiv = document.createElement('div');
      bottomdiv.setAttribute('class', 'col-1');


      let a = document.createElement('a');
      let link = document.createTextNode(result['savedArticles'][i]['title']);
      a.appendChild(link);
      a.title = result['savedArticles'][i]['title'];
      a.href = result['savedArticles'][i]['link'];
      topdiv.appendChild(a);

      let span = document.createElement('span');
      span.setAttribute('class', 'fa fa-star');
      span.setAttribute('id', 'saved-resource-' + i.toString());
      span.setAttribute('style', 'color:yellow');
      bottomdiv.appendChild(span);

      outerdiv.appendChild(topdiv);
      outerdiv.appendChild(bottomdiv);

      content.appendChild(outerdiv);

      document.getElementById('saved-resource-' + i.toString()).addEventListener("click", function(){
        unSaveArticle(this.id);
      });

      i = i+1;
    }
  });
}

function checkIfSaved(title, curr, type){
  chrome.storage.sync.get('savedArticles', function(result) {
    for (var x = 0; x < result.savedArticles.length; x++) {
      if (result.savedArticles[x].title === title) {
        console.log("there");
        changeColor(type + curr);
        return true;
      } 
    }
    console.log("not there")
    return false;
  });
}

function changeColor(id){
  if (document.getElementById(id).style.color==="white"){
    document.getElementById(id).style.color="yellow";
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

function unSaveArticle(i) {
  let toDeleteIndex = parseInt(i.split('-')[2])
  var saved = {};
  var allArticles = [];
  chrome.storage.sync.get('savedArticles', function(result) {
    allArticles = result.savedArticles;
    allArticles.splice(toDeleteIndex, 1);
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    chrome.storage.sync.set({'savedArticles': allArticles}, function() {
      updateSavedContent();
    });
  });
}

function updateSavedContent() {
  let content = document.getElementById("saved-articles-list");
  while (content.hasChildNodes()) {
      content.removeChild(content.lastChild);
  }
  addSavedItemsToList();
}

window.onload = function () {
  updateTime();
  addSavedItemsToList();
};

readTextFileArt('art.csv');
readTextFileResources('resources.csv');

// This updates every second in case the time changes
setInterval(updateTime,1000);
