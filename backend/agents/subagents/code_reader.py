import os
import json

REPO_ROOT = os.path.join(os.path.dirname(__file__), "../../")


def run(question: str) -> dict:
    """
    Code Reader sub agent.
    Receives a natural language question about the codebase,
    reads the relevant files and returns a tight JSON summary.
    """
    import anthropic

    client = anthropic.Anthropic()

    instructions = open(os.path.join(os.path.dirname(__file__), "code_reader.md")).read()

    # Build a map of available files
    relevant_files = {
        "main.py": open(os.path.join(REPO_ROOT, "main.py")).read(),
        "models.py": open(os.path.join(REPO_ROOT, "models.py")).read(),
        "database.py": open(os.path.join(REPO_ROOT, "database.py")).read(),
        "routers/bills.py": open(os.path.join(REPO_ROOT, "routers/bills.py")).read(),
        "routers/groups.py": open(os.path.join(REPO_ROOT, "routers/groups.py")).read(),
    }

    files_content = "\n\n".join(
        [f"--- {path} ---\n{content}" for path, content in relevant_files.items()]
    )

    prompt = f"""
{instructions}

Codebase:
{files_content}

Question: {question}

Return ONLY a JSON object with this format:
{{
  "file": "most relevant file",
  "summary": "short human-readable answer to the question"
}}
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()

    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception as e:
        return {"file": "unknown", "summary": f"Error parsing response: {str(e)}"}