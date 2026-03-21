function ApartmentCard({ apartment, onBook, onCancel }) {
  return (
    <div className="card">
      <div className="card-content">
        <img src={apartment.image} alt={apartment.title} className="card-image" />

        <h3>{apartment.title}</h3>
        <p><strong>Ціна:</strong> ${apartment.price}</p>
        <p><strong>Кімнат:</strong> {apartment.rooms}</p>
        <p><strong>Тип:</strong> {apartment.type}</p>
        <p><strong>Локація:</strong> {apartment.location}</p>
      </div>

      <button
        onClick={() =>
          apartment.booked ? onCancel(apartment.id) : onBook(apartment.id)
        }
      >
        {apartment.booked ? "Скасувати" : "Забронювати"}
      </button>
    </div>
  );
}

export default ApartmentCard;
