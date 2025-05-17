import json
import re
import os
from typing import Dict, Any
import pg8000  # Pure Python PostgreSQL driver
from datetime import date, datetime
import psycopg2

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

def create_tables():
    """Create all required tables if they don't exist"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # 1. Main table for user and basic details
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_users (
                merchant_id VARCHAR(50) PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                full_name VARCHAR(200) NOT NULL,
                email_id VARCHAR(255) NOT NULL,
                mobile_no VARCHAR(20) NOT NULL,
                phone_no VARCHAR(20),
                dob DATE,
                personal_pan VARCHAR(20),
                personal_street1 TEXT,
                personal_street2 TEXT,
                personal_city VARCHAR(100),
                personal_pin VARCHAR(20)
            )
        """)

        # 2. Business and website details table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_business (
                merchant_id VARCHAR(50) PRIMARY KEY REFERENCES merchant_users(merchant_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                business_name VARCHAR(255) NOT NULL,
                    business_name_dba VARCHAR(255),
                business_type VARCHAR(100) NOT NULL,
                    incorporation_date DATE,
                merchant_zone VARCHAR(100),
                ann_business_turnover DECIMAL(20,2),
                business_address_registered TEXT NOT NULL,
                city_registered VARCHAR(100) NOT NULL,
                state_registered VARCHAR(100) NOT NULL,
                country_registered VARCHAR(100) NOT NULL,
                pin_code_registered VARCHAR(20) NOT NULL,
                    business_address_operational TEXT,
                city_operational VARCHAR(100),
                state_operational VARCHAR(100),
                country_operational VARCHAR(100),
                pin_code_operational VARCHAR(20),
                industry VARCHAR(100) NOT NULL,
                sub_industry VARCHAR(100),
                business_segment VARCHAR(50) NOT NULL,
                business_age VARCHAR(50),
                business_pan VARCHAR(20) NOT NULL,
                gstn VARCHAR(50),
                    mcc VARCHAR(50),
                affl_cert_atom VARCHAR(50),
                pg_use_case TEXT,
                website VARCHAR(255),
                    about_url VARCHAR(255),
                    contact_us_url VARCHAR(255),
                    refund_policy_url VARCHAR(255),
                    privacy_policy_url VARCHAR(255),
                    terms_url VARCHAR(255),
                    check_out_url VARCHAR(255),
                    additional_url VARCHAR(255),
                mon_turnover DECIMAL(20,2),
                mon_card_turnover DECIMAL(20,2),
                day_txn_no INTEGER,
                day_upi_txn_no INTEGER,
                day_upi_max_lmt DECIMAL(20,2),
                per_upi_txn_lmt DECIMAL(20,2),
                upi_vpa VARCHAR(100)
            )
        """)

        # 3. Nodal account and POC details table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_nodal_poc (
                merchant_id VARCHAR(50) PRIMARY KEY REFERENCES merchant_users(merchant_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                nodal_account_name VARCHAR(255) NOT NULL,
                nodal_bank VARCHAR(100) NOT NULL,
                nodal_branch_code VARCHAR(50) NOT NULL,
                nodal_branch_name VARCHAR(255) NOT NULL,
                nodal_account_number VARCHAR(50) NOT NULL,
                nodal_ifsc VARCHAR(20) NOT NULL,
                submission_date DATE NOT NULL,
                ae_contact VARCHAR(255) NOT NULL,
                chargeback_contact VARCHAR(255) NOT NULL,
                finance_contact VARCHAR(255) NOT NULL,
                product_support_contact VARCHAR(255) NOT NULL,
                verification_contact VARCHAR(255) NOT NULL
            )
        """)

        # 4. HDFC details table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_hdfc (
                merchant_id VARCHAR(50) PRIMARY KEY REFERENCES merchant_users(merchant_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                hdfc_sl_no VARCHAR(50) NOT NULL,
                tid_type VARCHAR(50) NOT NULL,
                no_of_tid VARCHAR(50) NOT NULL,
                tid_req VARCHAR(255) NOT NULL,
                ref_tid VARCHAR(50),
                hdfc_setup_type VARCHAR(50) NOT NULL,
                hdfc_promo VARCHAR(50),
                entity_mid VARCHAR(50) NOT NULL,
                hdfc_integration_approach VARCHAR(50) NOT NULL,
                hdfc_settlement_type VARCHAR(50) NOT NULL,
                    hdfc_upi_whitelist1 VARCHAR(255),
                    hdfc_upi_whitelist2 VARCHAR(255),
                ext_mid VARCHAR(50),
                ext_tid VARCHAR(50),
                modify_flag VARCHAR(10) NOT NULL,
                upi_txn_type VARCHAR(50),
                hdfc_status VARCHAR(20) DEFAULT 'pending' CHECK (hdfc_status IN ('pending', 'approved', 'rejected')),
                hdfc_mid VARCHAR(100) DEFAULT 'Not Assigned',
                hdfc_mid_assigned_at TIMESTAMP,
                hdfc_mid_assigned_by VARCHAR(100),
                hdfc_enabled_modes JSONB DEFAULT '[]'::jsonb
            )
        """)

        # 5. Atom details table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_atom (
                merchant_id VARCHAR(50) PRIMARY KEY REFERENCES merchant_users(merchant_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                atom_pg_modes TEXT[] NOT NULL,
                atom_settlement_type VARCHAR(50) NOT NULL,
                surcharge_status VARCHAR(10) NOT NULL,
                bill_to VARCHAR(50) NOT NULL,
                integration_kit VARCHAR(50) NOT NULL,
                atom_integration_type VARCHAR(50) NOT NULL,
                atom_pre_integration VARCHAR(50) NOT NULL,
                atom_prod_id_name VARCHAR(255) NOT NULL,
                atom_domain_check VARCHAR(10) NOT NULL,
                atom_multi_status VARCHAR(50) NOT NULL,
                website_login_details TEXT,
                website_status VARCHAR(10) NOT NULL,
                atom_min_ticket_size DECIMAL(20,2),
                atom_max_ticket_size DECIMAL(20,2),
                pricing_details TEXT,
                atom_status VARCHAR(20) DEFAULT 'pending' CHECK (atom_status IN ('pending', 'approved', 'rejected')),
                atom_mid VARCHAR(100) DEFAULT 'Not Assigned',
                atom_mid_assigned_at TIMESTAMP,
                atom_mid_assigned_by VARCHAR(100),
                atom_enabled_modes JSONB DEFAULT '[]'::jsonb
            )
        """)

        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def generate_merchant_id(conn) -> str:
    """Generate a unique merchant ID based on timestamp and sequence"""
    cur = conn.cursor()
    try:
        # Get the current timestamp
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # Get the next sequence number for today
        cur.execute("""
            CREATE TABLE IF NOT EXISTS merchant_id_sequence (
                date_prefix VARCHAR(8) PRIMARY KEY,
                last_sequence INTEGER DEFAULT 0
            )
        """)
        
        date_prefix = datetime.now().strftime('%Y%m%d')
        cur.execute("""
            INSERT INTO merchant_id_sequence (date_prefix, last_sequence)
            VALUES (%s, 0)
            ON CONFLICT (date_prefix) DO UPDATE
            SET last_sequence = merchant_id_sequence.last_sequence + 1
            RETURNING last_sequence
        """, (date_prefix,))
        
        sequence = cur.fetchone()[0]
        
        # Format: YYYYMMDD-XXXXX (where XXXXX is the sequence number)
        merchant_id = f"{date_prefix}-{sequence:05d}"
        
        return merchant_id
    finally:
        cur.close()

