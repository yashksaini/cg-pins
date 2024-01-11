function injectHTML(htmlString) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;
  document.body.appendChild(wrapper);
}

function run() {
  fetch(chrome.runtime.getURL("sidebar.html"))
    .then((response) => response.text())
    .then((html) => {
      // Inject the HTML into the DOM
      injectHTML(html);
      executeBasics();
    })
    .catch((error) => {
      console.error("Error fetching HTML file:", error.message);
      console.error("Error stack trace:", error.stack);
    });
}
function executeBasics() {
  let isOpen = true;

  const floatingButton = document.querySelector("#floatingButton");
  const closeBtn = document.querySelector("#closeBtn");
  const sidebar = document.querySelector("#sidebar");
  const save = document.querySelector("#saveBtn");
  const list = document.querySelector("#list");

  let arr = JSON.parse(localStorage.getItem("pinChats")) || [];

  function toggleSidebar() {
    if (isOpen) {
      sidebar.style.right = "-260px";
    } else {
      sidebar.style.right = "0";
    }
    isOpen = !isOpen;
  }

  // Accessing elements after they are created
  floatingButton.addEventListener("click", () => {
    toggleSidebar();
  });
  closeBtn.addEventListener("click", () => {
    toggleSidebar();
  });

  function displayList() {
    if (arr.length > 0) {
      list.innerHTML = "";
      arr.forEach((data, index) => {
        const url = "/c/" + data.id;
        const listItem = document.createElement("div");
        listItem.classList.add("saved-link");
        listItem.innerHTML = `<a href='${url}'>${data.name}</a><span class='pins'><svg xmlns="http://www.w3.org/2000/svg" height="12" width="10" viewBox="0 0 448 512">
        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" fill="#ffffff"/>
      </svg>
      </span>`;

        const pin = listItem.querySelector(".pins");
        pin.addEventListener("click", function () {
          arr.splice(index, 1);
          localStorage.setItem("pinChats", JSON.stringify(arr));
          showToast("Pinned Chat Removed");
          displayList();
        });

        list.appendChild(listItem);
      });
    } else {
      list.innerHTML = `<div class="saved-link"><a>List appear here...</a></div>`;
    }
  }

  save.addEventListener("click", function () {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    // Check if data with the same id already exists
    const existingDataIndex = arr.findIndex((item) => item.id === id);

    if (existingDataIndex !== -1) {
      arr[existingDataIndex].name = document.title;
      showToast("Pinned title updated");
    } else {
      let data = {
        name: document.title,
        id: id,
      };
      arr.push(data);
      showToast("Chat Pinned");
    }
    localStorage.setItem("pinChats", JSON.stringify(arr));
    list.innerHTML = "";
    displayList();
  });
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.style.display = "block";

    // Hide the toast after 2 seconds
    setTimeout(function () {
      toast.style.display = "none";
    }, 2000);
  }

  displayList();
}

run();
