import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MangaContext } from '../context/MangaContext';
import { FaStar, FaBookmark, FaTrash } from 'react-icons/fa';

const Favorites = () => {
  const { favorites, removeFromFavorites, loading, error } = useContext(MangaContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl text-primary">Loading your favorites...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <motion.div
      className="pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section
        className="bg-cover bg-center py-16 px-8 text-center"
        style={{ backgroundImage: "linear-gradient(to right, rgba(15, 22, 36, 0.9), rgba(15, 22, 36, 0.7)), url('https://images.unsplash.com/photo-1560942485-b5c7132a3631?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Favorites</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your personally curated collection of amazing manga
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16 px-8 bg-gray-800 rounded-lg text-gray-400">
            <FaBookmark size={48} className="mx-auto mb-6" />
            <h2 className="text-3xl mb-4 text-white">Your favorites list is empty</h2>
            <p className="text-lg mb-8">Start adding manga to your favorites to see them here</p>
            <Link
              to="/discover"
              className="inline-block py-3 px-6 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
            >
              Explore Manga
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <FaBookmark className="text-primary" /> {favorites.length} {favorites.length === 1 ? 'Manga' : 'Manga Series'}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {favorites.map((manga, index) => (
                <motion.div 
                  key={manga.id}
                  className="relative rounded-lg overflow-hidden shadow-lg aspect-w-2 aspect-h-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 * index, duration: 0.5 }
                  }}
                >
                  <Link to={`/manga/${manga.id}`} className="block h-full group">
                    <img src={manga.coverImage} alt={manga.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ease-in-out group-hover:from-black/90">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{manga.title}</h3>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                            <FaStar /> {manga.rating}
                          </div>
                          <div className="text-gray-300">
                            {manga.genres.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <motion.button 
                    onClick={() => removeFromFavorites(manga.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-red-500 flex items-center justify-center transition-colors duration-300 ease-in-out hover:bg-red-500 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </motion.div>
  );
};

export default Favorites;