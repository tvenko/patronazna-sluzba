export class Pacient {
  constructor(
    public ime: string,
    public priimek: string,

    public eposta: string,
    public password: string,

    public telefon: string,

    public stevilkaPacienta: number,

    public ulica: string,
    public hisnaStevilka: string,
    public kraj: string,

    public datumRojstva: string,
    public spol: boolean,

    public sifra_okolisa: string,

    /*public kontaktIme?: string,
    public kontaktPriimek?: string,
    public kontaktTelefon?: string,
    public kontaktNaslov?: string,
    public kontaktSorodstvo?: string,
    */public kontaktnaOseba?: any,
    // kontaktna oseba
    // pacienti za katere skrbi
    public osrkbovanci?: Pacient[],

    ) { }
}
