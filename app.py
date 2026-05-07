import os
import streamlit as st
import pandas as pd
from dotenv import load_dotenv
from researcher import run_research
from models import MarketResearchReport, InvestmentIdea

load_dotenv()

# --- PAGE CONFIG ---
st.set_page_config(
    page_title="Market Research Tool",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- CUSTOM CSS ---
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1rem;
        color: #6c757d;
        margin-bottom: 2rem;
    }
    .section-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1a1a2e;
        border-bottom: 2px solid #0066cc;
        padding-bottom: 6px;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    .kpi-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        border-left: 4px solid #0066cc;
    }
    .idea-high { border-left: 4px solid #28a745; }
    .idea-medium { border-left: 4px solid #ffc107; }
    .idea-low { border-left: 4px solid #6c757d; }
    .trend-positive { color: #28a745; font-weight: 600; }
    .trend-negative { color: #dc3545; font-weight: 600; }
    .trend-neutral { color: #6c757d; font-weight: 600; }
    .badge-leader {
        background: #0066cc; color: white;
        padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;
    }
    .badge-challenger {
        background: #fd7e14; color: white;
        padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;
    }
    .badge-niche {
        background: #6c757d; color: white;
        padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;
    }
    .disclaimer {
        font-size: 0.75rem;
        color: #999;
        background: #f8f9fa;
        padding: 12px;
        border-radius: 6px;
        margin-top: 2rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


# --- SIDEBAR ---
with st.sidebar:
    st.markdown("## ⚙️ Settings")
    api_key_input = st.text_input(
        "Anthropic API Key",
        value=os.getenv("ANTHROPIC_API_KEY", ""),
        type="password",
        help="Your Anthropic API key. Can also be set via ANTHROPIC_API_KEY env variable.",
    )

    st.markdown("---")
    st.markdown("### 💡 Example Queries")
    examples = [
        "AI infrastructure & data centers",
        "Weight-loss drug GLP-1 market",
        "Offshore wind energy",
        "Defense technology & drones",
        "Stablecoins & digital payments",
        "Nuclear power renaissance",
        "Semiconductor capital equipment",
    ]
    for ex in examples:
        if st.button(ex, key=f"ex_{ex}", use_container_width=True):
            st.session_state["query_input"] = ex
            st.rerun()

    st.markdown("---")
    st.caption("Powered by Claude claude-sonnet-4-6 · For informational purposes only")


# --- MAIN HEADER ---
st.markdown('<div class="main-header">📊 Market Research Tool</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Sector or theme → Industry overview · Competitive landscape · Peer comps · Ideas shortlist</div>',
    unsafe_allow_html=True,
)

# --- QUERY INPUT ---
col_input, col_btn = st.columns([5, 1])
with col_input:
    query = st.text_input(
        "Sector or Investment Theme",
        value=st.session_state.get("query_input", ""),
        placeholder="e.g. AI infrastructure, GLP-1 obesity drugs, nuclear power renaissance…",
        label_visibility="collapsed",
    )
with col_btn:
    run_btn = st.button("Research →", type="primary", use_container_width=True)


# --- HELPERS ---
def fmt_num(val, suffix="", prefix=""):
    if val is None:
        return "—"
    return f"{prefix}{val:,.1f}{suffix}"


def conviction_color(conviction: str) -> str:
    return {"high": "#28a745", "medium": "#ffc107", "low": "#6c757d"}.get(conviction, "#6c757d")


def consensus_icon(cons: str) -> str:
    return {"Buy": "🟢", "Hold": "🟡", "Sell": "🔴"}.get(cons or "", "⚪")


def render_industry_overview(overview):
    st.markdown('<div class="section-title">🏭 Industry Overview</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Sector", overview.sector)
    col2.metric(
        "Market Size",
        fmt_num(overview.market_size_usd_bn, suffix="B", prefix="$") if overview.market_size_usd_bn else "—",
    )
    col3.metric(
        "CAGR (3-5yr)",
        fmt_num(overview.cagr_pct, suffix="%") if overview.cagr_pct else "—",
    )
    col4.metric("Regulatory", overview.regulatory_environment[:40] + "…" if len(overview.regulatory_environment) > 40 else overview.regulatory_environment)

    st.markdown(f"> {overview.summary}")

    col_trends, col_right = st.columns([3, 2])

    with col_trends:
        st.markdown("**Key Trends**")
        for t in overview.key_trends:
            icon = {"positive": "▲", "negative": "▼", "neutral": "◆"}.get(t.impact, "◆")
            css_class = f"trend-{t.impact}"
            st.markdown(
                f'<span class="{css_class}">{icon} {t.trend}</span> — {t.description}',
                unsafe_allow_html=True,
            )

    with col_right:
        st.markdown("**Value Chain**")
        stages = overview.value_chain_stages
        st.markdown(" → ".join(f"`{s}`" for s in stages))

        st.markdown("**Key Risks**")
        for r in overview.key_risks:
            st.markdown(f"- ⚠️ {r}")


def render_competitive_landscape(landscape):
    st.markdown('<div class="section-title">⚔️ Competitive Landscape</div>', unsafe_allow_html=True)

    col1, col2 = st.columns([2, 3])
    with col1:
        st.metric("Market Structure", landscape.market_structure)
        st.markdown("**Moat Types**")
        for m in landscape.key_moat_types:
            st.markdown(f"🛡️ {m}")
        st.markdown("**Disruption Threats**")
        for d in landscape.disruption_threats:
            st.markdown(f"⚡ {d}")

    with col2:
        st.markdown(f"*{landscape.dynamics_summary}*")
        st.markdown("**Key Players**")
        for comp in landscape.competitors:
            badge_map = {
                "leader": "badge-leader",
                "challenger": "badge-challenger",
                "niche": "badge-niche",
            }
            badge_cls = badge_map.get(comp.market_position, "badge-niche")
            ticker_str = f" ({comp.ticker})" if comp.ticker else ""
            with st.expander(f"{comp.name}{ticker_str}"):
                st.markdown(
                    f'<span class="{badge_cls}">{comp.market_position.upper()}</span>',
                    unsafe_allow_html=True,
                )
                st.markdown(comp.description)
                c1, c2 = st.columns(2)
                c1.markdown(f"✅ **Strength:** {comp.key_strength}")
                c2.markdown(f"❌ **Weakness:** {comp.key_weakness}")


def render_peer_comps(comps):
    st.markdown('<div class="section-title">📋 Peer Comparables</div>', unsafe_allow_html=True)

    rows = []
    for c in comps:
        rows.append(
            {
                "Ticker": c.ticker,
                "Company": c.company_name,
                "Mkt Cap ($B)": fmt_num(c.market_cap_usd_bn),
                "EV/EBITDA": fmt_num(c.ev_ebitda, "x"),
                "P/E": fmt_num(c.pe_ratio, "x"),
                "Rev Growth": fmt_num(c.revenue_growth_pct, "%"),
                "Gross Margin": fmt_num(c.gross_margin_pct, "%"),
                f"{c.key_metric_label or 'KPI'}": c.key_metric_value or "—",
                "Consensus": f"{consensus_icon(c.analyst_consensus)} {c.analyst_consensus or '—'}",
            }
        )

    df = pd.DataFrame(rows)
    st.dataframe(df, use_container_width=True, hide_index=True)


def render_ideas_shortlist(ideas: list[InvestmentIdea]):
    st.markdown('<div class="section-title">💡 Ideas Shortlist</div>', unsafe_allow_html=True)

    for idea in ideas:
        color = conviction_color(idea.conviction)
        with st.container():
            st.markdown(
                f"""
                <div style="border-left: 4px solid {color}; padding: 12px 16px;
                            background: #f8f9fa; border-radius: 0 8px 8px 0; margin-bottom: 12px;">
                    <div style="font-size: 1.05rem; font-weight: 700; color: #1a1a2e;">
                        {idea.title}
                        <span style="font-size: 0.75rem; background: #e9ecef; color: #495057;
                                     padding: 2px 8px; border-radius: 12px; margin-left: 8px;">
                            {idea.type}
                        </span>
                        <span style="font-size: 0.75rem; background: {color}; color: white;
                                     padding: 2px 8px; border-radius: 12px; margin-left: 4px;">
                            {idea.conviction.upper()} CONVICTION
                        </span>
                        <span style="font-size: 0.75rem; color: #6c757d; margin-left: 8px;">
                            ⏱ {idea.time_horizon}
                        </span>
                    </div>
                    <div style="color: #495057; margin-top: 6px; font-style: italic;">
                        {idea.one_liner}
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            c1, c2, c3 = st.columns([3, 2, 2])
            with c1:
                st.markdown("**Thesis**")
                st.markdown(idea.investment_thesis)
            with c2:
                st.markdown("**Catalysts**")
                for cat in idea.key_catalysts:
                    st.markdown(f"→ {cat}")
            with c3:
                st.markdown("**Risks**")
                for risk in idea.key_risks:
                    st.markdown(f"⚠️ {risk}")
            st.markdown("---")


def render_report(report: MarketResearchReport):
    render_industry_overview(report.industry_overview)
    st.markdown("")
    render_competitive_landscape(report.competitive_landscape)
    st.markdown("")
    render_peer_comps(report.peer_comps)
    st.markdown("")
    render_ideas_shortlist(report.ideas_shortlist)
    st.markdown(
        f'<div class="disclaimer">⚠️ {report.disclaimer}</div>',
        unsafe_allow_html=True,
    )


# --- MAIN LOGIC ---
if run_btn or st.session_state.get("_run_triggered"):
    st.session_state["_run_triggered"] = False

    if not query.strip():
        st.warning("Please enter a sector or investment theme.")
    elif not api_key_input.strip():
        st.error("Please enter your Anthropic API key in the sidebar.")
    else:
        with st.spinner(f"Researching **{query}** — this may take 20-40 seconds…"):
            try:
                report = run_research(query.strip(), api_key_input.strip())
                st.session_state["last_report"] = report
                st.session_state["last_query"] = query.strip()
            except Exception as e:
                st.error(f"Research failed: {e}")
                st.stop()

        st.success(f"Research complete for: **{query}**")

if "last_report" in st.session_state:
    render_report(st.session_state["last_report"])
elif not run_btn:
    st.markdown(
        """
        <div style="text-align: center; padding: 60px 20px; color: #adb5bd;">
            <div style="font-size: 3rem;">📊</div>
            <div style="font-size: 1.1rem; margin-top: 12px;">
                Enter a sector or investment theme above and click <strong>Research →</strong>
            </div>
            <div style="font-size: 0.9rem; margin-top: 8px;">
                Examples: <em>AI infrastructure · GLP-1 drugs · Offshore wind · Defense tech</em>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
