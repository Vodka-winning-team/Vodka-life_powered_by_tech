# Our sources (Person A)

Every row in every data file has a `source_url` and a `snapshot` date. Nothing is invented. Each script stops if what it writes can't be found in the official file it read.

**`snapshot` means** the date of the version we copied. That is the "as at" date when the source prints one (the agency register: 2026-11-04). Otherwise it's the day we downloaded and checked the source (2026-11-13).

| File | Rows | Snapshot | Official source |
|---|---|---|---|
| `agencies.json` | 79 licences: 20 local, 12 abroad, 47 non_citizen | 2026-11-04 | [Ministry of Labour, List of Private Recruitment Agencies, as at 04 Nov 2026](https://empment-labour.govmu.org/Documents/Recruitment/List%20of%20Recruitment%20Agencies.pdf) |
| `fee_rules.json` | 8 rules: Act s.5(1) + reg 7(2)(a)–(g) | 2026-11-13 | [Private Recruitment Agencies Act 2023](https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/The%20Private%20Recruitment%20Agencies%20Act%202023.pdf), [Private Recruitment Agencies Regulations 2025 (GN 98 of 2025)](https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/The%20Private%20Recruitment%20Agencies%20Regulation%202025.pdf) |
| `banks.json` | 18 banks + 3 payment providers | 2026-11-13 | [BoM List of Licensees (banks)](https://www.bom.mu/financial-stability/supervision/licensees/list-of-licensees), [BoM payment service providers](https://bom.mu/sites/default/files/licensee.pdf); phones from each bank's own site (`phone_source`) |
| `fsc_alerts.json` | 21 organisations, alerts from Dec 2017 to Jun 2026 | 2026-11-13 | One [FSC Mauritius](https://www.fscmauritius.org/) investor-alert PDF per row (`alert_url`) |
| `cert_alerts.json` | 5 campaigns, Feb–Oct 2026 | 2026-11-13 | [CERT-MU Security Alerts](https://cert-mu.govmu.org/cert-mu/?page_id=1439), one PDF per row (`alert_url`) |

## Text for the "Our sources" screen

- Recruitment agencies: 79 licences, Ministry of Labour list of 4 Nov 2026.
- Who pays recruitment costs: Private Recruitment Agencies Act 2023 s.5 and Regulations 2025 reg 7(2).
- Banks and payment apps: 18 banks and 3 payment providers, Bank of Mauritius list (13 Nov 2026). Phone numbers come from each bank's own website.
- Investment warnings: 21 organisations named in Financial Services Commission alerts (2017–2026).
- Scam campaigns: 5 CERT-MU security alerts (Feb–Oct 2026).

## How to rebuild

```
pip install -r data/scripts/requirements.txt
python data/scripts/agencies.py
python data/scripts/fee_rules.py
python data/scripts/banks.py
python data/scripts/fsc_alerts.py
python data/scripts/cert_alerts.py
python data/scripts/validate.py
```

The scripts read `data/raw/`, which is not committed. To rebuild, download the files at the links above into `data/raw/register/`, `law/`, `bom/`, `fsc/` and `cert/`, with the file names the scripts use. bom.mu, the law PDFs and the CERT-MU and FSC alert PDFs all downloaded with a normal browser user agent. Only the FSC index page blocks scripts.

## What we left out, and why

- **People's names.** The register's "Name of Director(s)" and "Email Address" columns are never read (the emails contain people's names). FSC alerts that name a private individual are not used at all, and their names are not written anywhere in the repo. The CERT-MU property alert names a person and lists private mobile numbers, and none of those are copied.
- **EZ Dash Limited** (BoM-licensed payment provider): no official website or phone found.
- **Mornefundvex.com:** a web search said the FSC homepage lists an alert for it (Sep 2026), but we couldn't find the PDF, so only the confirmed Mornefundvex.net alert (30 Jun 2026) is in.
- **FTSFX and Blackcore** (in the earlier arnak list): source pages gone or blocked.

## Things to know (for B and C)

- **Same company, several licences.** An agency can hold licences in more than one category (e.g. HRPRO LTD: local, abroad and non_citizen). Each licence is its own row, and the id is `<category>-<name-slug>`, e.g. `abroad-hrpro-ltd`.
- **Agency phone** is the first number the register prints for that licence.
- **One name is kept exactly as printed:** `DEEVALEN MAREEMOOTO O LIMITED` (the PDF wraps the word). Probably "MAREEMOOTOO", but no official source confirms it.
- **Short codes.** Two PSP phones are Mauritian short codes, not +230 numbers: blink by Emtel `8971` (24/7), my.t money `8908`. They dial as is from a Mauritian phone. `validate.py` allows 3–4 digit short codes.
- **Domain rule.** A link is official if its host equals a domain in `domains` or ends with `.` + that domain (so `blink.emtel.com` matches `emtel.com`). SBI uses `mu.statebank` and `onlinesbiglobal.statebank` (`.statebank` is SBI's own top-level domain).
- **Broad keywords.** `juice` (MCB Juice) also matches "orange juice". `passport`, `visa` and `work permit` in fee rules also match "bring your passport". The engine should only call it a job fee when the message also asks for money (amount or payment words).
- **HSBC** has two BoM licences (HSBC Bank (Mauritius) Limited and The Hongkong and Shanghai Banking Corporation Limited) on one website. Only the first has the keyword `hsbc`, so a message naming "HSBC" maps to one bank.
- **MAAF Assurance** is the name the FSC alert of 30 Apr 2026 says impostors use. Show it as "named in an FSC alert", never as a judgement on a company.
- **Demo idea for D:** LIFETIME CANADA LTD is in the register under "abroad", valid 28 Jul 2026 – 27 Jul 2029 (page 9). That fits Kevin's Canada hotel job.
