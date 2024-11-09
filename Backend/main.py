from flask import Flask, request, jsonify
from flask_cors import CORS
from database import DATABASE
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'thisisasupersecretkey'  # Change to a secure key
jwt = JWTManager(app)
db = DATABASE("packageDB")

db.get_all_orders()


@app.route("/login", methods=["POST"])
def login():
    if request.method == 'POST':
        user = request.get_json()
        data = db.login(user)
        return data


@app.route("/register", methods=["POST"])
def register():
    if request.method == 'POST':
        user = request.get_json()

        data = db.register(user)
        return data


@jwt_required()
@app.route("/create-order", methods=["POST"])
def create_order():
    if request.method == 'POST':
        order = request.get_json()
        data = db.create_order(order)
        return data


@jwt_required()
@app.route("/my-orders", methods=["GET"])
def my_orders():
    data = db.get_user_orders()
    return data


@jwt_required()
@app.route("/order-details", methods=["POST"])
def get_order_details():
    if request.method == "POST":
        order_id = request.get_json()["orderId"]
        order = db.get_order(order_id)
        return order


@jwt_required()
@app.route("/get-all-orders", methods=["GET"])
def get_all_orders():
    orders = db.get_all_orders()
    return orders


@jwt_required()
@app.route("/update-order-status", methods=["POST"])
def update_order_status():
    if request.method == "POST":
        data = request.get_json()
        print(data)
        response = db.update_order_status(data)
        return response


@jwt_required()
@app.route("/delete-order", methods=["POST"])
def delete_order():
    if request.method == "POST":
        order_id = request.get_json()
        print(order_id)
        response = db.delete_order(order_id)
        return response

@jwt_required()
@app.route("/cancel-order", methods=["POST"])
def cancel_order():
    if request.method == "POST":
        order_id = request.get_json()
        print(order_id)
        response = db.cancel_order(order_id)
        return response

@jwt_required()
@app.route("/assign-order-to-courier", methods=["POST"])
def assign_order():
    if request.method == "POST":
        order_id = request.get_json()["orderId"]
        courier_id = request.get_json()["courierId"]
        print(order_id,courier_id)
        response = db.assign_order(order_id, courier_id)

        return response

@jwt_required()
@app.route("/assigned-orders")
def assigned_orders():
    data = db.get_assigned_courier_orders()
    return data

@jwt_required()
@app.route("/accept-assigned-order", methods=["POST"])
def accept_assigned_order():
    order_id = request.get_json()["orderId"]
    print(order_id)
    response = db.accept_assigned_order(order_id)
    return response

@jwt_required()
@app.route("/decline-assigned-order", methods=["POST"])
def decline_assigned_order():
    order_id = request.get_json()["orderId"]
    response = db.decline_assigned_order(order_id)
    return response

@jwt_required()
@app.route("/courier_update-order-status", methods=["POST"])
def courier_update_order_status():
    if request.method == "POST":
        data = request.get_json()
        response = db.courier_update_order_status(data)
        return response

if __name__ == "__main__":
    app.run(debug=True)
