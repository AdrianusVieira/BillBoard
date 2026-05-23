from datetime import datetime

LOG_PATH = "agents/harness/progress.md"

def post_tool_use(tool_name: str, tool_input: dict, result: str) -> None:
    """
    Runs after any tool execution.
    Logs the action to the harness progress file.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    log_entry = f"- [{timestamp}] tool `{tool_name}` called with `{tool_input}` → {result[:80]}...\n"

    try:
        with open(LOG_PATH, "a") as f:
            f.write(log_entry)
    except Exception as e:
        print(f"post_tool_use logging error: {e}")