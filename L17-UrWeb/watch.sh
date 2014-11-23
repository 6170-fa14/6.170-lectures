# A script used in the live demo, to tweak the DB schema and restart the server each time the executable changes

while :
do
    inotifywait -qq fritter.exe
    killall -q fritter.exe
    psql -f fritter.sql fritter
    sleep 1
    ./fritter.exe -q &
done
