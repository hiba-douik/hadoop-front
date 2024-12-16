import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function RecetteForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newRecipe, setNewRecipe] = useState({ titre: "", description: "", image: "" });
    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const fetchUserData = async (id) => {
        try {
            console.log("Fetching user with ID:", id); // Debugging
            const response = await axios.get(`http://localhost:5000/api/users/${id}`);
            console.log("Fetched user data:", response.data); // Debugging
            setUser(response.data.user); // Récupérer les données de l'utilisateur
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    
    useEffect(() => {
        const userId = getUserIdFromSessionStorage();
        console.log("User ID from session:", userId); // Debugging
        if (userId) {
            fetchUserData(userId);
            fetchUserRecipes(userId);
        }
    }, []);
    

    const fetchUserRecipes = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/recipes/user/${userId}`);
            const cleanedRecipes = response.data.recipes.map(recipe => ({
                ...recipe,
                title : recipe.title  || "" ,
                description: recipe.description || "",
                instructions: recipe.instructions?.map(inst => inst.step) || [],
                ingredients: recipe.ingredients || []
            }));
            setRecipes(cleanedRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const getUserIdFromSessionStorage = () => {
        const userData = sessionStorage.getItem('authenticatedUser');
        if (userData) {
            const parsedData = JSON.parse(userData);
            // Assurez-vous que `id` (email) est utilisé pour la clé
            return parsedData.email || null; 
        }
        return null;
    };
    

    useEffect(() => {
        const userId = getUserIdFromSessionStorage();
        if (userId) {
            fetchUserData(userId);
            fetchUserRecipes(userId);
        }
    }, []);

    const saveUserProfile = async () => {
        if (user) {
            try {
                const response = await axios.put(`http://localhost:5000/api/users/${user.userId}`, user);
                if (response.data.success) {
                    setUser(response.data.user);
                    navigate('/RecetteForm');
                }
            } catch (error) {
                console.error('Error saving user profile:', error);
            }
        }
    };

    const saveRecipe = () => {
        if (newRecipe.titre.trim() && newRecipe.description.trim() && newRecipe.image.trim()) {
            if (editingIndex !== null) {
                const updatedRecipes = [...recipes];
                updatedRecipes[editingIndex] = newRecipe;
                setRecipes(updatedRecipes);
                setEditingIndex(null);
            } else {
                setRecipes([...recipes, newRecipe]);
            }
            setNewRecipe({ titre: "", description: "", image: "" });
            setShowForm(false);
        }
    };

    const deleteRecipe = async (recipe) => {
        setRecipeToDelete(recipe);
        setShowDeleteConfirmation(true);
    };
    
    const confirmDelete = async () => {
        const userId = getUserIdFromSessionStorage();
        if (!userId || !recipeToDelete) return;
    
        try {
            const response = await axios.delete(`http://localhost:5000/api/recipes/${recipeToDelete.recipeId}`); // Send the recipeId
            if (response.data.success) {
                const updatedRecipes = recipes.filter(r => r.recipeId !== recipeToDelete.recipeId);
                setRecipes(updatedRecipes);
            }
            setShowDeleteConfirmation(false);
            setRecipeToDelete(null);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setShowDeleteConfirmation(false);
            setRecipeToDelete(null);
        }
        navigate('/home');
    };
    

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setRecipeToDelete(null);
    };

    const editRecipe = (recipe) => {
        navigate('/EditRecipe', { state: { recipe } });
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        navigate('/CreateRecipe');
    };

    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            marginBottom: '300px',
        },
        buttonRightContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px',
        },
        recipeItem: {
            marginBottom: '10px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        buttonContainer: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight:'3px',
            marginBottom:'2px',
        },
        deleteButton: {
            cursor: 'pointer',
            fontSize: '24px',
            color: '#FF0056',
        },
        editButton: {
            cursor: 'pointer',
            fontSize: '20px',
            color: '#FF0056',
        },
        input: {
            display: 'block',
            marginBottom: '10px',
            padding: '10px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '5px',
        },
        image: {
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            marginRight: '20px',
        },
        title: {
            marginBottom: '20px',
        },
        profileContainer: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f7fa',
        },
        profileCard: {
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
        },
        profileImage: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight:'5px',
        },
        infoContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginLeft:'5px',
        },
        profileTitle: {
            margin: '0',
            fontSize: '24px',
        },
        infoRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            width: '100%',
        },
        infoLabel: {
            flex: '0 0 50px',
            marginRight: '8px',
        },
        infoBox: {
            border: '1px solid black',
            borderRadius: '4px',
            padding: '2px 17px',
            textAlign: 'left',
            marginRight:'340px',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
        infoValue: {
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        editProfileIcon: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#FF0056',
        },
    };

    return (
        <div style={styles.container}>
            {user && (
                <div style={styles.profileContainer}>
                    <div style={styles.profileCard}>
                        {isEditingProfile ? (
                            <>
                                <img src={user.image} alt="User" style={styles.profileImage} />
                                <div style={styles.infoContainer}>
                                    <h2 style={styles.profileTitle}>{user.username}</h2>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setUser({ ...user, image: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="username"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        style={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        style={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rôle"
                                        value={user.role}
                                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                                        style={styles.input}
                                    />
                                    <button
                                        onClick={() => {
                                            saveUserProfile();
                                            setIsEditingProfile(false);
                                        }}
                                        style={styles.button}
                                    >
                                        Sauvegarder
                                    </button>
                                    <button onClick={() => setIsEditingProfile(false)} style={styles.button}>
                                        Annuler
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <img src={user.image} alt="User" style={styles.profileImage} />
                                <div style={styles.infoContainer}>
                                    <h2 style={styles.profileTitle}>{user.username}</h2>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Email:</span>
                                        <div style={styles.infoBox}>
                                            <span style={styles.infoValue}>{user.email}</span>
                                        </div>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Rôle:</span>
                                        <div style={styles.infoBox}>
                                            <span style={styles.infoValue}>{user.role}</span>
                                        </div>
                                    </div>
                                    <MdEdit style={styles.editProfileIcon} onClick={() => setIsEditingProfile(true)} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div style={styles.buttonRightContainer}>
                <button style={styles.button} onClick={toggleForm}>
                    {showForm ? "Annuler" : "Ajouter une recette"}
                </button>
            </div>
            {showForm && (
                <div>
                    <h2>{editingIndex !== null ? "Éditer la recette" : "Ajouter une nouvelle recette"}</h2>
                    <input
                        type="text"
                        placeholder="Titre de la recette"
                        value={newRecipe.titre}
                        onChange={(e) => setNewRecipe({ ...newRecipe, titre: e.target.value })}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Description de la recette"
                        value={newRecipe.description}
                        onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="URL de l'image"
                        value={newRecipe.image}
                        onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
                        style={styles.input}
                    />
                    <button style={styles.button} onClick={saveRecipe}>
                        {editingIndex !== null ? "Mettre à jour la recette" : "Ajouter la recette"}
                    </button>
                </div>
            )}
            <h2 style={styles.title}>Vos Recettes</h2>
            <div>
                {recipes.map((recipe, index) => (
                    <div key={index} style={styles.recipeItem}>
                        <img
                            src={recipe.image}
                            alt={recipe.recipeName || 'Recipe Image'}
                            style={styles.image}
                        />
                        <div>
                            <h3>{recipe.recipeName}</h3>
                            <h4>Instructions</h4>
                            <ul>
                                {recipe.instructions?.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                            <h4>Ingrédients</h4>
                            <ul>
                                {recipe.ingredients?.map((ingredient, i) => (
                                    <li key={i}>
                                        {typeof ingredient === 'object' ? ingredient.name : ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={styles.buttonContainer}>
                            <MdEdit
                                style={styles.editButton}
                                onClick={() => editRecipe(recipe)}
                                title="Modifier la recette"
                            />
                            <RiDeleteBin6Line
                                style={styles.deleteButton}
                                onClick={() => deleteRecipe(recipe)}
                                title="Supprimer la recette"
                            />
                        </div>
                    </div>
                ))}
            </div>
            {showDeleteConfirmation && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                        <h3>Êtes-vous sûr de vouloir supprimer la recette : <strong>{recipeToDelete.titre}</strong> ?</h3>
                        <div style={styles.buttonContainer}>
                            <button style={styles.button} onClick={confirmDelete}>Oui, supprimer</button>
                            <button style={styles.button} onClick={cancelDelete}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
