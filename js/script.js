document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".form__input");
  const list = document.querySelector(".search-list");
  const result = document.querySelector(".result-box");

  let timeoutId;

  input.addEventListener("input", () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const query = input.value.trim();
      if (!query) {
        list.innerHTML = "";
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${query}&per_page=5`
        );

        const data = await response.json();
        list.innerHTML = data.items
          .map((repo) => `<li class="search-list__item">${repo.full_name}</li>`)
          .join("");

        list.querySelectorAll(".search-list__item").forEach((item) => {
          item.addEventListener("click", () => {
            const repo = data.items.find(
              (r) => r.full_name === item.textContent
            );
            result.innerHTML += `
              <div class="result-box__item">
                <div class="result-box__info">
                  <span>Name: ${repo.name}</span>
                  <span>Owner: ${repo.owner.login}</span>
                  <span>Stars: ${repo.stargazers_count}</span>
                </div>
                <button class="result-box__btn"></button>
              </div>
            `;
            input.value = "";
            list.innerHTML = "";
          });
        });
      } catch (error) {
        console.error("Ошибка при запросе к API", error);
      }
    }, 500);
  });

  // Обработчик клика для удаления репозиториев
  result.addEventListener("click", (e) => {
    if (e.target.classList.contains("result-box__btn")) {
      e.target.closest(".result-box__item").remove();
    }
  });
});
