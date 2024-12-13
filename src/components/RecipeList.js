import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchUserRecipes = async (userId) => {
    const response = await fetch(`/api/recipes/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const RecipeList = ({ userId }) => {
    const { data, error, isLoading } = useQuery(['userRecipes', userId], () => fetchUserRecipes(userId));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {data.map(recipe => (
                <div key={recipe.recipeId}>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    {/* Ajoutez d'autres détails de la recette si nécessaire */}
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
