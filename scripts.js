////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//                                TAB FOR BLM FUNCTIONS                               //
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

// CONSTANTS
NUM_SECONDS_IN_DAY = 86400;

/**
 * readTextFileArt is used to handle the background image art
 */
function readTextFileArt(file) {
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        chrome.storage.local.get("recentArt", function (result) {
          if (result.recentArt === undefined) {
            result.recentArt = [];
          }

          let allText = rawFile.responseText;
          let jsonArt = JSON.parse(csvJSON(allText));
          let selectedArt = getRandom(jsonArt, 1);
          let selectedArtURL = getUrlFromArt(selectedArt);

          while (result.recentArt.includes(selectedArtURL)) {
            selectedArt = getRandom(jsonArt, 1);
            selectedArtURL = getUrlFromArt(selectedArt);
          }

          let newRecentArt = [];
          if (result.recentArt.length > 0 && result.recentArt.length < 15) {
            for (let i = 0; i < result.recentArt.length; i++) {
              newRecentArt.push(result.recentArt[i]);
            }
          } else {
            for (let i = 1; i < result.recentArt.length; i++) {
              newRecentArt.push(result.recentArt[i]);
            }
          }
          newRecentArt.push(selectedArtURL);

          let selectedArtTitle =
            selectedArt[0][
              "What is the name of this piece? (Untitled if there is no name)"
            ];
          let selectedArtTitleURL =
            selectedArt[0]["Link where we can find this work online"];
          let selectedArtist =
            selectedArt[0]["What is the name of the artist?"];
          let selectedArtistURL =
            selectedArt[0][
              "The artist's online portfolio or Instagram handle - if possible (i.e. https://www.instagram.com/kerryjamesmarshs/)\r"
            ];
          let artistBio = selectedArt[0]["Artist Bio\r"].replace("\"", "").replace("\"", "");
          let artistFirstName = selectedArtist.split(" ")[0]

          if (selectedArtURL.includes("instagram")) {
            const Http = new XMLHttpRequest();
            var url = new URL("https://graph.facebook.com/v8.0/instagram_oembed");
            url.searchParams.append('url', selectedArtURL.split("media")[0]);
            url.searchParams.append('fields', 'thumbnail_url');
            url.searchParams.append('access_token', '217651948990036|ab3c5d521cd6ab52446731cde4e2b7d5');
            Http.open("GET", url);
            Http.send();

            Http.onreadystatechange = (e) => {
              if (Http.readyState === 4) {
                if (Http.status === 200) {
                  loadBackgroundImage(JSON.parse(Http.responseText)["thumbnail_url"]);
                }
              }
            }
          }

          if (selectedArtURL.includes("drive")) {
            loadBackgroundImage(convertGoogleImageToURL(selectedArtURL));
          }

          document.getElementById("artTitle").innerHTML = truncate(
            selectedArtTitle,
            25
          );
          document.getElementById("artistBio").innerHTML = "&#xf0eb " + '<span id="artistBioInfo" class="tooltiptext-bottom">About ' + artistFirstName + ": " + artistBio + '</span>';

          document.getElementById("artTitle").href = selectedArtTitleURL;
          document.getElementById("artistName").innerHTML = selectedArtist;
          document.getElementById("artistName").href = selectedArtistURL;

          chrome.storage.local.set({ recentArt: newRecentArt }, function () {});
        });
      }
    }
  };
  rawFile.send(null);
}

/**
 * loadBackgroundImage allows for loading and fading in the background image
 */
function loadBackgroundImage(url) {
  if (navigator.onLine) {
    let bgimg = document.createElement("div");
    bgimg.setAttribute("id", "background-img");

    let img = new Image();

    img.onload = function () {
      bgimg.style.backgroundImage = "url('" + img.src + "')";
      bgimg.style.animation = "fadeInAnimation ease 2.5s";
      bgimg.style.animationIterationCount = "1";
      bgimg.style.animationFillMode = "forwards;";
    };

    img.src = url;

    let bgParent = document.getElementById("background-parent");
    bgParent.appendChild(bgimg);
  } else {
    goOffline();
  }
}

/**
 * Shows offline notification when no internet
 */
function goOffline() {
  console.log("is offline");
  let offline = document.createElement("div");
  offline.setAttribute("id", "offline");
  let text = document.createElement("h2");
  text.innerText = "Connect to the internet to see art.";
  offline.appendChild(text);
  offline.style.visibility = "visible";
  document.getElementsByTagName("BODY")[0].appendChild(offline);
}

