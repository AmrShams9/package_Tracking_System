USER_TABLE_COLUMNS = "(name, email, phone, password)"
ORDER_TABLE_COLUMNS = "(pickup, dropoff, details, delivery_date, user_id, status)"


class DatabaseUtils:
    def __init__(self):
        self.table_columns = ""

    def create_insert_query(self, table_name):

        if table_name == "User":
            self.table_columns = USER_TABLE_COLUMNS
        elif table_name == "Order":
            self.table_columns = ORDER_TABLE_COLUMNS

        query = f'''INSERT INTO "{table_name}" {self.table_columns} VALUES (%s, %s, %s, %s, %s, %s); '''

        return query

    def create_select_query(self, table_name):

        query = ''
        if table_name == "User":
            self.table_columns = USER_TABLE_COLUMNS
        elif table_name == "Order":
            self.table_columns = ORDER_TABLE_COLUMNS
            query = f'''SELECT * FROM "{table_name}" WHERE user_id = %s '''

        return query
