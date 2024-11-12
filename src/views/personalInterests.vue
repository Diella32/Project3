<template>
    <div class="interests">
      <h1 class="title">My Personal Interests</h1>
      
      <div class="interest-list">
        <ul>
          <!-- Example interests list -->
          <li v-for="(interest, index) in interests" :key="index" class="interest-item">
            {{ interest }}
          </li>
        </ul>
      </div>
  
      <!-- Add an input field to add interests -->
      <div class="add-interest">
        <input 
          v-model="newInterest" 
          type="text" 
          placeholder="Add a new interest" 
          @keyup.enter="addInterest"
          class="input-field"
        />
        <button @click="addInterest" class="add-button">+ Add</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Array of interests
        interests: ['Coding', 'Reading', 'Music', 'Traveling'],
        // New interest text
        newInterest: ''
      };
    },
    methods: {
      // Method to add a new interest
      addInterest() {
        if (this.newInterest.trim()) {
          this.interests.push(this.newInterest.trim());
          this.newInterest = ''; // Clear input field after adding
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* General style for the interests section */
  .interests {
    /* padding: 30px; */
    font-family: 'Comic Sans MS', cursive, sans-serif;
    background-color: #ffffff; /* Light pink background */
     /* border-radius: 20px; */
    /* box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); */
    /* max-width: 500px; */
    /* margin: auto; */
    /* text-align: center; */
  }
  
  /* Title style */
  .title {
    font-size: 32px;
    color: #800000; /* Maroon color */
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 20px;
    letter-spacing: 2px;
    animation: bounce 1s infinite;
  }
  
  /* Interest list styling */
  .interest-list {
    margin-top: 20px;
  }
  
  .interest-item {
    font-size: 20px;
    color: #800000; /* Maroon color */
    margin-bottom: 10px;
    font-weight: 500;
    background-color: #ffffff; /* Light pink for list items */
    padding: 10px;
    border-radius: 15px;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  /* Hover effect for each list item */
  .interest-item:hover {
    transform: scale(1.05);
    background-color: #f0c0c8; /* Soft pink on hover */
  }
  
  /* Add interest input and button styling */
  .add-interest {
    margin-top: 30px;
  }
  
  .input-field {
    padding: 12px;
    font-size: 18px;
    border-radius: 25px;
    border: 2px solid #f9f6f7;
    outline: none;
    width: 250px;
    transition: border 0.3s ease;
  }
  
  .input-field:focus {
    border-color: #faf8f9; /* Focused border color */
  }
  
  .add-button {
    padding: 12px 20px;
    font-size: 18px;
    background-color: #671c1c; /* Soft pink background */
    color: white;
    border: none;
    border-radius: 25px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .add-button:hover {
    background-color: #652c2c; /* Darker pink on hover */
    transform: scale(1.05);
  }
  
  /* Animation for the title */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  </style>
  