let headerTitleLinks = []; //GLOBAL ARRAY TO STORE HEADER LINKS

/**
 * readTextFileResources is used to handle the dropdown resources
 */
function readTextFileResources(file) {
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        chrome.storage.local.get("todaysContent", function (result) {
          if (result.todaysContent === undefined) {
            result.todaysContent = {};
          }

          let selectedPetition = [];
          let selectedDonation = [];
          let selectedRead = [];

          let date = new Date();
          let todaysDate =
            convertDay(date.getDay()) +
            ", " +
            convertMonth(date.getMonth()) +
            " " +
            date.getDate();

          if (todaysDate in result.todaysContent) {
            selectedPetition = result.todaysContent[todaysDate][0];
            selectedDonation = result.todaysContent[todaysDate][1];
            selectedRead = result.todaysContent[todaysDate][2];
          } else {
            let allText = rawFile.responseText;
            let jsonResources = JSON.parse(csvJSON(allText));
            let jsonSign = [];
            let jsonRead = [];
            let jsonDonate = [];
            let allContentURLs = new Set();
            for (let i = 0; i < jsonResources.length; i++) {
              let resource = jsonResources[i];
              if (resource["Category"] === "Petition") {
                if (!allContentURLs.has(resource["URL to resource"])) {
                  jsonSign.push(resource);
                  allContentURLs.add(resource["URL to resource"]);
                }
              } else if (resource["Category"] === "Donation fund") {
                if (!allContentURLs.has(resource["URL to resource"])) {
                  jsonDonate.push(resource);
                  allContentURLs.add(resource["URL to resource"]);
                }
              } else {
                if (!allContentURLs.has(resource["URL to resource"])) {
                  jsonRead.push(resource);
                  allContentURLs.add(resource["URL to resource"]);
                }
              }
            }
            const numToGrab = 10;
            selectedPetition = getRandom(jsonSign, numToGrab);
            selectedDonation = getRandom(jsonDonate, numToGrab);
            selectedRead = getRandom(jsonRead, numToGrab);

          }

          let i = 0;
          while (i < 3) {
            if (
              selectedPetition[i]["URL to resource"] &&
              selectedPetition[i]["URL to resource"]
                .substring(0, 4)
                .toLowerCase() === "http"
            ) {
              let addOne = (i + 1).toString();
              if (selectedPetition[i]["CW\r"].length == 1) {
                document.getElementById("cw-sign" + addOne).style.display = "none";
              }
              document.getElementById("tooltiptext-sign" + addOne).innerHTML = selectedPetition[i]["CW\r"];
              document.getElementById("sign" + addOne).href =
                selectedPetition[i]["URL to resource"];
              document.getElementById("sign" + addOne).innerHTML =
                selectedPetition[i]["Title"];
              checkIfSaved(selectedPetition[i]["Title"], addOne, "save-sign-");
              document
                .getElementById("save-sign-" + addOne)
                .addEventListener("click", function () {
                  saveArticleFromDropdown("sign" + addOne);
                  changeColor("save-sign-" + addOne);
                });
              let preset = {
                title: selectedPetition[i]["Title"].toString(),
                element: "save-sign-" + addOne,
              };
              headerTitleLinks.push(preset);
              i += 1;
            } else {
              selectedPetition = getRandom(jsonSign, numToGrab);
            }
          }

          i = 0;

          while (i < 3) {
            if (
              selectedDonation[i]["URL to resource"] &&
              selectedDonation[i]["URL to resource"]
                .substring(0, 4)
                .toLowerCase() === "http"
            ) {
              let addOne = (i + 1).toString();
              if (selectedDonation[i]["CW\r"].length == 1) {
                document.getElementById("cw-donate" + addOne).style.display = "none";
              }
              document.getElementById("tooltiptext-donate" + addOne).innerHTML = selectedDonation[i]["CW\r"];
              document.getElementById("donate" + addOne).href =
                selectedDonation[i]["URL to resource"];
              document.getElementById("donate" + addOne).innerHTML =
                selectedDonation[i]["Title"];
              checkIfSaved(
                selectedDonation[i]["Title"],
                addOne,
                "save-donate-"
              );
              document
                .getElementById("save-donate-" + addOne)
                .addEventListener("click", function () {
                  saveArticleFromDropdown("donate" + addOne);
                  changeColor("save-donate-" + addOne);
                });
              let preset = {
                title: selectedDonation[i]["Title"].toString(),
                element: "save-donate-" + addOne,
              };
              headerTitleLinks.push(preset);
              i += 1;
            } else {
              selectedDonation = getRandom(jsonDonate, numToGrab);
            }
          }

          i = 0;

          while (i < 3) {
            if (
              selectedRead[i]["URL to resource"] &&
              selectedRead[i]["URL to resource"]
                .substring(0, 4)
                .toLowerCase() === "http"
            ) {
              let addOne = (i + 1).toString();
              if (selectedRead[i]["CW\r"].length == 1) {
                document.getElementById("cw-read" + addOne).style.display = "none";
              }
              document.getElementById("tooltiptext-read" + addOne).innerHTML = selectedRead[i]["CW\r"];
              document.getElementById("read" + addOne).href =
                selectedRead[i]["URL to resource"];
              document.getElementById("read" + addOne).innerHTML =
                selectedRead[i]["Title"];
              checkIfSaved(selectedRead[i]["Title"], addOne, "save-read-");
              document
                .getElementById("save-read-" + addOne)
                .addEventListener("click", function () {
                  saveArticleFromDropdown("read" + addOne);
                  changeColor("save-read-" + addOne);
                });
              let preset = {
                title: selectedRead[i]["Title"].toString(),
                element: "save-read-" + addOne,
              };
              headerTitleLinks.push(preset);
              i += 1;
            } else {
              selectedRead = getRandom(jsonRead, numToGrab);
            }
          }

        chrome.storage.local.set({ todaysContent: {[todaysDate]: [selectedPetition, selectedDonation, selectedRead]} }, function () {});
        });
      }
    }
  };
  rawFile.send(null);
}

