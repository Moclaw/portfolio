import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

// Individual sortable item component
const SortableItem = ({ id, children, index, isActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-tertiary p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing
        border-2 transition-all duration-200 ease-out
        ${isDragging 
          ? 'border-blue-500 shadow-2xl ring-2 ring-blue-500/20 bg-tertiary/90 backdrop-blur-sm' 
          : 'border-transparent hover:border-gray-600 hover:shadow-lg hover:bg-tertiary/80'
        }
        ${!isActive ? 'opacity-60' : ''}
      `}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
        rotateZ: isDragging ? 1 : 0,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 300,
        mass: 0.8,
        opacity: { duration: 0.2 },
        y: { duration: 0.3 },
        scale: { duration: 0.15 },
        rotateZ: { duration: 0.1 }
      }}
      whileHover={{ 
        scale: isDragging ? 1.02 : 1.005,
        y: isDragging ? 0 : -1,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
        <div className="flex-1 ml-4">
          {children}
        </div>
        <motion.div 
          className="flex flex-col gap-1 ml-4 p-2 rounded opacity-40 hover:opacity-100 transition-all duration-200 hover:bg-gray-700/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main DragDropList component
const DragDropList = ({ items, onReorder, renderItem, keyExtractor, isActiveExtractor, className }) => {
  const [localItems, setLocalItems] = useState(items);
  const [isReordering, setIsReordering] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalItems, setOriginalItems] = useState(items);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id && over) {
      const oldIndex = localItems.findIndex((item) => keyExtractor(item) === active.id);
      const newIndex = localItems.findIndex((item) => keyExtractor(item) === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(localItems, oldIndex, newIndex);
        setLocalItems(newItems);
        setHasChanges(true);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    // Update order values for backend
    const itemsWithNewOrder = localItems.map((item, index) => ({
      id: keyExtractor(item),
      order: index + 1,
    }));

    setIsReordering(true);
    try {
      await onReorder(itemsWithNewOrder);
      setHasChanges(false);
      setOriginalItems([...localItems]);
    } catch (error) {
      console.error('Failed to reorder items:', error);
      // Revert on error
      setLocalItems([...originalItems]);
      setHasChanges(false);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDiscardChanges = () => {
    setLocalItems([...originalItems]);
    setHasChanges(false);
  };

  // Update local items when props change
  React.useEffect(() => {
    setLocalItems(items);
    setOriginalItems(items);
    setHasChanges(false);
  }, [items]);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Action Buttons */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-500/50 rounded-lg p-4 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400 text-sm font-medium">
                You have unsaved changes to the order
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isReordering}
                className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isReordering ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isReordering && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/50 rounded-lg p-4 text-blue-400 text-sm text-center backdrop-blur-sm"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span>Saving order changes...</span>
          </div>
        </motion.div>
      )}
      
      {/* Drag and Drop Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localItems.map(keyExtractor)}
          strategy={verticalListSortingStrategy}
        >
          <div className={`space-y-3 transition-all duration-200 ${activeId ? 'opacity-90' : 'opacity-100'}`}>
            {localItems.map((item, index) => (
              <SortableItem
                key={keyExtractor(item)}
                id={keyExtractor(item)}
                index={index}
                isActive={isActiveExtractor ? isActiveExtractor(item) : true}
              >
                {renderItem(item, index)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {localItems.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>No items to display</p>
          <p className="text-sm mt-1">Items will appear here when available</p>
        </div>
      )}
    </div>
  );
};

export default DragDropList;
