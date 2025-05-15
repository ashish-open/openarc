import json
import re
import os
from typing import Dict, Any
import pg8000  # Pure Python PostgreSQL driver
from datetime import date

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    pattern = r'^\+?1?\d{9,15}$'
    return bool(re.match(pattern, phone))

def get_db_connection():
    # Get database credentials from environment variables
    db_host = os.environ['DB_HOST']
    db_name = os.environ['DB_NAME']
    db_user = os.environ['DB_USER']
    db_password = os.environ['DB_PASSWORD']
    db_port = os.environ.get('DB_PORT', '5432')  # Default PostgreSQL port

    return pg8000.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        port=int(db_port),
        ssl_context=True  # For AWS RDS SSL
    )

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Parse input
        body = json.loads(event['body'])
        
        # Basic validation for critical fields
        if not body.get('business_name'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Business name is required'})
            }
        
        # Validate email format if provided
        if body.get('email_id') and not validate_email(body['email_id']):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Invalid email format'})
            }
            
        # Validate phone format if provided
        if body.get('mobile_no') and not validate_phone(body['mobile_no']):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Invalid phone number format'})
            }

        # Process payment modes array to JSONB format for PostgreSQL
        if 'pg_modes' in body and isinstance(body['pg_modes'], list):
            payment_modes = json.dumps(body['pg_modes'])
        else:
            payment_modes = '[]'
        
        # Add submission date if not provided
        if 'submission_date' not in body:
            body['submission_date'] = date.today().isoformat()
            
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Check for existing email_id
            email = body.get('email_id')
            if email:
                cursor.execute("SELECT id FROM pg_applications WHERE email_id = %s LIMIT 1", (email,))
                if cursor.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'message': 'Email ID already exists'})
                    }
            # Check for existing mobile_no
            phone = body.get('mobile_no')
            if phone:
                cursor.execute("SELECT id FROM pg_applications WHERE mobile_no = %s LIMIT 1", (phone,))
                if cursor.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'message': 'Mobile Number already exists'})
                    }
            # Create table if not exists - PostgreSQL syntax
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS pg_applications (
                    id SERIAL PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
                    -- Legacy fields
                    merchant_id VARCHAR(100),
                    company_name VARCHAR(255),
                    status VARCHAR(50) DEFAULT 'pending',
                    technical_contact_name VARCHAR(255),
                    technical_contact_email VARCHAR(255),
                    technical_contact_phone VARCHAR(50),
                    
                    -- Basic Details
                    nodal_account_name VARCHAR(255),
                    submission_date DATE,
                    business_name VARCHAR(255),
                    business_name_dba VARCHAR(255),
                    incorporation_date DATE,
                    website VARCHAR(255),
                    full_name VARCHAR(255),
                    mobile_no VARCHAR(50),
                    email_id VARCHAR(255),
                    dob DATE,
                    business_address_operational TEXT,
                    mcc VARCHAR(50),
                    about_url VARCHAR(255),
                    contact_us_url VARCHAR(255),
                    refund_policy_url VARCHAR(255),
                    privacy_policy_url VARCHAR(255),
                    terms_url VARCHAR(255),
                    ann_business_turnover VARCHAR(100),
                    mon_card_turnover VARCHAR(100),
                    day_txn_no VARCHAR(50),
                    pg_use_case TEXT,
                    business_pan VARCHAR(50),
                    business_type VARCHAR(100),
                    upi_vpa VARCHAR(100),
                    gstn VARCHAR(50),
                    
                    -- HDFC - Cards
                    hdfc_sl_no VARCHAR(100),
                    business_operational_pin VARCHAR(20),
                    tid_type VARCHAR(100),
                    no_of_tid VARCHAR(50),
                    tid_req VARCHAR(50),
                    check_out_url VARCHAR(255),
                    additional_url VARCHAR(255),
                    business_age VARCHAR(50),
                    pg_setup_type VARCHAR(100),
                    hdfc_promo VARCHAR(255),
                    ref_tid VARCHAR(100),
                    
                    -- HDFC - UPI
                    entity_mid VARCHAR(100),
                    hdfc_integration_approach VARCHAR(100),
                    hdfc_settlement_type VARCHAR(100),
                    day_upi_txn_no VARCHAR(50),
                    day_upi_max_lmt VARCHAR(100),
                    per_upi_txn_lmt VARCHAR(100),
                    hdfc_upi_whitelist1 VARCHAR(255),
                    hdfc_upi_whitelist2 VARCHAR(255),
                    ext_mid VARCHAR(100),
                    ext_tid VARCHAR(100),
                    modify_flag VARCHAR(50),
                    upi_txn_type VARCHAR(100),
                    
                    -- Atom - Contact Field
                    first_name VARCHAR(100),
                    last_name VARCHAR(100),
                    
                    -- Atom - Account Field Details
                    phone_no VARCHAR(50),
                    merchant_zone VARCHAR(100),
                    business_address_registered TEXT,
                    city VARCHAR(100),
                    state VARCHAR(100),
                    business_operation_pin VARCHAR(20),
                    country VARCHAR(100),
                    industry VARCHAR(100),
                    sub_industry VARCHAR(100),
                    business_segment VARCHAR(100),
                    affl_cert_atom VARCHAR(255),
                    personal_pan VARCHAR(50),
                    personal_pin VARCHAR(20),
                    personal_street1 VARCHAR(255),
                    personal_street2 VARCHAR(255),
                    ae_name VARCHAR(255),
                    chargeback_contact VARCHAR(255),
                    finance_contact VARCHAR(255),
                    product_support_contact VARCHAR(255),
                    setup_contact VARCHAR(255),
                    
                    -- Atom - Opportunities Field Details
                    payment_modes JSONB,
                    atom_settlement_type VARCHAR(100),
                    surcharge_status VARCHAR(10),
                    bill_to VARCHAR(255),
                    integration_kit VARCHAR(255),
                    atom_integration_type VARCHAR(100),
                    atom_pre_integration VARCHAR(100),
                    nodal_bank VARCHAR(255),
                    nodal_branch_code VARCHAR(100),
                    nodal_branch_name VARCHAR(255),
                    nodal_account_number VARCHAR(100),
                    nodal_ifsc VARCHAR(50),
                    hdfc_prod_id_name VARCHAR(255),
                    hdfc_domain_check VARCHAR(255),
                    atom_multi_status VARCHAR(100),
                    website_login_details TEXT,
                    website_status VARCHAR(100),
                    atom_min_ticket_size VARCHAR(100),
                    atom_max_ticket_size VARCHAR(100),
                    pricing_details TEXT
                )
            ''')

            # Build dynamic INSERT query
            columns = []
            placeholders = []
            values = []
            
            # Process all form fields except pg_modes (handled separately)
            for key, value in body.items():
                if key != 'pg_modes' and value is not None and value != '':
                    columns.append(key)
                    placeholders.append('%s')  # pg8000 with PostgreSQL uses %s, not ?
                    values.append(value)
            
            # Add payment_modes separately
            columns.append('payment_modes')
            placeholders.append('%s')
            values.append(payment_modes)
            
            # Build the SQL query - PostgreSQL uses RETURNING for getting inserted ID
            columns_str = ', '.join(columns)
            placeholders_str = ', '.join(placeholders)
            
            insert_query = f'''
                INSERT INTO pg_applications ({columns_str})
                VALUES ({placeholders_str})
                RETURNING id
            '''
            
            # Execute the query
            cursor.execute(insert_query, values)
            
            # Get the inserted ID - PostgreSQL specific way
            result = cursor.fetchone()
            application_id = result[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Payment gateway application saved successfully',
                    'data': {
                        'id': application_id
                    }
                })
            }
        
        finally:
            cursor.close()
            conn.close()
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Invalid JSON in request body'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': f'Internal server error: {str(e)}'})
        } 