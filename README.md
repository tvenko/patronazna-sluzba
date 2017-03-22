# Patronažna služba
Projekt pri predmetu Tehnologije programske opreme na Fakulteti za računalništvo in informatiko Univerze v Ljubljani,
kjer sodelujemo s podjetjem [Parsek](http://parsek.com/) pri razvijanju aplikacije za uporabo pri patronažni službi.

## Patronažna sestra
Izvaja različne vrste obiskov:
* Preventivni
  - Obisk nosečnice
  - Obisk novorojenčka in otročnice
  - Preventiva starostnika
* Kurativni
  - Aplikacija injekcij
  - Odvzem krvi
  - Kontrola zdravstvenega stanja
  
Vsaka patronažna sestra pokriva določen okoliš.
Implementirati je potrebno tudi nadomeščanje neke patronažne sestre:
* njene DN prevzame neka druga sestra
* upoštevati jih mora pri izdelavi svojega plana
* prerazporeditve izvaja vodja patronažne službe

Pregled opravljenih obiskov in obračun storitev:
* seznami obiskov po različnih kriterijih
* obračun storitev na podlagi cenika
* obračun stroškov poti


## Delovni nalog

Obiski se izvajajo na podlagi delovenga naloga.
Delovni nalog lahko izda zdravnik ali vodja patronažne službe, vsebuje:
* podatke o pacientu
* ime bolezni
* vrsto obiska
* datum obiska
* število obiskov
* časovno obdobje ali interval med dvema obiskoma
* podatke o potrebnih storitvah, zdravilih, materialu ipd. v obliki prostega besedila
* ime zdravnika ali vodje patronažne službe, ki je nalog izdal

[Obstoječi obrazec](http://pisrs.si/Pis.web/npb/2016-01-0008-2013-01-3779-npb2-p14.pdf) delovnega naloga v fizični obliki je treba dopolniti:
- vpeljati dodatne podatke
- vpeljati strukturiranost namesto prostega besedila
- Standardizrati želimo nabor aktivnosti za vsako vrsto obiska:
  - kot opomnik patronažni sestri
  - kot osnova za poročilo o obisku
  - kot podlaga za seznam potrebnega materiala, ki ga mora patronažna sestra vzeti s sabo

## Planiranje obiskov
* patronažni sestri se avtomatsko dodelijo DN za paciente iz njenega okoliša
* sestra za vsak dan posebej izdela plan obiskov
* datumi obiskov na DN so lahko obvezni (fiskno določeni) ali variabilni
* za vsak obisk se avtomatsko izdela
  * seznam potrebnih aktivnosti
  * seznam potrebnega materiala
  * načrt poti (Google Maps)
  * Poročanje o opravljenih obiskih
  * med obiskom ali najkasneje naslednji dan
  * na podlagi seznama potrebnih aktivnosti
  
## Pacient 
Vsak pacient ima svoj zdravstveni karton:
* poročilo o vsakem obisku se zabeleži v pacientov zdravstveni karton
* dostopen je pacientu, zdravniku, vodji patronažne službe in patronažnim sestram 

Za nekatere vste obiskov naj ima možnost zaprostiti tudi pacient ali njegov skrbnik. Na podlagi
te prošnje naj se izdela delovni nalog.

## Uslužbenec ZD

Vsaka patronažna sestra naj ima možnost, da označi prisotnost kužnih odpadkov, za odvoz
katerih poskrbi sodelavec zdravstvenega doma.
