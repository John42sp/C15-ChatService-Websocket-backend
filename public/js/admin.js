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
// //ponte entre frontend admin.html p/renderizar itens, e admin.ts(conecção com servidor, emitindo  ouvindo evts)
// const socket = io();
// let connectionsUsers = []; //pra passar connections do 'socket connections' e usar em outros metodos
// let connectionInSupport = []; //Cria uma variavel para armazenar os atendimentos

// socket.on("admin_list_all_users", connections => { //ouvir evento do admin.ts, de onde vem 'connections'
//     connectionsUsers = connections;

// //console.log(connections) //connectiosn= lista,se tiver alguma conecção, levar pro html p/interagir (frontend)

// //colocar cada conecção na tela
// //"" vazio p não duplicar cada nova conecção inserida, deixar lista atualizada
// document.getElementById("list_users").innerHTML = ""; //capturar div list_users no admin.html, 
                            

// //renderizar div cada id,  email e botões de cada conecção(user), para acesso do admin
// //por esta div, acaba colocando id na função call(id)
// let template = document.getElementById("template").innerHTML;  //dentro do <script>
// //mostrar cada conecção na tela, trazidas da admin.ts, com o seu socket_id
// connections.forEach(connection => {
//     const rendered = Mustache.render(template, {
//         email: connection.user.email,  //email vindo do relations do user, por isso desce user.email
//         id: connection.socket_id    //aqui esta colocando id do user em cada div renderizada no render abaixo
//     })
//     document.getElementById("list_users").innerHTML += rendered;
// })

// })

// //função no botão que admn clica e abre janela de chat com user, passa o id do user ao template
// //função coloca automatimamente o id de cada conecção em cada janela de contato, ver no admin.html
// function call(id) {    //id é parametro usado pra localizar cada conecção - função call no <script template>
//     const connection = connectionsUsers.find(      //find retorna 1 objeto
//         (connection) =>  connection.socket_id === id //retorna qual id que passarmos for igual ao soccket_id
//     ) 

//     connectionInSupport.push(connection); //Quando encontrar a conexao, coloca dentro do array de atendimentos

//     const template = document.getElementById("admin_template").innerHTML;

//     const rendered = Mustache.render(template, {
//         email: connection.user.email,  //email do devido user pra chat, vindo do relations do user
//         id: connection.user_id,  //ID do devido user,com que o botão acessa o devido usuário para batepapo
//     })
//     document.getElementById("supports").innerHTML += rendered;

//     //até aqui abriu janela de chat admincom user, mas precisa traser menssagens de ambos, juntas


   
//     const params = {                  //temos a connection disponivel, pegar o user_id da referida
//         user_id: connection.user_id,  //CUIDADO, DEVE TER VIRGULA NO FINAL, OU NÃO FUNCIONA
//       };

//     //params = o que iremos enviar para admin.ts (user_id em questão)
//     //messages = o que iremos receber do admin.ts (menssagens do user)

//     //FINAL AULA 5
//     //usuário precisa sair da lista de usuários sem administrador, assim que admin clica na sua tela o botão "Entrar em atendimento", QUE CHAMA FUNÇÃO CALL(())
//     socket.emit("admin_user_in_support", params) //enviar pra admin.ts


//     socket.emit("admin_list_messages_by_user", params, (messages) => {//params envia, messages recebe admin.ts
//         // console.log("Messages: ", messages) //teste no console, traz as menssagens de volta do admin.ts

//         //tendo o objeto de 'menssages', iremos popular elas para nossa tela:
//         //1 - pegar a div a ser preenchida no admin.html 
//         const divMessages = document.getElementById(`allMessages${connection.user_id}`);

//         //2 - iterar cada menssagem vinda e distinguir menssagem do user  e do admin
//         messages.forEach(message => {
//             const createDiv = document.createElement("div"); //criar um pouco de html aqui

//             if(message.admin_id === null) { //condição caso menssagem vinda seja do cliente:
//                 createDiv.className = "admin_message_client"; //colocando classe na div
//                 //colocando conteudo na div - usando librarydayjs formatar data, 
//                 createDiv.innerHTML = `<span>${connection.user.email}</span>`;
//                 createDiv.innerHTML += `<span>${message.text} </span>`;

//                 createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

//             } else {  //condição caso menssagem vinda sehja do admin
//                 createDiv.className = "admin_message_client"; //colocando classe na div
//                 //colocando conteudo na div - usando librarydayjs formatar data, 
//                 createDiv.innerHTML = `Atendente: <span>${message.text} </span>`;
//                 createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
//             }
//             divMessages.appendChild(createDiv);
//         })
       

//     })

// }

// //para admin enviar menssagem na janela abert pela função acima
// function sendMessage(id) {//pegar texto  pela tag <input type="text" id="send_message_{{id}}"/>, admin.html
//     const text = document.getElementById(`send_message_${id}`); //id do usuário, não da conecção
//     //text.value = texto input colocado nofontend pelo admin

//     const params = {
//         text: text.value,
//         user_id: id   //NÃO ENTENDI DE ONDE VEM ESTE ID ?????????????
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


//     //precisamos do email, data não contem, então pegamos da connections
//     //retorna uma conecção pra pegar o email
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
