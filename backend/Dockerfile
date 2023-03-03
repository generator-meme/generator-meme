FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir

COPY . .

CMD ["gunicorn", "generator_meme.wsgi:application", "--bind", "0:8000" ]