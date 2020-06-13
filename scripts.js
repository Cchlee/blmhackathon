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
                document.body.style.backgroundImage = "url(\'" + convertGoogleImageToURL(selectedArtURL) + "\')";
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
                for (let i = 0; i < jsonResources.length; i++) {
                  let resource = jsonResources[i];
                  if (resource['Category'] === 'Petition') {
                    jsonSign.push(resource);
                  } else if (resource['Category'] === 'Donation fund') {
                    jsonDonate.push(resource);
                  } else {
                    jsonRead.push(resource);
                  }
                }

                let selectedPetition = getRandom(jsonSign, 1);
                document.getElementById("sign").href = selectedPetition[0]['URL to resource'];

                let selectedDonation = getRandom(jsonDonate, 1);
                document.getElementById("donate").href = selectedDonation[0]['URL to resource'];

                let selectedRead = getRandom(jsonRead, 1);
                document.getElementById("read").href = selectedRead[0]['URL to resource'];

            }
        }
    }
    rawFile.send(null);
}

//let csv is the CSV file with headers
function csvJSON(csv){
  let lines=csv.split("\n");
  let result = [];
  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  let headers=lines[0].split(",");
  for(let i=1;i<lines.length;i++){
      let obj = {};
      let currentline=lines[i].split(",");
      for(let j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
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

readTextFileArt('art.csv');
readTextFileResources('resources.csv');
