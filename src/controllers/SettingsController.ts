import { Request, Response } from 'express';
import { SettingsServices } from '../services/SettingServices';

//setting create 'chat' originalmente criado como true, valor boleano que deixara canal chat atendimento on
class SettingsController {

    async create(request:Request, response:Response) {

        const { chat, username } = request.body;

        const settingsService = new SettingsServices();

        try {
            const settings = await settingsService.create({chat, username });

            //DIVIDIR REGRA DE NEGÓCIO DO CONTROLLER, PASSAR CODIGO CREATE PRO 'SERVICES'        
            
                return response.json(settings);

        } catch(err){

            return response.status(400).json({
                message: err.message
            })
        }
    }
//ultima etapa 4ª aula, desabilitar atendimento / chat (metodo construido no SettingsServices.ts)
//por fim, implementar este metodo nas rotas para desabilitar atendimento 
    async findByUserName(request:Request, response:Response) {

        const { username } = request.params; //ven da url (function onload() no client.html)
        const settingsService = new SettingsServices();

        const settings = await settingsService.findByUserName(username);
        // console.log(settings)
        
        return response.json(settings)

    }

    async update(request:Request, response:Response) {

        const { username } = request.params; //ven da url (function onload() no client.html)
        const { chat } = request.body; //ven da url (function onload() no client.html)


        const settingsService = new SettingsServices();

        const settings = await settingsService.update(username, chat);
        
        return response.json(settings)

    }

}

export { SettingsController }