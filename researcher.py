import anthropic
import json
from models import MarketResearchReport

SYSTEM_PROMPT = """You are an elite sell-side equity research analyst and sector strategist at a
top-tier investment bank. You produce rigorous, data-driven market research reports with the depth
and precision expected by institutional investors.

When given a sector or investment theme, you will produce a comprehensive research report covering:
1. Industry overview with market sizing, growth drivers, trends, value chain, and risks
2. Competitive landscape mapping major players, market structure, moats, and disruption threats
3. Peer comparables table with realistic estimated financial metrics
4. An investment ideas shortlist with clear theses, catalysts, risks, and time horizons

All financial figures should be realistic estimates based on your training data. Be specific,
concise, and insightful — avoid generic platitudes. Think like a top analyst writing for a
sophisticated investor audience."""

RESEARCH_TOOL = {
    "name": "generate_research_report",
    "description": (
        "Generate a structured market research report for a given sector or investment theme, "
        "covering industry overview, competitive landscape, peer comparables, and investment ideas."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The sector or investment theme being researched",
            },
            "industry_overview": {
                "type": "object",
                "description": "High-level industry analysis",
                "properties": {
                    "sector": {"type": "string"},
                    "summary": {
                        "type": "string",
                        "description": "2-3 sentence executive summary of the sector",
                    },
                    "market_size_usd_bn": {
                        "type": "number",
                        "description": "Total addressable market in USD billions",
                    },
                    "cagr_pct": {
                        "type": "number",
                        "description": "Expected CAGR percentage over next 3-5 years",
                    },
                    "key_trends": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "trend": {"type": "string"},
                                "impact": {
                                    "type": "string",
                                    "enum": ["positive", "negative", "neutral"],
                                },
                                "description": {"type": "string"},
                            },
                            "required": ["trend", "impact", "description"],
                        },
                        "minItems": 3,
                        "maxItems": 6,
                    },
                    "value_chain_stages": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Key stages in the industry value chain",
                        "minItems": 3,
                        "maxItems": 7,
                    },
                    "key_risks": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 3,
                        "maxItems": 6,
                    },
                    "regulatory_environment": {
                        "type": "string",
                        "description": "Brief description of the regulatory landscape",
                    },
                },
                "required": [
                    "sector",
                    "summary",
                    "key_trends",
                    "value_chain_stages",
                    "key_risks",
                    "regulatory_environment",
                ],
            },
            "competitive_landscape": {
                "type": "object",
                "properties": {
                    "market_structure": {
                        "type": "string",
                        "description": "e.g. Oligopoly, Fragmented, Duopoly, Monopolistic Competition",
                    },
                    "dynamics_summary": {
                        "type": "string",
                        "description": "2-3 sentences on competitive dynamics",
                    },
                    "key_moat_types": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Types of competitive moats present (e.g. Network Effects, Switching Costs)",
                    },
                    "competitors": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "ticker": {"type": "string"},
                                "market_position": {
                                    "type": "string",
                                    "enum": ["leader", "challenger", "niche"],
                                },
                                "description": {"type": "string"},
                                "key_strength": {"type": "string"},
                                "key_weakness": {"type": "string"},
                            },
                            "required": [
                                "name",
                                "market_position",
                                "description",
                                "key_strength",
                                "key_weakness",
                            ],
                        },
                        "minItems": 4,
                        "maxItems": 8,
                    },
                    "disruption_threats": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 2,
                        "maxItems": 4,
                    },
                },
                "required": [
                    "market_structure",
                    "dynamics_summary",
                    "key_moat_types",
                    "competitors",
                    "disruption_threats",
                ],
            },
            "peer_comps": {
                "type": "array",
                "description": "Peer comparables table with key financial metrics",
                "items": {
                    "type": "object",
                    "properties": {
                        "ticker": {"type": "string"},
                        "company_name": {"type": "string"},
                        "market_cap_usd_bn": {"type": "number"},
                        "ev_ebitda": {"type": "number"},
                        "pe_ratio": {"type": "number"},
                        "revenue_growth_pct": {"type": "number"},
                        "gross_margin_pct": {"type": "number"},
                        "key_metric_label": {
                            "type": "string",
                            "description": "Sector-specific KPI name",
                        },
                        "key_metric_value": {
                            "type": "string",
                            "description": "Sector-specific KPI value as string",
                        },
                        "analyst_consensus": {
                            "type": "string",
                            "enum": ["Buy", "Hold", "Sell"],
                        },
                    },
                    "required": ["ticker", "company_name"],
                },
                "minItems": 4,
                "maxItems": 8,
            },
            "ideas_shortlist": {
                "type": "array",
                "description": "Investment ideas with thesis, catalysts, and risks",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "type": {
                            "type": "string",
                            "enum": ["long equity", "short equity", "thematic", "private", "credit"],
                        },
                        "one_liner": {
                            "type": "string",
                            "description": "One sentence summary of the idea",
                        },
                        "investment_thesis": {
                            "type": "string",
                            "description": "2-3 sentence investment thesis",
                        },
                        "key_catalysts": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 4,
                        },
                        "key_risks": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 4,
                        },
                        "time_horizon": {"type": "string"},
                        "conviction": {
                            "type": "string",
                            "enum": ["high", "medium", "low"],
                        },
                    },
                    "required": [
                        "title",
                        "type",
                        "one_liner",
                        "investment_thesis",
                        "key_catalysts",
                        "key_risks",
                        "time_horizon",
                        "conviction",
                    ],
                },
                "minItems": 3,
                "maxItems": 5,
            },
        },
        "required": [
            "query",
            "industry_overview",
            "competitive_landscape",
            "peer_comps",
            "ideas_shortlist",
        ],
    },
}


def run_research(query: str, api_key: str) -> MarketResearchReport:
    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        tools=[RESEARCH_TOOL],
        tool_choice={"type": "tool", "name": "generate_research_report"},
        messages=[
            {
                "role": "user",
                "content": (
                    f"Generate a comprehensive market research report for the following "
                    f"sector / investment theme:\n\n**{query}**\n\n"
                    "Be specific and data-driven. Include real publicly traded companies where "
                    "applicable with realistic estimated metrics. Provide actionable investment ideas "
                    "with clear theses and differentiated insights."
                ),
            }
        ],
    )

    tool_use_block = next(b for b in response.content if b.type == "tool_use")
    data = tool_use_block.input
    return MarketResearchReport(**data)
