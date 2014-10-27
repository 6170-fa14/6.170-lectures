.PHONY: benchmark initsql

benchmark:
	siege -H "Cookie: user=adamc" -c 10 -r 50 -f urls.siege

PGAUTH := -h localhost -U fritter

initsql:
	-dropdb $(PGAUTH) fritter
	createdb $(PGAUTH) fritter
	psql $(PGAUTH) -f fritter.sql fritter
