def pre_tool_use(tool_name: str, tool_input: dict) -> dict:
    """
    Runs before any tool execution.
    Returns { "allowed": bool, "reason": str }
    """

    # Block dangerous SQL operations
    if tool_name == "query_db":
        sql = tool_input.get("sql", "").strip().upper()
        dangerous = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE"]
        for keyword in dangerous:
            if keyword in sql:
                return {
                    "allowed": False,
                    "reason": f"Dangerous SQL operation detected: {keyword}"
                }

    # Block writing to files
    if tool_name == "write_file":
        return {
            "allowed": False,
            "reason": "Bill Guy is not allowed to modify files."
        }

    return {"allowed": True, "reason": "OK"}