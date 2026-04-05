import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ApartmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApartment();

  }, [id]);

  useEffect(() => {
    fetchReviews(page);
    
  }, [id, page]);

  const fetchApartment = async () => {
    try {
      const docRef = doc(db, "apartments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setApartment({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Помилка отримання квартири:", error);
    }
  };

  const fetchReviews = async (currentPage = 1) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/apartments/${id}/reviews?page=${currentPage}&limit=10`
      );

      const data = await response.json();
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Помилка отримання відгуків:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Спочатку увійдіть у систему");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Токен не знайдено. Виконайте вхід ще раз.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/apartments/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setText("");
        setPage(1);
        fetchReviews(1);
      } else {
        alert(data.message || "Не вдалося додати відгук");
      }
    } catch (error) {
      console.error("Помилка додавання відгуку:", error);
    }
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
                  <strong>{review.userEmail}</strong>
                  <p>{review.text}</p>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Назад
            </button>

            <span>
              Сторінка {page} з {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}