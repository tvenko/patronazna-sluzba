export class Pacient {
  constructor(
    public zavarovanje: number,

    public ime: string,
    public priimek: string,
    public naslov: string,
    public sifraOkolisa: number,

    public tel: string,

    public email: string,

    public datumRojstva: string,
    public spol: string,

    public geslo1: string,
    public geslo2: string,

    public razmerje?: string,

    // kontaktna oseba
    // pacienti za katere skrbi
    public osrkbovanci: Pacient[],


    ) { }
}
