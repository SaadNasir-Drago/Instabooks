import { Router } from "express";
const router = Router();
import * as bookController from '../controllers/bookController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books/create', cookieJwtAuth, bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

router.post('/books/likeDislike', cookieJwtAuth, bookController.likeDislikeBook)

router.get('/genres', bookController.getGenres)

export default router;