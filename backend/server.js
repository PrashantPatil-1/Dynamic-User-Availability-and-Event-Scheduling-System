// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define routes
import userRoutes from './routes/userRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
