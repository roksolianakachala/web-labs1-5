function Contacts() {
  return (
    <div className="contacts-page">
      <section className="contacts-card">
        <div className="contacts-form-block">
          <h1>Контакти</h1>
          <p className="contacts-subtitle">
            Напишіть нам — ми відповімо якнайшвидше.
          </p>

          <form className="contacts-form">
            <label>
              Ім'я
              <input type="text" placeholder="Ваше ім'я" />
            </label>

            <label>
              Email
              <input type="email" placeholder="name@example.com" />
            </label>

            <label>
              Повідомлення
              <textarea placeholder="Ваше повідомлення..." rows="6"></textarea>
            </label>

            <button type="submit" className="contact-btn">
              Надіслати
            </button>
          </form>
        </div>

        <div className="contacts-info">
          <h2>RentHome</h2>
          <p><strong>Адреса:</strong> Київ, вул. Прикладна, 1</p>
          <p><strong>Телефон:</strong> +380 (44) 123-45-67</p>
          <p><strong>Email:</strong> support@renthome.ua</p>
          <p className="contacts-note">
            Працюємо щодня 09:00–20:00. Підтримка бронювань — у пріоритеті.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Contacts;