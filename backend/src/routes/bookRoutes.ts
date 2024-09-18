import { Router } from "express";
const router = Router();
import * as bookController from '../controllers/bookController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', cookieJwtAuth, bookController.deleteBook);

export default router;