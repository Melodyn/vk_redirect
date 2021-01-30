setup: install-dependencies run
install-dependencies:
	npm ci

# local run
run:
	IS_TEST_ENV=false HOST=0.0.0.0 PORT=8080 LOG_LEVEL=debug ./bin/index.js
stop:
	kill -15 `pidof node` || true

# dev
lint:
	npx eslint .
test:
	IS_TEST_ENV=true HOST=127.0.0.1 PORT=5000 LOG_LEVEL=silent npm test -s
test-dev:
	IS_TEST_ENV=true HOST=127.0.0.1 PORT=5000 LOG_LEVEL=silent npm test -s -- --watchAll

# usage with docker
container-setup: container-build container-dependency container-run
container-build:
	docker-compose build
container-dependency:
	docker-compose run --rm app make install-dependencies
container-run:
	docker-compose run --rm -p 8080:8080 app /bin/bash
