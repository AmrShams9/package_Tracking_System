

import psycopg2
from psycopg2 import sql
# Database connection parameters
host = "localhost"  # or your database host
user = "ibrahim"  # replace with your PostgreSQL username
password = "ibrahim1"  # replace with your PostgreSQL password


connection = psycopg2.connect(
            host=host,
            database="packageDB",
            user=user,
            password=password
        )
cursor = connection.cursor()


#
#
# add_column_query = '''
# ALTER TABLE "Order"
# ADD COLUMN courier_id INTEGER,
# ADD CONSTRAINT fk_courier
# FOREIGN KEY (courier_id) REFERENCES "User"(id);'''
#
# cursor.execute(add_column_query)
# connection.commit()
#
# # Close the cursor and the connection
# cursor.close()
# connection.close()

# insert_query = """
#         INSERT INTO "User" (name, email, phone, password, role)
#         VALUES
#             ('admin1', 'Admin1@email.com', '01230123123', 'admin123', 'admin'),
#             ('admin2', 'Admin2@email.com', '01230123123', 'admin123', 'admin'),
#             ('admin3', 'Admin3@email.com', '01230123123', 'admin123', 'admin');
#         """
# cursor.execute(insert_query)
# connection.commit()


# truncate_query = sql.SQL("TRUNCATE TABLE {} RESTART IDENTITY CASCADE").format(
#                 sql.SQL(', ').join(sql.Identifier(table) for table in ["User", "Order"])
#             )
# cursor.execute(truncate_query)
# connection.commit()
#

