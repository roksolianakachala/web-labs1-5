function BookedApartments({ bookings }) {
  return (
    <div className="booked-list">
      <h2>Список заброньованих квартир</h2>

      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              {booking.apartmentTitle} — ${booking.apartmentPrice} — {booking.apartmentLocation}
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас поки немає заброньованих квартир.</p>
      )}
    </div>
  );
}

export default BookedApartments;