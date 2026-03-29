import { Link } from "react-router-dom";

function ApartmentCard({ apartment, onBook, onCancel }) {
  return (
    <div className="card">
      <div className="card-content">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="card-image"
        />

        <h3>{apartment.title}</h3>
        <p><strong>Ціна:</strong> ${apartment.price}</p>
        <p><strong>Кімнат:</strong> {apartment.rooms}</p>
        <p><strong>Тип:</strong> {apartment.type}</p>
        <p><strong>Локація:</strong> {apartment.location}</p>

        {apartment.description && (
          <p><strong>Опис:</strong> {apartment.description}</p>
        )}
      </div>

      <div className="card-buttons">
        <Link to={`/apartment/${apartment.id}`} className="details-button">
          Детальніше
        </Link>

        {apartment.booked ? (
          <button onClick={() => onCancel(apartment.id)}>
            Скасувати бронь
          </button>
        ) : (
          <button onClick={() => onBook(apartment)}>
            Забронювати
          </button>
        )}
      </div>
    </div>
  );
}

export default ApartmentCard;