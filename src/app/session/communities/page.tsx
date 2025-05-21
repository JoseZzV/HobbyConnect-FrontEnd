'use client';

import { useState, useEffect } from 'react';
import CrearComunidad from '../profile/CrearComunidad';
import CrearPublicacion from '../profile/CrearPublicacion';
import { Plus } from 'lucide-react';

interface Community {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  creada_por?: string;
  fecha_creacion: string;
}

interface Post {
  id: string;
  comunidad_id: string;
  contenido: string;
  fecha_edicion?: string;
  usuario_id?: string;
  fecha_publicacion?: Date | string; 
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  // Cargar comunidades 
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch('https://hobbyconnect-production.up.railway.app/comunidad', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las comunidades');
        }

        const data = await response.json();
        setCommunities(data);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching communities:', error);
        alert(error.message || 'Error al cargar las comunidades');
      }
    };

    fetchCommunities();
  }, []);

  // Cargar publicaciones cuando se selecciona una comunidad
  useEffect(() => {
    if (!selectedCommunityId) return;

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No autenticado');

        console.log(`Fetching posts for comunidad_id: ${selectedCommunityId}`);
        const response = await fetch(
          `https://hobbyconnect-production.up.railway.app/publicacion?comunidad_id=${selectedCommunityId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`Error al obtener las publicaciones: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched posts data:', data);
        if (data.length > 0) {
          console.log('First post structure:', data[0]);
        }
        setPosts(data);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching posts:', error);
        alert(error.message || 'Error al cargar las publicaciones');
      }
    };

    fetchPosts();
  }, [selectedCommunityId]);

  const handleCreateCommunity = async (comunidad: { nombre: string; descripcion?: string; imagen?: string }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No autenticado');

      const createComunidadDto = {
        nombre: comunidad.nombre,
        descripcion: comunidad.descripcion,
        categoria: 'general', 
      };

      const response = await fetch('https://hobbyconnect-production.up.railway.app/comunidad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createComunidadDto),
      });

      if (!response.ok) {
        throw new Error('Error al crear la comunidad');
      }

      const newCommunity = await response.json();
      setCommunities([...communities, newCommunity]);
      setIsCreateCommunityModalOpen(false);
      alert('Comunidad creada con éxito');
    } catch (err) {
      const error = err as Error;
      console.error('Error creating community:', error);
      alert(error.message || 'Error al crear la comunidad');
    }
  };

  const handleCreatePost = async (publicacion: { titulo: string; contenido: string; comunidadId?: string }) => {
    if (!selectedCommunityId) {
      alert('Por favor, selecciona una comunidad primero.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No autenticado');

      const createPublicacionDto = {
        comunidad_id: selectedCommunityId,
        contenido: publicacion.contenido,
      };

      const response = await fetch('https://hobbyconnect-production.up.railway.app/publicacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createPublicacionDto),
      });

      if (!response.ok) {
        throw new Error('Error al crear la publicación');
      }

      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setIsCreatePostModalOpen(false);
      alert('Publicación creada con éxito');
    } catch (err) {
      const error = err as Error;
      console.error('Error creating post:', error);
      alert(error.message || 'Error al crear la publicación');
    }
  };

  
  const communityPosts = posts;

  return (
    <div className="p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Comunidades</h1>

      <div className="mb-8">
        <button
          onClick={() => setIsCreateCommunityModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={20} />
          Crear Nueva Comunidad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {communities.length === 0 ? (
          <p className="text-gray-400">No hay comunidades disponibles. ¡Crea una!</p>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4"
            >
              <h2 className="text-xl font-semibold">{community.nombre}</h2>
              <p className="text-gray-300">{community.descripcion || 'Sin descripción'}</p>
              <div className="flex gap-3">
                <button
                  disabled={true}
                  className="bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
                >
                  Unirse (Solo creador)
                </button>
                <button
                  onClick={() => setSelectedCommunityId(community.id)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Ver Publicaciones
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCommunityId && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Publicaciones de {communities.find((c) => c.id === selectedCommunityId)?.nombre}
            </h2>
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Plus size={20} />
              Crear Publicación
            </button>
          </div>
          {communityPosts.length === 0 ? (
            <p className="text-gray-400">No hay publicaciones en esta comunidad todavía.</p>
          ) : (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300">{post.contenido}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Publicado el:{' '}
                    {post.fecha_publicacion
                      ? new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Fecha no disponible'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <CrearComunidad
        isOpen={isCreateCommunityModalOpen}
        onClose={() => setIsCreateCommunityModalOpen(false)}
        onSave={handleCreateCommunity}
      />

      {selectedCommunityId && (
        <CrearPublicacion
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSave={handleCreatePost}
          communities={communities}
        />
      )}
    </div>
  );
}