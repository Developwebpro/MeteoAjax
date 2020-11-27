const weatherIcons = {
    "Rain": "wi wi-day-rain",
    "Clouds": "wi wi-day-cloudy",
    "Clear": "wi wi-day-sunny",
    "Snow": "wi wi-day-snow",
    "mist": "wi wi-day-fog",
    "Storm": "wi-day-thunderstorm",
}

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true) {
	let ville;

if(withIP) {
	//Trouver l'IP de la personne qui ouvre la page
	const ip = await fetch('https://api.ipify.org?format=json')
		.then(resultat => resultat.json())
		.then(json => json.ip)
	//Récupérer la ville de l'utilisateur		
	ville = await fetch('http://api.ipstack.com/'+ ip +'?access_key=363a72469e7e37de6f33a054cf7b9a3a&output=json&legacy=1' + ip)
		.then(resultat => resultat.json())
		.then(json => json.city)
} else {
	ville = document.querySelector('#ville').textContent;
}

const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=53df4d58397ac2f38d1003e57251da06&lang=fr&units=metric`)
	.then(resultat => resultat.json())
	.then(json => json)

	//Afficher les infos sur la page
	displayWeatherInfos(meteo)
}

function displayWeatherInfos(data) {
	const name = data.name;
	const temperature = data.main.temp;
	const conditions = data.weather[0].main;
	const description = data.weather[0].description;

	document.querySelector('#ville').textContent = name;
	document.querySelector('#temperature').textContent = Math.round(temperature);
	document.querySelector('#conditions').textContent = capitalize(description);
	document.querySelector('i.wi').className = weatherIcons[conditions];
	document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#ville');
ville.addEventListener('click', () => {
	ville.contentEditable = true;
});

ville.addEventListener('keydown', (e) => {
	if(e.keyCode === 13){
		e.preventDefault();
		ville.contentEditable = false;
		main(false);
	}
})

main();