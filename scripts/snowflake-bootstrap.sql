-- One-shot bootstrap for hackathon account (run as role that can create DB/WH)
-- After this, use CoCo / cortex CLI for Search, semantic view, and agent (coco/PROMPTS.md).

!source snowflake/01_schema.sql
-- Note: Snowflake worksheets do not support !source; run each file in order manually:
-- 01_schema.sql, 02_seed.sql, 03_expand.sql, 04_winner_expansion.sql, 05_app_views.sql
