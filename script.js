const apartments = [
  {
    id: 1,
    title: "Студія в центрі",
    address: "Київ, вул. Хрещатик, 12",
    rooms: 1,
    price: 1500,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Квартира-студія",
    available: true,
    city: "Київ"
  },
  {
    id: 2,
    title: "Двокімнатна біля метро",
    address: "Київ, просп. Перемоги, 45",
    rooms: 2,
    price: 2100,
    image: "https://plus.unsplash.com/premium_photo-1676321046262-4978a752fb15?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Двокімнатна квартира",
    available: true,
    city: "Київ"
  },
  {
    id: 3,
    title: "Сімейна квартира",
    address: "Львів, вул. Городоцька, 88",
    rooms: 3,
    price: 2700,
    image: "https://plus.unsplash.com/premium_photo-1736194027911-c9ba731f330d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Трикімнатна квартира",
    available: true,
    city: "Львів"
  }
];

const apartmentList = document.getElementById("apartmentList");
const bookingList = document.getElementById("bookingList");
const toggleApartmentsBtn = document.getElementById("toggleApartmentsBtn");
const navInfo = document.getElementById("navInfo");
const mapInfo = document.getElementById("mapInfo");
const contactForm = document.getElementById("contactForm");
const formResult = document.getElementById("formResult");

function renderApartments() {
  apartmentList.innerHTML = "";

  let i = 0;

  do {
    const apartment = apartments[i];

    const card = document.createElement("section");
    card.className = "card";
    card.setAttribute("role", "listitem");
    card.setAttribute("data-id", apartment.id);

    let statusClass = "";
    let statusText = "";
    let buttonText = "";
    let buttonDisabled = "";

    if (apartment.available) {
      statusClass = "available";
      statusText = "Доступна";
      buttonText = "Забронювати";
      buttonDisabled = "";
    } else {
      statusClass = "booked";
      statusText = "Заброньовано";
      buttonText = "Недоступно";
      buttonDisabled = "disabled";
    }

    card.innerHTML = `
      <img src="${apartment.image}" alt="${apartment.alt}" />
      <div class="card-body">
        <h3>${apartment.title}</h3>
        <p class="meta"><strong>Адреса:</strong> ${apartment.address}</p>
        <p class="meta"><strong>Кімнат:</strong> ${apartment.rooms}</p>
        <p class="price">₴ ${apartment.price} / ніч</p>
        <span class="status ${statusClass}">${statusText}</span>
        <button class="btn book-btn" type="button" data-id="${apartment.id}" ${buttonDisabled}>
          ${buttonText}
        </button>
      </div>
    `;

    apartmentList.appendChild(card);
    i++;
  } while (i < apartments.length);

  styleCards();
  addBookingHandlers();
}

function styleCards() {
  const cards = document.querySelectorAll(".card");

  for (let i = 0; i < cards.length; i++) {
    if (i % 2 === 0) {
      cards[i].style.backgroundColor = "#fcfcff";
    } else {
      cards[i].style.backgroundColor = "#f9fafb";
    }
  }
}

toggleApartmentsBtn.addEventListener("click", function () {
  if (apartmentList.classList.contains("hidden")) {
    apartmentList.classList.remove("hidden");
    toggleApartmentsBtn.textContent = "Приховати список квартир";
  } else {
    apartmentList.classList.add("hidden");
    toggleApartmentsBtn.textContent = "Показати список квартир";
  }
});

const navLinks = document.querySelectorAll(".nav-list a");

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("mouseenter", function () {
    const description = this.getAttribute("data-description");

    if (description) {
      navInfo.textContent = description;
    } else {
      navInfo.textContent = "Опис відсутній";
    }
  });

  navLinks[i].addEventListener("mouseleave", function () {
    navInfo.textContent = "Наведіть курсор на пункт меню, щоб побачити опис.";
  });

  navLinks[i].addEventListener("click", function () {
    navInfo.textContent = `Ви відкрили розділ: ${this.textContent}`;
  });
}

function addBookingHandlers() {
  const bookButtons = document.querySelectorAll(".book-btn");

  for (let i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener("click", function () {
      const apartmentId = Number(this.getAttribute("data-id"));
      bookApartment(apartmentId);
    });
  }
}

function bookApartment(id) {
  const apartment = apartments.find(item => item.id === id);

  if (!apartment) {
    return;
  }

  if (apartment.available) {
    apartment.available = false;

    const booking = document.createElement("div");
    booking.className = "booking";
    booking.setAttribute("data-id", apartment.id);
    booking.innerHTML = `
      <h3>${apartment.title}</h3>
      <p><strong>Адреса:</strong> ${apartment.address}</p>
      <p><strong>Ціна:</strong> ₴ ${apartment.price} / ніч</p>
      <p><strong>Статус:</strong> Підтверджено ✅</p>
      <button class="btn cancel-btn" type="button" data-id="${apartment.id}">
        Скасувати бронювання
      </button>
    `;

    bookingList.appendChild(booking);
    renderApartments();
    addCancelHandlers();
  } else {
    alert("Ця квартира вже заброньована.");
  }
}

function cancelBooking(id) {
  const apartment = apartments.find(item => item.id === id);

  if (!apartment) {
    return;
  }

  apartment.available = true;

  const bookingItem = bookingList.querySelector(`.booking[data-id="${id}"]`);
  if (bookingItem) {
    bookingItem.remove();
  }

  renderApartments();
}

function addCancelHandlers() {
  const cancelButtons = document.querySelectorAll(".cancel-btn");

  for (let i = 0; i < cancelButtons.length; i++) {
    cancelButtons[i].addEventListener("click", function () {
      const apartmentId = Number(this.getAttribute("data-id"));
      cancelBooking(apartmentId);
    });
  }
}


contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  formResult.innerHTML = "";

  if (name === "" || email === "" || message === "") {
    formResult.innerHTML = `<p class="message-error">Будь ласка, заповніть усі поля форми.</p>`;
  } else {
    const messageBlock = document.createElement("div");
    messageBlock.className = "form-message";
    messageBlock.innerHTML = `
      <h3>Повідомлення надіслано</h3>
      <p><strong>Ім’я:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Повідомлення:</strong> ${message}</p>
    `;

    formResult.appendChild(messageBlock);
    contactForm.reset();
  }
});


const markers = document.querySelectorAll(".map-marker");

for (let i = 0; i < markers.length; i++) {
  markers[i].addEventListener("click", function () {
    const id = Number(this.getAttribute("data-id"));
    const apartment = apartments.find(item => item.id === id);

    if (apartment) {
      mapInfo.innerHTML = `
        <h3>${apartment.title}</h3>
        <p><strong>Місто:</strong> ${apartment.city}</p>
        <p><strong>Адреса:</strong> ${apartment.address}</p>
        <p><strong>Кімнат:</strong> ${apartment.rooms}</p>
        <p><strong>Ціна:</strong> ₴ ${apartment.price} / ніч</p>
        <p><strong>Статус:</strong> ${apartment.available ? "Доступна" : "Заброньовано"}</p>
      `;

      highlightApartmentCard(id);
    }
  });
}

function highlightApartmentCard(id) {
  const cards = document.querySelectorAll(".card");

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("highlight");

    if (Number(cards[i].getAttribute("data-id")) === id) {
      cards[i].classList.add("highlight");
    }
  }
}

renderApartments();
addCancelHandlers();
