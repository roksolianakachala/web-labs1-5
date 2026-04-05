import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function InteractiveMap({ apartments, selectedId, onSelect }) {
  const defaultCenter = [49.0, 31.0];

  const selectedApartment = apartments.find(
    (apartment) => apartment.id === selectedId
  );

  const center =
    selectedApartment && selectedApartment.lat && selectedApartment.lng
      ? [selectedApartment.lat, selectedApartment.lng]
      : defaultCenter;

  return (
    <div className="map-container">
      <h2>Інтерактивна мапа</h2>

      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {apartments
          .filter((apartment) => apartment.lat && apartment.lng)
          .map((apartment) => (
            <Marker
              key={apartment.id}
              position={[apartment.lat, apartment.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelect(apartment.id),
              }}
            >
              <Popup>
                <strong>{apartment.title}</strong>
                <br />
                {apartment.location}
                <br />
                ${apartment.price}
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {selectedApartment && (
        <div className="map-info">
          Обрано: {selectedApartment.title}
        </div>
      )}
    </div>
  );
}

export default InteractiveMap;