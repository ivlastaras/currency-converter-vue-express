<template>
    <div v-if="!loggedIn">
        <h2>You need to log in to access this page!</h2>
        <form @submit.prevent="handleLogin">
            <label>Name:</label>
            <input type="text" pattern="[A-Za-z]+" placeholder="Enter name" v-model="username" required />
            <label>Password:</label>
            <input type="password" placeholder="Enter password" v-model="password" required />
            <input type="submit" value="Submit" />
        </form>
    </div>
    <div v-else>
        <form @submit.prevent>
            <label>Base:</label>
            <input type="text" pattern="[A-Za-z]+" placeholder="Enter base" v-model="base" required />
            <label>Target:</label>
            <input type="text" pattern="[A-Za-z]+" placeholder="Enter target" v-model="target" required />
            <label>Rate:</label>
            <input type="number" step="any" placeholder="Enter a rate" v-model="rate" required />
            <input type="submit" id="add" value="Add" @click="handleAdd" />
            <input type="submit" id="update" value="Update" @click="handleUpdate" />
        </form>
        <button type="submit" role="button" class="logoutbutton" value="Logout" @click="handleLogout">Logout</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            base: '',
            target: '',
            rate: '',
            username: '',
            password: '',
            returnUrl: '',
            error: '',
            loggedIn: false
        }
    },
    created() {
        // localStorage.removeItem('credentials');
        this.returnUrl = this.$route.query.returnUrl || '/';
    },
    mounted() {
        if (localStorage.credentials) {
            this.loggedIn = true
        }
    },
    methods: {
        handleLogin() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            };

            axios.post("http://localhost:8000/authenticate", {
                username: this.username,
                password: this.password
            })
            .then((response) => {
                alert("Login successful!")
                this.loggedIn = true
                localStorage.setItem('credentials', JSON.stringify(response.data));
            }, (error) => {
                alert("Login failed!")
                console.log(error);
            });
        },
        handleAdd() {
            const { username, password } = JSON.parse(localStorage.getItem('credentials'));
            axios.post("http://localhost:8000/exchangerates/", {
                base: this.base,
                target: this.target,
                rate: this.rate
            }, {
                auth: {
                    username: username,
                    password: password
                }
            })
                .then((response) => {
                    alert("Exchange rate created successfully!")
                    console.log(response);
                }, (error) => {
                    alert("This Exchange rate already exists!")
                    console.log(error);
                });

        },
        handleUpdate() {
            const { username, password } = JSON.parse(localStorage.getItem('credentials'));
            axios.patch("http://localhost:8000/exchangerates/" + this.base + "/" + this.target, {
                rate: this.rate
            }, {
                auth: {
                    username: username,
                    password: password
                }
            })
                .then((response) => {
                    response.data.changes ? alert("Exchange rate updated successfully!") : alert("This Exchange rate doesn't exist!")
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });

        },
        handleLogout() {
            localStorage.removeItem('credentials');
            this.loggedIn = false
            this.$router.push('/')
        }
    }
};
</script>


<style scoped>
form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
}

label {
    color: rgba(0, 0, 0, 0.712);
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 1.2em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}

input {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}
.logoutbutton {
  background-color: #111827;
  border: 1px solid transparent;
  border-radius: .75rem;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex: 0 0 auto;
  font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5rem;
  padding: .75rem 1.2rem;
  text-align: center;
  text-decoration: none #6B7280 solid;
  text-decoration-thickness: auto;
  transition-duration: .2s;
  transition-property: background-color,border-color,color,fill,stroke;
  transition-timing-function: cubic-bezier(.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
}

.button-40:hover {
  background-color: #374151;
}

.button-40:focus {
  box-shadow: none;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .button-40 {
    padding: .75rem 1.5rem;
  }
}
</style>
