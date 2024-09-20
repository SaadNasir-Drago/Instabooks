import { Router } from "express";
const router = Router();
import * as userController from '../controllers/userController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";

// router.get('/user/:id', bookController.getBookById);
router.post('/createUser', userController.createUser);
// router.put('/books/:id', bookController.updateBook);
// router.delete('/books/:id', cookieJwtAuth, bookController.deleteBook);

export default router;