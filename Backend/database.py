import math

import psycopg2
import os
from flask import jsonify
from database_utlis import DatabaseUtils
from datetime import datetime
from flask_jwt_extended import create_access_token, decode_token


# Database connection parameters
host = os.getenv('DB_HOST', 'localhost')  # Default to localhost, but in Docker, use the service name (db)
user = os.getenv('DB_USER', 'postgres')  # Database username
password = os.getenv('DB_PASSWORD', 'ibrahim1')  # Database password


def jsonify_order(orders):
    data = [jsonify(order).get_json() for order in orders]
    json_list = []
    for item in data:
        json_object = {
            'pickup': item[0],
            'dropOff': item[1],
            'details': item[2],
            'deliveryDate': datetime.strptime(item[3], '%a, %d %b %Y %H:%M:%S %Z'),  # Convert to a datetime object
            'status': item[6],
            'order_id': item[4],
            'user_id': item[5],
            'courier_id': item[7],
        }
        json_list.append(json_object)
    return json_list


class DATABASE:

    def __init__(self, database_name):
        self.connection = psycopg2.connect(
            host=host,
            database=database_name,
            user=user,
            password=password   
        )
        self.cursor = self.connection.cursor()

        self.query = DatabaseUtils()
        
        self.current_user_id = None
        self.current_role = None

    def get_user(self, user_data):

        get_user_query = '''
                    SELECT * FROM "User" WHERE email = %s AND password = %s
                ;'''
        self.cursor.execute(get_user_query, [user_data['email'], user_data['password']])
        return self.cursor.fetchone()  # Fetch the result (True/False)

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

        if user['role'] not in ['customer', 'courier']:
            return jsonify({'message': "Role must be customer or courier"}), 400
        # If the user does not exist, proceed to register
        add_new_user = '''INSERT INTO "User" (name, email, phone, password, role) VALUES (%s, %s, %s, %s, %s); '''
        self.cursor.execute(add_new_user, [user['name'], user['email'], user['phone'], user['password'], user['role']])
        self.connection.commit()
        self.current_user_id = self.get_user(user)[0]
        self.current_role = user['role']
        print(f"REG: {self.current_user_id}")
        print(f"REG: {self.current_role}")
        access_token = create_access_token({"id": self.current_user_id, "username": user["name"], "role": user['role']})
        return jsonify({'message': 'User registered successfully', 'access_token': access_token}), 201

    def login(self, user):

        if not self.user_exists(user):
            return {'message': 'User not found'}, 404

        # Validate user credentials
        elif self.check_user(user):
            current_user = self.get_user(user)
            self.current_user_id = current_user[0]
            self.current_role = current_user[6]
            print(f"LOGIN: {self.current_user_id}")
            print(f"REG: {self.current_role}")

            access_token = create_access_token({"id": self.current_user_id, "username": current_user[1], "role":
                current_user[6]})
            return jsonify(
                {'message': 'Login successful', 'access_token': access_token, 'username': current_user[1]}), 200
        else:
            return {'message': 'Invalid credentials'}, 401

    def create_order(self, order):
        if order['status'] != "Placed":
            return jsonify({'message': 'Invalid input. status must be Placed'}), 400

        if not self.current_user_id is None:

            if self.current_role not in ['customer', 'admin']:
                return jsonify({'message': "Role must be customer or admin"}), 401

            add_new_order_query = self.query.create_insert_query("Order")

            order['deliveryDate'] = datetime.strptime(order['deliveryDate'], '%Y-%m-%d')

            # self.current_user_id = decode_token(order["token"]).get('sub')['id']

            self.cursor.execute(add_new_order_query, [order['pickup'], order['dropOff'], order['details'],
                                                      order['deliveryDate'], self.current_user_id, order["status"]])

            self.connection.commit()

            print(f"CREATE: {self.current_user_id}")

            return jsonify({'message': 'Order Placed successfully'}), 201
        else:
            return jsonify({"message": "You must login first."}), 401

    def get_user_orders(self):

        if not self.current_user_id is None:

            if self.current_role not in ['customer', 'admin']:
                return jsonify({'message': "Role must be customer or admin"}), 401

            get_all_orders_query = self.query.create_select_query("Order")

            self.cursor.execute(get_all_orders_query, [self.current_user_id])

            self.connection.commit()

            orders = self.cursor.fetchall()
            print(f"GET USER ORDERS: {self.current_user_id}")
            json_list = jsonify_order(orders)
            return json_list
        else:
            return jsonify({"message": "You must login first."}), 401

    def get_order(self, order_id):
        if self.current_user_id is not None:

            if self.current_role not in ['customer', 'admin']:
                return jsonify({'message': "Role must be customer or admin"}), 401

            query = '''SELECT * FROM "Order" WHERE order_id = %s AND user_id = %s'''
            self.cursor.execute(query, [order_id, self.current_user_id])
            self.connection.commit()

            order = self.cursor.fetchone()

            if order:

                return jsonify({"order": order}), 200
            else:

                return jsonify({"message": "Order not found."}), 404
        else:
            return jsonify({"message": "You must login first."}), 401

    def get_all_orders(self):
        if not self.current_user_id is None:
            query = f'''SELECT role FROM "User" WHERE id = %s'''
            self.cursor.execute(query, [self.current_user_id])
            result = self.cursor.fetchone()
            if result is not None:
                curr_user_role = result[0]
                if curr_user_role == "admin":

                    orders_query = '''SELECT * FROM "Order"'''

                    self.cursor.execute(orders_query)
                    orders = self.cursor.fetchall()
                    json_list = jsonify_order(orders)

                    return json_list
                else:
                    return jsonify({"message": "Current user not admin."}), 401
            else:
                return jsonify({"message": "User not found."}), 404
        else:
            return "You must login first."

    def order_exists(self, order_id):
        # Query to check if an order exists with the given order_id
        query = '''SELECT EXISTS(SELECT 1 FROM "Order" WHERE order_id = %s);'''

        try:
            self.cursor.execute(query, (order_id,))
            result = self.cursor.fetchone()

            return result[0] if result else False

        except Exception as e:
            print(f"Error checking if order exists: {e}")
            return False

    def update_order_status(self, data):

        if not self.current_user_id is None:

            if self.current_role not in ['admin']:
                return jsonify({'message': "Current user not admin."}), 401
            elif not self.order_exists(data['orderId']):
                return jsonify({'message': "Order doesnt exist."}), 404
            elif data['status'] not in ['Placed', 'Pending', 'Picked up', 'In transit', 'Delivered']:
                return jsonify({'message': "Invalid status provided."}), 400

            query = '''UPDATE "Order" SET status = %s WHERE order_id = %s;'''

            # Execute the query with parameters safely
            self.cursor.execute(query, (data['status'], data['orderId']))
            self.connection.commit()

            return jsonify({'message': 'Status updated successfully'}), 202
        else:
            return jsonify({"message": "You must login first."}), 401

    def delete_order(self, data):
        if not self.current_user_id is None:

            if self.current_role not in ['admin']:
                return jsonify({'message': "Current user is not an admin."}), 401
            elif not self.order_exists(data['orderId']):
                return jsonify({'message': "Order doesnt exist."}), 404


            if isinstance(data, dict) and 'orderId' in data:
                query = '''DELETE FROM "Order" WHERE order_id = %s;'''
                self.cursor.execute(query, (data['orderId'],))
                self.connection.commit()
                return jsonify({"message": "Order deleted"}), 200
            else:
                raise ValueError("Invalid data format: expected a dictionary with 'orderId'")
        else:
            return jsonify({"message": "You must login first."}), 401



    def cancel_order(self, data):
        if not self.current_user_id is None:

            if self.current_role not in ['customer', 'admin']:
                return jsonify({'message': "Current user is not an admin or customer."}), 401
            elif not self.order_exists(data['orderId']):
                return jsonify({'message': "Order doesnt exist."}), 404

            order, status = self.get_order(data['orderId'])
            order = order.get_json()
            print(order)
            if order['order'][6] not in ["Placed", "Pending"]:
                return jsonify({'message': "Cant cancel order, courier is on the way!."}), 404

            if isinstance(data, dict) and 'orderId' in data:
                query = '''DELETE FROM "Order" WHERE order_id = %s and user_id=%s;'''
                self.cursor.execute(query, (data['orderId'],self.current_user_id))
                self.connection.commit()

                if self.cursor.rowcount == 0:
                    return {"message": "The order with this id is not yours"}, 404

                return jsonify({"message": "Order deleted"}), 200
            else:
                raise ValueError("Invalid data format: expected a dictionary with 'orderId'")
        else:
            return jsonify({"message": "You must login first."}), 401

    def assign_order(self, order_id, courier_id):

        # Convert to string first, then check if it's a digit
        if not str(order_id).isdigit() or not str(courier_id).isdigit():
            return jsonify({'message': "Invalid inputs."}), 400

        if not self.current_user_id is None:

            if self.current_role not in ['admin']:
                return jsonify({'message': "Current user is not an admin."}), 401
            elif not self.order_exists(order_id):
                return jsonify({'message': "Order doesnt exist."}), 404
            try:
                # First, check if the user has the role of 'courier'
                check_role_query = '''
                SELECT role FROM "User" WHERE id = %s;
                '''
                self.cursor.execute(check_role_query, (courier_id,))
                role = self.cursor.fetchone()

                if role is None:
                    return jsonify({"message": "The courier id is not found."}), 404

                if role[0] != "courier":
                    return jsonify({"message": "The assigned user is not a courier."}), 400

                # If the user is a courier, proceed to assign the order
                update_query = '''
                UPDATE "Order"
                SET courier_id = %s
                WHERE order_id = %s;
                '''
                self.cursor.execute(update_query, (courier_id, order_id))
                self.connection.commit()

                # Check if any row was updated
                if self.cursor.rowcount == 0:
                    return {"message": "Order not found or no changes made."}, 404

                return {"message": "Order assigned successfully."}, 202

            except Exception as e:
                self.connection.rollback()
                print(f"Error occurred: {e}")
                return {"message": "An error occurred while assigning the order."}, 500
        else:
            return jsonify({"message": "You must login first."}), 401

    def get_assigned_courier_orders(self):

        if not self.current_user_id is None:

            if self.current_role not in ['courier']:
                return jsonify({'message': "Current user is not a courier."}), 401

            query = '''Select * from "Order" where courier_id =%s'''
            self.cursor.execute(query, [self.current_user_id])
            self.connection.commit()
            orders = self.cursor.fetchall()
            print(f"GET USER ORDERS: {self.current_user_id}")
            json_list = jsonify_order(orders)
            return json_list
        else:
            return jsonify({"message": "You must login first."}), 401


    def accept_assigned_order(self, order_id):

        if not self.current_user_id is None:
            if self.current_role not in ['courier']:
                return jsonify({'message': "Current user not courier."}), 401
            elif not self.order_exists(order_id):
                return jsonify({'message': "Order doesnt exist."}), 404

            query = '''UPDATE "Order" SET status = 'Pending' WHERE order_id = %s and courier_id=%s;'''

            self.cursor.execute(query, (order_id,self.current_user_id))
            self.connection.commit()

            if self.cursor.rowcount == 0:
                return {"message": "This Order is not assigned to you."}, 404

            return jsonify({'message': 'order accepted successfully'}), 202

        else:
            return jsonify({"message": "You must login first."}), 401

    def decline_assigned_order(self, order_id):
        if not self.current_user_id is None:
            if self.current_role not in ['courier']:
                return jsonify({'message': "Current user not courier."}), 401
            elif not self.order_exists(order_id):
                return jsonify({'message': "Order doesnt exist."}), 404

            query = ''' UPDATE "Order" SET courier_id = NULL,status = 'Placed'
             WHERE order_id = %s and courier_id=%s;'''
            self.cursor.execute(query, (order_id, self.current_user_id))
            self.connection.commit()

            if self.cursor.rowcount == 0:
                return {"message": "This Order is not assigned to you."}, 404

            return jsonify({'message': 'Order declined successfully'}), 202
        else:
            return jsonify({"message": "You must login first."}), 401

    def courier_update_order_status(self, data):

        if not self.current_user_id is None:

            if self.current_role not in ['courier']:
                return jsonify({'message': "Current user not courier."}), 401
            elif not self.order_exists(data['orderId']):
                return jsonify({'message': "Order doesnt exist."}), 404
            elif data['status'] not in ['Picked up', 'In transit', 'Delivered']:
                return jsonify({'message': "Invalid status provided."}), 400

            query = '''UPDATE "Order" SET status = %s WHERE order_id = %s and courier_id=%s;'''

            # Execute the query with parameters safely
            self.cursor.execute(query, (data['status'], data['orderId'],self.current_user_id))
            self.connection.commit()

            if self.cursor.rowcount == 0:
                return {"message": "This Order is not assigned to you."}, 404

            return jsonify({'message': 'Status updated successfully'}), 202
        else:
            return jsonify({"message": "You must login first."}), 401

