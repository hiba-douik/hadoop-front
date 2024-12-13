import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecetteDetail = () => {
    const { tile } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const encodedTile = encodeURIComponent(tile);
                const apiUrl = `http://localhost:3000/api/recipe/${encodedTile}`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }

                const data = await response.json();

                if (data.message === 'Recette récupérée avec succès') {
                    console.log("Recipe data:", data);
                    setRecipeDetails(data);
                } else {
                    setError('Recette non trouvée');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la recette:', error);
                setError('Une erreur s\'est produite lors de la récupération des détails de la recette');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [tile]);


    const handleDownload = async () => {
        if (!recipeDetails || !recipeDetails.recipe) {
            setError("Les détails de la recette sont introuvables pour le téléchargement");
            return;
        }

        console.log("Recipe details in handleDownload:", recipeDetails);

        const { title, description, image } = recipeDetails.recipe;
        const { ingredients = [], instructions = [] } = recipeDetails;

        const data = {
            title: title || "Titre non disponible",
            description: description || "Description non disponible",
            image: image || "Image non disponible",
            ingredients: Array.isArray(ingredients) ? ingredients.map(ingredient => ingredient.name || "Ingrédient inconnu") : [],
            instructions: Array.isArray(instructions) ? instructions.map(instruction => ({ step: instruction.step || "Étape non disponible" })) : [],
        };

        console.log("Data to be sent:", data);

        try {
            const response = await fetch("http://localhost:3000/download-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement du PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title ? title.replace(/[^a-zA-Z0-9]/g, "_") : "recette"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF:", error);
            setError("Une erreur s'est produite lors du téléchargement du PDF");
        }
    };



    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Recette Detail: {tile}</h1>
            {error && <p style={styles.error}>{error}</p>}

            {loading ? (
                <p style={styles.loading}>Chargement des détails de la recette...</p>
            ) : (
                recipeDetails ? (
                    <div style={styles.recipeDetails}>
                        <div style={styles.recipeHeader}>
                            <h2>{recipeDetails.title}</h2>
                            <p style={styles.description}>{recipeDetails.description}</p>
                            <img
                                src="https://th.bing.com/th?id=OSK.598c5b2b7b65082004e599cc520830a2" // Remplacez par l'URL de votre image
                                alt={recipeDetails.title || 'Recipe Image'}
                                style={styles.image}
                            />

                        </div>

                        <div style={styles.ingredients}>
                            <h4>Ingrédients:</h4>
                            {Array.isArray(recipeDetails.ingredients) && recipeDetails.ingredients.length > 0 ? (
                                <ul>
                                    {recipeDetails.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Aucun ingrédient disponible</p>
                            )}
                        </div>

                        <div style={styles.instructions}>
                            <h4>Instructions:</h4>
                            {Array.isArray(recipeDetails.instructions) && recipeDetails.instructions.length > 0 ? (
                                <ol>
                                    {recipeDetails.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction.step}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p>Aucune instruction disponible</p>
                            )}
                        </div>

                        {/* Download button */}
                        <button onClick={handleDownload} style={styles.downloadButton}>Télécharger la recette en PDF</button>
                    </div>
                ) : (
                    <p>Recette non trouvée.</p>
                )
            )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '10px',
    },
    recipeHeader: {
        marginBottom: '30px',
    },
    description: {
        fontSize: '1.1rem',
        color: '#666',
        marginTop: '10px',
    },
    image: {
        width: '50%',
        height: '50%',
        borderRadius: '8px',
        marginTop: '20px',
    },
    ingredients: {
        marginTop: '30px',
    },
    instructions: {
        marginTop: '30px',
    },
    error: {
        color: 'red',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    loading: {
        fontSize: '1.2rem',
        color: '#ffffff',
    },
    recipeDetails: {
        padding: '10px',
    },
    downloadButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default RecetteDetail;
