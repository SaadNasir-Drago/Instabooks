import { Router } from "express";
const router = Router();
import * as bookController from '../controllers/bookController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/createBook', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', cookieJwtAuth, bookController.deleteBook);

// router.post('/books/like', cookieJwtAuth, bookController.likeBook)
export default router;