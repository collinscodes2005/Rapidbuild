const app = Vue.createApp({
  data() {
    return {
      //data used by the application 
      employee_data: [],
      current_index: 0,
      first_name: '',
      loggedIn: false,
      username: '',
      password: '',
      first_page: true,
    };
  },
  methods: {
    //function to set the employee info(when the index is passed in)
    async getUser(index) {
      if (index < this.employee_data.length) {
        this.first_name = this.employee_data[index].first_name;
        this.current_index = index;
        console.log('hey')
        console.log(this.first_name)

      }
    },
    //function to get the index of the next employee 
    nextEmployee() {
      const next_index = this.current_index + 1;
      if (next_index < this.employee_data.length) {
        this.getUser(next_index);
      }
      console.log("it worked")
    },
    //login function 
    async login(){
      const res = await fetch("http://127.0.0.1:8000/login/", {
        mode: "cors",
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: this.username,
          password: this.password,
        }),
      });
      const data = await res.json();
      // Check if login was successful
      if (data.success) {
        this.first_page = false;
        this.loggedIn = true;
        this.getUser(0);
      } else {
        // Display error message
        alert('Invalid username or password.');
      }
    },
  },


  mounted() {
      fetch("http://127.0.0.1:8000/employees/", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => {
        this.employee_data = data;
        this.getUser(0);
      })
      .catch(error => console.error(error));

    },
});
app.mount("#app");
