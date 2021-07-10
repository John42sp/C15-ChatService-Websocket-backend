import { Request, Response } from 'express';
import { MessagesServices } from '../services/MessagesServices';

class MessagesController {

    async create(request:Request, response:Response): Promise<Response> {

        const { admin_id, text, user_id } = request.body;

        const messagesService = new MessagesServices();

        try {
            const message = await messagesService.create({
                admin_id,  
                text,
                user_id
            });
            
                return response.json(message);

        } catch(err){
            
            return response.status(400).json({
                message: err
            })
        }
    }

    async showByUser(request:Request, response:Response) {

        const { id } = request.params;   //id = user_id

        const messagesService = new MessagesServices();

        const list = await messagesService.listByUser(id) //id = user_id no MessageService

        return response.json(list);

    }

}

export { MessagesController }