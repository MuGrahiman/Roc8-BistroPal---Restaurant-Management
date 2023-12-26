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
const API_URL = "http://localhost:3000/data/";
// Alerts
const showAlert = (type, data) => {
  alertContainer.className = `d-block alert alert-${type}`;
  alertContainer.innerText = data;
  delay(3000).then(() => {
    closeAlert();
  });
};
const loadingAlert = (data) => showAlert("primary", data);
const warningAlert = (data) => showAlert("warning", data);
const successAlert = (data) => showAlert("success", data);
const errorAlert = (data) => showAlert("danger", data);
const closeAlert = () => (alertContainer.className = "d-none");
// Timer
const delay = (timeout) =>
  new Promise((resolve) => {
    let timeId;
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => resolve(), timeout);
  });
// function for wipe out the data
const wipeOut = () => {
  name.value = "";
  cuisine.value = "";
  address.value = "";
  city.value = "";
  rating.value = "";
};
// function for Generate Unique Id
const generateUniqueID = () => {
  const timestamp = Date.now().toString(16);
  const randomString = Math.random().toString(16).substring(2);
  return `${timestamp}-${randomString}`;
};
//  endpoint for get the data
const getData = async () => {
  loadingAlert('Data is Loading ...')
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    successAlert('Data Successfully Loaded');
    return data;
  } catch (error) {
    throw new error(`Error fetching data:${error.message || 'some thing went wrong'}`, );
  }
};
//  endpoint for get the data
const getSingleData = async (id) => {
  loadingAlert('Data is Loading ...')
  try {
    const response = await fetch(API_URL + id);
    const data = await response.json();
    successAlert('Data Successfully Loaded');
    return data;
  } catch (error) {
    throw new error(`Error fetching data:${error.message || 'some thing went wrong'}`, );
  }
};
//  endpoint for post the data
const postData = async (jsonData) => {
  loadingAlert('Data is Loading ...')
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    if (response.ok) {
    successAlert('Data Successfully Loaded');
  } else {
      console.error("Failed to add data:", response.statusText);
    throw new error(`Failed to add data:${response.statusText || 'some thing went wrong'}`, );
  }
  } catch (error) {
    console.error("Error:", error.message);
    throw new error(`Error:${error.message || 'some thing went wrong'}`, );
  }
};
//  endpoint for update the data
const updateDataById = async (id, updatedData) => {
  loadingAlert('Data is Loading ...')
  try {
    const response = await fetch(API_URL + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (response.ok) {
    successAlert('Data Successfully Loaded');
  } else {
      console.error(
        `Failed to update data with id ${id}: ${response.statusText}`
      );
    throw new error(`Failed to update data:${response.statusText || 'some thing went wrong'}`, );
  }
  } catch (error) {
    console.error("Error:", error);
    throw new error(`Error:${error.message || 'some thing went wrong'}`, );
  }
};
//  endpoint for delete the data
const deleteDataById = async (id) => {
  loadingAlert('Data is Loading ...')
  try {
    const response = await fetch(API_URL + id, {
      method: "DELETE",
    });

    if (response.ok) {
    successAlert('Data Successfully Loaded');
  } else {
      console.error(
        `Failed to delete data with id ${id}: ${response.statusText}`
      );
    throw new error(`Failed to delete data:${response.statusText || 'some thing went wrong'}`, );
  }
  } catch (error) {
    console.error("Error:", error);
    throw new error(`Error:${error.message || 'some thing went wrong'}`, );
  }
};

const handleAddRestaurantData = async (e) => {
  e.preventDefault();
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
     await postData(restaurantData);
    wipeOut();
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};

// function for load the data on loading the window
const loadElement = async () => {
  const restaurants = await getData();
  createElement(restaurants);
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
const handleSort = async (data) => {
  let restaurantupdatedData;
  const restaurantData = await getData();
  if (data === "name") restaurantupdatedData = sortByName(restaurantData);

  if (data === "rating") restaurantupdatedData = sortByRating(restaurantData);

  if (data === "select") restaurantupdatedData = restaurantData;

  if (restaurantupdatedData) createElement(restaurantupdatedData);
};
// function for handling the filter process
const handleFilter = async (data) => {
  let restaurantupdatedData;
  const restaurantData = await getData();
  if (data === "all") restaurantupdatedData = restaurantData;
  else
    restaurantupdatedData = restaurantData.filter(
      (item) => item.cuisine.toLowerCase() === data.toLowerCase()
    );

  createElement(restaurantupdatedData);
  return;
};
// function for deleting the data
const deleteRestaurant = async (id) => {
  try {
    await deleteDataById(id);
    loadElement();
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};
//   function for handle the updating data
const handleupdateRestaurantData = async (e) => {
  e.preventDefault();

  try {
    const restaurantData = {
      id: ID.value,
      name: name.value,
      cuisine: cuisine.value,
      address: address.value,
      city: city.value,
      rating: rating.value,
    };
    await updateDataById(ID.value, restaurantData);
  } catch (error) {
    errorAlert(error.message || "something went wrong");
  }
};
