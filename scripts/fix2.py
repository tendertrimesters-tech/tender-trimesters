import sys, pathlib
sys.path.insert(0, '/home/z/my-project')

path = pathlib.Path('scripts/generate-marketing-plan.js')
c = path.read_bytes()
fixed = nc.replace(b'\xe2\x80\x9c'.decode(), b'"'.decode())
path.write_bytes(fixed)
print('Done')
