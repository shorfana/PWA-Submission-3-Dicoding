var dataPertandingan;
var dataTim;

var elKlasemen = () => {
  showLoader();
  var standings = getKlasemen()
  standings.then(data => {

    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    var html = '<center><h2>Klasemen saat ini cuy</h2></center>'
    data.standings.forEach(klass => {
      var detail = ''
      klass.table.forEach(dataTim => {
        detail += `<tr>
            <td>${dataTim.position}</td>
            <td><img class="responsive-img" width="35" height="35" src="${ dataTim.team.crestUrl || 'img/empty_badge.svg'}"> ${dataTim.team.name}</td>
            <td>${dataTim.playedGames}</td>
            <td>${dataTim.won}</td>
            <td>${dataTim.draw}</td>
            <td>${dataTim.lost}</td>
            <td>${dataTim.goalsFor}</td>
            <td>${dataTim.goalsAgainst}</td>
            <td>${dataTim.goalDifference}</td>
            <td>${dataTim.points}</td>
          </tr>`
      })

      html += `
        <div class="col s12 m12">
        <div class="card">
        <div class="card-content">
        <table class="responsive-table striped">
        <thead>
          <tr>
            <th>Posisi</th>
            <th>Tim</th>
            <th>Bermain</th>
            <th>Menang</th>
            <th>Seri</th>
            <th>Kalah</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Poin</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
    });
    let doc = document.getElementById('main-content');
    doc.innerHTML = html;
    hideLoader()
  })
}

var elPertandingan = () => {
  showLoader()
  var matches = getPertandingan()
  matches.then(data => {
    dataPertandingan = data;
    var matchdays = groupBy(data.matches, 'matchday');

    html = '<center><h2>Pertandingan</h2></center>'
    for (const key in matchdays) {
      if (key != 'null') {
        html += `
              <h5>Group stage - ${key} of 6</h5>
              <div class="row">
            `
        matchdays[key].forEach(tanding => {
          html += `
          <div class="col s12 m6 l6">
            <div class="card">
              <div class="card-content card-match">
              <div style="text-align: center"><h6>${dateToDMY(new Date(tanding.utcDate))}</h6></div>
                <div class="col s10">${tanding.homeTeam.name}</div>
                <div class="col s2">${tanding.score.fullTime.homeTeam}</div>
                <div class="col s10">${tanding.awayTeam.name}</div>
                <div class="col s2">${tanding.score.fullTime.awayTeam}</div>
              </div>
              </div>
            </div>
          </div>
            `
        });
        html += `
        </div>`
      }

    }
    let doc = document.getElementById('main-content');
    doc.innerHTML = html;
    hideLoader()
  })
}

var elTim = () => {
  showLoader()
  var teams = getTim()

  teams.then(data => {
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    
    dataTim = data
    var html = '<center><h2>TIM</h2></center>'
    html += '<div class="row">'
    data.teams.forEach(tim => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${tim.crestUrl || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${tim.name}</div>
            <div class="center">${tim.area.name}</div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small teal lighten-1" onclick="insertTeamListener(${tim.id})">Tambahkan Ke Favorit</a>
          </div>
        </div>
      </div>
    `
    })
    html += "</div>"
    let doc = document.getElementById('main-content');
    doc.innerHTML = html;
    hideLoader()
  })
}



var elTimFavorit = () => {
  showLoader()
  var teams = getTimfav()

  teams.then(data => {
    dataTim = data;
    var html = '<center><h2>TIM Favorit</h2></center>'
    html += '<div class="row">'
    data.forEach(tim => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${tim.crestUrl || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${tim.name}</div>
            <div class="center">${tim.area.name}</div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteTeamListener(${tim.id})">Delete</a>
          </div>
        </div>
      </div>
    `
    })

    if(data.length == 0) html += '<h6 class="Kamu tidak memiliki tim favorit!</6>'

    html += "</div>"
    let doc = document.getElementById('main-content');
    doc.innerHTML = html;
    hideLoader()
  })
}

// database operations
var dbx = idb.open('football', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('tim', { 'keyPath': 'id' })
  }
});



var insertTeam = (tim) => {
  dbx.then(db => {
    var tx = db.transaction('tim', 'readwrite');
    var store = tx.objectStore('tim')
    tim.createdAt = new Date().getTime()
    store.put(tim)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `${tim.name} berhasil disimpan!` })
    console.log('Pertandingan berhasil disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

var deleteTeam = (idTim) => {
  dbx.then(db => {
    var tx = db.transaction('tim', 'readwrite');
    var store = tx.objectStore('tim');
    store.delete(idTim);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Tim Sudah Di Hapus!' });
    elTimFavorit();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

var getTimfav = () => {
  return dbx.then(db => {
    var tx = db.transaction('tim', 'readonly');
    var store = tx.objectStore('tim');
    return store.getAll();
  })
}



var insertTeamListener = idTim => {
  var tim = dataTim.teams.filter(el => el.id == idTim)[0]
  insertTeam(tim);
}

var deleteTeamListener = idTim => {
  var c = confirm("Yakin Mau Hapus?")
  if (c == true) {
    deleteTeam(idTim);
  }
}

var showLoader = () => {
  var html = `<div class="preloader-wrapper medium active">
              <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
              </div>`
    let doc = document.getElementById('loader');          
    doc.innerHTML = html;
}

var hideLoader = () => {
  let doc = document.getElementById('loader');
  doc.innerHTML = '';
}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var dateToDMY = date => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

