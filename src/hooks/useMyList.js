import { useState, useEffect } from 'react';

export const useMyList = () => {
  const [myList, setMyList] = useState([]);

  // Load list from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem('myList');
    if (savedList) {
      setMyList(JSON.parse(savedList));
    }
  }, []);

  // Add item to list
  const addToList = (movie) => {
    setMyList(prevList => {
      const newList = [...prevList, movie];
      localStorage.setItem('myList', JSON.stringify(newList));
      return newList;
    });
  };

  // Remove item from list
  const removeFromList = (movieId) => {
    setMyList(prevList => {
      const newList = prevList.filter(item => item.id !== movieId);
      localStorage.setItem('myList', JSON.stringify(newList));
      return newList;
    });
  };

  // Check if movie is in list
  const isInList = (movieId) => {
    return myList.some(item => item.id === movieId);
  };

  return { myList, addToList, removeFromList, isInList };
}; 