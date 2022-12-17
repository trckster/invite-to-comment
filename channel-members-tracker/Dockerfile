FROM python:3

RUN pip install poetry

WORKDIR /usr/src/app

COPY poetry.lock pyproject.toml ./

RUN poetry install --only main --no-interaction --no-ansi --no-root

ADD . .

CMD poetry run consumer
