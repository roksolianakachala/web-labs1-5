import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ApartmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchApartment();
    fetchReviews();
  }, [id]);

  const fetchApartment = async () => {
    const docRef = doc(db, "apartments", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setApartment({ id: docSnap.id, ...docSnap.data() });
    }
  };

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"), where("apartmentId", "==", id));
    const querySnapshot = await getDocs(q);

    const reviewsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setReviews(reviewsData);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Спочатку увійдіть у систему");
      return;
    }

   await addDoc(collection(db, "reviews"), {
      apartmentId: id,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "Користувач",
      text,
      createdAt: serverTimestamp()
   });

    setText("");
    fetchReviews();
  };

  if (!apartment) return <p>Завантаження...</p>;

  return (
  <div className="apartment-details">
    <img
      src={apartment.image}
      alt={apartment.title}
      className="details-image"
    />

    <div className="details-content">
      <h1>{apartment.title}</h1>

      <p className="description">{apartment.description}</p>

      <div className="info">
        <p><strong>📍 Локація:</strong> {apartment.location}</p>
        <p><strong>💰 Ціна:</strong> {apartment.price} грн/міс</p>
        <p><strong>🛏 Кімнати:</strong> {apartment.rooms}</p>
        <p><strong>🏠 Тип:</strong> {apartment.type}</p>
      </div>

      <div className="reviews">
        <h2>Відгуки</h2>

        {user ? (
          <form onSubmit={handleAddReview} className="review-form">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишіть відгук..."
              required
            />
            <button type="submit">Додати</button>
          </form>
        ) : (
          <p className="no-auth">
            Лише авторизовані користувачі можуть залишати відгуки
          </p>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">Відгуків поки немає</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <strong>{review.userName || review.userEmail}</strong>
                <p>{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
}