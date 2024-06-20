import React, { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, Input, Button, Box } from "@chakra-ui/react";

const AddItemModal = ({ isOpen, onClose, onSave, inputValue, setInputValue }) => {
    useEffect(() => {
        setInputValue('');
    }, [isOpen, setInputValue]);

    const handleSave = () => {
        onSave();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <Box
                    zIndex="modal"
                    position="fixed"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="white"
                    width="400px"
                    padding="20px"
                    borderRadius="8px"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                >
                    <ModalHeader>Adicionar Item</ModalHeader>
                    <ModalBody>
                        <FormControl display="flex" flexDir="column" gap={4}>
                            <Input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nome do item"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="green" onClick={handleSave}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default AddItemModal;
