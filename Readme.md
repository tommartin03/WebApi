docker compose build
docker compose up -d
docker exec -ti tom-martin-container bash
cd contacts/
composer.phar install
symfony server:start --listen-ip=0.0.0.0
symfony console d:m:m

