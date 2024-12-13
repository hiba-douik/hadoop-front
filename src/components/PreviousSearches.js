import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function PreviousSearches({ setSearchQuery }) {
    const [inputValue, setInputValue] = useState("");
    const searches = ['pizza', 'burger', 'cookies', 'juice', 'biriyani', 'salad', 'ice cream', 'lasagna', 'pudding', 'soup'];

    const handleSearch = () => {
        setSearchQuery(inputValue);
    };

    return (
        <div className="previous-searches section">
            <h2>Previous Searches</h2>
            <div className="previous-searches-container">
                {searches.map((search, index) => (
                    <div
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="search-item"
                        onClick={() => setSearchQuery(search)} 
                    >
                        {search}
                    </div>
                ))}
            </div>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search ..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            <style jsx>{`
                .previous-searches {
                    margin-bottom: 2rem;
                }

                .previous-searches-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .search-item {
                    background-color: #f3f3f3;
                    border-radius: 20px;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    animation: fadeIn 0.5s ease forwards;
                }

                .search-item:hover {
                    background-color: #d1e7dd;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .search-box input {
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid #ddd;
                    flex-grow: 1;
                    outline: none;
                }

                .search-box .btn {
                    background-color: #FF0056;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 10%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s ease;
                }

                .search-box .btn:hover {
                    background-color: #FF0056;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
