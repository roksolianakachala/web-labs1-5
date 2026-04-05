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
      alert("Помилка отримання квартир: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log("fetchBookings user:", user);

      const q = query(
        collection(db, "bookings"),
        where("userEmail", "==", user.email)
      );

      const querySnapshot = await getDocs(q);
      console.log("bookings count:", querySnapshot.docs.length);

      const data = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      console.log("bookings data:", data);
      setBookings(data);
    } catch (error) {
      console.error("Помилка отримання бронювань:", error);
      alert("Помилка отримання бронювань: " + error.message);
    }
  };

  const handleBook = async (apartment) => {
    console.log("CLICK on book");
    console.log("USER:", user);
    console.log("APARTMENT:", apartment);

    if (!user || !user.email) {
      alert("Увійдіть у систему, щоб бронювати квартиру");
      return;
    }

    const alreadyBooked = bookings.some(
      (booking) => booking.apartmentId === apartment.id
    );

    console.log("alreadyBooked:", alreadyBooked);

    if (alreadyBooked) {
      alert("Ви вже забронювали цю квартиру");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        apartmentId: apartment.id,
        apartmentTitle: apartment.title,
        apartmentPrice: apartment.price,
        apartmentLocation: apartment.location,
        userEmail: user.email,
        userName: user.displayName || "Користувач",
        createdAt: serverTimestamp(),
      });

      console.log("BOOKING SAVED, id:", docRef.id);
      alert("Бронювання додано");

      await fetchBookings();
    } catch (error) {
      console.error("Помилка бронювання:", error);
      alert("Помилка бронювання: " + error.message);
    }
  };

  const handleCancel = async (apartmentId) => {
    console.log("CANCEL booking for apartmentId:", apartmentId);
    console.log("USER:", user);

    if (!user || !user.email) {
      alert("Увійдіть у систему");
      return;
    }

    try {
      const q = query(
        collection(db, "bookings"),
        where("userEmail", "==", user.email),
        where("apartmentId", "==", apartmentId)
      );

      const querySnapshot = await getDocs(q);
      console.log("cancel query found:", querySnapshot.docs.length);

      for (const bookingDoc of querySnapshot.docs) {
        await deleteDoc(doc(db, "bookings", bookingDoc.id));
      }

      console.log("BOOKING CANCELLED");
      await fetchBookings();
    } catch (error) {
      console.error("Помилка скасування броні:", error);
      alert("Помилка скасування броні: " + error.message);
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