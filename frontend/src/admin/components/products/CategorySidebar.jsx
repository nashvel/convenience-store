import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  DesktopComputerIcon,
  ShoppingBagIcon,
  HomeIcon,
  BookOpenIcon,
  FireIcon,
  ShoppingCartIcon,
  TagIcon,
  MusicNoteIcon,
  CameraIcon,
  DeviceMobileIcon,
  UserGroupIcon,
  BriefcaseIcon,
  SparklesIcon,
  CubeIcon,
  BookmarkIcon,
  BeakerIcon,
  MoonIcon,
} from '@heroicons/react/outline';

const getCategoryIcon = (categoryName, isSelected) => {
  const iconClass = `h-5 w-5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`;
  const name = categoryName.toLowerCase();

  // Electronics
  if (name.includes('computers')) return <DesktopComputerIcon className={iconClass} />;
  if (name.includes('headphones')) return <MusicNoteIcon className={iconClass} />;
  if (name.includes('camera')) return <CameraIcon className={iconClass} />;
  if (name.includes('smartphones') || name.includes('tablets')) return <DeviceMobileIcon className={iconClass} />;
  if (name.includes('electronics')) return <DesktopComputerIcon className={iconClass} />;

  // Fashion
  if (name.includes('wear')) return <UserGroupIcon className={iconClass} />;
  if (name.includes('shoes')) return <SparklesIcon className={iconClass} />;
  if (name.includes('bags')) return <BriefcaseIcon className={iconClass} />;
  if (name.includes('fashion')) return <ShoppingBagIcon className={iconClass} />;

  // Home & Kitchen
  if (name.includes('kitchen')) return <BeakerIcon className={iconClass} />;
  if (name.includes('furniture')) return <CubeIcon className={iconClass} />;
  if (name.includes('decor')) return <SparklesIcon className={iconClass} />;
  if (name.includes('bed & bath')) return <MoonIcon className={iconClass} />;
  if (name.includes('home')) return <HomeIcon className={iconClass} />;

  // Other
  if (name.includes('books')) return <BookOpenIcon className={iconClass} />;
  if (name.includes('sports')) return <FireIcon className={iconClass} />;
  if (name.includes('grocery')) return <ShoppingCartIcon className={iconClass} />;

  return <TagIcon className={iconClass} />;
};

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const [openCategories, setOpenCategories] = useState([]);

  const nestedCategories = useMemo(() => {
    const categoryMap = {};
    const roots = [];

    categories.forEach(category => {
      categoryMap[category.id] = { ...category, subcategories: [] };
    });

    categories.forEach(category => {
      if (category.parent_id) {
        categoryMap[category.parent_id]?.subcategories.push(categoryMap[category.id]);
      } else {
        roots.push(categoryMap[category.id]);
      }
    });

    return roots;
  }, [categories]);

      const handleCategoryClick = (category) => {
    onSelectCategory(category.id);

    if (category.subcategories && category.subcategories.length > 0) {
      setOpenCategories(prevOpen => {
        // If the category is already open, close it.
        if (prevOpen.includes(category.id)) {
          return prevOpen.filter(id => id !== category.id);
        }

        // Find the parent of the clicked category to identify its siblings.
        let parent;
        const findParent = (nodes, childId) => {
            for (const node of nodes) {
                if (node.subcategories.some(sub => sub.id === childId)) return node;
                const found = findParent(node.subcategories, childId);
                if (found) return found;
            }
            return null;
        };
        parent = findParent(nestedCategories, category.id);

        // Get IDs of all siblings.
        const siblings = parent ? parent.subcategories : nestedCategories;
        const siblingIds = siblings.map(c => c.id);

        // Close all siblings and open the clicked category.
        const newOpen = prevOpen
            .filter(id => !siblingIds.includes(id)) // Remove all siblings
            .concat(category.id); // Add the current category
        
        return newOpen;
      });
    }
  };

  const renderCategory = (category) => {
    const isOpen = openCategories.includes(category.id);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isSelected = selectedCategory === category.id;
    const icon = getCategoryIcon(category.name, isSelected);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            isSelected ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="truncate">{category.name}</span>
          </div>
          {hasSubcategories && (
            <motion.span
              animate={{ rotate: isOpen ? 0 : -90 }}
              className={`p-1 transform transition-transform duration-200 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-5 w-5" />
            </motion.span>
          )}
        </div>
        <AnimatePresence>
          {isOpen && hasSubcategories && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: '4px' }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="pl-4 space-y-1 border-l-2 border-gray-200 ml-2 overflow-hidden"
            >
              {category.subcategories.map(renderCategory)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-sm self-start sticky top-4">
      <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Categories</h3>
      <div className="space-y-1 text-sm">
        <div
          className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            selectedCategory === null ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          <span>All Products</span>
        </div>
        {nestedCategories.map(renderCategory)}
      </div>
    </div>
  );
};

export default CategorySidebar;
