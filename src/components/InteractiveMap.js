function InteractiveMap({ apartments, selectedId, onSelect }) {
  return (
    <div className="map-container">
      <h2>Інтерактивна мапа</h2>
      <div className="map">
        {apartments.map((apartment) => (
          <button
            key={apartment.id}
            className={`map-marker ${selectedId === apartment.id ? "active" : ""}`}
            style={{
              left: `${apartment.coordinates.x}px`,
              top: `${apartment.coordinates.y}px`,
            }}
            onClick={() => onSelect(apartment.id)}
            title={apartment.title}
          >
            📍
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="map-info">
          Обрано:{" "}
          {
            apartments.find((apartment) => apartment.id === selectedId)?.title
          }
        </div>
      )}
    </div>
  );
}

export default InteractiveMap;
