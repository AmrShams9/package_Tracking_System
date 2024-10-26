import psycopg2
from flask import jsonify

# Database connection parameters
host = "localhost"  # or your database host
user = "Ali"  # replace with your PostgreSQL username
password = "Ali1"  # replace with your PostgreSQL password


class DATABASE:

    def __init__(self, database_name):
        self.connection = psycopg2.connect(
            host=host,
            database=database_name,
            user=user,
            password=password
        )
        self.cursor = self.connection.cursor()

    def user_exists(self, user_data):
        # Check if the user exists based on their name or email
        check_existing_user_query = '''SELECT EXISTS (
            SELECT 1 FROM "User" WHERE  email = %s
        );'''

        self.cursor.execute(check_existing_user_query, [user_data['email']])
        return self.cursor.fetchone()[0]  # Fetch the result (True/False)

    def check_user(self, user_data):
        # Check if the user exists in the database based on their name and password
        check_user_query = '''SELECT EXISTS (
            SELECT 1 FROM "User" WHERE email = %s AND password = %s
        );'''
        self.cursor.execute(check_user_query, [user_data['email'], user_data['password']])
        return self.cursor.fetchone()[0]  # Fetch the result (True/False)

    def register(self, user):
        # Check if the user already exists using the user_exists method
        if self.user_exists(user):
            return {'message': 'User already exists'}, 409

        # If the user does not exist, proceed to register
        add_new_user = '''INSERT INTO "User" (name, email, phone, password) VALUES (%s, %s, %s, %s); '''
        self.cursor.execute(add_new_user, [user['name'], user['email'], user['phone'], user['password']])
        self.connection.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    def login(self, user):

        if not self.user_exists(user):
            return {'message': 'User not found'}, 404

        # Validate user credentials
        elif self.check_user(user):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return {'message': 'Invalid credentials'}, 401