/**
 * create a JSON from a CSV
 */
function csvJSON(csv) {
  let lines = csv.split("\n");
  let result = [];
  let commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g;
  let quotesRegex = /^"(.*)"$/g;
  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  let headers = lines[0]
    .split(commaRegex)
    .map((h) => h.replace(quotesRegex, "$1"));
  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(commaRegex);
    for (let j = 0; j < headers.length; j++) {
      if ((obj[headers[j]] = currentline[j] != null)) {
        obj[headers[j]] = currentline[j].replace(quotesRegex, "$1");
      }
    }
    result.push(obj);
  }
  return JSON.stringify(result);
}

/**
 * this function is used to get and set the current time on the page
 */
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
  let dateString =
    convertDay(date.getDay()) +
    ", " +
    convertMonth(date.getMonth()) +
    " " +
    date.getDate();

  document.getElementById("clock").innerHTML = timeString;
  document.getElementById("date").innerHTML = dateString;
}

/**
 * this function toggles showing and hiding the overlay
 */
function toggleOverlay() {
  let overlay = document.getElementsByClassName("hideable");
  let eye = document.getElementById("hide-overlay-btn");
  chrome.storage.local.get("isVisible", function (result) {
    chrome.storage.local.set({ isVisible: !result.isVisible }, function () {});
  });
  for (let i = 0; i < overlay.length; i++) {
    if (overlay[i].style.visibility === "hidden") {
      overlay[i].style.visibility = "visible";
      eye.innerHTML = '<i class="fa fa-eye"></i>';
    } else {
      overlay[i].style.visibility = "hidden";
      eye.innerHTML = '<i class="fa fa-eye-slash"></i>';
    }
  }
}

// /**
//  * this function starts header info invisible and then shows if clicked
//  */
// function startInvisible() {
//   let overlay = document.getElementsByClassName("hideable");
//   let eye = document.getElementById("hide-overlay-btn");
//   for (let i = 0; i < overlay.length; i++) {
//     overlay[i].style.visibility = "hidden";
//     eye.innerHTML = '<i class="fa fa-eye-slash"></i>';
//   }
// }

/**
 * this function goes through all the items a user has saved and adds them to the "your saved items" drop-up list
 */
