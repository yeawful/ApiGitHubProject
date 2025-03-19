import { debounce } from "./helpers/debounce.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".form__input");
  const searchResultsList = document.querySelector(".search-list");
  const selectedResultsBox = document.querySelector(".result-box");

  let data = null;

  // Обработка ввода с использованием debounce
  const handleInputWithDebounce = debounce(async () => {
    const query = searchInput.value.trim();
    if (!query) {
      clearSearchResults();
      return;
    }

    try {
      data = await fetchRepositories(query);
      displaySearchResults(data);
    } catch (error) {
      console.error("Ошибка при запросе к API", error);
    }
  }, 500);

  searchInput.addEventListener("input", handleInputWithDebounce);

  // Обработка клика по элементам списка результатов
  searchResultsList.addEventListener("click", (e) => {
    const clickedItem = e.target.closest(".search-list__item");
    if (clickedItem && data) {
      const repoName = clickedItem.textContent;
      const repo = data.items.find((r) => r.full_name === repoName);
      if (repo) {
        addRepositoryToSelected(repo);
        clearSearchInput();
        clearSearchResults();
      }
    }
  });

  // Обработка клика по кнопке удаления в контейнере выбранных репозиториев
  selectedResultsBox.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      removeRepository(e.target);
    }
  });

  // Запрос к API для получения репозиториев
  async function fetchRepositories(query) {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&per_page=5`
    );
    return response.json();
  }

  // Отображение результатов поиска
  function displaySearchResults(data) {
    searchResultsList.innerHTML = "";
    data.items.forEach((repo) => {
      const listItem = document.createElement("li");
      listItem.classList.add("search-list__item");
      listItem.textContent = repo.full_name;
      searchResultsList.append(listItem);
    });
  }

  // Добавление выбранного репозитория в контейнер
  function addRepositoryToSelected(repo) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-box__item");

    const resultInfo = document.createElement("div");
    resultInfo.classList.add("result-box__info");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `Name: ${repo.name}`;

    const ownerSpan = document.createElement("span");
    ownerSpan.textContent = `Owner: ${repo.owner.login}`;

    const starsSpan = document.createElement("span");
    starsSpan.textContent = `Stars: ${repo.stargazers_count}`;

    resultInfo.append(nameSpan);
    resultInfo.append(ownerSpan);
    resultInfo.append(starsSpan);

    const removeButton = document.createElement("button");
    removeButton.classList.add("result-box__btn");

    resultItem.append(resultInfo);
    resultItem.append(removeButton);

    selectedResultsBox.append(resultItem);
  }

  // Удаление репозитория из контейнера
  function removeRepository(button) {
    button.closest(".result-box__item").remove();
  }

  // Очистка поля ввода
  function clearSearchInput() {
    searchInput.value = "";
  }

  // Очистка списка результатов поиска
  function clearSearchResults() {
    searchResultsList.replaceChildren();
  }
});
