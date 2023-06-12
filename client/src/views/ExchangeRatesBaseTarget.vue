<template>
  <div v-if="exchangerate">
    <form class="findexchangerate" @submit.prevent="handleSubmit">
      <label>Base:</label>
      <input type="text" pattern="[A-Za-z]+" :placeholder="exchangerate.base" v-model="userbase" required />
      <br>
      <label>Target:</label>
      <input type="text" pattern="[A-Za-z]+" :placeholder="exchangerate.target" v-model="usertarget" required />
      <br>
      <label>Rate:</label>
      <input type="number" step="any" :placeholder="exchangerate.rate" v-model="userrate" required readonly />
      <input type="submit" value="Select" />
    </form>
  </div>
  <div v-else>
    <p>Loading exchangerate...</p>
  </div>
</template>

<script>
export default {
  props: ["base", "target"],
  data() {
    return {
      exchangerate: null,
      userbase: '',
      usertarget: '',
      userrate: ''
    }
  },
  mounted() {
    fetch('http://localhost:8000/exchangerates/' + this.base + "/" + this.target)
      .then(res => res.json())
      .then(data => this.exchangerate = data.data)
      .catch(err => console.log(err.message))
  },
  methods: {
    handleSubmit() {
      fetch('http://localhost:8000/exchangerates/' + this.userbase + "/" + this.usertarget)
        .then(res => {
          if (res.ok) return res.json();
          else {
            alert("The exchange rate you selected doesn't exist!")
            return;
          }
        })
        .then(data => {
          if (data) {
            this.exchangerate = data.data
          }
          else return;
        })
        .catch(err => console.log(err.message))
    }
  }

}
</script>

<style scoped>
.findexchangerate {
  width: 850px;
  font-size: 1.2em;
  padding: 30px 30px 15px 30px;
}

.findexchangerate input[type=submit],
.findexchangerate input[type=text],
.findexchangerate label {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 1.2em;
  color: rgba(0, 0, 0, 0.774);

}

.findexchangerate label {
  display: block;
  margin-bottom: 7px;
}

.findexchangerate label>span {
  display: inline-block;
  width: 100px;
}

.findexchangerate input[type=text] {
  background: transparent;
  border: none;
  border-bottom: 1px dashed #83A4C5;
  width: 275px;
  outline: none;
  padding: 0px 0px 0px 0px;
  font-style: italic;
}


.findexchangerate input[type=text]:focus {
  border-bottom: 1px dashed #D9FFA9;
}

.findexchangerate input[type=submit] {
  border: none;
  padding: 8px 10px 8px 10px;
  border-radius: 5px;
}

.findexchangerate input[type=number] {
  border: none;
  padding: 8px 10px 8px 10px;
  border-radius: 5px;
  font-size: 1.4em;
}
</style>