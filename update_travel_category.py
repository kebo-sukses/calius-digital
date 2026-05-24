import requests

# Login
r = requests.post('https://www.calius.digital/api/auth/login', json={'username': 'Jeslius', 'password': 'Calius2026!'})
token = r.json()['access_token']
headers = {'Authorization': 'Bearer ' + token}

# Fetch TravelGo full template
travel_id = 'd9fb9031-9129-46bc-8548-10722bebd8d8'
data = requests.get('https://www.calius.digital/api/templates').json()
t = data if isinstance(data, list) else data.get('templates', [])
travel = next((x for x in t if x.get('id') == travel_id), None)

if not travel:
    print('Template not found')
else:
    print(f"Current category: {travel['category']}")
    # Build full payload (required fields) with updated category
    payload = {k: v for k, v in travel.items() if k not in ('id', '_id', 'created_at', 'updated_at', 'downloads', 'rating')}
    payload['category'] = 'travel'
    print(f"Updating to: {payload['category']}")
    res = requests.put(f'https://www.calius.digital/api/admin/templates/{travel_id}', headers=headers, json=payload)
    print(f"Status: {res.status_code}")
    print(res.text[:300])
