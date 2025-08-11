const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  const map = L.map("map").setView([0, 0], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markers = {};

  socket.on("new-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  });

  socket.on("new-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    // Adjust map to fit all markers
    const group = L.featureGroup(Object.values(markers));
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
    console.log(group)
  });
}
