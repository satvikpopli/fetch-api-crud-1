const url = "https://630a8ccaf280658a59d0126b.mockapi.io/posts";

let saveButton = document.querySelector(".save");
saveButton.style.display = "none";


// DISPLAY POSTS
const postsArea = document.querySelector(".posts");
const template = document.querySelector("template");

function display() {
    cleanPostsArea();
    fetch(url)
        .then(response => response.json())
        .then(allPosts => {
            allPosts.forEach(post => {
                const clone = template.content.cloneNode(true);
                const card = clone.querySelector(".card");
                card.querySelector(".card-title").textContent = post.title;
                card.querySelector(".card-text").textContent = post.content;
                card.id = post.id;
                postsArea.prepend(clone);

                const deleteBtn = card.querySelector(".delete");
                deleteBtn.addEventListener("click", deletePost.bind(card));

                const editBtn = card.querySelector(".edit");
                editBtn.addEventListener("click", editPost.bind(card));
            });
        });
}

display();


// ADD POSTS
const addPostButton = document.querySelector(".submit");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
addPostButton.addEventListener("click", (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const content = contentInput.value;
    const newPost = {
        'title': `${title}`,
        'content': `${content}`
    }
    fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(display);
    // const clone = template.content.cloneNode(true);
    // const card = clone.querySelector(".card");
    // card.querySelector(".card-title").textContent = title;
    // card.querySelector(".card-text").textContent = content;
    // postsArea.prepend(clone);
    titleInput.value = "";
    contentInput.value = "";
})

// DELETE POSTS
function deletePost() {
    fetch(`${url}/${this.id}`, {
        method: 'DELETE'
    }).then(display)
}

// EDIT POSTS
function editPost() {
    const anchor = document.querySelector("#anchor")
    const title = this.querySelector(".card-title").textContent;
    const content = this.querySelector(".card-text").textContent;
    titleInput.value = title;
    contentInput.value = content;
    addPostButton.style.display = "none";
    saveButton.style.display = "inline";
    anchor.scrollIntoView();
    let saveButton2 = saveButton.clone(); 
    saveButton = saveButton2;  // clone and replace to get rid of all previous eventListeners
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const content = contentInput.value;
        const newPost = {
            'title': `${title}`,
            'content': `${content}`
        }
        fetch(`${url}/${this.id}`,
            {
                method: 'PUT',
                body: JSON.stringify(newPost),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                titleInput.value = "";
                contentInput.value = "";
                addPostButton.style.display = "inline";
                saveButton.style.display = "none";
            })
            .then(display)
    })
}

function cleanPostsArea() {
    postsArea.innerHTML = "";
}