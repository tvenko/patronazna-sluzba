export class Pacient {
  constructor(
    public ime: string,
    public priimek: string,

    public st_kartice: number,

    public datum_rojstva: string,
    public spol: boolean,

    public pacient_skrbnik: string,
    public sorodstveno_razmerje: any,

    ) { }
}
