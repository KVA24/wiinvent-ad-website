# Figma export: Wiivent Ad (Copy)

- Last modified: `2026-08-30T01:42:56Z`
- Version: `2393279816004877677`
- Prototype start: `(none)`
- Nodes exported: **26706**  (con cua VECTOR/BOOLEAN da bi cat, dung `--full-vectors` de giu)
- Interactions: **3444**
- Components: 2114 | Component sets: 89 | Styles: 147
- Variables referenced: 148

## Doc file nao khi nao

| File | Dung khi |
|---|---|
| `tree/<page>.txt` | Can hieu cau truc / tim node theo ten. Doc file nay TRUOC. |
| `nodes.jsonl` | Da biet node id hoac ten -> `grep '"id": "1:23"' nodes.jsonl`. Dung field day du. |
| `interactions.csv` | Prototype, transition, animation, SET_VARIABLE. |
| `variables.csv` | Bien nao dieu khien property nao cua node nao. |
| `components.csv` | Anh xa componentId -> ten component. |
| `styles.csv` | Anh xa styleId -> ten style. |
| `text_content.csv` | Doi chieu copy/text voi code. |
| `effects.csv` | Tap hop mau/shadow/font -> dung lam design token. |

## Pages

| Page | Nodes |
|---|---|
| 🔵 Design System | 14024 |
| 🔵 UI_Phase 1 | 7947 |
| Animate | 1718 |
| Glass Icon | 1585 |
| Wireframe | 898 |
| Device Frame | 447 |
| Draft | 66 |
| 🖼️ Cover | 18 |
| --- | 2 |
| ------------ | 1 |

## Node types

| Type | Count |
|---|---|
| VECTOR | 9912 |
| FRAME | 4491 |
| INSTANCE | 3508 |
| TEXT | 3364 |
| COMPONENT | 2058 |
| RECTANGLE | 1661 |
| GROUP | 745 |
| ELLIPSE | 572 |
| LINE | 98 |
| BOOLEAN_OPERATION | 85 |
| COMPONENT_SET | 83 |
| SECTION | 62 |
| REGULAR_POLYGON | 41 |
| CANVAS | 11 |
| STAR | 8 |
| CONNECTOR | 7 |

## Luu y khi doi chieu

- `nodes.jsonl` chi ghi field co gia tri; field vang nghia la mac dinh.
- `box` = `[x, y, width, height]` toa do TUYET DOI trong page, khong phai toa do tuong doi cua parent.
- Node co `[FX]` trong tree la co interaction; `[VAR]` la co bound variable.
- `duration_ms` da quy doi ve mili giay (API tra ve giay cho interactions moi, ms cho legacy).
- TEN cua variable KHONG co trong REST API file endpoint. Muon co ten phai goi
  `/v1/files/{key}/variables/local` (yeu cau goi Enterprise) hoac doi chieu tay trong Figma.