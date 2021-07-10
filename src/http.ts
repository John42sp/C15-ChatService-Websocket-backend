//ESTE ARQUIVO CRIADO P/ FAZER TRABALHOS DO SERVER E ESTABELECER CONECCÇÃO WEBSOCKET, A QUAL SERÁ APROVEITADA NOS ARQUIVOS CLIENT.TS E ADMIN.TS
import 'reflect-metadata';
import express, { request, response } from 'express';
import { createServer } from 'http'; //vem com node, implementando pra uso no websocket
import { Server, Socket } from "socket.io"; //Socket é tipagem
import path from "path";

import './database'; //import o index.ts (aqrquico de conexão)
import { routes } from './routes';

const app = express();
//folder public para criar frontend, substitui o react
//"views" vem com node, para renderizar folder public,a ser acessado pelo browser
//configuração p/ comunicar com folder public
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile); //instalar yarn add ejs
app.set("view engine", "html");

//test
app.get("/pages/client", (request, response) => {
    return response.render("html/client.html")
})

app.get("/pages/admin", (request, response) => {
    return response.render("html/admin.html")
})

const http = createServer(app);  //criando protocolo http
const io = new Server(http);  //criando protocolo ws

//criar 2 arquivos de websocket: client.ts e admin,ts = sob o mesmo servido web socket. 
//a conecção feita aqui no server

//CRIAÇÃO DO SERVIDOR WEBSOCKET, A SER USADO NOS AQRQUIVOS CLIENT.TS E ADMIN.TS
//aqui usa metodo "connection", no client.ts e admin.ts, conecta ao socket com metodo "connect"
io.on("connection", (socket: Socket) => {  
    // console.log("Se conectou ao " + socket.id)
})

app.use(express.json());

app.use(routes);

export { http, io };