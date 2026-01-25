"""
ClipPremium License Code Generator
Simple CSV generator for manual import to database
"""

def generate_license_codes(start_num=1, license_type='PERS', year=2026, quantity=50):
    """
    Generate license codes in CSV format
    
    Args:
        start_num: Starting number (e.g., 1, 11, 101)
        license_type: 'PERS' (Personal) or 'AGNC' (Agency)
        year: Year of generation (default: 2026)
        quantity: How many codes to generate
    
    Returns:
        List of tuples (code, type_full, status, notes, sql_statement)
    """
    type_full = 'personal' if license_type == 'PERS' else 'agency'
    codes = []
    
    for i in range(quantity):
        num = str(start_num + i).zfill(4)
        code = f'CLIPPREM-{license_type}-{year}-{num}'
        
        sql = f"('{code}', '{type_full}', 'unused', 'Batch {year}-01-09'),"
        
        codes.append({
            'code': code,
            'type': type_full,
            'status': 'unused',
            'notes': f'Generated {year}-01-09',
            'sql': sql
        })
    
    return codes

def save_to_files(codes, prefix='license_codes'):
    """Save codes to CSV and SQL files"""
    
    # CSV file
    csv_filename = f'{prefix}.csv'
    with open(csv_filename, 'w', encoding='utf-8') as f:
        f.write('license_code,license_type,status,notes\\n')
        for code_data in codes:
            f.write(f'{code_data["code"]},{code_data["type"]},{code_data["status"]},{code_data["notes"]}\\n')
    
    # SQL file
    sql_filename = f'{prefix}.sql'
    with open(sql_filename, 'w', encoding='utf-8') as f:
        f.write('-- ClipPremium License Codes\\n')
        f.write('-- Generated: 2026-01-09\\n\\n')
        f.write('INSERT INTO license_codes (license_code, license_type, status, notes) VALUES\\n')
        for i, code_data in enumerate(codes):
            sql_line = code_data['sql']
            if i == len(codes) - 1:
                sql_line = sql_line.rstrip(',') + ';'
            f.write(sql_line + '\\n')
    
    return csv_filename, sql_filename

if __name__ == '__main__':
    print('ClipPremium License Code Generator')
    print('=' * 50)
    
    # Configuration
    start_num = int(input('Starting Number (e.g., 1, 11, 101): ') or '1')
    license_type = input('License Type (PERS/AGNC): ').upper() or 'PERS'
    year = int(input('Year (e.g., 2026): ') or '2026')
    quantity = int(input('Quantity (e.g., 50): ') or '50')
    
    print(f'\\nGenerating {quantity} codes...')
    codes = generate_license_codes(start_num, license_type, year, quantity)
    
    csv_file, sql_file = save_to_files(codes, f'clippremium_{license_type.lower()}_{year}')
    
    print(f'\\n✅ Generated {len(codes)} codes:')
    print(f'   📄 CSV: {csv_file}')
    print(f'   📄 SQL: {sql_file}')
    print(f'\\nFirst 5 codes:')
    for code in codes[:5]:
        print(f'   - {code["code"]}')
    
    print(f'\\n🚀 Upload SQL file to phpMyAdmin or run:')
    print(f'   mysql -u username -p database_name < {sql_file}')
