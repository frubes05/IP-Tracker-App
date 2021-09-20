class IPaddress {
  constructor() {
    this.#bindEvents();
    this.searchBtn = document.querySelector(".search__button");
    this.input = document.querySelector("input");
    this.body = document.querySelector("body");
  }

  getUserIP() {
    let userIP = "89.172.83.71";
    this.fetchIPdata(userIP);
  }

  getOthersIP(e) {
    if (e.target.classList.contains("search__button")) {
      let value = this.input.value;
      this.fetchIPdata(value);
      this.input.value="";
    }
  }

  fetchIPdata(information) {
    let ip = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ip.test(information)) {
      fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_IkW3n7wpKN0oEe8LRNlNN8pQytB3o&ipAddress=${information}`
      )
        .then((res) => res.json())
        .then((data) => this.getLocation(data));
    } else {
      fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_IkW3n7wpKN0oEe8LRNlNN8pQytB3o&domain=${information}`
      )
        .then((res) => res.json())
        .then((data) => this.getLocation(data));
    }
  }

  getLocation(ipData) {
    console.log(ipData);
    let latitude = ipData.location.lat;
    let longitude = ipData.location.lng;
    if (document.querySelector("#mapid")) {
      document.querySelector("#mapid").remove();
    }
    let map = document.createElement("div");
    map.setAttribute("id", "mapid");
    this.body.appendChild(map);
    let mymap = L.map("mapid").setView([latitude, longitude], 13);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJ1YmVzMDUiLCJhIjoiY2t0c3BkY2o0MDExODJxcXRwZXQ4djEweSJ9.lyHaaEkHAW9t4dYnk_cO6g",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(mymap);

    const iconLocation = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>`,
      className: "",
      iconSize: [24, 40],
      iconAnchor: [12, 40],
    });

    L.marker([latitude, longitude], { icon: iconLocation }).addTo(mymap);

    let textElements = document.querySelectorAll(".parameters__text");
    textElements.forEach((elem, index) => {
      if (index === 0) {
        elem.innerHTML = `${ipData.ip}`;
      } else if (index === 1) {
        elem.innerHTML = `<span>${ipData.location.city}</span><span>${ipData.location.region}</span><span>${ipData.location.postalCode}</span>`;
      } else if (index === 2) {
        elem.innerHTML = `${ipData.location.timezone}`;
      } else if (index === 3) {
        elem.innerHTML = `${ipData.isp}`;
      }
    });
  }

  #bindEvents() {
    window.addEventListener("load", this.getUserIP.bind(this));
    document.body.addEventListener("click", this.getOthersIP.bind(this));
  }
}

new IPaddress();
