const API_KEY = '36e41e559bfe44b7a4112ff2cd4a7b5c'
const LEAGUE_ID = 2002
var base_url = "https://api.football-data.org/v2/";
var urlKlasemen = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`
var urlPertandingan = `${base_url}competitions/${LEAGUE_ID}/matches`
var urlTim = `${base_url}competitions/${LEAGUE_ID}/teams`

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}

var status = response => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);

    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

var json = response => {
  return response.json();
}

var error = error => {
  console.log("Error: " + error);
}

var getKlasemen = () => {
  var fetK = fetchApi(urlKlasemen)
    .then(status)
    .then(json);
  return fetK;
}

var getPertandingan = () => {
  var fetP = fetchApi(urlPertandingan)
    .then(status)
    .then(json);
  return fetP;
}

var getTim = () => {
  var fetT = fetchApi(urlTim)
    .then(status)
    .then(json);
  return fetT;
}