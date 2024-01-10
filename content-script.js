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
      console.error("Error fetching HTML file:", error.message); // Log the error message
      console.error("Error stack trace:", error.stack); // Log the stack trace for detailed error info
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
    list.innerHTML = "";
    arr.forEach((data, index) => {
      const url = "/c/" + data.id;
      const listItem = document.createElement("div");
      listItem.classList.add("saved-link");
      listItem.innerHTML = `<a href='${url}'>${data.name}</a><span class='pins'><svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 7V21a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M2 7h20M7 11V18M17 11V18" />
      </svg></span>`;

      const pin = listItem.querySelector(".pins");
      pin.addEventListener("click", function () {
        console.log(index, "Pin Removed");
      });

      list.appendChild(listItem);
    });
  }

  save.addEventListener("click", function () {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    let data = {
      name: document.title,
      id: id,
    };
    arr.push(data);
    localStorage.setItem("pinChats", JSON.stringify(arr));
    list.innerHTML = "";
    console.log(arr);
    displayList();
    alert("Chat Saved");
  });
  displayList();
}

run();