function addSavedItemsToList() {
  this.document
    .getElementById("hide-overlay-btn")
    .addEventListener("mousedown", function (event) {
      toggleOverlay();
    });

  let content = document.getElementById("saved-articles-list");
  let petitionsdiv = document.createElement("div");
  petitionsdiv.setAttribute("id", "petitionsdiv");
  let readingdiv = document.createElement("div");
  readingdiv.setAttribute("id", "readingdiv");
  let donatediv = document.createElement("div");
  donatediv.setAttribute("id", "donatediv");
  let externaldiv = document.createElement("div");
  externaldiv.setAttribute("id", "externaldiv");

  let i = 0;
  chrome.storage.local.get("savedArticles", function (result) {
    //This code builds the lists
    for (let savedItem in result["savedArticles"]) {
      let outerdiv = document.createElement("div");
      outerdiv.setAttribute("class", "row align-items-center");

      let topdiv = document.createElement("div");
      topdiv.setAttribute("class", "col-10");

      let bottomdiv = document.createElement("div");
      bottomdiv.setAttribute("class", "col-1");

      let a = document.createElement("a");
      let link = document.createTextNode(
        truncateLink(result["savedArticles"][i]["title"], 30)
      );
      a.appendChild(link);
      a.title = result["savedArticles"][i]["title"];
      a.href = result["savedArticles"][i]["link"];

      a.setAttribute("id", "saved-resource-link-" + i.toString());
      a.setAttribute("target", "_blank");
      a.addEventListener("mouseenter", function () {
        a.setAttribute("style", "color:black");
      });
      topdiv.appendChild(a);

      let starSpan = document.createElement("span");
      starSpan.setAttribute("class", "star-btn-dropup");

      let span = document.createElement("span");
      span.setAttribute("class", "fa fa-star");
      span.setAttribute("id", "saved-resource-" + i.toString());
      span.setAttribute("style", "color:gray");

      starSpan.appendChild(span);
      bottomdiv.appendChild(starSpan);
      outerdiv.appendChild(topdiv);
      outerdiv.appendChild(bottomdiv);

      if (result["savedArticles"][i]["type"] === "read") {
        readingdiv.appendChild(outerdiv);
      } else if (result["savedArticles"][i]["type"] === "sign") {
        petitionsdiv.appendChild(outerdiv);
      } else if (result["savedArticles"][i]["type"] === "donate") {
        donatediv.appendChild(outerdiv);
      } else {
        externaldiv.appendChild(outerdiv);
      }

      content.appendChild(readingdiv);
      content.appendChild(petitionsdiv);
      content.appendChild(donatediv);
      content.appendChild(externaldiv);

      document
        .getElementById("saved-resource-" + i.toString())
        .addEventListener("click", function () {
          saveArticleFromDropup(this.id);
          changeColor(this.id);
          for (let i = 0; i < headerTitleLinks.length; i++) {
            if (headerTitleLinks[i].title === a.title) {
              changeColor(headerTitleLinks[i].element);
            }
          }
        });
      i = i + 1;
    }

    let titleCount = 0;

    if (petitionsdiv.lastChild != null) {
      addLabelToDiv("Sign", petitionsdiv, content);
      titleCount++;
    }
    if (donatediv.lastChild != null) {
      addLabelToDiv("Donate", donatediv, content);
      titleCount++;
    }
    if (readingdiv.lastChild != null) {
      addLabelToDiv("Read", readingdiv, content);
      titleCount++;
    }
    if (externaldiv.lastChild != null) {
      addLabelToDiv("External", externaldiv, content);
      titleCount++;
    }

    if (titleCount == 0) {
      addLabelToDiv("No resources saved.", readingdiv, content);
      titleCount++;
    }

    //This code determinse how high to place the dropup menu
    if (result["savedArticles"].length <= 4) {
      let list = document.getElementById("saved-articles-list");
      let dropupContent = document.getElementsByClassName("dropup-content")[0];
      let button = document.getElementById("dropdownTitle");
      let marginTop =
        42 +
        button.offsetHeight +
        (result["savedArticles"].length - 1 + titleCount) * 46; // The height of each link is exactly 46
      dropupContent.style.marginTop = "-" + marginTop.toString() + "px";
      let dropup = document.getElementsByClassName("dropup")[0];
    } else {
      let dropupContent = document.getElementsByClassName("dropup-content")[0];
      dropupContent.style.marginTop = "-365px";
    }
  });
}

/**
 * this function toggles showing and hiding the overlay
 */
function showHideItems() {
  let overlay = document.getElementsByClassName("hideable");
  let eye = document.getElementById("hide-overlay-btn");
  chrome.storage.local.get("isVisible", function (result) {
    if (result.isVisible === undefined) {
      result.isVisible = true;
    }
    if (result.isVisible) {
      for (let i = 0; i < overlay.length; i++) {
        overlay[i].style.visibility = "visible";
        eye.innerHTML = '<i class="fa fa-eye"></i>';
      }
    } else {
      for (let i = 0; i < overlay.length; i++) {
        overlay[i].style.visibility = "hidden";
        eye.innerHTML = '<i class="fa fa-eye-slash"></i>';
      }
    }
  });
}

