const restaurantList = document.getElementById("restaurantList");
const alertContainer = document.getElementById("alertContainer");
const loadingContainer = document.getElementById("loadingContainer");
const successContainer = document.getElementById("successContainer");
const errorContainer = document.getElementById("errorContainer");
const name = document.getElementById("name");
const cuisine = document.getElementById("cuisine");
const address = document.getElementById("address");
const city = document.getElementById("city");
const rating = document.getElementById("rating");
const ID = document.getElementById("ID");

// Alerts
const loadingAlert = (data) => {
  alertContainer.className = "d-block alert alert-primary";
  alertContainer.innerText = data;
};
const warningAlert = (data) => {
  alertContainer.className = "d-block alert alert-warning";
  alertContainer.innerText = data;
};
const successAlert = (data) => {
  console.log(data);
  alertContainer.className = "d-block alert alert-success ";
  alertContainer.innerText = data;
};
const errorAlert = (data) => {
  alertContainer.className = "d-block alert alert-danger ";

  alertContainer.innerText = data;
};
const closeAlert = () => (alertContainer.className = "d-none");

// function for Generate Unique Id 
const generateUniqueID = () => {
  const timestamp = Date.now().toString(16);
  const randomString = Math.random().toString(16).substring(2);
  return `${timestamp}-${randomString}`;
};

// Timer 
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(() => resolve(), timeout));

// function for wipe out the data 
const wipeOut = () => {
  name.value = "";
  cuisine.value = "";
  address.value = "";
  city.value = "";
  rating.value = "";
};

// function for handle the local storage data 
const getRestaurantData = () => {
    const Data = localStorage.getItem("restaurantData");
    return Data ? JSON.parse(Data) : [];
  };
  const setRestaurantData = (data) => {
    localStorage.setItem("restaurantData", data);
    return;
  };

const handleAddRestaurantData = (e) => {
  e.preventDefault();
  loadingAlert("data is adding ...");
  try {
    const id = generateUniqueID();
    const restaurantData = {
      id,
      name: name.value,
      cuisine: cuisine.value,
      address: address.value,
      city: city.value,
      rating: rating.value,
    };
    const Data = getRestaurantData();
    if (Data.length > 0) {
      const data = JSON.stringify([...Data, restaurantData]);
      setRestaurantData(data);
    } else {
      const data = JSON.stringify([restaurantData]);
      setRestaurantData(data);
    }
    successAlert("data successfully added");
    wipeOut();
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};

// function for load the data on loading the window 
const loadElement = () => {
  loadingAlert("Loading data...");
  const restaurants = getRestaurantData();
  createElement(restaurants);
  delay(1000).then(() => closeAlert());
};

// function for creating elements for load the data 
const createElement = (restaurants) => {
  restaurantList.innerHTML = "";
  if (restaurants.length === 0) {
    restaurantList.innerHTML =
      "<p class='display-3 text-center'>No restaurants added yet.</p>";
    return;
  }
  restaurants.forEach((restaurant) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
                <h4>${restaurant.name}</h4>
                <p>Cuisine: ${restaurant.cuisine}</p>
                <p>Address: ${restaurant.address}, ${restaurant.city}</p>
                <p>Rating: ${restaurant.rating}</p>
                <span>
                    <a href="restaurant-details.html?id=${restaurant.id}" type="button" class="btn btn-primary me-1">View Details</a>
                    <button type="button" class="btn btn-danger me-1" onclick="deleteRestaurant('${restaurant.id}')">Delete</button>
                    <a href="update-restaurant.html?id=${restaurant.id}" class="btn btn-warning me-1" >Update</a>
                </span>
            `;

    restaurantList.appendChild(li);
  });
  return;
};

// function for sort the data by its name 
const sortByName = (data) => {
  return data.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

// function for sort the data by its rating 
const sortByRating = (data) => {
  return data.sort((a, b) => a.rating - b.rating);
};

// function for handling the sorting process
const handleSort = (data) => {
  let restaurantupdatedData;
  const restaurantData = getRestaurantData();
  if (data === "name") restaurantupdatedData = sortByName(restaurantData);

  if (data === "rating") restaurantupdatedData = sortByRating(restaurantData);

  if (data === "select") restaurantupdatedData = restaurantData;

  if (restaurantupdatedData) createElement(restaurantupdatedData);
};

// function for handling the filter process
const handleFilter = (data) => {
  let restaurantupdatedData;
  const restaurantData = getRestaurantData();
  if (data === "all") restaurantupdatedData = restaurantData;
  else
    restaurantupdatedData = restaurantData.filter(
      (item) => item.cuisine.toLowerCase() === data.toLowerCase()
    );

  createElement(restaurantupdatedData);
  return;
};

// function for deleting the data 
const deleteRestaurant = (id) => {
  loadingAlert("Deleting data...");
  try {
    const restaurants = getRestaurantData();
    if (restaurants) {
      const updatedData = restaurants.filter(
        (restaurant) => restaurant.id !== id
      );
      const data = JSON.stringify(updatedData);
      setRestaurantData(data);
      successAlert("Data successfully deleted");
      loadElement();
    }
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};

// function for finding the data by matching by its id 
const updateElement = (id) =>
  new Promise((resolve, reject) => {
    try {
      const restaurants = getRestaurantData();
      if (restaurants) {
        const restaurantData = restaurants.filter(
          (restaurant) => restaurant.id === id
        )[0];
        if (restaurantData) {
          resolve(restaurantData);
        } else throw error("Couldnt find the data");
      }
      throw error("Couldnt find the data");
    } catch (error) {
      reject(error.message || "something went wrong");
    }
  });

//   function for handle the updating data
const handleupdateRestaurantData = (e) => {
  e.preventDefault();

  loadingAlert("data is updating ...");
  try {
    const restaurants = getRestaurantData();
    const restaurantData = {
      id: ID.value,
      name: name.value,
      cuisine: cuisine.value,
      address: address.value,
      city: city.value,
      rating: rating.value,
    };

    const restaurantupdatedData = restaurants.map((restaurant) =>
      restaurant.id === ID.value ? restaurantData : restaurant
    );
    const data = JSON.stringify(restaurantupdatedData);
    setRestaurantData(data);
    successAlert("data successfully added");
    delay(1000).then(() => closeAlert());
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};
