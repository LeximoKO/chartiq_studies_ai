import asyncio

import openai

from src.app.core.infrastructure.config_constructor import load_config


config = load_config()

openai.api_key = config.chart_iq.open_ai_api_key
assistant_id = config.chart_iq.assistant_id

async def get_js_code(prompt: str) -> str:
    thread = openai.beta.threads.create()

    openai.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt
    )

    run = openai.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    while run.status not in ["completed", "requires_action"]:
        await asyncio.sleep(2)
        run = openai.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

    response = openai.beta.threads.messages.list(
        thread_id=thread.id
    )

    if response.data:
        return response.data[0].content[0].text.value.strip()
    else:
        return "Error: No response from assistant."


