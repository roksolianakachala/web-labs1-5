import ApartmentCard from "./ApartmentCard";

function ApartmentList({ apartments, onBook, onCancel }) {
  return (
    <div className="grid">
      {apartments.length > 0 ? (
        apartments.map((apartment) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            onBook={onBook}
            onCancel={onCancel}
          />
        ))
      ) : (
        <p>У базі даних поки немає квартир.</p>
      )}
    </div>
  );
}

export default ApartmentList;