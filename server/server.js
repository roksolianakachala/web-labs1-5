const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const { db, admin } = require("./firebaseAdmin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

const users = [];

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає токена" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Недійсний токен" });
  }
}

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Користувач";

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name: fullName,
    };

    users.push(newUser);

    res.status(201).json({
      message: "Користувача створено",
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка реєстрації" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний пароль" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка входу" });
  }
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Профіль користувача",
    user: req.user,
  });
});

app.get("/api/apartments/:id/reviews", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Firestore не підключено" });
    }

    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const snapshot = await db
      .collection("reviews")
      .where("apartmentId", "==", id)
      .get();

    const allReviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    allReviews.sort((a, b) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime;
    });

    const startIndex = (page - 1) * limit;
    const paginatedReviews = allReviews.slice(startIndex, startIndex + limit);

    res.json({
      total: allReviews.length,
      page,
      limit,
      totalPages: Math.ceil(allReviews.length / limit),
      reviews: paginatedReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання відгуків" });
  }
});

app.post("/api/apartments/:id/reviews", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Firestore не підключено" });
    }

    const { id } = req.params;
    const { text, userEmail, userName } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Текст відгуку обов'язковий" });
    }

    if (!userEmail || !userEmail.trim()) {
      return res.status(400).json({ message: "Email користувача обов'язковий" });
    }

    const newReview = {
      apartmentId: id,
      userEmail: userEmail.trim(),
      userName: userName ? userName.trim() : "Користувач",
      text: text.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("reviews").add(newReview);

    res.status(201).json({
      message: "Відгук додано",
      review: {
        id: docRef.id,
        apartmentId: id,
        userEmail: userEmail.trim(),
        userName: userName ? userName.trim() : "Користувач",
        text: text.trim(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка додавання відгуку" });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});