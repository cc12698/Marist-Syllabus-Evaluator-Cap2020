import sys
print('#Hello from python#')
print(sys.argv[1])
file = open(sys.argv[1], encoding="utf-8")
print(file.read())
