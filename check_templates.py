import requests, json

data = requests.get('https://www.calius.digital/api/templates').json()
t = data if isinstance(data, list) else data.get('templates', [])
for tmpl in t:
    print(f"id={tmpl.get('id')} slug={tmpl.get('slug')} category={tmpl.get('category')} name={tmpl.get('name')}")
print(f'\nTotal: {len(t)}')
