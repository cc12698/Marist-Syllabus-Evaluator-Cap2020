import sys
import json

resp = {
    "Response":200,
    "Message": "Data from Python"
}

print(json.dumps(resp))
sys.stdout.flush()
