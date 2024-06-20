import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import EditItemModal from '../modal/modal.jsx';
import AddItemModal from '../modal/modal2.jsx';
import axios from 'axios';
import '../../index.css';

const Lista = () => {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSubAddModal, setShowSubAddModal] = useState(false);
    const [showSubEditModal, setShowSubEditModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [parentIndex, setParentIndex] = useState(null);
    const [visibleSubItems, setVisibleSubItems] = useState({});

    useEffect(() => {
        fetchSublistas();
    }, );

    const fetchSublistas = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/sublista/${id}`);
            console.log('Sublistas:', response.data);
            setItems(response.data); 
        } catch (error) {
            console.error('Erro ao buscar sublistas:', error);
        }
    };

    const handleAddButton = async () => {
        if (inputValue.trim() === '') return;
    
        const newItem = {
            name: inputValue,  
            subItems: []
        };
    
        console.log('Enviando novo item:', newItem);  
    
        try {
            await axios.post(`http://localhost:3333/lista/${id}/sublista`, newItem);
            const updatedItems = await fetchUpdatedItems(); 
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao adicionar item no servidor:', error);
        }
    
        setInputValue('');
        closeAddModal();
    };

    const handleSubAddButton = async () => {
        if (inputValue.trim() === '') return;
    
        const newItem = {
            name: inputValue, 
        };
    
        console.log('Enviando novo item:', newItem); 
    
        try {
            await axios.post(`http://localhost:3333/sublista/${parentIndex}/subsub`, newItem);
            const updatedItems = await fetchUpdatedItems(); 
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao adicionar item no servidor:', error);
        }
    
        setInputValue('');
        closeSubAddModal();
    };

    const fetchUpdatedItems = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/sublista/${id}`);
            console.log('Updated items fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar itens atualizados do servidor:', error);
            return [];
        }
    };

    const handleDeleteButtonClick = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3333/sublista/${itemId}`);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao deletar item no servidor:', error);
        }
    };

    const handleSubDeleteButtonClick = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3333/subsub/${itemId}`);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
        } catch (error) {
            console.error('Erro ao deletar item no servidor:', error);
        }
    };


    

    const handleSaveEdit = async (itemValue) => {
        try {
            const updatedItem = {   name: itemValue };
            await axios.put(`http://localhost:3333/sublista/${editIndex}`, updatedItem);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
            closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar item no servidor:', error);
        }
    };

    const handleSubSaveEdit = async (itemValue) => {
        try {
            const updatedSubItem = { name: itemValue };
            await axios.put(`http://localhost:3333/subsub/${editIndex}`, updatedSubItem);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems);
            closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar subitem no servidor:', error);
        }
    };

    const toggleComplete = async (itemId, itemStatus) => {
        try {
            const updatedStatus = !itemStatus;
            const updatedItem = {
                status: updatedStatus
            };
    
            await axios.put(`http://localhost:3333/subsub/${itemId}`, updatedItem);
            const updatedItems = await fetchUpdatedItems();
            setItems(updatedItems); 
        } catch (error) {
            console.error('Erro ao atualizar item no servidor:', error);
        }
    };
    
    
    const toggleSubItemsVisibility = (index) => {
        setVisibleSubItems(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
        console.log('visibleSubItems:', visibleSubItems);
    };
    

    const openEditModal = (index) => {
        setEditIndex(index);
        setShowEditModal(true);
    };

    const openSubEditModal = (index) => {
        setEditIndex(index);
        setShowSubEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setShowSubEditModal(false);
        setEditIndex(null);
        setParentIndex(null);
        setInputValue('');
    };

    const openSubAddModal = (index = null) => {
        setParentIndex(index);
        setShowSubAddModal(true);
    };

    const closeSubAddModal = () => {
        setShowSubAddModal(false);
        setParentIndex(null);
        setInputValue('');
    };

    const openAddModal = (index = null) => {
        setParentIndex(index);
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setParentIndex(null);
        setInputValue('');
    };

    return (
        <div className='list-background'>
            <h1 className='title-list'>Lista de Compras</h1>
            <div className='main-container-list'>
                <div className='list-item-list'>
                    {items.map((item, index) => (
                        <div className='item-container-list' key={index}>
                            <div className='item-name-list' onClick={() => toggleSubItemsVisibility(index)}>
                                <div className='item-buttons-list'>
                                <span>{item.name}</span>
                                    <button onClick={() => openSubAddModal(item.id)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                    <button onClick={() => handleDeleteButtonClick(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button onClick={() => openEditModal(item.id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </div>
                            </div>
                            {visibleSubItems[index] && (
                                <div className='subitem-list'>
                                    {item?.items?.map((subItem, subIndex) => {
                                    console.log('Acessando subItem:', subItem.name); 
                                        return (
                                            <div className='subitem-container-list' key={subIndex}>
                                                <div className='subitem-name-list' onClick={() => toggleComplete(subItem.id, subItem.status)}>
                                                    {subItem?.status ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                            <span className='completed'>{subItem?.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faCircle} />
                                                            <span>{subItem?.name}</span>
                                                        </>
                                                    )}
                                                    
                                                </div>
                                                <div className='subitem-buttons-list'>
                                                        <button onClick={() => handleSubDeleteButtonClick(subItem.id)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                        <button onClick={() => openSubEditModal(subItem.id)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                </div>    
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='add-container-list'>
                <button onClick={() => openAddModal()}>Adicionar Categoria</button>
            </div>

            {showAddModal && (
                <AddItemModal
                    isOpen={showAddModal}
                    onClose={closeAddModal}
                    onSave={handleAddButton}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}

            {showSubAddModal && (
                <AddItemModal
                    isOpen={showSubAddModal}
                    onClose={closeSubAddModal}
                    onSave={handleSubAddButton}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}
            {showEditModal && (
                <EditItemModal
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    onSave={handleSaveEdit}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}
            {showSubEditModal && (
                <EditItemModal
                    isOpen={showSubEditModal}
                    onClose={closeEditModal}
                    onSave={handleSubSaveEdit}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            )}
        </div>
    );
};

export default Lista;
