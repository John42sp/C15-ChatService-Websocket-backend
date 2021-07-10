import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';


//services pegara infos do req.body do controller e processara, e retornará resultado p controller tratar como return

class UsersService {
    async create( email: string ) {
        //Validação de usuario existe
        
        const usersRepository = getCustomRepository(UsersRepository);

        const userExists = await usersRepository.findOne({email})

        //Se existir, retornar user
        if(userExists) {
            return userExists;
        }
    
       //Se não existir, cria e salva no DB
    
       const user =  usersRepository.create({
            email,
        })
        
        await usersRepository.save(user);

        return user;
    }

    async findByEmail(email: string) { //para verificar no client.ts se conecction já existe pelo user
        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findOne({
          email,
        });
        return user;
      }
}


export { UsersService }