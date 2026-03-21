function BookedApartments({ apartments }) {
  const booked = apartments.filter((apartment) => apartment.booked);

  return (
    <div className="booked-list">
      <h2>Список заброньованих квартир</h2>
      {booked.length === 0 ? (
        <p>Ще немає заброньованих квартир.</p>
      ) : (
        <ul>
          {booked.map((apartment) => (
            <li key={apartment.id}>
              {apartment.title} — ${apartment.price} — {apartment.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookedApartments;