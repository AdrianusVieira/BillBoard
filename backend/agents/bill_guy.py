import os
import json
from datetime import datetime
from dotenv import load_dotenv
import anthropic

load_dotenv()

from hooks.pre_tool_use import pre_tool_use
from hooks.post_tool_use import post_tool_use
from subagents import db_reader, code_reader

HARNESS_ROOT = os.path.join(os.path.dirname(__file__), "harness")
AGENTS_ROOT = os.path.dirname(__file__)

client = anthropic.Anthropic()


def load_harness() -> dict:
    context_path = os.path.join(HARNESS_ROOT, "context.json")
    progress_path = os.path.join(HARNESS_ROOT, "progress.md")

    with open(context_path) as f:
        context = json.load(f)

    with open(progress_path) as f:
        progress = f.read()

    return {"context": context, "progress": progress}


def update_harness(question: str) -> None:
    context_path = os.path.join(HARNESS_ROOT, "context.json")

    with open(context_path) as f:
        context = json.load(f)

    context["last_session"] = datetime.now().strftime("%Y-%m-%d")
    if question not in context["questions_asked"]:
        context["questions_asked"].append(question)

    with open(context_path, "w") as f:
        json.dump(context, f, indent=2)


def load_instructions() -> str:
    with open(os.path.join(AGENTS_ROOT, "agent.md")) as f:
        return f.read()


def ask(question: str) -> str:
    harness = load_harness()
    instructions = load_instructions()

    system_prompt = f"""
{instructions}

Current harness context:
{json.dumps(harness["context"], indent=2)}

Progress:
{harness["progress"]}
"""

    messages = [{"role": "user", "content": question}]

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system_prompt,
        messages=messages,
    )

    plan = response.content[0].text.strip().lower()

    results = []

    # Invoke db_reader for data questions
    if any(word in plan for word in ["bill", "group", "paid", "unpaid", "value", "amount", "due", "overdue"]):
        hook = pre_tool_use("query_db", {"sql": "SELECT"})
        if hook["allowed"]:
            result = db_reader.run(question)
            post_tool_use("query_db", {"question": question}, str(result))
            results.append(f"Data: {result['summary']}\nDetails: {result['results']}")

    # Invoke code_reader for code questions
    if any(word in plan for word in ["code", "model", "endpoint", "router", "file", "function", "class", "how"]):
        hook = pre_tool_use("read_file", {})
        if hook["allowed"]:
            result = code_reader.run(question)
            post_tool_use("read_file", {"question": question}, str(result))
            results.append(f"Code: {result['summary']}\nFile: {result['file']}")

    # Compose final answer
    if results:
        combined = "\n\n".join(results)
        final_response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": f"Question: {question}\n\nInformation gathered:\n{combined}\n\nCompose a clear, concise answer."
                }
            ],
        )
        answer = final_response.content[0].text.strip()
    else:
        answer = response.content[0].text.strip()

    update_harness(question)
    return answer


if __name__ == "__main__":
    print("Bill Guy is ready. Type 'exit' to quit.\n")
    while True:
        question = input("You: ").strip()
        if question.lower() == "exit":
            break
        if not question:
            continue
        answer = ask(question)
        print(f"\nBill Guy: {answer}\n")