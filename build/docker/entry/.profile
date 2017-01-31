set -evx

echo "--------"
echo "nginx-monaco-go: .profile"

echo "
 pwd: $(pwd)
file: $(basename $BASH_SOURCE)
"

echo "--------"