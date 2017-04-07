export interface DelovniNalog {
  zdravila: Zdravilo[];
  materiali: Material[];
  prviDatum: Date;
  zadnjiDatum: Date;
  steviloObiskov: number;
  obvezen: string;
  vrstaObiska: string;
  interval: number;
}

export interface Zdravilo {
  sifra: any;
  naziv: string;
  opis: string;
}

export interface Material {
  id: any;
  opis: string;
}
