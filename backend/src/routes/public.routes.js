import {Router} from "express";
import { getAllEvents,getEventById } from "../controllers/event.controller.js"; 
const router = Router();

// Публичный маршрут для получения событий
router.get("/events", getAllEvents);
export default router;