const socket = io();
// console.log("from script");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log("Position error", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Arjun AK",
}).addTo(map);

const markers = {};
socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  // console.log(data);
  map.setView([latitude, longitude]);

  if (markers[id]) {
    // console.log("markers existed");
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    // console.log(markers[id]);
    // console.log("markers added", id, markers[id]);
  }
});
// console.log(markers);
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    console.log(markers[id]);
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log("deleted");
  }
});
