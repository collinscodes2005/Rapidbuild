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
      if (this.loggedIn && index < this.employee_data.length) {
        this.first_name = this.employee_data[index].first_name;
        this.current_index = index;
        console.log('hey')
        console.log(this.first_name)
      } else if (this.loggedIn) {
        const access_token = localStorage.getItem('access_token');
        fetch("http://127.0.0.1:8000/employees/", {
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          Authorization: `Bearer ${access_token}`
        })
        .then(response => response.json())
        .then(data => {
          this.employee_data = data;
          app.mount("#app");
          this.getUser(0);
        })
        .catch(error => console.error(error));
      }
    },
    
    //NEXT EMPLOYEE 
    nextEmployee() {
      const next_index = this.current_index + 1;
      if (next_index < this.employee_data.length){
        this.getUser(next_index)
      }
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
    
        // Store tokens in local storage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
    
        // Retrieve tokens from local storage
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
    
        console.log(access_token)
        console.log(refresh_token)
    
        // Set authorization header for future API requests
        // fetch.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
        if (access_token) {
          fetch("http://127.0.0.1:8000/employees/", {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`
            }
          })
          .then(response => response.json())
          .then(data => {
            this.employee_data = data;
            this.getUser(0);
          })
          .catch(error => console.error(error));
        }
    
      } else {
        // Display error message
        alert('Invalid username or password.');
      }
    },
    
  },
}).mount("#app");
