// ITEMS

const deloreanAd = {
    title: "DMC Delorean",
    features: [
        "3 Cup Holders",
        "Superman Doors",
        "Fuzzy Dice!"
    ],
    img: "images/site/own_today.png",
};

const deloreanUpgrades = [
 { name: "Flux Capacitor", image: "images/upgrades/flux-cap.png", link: "#flux-capacitor" },
  { name: "Flame Decals", image: "images/upgrades/flame.jpg", link: "#flame-decals" },
  { name: "Bumper Stickers", image: "images/upgrades/bumper_sticker.jpg", link: "#bumper-stickers" },
  { name: "Hub Caps", image: "images/upgrades/hub-cap.jpg", link: "#hub-caps" }
];

const deloreanReviews = [
  { text: "So fast it’s almost like traveling in time.", rating: 4 },
  { text: "Coolest ride on the road.", rating: 4 },
  { text: "I’m feeling McFly!", rating: 5 },
  { text: "The most futuristic ride of our day.", rating: 4.5 },
  { text: "80’s livin and I love it!", rating: 5 }
];


// DELOREAN AD
function displayDeloreanAd() {
  const ad = document.querySelector("#delorean-ad");

  const card = document.createElement("div");
  card.className = "deloreanCard";

  const title = document.createElement("h2");
  title.textContent = deloreanAd.title;
  
  const features = document.createElement("ul");
  deloreanAd.features.forEach(feature => {
    const li = document.createElement("li");
    li.textContent = feature;
    features.appendChild(li);
  });

  const img = document.createElement("img");
  img.src = deloreanAd.img;
  img.alt = "Own Today";
  img.className = "ownImage";


  
  card.appendChild(title);
  card.appendChild(features);
  card.appendChild(img);


  ad.appendChild(card);
}


// UPGRADES

function displayUpgrades() {
  const upgrades = document.querySelector("#upgrades");

  const title = document.createElement("h2");
  title.textContent = "Delorean Upgrades";
  upgrades.appendChild(title);

  const list = document.createElement("div");

  deloreanUpgrades.forEach(upgrade => {
    const item = document.createElement("div");

    const img = document.createElement("img");
    img.src = upgrade.image;
    img.alt = upgrade.name;

    const link = document.createElement("a");
    link.href = upgrade.link;
    link.textContent = upgrade.name;

    item.appendChild(img);
    item.appendChild(link);
    list.appendChild(item);
  });

  upgrades.appendChild(list);
}


// REVIEWS

function displayReviews() {
  const reviews = document.querySelector("#reviews");

  const title = document.createElement("h2");
  title.textContent = "DMC Delorean Reviews";
  reviews.appendChild(title);

  const list = document.createElement("div");

  deloreanReviews.forEach(review => {
    const item = document.createElement("div");
    const rating = document.createElement("p");
    const text = document.createElement("p");
    text.textContent = `• “${review.text}”(${review.rating}/5)`;

    item.appendChild(text);
    item.appendChild(rating);
    list.appendChild(item);
  });

  reviews.appendChild(list);
}

//DISPLAY ITEMS
displayDeloreanAd();
displayUpgrades();
displayReviews();
