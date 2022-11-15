FROM python:3

RUN apt-get update
RUN apt-get -y install cron

RUN pip install poetry

WORKDIR /usr/src/app

COPY poetry.lock pyproject.toml ./

RUN poetry install --only main --no-interaction --no-ansi --no-root

# At first I tried to run this script every minute, but got blocked after 2 hours
RUN echo "0 * * * * root cd /usr/src/app && /usr/local/bin/poetry run tracker >/proc/1/fd/1 2>/proc/1/fd/2\n" > /etc/cron.d/tracker
RUN chmod 0644 /etc/cron.d/tracker

ADD . .

CMD printenv >> /etc/environment && cron -f
