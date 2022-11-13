FROM python:3

RUN apt-get update
RUN apt-get -y install cron

RUN pip install poetry

WORKDIR /usr/src/app

COPY poetry.lock pyproject.toml ./

RUN poetry install --only main --no-interaction --no-ansi --no-root

RUN touch /var/log/cron.log
RUN echo "* * * * * root cd /usr/src/app && /usr/local/bin/poetry run tracker >> /var/log/cron.log 2>&1\n" > /etc/cron.d/tracker
RUN chmod 0644 /etc/cron.d/tracker

ADD . .

CMD printenv >> /etc/environment && cron && tail -f /var/log/cron.log
