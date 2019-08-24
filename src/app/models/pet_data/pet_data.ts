export interface PetData{
    descripcion:string;
    short:string;
    titulo:string;
    tipos:Tipos;
  }
  export interface Tipos {
    titulo:string;
    descripciones:Descs[];
  }
  export interface Descs {
    descripcion:string;
  }
  export interface PetInfo {
    policial:PetData[];
    tips:PetData[];
  }
  