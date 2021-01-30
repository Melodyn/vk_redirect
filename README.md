# Redirect app

[![CI](../../workflows/CI/badge.svg)](../../actions?query=workflow%3A"CI")

Web: https://melodyn-vk-redirect.herokuapp.com


## Установка и запуск

Требования:
* Node.js >= 12;
* npm >= 6.14;
* (опционально) make >= 4;
* (опционально) docker >= 20;

Разворачивание:
* Клонировать этот репозиторий;
* `make setup` для установки первый раз.

Использование
* `make run` запуск приложения;\

Ещё команды:
* `make test` - запустить тесты;
* `make lint` - запустить линтер;
* `container-setup` - установка и запуск в docker-контейнере.
* `container-run` - запуск docker-контейнера с приложением. Далее - `make run` внутри контейнера.
