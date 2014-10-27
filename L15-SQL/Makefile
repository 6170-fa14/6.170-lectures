.PHONY: benchmark initsql initsql_basic

benchmark:
	siege -H "Cookie: user=benchmark" -c 10 -r 50 -f urls.siege

PGAUTH := -h localhost -U fritter

initsql:
	-dropdb $(PGAUTH) fritter
	createdb $(PGAUTH) fritter
	psql $(PGAUTH) -f fritter.sql fritter

initsql_basic:
	-dropdb $(PGAUTH) fritter
	createdb $(PGAUTH) fritter
	psql $(PGAUTH) -f fritter_basic.sql fritter
