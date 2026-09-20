# Sentinel Snowflake Streamlit companion

This is an optional Snowflake-hosted companion to the Next.js app. It runs inside Snowflake Streamlit with an active Snowpark session and reads the same `SENTINEL.RISK` mart, semantic view, Search services, and `SENTINEL_AGENT`.

## Deploy from Snowflake UI

1. Open **Projects > Streamlit** in Snowsight and choose **Create Streamlit app**.
2. Select database `SENTINEL`, schema `RISK`, and warehouse `SENTINEL_WH`.
3. Upload `streamlit_app.py` and `environment.yml` from this folder.
4. Set the main file to `streamlit_app.py`, then click **Run**.
5. Share the generated app URL with the evaluator role.

## Deploy from SQL

Run as `ACCOUNTADMIN` or a role with stage and Streamlit privileges:

```sql
CREATE STAGE IF NOT EXISTS SENTINEL.RISK.SENTINEL_STREAMLIT_STAGE;
```

Upload `streamlit_app.py` and `environment.yml` to that stage from Snowsight, then run:

```sql
CREATE OR REPLACE STREAMLIT SENTINEL.RISK.SENTINEL_STREAMLIT
	FROM '@SENTINEL.RISK.SENTINEL_STREAMLIT_STAGE'
	MAIN_FILE = 'streamlit_app.py'
	QUERY_WAREHOUSE = SENTINEL_WH
	RUNTIME_NAME = 'SYSTEM$STREAMLIT_RUNTIME_PY3_11';

GRANT USAGE ON STREAMLIT SENTINEL.RISK.SENTINEL_STREAMLIT TO ROLE APP_DEVELOPER;
```

The app role also needs the existing `SENTINEL.RISK` database/schema usage and Cortex grants documented in the main runbook.

The companion intentionally uses the same canonical agent FQN as Next.js and does not duplicate data or embeddings.
