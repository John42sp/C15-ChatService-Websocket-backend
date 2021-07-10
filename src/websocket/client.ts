import { ConnectionOptionsReader } from "typeorm";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService"
import { MessagesServices } from "../services/MessagesServices";
import { UsersService } from "../services/UsersService"

interface IParams {
    text: string;
    email: string;
}
//CLIENT.TS = CONTROLLER QUE ORGANIZA AS CONECÇÕES USANDO SOCKET ID
//CLIENT.TS = extenssão do http.ts, PONTE ENTRE SERVIDOR WEBSOCKET COM REGRA DE NEGOCIO (CHAT CLIENT / USER)
//CLIENT.TS = UM CONTROLLER GERAL PARA MESCLAR VARIAS FUNCIONALIDADES, USANDO VARIOS SERVICES
//METODO "CONNECT" = RECEBENDO CONECÇÃO WEBSOCKET DO SERVIDOR
io.on("connect", (socket) => {  //aqui extender/reutilizar coneccção estabelecida no http.ts, com param socket
                                 //criar mesmo evento pro cliente e admin, não tem como diferenciar. então em evento pro cliente, colocaremos prefixo de cliente

       const connectionsService = new ConnectionsService();      
       const usersService = new UsersService();      
       const messagesServices = new MessagesServices();      

    //CLIENT.TS = LISTAR TODAS MENSSAGENS DO USER (recebe dados do front do user  com connectionService backend)
    //ouvir eventos vindos do frontend, emitidos no chat.js pelo 'socket.emit("client_first_access", params...'
    socket.on("client_first_access", async (params) => { //1º acesso, só precisara socket_id e user_id
         //1ª etapa: testando conecção da parte do cliente, o params vemdo chat.js
        //  console.log(params) 

         //verificar se usuário ja existe no banco, pelo params para guardar id do user nas conecções
        
        //2ª etapa:Salvar conecção com socket_id e user_id. Criou nova migração Conections

        const socket_id = socket.id
        const { text, email } = params as IParams; //apenas pra forçar assegurar  a tipagem dos parametros
        let user_id = null;  //var global criada para informar qual user_id no message.Service.create

        //Criar conecção - 1º Verificar se user já existe:
        const userExists = await usersService.findByEmail(email);

        if(!userExists) { //user ainda não existe, salvar na db. metodo create no service tbm salva
            const user = await usersService.create(email);  //criando user
            
            await connectionsService.create({ //criando conecção user ainda não existe
                socket_id,
                user_id: user.id
            })
            user_id = user.id;  // nesta condição, informando de onde vem user_id
        } else { //criar conecção, user já existe
            user_id = userExists.id;  // nesta condição, informando de onde vem user_id para salvar menssagens

            //verificar se coneccçaõ ainda não existe, pra não duplicar conecções no banco, 4ª aula, 55 mints
            const connection = await connectionsService.findByUserId(userExists.id);

            if(!connection) { //coneccção ainda não existia, criando agora!
                await connectionsService.create({
                    socket_id,
                    user_id: userExists.id
                })
            } else {//conecção já existia, pegar a conecção(socket) existente e sobscrever o socket_id existente
                connection.socket_id = socket_id;//sobscrevendo o valor no socket_id, mantera todas outras infos
                
                await connectionsService.create(connection); //aqui ele não cria novo, apenas troca o socket_id
            }                    
        }


        //até agora apenas salvou user e conecção no banco, ainda não salvou menssagem(text) 
        await messagesServices.create({
            user_id,  //vem de uma das condições acima, da variavel global
            text
        });

        //inicio 5ª aula, listar todas menssagens por usuer

        //acima, evento ouvido (socket.on) emitido do front chat.js 
        //abaixo, evento emitido do backend (socket.emit) usando messageService a ser ouvido pelo front admin.js
        
        const allMessages = await messagesServices.listByUser(user_id);

        //ao usar 'socket', emite novo evento, agora chamado "client_list_all_messages"
        //evento abaixo emitido e ouvidos no arquivo chat.js

        socket.emit("client_list_all_messages", allMessages)

        //PARA ADMIN PODER FAZER VARIOS ATENDIMENTOS, 5ª aula, 1,25 mnts, rever
        //pegar todos usuarios que estiverem conectados, se admin        
        const allUsers = await connectionsService.findAllWithoutAdmin();
        //emitir evento pra quem estiver ouvindo (aqui evento não tem um destino, ouvido por quem estiver )
        io.emit("admin_list_all_users", allUsers); 

    })          
    
    socket.on("client_send_to_admin", async params => { //params = a menssagem e pra qual admin

        const { text, socket_admin_id } = params;

        const socket_id = socket.id; //socket do user
        //não temos user_id, mas com socket_id do user, conseguimos resgatar o user_id
        const { user_id } = await connectionsService.findBySocketId(socket_id);//criando este metodo no  servi
        //salvar menssagem no banco e enviar pro administrador         
        const message = await messagesServices.create({
            text,
            user_id  //menssagem precisa conter id do user, que pode ser encontrado noid do socket do user
        })
        
        //enfim enviar menssagem pro administrador. Se user praadmin ou vise-versa, emite eventos io.to()
        io.to(socket_admin_id).emit("admin_receive_message" , { //emitindo evento pro admin.js ouvir
            message,
            socket_id, //socket_id do usuer
        });

    });
}); 