const socket = io(); // Connection request to Socket.io backend
console.log('ggg');

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.log(error);
            
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}

// Initialize the map
const map = L.map('map').setView([0, 0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

const markers = {};

// Listen for location updates from the server
socket.on('received-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // Update marker position if it already exists
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker if it doesn't exist
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    
    // Optional: Center map view (remove if it causes too much jumping)
    map.setView([latitude, longitude], 16);
});

// Handle disconnection and remove marker
socket.on('disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
