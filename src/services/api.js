const API_URL = 'http://localhost:8085/api/recipes'; // L'URL de votre backend

// Récupérer les recettes d'un utilisateur
export const getUserRecipes = async (userId) => {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

// Récupérer une recette par ID
export const getRecipeById = async (userId, recipeId) => {
    const response = await fetch(`${API_URL}/${userId}/${recipeId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

// Créer une recette
export const createRecipe = async (userId, recipe) => {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

// Mettre à jour une recette
export const updateRecipe = async (userId, recipeId, recipe) => {
    const response = await fetch(`${API_URL}/${userId}/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

// Supprimer une recette
export const deleteRecipe = async (userId, recipeId) => {
    await fetch(`${API_URL}/${userId}/${recipeId}`, {
        method: 'DELETE',
    });
};
