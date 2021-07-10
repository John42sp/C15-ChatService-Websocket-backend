import { getCustomRepository, Repository } from 'typeorm';
import { Message } from '../entities/Message';
import { MessagesRepository } from '../repositories/MessagesRepository';

interface IMessageCreate { //se admin_id não vier preenchido, message partiu do user, se não, do admin
    admin_id?: string;  //?: pode ser nulo = item pode vir preenchido ou não na conversa, sempre com user_id
    text: string;
    user_id: string;
}

class MessagesServices {
    //criando repo como atributo geral da classe, não em cada metodo.  
    private messagesRepository: Repository<Message>

    constructor() {
        this.messagesRepository = getCustomRepository(MessagesRepository)
    }

    async create( { admin_id, text, user_id }: IMessageCreate ) {
        //Validação de usuario existe
        
        // const messagesRepository = getCustomRepository(MessagesRepository);

        const message =  this.messagesRepository.create({
            admin_id,
            text,
            user_id
        })
        // keyword this referenciará como atrib classe
        await this.messagesRepository.save(message);

        return message;
    }

    //lista de menssagems/historico de cada usuário
    async listByUser(  user_id: string ) {

        // const messagesRepository = getCustomRepository(MessagesRepository);

        //trazer list/histórico de menssagens de cada usuário
        const list = await this.messagesRepository.find({
           // user_id, //assim apenas trará a lista de menssagens com ids de user e admin, texto e created_at

           //trazer lista de menssagens com relations, todos detalhes do user
           where: {user_id},
           relations: ['user']
        });

        return list;


    }

}

export { MessagesServices }