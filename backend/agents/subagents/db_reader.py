import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "../../billboard.db")


def run(question: str) -> dict:
    """
    DB Reader sub agent.
    Receives a natural language question, runs the appropriate
    SQL query and returns a tight JSON summary.
    """
    import anthropic

    client = anthropic.Anthropic()

    skill = open(os.path.join(os.path.dirname(__file__), "../skills/query_bills/SKILL.md")).read()
    examples = open(os.path.join(os.path.dirname(__file__), "../skills/query_bills/example.sql")).read()
    instructions = open(os.path.join(os.path.dirname(__file__), "db_reader.md")).read()

    prompt = f"""
{instructions}

Skill reference:
{skill}

Example queries:
{examples}

Question: {question}

Write and execute the appropriate SQL query to answer this question.
Return ONLY a JSON object with this format:
{{
  "results": [...],
  "summary": "short human-readable summary"
}}
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()

    try:
        # Extract SQL from the response and run it
        import re
        sql_match = re.search(r"SELECT[\s\S]+?;", raw, re.IGNORECASE)
        if sql_match:
            sql = sql_match.group(0)
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(sql)
            rows = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return {
                "results": rows,
                "summary": f"Found {len(rows)} records."
            }
    except Exception as e:
        return {"results": [], "summary": f"Error: {str(e)}"}

    return {"results": [], "summary": "Could not extract a valid SQL query."}