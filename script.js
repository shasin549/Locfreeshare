let currentPosition = null;

const statusDiv = document.getElementById('status');
const latitudeSpan = document.getElementById('latitude');
const longitudeSpan = document.getElementById('longitude');
const getLocationBtn = document.getElementById('getLocationBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');

// Function to update the UI with location data
function updateUI(lat, lon) {
    latitudeSpan.textContent = lat;
    longitudeSpan.textContent = lon;
    statusDiv.textContent = 'Location acquired!';
    shareLocationBtn.disabled = false; // Enable the share button
}

// Function to handle location success
function onPositionSuccess(position) {
    currentPosition = position.coords;
    updateUI(currentPosition.latitude, currentPosition.longitude);
}

// Function to handle location error
function onPositionError(error) {
    let errorMessage = "An unknown error occurred.";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
    }
    statusDiv.textContent = `Error: ${errorMessage}`;
    console.error(error);
    shareLocationBtn.disabled = true;
}

// Function to get the location from the browser's API
function getLocation() {
    statusDiv.textContent = 'Getting location...';
    shareLocationBtn.disabled = true;

    if (navigator.geolocation) {
        // Options for high accuracy
        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds
            maximumAge: 0   // No cached location
        };
        navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, options);
    } else {
        statusDiv.textContent = 'Geolocation is not supported by this browser.';
        shareLocationBtn.disabled = true;
    }
}

// Function to share location via SMS
function shareLocation() {
    if (currentPosition) {
        const lat = currentPosition.latitude;
        const lon = currentPosition.longitude;

        // Create a Google Maps link with the coordinates
        const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
        
        // Encode the message to be safe for a URL
        const message = encodeURIComponent(`My current location is: ${mapLink}`);

        // Construct the SMS URI
        const smsUri = `sms:?body=${message}`;

        // Open the native SMS app
        window.location.href = smsUri;

    } else {
        alert("Please get your location first!");
    }
}

// Add event listeners to the buttons
getLocationBtn.addEventListener('click', getLocation);
shareLocationBtn.addEventListener('click', shareLocation);

// Automatically get the location when the page loads
window.addEventListener('load', getLocation);
