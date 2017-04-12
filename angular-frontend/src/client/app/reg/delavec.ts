export class Delavec {
  constructor(
    public uporabnik: string,
    public ime: string,
    public priimek: string,
    public vrsta_delavca: string,
    public naziv_delavca: string,
    public tel: string,

    public osebna_sifra: string,
    public sifra_ustanove: string,
    public naziv_ustanove: string,

    public email: string,
    public password: string,

    public sifra_okolisa?: string,
    public naziv_okolisa?: string,
    ) { }
}
