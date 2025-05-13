import json
import re
import os
from typing import Dict, Any
import pymysql  # For MySQL

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
    db_port = os.environ.get('DB_PORT', '3306')  # Default MySQL port

    return pymysql.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        port=int(db_port)
    )

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Parse input
        body = json.loads(event['body'])
        required_fields = ['userId', 'firstName', 'lastName', 'emailId', 'phoneNumber', 'companyName', 'address']
        
        # Validate required fields
        for field in required_fields:
            if not body.get(field):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': f'{field} is required'})
                }
        
        # Validate email and phone format
        if not validate_email(body['emailId']):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Invalid email format'})
            }
            
        if not validate_phone(body['phoneNumber']):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Invalid phone number format'})
            }

        # Extract partner names if present
        partner_names = ''
        if 'partners' in body and isinstance(body['partners'], list):
            partner_names = ', '.join([p.get('name', '') for p in body['partners'] if 'name' in p])

        # Connect to RDS
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Create table if not exists
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS Users (
                        UserID INTEGER PRIMARY KEY,
                        FirstName VARCHAR(255) NOT NULL,
                        LastName VARCHAR(255) NOT NULL,
                        EmailID VARCHAR(255) UNIQUE NOT NULL,
                        PhoneNumber VARCHAR(20) NOT NULL,
                        CompanyName VARCHAR(255) NOT NULL,
                        Address TEXT NOT NULL,
                        PartnerNames TEXT
                    )
                ''')

                # Insert data
                try:
                    cursor.execute('''
                        INSERT INTO Users (UserID, FirstName, LastName, EmailID, PhoneNumber, CompanyName, Address, PartnerNames)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ''', (
                        body['userId'],
                        body['firstName'],
                        body['lastName'],
                        body['emailId'],
                        body['phoneNumber'],
                        body['companyName'],
                        body['address'],
                        partner_names
                    ))
                    conn.commit()
                except pymysql.err.IntegrityError as e:  # For MySQL
                    if 'Duplicate entry' in str(e):  # MySQL
                        return {
                            'statusCode': 409,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'message': 'User with this email already exists'})
                        }
                    raise

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'User saved successfully'})
        }
        
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