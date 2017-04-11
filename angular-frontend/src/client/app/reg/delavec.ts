export class Delavec {
  constructor(
    public ime: string,
    public priimek: string,
    public vrsta: string,
    public tel: string,

    public sifra1: number,
    public sifra2: number,

    public email: string,
    public geslo1: string,
    public geslo2: string,
    
    public sifraOkolisa?: string
    ) { }
}
