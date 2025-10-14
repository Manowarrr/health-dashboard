"use client";

import { useState } from "react";
import Modal from "../../components/ui/Modal";
import AddMealForm from "../../components/forms/AddMealForm";

// START_COMPONENT_AddMealButton
// START_CONTRACT:
// PURPOSE: [Отображает кнопку "Добавить прием пищи" и управляет модальным окном с формой для добавления приема пищи.]
// KEYWORDS: [modal_trigger:9, add_button:8, ui_controller:9, client_component:9, meal:8]
// END_CONTRACT
export default function AddMealButton() {
  // START_BLOCK_STATE_MANAGEMENT
  const [isModalOpen, setIsModalOpen] = useState(false);
  // END_BLOCK_STATE_MANAGEMENT

  // START_BLOCK_MODAL_HANDLERS
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  // END_BLOCK_MODAL_HANDLERS

  return (
    // START_BLOCK_RENDER
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        Добавить прием пищи
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Добавить прием пищи"
      >
        <AddMealForm />
      </Modal>
    </>
    // END_BLOCK_RENDER
  );
}
// END_COMPONENT_AddMealButton