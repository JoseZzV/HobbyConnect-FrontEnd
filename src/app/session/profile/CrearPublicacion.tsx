import { useState, ChangeEvent } from 'react';

interface Community {
  id: string;
  nombre: string;
}

interface CrearPublicacionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publicacion: { titulo: string; contenido: string; comunidadId?: string }) => void;
  communities: Community[];
}

export default function CrearPublicacion({ isOpen, onClose, onSave, communities }: CrearPublicacionProps) {
  const [draftPost, setDraftPost] = useState({
    titulo: '',
    contenido: '',
    comunidadId: '',
  });

  const handleSave = () => {
    if (!draftPost.titulo.trim() || !draftPost.contenido.trim()) {
      alert('El título y el contenido son obligatorios');
      return;
    }

    onSave({
      titulo: draftPost.titulo.trim(),
      contenido: draftPost.contenido.trim(),
      comunidadId: draftPost.comunidadId || undefined,
    });
    setDraftPost({ titulo: '', contenido: '', comunidadId: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 text-white">
        <h3 className="text-lg font-semibold mb-4">Crear Publicación</h3>
        <input
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Título"
          value={draftPost.titulo}
          onChange={(e) => setDraftPost({ ...draftPost, titulo: e.target.value })}
        />
        <textarea
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          placeholder="Contenido"
          value={draftPost.contenido}
          onChange={(e) => setDraftPost({ ...draftPost, contenido: e.target.value })}
        />
        <select
          className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={draftPost.comunidadId}
          onChange={(e) => setDraftPost({ ...draftPost, comunidadId: e.target.value })}
        >
          <option value="">Sin comunidad</option>
          {communities.map((community) => (
            <option key={community.id} value={community.id}>
              {community.nombre}
            </option>
          ))}
        </select>
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