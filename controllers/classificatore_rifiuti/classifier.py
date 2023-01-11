# create a new file named "test.txt"

import os
import sys

with open('test.txt', 'w') as f:
    f.write('Create a new text file!')
    f.close()

print("Non riconosciuto")