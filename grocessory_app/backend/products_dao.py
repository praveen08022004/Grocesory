from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()
    query = """
    SELECT products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name
    FROM products 
    INNER JOIN uom ON products.uom_id = uom.uom_id;
    """
    cursor.execute(query)
    
    response = []

    for product_id, name, uom_id, price_per_unit, uom_name in cursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'uom_id': uom_id,
            'price_per_unit': price_per_unit,
            'uom_name': uom_name
        })
        
    cursor.close()
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()
    
    # Correctly formatted SQL query with placeholders
    query = """
    INSERT INTO products (name, uom_id, price_per_unit) 
    VALUES (%s, %s, %s)
    """
    
    # Make sure to pass the correct types: product_name is a string, uom_id is an int, price_per_unit is a float
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])
    
    # Execute the query with the data passed in
    cursor.execute(query, data)
    
    # Commit the transaction and close the cursor
    connection.commit()
    cursor.close()
    
    return cursor.lastrowid
def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("Delete from products where product_id =" + str(product_id))
    cursor.execute(query)
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    
    # Example call with correct data types for uom_id (int) and price_per_unit (float)
    product_id = delete_product(connection, 13)
    
    print(f"Inserted product with ID: {product_id}")
