# Sentinel Snowflake Streamlit companion

This is an optional Snowflake-hosted companion to the Next.js app. It runs inside Snowflake Streamlit with an active Snowpark session and reads the same `SENTINEL.RISK` mart, semantic view, Search services, and `SENTINEL_AGENT`.

## Deploy

1. Create a Streamlit app in database `SENTINEL`, schema `RISK`.
2. Upload `streamlit_app.py`.
3. Add dependencies from `requirements.txt`.
4. Run with a warehouse that can read `SENTINEL.RISK` and use `SENTINEL.RISK.SENTINEL_AGENT`.
5. Grant the evaluator role access to the Streamlit app plus the existing Cortex objects.

The companion intentionally uses the same canonical agent FQN as Next.js and does not duplicate data or embeddings.
