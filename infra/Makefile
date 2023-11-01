SHELL := /bin/bash

dev-up:
	docker compose -f docker-compose-dev.yml up

dev-up-d:
	docker compose -f docker-compose-dev.yml up -d

dev-down:
	docker compose -f docker-compose-dev.yml down

dev-migrate:
	docker compose -f docker-compose-dev.yml exec backend python manage.py migrate

dev-makemigrations:
	docker compose -f docker-compose-dev.yml exec backend python manage.py makemigrations

dev-collectstatic:
	docker compose -f docker-compose-dev.yml exec backend python manage.py collectstatic --noinput

dev-createsuperuser:
	docker compose -f docker-compose-dev.yml exec backend python manage.py createsuperuser

dev-back-restart:
	docker compose -f docker-compose-dev.yml down && docker rmi infra-backend:latest && docker compose -f docker-compose-dev.yml up -d
