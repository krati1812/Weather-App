(function() {
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  // Getting Form information
  const submitButton = document.querySelector('#generate');
  const zip = document.querySelector('#zip');
  const textArea = document.querySelector('#feelings');

  //   Areas of the UI to be updated
  const dateArea = document.querySelector('#date');
  const tempArea = document.querySelector('#temp');
  const contentArea = document.querySelector('#content');

  // Container where the data will be updated on the UI
  const containerDiv = document.querySelector('#entryHolder');

  // WEATHER API
  const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';
  const countryCode = 'US';
  const apiKey = '42598150cbb0735bc73725d2c4f69f31';

  zip.addEventListener('change', event => {
    if (event.target.value.length < 5) {
      alert('Zip Code incomplete');
    }
    if (isNaN(event.target.value)) {
      alert('Zip Code is a number');
    }
  });

  //   Update UI function
  const updateUI = async () => {
    const request = await fetch('/all');
    try {
      const returnedData = await request.json();

      const createWrapperElement = (title, elementClass) => {
        //   Wrapper div
        const divElement = document.createElement('div');
        const spanElement = document.createElement('span');

        // Adding class
        divElement.classList.add(elementClass);

        // Appending elements
        containerDiv.appendChild(divElement);
        divElement.innerHTML = title;
        divElement.appendChild(spanElement);

        return spanElement;
      };

      const createTempElement = (title, imageUrl, elementClass) => {
        //   Wrapper div
        const divItem = document.createElement('div');
        const spanItem = document.createElement('span');
        const imgItem = document.createElement('IMG');
        imgItem.setAttribute('src', '/images/cloudy.svg');

        spanItem.innerText = title;

        divItem.innerHTML += spanItem.outerHTML + imgItem.outerHTML;
        containerDiv.appendChild(divItem);
        //return spanElement;
      };

      // returnedData.data.forEach(dataItem => {
      //   // Creating elements and appending content

      //   if (dataItem.cityName !== undefined) {
      //     createWrapperElement('', 'city_name').innerHTML = dataItem.cityName;
      //   }

      //   if (dataItem.temperature !== undefined) {
      //     createWrapperElement('', 'temperature').innerHTML = dataItem.temperature;
      //   }
      //   if (dataItem.currentDate !== undefined) {
      //     createWrapperElement('', 'date').innerHTML = dataItem.currentDate;
      //   }
      //   if (dataItem.userResponse !== undefined) {
      //     createWrapperElement('', 'content').innerHTML = dataItem.userResponse;
      //   }
      // });

      const last_value = returnedData.data[returnedData.data.length - 1];
      const img_url = returnedData.data[returnedData.data.length - 1].weatherCondition;

      if (last_value.cityName !== undefined) {
        createWrapperElement('', 'city_name').innerHTML = last_value.cityName;
      }

      if (last_value.userResponse !== undefined) {
        createWrapperElement('', 'content').innerHTML = last_value.userResponse;
      }

      if (last_value.temperature !== undefined) {
        createTempElement('', img_url, 'temperature').innerHTML = last_value.temperature;
      }
      if (last_value.currentDate !== undefined) {
        createWrapperElement('Date:', 'date').innerHTML = last_value.currentDate;
      }

      //   reset form
      zip.value = '';
      textArea.value = '';
    } catch (error) {
      console.log('Update UI error', error);
    }
  };

  submitButton.addEventListener('click', event => {
    const textAreaContent = textArea.value;
    const zipCode = zip.value;

    if (zipCode === '') {
      alert('Enter a Zip Code');
    }

    event.preventDefault();

    containerDiv.innerHTML = '';
    // Get request
    const getWeather = async (baseURL, zipCode, countryCode, apiKey) => {
      const urlToFetch = `${baseURL}zip=${zipCode},${countryCode}&units=metric&appid=${apiKey}`;
      const response = await fetch(urlToFetch);
      try {
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('Error', error);
      }
    };

    // Post request
    const postData = async (url = '', data = {}) => {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      try {
        const newData = await response.json();
        return newData;
      } catch (error) {
        console.log('error', error);
      }
    };

    //   Chaining of Promises
    getWeather(baseURL, zipCode, countryCode, apiKey)
      .then(data => {
        if (data.main !== undefined) {
          data.main.currentTime = newDate;
          data.main.userResponse = textAreaContent;
        } else {
          alert('Error, Please enter Zip Code');
        }

        postData('/database', data);
      })
      .then(() => {
        updateUI();
      });
  });

  window.onload = () => {
    updateUI();
  };
})();
