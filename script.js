const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	getMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 3,
		});
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '13',
		}).addTo(this.map)


		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('You are here')
		.openPopup()
        
	},

	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`${this.businesses[i].name}`)
			.addTo(this.map)
		}
	},
}



async function userloc(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

async function FS(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3lQWT811ApA9Aqc2kRlV9Fwo6SaeHADKv4K/umUB4y18='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function FSbizloc(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () => {
	const coords = await userloc()
	myMap.coordinates = coords
	myMap.getMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await FS(business)
	myMap.businesses = FSbizloc(data)
	myMap.addMarkers()
})