def insert_merchant_data(data: Dict[str, Any]):
    """Insert merchant data into all tables"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Generate merchant_id if not provided
        merchant_id = data.get('merchantId')
        if not merchant_id:
            merchant_id = generate_merchant_id(conn)
            data['merchantId'] = merchant_id

        # 1. Insert into merchant_users
        cur.execute("""
            INSERT INTO merchant_users (
                merchant_id, status, first_name, last_name, full_name,
                email_id, mobile_no, phone_no, dob, personal_pan, personal_street1,
                personal_street2, personal_city, personal_pin
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            merchant_id, data.get('status', 'pending'),
            data.get('first_name'), data.get('last_name'), data.get('full_name'),
            data.get('email_id'), data.get('mobile_no'), data.get('phone_no'),
            data.get('dob'), data.get('personal_pan'), data.get('personal_street1'),
            data.get('personal_street2'), data.get('personal_city'), data.get('personal_pin')
        ))

        # 2. Insert into merchant_business
        cur.execute("""
            INSERT INTO merchant_business (
                merchant_id, business_name, business_name_dba, business_type,
                incorporation_date, merchant_zone, ann_business_turnover,
                business_address_registered, city_registered, state_registered,
                country_registered, pin_code_registered, business_address_operational,
                city_operational, state_operational, country_operational,
                pin_code_operational, industry, sub_industry, business_segment,
                business_age, business_pan, gstn, mcc, affl_cert_atom, pg_use_case,
                website, about_url, contact_us_url, refund_policy_url,
                privacy_policy_url, terms_url, check_out_url, additional_url,
                mon_turnover, mon_card_turnover, day_txn_no, day_upi_txn_no,
                day_upi_max_lmt, per_upi_txn_lmt, upi_vpa
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            merchant_id, data.get('business_name'), data.get('business_name_dba'),
            data.get('business_type'), data.get('incorporation_date'), data.get('merchant_zone'),
            data.get('ann_business_turnover'), data.get('business_address_registered'),
            data.get('city_registered'), data.get('state_registered'), data.get('country_registered'),
            data.get('pin_code_registered'), data.get('business_address_operational'),
            data.get('city_operational'), data.get('state_operational'), data.get('country_operational'),
            data.get('pin_code_operational'), data.get('industry'), data.get('sub_industry'),
            data.get('business_segment'), data.get('business_age'), data.get('business_pan'),
            data.get('gstn'), data.get('mcc'), data.get('affl_cert_atom'), data.get('pg_use_case'),
            data.get('website'), data.get('about_url'), data.get('contact_us_url'),
            data.get('refund_policy_url'), data.get('privacy_policy_url'), data.get('terms_url'),
            data.get('check_out_url'), data.get('additional_url'), data.get('mon_turnover'),
            data.get('mon_card_turnover'), data.get('day_txn_no'), data.get('day_upi_txn_no'),
            data.get('day_upi_max_lmt'), data.get('per_upi_txn_lmt'), data.get('upi_vpa')
        ))

        # 3. Insert into merchant_nodal_poc
        cur.execute("""
            INSERT INTO merchant_nodal_poc (
                merchant_id, nodal_account_name, nodal_bank, nodal_branch_code,
                nodal_branch_name, nodal_account_number, nodal_ifsc, submission_date,
                ae_contact, chargeback_contact, finance_contact,
                product_support_contact, verification_contact
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            merchant_id, data.get('nodal_account_name'), data.get('nodal_bank'),
            data.get('nodal_branch_code'), data.get('nodal_branch_name'),
            data.get('nodal_account_number'), data.get('nodal_ifsc'), data.get('submission_date'),
            data.get('ae_contact'), data.get('chargeback_contact'), data.get('finance_contact'),
            data.get('product_support_contact'), data.get('verification_contact')
        ))

        # 4. Insert into merchant_hdfc
        cur.execute("""
            INSERT INTO merchant_hdfc (
                merchant_id, hdfc_sl_no, tid_type, no_of_tid, tid_req, ref_tid,
                hdfc_setup_type, hdfc_promo, entity_mid, hdfc_integration_approach,
                hdfc_settlement_type, hdfc_upi_whitelist1, hdfc_upi_whitelist2,
                ext_mid, ext_tid, modify_flag, upi_txn_type, hdfc_status, hdfc_mid,
                hdfc_mid_assigned_at, hdfc_mid_assigned_by, hdfc_enabled_modes
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                'pending', 'Not Assigned', NULL, NULL, '[]'::jsonb
            )
        """, (
            merchant_id, data.get('hdfc_sl_no'), data.get('tid_type'),
            data.get('no_of_tid'), data.get('tid_req'), data.get('ref_tid'),
            data.get('hdfc_setup_type'), data.get('hdfc_promo'), data.get('entity_mid'),
            data.get('hdfc_integration_approach'), data.get('hdfc_settlement_type'),
            data.get('hdfc_upi_whitelist1'), data.get('hdfc_upi_whitelist2'),
            data.get('ext_mid'), data.get('ext_tid'), data.get('modify_flag'),
            data.get('upi_txn_type')
        ))

        # 5. Insert into merchant_atom
        cur.execute("""
            INSERT INTO merchant_atom (
                merchant_id, atom_pg_modes, atom_settlement_type, surcharge_status,
                bill_to, integration_kit, atom_integration_type, atom_pre_integration,
                atom_prod_id_name, atom_domain_check, atom_multi_status,
                website_login_details, website_status, atom_min_ticket_size,
                atom_max_ticket_size, pricing_details, atom_status, atom_mid,
                atom_mid_assigned_at, atom_mid_assigned_by, atom_enabled_modes
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                'pending', 'Not Assigned', NULL, NULL, '[]'::jsonb
            )
        """, (
            merchant_id, data.get('atom_pg_modes'), data.get('atom_settlement_type'),
            data.get('surcharge_status'), data.get('bill_to'), data.get('integration_kit'),
            data.get('atom_integration_type'), data.get('atom_pre_integration'),
            data.get('atom_prod_id_name'), data.get('atom_domain_check'),
            data.get('atom_multi_status'), data.get('website_login_details'),
            data.get('website_status'), data.get('atom_min_ticket_size'),
            data.get('atom_max_ticket_size'), data.get('pricing_details')
        ))

        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def lambda_handler(event, context):
    """AWS Lambda handler function"""
    try:
        # Create tables if they don't exist
        create_tables()
        
        # Get the request body
        body = json.loads(event.get('body', '{}'))
        
        # Insert the data
        insert_merchant_data(body)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Merchant data inserted successfully'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        } 