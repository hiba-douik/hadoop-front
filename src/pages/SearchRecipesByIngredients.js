import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SearchRecipesByIngredients() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all recipes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        console.log(response.data);
        setRecipes(response.data.recipes);
        setFilteredRecipes(response.data.recipes); // Initialize the filteredRecipes to all recipes
      } catch (err) {
        setError('Erreur lors de la récupération des recettes. Veuillez réessayer.');
        console.error('Erreur lors de la récupération des recettes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter recipes based on ingredients input
  const handleSearch = () => {
    if (!ingredients) {
      setFilteredRecipes(recipes); // Show all recipes if no input is provided
      return;
    }

    const ingredientList = ingredients
      .split(',')
      .map((ingredient) => ingredient.trim().toLowerCase()); // Normalize input

    const filtered = recipes.filter((recipe) =>
      ingredientList.every((inputIngredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.toLowerCase().includes(inputIngredient)
        )
      )
    );

    setFilteredRecipes(filtered);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Rechercher des recettes par tous les ingrédients</h1>
      <div style={styles.searchBar}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Entrez les ingrédients séparés par des virgules"
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Rechercher
        </button>
      </div>
      {loading ? (
        <p style={styles.loadingText}>Chargement...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : filteredRecipes.length > 0 ? (
        <div style={styles.recipeList}>
          {filteredRecipes.map((recipe, index) => (
            <div key={index} style={styles.recipeCard}>
              <h3 style={styles.recipeTitle}>{recipe.title}</h3>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={styles.recipeImage}
                />
              )}
              <p style={styles.ingredientsText}>
                Ingrédients : {recipe.ingredients.join(', ')}
              </p>
              <p style={styles.descriptionText}>{recipe.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noRecipesText}>Aucune recette trouvée pour les ingrédients fournis.</p>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Arial", sans-serif',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '300px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#333',
  },
  errorText: {
    fontSize: '1.2rem',
    color: '#f44336',
  },
  recipeList: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    marginTop: '20px',
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  recipeTitle: {
    fontSize: '1.5rem',
    color: '#333',
  },
  recipeImage: {
    width: '100%',
    height: 'auto',
    marginTop: '15px',
    borderRadius: '8px',
  },
  ingredientsText: {
    fontSize: '1rem',
    color: '#555',
    marginTop: '10px',
  },
  descriptionText: {
    fontSize: '1rem',
    color: '#777',
    marginTop: '10px',
  },
  noRecipesText: {
    fontSize: '1.2rem',
    color: '#999',
  },
};

export default SearchRecipesByIngredients;
