import json,sys
d=json.load(open(sys.argv[1]))
print({k: (round(v['score']*100) if v['score'] is not None else None) for k,v in d['categories'].items()})
a=d['audits']
print({m: a[m]['displayValue'] for m in ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index']})
it=a.get('largest-contentful-paint-element',{}).get('details',{}).get('items',[])
try: print('LCP el:', it[0]['items'][0]['node']['snippet'][:120])
except Exception: pass
for it in a['color-contrast'].get('details',{}).get('items',[])[:6]: print('contrast:', it['node']['snippet'][:120])
