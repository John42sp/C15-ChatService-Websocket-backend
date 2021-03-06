const socket = io();
let connectionsUsers = [];
let connectionInSupport = []; //Cria uma variavel para armazenar os atendimentos

socket.on("admin_list_all_users", (connections) => {
  connectionsUsers = connections;
  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(id) {
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === id
  );

  connectionInSupport.push(connection); //Quando encontrar a conexao, coloca dentro do array de atendimentos

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit("admin_user_in_support", params);

  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<span>${connection.user.email} </span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date>${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id,
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date>${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )}`;

  divMessages.appendChild(createDiv);

  text.value = "";
}

socket.on("admin_receive_message", (data) => {
  const connection = connectionInSupport.find(
    (connection) => connection.socket_id === data.socket_id
  ); //Aqui utiliza o array de atendimento que foi inserido acima

  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`
  );

  const createDiv = document.createElement("div");

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} </span>`;
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs(
    data.message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);
});




















// //testar io.emit do admin.ts
// //ponte entre frontend admin.html p/renderizar itens, e admin.ts(conec????o com servidor, emitindo  ouvindo evts)
// const socket = io();
// let connectionsUsers = []; //pra passar connections do 'socket connections' e usar em outros metodos
// let connectionInSupport = []; //Cria uma variavel para armazenar os atendimentos

// socket.on("admin_list_all_users", connections => { //ouvir evento do admin.ts, de onde vem 'connections'
//     connectionsUsers = connections;

// //console.log(connections) //connectiosn= lista,se tiver alguma conec????o, levar pro html p/interagir (frontend)

// //colocar cada conec????o na tela
// //"" vazio p n??o duplicar cada nova conec????o inserida, deixar lista atualizada
// document.getElementById("list_users").innerHTML = ""; //capturar div list_users no admin.html, 
                            

// //renderizar div cada id,  email e bot??es de cada conec????o(user), para acesso do admin
// //por esta div, acaba colocando id na fun????o call(id)
// let template = document.getElementById("template").innerHTML;  //dentro do <script>
// //mostrar cada conec????o na tela, trazidas da admin.ts, com o seu socket_id
// connections.forEach(connection => {
//     const rendered = Mustache.render(template, {
//         email: connection.user.email,  //email vindo do relations do user, por isso desce user.email
//         id: connection.socket_id    //aqui esta colocando id do user em cada div renderizada no render abaixo
//     })
//     document.getElementById("list_users").innerHTML += rendered;
// })

// })

// //fun????o no bot??o que admn clica e abre janela de chat com user, passa o id do user ao template
// //fun????o coloca automatimamente o id de cada conec????o em cada janela de contato, ver no admin.html
// function call(id) {    //id ?? parametro usado pra localizar cada conec????o - fun????o call no <script template>
//     const connection = connectionsUsers.find(      //find retorna 1 objeto
//         (connection) =>  connection.socket_id === id //retorna qual id que passarmos for igual ao soccket_id
//     ) 

//     connectionInSupport.push(connection); //Quando encontrar a conexao, coloca dentro do array de atendimentos

//     const template = document.getElementById("admin_template").innerHTML;

//     const rendered = Mustache.render(template, {
//         email: connection.user.email,  //email do devido user pra chat, vindo do relations do user
//         id: connection.user_id,  //ID do devido user,com que o bot??o acessa o devido usu??rio para batepapo
//     })
//     document.getElementById("supports").innerHTML += rendered;

//     //at?? aqui abriu janela de chat admincom user, mas precisa traser menssagens de ambos, juntas


   
//     const params = {                  //temos a connection disponivel, pegar o user_id da referida
//         user_id: connection.user_id,  //CUIDADO, DEVE TER VIRGULA NO FINAL, OU N??O FUNCIONA
//       };

//     //params = o que iremos enviar para admin.ts (user_id em quest??o)
//     //messages = o que iremos receber do admin.ts (menssagens do user)

//     //FINAL AULA 5
//     //usu??rio precisa sair da lista de usu??rios sem administrador, assim que admin clica na sua tela o bot??o "Entrar em atendimento", QUE CHAMA FUN????O CALL(())
//     socket.emit("admin_user_in_support", params) //enviar pra admin.ts


//     socket.emit("admin_list_messages_by_user", params, (messages) => {//params envia, messages recebe admin.ts
//         // console.log("Messages: ", messages) //teste no console, traz as menssagens de volta do admin.ts

//         //tendo o objeto de 'menssages', iremos popular elas para nossa tela:
//         //1 - pegar a div a ser preenchida no admin.html 
//         const divMessages = document.getElementById(`allMessages${connection.user_id}`);

//         //2 - iterar cada menssagem vinda e distinguir menssagem do user  e do admin
//         messages.forEach(message => {
//             const createDiv = document.createElement("div"); //criar um pouco de html aqui

//             if(message.admin_id === null) { //condi????o caso menssagem vinda seja do cliente:
//                 createDiv.className = "admin_message_client"; //colocando classe na div
//                 //colocando conteudo na div - usando librarydayjs formatar data, 
//                 createDiv.innerHTML = `<span>${connection.user.email}</span>`;
//                 createDiv.innerHTML += `<span>${message.text} </span>`;

//                 createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

//             } else {  //condi????o caso menssagem vinda sehja do admin
//                 createDiv.className = "admin_message_client"; //colocando classe na div
//                 //colocando conteudo na div - usando librarydayjs formatar data, 
//                 createDiv.innerHTML = `Atendente: <span>${message.text} </span>`;
//                 createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
//             }
//             divMessages.appendChild(createDiv);
//         })
       

//     })

// }

// //para admin enviar menssagem na janela abert pela fun????o acima
// function sendMessage(id) {//pegar texto  pela tag <input type="text" id="send_message_{{id}}"/>, admin.html
//     const text = document.getElementById(`send_message_${id}`); //id do usu??rio, n??o da conec????o
//     //text.value = texto input colocado nofontend pelo admin

//     const params = {
//         text: text.value,
//         user_id: id   //N??O ENTENDI DE ONDE VEM ESTE ID ?????????????
//     }

//     socket.emit("admin_send_message", params);

//     //INSERIR MENSSAGEM DO ADMIN ENVIADA AO USER NA TELA DO ADMIN:
//     const divMessages = document.getElementById(`allMessages${id}`); 

//     const createDiv = document.createElement("div"); 
//     createDiv.className = "admin_message_admin"; 
//     createDiv.innerHTML = `Atendente: <span>${params.text} </span>`; //dayjs() cria horario atual
//     createDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;

//     divMessages.appendChild(createDiv);

//     text.value = ""; //pra limpar o campo input do admin apos enviado
// }

// //ouvindo evento do client.ts para renderizar menssagens do client na tela do admin
// socket.on("admin_receive_message", (data) => {
//     console.log(data);
//     console.log(data.socket_id)
//     // console.log(connectionsUsers) //vazio
//     console.log(connectionInSupport)


//     //precisamos do email, data n??o contem, ent??o pegamos da connections
//     //retorna uma conec????o pra pegar o email
//     const connection = connectionInSupport.find( 
//         (connection) =>  (connection.socket_id = data.socket_id)
//         );
    
    
    
//     console.log(connection)
//     const divMessages = document.getElementById(`allMessages${connection.user_id}`);
//     const createDiv = document.createElement("div"); 

//     createDiv.className = "admin_message_client"; //colocando classe na div
//     //colocando conteudo na div - usando librarydayjs formatar data, 
//     createDiv.innerHTML = `<span>${connection.user.email}</span>`;
//     createDiv.innerHTML += `<span>${data.message.text} </span>`;

//     createDiv.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

//     divMessages.appendChild(createDiv);

// })
