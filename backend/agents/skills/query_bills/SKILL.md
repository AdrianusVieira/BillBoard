# Skill: Query Bills

When answering any question about bill data, always:

1. Read harness/conventions.md to confirm query rules
2. Invoke the db_reader sub agent
3. Use the example queries in example.sql as reference
4. Return only the data relevant to the question
5. Always include a human-readable summary alongside the raw data

## When to use this skill
- "Which bills are unpaid?"
- "How much do I owe this month?"
- "Show me all bills for group X"
- "Which bills are overdue?"
- Any question involving amounts, dates, or payment status