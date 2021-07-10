import { Router } from 'express';
import { SettingsController } from './controllers/SettingsController';
import { UsersController } from './controllers/UsersController';
import { MessagesController } from './controllers/MessagesController';


const routes = Router();

const settingsController = new SettingsController();
const userscontroller = new UsersController();
const messagescontroller = new MessagesController();


routes.post("/settings", settingsController.create)
routes.get("/settings/:username", settingsController.findByUserName) //rota para desabilitar atendimento
routes.put("/settings/:username", settingsController.update) 

routes.post("/users", userscontroller.create)

routes.post("/messages", messagescontroller.create) //rota em protocolo http apenas p/ testar, mas será websocket
routes.get("/messages/:id", messagescontroller.showByUser) //id = user_id

export { routes };