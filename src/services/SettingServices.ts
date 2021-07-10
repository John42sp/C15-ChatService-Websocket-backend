import { getCustomRepository } from 'typeorm';
import { Setting } from '../entities/Settings';
import { SettingsRepository } from '../repositories/SettingsRepository';

//SETTINGS = PARA HABILITAR OU DESABILITAR A PARTE DO SUPORTE( ADMIN_ID NULL OU WITH ID )
//DESABILITAR INICIA NO MÉTODO FINDBYUSERNAME, A SER USADO NO SETTINGSCONTROLLER.TS
//A FUNCTION ONLOAD() NO CLIENT.HTML FAZ OCULTAR A PARTE DO CHAT 

interface ISettingsCreate {
    chat: boolean;
    username: string;
}
//services pegara infos do req.body do controller e processara, e retornará resultado p controller tratar como return

class SettingsServices {
    async create({ chat, username } : ISettingsCreate) {
        const settingsRepository = getCustomRepository(SettingsRepository);

        //VALIDAÇÃO = Sellect * from settings where username = "username" limit 1
        const userAlreadyExists = await settingsRepository.findOne({username})

        if(userAlreadyExists) {
            throw new Error('User already exists!')
        }
    
        //criar uma representação do objeto, e tbm de fato, salvar
    
       const settings =  settingsRepository.create({
            chat,
            username  //demais itens da tabela (id, create, update))serão criados automaticamente
        })
    
        //create substitui abaixo:
        // const settings = new settings();
        // settings.chat;
        // settings.username;
    
        await settingsRepository.save(settings);

        return settings;
    }
    //ultima etapa da aula 4, metodo p/ desabilitar o serviço de atentimento (chat), usado em SETTINGSCONTROLLER
    //metodo ira retornar configurações do usuário
    async findByUserName(username: string) {
        const settingsRepository = getCustomRepository(SettingsRepository);

        const settings =  await settingsRepository.find({
            username  
        })
        return settings;
    }

    //alterar pelo typeorm o valor boleano do paramentro na rota (username como admin) 
    async update(username: string, chat: boolean) {
        const settingsRepository = getCustomRepository(SettingsRepository);
        //"para ampliar conhecimento em typeorm, atualizar o 'createQueryBuilder' invez do met. update
        await settingsRepository.createQueryBuilder(). //await settingsRepository.update  do typeorm
        update(Setting) //metodo update do typeorm, recrutando entitade Setting
        .set({chat}) //vem do re.body
        .where("username = :username", {  //  :username = dois pontos indica que é parametro, virá da url
            username  //vira do req.params
        })
        .execute();
    }
}

export { SettingsServices }