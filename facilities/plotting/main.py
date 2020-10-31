from matplotlib import pyplot as plt
import json
import redis
import time

rc = redis.Redis()


data = rc.get('plotting>input').decode('utf-8')
data = json.loads(data)
plt.plot(data)
plt.savefig('../../data/plotting/output.png')
plt.close()
 
