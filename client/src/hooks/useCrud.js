import { useState, useEffect, useCallback } from "react";

export function useCrud({ fetchItems, addItem, updateItem, deleteItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (query = "") => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetchItems(query);
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setError(
          "Не удалось загрузить данные с сервера. Проверьте подключение.",
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchItems],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const create = async (newItemData) => {
    const tempId = Date.now();
    const optimisticItem = { id: tempId, ...newItemData };

    setItems((prev) => [optimisticItem, ...prev]);

    try {
      const response = await addItem(newItemData);
      const realItem = response.data;
      setItems((prev) =>
        prev.map((item) => (item.id === tempId ? realItem : item)),
      );
      return true;
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== tempId));
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
      setItems(originalItems);
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
      setItems(originalItems);
      alert("Ошибка при удалении!");
      return false;
    }
  };

  return { items, loading, error, create, update, remove, reload: loadData };
}
