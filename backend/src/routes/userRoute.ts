import { Router } from "express";
const router = Router();
import * as userController from '../controllers/userController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";

router.post('/createUser', userController.createUser);
router.get('/profileBooks', cookieJwtAuth, userController.getUserBooks);
router.get('/profileUser', cookieJwtAuth, userController.getUserById);


export default router;