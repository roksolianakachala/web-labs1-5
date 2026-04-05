import { useEffect, useMemo, useState } from "react";
import ApartmentList from "../components/ApartmentList";
import BookedApartments from "../components/BookedApartments";
import Filters from "../components/Filters";
import InteractiveMap from "../components/InteractiveMap";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [apartments, setApartments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const [filters, setFilters] = useState({
    sortByPrice: "",
    rooms: "",
    type: "",
  });

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const fetchApartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "apartments"));

      const data = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      setApartments(data);
    } catch (error) {
      console.error("Помилка отримання квартир:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userEmail", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      setBookings(data);
    } catch (error) {
      console.error("Помилка отримання бронювань:", error);
    }
  };

  const handleBook = async (apartment) => {
    if (!user || !user.email) {
      alert("Увійдіть у систему, щоб бронювати квартиру");
      return;
    }

    const alreadyBooked = bookings.some(
      (booking) => booking.apartmentId === apartment.id
    );

    if (alreadyBooked) {
      alert("Ви вже забронювали цю квартиру");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        apartmentId: apartment.id,
        apartmentTitle: apartment.title,
        apartmentPrice: apartment.price,
        apartmentLocation: apartment.location,
        userEmail: user.email,
        userName: user.displayName || "Користувач",
        createdAt: serverTimestamp(),
      });

      await fetchBookings();
    } catch (error) {
      console.error("Помилка бронювання:", error);
      alert(error.message);
    }
  };

  const handleCancel = async (apartmentId) => {
    if (!user || !user.email) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("userEmail", "==", user.email),
        where("apartmentId", "==", apartmentId)
      );

      const querySnapshot = await getDocs(q);

      for (const bookingDoc of querySnapshot.docs) {
        await deleteDoc(doc(db, "bookings", bookingDoc.id));
      }

      await fetchBookings();
    } catch (error) {
      console.error("Помилка скасування броні:", error);
    }
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

  const apartmentsWithBookingState = filteredApartments.map((apartment) => ({
    ...apartment,
    booked: bookings.some((booking) => booking.apartmentId === apartment.id),
  }));

  return (
    <div className="container">
      <h1>Платформа для оренди житла</h1>

      <Filters filters={filters} setFilters={setFilters} />

      {loading ? (
        <p>Завантаження квартир...</p>
      ) : (
        <ApartmentList
          apartments={apartmentsWithBookingState}
          onBook={handleBook}
          onCancel={handleCancel}
        />
      )}

      <BookedApartments bookings={bookings} />

      <InteractiveMap
        apartments={apartments}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}

export default Home;