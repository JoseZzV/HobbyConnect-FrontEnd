import { useState, ChangeEvent } from 'react';

interface CrearComunidadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comunidad: { nombre: string; descripcion: string; imagen?: string }) => void;
}

export default function CrearComunidad({ isOpen, onClose, onSave }: CrearComunidadProps) {
  const [draftCommunity, setDraftCommunity] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
  });

  const handleSave = () => {
    if (!draftCommunity.nombre.trim() || !draftCommunity.descripcion.trim()) {
      alert('El nombre y la descripción son obligatorios');
      return;
    }

    onSave({
      nombre: draftCommunity.nombre.trim(),
      descripcion: draftCommunity.descripcion.trim(),
      imagen: draftCommunity.imagen || undefined,
    });
    setDraftCommunity({ nombre: '', descripcion: '', imagen: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 text-white">
        <h3 className="text-lg font-semibold mb-4">Crear Comunidad</h3>
        <input
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Nombre"
          value={draftCommunity.nombre}
          onChange={(e) => setDraftCommunity({ ...draftCommunity, nombre: e.target.value })}
        />
        <textarea
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          placeholder="Descripción"
          value={draftCommunity.descripcion}
          onChange={(e) => setDraftCommunity({ ...draftCommunity, descripcion: e.target.value })}
        />
        <input
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="URL de la imagen (opcional)"
          value={draftCommunity.imagen}
          onChange={(e) => setDraftCommunity({ ...draftCommunity, imagen: e.target.value })}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}