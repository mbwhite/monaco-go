# set -e

echo "--------"
echo "nginx-monaco-go: .bash_profile"

echo "
 pwd: $(pwd)
file: $(basename $BASH_SOURCE)
"

echo "--------"

if [[ -n "START_COMMAND" ]]; then
  start_command="$START_COMMAND"
  unset START_COMMAND
  echo "pid: " $$ $BASHPID
  $start_command & sleep 1
  echo "jobs: " `jobs -p`
fi