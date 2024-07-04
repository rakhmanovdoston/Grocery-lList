import Header from "./components/Header";
import SearchItem from "./components/SearchItem";
import AddItem from "./components/AddItem";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import Content from "./components/Content";

function App() {
  const [Items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const Api_url = "http://localhost:3000";
    async function fetchItems() {
      try {
        setIsLoading(true);
        const response = await fetch(`${Api_url}/Items`);
        if (!response.ok) {
          const responseText = await response.text();
          throw new Error("Network error was not ok");
        }

        const newItem = await response.json();
        console.log(newItem);
        setItems(newItem);
      } catch (error) {
        if (error.name == "AbortError") {
          console.log("The fetch was aborted", error.message);
        } else {
          console.error(error);
          setFetchError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  async function handleDelete(id) {
    try {
      const deletedItems = Items.find((item) => {
        item.id === id;
      });
      if (!deletedItems) throw new Error("Error deleted item not found");
      const response = await fetch(`${Api_url}/Items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Network error was not ok: ${responseText}`);
      }

      const filteredItems = Items.filter((item) => item.id !== id);
      setItems(filteredItems);
    } catch (error) {
      console.error(error);
      setFetchError(error.message);
    }
  }

  async function handleCheck(id) {
    try {
      const updatedItem = Items.find((item) => {
        item.id === id;
      });

      if (!updatedItem) throw new Error("Error updated item not found");
      const response = await fetch(`${Api_url}/Items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checked: !updatedItem.checked }),
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Network error was not ok: ${responseText}`);
      }

      const updatedItems = Items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setItems(updatedItem);
    } catch (error) {
      console.error(error);
      setFetchError(error.message);
    }
  }

  console.log(search);

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading...</p>}
        {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
        {!isLoading && !fetchError && (
          <Content
            items={Items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleDelete={handleDelete}
            handleCheck={handleCheck}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
