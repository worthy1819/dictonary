const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  infoText = wrapper.querySelector(".info-text"),
  volumeIcon = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span");

function data(result, word) {
  console.log(result);


  if (result.title) {
    infoText.style.color = "white";
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word <i class="fa-solid fa-exclamation fa-shake text-red-600"></i>`;
  } else {
    wrapper.classList.add("active");
    const meanings = result[0].meanings;
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word2").innerText = result[0].phonetic;
    let synonymsFound = 0;
    let synonymsString = "";

    let meaningHTML = "";
    for (let i = 0; i < meanings.length; i++) {
      let meaning = meanings[i];

      // Check if definition exists in the array
      if (meaning.definitions && meaning.definitions.length > 0) {
        meaningHTML += document.querySelector(".meaning span").innerText =
          meaning.definitions[0].definition;
        break; // Stop loop if definition found
      }
    }

    for (let i = 0; i < meanings.length; i++) {
      let meaning = meanings[i];
      // Check if example exists in the array
      if (
        meaning.definitions &&
        meaning.definitions.length > 0 &&
        meaning.definitions[0].example
      ) {
        meaningHTML += document.querySelector(".example span").innerText =
          meaning.definitions[0].example;
        break; // Stop loop if example found
      }
    }

    for (let i = 0; i < 5; i++) {
      let meaning = meanings[i];

      if (meaning?.synonyms && meaning.synonyms.length > 0) {
        // If synonyms exist for the current meaning
        for (let j = 0; j < meaning.synonyms.length; j++) {
          // Loop through synonyms of the current meaning
          if (synonymsFound < 5) {
            // If less than 5 synonyms found, display them
            const synonym = meaning.synonyms[j];

            // Display the synonym
            const listItem = document.createElement("li");
            listItem.textContent = synonym;

            listItem.onclick = search(synonym);

            synonymsString += document
              .querySelector(".synonyms .list")
              .appendChild(listItem);
            synonymsFound++;
          } else {
            // If 5 synonyms found, exit the loop
            break;
          }
        }
      }
      if (synonymsFound >= 5) {
        // If 5 synonyms found, exit the outer loop
        break;
      }
    }

    result?.forEach((item) => {
      item?.phonetics?.filter((phonetic) => {
        if (phonetic?.audio) {
          audio = new Audio(phonetic?.audio);
          volumeIcon.style.cursor = "pointer";
          // Do something with the audio
          volumeIcon.addEventListener("click", () => {
            // console.log(audio);
            audio.play();
          });
        }
      });
    });

  }
}


function search(word) {
  return function () {
    wrapper.classList.remove("active");
    // Clear existing list items
    const synonymsList = document.querySelector(".synonyms .list");
    synonymsList.innerHTML = "";

    // Create a new list item for the clicked synonym
    const listItem = document.createElement("li");
    listItem.textContent = word;

    // Append the new list item to the synonyms list
    synonymsList.appendChild(listItem);

    // Set the search input value to the clicked synonym
    searchInput.value = word;

    // Fetch API data for the clicked synonym
    fetchApi(word);
  };
}

function fetchApi(word) {
  wrapper.classList.remove("active");
  infoText.style.color = "white";
  infoText.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse text-blue-600"></i> Searching the meaning of <span>"${word}"</span>`;
  // console.log(word);
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word));
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    document.querySelector(".word2").innerHTML =
      '<p style="font-size: 12px;"> Not Found </p>';
    document.querySelector(".example span").innerHTML =
      '<p style="font-size: 12px;"> Not Found </p>';
    document.querySelector(".synonyms .list").innerHTML = "";
    // console.log({text: e.target.value});
    fetchApi(e.target.value);
  }
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "white";
  infoText.innerHTML =
    "Type a word and press enter to get meaning, example, pronunciation and synonyms of that typed word.";
});
