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
  const sidebar = document.querySelector("#sidebar");
  const save = document.querySelector("#saveBtn");
  const list = document.querySelector("#list");

  let arr = JSON.parse(localStorage.getItem("pinChats")) || [];

  // Accessing elements after they are created
  floatingButton.addEventListener("click", () => {
    console.log("Button Clicked");
    console.log(sidebar.style.right);
    if (isOpen) {
      sidebar.style.right = "-260px";
      floatingButton.className = "float-btn arrow-left";
    } else {
      sidebar.style.right = "0";
      floatingButton.className = "float-btn arrow-right";
    }
    isOpen = !isOpen;
  });

  list.innerHTML = "";
  arr.forEach((data) => {
    list.innerHTML += `<a href='/c/${data.id}'>${data.name}</a>`;
  });

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
    arr.forEach((data) => {
      const url = "/c/" + data.id;
      list.innerHTML += `<a href='${url}'>${data.name}</a>`;
    });
  });
}

run();
