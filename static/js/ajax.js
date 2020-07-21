const axios = require('axios').default

function loadXMLDoc() {
    axios.get("https://ddragon.leagueoflegends.com/api/versions.json").then(function (response) {
        console.log(response.data)
    }).catch(function (error) {
        console.log(error)
    })
}

loadXMLDoc()