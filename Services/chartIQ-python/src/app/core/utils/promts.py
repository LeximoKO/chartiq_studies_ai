def get_generate_study_prompt(question: str) -> str:
    return f"""
    Generate JavaScript code for the following ChartIQ study: "{question}".
    Ensure that the output contains only **clean code** without any extra formatting, comments, or explanations.
    """
