.PHONY: up down clear

up: ## Bring up dev stack
	docker compose -p brocabs -f ./docker/docker-compose.yml up -d

down: ## Tear down dev stack
	docker compose -p brocabs -f ./docker/docker-compose.yml down
	
clear: ## Clear all containers and volumes
	docker compose -p brocabs -f ./docker/docker-compose.yml down -v