/**
 * this function checks if an article has been saved already
 */
function checkIfSaved(title, curr, type) {
  chrome.storage.local.get("savedArticles", function (result) {
    if (result.savedArticles === undefined) {
      chrome.storage.local.set({ savedArticles: [] }, function () {});
    }
    for (let x = 0; x < result.savedArticles.length; x++) {
      if (result.savedArticles[x].title === title) {
        changeColor(type + curr);
        return true;
      }
    }
    return false;
  });
}

/**
 * using an ID of a star, this changes its color.
 */
function changeColor(id) {
  if (document.getElementById(id).style.color === "white") {
    document.getElementById(id).style.color = "gray";
  } else {
    document.getElementById(id).style.color = "white";
  }
}

/**
 * this function saves or unsaves an article that a user selects in the dropdowns
 */
function saveArticleFromDropdown(id) {
  let saved = {};
  let allArticles = [];
  chrome.storage.local.get("savedArticles", function (result) {
    allArticles = result.savedArticles;
    let toDelete = false;
    let toDeleteIndex = -1;
    for (let i = 0; i < allArticles.length; i++) {
      if (allArticles[i]["link"] === document.getElementById(id).href) {
        toDelete = true;
        toDeleteIndex = i;
      }
    }
    if (toDelete) {
      allArticles.splice(toDeleteIndex, 1);
      chrome.storage.local.set({ savedArticles: allArticles }, function () {
        updateSavedContent();
      });
    } else {
      saved.title = document.getElementById(id).innerHTML;
      saved.link = document.getElementById(id).href;
      saved.type = id.substring(0, id.length - 1);
      allArticles.push(saved);
      chrome.storage.local.set({ savedArticles: allArticles }, function () {
        updateSavedContent();
      });
    }
  });
}

/**
 * this function saves or unsaves an article that a user selects in the dropups
 */
function saveArticleFromDropup(id) {
  let toDeleteIndex = parseInt(id.split("-")[2]);
  let saved = {};
  let toDelete = false;
  saved.title = document.getElementById(
    "saved-resource-link-" + toDeleteIndex
  ).innerHTML;
  saved.link = document.getElementById(
    "saved-resource-link-" + toDeleteIndex
  ).href;
  let allArticles = [];
  chrome.storage.local.get("savedArticles", function (result) {
    allArticles = result.savedArticles;
    for (let i = 0; i < allArticles.length; i++) {
      if (
        allArticles[i]["link"] ===
        document.getElementById("saved-resource-link-" + toDeleteIndex).href
      ) {
        toDelete = true;
        toDeleteIndex = i;
      }
    }
    if (toDelete) {
      allArticles.splice(toDeleteIndex, 1);
      chrome.storage.local.set({ savedArticles: allArticles }, function () {
        //updateSavedContent();
      });
    } else {
      allArticles.push(saved);
      chrome.storage.local.set({ savedArticles: allArticles }, function () {
        // updateSavedContent();
      });
    }
  });
}

/**
 * this function puts all saved articles from dropdowns into the dropup list
 */
function updateSavedContent() {
  let content = document.getElementById("saved-articles-list");
  while (content.hasChildNodes()) {
    content.removeChild(content.lastChild);
  }
  addSavedItemsToList();
  let i = 0;
  let addOne = (i + 1).toString();
}

/**
 * this function updates the drop up list when the user moves off of it
 */
function mouseOffResources() {
  document
    .getElementById("full-list")
    .addEventListener("mouseleave", function () {
      updateSavedContent();
    });
}

function monitorClicks(tracker) {
  document.getElementById("read1").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked an Article');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("read2").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked an Article');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("read3").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked an Article');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };

  document.getElementById("sign1").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Petition');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("sign2").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Petition');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("sign3").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Petition');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };

  document.getElementById("donate1").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Donation Fund');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("donate2").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Donation Fund');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
  document.getElementById("donate3").onclick = function(e) {
    tracker.sendEvent('Link Clicks', 'User Clicked a Donation Fund');
    chrome.storage.local.get("lastClicked", function (result) {
      chrome.storage.local.set({ lastClicked: Date.now() }, function () {});
    });
  };
}

