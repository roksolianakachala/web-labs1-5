import { useMemo, useState } from "react";
import { apartmentsData } from "../data/apartments";
import ApartmentList from "../components/ApartmentList";
import BookedApartments from "../components/BookedApartments";
import Filters from "../components/Filters";
import InteractiveMap from "../components/InteractiveMap";

function Home() {
  const [apartments, setApartments] = useState(apartmentsData);
  const [selectedId, setSelectedId] = useState(null);

  const [filters, setFilters] = useState({
    sortByPrice: "",
    rooms: "",
    type: "",
  });

  const handleBook = (id) => {
    setApartments((prev) =>
      prev.map((apartment) =>
        apartment.id === id ? { ...apartment, booked: true } : apartment
      )
    );
  };

  const handleCancel = (id) => {
    setApartments((prev) =>
      prev.map((apartment) =>
        apartment.id === id ? { ...apartment, booked: false } : apartment
      )
    );
  };

  const filteredApartments = useMemo(() => {
    let result = [...apartments];

    if (filters.rooms) {
      result = result.filter((apartment) => {
        if (filters.rooms === "4") return apartment.rooms >= 4;
        return apartment.rooms === Number(filters.rooms);
      });
    }

    if (filters.type) {
      result = result.filter((apartment) => apartment.type === filters.type);
    }

    if (filters.sortByPrice === "asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (filters.sortByPrice === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [apartments, filters]);

  return (
    <div className="container">
      <h1> Платформа для оренди житла</h1>
      <Filters filters={filters} setFilters={setFilters} />

      <ApartmentList
        apartments={filteredApartments}
        onBook={handleBook}
        onCancel={handleCancel}
      />

      <BookedApartments apartments={apartments} />

      <InteractiveMap
        apartments={apartments}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}

export default Home;