import { Router } from "express";
const router = Router();
import * as bookController from '../controllers/bookController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";
import * as elasticController from '../controllers/elasticController'
import { uploadSingle } from "../middlewares/localImageUpload";

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/addbook', uploadSingle, cookieJwtAuth,  bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

router.post('/books/likeDislike', cookieJwtAuth, bookController.likeDislikeBook)

router.get('/genres', bookController.getGenres)

// router.get('/search', bookController.searchBooks);

export default router;