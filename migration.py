from pymongo import MongoClient
from neo4j import GraphDatabase

mongo_uri = "mongodb+srv://hibadouik:hibadouik29@cluster0.etryl.mongodb.net/nom_de_ta_base?retryWrites=true&w=majority"
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client['hibadouik'] 
mongo_collection = mongo_db['Recette']  

neo4j_uri = "neo4j+s://d99f7248.databases.neo4j.io" 
neo4j_user = "neo4j"
neo4j_password = "usyBRnt9ytFMTlV5FkrK0IAVOR26ZUPuAFEHc6qAOH4"  


neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

def insert_data_into_neo4j(data):
    with neo4j_driver.session() as session:
        for item in data:
            user_id = item['userId']
            username = item['username']
            email = item['email']
            role = item['role']
            recipes = item['recipes']

            query = """
            MERGE (u:User {userId: $user_id})
            SET u.username = $username, u.email = $email, u.role = $role
            """
            session.run(query, user_id=user_id, username=username, email=email, role=role)

            for recipe in recipes:
                recipe_id = recipe['recipeId']
                title = recipe['title']
                description = recipe['description']

                query = """
                MERGE (r:Recipe {recipeId: $recipe_id})
                SET r.title = $title, r.description = $description
                MERGE (u:User {userId: $user_id})-[:HAS_RECIPE]->(r)
                """
                session.run(query, user_id=user_id, recipe_id=recipe_id, title=title, description=description)

documents = mongo_collection.find()

for document in documents:
    print("Document MongoDB:", document) 


data = list(documents)  
insert_data_into_neo4j(data)

neo4j_driver.close()

print("Migration terminée avec succès !")


