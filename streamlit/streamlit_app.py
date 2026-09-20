import json

import pandas as pd
import streamlit as st

try:
    from snowflake.snowpark.context import get_active_session
except ImportError:
    get_active_session = None

st.set_page_config(
    page_title="Sentinel | Snowflake Native Risk Desk",
    page_icon="S",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .block-container { max-width: 1440px; padding-top: 2rem; }
    [data-testid="stMetricValue"] { letter-spacing: -0.04em; }
    .signal { border: 1px solid rgba(117, 219, 198, .25); border-radius: 14px; padding: 1rem 1.2rem; background: linear-gradient(135deg, rgba(117, 219, 198, .12), rgba(10, 18, 22, .04)); }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("Sentinel")
st.caption("Risk, fraud & regulatory intelligence desk · Snowflake Native AI")

if get_active_session is None:
    st.error("This companion must run inside Snowflake Streamlit with an active Snowpark session.")
    st.stop()

session = get_active_session()

@st.cache_data(ttl=60)
def load_kpis():
    return session.sql(
        """
        SELECT
          (SELECT COUNT(*) FROM SENTINEL.RISK.ALERTS WHERE LOWER(STATUS) IN ('open', 'investigating', 'escalated')) AS OPEN_ALERTS,
          (SELECT COALESCE(SUM(AMOUNT_INR), 0) FROM SENTINEL.RISK.TRANSACTIONS WHERE IS_FRAUD = TRUE) AS FRAUD_VOLUME,
          (SELECT LCR_PCT FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1) AS LCR_PCT,
          (SELECT BUFFER_DAYS FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1) AS BUFFER_DAYS,
          (SELECT CUSTOMER_NAME FROM SENTINEL.RISK.CREDIT_EXPOSURES ORDER BY EXPOSURE_INR DESC LIMIT 1) AS TOP_BORROWER
        """
    ).to_pandas().iloc[0]

@st.cache_data(ttl=60)
def load_liquidity():
    return session.sql(
        "SELECT AS_OF, LCR_PCT, NSFR_PCT, WHOLESALE_RUNOFF_INR_CR FROM SENTINEL.RISK.LIQUIDITY_STRESS_VIEW ORDER BY AS_OF"
    ).to_pandas()

@st.cache_data(ttl=60)
def load_channels():
    return session.sql(
        """
        SELECT CHANNEL, SUM(AMOUNT_INR) AS FRAUD_AMOUNT
        FROM SENTINEL.RISK.TRANSACTIONS
        WHERE IS_FRAUD = TRUE
        GROUP BY CHANNEL
        ORDER BY FRAUD_AMOUNT DESC
        """
    ).to_pandas().set_index("CHANNEL")

kpis = load_kpis()
metric_columns = st.columns(5)
metric_columns[0].metric("Open alerts", int(kpis["OPEN_ALERTS"]))
metric_columns[1].metric("Flagged flow", f"₹{kpis['FRAUD_VOLUME']:,.0f}")
metric_columns[2].metric("LCR", f"{kpis['LCR_PCT']:.1f}%")
metric_columns[3].metric("HQLA buffer", f"{int(kpis['BUFFER_DAYS'])} days")
metric_columns[4].metric("Largest borrower", str(kpis["TOP_BORROWER"]))

st.markdown('<div class="signal">Snowflake-native companion · Cortex Analyst semantic view · Cortex Search · SENTINEL_AGENT</div>', unsafe_allow_html=True)

left, right = st.columns([1.35, 0.65])
with left:
    st.subheader("Liquidity stress")
    liquidity = load_liquidity().set_index("AS_OF")
    st.line_chart(liquidity[["LCR_PCT", "NSFR_PCT"]], height=280)
    st.caption("The demonstration analytical floor is 100%. Confirm regulatory interpretation with Treasury.")
with right:
    st.subheader("Fraud flow by channel")
    st.bar_chart(load_channels(), height=280)

st.subheader("Ask Sentinel")
question = st.chat_input("Investigate mule accounts with cash-outs after 2am")
if question:
    with st.chat_message("user"):
        st.write(question)
    payload = json.dumps({"messages": [{"role": "user", "content": [{"type": "text", "text": question}]}]})
    with st.chat_message("assistant"):
        with st.spinner("Grounding against Sentinel data..."):
            result = session.sql(
                "SELECT SNOWFLAKE.CORTEX.DATA_AGENT_RUN(?, ?) AS RESPONSE",
                params=["SENTINEL.RISK.SENTINEL_AGENT", payload],
            ).collect()[0]["RESPONSE"]
            parsed = json.loads(result) if isinstance(result, str) else result
            answer = "\n\n".join(
                block.get("text", "") for block in parsed.get("content", []) if block.get("type") == "text"
            )
            st.markdown(answer or "Agent returned no user-facing response.")
            st.caption(f"Agent status: {parsed.get('status', 'unknown')} · Evidence-backed Snowflake response")

st.subheader("Mule network snapshot")
st.graphviz_chart(
    """
    digraph {
      graph [bgcolor="transparent", rankdir=LR, pad=0.2]
      node [shape=circle, style=filled, fontname="Arial", color="#75dbc6", fillcolor="#17312f", fontcolor="white"]
      nexus [label="Nexus\nmerchant", fillcolor="#6d4c25", color="#f2b35b"]
      kavya [label="Kavya"]
      imran [label="Imran"]
      neha [label="Neha"]
      atm [label="ATM\ncash-out", fillcolor="#4b2424", color="#ef7c7c"]
      nexus -> kavya; nexus -> imran; nexus -> neha; kavya -> atm; imran -> atm; neha -> atm
    }
    """
)
