#!/bin/bash

DAEMON=sshd
stop() {
    echo "Received SIGINT or SIGTERM. Shutting down $DAEMON"
    # Get PID
    pid=$(cat /var/run/$DAEMON/$DAEMON.pid)
    # Set TERM
    kill -SIGTERM "${pid}"
    # Wait for exit
    wait "${pid}"
    # All done.
    echo "Done."
}

trap stop SIGINT SIGTERM

/usr/sbin/sshd -D -e &
pid="$!"
mkdir -p /var/run/$DAEMON && echo "${pid}" > /var/run/$DAEMON/$DAEMON.pid

# echo "Running $@"
# /bin/bash -c "$@"

/bin/bash

wait "${pid}" && exit $?