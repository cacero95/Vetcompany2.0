export interface User_pets {
    name:string;
    apellido?:string;
    url:string;
    email:string;
    direccion?:string;
    telefono?:string;
    mascotas?:Mascotas[];
    nMascotas?:number;
    Tasks?:Eventos[];
    type:string;
    veterinarias?:Veterinarias[];
    chats?:Chats[];
}
export interface Chats {
    
    nombre:string;
    mensaje?:Mensaje[];
    users?:Users[];
    url?:string;
    type?:string;
}
export interface Mensaje {
    contenido:string;
    url?:string;
    creador:Users;
}
export interface Users {
    name:string;
    apellido?:string;
    url?:string;
    email:string;
    direccion?:string;
    telefono?:string;
    mascotas?:Mascotas[];
    nMascotas?:number;
    tasks?:Eventos[];
    type:string;
    veterinarias?:Veterinarias[];
    chats?:Chats[];
    users?:User_pets[];
    services?:string[];
}
export interface Mascotas {
    pet_name:string;
    edad?:number;
    raza?:string;
    url?:string;
}
export interface Eventos {
    title:string;
    description:string;
    startTime:Date;
    endTime?:Date;
    destino?:Destino;
}
export interface Destino {
    name:string;
    url?:string;
    email:string;
}
export interface Veterinarias {
    name:string;
    direccion?:string;
    telefono?:string;
    email:string;
    url?:string;
    type:string;
    services?:string[];
    users?:User_pets[];
    tasks?:Eventos[];
    chats?:Chats[];
    valoracion?:number;
    calificaciones?:Calificaciones[];
}
export interface Calificaciones {
    name:string;
    usuario:string;
    estrellas?:number;
    comentario?:string;
}

export interface Google_login{
    displayName:string;
    email:string;
    photoURL:string;
    phoneNumber:any;
}