function displayTooLongSinceClick() {
  chrome.storage.local.get("lastClicked", function (result) {
    if (result.lastClicked === undefined) {
      result.lastClicked = Date.now();
    }

    const start = result.lastClicked;
    const diff = Date.now() - start;

    let numDaysToDelay = 3;
    let secondsSinceClick = Math.floor(diff / 1000);

    if (secondsSinceClick > numDaysToDelay * NUM_SECONDS_IN_DAY) {
      document.getElementById("noInteractionWarning").style.display = "block";
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//                                UTILITY FUNCTIONS                                   //
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/**
 * get a random n elements from arr
 */
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

/**
 * converts a google URL from an uploaded file in drive to a static reference to the image
 */
function convertGoogleImageToURL(googleURL) {
  let arr = googleURL.split("https://drive.google.com/open?id=");
  img_id = arr[1];
  console.log("https://drive.google.com/uc?export=view&id=" + img_id);
  return "https://drive.google.com/uc?export=view&id=" + img_id;
}

/**
 * This truncates a string over n length and uses the unicode character as ellipses
 */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
}

/**
 * This truncates a string over n length and uses three dots as ellipses
 */
function truncateLink(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}

/**
 * This converts a number to the day of the week
 */
function convertDay(num) {
  switch (num) {
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    default:
      return "Saturday";
  }
}

// function clickOrigin(e){
//     let target = e.target;
//     let tag = [];
//     tag.tagType = target.tagName.toLowerCase();
//     tag.tagClass = target.className.split(' ');
//     tag.id = target.id;
//     tag.parent = target.parentNode;
//
//     return tag;
// }

// document.body.onclick = function(e){
//     let elem = clickOrigin(e);
//     if (elem.tagType == 'a'){
//         console.log('You\'ve clicked a monitored tag (' + elem.tagType + ', in this case).');
//         return false; // or do something else.
//     }
// };
//

/**
 * This converts a number to a month it represents
 */
function convertMonth(num) {
  switch (num) {
    case 0:
      return "January";
      break;
    case 1:
      return "February";
      break;
    case 2:
      return "March";
      break;
    case 3:
      return "April";
      break;
    case 4:
      return "May";
      break;
    case 5:
      return "June";
      break;
    case 6:
      return "July";
      break;
    case 7:
      return "August";
      break;
    case 8:
      return "September";
      break;
    case 9:
      return "October";
      break;
    case 10:
      return "November";
      break;
    default:
      return "December";
  }
}

function addLabelToDiv(label, inputdiv, content) {
  let outerdiv = document.createElement("div");
  outerdiv.setAttribute("class", "titlerow row align-items-center");
  let topdiv = document.createElement("div");
  topdiv.setAttribute("class", "col-10");
  let p = document.createElement("p");
  let title = document.createTextNode(label);
  p.setAttribute(
    "style",
    "padding-left:10px;padding-top:8px;margin-bottom:2px;"
  );
  p.appendChild(title);
  topdiv.appendChild(p);
  outerdiv.appendChild(topdiv);
  inputdiv.prepend(outerdiv);
  content.appendChild(inputdiv);
}

function getUrlFromArt(art) {
  return art[0][
    "Please upload an image of the art. Aspect ratios of 4:3 are preferred (and high-res) but any art is great! If you're getting this art from instagram we recommend https://ingramer.com/tools/instagram-photo-downloader/"
  ];
}

// ANALYTICS SETUP

let service, tracker, previous, currentChoice, previousChoice;
function startApp() {
  // Initialize the Analytics service object with the name of your app.
  service = analytics.getService('tab_4_blm_chrome_extension');
  //service.getConfig().addCallback(initAnalyticsConfig);

  // Get a Tracker using your Google Analytics app Tracking ID.
  tracker = service.getTracker('UA-172853637-1');

  // Start timing...
  // var timing = tracker.startTiming('Analytics Performance', 'Send Event');

  // Record an "appView" each time the user launches your app or goes to a new
  // screen within the app.
  tracker.sendAppView('TabView');

  // Record user actions with "sendEvent".
  tracker.sendEvent('Opened Tab', 'User Opened a New Tab');
  return tracker;
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//                                      MAIN METHOD                                   //
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

window.onload = function () {
  updateTime();
  addSavedItemsToList();
  showHideItems();
  mouseOffResources();
  displayTooLongSinceClick();
  monitorClicks(startApp());
  // addListener();
};

readTextFileArt("content/art.csv");
readTextFileResources("content/resources.csv");

// This updates every second in case the time changes
setInterval(updateTime, 1000);
