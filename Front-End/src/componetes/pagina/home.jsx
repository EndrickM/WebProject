import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../../index.css';
import EditItemModal from '../modal/modal.jsx';

const Home = () => {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchSublistas();
    }, []);

    const fetchSublistas = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/lista`);
            setItems(response.data); 
        } catch (error) {
            console.error('Erro ao buscar sublistas:', error);
        }
    };

    const handleAddButtonClick = async () => {
        if (inputValue.trim() === '') return;
    
        const newItem = {
            name: inputValue,  
            subItems: []
        };
    
        try {
            await axios.post(`http://localhost:3333/lista`, newItem);
            const updatedItems = await fetchUpdatedItems(); 
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao adicionar item no servidor:', error);
        }
    
        setInputValue('');
    };

    const fetchUpdatedItems = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/lista`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar itens atualizados do servidor:', error);
            return [];
        }
    };

    const handleDeleteButtonClick = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3333/lista/${itemId}`);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao deletar item no servidor:', error);
        }
    };

    const handleSaveEdit = async (itemName) => {
        try {
            const updatedItem = { name: itemName };
            await axios.put(`http://localhost:3333/lista/${editIndex}`, updatedItem);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
            closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar item no servidor:', error);
        }
    };

    const openEditModal = (index) => {
        setEditIndex(index);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditIndex(null);
    };

    return (
        <div className='app-background'>
            <div className='main-container'>
                <div className='title'>
                    <h1>Lista de Compra <a href="#" className="money">$</a></h1>
                </div>
                <div className='add-item-box'>
                    <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className='add-item-input' placeholder='Adicione um item...' />
                    <FontAwesomeIcon icon={faPlus} onClick={handleAddButtonClick} />
                </div>
                <div className='item-list'>
                    {items.map((item, index) => (
                        <div className='item-container' key={index}>
                            <div className='item-name'>
                            <Link to={`/Lista/${item.id}`} className="unstyled-link">
                                <span>{item.name}</span>
                            </Link>
                                <div className='item-actions'>
                                    <button onClick={() => handleDeleteButtonClick(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button onClick={() => openEditModal(item.id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showEditModal && (
                <EditItemModal
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    onSave={handleSaveEdit}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}
        </div>
    );
};

export default Home;
