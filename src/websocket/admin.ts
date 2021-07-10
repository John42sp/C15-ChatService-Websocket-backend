import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService"
import { MessagesServices } from "../services/MessagesServices";

//arquivo de utilização principal do admin:  
//1º - listar todas conections sem admin_id(NULL) = primeiros contatos de usuário

//socket criado no http.ts, se connecta ao socket com metodo "connect"
io.on("connect", async (socket) => {
    const connectionsService = new ConnectionsService();      
    const messagesServices = new MessagesServices(); 

    //listagem todas conecções de usuários sem admin = com admin_id = NULL 
    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin()

    //agora apontar evento com todas coneccções 
    //emitir pelo io = emite pra todos os atendentes, todos adms que estiverem ouvindo evento.
    //Pelo socket,emitiria direto pro nosso usuário, veja exemplo no client.ts
    //socket.emit() emite somento pro usuario conectado aqui
    io.emit("admin_list_all_users", allConnectionsWithoutAdmin); //emitir evento, sendo ouvido no admin.js

    //socket.on() = 1 admin ouvindo evento do admin.js pelo params (recebendo o user_id em questão)
    //callback esta retornando todas menssagens pro admin.js (frontend)
    socket.on("admin_list_messages_by_user", async (params, callback) => {
        const { user_id } = params;

        const allMessages = await messagesServices.listByUser(user_id);//busca no banco todas menssagens douser

        callback(allMessages); //callback funciona como return
        //temos uma função dentrodo blocoe precisamos fazer um retorno dentro da função, usamos um 
        //callback = função de retorno pra quem chamou ela
        //quando fizer todo processo, retornará menssagems dentro do callback
    })

    //evento recebendo input do admin, emitido no admin.ts
    // depois que salvar menssagem, precisamos enviar menssagem pro usuario, 
    socket.on("admin_send_message", async params => {
        const { user_id, text } = params;
//criar e enviar menssagem do admin com o socket.id vigente
        await messagesServices.create({
            text,
            user_id,
            admin_id: socket.id //id do socket do administrador
        })
        //PRECISAMOS ID DO SOCKET DO USER DE DESTINO P ENVIAR MENSSAGEM ENTRE ADMIN E USER
        //pela informação do id do user_id, conseguimos id do socket (5ª aula, 58 mnts)  
        //no connectionsService temos toda informação do user id e socket id 
        // const connection = await connectionsService.findByUserId(user_id); ou
        const { socket_id } = await connectionsService.findByUserId(user_id);//definindo usuario destino mssg

        //enfim, emitir menssagem  do admin pro user, que esta ouvindo evento no chat.js
        //io.to() usuario de destino pelo socket_id dele,  esta repassando evento pro chat.js
        io.to(socket_id).emit("admin_send_to_client", {//Se user praadmin ou vise-versa, emite eventos io.to()
            text,
            socket_id: socket.id, //socket do admin

        });
        //agora fazer cliente ouvir este evento, la no chat.js
    });

    //evento vindo do admin.js (final aula5): saber qual usuario ainda sem atendimento
    //OBJETIVO: atualizar coneccção colocando um admin nela
    socket.on("admin_user_in_support", async params => {  //ouvindo evento pra atualizar usuario acima
        const { user_id } = params;
         await connectionsService.updateAdminID(user_id, socket.id) //socket.id = admin atual

    //agora temos que atualizar a lista la de cima novamente, agora esta conecção tera um administrador
    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin()

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin); 
    }) 
  
    
});