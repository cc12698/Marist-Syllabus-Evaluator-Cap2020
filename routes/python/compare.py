import sys
print('#Hello from python#')
print(sys.argv[1])
f = open(sys.argv[1], "r")
print(f.read())
