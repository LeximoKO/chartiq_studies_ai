import os
import time

import aiofiles
import jsbeautifier

from openai import OpenAI
from src.app.core.schemas import StudyRequest, StudyResponse


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

HTML_FILE_PATH = '/app/chartiq/active-trader-chart.html'
STUDIES_DIR = '/app/shared/'
ASSISTANT_ID = os.getenv("ASSISTANT_ID")

def create_thread_with_assistant(prompt):
    try:
        thread = client.beta.threads.create()

        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=prompt
        )

        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=ASSISTANT_ID
        )

        while run.status != 'completed':
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            time.sleep(2)

        messages = client.beta.threads.messages.list(thread_id=thread.id)

        for message in messages:
            if message.role == 'assistant':
                return message.content[0].text.value

    except Exception as e:
        print(f"Ошибка при использовании ассистента: {e}")
        return None

async def get_next_file_name(directory: str) -> str:
    if not os.path.exists(directory):
        os.makedirs(directory)

    files = os.listdir(directory)
    test_files = [f for f in files if f.startswith("test") and f.endswith(".js")]

    if test_files:
        numbers = [int(f[4:-3]) for f in test_files]
        next_number = max(numbers) + 1
    else:
        next_number = 1

    return f"test{next_number}.js"

def format_js_code(js_code: str) -> str:
    opts = jsbeautifier.default_options()
    opts.indent_size = 4
    return jsbeautifier.beautify(js_code, opts)

async def update_html_with_study(file_name: str):
    if not os.path.exists(HTML_FILE_PATH):
        raise FileNotFoundError(f"HTML файл не найден по пути: {HTML_FILE_PATH}")

    async with aiofiles.open(HTML_FILE_PATH, 'r', encoding='utf-8') as f:
        html_content = await f.read()

    import_line = f'import "/js/advanced/studies/{file_name}";'

    if import_line not in html_content:
        html_content = html_content.replace('</script>', f'{import_line}\n</script>')

    async with aiofiles.open(HTML_FILE_PATH, 'w', encoding='utf-8') as f:
        await f.write(html_content)

    return f"HTML файл обновлен с импортом и вызовом для {file_name}"

async def generate_js_code(question: StudyRequest) -> StudyResponse:
    response = create_thread_with_assistant(question)

    if not response:
        return "Ошибка генерации кода."

    clean_code = response.replace('```javascript', '').replace('```', '').strip()
    clean_code = '\n'.join([line.strip() for line in clean_code.splitlines() if line.strip()])
    formatted_code = format_js_code(clean_code)

    directory = STUDIES_DIR
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_name = await get_next_file_name(directory)
    file_path = os.path.join(directory, file_name)

    async with aiofiles.open(file_path, 'w', encoding='utf-8') as js_file:
        await js_file.write(formatted_code)

    await update_html_with_study(file_name)

    return f"Code successfully saved to {file_path} and HTML updated."
