function readJSON(path) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
          let file = new File([this.response], 'temp');
          let fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
            let csv = fileReader.result;
            console.log(csv);
               // let dict = JSON.parse(fileReader.result);
               // let featuredSites = getRandom(dict['Instagram sites'], 2);
               // document.getElementById("link1").href = featuredSites[0];
               // document.getElementById("link2").href = featuredSites[1];
               // console.log(featuredSites);
          fileReader.readAsText(file);
      }
    }
    xhr.send();
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

readJSON('art.csv');
