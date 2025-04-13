// routes/public.js
import {Router} from "express";
// Импортируйте контроллер для событий
import { getAllEvents,getEventById } from "../controllers/event.controller.js"; 
const router = Router();



// Публичный маршрут для получения событий
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
export default router;