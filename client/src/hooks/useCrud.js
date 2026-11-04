// Универсальный хук для CRUD операций с оптимистичным обновлением UI
// Хук принимает объект с 4 функциями API (чтение, создание, обновление, удаление)

import { useState, useEffect, useCallback } from "react";

export function useCrud({ fetchItems, addItem, updateItem, deleteItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchItems();
      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить данные с сервера. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const create = async (newItemData) => {
    const tempId = Date.now();
    const optimisticItem = { id: tempId, ...newItemData };

    setItems((prev) => [optimisticItem, ...prev]); // Мгновенно показываем в UI

    try {
      const response = await addItem(newItemData); // Отправляем на сервер
      const realItem = response.data;
      setItems((prev) =>
        prev.map((item) => (item.id === tempId ? realItem : item)),
      ); // Меняем ID
      return true; // Возвращаем успех для очистки формы в компоненте
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId)); // Откат
      alert("Ошибка при добавлении на сервере!");
      return false;
    }
  };

  const update = async (id, updatedFields) => {
    const originalItems = [...items];
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );

    try {
      await updateItem(id, updatedFields);
      return true;
    } catch (err) {
      setItems(originalItems); // Откат
      alert("Ошибка при сохранении изменений!");
      return false;
    }
  };

  const remove = async (id) => {
    const originalItems = [...items];
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteItem(id);
      return true;
    } catch (err) {
      setItems(originalItems); // Откат
      alert("Ошибка при удалении!");
      return false;
    }
  };

  // Возвращаем только то, что нужно компоненту для отрисовки интерфейса
  return { items, loading, error, create, update, remove, reload: loadData };
}
