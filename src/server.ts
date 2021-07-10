import { http } from "./http"; //vem como default do express, aqui pratrabalhar junto com websocket
import "./websocket/client";
import "./websocket/admin";


//não usaremos mais o express para rodar o servidor, mas o 'http'
// app.listen(3333, () => console.log('Server running on port 3333!'));
http.listen(3333, () => console.log('Server running on port 3333!'));