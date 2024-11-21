
   <!-- <template>
  <div class="interests">
    <h1 class="title">My Personal Interests</h1>
    
    <div class="interest-list">
      <ul>
        <li v-for="(interest, index) in interests" :key="index" class="interest-item">
          {{ interest }}
        </li>
      </ul>
    </div>

    
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
      // Initially empty array for user to add interests dynamically
      interests: [],
      // New interest text
      newInterest: ''
    };
  },
  methods: {
    // Method to add a new interest
    addInterest() {
      if (this.newInterest.trim()) {
        this.interests.push(this.newInterest.trim()); // Add new interest
        this.newInterest = ''; // Clear input field after adding
      }
    }
  }
};
</script>

<style scoped>
/* General style for the interests section */
.interests {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f9f9f9; /* Light gray background */
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Title style */
.title {
  font-size: 36px;
  color: #6d2727; /* Dark gray color */
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

/* Interest list styling */
.interest-list {
  margin-top: 20px;
}

.interest-item {
  font-size: 18px;
  color: #555555; /* Medium gray */
  margin-bottom: 12px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

/* Hover effect for each list item */
.interest-item:hover {
  transform: scale(1.05);
  background-color: #e8e8e8; /* Subtle gray background on hover */
}

/* Add interest input and button styling */
.add-interest {
  margin-top: 30px;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  width: 240px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #aaa; /* Slightly darker border on focus */
}

.add-button {
  padding: 10px 18px;
  font-size: 16px;
  background-color: #591b1b; /* Green background */
  color: white;
  border: none;
  border-radius: 25px;
  margin-left: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background-color: #672f2f; /* Slightly darker green on hover */
  transform: scale(1.05);
}
</style> -->

<template>
  <div class="interest-form">
    <h2>Add Interest</h2>
    <form @submit.prevent="saveInterest">
      <div>
        <label for="name">Interest Name:</label>
        <input type="text" v-model="interestName" id="name" required />
      </div>
      <button type="submit">Save Interest</button>
    </form>

    <h3>Interests for Resume {{ resumeId }}</h3>
    <ul>
      <li v-for="interest in interests" :key="interest.interest_id">
        {{ interest.interest }}
        <button @click="deleteInterest(interest.interest_id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import interestServices from '../services/interestServices';
import store from '../store/store';

export default {
  props: {
    resumeId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      interestName: '',
      interests: []
    };
  },
  methods: {
    async saveInterest() {
      try {
        await interestServices.createInterest({interest: this.interestName, userId: store.getters.getLoginUserInfo.userId});
        this.fetchInterests(); // Refresh interests after adding a new one
        this.interestName = ''; // Clear input field
      } catch (error) {
        console.error('Error saving interest:', error.response?.data || error.message);
      }
    },

    async deleteInterest(interestId) {
      try {
        console.log(interestId)
        await interestServices.deleteInterest({interest_id: interestId});
        this.fetchInterests(); // Refresh interests after deleting one
      } catch (error) {
        console.error('Error deleting interest:', error.response?.data || error.message);
      }
    },

    async fetchInterests() {
      try {
        const response = await interestServices.getAllInterests(store.getters.getLoginUserInfo.userId);
        this.interests = response.data;
      } catch (error) {
        console.error('Error fetching interests:', error.response?.data || error.message);
      }
    }
  },
  mounted() {
    this.fetchInterests();
  }
};
</script>

<style scoped>
.interest-form {
  background-color: #f9f7f1; 
  padding: 20px;
  max-width: 3000px;
  margin: auto;
  border-radius: 10px;
  font-family: Arial, sans-serif; 
  background-color: #f9f7f1; /* Light beige background */
  padding: 40px;
  font-family: Arial, sans-serif;
  color: #8b2d2b;
}

.interest-form h2 {
  text-align: center;
  color: #8b2d2b; /* Dark red color for title */
  font-weight: bold;
  margin-bottom: 20px;
}

.interest-form form div {
  margin-bottom: 15px;
}

.interest-form label {
  display: block;
  font-size: 14px;
  color: #8b2d2b;
  margin-bottom: 5px;
}

.interest-form input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.interest-form button[type="submit"] {
  background-color: #8b2d2b;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.interest-form button[type="submit"]:hover {
  background-color: #a33e3c;
}

.interest-form h3 {
  color: #8b2d2b;
  font-weight: bold;
  margin-top: 30px;
  text-align: center;
}

.interest-form ul {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.interest-form li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.delete-button {
  background-color: transparent;
  color: #8b2d2b;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.delete-button:hover {
  color: #ff4d4d;
}
</style>





