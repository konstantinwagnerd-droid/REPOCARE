# CareAI — Backup-Strategie

## Philosophie
Pflegedaten sind unersetzlich. Jeder Datensatz repräsentiert eine reale Bewohner:in. Daher:

- **Mehrfach-Redundanz:** Mindestens 3 Kopien, 2 verschiedene Medien, 1 Offsite.
- **Verschlüsselung:** AES-256-GCM für alle Backups. Key-Management über Hardware-KMS in Produktion.
- **Integritäts-Prüfung:** SHA-256-Hash bei jedem Backup; wöchentliche Re-Verifikation.
- **Regelmäßige Restore-Tests:** Quartalsweise Full-Restore gegen Staging, dokumentiert in der DR-Test-Historie.

## Ziele

| Metrik | Ziel |
|---|---|
| **RPO** (Recovery Point Objective) | ≤ 24&nbsp;Stunden |
| **RTO** (Recovery Time Objective) | ≤ 4&nbsp;Stunden |
| **MTBF** (Mean Time Between Failure) | > 8760&nbsp;h (1&nbsp;Jahr) |
| **Retention** täglich | 7 Tage |
| **Retention** wöchentlich | 4 Wochen |
| **Retention** monatlich | 12 Monate |

## Backup-Typen

- **Full (täglich 03:00):** Komplettabzug aller Tenant-Tabellen + Dateien.
- **Incremental (stündlich):** Nur Änderungen seit letztem Full oder Incremental.
- **Schema-only:** Nur Struktur, zur Migrations-Absicherung.
- **Tenant-Export:** Vollständiger Export eines Tenants (DSGVO Art.&nbsp;20 Datenübertragbarkeit).

## Storage

- **Lokal:** Verschlüsselte Blobs auf NVMe-Array mit RAID-1.
- **Offsite (optional):** S3-kompatibler Speicher (z.B. Hetzner Object Storage, EU-Region).
- **Langfrist-Archiv:** Monatliche Backups ≥ 12&nbsp;Monate auf Tape oder Glacier.

## Key-Management

- Master-Secret ist niemals in Klartext gespeichert.
- In Produktion: Hardware-KMS (AWS KMS / HashiCorp Vault).
- In Entwicklung: ENV `CAREAI_BACKUP_SECRET`.
- Key-Rotation: alle 12 Monate, Re-Encryption-Routine führt graduellen Rotate-Zyklus durch.

## Zugriff

- Backups darf nur ein Nutzer mit der Rolle `admin` erstellen, herunterladen oder wiederherstellen.
- Alle Backup-Operationen werden im Audit-Log protokolliert.
- Tenant-Exports erfordern zweiten Faktor + E-Mail-Bestätigung (4-Augen-Prinzip).

## Integrität

Jedes Backup enthält:
- `$schema`-Feld mit Version.
- `hash`-Feld (SHA-256 über den Klartext).
- `createdAt`, `tenantId`, `type`, `encrypted`-Flag.
- Verify-Routine rechnet Hash live nach und markiert den Status `verified` oder `failed`.
