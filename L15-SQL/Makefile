.PHONY: benchmark initsql

benchmark:
	siege -H "Cookie: user=adamc" -c 10 -r 20 http://localhost:8080/

PGAUTH := -h localhost -U fritter

initsql:
	-dropdb $(PGAUTH) fritter
	createdb $(PGAUTH) fritter
	psql $(PGAUTH) -f fritter.sql fritter
