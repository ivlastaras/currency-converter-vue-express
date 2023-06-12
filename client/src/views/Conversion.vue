<template>
    <form @submit.prevent="handleSubmit">
        <label>Base:</label>
        <input type="text" pattern="[A-Za-z]" placeholder="Enter base" required v-model="base" />
        <label>Target:</label>
        <input type="text" pattern="[A-Za-z]" placeholder="Enter target" required v-model="target" />
        <label>Amount:</label>
        <input type="number" placeholder="Enter an amount" required v-model="amount" />
        <input type="submit" value="Convert!" />
        <label>Result:</label>
        <input type="text" placeholder="Result" v-model="result" readonly />
    </form>
</template>

<script>

export default {
    data() {
        return {
            base: '',
            target: '',
            amount: '',
            result: '',
        }
    },
    methods: {
        handleSubmit() {
            fetch('http://localhost:8000/exchangerate/' + this.base + "/" + this.target)
                .then(res => res.json())
                .then(data => this.result = this.amount * data.data.rate)
                .catch(err => alert("The combination you entered doesn't exist!"))
        }
    }
}
</script>

<style>
form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
}

label {
    color: rgba(0, 0, 0, 0.658);
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
</style>