# Test cases (Person A)

15 short messages for the engine tests. **All messages are fictional**, written for testing. They name real banks, agencies and FSC-listed firms only to exercise the official data.

Each case tests one data file and one rule. The **expected level** follows the level rule in CLAUDE.md, not what the engine does today:

- **STOP**: a request for a code or PIN; a link that isn't the official site of the bank named; a job fee the employer should pay; a match with an FSC alert.
- **CAREFUL**: other warning signs.
- **NONE**: otherwise.

`must have` lists the finding `kind`s that must be in the result, and `job` gives the answers from the Job check screen (`agencyId`, `costId`). Use today = `2026-11-14`, as in B's tests.

## Summary

| # | Lang | Expected | Must have | Rule / data tested |
|---|---|---|---|---|
| 1 | Kreol | STOP | job_fee | fee_rules `air_ticket`, reg 7(2)(a) |
| 2 | FR | STOP | job_fee | fee_rules `police_report`, reg 7(2)(b) |
| 3 | EN | STOP | job_fee | fee_rules `any_recruitment_fee`, Act s.5(1) |
| 4 | Kreol | STOP | job_fee | fee_rules `annual_fees`, reg 7(2)(g) |
| 5 | EN | STOP | bank_link, bank_alarm | banks `absa`: link not on absabank.mu |
| 6 | Kreol | STOP | bank_link | banks `emtel_mfs` (payment provider): link not on emtel.com; contact 8971 |
| 7 | EN | NONE | none | banks `sbm`: the official link sbmgroup.mu is not flagged |
| 8 | EN | NONE | none | real MCB code SMS ("never share it") |
| 9 | EN | NONE | none | banks `mcb` keyword `juice`: "orange juice" is not MCB |
| 10 | EN | STOP | fsc_alert | fsc_alerts `krakeif_global`: match by name |
| 11 | FR | STOP | fsc_alert | fsc_alerts `star_net`: match by domain starnetfx.com |
| 12 | EN | CAREFUL | cert_alert, prize_gift | cert_alerts `mt_lucky_draw` (email quoted by CERT-MU) |
| 13 | EN | CAREFUL | cert_alert, payment_request | cert_alerts `property_deposit_tiktok` |
| 14 | EN | STOP | job_fee, agency_listed | agencies `abroad-lifetime-canada-ltd` + cost `visa` |
| 15 | FR | CAREFUL | agency_wrong_category | agencies `non_citizen-zenith-consultancy-ltd` for a job abroad |

## The cases

**1. Air ticket, Kreol → STOP**
> Bonzour, ou finn gagn travay dan lotel Kanada. Bizin peye tiket avion Rs 38,000 avan lindi.

- must have: `job_fee`. The worker is asked to pay the air ticket; the employer pays it (Private Recruitment Agencies Regulations 2025, reg 7(2)(a)).

**2. Police report, French → STOP**
> Offre d'emploi en France : pour finaliser votre recrutement, payez 6 000 roupies pour le certificat de moralité.

- must have: `job_fee`. The police report fee is the employer's (reg 7(2)(b)). Checks the accented FR word list.

**3. Registration fee, English → STOP**
> Hotel jobs in Canada! Register now: registration fee Rs 5,000, send it by Friday to secure your place.

- must have: `job_fee`. No agency or employer may charge a worker a recruitment fee (Private Recruitment Agencies Act 2023, s.5(1)).

**4. Annual fees, Kreol → STOP**
> Lazans travay Dubai: bizin peye fre aniel Rs 8,000 chak lane pou gard ou plas.

- must have: `job_fee`. Annual fees are the employer's (reg 7(2)(g)).

**5. Absa lookalike link → STOP**
> Absa: your card has been blocked. Unblock it now at absa-mu-update.com

- must have: `bank_link`, `bank_alarm`. absa-mu-update.com is not absabank.mu. The contacts must include Absa's official number `+230 402 1000`.

**6. Payment app (blink) lookalike link, Kreol → STOP**
> blink by Emtel: ou wallet inn bloke. Klik lor blink-emtel-verify.com pou debloke li.

- must have: `bank_link`. blink-emtel-verify.com is not under emtel.com (blink's own site is blink.emtel.com). The contacts must include the short code `8971`.

**7. Official SBM link → NONE**
> SBM: our branches close at 12:00 on 24 December. Details on https://www.sbmgroup.mu

- No findings. www.sbmgroup.mu is SBM's official domain.

**8. Real MCB code SMS → NONE**
> MCB: 482913 is your Juice verification code. MCB will never ask you for this code. Do not share it.

- No findings. A code sent *to* you with "do not share" is not a request for a code.

**9. "Juice" that is not MCB → NONE**
> Weekend promo: fresh orange juice 1L at Rs 75. See all offers at freshmarket.mu

- No findings. MCB's keyword `juice` (for MCB Juice) must not make every juice advert with a link a bank-link STOP. *Known risk; see the request to B in automation.md.*

**10. FSC alert by name → STOP**
> Trade with KRAKEIF Global, a licensed investment dealer. 10% per week guaranteed.

- must have: `fsc_alert`. The FSC alert of 4 Dec 2024 says KRAKEIF Global is not licensed.

**11. FSC alert by domain, French → STOP**
> Plateforme FOREX régulée : ouvrez votre compte sur https://www.starnetfx.com et commencez à trader.

- must have: `fsc_alert`. The FSC alert of 29 Jun 2026 names starnetfx.com.

**12. CERT-MU: fake Mauritius Telecom lucky draw → CAREFUL**
> Mauritius Telecom Lucky Draw: you have won a prize! Send your details to mauritiustelecomeluckydraw@gmail.com

- must have: `cert_alert`, `prize_gift`. Cites the CERT-MU alert of 17 Apr 2026. No STOP sign, so CAREFUL.

**13. CERT-MU: property deposit → CAREFUL**
> House for sale in Pereybere, only Rs. 700,000! Make an advance payment or deposit of Rs 20,000 to secure a property viewing.

- must have: `cert_alert`, `payment_request`. Cites the CERT-MU alert of 1 Oct 2026.

**14. Real abroad agency, but a visa fee → STOP**
> LIFETIME CANADA LTD: your hotel job in Toronto is confirmed. Pay the visa fee of Rs 12,000 this week.

- job: `{ agencyId: 'abroad-lifetime-canada-ltd', costId: 'visa' }`
- must have: `job_fee`, `agency_listed`. The agency is listed for jobs abroad (valid to 27 Jul 2029, page 9), but that doesn't prove the message is from them, and the visa fee is the employer's (reg 7(2)(d)). The contacts must include the register number `+2302138028`, never a number from the message.

**15. Agency licensed only for foreign workers, offering a job abroad → CAREFUL**
> Travail en Australie avec ZENITH CONSULTANCY LTD. Contactez-nous pour votre candidature.

- job: `{ agencyId: 'non_citizen-zenith-consultancy-ltd', costId: null }`
- must have: `agency_wrong_category`. ZENITH holds only a "non-citizens for employment in Mauritius" licence (page 10), so it may not recruit for jobs abroad.
