const utilities = require("../utilities/")
const fetch = require("node-fetch")
const baseController = {}



const url = 'https://three40demo-zfm1.onrender.com/';


async function fetchHTML() {
  try {
    const response = await fetch(url);

    if (response === undefined) {
      throw new Error('Network error! Response is undefined.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML received:', html);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Llama a la función para obtener el HTML de la página web
fetchHTML();

// Configura una solicitud cada 14 minutos (840,000 milisegundos)
const intervalMinutes = 14;
const intervalMilliseconds = intervalMinutes * 60 * 1000;

setInterval(fetchHTML, intervalMilliseconds);


baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController