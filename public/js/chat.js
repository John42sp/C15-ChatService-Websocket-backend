//ARQUIVO DE COMUNICAÇÃO ENTRE FRONTEND USER (ATENDIMENTO CHAT, CLIENT.HTML) E WEBSOCKET(CLIENT.TS)

let socket_admin_id = null;
let emailUser = null;
let socket = null;


document.querySelector("#start_chat").addEventListener("click", (event) => {
    // console.log('oi td bem')
     socket = io(); //conecção começa  quando usuer clica botão "iniciar chat"   

    const chat_help = document.getElementById("chat_help");
    chat_help.style.display = "none";

    const chat_in_support = document.getElementById("chat_in_support");
    chat_in_support.style.display = "block";

    const email = document.getElementById("email").value;
    emailUser = email;
    const text = document.getElementById("txt_help").value;

    //socket.on("connect".....) conectar ao servidor para poder emitir evento: socket.emit

    socket.on("connect", () => { //emitir evento para o cliente, sendo ouvido no client.ts

        const params = { email, text };
        socket.emit("client_first_access", params, (call, err) => {
            if(err) {
                console.err(err)
            } else {
                console.log(call)
            }

        })  
    });
    //inicio 5ª aula
    //ouvir novo evento vindo do client.js
    socket.on("client_list_all_messages", (messages) => {
        // console.log("messages: ", messages); 
        //colocar valor das variaveis no html (client.html) pelos templates.
        var template_client = document.getElementById("message-user-template").innerHTML;
        var template_admin = document.getElementById("admin-template").innerHTML;

        messages.forEach(message => {
            if(message.admin_id === null) { //verificar se menssagem não é do atendente -> admin_id null
                const rendered = Mustache.render(template_client, {
                    message: message.text, //no html, no span {{}}, dentro do script id=message-user-template" 
                    email  //acesso ao email la de cima
                })
                //renderiza na localhost:3333/pages/client
                document.getElementById('messages').innerHTML += rendered; //+= ira adicionara lista de msgs
            } else { //menssagem é do atendente-> admin_id preenchido
                const rendered = Mustache.render(template_admin, {
                    message_admin: message.text, //no html, dentro do span {{}}, script id="admin-template" 
                })
                //renderiza na localhost:3333/pages/client                
                document.getElementById('messages').innerHTML += rendered; //+= ira adicionara lista de msgs
            }
        })


    })
    //ouvir evendto do admin.ts, user recebendo menssagem de resposta do admin 
    socket.on("admin_send_to_client", message => {  //message traz menssagem do admin e socket id
        // console.log(message)  //message = resposta do admin ai user. 
        socket_admin_id = message.socket_id;
        //COLOCAR MENSSAGE DO ADMIN NO CHAT (FRONTEND) PARA USER VISUALISAR
        const template_admin = document.getElementById("admin-template").innerHTML;

        const rendered = Mustache.render(template_admin, {
            message_admin: message.text,  
        })
        document.getElementById("messages").innerHTML += rendered; 

    })

});

//janela chat usuer com admin: postando menssagem e emain pro proprio user, e enviando pro administrador
document.querySelector("#send_message_button").addEventListener("click", (event) => {
    const text = document.getElementById("message_user");

    //user enviar menssagem pro admin: precisa texto do user e socket do admin que user esta enviando
    //renderizar menssagem pro proprio user chat e pro admin chat
    const params = {
        text: text.value,
        socket_admin_id, //pegando da variavel global 
    }
    socket.emit("client_send_to_admin", params); //enviando evento pro client.ts

    //renderizar menssagem do user pro proprio user chat
    const template_client = document.getElementById("message-user-template").innerHTML;

    const rendered = Mustache.render(template_client, {
        message: text.value,
        email: emailUser
    })
    document.getElementById("messages").innerHTML += rendered; 

    text.value = ""; //pra limpar o campo input do admin apos enviado


});
