import sys
print('#Hello from python#')
print(sys.argv[1])
file = open(sys.argv[1], r)
print(file.read())
